# Caraíva Digital — plano para aprovação

Status: proposta. Nenhuma alteração no aplicativo nesta etapa.
Escopo: somente `/guia`. Preservar PMS, autenticação e dados existentes.

## Diagnóstico

A entrega atual tem uma ilustração principal, movimentos ambientais e entradas de seções. Ainda não tem uma biblioteca de mídia real de Caraíva, transições coordenadas entre origem e destino, estados de carregamento por aba, sistema consistente de popups ou central de notificações. Esses itens não devem ser considerados concluídos pelos testes anteriores.

## Direção

Caraíva real como cenário: fotografia e vídeos curtos do rio, travessia, beira-rio, ruas de areia, praia e vida noturna. Interface areia clara, mangue, rio e dourado sobre superfícies legíveis. Movimento com começo e fim, ligado às ações do visitante. Ilustrações apenas como apoio.

## Entregas e revisões

### A — Curadoria real e amostra visual

Selecionar 12–18 fotos reais e até três vídeos curtos, com autor, local, licença/permissão, crédito, recortes para celular/desktop e imagem de fallback. Não apresentar Corumbau ou Praia do Espelho como se fossem a vila de Caraíva. Não usar imagem gerada como fotografia documental.

Entregar uma proposta visual navegável da Home, um card/perfil e uma troca de aba. Esta é a primeira revisão: aprovar a mídia e a linguagem de movimento antes de espalhá-las por todas as telas.

Referências pesquisadas:
- [Visit Brasil — Caraíva](https://www.visitbrasil.com/location/caraiva): referência editorial e visual; não presumir licença para reutilizar as fotos.
- [Foto de Marcelino Dias — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cara%C3%ADva,_Bahia,_Brasil.jpg): identificada como Caraíva, CC BY-SA 4.0. Registrar atribuição, licença e alterações exigidas na página da obra.
- [Galeria Caraíva — Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Cara%C3%ADva): avaliar qualidade e licença individual por arquivo.

Critério de aprovação: ver as imagens efetivamente escolhidas nos recortes finais, e três demonstrações de interação. Uma lista de links ou uma ilustração não substitui essa revisão.

### B — Home cinematográfica e cards

Background fotográfico real; vídeo curto apenas onde houver material autorizado e condições adequadas. Pôster imediato, vídeo sem som automático e pausa fora da tela. Sobreposição que preserve contraste e não cubra o local.

Cards com foto real, gesto de deslizar, encaixe, resposta de profundidade e transição da própria imagem até o perfil. Ao voltar, o visitante retorna ao mesmo card e à posição anterior. Salvar um lugar anima o coração e mostra confirmação com ação para desfazer.

Ponto de revisão: Home e uma jornada completa card → perfil → voltar funcionando no celular, sem saltos de posição.

### C — Abas e carregamentos próprios

Criar uma camada de transições coordenadas de saída/entrada; não apenas desmontar uma tela e aplicar fade na seguinte. Manter o Dock estável, com indicação animada da seleção e cancelamento seguro de toques rápidos.

- Início → Explorar: busca mantém continuidade, resultados entram em sequência.
- Explorar → Perfil: imagem e título se expandem do card para o detalhe.
- Agora: conteúdos entram como uma programação, com contexto de horário apenas quando sustentado por dados reais.
- Salvos: os lugares se acomodam como uma coleção pessoal; exclusão permite desfazer.
- Mapa: interface prepara a cena; carregamento termina quando o motor estiver pronto, com timeout e alternativa 2D.

Carregamento real: conteúdo em cache abre imediatamente; skeleton com a forma da próxima tela para espera curta; assinatura visual de rio/canoa para espera longa. Nenhuma espera artificial para exibir animação. Erro tem tentar novamente; lista vazia tem próxima ação. Visuais que imitam porcentagem só podem usá-la se houver progresso mensurável.

Ponto de revisão: rede rápida, rede lenta, offline, cliques repetidos e voltar. Foco, posição da rolagem e estado dos filtros precisam permanecer coerentes.

### D — Popups, feedback e notificações

Padronizar três componentes: confirmação breve de ação, painel deslizante para conteúdo e diálogo para decisões. Usar blur, profundidade e transições de entrada/saída coordenadas. Fechar por gesto quando apropriado, Escape e botão visível. Não empilhar mensagens que bloqueiam a ação principal.

Central de notificações dentro do guia: lidas/não lidas, preferências, origem e data. Criar mensagens somente a partir de eventos reais: salvar lugar, concluir rascunho, falha ao carregar, cadastro recebido quando a API confirmar. Eventos/ofertas dos estabelecimentos dependem de publicação verdadeira.

Notificações push fora do app, e-mail e WhatsApp são uma integração posterior com servidor, permissões e assinatura. Não apresentar toasts locais como mensagens enviadas.

Ponto de revisão: salvar/desfazer, erro/tentar novamente, convite pendente e central vazia. Nenhuma mensagem promocional inventada ou popup de entrada obrigatório em toda visita.

### E — Acolhimento e onboarding

Preservar dois fluxos: visitante e estabelecimento. Primeiro acesso com poucos campos, escolha de interesses, linguagem acolhedora e possibilidade de pular. Etapas com direção consistente, cards em perspectiva e prévia do resultado.

Retorno com saudação pelo nome e continuidade do progresso. Horário pode mudar o tom visual; clima, maré, lotação e oferta só mudam a interface com dados reais disponíveis.

Para a operação de cadastro: API exclusiva do guia, rascunho persistido no servidor, convite opaco com validade, acesso restrito e verificação do responsável. O link deve recuperar o cadastro central sem expor contato na URL. Entrega por e-mail/WhatsApp fica condicionada ao canal e provedor configurados; falhas ficam visíveis e podem ser reenviadas. O modo local atual permanece identificado até essa integração existir.

Ponto de revisão: iniciar no atendimento, continuar em outro aparelho e concluir, com confirmação efetiva do servidor.

### F — Acabamento e validação

Consolidar a linguagem em Explorar, Agora, Salvos, perfil, concierge, onboarding e mapa. Retirar sobreposições de CSS acumuladas: componentes usam tokens e estados próprios em vez de correções genéricas de cor.

Testar celular pequeno, tela curta, desktop, rede lenta e movimento reduzido. Confirmar contraste, teclado, foco em diálogos, áreas seguras e que o Dock não cobre ações. Validar build e jornadas completas, com capturas e gravações curtas que mostrem os movimentos de verdade.

Medir carregamento e fluidez em dispositivo definido; meta de fluidez próxima de 60 fps no aparelho de referência, sem prometer o mesmo em todo celular. Comprimir mídia, carregar só o necessário e pausar vídeo/efeitos invisíveis. Não tratar zero exceções JavaScript como prova de que APIs e dados funcionam.

## Implementação prevista

Reaproveitar React/Vite. Avaliar uma biblioteca de motion para coordenar presença, gestos e expansão compartilhada; usar CSS para efeitos ambientais simples, evitando dois motores concorrendo sobre o mesmo elemento. Verificar documentação e compatibilidade no início da implementação.

Arquivos existentes previstos: `GuiaCaraivaApp.tsx`, `CaraivaCinematicHero.tsx`, `CaraivaIntentionsBar.tsx`, `CaraivaDock.tsx`, `CaraivaOrb.tsx`, `StoriesEngine.tsx`, `CaraivaNearYouSection.tsx`, `CaraivaNowSection.tsx`, `CaraivaAgoraScreen.tsx`, `CaraivaSavedScreen.tsx`, `CaraivaBusinessDetailModal.tsx`, `GuideOnboarding.tsx` e estilos do guia. No mapa, alterar somente a interface e os estados de preparação; preservar o motor real.

Novos componentes previstos: `GuideTransition`, `GuideLoadingState`, `GuideSheet`, `GuideToastProvider`, `GuideNotificationCenter`, catálogo de mídia com créditos e adaptador de cadastro/convites. Nomes definitivos serão ajustados à auditoria antes de editar.

## Sequência de aprovação

1. Aprovar este escopo.
2. Entregar A: mídia escolhida e três interações demonstradas.
3. Aprovar essa amostra antes de aplicar B–E.
4. Revisar o conjunto em F antes de qualquer publicação.

A aprovação deste plano não significa que os recursos já estão implementados, nem autoriza compra de mídia, contratação de serviços ou envio de mensagens a pessoas.
