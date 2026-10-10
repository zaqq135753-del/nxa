# Caraíva Digital

Guia público de Caraíva: Home, Explorar, Agora, Mapa e Salvos. Interface tecnológica com temas claro/escuro, layouts para PC e celular e mapa ilustrado tropical. Posições ilustradas aproximadas; rotas a pé abrem o Google Maps.

Não inclui as áreas administrativas, backend ou banco do PMS. Dados demonstrativos são identificados no aplicativo.

## Executar

Node 22: `npm ci`, `npm run dev`. Produção: `npm run build`, `npm start`. Servidor usa PORT e disponibiliza /health e /guia.

## Vercel e domínio

Publicar no projeto Vercel existente de caraiva.digital após confirmar o vínculo Git e a branch de produção. Configuração em vercel.json: npm run build, saída dist, rotas /guia e /parceiros/cadastro. A configuração railway.json é uma alternativa legada, não indica hospedagem ativa. Variável opcional VITE_GOOGLE_MAPS_API_KEY precisa de restrições de API/origem. Sem chave, o mapa ilustrado permanece disponível. Nunca versionar .env ou tokens.

Cadastro de lojista: /parceiros/cadastro. Dados salvos somente no aparelho; ainda não existe envio, autenticação ou sincronização Supabase. Leia INTEGRACAO-PUBLICACAO.md e SEGURANCA-E-ONBOARDING.md para limites e pendências. Servidor Node local escuta 127.0.0.1; para hospedagem Node atrás de proxy, definir HOST=0.0.0.0. A Vercel serve dist e aplica vercel.json, não server.mjs.
