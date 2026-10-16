---
name: production-readiness
description: >-
  Comprehensive pre-flight checklist and automated verification before deploying SaaS to production: TypeScript build, security audit, RLS validation, clean credentials, and rollback plans.
---

# Production Readiness

## Objetivo e Escopo
Skill de certificação de prontidão de lançamento. Nenhuma funcionalidade ou aplicação SaaS deve ser promovida a produção sem cumprir os 10 critérios da checklist de auditoria.

## Checklist de 10 Pontos de Prontidão
1. **Type-Check Limpo:** Execução de `tsc --noEmit` sem qualquer erro ou tipo `any` tolerado.
2. **Build de Produção Verificado:** Execução de `npm run build` com zero warnings impeditivos.
3. **Segurança de Banco & RLS:** Políticas RLS ativas em 100% das tabelas que armazenam dados sensíveis.
4. **Zero Credenciais Expostas:** Varredura completa para garantir ausência de chaves privadas em arquivos frontend ou commits.
5. **Autenticação e Autorização:** Teste positivo de login e teste negativo de acesso a recursos entre tenants diferentes.
6. **Fluxos Críticos com Smoke Tests:** Teste E2E automatizado para o fluxo de conversão/checkout ou onboarding.
7. **Performance e Bundle Size:** Chunks de carregamento inicial mantidos abaixo de limites aceitáveis; Core Web Vitals estáveis.
8. **Acessibilidade Básica:** Zero violações críticas de contraste ou falta de labels em formulários essenciais.
9. **Observabilidade e Logs:** Tratamento global de erros (`ErrorBoundary` no React) e captura de exceções no servidor.
10. **Plano de Rollback Documentado:** Procedimento claro para reversão de versão em caso de instabilidade pós-deploy.
