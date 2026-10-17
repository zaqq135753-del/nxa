create schema if not exists caraiva_activation_private;
revoke all on schema caraiva_activation_private from public, anon;
grant usage on schema caraiva_activation_private to authenticated;
create table public.cd_activation_drafts (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=1000000),
  revision integer not null default 1,
  business_id text references public.cd_businesses(id),
  updated_at timestamptz not null default now()
);
alter table public.cd_activation_drafts enable row level security;
revoke all on public.cd_activation_drafts from anon, authenticated;
grant select on public.cd_activation_drafts to authenticated;
create policy activation_owner_read on public.cd_activation_drafts for select to authenticated using(owner_id=(select auth.uid()));

create or replace function caraiva_activation_private.cd_save_activation(p_id uuid, p_payload jsonb, p_revision integer)
returns integer language plpgsql security definer set search_path='' as $$
declare v_revision integer; v_owner uuid := auth.uid();
begin
  if v_owner is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Entre com sua conta para salvar.'; end if;
  if jsonb_typeof(p_payload) is distinct from 'object' or octet_length(p_payload::text)>1000000 or p_payload->>'id' is distinct from p_id::text or p_payload->>'version' is distinct from '1' then raise exception 'Rascunho inválido.'; end if;
  if p_revision=0 then
    if (select count(*) from public.cd_activation_drafts where owner_id=v_owner)>=10 then raise exception 'Limite de dez rascunhos por conta.'; end if;
    insert into public.cd_activation_drafts(id,owner_id,payload) values(p_id,v_owner,p_payload) returning revision into v_revision;
  else
    update public.cd_activation_drafts set payload=p_payload,revision=revision+1,updated_at=now()
    where id=p_id and owner_id=v_owner and revision=p_revision returning revision into v_revision;
    if not found then raise exception 'O rascunho mudou em outra aba. Reabra o link antes de continuar.'; end if;
  end if;
  return v_revision;
end $$;
revoke all on function caraiva_activation_private.cd_save_activation(uuid,jsonb,integer) from public, anon, authenticated;
grant execute on function caraiva_activation_private.cd_save_activation(uuid,jsonb,integer) to authenticated;
create function public.cd_save_activation(p_id uuid,p_payload jsonb,p_revision integer)
returns integer language sql security invoker set search_path='' as $$ select caraiva_activation_private.cd_save_activation(p_id,p_payload,p_revision); $$;
revoke all on function public.cd_save_activation(uuid,jsonb,integer) from public, anon;
grant execute on function public.cd_save_activation(uuid,jsonb,integer) to authenticated;

create function caraiva_activation_private.cd_activate_business(p_id uuid)
returns text language plpgsql security definer set search_path='' as $$
declare d public.cd_activation_drafts; v_id text; p jsonb;
begin
  if auth.uid() is null then raise exception 'Entre com sua conta.'; end if;
  select * into d from public.cd_activation_drafts where id=p_id and owner_id=auth.uid() for update;
  if not found then raise exception 'Rascunho indisponível para esta conta.'; end if;
  if d.business_id is not null then return d.business_id; end if;
  p:=d.payload;
  if length(trim(coalesce(p->>'name','')))<2 or length(p->>'name')>120 or length(trim(coalesce(p->>'ownerName','')))=0 or length(trim(coalesce(p->>'reference','')))=0 then raise exception 'Complete nome, responsável e localização.'; end if;
  if coalesce(p->>'niche','') not in ('restaurante','noite','pousada','passeio','mercado','farmacia','loja','servico') then raise exception 'Categoria inválida.'; end if;
  v_id:='cd-'||d.id::text;
  insert into public.cd_businesses(id,name,niche,published,accepting_orders,is_demo,profile)
  values(v_id,trim(p->>'name'),p->>'niche',false,false,false,jsonb_build_object('description',p->>'description','locationReference',p->>'reference','latitude',p->>'latitude','longitude',p->>'longitude','cover_image',p->>'cover','logo',p->>'logo','highlight',p->>'highlight','representation','concept'));
  insert into public.cd_members(business_id,user_id,role) values(v_id,auth.uid(),'owner');
  update public.cd_activation_drafts set business_id=v_id,updated_at=now() where id=d.id;
  return v_id;
end $$;
revoke all on function caraiva_activation_private.cd_activate_business(uuid) from public, anon, authenticated;
grant execute on function caraiva_activation_private.cd_activate_business(uuid) to authenticated;
create function public.cd_activate_business(p_id uuid) returns text language sql security invoker set search_path='' as $$ select caraiva_activation_private.cd_activate_business(p_id); $$;
revoke all on function public.cd_activate_business(uuid) from public, anon;
grant execute on function public.cd_activate_business(uuid) to authenticated;
