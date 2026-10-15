# Kamra PMS e Caraíva Digital — estrutura e hospedagem

Estado em 7 de outubro de 2026: Sprint A e Live Map Fase 1 aplicados ao projeto local. PMS permanece em demonstração, por decisão do usuário. Publicação do PMS completo suspensa. Nenhum projeto, banco ou domínio foi provisionado na Railway nesta entrega. A conexão Railway está acessível; consultas de identidade ao GitHub retornaram erro de ferramenta indisponível, apesar de o plugin constar instalado. Repositório remoto ainda não criado.

## Estrutura atual

Raiz: `C:/Users/zaqq1/OneDrive/1/fluu.yi/kamra-pms`.

- `frontend/`: aplicação React 19, TypeScript e Vite. `src/screens/` contém páginas, `components/` a interface compartilhada, `services/` integrações, `data/` cadastros do guia, `lib/` API/autenticação/roteamento, `public/` assets públicos.
- `kamra/`: aplicação Python para Frappe 16. `kamra/doctype/` entidades e regras do PMS; `www/` páginas servidas pelo backend; `templates/` templates; `channels/` integrações de canais; `localization/` localização; `patches/` migrações; `tests/` testes; `public/` recursos publicados.
- `deploy/`: instalador e instruções de hospedagem existentes. O instalador atual usa Docker Compose com MariaDB, Redis e imagem Kamra/Frappe; não é uma configuração Railway pronta.
- `mcp/`: integração de ferramentas para agentes; `docs/` e `docs-site/`: documentação; `.github/workflows/`: automações existentes; `branding/`: identidade visual.

## Guia e mapa

`App.tsx` registra `/guia`, carregado sob demanda por `GuiaCaraivaApp.tsx`. O guia usa abas internas: Home, Explorar, Agora, Mapa e Salvos. Elas não são subrotas; recarregar volta à Home. No backend Frappe, o prefixo padrão é `/kamra`; uma hospedagem que exponha o frontend na raiz deve definir `VITE_ROUTER_BASENAME=/` e encaminhar `/guia` para a aplicação.

Sprint A acrescentou Living Header, Dock, Orb e estilos com safe-area, sem reestruturar o restante do PMS. O Live Map substitui apenas o conteúdo da aba Mapa, mantém o Dock e oculta header/Orb externos durante essa experiência.

`services/maps/liveMapModel.ts` transforma os cadastros existentes em pontos, filtra e agrupa. `components/guia/live-map/` contém o controlador, engines Google 3D/2D, mapa ilustrado, Orbs e estilos. Os engines são carregados sob demanda. Falha de 3D permite 2D; falha/ausência da plataforma permite ilustração, rotulada com posições aproximadas. GPS real habilita distâncias; localização padrão não é apresentada como GPS do usuário.

Dados abertos/fechados são snapshots do cadastro. Eventos só entram em Agora dentro de seu intervalo válido. Salvos são preferências locais; não equivalem a ranking pago. Não foram implementados cards progressivos, Rank, novas rotas, QR/NFC ou analytics de servidor nesta fase.

Google Maps usa `VITE_GOOGLE_MAPS_API_KEY`; a chave embutida foi removida do loader. A configuração real da API e sua cobertura 3D ainda precisam ser verificadas. O modo ilustrado funciona sem chave. O script global Cesium já existente foi preservado e ainda pode afetar o carregamento geral.

## Arquitetura proposta para Railway — ainda não implantada

Uma implantação completa precisa de frontend/proxy público, backend Frappe, serviço websocket, workers, scheduler, MariaDB, Redis e volumes persistentes. É necessário construir uma imagem com este código customizado; publicar somente a imagem Kamra original perderia as alterações locais. Os recursos estáticos devem corresponder à mesma versão do backend.

O domínio gerado pela Railway ficará no serviço público. Somente esse serviço deve receber tráfego externo; banco, Redis e processos de trabalho devem se comunicar por rede privada. A escolha de topologia dos volumes e sincronização dos arquivos/sites entre processos precisa ser validada antes de provisionar. Docker Compose não deve ser tratado como deploy automático equivalente na Railway.

Antes da publicação: restaurar autenticação real e autorização no servidor, configurar credenciais por variáveis privadas, inicializar o site Frappe, instalar Kamra e dependências, executar migrações, configurar backup e validar login, reservas, folios, tarefas e isolamento entre estabelecimentos com banco real. A inicialização deve distinguir primeira instalação de reinicialização sem apagar dados.

O usuário decidiu manter a demonstração neste momento. As rotas administrativas liberadas e sessões locais de demonstração não foram alteradas. Isso impede tratar o estado atual como PMS de produção autenticado.

## Repositório

O projeto local está dentro de um repositório pai com outros trabalhos. A entrega do guia foi versionada em cópia isolada, na branch `feature/caraiva-live-map-phase-1`, sem mudar a branch do pai. Para criar o repositório remoto completo, usar uma origem nova contendo apenas Kamra, revisar segredos e excluir ambientes locais, dependências, caches, dados/backup e builds gerados. Não publicar o histórico da cópia de auditoria: sua baseline contém o loader legado com chave embutida.

O repositório remoto e o domínio serão documentados aqui somente depois de criados e verificados. Não existem URLs novas de publicação nesta entrega.
