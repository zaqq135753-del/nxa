create or replace function caraiva_private.checkout(p_business text,p_request uuid,p_name text,p_destination jsonb,p_lines jsonb,p_starts timestamptz,p_ends timestamptz)
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
      if v_qty>v_item.capacity then raise exception 'Quantidade acima da capacidade'; end if;
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
