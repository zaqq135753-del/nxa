---
name: nxa-skill-orchestrator
description: >-
  Master orchestrator for the NXA Skills Engine. Analyzes requests, infers stack and complexity, selects only relevant skills, and resolves conflicting guidelines with strict priority.
---

# NXA Skill Orchestrator

## Objetivo e Escopo
O **NXA Skill Orchestrator** é o ponto focal de inteligência e despacho do ecossistema. Ele analisa as solicitações do usuário, decompondo-as em requisitos de arquitetura, stack tecnológico, complexidade visual, dependências de dados e rigor de segurança. Seleciona exclusivamente o conjunto mínimo suficiente de skills para resolver o problema, impedindo a poluição do context window do modelo.

## Condições de Ativação
- Ativado automaticamente no início de qualquer nova solicitação ou refatoração relevante de software.
- Invocado quando o usuário pedir criação de arquitetura, novo SaaS, refatoração ou planejamento multi-módulo.
- Ativado quando houver potenciais conflitos de diretrizes entre diferentes bibliotecas ou preferências estéticas.

## Condições de Não Ativação
- Tarefas atômicas e triviais de edição de linha única, correções ortográficas ou comandos shell imediatos.
- Consultas diretas sobre o funcionamento de uma única skill específica já ativa.

## Hierarquia Estrita de Resolução de Conflitos
Quando duas ou mais diretrizes colidirem durante a execução de uma tarefa, o agente DEVE aplicar a seguinte ordem decrescente de precedência:
1. **Segurança e Requisitos Explícitos do Usuário:** Proteção contra vulnerabilidades, integridade de dados e restrições mandatórias do cliente.
2. **Compatibilidade com o Projeto Existente:** Preservação de convenções, dependências instaladas e arquivos em produção sem regressões.
3. **Documentação Oficial da Stack Atual:** Práticas autoritativas de React 19, Next.js, Supabase, TypeScript etc.
4. **Regras de Arquitetura do Projeto:** Padrões descritos em `PROJECT_BRAIN.md` e `PROJECT_MEMORY.md`.
5. **Skills Especializadas:** Prescrições modulares de engenharia e performance do NXA.
6. **Preferências Visuais e Estilísticas:** Ajustes finos de animações, temas e polimento estético (sempre subordinados à performance e usabilidade).

## Matriz de Decisão e Despacho
O orquestrador analisa as 10 dimensões de cada solicitação:
1. **Tipo de Tarefa:** Green-field (novo projeto), Refatoração, Debugging, Otimização ou Auditoria.
2. **Stack do Projeto:** React, Next.js, Vite, Node/Fastify/Hono, Flutter.
3. **Linguagens:** TypeScript strict, SQL, GLSL, Dart.
4. **Complexidade:** Simples (1 arquivo), Média (módulo/componente), Alta (arquitetura multi-camada).
5. **Necessidade de UI/UX:** Design System, Shadcn, Tailwind, Acessibilidade WCAG.
6. **Necessidade de Animação:** Microinterações leves (Motion React), Scroll Complexo (GSAP) ou Vídeo Programático (Remotion).
7. **Necessidade de 3D:** Three.js / R3F apenas se estritamente justificável pelo produto; do contrário, usar SVG/CSS.
8. **Dependências de Backend:** Supabase (Auth, RLS, Realtime), PostgreSQL, APIs REST/tRPC.
9. **Riscos de Segurança:** Exposição de credenciais, injeção SQL, falta de RLS, CSRF/XSS.
10. **Testes Necessários:** Vitest (unit/integration), Playwright (E2E), Axe-core (a11y).

## Exemplo Canônico de Seleção
**Entrada:** *"Crie um dashboard SaaS premium com Supabase, gráficos animados e cards 3D."*
**Skills Selecionadas pelo Orquestrador:**
- `core/architecture` (Clean Architecture, separação de camadas)
- `frontend/react` (React 19, hooks modernos)
- `ui-ux/premium-saas` (Layout dark luxury, ergonomia visual)
- `ui-ux/design-system` (Tokens, Tailwind v4)
- `motion/motion-react` (Gráficos e contadores animados)
- `three-d/react-three-fiber` (Cards 3D com fallback seguro)
- `backend/supabase` (Autenticação e RLS no Postgres)
- `core/security` (Validação com Zod e sanitização)
- `quality/playwright` (Smoke test do fluxo crítico)

## Critérios de Aceitação
- Zero skills redundantes ou incompatíveis carregadas.
- Justificativa explícita de cada skill selecionada no plano do agente.
- Respeito integral à integridade do projeto alvo.
