---
name: three-d-optimization
description: >-
  3D performance optimization: Draw call reduction, texture compression, geometry level of detail (LOD), frustum culling, and mobile throttling.
---

# 3D WebGL Optimization

## Diretrizes
- Minimização de draw calls agrupando geometrias idênticas.
- Limitação do `dpr` (device pixel ratio) a no máximo 2 para evitar superaquecimento de GPUs móveis.
