---
name: authentication
description: >-
  Secure authentication flows: passwordless magic links, OAuth providers, JWT session handling, secure HTTP-only cookies, and multi-factor auth (MFA).
---

# Authentication Architecture

## Diretrizes
- Armazenamento de sessões em cookies HTTP-only seguros, prevenindo roubo via XSS.
- Renovação automática e transparente de tokens de acesso através de refresh tokens.
