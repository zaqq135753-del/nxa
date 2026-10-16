---
name: create-saas
description: >-
  Slash command workflow /create-saas: End-to-end autonomous SaaS inception, from requirements and data modeling to frontend, backend, auth, tests, and production validation.
---

# /create-saas Workflow

## Invocação
Digite `/create-saas` ou invoque esta skill quando iniciar uma nova aplicação SaaS completa do zero.

## Roteiro de Execução Passo a Passo
1. **Levantamento e Escopo:** Definir proposta de valor, persona, modelo multi-tenant e fluxos primários de usuário.
2. **Arquitetura e Stack:** Selecionar Next.js 14+ / React 19 + TypeScript + Tailwind + Supabase PostgreSQL.
3. **Modelagem de Dados e Segurança:**
   - Criar tabelas normalizadas com UUIDs.
   - Escrever políticas de RLS estritas com isolamento de tenant.
4. **Design System & UI:**
   - Estabelecer paleta Dark Luxury e tipografia refinada.
   - Configurar Shadcn UI e primitivas de layout responsivo.
5. **Implementação de Frontend & Telas:**
   - Construir autenticação, dashboard, telas de listagem, detalhes e configurações.
6. **Integração de Backend & Serviços:**
   - Conectar cliente Supabase autenticado, rotas de API seguras e webhooks de pagamento.
7. **Testes Automatizados & Hardening:**
   - Configurar Vitest para testes unitários e Playwright para o fluxo principal.
8. **Auditoria de Prontidão:**
   - Executar checklist `production-readiness` antes da entrega final.
