---
name: cinematic-motion
description: >-
  Slash command workflow /cinematic-motion: Designs fluid timelines, scroll triggers, scene transitions, and micro-interactions with 60fps performance and motion accessibility.
---

# /cinematic-motion Workflow

## Invocação
Digite `/cinematic-motion` para criar coreografias de animação profissionais, páginas com scroll narrativo ou apresentações de alto impacto visual.

## Roteiro de Execução
1. **Seleção da Engine:** Escolher Motion React (para microinterações e UI reativa) ou GSAP ScrollTrigger (para timelines complexas atreladas a rolagem).
2. **Definição de Timings:** Curvas de aceleração orgânicas, tempos de transição entre 180ms e 400ms.
3. **Coreografia de Elementos:** Entrada escalonada (*stagger*) e preservação de estabilidade de layout.
4. **Auditoria de FPS:** Garantir uso estrito de propriedades transformáveis pela GPU (`transform: translate3d`, `scale`, `opacity`), evitando animações que provoquem repintura (`width`, `height`, `top`, `margin`).
5. **Acessibilidade:** Implementar chaveamento transparente para usuários com `prefers-reduced-motion`.
