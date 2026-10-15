# Caraíva Digital · Ecossistema (MVP de vendas)

## Integração Supabase — 14/10/2026

O painel central `/business` pode usar o banco compartilhado do projeto `crvi.dg`, organização nxacorp. Ative `NEXT_PUBLIC_CARAIVA_CLOUD=true` e configure a URL e a chave publicável conforme `.env.example`. O login do aplicativo é separado da conta do painel Supabase. O administrador aprovado recebe vínculos somente após confirmar seu e-mail.

O Guia conectado está em `../caraiva-integration`, usando `VITE_CARAIVA_CLOUD=true`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. Na configuração local atual: Business em `http://localhost:3100/business`; Guia de teste em `http://127.0.0.1:3103/guia` (`npm run dev -- --mode cloud --port 3103`). Isso não altera o domínio público automaticamente.

As tabelas atuais têm prefixo `cd_`; a fonte versionada são os arquivos em `supabase/migrations/`. Não reaplique `supabase/schema.sql`: é uma proposta antiga com outro modelo. As migrações foram aplicadas remotamente, e os nomes/versões locais estão alinhados ao histórico remoto. Os tipos dos clientes foram gerados do banco. As rotas comerciais exibem o painel conectado filtrado por nicho; os recursos especializados anteriores ficam preservados em uma seção identificada como demonstração. O entregador ainda usa a prévia anterior.

Foram importados 18 perfis comerciais com os mesmos IDs do Guia, sem inventar estoque, preços ou disponibilidade. `accepting_orders` começa desativado. O proprietário precisa cadastrar as ofertas reais e ativar o recebimento. Pedidos e reservas passam pelo RPC transacional `cd_checkout`; usuários não podem confirmar pagamento ou conceder vínculos a si mesmos. O painel central possui catálogo e pedidos/reservas sincronizados. As telas especializadas descritas abaixo continuam como demonstração local; sua migração, TapTable e gateways de pagamento ainda não estão concluídos.

Validação: `node --test tests/business-rules.test.cjs tests/supabase-public.test.cjs`; `npm run typecheck`; `npm run build`. Os testes SQL de estoque, idempotência, conflitos e RLS foram executados no projeto em transações revertidas, sem pedidos ou usuários de teste permanentes.

## Demonstração anterior e módulos especializados

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
