# Integração do cadastro e publicação

Base remota conferida: nxacorp68-afk/nxa, main, commit 8d516c6706910e813f86d2489f1db63a2255859e. Integração preparada na branch feature/merchant-onboarding-release. O domínio responde pela Vercel, mas a conta, o vínculo Git, a branch de produção e o diretório raiz ainda dependem de acesso autenticado ao projeto existente. Não publicar em outro projeto por inferência.

## Entrega

- Página independente /parceiros/cadastro, QR real e redirecionamento dos links /guia?cadastro=.
- Oito etapas, logo opcional, conclusão essencial e continuação local. Sem áudio, login, envio ou sincronização simulados.
- Business mantém edição; ofertas/eventos e edição são identificados como demonstração local.
- Ajustes mobile importados e transição da página corrigida para não ampliar sua largura; efeitos nos cards e mapa preservados.
- vercel.json contém as quatro rotas e cabeçalhos CSP, anti-enquadramento, referência e permissões. Esses cabeçalhos só estarão ativos após deploy e conferência no domínio.
- Pós-build recusa fontes, arquivos internos, dotfiles, links simbólicos, chaves privadas reconhecidas e sourcemaps na saída. Apache .htaccess fica em deploy/, fora de dist.
- Removida leitura de chave OpenAI em variável pública/localStorage. Integração privada de IA aguarda backend.
- Administração comercial bloqueada no cliente até sessão de backend; isso não substitui autorização no servidor. Painel Business atual é apenas demonstração local.

## Pendências de infraestrutura

Validação local: build TypeScript/Vite e verificação pública passaram; npm audit --omit=dev retornou zero vulnerabilidades conhecidas. Navegador: 320/390/768/1440 px em Início, Explorar, Agora, Salvos, mapa, perfis, Business/editor e oito etapas; conclusão/reload, link legado, QR decodificado, rascunho inválido e tentativa de habilitar admin pelo localStorage passaram sem pageerrors. HTTP: páginas 200, fontes/.env/mapas de código 404 e POST 405. A validação usa o servidor local; não confirma configuração aplicada na Vercel ou GPS/câmera em telefone real.

Supabase ainda não integrado: SQL é preparação, não proteção ativa. Antes de executar, revisar em projeto novo e testar RLS/grants com anônimo e dois lojistas. Faltam autenticação real, vínculo por loja, uploads privados, validação no servidor, convites com hash criptográfico/expiração/revogação, envio/aprovação/publicação, backups e teste de restauração. WPPConnect permanece fora do frontend; futuro servidor deve autenticar, autorizar por loja e deduplicar webhooks.

WAF, limites de requisição, logs e monitoramento da Vercel precisam de acesso ao projeto e verificação própria. Sem alegação de ativação. Não houve alteração de DNS.

## Publicação no projeto existente

Confirmar Settings → Git (repo e branch de produção), Build and Deployment (root, npm run build, dist), Domains (caraiva.digital). Integrar somente após conferir alterações remotas. Após deploy, validar HTTP e reload de /parceiros/cadastro, QR/legado, /guia, headers, arquivos proibidos e console. Não usar as proteções de server.mjs como evidência das regras estáticas da Vercel.
