# Caraíva Digital · Ecossistema (MVP de vendas)

Next.js 14 (App Router) + TypeScript + Tailwind. Esta versão é uma demonstração local: usa dados de exemplo no navegador e sincroniza apenas entre abas do mesmo navegador.

> Não use como operação real: autenticação do lojista, banco compartilhado, pagamentos e confirmações por webhook ainda não estão conectados. O checkout apenas demonstra o fluxo e marca os registros como simulados.

```bash
npm install
npm run dev     # http://localhost:3100
```

## Roteiro de demo (na mesa do cliente)
1. Abra **/business/delivery** numa aba e **/turista** em outra (ou no celular na mesma rede).
2. No turista: "Simular aproximação da plaquinha NFC" → endereço já vem preenchido.
3. Peça água + gelo → use “Simular pedido” para ver o fluxo no painel local. Nenhuma cobrança Pix é criada.
4. Aceite (20 min) → Chamar entregador → Entregue. O turista acompanha em **Carteira**.
5. Reserve um quarto em **/turista/pousadas** → aparece em laranja no mapa do **Mini-PMS**.
6. Simule uma reserva de passeio → o registro de demonstração aparece em **/business/passeios** no mesmo navegador.

## Rotas
| Rota | Quem | O quê |
|---|---|---|
| `/tag/[tagId]` | Chip NFC / QR | Resolve pousada/quarto ou mesa e abre o app |
| `/turista` | Turista | Concierge IA + atalhos |
| `/turista/delivery` · `/pousadas` · `/passeios` · `/carteira` | Turista | Compra, reserva, Pix, vouchers |
| `/business/delivery` | Mercado/Restaurante | Kanban com som, estoque, frete, IA de demanda |
| `/business/pousada` | Pousada | Mini-PMS, iCal Airbnb/Booking, last minute IA, plaquinhas |
| `/business/passeios` | Buggy/Barco | Saídas, passageiros, check-in, maré, aviso em massa |

## Onde está a inteligência
- `src/lib/ai.ts` — concierge **ancorado no inventário real** (não inventa vaga/preço). Com `GEMINI_API_KEY` no `.env.local`, o LLM só redige a resposta.
- Previsão de estoque, preço last minute e janela de maré: heurísticas explicáveis, prontas para trocar por modelo.

## Núcleo de negócio
- `src/lib/pricing.ts` — tabela comercial (setup R$197; Essencial R$97 +7%; Pro R$187 +5%; Delivery R$147 + R$1,50/pedido) e **split triplo** (plataforma / entregador / lojista).
- `src/lib/ical.ts` — parser/exportador iCal RFC 5545 + checagem de overbooking.
- `src/app/api/ical/import` — busca .ics dos canais no servidor, com allowlist anti-SSRF.

## Para produção (ainda necessário)
1. Ativar e escolher o projeto Supabase correto; aplicar e revisar o schema/RLS e substituir o armazenamento local por banco + Realtime.
2. Configurar Auth do lojista (OTP) e autorizações por estabelecimento antes de abrir `/business` para operação real.
3. Conectar um provedor de pagamento, validar webhooks assinados e só então marcar pedido ou reserva como pago.
4. Configurar sincronização de iCal persistente e jobs programados; atualmente a rota apenas importa e analisa o arquivo.
5. Configurar variáveis de ambiente na hospedagem e domínios de produção.

> Limitações conhecidas da demo: toggles de estoque e iCal importado vivem só na tela do lojista (não persistem nem refletem no turista).
