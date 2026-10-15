# Caraíva Digital — tema, rotas e passeio em POV

Escopo: exclusivamente `/guia`, mantendo telas, dados, Orb, Agora, busca, salvos, mapa e onboarding existentes. Tema é uma camada visual sobre o produto atual. Não recriar o guia como galeria de fotos.

## Auditoria do mapa em 8 de outubro de 2026

- A tela ativa importa `components/guia/live-map/CaraivaLiveMap.tsx`, com motores Google 3D, Google 2D e mapa ilustrado de contingência.
- O motor 3D usa Map3DElement, marcadores, agrupamento e flyCameraTo. Não desenha trajeto nem acompanha uma caminhada por uma polyline.
- O GPS existe em `services/maps/geolocation.ts`, com getCurrentPosition e watchPosition. O hook substitui posições a mais de 50 km pelo centro da vila. Isso precisa ser apresentado como exploração, nunca origem real do telefone.
- O mapa ativo usa distância em linha reta e tempo estimado. A busca atual filtra os estabelecimentos do cadastro; não resolve qualquer endereço do mundo.
- `services/maps/routes.ts` calcula trajetos a pé em componentes antigos. A tela ativa não o chama. Em falhas, o serviço devolve caminho direto entre origem e destino. Antes de reutilizá-lo, separar resultado real de estimativa, preservar avisos/autoria e impedir instruções de navegação baseadas em linha reta.
- Ainda não existe evidência de cobertura fotogramétrica de todas as ruas de Caraíva. Terreno com imagem de satélite e câmera inclinada não garante edifícios e fachadas em 3D.

## Fases e critérios de entrega

| Fase | Entrega | Condição para avançar |
|---|---|---|
| 1 — Identidade atual | Alternância claro/escuro, preferência local, fotos reais com créditos no hero e cards; transições e profundidade no produto existente | Todas as abas, controles, modais e ações preservados; celular sem sobreposição; movimento reduzido respeitado |
| 2 — Rota do telefone | Origem GPS explícita, destino cadastrado ou busca de endereço, trajeto a pé 2D, distância/tempo do provedor, etapas, cancelar rota | GPS negado/impreciso/fora da vila tratados; API autorizada; caminhos conferidos; falhas nunca viram rotas retas navegáveis |
| 3 — Caminhada assistida | Acompanhar posição, orientação do trajeto, próxima instrução, progresso, recalcular ao sair do caminho, retomar após interrupção | Testes reais a pé em Caraíva e simulação de sinal ruim; atualização sem tremer a câmera; bateria e desempenho aceitáveis |
| 4 — Prévia 3D | A mesma rota em Polyline3D; câmera percorrendo o caminho; reproduzir/pausar/velocidade; volta ao 2D | Cobertura e conta confirmadas, aparelhos suportados, trajeto consistente com o 2D. Identificar como simulação, não posição ao vivo |
| 5 — POV ao nível da rua | Panoramas disponíveis por trecho ou captação 360 própria; direção de olhar e pontos conectados à rota | Inventário de cobertura, continuidade, direitos de uso e georreferenciamento. Trechos sem panorama recebem mapa, não fachada inventada |
| 6 — Rotas com a cara da vila | Mais curta, beira-rio, pontos de interesse e paradas; posteriormente sombra e acessibilidade onde houver dados verificados | Rede local de caminhos e atributos confirmados; critérios transparentes; nenhuma alegação de segurança/acessibilidade sem informação suficiente |

## Experiência proposta

No perfil atual: **Como chegar** → **Da minha localização / Escolher origem** → rota 2D → **Iniciar caminhada** ou **Ver passeio 3D**. No passeio: pausar, mudar velocidade, retornar ao trajeto e escolher 2D. Modo demonstração fica separado de GPS ao vivo. Links de QR/NFC podem abrir o destino pré-selecionado sem solicitar localização antes da ação do visitante.

O POV tem dois níveis distintos: câmera seguindo uma rota no terreno 3D e visão fotográfica ao nível dos olhos. O primeiro é tecnicamente viável com o mapa atual após a integração de rotas; o segundo depende de dados reais de superfície/panoramas. Não prometer réplica exata do vilarejo inteiro sem confirmar ou produzir esses dados.

## Fontes técnicas

- Câmera: https://developers.google.com/maps/documentation/javascript/3d/animate-camera
- Polylines 3D: https://developers.google.com/maps/documentation/javascript/3d/shapes-lines
- Cobertura de terreno e superfície: https://developers.google.com/maps/documentation/javascript/3d/coverage
- Panoramas e POV: https://developers.google.com/maps/documentation/javascript/streetview
- Opções e limitações de percursos a pé: https://developers.google.com/maps/documentation/routes/route-opt
- GPS: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition

No celular, GPS requer permissão e origem segura (HTTPS; localhost é exceção de desenvolvimento). O endereço 127.0.0.1 do computador não serve como endereço público no telefone. Confirmar configuração, autorização das APIs e cobertura antes da fase de navegação 3D; não realizar contratação nesta entrega.
