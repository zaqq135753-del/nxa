# Onboarding separado e segurança

## Alterado nesta entrega
- Cadastro independente em `/parceiros/cadastro?cadastro=REFERENCIA`, acessível pelo QR/link.
- Removidos banners de onboarding do Início e Business. Personalização do visitante não oferece cadastro de loja.
- Links antigos `/guia?cadastro=...` redirecionam ao cadastro separado.
- Edição de perfil continua no Business. Cadastro local não representa autenticação nem convite autorizado.
- Administração comercial deixa de aceitar permissões forjáveis no localStorage e fica bloqueada até autenticação real.
- Servidor serve somente dist, bloqueia arquivos ocultos, extensões não autorizadas, caminhos fora da pasta inclusive via symlink, e métodos diferentes de GET/HEAD.
- Cabeçalhos CSP, anti-enquadramento, permissões e referência restritos. Políticas de conexão precisam ser ampliadas explicitamente ao integrar Supabase/WPP.
- Código de produção minificado e sourcemaps desativados. Nenhum segredo deve existir no JavaScript público.
- Servidor local escuta 127.0.0.1. Em hospedagem que exige interface pública, configurar HOST=0.0.0.0 atrás do proxy HTTPS.

## Validação
- HTTP: guia e cadastro retornam 200; .env, server.mjs, package.json, src e .map retornam 404; caminhos inválidos 400/404; POST retorna 405.
- CSP presente nas respostas inclusive de erro.
- npm audit --omit=dev: zero vulnerabilidades conhecidas na consulta desta entrega. Isso não garante ausência de falhas.

## Próxima etapa obrigatória antes de operação real
1. Supabase Auth com sessão validada no servidor. MFA para administradores; recuperação de conta e revogação de sessões.
2. Aplicar e testar RLS e grants da base preparada: visitante lê somente perfis publicados; lojista acessa somente suas lojas; publicação e membros somente no servidor. Testar com dois lojistas distintos, anônimo e admin.
3. Convites QR com token aleatório, hash no banco, expiração, revogação e resgate atômico. Referência de cadastro nunca funciona como autorização.
4. Uploads com tamanho/tipo validados no servidor, reprocessamento de imagens, buckets e políticas de Storage restritos.
5. Backend valida campos e URLs (somente esquemas permitidos), identidade, vínculo, limites e estado de publicação. Ignorar permissões enviadas pelo cliente.
6. WPPConnect somente na rede privada/servidor; tokens e sessões fora do frontend; validar webhook, deduplicar eventos e autorizar cada solicitação por lojista. Sem alterações de terceiros por número informado no texto.
7. Hospedagem: HTTPS, WAF, limite de requisições por IP/conta, proteção de login/cadastro, firewall, atualização de runtime, backups e teste de restauração, monitoramento com logs sem segredos. HSTS após confirmar HTTPS de todos os domínios necessários.
8. Configurar mesmos cabeçalhos/regras na hospedagem real. Se ela não usa server.mjs, as regras deste servidor não são aplicadas automaticamente.

## Limite da ofuscação
Rotas e JavaScript utilizados pelo navegador podem ser vistos por quem acessa o site. Renomeá-los ou ofuscá-los não autoriza nem protege dados. Backend, segredos e tabelas privadas devem permanecer no servidor. Não existe garantia de impedir todos os ataques.

Referências: https://supabase.com/docs/guides/api/securing-your-api e https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
