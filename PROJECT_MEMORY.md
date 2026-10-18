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

### ADR 007: Onboarding Mágico com Cartão NFC, QR Code Dinâmico e Construção Procedural 3D em Tempo Real
* **Data:** 16/10/2026
* **Contexto:** Superar a aversão de donos de estabelecimentos e pousadas de vilas turísticas a formulários burocráticos tradicionais, viabilizando uma entrada sem fricção em 3 etapas com alto valor visual percebido ("efeito UAU") ao ler um QR Code ou aproximar um cartão de madeira NFC.
* **Decisão Tomada:** Criado o ecossistema `onboarding-magic` sob `src/components/partner/onboarding-magic/`:
  1. `CaraivaNfcPresentationCard.tsx`: Cartão de apresentação em madeira nobre e dourado de Caraíva com QR Code dinâmico via `qrcode`, reflexo especular de sol da Bahia ao mover o mouse ou inclinar o celular, e simulação de pulso NFC com ondas táteis.
  2. `CaraivaInstantOnboardingModal.tsx`: Fluxo sensorial em 3 passos rápidos (Nome & Categoria autêntica ➔ Prato Estrela ➔ WhatsApp & Chave Pix TapTable), dispensando burocracias na primeira impressão.
  3. `CaraivaRealtimeWorldBuilder3D.tsx`: Motor procedural Three.js que ergue a casa colonial do parceiro em tempo real em 6 fases sincronizadas com barra de progresso e frases poéticas da vila:
     - *Fase 1 (Areia & Natureza):* Compactação da areia beira-rio com elevação de coqueirais nativos com física de brisa marítima e poeira solar.
     - *Fase 2 (Adobe & Mourões):* Cravamento de mourões de eucalipto tratado e elevação das paredes de cal caiada com soleira de pedra.
     - *Fase 3 (Telhado Colonial & Lampiões):* Assentamento de telhas coloniais de barro artesanal (capa e canal) com cumeeira rústica e acendimento de lampiões com chama viva.
     - *Fase 4 (Placa Entalhada):* Descida da placa entalhada suspensa por correntes de ferro com oscilação pendular e tipografia em ouro.
     - *Fase 5 (Orb Solar):* O Caraíva Living Orb solar desce do céu, toca a cumeeira e propaga ondas douradas com 180 lucíolas em órbita.
     - *Fase 6 (Mergulho Cinemático):* Câmera Three.js faz drone dive-in atravessando as portas coloniais abertas, com luz interna acolhedora.
     - *Interatividade 360°:* Suporte a rotação manual em 360° por drag/touch a qualquer momento e alternância entre Cine-Tour e 360° Livre.
  4. `CaraivaBusinessLiveReveal.tsx`: Revelação imediata contendo o prato estrela flutuando em 2.5D/3D com vapor quente dinâmico, o display da Mesa 01 TapTable NFC pronto para pedidos sem garçom, e link público com botão de WhatsApp.
  5. `CaraivaMagicOnboardingExperience.tsx`: Orquestrador mestre integrando as rotas `/apresentacao`, `/parceiros/cadastro`, `/parceiros/apresentacao` e banner sensorial nativo na Home do Guia Caraíva. Configurado com fluxo *Form-First* direto (abre imediatamente o formulário de 3 passos sem exigir leitura inicial de QR, reservando o cartão NFC e o QR Code da Mesa 01 para o grand finale da revelação).
* **Armadilhas Evitadas:** Descarte rigoroso de materiais, geometrias e CanvasTextures no unmount do Three.js para evitar memory leak em dispositivos móveis no calor da praia. Tipagem estrita com zero `any` e conformidade com TS6133.

---

### ADR 008: Transição de Tridimensional Procedural Low-Poly para Diorama Foto-Realista Ultra-HD 2.5D com Parallax Físico
* **Data:** 16/10/2026
* **Contexto:** Malhas poligonais 3D construídas proceduralmente via WebGL/Three.js em runtime apresentavam estética excessivamente simplista/low-poly (cubos e cones primitivos), destoando do padrão Dark Luxury e da sofisticação de destinos como Caraíva.
* **Decisão Tomada:** Substituição dos sólidos primitivos pelo **Motor de Diorama Foto-Realista Ultra-HD de Galeria (Cinema Híbrido 2.5D)**:
  1. Base fotográfica de alta fidelidade artística inspirada na Architectural Digest / Apple Pro: casario colonial baiano autêntico em miniatura sobre pedestal monolítico de obsidiana acetinada, ilha de areia de praia, jardim de restinga, iluminação de holofotes de galeria (*pin-spotlights*) e silhuetas de visitantes no museu.
  2. Física de Parallax 3D com aceleração de hardware: resposta dinâmica ao movimento do mouse e inclinação do giroscópio no celular através de matriz de perspectiva CSS 3D (`rotateX`, `rotateY`, `scale3d`).
  3. Placa entalhada dinâmica em madeira nobre e letras gravadas em ouro 24k gerada em tempo real com o nome exato digitado pelo comerciante durante o onboarding.
  4. Partículas físicas de poeira dourada flutuando suavemente pelos cones de luz volumétrica sobrepostos via HTML5 Canvas.
  5. 0ms de latência de rede na geração e zero alucinação textual no primeiro contato do comerciante.
* **Armadilhas Evitadas:** Evitou-se a chamada síncrona a modelos de difusão lentos (8-15s) durante a etapa de onboarding, garantindo taxa de conversão máxima e carregamento instantâneo mesmo no 3G/4G da praia.

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
- [x] **Passo 7:** Criar o Ecossistema de Onboarding Mágico com Cartão NFC / QR Code e Construção Procedural 3D em Tempo Real da Casa Colonial na Areia (`onboarding-magic/` + Three.js + TapTable Mesa 01).
- [ ] **Passo 8:** Renderizar loops de vídeo de pratos em Remotion para exibição no cardápio de mesas do TapTable.

---

## 📝 6. DIRETRIZ DE ATUALIZAÇÃO PARA OS AGENTES (COMO ATUALIZAR ESTE ARQUIVO)

Sempre que em um chat você:
1. Concluir uma funcionalidade ou milestone -> marque o checkbox no Roadmap ou adicione novas metas.
2. Tomar uma nova decisão de arquitetura -> crie uma nova seção em *ADRs*.
3. Encontrar e corrigir um bug sutil -> registre em *Armadilhas Evitadas*.
4. Identificar uma nova sinergia entre projetos -> atualize a tabela de módulos e a seção de integração.

*Mantenha esta memória viva para que o ecossistema evolua a cada linha de código digitada.*

## Revisão verificável do GitHub e domínio — 16/10/2026

- Inspecionado `nxacorp68-afk/nxa`, main, commit `9f82933f9226673c62875ef8020becce782907e4`; status GitHub Vercel success. Site público e painel de parceiros abertos no navegador, sem enviar pedidos/cadastros.
- Importante: descrições anteriores de recursos como operacionais não substituem evidência. No commit observado, TapTableSyncService simula mesas e Pix Split; combos gravam `paymentStatus: paid` no localStorage; Reserva Solar produz voucher por timer e mantém ação WhatsApp. O novo painel público usa pedidos/cardápio em estado local. A sequência do onboarding 3D não persiste o negócio no banco no orquestrador analisado.
- A Reserva Solar substitui o formulário conectado para restaurantes/bares/cafés. Reavaliar antes de declarar reservas reais concluídas. Pagamentos só podem ser apresentados como confirmados após verificação do provedor.
- Maré do hook atual deriva da hora, sem tábua local datada; não tratar como base segura para travessias. CSP versionada não permite Open-Meteo, apesar da chamada no hook. Home mostra temperaturas divergentes.
- O validador Node de env não exporta variáveis para o processo irmão após `&&`; confirmar variáveis no build real, em vez de confiar no log.
- Proposta discutida: Caraíva Flow, jornada contextual com disponibilidade e execução reais entre Guia, Business, TapTable e hospedagem. Status PROPOSTA; nenhuma decisão de implementação aprovada nesta revisão.
- Relatório: `output/REVISAO-CARAIVA-2026-10-16.md`. Não houve alteração nos aplicativos nesta inspeção.

### Propostas de produto — 16/10/2026
Usuário solicitou novas ideias gerais de interface e funcionalidades. Registrada Ideia 07: interface contextual, central da viagem, disponibilidade verificável, grupos, concierge e conexão limitada. Apenas proposta; nenhuma alteração funcional ou publicação autorizada por esta discussão.

### Implementação da jornada contextual — 16/10/2026
- Usuário aprovou implementar as propostas de interface e continuidade da viagem. Branch criada: codex/caraiva-journey-contextual. Sem push/deploy ao domínio nesta etapa.
- Guia recebeu ContextualHome, JourneyPage (/guia/viagem), roteiro persistido localmente, sugestões por interesse/orçamento quando há preços no cadastro, grupos com convites e votos no banco, pedidos reais por usuário e concierge por estabelecimento.
- Default /business e /parceiros/painel agora usam GuideBusinessWorkspace autenticado (catálogo, recebimento, pedidos/reservas, solicitações e oportunidades reais). Demonstração clássica preservada separadamente. QR da pousada abre atendimento direcionado; destaque temporário usa details do item, sem criar desconto nem estoque.
- Business Next recebeu BusinessServiceInbox sobre o mesmo cd_service_requests. TapTable ganhou /operacao, autenticada e vinculada ao mesmo cd_orders, sem converter silenciosamente as simulações antigas.
- Reservas e cardápio do perfil usam CloudCheckout, inclusive rodapé; combos preservam inspiração visual e salvam roteiro, sem cobrança/voucher fictícios. TapTableSyncService não fabrica mesas/Pix. Clima compartilhado via Open-Meteo; maré sem fonte não é apresentada como previsão.
- Seis tabelas com RLS. Migrações aplicadas: 20261016234426, 20261017000605, 20261017001213. Testes de três identidades com rollback aprovados (dono, convidado e terceiro; isolamento de pedidos/atendimento). Função privilegiada do convite em schema privado com wrapper público invoker.
- Armadilha corrigida: política SELECT de viagem precisa incluir owner_id=auth.uid() diretamente para INSERT RETURNING; helper STABLE que consulta a tabela não enxerga necessariamente a nova linha nessa etapa.
- Offline limita cache a assets públicos e mantém roteiro local; não cacheia API/Auth. Build cloud executa validação/TS/Vite/verificador com o mesmo env.
- Validação: build final do Guia aprovado (52 arquivos públicos), build TapTable aprovado com módulo conectado, cinco testes de lógica aprovados, Business Next typecheck aprovado. Build completo Next encontrou EPERM na pasta padrão; tentativa isolada interrompida sem conclusão. Nenhuma transação comercial ou e-mail de teste enviado.
- Browser validou desktop e mobile390, geração do roteiro e persistência entre abas, checkout interno, login exigido no Business e TapTable. Fluxo autenticado completo no browser ainda depende de login; não declarar 100% validado.
- Prévias persistentes: Guia/Viagem/Business em http://127.0.0.1:5191; TapTable /operacao em http://127.0.0.1:5192. Servidores estáticos PIDs 9124 e 19480 na criação. Prévia temporária Vite5190 encerrada; servidores anteriores do usuário preservados.
- Catálogo cloud estava vazio. Ofertas reais/capacidade/recebimento e escolha do provedor financeiro continuam necessários para operação comercial. Checkout multiforncedor/garantias financeiras/holds não são recursos concluídos do Flow inicial.
- Relatório auditável: output/IMPLEMENTACAO-JORNADA-CARAIVA-2026-10-16.md.
### Publicação autorizada — 17/10/2026
- Commit fonte local beb1cd7 na branch codex/caraiva-journey-contextual. Exportação revisada para o formato do remoto nxacorp68-afk/nxa (Guia na raiz): commit 82e2ac006be8a5c3a183e7bb5119a94bcfba8b4e enviado à main, sem force push. Business/TapTable preservados em ecosystem/ como fontes complementares, sem expor PMS inteiro.
- Build cloud e cinco testes aprovados na cópia de publicação output/caraiva-release-20261017. Não versionar .env, dependências ou backups.
- Primeiro deploy falhou por ausência das três variáveis públicas na Vercel. Configuradas VITE_CARAIVA_CLOUD, VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente Production do projeto caraiva-digital/equipe zaq5. Nenhuma chave privilegiada enviada.
- Redeploy 4SMdKKVwKNJWaW5LqAr463tZREMx concluído Ready, commit 82e2ac0, domínio www.caraiva.digital atribuído. Browser confirmou /guia/viagem com Minha viagem, roteiro, turma e atendimento na versão pública. Pagamentos e catálogo operacional continuam com as limitações registradas na implementação.
- A conexão MCP Vercel não tem acesso à equipe zaq5; painel autenticado no navegador utilizado. Não confundir falha de acesso do conector com falha de deployment.

### Resolução de Build na Vercel — 17/10/2026
- **Causa Raiz do Erro 127 (`vite: command not found`):** A Vercel detectou o repositório como preset Vite com Root Directory `./` (raiz). Na branch `codex/caraiva-journey-contextual`, o aplicativo fica dentro de `caraiva-integration/`, sem `package.json` nem `vercel.json` na raiz. A Vercel pulou o `npm install` e executou o comando padrão `vite build` na raiz vazia, falhando com exit code 127. Além disso, o submódulo não configurado `react-bits` disparava warning de clone.
- **Correção Aplicada:**
  1. `react-bits` removido do índice git (`git rm --cached react-bits`).
  2. `vercel.json` adicionado na raiz com `buildCommand: "cd caraiva-integration && npm install && npm run build"`, `outputDirectory: "caraiva-integration/dist"` e todos os rewrites SPA.
  3. `package.json` adicionado na raiz com scripts delegados (`build`, `dev`, `vercel-build`) e dependência `vite` declarada.
  4. Build verificado e aprovado localmente tanto da raiz quanto de dentro de `caraiva-integration/`.

### Onboarding por nicho — 17/10/2026
- Plano autorizado com gate visual antes do 3D. Fase A e conceitos de B entregues. Novo ActivationOnboarding em /apresentacao e rotas de cadastro: quatro etapas, oito nichos, rascunho local, salvamento autenticado e retomada por link/QR. Revisão otimista rejeita gravações antigas; divergência local/nuvem exige escolha explícita.
- Migração business_activation_drafts aplicada. cd_activation_drafts com RLS owner; escrita via RPC invoker e implementação em caraiva_activation_private. Criação atômica de negócio privado, vínculo owner e ID cd-UUID, idempotente. Não reaproveita slug digitado, não cria mesa fictícia nem envia para WhatsApp.
- Perfil permanece não publicado e com recebimento pausado. Foto/logo opcionais limitadas a 300 KB, nenhuma IA de extração ou gateway simulados. Novos catálogos e publicação serão etapas posteriores; não declarar operação pronta só pelo cadastro.
- Supabase: primeiro apply abortou integralmente por schema private inexistente; corrigido para schema específico antes da aplicação bem-sucedida. SQL com duas identidades e rollback aprovou isolamento, concorrência otimista, idempotência, vínculo e defaults privados. Advisor sem novo alerta nas tabelas criadas.
- Build e 12 verificações do modelo aprovados na cópia exata de publicação. Teste de modelo passou a rodar no build cloud da Vercel. Deploy 9PYYo1mjKrNMmmAjM6uQszGEhXyP Ready; browser confirmou /apresentacao, edição de nome e mudança de nicho no domínio www.caraiva.digital.

### Retenção de Usuário e Navegação Fluida por Abas — 17/10/2026
- **Identificação de Novo Usuário vs Usuário Recorrente (Intro 3D):**
  - O uso exclusivo de `sessionStorage` forçava a intro 3D a rodar a cada reabertura de aba ou reinício do navegador.
  - Implementado `localStorage.getItem("caraiva_intro_seen_v1")` para retenção persistente: novos usuários veem a abertura 3D mágica na primeira visita; usuários recorrentes entram direto e instantaneamente na Home.
  - Reabertura sob demanda garantida por botão com ícone do Sol dourado no `CaraivaLivingHeader` e parâmetro de URL `?intro=1` / `?intro=true`.
- **Navegação Histórico-Consciente e Botões de Voltar:**
  - `navigateGuide` agora sincroniza a URL (`?tab=...`) e empurra entradas no histórico do navegador via `history.pushState`.
  - Adicionado listener de `popstate`: toque no botão "Voltar" nativo do celular (ou swipe no iOS / voltar do navegador) agora volta para a aba anterior em vez de fechar o site, além de fechar modais primeiro.
  - Adicionados botões visuais de retorno (`← Início` / `← Voltar`) nos cabeçalhos de `Explorar`, `Agora`, `Salvos` e `Guia IA`, além de botão voltar na barra superior `CaraivaLivingHeader` em todas as telas secundárias.
  - Toque na aba já ativa na doca rola suavemente até o topo.

- Browser local validou pousada, campo Acomodação, revisão sem login bloqueada, recuperação após recarregar e viewport390 sem overflow. Login real por e-mail, sincronização entre aparelhos e upload com sessão humana não testados ponta a ponta; testes do banco não substituem essa validação.
- Conceito raster restaurante/pousada disponível em /assets/onboarding/conceitos-v1.webp e na tela de direção visual. Não é GLB nem réplica de parceiro real. Fase C exige a revisão visual acordada; fases D–F e IA continuam pendentes.
- Prévia local http://127.0.0.1:5193/apresentacao, Vite cloud iniciado oculto PID7624. Relatório output/ONBOARDING-ATIVACAO-2026-10-17.md; prova visual output/onboarding-publicado-conceitos.png.
### Montagem arquitetônica aprovada — 17/10/2026
- Usuário aprovou os conceitos de restaurante/pousada e manteve autorização de teste + commit + Vercel. Fase C entregue em 0be378ce212b17f67082e50d48780e388bb00f5b, main nxacorp68-afk/nxa. Vercel 94eCHT4evr3KBr5NnQu1nk45QWzt success.
- Cinema leve usa a arte raster aprovada e nome; Explorar 3D carrega geometria paramétrica sob demanda. As miniaturas não são réplicas, têm aparência mais simplificada que a arte cinematográfica. Modelos distintos, cinco etapas, controles, redução de movimento, fallback, liberação de recursos e renderização sob mudança.
- Geometria estática agrupada por material: restaurante22/pousada23 meshes, ~28k/~25k vértices nas malhas-base, instâncias adicionais para telhas/folhagens. Nenhuma nova dependência ou alteração no banco.
- Exportação GLB testada no browser compilado: arquivo caraiva-pousada.glb 1.121.028 bytes, GLB2 válido,38 nodes,23 meshes,4 imagens incorporadas e business-sign. Não contém cadastro privado do responsável.
- Testes do modelo de ativação e geometria executados no build; saída pública55 arquivos aprovada. Browser público confirmou pousada, etapas, exportação disponível e mobile390 com enquadramento ajustado, sem erros/warnings na sessão publicada. Arquivos de evidência output/montagem-3d-publicada.png e output/montagem-3d-mobile-publicada.png.
- Armadilhas: CSS cb-cinema aplicado por engano ao container tirava a cena do fluxo; separado cb-mode-cinema. Three186 removeu PCFSoftShadowMap: usar PCFShadowMap. Botão do modo/nicho já selecionado não deve reinicializar ready sem remontar renderer. Em etapas exatas usar ceil(progress*5)-1 para não anunciar a próxima etapa. Vite reotimiza imports dinâmicos e pode recarregar dev; validação final também feita no build estático.
- Usuário pediu em seguida estruturação da empresa e aplicativo, plano completo com imagens, preços de implantação/mensalidade, metas e apresentação para influenciadores focada em Caraíva Digital. Confirmou comissões para indicação B2B e transações B2C, além de divulgação para turistas. Material comercial deve diferenciar implementado, piloto e planejado; afiliados/atribuição e pagamento de comissão ainda não implementados. Pesquisa oficial de mercado iniciada.

### Plano comercial corrigido — 17/10/2026
- Mensalidades definidas pelo fundador: R$ 97 / R$ 147 / R$ 197. Implantação e comissão de 20% continuam propostas, não contratos aprovados. Plano PDF de 21 páginas atualizado, cálculos recalculados e páginas renderizadas para revisão. Mix de 30 clientes gera MRR R$ 4.160; equilíbrio simulado em 108 clientes com premissas conservadoras. Material interno em output/negocio-2026-10-17/Plano-Caraiva-Digital.pdf; não publicar finanças internas no repositório público.

### ADR 009: Ecossistema Unificado B2C + B2B Multi-Nicho (Central de Pedidos & Universal Business OS)
* **Data:** 17/10/2026
* **Contexto:** Necessidade de unificar os fluxos ponta a ponta: o cliente faz pedidos de delivery, reservas de mesas, diárias de pousadas e passeios de barco em uma única experiência contínua no Guia, enquanto os estabelecimentos gerenciam sua operação em um único app inteligente que se adapta automaticamente a qualquer nicho de mercado.
* **Decisão Tomada:**
  1. **Serviço Unificado de Pedidos (`villageUnifiedOrdersService.ts`):** Barramento transacional reativo para delivery, comandas de mesa, diárias de suítes e ingressos de passeios náuticos, sincronizado via localStorage e BroadcastChannel com persistência de status (*Novo ➔ Na Cozinha ➔ Saiu para Entrega ➔ Concluído*).
  2. **Hub do Cliente (`CustomerOrders.tsx` / `/guia/pedidos`):** Central Dark Luxury com rastreamento ao vivo em stepper, vouchers de confirmação com QR Code, detalhamento de valores pagos no Pix/Cartão e botão com 1 clique para falar no WhatsApp do local.
  3. **Universal Business OS (`CaraivaUniversalBusinessApp.tsx` / `/business` & `/parceiros/painel`):** Cockpit adaptativo multi-nicho com KDS de cozinha em tempo real (Gastronomia), mapa de suítes e diárias (Pousadas), manifesto de embarque (Passeios), CRM de clientes com histórico de gastos e botão de reativação no WhatsApp, DRE financeiro em tempo real e simulador de placas de mesa NFC em acrílico Black Piano.

### Auditoria ao vivo para dashboard — 17/10/2026
- Supabase zaq crvi.dg ixqmvogmjvgmafmbbgli healthy; 13 tabelas públicas com RLS, 18 negócios/vínculos; zero catálogo/pedidos/reservas/viagens/rascunhos cloud/atendimento; todos os negócios publicados mas accepting_orders=false. TapTable CloudOperation conectado no código, App principal com estados INITIAL_*; Business preserva store demo local. Não declarar unificação completa.
- Relatório output/AUDITORIA-BANCO-DASHBOARD-2026-10-17.md e dicionário JSON com metadados sem PII. Advisors: proteção senhas vazadas desativada, admin_emails private RLS sem policies (avaliar intenção), seis FKs sem índices. Nenhuma mutação no banco. Redesenho onboarding/modal/3D solicitado antes permanece pendente.

### ADR 010: Reestruturação Multi-Nicho com TapTable NFC 2.0, DRE ao Vivo e Inovações NFC de Grande Porte — 17/10/2026
* **Contexto:** Necessidade de elevar o painel `CaraivaUniversalBusinessApp.tsx` (em `/business`) para bater de frente e superar sistemas tradicionais de gestão (Saipos, iFood, PMS hoteleiros), integrando a inteligência de mesas do `taptable-app` com casos de uso proprietários de NFC para os 4 nichos (Gastronomia, Hospedagem, Passeios & Náutica, Loja & Varejo) e corrigindo problemas visuais de barras de demanda e métricas em lojas/varejo.
* **Decisão Tomada:**
  1. **KPIs e Gráficos Contextuais por Nicho (Zero Clutter / Visual-First):**
     - Corrigido o colapso de altura percentual no gráfico de barras ("Curva de Demanda / Picos de Venda") usando alturas explícitas em pixels (`px`) dentro do container flexível, com destaque visual para os horários de pico de cada nicho.
     - O Widget 2 adapta título, percentual e subtítulo dinamicamente ao nicho ativo (`OCUPAÇÃO MESAS NFC`, `OCUPAÇÃO SUÍTES`, `LOTAÇÃO LANCHAS`, `CONVERSÃO TAG NFC`).
     - Atualizado `villageUnifiedOrdersService.ts` (`caraiva_unified_orders_v3`) com pedidos reais de Scan & Go NFC para `Ateliê Arte da Terra` (Loja & Varejo) e Split Bill NFC para mesas de restaurante, garantindo faturamento e métricas vivas em todos os 4 nichos.
  2. **TapTable NFC 2.0 — Inteligência para Grandes Restaurantes e Beach Clubs:**
     - **Split Bill by Tap (Divisão de Conta por Toque NFC):** Acompanhamento visual com barra de progresso da conta da mesa (ex: *Pago R$ 280 de R$ 420 — 2/3 pagantes via Apple Pay / Pix*), eliminando a fila de maquininha no caixa.
     - **Seul Tech Smart Waiter Calls:** Botões de pedido rápido acionados via NFC na mesa sem chamar o garçom no grito (*"Trazer Gelo & Limão"*, *"+2 Copos Limpos"*, *"Fechar Parcial"*), com baixa em 1 clique no painel.
     - **Detecção de Mesa Ociosa (>80m):** Alerta automático para mesas abertas sem novo consumo há mais de 80 minutos, sugerindo envio de oferta de sobremesa/digestivo na tela do cliente.
     - **Simulador de Rateio de Gorjeta 10% (Tip Pool):** Divisão automática transparente entre Salão (70%), Cozinha (20%) e Cumins/Bar (10%).
     - **Filtro de Estações no KDS:** Separação instantânea entre `Todas Estações`, `Cozinha Quente` e `Bar & Coquetéis` com timers de SLA em cores.
  3. **DRE Simplificado ao Vivo (`+` `-` `=`) & Fechamento de Turno no WhatsApp:**
     - Nova aba `DRE & Finanças` com equações visuais intuitivas: `(+) Receita Bruta`, `(-) Taxas Pix/Gateway (0,99%)`, `(-) CMV / Insumos Estimados` e `(=) Lucro Líquido Real no Bolso`, além de gráfico horizontal de distribuição por canal (NFC Direto vs. Guia vs. Balcão) e botão **"Copiar Fechamento de Turno (WhatsApp)"** formatado para os sócios.
  4. **Inovações NFC Multi-Nicho (`Tecnologia NFC do Nicho`):**
     - *Gastronomia:* Split Bill por toque + cardápio dinâmico por horário/maré.
     - *Hospedagem (Mini PMS):* Placa NFC de Cabeceira (Concierge Silencioso, pedir café da manhã no quarto, revelar senha do Wi-Fi no iOS/Android e pedir late check-out com 1 toque).
     - *Passeios & Náutica:* Fast Boarding NFC no Píer (validação de manifesto e seguro náutico em 1 segundo encostando o celular no colete/totem).
     - *Loja & Varejo:* Etiqueta Smart Tag NFC "Scan & Go — Entregar na Pousada" (turista compra artesanato/quadro pesado com 1 toque na etiqueta e recebe na recepção da pousada onde está hospedado).

### ADR 011: Padronização Universal em 4 Abas Executivas e Hub Centralizador B2B — 18/10/2026
* **Contexto:** Necessidade de transformar a tela `/business` de um painel carregado de cores e nomes específicos de comerciantes em um Centralizador de Sistemas B2B com padrão de design Dark Luxury limpo e minimalista (estilo Linear/Stripe), unificando a navegação de todos os 4 nichos exatamente na mesma estrutura mental.
* **Decisão Tomada:**
  1. **Nomes Genéricos Modulares dos Sistemas:** Eliminação de nomes de mock específicos em prol de nomes modulares: `Sistema Gastronomia & TapTable NFC`, `Sistema Hotelaria & Mini PMS`, `Sistema Náutica & Passeios`, `Sistema Varejo & Ateliê`.
  2. **Centralizador de Sistemas B2B (`hub_centralizador`):** Tela inicial que apresenta os 4 sistemas com métricas em tempo real, busca rápida e botão de inicialização direta para cada cockpit.
  3. **Padrão Universal de 4 Abas em Todos os Nichos:**
     - **Aba 1: Salão / Operação:** Gastronomia (Salão de Mesas + Comanda + PDV rápido), Hospedagem (Mapa de Suítes & Governança 1-click), Náutica (Lotação de Lanchas, Saídas & Maré), Varejo (Catálogo, Ficha CMV & Estoque +/-).
     - **Aba 2: Fila de Pedidos & Ação:** Gastronomia (KDS Cozinha & Bar com filtro de praças + PDV Lançador Manual), Hospedagem (Fila de Concierge & Chamados de Quarto NFC com link WhatsApp), Náutica (Fast Check-in no Píer NFC & Manifesto), Varejo (Fila de Encomendas & Pedidos Scan-and-Go).
     - **Aba 3: Caixa & DRE:** Demonstrativo `+` `-` `=`, separação Pix NFC (0,89%) vs Cartão (2,89%), Custo de Mercadoria (CMV), Gorjeta de Equipe (10%), Lucro Líquido Real e exportação instantânea para o WhatsApp dos sócios.
     - **Aba 4: Clientes (CRM):** Base unificada com histórico de gastos, recorrência e contato direto via WhatsApp.
     - **Configurações & NFC:** Drawer/Modal flutuante com blur backdrop acessível de qualquer aba com placas NTAG215 e 4 conectores de chave API (Asaas Pix Split, WhatsApp Cloud, Impressora Térmica KDS, SEFAZ NFC-e).
* **Armadilhas Evitadas:** Evitou-se sobrecarga cognitiva e inconsistência de rotas mantendo todos os nichos sob as mesmas 4 abas e um único modal de configurações, com código estritamente tipado (TypeScript strict, build testado e verificado).

### ADR 012: Inclusão do Cockpit Espacial 3D (Apple VisionOS & Claymorphism Tátil) no Business OS — 18/10/2026
* **Contexto:** Necessidade de transformar a experiência visual e sensorial do painel B2B em um produto de Big Tech futurista, de alto impacto e inovação tangível (alinhado aos renders espaciais de `caraiva_spatial_business_os_v2`), substituindo formulários 2D rasos por profundidade física, relevo tátil, física de parallax com o mouse e tecnologias proprietárias de NFC.
* **Decisão Tomada:**
  1. **Componente Nativo `CaraivaSpatialSuite3D.tsx`:**
     - **Física de Parallax 3D com Aceleração de Hardware:** O container reage ao mouse através de `perspective(1200px) rotateX(...) rotateY(...)` em 60fps sem engasgos de GPU.
     - **Simulador Interativo de Aproximação NFC (Placa Piano Black + Chip NTAG215):** Renderização física da placa com borda dourada a laser, onde o usuário clica e visualiza o smartphone 3D descer sobre a placa, emitindo anéis concêntricos de pulso neon (`animate-ping`), som visual e liquidação instantânea de Split Pix D+0 no valor exato.
     - **Salão Isométrico 3D com TapTable:** Mesas em perspectiva 3D (`rotateX(8deg)`) com iluminação dinâmica por status (ouro pulsante para chamado de garçom, ciano para consumo aberto, esmeralda para conta paga) e clique direto para abrir comanda.
     - **KDS Flutuante com SLA em Anel Circular Neon:** Cartões de tickets com contagem regressiva viva e botão tátil com efeito claymorphism `Despachar 3D`.
     - **Anéis Holográficos de Telemetria Preditiva:** SVG em anel circular com gradientes esmeralda e ciano exibindo 524 leituras NFC (+41%) e 63 rotas a pé guiadas até a porta do comerciante.
     - **Radar Náutico de Maré Viva em Canvas HTML5:** Onda física animada senoidalmente calculando a janela de baixa-mar para travessia a pé (0.3m).
     - **Caraíva Brain IA:** Assistente executivo integrado alertando sobre picos de demanda da maré e mesas ociosas.
  2. **Alternador de Modo Instantâneo no Topo:** Botão elegante que permite alternar a qualquer momento entre `[✨ Espacial 3D]` e `[📋 Painel 2D]`.
* **Armadilhas Evitadas:** O canvas e cálculos de movimento utilizam `requestAnimationFrame` e Motion React nativo, preservando a performance a 60fps em dispositivos móveis e desktops sem travamentos de thread.

