create schema if not exists caraiva_private;
revoke all on schema caraiva_private from public;
grant usage on schema caraiva_private to authenticated;

create table public.cd_businesses (
  id text primary key,
  name text not null,
  niche text not null check (niche in ('restaurante','mercado','farmacia','pousada','passeio','servico','loja','noite')),
  published boolean not null default false,
  accepting_orders boolean not null default false,
  is_demo boolean not null default false,
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  profile jsonb not null default '{}' check (jsonb_typeof(profile) = 'object'),
  created_at timestamptz not null default now()
);
create table public.cd_members (
  business_id text not null references public.cd_businesses(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','manager','staff')),
  primary key (business_id,user_id)
);
create index cd_members_user_idx on public.cd_members(user_id,business_id);

create table public.cd_offerings (
  id text primary key,
  business_id text not null references public.cd_businesses(id),
  kind text not null check (kind in ('product','retail','room','tour','service','table','ticket')),
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  stock integer check (stock >= 0),
  capacity integer not null default 1 check (capacity > 0),
  duration_min integer not null default 60 check (duration_min between 1 and 10080),
  available boolean not null default true,
  details jsonb not null default '{}' check (jsonb_typeof(details) = 'object'),
  unique (id,business_id)
);
create index cd_offerings_business_idx on public.cd_offerings(business_id,kind);

create table public.cd_orders (
  id uuid primary key default gen_random_uuid(),
  business_id text not null references public.cd_businesses(id),
  customer_id uuid not null references auth.users(id),
  request_id uuid not null,
  customer_name text not null check (length(customer_name) between 1 and 120),
  destination jsonb not null default '{}' check (jsonb_typeof(destination) = 'object'),
  status text not null default 'novo' check (status in ('novo','preparando','em_rota','entregue','recusado','cancelado')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  total_cents integer not null check (total_cents >= 0),
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  created_at timestamptz not null default now(),
  unique (customer_id,request_id), unique (id,business_id)
);
create index cd_orders_business_time_idx on public.cd_orders(business_id,created_at desc);
create index cd_orders_customer_time_idx on public.cd_orders(customer_id,created_at desc);
create table public.cd_order_lines (
  order_id uuid not null references public.cd_orders(id),
  offering_id text not null references public.cd_offerings(id),
  name text not null,
  quantity integer not null check (quantity between 1 and 99),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  primary key(order_id,offering_id)
);
create index cd_order_lines_offering_idx on public.cd_order_lines(offering_id);
create table public.cd_bookings (
  id uuid primary key default gen_random_uuid(),
  business_id text not null references public.cd_businesses(id),
  order_id uuid not null,
  offering_id text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  seats integer not null check (seats between 1 and 99),
  checked_in_at timestamptz,
  foreign key (order_id,business_id) references public.cd_orders(id,business_id),
  foreign key (offering_id,business_id) references public.cd_offerings(id,business_id),
  check (ends_at > starts_at), unique(order_id)
);
create index cd_bookings_offering_time_idx on public.cd_bookings(offering_id,starts_at,ends_at);
create index cd_bookings_business_idx on public.cd_bookings(business_id);

alter table public.cd_businesses enable row level security;
alter table public.cd_members enable row level security;
alter table public.cd_offerings enable row level security;
alter table public.cd_orders enable row level security;
alter table public.cd_order_lines enable row level security;
alter table public.cd_bookings enable row level security;
revoke all on public.cd_businesses,public.cd_members,public.cd_offerings,public.cd_orders,public.cd_order_lines,public.cd_bookings from anon,authenticated;
grant select on public.cd_businesses,public.cd_offerings to anon,authenticated;
grant select on public.cd_members,public.cd_orders,public.cd_order_lines,public.cd_bookings to authenticated;
grant insert,update on public.cd_offerings to authenticated;
create policy members_read_own on public.cd_members for select to authenticated using (user_id=(select auth.uid()));
create policy businesses_read on public.cd_businesses for select to anon,authenticated using (published or exists(select 1 from public.cd_members m where m.business_id=id and m.user_id=(select auth.uid())));
create policy offerings_read on public.cd_offerings for select to anon,authenticated using (exists(select 1 from public.cd_businesses b where b.id=business_id and b.published) or exists(select 1 from public.cd_members m where m.business_id=cd_offerings.business_id and m.user_id=(select auth.uid())));
create policy offerings_insert on public.cd_offerings for insert to authenticated with check (exists(select 1 from public.cd_members m where m.business_id=cd_offerings.business_id and m.user_id=(select auth.uid()) and m.role in ('owner','manager')));
create policy offerings_update on public.cd_offerings for update to authenticated using (exists(select 1 from public.cd_members m where m.business_id=cd_offerings.business_id and m.user_id=(select auth.uid()) and m.role in ('owner','manager'))) with check (exists(select 1 from public.cd_members m where m.business_id=cd_offerings.business_id and m.user_id=(select auth.uid()) and m.role in ('owner','manager')));
create policy orders_read on public.cd_orders for select to authenticated using (customer_id=(select auth.uid()) or exists(select 1 from public.cd_members m where m.business_id=cd_orders.business_id and m.user_id=(select auth.uid())));
create policy lines_read on public.cd_order_lines for select to authenticated using (exists(select 1 from public.cd_orders o where o.id=order_id));
create policy bookings_read on public.cd_bookings for select to authenticated using (exists(select 1 from public.cd_orders o where o.id=order_id));

-- Privileged atomic checkout: only authenticated callers, prices never accepted from clients.
create function caraiva_private.checkout(p_business text,p_request uuid,p_name text,p_destination jsonb,p_lines jsonb,p_starts timestamptz,p_ends timestamptz)
returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_uid uuid := auth.uid(); v_business public.cd_businesses; v_item public.cd_offerings;
  v_order uuid; v_line jsonb; v_qty integer; v_subtotal bigint := 0; v_fee integer;
  v_booking boolean := false; v_units integer; v_end timestamptz; v_occupied integer;
begin
  if v_uid is null then raise exception 'Entre na sua conta para continuar' using errcode='28000'; end if;
  -- Serialize each customer's retries and rate limit; row locks below serialize inventory.
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text,0));
  select id into v_order from public.cd_orders where customer_id=v_uid and request_id=p_request;
  if found then return v_order; end if;
  if (select count(*) from public.cd_orders where customer_id=v_uid and created_at>now()-interval '1 minute') >= 10 then raise exception 'Aguarde antes de tentar novamente'; end if;
  select * into v_business from public.cd_businesses where id=p_business;
  if not found or not v_business.published or not v_business.accepting_orders then raise exception 'Este negócio ainda não recebe pedidos pelo aplicativo'; end if;
  if p_request is null or p_name is null or length(trim(p_name)) not between 1 and 120 or p_destination is null or jsonb_typeof(p_destination)<>'object' or octet_length(p_destination::text)>4000 then raise exception 'Dados do pedido inválidos'; end if;
  if p_lines is null or jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines) not between 1 and 50 then raise exception 'Sacola inválida'; end if;
  if (select count(distinct x->>'id') from jsonb_array_elements(p_lines) x) <> jsonb_array_length(p_lines) then raise exception 'Itens duplicados'; end if;
  v_fee := case when p_destination->>'type'='retirada' then 0 else v_business.delivery_fee_cents end;
  for v_line in select value from jsonb_array_elements(p_lines) order by value->>'id' loop
    v_qty := (v_line->>'quantity')::integer;
    if v_qty is null or v_qty not between 1 and 99 then raise exception 'Quantidade inválida'; end if;
    select * into v_item from public.cd_offerings where id=v_line->>'id' and business_id=p_business for update;
    if not found or not v_item.available then raise exception 'Item indisponível'; end if;
    if v_item.kind in ('product','retail') then
      if v_item.stock is not null and v_item.stock<v_qty then raise exception 'Estoque insuficiente'; end if;
      update public.cd_offerings set stock=stock-v_qty where id=v_item.id and stock is not null;
      v_units := v_qty;
    else
      if jsonb_array_length(p_lines)<>1 then raise exception 'Reserve um serviço por vez'; end if;
      if p_starts is null or p_starts<now() then raise exception 'Escolha uma data futura'; end if;
      v_booking := true;
      if v_item.kind='room' then
        if p_ends is null or p_ends<=p_starts or p_ends>p_starts+interval '90 days' or v_qty>v_item.capacity then raise exception 'Período ou hóspedes inválidos'; end if;
        v_end := p_ends; v_units := ceil(extract(epoch from (p_ends-p_starts))/86400)::integer;
      else
        v_end := p_starts+make_interval(mins=>v_item.duration_min); v_units := v_qty;
      end if;
      select coalesce(sum(case when v_item.kind in ('room','service') then 1 else b.seats end),0)::integer into v_occupied
      from public.cd_bookings b join public.cd_orders o on o.id=b.order_id
      where b.offering_id=v_item.id and o.status not in ('recusado','cancelado') and o.payment_status not in ('failed','refunded') and b.starts_at<v_end and b.ends_at>p_starts;
      if (v_item.kind in ('room','service') and v_occupied>0) or (v_item.kind not in ('room','service') and v_occupied+v_qty>v_item.capacity) then raise exception 'Sem disponibilidade neste horário'; end if;
      v_fee := 0;
    end if;
    v_subtotal := v_subtotal+v_item.price_cents::bigint*v_units;
  end loop;
  if v_subtotal+v_fee>2147483647 then raise exception 'Valor fora do limite'; end if;
  insert into public.cd_orders(business_id,customer_id,request_id,customer_name,destination,total_cents,delivery_fee_cents)
  values(p_business,v_uid,p_request,trim(p_name),p_destination,v_subtotal+v_fee,v_fee) returning id into v_order;
  for v_line in select value from jsonb_array_elements(p_lines) loop
    select * into v_item from public.cd_offerings where id=v_line->>'id';
    insert into public.cd_order_lines(order_id,offering_id,name,quantity,unit_price_cents) values(v_order,v_item.id,v_item.name,(v_line->>'quantity')::integer,v_item.price_cents);
    if v_booking then insert into public.cd_bookings(business_id,order_id,offering_id,starts_at,ends_at,seats) values(p_business,v_order,v_item.id,p_starts,v_end,(v_line->>'quantity')::integer); end if;
  end loop;
  return v_order;
end $$;
revoke all on function caraiva_private.checkout(text,uuid,text,jsonb,jsonb,timestamptz,timestamptz) from public,anon;
grant execute on function caraiva_private.checkout(text,uuid,text,jsonb,jsonb,timestamptz,timestamptz) to authenticated;
create function public.cd_checkout(p_business text,p_request uuid,p_name text,p_destination jsonb,p_lines jsonb,p_starts timestamptz default null,p_ends timestamptz default null)
returns uuid language sql security invoker set search_path='' as $$ select caraiva_private.checkout(p_business,p_request,p_name,p_destination,p_lines,p_starts,p_ends); $$;
revoke all on function public.cd_checkout(text,uuid,text,jsonb,jsonb,timestamptz,timestamptz) from public,anon;
grant execute on function public.cd_checkout(text,uuid,text,jsonb,jsonb,timestamptz,timestamptz) to authenticated;

create function caraiva_private.set_order_status(p_order uuid,p_status text)
returns void language plpgsql security definer set search_path='' as $$
declare v_order public.cd_orders;
begin
  if auth.uid() is null then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into v_order from public.cd_orders where id=p_order for update;
  if not found or not exists(select 1 from public.cd_members where business_id=v_order.business_id and user_id=auth.uid()) then raise exception 'Não autorizado' using errcode='42501'; end if;
  if not ((v_order.status='novo' and p_status in ('preparando','recusado')) or (v_order.status='preparando' and p_status in ('em_rota','entregue')) or (v_order.status='em_rota' and p_status='entregue')) then raise exception 'Transição inválida'; end if;
  if p_status='recusado' then
    update public.cd_offerings f set stock=f.stock+l.quantity from public.cd_order_lines l where l.order_id=p_order and l.offering_id=f.id and f.kind in ('product','retail') and f.stock is not null;
  end if;
  update public.cd_orders set status=p_status where id=p_order;
end $$;
revoke all on function caraiva_private.set_order_status(uuid,text) from public,anon;
grant execute on function caraiva_private.set_order_status(uuid,text) to authenticated;
create function public.cd_set_order_status(p_order uuid,p_status text) returns void language sql security invoker set search_path='' as $$ select caraiva_private.set_order_status(p_order,p_status); $$;
revoke all on function public.cd_set_order_status(uuid,text) from public,anon;
grant execute on function public.cd_set_order_status(uuid,text) to authenticated;

alter publication supabase_realtime add table public.cd_orders,public.cd_order_lines,public.cd_bookings,public.cd_offerings;
