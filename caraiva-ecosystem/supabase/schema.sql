-- Caraíva Digital · schema inicial (Supabase/Postgres)
-- Espelha src/lib/data.ts e src/lib/store.ts. Valores monetários em centavos.

create type niche as enum ('delivery', 'hospitality', 'tours', 'services', 'retail');
create type plan_id as enum ('essencial', 'pro', 'delivery');
create type order_status as enum ('novo', 'preparando', 'em_rota', 'entregue', 'recusado');
create type booking_kind as enum ('quarto', 'passeio', 'servico');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table establishments (
  id text primary key,
  owner_id uuid references auth.users not null,
  name text not null,
  niche niche not null,
  tagline text,
  zone text,
  plan plan_id not null default 'essencial',
  gateway_account_id text,          -- subconta Asaas/Pagar.me para split
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  establishment_id text references establishments on delete cascade,
  name text not null, category text, description text,
  price int not null check (price >= 0), stock int check (stock is null or stock >= 0),
  image text, emoji text, available boolean not null default true, tags text[] not null default '{}'
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  establishment_id text references establishments on delete cascade,
  name text not null, nightly int not null check (nightly >= 0), last_minute int check (last_minute is null or last_minute >= 0),
  capacity int not null default 2 check (capacity > 0), available boolean not null default true,
  amenities text[] not null default '{}', image text,
  ical_import_urls text[] default '{}',   -- links Airbnb/Booking
  ical_export_token text unique default encode(gen_random_bytes(16), 'hex')
);

create table room_blocks (                 -- resultado da sincronização iCal + reservas
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms on delete cascade,
  uid text not null, starts date not null, ends date not null,
  source text not null, summary text,
  unique (room_id, uid),
  check (ends > starts)
);

create table tours (
  id uuid primary key default gen_random_uuid(),
  establishment_id text references establishments on delete cascade,
  name text not null, departure time not null, meeting_point text,
  price_per_seat int not null check (price_per_seat >= 0), seats int not null check (seats >= 0),
  booked int not null default 0 check (booked >= 0), available boolean not null default true,
  tide_sensitive boolean not null default false, image text, tags text[] not null default '{}'
);

create table wellness_services (
  id uuid primary key default gen_random_uuid(),
  establishment_id text not null references establishments on delete cascade,
  name text not null, category text not null, description text not null default '',
  duration_min int not null check (duration_min > 0), price int not null check (price >= 0),
  deposit_required int not null default 0 check (deposit_required >= 0), image text
);

create table retail_items (
  id uuid primary key default gen_random_uuid(),
  establishment_id text not null references establishments on delete cascade,
  name text not null, category text not null, price int not null check (price >= 0),
  stock int not null default 0 check (stock >= 0), image text, available boolean not null default true
);

create table nfc_tags (
  id text primary key,                     -- gravado no chip: /tag/{id}
  establishment_id text references establishments,
  label text, delivery_address text
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  establishment_id text references establishments,
  customer_id uuid references auth.users,
  nfc_tag_id text references nfc_tags,     -- atribuição de afiliado
  items jsonb not null, address text, zone text,
  gross int, platform_fee int, courier_fee int, merchant_net int,
  status order_status default 'novo', eta_min int,
  payment_status payment_status not null default 'pending', payment_id text, paid_at timestamptz,
  created_at timestamptz default now()
);

create table bookings (
  id text primary key,                     -- código do voucher CD-XXXXX
  kind booking_kind not null, room_id uuid references rooms, tour_id uuid references tours,
  service_id uuid references wellness_services,
  customer_id uuid references auth.users, guest text,
  starts date not null, ends date, seats int,
  gross int, platform_fee int, merchant_net int,
  checked_in_at timestamptz, payment_status payment_status not null default 'pending', payment_id text, paid_at timestamptz,
  created_at timestamptz default now()
);

-- RLS fechado por padrão em todas as tabelas expostas pelo schema public.
alter table establishments enable row level security;
alter table products enable row level security;
alter table rooms enable row level security;
alter table room_blocks enable row level security;
alter table tours enable row level security;
alter table wellness_services enable row level security;
alter table retail_items enable row level security;
alter table nfc_tags enable row level security;
alter table orders enable row level security;
alter table bookings enable row level security;

drop policy if exists "establishment_owner_all" on establishments;
create policy "establishment_owner_all" on establishments
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "products_owner_all" on products;
create policy "products_owner_all" on products
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "rooms_owner_all" on rooms;
create policy "rooms_owner_all" on rooms
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "room_blocks_owner_all" on room_blocks;
create policy "room_blocks_owner_all" on room_blocks
  for all to authenticated
  using (exists (
    select 1 from rooms r join establishments e on e.id = r.establishment_id
    where r.id = room_id and e.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from rooms r join establishments e on e.id = r.establishment_id
    where r.id = room_id and e.owner_id = (select auth.uid())
  ));

drop policy if exists "tours_owner_all" on tours;
create policy "tours_owner_all" on tours
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "wellness_services_owner_all" on wellness_services;
create policy "wellness_services_owner_all" on wellness_services
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "retail_items_owner_all" on retail_items;
create policy "retail_items_owner_all" on retail_items
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "nfc_tags_owner_all" on nfc_tags;
create policy "nfc_tags_owner_all" on nfc_tags
  for all to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "orders_customer_read" on orders;
create policy "orders_customer_read" on orders
  for select to authenticated using (customer_id = (select auth.uid()));
drop policy if exists "orders_establishment_owner_read" on orders;
create policy "orders_establishment_owner_read" on orders
  for select to authenticated using (
    exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid()))
  );
drop policy if exists "orders_establishment_owner_update" on orders;
create policy "orders_establishment_owner_update" on orders
  for update to authenticated
  using (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())))
  with check (exists (select 1 from establishments e where e.id = establishment_id and e.owner_id = (select auth.uid())));

drop policy if exists "bookings_customer_read" on bookings;
create policy "bookings_customer_read" on bookings
  for select to authenticated using (customer_id = (select auth.uid()));
drop policy if exists "bookings_establishment_owner_read" on bookings;
create policy "bookings_establishment_owner_read" on bookings
  for select to authenticated using (
    (room_id is not null and exists (
      select 1 from rooms r join establishments e on e.id = r.establishment_id
      where r.id = room_id and e.owner_id = (select auth.uid())
    )) or
    (tour_id is not null and exists (
      select 1 from tours t join establishments e on e.id = t.establishment_id
      where t.id = tour_id and e.owner_id = (select auth.uid())
    )) or
    (service_id is not null and exists (
      select 1 from wellness_services s join establishments e on e.id = s.establishment_id
      where s.id = service_id and e.owner_id = (select auth.uid())
    ))
  );
drop policy if exists "bookings_establishment_owner_update" on bookings;
create policy "bookings_establishment_owner_update" on bookings
  for update to authenticated
  using (
    (room_id is not null and exists (
      select 1 from rooms r join establishments e on e.id = r.establishment_id
      where r.id = room_id and e.owner_id = (select auth.uid())
    )) or
    (tour_id is not null and exists (
      select 1 from tours t join establishments e on e.id = t.establishment_id
      where t.id = tour_id and e.owner_id = (select auth.uid())
    )) or
    (service_id is not null and exists (
      select 1 from wellness_services s join establishments e on e.id = s.establishment_id
      where s.id = service_id and e.owner_id = (select auth.uid())
    ))
  )
  with check (
    (room_id is not null and exists (
      select 1 from rooms r join establishments e on e.id = r.establishment_id
      where r.id = room_id and e.owner_id = (select auth.uid())
    )) or
    (tour_id is not null and exists (
      select 1 from tours t join establishments e on e.id = t.establishment_id
      where t.id = tour_id and e.owner_id = (select auth.uid())
    )) or
    (service_id is not null and exists (
      select 1 from wellness_services s join establishments e on e.id = s.establishment_id
      where s.id = service_id and e.owner_id = (select auth.uid())
    ))
  );

-- A operação autenticada pode ler seu inventário. Status operacional é editável pelo lojista,
-- mas valores e estado de pagamento ficam reservados ao backend/webhook.
revoke insert, update, delete on orders, bookings from anon, authenticated;
grant select on establishments, products, rooms, room_blocks, tours, wellness_services, retail_items, nfc_tags, orders, bookings to authenticated;
grant insert, update, delete on establishments, products, rooms, room_blocks, tours, wellness_services, retail_items, nfc_tags to authenticated;
grant update (status, eta_min) on orders to authenticated;
grant update (checked_in_at) on bookings to authenticated;

-- Criação de pedidos/reservas e confirmação de pagamento não é concedida a anon/authenticated.
-- O backend deverá persistir esses dados após validação da sessão e do webhook assinado.

alter publication supabase_realtime add table orders;
