# PROJECT MEMORY — MEMÓRIA PERSISTENTE DO ECOSSISTEMA
> **Repositório Unificado:** Caraíva Digital & TapTable OS  
> **Última Atualização:** 16 de Outubro de 2026  
> **Status Geral:** Em evolução acelerada (Fase de Integração Cruzada e Cinema Dark Luxury)

---

## 📌 1. PROPÓSITO & MISSÃO DO ECOSSISTEMA

Este repositório constrói o primeiro **Sistema Integrado de Destino Inteligente e Hospitalidade B2B/B2C** do Brasil, unindo:
1. **Caraíva Digital (`caraiva-ecosystem` & `caraiva-mobile`):** O super-app de destino que transforma a vila mágica de Caraíva (Bahia) em uma experiência digital fluida, conectando turistas a pousadas, passeios de barco/buggy, gastronomia local, cultura pataxó e comércio artesanal.
2. **TapTable OS (`taptable-app`):** O sistema operacional completo de gestão 360 para bares, restaurantes e beach clubs, com abertura de comandas via NFC na mesa, cardápios digitais interativos, KDS de cozinha, DRE em tempo real e fechamento de conta autônomo sem garçom.
3. **Caraíva Cinematic (`caraiva-cinematic`):** O motor de mídia audiovisual em Remotion 4.0 que produz vinhetas cinematográficas, loops para pratos vivos no cardápio, vídeos de retrospectiva viral (*Caraíva Wrapped*) e modo TV/Totem para pousadas e restaurantes.
4. **Supabase Universal Core (`supabase`):** Backend compartilhado com banco de dados PostgreSQL, autenticação, Realtime para atualização instantânea de mesas/pedidos e checkout financeiro universal.

---

## 🗺️ 2. MAPA DE MÓDULOS & ESTADO ATUAL DOS PROJETOS

| Módulo / Pasta | Stack Principal | Papel no Ecossistema | Estado Atual | Pontos Críticos / Próximos Passos |
| :--- | :--- | :--- | :--- | :--- |
| **`caraiva-ecosystem`** | Next.js 14, React 18, Tailwind CSS, Supabase JS, Framer Motion | Portal e Super-App Web para turistas e portal de parceiros locais. | Estável, com migrações de checkout unificado e catálogo público. | Integrar diretamente com a API do TapTable para exibir mesas ao vivo no guia. |
| **`taptable-app`** | React 19, Tailwind v4, Motion, Vite 8, Supabase JS, Confetti | Aplicação de mesa NFC (visão cliente) + Painel Gerencial 9 módulos (visão dono de bar). | V2 Operacional com DRE ao vivo e deploy Vercel configurado. | Conectar aos pratos em vídeo gerados pelo Remotion e sincronizar com Supabase Realtime de Caraíva. |
| **`caraiva-cinematic`** | Remotion 4.0.535, React 19, TypeScript | Motor de renderização de vídeos cinematográficos, reels, intros e loops em alta definição. | Configurado com composições de intro master, mobile 9:16, splash e POC de água. | Renderizar o primeiro lote de pratos vivos para o TapTable e implementar o Caraíva Wrapped. |
| **`caraiva-mobile`** | Flutter / Dart, Custom Shaders | App móvel nativo para turistas com navegação offline e suporte a maré. | Protótipo com shaders e cards 3D. | Alinhar design system com a identidade Dark Luxury Baiana (`#090B0C`, `#F6C945`). |
| **`supabase`** | PostgreSQL, Migrations SQL, RLS, Edge Functions | Banco de dados centralizado e barramento de eventos em tempo real. | Migrações principais em `caraiva-ecosystem/supabase/migrations`. | Unificar migrations raiz para permitir setup local e staging com um único comando. |

---

## 🏛️ 3. REGISTRO DE DECISÕES ARQUITETURAIS (ADRs)

### ADR 001: A Arquitetura Híbrida Três Camadas (Remotion + Cinema Loops + React UI)
* **Data:** 16/10/2026
* **Contexto:** Havia a hipótese de rodar Remotion Player em toda a interface do app para dar estética de filme da Pixar.
* **Problema Identificado:** Rodar múltiplos players Remotion simultaneamente destrói a thread de JavaScript, causa aquecimento excessivo sob o sol da praia e drena a bateria do celular do turista (INP alto).
* **Decisão Tomada:** Separar em 3 camadas:
  1. *Camada 1 (Remotion Player ao Vivo):* Reservado para momentos interativos específicos onde o usuário arrasta o tempo (ex: Tábua de Marés interativa ou Cerimônia de Check-in NFC) — no máximo 1 player na tela por vez.
  2. *Camada 2 (Cinema Loops Pré-renderizados):* Vídeos MP4/WebM renderizados via Remotion CLI (`remotion render`) e executados via `<video muted playsInline loop>` decodificados direto na GPU com zero custo de CPU.
  3. *Camada 3 (UI Reativa):* React 19 + Framer Motion + Tailwind para toda a navegação, cards, modais e formulários.

### ADR 002: Ciclo de Checkout Universal no Supabase (`universal_checkout_lifecycle.sql`)
* **Data:** 14/10/2026
* **Contexto:** Cada vertical (passeio de barco, hospedagem, comanda de bar) precisava de um fluxo financeiro com divisão de taxas e repasses transparentes.
* **Decisão Tomada:** Implementada máquina de estados transacional diretamente no PostgreSQL com funções `SECURITY DEFINER`, garantindo atomicidade entre pagamento, confirmação e reserva de vaga/mesa.

### ADR 003: Single Page Application (SPA) Routing no TapTable via `vercel.json`
* **Data:** 15/10/2026
* **Contexto:** Ao dar reload em rotas profundas do TapTable (ex: `/mesa/:id/comanda`), a Vercel retornava 404.
* **Decisão Tomada:** Adicionado arquivo `vercel.json` na raiz de `taptable-app` com rewrite `source: "/(.*)" -> destination: "/index.html"`.

### ADR 004: Arsenal Modular e Orquestração de Skills no Antigravity (`NXA Skills Engine`)
* **Data:** 16/10/2026
* **Contexto:** Necessidade de dotar os agentes do Antigravity de inteligência especializada para desenvolvimento SaaS (React 19, Motion, 3D WebGL, Supabase, Flutter, A11y, Performance).
* **Decisão Tomada:** Criação do **NXA Skills Engine** com 52 skills modulares e 7 workflows slash (`/create-saas`, `/upgrade-ui`, `/cinematic-motion`, `/create-3d`, `/audit-project`, `/optimize-saas`, `/review-design`). Unificação da descoberta global em `~/.gemini/config/skills/` com *progressive disclosure* e despacho inteligente via `nxa-skill-orchestrator`.
* **Armadilhas Evitadas:** Bibliotecas de runtime (Three.js, GSAP, Supabase) nunca devem ser instaladas globalmente; apenas skills e referências de engenharia são carregadas sob demanda. Backup de configurações preservado em `~/.gemini/backups/`.

### ADR 005: Modularização do Engine 3D e Sincronização Sensorial do Caraíva Digital
* **Data:** 16/10/2026
* **Contexto:** `CaraivaCartoon3DMap.tsx` acumulava 943 linhas dentro de um único `useEffect`, gerando acoplamento entre shaders de água, relevo de dunas, modelos de casinhas coloniais e trilha pedonal de navegação.
* **Decisão Tomada:** Desmembramento do motor gráfico em submódulos isolados sob `src/components/guia/live-map/engine/`:
  1. `WaterShaderMaterial.ts`: Custom shaders GLSL para Rio e Mar com reflexos dourados e ondulação com tempo uniforme.
  2. `TerrainMesh.ts`: Malha procedural da península de areia e geometria de becos batidos em tubo 3D.
  3. `ColonialBuildingFactory.ts`: Fábrica procedural de casinhas baianas com telhado terracota, portas rústicas e sprites com emoji.
  4. `HistoricalChurchModel.ts`: Modelo tridimensional estilizado da histórica Igreja de São Sebastião com torre e cruz.
  5. `NavigationTrailMesh.ts`: Tubo esmeralda de iluminação noturna na areia com pegadas e avatar nativo 3D.
  6. Integração do serviço `taptableSyncService.ts` com live status de mesas livres e suporte a NFC.
  7. Atualização do `vite.config.ts` com `manualChunks` (`vendor-three`, `vendor-maplibre`, `vendor-react`) e branding PWA Dark Luxury.

### ADR 006: Caraíva Spatial Business OS (VisionOS + Claymorphism 3D + KDS Operacional)
* **Data:** 16/10/2026
* **Contexto:** Necessidade de transformar o painel do parceiro (`/business` e `/parceiros/painel`) em uma experiência tátil de Big Tech (Apple VisionOS, Google Labs, IBM Carbon) com KDS em tempo real, interruptores de pausa imediata de cardápio e telemetria de fluxo da vila com hardware NFC.
* **Decisão Tomada:** Implementado o componente `CaraivaSpatialBusinessCockpit.tsx` em React 19 + Framer Motion (`motion/react`) com:
  1. *Estética Spatial Dark Luxury:* Fundo `#060B0E`, gradientes volumétricos esmeralda (`#4EEDB2`) e dourado (`#FFD15C`), relevo tátil (*claymorphism*) com sombras duplas internas e externas.
  2. *KDS de Cozinha 3D:* Máquina de estados para pedidos com badges de SLA, pins de quarto/mesa NFC e avanço tátil em 1 clique (*Novo ➔ Cozinha ➔ Pronto ➔ Despachado*).
  3. *Pausa Imediata de Cardápio:* Interruptores com física de mola para esgotar itens instantaneamente em toda a vila.
  4. *Telemetria Espacial & Placa NFC:* Indicadores de visitantes online (524) e turistas caminhando em direção ao estabelecimento (63), com simulador 3D da placa acrílica Black Piano.
  5. *Modo Híbrido:* Botão de alternância instantânea entre o Cockpit 3D Espacial e o Painel Clássico de Parceiros.
* **Armadilhas Evitadas:** Uso de `as const` em arrays com propriedades opcionais resolvidas através de tipagem explícita `CockpitTabItem[]` sem tolerância a `any`. Clean up obrigatório de timers de toast via `useRef`.

---

## ⚠️ 4. ARMADILHAS EVITADAS & LIÇÕES APRENDIDAS (NÃO REPETIR)

1. **Evitar concorrência de Remotion Players:** Nunca colocar `<Player />` do Remotion dentro de listas com scroll infinito (`map()`). Isso trava o navegador móvel. Use sempre `<video loop autoPlay muted playsInline>` com assets pré-renderizados.
2. **Respeitar o Sol e Ergonomia da Areia:** Em Caraíva, o contraste precisa ser extremo. A paleta Dark Luxury (`#090B0C`) com detalhes em Dourado (`#F6C945`) e Areia (`#FFF4ED`) foi desenhada para leitura nítida sob luz solar intensa.
3. **Respeitar RLS em Supabase:** Não tentar contornar políticas de segurança desativando RLS em tabelas de produção. Sempre criar políticas baseadas no `auth.uid()` ou chaves de serviço nas Edge Functions.
4. **Isolamento de Branches e Builds:** O projeto `taptable-app` usa Vite + React 19 + Tailwind v4, enquanto `caraiva-ecosystem` usa Next.js 14 + React 18. Não tentar forçar as mesmas dependências cruzadas entre diretórios sem monorepo configurado com workspaces.
5. **Code Splitting de Motores Pesados (Three.js e MapLibre):** Empacotar Three.js e MapLibre no mesmo bundle bloqueia o First Contentful Paint (FCP) em redes móveis de 3G/4G na praia. A divisão explícita em `manualChunks` no Vite garante carregamento assíncrono e instantâneo da casca do app.

---

## 🚀 5. ROADMAP ATIVO & PRÓXIMAS METAS DE INTEGRAÇÃO

### Sprint Atual (Integração e Cinema Dark Luxury):
- [x] **Passo 1:** Conectar o status de mesas do `taptable-app` aos cards sensoriais 3D no `caraiva-integration` (`taptableSyncService.ts` + `BusinessCard3D.tsx`).
- [x] **Passo 2:** Modularizar o mapa 3D com shaders GLSL e modelos coloniais procedurais (`TerrainMesh`, `WaterShaderMaterial`, `ColonialBuildingFactory`).
- [x] **Passo 3:** Integrar o *Caraíva Living Orb* com feedback tátil e 5 estados dinâmicos (`standard`, `live`, `thinking`, `pin`, `nfc`).
- [x] **Passo 4:** Criar a Tábua de Marés interativa com diagnóstico preditivo para travessia a pé (Satu & Corumbau) e Dark Luxury.
- [x] **Passo 5:** Otimizar empacotamento com Vite code-splitting e PWA resilience (`manifest.webmanifest` + `sw.js`).
- [x] **Passo 6:** Implementar o Cardápio Vivo com Comanda Flutuante (Bandeja na Areia), Sommelier IA da Maré e Reservas com Inteligência Solar (Pôr do Sol, Luau, Sombra de Amendoeira).
- [ ] **Passo 7:** Renderizar loops de vídeo de pratos em Remotion para exibição no cardápio de mesas do TapTable.

---

## 📝 6. DIRETRIZ DE ATUALIZAÇÃO PARA OS AGENTES (COMO ATUALIZAR ESTE ARQUIVO)

Sempre que em um chat você:
1. Concluir uma funcionalidade ou milestone -> marque o checkbox no Roadmap ou adicione novas metas.
2. Tomar uma nova decisão de arquitetura -> crie uma nova seção em *ADRs*.
3. Encontrar e corrigir um bug sutil -> registre em *Armadilhas Evitadas*.
4. Identificar uma nova sinergia entre projetos -> atualize a tabela de módulos e a seção de integração.

*Mantenha esta memória viva para que o ecossistema evolua a cada linha de código digitada.*
