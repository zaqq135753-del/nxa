-- Shared checkout: authoritative totals, niche validation and reversible pending requests.
create function caraiva_private.validate_offering() returns trigger
language plpgsql security definer set search_path='' as $$
declare niche text;
begin
  select b.niche into niche from public.cd_businesses b where b.id=new.business_id;
  if not ((niche='restaurante' and new.kind in ('product','table')) or (niche in ('mercado','farmacia') and new.kind='product') or (niche='pousada' and new.kind='room') or (niche='passeio' and new.kind='tour') or (niche='servico' and new.kind='service') or (niche='loja' and new.kind='retail') or (niche='noite' and new.kind in ('ticket','table','product'))) then raise exception 'Tipo de oferta incompatível com o negócio'; end if;
  if length(trim(new.name)) not between 1 and 160 or new.capacity>99 then raise exception 'Confira nome e capacidade da oferta'; end if;
  if tg_op='UPDATE' and (old.id<>new.id or old.business_id<>new.business_id or old.kind<>new.kind) then raise exception 'A identidade e o tipo da oferta não podem ser alterados'; end if;
  return new;
end $$;
revoke all on function caraiva_private.validate_offering() from public,anon,authenticated;
create trigger validate_cd_offering before insert or update on public.cd_offerings for each row execute function caraiva_private.validate_offering();

create or replace function caraiva_private.checkout(p_business text,p_request uuid,p_name text,p_destination jsonb,p_lines jsonb,p_starts timestamptz,p_ends timestamptz)
returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_uid uuid:=auth.uid(); v_business public.cd_businesses; v_item public.cd_offerings;
  v_order uuid; v_line jsonb; v_qty integer; v_subtotal bigint:=0; v_fee integer;
  v_booking boolean:=false; v_units integer; v_end timestamptz; v_occupied integer; v_destination jsonb;
begin
  if v_uid is null then raise exception 'Entre na sua conta para continuar' using errcode='28000'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text,0));
  select id into v_order from public.cd_orders where customer_id=v_uid and request_id=p_request;
  if found then return v_order; end if;
  if (select count(*) from public.cd_orders where customer_id=v_uid and created_at>now()-interval '1 minute')>=10 then raise exception 'Aguarde antes de tentar novamente'; end if;
  select * into v_business from public.cd_businesses where id=p_business;
  if not found or not v_business.published or not v_business.accepting_orders then raise exception 'Este negócio ainda não recebe pedidos pelo aplicativo'; end if;
  if p_request is null or p_name is null or length(trim(p_name)) not between 1 and 120 or p_destination is null or jsonb_typeof(p_destination)<>'object' or octet_length(p_destination::text)>4000 then raise exception 'Dados do pedido inválidos'; end if;
  if coalesce(p_destination->>'type','') not in ('retirada','entrega','reserva') or length(coalesce(p_destination->>'detail',''))>1000 or length(coalesce(p_destination->>'phone',''))>30 then raise exception 'Destino ou contato inválido'; end if;
  if p_lines is null or jsonb_typeof(p_lines)<>'array' or jsonb_array_length(p_lines) not between 1 and 50 then raise exception 'Sacola inválida'; end if;
  if (select count(distinct x->>'id') from jsonb_array_elements(p_lines) x)<>jsonb_array_length(p_lines) then raise exception 'Itens duplicados'; end if;
  v_fee:=case when p_destination->>'type'='entrega' then v_business.delivery_fee_cents else 0 end;
  v_destination:=jsonb_build_object('type',p_destination->>'type','detail',trim(coalesce(p_destination->>'detail','')),'phone',trim(coalesce(p_destination->>'phone','')));
  for v_line in select value from jsonb_array_elements(p_lines) order by value->>'id' loop
    v_qty:=(v_line->>'quantity')::integer;
    if v_qty is null or v_qty not between 1 and 99 then raise exception 'Quantidade inválida'; end if;
    select * into v_item from public.cd_offerings where id=v_line->>'id' and business_id=p_business for update;
    if not found or not v_item.available then raise exception 'Item indisponível'; end if;
    if v_item.kind in ('product','retail') then
      if p_destination->>'type'='reserva' then raise exception 'Escolha retirada ou entrega para produtos'; end if;
      if p_destination->>'type'='entrega' and length(trim(coalesce(p_destination->>'detail','')))=0 then raise exception 'Informe o endereço de entrega'; end if;
      if v_item.stock is not null and v_item.stock<v_qty then raise exception 'Estoque insuficiente'; end if;
      update public.cd_offerings set stock=stock-v_qty where id=v_item.id and stock is not null;
      v_units:=v_qty;
    else
      if jsonb_array_length(p_lines)<>1 then raise exception 'Reserve uma opção por vez'; end if;
      if p_starts is null or p_starts<now() then raise exception 'Escolha uma data futura'; end if;
      if p_destination->>'type'='entrega' then raise exception 'Reservas não usam entrega'; end if;
      v_booking:=true;
      if v_qty>v_item.capacity then raise exception 'Quantidade acima da capacidade'; end if;
      if v_item.kind='room' then
        if p_ends is null or p_ends<=p_starts or p_ends>p_starts+interval '90 days' then raise exception 'Período inválido'; end if;
        v_end:=p_ends;v_units:=ceil(extract(epoch from (p_ends-p_starts))/86400)::integer;
      else v_end:=p_starts+make_interval(mins=>v_item.duration_min);v_units:=v_qty;
      end if;
      select coalesce(sum(case when v_item.kind in ('room','service') then 1 else b.seats end),0)::integer into v_occupied
      from public.cd_bookings b join public.cd_orders o on o.id=b.order_id
      where b.offering_id=v_item.id and o.status not in ('recusado','cancelado') and o.payment_status not in ('failed','refunded') and b.starts_at<v_end and b.ends_at>p_starts;
      if (v_item.kind in ('room','service') and v_occupied>0) or (v_item.kind not in ('room','service') and v_occupied+v_qty>v_item.capacity) then raise exception 'Sem disponibilidade neste horário'; end if;
      v_fee:=0;v_destination:=jsonb_set(v_destination,'{type}','"reserva"'::jsonb);
    end if;
    v_subtotal:=v_subtotal+v_item.price_cents::bigint*v_units;
  end loop;
  if v_subtotal+v_fee>2147483647 then raise exception 'Valor fora do limite'; end if;
  insert into public.cd_orders(business_id,customer_id,request_id,customer_name,destination,total_cents,delivery_fee_cents) values(p_business,v_uid,p_request,trim(p_name),v_destination,v_subtotal+v_fee,v_fee) returning id into v_order;
  for v_line in select value from jsonb_array_elements(p_lines) loop
    select * into v_item from public.cd_offerings where id=v_line->>'id';
    v_units:=case when v_item.kind='room' then ceil(extract(epoch from (p_ends-p_starts))/86400)::integer else (v_line->>'quantity')::integer end;
    insert into public.cd_order_lines(order_id,offering_id,name,quantity,unit_price_cents) values(v_order,v_item.id,v_item.name,v_units,v_item.price_cents);
    if v_booking then insert into public.cd_bookings(business_id,order_id,offering_id,starts_at,ends_at,seats) values(p_business,v_order,v_item.id,p_starts,v_end,(v_line->>'quantity')::integer); end if;
  end loop;
  return v_order;
end $$;

create or replace function caraiva_private.set_order_status(p_order uuid,p_status text)
returns void language plpgsql security definer set search_path='' as $$
declare o public.cd_orders; booking boolean;
begin
  if auth.uid() is null then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into o from public.cd_orders where id=p_order for update;
  if not found or not exists(select 1 from public.cd_members where business_id=o.business_id and user_id=auth.uid()) then raise exception 'Não autorizado' using errcode='42501'; end if;
  select exists(select 1 from public.cd_bookings where order_id=p_order) into booking;
  if not ((o.status='novo' and p_status in ('preparando','recusado')) or (o.status='preparando' and p_status in ('em_rota','entregue','cancelado')) or (o.status='em_rota' and p_status='entregue')) then raise exception 'Transição inválida'; end if;
  if p_status='em_rota' and (booking or o.destination->>'type'<>'entrega') then raise exception 'Esta solicitação não é uma entrega'; end if;
  if p_status in ('recusado','cancelado') and o.payment_status not in ('pending','failed') then raise exception 'O pagamento precisa ser estornado antes do cancelamento'; end if;
  if p_status='entregue' and booking and o.total_cents>0 and o.payment_status<>'paid' then raise exception 'Pagamento ainda não confirmado'; end if;
  if p_status in ('recusado','cancelado') then
    update public.cd_offerings f set stock=f.stock+l.quantity from public.cd_order_lines l where l.order_id=p_order and l.offering_id=f.id and f.kind in ('product','retail') and f.stock is not null;
  end if;
  update public.cd_orders set status=p_status where id=p_order;
end $$;

create function caraiva_private.cancel_order(p_order uuid) returns void language plpgsql security definer set search_path='' as $$
declare o public.cd_orders;
begin
  if auth.uid() is null then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into o from public.cd_orders where id=p_order for update;
  if not found or o.customer_id<>auth.uid() then raise exception 'Não autorizado' using errcode='42501'; end if;
  if o.status='cancelado' then return; end if;
  if o.status<>'novo' or o.payment_status<>'pending' then raise exception 'A solicitação já está em atendimento e não pode ser cancelada por aqui'; end if;
  update public.cd_offerings f set stock=f.stock+l.quantity from public.cd_order_lines l where l.order_id=p_order and l.offering_id=f.id and f.kind in ('product','retail') and f.stock is not null;
  update public.cd_orders set status='cancelado' where id=p_order;
end $$;
revoke all on function caraiva_private.cancel_order(uuid) from public,anon;
grant execute on function caraiva_private.cancel_order(uuid) to authenticated;
create function public.cd_cancel_order(p_order uuid) returns void language sql security invoker set search_path='' as $$select caraiva_private.cancel_order(p_order);$$;
revoke all on function public.cd_cancel_order(uuid) from public,anon;
grant execute on function public.cd_cancel_order(uuid) to authenticated;

create or replace function caraiva_private.check_in(p_booking uuid) returns void language plpgsql security definer set search_path='' as $$
declare b public.cd_bookings; o public.cd_orders;
begin
  if auth.uid() is null then raise exception 'Não autorizado' using errcode='42501'; end if;
  select orders.* into o from public.cd_orders orders join public.cd_bookings bookings on bookings.order_id=orders.id where bookings.id=p_booking for update of orders;
  if not found or not exists(select 1 from public.cd_members where business_id=o.business_id and user_id=auth.uid()) then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into b from public.cd_bookings where id=p_booking for update;
  if b.checked_in_at is not null or o.status<>'preparando' or (o.total_cents>0 and o.payment_status<>'paid') then raise exception 'Reserva não liberada para check-in'; end if;
  update public.cd_bookings set checked_in_at=now() where id=p_booking;
end $$;

