
begin;
insert into auth.users(id,email) values ('10000000-0000-4000-8000-000000000001','journey-owner@example.invalid'),('10000000-0000-4000-8000-000000000002','journey-guest@example.invalid'),('10000000-0000-4000-8000-000000000003','journey-outsider@example.invalid');
insert into cd_businesses(id,name,niche,published,accepting_orders,is_demo) values ('journey-test-inn','Test Inn','pousada',true,false,true);
insert into cd_members(business_id,user_id,role) values ('journey-test-inn','10000000-0000-4000-8000-000000000001','owner');
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
insert into cd_trips(id,owner_id,title) values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Test trip') returning id;
insert into cd_trip_invites(trip_id,token) values ('20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001');
insert into cd_trip_items(id,trip_id,business_id) values ('40000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','journey-test-inn');
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',true);
do $$begin if exists(select 1 from cd_trips) then raise exception 'outsider sees private trip'; end if; end$$;
select cd_join_trip('30000000-0000-4000-8000-000000000001');
insert into cd_trip_votes(item_id) values ('40000000-0000-4000-8000-000000000001');
insert into cd_service_requests(business_id,kind,detail) values ('journey-test-inn','limpeza','Solicitação de teste sem efeitos externos');
do $$begin
 if (select count(*) from cd_trip_items where trip_id='20000000-0000-4000-8000-000000000001')<>1 then raise exception 'member cannot read itinerary'; end if;
 if (select count(*) from cd_trip_invites)>0 then raise exception 'member sees owner invite'; end if;
 update cd_trips set title='hijacked' where id='20000000-0000-4000-8000-000000000001';
 if found then raise exception 'member changed owner trip'; end if;
 update cd_service_requests set status='concluido' where business_id='journey-test-inn';
 if found then raise exception 'customer changed merchant status'; end if;
end$$;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000003',true);
do $$begin
 if exists(select 1 from cd_service_requests) then raise exception 'third party sees private request'; end if;
 if exists(select 1 from cd_trip_items) then raise exception 'third party sees itinerary'; end if;
end$$;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
update cd_service_requests set status='em_atendimento' where business_id='journey-test-inn';
do $$begin if not exists(select 1 from cd_service_requests where business_id='journey-test-inn' and status='em_atendimento') then raise exception 'merchant update failed'; end if; end$$;
rollback;
select 'journey_rls_passed' as result;

