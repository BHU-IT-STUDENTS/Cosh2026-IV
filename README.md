# CoSh2026 VIP Smart Seating & Check-in System

An elegant, mobile-friendly VIP reception system for **Comfort Weds Shammah — 17 October 2026**. It uses Supabase (Postgres, Auth, private storage) and Next.js on Vercel.

## What is included

- Secure admin and protocol-officer roles
- VIP registration, photo uploads, table/seat conflict protection and duplicate-name warning
- Branded QR cards with the supplied wedding logo rendered as a circular seal
- Camera/manual QR check-in, re-entry recognition and audit trail
- Protected attendance and seating reports, CSV export and printable backup
- Token revocation/regeneration and server-side validation

## Free-tier suitability checked 10 October 2026

This is designed for the current free tiers, not a guarantee of future free use. Vercel Hobby is for personal, non-commercial projects; it includes a `*.vercel.app` address and finite function/transfer usage. Supabase Free currently includes a 500 MB database, 1 GB storage, 5 GB + 5 GB cached egress, 50,000 MAU, two active projects, and pauses an inactive project after one week. That is normally ample for a one-day wedding system, but upload modest photos and open the project in the week before the event. Check the current providers' dashboards before launch.

## Local setup

1. Create a free Supabase project. In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
2. Create a private Storage bucket named `guest-photos` (the policy is included in the SQL).
3. In Authentication > URL Configuration, add `http://localhost:3000` and your future `https://…vercel.app` URL as redirect URLs.
4. Copy `.env.example` to `.env.local` and supply the three Supabase values plus the app URL.
5. Install and run: `npm install`, then `npm run dev`.
6. Bootstrap the first administrator in Supabase Authentication (or create it through the SQL editor), then promote it using:
   ```sql
   update public.profiles set role = 'admin' where id = 'USER_UUID';
   ```
   There are no default passwords. After the first administrator signs in, create every further administrator and protocol-officer account from `/admin/staff`.

7. In **Supabase Dashboard > Authentication > Providers > Email**, turn off **Allow new users to sign up**. The login page intentionally has no registration option. This is essential: it prevents any person from creating an officer account outside the administrator-controlled staff screen.

## Deploy to Vercel free Hobby

1. Create a private GitHub repository and push this folder.
2. Import it in Vercel under your personal Hobby account; do not enable a paid trial or paid add-on.
3. Add all four values from `.env.local` in Vercel **Settings > Environment Variables**.
4. After Vercel assigns the free `*.vercel.app` URL, update `NEXT_PUBLIC_APP_URL` in Vercel and locally, then redeploy.
5. Add that exact HTTPS URL to Supabase Auth Redirect URLs and test `/login`, registration, generated card, QR verification and check-in on a phone.

No deployment has been made by this source package: it requires your Supabase and Vercel account access.

## Staff-account rules

- `/login` is sign-in only—there is no public registration.
- An administrator creates protocol officers and other administrators at `/admin/staff`; this server route uses the Supabase service-role key only on the server.
- Every user can update their own display name and password at `/account`. Passwords require at least 12 characters.
- Create the requested demo account only after you choose its email address and a unique password. Never use a published or shared default password for a live wedding deployment.

## Secret-file protection

`.env`, `.env.local`, Vercel files, private keys, certificates, service-account files, and Supabase local temporary files are ignored by Git. The tracked [`.env.example`](./.env.example) contains placeholders only.

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentionally browser-visible connection settings; Supabase protects data through RLS.
- `SUPABASE_SERVICE_ROLE_KEY` is a server secret. Keep it in `.env.local` locally and Vercel Production Environment Variables only. Never commit, share, or prefix it with `NEXT_PUBLIC_`.
- Before every push, run `git status` and confirm that `.env.local` is absent from the list of files to commit.

## Wedding-day protocol

1. Admin registers guests, confirms tables/seats, and downloads the **Backup report** shortly before the event.
2. Each protocol officer signs in and opens `/check-in` on a charged phone.
3. Scan or search, compare name/photo, then press **Confirm first check-in**. A second scan displays the original time and allows re-entry without increasing attendance.
4. If the network fails, use the printed/exported backup only; do not claim a QR was verified. Reconcile with the admin dashboard after connectivity returns.
5. Administrators can revoke/regenerate a compromised card from the guest table and review the audit trail in Supabase.

## Backup and recovery

The CSV/print backup is the operational fallback. Export guest/seating records immediately before the event and store an encrypted copy with the wedding coordinator. Supabase Free does not include automated backups: use the dashboard CSV export and periodically download the SQL/schema plus a guest export. Never share service-role keys.
