# Registro de Bugs e Armadilhas Evitadas (Bug Log) — Sliding Bubble Navigation

| ID | Data | Descrição do Problema | Causa Raiz | Solução Aplicada | Status |
|---|---|---|---|---|---|
| BUG-001 | 2026-10-18 | Perda de captura de ponteiro em toques rápidos ou arraste para fora da barra | Falta de `setPointerCapture` no elemento arrastável | Uso rigoroso de `setPointerCapture` e liberação no `pointerup`/`pointercancel` no container pai do trilho. | Resolvido |
| BUG-002 | 2026-10-18 | Saltos visuais na bolha ao redimensionar a janela (resize) | Coordenadas absolutas em pixels ficarem defasadas do container | Uso de `ResizeObserver` com recalculo dos centros dos ícones relativo ao bounding box do container. | Resolvido |
| BUG-003 | 2026-10-18 | Movimento excessivo para usuários com sensibilidade vestibular | Falta de tratamento de acessibilidade no loop JS do Motion | Importação de `useReducedMotion()` do `motion/react` com spring instantâneo. | Resolvido |
| BUG-004 | 2026-10-18 | Vazamento de listeners de ponteiro se o componente for desmontado durante arraste | Listener preso no document/window | Remoção de listeners em cleanup de `useEffect` e isolamento no container. | Resolvido |
| BUG-005 | 2026-10-18 | Arraste inoperante por bloqueio de eventos em z-index | `.sbn-item` com `z-index: 2` cobrindo a bolha com `z-index: 1` | Manipuladores de Pointer Events e captura delegados ao container `.sbn-rail`, permitindo arrastar de qualquer ponto. | Resolvido |
| BUG-006 | 2026-10-18 | Desalinhamento da bolha e glow | `style={{ x: smoothX }}` do Motion sobrescreve `transform: translate(-50%, -50%)` do CSS | Centralização vertical com `top: calc(50% - var(--sbn-bubble-size)/2)` e `translateX: "-50%"` no Motion. | Resolvido |
| BUG-007 | 2026-10-18 | Gradiente com tons verdes em abas de outras cores | Variáveis `--bubble-color-light`/`dark` ausentes no style | Adoção de `color-mix(in srgb, var(--bubble-color), ...)` nativo no CSS. | Resolvido |
| BUG-008 | 2026-10-18 | Voo espúrio da bolha do pixel 0 até a aba ativa na montagem inicial | `targetX` inicializado em 0 antes do cálculo dos centros | Uso de `smoothX.jump(initialCenter)` na primeira medição de centros. | Resolvido |
| BUG-009 | 2026-10-18 | Grid fixo em 5 colunas quebrando se lista tiver tamanho diferente | `grid-template-columns: repeat(5, 1fr)` no CSS | Injeção dinâmica de `gridTemplateColumns: repeat(items.length, 1fr)` no container do trilho. | Resolvido |
