# Caraíva Digital — direção consolidada pelas referências

Data: 08/10/2026. Escopo: somente /guia. Base atual: commit local 2c958d1, branch feature/caraiva-living-tech. Projeto original: C:\Users\zaqq1\OneDrive\1\fluu.yi\kamra-pms\frontend.

## Origem e limites do histórico

O link compartilhado não foi recuperado pela web nem pelo navegador. Foi possível ler parte da conversa relacionada “Redefinição UI UX” pela integração do aplicativo e o trabalho “Implementar mapa ilustrado tropical”. A última ideia legível propõe mapa híbrido: ilustrado/cartoon premium para descoberta e geográfico para navegação, com pins, filtros e cards compartilhados. O prompt mestre completo aparece como referência de conteúdo indisponível; não foi recuperado. As duas imagens anexadas nesta conversa são referências visuais, não dados de estabelecimentos, rotas ou geografia.

## Direção aprovada que permanece

Manter interface tecnológica escura, funções atuais, alternância de tema, prioridade mobile, Orb, Agora, navegação, favoritos, integrações e PMS intactos. Não voltar ao clean editorial nem criar um aplicativo paralelo. Aproveitar fotos com origem e créditos conhecidos; não atribuir fotos genéricas ou logos inventados a negócios reais.

## Aplicação das imagens

1. Home: fotografia real ampla de rio/pôr do sol, título Caraíva, busca compacta e legível, clima/maré, Acontecendo agora, intenções, convite à câmera e Pedacinhos da Vila. A imagem inspira hierarquia e acabamento; indicadores demonstrativos precisam manter sua identificação.
2. Explorar: cards verticais com fotografia maior, categoria, estado de abertura, avaliação, resumo, preço, distância e ações de salvar/ver mapa. Filtros compactos, pesquisa e opções secundárias em painel. Não usar preços, notas, nomes ou horários fictícios dos mockups como cadastro.
3. Restaurante: capa e galeria, identidade, ações Como chegar/WhatsApp/reserva quando disponíveis, abas Cardápio/Fotos/Avaliações/Sobre. Mostrar cardápio e avaliações somente quando houver dados, com estado vazio útil.
4. Pousada: mesmo sistema visual, conteúdo específico de acomodações, comodidades, contato e consulta de disponibilidade. Disponibilidade real depende da integração existente; não representar consulta como reserva confirmada.
5. Mapa: rio azul esverdeado, areia clara, vegetação tropical e volumes ilustrados com sombras; pins por categoria, card inferior compacto/expansível, controles separados da área de gesto, modo geográfico preservado. Não transpor literalmente a composição gigante do mockup para um celular de 390 px.
6. Caraíva Lens: tela de câmera própria, enquadramento, captura/galeria e resultado vinculado a um estabelecimento quando houver identificação suficiente. Pedir permissão após ação. Confiança baixa deve permitir confirmar/buscar; visão por imagem não significa realidade aumentada contínua.

## Decisões de navegação

Preservar cinco destinos: Início, Explorar, Agora, Mapa e Salvos. A referência tem duas propostas diferentes para o botão central (Agora e câmera). Na primeira implementação, manter Agora central, como no produto atual, e destacar Lens no convite da Home e no Orb. Mudança contextual do centro fica como decisão futura explícita para não esconder Agora.

## Mapa: descoberta e navegação

O mapa ativo já possui Google 2D, Google 3D e IllustratedMap. O ilustrado usa coordenadas percentuais aproximadas, e não fornece uma projeção GPS confiável. Portanto:

- Primeira entrega: melhorar a camada ilustrada e seus pins/cards, mantendo a indicação de posições aproximadas e opção geográfica. Não desenhar um ponto GPS ou rota real sobre esse desenho sem georreferenciamento.
- Próxima entrega: georreferenciar a base, conferir margens, caminhos e destinos; usar a mesma origem/destino e seleção em todos os modos.
- Rotas: integrar o trajeto real a pé no mapa ativo, com permissões, falhas e avisos adequados. Uma linha reta ou curva ornamental não é uma rota navegável.
- Prévia 3D: câmera percorrendo a mesma rota validada, com pausa/velocidade e indicação de simulação. POV fotográfico depende de cobertura/panoramas ou captação própria.

Não trocar os motores existentes por outro provedor sem necessidade demonstrada. A proposta antiga cita alternativas, mas isso não implica migração aprovada ou necessária.

## Ordem de implementação

A. Fidelidade visual da Home e Explorar: hierarquia, fotografias, cards, tipografia, cores e transições sobre o app atual.
B. Perfis específicos de restaurante e pousada, reaproveitando cadastro e ações existentes.
C. Mapa ilustrado tropical, filtros, pins e bottom sheet; preservar Google 2D/3D e localização.
D. Rotas reais e prévia 3D, depois de validar origem, caminhos, cobertura e integrações.
E. Caraíva Lens com fluxo de identificação, erros e confirmação do lugar.
F. Onboarding separado visitante/estabelecimento, conclusão posterior por link, coleta de logos/fotos oficiais e preparação de caraiva.digital. Não houve configuração de domínio/DNS nesta etapa.

## Componentes envolvidos

- src/screens/GuiaCaraivaApp.tsx — composição e estado do guia.
- src/components/guia/CaraivaCinematicHero.tsx, CaraivaIntentionsBar.tsx, CaraivaSmartSearch.tsx — Home e pesquisa.
- src/components/guia/CaraivaBusinessDetailModal.tsx — perfis, com extração gradual de seções por categoria se necessário.
- src/components/guia/live-map/CaraivaLiveMap.tsx, IllustratedMap.tsx e mapOrb.ts — mapa ilustrado e interface; preservar contratos dos motores geográficos.
- src/components/guia/MultimodalCameraModal.tsx — reaproveitar captura existente na evolução do Lens.
- Estilos exclusivos do guia: manter escopo .caraiva-guide; consolidar regras conflitantes ao evoluir, evitando acúmulo de overrides globais.
- Dados e serviços existentes serão reutilizados. Novos campos devem ter estados vazios e compatibilidade com cadastros antigos.

## Critérios de revisão por fase

Branch segura e verificação de alterações independentes antes de copiar ao original; backup e diffs limitados. Build de base e após alterações, sem sobrescrever saída pública do PMS. Conferência em 320/390 px, paisagem e desktop; nenhum controle sobreposto ou scroll horizontal; tema claro/escuro e movimento reduzido; foco/teclado e safe-area. Fotos carregadas e falhas explícitas. Todas as cinco abas, filtros, salvos, mapa e ações anteriores preservados. Navegação GPS e câmera exigem teste em aparelho físico além da emulação. Revisar cada fase antes de avançar.
