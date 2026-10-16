---
name: create-3d
description: >-
  Slash command workflow /create-3d: Builds performant 3D WebGL scenes using Three.js and React Three Fiber with lights, cameras, custom shaders, and graceful 2D fallbacks.
---

# /create-3d Workflow

## Invocação
Digite `/create-3d` para planejar e desenvolver cenas e elementos 3D em tempo real na Web.

## Roteiro de Execução
1. **Justificativa de Produto:** Avaliar se o elemento 3D agrega valor real à experiência ou se uma alternativa vetorial/CSS é mais eficiente.
2. **Configuração de Canvas R3F:** Inicializar `<Canvas>` com pixel ratio limitado a 2, gerenciamento de cores sRGB e câmera calibrada.
3. **Iluminação e Materiais:** Luz ambiente suave, directional light com sombras otimizadas e materiais PBR (`MeshStandardMaterial` / `MeshPhysicalMaterial`).
4. **Gerenciamento de Recursos:** Descarte explícito de geometrias e texturas ao desmontar componentes (`dispose()`).
5. **Fallback Acessível:** Fornecer ilustração vetorial ou imagem estática caso WebGL não esteja disponível no navegador do cliente.
