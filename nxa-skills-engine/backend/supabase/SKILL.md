---
name: supabase
description: >-
  Official Supabase engineering: PostgreSQL configuration, Row Level Security, Auth flows, Realtime subscriptions, Edge Functions, and Storage.
---

# Supabase Engineering Standards

## Diretrizes
- Uso do cliente oficial `@supabase/supabase-js` e `@supabase/ssr` para Next.js.
- Todas as tabelas protegidas com políticas RLS granulares por usuário e organização.
- Subscrições Realtime com filtros específicos de canal para prevenir tráfego excessivo.
