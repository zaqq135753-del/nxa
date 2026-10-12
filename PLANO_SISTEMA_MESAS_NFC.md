# 🍻 Projeto: TapTable (Nome Provisório)
## Sistema Inteligente de Mesas, Comandas Colaborativas e Pagamentos Ultrarrápidos via NFC/Pix

---

## 1. Visão Geral e Proposta de Valor

O **TapTable** é uma plataforma desenhada para eliminar o maior gargalo operacional de bares e restaurantes: **o tempo perdido entre pedir a conta, esperar a maquininha e passar múltiplos cartões**. 

Inspirado em soluções globais como *Sunday* e *Toast*, mas desenhado com foco nativo no mercado brasileiro (alta adesão ao Pix e cultura de mesas grandes de compartilhamento), o sistema transforma um simples adesivo/tag NFC na mesa em uma **comanda viva e colaborativa**.

### Principais Benefícios:
* **Giro de Mesa Acelerado:** Redução de 15 a 25 minutos no tempo de fechamento de cada mesa.
* **Fim da Fila de Maquininha:** Mesas grandes pagam simultaneamente em menos de 1 minuto.
* **Economia Real para o Lojista:** Redução no aluguel de terminais POS e taxas de cartão menores através do incentivo ao Pix/Open Finance.
* **Experiência Social Única:** Divisão inteligente de itens, "bancar a conta de um amigo" e envio de mimos entre mesas.

---

## 2. Arquitetura do Ecossistema

O sistema é composto por **4 pilares interligados em tempo real**:

```
                 ┌────────────────────────────────┐
                 │       HARDWARE NA MESA         │
                 │   Tag NFC Resistente + QR Code │
                 └───────────────┬────────────────┘
                                 │ Encosta o celular (sem app)
                                 ▼
                 ┌────────────────────────────────┐
                 │        CLIENTE (WebApp)        │
                 │   Comanda Viva, Divisão e Pix  │
                 └───────────────┬────────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
┌──────────────┐        ┌─────────────────┐        ┌──────────────────┐
│ GARÇOM (App) │        │ BACKEND CENTRAL │        │  CAIXA / GERENTE │
│ Lança itens/ │◄──────►│ WebSockets/API  │◄──────►│ Dashboard ao vivo│
│ alertas      │        │  Lock Anti-Race │        │ Mapa do salão    │
└──────────────┘        └─────────────────┘        └──────────────────┘
```

---

## 3. Especificação das Pontas do Sistema

### 3.1. A Ponta da Mesa & Cliente (Mobile First / PWA)
> **Princípio Central:** Zero download de app, zero cadastro inicial com senha. Acesso instantâneo em menos de 1 segundo.

* **Acesso:** O cliente encosta o smartphone na tag NFC ou lê o QR Code físico.
* **Identificação Opcional:** Digita apenas seu primeiro nome/apelido (ex: *"Lucas"*) para participar da comanda social.
* **Comanda Viva (Sincronizada ao Vivo via WebSockets):**
  * Extrato detalhado de todos os pedidos da mesa.
  * Status dos itens (*Preparando*, *Entregue*, *Pago*).
* **Mecanismos de Pagamento & Divisão:**
  1. **Pagar Total:** Um único cliente liquida 100% da conta.
  2. **Dividir por Igual ("Racha da Galera"):** Seleciona número de pagadores (ex: R$ 400 ÷ 4 = R$ 100 para cada).
  3. **Pagar por Item:** O cliente marca individualmente o que consumiu.
  4. **Pagar Valor Avulso:** Digita qualquer valor (ex: R$ 50,00) para abater do saldo total.
  5. **🎁 Bancar um Amigo (Mesa):** Possibilidade de selecionar o consumo de outro amigo da mesa e pagar junto.
  6. **🍸 Mimo / Enviar para Outra Mesa:** Pagar um drink ou abater saldo na conta de outra mesa (recurso social/flerte).
* **Checkout Integrado:**
  * **Pix Dinâmico:** Copia e Cola + botão "Abrir no meu Banco" com baixa em 2 segundos.
  * **Apple Pay & Google Pay:** Pagamento em 1 clique com biometria facial/digital.
  * **Cartão de Crédito/Débito:** Digitação rápida de dados.
* **Gorjeta Configurável:**
  * Botões diretos: `[10%]`, `[12%]`, `[15%]`, `[Outro]`, `[Não incluir]`.
* **Comprovante & Pós-Venda:**
  * Recibo digital enviado por WhatsApp.
  * Avaliação rápida de atendimento (NPS).

---

### 3.2. Mecanismo de Prevenção de Conflitos (Race Condition & Overpayment)
Para garantir que dois clientes não paguem o mesmo valor ou item ao mesmo tempo:

1. **Item & Value Locking (Bloqueio Temporário):**
   * Assim que o *Cliente A* seleciona um item ou valor e vai para o checkout, o sistema cria uma trava de **90 a 120 segundos** via Redis.
   * Na tela do *Cliente B*, o item fica acinzentado com a tag: `🟡 Sendo pago por Lucas...`.
2. **Transação Atômica no Banco de Dados:**
   * Caso haja tentativa simultânea no mesmo milissegundo, a transação utiliza lock pessimista (`SELECT FOR UPDATE`). A segunda requisição é rejeitada com aviso amigável:
     > *"Opa! Esse valor ou item acabou de ser pago por outro amigo da mesa. Saldo atualizado!"*
3. **Auto-Devolução via Pix (Fail-Safe):**
   * Se um pagamento Pix for processado após o fechamento integral da conta, a API de Devolução Pix faz o estorno automático imediato para a conta de origem.

---

### 3.3. A Ponta do Garçom (WebApp Operacional)
* **Busca Preditiva:** Lançamento de pedidos em 3 toques na tela (ex: digita "Ch" -> seleciona Chopp -> confirma).
* **Status das Mesas em Tempo Real:** Identificação visual de quem já pagou, quem está consumindo e quem pediu fechamento.
* **Chamados de Mesa:** Notificação vibratória quando um cliente solicita atendimento via webapp.
* **Fallback Tap-to-Pay:** Função para transformar o próprio celular do garçom em maquininha de aproximação caso o cliente exija pagar com cartão físico.

---

### 3.4. A Ponta do Gerente / Caixa (Dashboard Administrativo)
* **Mapa de Mesas Visual:**
  * 🟢 **Livre:** Disponível.
  * 🟡 **Consumindo:** Conta aberta.
  * 🟠 **Pagamento Parcial:** Parte da conta quitada (ex: R$ 150 de R$ 300).
  * 🟣 **Totalmente Paga:** Notificação sonora discreta liberando a mesa para limpeza e novo uso.
* **Relatórios Financeiros:**
  * Volume arrecadado por Pix vs. Cartão.
  * Rateio automático da taxa de serviço (gorjetas) entre a equipe.
  * Integração com emissores de cupom fiscal eletrônico (NFC-e).

---

## 4. Stack Tecnológica Recomendada

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Frontend Cliente & Garçom** | **Next.js / React + TailwindCSS** | PWA ultrarrápido, responsivo, sem necessidade de app store. |
| **Painel do Caixa** | **React / Vite ou Next.js** | Interface limpa, responsiva para tablets e desktops. |
| **Backend & APIs** | **Node.js (TypeScript) + Fastify / NestJS** | Alta performance em I/O e facilidade de manutenção. |
| **Comunicação Tempo Real** | **Socket.io / WebSockets** | Latência em milissegundos para atualização de mesas e itens. |
| **Locks & Cache** | **Redis** | Bloqueios temporários de concorrência e controle de sessões. |
| **Banco de Dados** | **PostgreSQL** | Suporte a transações ACID seguras para operações financeiras. |
| **Gateway de Pagamento** | **Mercado Pago / Asaas / Woovi / Stripe** | Suporte robusto a Pix Dinâmico com Webhooks e Apple/Google Pay. |
| **Hardware** | **Tags NFC NTAG213/215 + Acrílicos UV** | Baixo custo, à prova d'água e durabilidade prolongada. |

---

## 5. Modelo de Dados Simplificado (Entidades Principais)

* **`Restaurante`**: Dados da empresa, chaves de API do gateway, configurações de gorjeta.
* **`Mesa`**: Número da mesa, QR Code token ativo, status atual (`LIVRE`, `OCUPADA`, `PAGA`).
* **`SessaoMesa`**: Representa a visita atual daquela mesa (abertura e encerramento).
* **`ClienteSessao`**: Identificador temporário de cada usuário conectado à mesa (nome/apelido, socket ID).
* **`ItemPedido`**: Produto, quantidade, preço unitário, status (`PENDENTE`, `PREPARANDO`, `ENTREGUE`).
* **`ItemConsumoCliente`**: Vincula quais itens pertencem a qual cliente na divisão individual.
* **`TransacaoPagamento`**: ID da transação, gateway, valor pago, gorjeta, método (`PIX`, `APPLE_PAY`, `CARTAO`), status (`PROCESSANDO`, `APROVADO`, `ESTORNADO`).
* **`LockItem`**: Tabela em memória (Redis) com itens bloqueados para pagamento momentâneo.

---

## 6. Roteiro de Execução (Roadmap de Desenvolvimento)

### Fase 1: MVP Funcional (Prova de Conceito)
- [ ] Modelagem do banco de dados (Mesas, Itens, Comandas e Transações).
- [ ] Backend com suporte a WebSockets para atualização em tempo real.
- [ ] Integração com Gateway de Pagamento para geração de Pix Dinâmico e Webhook de confirmação.
- [ ] WebApp Mobile do Cliente: Leitura de mesa por URL, visualização do total e pagamento via Pix.
- [ ] Painel do Caixa básico com mapa de mesas mudando de status em tempo real.

### Fase 2: Concorrência e Divisão Inteligente
- [ ] Implementação de travas de concorrência com Redis (Item Locking).
- [ ] Divisão por igual ("Racha") e por itens individuais.
- [ ] Integração com Apple Pay e Google Pay.
- [ ] Funcionalidade "🎁 Bancar a conta de um amigo" na mesma mesa.

### Fase 3: Operação Completa e Recursos Sociais
- [ ] App do Garçom com busca preditiva e emissão de comandas para a cozinha.
- [ ] "Mimo para outra mesa" (envio de drinks/cervejas entre mesas).
- [ ] Comprovante via WhatsApp e pesquisa de satisfação (NPS).
- [ ] Emissão automática de NFC-e.

---

## 7. Próximos Passos Imediatos
1. Configuração do repositório e base do projeto.
2. Definição do gateway de pagamento para o ambiente de testes (Sandbox).
3. Criação do primeiro protótipo visual (wireframe interativo) do fluxo do cliente na mesa.
