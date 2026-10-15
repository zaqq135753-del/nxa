create table caraiva_private.admin_emails(email text primary key);
alter table caraiva_private.admin_emails enable row level security;
revoke all on caraiva_private.admin_emails from public,anon,authenticated;
create function caraiva_private.bind_confirmed_admin() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.email_confirmed_at is not null and exists(select 1 from caraiva_private.admin_emails where email=lower(new.email)) then
    insert into public.cd_members(business_id,user_id,role) select id,new.id,'owner' from public.cd_businesses on conflict(business_id,user_id) do nothing;
  end if;
  return new;
end $$;
revoke all on function caraiva_private.bind_confirmed_admin() from public,anon,authenticated;
create trigger bind_caraiva_confirmed_admin after insert or update of email_confirmed_at,email on auth.users for each row execute function caraiva_private.bind_confirmed_admin();
grant update(accepting_orders,delivery_fee_cents) on public.cd_businesses to authenticated;
create policy businesses_manage on public.cd_businesses for update to authenticated using(exists(select 1 from public.cd_members m where m.business_id=cd_businesses.id and m.user_id=(select auth.uid()) and m.role in ('owner','manager'))) with check(exists(select 1 from public.cd_members m where m.business_id=cd_businesses.id and m.user_id=(select auth.uid()) and m.role in ('owner','manager')));
create function caraiva_private.check_in(p_booking uuid) returns void language plpgsql security definer set search_path='' as $$
declare b public.cd_bookings; o public.cd_orders;
begin
  if auth.uid() is null then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into b from public.cd_bookings where id=p_booking for update;
  if not found or not exists(select 1 from public.cd_members where business_id=b.business_id and user_id=auth.uid()) then raise exception 'Não autorizado' using errcode='42501'; end if;
  select * into o from public.cd_orders where id=b.order_id;
  if b.checked_in_at is not null or o.status in ('recusado','cancelado') or (o.total_cents>0 and o.payment_status<>'paid') then raise exception 'Reserva não liberada para check-in'; end if;
  update public.cd_bookings set checked_in_at=now() where id=p_booking;
end $$;
revoke all on function caraiva_private.check_in(uuid) from public,anon;
grant execute on function caraiva_private.check_in(uuid) to authenticated;
create function public.cd_check_in(p_booking uuid) returns void language sql security invoker set search_path='' as $$select caraiva_private.check_in(p_booking);$$;
revoke all on function public.cd_check_in(uuid) from public,anon;
grant execute on function public.cd_check_in(uuid) to authenticated;
