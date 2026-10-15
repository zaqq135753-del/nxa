# Live Map — auditoria e plano Fase 1

Original: C:/Users/zaqq1/OneDrive/1/fluu.yi/kamra-pms. Branch isolada feature/caraiva-live-map-phase-1, baseada em e3cf566 (Sprint A). Nenhuma troca de branch no repositório pai.

Existente: /guia → CaraivaGoogleMap → clone 2D/Cesium/satélite; GPS e Haversine; Business/EventItem com origem dos dados; perfil, menu, rotas, Street View, salvos, analytics e Dock. Sem cliente Supabase ativo. Clima/maré são demonstrativos. Há asset ilustrado da vila e coordenadas percentuais já usadas por CaraivaMap2. Loader instalado v2 lança erro no construtor antigo, atualmente utilizado.

Reutilizar Business/EventItem/CARAIVA_BUSINESSES/CARAIVA_EVENTS, GPS/Haversine, asset da vila, CSS escopado e Dock. Preservar implementações antigas, PMS, cadastro, perfil e serviços de rota. Corrigir loader para API funcional v2, preservando loadGoogleMaps. Remover chave hardcoded; somente VITE_GOOGLE_MAPS_API_KEY. Nenhuma chave/Map ID configurada foi localizada nos arquivos .env do frontend consultado; ausência de configuração permite fallback funcional.

Modificar somente frontend/src/screens/GuiaCaraivaApp.tsx, frontend/src/components/guia/caraiva-shell.css e frontend/src/services/maps/googleMapsLoader.ts. Criar frontend/src/services/maps/liveMapModel.ts e frontend/src/components/guia/live-map/{CaraivaLiveMap.tsx,Google2DMap.tsx,Google3DMap.tsx,IllustratedMap.tsx,mapOrb.ts,live-map.css}. Total: dez arquivos. Documentos/testes/evidências fora do original.

Estratégia: Google Maps JS 3D nativo sob demanda; 2D em saveData/rede lenta/memória baixa/reduced-motion/sem WebGL. Erros/timeouts 3D → 2D → modo ilustrado, com identificação de posições aproximadas. Cobertura de construções/terreno, habilitação/faturamento da API e restrição de origens são dependências externas. Não fabricar cartografia ou telemetria. Não adicionar Three.js cosmético, recriar Earth ou alterar Cesium global/index/PMS. Créditos da plataforma ficam visíveis acima do Dock.

Orbs e clusters são apresentação por escala, sem ranking. Seleção destacada; salvos podem receber halo; parceiro apenas indicador. Aberto/fechado é snapshot do cadastro, explicitamente rotulado. Eventos exigem start_at/end_at válidos; demos não viram alegação ao vivo. Não implementar busca de intenção/Rank nesta fase. Seleção mantém o mapa, exibe identificação simples e permite fechar; cards mini/preview/full pertencem à Fase 2.

Baseline Sprint A: TypeScript/build aprovados, teste de auth já falha em Login Suspenso. Validar typecheck, build e suite existente, modelo/clustering, mobile 360/375/390/393/412/430, desktop/paisagem, GPS local/negado/distante, foco/seleção, filtros e degradação. Usar doubles isolados para contratos Google quando configuração externa ausente, sem afirmar cobertura real da plataforma. Aplicar somente arquivos verificados depois de checar alterações concorrentes. Commits separados foundation/engine/integração. Parar antes da Fase 2; nenhum deploy, banco ou install.
