---
name: cinematic-experience
description: >-
  Creates immersive cinematic experiences: choreographed transitions, scroll storytelling, smooth parallax, custom camera moves, particles, and adaptive performance.
---

# Cinematic Experience

## Objetivo e Escopo
Especializada em transformar landing pages, apresentações de produtos e transições de tela em experiências visuais memoráveis e fluidas a 60fps constantes. Coordena timelines complexas com GSAP ScrollTrigger, Motion React e shaders WebGL.

## Condições de Ativação
- Criação de landing pages cinematográficas, seções hero interativas, apresentações interativas de produtos ou narrativas por scroll.

## Princípios de Engenharia e Animação
- **Performance Adaptativa:**
  - Verificação de taxa de quadros e redução automática de partículas ou efeitos de blur caso o FPS caia abaixo de 45fps.
  - Respeito absoluto a `@media (prefers-reduced-motion: reduce)`: desativar transições de deslocamento e manter apenas fade in sutil ou visual estático limpo.
- **Sequenciamento Cinematográfico:**
  - Timelines com staggered animations (atraso de 0.04s a 0.08s entre itens sucessivos).
  - Curvas de aceleração realistas: `cubic-bezier(0.16, 1, 0.3, 1)` para entradas orgânicas de luxo.
- **Integração com Áudio e Vídeo:**
  - Compatibilidade com loops silenciosos de vídeo e transições frame-accurate via Remotion ou HTML5 Video com preload inteligente.
