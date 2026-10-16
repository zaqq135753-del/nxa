---
name: optimize-saas
description: >-
  Slash command workflow /optimize-saas: Optimizes application performance across bundle splitting, database queries, caching strategies, mobile responsiveness, and Core Web Vitals.
---

# /optimize-saas Workflow

## Invocação
Digite `/optimize-saas` para acelerar o carregamento, reduzir o consumo de memória e aprimorar a responsividade geral do software.

## Roteiro de Execução
1. **Análise de Bundle:** Identificar bibliotecas gigantes e implementar dynamic imports (`React.lazy` ou Next.js dynamic).
2. **Otimização de Consultas:** Adicionar índices no PostgreSQL, reescrever joins custosos e restringir campos selecionados (`select id, name` em vez de `select *`).
3. **Estratégia de Cache:** Configurar cache stale-while-revalidate com TanStack Query ou SWR no cliente e headers HTTP adequados no servidor.
4. **Otimização de Mídia:** Conversão de imagens para formatos modernos (WebP/AVIF) com dimensões explícitas para evitar CLS.
5. **Verificação de Métricas:** Validar redução no LCP (Largest Contentful Paint) e FID/INP.
