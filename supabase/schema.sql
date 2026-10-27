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

-- Create a private storage bucket for optional booking photographs.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('wig-photos','wig-photos',false,1048576,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create table if not exists public.booking_photos (
 id uuid primary key default gen_random_uuid(),
 reference text not null references public.bookings(reference) on delete cascade,
 storage_path text unique not null,
 created_at timestamptz not null default now()
);
alter table public.booking_photos enable row level security;
-- No public policies; uploaded images remain private.
