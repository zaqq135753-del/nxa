---
name: particles
description: >-
  High-performance WebGL particle systems: InstancedMesh, point clouds, physics simulation, custom particle shaders, and mobile optimization.
---

# WebGL Particle Systems

## Diretrizes
- Renderização de milhares de partículas utilizando `InstancedMesh` ou `Points` com atributos de buffer.
- Simulação de movimento na GPU via shaders para eliminar sobrecarga na thread principal.
