---
name: architecture
description: >-
  Clean Architecture and domain-driven design principles for modern SaaS applications. Ensures clean boundaries, separation of concerns, and maintainable codebases.
---

# Software Architecture

## Objetivo e Escopo
Define a estrutura modular de aplicações SaaS, assegurando isolamento entre camadas de apresentação, domínio de negócios e acesso a dados.

## Padrão de Camadas Canônico
1. **Domain / Entities:** Tipos TypeScript puros, regras de negócio invariáveis e esquemas de validação (Zod).
2. **Application / Use Cases:** Serviços de orquestração, regras de cálculo e fluxos de transação.
3. **Infrastructure / Data Access:** Clientes Supabase, queries SQL, webhooks e integrações de terceiros.
4. **Presentation / UI:** Componentes React puros, páginas e hooks de interface.
