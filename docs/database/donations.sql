create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  tier text not null,
  amount numeric(18, 6) not null,
  currency text not null default 'USDC',
  chain text not null,
  tx_hash text,
  payer_address text,
  receiver_address text not null,
  facilitator_response jsonb,
  status text not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint donations_amount_positive check (amount > 0),
  constraint donations_status_check check (status in ('pending', 'confirmed', 'failed'))
);

alter table public.donations enable row level security;

-- First version writes through the server-side Supabase service role only.
-- Do not add anon/authenticated policies until a public supporter list is needed.
grant select, insert, update on table public.donations to service_role;
