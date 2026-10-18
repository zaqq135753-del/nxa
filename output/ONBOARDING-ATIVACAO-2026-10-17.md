# Onboarding — fase A e revisão visual B

## Revisão do remoto
Remoto `nxacorp68-afk/nxa`, main em `82e2ac006be8a5c3a183e7bb5119a94bcfba8b4e`, consultado antes da publicação. Não havia novo commit remoto. Essa versão adicionou jornada, concierge, grupos e Business conectado. O onboarding anterior continuava local, com imagem única, revelação de prato/mesa para todos os nichos e URLs derivadas do nome. O patch atual preserva a jornada e exporta apenas arquivos desta entrega para o layout do Guia na raiz.

## Entrega
- /apresentacao, /parceiros/apresentacao, /parceiros/magic e /parceiros/cadastro usam o novo cadastro de quatro etapas.
- Oito nichos: restaurante, noite/bar, pousada, passeio, mercado, farmácia, loja e serviço. Campos e módulos finais dependem do nicho.
- Autosave local, salvamento autenticado e sincronização posterior com revisão otimista. Conflitos exigem escolha explícita. Link/QR retoma o rascunho após login da mesma conta; não transfere propriedade.
- Foto e logo opcionais JPG/PNG/WebP limitados a 300 KB cada. Prévia privada, confirmação de uso das imagens e dados do responsável separados do perfil público.
- RPC atômica cria cd_businesses e cd_members(owner), id estável aleatório e idempotência. Não publica nem ativa recebimento. Cadastro não é reserva nem pagamento.
- Painel Business seleciona o estabelecimento recém-criado por ID, verificando os vínculos da conta.
- Novo fluxo não gera links fictícios de checkout, Mesa01 ou saídas para WhatsApp.
- Conceito visual restaurante/pousada gerado, otimizado WebP 1536x1024 ~487 KB e incluído na tela de revisão artística. É conceito raster, não GLB nem réplica fiel.

## Banco
Migração business_activation_drafts aplicada no projeto ixqmvogmjvgmafmbbgli. Tabela com RLS e SELECT restrito ao proprietário. Sem escrita direta pelo cliente; wrappers invoker chamam funções privilegiadas em schema privado, com autenticação e validações. Não foram modificados pedidos ou estabelecimentos existentes. Testes com dados sintéticos e rollback.

## Verificação
- TypeScript strict e build cloud aprovados; verificação da saída pública: 54 arquivos, sem chaves privadas, fontes internas ou sourcemaps.
- 12 verificações do modelo: nichos, saneamento, coordenadas, URLs de imagem e entrada inválida.
- SQL: isolamento entre duas identidades, rejeição de revisão antiga, vínculo owner, defaults privados, idempotência, atualização/ativação por terceiro negadas e permissão anônima de ativação negada.
- Browser: fluxo de pousada, campo Acomodação, recuperação após recarregar, revisão e bloqueio de criação sem login. Desktop e viewport390; sem overflow horizontal no viewport móvel observado.
- Não foi enviado e-mail nem criado negócio comercial de teste. Login com link, sincronização entre dois aparelhos e upload manual ainda precisam de validação de sessão real; não declarar validação total desses caminhos.
- Advisor: nenhum novo alerta relativo à tabela criada. Avisos preexistentes: proteção contra senhas vazadas desativada e tabela administrativa privada com RLS sem política (nega acesso).

## Próximo gate acordado
Fase B: revisão dos conceitos visuais antes da produção da montagem GLB/animada (fase C). IA de extração, kit de lançamento, modelos por todos os nichos, publicação pública e réplica por captura não fazem parte desta entrega. Não simular essas funções. Gateway de pagamentos continua pendente de escolha.
