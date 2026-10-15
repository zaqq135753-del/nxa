# Caraíva Digital — auditoria de produto e plano de evolução

Data: 9 de outubro de 2026. Página auditada: https://www.caraiva.digital/guia, acessada pelo domínio caraiva.digital.

## 1. Diagnóstico executivo

O produto já reúne descoberta, catálogo, mapa ilustrado, agenda, roteiros, favoritos, comunidade e área comercial. A identidade da vila e a conexão entre lugares, mapa e contato são ativos que devem ser preservados.

A próxima evolução deve transformar essas possibilidades em três jornadas completas: o turista encontra e organiza o que fazer; o comerciante entra, comprova vínculo e publica informações; a curadoria mantém qualidade e atualidade. A prioridade é consistência e ativação, seguida de diferenciação visual e personalização.

Recomendação de posicionamento: **o companheiro da viagem a Caraíva, da chegada ao próximo encontro na vila**. Para parceiros: **um perfil confiável que transforma descoberta em contatos mensuráveis**.

## 2. Método e limites

- Inspeção pública no navegador de Home, Explorar, perfil, reivindicação, Agora, mapa, Salvos, concierge, stories, câmera, Portal Business e onboarding.
- Verificação visual em viewport estreito e desktop de 1440 × 960. Isso é uma amostra responsiva, não certificação de todos os dispositivos.
- Testes de busca com e sem acento, categoria Praias, filtro Próxima 1h e atualização da página.
- Onboarding turístico percorrido até a conclusão visual; comercial até contato, sem enviar solicitação. Um nome fictício de auditoria foi digitado no rascunho explicitamente local. Nenhuma publicação, contato comercial, compra ou alteração de estabelecimento foi feita.
- Consulta complementar ao código local em caraiva-sprint-a e caraiva-guia-online. Essas cópias não foram comprovadas como o commit exato em produção; achados do código são apoio, não prova automática do backend publicado.
- Não houve acesso autenticado, auditoria do banco, teste de invasão, transação, confirmação de recebimento de formulários ou aferição de desempenho em rede móvel real. Não há pontuação Lighthouse nesta entrega.

## 3. Inventário observado

| Área | Presente na interface | Avaliação e direção |
|---|---|---|
| Home | Hero, busca, intenções, stories, Agora, 19 lugares, clima/maré, câmera | Boa amplitude; reduzir repetição e priorizar a próxima ação |
| Explorar | Busca, categorias, vibes, cartões | Corrigir acentos, relevância e cobertura de categorias |
| Perfil | Fotos, preço, horário, avaliação, fonte, mapa, fachada, WhatsApp, ofertas, reivindicação | Boa base; tornar compartilhável e esclarecer confirmação de dados |
| Agora | Agora, Próxima 1h, Hoje, Noite, Amanhã, categorias e agenda | Filtros precisam corresponder a intervalos reais |
| Mapa | Ilustrado, clusters, lista, busca, filtros, opções 3D/satélite e GPS | Ilustrado carregou; precisão e navegação precisam de contratos distintos |
| Minha Caraíva | Meu Dia, favoritos, compartilhar, concierge | Evoluir para viagem editável, com datas, orçamento e colaboração |
| Concierge | Pedido em texto, presets, atmosfera, companhia, período e roteiro | Personalização e orçamento precisam ser explicáveis |
| Comunidade | Stories e formulário de postagem | Benefício prometido e política de publicação precisam de operação real |
| Câmera | Captura, galeria e ajuda IA | Falha de mídia sem recuperação útil na sessão |
| Business | Indicadores, perfil, ofertas, eventos e QR | Área demonstrativa acessível sem autenticação na sessão |
| Onboarding | Quatro etapas, visitante/negócio, progresso local | Acolhedor; falta ativação comercial com continuidade no servidor |

## 4. Problemas reproduzidos e prioridades

P0: resolver antes de tratar a área como operação comercial. P1: próxima entrega funcional. P2: diferenciação após a base.

| ID | Prioridade | Evidência observada | Impacto | Correção / aceite |
|---|---|---|---|---|
| A01 | P0 | Portal Business abriu sem login, com seletor de estabelecimentos e controles de edição | Confunde demonstração com permissão operacional | Separar demonstração; sessão e autorização por estabelecimento no servidor; usuário de A não lê nem altera dados privados de B |
| A02 | P0 | Portal mostra retorno R$ 5.610, 34 conversões e tempo real | Pode induzir interpretação de receita efetivamente gerada | Identificar exemplos; separar clique, lead, reserva e venda; receita só confirmada ou estimativa com fórmula explícita |
| A03 | P1 | “cafe” → 0; “café” → 5 | Busca comum falha | Mesmos resultados para café/cafe; normalização, sinônimos e ordenação por intenção |
| A04 | P1 | Categoria Praias → 0 | Uma das principais intenções termina vazia | Incluir atrativos como entidade própria; Praia da Barra e demais locais validados devem aparecer em busca, mapa e roteiro |
| A05 | P1 | Próxima 1h manteve os quatro cartões, inclusive atividade de amanhã | Agenda não responde à promessa do filtro | Datas e fuso explícitos; filtrar por sobreposição de intervalos; eventos expirados saem de Agora |
| A06 | P1 | Pôr do sol 16:45–17:45 aparece como acontecendo; relógio do site mostrava cerca de 19:12 | Informações temporais contraditórias | Mesmo relógio e regras em Home, Agora, perfil e mapa; sinalizar dado demonstrativo no próprio cartão |
| A07 | P1 | Onboarding comercial informa rascunho local e convite dependente do servidor | Cliente não sabe como virar parceiro ativo | Persistir candidatura, fornecer protocolo, status e próxima ação; retomar por conta verificada |
| A08 | P1 | Concierge: total R$ 180; paradas visíveis R$ 45 + R$ 60 | Orçamento sem composição | Total derivado das paradas e extras; informar o que está incluído e valores desconhecidos |
| A09 | P1 | Refresh de Explorar volta à Home e apaga busca | Perda de contexto; compartilhamento limitado | URL representa aba, busca e filtros; voltar/avançar/refresh preservam a experiência |
| A10 | P1 | Câmera mostra “Não foi possível abrir a mídia” | Fluxo sem conclusão clara | Mostrar motivo, tentar novamente, enviar da galeria e continuar sem câmera; pedir acesso só após ação explícita |
| A11 | P1 | Maré 0,4 m, 29°C, “últimas vagas” e “ao vivo” junto ao aviso geral de demo | Aviso genérico não esclarece cada decisão | Fonte, horário de atualização e validade por informação; disponibilidade só quando confirmada |
| A12 | P2 | Home extensa, com catálogo completo e vários caminhos repetidos | Excesso de escolha e rolagem | Home com seleção curta e “ver todos”; catálogo completo em Explorar |
| A13 | P2 | Perfil tem controles de galeria sem nome acessível na árvore | Uso por leitor de tela prejudicado | Nomear controles, anunciar slide atual e testar teclado/foco |

O acesso ao Portal Business demonstra exposição de uma interface, não comprova alteração indevida de dados no servidor. Não foi tentado salvar uma edição.

O código local complementa os achados: o filtro temporal inspecionado só distingue noite e amanhã; o concierge usa MockConciergeProvider; analytics adiciona bases demonstrativas de 420 impressões, 185 visualizações e 34 cliques; serviços de parceiros guardam dados em localStorage. Não apresentar esses mecanismos como telemetria multiusuário ou segurança de backend.

## 5. Estrutura proposta de telas

Manter cinco destinos principais: **Início, Explorar, Agora, Mapa e Minha viagem**. Minha viagem reúne favoritos e dias, com entrada discreta para conta. Business tem entrada própria, claramente identificada.

### Início

1. Saudação curta e contexto: “Já estou na vila” / “Estou planejando”.
2. Busca principal com exemplos úteis: almoço até R$ 80, passeio amanhã, café perto do rio.
3. Três ações contextuais, como comer, ver o mapa e organizar meu dia.
4. Seleção de Agora com validade e confirmação.
5. Lugares escolhidos, com motivo da sugestão e identificação de patrocínio.
6. Histórias locais e guia de chegada. Clima e maré ficam em cartão próprio com fonte.

No celular, proteger busca e botões do dock e do teclado. No desktop, usar navegação mais discreta e espaço lateral útil para roteiro/contexto. Consolidar os dois controles de som numa preferência única. Definir tokens de cor e contraste para os temas; o estado observado tinha controle de tema cuja descrição merece revisão de consistência.

### Explorar e perfil

Busca deve reconhecer intenção, categoria, sinônimos e acentos, com alternativas quando não houver correspondência. “Café” deve priorizar locais que servem café a visitantes; pousadas com café de manhã não devem dominar sem indicar acesso a não hóspedes.

Filtros: categoria, preço, aberto no cadastro, serviços, ambiente e acessibilidade informada. Proximidade apenas com origem conhecida; permitir escolher balsa, igreja, hospedagem ou ponto no mapa sem GPS.

Perfis com endereço público estável, galeria real, preços datados, serviços, horários excepcionais e botão principal contextual. “Reservar” via WhatsApp deve ser apresentado como **solicitar reserva**, até haver confirmação. Manter fonte e data já presentes e separar “dados consultados” de “parceiro com vínculo verificado”.

### Agora

Cada ocorrência precisa de início, término, fuso, local, responsável, fonte, atualização e status: programado, confirmado, cancelado ou encerrado. Evento recorrente gera ocorrências por data. “Próxima 1h” usa intervalos, “Hoje” considera o dia local e “Amanhã” considera a próxima data. Filtros de tempo e categoria devem afetar também a seção de programação.

### Mapa

Preservar identidade tropical e geografia real. Separar a camada ilustrada de descoberta da base usada para traçar caminhos. Posição aproximada não deve parecer instrução precisa de deslocamento.

Adicionar rotas por pontos de referência, lista sincronizada com seleção, legendas simples, origem manual e recuperação quando GPS falha. GPS somente após pedido do visitante. O mapa ilustrado e os perfis precisam continuar úteis sem Google 3D. Validar caminhos locais, travessias e acessos com conhecimento de campo.

### Minha viagem e concierge

Viagem com datas opcionais; dias editáveis; reordenar paradas; estimar deslocamento e orçamento; avisar conflitos de horário; permitir substituir uma parada. Cada recomendação informa o motivo e as limitações.

Concierge deve consultar o mesmo catálogo e agenda. A IA pode interpretar o pedido e explicar escolhas; horários, preços, disponibilidade e soma do orçamento vêm de dados estruturados. Se faltarem dados, apresentar alternativa e confirmação, sem completar lacunas como fatos.

## 6. Login para turistas

**Recomendação: conta opcional, oferecida depois do primeiro benefício.** Descobrir, consultar perfil, usar mapa, salvar localmente e montar um primeiro dia devem funcionar sem conta.

Oferecer login ao sincronizar entre aparelhos, colaborar numa viagem, recuperar favoritos ou acompanhar uma solicitação. Mensagem: “Guarde sua viagem e continue de qualquer aparelho”. Opções iniciais: Google e e-mail com link ou código de acesso. Avaliar WhatsApp após medir demanda e custo, sem multiplicar opções na primeira versão.

Ao entrar, unir favoritos locais aos da conta, deduplicando e preservando roteiros. Permitir continuar como visitante, sair da conta e gerenciar preferências. Alertas de viagem são opcionais e independentes do acesso. Localização fica ligada ao uso do mapa, não ao cadastro.

Para comerciantes, exigir identidade autenticada e vínculo verificado antes de edição. Conta, estabelecimento, papel e plano são conceitos separados. Papéis propostos: proprietário, gerente, editor; curador e administrador ficam na operação interna. Convites expiram, são revogáveis e têm uso controlado no servidor.

## 7. Onboarding turístico: valor em poucos toques

Meta inicial a validar com testes: recomendação útil em até 30 segundos, com possibilidade de pular tudo.

| Passo | Pergunta / ação | Obrigatório? | Resultado |
|---|---|---|---|
| 1 | Já está na vila ou está planejando? | Não | Contexto de chegada ou planejamento |
| 2 | O que quer viver? Até três interesses, companhia e ritmo | Não; companhia/ritmo podem ficar em ajuste posterior | Sugestões ordenadas |
| 3 | Mostrar três opções e “Montar meu dia” | Entrega de valor | Primeira ação concreta |
| Depois | Datas, orçamento, restrições e nome | Quando relevantes | Refinamento progressivo |
| Benefício persistente | “Salvar minha viagem entre aparelhos” | Conta opcional | Sincronização |

O fluxo atual tem quatro etapas, incluindo escolha de papel, nome opcional e uma confirmação final. Nas entradas já específicas de turismo ou Business, pular escolha de papel. Trocar a etapa final apenas confirmatória por recomendações clicáveis. “Com crianças” deve ser companhia, separada do ritmo, pois uma família também pode querer explorar.

Aceite: fechar não bloqueia navegação; pular funciona; escolhas mudam sugestões de forma observável; perfil do visitante não é publicado; perda de armazenamento não impede usar o guia.

## 8. Onboarding de novos clientes: do interesse à ativação

O cadastro precisa ser completo ao longo da jornada, sem exigir tudo na primeira tela. Criar entrada pública “Coloque seu negócio no mapa”, com exemplo de perfil, benefícios objetivos, o que o produto entrega e como funciona a aprovação. Quando houver planos, mostrar preço, limites e condições claramente; não inventar promessa de retorno.

### Jornada principal

| Etapa | Conteúdo essencial | Resultado / CTA |
|---|---|---|
| 1. Encontrar negócio | Buscar nome/local; selecionar perfil existente ou cadastrar novo | “Este é meu negócio” / “Meu negócio ainda não aparece” |
| 2. Confirmar contato | Nome do responsável, função, um canal de acesso verificado | Conta e candidatura recuperável |
| 3. Completar o mínimo | Nome, categoria, localização/ponto de referência, contato público, horário e foto autorizada | Prévia do perfil e pendências claras |
| 4. Verificar vínculo | Canal público já conhecido, convite da curadoria ou revisão manual | Status e protocolo; não conceder acesso só por preencher formulário |
| 5. Revisar e enviar | Prévia, origem dos dados e autorização de publicação | “Enviar para análise”; confirmação de recebimento |
| 6. Ativar | Curadoria aprova ou pede ajuste; parceiro testa o perfil | Link público, QR e checklist de primeira semana |

Mostrar estados distintos: rascunho, contato pendente, vínculo em análise, ajustes solicitados, aprovado, publicado e suspenso. “Enviado” exige confirmação do servidor. Em falha de rede, dizer “salvo no aparelho; ainda não enviado” e permitir tentar de novo sem duplicar candidatura.

Solicitar um único contato verificado inicialmente. WhatsApp público do negócio pode diferir do canal privado de acesso do gerente. Campos devem indicar qual será exibido aos turistas. Uploads e descrições são progressivos; informações específicas aparecem conforme categoria.

### Depois da ativação

Checklist com ações úteis: confirmar localização, revisar horário, inserir três fotos próprias/autorizadas, adicionar cardápio ou serviços, testar contato, imprimir QR e criar primeira atualização. Não tratar percentual de preenchimento como única definição de sucesso.

Primeira semana: tarefa de revisão no primeiro acesso; ajuda contextual ao editar; lembretes opcionais para pendências. A operação interna acompanha abandonos, solicitações e tempo de aprovação. Meta de revisão deve ser definida conforme capacidade real da equipe e só então prometida ao cliente.

### Fluxo assistido

Um vendedor ou curador pode preparar um rascunho com dados públicos e enviar convite ao responsável. O parceiro revisa e aprova antes da publicação de dados novos. O sistema registra quem preparou, quem verificou e quem publicou. Evitar repetir cadastro entre reivindicação, boas-vindas e portal.

## 9. Funcionalidades que podem diferenciar o produto

| Ideia | Valor concreto | Dependência / ordem |
|---|---|---|
| Guia de chegada | Travessia, transporte, bagagem, pontos de referência e primeiras necessidades | Conteúdo local validado; alta prioridade |
| Modo de conexão fraca | Favoritos, informações essenciais e último roteiro disponíveis | Cache com data e estado de atualização; alta prioridade |
| Viagem em grupo | Amigos sugerem e votam em paradas | Conta, permissões e links revogáveis; após sincronização |
| Passaporte da vila | Colecionar experiências culturais e descobertas | Curadoria local; benefícios só com acordo dos parceiros |
| Roteiros de moradores | Percursos autorais com autoria, contexto e remuneração quando aplicável | Participação e autorização da comunidade |
| Agenda de confiança | Publicação simples por parceiros, validade automática e cancelamento | Backend, moderação e dados temporais |
| QR por origem | Distinguir pousada, mesa, recepção e campanha | URLs estáveis, atribuição e métricas reais |
| Recepção digital para pousadas | Guia de chegada e seleção de dicas da hospedagem | Perfil e roteiros compartilháveis |
| Pedidos acompanháveis | Turista acompanha solicitação e comerciante responde | Operação de atendimento; depois de validar leads |
| Assistente visual | Foto ajuda a localizar item ou lugar do catálogo | Consentimento, recuperação de falhas e identificação incerta explícita |

Não começaria por feed social aberto, realidade aumentada ou checkout completo. São propostas para depois de medir uso, garantir moderação e estabelecer operação. O mapa, a agenda e a viagem pessoal já oferecem um eixo forte de diferenciação.

## 10. Confiança, operação e crescimento

- Curadoria com fila de perfis, reivindicações, eventos, correções e denúncias. Toda decisão tem responsável, data e histórico.
- Informações têm fonte, última revisão e validade. Clima e maré precisam de fonte adequada e atualização; expiração deve retirar aparência de tempo real.
- Publicação comunitária precisa de regras, direitos de imagem, moderação e denúncia. Não prometer “mimos” sem um benefício realmente definido e resgatável.
- Métricas comerciais: exposição, perfil aberto, clique de contato, rota solicitada, lead confirmado, reserva confirmada e venda confirmada. Clique no WhatsApp não prova mensagem enviada nem compra.
- Busca pública: páginas próprias para lugares e guias, títulos/descrições, imagem de compartilhamento, sitemap e redirecionamentos. Validar indexação e metadados em uma etapa técnica específica.
- Desempenho: medir primeiro; carregar mídia e 3D sob demanda, comprimir imagens, tratar rede lenta e manter conteúdo essencial disponível. Metas propostas de campo: LCP até 2,5 s, INP até 200 ms e CLS até 0,1 no percentil 75; resultados atuais não foram medidos.
- Acessibilidade: contraste, foco, botões nomeados, teclado, avisos anunciados, modais, movimento reduzido e zoom. Mapas sempre com alternativa em lista.

## 11. Sequência de execução e critérios de conclusão

| Entrega | Escopo | Concluída quando |
|---|---|---|
| 1. Confiança e base | Separar demo/operacional; acesso Business; busca; agenda; estados vazios; câmera | Acentos equivalentes, filtros corretos, dados demo identificados e permissões verificadas no servidor |
| 2. Entrada e ativação | Onboarding turístico curto; candidatura única; recuperação; curadoria | Cliente retoma em outro aparelho, envia uma vez, acompanha status e recebe perfil aprovado |
| 3. Viagem e navegação | URLs estáveis, datas, edição do dia, soma de orçamento, origem manual, sincronização opcional | Refresh preserva contexto; viagem mantém dados; caminhos têm origem e precisão claras |
| 4. Diferenciação | Agenda publicada por parceiros, modo de conexão fraca, QR por origem, grupos | Uso real medido; conteúdo tem validade; atribuição não infla conversões |

Definir prazo e esforço somente depois de confirmar backend, versão publicada, equipe e capacidade de curadoria. As entregas são sequenciais por dependência, não estimativas de calendário.

## 12. Medição e validação

Turistas: busca sem resultado, abertura de perfil, primeiro favorito, primeiro dia criado, contato solicitado, retorno durante a viagem e adoção de sincronização. Medir por sessão/usuário conforme consentimento e desenho de privacidade; não somar recarregamentos como novos leads.

Parceiros: início de candidatura, abandono por etapa, contato verificado, envio, tempo até aprovação, publicação e primeira interação qualificada. Indicador central: **parceiro publicado que mantém dados atuais e recebe contato útil**, com definição verificável de contato.

Testes de aceite: café/cafe; praias com catálogo de atrativos; agenda antes/depois da meia-noite; evento cancelado; fuso da vila; orçamento parcial; GPS negado; câmera indisponível; rede interrompida; retomada em outro aparelho; dupla submissão; convite expirado; acesso entre dois estabelecimentos; moderação; refresh e links compartilhados. Testar em 320/390/768/1440 px, teclado, leitor de tela e Android/iOS reais quando disponíveis.

Meta de produto a validar: reduzir o tempo até a primeira descoberta útil e o tempo entre interesse comercial e perfil ativo. Estabelecer a linha de base antes de prometer aumento de conversão.

## 13. Decisões recomendadas agora

1. Preservar o mapa ilustrado e a identidade da vila.
2. Priorizar confiabilidade de busca, agenda e dados antes de acrescentar superfícies.
3. Manter turismo sem cadastro obrigatório; pedir conta pelo benefício de guardar e compartilhar a viagem.
4. Unificar cadastro comercial, reivindicação e convite numa candidatura recuperável.
5. Exigir autorização real por estabelecimento e demonstrar métricas com transparência.
6. Usar chegada, viagem pessoal, agenda confiável e parceria local como diferenciais principais.

Esta entrega é auditoria e especificação de evolução. Não houve alteração de código nem publicação em produção.
