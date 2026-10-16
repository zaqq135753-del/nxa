-- Preparação para um projeto Supabase NOVO. Não executado nesta entrega.
-- Executar em ambiente de teste, revisar políticas e testar antes de produção.
begin;

create table public.merchant_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id),
  status text not null default 'draft' check (status in ('draft','submitted','changes_requested','approved','rejected')),
  business_name text not null default '',
  category text not null default 'lojas',
  contact_private jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(contact_private) = 'object'),
  check (jsonb_typeof(settings) = 'object')
);

create table public.merchant_members (
  business_id uuid not null,
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','manager','editor')),
  active boolean not null default true,
  primary key (business_id,user_id)
);

create table public.merchant_business_settings (
  id uuid primary key default gen_random_uuid(),
  application_id uuid unique references public.merchant_applications(id),
  settings jsonb not null default '{}'::jsonb,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.merchant_members add constraint merchant_members_business_fkey
  foreign key (business_id) references public.merchant_business_settings(id);

-- Só dados públicos aprovados. Contatos de acesso e rascunhos ficam fora desta tabela.
create table public.merchant_public_profiles (
  business_id uuid primary key references public.merchant_business_settings(id),
  slug text not null unique,
  profile jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  published_at timestamptz
);

-- Convites e auditoria não ficam expostos pela Data API.
create schema if not exists merchant_private;
revoke all on schema merchant_private from public, anon, authenticated;
create table merchant_private.invitations (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  application_id uuid references public.merchant_applications(id),
  business_id uuid references public.merchant_business_settings(id),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);
create table merchant_private.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  application_id uuid references public.merchant_applications(id),
  business_id uuid references public.merchant_business_settings(id),
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);
grant usage on schema merchant_private to service_role;
grant all on all tables in schema merchant_private to service_role;
grant usage, select on all sequences in schema merchant_private to service_role;

alter table public.merchant_applications enable row level security;
alter table public.merchant_members enable row level security;
alter table public.merchant_business_settings enable row level security;
alter table public.merchant_public_profiles enable row level security;
alter table merchant_private.invitations enable row level security;
alter table merchant_private.audit_log enable row level security;

revoke all on public.merchant_applications, public.merchant_members,
  public.merchant_business_settings, public.merchant_public_profiles from anon, authenticated;
grant select, insert on public.merchant_applications to authenticated;
grant update (business_name, category, contact_private, settings) on public.merchant_applications to authenticated;
grant select on public.merchant_members, public.merchant_business_settings to authenticated;
grant select on public.merchant_public_profiles to anon, authenticated;

create policy applicant_reads_own on public.merchant_applications for select to authenticated
  using (applicant_id = (select auth.uid()));
create policy applicant_creates_draft on public.merchant_applications for insert to authenticated
  with check (applicant_id = (select auth.uid()) and status = 'draft' and revision = 1);
create policy applicant_edits_draft on public.merchant_applications for update to authenticated
  using (applicant_id = (select auth.uid()) and status in ('draft','changes_requested'))
  with check (applicant_id = (select auth.uid()) and status in ('draft','changes_requested'));
create policy member_reads_own on public.merchant_members for select to authenticated
  using (user_id = (select auth.uid()));
create policy member_reads_settings on public.merchant_business_settings for select to authenticated
  using (exists (select 1 from public.merchant_members m where m.business_id = id
    and m.user_id = (select auth.uid()) and m.active));
create policy visitor_reads_published on public.merchant_public_profiles for select to anon, authenticated
  using (published);

-- Envio, aprovação, vínculo, publicação e auditoria são operações de backend.
-- Não existe política que permita ao candidato aprovar a si mesmo.
commit;
