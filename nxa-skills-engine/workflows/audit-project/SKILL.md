---
name: audit-project
description: >-
  Slash command workflow /audit-project: Deep technical audit across architecture, dead code, security flaws, RLS, dependency hygiene, performance bottlenecks, and a11y.
---

# /audit-project Workflow

## Invocação
Digite `/audit-project` para executar um diagnóstico completo e rigoroso de qualquer base de código.

## Roteiro de Execução
1. **Varredura Arquitetural:** Identificar duplicação de responsabilidades, acoplamento indevido e ausência de separação de camadas.
2. **Auditoria de Segurança:** Checar vazamento de chaves privadas, integridade de autenticação e proteção RLS no banco.
3. **Auditoria de Código Morto:** Localizar componentes, arquivos de teste órfãos ou dependências não utilizadas no package.json.
4. **Auditoria de Performance:** Diagnosticar renders desnecessários no React e consultas N+1 ao banco.
5. **Emissão de Relatório:** Classificar achados por criticidade (Crítico, Alto, Médio, Baixo) com plano de remediação imediato.
