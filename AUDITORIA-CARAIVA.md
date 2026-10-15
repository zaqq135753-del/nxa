# Auditoria Caraíva Digital e plano de implementação

Data: 7 de outubro de 2026. Origem: `C:/Users/zaqq1/OneDrive/1/fluu.yi/kamra-pms`.
Nenhum arquivo do PMS foi alterado durante a auditoria. O redesign fica limitado à Sprint A.

## Arquitetura e navegação reais

O projeto é um PMS Frappe/Python (`kamra/`, doctypes, APIs, testes de backend) com SPA React 19 + TypeScript + Vite + Tailwind 4 em `frontend/`. O package.json raiz é apenas um entrypoint para instalar/buildar o frontend. Há documentação, branding e duas cópias externas de exemplos de mapa (`google-map-clone-repo/`, `js-3d-area-explorer-repo/`); não são a página principal do guia.

`frontend/src/App.tsx:63` carrega GuiaCaraivaApp via lazy import; linha 258 registra `path="guia"` fora de RequireAuth e AppShell. Início → Explorar / Agora / Mapa / Salvos são estados da mesma página, não subrotas. Concierge e painel Business também são estados internos. Seleção de negócio abre um modal; mapa recebe o negócio focalizado. Refresh volta à Home, sem preservar aba/filtros. O portal separado `/business/:slug`, conta, admin e ativação de parceiro têm suas próprias telas.

BrowserRouter em main.tsx usa `lib/routing.ts`: em dev e vercel.app, `/guia`; em Frappe produção, `/kamra/guia`. Vercel tem rewrite de todas as rotas para index.html. Frappe possui regra `/kamra/<path:app_path>` em hooks.py, mas não redireciona `/guia` diretamente. Domínio próprio standalone depende de VITE_ROUTER_BASENAME=/ para evitar basename /kamra. O refresh de produção exige conferir qual modalidade está realmente implantada; não foi feito deploy nesta tarefa.

## Mapa de arquivos

Todos os caminhos abaixo são relativos a `frontend/`:

| Parte | Arquivos ativos / localização |
|---|---|
| Shell, header, bottom nav, Explorar | src/screens/GuiaCaraivaApp.tsx; header/nav e filtros de Explorar estão inline |
| Home | components/guia/CaraivaCinematicHero, CaraivaIntentionsBar, StoriesEngine, CaraivaNowSection, CaraivaNearYouSection |
| Agora | components/guia/CaraivaAgoraScreen.tsx, CARAIVA_NOW_ACTIVITIES e CARAIVA_EVENTS |
| Mapa | CaraivaGoogleMap → CaraivaGoogleMapClone / Caraiva3DAreaExplorerGoogle / GuideGoogleMapExperience |
| Rotas/fachadas/localização | services/maps/{googleMapsLoader,geolocation,routes,places,streetView,types}.ts; StreetViewModal, NavigationBottomSheet |
| Salvos/roteiro | CaraivaSavedScreen.tsx; services/favoritesService.ts; localStorage + evento caraiva:favorites-updated |
| Perfil | CaraivaBusinessDetailModal.tsx: fotos, detalhes, ofertas, eventos, WhatsApp, salvos e rotas; services/businessMediaService.ts e maps/places.ts |
| Concierge ativo | CaraivaConciergeScreen.tsx + services/conciergeProvider.ts; provider determinístico local |
| Clima/maré/câmera/stories | TideWeatherAiModal, MultimodalCameraModal, StoriesEngine; data/caraivaIntelligence.ts; services/caraivaAiService.ts; utils/caraivaAudio.ts |
| Business embutido | CaraivaMerchantPanel.tsx; analytics, adminSalesService, dados de negócios |
| Dados | data/{caraivaDigitalData,caraivaSpots,caraivaIntelligence}.ts; lib/caraivaData.ts é outra fonte presente no projeto |
| Estilos | src/index.css, src/theme/tamikua.css, classes Tailwind inline; CSS global compartilhado com PMS |
| Assets | public/assets/{brand,route,properties,placeholders}, media-manifest.json, ícones, manifest.webmanifest, sw.js; muitas imagens remotas Unsplash |
| Globais compartilhados | App, main, ErrorBoundary, ConnectionBanner, AuthProvider, CashierAuthProvider, lib/{api,auth,cashierAuth,routing,theme,dir,i18n,asset} |

O arquivo `guia-import-graph.json` complementa esta lista com o grafo transitivo de imports locais da página e classificação de componentes fora desse grafo. Estar fora do grafo não prova que um arquivo está obsoleto no projeto inteiro.

## Integrações e limites observados

- Google Maps usa loader compartilhado e chave padrão no código, além da variável de ambiente. Conferir restrições de domínio/APIs em tarefa própria; não reproduzir chave em documentos. Geolocalização vem do navegador; rotas/fachadas dependem de Google. O mapa padrão é clone; o alternativo 3D usa Cesium/Google Tiles. Three.js está em variantes de mapas locais, não é obrigatório para a nova Orb.
- OpenAI: caraivaAiService possui chamadas diretas do navegador e chave armazenada no navegador. Escopo futuro: backend/proxy e proteção da chave. Concierge principal usa MockConciergeProvider; não confundir roteiro local com serviço de IA em produção.
- Dados ambientais, stories, contatos e algumas atividades são demonstrativos. O banner já reconhece essa condição. AmbientContextEngine usa hora do dispositivo e textos fixos, incluindo supostas condições ao vivo; não deve alimentar o novo header como telemetria real.
- Analytics registra eventos em localStorage/sessionStorage e dispara eventos locais; não é pipeline de métricas multiusuário. Há eventos para perfil, WhatsApp, favoritos, busca, oferta, evento e reserva. Rank não foi localizado como mecanismo efetivo de pontuação do guia.
- QR existe no PMS (/menu/:outlet) e na ativação de parceiro (/partner/activate/:token), porém não é atribuição de QR/NFC do perfil público. Não foi encontrado fluxo NFC dedicado no guia.
- Não há dependência cliente Supabase no package.json do frontend nem integração ativa identificada no grafo do guia. Não inferir banco efetivo a partir de textos demonstrativos de telas de saúde.
- Áudio Web Audio está presente tanto no shell quanto no hero; podem exibir estados de controle inconsistentes. Sem alteração nesta sprint.

## Riscos e legado

- Git: a raiz descoberta é `.../fluu.yi`, branch feat/fluu-v2-experience; kamra-pms inteiro é untracked. Alterar a branch pai não protegeria o frontend e misturaria trabalho externo. Criada cópia isolada `caraiva-sprint-a`, snapshot baseline 0b948f3 e branch feature/caraiva-guide-sprint-a. Sem envs copiados; node_modules reutilizado por junction local, ignorada pelo Git. A branch é da cópia, não do repositório pai.
- Múltiplos mapas presentes. DestinationOrb, CaraivaSmartSearch e componentes de ambiente/feed não aparecem como imports diretos da página atual. Manter variantes até confirmar consumidores e intenção; nenhuma remoção autorizada nesta sprint.
- Header atual tem elemento div clicável e pequenos alvos de toque; bottom nav não trata safe-area e não destaca o botão Agora como centro contextual.
- Index carrega Cesium globalmente para todo PMS. PWA registra sw.js quando caminho começa /guia; não cobre /kamra/guia. O worker intercepta GETs amplamente e remove outros caches na ativação. Rever isolamento/cache em sprint própria.
- ConnectionBanner global pode cobrir topo do guia quando API Frappe está ausente. Não alterar sem revisar efeitos no PMS.
- Header e navegação internos não persistem no histórico. Perfil não possui permalink próprio. Agora tem filtro temporal cujo comportamento ainda é limitado; o callback de rota não é passado ao Agora pela página atual. Questões para Agora 2.0, preservadas nesta Sprint A.

## Baseline

- Dependências já instaladas; nenhum install ou atualização de lockfile.
- `tsc --noEmit --incremental false`: passou (sem escrever cache no original).
- Build Vite de produção: passou (1868 módulos, aviso preexistente de chunk >500 kB; guia ~212.52 kB, bundle principal ~690.37 kB). Saída direcionada ao workspace, preservando assets compilados do Frappe. Primeiro build sob sandbox falhou por acesso do esbuild; execução autorizada fora do sandbox passou.
- Script existente scripts/test_auth_rbac_idor.mjs executado em cópia com URL adaptada para 127.0.0.1:5186. Teste 1 acesso público ao guia: passou. Teste 2 login: falhou porque a tela atual mostra Login Suspenso e não a UI esperada. Suite interrompe nesse ponto; não afirmar testes RBAC/IDOR aprovados. Nenhum script npm test ou lint está definido.
- Backend Frappe e banco não inicializados nesta máquina para a auditoria; testes Python/Frappe não executados. Não há mudança de backend na Sprint A.

## Plano cirúrgico

1. **Sprint A autorizada agora:** Living Header com relógio de Caraíva (America/Bahia) e saudação/contexto por período; dock cinco destinos com Agora central contextual; Orb com atalhos funcionais para serviços já existentes; responsividade, foco por teclado, reduced-motion e safe-area. Contexto por horário é editorial, sem alegar maré/clima/eventos ao vivo. Preservar Home, filtros, perfil e serviços. Validar em mobile, tablet, desktop e landscape antes de aplicar ao original.
2. **Home 2.0 + busca:** extrair Home/Explorar sem modificar router global; unificar entrada de busca com normalização de acentos, categoria, vibe, vazio/carregamento e resultados; contratos de dados tipados. Reutilizar stories e cartões após revisar dados demonstrativos e direitos dos assets.
3. **Explorar 2.0 + Agora 2.0:** separar componentes e estado; filtros reais de período e abertura, recomendações fundamentadas em dados com timestamp/fonte; integrar ação Agora com contexto além do horário. Garantir foco no negócio e callback de rota funcional. Revisar persistência de aba/URL e refresh em ambos deployments.
4. **Perfil 2.0:** perfil reutilizável, provas/fonte dos dados, fotos, horários, contato e salvos; permalink e QR com resolução pública. Compartilhar serviço de dados com Business sem alterar autorização/PMS.
5. **Preparação Rank:** modelo versionado, fontes verificadas, sinalização de dados ausentes e regras auditáveis; separar relevância de patrocinados. Não transformar métricas locais em ranking público.
6. **Analytics + QR/NFC:** taxonomia de navegação/busca/conversão, deduplicação, endpoint servidor, privacidade/retenção, IDs de campanha/origem, deeplinks de estabelecimento e URL curta de resolução para QR/NFC. Validar atribuição e destino antes de provisionar etiquetas.

## Arquivos confirmados para a Sprint A

Editar somente `src/screens/GuiaCaraivaApp.tsx` e adicionar `src/components/guia/{CaraivaLivingHeader.tsx,CaraivaDock.tsx,CaraivaOrb.tsx,useCaraivaMoment.ts,caraiva-shell.css}`. CSS importado somente pela página e seletores escopados a .caraiva-guide. viewport-fit aplicado/restaurado pela página, evitando mudança global de index.html.

Não tocar: App.tsx, AppShell.tsx, main.tsx, index.html, index.css, theme global, routing/auth/API, serviços/dados/assets existentes, portais Business/admin, backend kamra/, deployment, package/lockfiles, exemplos externos e arquivos do repositório pai. Documentos e evidências de teste ficam no workspace da tarefa. Parar após Sprint A para revisão; nenhuma sprint posterior ou deploy automático.
