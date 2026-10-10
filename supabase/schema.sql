-- CoSh2026 VIP Smart Seating & Check-in System
-- Run once in the Supabase SQL Editor as the project owner.
create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'officer');
create type public.guest_status as enum ('not_checked_in', 'checked_in');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'officer',
  created_at timestamptz not null default now()
);

create table public.vip_guests (
  id uuid primary key default gen_random_uuid(),
  vip_id text not null unique default ('VIP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  designation text,
  photo_path text,
  table_number text not null check (char_length(trim(table_number)) between 1 and 32),
  seat_number text not null check (char_length(trim(seat_number)) between 1 and 32),
  email text,
  phone text,
  status public.guest_status not null default 'not_checked_in',
  first_checked_in_at timestamptz,
  first_checked_in_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
create unique index active_table_seat_unique on public.vip_guests(table_number, seat_number) where archived_at is null;
create index vip_guests_search_idx on public.vip_guests using gin (to_tsvector('simple', full_name || ' ' || vip_id));

create table public.qr_credentials (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null unique references public.vip_guests(id) on delete cascade,
  -- Stored in this private table so an administrator can re-download the same card.
  -- It is never sent to browsers except as the QR URL of an authorized card action.
  token text not null unique,
  token_hash text not null unique,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  regenerated_by uuid references public.profiles(id)
);

create table public.check_in_events (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.vip_guests(id) on delete cascade,
  officer_id uuid not null references public.profiles(id),
  event_type text not null check (event_type in ('first_check_in', 'reentry', 'correction')),
  created_at timestamptz not null default now(),
  note text
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  guest_id uuid references public.vip_guests(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.vip_guests enable row level security;
alter table public.qr_credentials enable row level security;
alter table public.check_in_events enable row level security;
alter table public.audit_events enable row level security;

create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "staff read safe guests" on public.vip_guests for select using (public.is_staff());
create policy "admins create guests" on public.vip_guests for insert with check (public.is_admin());
create policy "admins update guests" on public.vip_guests for update using (public.is_admin()) with check (public.is_admin());
create policy "admins archive guests" on public.vip_guests for delete using (public.is_admin());
create policy "admins manage credentials" on public.qr_credentials for all using (public.is_admin()) with check (public.is_admin());
create policy "staff view checkins" on public.check_in_events for select using (public.is_staff());
create policy "admins view audit" on public.audit_events for select using (public.is_admin());

-- Private guest photos: authenticated staff can display them; only admins manage uploads.
insert into storage.buckets (id, name, public) values ('guest-photos', 'guest-photos', false) on conflict (id) do nothing;
create policy "staff view photos" on storage.objects for select using (bucket_id = 'guest-photos' and public.is_staff());
create policy "admins upload photos" on storage.objects for insert with check (bucket_id = 'guest-photos' and public.is_admin());
create policy "admins update photos" on storage.objects for update using (bucket_id = 'guest-photos' and public.is_admin());
create policy "admins delete photos" on storage.objects for delete using (bucket_id = 'guest-photos' and public.is_admin());

-- Profiles are provisioned at sign-up, but must be promoted by the project owner using SQL.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'officer');
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Atomic first check-in: repeated simultaneous requests can never inflate attendance.
create or replace function public.confirm_check_in(p_guest_id uuid, p_note text default null)
returns public.vip_guests language plpgsql security definer set search_path = public as $$
declare v_guest public.vip_guests; v_event text;
begin
  if not public.is_staff() then raise exception 'Not authorized'; end if;
  select * into v_guest from public.vip_guests where id = p_guest_id and archived_at is null for update;
  if not found then raise exception 'Guest not found'; end if;
  if v_guest.status = 'not_checked_in' then
    update public.vip_guests set status = 'checked_in', first_checked_in_at = now(), first_checked_in_by = auth.uid(), updated_at = now()
      where id = p_guest_id returning * into v_guest;
    v_event := 'first_check_in';
  else
    v_event := 'reentry';
  end if;
  insert into public.check_in_events (guest_id, officer_id, event_type, note) values (p_guest_id, auth.uid(), v_event, p_note);
  insert into public.audit_events (actor_id, action, guest_id, details) values (auth.uid(), v_event, p_guest_id, jsonb_build_object('at', now()));
  return v_guest;
end;
$$;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger vip_guests_set_updated_at before update on public.vip_guests for each row execute procedure public.set_updated_at();
