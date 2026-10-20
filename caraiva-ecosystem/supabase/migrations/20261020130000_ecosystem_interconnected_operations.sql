-- Ecosystem Interconnected Operations: Realtime, PIN security, TapTable tables and Riders
-- Migration: 20261020130000_ecosystem_interconnected_operations.sql

-- 1. Add PIN and Courier metadata to cd_orders if not present
alter table public.cd_orders add column if not exists delivery_pin text check (delivery_pin is null or length(delivery_pin) between 4 and 6);
alter table public.cd_orders add column if not exists courier_id text;
alter table public.cd_orders add column if not exists courier_name text;
alter table public.cd_orders add column if not exists courier_modal text check (courier_modal is null or courier_modal in ('a_pe','bike_eletrica','canoa_rio','buggy'));

-- 2. Riders table for sand-path delivery and river crossing dispatch
create table if not exists public.cd_riders (
  id text primary key,
  name text not null,
  phone text not null,
  modal text not null default 'bike_eletrica' check (modal in ('a_pe','bike_eletrica','canoa_rio','buggy')),
  is_online boolean not null default false,
  current_zone text not null default 'vila_central',
  current_lat double precision,
  current_lng double precision,
  rating numeric(3,2) not null default 5.00 check (rating between 1.00 and 5.00),
  active_order_id uuid references public.cd_orders(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.cd_riders enable row level security;
revoke all on public.cd_riders from anon, authenticated;
grant select on public.cd_riders to anon, authenticated;
grant insert, update on public.cd_riders to authenticated;

create policy riders_public_read on public.cd_riders for select to anon, authenticated using (true);
create policy riders_manage_own on public.cd_riders for update to authenticated using (id = auth.uid()::text or exists (
  select 1 from public.cd_members m where m.user_id = auth.uid() and m.role in ('owner','manager')
));

-- 3. TapTable Smart Tables & Comandas
create table if not exists public.cd_tables (
  id text primary key,
  business_id text not null references public.cd_businesses(id) on delete cascade,
  table_number integer not null check (table_number > 0),
  zone text not null default 'Salão',
  status text not null default 'livre' check (status in ('livre','ocupada','em_fechamento','paga')),
  waiter_name text,
  active_order_id uuid references public.cd_orders(id) on delete set null,
  active_guests_count integer not null default 0 check (active_guests_count >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  total_paid_cents integer not null default 0 check (total_paid_cents >= 0),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (business_id, table_number)
);

create index if not exists cd_tables_business_idx on public.cd_tables(business_id, status);

alter table public.cd_tables enable row level security;
revoke all on public.cd_tables from anon, authenticated;
grant select on public.cd_tables to anon, authenticated;
grant insert, update, delete on public.cd_tables to authenticated;

create policy tables_public_read on public.cd_tables for select to anon, authenticated using (
  exists (select 1 from public.cd_businesses b where b.id = business_id and b.published)
  or exists (select 1 from public.cd_members m where m.business_id = cd_tables.business_id and m.user_id = auth.uid())
);

create policy tables_manage on public.cd_tables for all to authenticated using (
  exists (select 1 from public.cd_members m where m.business_id = cd_tables.business_id and m.user_id = auth.uid() and m.role in ('owner','manager'))
);

-- 4. Supabase Realtime Publication Registration (Safe Block)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.cd_orders;
    exception when others then null;
    end;
    begin
      alter publication supabase_realtime add table public.cd_bookings;
    exception when others then null;
    end;
    begin
      alter publication supabase_realtime add table public.cd_riders;
    exception when others then null;
    end;
    begin
      alter publication supabase_realtime add table public.cd_tables;
    exception when others then null;
    end;
  end if;
end $$;
