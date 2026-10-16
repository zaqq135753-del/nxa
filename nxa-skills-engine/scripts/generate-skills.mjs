import fs from 'fs';
import path from 'path';

console.log('Generating NXA Skills Engine definitions...');

const skills = [
  // ==========================================
  // FASE 5: ORQUESTRADOR INTELIGENTE
  // ==========================================
  {
    path: 'core/skill-orchestrator',
    name: 'nxa-skill-orchestrator',
    description: 'Master orchestrator for the NXA Skills Engine. Analyzes requests, infers stack and complexity, selects only relevant skills, and resolves conflicting guidelines with strict priority.',
    content: `# NXA Skill Orchestrator

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
4. **Regras de Arquitetura do Projeto:** Padrões descritos em \`PROJECT_BRAIN.md\` e \`PROJECT_MEMORY.md\`.
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
- \`core/architecture\` (Clean Architecture, separação de camadas)
- \`frontend/react\` (React 19, hooks modernos)
- \`ui-ux/premium-saas\` (Layout dark luxury, ergonomia visual)
- \`ui-ux/design-system\` (Tokens, Tailwind v4)
- \`motion/motion-react\` (Gráficos e contadores animados)
- \`three-d/react-three-fiber\` (Cards 3D com fallback seguro)
- \`backend/supabase\` (Autenticação e RLS no Postgres)
- \`core/security\` (Validação com Zod e sanitização)
- \`quality/playwright\` (Smoke test do fluxo crítico)

## Critérios de Aceitação
- Zero skills redundantes ou incompatíveis carregadas.
- Justificativa explícita de cada skill selecionada no plano do agente.
- Respeito integral à integridade do projeto alvo.`
  },

  // ==========================================
  // FASE 7: SKILLS PERSONALIZADAS SAAS PREMIUM
  // ==========================================
  {
    path: 'ui-ux/premium-saas',
    name: 'premium-saas-ui',
    description: 'Expert in high-end, premium SaaS user interfaces with refined typography, responsive layouts, purposeful micro-interactions, dark luxury ergonomics, and zero AI-slop visual clutter.',
    content: `# Premium SaaS UI

## Objetivo e Escopo
Esta skill rege a criação de interfaces SaaS de classe mundial. Seu princípio norteador é o **Dark Luxury & Ergonomia Profissional**: software que transmite sofisticação, precisão e sobriedade, sem cair na armadilha visual de "AI Slop" (gradientes caóticos, bordas neon despropositadas, glassmorphism excessivo ou 3D lento).

## Diretrizes de Design Dark Luxury
- **Paleta Oficial de Fundo e Camadas:**
  - Base Absoluta: \`#090B0C\` (profundidade sem ser preto puro chapado).
  - Camada de Cartão/Superfície: \`#141719\` com borda sutil \`rgba(255, 255, 255, 0.08)\`.
  - Acentos de Ouro Suave / Destaque: \`#F6C945\` ou âmbar quente calibrado.
  - Tipografia Principal: \`#FFF4ED\` (branco quente de altíssima legibilidade e contraste).
  - Texto Secundário: \`#8A949E\` (contraste mínimo WCAG AA garantido).
- **Tipografia e Hierarquia:**
  - Fontes recomendadas: Inter, Geist Sans, Plus Jakarta Sans ou Manrope.
  - Escala modular estrita: 12px (legenda), 14px (corpo secundário/tabelas), 16px (corpo principal), 20px (títulos de card), 28px/36px (título de página).
- **Densidade da Informação:**
  - Dashboards SaaS devem priorizar clareza de dados: gráficos nítidos, KPIs autoexplicativos, filtros rápidos e tabelas compactas com paginação e ordenação fluida.
- **Microinterações com Propósito:**
  - Feedback tátil em botões (escala 0.98 no clique ativo, transição de 120ms).
  - Hover states suaves com iluminação de borda (*subtle radial glow*).
  - Skeleton screens sob medida para todos os estados de carregamento.

## Anti-Padrões Proibidos
1. Não usar glassmorphism em superfícies de texto denso (prejudica a leitura).
2. Não usar animações que bloqueiem o fluxo de trabalho do usuário ou durem mais de 300ms.
3. Não criar cards sem contraste acessível (mínimo 4.5:1 para texto normal, 3:1 para elementos gráficos).
4. Não esconder ações primárias sob múltiplos menus suspensos.`
  },

  {
    path: 'motion/cinematic-experience',
    name: 'cinematic-experience',
    description: 'Creates immersive cinematic experiences: choreographed transitions, scroll storytelling, smooth parallax, custom camera moves, particles, and adaptive performance.',
    content: `# Cinematic Experience

## Objetivo e Escopo
Especializada em transformar landing pages, apresentações de produtos e transições de tela em experiências visuais memoráveis e fluidas a 60fps constantes. Coordena timelines complexas com GSAP ScrollTrigger, Motion React e shaders WebGL.

## Condições de Ativação
- Criação de landing pages cinematográficas, seções hero interativas, apresentações interativas de produtos ou narrativas por scroll.

## Princípios de Engenharia e Animação
- **Performance Adaptativa:**
  - Verificação de taxa de quadros e redução automática de partículas ou efeitos de blur caso o FPS caia abaixo de 45fps.
  - Respeito absoluto a \`@media (prefers-reduced-motion: reduce)\`: desativar transições de deslocamento e manter apenas fade in sutil ou visual estático limpo.
- **Sequenciamento Cinematográfico:**
  - Timelines com staggered animations (atraso de 0.04s a 0.08s entre itens sucessivos).
  - Curvas de aceleração realistas: \`cubic-bezier(0.16, 1, 0.3, 1)\` para entradas orgânicas de luxo.
- **Integração com Áudio e Vídeo:**
  - Compatibilidade com loops silenciosos de vídeo e transições frame-accurate via Remotion ou HTML5 Video com preload inteligente.`
  },

  {
    path: 'backend/saas-backend-architect',
    name: 'saas-backend-architect',
    description: 'Production-grade SaaS backend engineering: Multi-tenancy, Row Level Security (RLS), Supabase, idempotent webhooks, Stripe billing, auditing, migrations, and zero credential leaks.',
    content: `# SaaS Backend Architect

## Objetivo e Escopo
Fornece diretrizes e código de produção para o núcleo de servidores e bancos de dados de aplicações SaaS escaláveis. Cobre arquitetura multi-tenant, segurança em nível de linha (RLS), webhooks resilientes e infraestrutura de faturamento.

## Regras Inegociáveis de Engenharia
1. **Row Level Security (RLS) Mandatório:** Nenhuma tabela em banco de dados relacional (PostgreSQL/Supabase) pode ser criada sem RLS habilitado explicitamente.
2. **Isolamento Multi-Tenant:**
   - Toda consulta DEVE validar o identificador do tenant (\`organization_id\` ou \`team_id\`) através de claims JWT do usuário autenticado (\`auth.uid()\`), nunca confiando em parâmetros passados pelo corpo da requisição do cliente.
3. **Idempotência em Pagamentos e Webhooks:**
   - Webhooks do Stripe/Pix/Asaas devem gravar o \`event_id\` em tabela de controle (\`webhook_events\`) com constraint única antes de executar qualquer efeito colateral.
4. **Proteção Total contra Vazamento de Segredos:**
   - Nenhuma \`service_role_key\` do Supabase ou \`STRIPE_SECRET_KEY\` pode ser enviada ao cliente ou exposta em arquivos versionados. Uso exclusivo em rotas de backend ou Edge Functions protegidas.`
  },

  {
    path: 'ai/ai-product-engineer',
    name: 'ai-product-engineer',
    description: 'Specialist in real-world LLM product integration: Model Context Protocol (MCP), structured tool-calling, RAG, cost control, streaming UI, prompt defense, and AI observability.',
    content: `# AI Product Engineer

## Objetivo e Escopo
Especializada em projetar produtos impulsionados por inteligência artificial robusta. Orienta a conexão com LLMs, servidores MCP, pipelines de RAG (Retrieval-Augmented Generation), validação estruturada com Zod e monitoramento de latência e custos de tokens.

## Padrões Obrigatórios
- **Validação Estruturada com Zod:** Toda resposta de modelo que deva acionar ferramentas ou alimentar o banco DEVE ser estritamente parseada por esquemas tipados.
- **Streaming UI:** Respostas de IA devem utilizar leitor de stream com buffers responsivos, prevenindo layout shift e bloqueio de thread.
- **Defesa Contra Prompt Injection:** Sanitização de entradas não confiáveis e delimitação explícita de contexto do sistema.
- **Controle Orçamentário:** Rate limiting por usuário/tenant e cálculo de custos por requisição com fallback para modelos menores.`
  },

  {
    path: 'quality/production-readiness',
    name: 'production-readiness',
    description: 'Comprehensive pre-flight checklist and automated verification before deploying SaaS to production: TypeScript build, security audit, RLS validation, clean credentials, and rollback plans.',
    content: `# Production Readiness

## Objetivo e Escopo
Skill de certificação de prontidão de lançamento. Nenhuma funcionalidade ou aplicação SaaS deve ser promovida a produção sem cumprir os 10 critérios da checklist de auditoria.

## Checklist de 10 Pontos de Prontidão
1. **Type-Check Limpo:** Execução de \`tsc --noEmit\` sem qualquer erro ou tipo \`any\` tolerado.
2. **Build de Produção Verificado:** Execução de \`npm run build\` com zero warnings impeditivos.
3. **Segurança de Banco & RLS:** Políticas RLS ativas em 100% das tabelas que armazenam dados sensíveis.
4. **Zero Credenciais Expostas:** Varredura completa para garantir ausência de chaves privadas em arquivos frontend ou commits.
5. **Autenticação e Autorização:** Teste positivo de login e teste negativo de acesso a recursos entre tenants diferentes.
6. **Fluxos Críticos com Smoke Tests:** Teste E2E automatizado para o fluxo de conversão/checkout ou onboarding.
7. **Performance e Bundle Size:** Chunks de carregamento inicial mantidos abaixo de limites aceitáveis; Core Web Vitals estáveis.
8. **Acessibilidade Básica:** Zero violações críticas de contraste ou falta de labels em formulários essenciais.
9. **Observabilidade e Logs:** Tratamento global de erros (\`ErrorBoundary\` no React) e captura de exceções no servidor.
10. **Plano de Rollback Documentado:** Procedimento claro para reversão de versão em caso de instabilidade pós-deploy.`
  },

  // ==========================================
  // FASE 6: WORKFLOWS GLOBAIS COM SLASH COMMANDS
  // ==========================================
  {
    path: 'workflows/create-saas',
    name: 'create-saas',
    description: 'Slash command workflow /create-saas: End-to-end autonomous SaaS inception, from requirements and data modeling to frontend, backend, auth, tests, and production validation.',
    content: `# /create-saas Workflow

## Invocação
Digite \`/create-saas\` ou invoque esta skill quando iniciar uma nova aplicação SaaS completa do zero.

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
   - Executar checklist \`production-readiness\` antes da entrega final.`
  },

  {
    path: 'workflows/upgrade-ui',
    name: 'upgrade-ui',
    description: 'Slash command workflow /upgrade-ui: Audits existing UI, refines typography, spacing, visual hierarchy, responsiveness, adds purposeful micro-interactions, and ensures before/after excellence.',
    content: `# /upgrade-ui Workflow

## Invocação
Digite \`/upgrade-ui\` ou ative esta skill para modernizar e elevar a qualidade visual de uma interface web ou componente existente.

## Roteiro de Execução
1. **Auditoria Visual Prévia:** Inspecionar contraste, alinhamento, espaçamento e inconsistências de layout existentes.
2. **Hierarquia Tipográfica:** Redefinir escala de fontes para estabelecer leitura clara e ritmo visual harmônico.
3. **Refinamento de Cores e Superfícies:** Aplicar tokens refinados (superfícies escuras profundas, bordas suaves, acentos nobres).
4. **Microinterações:** Adicionar feedback tátil sutil em botões, abas e cards interativos.
5. **Responsividade Estrita:** Testar e ajustar quebras de linha em viewports móveis (320px a 430px) e desktops amplos.
6. **Preservação de Lógica:** Garantir que 100% dos hooks, handlers de eventos e integrações de dados continuem funcionando sem alterações que quebrem o contrato.
7. **Relatório Visual:** Apresentar resumo objetivo das melhorias implementadas.`
  },

  {
    path: 'workflows/cinematic-motion',
    name: 'cinematic-motion',
    description: 'Slash command workflow /cinematic-motion: Designs fluid timelines, scroll triggers, scene transitions, and micro-interactions with 60fps performance and motion accessibility.',
    content: `# /cinematic-motion Workflow

## Invocação
Digite \`/cinematic-motion\` para criar coreografias de animação profissionais, páginas com scroll narrativo ou apresentações de alto impacto visual.

## Roteiro de Execução
1. **Seleção da Engine:** Escolher Motion React (para microinterações e UI reativa) ou GSAP ScrollTrigger (para timelines complexas atreladas a rolagem).
2. **Definição de Timings:** Curvas de aceleração orgânicas, tempos de transição entre 180ms e 400ms.
3. **Coreografia de Elementos:** Entrada escalonada (*stagger*) e preservação de estabilidade de layout.
4. **Auditoria de FPS:** Garantir uso estrito de propriedades transformáveis pela GPU (\`transform: translate3d\`, \`scale\`, \`opacity\`), evitando animações que provoquem repintura (\`width\`, \`height\`, \`top\`, \`margin\`).
5. **Acessibilidade:** Implementar chaveamento transparente para usuários com \`prefers-reduced-motion\`.`
  },

  {
    path: 'workflows/create-3d',
    name: 'create-3d',
    description: 'Slash command workflow /create-3d: Builds performant 3D WebGL scenes using Three.js and React Three Fiber with lights, cameras, custom shaders, and graceful 2D fallbacks.',
    content: `# /create-3d Workflow

## Invocação
Digite \`/create-3d\` para planejar e desenvolver cenas e elementos 3D em tempo real na Web.

## Roteiro de Execução
1. **Justificativa de Produto:** Avaliar se o elemento 3D agrega valor real à experiência ou se uma alternativa vetorial/CSS é mais eficiente.
2. **Configuração de Canvas R3F:** Inicializar \`<Canvas>\` com pixel ratio limitado a 2, gerenciamento de cores sRGB e câmera calibrada.
3. **Iluminação e Materiais:** Luz ambiente suave, directional light com sombras otimizadas e materiais PBR (\`MeshStandardMaterial\` / \`MeshPhysicalMaterial\`).
4. **Gerenciamento de Recursos:** Descarte explícito de geometrias e texturas ao desmontar componentes (\`dispose()\`).
5. **Fallback Acessível:** Fornecer ilustração vetorial ou imagem estática caso WebGL não esteja disponível no navegador do cliente.`
  },

  {
    path: 'workflows/audit-project',
    name: 'audit-project',
    description: 'Slash command workflow /audit-project: Deep technical audit across architecture, dead code, security flaws, RLS, dependency hygiene, performance bottlenecks, and a11y.',
    content: `# /audit-project Workflow

## Invocação
Digite \`/audit-project\` para executar um diagnóstico completo e rigoroso de qualquer base de código.

## Roteiro de Execução
1. **Varredura Arquitetural:** Identificar duplicação de responsabilidades, acoplamento indevido e ausência de separação de camadas.
2. **Auditoria de Segurança:** Checar vazamento de chaves privadas, integridade de autenticação e proteção RLS no banco.
3. **Auditoria de Código Morto:** Localizar componentes, arquivos de teste órfãos ou dependências não utilizadas no package.json.
4. **Auditoria de Performance:** Diagnosticar renders desnecessários no React e consultas N+1 ao banco.
5. **Emissão de Relatório:** Classificar achados por criticidade (Crítico, Alto, Médio, Baixo) com plano de remediação imediato.`
  },

  {
    path: 'workflows/optimize-saas',
    name: 'optimize-saas',
    description: 'Slash command workflow /optimize-saas: Optimizes application performance across bundle splitting, database queries, caching strategies, mobile responsiveness, and Core Web Vitals.',
    content: `# /optimize-saas Workflow

## Invocação
Digite \`/optimize-saas\` para acelerar o carregamento, reduzir o consumo de memória e aprimorar a responsividade geral do software.

## Roteiro de Execução
1. **Análise de Bundle:** Identificar bibliotecas gigantes e implementar dynamic imports (\`React.lazy\` ou Next.js dynamic).
2. **Otimização de Consultas:** Adicionar índices no PostgreSQL, reescrever joins custosos e restringir campos selecionados (\`select id, name\` em vez de \`select *\`).
3. **Estratégia de Cache:** Configurar cache stale-while-revalidate com TanStack Query ou SWR no cliente e headers HTTP adequados no servidor.
4. **Otimização de Mídia:** Conversão de imagens para formatos modernos (WebP/AVIF) com dimensões explícitas para evitar CLS.
5. **Verificação de Métricas:** Validar redução no LCP (Largest Contentful Paint) e FID/INP.`
  },

  {
    path: 'workflows/review-design',
    name: 'review-design',
    description: 'Slash command workflow /review-design: Evaluates branding consistency, contrast, visual ergonomics, empty states, loading indicators, and accessibility compliance.',
    content: `# /review-design Workflow

## Invocação
Digite \`/review-design\` para submeter uma página ou fluxo a uma revisão estética e funcional orientada a padrões de excelência.

## Roteiro de Execução
1. **Consistência de Identidade:** Verificar uniformidade de fontes, raio de bordas, pesos visuais e cores primárias/secundárias.
2. **Auditoria de Contraste:** Validar proporções de contraste de texto contra fundo (mínimo 4.5:1).
3. **Estados de Interface:** Auditar presença de estados completos para cada componente: normal, hover, focus-visible, active, loading, empty e error.
4. **Revisão de Microcópia:** Garantir textos diretos, claros e sem jargões desnecessários nos diálogos e formulários.
5. **Síntese de Melhorias:** Propor melhorias com justificativa de usabilidade e código pronto para aplicação.`
  },

  // ==========================================
  // CAMADA A: CORE OBRIGATÓRIO
  // ==========================================
  {
    path: 'core/architecture',
    name: 'architecture',
    description: 'Clean Architecture and domain-driven design principles for modern SaaS applications. Ensures clean boundaries, separation of concerns, and maintainable codebases.',
    content: `# Software Architecture

## Objetivo e Escopo
Define a estrutura modular de aplicações SaaS, assegurando isolamento entre camadas de apresentação, domínio de negócios e acesso a dados.

## Padrão de Camadas Canônico
1. **Domain / Entities:** Tipos TypeScript puros, regras de negócio invariáveis e esquemas de validação (Zod).
2. **Application / Use Cases:** Serviços de orquestração, regras de cálculo e fluxos de transação.
3. **Infrastructure / Data Access:** Clientes Supabase, queries SQL, webhooks e integrações de terceiros.
4. **Presentation / UI:** Componentes React puros, páginas e hooks de interface.`
  },

  {
    path: 'core/clean-code',
    name: 'clean-code',
    description: 'Clean code standards, naming conventions, small composable functions, DRY without premature abstraction, and zero tolerance for dead code.',
    content: `# Clean Code Standards

## Diretrizes
- Funções com responsabilidade única e tamanho compacto.
- Nomes descritivos e semânticos para funções, variáveis e componentes.
- Sem código morto, comentários desatualizados ou dependências fantasmas.
- Modularidade pragmática: reutilize com bom senso, evite abstrações prematuras.`
  },

  {
    path: 'core/security',
    name: 'security',
    description: 'Defense-in-depth security engineering: input sanitization, CSRF/XSS mitigation, safe authentication flows, RLS, and secure environment variable handling.',
    content: `# Security Standards

## Diretrizes
- Validação estrita de toda entrada de dados externos via esquemas tipados (Zod).
- Uso obrigatório de Row Level Security (RLS) no PostgreSQL.
- Proibição estrita de tokens e segredos em repositórios e no código de cliente.
- Sanitização de saídas para prevenção de injeção XSS e SQL.`
  },

  {
    path: 'core/performance',
    name: 'performance',
    description: 'Application performance engineering: Core Web Vitals, tree-shaking, memory leak prevention, query optimization, and resource caching.',
    content: `# Performance Engineering

## Diretrizes
- Redução de complexidade de render e estabilização de layouts.
- Uso de carregamento sob demanda para módulos pesados.
- Otimização de consultas ao banco de dados com índices estratégicos.
- Preservação da memória do navegador através da limpeza adequada de ouvintes de eventos e timers.`
  },

  {
    path: 'frontend/react',
    name: 'react-best-practices',
    description: 'React 19 authoritative standards: Server Components, Actions, modern hooks, efficient state management, and strict avoidance of anti-patterns.',
    content: `# React Best Practices

## Diretrizes
- Uso prioritário de React 19 moderno com Server Components quando aplicável.
- Componentes funcionais limpos, hooks customizados sem re-renders em cascata.
- Evitar estados redundantes: derive valores sempre que possível a partir de props ou estados existentes.`
  },

  {
    path: 'frontend/typescript',
    name: 'typescript',
    description: 'Strict TypeScript engineering: zero any tolerance, discriminated unions, generic utilities, strict null checks, and type-safe API boundaries.',
    content: `# Strict TypeScript Standards

## Diretrizes
- \`strict: true\` mandatório. Zero tolerância ao uso de \`any\`.
- Uso de uniões discriminadas para modelar estados finitos da aplicação.
- Inferência de tipos a partir de esquemas de validação Zod.`
  },

  {
    path: 'frontend/tailwind',
    name: 'tailwind',
    description: 'Modern Tailwind CSS v4 / v3.4 engineering: design tokens, semantic utility classes, dark luxury color systems, and responsive layout styling.',
    content: `# Tailwind CSS Standards

## Diretrizes
- Utilização de classes utilitárias semânticas e consistentes com o design system.
- Suporte a temas dark nativos através de variáveis CSS estruturadas.
- Evitar classes arbitrárias repetitivas; centralizar tokens no arquivo de tema/CSS.`
  },

  {
    path: 'frontend/component-design',
    name: 'component-design',
    description: 'Composable UI component architecture with Shadcn and Radix Primitives: accessibility, slot composition, polymorphism, and clear prop contracts.',
    content: `# Composable Component Design

## Diretrizes
- Primitivas headless acessíveis (Radix UI) combinadas com estilos Tailwind.
- Componentes com contratos de props claros e composabilidade por composição (slots/children).`
  },

  {
    path: 'frontend/state-management',
    name: 'state-management',
    description: 'State management architecture: Zustand for client-side state, TanStack Query for server state, URL state synchronization, and zero prop drilling.',
    content: `# State Management Standards

## Diretrizes
- Separação estrita: Estado de Servidor (TanStack Query) vs. Estado de Cliente (Zustand).
- Sincronização de filtros e estados navegáveis via parâmetros de URL.`
  },

  {
    path: 'ui-ux/design-system',
    name: 'design-system',
    description: 'Design system tokens and patterns: three-layer tokens (primitive -> semantic -> component), spacing scale, typography, and dark mode palette.',
    content: `# Design System Tokens

## Diretrizes
- Sistema de tokens em 3 camadas: Primitivos -> Semânticos -> Componentes.
- Coerência absoluta de escala visual em toda a suíte de componentes.`
  },

  {
    path: 'ui-ux/visual-audit',
    name: 'visual-audit',
    description: 'Visual auditing and inspection: alignment, typography balance, contrast compliance, layout shift prevention, and aesthetic polish.',
    content: `# Visual Audit Standards

## Diretrizes
- Inspeção milimétrica de alinhamento e proporções áureas de espaçamento.
- Verificação de contraste de cores e legibilidade de telas em múltiplos dispositivos.`
  },

  {
    path: 'ui-ux/responsive',
    name: 'responsive',
    description: 'Mobile-first responsive design: fluid typography, dynamic viewports, touch targets >= 44px, safe areas, and desktop adaptability.',
    content: `# Responsive Design Standards

## Diretrizes
- Abordagem Mobile-First com testes estritos em 320px, 390px, 768px, 1024px e 1440px.
- Áreas de toque de no mínimo 44x44px para botões e links interativos móveis.`
  },

  {
    path: 'ui-ux/accessibility',
    name: 'accessibility',
    description: 'Accessibility compliance: WCAG 2.1/2.2 AA standards, semantic HTML, screen reader labels, keyboard navigation, and focus management.',
    content: `# Accessibility (A11y) Standards

## Diretrizes
- Conformidade obrigatória com as diretrizes WCAG 2.1 AA.
- Navegação completa por teclado com indicadores visíveis de foco (\`focus-visible\`).
- Atributos ARIA adequados para componentes interativos complexos.`
  },

  {
    path: 'quality/playwright',
    name: 'playwright',
    description: 'End-to-End browser testing with Playwright: smoke tests, user journeys, authentication flows, cross-browser validation, and visual regression.',
    content: `# Playwright E2E Testing

## Diretrizes
- Testes cobrindo os fluxos críticos de negócio (login, onboarding, checkout).
- Localizadores estáveis baseados em acessibilidade (\`getByRole\`, \`getByText\`).`
  },

  {
    path: 'quality/unit-testing',
    name: 'unit-testing',
    description: 'Unit and integration testing with Vitest: fast execution, mock isolation, coverage on critical business logic, and test-driven development.',
    content: `# Vitest Testing Standards

## Diretrizes
- Testes rápidos e isolados para funções utilitárias e regras de negócio.
- Aplicação de Test-Driven Development (TDD) para correções de bugs complexos.`
  },

  {
    path: 'quality/security-audit',
    name: 'security-audit',
    description: 'Automated and manual security audit: vulnerability scanning, dependency analysis, JWT verification, secret exposure detection, and injection prevention.',
    content: `# Security Audit Guidelines

## Diretrizes
- Varredura de vulnerabilidades de dependências e código-fonte.
- Validação de isolamento de tenants e integridade criptográfica de tokens.`
  },

  {
    path: 'quality/performance-audit',
    name: 'performance-audit',
    description: 'Performance auditing and profiling: Core Web Vitals, Lighthouse metrics, memory heap analysis, network request waterfalls, and rendering efficiency.',
    content: `# Performance Audit Standards

## Diretrizes
- Diagnóstico de Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS) e Interaction to Next Paint (INP).
- Profiling de render do React para erradicar desperdício computacional.`
  },

  // ==========================================
  // CAMADA B: ESPECIALIZAÇÕES
  // ==========================================
  {
    path: 'motion/motion-react',
    name: 'motion-react',
    description: 'Motion React (formerly Framer Motion) engineering: layout animations, gesture handling, spring physics, presence transitions, and GPU efficiency.',
    content: `# Motion React Engineering

## Diretrizes
- Uso de componentes animados \`motion.*\` com transições físicas naturais (springs).
- Animações condicionais controladas por \`AnimatePresence\` para saídas suaves.`
  },

  {
    path: 'motion/gsap',
    name: 'gsap',
    description: 'GSAP and ScrollTrigger animation engineering: pinned scroll sections, scrubbed timelines, smooth scrolling with Lenis, and high-performance DOM manipulation.',
    content: `# GSAP & ScrollTrigger Standards

## Diretrizes
- Gerenciamento de contexto seguro em React com \`useGSAP\` ou limpeza explícita de timelines.
- Seções fixadas (*pinned scroll*) e scrub fluido atrelado à barra de rolagem.`
  },

  {
    path: 'motion/remotion',
    name: 'remotion',
    description: 'Programmatic video rendering with Remotion: frame-accurate sequences, audio-video sync, dynamic Dark Luxury motion loops, and automated exports.',
    content: `# Remotion Video Engine

## Diretrizes
- Composições parametrizadas em React para renderização de vídeo programático.
- Sincronização milimétrica de quadros por segundo (fps) e animações baseadas em \`useCurrentFrame\` e \`interpolate\`.`
  },

  {
    path: 'motion/rive',
    name: 'rive',
    description: 'Interactive state-machine animations with Rive: dynamic vector graphics, state transitions, low-bandwidth animated icons, and runtime control.',
    content: `# Rive Interactive Animation

## Diretrizes
- Gráficos vetoriais interativos acionados por máquinas de estado em tempo real.
- Baixo consumo de CPU e memória em comparação a formatos de vídeo tradicionais.`
  },

  {
    path: 'motion/cinematic-scroll',
    name: 'cinematic-scroll',
    description: 'Specialized scroll-driven storytelling: parallax, pinned stages, progress scrubbing, responsive breakpoints, and reduced-motion fallback.',
    content: `# Cinematic Scroll Storytelling

## Diretrizes
- Criação de narrativas visuais orientadas pelo avanço do leitor na página.
- Estabilidade de altura de viewport para evitar saltos visuais em dispositivos móveis.`
  },

  {
    path: 'three-d/threejs',
    name: 'threejs',
    description: 'Direct Three.js engineering: Scene, Camera, Renderer, WebGL2/WebGPU pipelines, texture loading, lighting setups, and resource disposal.',
    content: `# Three.js Engineering Standards

## Diretrizes
- Inicialização limpa de cena, câmera em perspectiva e renderizador WebGL.
- Destruição manual e explícita de materiais, texturas e geometrias no descarte da cena.`
  },

  {
    path: 'three-d/react-three-fiber',
    name: 'react-three-fiber',
    description: 'Declarative 3D with React Three Fiber and Drei: componentized meshes, useFrame loops, orbital controls, loaders, and performant canvas mounting.',
    content: `# React Three Fiber (R3F) Standards

## Diretrizes
- Integração declarativa com React através do ecossistema Poimandres (R3F + Drei).
- Atualização contínua de transforms dentro de hooks \`useFrame\` sem provocar re-renders do React.`
  },

  {
    path: 'three-d/shaders',
    name: 'shaders',
    description: 'GLSL Shaders and post-processing: Custom vertex and fragment shaders, uniforms, noise functions, postprocessing passes, and GPU performance.',
    content: `# GLSL Shaders & Post-Processing

## Diretrizes
- Escrita de fragment e vertex shaders eficientes para efeitos de distorção e iluminação.
- Aplicação calibrada de passes de pós-processamento (bloom, vinheta) sem penalizar a taxa de quadros.`
  },

  {
    path: 'three-d/particles',
    name: 'particles',
    description: 'High-performance WebGL particle systems: InstancedMesh, point clouds, physics simulation, custom particle shaders, and mobile optimization.',
    content: `# WebGL Particle Systems

## Diretrizes
- Renderização de milhares de partículas utilizando \`InstancedMesh\` ou \`Points\` com atributos de buffer.
- Simulação de movimento na GPU via shaders para eliminar sobrecarga na thread principal.`
  },

  {
    path: 'three-d/optimization',
    name: 'three-d-optimization',
    description: '3D performance optimization: Draw call reduction, texture compression, geometry level of detail (LOD), frustum culling, and mobile throttling.',
    content: `# 3D WebGL Optimization

## Diretrizes
- Minimização de draw calls agrupando geometrias idênticas.
- Limitação do \`dpr\` (device pixel ratio) a no máximo 2 para evitar superaquecimento de GPUs móveis.`
  },

  {
    path: 'backend/supabase',
    name: 'supabase',
    description: 'Official Supabase engineering: PostgreSQL configuration, Row Level Security, Auth flows, Realtime subscriptions, Edge Functions, and Storage.',
    content: `# Supabase Engineering Standards

## Diretrizes
- Uso do cliente oficial \`@supabase/supabase-js\` e \`@supabase/ssr\` para Next.js.
- Todas as tabelas protegidas com políticas RLS granulares por usuário e organização.
- Subscrições Realtime com filtros específicos de canal para prevenir tráfego excessivo.`
  },

  {
    path: 'backend/postgres',
    name: 'postgres',
    description: 'PostgreSQL database excellence: normalized schema design, UUID primary keys, indexes, foreign keys, triggers, jsonb data types, and migrations.',
    content: `# PostgreSQL Database Standards

## Diretrizes
- Modelagem normalizada com chaves primárias UUID e timestamps (\`created_at\`, \`updated_at\`).
- Índices explícitos em colunas de busca frequente, chaves estrangeiras e campos de filtro RLS.`
  },

  {
    path: 'backend/api-design',
    name: 'api-design',
    description: 'REST and RPC API architecture: status codes, Zod validation, error envelopes, versioning, rate limiting, and OpenAPI/TypeScript contract sharing.',
    content: `# API Design Standards

## Diretrizes
- Rotas limpas e semânticas com códigos de status HTTP corretos.
- Respostas padronizadas com envelopes previsíveis de dados e erros detalhados.`
  },

  {
    path: 'backend/authentication',
    name: 'authentication',
    description: 'Secure authentication flows: passwordless magic links, OAuth providers, JWT session handling, secure HTTP-only cookies, and multi-factor auth (MFA).',
    content: `# Authentication Architecture

## Diretrizes
- Armazenamento de sessões em cookies HTTP-only seguros, prevenindo roubo via XSS.
- Renovação automática e transparente de tokens de acesso através de refresh tokens.`
  },

  {
    path: 'backend/payments',
    name: 'payments',
    description: 'SaaS billing and payment gateways: Stripe checkout, subscriptions, Pix integrations, idempotent webhook handling, invoices, and payment failure recovery.',
    content: `# SaaS Payments & Billing

## Diretrizes
- Modelagem de planos de assinatura e processamento resiliente de cobranças via Stripe ou Pix.
- Tabela de controle de eventos de webhook para prevenir processamento duplicado.`
  },

  {
    path: 'backend/multi-tenancy',
    name: 'multi-tenancy',
    description: 'Multi-tenant SaaS architecture: tenant isolation strategies, organization switching, member roles/permissions (RBAC), and shared vs isolated data patterns.',
    content: `# Multi-Tenancy Architecture

## Diretrizes
- Isolamento estrito de dados multi-tenant garantido pelo identificador de organização no RLS.
- Suporte a múltiplos membros com papéis de acesso diferenciados (Owner, Admin, Member, Guest).`
  },

  {
    path: 'mobile/flutter',
    name: 'flutter',
    description: 'Production Flutter engineering: clean architecture, responsive mobile layouts, custom shaders, state management, and native cross-platform polish.',
    content: `# Flutter Mobile Standards

## Diretrizes
- Arquitetura limpa orientada a widgets desacoplados e gerenciamento de estado previsível.
- Layouts responsivos que se adaptam perfeitamente a diferentes proporções de tela e entalhes (notches).`
  },

  {
    path: 'mobile/dart',
    name: 'dart',
    description: 'Dart language standards: strong typing, null safety, pattern matching, records, async streams, and unit testing best practices.',
    content: `# Dart Language Standards

## Diretrizes
- Null safety estrito em toda a base de código Dart.
- Uso de recursos modernos como records e pattern matching para código conciso e seguro.`
  },

  {
    path: 'ai/agents',
    name: 'ai-agents',
    description: 'Autonomous AI agent engineering: task decomposition, loop safeguards, memory preservation, subagent invocation, and verification protocols.',
    content: `# AI Agent Engineering Standards

## Diretrizes
- Decomposição de tarefas complexas em subtarefas atômicas e testáveis.
- Salvaguardas contra loops infinitos de execução e preservação metódica da memória viva do projeto.`
  },

  {
    path: 'ai/mcp',
    name: 'mcp-integration',
    description: 'Model Context Protocol (MCP) server integration: Playwright browser MCP, filesystem, database connectors, and custom tool creation.',
    content: `# MCP Integration Standards

## Diretrizes
- Configuração padronizada de servidores MCP no \`mcp_config.json\`.
- Exposição segura de ferramentas sem expor permissões de comando destrutivas desnecessárias.`
  },

  {
    path: 'ai/rag',
    name: 'rag-systems',
    description: 'Retrieval-Augmented Generation: text chunking, embedding generation with pgvector, cosine similarity queries, and grounded context injection.',
    content: `# RAG Systems Architecture

## Diretrizes
- Divisão semântica de documentos (*chunking*) preservando o contexto dos parágrafos.
- Busca vetorial com PostgreSQL pgvector e ordenação por similaridade de cossenos.`
  },

  {
    path: 'ai/tool-calling',
    name: 'tool-calling',
    description: 'Structured tool calling for LLMs: JSON schema definitions, Zod validation, error handling, sequential execution, and response synthesis.',
    content: `# Structured Tool Calling

## Diretrizes
- Definição rigorosa de parâmetros de ferramentas utilizando esquemas JSON.
- Tratamento graceful de falhas e re-tentativas com mensagens de erro explicativas para o modelo.`
  }
];

let generatedCount = 0;

for (const s of skills) {
  const targetDir = path.join('nxa-skills-engine', s.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const skillMdContent = `---
name: ${s.name}
description: >-
  ${s.description}
---

${s.content}
`;

  fs.writeFileSync(path.join(targetDir, 'SKILL.md'), skillMdContent, 'utf-8');
  generatedCount++;
}

console.log(`Generated ${generatedCount} SKILL.md files successfully across NXA Skills Engine.`);
