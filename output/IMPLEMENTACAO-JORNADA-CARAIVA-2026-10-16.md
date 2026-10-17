# Caraíva: jornada contextual e operação conectada

Implementação autorizada pelo usuário em 16/10/2026. Branch: `codex/caraiva-journey-contextual`. Alterações locais anteriores preservadas. Nenhum push ou deploy ao domínio foi realizado nesta etapa.

## Entregas

| Área | Implementação | Limite explícito |
|---|---|---|
| Home contextual | Próxima solicitação em andamento, retomada do roteiro e atalhos para pedidos e grupo | Pedidos exigem autenticação; roteiro inicial é local |
| Minha viagem | `/guia/viagem`, roteiro, pedidos/reservas do usuário, cancelamento pelo RPC existente e atendimento | Sem comprovantes financeiros fictícios; status depende do servidor |
| Caraíva Flow inicial | Sugestão de etapas por interesse, categorias, horários e orçamento quando há faixa de preço no cadastro | Não efetua reservas em lote; preços de cadastro não são uma cotação garantida |
| Cards | Teclado, profundidade para ponteiro preciso, redução de movimentos, consulta compartilhada de recebimento e catálogo | Sem contadores aleatórios de mesas; horário e distância são dados do cadastro/estimativas |
| Busca | Normalização de acentos, sinônimos e consultas por características do catálogo | Busca determinística; não apresentada como um novo modelo de IA contratado |
| Grupos | Criação, convites revogáveis por substituição com validade de sete dias, propostas e votos no Supabase | Grupo não vê pedidos nem contatos individuais; votação não reserva nem cobra |
| Concierge | Solicitações privadas por estabelecimento, estados operacionais e QR de atendimento da pousada | Não é atendimento de emergência; o parceiro precisa responder |
| Business | Portal autenticado, catálogo, pausa de recebimento, pedidos/reservas, atendimento e oportunidades baseadas nos registros | Métricas limitadas aos 100 pedidos consultados; sem receita simulada |
| Destaques | Mensagem temporária vinculada a item ativo do catálogo e recebimento habilitado | Não cria estoque ou desconto financeiro; não garante disponibilidade |
| TapTable | `/operacao` consulta os pedidos reais do mesmo banco e permite aceitar/recusar/concluir conforme RPC | A demonstração antiga continua separada; não foi convertida integralmente em operação conectada |
| Conexão limitada | Roteiro local, página offline própria e cache restrito a arquivos públicos | Nenhuma resposta de autenticação ou API é armazenada pelo service worker; não confirma pedidos offline |
| Reserva/cardápio | Perfis usam checkout conectado, incluindo o rodapé, sem desvio para reserva por timer ou checkout local de combos | Negócios sem catálogo/agenda publicados aparecem como indisponíveis |

## Persistência e proteção

- Migrações aplicadas ao projeto compartilhado `ixqmvogmjvgmafmbbgli`: `20261016234426_contextual_journey`, `20261017000605_journey_owner_insert_visibility` e `20261017001213_journey_private_invite_authorization`.
- Seis tabelas novas com RLS e privilégios mínimos: viagens, participantes, convites, propostas, votos e solicitações de atendimento.
- Autorização privilegiada do convite fica em schema privado; a função pública é invoker e delega a verificação do token, prazo e usuário.
- Teste SQL com três identidades e estabelecimento descartável, inteiramente revertido por `rollback`: proprietário cria; convidado entra e vota; terceiro não lê; cliente não altera atendimento; parceiro altera atendimento.
- Nenhuma conta real foi criada, nenhum e-mail enviado e nenhum pedido comercial efetuado nos testes.
- Advisor final: sem novo aviso nas tabelas ou funções da jornada. Permanece o aviso anterior de [proteção contra senhas vazadas desativada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), além do INFO da tabela privada de administração sem políticas, intencionalmente sem acesso público.

## Correções de confiabilidade

- Removidos Pix Split liquidado por timer, oscilação aleatória de mesas e confirmação local de combos pagos do caminho ativo.
- Reserva visual passou a usar o checkout conectado; cardápio e rodapé continuam no mesmo fluxo interno.
- Erro de consulta de catálogo é separado de agenda indisponível e oferece nova tentativa.
- Clima usa consulta Open-Meteo compartilhada e identifica indisponibilidade. CSP permite a fonte. Maré por relógio foi retirada; animação é demonstrativa e não recomenda travessias.
- Build cloud passou a carregar e transmitir as variáveis ao processo de compilação, corrigindo a limitação de exportar variáveis apenas no processo irmão do validador.
- Novas rotas foram adicionadas aos rewrites e ao servidor local estático.

## Validações

- Baseline do Guia: build cloud e verificador público aprovados.
- Builds do Guia durante a implementação: aprovados com verificação de arquivos públicos; compilação final registrada na memória ao término.
- TapTable: build aprovado com o módulo conectado e configuração pública local do projeto compartilhado; aviso de tamanho do bundle principal existente.
- Business Next: checagem de tipos aprovada. Build na pasta padrão encontrou EPERM na pasta usada pelo servidor; tentativa isolada foi interrompida sem resultado conclusivo. Não foi declarado build completo aprovado.
- Cinco testes de lógica aprovados: busca/sinônimos, modos de checkout, etapas únicas, persistência inválida/duplicação e orçamento informado no cadastro.
- Navegador: roteiro gerado, persistência entre abas, layout móvel de 390px e desktop observados; sem excesso horizontal do documento na tela testada; checkout interno de restaurante aberto; login exigido no Business e no TapTable.
- Fluxo autenticado completo pelo navegador não foi exercitado sem o login do usuário; as permissões e operações de grupos/atendimento foram verificadas no banco com fixtures revertidas.

## Acesso local

- Guia: `http://127.0.0.1:5191/guia`
- Viagem: `http://127.0.0.1:5191/guia/viagem`
- Business conectado: `http://127.0.0.1:5191/parceiros/painel`
- TapTable conectado: `http://127.0.0.1:5192/operacao`

## Dependências comerciais e próximas integrações

O banco estava sem ofertas na consulta inicial. Cada parceiro precisa cadastrar ofertas reais, capacidades, preços e ativar o recebimento. Pagamentos online, split financeiro, recibos e checkout multiforncecedor continuam dependentes da escolha e configuração do provedor; não foram simulados como concluídos. Reservas com garantia financeira e pré-reservas multiforncecedor com expiração não estão implementadas pelo planejador inicial.

O catálogo/vitrine ainda contém conteúdo demonstrativo anterior, identificado pela faixa geral de demonstração. Onboarding procedural, demonstração clássica do TapTable e demais módulos anteriores não foram auditados integralmente nesta implementação. A nova caixa de atendimento foi integrada ao Business Next existente sem alterar o restante do PMS.
