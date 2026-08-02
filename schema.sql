-- Run this in the Supabase SQL editor (project "ramz-db") after pulling this
-- change. Adds the product-QR table + scan-count function this app now runs
-- on, and a `plan` column on the existing merchant_tokens table. Safe to run
-- even if merchant_tokens/generated_codes already exist from the earlier
-- version — everything below uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

alter table merchant_tokens
  add column if not exists plan text not null default 'base'; -- 'base' | 'premium'

create table if not exists product_qrs (
  id text primary key, -- `${storeId}-${productId}`
  store_id text not null,
  product_id text not null,
  product_name text not null,
  product_url text not null,
  qr_data_url text not null,
  branded_qr_data_url text,
  scan_count integer not null default 0,
  created_at bigint not null,
  updated_at bigint not null
);

create index if not exists product_qrs_store_id_idx on product_qrs (store_id);

-- Called from the scan-redirect route (app/api/s/[code]/route.ts) so a scan
-- is a single atomic increment instead of a read-then-write race.
create or replace function increment_scan_count(row_id text)
returns void as $$
  update product_qrs set scan_count = scan_count + 1 where id = row_id;
$$ language sql;
