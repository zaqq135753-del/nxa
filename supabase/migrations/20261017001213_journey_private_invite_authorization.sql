alter function public.cd_join_trip(uuid) set schema cd_private;
create function public.cd_join_trip(p_token uuid) returns uuid language sql security invoker set search_path='' as $$ select cd_private.cd_join_trip(p_token); $$;
revoke all on function public.cd_join_trip(uuid) from public,anon;
grant execute on function public.cd_join_trip(uuid) to authenticated;
