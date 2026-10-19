# Registro de Bugs e Armadilhas Evitadas (Bug Log) — Sliding Bubble Navigation

| ID | Data | Descrição do Problema | Causa Raiz | Solução Aplicada | Status |
|---|---|---|---|---|---|
| BUG-001 | 2026-10-18 | Perda de captura de ponteiro em toques rápidos ou arraste para fora da barra | Falta de `setPointerCapture` no elemento arrastável | Uso rigoroso de `e.currentTarget.setPointerCapture(e.pointerId)` no `pointerdown` e liberação no `pointerup`/`pointercancel`. | Mitigado por design |
| BUG-002 | 2026-10-18 | Saltos visuais na bolha ao redimensionar a janela (resize) | Coordenadas absolutas em pixels ficarem defasadas do container | Uso de `ResizeObserver` com recalculo dos centros dos ícones relativo ao bounding box do container. | Mitigado por design |
| BUG-003 | 2026-10-18 | Movimento excessivo para usuários com sensibilidade vestibular | Falta de tratamento de acessibilidade a movimento | Detecção de `window.matchMedia('(prefers-reduced-motion: reduce)')` e redução da transição para opacidade/instantânea. | Mitigado por design |
| BUG-004 | 2026-10-18 | Vazamento de listeners de ponteiro se o componente for desmontado durante arraste | Listener preso no document/window | Remoção de listeners em cleanup de `useEffect` e isolamento no container. | Mitigado por design |
