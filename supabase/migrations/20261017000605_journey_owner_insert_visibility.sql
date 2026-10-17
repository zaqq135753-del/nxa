alter policy trips_read on public.cd_trips using (owner_id=(select auth.uid()) or cd_private.trip_access(id));
