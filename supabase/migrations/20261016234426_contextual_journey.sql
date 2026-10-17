
create schema if not exists cd_private;
create table public.cd_trips (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 100), created_at timestamptz not null default now()
);
create table public.cd_trip_members (
 trip_id uuid not null references public.cd_trips(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, primary key(trip_id,user_id)
);
create table public.cd_trip_invites (
 trip_id uuid primary key references public.cd_trips(id) on delete cascade,
 token uuid not null unique default gen_random_uuid(), expires_at timestamptz not null default now()+interval '7 days'
);
create table public.cd_trip_items (
 id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.cd_trips(id) on delete cascade,
 added_by uuid not null default auth.uid() references auth.users(id), business_id text not null references public.cd_businesses(id),
 planned_at timestamptz, note text not null default '' check(length(note)<=500), unique(trip_id,business_id)
);
create table public.cd_trip_votes (
 item_id uuid not null references public.cd_trip_items(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id), primary key(item_id,user_id)
);
create table public.cd_service_requests (
 id uuid primary key default gen_random_uuid(), request_id uuid not null default gen_random_uuid(),
 business_id text not null references public.cd_businesses(id), customer_id uuid not null default auth.uid() references auth.users(id),
 kind text not null check(kind in ('limpeza','manutencao','informacao','atendimento')),
 detail text not null check(length(detail) between 5 and 1000),
 status text not null default 'novo' check(status in ('novo','em_atendimento','concluido','cancelado')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(customer_id,request_id)
);
create index cd_service_requests_business_idx on public.cd_service_requests(business_id,created_at desc);
create index cd_service_requests_customer_idx on public.cd_service_requests(customer_id,created_at desc);
create index cd_trip_members_user_idx on public.cd_trip_members(user_id,trip_id);
create function cd_private.trip_access(p_trip uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.cd_trips t where t.id=p_trip and t.owner_id=auth.uid())
 or exists(select 1 from public.cd_trip_members m where m.trip_id=p_trip and m.user_id=auth.uid());
$$;
revoke all on function cd_private.trip_access(uuid) from public;
grant usage on schema cd_private to authenticated;
grant execute on function cd_private.trip_access(uuid) to authenticated;
alter table public.cd_trips enable row level security;
alter table public.cd_trip_members enable row level security;
alter table public.cd_trip_invites enable row level security;
alter table public.cd_trip_items enable row level security;
alter table public.cd_trip_votes enable row level security;
alter table public.cd_service_requests enable row level security;
revoke all on public.cd_trips,public.cd_trip_members,public.cd_trip_invites,public.cd_trip_items,public.cd_trip_votes,public.cd_service_requests from anon,authenticated;
grant select,insert,update,delete on public.cd_trips to authenticated;
grant select,delete on public.cd_trip_members to authenticated;
grant select,insert,update,delete on public.cd_trip_invites to authenticated;
grant select,insert,update,delete on public.cd_trip_items to authenticated;
grant select,insert,delete on public.cd_trip_votes to authenticated;
grant select,insert on public.cd_service_requests to authenticated;
grant update(status,updated_at) on public.cd_service_requests to authenticated;
create policy trips_read on public.cd_trips for select to authenticated using(cd_private.trip_access(id));
create policy trips_create on public.cd_trips for insert to authenticated with check(owner_id=(select auth.uid()));
create policy trips_update on public.cd_trips for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy trips_delete on public.cd_trips for delete to authenticated using(owner_id=(select auth.uid()));
create policy members_read on public.cd_trip_members for select to authenticated using(cd_private.trip_access(trip_id));
create policy members_leave on public.cd_trip_members for delete to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.cd_trips t where t.id=trip_id and t.owner_id=(select auth.uid())));
create policy invites_owner on public.cd_trip_invites for all to authenticated using(exists(select 1 from public.cd_trips t where t.id=trip_id and t.owner_id=(select auth.uid()))) with check(exists(select 1 from public.cd_trips t where t.id=trip_id and t.owner_id=(select auth.uid())));
create policy items_read on public.cd_trip_items for select to authenticated using(cd_private.trip_access(trip_id));
create policy items_add on public.cd_trip_items for insert to authenticated with check(added_by=(select auth.uid()) and cd_private.trip_access(trip_id));
create policy items_update on public.cd_trip_items for update to authenticated using(added_by=(select auth.uid()) and cd_private.trip_access(trip_id)) with check(added_by=(select auth.uid()) and cd_private.trip_access(trip_id));
create policy items_delete on public.cd_trip_items for delete to authenticated using(cd_private.trip_access(trip_id) and (added_by=(select auth.uid()) or exists(select 1 from public.cd_trips t where t.id=trip_id and t.owner_id=(select auth.uid()))));
create policy votes_read on public.cd_trip_votes for select to authenticated using(exists(select 1 from public.cd_trip_items i where i.id=item_id and cd_private.trip_access(i.trip_id)));
create policy votes_add on public.cd_trip_votes for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.cd_trip_items i where i.id=item_id and cd_private.trip_access(i.trip_id)));
create policy votes_delete on public.cd_trip_votes for delete to authenticated using(user_id=(select auth.uid()));
create policy requests_read on public.cd_service_requests for select to authenticated using(customer_id=(select auth.uid()) or exists(select 1 from public.cd_members m where m.business_id=cd_service_requests.business_id and m.user_id=(select auth.uid())));
create policy requests_create on public.cd_service_requests for insert to authenticated with check(customer_id=(select auth.uid()) and status='novo' and exists(select 1 from public.cd_businesses b where b.id=business_id and b.published));
create policy requests_merchant_update on public.cd_service_requests for update to authenticated using(exists(select 1 from public.cd_members m where m.business_id=cd_service_requests.business_id and m.user_id=(select auth.uid()))) with check(exists(select 1 from public.cd_members m where m.business_id=cd_service_requests.business_id and m.user_id=(select auth.uid())));
create function public.cd_join_trip(p_token uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare v_trip uuid;
begin
 if auth.uid() is null then raise exception 'Entre para participar'; end if;
 select trip_id into v_trip from public.cd_trip_invites where token=p_token and expires_at>now();
 if v_trip is null then raise exception 'Convite inválido ou expirado'; end if;
 insert into public.cd_trip_members(trip_id,user_id) values(v_trip,auth.uid()) on conflict do nothing;
 return v_trip;
end;
$$;
revoke all on function public.cd_join_trip(uuid) from public,anon;
grant execute on function public.cd_join_trip(uuid) to authenticated;

