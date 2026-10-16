---
name: saas-backend-architect
description: >-
  Production-grade SaaS backend engineering: Multi-tenancy, Row Level Security (RLS), Supabase, idempotent webhooks, Stripe billing, auditing, migrations, and zero credential leaks.
---

# SaaS Backend Architect

## Objetivo e Escopo
Fornece diretrizes e código de produção para o núcleo de servidores e bancos de dados de aplicações SaaS escaláveis. Cobre arquitetura multi-tenant, segurança em nível de linha (RLS), webhooks resilientes e infraestrutura de faturamento.

## Regras Inegociáveis de Engenharia
1. **Row Level Security (RLS) Mandatório:** Nenhuma tabela em banco de dados relacional (PostgreSQL/Supabase) pode ser criada sem RLS habilitado explicitamente.
2. **Isolamento Multi-Tenant:**
   - Toda consulta DEVE validar o identificador do tenant (`organization_id` ou `team_id`) através de claims JWT do usuário autenticado (`auth.uid()`), nunca confiando em parâmetros passados pelo corpo da requisição do cliente.
3. **Idempotência em Pagamentos e Webhooks:**
   - Webhooks do Stripe/Pix/Asaas devem gravar o `event_id` em tabela de controle (`webhook_events`) com constraint única antes de executar qualquer efeito colateral.
4. **Proteção Total contra Vazamento de Segredos:**
   - Nenhuma `service_role_key` do Supabase ou `STRIPE_SECRET_KEY` pode ser enviada ao cliente ou exposta em arquivos versionados. Uso exclusivo em rotas de backend ou Edge Functions protegidas.
