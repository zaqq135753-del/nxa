# Caraíva Digital

Guia público de Caraíva com Home, Explorar, Agora, Mapa, Salvos, temas claro/escuro e layouts para PC e celular. Mapa ilustrado com posições aproximadas; Como chegar abre as rotas a pé do Google Maps.

Esta versão não inclui as páginas administrativas, backend ou banco do PMS. Dados demonstrativos permanecem identificados. Funções dependentes de serviços externos exigem sua configuração.

## Desenvolvimento

Node 22: `npm ci`, `npm run dev`. Validar e gerar arquivos: `npm run build`. O resultado fica em `dist/`.

## Hospedagem Hostinger

Publicação ainda não executada. Para hospedagem estática pelo hPanel, enviar o conteúdo de `dist/`, incluindo `.htaccess`, à pasta pública do site caraiva.digital. Não enviar node_modules, .env ou o código-fonte à pasta pública. A raiz e /guia abrem o guia. Rotas do PMS não são publicadas.

Para VPS ou hospedagem Node, `npm start` serve o build, usa PORT e oferece /health. Não é necessário servidor Node para hospedagem estática.

## Integrações

Google Maps 2D/3D usa VITE_GOOGLE_MAPS_API_KEY no build, com restrições de API e origem para o domínio publicado. Sem configuração, o mapa ilustrado continua disponível. Nunca incluir chaves privadas OpenAI no frontend ou no GitHub; uma integração de IA de produção precisa de um serviço seguro.
