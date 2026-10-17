begin;
insert into auth.users(id,email) values
 ('a1710000-0000-4000-8000-000000000001','activation-owner@example.invalid'),
 ('a1710000-0000-4000-8000-000000000002','activation-other@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"a1710000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$
declare r integer; b text; repeated text;
begin
 r:=public.cd_save_activation('a1710000-0000-4000-8000-000000000003','{"version":1,"id":"a1710000-0000-4000-8000-000000000003","name":"Pousada Teste Rollback","niche":"pousada","ownerName":"Teste","reference":"Vila","step":3}',0);
 if r<>1 then raise exception 'revision failure'; end if;
 begin
   perform public.cd_save_activation('a1710000-0000-4000-8000-000000000003','{"version":1,"id":"a1710000-0000-4000-8000-000000000003"}',99);
   raise exception 'stale revision accepted';
 exception when others then if sqlerrm='stale revision accepted' then raise; end if; end;
 b:=public.cd_activate_business('a1710000-0000-4000-8000-000000000003');
 repeated:=public.cd_activate_business('a1710000-0000-4000-8000-000000000003');
 if b<>repeated then raise exception 'activation not idempotent'; end if;
 if not exists(select 1 from public.cd_members where business_id=b and user_id=auth.uid() and role='owner') then raise exception 'owner missing'; end if;
 if not exists(select 1 from public.cd_businesses where id=b and niche='pousada' and not published and not accepting_orders and not is_demo) then raise exception 'unsafe activation defaults'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"a1710000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.cd_activation_drafts) then raise exception 'draft leaked'; end if;
 if exists(select 1 from public.cd_businesses where id='cd-a1710000-0000-4000-8000-000000000003') then raise exception 'unpublished business leaked'; end if;
 begin
   perform public.cd_activate_business('a1710000-0000-4000-8000-000000000003');
   raise exception 'foreign activation accepted';
 exception when others then if sqlerrm='foreign activation accepted' then raise; end if; end;
 begin
   perform public.cd_save_activation('a1710000-0000-4000-8000-000000000003','{"version":1,"id":"a1710000-0000-4000-8000-000000000003"}',1);
   raise exception 'foreign update accepted';
 exception when others then if sqlerrm='foreign update accepted' then raise; end if; end;
 if has_table_privilege('authenticated','public.cd_activation_drafts','INSERT') then raise exception 'direct write grant'; end if;
 if has_function_privilege('anon','public.cd_activate_business(uuid)','EXECUTE') then raise exception 'anonymous activation grant'; end if;
end $$;
rollback;
