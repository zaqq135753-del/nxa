# Relatório de Curadoria e Auditoria de Repositórios (Fase 1)
**Projeto:** NXA Skills Engine  
**Data:** 16 de Outubro de 2026  
**Ambiente de Execução:** Google Antigravity 2.0  
**Repositórios Inspecionados:** 47 repositórios candidatos

---

## Sumário Executivo da Curadoria

A análise minuciosa dos 47 repositórios confirmou um princípio fundamental da engenharia de agentes:
1. **Bibliotecas de Runtime (React, Three.js, GSAP, Supabase, Flutter, Prisma, Drizzle, etc.):** Não devem ser instaladas como pacotes globais no ambiente do agente. Sua presença global polui o host, causa conflitos de versão e não ensina o modelo a codificar. O agente necessita de **Skills operacionais**, **Guias de arquitetura**, **Padrões de tipagem estrita** e **Snippets de referência técnica**.
2. **Repositórios de Skills e Coleções de Agentes:** Devem ser filtrados, sanitizados e adaptados para a semântica do Antigravity (`SKILL.md` com progressive disclosure, sem redundância de contexto).
3. **Servidores MCP e Ferramentas CLI:** Devem ser declarados sob demanda no `mcp_config.json` ou executados via `npx` / Node.js isolado.
4. **Correção de Repositórios:** O repositório listado como `axe-core/axe-core` não existe sob essa organização; a URL canônica oficial é `dequelabs/axe-core`.

---

## 1.1 Skills e Coleções para Agentes

### 1. `anthropics/skills`
- **URL & Proprietário:** https://github.com/anthropics/skills (Anthropic)
- **Finalidade:** Repositório oficial com skills e especificações para agentes (ex: `frontend-design`, `mcp-builder`, `webapp-testing`, `canvas-design`).
- **Tipo:** Coleção de Skills.
- **Último Commit / Manutenção:** Ativo (Outubro 2026), 181k+ stars.
- **Licença:** Custom / Permissiva com atribuição.
- **Linguagens/Frameworks:** Markdown, JSON, Bash, Python/Node.
- **Comandos de Instalação:** Não aplicável (arquivos de instrução `SKILL.md`).
- **Scripts Executáveis:** Sim (templates e geradores).
- **Compatibilidade Antigravity:** Alta (padrão `SKILL.md`).
- **Riscos:** Scripts bash dependem de ambiente Unix; no Windows Antigravity, instruções e scripts devem ser adaptados para Node.js/PowerShell.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR** (Incorporar as melhores instruções de `frontend-design`, `canvas-design` e `webapp-testing` no padrão Antigravity).

### 2. `vercel-labs/agent-skills`
- **URL & Proprietário:** https://github.com/vercel-labs/agent-skills (Vercel Labs)
- **Finalidade:** Skills oficiais da Vercel para React (`react-best-practices`, `composition-patterns`, `react-view-transitions`, `web-design-guidelines`).
- **Tipo:** Coleção de Skills.
- **Último Commit / Manutenção:** Ativo (Outubro 2026), 32k+ stars.
- **Licença:** Apache-2.0 / Vercel.
- **Linguagens/Frameworks:** TypeScript, React, Next.js.
- **Comandos de Instalação:** N/A (instruções `SKILL.md`).
- **Scripts Executáveis:** Sim (empacotadores zip/distribuição).
- **Compatibilidade Antigravity:** Alta.
- **Riscos:** Foco excessivo no ecossistema proprietário Vercel; sanitizar para arquiteturas universais.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR** (Extrair regras fundamentais de composição React e view transitions para o NXA).

### 3. `addyosmani/agent-skills`
- **URL & Proprietário:** https://github.com/addyosmani/agent-skills (Addy Osmani)
- **Finalidade:** Arsenal de engenharia de software de alta maturidade para agentes (Clean Architecture, TDD, Security, Observability, Doubt-Driven-Dev).
- **Tipo:** Coleção de Skills e Plugins.
- **Último Commit / Manutenção:** Ativo (Outubro 2026), 107k+ stars.
- **Licença:** MIT.
- **Linguagens/Frameworks:** Universal (TypeScript, Python, Go, Node.js).
- **Comandos de Instalação:** Já presente no ambiente sob `plugins/agent-skills`.
- **Scripts Executáveis:** Sim (testes de validação de schemas em Node.js).
- **Compatibilidade Antigravity:** Nativa (já inclui docs de setup para Antigravity).
- **Riscos:** Conflito de duplicação identificado entre a pasta `skills/` e `plugins/agent-skills/skills/`.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR E UNIFICAR** (Resolver a duplicação no registry do Antigravity mantendo o núcleo de qualidade técnica).

### 4. `nextlevelbuilder/ui-ux-pro-max-skill`
- **URL & Proprietário:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Finalidade:** Inteligência de design UI/UX profunda (50 estilos visuais ativos, 192 paletas com raciocínio, 74 pares tipográficos, 119 diretrizes de usabilidade).
- **Tipo:** Skill com Base de Conhecimento Estruturada.
- **Último Commit / Manutenção:** Ativo (Outubro 2026), 136k+ stars.
- **Licença:** MIT.
- **Linguagens/Frameworks:** JSON, Markdown, Python/Node scripts.
- **Comandos de Instalação:** Dados estruturados em `data/*.json`.
- **Scripts Executáveis:** Sim (pesquisadores de estilos e paletas).
- **Compatibilidade Antigravity:** Total.
- **Riscos:** O repositório bruto foi clonado diretamente na pasta global de skills, gerando redundância com a skill já instalada.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR** (Preservar a inteligência de tokens e paletas no core de design do NXA, eliminando pastas git brutas soltas).

### 5. `pbakaus/impeccable`
- **URL & Proprietário:** https://github.com/pbakaus/impeccable (Paul Bakaus)
- **Finalidade:** Linguagem e critérios de design para IA, com foco em ergonomia visual, hierarquia, espaçamento e tipografia de alto nível.
- **Tipo:** Sistema de Regras e Skill de Design.
- **Último Commit / Manutenção:** Ativo (Outubro 2026), 81k+ stars.
- **Licença:** Apache-2.0.
- **Linguagens/Frameworks:** Rust/Node/Markdown. Suporta `.gemini` e `.agents`.
- **Comandos de Instalação:** N/A.
- **Scripts Executáveis:** CLI e visualizadores.
- **Compatibilidade Antigravity:** Alta.
- **Riscos:** Baixo.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR** (Integrar critérios de refinamento visual e anti-padrões de IA no módulo `ui-ux/premium-saas`).

### 6. `JustineBijuPaul/frontend-ai-skills`
- **URL & Proprietário:** https://github.com/JustineBijuPaul/frontend-ai-skills
- **Finalidade:** Biblioteca enciclopédica modular com 70 skills frontend (GSAP, ScrollTrigger, Lenis, Motion React, Three.js, R3F, Shaders, Web Vitals, A11y).
- **Tipo:** Coleção Modular de Skills.
- **Último Commit / Manutenção:** Ativo (Setembro 2026).
- **Licença:** MIT.
- **Linguagens/Frameworks:** TypeScript, React, Three.js, CSS/Tailwind.
- **Comandos de Instalação:** N/A (`SKILL.md` por diretório).
- **Scripts Executáveis:** Scripts utilitários de animação e setup.
- **Compatibilidade Antigravity:** Alta (estrutura idêntica ao padrão `SKILL.md`).
- **Riscos:** Injetar todas as 70 skills ao mesmo tempo estouraria o context budget.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR SELETIVAMENTE** (Mapear módulos de Motion, Three.js, Shaders e Scroll para o NXA Skills Engine sob demanda).

### 7. `SoftwareInFocus/threejs-skills`
- **URL & Proprietário:** https://github.com/SoftwareInFocus/threejs-skills
- **Finalidade:** Skills para 3D, Three.js, física, animações e shaders aplicados à Web.
- **Tipo:** Coleção de Skills 3D.
- **Último Commit / Manutenção:** Ativo (Agosto 2026). Fork verificado.
- **Licença:** MIT.
- **Linguagens/Frameworks:** JavaScript / Three.js / WebGL.
- **Comandos de Instalação:** N/A.
- **Scripts Executáveis:** Demos e renderizadores.
- **Compatibilidade Antigravity:** Média (requer adaptação de frontmatter).
- **Riscos:** Demos com dependências pesadas de Three.js antigo.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **USAR COMO REFERÊNCIA** (Extrair padrões de iluminação e render loop para a skill `three-d`).

### 8. `finfin/awesome-frontend-skills`
- **URL & Proprietário:** https://github.com/finfin/awesome-frontend-skills
- **Finalidade:** Lista curada de links e skills frontend.
- **Tipo:** Documentação / Curadoria.
- **Último Commit / Manutenção:** Estável (Abril 2026).
- **Licença:** Não especificada.
- **Linguagens/Frameworks:** Markdown.
- **Comandos de Instalação:** N/A.
- **Scripts Executáveis:** Não.
- **Compatibilidade Antigravity:** Apenas como catálogo.
- **Riscos:** Inconsistência de qualidade entre links de terceiros.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **USAR COMO REFERÊNCIA**.

### 9. `PyModel/react-frontend-skills`
- **URL & Proprietário:** https://github.com/PyModel/react-frontend-skills
- **Finalidade:** Coleção de skills para React 19, Next.js, TypeScript estrito, TDD, Zod, TanStack Query e Vitest.
- **Tipo:** Coleção de Skills para Agentes.
- **Último Commit / Manutenção:** Muito ativo (Outubro 2026).
- **Licença:** MIT.
- **Linguagens/Frameworks:** TypeScript, React 19, Vite, Next.js.
- **Comandos de Instalação:** N/A.
- **Scripts Executáveis:** Utilitários de validação.
- **Compatibilidade Antigravity:** Alta.
- **Riscos:** Baixo.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **ADAPTAR** (Padrões de React 19 Server Components, Actions e tipagem TypeScript).

### 10. `cloudai-x/threejs-skills`
- **URL & Proprietário:** https://github.com/CloudAI-X/threejs-skills
- **Finalidade:** Prompts e habilidades 3D para Three.js.
- **Tipo:** Coleção de Prompts/Skills.
- **Último Commit / Manutenção:** Julho 2026, 3.5k stars.
- **Licença:** Não especificada.
- **Linguagens/Frameworks:** Three.js.
- **Comandos de Instalação:** N/A.
- **Scripts Executáveis:** Não.
- **Compatibilidade Antigravity:** Parcial.
- **Riscos:** Ausência de licença formal explícita.
- **Uso como Referência sem Instalação:** Sim.
- **Classificação:** **DESCARTAR / USAR COMO REFERÊNCIA SECUNDÁRIA** (Substituído com folga técnica por `JustineBijuPaul/frontend-ai-skills` e `pmndrs`).

---

## 1.2 Frontend e Componentes

### 11. `facebook/react`
- **URL & Proprietário:** https://github.com/facebook/react (Meta)
- **Finalidade:** Biblioteca core de interface declarativa (React 19).
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Contínua (251k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Nunca instalar globalmente; o agente opera com a skill de arquitetura e padrões React 19).

### 12. `microsoft/TypeScript`
- **URL & Proprietário:** https://github.com/microsoft/TypeScript (Microsoft)
- **Finalidade:** Tipagem estrita e compilador JavaScript.
- **Tipo:** Linguagem / Compilador.
- **Último Commit / Manutenção:** Contínua (111k+ stars, Outubro 2026).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Instalado localmente por projeto via devDependencies `typescript`).

### 13. `tailwindlabs/tailwindcss`
- **URL & Proprietário:** https://github.com/tailwindlabs/tailwindcss
- **Finalidade:** Framework CSS utilitário (Tailwind v4 / v3.4).
- **Tipo:** Ferramenta / CSS Engine.
- **Último Commit / Manutenção:** Contínua (97k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Regras e tokens integrados na skill `frontend/tailwind`).

### 14. `shadcn-ui/ui`
- **URL & Proprietário:** https://github.com/shadcn-ui/ui
- **Finalidade:** Componentes acessíveis baseados em Radix Primitives e Tailwind.
- **Tipo:** CLI / Catálogo de Código Aberto.
- **Último Commit / Manutenção:** Contínua (125k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Comandos:** `npx shadcn@latest add <component>` por projeto.
- **Classificação:** **ADAPTAR COMO SKILL + CLI POR DEMANDA** (Guia de composição e design system customizável no NXA).

### 15. `radix-ui/primitives`
- **URL & Proprietário:** https://github.com/radix-ui/primitives (WorkOS)
- **Finalidade:** Primitivas headless acessíveis (WAI-ARIA compliance).
- **Tipo:** Biblioteca de Componentes Headless.
- **Último Commit / Manutenção:** Ativo (19k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Base das diretrizes de acessibilidade na skill `ui-ux/accessibility`).

### 16. `DavidHDev/react-bits`
- **URL & Proprietário:** https://github.com/DavidHDev/react-bits
- **Finalidade:** Coleção de componentes animados e interativos (Text animations, Backgrounds, Animations, 3D cards).
- **Tipo:** Biblioteca / Catálogo de Componentes.
- **Último Commit / Manutenção:** Muito ativo (49k+ stars, Outubro 2026).
- **Licença:** Custom / Aberta para uso.
- **Classificação:** **ADAPTAR COMO REFERÊNCIA DE MOTION** (Incorporar padrões visuais na skill `motion/cinematic-scroll`).

### 17. `pmndrs/zustand`
- **URL & Proprietário:** https://github.com/pmndrs/zustand
- **Finalidade:** Gerenciamento de estado global simples, reativo e imutável.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Contínua (58k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Padrão canônico de state management na skill `frontend/state-management`).

### 18. `TanStack/query`
- **URL & Proprietário:** https://github.com/TanStack/query
- **Finalidade:** Gerenciamento de estado de servidor, cache, mutações e sincronização assíncrona.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Contínua (50k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Padrão de data-fetching e cache na skill `frontend/state-management`).

### 19. `TanStack/router`
- **URL & Proprietário:** https://github.com/TanStack/router
- **Finalidade:** Roteamento 100% type-safe para aplicações web modernas.
- **Tipo:** Biblioteca de Roteamento.
- **Último Commit / Manutenção:** Contínua (15k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

---

## 1.3 Motion e Animações

### 20. `motiondivision/motion` (Framer Motion / Motion)
- **URL & Proprietário:** https://github.com/motiondivision/motion
- **Finalidade:** Animações declarativas, gestos e layout transitions para React e Vanilla JS.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Contínua (34k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + CRIAR SKILL** (Skill especializada `motion/motion-react`).

### 21. `greensock/GSAP`
- **URL & Proprietário:** https://github.com/greensock/GSAP
- **Finalidade:** Animação de alta performance na web, ScrollTrigger e timelines complexas.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Estável (29k+ stars).
- **Licença:** Padrão GreenSock (gratuito para a maioria dos usos, comercial restrito para certos modelos).
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + CRIAR SKILL** (Skill especializada `motion/gsap` com ScrollTrigger).

### 22. `remotion-dev/remotion`
- **URL & Proprietário:** https://github.com/remotion-dev/remotion
- **Finalidade:** Criação programática de vídeos e renders frame-by-frame com React.
- **Tipo:** Framework de Vídeo / Engine.
- **Último Commit / Manutenção:** Contínua (64k+ stars, Outubro 2026).
- **Licença:** Remotion License (gratuito para indivíduos/pequenas empresas).
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + CRIAR SKILL** (Skill especializada `motion/remotion` para vídeo dark luxury e cinema loops).

### 23. `rive-app/rive-react`
- **URL & Proprietário:** https://github.com/rive-app/rive-react
- **Finalidade:** Runtime React para animações interativas baseadas em state machine do Rive.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Ativo (1.1k+ stars, Setembro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + SKILL** (`motion/rive`).

### 24. `airbnb/lottie-web`
- **URL & Proprietário:** https://github.com/airbnb/lottie-web
- **Finalidade:** Renderização de animações After Effects em JSON na web.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Estável/Manutenção (32k+ stars).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Alternativa leve para microinterações).

---

## 1.4 3D e WebGL

### 25. `mrdoob/three.js`
- **URL & Proprietário:** https://github.com/mrdoob/three.js
- **Finalidade:** Biblioteca core 3D e WebGL/WebGPU.
- **Tipo:** Biblioteca de Runtime.
- **Último Commit / Manutenção:** Contínua (116k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 26. `pmndrs/react-three-fiber`
- **URL & Proprietário:** https://github.com/pmndrs/react-three-fiber
- **Finalidade:** Declarative Three.js em componentes React com ciclo de vida otimizado.
- **Tipo:** Biblioteca de Integração.
- **Último Commit / Manutenção:** Contínua (33k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + CRIAR SKILL** (`three-d/react-three-fiber`).

### 27. `pmndrs/drei`
- **URL & Proprietário:** https://github.com/pmndrs/drei
- **Finalidade:** Helpers úteis para React Three Fiber (câmeras, controles orbitais, loaders, texto 3D, sombras).
- **Tipo:** Biblioteca de Utilidades 3D.
- **Último Commit / Manutenção:** Contínua (9.9k+ stars).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 28. `pmndrs/postprocessing`
- **URL & Proprietário:** https://github.com/pmndrs/postprocessing
- **Finalidade:** Efeitos de pós-processamento (Bloom, Vignette, Depth of Field, Chromatic Aberration).
- **Tipo:** Biblioteca de Shaders / Pós-Processamento.
- **Último Commit / Manutenção:** Ativo (2.8k+ stars).
- **Licença:** Zlib.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + SKILL SHADERS**.

### 29. `BabylonJS/Babylon.js`
- **URL & Proprietário:** https://github.com/BabylonJS/Babylon.js (Microsoft)
- **Finalidade:** Engine completa 3D e jogos para web.
- **Tipo:** Game/Render Engine.
- **Último Commit / Manutenção:** Contínua (26k+ stars).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Para cenários WebGPU pesados alternativos ao Three.js).

### 30. `splinetool/react-spline`
- **URL & Proprietário:** https://github.com/splinetool/react-spline
- **Finalidade:** Componente React para exportações e cenas interativas 3D do Spline.
- **Tipo:** Runtime React.
- **Último Commit / Manutenção:** Estável (1.4k+ stars, Março 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

---

## 1.5 Backend e SaaS

### 31. `supabase/agent-skills`
- **URL & Proprietário:** https://github.com/supabase/agent-skills (Supabase)
- **Finalidade:** Skills oficiais da Supabase para agentes: `supabase` e `supabase-postgres-best-practices`.
- **Tipo:** Coleção de Skills para Agentes.
- **Último Commit / Manutenção:** Ativo (2.8k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Compatibilidade Antigravity:** Nativa (`SKILL.md`).
- **Classificação:** **INSTALAR / ADAPTAR** (Incorporar integralmente na pasta `backend/supabase`).

### 32. `supabase/supabase`
- **URL & Proprietário:** https://github.com/supabase/supabase
- **Finalidade:** Plataforma open-source Postgres (Auth, Realtime, Storage, RLS, Edge Functions).
- **Tipo:** Plataforma de Backend / BaaS.
- **Último Commit / Manutenção:** Contínua (111k+ stars, Outubro 2026).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 33. `prisma/prisma`
- **URL & Proprietário:** https://github.com/prisma/prisma
- **Finalidade:** ORM para Node.js & TypeScript com geração de schemas declarativos.
- **Tipo:** ORM / Tooling.
- **Último Commit / Manutenção:** Contínua (47k+ stars).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 34. `drizzle-team/drizzle-orm`
- **URL & Proprietário:** https://github.com/drizzle-team/drizzle-orm
- **Finalidade:** TypeScript ORM leve com tipagem estrita e dialeto SQL direto.
- **Tipo:** ORM / Query Builder.
- **Último Commit / Manutenção:** Contínua (36k+ stars, Outubro 2026).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 35. `honojs/hono`
- **URL & Proprietário:** https://github.com/honojs/hono
- **Finalidade:** Framework web ultrarrápido baseado em Web Standards para Edge e Node.
- **Tipo:** Framework de API.
- **Último Commit / Manutenção:** Contínua (32k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 36. `nestjs/nest`
- **URL & Proprietário:** https://github.com/nestjs/nest
- **Finalidade:** Framework corporativo arquitetural em TypeScript orientado a microsserviços.
- **Tipo:** Framework de Backend.
- **Último Commit / Manutenção:** Contínua (76k+ stars).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 37. `fastify/fastify`
- **URL & Proprietário:** https://github.com/fastify/fastify
- **Finalidade:** Framework Node.js de baixo overhead com validação por schemas.
- **Tipo:** Framework HTTP.
- **Último Commit / Manutenção:** Contínua (37k+ stars).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 38. `colinhacks/zod`
- **URL & Proprietário:** https://github.com/colinhacks/zod
- **Finalidade:** Validação de schemas em tempo de execução com inferência de tipos TypeScript.
- **Tipo:** Biblioteca de Validação.
- **Último Commit / Manutenção:** Contínua (44k+ stars, Outubro 2026).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Padrão canônico de validação em todas as skills do NXA).

---

## 1.6 Mobile

### 39. `flutter/flutter`
- **URL & Proprietário:** https://github.com/flutter/flutter (Google)
- **Finalidade:** Framework cross-platform para compilação nativa mobile, web e desktop.
- **Tipo:** SDK / Framework Nativo.
- **Último Commit / Manutenção:** Contínua (180k+ stars).
- **Licença:** BSD-3-Clause.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA**.

### 40. `flutter/agent-plugins`
- **URL & Proprietário:** https://github.com/flutter/agent-plugins (Google Flutter Team)
- **Finalidade:** Conjunto oficial de skills e regras de agentes para Flutter e Dart (arquitetura, testes, layouts responsivos, ffi).
- **Tipo:** Coleção de Skills para Agentes.
- **Último Commit / Manutenção:** Ativo (3k+ stars, Outubro 2026).
- **Licença:** BSD-3-Clause.
- **Compatibilidade Antigravity:** Alta (arquivos `SKILL.md` organizados em subpastas).
- **Classificação:** **ADAPTAR** (Integrar na pasta `mobile/flutter` e `mobile/dart` do NXA).

### 41. `dart-lang/skills`
- **URL & Proprietário:** https://github.com/dart-lang/skills (Dart Team)
- **Finalidade:** Skills especializadas para a linguagem Dart.
- **Tipo:** Coleção de Skills para Agentes.
- **Último Commit / Manutenção:** Ativo (522 stars, Outubro 2026).
- **Licença:** BSD-3-Clause.
- **Compatibilidade Antigravity:** Alta.
- **Classificação:** **ADAPTAR** (Integrar na pasta `mobile/dart` do NXA).

---

## 1.7 Testes, Qualidade e MCP

### 42. `microsoft/playwright`
- **URL & Proprietário:** https://github.com/microsoft/playwright (Microsoft)
- **Finalidade:** Framework moderno de automação e testes End-to-End (E2E) em navegadores reais.
- **Tipo:** Framework de Testes.
- **Último Commit / Manutenção:** Contínua (97k+ stars).
- **Licença:** Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + CRIAR SKILL** (`quality/playwright`).

### 43. `microsoft/playwright-mcp`
- **URL & Proprietário:** https://github.com/microsoft/playwright-mcp (Microsoft)
- **Finalidade:** Servidor Model Context Protocol oficial para permitir que agentes executem e inspecionem páginas via Playwright.
- **Tipo:** Servidor MCP.
- **Último Commit / Manutenção:** Ativo (38k+ stars, Outubro 2026).
- **Licença:** Apache-2.0.
- **Comandos de Execução:** `npx @modelcontextprotocol/server-playwright` ou equivalente.
- **Compatibilidade Antigravity:** Alta (declarável no `mcp_config.json`).
- **Classificação:** **ADAPTAR COMO CONFIGURAÇÃO MCP** (Documentar no módulo `ai/mcp`).

### 44. `vitest-dev/vitest`
- **URL & Proprietário:** https://github.com/vitest-dev/vitest
- **Finalidade:** Test runner ultrarrápido nativo Vite com suporte TypeScript e compatibilidade com Jest.
- **Tipo:** Framework de Testes Unitários/Integração.
- **Último Commit / Manutenção:** Contínua (17k+ stars).
- **Licença:** MIT.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA + SKILL** (`quality/unit-testing`).

### 45. `millionco/react-doctor`
- **URL & Proprietário:** https://github.com/millionco/react-doctor (Million.js / Aiden Bai)
- **Finalidade:** Skill de auditoria estática e identificação de anti-padrões gerados por IAs em código React e Three.js.
- **Tipo:** Ferramenta / Skill de Auditoria.
- **Último Commit / Manutenção:** Muito ativo (15k+ stars, Outubro 2026).
- **Licença:** Custom / Permissiva.
- **Compatibilidade Antigravity:** Nativa (`skills/react-doctor/SKILL.md`).
- **Classificação:** **ADAPTAR** (Integrar na auditoria de qualidade frontend do NXA).

### 46. `modelcontextprotocol/servers`
- **URL & Proprietário:** https://github.com/modelcontextprotocol/servers (Anthropic / MCP Org)
- **Finalidade:** Catálogo de referência de servidores MCP (PostgreSQL, Git, Memory, Filesystem, Puppeteer, etc.).
- **Tipo:** Servidores e Referência MCP.
- **Último Commit / Manutenção:** Contínua (91k+ stars, Outubro 2026).
- **Licença:** MIT / Apache-2.0.
- **Classificação:** **USAR COMO REFERÊNCIA DE INTEGRAÇÃO** (Documentar padrões em `ai/mcp`).

### 47. `dequelabs/axe-core` *(Corrigido de axe-core/axe-core)*
- **URL & Proprietário:** https://github.com/dequelabs/axe-core (Deque Systems)
- **Finalidade:** Engine oficial e autoritativa para testes automatizados de acessibilidade digital (WCAG 2.1 / 2.2).
- **Tipo:** Motor de Acessibilidade / Biblioteca.
- **Último Commit / Manutenção:** Contínua (7.6k+ stars, Outubro 2026).
- **Licença:** MPL-2.0.
- **Correção Registrada:** A URL solicitada originalmente `axe-core/axe-core` não existe no GitHub; o repositório oficial é `dequelabs/axe-core`.
- **Classificação:** **USAR COMO REFERÊNCIA TÉCNICA** (Integrar regras de validação a11y em `ui-ux/accessibility`).

---

## Síntese de Ações e Matriz de Destino

| Categoria | Repositórios Auditados | Instalar / Adaptar como Skill | Usar como Referência Técnica | Descartar / Redundante |
| :--- | :---: | :---: | :---: | :---: |
| **1.1 Coleções de Agentes** | 10 | 6 (Anthropics, Vercel, Addy, NextLevel, Justine, PyModel) | 3 (SoftwareInFocus, FinFin, Impeccable) | 1 (cloudai-x) |
| **1.2 Frontend & UI** | 9 | 1 (shadcn-ui) | 8 (React, TS, Tailwind, Radix, Bits, Zustand, Query, Router) | 0 |
| **1.3 Motion & Animações** | 5 | 0 | 5 (Motion, GSAP, Remotion, Rive, Lottie) | 0 |
| **1.4 3D & WebGL** | 6 | 0 | 6 (Three.js, R3F, Drei, Postprocessing, Babylon, Spline) | 0 |
| **1.5 Backend & SaaS** | 8 | 1 (Supabase Agent Skills) | 7 (Supabase, Prisma, Drizzle, Hono, Nest, Fastify, Zod) | 0 |
| **1.6 Mobile** | 3 | 2 (Flutter Agent Plugins, Dart Skills) | 1 (Flutter SDK) | 0 |
| **1.7 Testes, Qualidade & MCP** | 6 | 2 (Million React-Doctor, Playwright-MCP) | 4 (Playwright, Vitest, MCP Servers, Axe-Core) | 0 |
| **TOTAL** | **47** | **12 Coleções Adaptadas** | **34 Referências Mapeadas** | **1 Descartado** |
