-- Run this once only if you already ran the original schema before this update.
-- Existing cards cannot be recovered because only their hash was retained; use the
-- administrator's Reissue action once per existing guest to replace those cards.
alter table public.qr_credentials add column if not exists token text;
create unique index if not exists qr_credentials_token_unique on public.qr_credentials(token) where token is not null;
