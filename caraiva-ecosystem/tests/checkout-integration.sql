-- Run against the configured project. Every fixture is rolled back; no mail or charge is sent.
begin;
create temporary table qa_context(key text primary key,value text);
grant select,insert,update on qa_context to authenticated;
do $$
declare owner_id uuid:=gen_random_uuid(); customer_id uuid:=gen_random_uuid(); outsider_id uuid:=gen_random_uuid(); prefix text:='qa-'||gen_random_uuid()::text; niche text; kind text;
begin
  insert into auth.users(id,email) values(owner_id,prefix||'-owner@example.invalid'),(customer_id,prefix||'-customer@example.invalid'),(outsider_id,prefix||'-outsider@example.invalid');
  insert into qa_context values('owner',owner_id::text),('customer',customer_id::text),('outsider',outsider_id::text),('prefix',prefix);
  foreach niche in array array['restaurante','mercado','farmacia','pousada','passeio','servico','loja','noite'] loop
    insert into public.cd_businesses(id,name,niche,published,accepting_orders,is_demo,delivery_fee_cents) values(prefix||'-'||niche,'QA · '||niche,niche,true,true,true,400);
    insert into public.cd_members(business_id,user_id,role) values(prefix||'-'||niche,owner_id,'owner');
    kind:=case niche when 'restaurante' then 'product' when 'mercado' then 'product' when 'farmacia' then 'product' when 'pousada' then 'room' when 'passeio' then 'tour' when 'servico' then 'service' when 'loja' then 'retail' else 'ticket' end;
    insert into public.cd_offerings(id,business_id,kind,name,price_cents,stock,capacity,duration_min) values(prefix||'-'||niche||'-item',prefix||'-'||niche,kind,'QA · oferta',1000,case when kind in ('product','retail') then 10 else null end,5,60);
  end loop;
  insert into public.cd_offerings(id,business_id,kind,name,price_cents,capacity) values(prefix||'-table',prefix||'-restaurante','table','QA · mesa',0,4);
  begin
    insert into public.cd_offerings(id,business_id,kind,name,price_cents) values(prefix||'-invalid',prefix||'-farmacia','room','QA inválido',100);
    raise exception 'QA: aceitou oferta incompatível';
  exception when others then if sqlerrm like 'QA:%' then raise;end if;end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select value from qa_context where key='customer'),true);
do $$
declare prefix text:=(select value from qa_context where key='prefix'); request_id uuid:=gen_random_uuid(); first_id uuid; next_id uuid; niche text; result_id uuid; start_time timestamptz:=now()+interval '3 days';
begin
  first_id:=public.cd_checkout(prefix||'-restaurante',request_id,'Cliente QA','{"type":"retirada"}',jsonb_build_array(jsonb_build_object('id',prefix||'-restaurante-item','quantity',2,'price_cents',1)));
  if (select total_cents from public.cd_orders where id=first_id)<>2000 then raise exception 'QA: preço veio do cliente';end if;
  if public.cd_checkout(prefix||'-restaurante',request_id,'Cliente QA','{"type":"retirada"}',jsonb_build_array(jsonb_build_object('id',prefix||'-restaurante-item','quantity',2)))<>first_id then raise exception 'QA: repetiu pedido';end if;
  if (select stock from public.cd_offerings where id=prefix||'-restaurante-item')<>8 then raise exception 'QA: estoque ou idempotência incorretos';end if;
  perform public.cd_cancel_order(first_id);perform public.cd_cancel_order(first_id);
  if (select stock from public.cd_offerings where id=prefix||'-restaurante-item')<>10 then raise exception 'QA: cancelamento não devolveu estoque uma única vez';end if;
  begin perform public.cd_checkout(prefix||'-restaurante',gen_random_uuid(),'Cliente QA','{"type":"entrega","detail":""}',jsonb_build_array(jsonb_build_object('id',prefix||'-restaurante-item','quantity',1)));raise exception 'QA: aceitou entrega sem endereço';exception when others then if sqlerrm like 'QA:%' then raise;end if;end;
  next_id:=public.cd_checkout(prefix||'-restaurante',gen_random_uuid(),'Cliente QA','{"type":"entrega","detail":"Rua de teste"}',jsonb_build_array(jsonb_build_object('id',prefix||'-restaurante-item','quantity',1)));
  if (select total_cents from public.cd_orders where id=next_id)<>1400 then raise exception 'QA: taxa de entrega incorreta';end if;
  insert into qa_context values('delivery',next_id::text);
  result_id:=public.cd_checkout(prefix||'-pousada',gen_random_uuid(),'Cliente QA','{"type":"reserva"}',jsonb_build_array(jsonb_build_object('id',prefix||'-pousada-item','quantity',3)),start_time,start_time+interval '2 days');
  if (select total_cents from public.cd_orders where id=result_id)<>2000 or (select quantity from public.cd_order_lines where order_id=result_id)<>2 then raise exception 'QA: diárias confundidas com hóspedes';end if;
  begin perform public.cd_checkout(prefix||'-pousada',gen_random_uuid(),'Cliente QA','{"type":"reserva"}',jsonb_build_array(jsonb_build_object('id',prefix||'-pousada-item','quantity',1)),start_time,start_time+interval '1 day');raise exception 'QA: aceitou sobreposição';exception when others then if sqlerrm like 'QA:%' then raise;end if;end;
  perform public.cd_cancel_order(result_id);
  foreach niche in array array['passeio','servico','noite','loja','mercado','farmacia'] loop
    result_id:=public.cd_checkout(prefix||'-'||niche,gen_random_uuid(),'Cliente QA',case when niche in ('loja','mercado','farmacia') then '{"type":"retirada"}'::jsonb else '{"type":"reserva"}'::jsonb end,jsonb_build_array(jsonb_build_object('id',prefix||'-'||niche||'-item','quantity',1)),case when niche in ('loja','mercado','farmacia') then null else start_time end);
    if (select total_cents from public.cd_orders where id=result_id)<>1000 then raise exception 'QA: checkout de % incorreto',niche;end if;
    if niche='passeio' then insert into qa_context values('tour',result_id::text);end if;
  end loop;
  result_id:=public.cd_checkout(prefix||'-restaurante',gen_random_uuid(),'Cliente QA','{"type":"reserva"}',jsonb_build_array(jsonb_build_object('id',prefix||'-table','quantity',2)),start_time);
  insert into qa_context values('table',result_id::text);
  begin perform public.cd_set_order_status(next_id,'preparando');raise exception 'QA: cliente alterou status comercial';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',(select value from qa_context where key='outsider'),true);
do $$
declare prefix text:=(select value from qa_context where key='prefix');
begin
  if exists(select 1 from public.cd_orders) then raise exception 'QA: usuário acessou pedidos de outra conta';end if;
  begin perform public.cd_cancel_order((select value::uuid from qa_context where key='delivery'));raise exception 'QA: cancelou pedido alheio';exception when insufficient_privilege then null;end;
  perform public.cd_checkout(prefix||'-pousada',gen_random_uuid(),'Outro cliente QA','{"type":"reserva"}',jsonb_build_array(jsonb_build_object('id',prefix||'-pousada-item','quantity',1)),now()+interval '3 days',now()+interval '4 days');
end $$;
select set_config('request.jwt.claim.sub',(select value from qa_context where key='owner'),true);
do $$
declare delivery_id uuid:=(select value::uuid from qa_context where key='delivery'); table_id uuid:=(select value::uuid from qa_context where key='table'); tour_id uuid:=(select value::uuid from qa_context where key='tour'); booking_id uuid;
begin
  if (select count(*) from public.cd_orders)<>11 then raise exception 'QA: Business não recebeu todos os nichos';end if;
  perform public.cd_set_order_status(delivery_id,'preparando');perform public.cd_set_order_status(delivery_id,'em_rota');perform public.cd_set_order_status(delivery_id,'entregue');
  if (select payment_status from public.cd_orders where id=delivery_id)<>'pending' then raise exception 'QA: simulou confirmação de pagamento';end if;
  perform public.cd_set_order_status(table_id,'preparando');
  begin perform public.cd_set_order_status(table_id,'em_rota');raise exception 'QA: reserva saiu para entrega';exception when others then if sqlerrm like 'QA:%' then raise;end if;end;
  select id into booking_id from public.cd_bookings where order_id=table_id;
  perform public.cd_check_in(booking_id);perform public.cd_set_order_status(table_id,'entregue');
  perform public.cd_set_order_status(tour_id,'preparando');
  select id into booking_id from public.cd_bookings where order_id=tour_id;
  begin perform public.cd_check_in(booking_id);raise exception 'QA: liberou check-in sem pagamento';exception when others then if sqlerrm like 'QA:%' then raise;end if;end;
  begin update public.cd_orders set payment_status='paid' where id=tour_id;raise exception 'QA: lojista marcou cobrança paga';exception when insufficient_privilege then null;end;
end $$;
reset role;
do $$begin if has_function_privilege('anon','public.cd_checkout(text,uuid,text,jsonb,jsonb,timestamptz,timestamptz)','EXECUTE') or has_function_privilege('anon','public.cd_cancel_order(uuid)','EXECUTE') then raise exception 'QA: RPC disponível sem login';end if;end $$;
rollback;
select 'PASS: 8 nichos, idempotência, estoque, taxas, diárias, conflitos, cancelamento, isolamento, status e check-in; fixtures revertidos' as result;
