# Caraíva Digital — onboarding e gestão do lojista pelo WhatsApp

> SUPERADO PARA O CADASTRO: o usuário definiu onboarding por telas via QR, usando a configuração da loja, sem áudio/conversa. Ver `caraiva-public-release/ONBOARDING-ENTREGA.md`. WhatsApp permanece uma integração futura separada para suporte e solicitações. O texto abaixo registra a proposta anterior e não é a especificação vigente do cadastro.

Versão 1 — 9 de outubro de 2026. Especificação de produto e implementação.

## 1. Decisões confirmadas e objetivo

- Canal inicial: WPPConnect Server multi-session já disponível, informado pelo usuário.
- Backend e banco: Supabase, informado pelo usuário; projeto, esquema e integração publicada ainda precisam de inspeção.
- Prioridade: lojistas. Quiz e personalização turística ficam fora desta entrega.
- Texto, áudio, fotos e localização alimentam o mesmo cadastro usado no painel e no app público.
- Objetivo: o responsável consegue cadastrar, revisar, publicar e manter seu estabelecimento sem precisar aprender um painel complexo.

Primeira jornada completa: **convite → conversa → rascunho → vínculo verificado → revisão → análise → publicação → gestão diária**.

## 2. Experiência de entrada

Três portas de entrada para uma única candidatura:

1. **Convite individual preparado pela equipe:** buscar negócio existente ou criar rascunho; preencher nome/categoria/local conhecido; gerar link e QR com identificador opaco, prazo e possibilidade de revogação.
2. **Entrada espontânea:** o lojista chama o WhatsApp ou abre “Cadastrar meu negócio”; pesquisar primeiro para evitar duplicidade.
3. **Reivindicação no perfil:** “Este negócio é seu?” inicia a mesma candidatura vinculada ao perfil, sem conceder edição automaticamente.

QR individual leva a uma página curta de convite com o negócio e opção de abrir a conversa ou continuar na web. O link para WhatsApp leva apenas uma referência ao convite, sem contatos privados. O lojista precisa enviar a mensagem; abrir WhatsApp não confirma ingresso.

NFC fica como entrada adicional: tag física com URL. Para atendimento presencial, QR individual no celular é o caminho principal; NFC fixo abre entrada geral e solicita código. Não usar redirecionamento global que faça um lojista receber o convite de outro.

Existem três QR distintos: convite privado de onboarding; perfil público do negócio para turistas; pareamento da sessão WPPConnect, acessível somente à equipe autorizada. Nunca mostrar o QR de pareamento ao lojista.

## 3. Conversa de onboarding

### Etapa A — boas-vindas e contexto

“Olá! Sou o assistente do Caraíva Digital. Vou ajudar você a preparar o perfil do seu negócio. Pode responder por texto ou áudio. Você pode parar e continuar depois. Para falar com nossa equipe, escreva ATENDENTE.”

Identificar o convite e apresentar o negócio. Sem convite, perguntar o nome e mostrar possíveis correspondências. Se já houver candidatura, oferecer continuar; se já houver acesso, abrir gestão diária.

### Etapa B — responsável e vínculo

Perguntar nome e função. A origem da mensagem comprova controle atual do canal WhatsApp, mas não propriedade do negócio. Verificar vínculo por responsável já aprovado, convite nominal preparado pela curadoria, canal comercial previamente validado ou revisão manual. Contato enviado pelo próprio candidato, sozinho, não comprova vínculo.

Permitir preencher rascunho enquanto a verificação ocorre. A primeira publicação e alterações de identidade dependem da curadoria. Funcionários entram por convite de um responsável autorizado. Mudança de telefone ou proprietário exige nova verificação.

### Etapa C — informações essenciais

Fazer uma pergunta por vez ou pequenos blocos. Reaproveitar o que já existe; perguntar “Continua correto?” em vez de exigir redigitação. Áudios longos podem preencher vários campos; mostrar o resumo e perguntar apenas o que falta.

Capturar nome, categoria, descrição, localização, contato público, horários e foto principal. Quando a localização não for precisa, permitir rascunho e revisão assistida; o pin precisa ser validado antes da publicação no mapa.

### Etapa D — prévia e confirmação

Mostrar resumo legível na conversa e link para prévia privada, com validade e acesso controlado. Separar claramente campos públicos e privados. Lojista corrige por conversa ou web; versão do rascunho é a mesma nos dois canais.

“Seu perfil está pronto para análise. Confirme se as informações estão corretas e se você tem autorização para usar as fotos. 1 — Enviar para análise; 2 — Corrigir; 3 — Continuar depois.”

Registrar a versão dos termos/avisos e a manifestação explícita necessária à publicação. Não transformar consentimento de marketing em requisito para manter o perfil.

### Etapa E — análise e publicação

Depois da gravação confirmada, enviar protocolo e status. A equipe verifica vínculo, duplicidade, localização, mídia e conteúdo. Pode aprovar ou pedir ajustes com motivo específico. Prazo comunicado depende da capacidade real da operação.

Após aprovação, publicar somente os campos autorizados e enviar o kit de ativação. “Publicado” exige confirmação de que o perfil está acessível pelo caminho público esperado.

## 4. Informações que vamos pedir

“Antes de publicar” é requisito de qualidade; o lojista pode salvar e continuar sem completar tudo na primeira conversa.

| Informação | Momento / exigência | Visibilidade e regra |
|---|---|---|
| Nome do responsável | Início; obrigatório para análise | Privado |
| Função: proprietário, gerente ou representante | Início; obrigatório | Privado; não concede permissão sozinho |
| Identidade WhatsApp e vínculo ao negócio | Início; verificação obrigatória para gestão | Privado; normalizar identidade conforme payload da versão instalada |
| E-mail de recuperação/acesso web | Opcional no primeiro contato; solicitar ao ativar acesso web ou recuperação independente | Privado; verificar antes de usar |
| Nome público do estabelecimento | Essencial | Público |
| Categoria principal e subcategoria | Essencial | Público; lista controlada |
| Descrição curta | Antes de publicar; pode ser preparada a partir de áudio | Pública; revisar texto sugerido |
| Ponto no mapa e referência de chegada | Antes de publicar no mapa | Públicos; confirmar que se trata do negócio, não residência pessoal |
| Contato público: WhatsApp, telefone ou canal alternativo | Antes de publicar; ao menos um adequado ao negócio | Público; separado do acesso pessoal do responsável |
| Dias, horários e exceções | Antes de publicar | Públicos; “sob agendamento” é opção válida |
| Foto principal | Antes de publicar; equipe pode ajudar | Pública; autorização e validação de arquivo |
| Instagram/site | Opcional | Públicos |
| Faixa de preço | Complementar, quando fizer sentido | Pública, datada; não inventar faixa ausente |
| Pagamentos aceitos | Complementar | Públicos |
| Produtos, serviços ou cardápio | Complementar por categoria | Públicos após revisão |
| Galeria e logo | Complementar | Públicos; foto original e texto alternativo |
| Características do local | Complementar | Públicas; acessibilidade descrita objetivamente pelo responsável |
| Autorização de publicação e ciência do tratamento de dados | Antes do envio/publicação | Registro privado com versão e data |
| Plano escolhido e cobrança | Quando oferta comercial estiver definida | Privados; valores e condições explícitos |

Não pedir CPF, documentos pessoais, dados bancários ou CNPJ para simplesmente começar um perfil. Dados fiscais só entram em uma etapa separada se necessários ao contrato/faturamento. Documentação adicional de vínculo, quando realmente necessária, usa canal protegido e acesso restrito.

### Campos conforme o tipo de negócio

- **Loja:** tipos de produtos, marcas próprias, retirada/entrega e catálogo opcional com nome, descrição, foto, preço e disponibilidade.
- **Restaurante/café/bar:** cardápio, faixa de preço, alimentação/restrições informadas, reserva e atendimento. Ofertas de produtos sujeitos a regras do canal exigem avaliação específica antes de automatizar.
- **Passeios/serviços:** atividade, duração, ponto de encontro, faixa etária/requisitos informados, preço e como solicitar disponibilidade. Vaga só é confirmada por dado operacional.
- **Hospedagem:** categorias, comodidades, check-in/out e canal de consulta. Não oferecer reserva instantânea ou inventário sincronizado sem integração própria.

## 5. O que o lojista recebe

### Ao começar

Confirmação do negócio identificado; candidatura recuperável; resumo do que já foi preenchido; próxima pendência. Link de continuação não equivale a acesso administrativo irrestrito.

### Ao enviar

Protocolo, status, informações enviadas, pendências de verificação e canal de ajuda. Se falhar, dizer “ainda não enviado”; não produzir sucesso apenas porque o modelo de IA terminou a resposta.

### Ao publicar — kit de ativação

1. Link público estável do perfil.
2. QR público em PNG, legível em tela e impressão; peça de impressão pode ser gerada depois de definir marca/formato.
3. Texto curto para compartilhar o perfil por iniciativa do lojista.
4. Acesso ao painel, ativado por autenticação verificada; QR público não faz login.
5. Resumo de como pedir mudanças no WhatsApp: horário, foto, descrição, preço, ajuda.
6. Checklist: testar contato, conferir mapa, adicionar fotos e revisar produtos/serviços.

Não prometer geração de vendas. Métricas distinguem visualização, clique, solicitação e venda confirmada.

## 6. WhatsApp como canal permanente de solicitações e soluções

O assistente reconhece linguagem natural e oferece menu simples como alternativa. Não exigir comandos exatos. Menu: 1 Perfil; 2 Horários; 3 Fotos; 4 Produtos/serviços; 5 Resultados; 6 Cadastro/pendências; 7 Atendimento humano.

| Solicitação | Comportamento | Política de execução |
|---|---|---|
| “Como está meu cadastro?” | Status e próxima pendência | Consulta do próprio negócio |
| “Me manda meu perfil/QR” | Link/arquivo público atual | Consulta; conferir versão publicada |
| “Amanhã abro às 14h” | Perguntar fechamento se ausente; confirmar data absoluta | Exceção de horário, após confirmação |
| “Fechamos mais cedo hoje” | Solicitar hora e confirmar período | Atualização com expiração; não mudar a semana inteira |
| “Troca a descrição” | Preparar antes/depois | Confirmação; curadoria se conteúdo exigir |
| Envio de foto | Perguntar capa, galeria ou produto | Prévia e confirmação; validar arquivo |
| “Esse vestido custa 89” | Identificar item e moeda; perguntar se houver ambiguidade | Confirmar item e preço antes de salvar |
| “Não tenho mais esse produto” | Marcar indisponível | Preferir ação reversível; não apagar registro |
| “Cria um evento para sexta” | Pedir data, início/fim, local, descrição, preço/contato | Rascunho, confirmação e moderação |
| “Quero divulgar uma oferta” | Capturar condição, preço, validade e disponibilidade | Rascunho; regras comerciais e do canal |
| “Quantas pessoas me chamaram?” | Apresentar métrica realmente medida e período | Clique não equivale a mensagem recebida/venda |
| “Meu contato está errado” | Preparar correção do contato público | Confirmação; acesso pessoal separado |
| “Quero dar acesso ao gerente” | Abrir fluxo de convite | Autorização reforçada do proprietário |
| “Quero falar com alguém” | Criar atendimento e encaminhar | Pausar automação de alterações |
| “Quero cancelar/sair” | Identificar cancelamento de pedido, comunicação ou contrato | Encaminhar conforme ação; não apagar dados por interpretação |

Não inclui ler as conversas dos turistas no WhatsApp particular do lojista, responder clientes em nome dele ou obter receita do caixa. O número central do Caraíva recebe pedidos dos parceiros. Conectar o WhatsApp de cada estabelecimento seria outro produto, com consentimento e escopo próprios.

## 7. Áudio e confirmação

Fluxo: receber → recuperar mídia autenticada → validar → transcrever → extrair campos → validar regras → resumir → confirmar → salvar → responder.

O lojista pode usar texto em qualquer etapa. Resposta padrão em texto, com áudio opcional depois do piloto. Nunca publicar a gravação enviada pelo responsável como mídia do perfil.

Exemplo: “No sábado abrimos às dez e fechamos às seis. O vestido azul passa para cento e vinte.” O assistente confirma duas alterações separadas, identifica qual sábado e qual produto, e pergunta apenas o que falta.

Áudio ruim, preço incerto ou item ambíguo gera pergunta. “Confirmar” só vale para uma proposta pendente identificada, com prazo e versão. Se houver várias, pedir a qual se refere. Alteração no painel entre proposta e confirmação exige nova revisão, evitando sobrescrever trabalho recente.

Registrar cada item como aplicado, pendente ou recusado. Para operações que precisam ocorrer juntas, salvar numa transação; não dizer “tudo atualizado” quando parte falhou. Possibilidade de reversão por nova alteração auditada, sem apagar histórico.

## 8. Estados e responsabilidades

Separar três dimensões:

- **Cadastro:** rascunho, aguardando informações, enviado, ajustes solicitados, aprovado, rejeitado.
- **Vínculo:** não verificado, em verificação, verificado, revogado.
- **Publicação:** não publicado, publicado, pausado ou suspenso.

Um novo rascunho não remove o perfil publicado. Uma suspensão bloqueia ações conforme motivo e deixa uma explicação privada ao responsável. A conclusão do onboarding depende de vínculo, conteúdo mínimo e publicação, não apenas de porcentagem de campos preenchidos.

Solicitações têm protocolo e estados: recebida, esclarecimento necessário, aguardando confirmação, aguardando análise, em execução, concluída, falhou ou cancelada. Confirmação e aplicação são eventos diferentes.

Papéis: proprietário gerencia negócio e equipe; gerente opera conteúdo conforme delegação; editor prepara rascunhos; curador verifica/aprova; suporte atende; administrador controla operação. Permissões são verificadas a cada ação, inclusive após revogação.

## 9. Arquitetura: WPPConnect Server + Supabase

```text
WhatsApp do lojista
    → WPPConnect Server (sessão Caraíva)
    → entrada autenticada de eventos
    → registro e fila de processamento
    → identificação + contexto + transcrição/interpretação
    → proposta validada / confirmação / atendimento
    → serviço de cadastro e gestão
    → Supabase: dados, arquivos e histórico
    → fila de respostas → WPPConnect → lojista

Painel do lojista e painel da equipe
    → autenticação + mesmas regras de gestão → Supabase

Guia público
    → somente dados aprovados e publicados
```

### WPPConnect multi-session

Começar com uma sessão dedicada ao relacionamento com parceiros, sem misturar chats pessoais. Multi-session permite crescimento futuro por equipe/unidade; cada sessão tem dono, número e finalidade registrados. Sessão do conector não representa permissão sobre um estabelecimento.

Validar versão instalada, formato de eventos, identificadores de contato, mídias e métodos de envio no Swagger do próprio servidor. Não presumir que botões/listas funcionam em todas as versões/clientes; texto numerado sempre disponível.

WPPConnect depende de sessão WhatsApp Web e não é a API oficial da Meta. Prever desconexões, novo pareamento e mudanças de compatibilidade. A sessão é um canal substituível: dados e regras ficam no nosso backend, para manter painel e atendimento disponíveis e permitir trocar o provedor futuramente.

### Supabase

- Postgres: cadastro, vínculo, permissões, convites, solicitações e auditoria.
- Auth: acesso web de lojistas e equipe. Identidade WhatsApp é vinculada a um responsável aprovado; não inventar login nativo WPPConnect no Supabase Auth.
- Storage: mídias recebidas privadas; somente derivadas aprovadas entram na distribuição pública. Links de prévia privados têm validade.
- Edge Functions ou serviço de aplicação: entrada/validação e APIs. Trabalhos demorados de áudio e reconciliação ficam em processadores de fila; não manter webhook aberto aguardando IA.
- Fila persistente: tarefas de mídia, interpretação, execução e resposta, com tentativas limitadas e fila de falhas.
- Realtime pode atualizar painel; o app público também precisa invalidar/recarregar dados após publicação. Gravar no banco sozinho não atualiza uma tela alimentada por arrays estáticos.

A IA interpreta conteúdo e propõe ações permitidas. Ela não recebe acesso SQL livre nem credenciais administrativas, e mensagens/documentos são dados, não instruções de autorização.

### Dados conceituais — adaptar ao esquema existente

| Grupo | Registros necessários |
|---|---|
| Negócio | Identificador, dados publicados, versão, localização, estado |
| Responsáveis | Identidade, contatos privados, vínculo, papel, estado |
| Convites | Referência opaca, hash do segredo, negócio, responsável esperado, expiração, uso/revogação |
| Candidaturas | Rascunho, campos faltantes, origem, análise e publicação |
| Conteúdo | Horários regulares/exceções, produtos/serviços, mídia e futuros eventos/ofertas |
| Conversas | Sessão provedora, contato, negócio ativo, etapa, atendimento humano |
| Mensagens/tarefas | ID do provedor, tipo, processamento, tentativa, entrega |
| Solicitações | Ação, proposta, versão-base, confirmação, executor, resultado |
| Auditoria | Ator, canal, antes/depois, motivo e data |
| Comunicação | Preferências, avisos/termos aceitos, pausas e lembretes |

Antes de criar tabelas, mapear e reutilizar as atuais. Separar dados privados do perfil público. Aplicar RLS, grants mínimos e políticas por vínculo; chaves privilegiadas apenas no servidor. Como credenciais de serviço podem contornar RLS, os trabalhadores de integração também validam explicitamente responsável, estabelecimento e ação, sem confiar no ID enviado na conversa.

## 10. Confiabilidade e proteção operacional

- Receber eventos apenas de origem autenticada; conferir mecanismos disponíveis na instalação. Se não houver assinatura adequada, usar gateway/segredo/controle de rede; não presumir proteção inexistente.
- Registrar evento antes de confirmar recebimento. Deduplicar por sessão + ID da mensagem/evento e controlar execução única das alterações.
- Ignorar grupos, status e mensagens da própria automação no piloto; separar respostas humanas para não criar loops.
- Processar por conversa para manter ordem. Revogação de acesso tem efeito antes da próxima execução.
- Mensagem salva no banco, resposta enviada e resposta entregue são estados distintos. Reenvio de resposta não reaplica alteração.
- Monitorar sessão conectada, fila, atrasos, falhas e mídia. Desconectado: pausar envios e alertar operação; manter cadastro web. Reconciliar mensagens após retorno quando o provedor permitir; não prometer recuperação de mensagens que não chegaram.
- Proteger tokens e sessão do WPPConnect, segredo do webhook e credenciais Supabase; nunca em frontend/QR/log público.
- Mídias com tipos e tamanho limitados, nomes seguros e processamento isolado. Não buscar URLs arbitrárias ditadas pelo usuário/modelo.
- Proposta inicial de retenção: áudio bruto por até 7 dias após processamento e mídias rejeitadas por até 30 dias; validar finalidade, acesso e política antes do piloto. Dados publicados seguem ciclo do perfil; auditoria tem política própria, não retenção indefinida por padrão.
- Lembretes somente dentro da preferência combinada, com limite de frequência e opção de parar; sem disparos em massa no piloto. Regras específicas da API oficial, como templates, não devem ser presumidas como recursos do WPPConnect; políticas aplicáveis ao uso do WhatsApp continuam relevantes.

## 11. Painéis e atendimento humano

### Painel do lojista

Início com pendências; Meu negócio; Horários; Fotos; Produtos/serviços; Solicitações; Resultados; Equipe/conta. Mesma candidatura e dados da conversa. Login independente verificado, sem exigir instalar app.

### Painel da equipe

Buscar/criar negócio; gerar/revogar convite; acompanhar funil; verificar vínculo; prévia e comparação de alterações; aprovar/pedir ajuste; assumir conversa; acompanhar sessão/fila; consultar auditoria.

Ao assumir, pausar automação de ações e mostrar o atendente responsável. Pedidos novos entram como recebidos; não executar comandos concorrentes do bot. Devolver ao assistente de forma explícita. Informar horário de atendimento e previsão realista; “solução” só quando confirmada, caso contrário manter protocolo e próxima ação.

## 12. Primeira entrega e evolução

### Etapa 0 — inventário técnico e ambiente de teste

Confirmar repositório ativo, alterações em andamento, projeto Supabase, schema/RLS, origem atual dos dados do guia, instalação WPPConnect, versão, sessão e eventos. Usar sessão/contatos de teste autorizados; nenhuma reconexão ou modificação de sessões existentes sem necessidade. Mapear dados atuais antes de migração.

### Etapa 1 — integração e identidade

Entrada de eventos, registro, deduplicação, fila de resposta, estado de sessão, responsáveis/vínculos, consultas simples e atendimento humano. Testar isolamento entre dois estabelecimentos antes de liberar alterações.

### Etapa 2 — onboarding até publicação

Convite QR/link, rascunho compartilhado, conversa progressiva, verificação, prévia, envio, curadoria, publicação e kit. Áudio já entra no cadastro como extração confirmada.

### Etapa 3 — gestão cotidiana

Horários e exceções, descrição, contato público, capa/galeria, consulta de pendências e envio de perfil/QR. Histórico, confirmação, conflitos com painel e notificações de resultado.

### Etapa 4 — catálogo e solicitações avançadas

Produtos/preços/disponibilidade, eventos/ofertas moderados, métricas reais, lembretes consentidos e acesso de equipe. NFC e respostas em áudio entram conforme uso e compatibilidade.

Primeiro piloto concluído quando: lojista recebe convite, conversa por texto/áudio, verifica vínculo, revisa dados, é aprovado, aparece no guia, recebe QR e atualiza um horário com registro e confirmação. Essa é a unidade de entrega, não apenas um bot que responde.

## 13. Critérios de aceite e acompanhamento

Testar: convite válido/expirado/revogado/encaminhado; duplicidade de negócio; contato sem vínculo; responsável com dois negócios; vínculo revogado; áudio ambíguo; foto inválida; confirmação antiga; proposta alterada no painel; mensagens duplicadas/fora de ordem; sessão desconectada; falha após salvar e antes de responder; conversa assumida por humano; alteração negada; dados privados fora da resposta pública; perfil atualizado no app; horário excepcional expirado.

Métricas do piloto: abertura do convite, início da conversa, abandono por campo, candidatura enviada, aprovação/publicação, tempo até ativação, pedidos concluídos, correções após transcrição, escaladas humanas, erros de envio e manutenção dos dados. Meta de tempo inicial só após linha de base; não prometer cadastro rápido sem observar uso real.

Não inclui nesta fase: chat com turistas no número particular do lojista, integração de caixa, estoque completo, pagamento/reserva automática, disparos comerciais em massa ou personalização turística.

## 14. Referências e estado desta entrega

- WPPConnect Server, funcionalidades: https://wppconnect.io/docs/projects/wppserver/introduction/
- API WPPConnect Server (conferir também Swagger da instalação): https://wppconnect.io/swagger/wppconnect-server/
- Supabase, controle de acesso: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase, filas: https://supabase.com/docs/guides/queues
- Supabase, limites de funções: https://supabase.com/docs/guides/functions/limits

Documentação consultada para desenhar a arquitetura. Nenhuma sessão WPPConnect, credencial, tabela, política ou dado de produção foi alterado nesta entrega. Próximo trabalho: inventário técnico da etapa 0 e implementação incremental da jornada acima.
