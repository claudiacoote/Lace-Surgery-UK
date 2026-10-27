-- Run in the Supabase SQL editor. Never expose the service role key to browser code.
create table if not exists public.bookings (
 id uuid primary key default gen_random_uuid(),
 reference text unique not null,
 name text not null,
 email text not null,
 service text not null check(service in ('small','medium','large')),
 price_gbp integer not null,
 details text not null,
 status text not null default 'requested' check(status in ('requested','approved','declined','awaiting_payment','paid','awaiting_arrival','received','in_progress','completed','dispatched')),
 inbound_tracking text,
 outbound_tracking text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
-- No public table policies: only the server-side service role may read/write.
