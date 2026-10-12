# 🎨 TapTable — Especificação Visual, Design System & Arquitetura de UI/UX

---

## 1. Visão Geral da Identidade Visual & Ergonomia Noturna

O ambiente típico de bares, pubs e restaurantes noturnos impõe restrições severas de usabilidade:
* **Iluminação Crítica:** Luz ambiente entre 2 e 15 lux, velas, néon ambiente ou penumbra.
* **Fatores Físicos & Cognitivos:** Usuários com copos na mão, reflexos nas telas, atenção fragmentada por conversas e música, efeitos de álcool na acuidade motora e visual.
* **Distância de Interação:** O celular fica apoiado na mesa ou seguro com apenas uma das mãos em ângulo oblíquo.

### 1.1. Filosofia de Design: *Night-Vibrant High Contrast (OLED First)*
A interface adota um fundo preto profundo com camadas de elevação sutis, combinado com **acentos fluorescentes hi-tech**. Isso maximiza a legibilidade sem ofuscar os olhos no escuro, ao mesmo tempo em que reduz o consumo de bateria em telas OLED.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PALETA CROMÁTICA & SISTEMA DE TOKENS                 │
├───────────────────┬──────────────┬─────────────────────────────────────┤
│ Token             │ Hex          │ Aplicação Semântica                 │
├───────────────────┼──────────────┼─────────────────────────────────────┤
│ --bg-void         │ #080A0F      │ Fundo principal (True Dark OLED)    │
│ --bg-surface-base │ #11151F      │ Fundo de cartões e blocos           │
│ --bg-surface-elev │ #1A2130      │ Elementos elevados / Modais         │
│ --border-subtle   │ #242E42      │ Divisórias e bordas de cards        │
│ --border-glow     │ #3A4763      │ Borda de elementos focados          │
├───────────────────┼──────────────┼─────────────────────────────────────┤
│ --neon-emerald    │ #00F59B      │ Finanças: Pago, Quitado, Sucesso    │
│ --neon-amber      │ #FFB800      │ Concorrência: Sendo pago, Lock      │
│ --hyper-violet    │ #9333EA      │ Social: Bancar amigo, Mimo, Gorjeta │
│ --electric-cyan   │ #00E5FF      │ Tempo real: WebSockets, NFC ok      │
│ --crimson-alert   │ #FF3366      │ Conflito evitado, Recusa, Estorno   │
├───────────────────┼──────────────┼─────────────────────────────────────┤
│ --text-primary    │ #F8FAFC      │ Títulos e valores financeiros (98%) │
│ --text-secondary  │ #94A3B8      │ Descrições e nomes de clientes (70%)│
│ --text-muted      │ #64748B      │ Horários e metadados secundários    │
└───────────────────┴──────────────┴─────────────────────────────────────┘
```

### 1.2. Conformidade e Acessibilidade (WCAG 2.2 AA / AAA)
* **Contraste de Texto:** Texto primário (`#F8FAFC`) sobre superfícies elevadas (`#11151F`) oferece taxa de contraste de **16.2:1** (superando com folga os 7:1 exigidos para AAA).
* **Tamanho de Toque Mínimo (Touch Targets):** Todo botão, checkbox ou selector interativo possui área de toque mínima de **48x48px** com espaçamento de segurança de no mínimo 8px entre eles, prevenindo toques errados com dedos úmidos.
* **Tipografia Tabular para Dinheiro:** Valores monetários utilizam fontes com suporte a `font-variant-numeric: tabular-nums` (`Space Grotesk` ou `JetBrains Mono`), impedindo que números saltem horizontalmente durante atualizações ao vivo.

---

## 2. Wireframes Conceituais & Fluxos Visuais (Markdown Wireframes)

### 2.1. Tela do Cliente na Mesa (`/mesa/[id]`)

O cliente encosta o smartphone na tag NFC. Sem download de aplicativo e sem login por senha, a tela carrega em menos de **400ms**.

```
┌────────────────────────────────────────────────────────┐
│ [11:42] 📶 🔋 98%                                      │
├────────────────────────────────────────────────────────┤
│ 🍻 BAR DO ZÉ - MESA 14           🟢 4 online           │
│ ────────────────────────────────────────────────────── │
│ Total da Mesa: R$ 286,00         [ Pedir Garçom 🔔 ]   │
│                                                        │
│  [ Meu Nome: "Lucas" ✏️ ]   •   Falta Pagar: R$ 186,00 │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ MODOS DE PAGAMENTO (Selecione como quer pagar)     │ │
│ │ [✨ Por Itens]    [🤝 Racha Igual]   [💵 Avulso]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ITENS CONSUMIDOS NA MESA (Atualização ao vivo):        │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [x] 2x Chopp Artesanal IPA 500ml         R$ 38,00  │ │
│ │     👤 Pedido por Lucas • 🟢 Entregue              │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ ] 1x Porção de Picanha na Chapa        R$ 110,00 │ │
│ │     👥 Compartilhado pela Mesa • 🟢 Entregue       │ │
│ │     [🎁 Bancar Amigo]                              │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🔒 1x Gin Tônica Tanqueray               R$ 38,00  │ │
│ │     🟡 SENDO PAGO POR MARI (01:18)                 │ │
│ │     (Item temporariamente bloqueado para outros)   │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ✅ 1x Batata Frita Rústica (PAGO)        R$ 42,00  │ │
│ │     💳 Pago por Rafael às 23:15 via Pix            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
├────────────────────────────────────────────────────────┤
│ 🏷️ SELEÇÃO ATUAL: 1 item (R$ 38,00)                    │
│ Gorjeta Equipe: [ 10% ] [ 12% ] [ 15% ] [ Outro ]      │
│ Total a Pagar: R$ 41,80                                │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │  ⚡ PAGAR R$ 41,80 COM PIX (Copia e Cola Instantâneo)│ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │   Pay / GPay (Pagar em 1 Toque com Biometria)     │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### 2.2. O Recurso Social: "🎁 Bancar Amigo" & Divisão de Itens

Ao tocar no botão `[🎁 Bancar Amigo]`, a interface abre uma Bottom Sheet nativa onde o usuário pode visualizar o consumo segmentado por comensal:

```
┌────────────────────────────────────────────────────────┐
│ 🎁 QUEM VOCÊ QUER BANCAR HOJE?                     [X] │
│ Selecione itens de amigos para adicionar à sua conta:  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 👤 PEDIDOS DE "MARCOS"                                 │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [x] 1x Caipirinha de Limão              R$ 28,00   │ │
│ │ [x] 1x Hambúrguer Smash Duplo           R$ 42,00   │ │
│ │ ➕ Adicionar tudo do Marcos (R$ 70,00)              │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 👤 PEDIDOS DE "CAMILA"                                 │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ ] 2x Taça de Vinho Tinto              R$ 56,00   │ │
│ │ ➕ Adicionar tudo da Camila (R$ 56,00)              │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ TOTAL EXTRA ADICIONADO: R$ 70,00                   │ │
│ │ [ CONFIRMAR E ASSUMIR ITENS SELECIONADOS ➜ ]       │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### 2.3. Arquitetura de Estados de Concorrência (Race Conditions & Item Locking)

No momento em que o **Usuário 1 (Lucas)** toca em "Ir para Pagamento Pix", o backend adquire um lock atômico no Redis com TTL de **90 segundos**.

#### Visão Simultânea dos Usuários:

```
           USUÁRIO 1 (Lucas)                           USUÁRIO 2 (Pedro)
    (Está pagando no checkout Pix)             (Visualizando a comanda ao vivo)
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│ ⏳ VOCÊ ESTÁ PAGANDO:            │        │ 🍻 ITENS DA MESA:                │
│ Item: 1x Picanha Chapa (R$ 110)  │        │                                  │
│ Tempo restante: [||||||||  ] 64s │        │ 🔒 1x Picanha Chapa   R$ 110,00  │
│                                  │        │ 🟡 Sendo pago por Lucas... (64s) │
│ [ 📄 PIX COPIA E COLA ]          │        │ [Checkbox Desabilitada]          │
│ [ ABRIR APP DO BANCO 🏦 ]        │        │                                  │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

#### Tratamento de Colisão Extrema (Clique Simultâneo no Mesmo Milissegundo)
Se Pedro conseguir disparar a intenção antes do socket propagar a trava, o backend rejeita via lock pessimista no PostgreSQL (`SELECT ... FOR UPDATE SKIP LOCKED`):

```
┌────────────────────────────────────────────────────────┐
│ ⚠️ ATENÇÃO: ITEM EM PAGAMENTO                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│   O item "Picanha na Chapa" acabou de ser selecionado  │
│   por Lucas para pagamento neste momento.              │
│                                                        │
│   Se o pagamento dele não for concluído em 90s,        │
│   o item voltará a ficar disponível para você!         │
│                                                        │
│   [ Entendi, manter na minha lista ]                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Fail-Safe: Auto-Devolução Pix (Overpayment / Pagamento Tardio)
Caso ocorra uma confirmação Pix após o item ter sido liquidado por outro meio (ou após expiração do lock), o Webhook dispara a API do Banco Central de **Devolução Pix (Pix Refund API)** em menos de 2 segundos:

```
┌────────────────────────────────────────────────────────┐
│ 💸 PIX DEVOLVIDO COM SUCESSO!                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│   Identificamos que seu Pix de R$ 110,00 foi recebido, │
│   mas a Picanha já havia acabado de ser quitada.       │
│                                                        │
│   ✅ O valor foi ESTORNADO IMEDIATAMENTE para a sua    │
│   mesma conta bancária de origem.                      │
│                                                        │
│   ID da Devolução: DEV-88392-PIX-BCB                   │
│   Comprovante enviado por WhatsApp.                    │
│                                                        │
│   [ Voltar para a Mesa ]                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 2.4. A Ponta do Garçom (PWA Operacional em Mãos)

Interface pensada para uso com polegar único (`Thumb Zone Friendly`), com foco em velocidade bruta.

```
┌────────────────────────────────────────────────────────┐
│ 👨‍🍳 GARÇOM: CARLOS                 [ 🔔 Chamados (2) ] │
├────────────────────────────────────────────────────────┤
│ 🔍 Buscar Produto (ex: "Ch" -> Chopp)                │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ Chopp Pilsen 300ml ]  [ Chopp IPA 500ml ]        │ │
│ │ [ Água c/ Gás ]         [ Porção Batata ]          │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 📌 LANÇAR RÁPIDO PARA:                                 │
│ [ Mesa 01 ] [ Mesa 04 ] [ Mesa 14 ⭐ ] [ Mesa 18 ]     │
│                                                        │
│ 🔔 CHAMADOS EM TEMPO REAL:                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🔴 MESA 14: Chamando atendimento! (Há 1 min)       │ │
│ │    [ Atender Agora ]                               │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 💳 MESA 08: Solicitou Máquina Física (Dinheiro/Vr) │ │
│ │    [ Usar Tap-to-Pay no Celular ]                  │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### 2.5. Painel do Gerente / Caixa (Dashboard Panorâmico)

Visualização global do salão em grid dinâmico com matriz de estados:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🖥️ TAPTABLE DASHBOARD CAIXA & GESTÃO                        23:42:10 • AO VIVO 🟢 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Faturamento Hoje: R$ 14.820,00  │  Pix: 78% (R$ 11.559)  │  Cartões: 22%         │
├──────────────────────────────────────────────────────────────────────────────────┤
│ MAPA DE MESAS (SALÃO PRINCIPAL & VARANDA):                                       │
│                                                                                  │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│ │ MESA 01      │  │ MESA 02      │  │ MESA 03      │  │ MESA 04      │           │
│ │ 🟢 LIVRE     │  │ 🟡 CONSUMINDO│  │ 🟠 PAGAMENTO │  │ 🟣 PAGA!     │           │
│ │              │  │ R$ 340,00    │  │ PARCIAL      │  │ TOTAL: R$ 420│           │
│ │ Pronta p/ uso│  │ 4 clientes   │  │ R$ 180 / 360 │  │ LIBERADA P/  │           │
│ │              │  │ 12 itens     │  │ Faltam R$ 180│  │ HIGIENIZAÇÃO │           │
│ └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                                  │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│ │ MESA 05      │  │ MESA 06      │  │ MESA 07      │  │ MESA 08      │           │
│ │ 🟡 CONSUMINDO│  │ 🔒 LOCK (PIX)│  │ 🟢 LIVRE     │  │ 🟡 CONSUMINDO│           │
│ │ R$ 89,00     │  │ R$ 145,00    │  │              │  │ R$ 512,00    │           │
│ │ 2 clientes   │  │ Checkout 45s │  │ Pronta p/ uso│  │ 8 clientes   │           │
│ └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ AUDITORIA EM TEMPO REAL:                                                         │
│ [23:41:55] Mesa 04: Pagamento Pix R$ 120 aprovado (Lucas Silva) -> Mesa Zerada!  │
│ [23:40:12] Mesa 06: Lock de R$ 145 adquirido por usuário 'Fernanda'              │
│ [23:38:00] Mesa 03: R$ 180 pago via Apple Pay (Pedro Alcantara)                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação de Micro-interações, Haptic Feedback & Áudio

Para gerar uma sensação de produto premium, ultra-confiável e instantâneo, a aplicação utiliza as APIs nativas do navegador sem exigir instalação:

### 3.1. Web Haptics Engine (`navigator.vibrate`)

| Evento de Interface | Padrão de Vibração (ms) | Sensação Tátil |
| :--- | :--- | :--- |
| **Tap em Checkbox / Item** | `[12]` | Clique mecânico sutil |
| **Ativação do Lock (Ir p/ Checkout)** | `[25, 40, 25]` | Engate firme de segurança |
| **Copiar Código Pix** | `[35]` | Feedback de área de transferência preenchida |
| **Alerta de Conflito de Item** | `[60, 50, 60]` | Duplo aviso tátil de interrupção |
| **Pagamento Confirmado (Sucesso)** | `[40, 30, 80]` | Pulso comemorativo e liberação |

```javascript
// Utilitário Haptic Nativo para PWA
export const triggerHaptic = (type: 'tick' | 'lock' | 'conflict' | 'success') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    switch (type) {
      case 'tick': navigator.vibrate(12); break;
      case 'lock': navigator.vibrate([25, 40, 25]); break;
      case 'conflict': navigator.vibrate([60, 50, 60]); break;
      case 'success': navigator.vibrate([40, 30, 80]); break;
    }
  }
};
```

### 3.2. Web Audio API Sintético (Sem download de arquivos MP3)
Para garantir **zero latência** e funcionamento mesmo com conexão 3G instável de porão de bar, todos os efeitos sonoros são sintetizados diretamente pelo navegador através de osciladores de áudio:

* **Chime de Sucesso (Pagamento Aprovado):**
  Dois osciladores seno em `587.33Hz (D5)` e `880Hz (A5)` com ataque suave (10ms) e decay exponencial de 400ms.
* **Alerta no Painel do Caixa (Mesa 100% Paga):**
  Campainha discreta de alta frequência (`1046.5Hz - C6`) com modulação de ganho elegante.

---

## 4. Otimizações de Carregamento Instantâneo (Zero Fricção)

1. **Envelope de Download Ultraleve:**
   * Bundle inicial do cliente com menos de **65 KB gzipped**.
   * Imagens e ícones servidos em SVG inline sem dependência de icon-fonts pesadas.
2. **Optimistic UI com Sincronização Transacional:**
   * Quando o cliente marca uma caixinha ou toca em "Bancar Amigo", a interface reflete imediatamente o estado no DOM.
   * Se a resposta do WebSocket ou Redis retornar conflito, o estado sofre rollback com animação suave e toast explicativo.
3. **Persistência de Sessão da Mesa via LocalStorage:**
   * Se a bateria do cliente acabar ou o navegador for fechado por engano, ao reabrir (ou encostar novamente no NFC) a comanda restaura imediatamente o estado local sem pedir confirmações.

---

## 5. Diagrama da Arquitetura Visual e Concorrência

```
  CLIENTE 1                   WEBSOCKET / REDIS                   CLIENTE 2
      │                               │                               │
      ├───── Seleciona Item A ───────►│                               │
      │                               ├──── Lock Item A (90s) ───────►│ (Item A fica amarelo
      │                               │     `Sendo pago por C1`       │  com contador 90s)
      │                               │                               │
      ├───── Tenta Pagar Pix ────────►│                               │
      │      (QR Code gerado)         │                               │
      │                               │                               │
      │                               │◄──── Tenta Selecionar Item A ─┤
      │                               ├───── Retorna BLOQUEADO ──────►│ (Modal amigável:
      │                               │                               │  "C1 está pagando")
      │                               │                               │
      ├───── Webhook Pix Pago ───────►│                               │
      │                               ├───── Item A: PAGO (Verde) ───►│ (Item A fica verde
      │◄──── Confirmação + Recibo ────┤                               │  e sai do saldo a pagar)
```
