create index cd_bookings_offering_business_idx on public.cd_bookings(offering_id,business_id);
create index cd_bookings_order_business_idx on public.cd_bookings(order_id,business_id);
alter publication supabase_realtime add table public.cd_businesses;
