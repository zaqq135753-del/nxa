---
name: security
description: >-
  Defense-in-depth security engineering: input sanitization, CSRF/XSS mitigation, safe authentication flows, RLS, and secure environment variable handling.
---

# Security Standards

## Diretrizes
- Validação estrita de toda entrada de dados externos via esquemas tipados (Zod).
- Uso obrigatório de Row Level Security (RLS) no PostgreSQL.
- Proibição estrita de tokens e segredos em repositórios e no código de cliente.
- Sanitização de saídas para prevenção de injeção XSS e SQL.
