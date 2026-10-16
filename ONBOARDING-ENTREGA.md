# Onboarding do lojista — entrega local

## O que mudou

Entrada `/guia?cadastro=<referencia>` abre diretamente o onboarding. QR e link podem ser exibidos e baixados no fluxo. O QR é gerado por biblioteca real; o gerador decorativo anterior também foi substituído nos consumidores existentes.

Etapas: identidade (logo opcional no início), responsável/contato, localização, horários, catálogo, fotos/detalhes, botões de contato e revisão. Todos os grupos do configurador anterior estão disponíveis. Horários, catálogo, fotos e botões podem ficar para depois. O cadastro essencial exige nome, categoria, responsável, e-mail válido e WhatsApp comercial.

O editor do Portal Business abre o mesmo componente e compartilha o mesmo rascunho por estabelecimento. Não há áudio nem cadastro conversacional nesta entrega. WhatsApp/WPPConnect permanece fora deste fluxo.

Novos cadastros não recebem telefone, localização, horário ou produtos fictícios. Logo e fotos aceitam PNG/JPG/WebP até 4 MB, são redimensionadas e têm prévia. Catálogo tem edição, remoção, preço, destaque e características. Galeria tem legenda, remoção e ordenação.

## Estado real

O banco será criado posteriormente, conforme informado pelo usuário. Autosave e conclusão são locais e identificados como tal. QR abre a mesma referência, mas não transfere dados privados entre aparelhos. Baixar JSON serve como cópia; não há importação automática. A conclusão local não cria login, não comprova vínculo, não envia à curadoria e não publica a loja.

Os dados são guardados em armazenamento local do navegador. Não é um cofre: evitar usar aparelho compartilhado. Exceções de falta de espaço exibem erro; o fluxo não confirma salvamento se ele falhar. Não há dados pessoais em QR ou query string.

## Próxima ligação com Supabase

`database/merchant-onboarding-bootstrap.sql` prepara candidaturas privadas, membros, configurações, perfis públicos, convites e auditoria. É uma base para projeto novo, ainda não executada nem validada num banco. Não executar por cima de um esquema existente sem revisão.

1. Criar projeto e autenticação do lojista/equipe.
2. Revisar/aplicar esquema em teste; validar grants/RLS com dois usuários e anônimo.
3. Adicionar Storage privado, upload de arquivos e referências; não persistir data URLs de imagem no JSON de produção.
4. Ligar autosave autenticado e importação consentida do rascunho local.
5. Implementar convite com token opaco armazenado como hash, prazo e vínculo aprovado. A referência local atual não é credencial.
6. Implementar envio, análise e publicação no servidor, com auditoria e verificação de acesso. Workers com chave de serviço precisam verificar ator e vínculo explicitamente.
7. Alimentar o guia pelos perfis aprovados, mantendo dados privados fora das respostas públicas.

## Preservação e execução

Alterações limitadas à cópia `caraiva-public-release`. O original kamra-pms, caraiva-sprint-a e os arquivos em sources não foram editados. Dependências QR fixadas no package.json/lockfile. Usar `npm ci` e `npm run build` para reproduzir; `npm start` serve a versão compilada. Não houve deploy.

## Ajuste mobile — 09/10/2026
- Margens consistentes e colunas limitadas à largura disponível.
- Filtros, atalhos e etapas do cadastro passam a quebrar em linhas.
- Textos longos, campos, ações e fotos do cadastro respeitam a coluna.
- Cabeçalho Business com seletor em linha própria no mobile.
- Conferência em navegador: Início e cadastro a 390px; Explorar e Salvos a 320px, sem largura extra da página.
- Alterações locais: não publicadas em caraiva.digital. Banco ainda pendente de configuração.
