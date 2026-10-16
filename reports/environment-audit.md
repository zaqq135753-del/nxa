# Relatório de Auditoria de Ambiente (Fase 0)
**Projeto:** NXA Skills Engine  
**Data:** 16 de Outubro de 2026  
**Ambiente:** Google Antigravity 2.0 (Host Windows)

---

## 1. Identificação do Sistema Operacional, Shell e Diretórios

- **Sistema Operacional:** Windows 11 Home Single Language (Build 10.0.26200, 64-bit)
- **Shell de Execução:** PowerShell 5.1
- **Diretório Atual de Trabalho:** `c:\Users\zaqq1\.codex\.chatgpt-projects\g-p-6a6a31087fe88191af175635469408c9`
- **Diretório Global de Configuração do Antigravity/Gemini:** `C:\Users\zaqq1\.gemini\config`
- **Diretório de Binários e Built-in do Antigravity:** `C:\Users\zaqq1\.gemini\antigravity`
- **Diretório de Artefatos da Sessão:** `C:\Users\zaqq1\.gemini\antigravity\brain\22cdc2c9-6405-460d-8230-18663e025dd2`

---

## 2. Versão do Google Antigravity e Recursos Nativos Disponíveis

- **Motor e Arquitetura:** Google Antigravity 2.0 / Customization Discovery Engine.
- **Subagentes Nativos Disponíveis:**
  - `self`: Subagente espelho com capacidades idênticas ao parent.
  - `research`: Navegação em código, busca e documentação em contexto isolado.
  - `code-reviewer`: Análise em 5 dimensões (corretude, legibilidade, arquitetura, segurança, performance).
  - `security-auditor`: Análise de vulnerabilidades, threat modeling e boas práticas defensivas.
  - `test-engineer`: Planejamento e execução de suites de testes (TDD/E2E).
  - `web-performance-auditor`: Diagnóstico de Core Web Vitals e gargalos de carregamento.
  - `image-generator`: Geração e edição visual de ativos.
- **Skills Built-in:**
  - `agy-customizations`: Especificação oficial do sistema de customizações.
  - `antigravity_guide`: Guia do ecossistema e CLI.
  - `automation`: Criação de rotinas agendadas e automações em background.
  - `generative_ui`: Renderização de widgets interativos HTML inline e standalone.
  - `migrate-workflows`: Migração de workflows legados para skills modernas.
  - `permissioned-github`: Ações autenticadas no GitHub.
  - `plugin`: Gestão e ciclo de vida de plugins.
  - `ui-plugin-navigation`: Painéis de UI integrados à IDE.

---

## 3. Diretórios de Skills, Regras e Workflows Suportados

Antigravity opera com um modelo hierárquico com prioridades rígidas (do maior para o menor):

| Nível | Localização | Escopo | Prioridade |
| :--- | :--- | :--- | :--- |
| **1. Workspace** | `<repo_root>/.agents/skills/<name>/SKILL.md` | Específico do repositório/projeto | **Máxima (1)** |
| **2. Declarações Workspace** | `<repo_root>/.agents/skills.json` | Manifestos locais | **2** |
| **3. Global Discovery** | `~/.gemini/config/skills/<name>/SKILL.md` | Máquina local / Todos os projetos | **3** |
| **4. Built-in** | `~/.gemini/antigravity/builtin/skills/` | Padrão do sistema Antigravity | **4** |
| **5. Global Declared** | `~/.gemini/config/skills.json` | Manifestos globais | **5** |

### Status de Workflows vs. Skills
- **Workflows (`.agents/workflows/*.md` ou `~/.gemini/config/workflows/*.md`):** Foram formalmente substituídos pelo padrão unificado de **Skills** (`SKILL.md`).
- As Skills provêm:
  1. Suporte direto a comandos slash na caixa de prompt (`/<nome-da-skill>`).
  2. Descoberta semântica automática pelo agente com *Progressive Disclosure* (apenas metadados no contexto até a ativação).
  3. Capacidades multifuncionais através das subpastas `scripts/`, `references/`, `examples/` e `resources/`.

---

## 4. Estrutura Obrigatória de `SKILL.md`

Cada skill é estruturada em um diretório próprio e necessita do frontmatter YAML:

```markdown
---
name: nome-da-skill
description: Descrição concisa em terceira pessoa explicando o que faz e exatamente quando deve ser ativada.
---

# Nome da Skill
Instruções precisas, procedimentos passo a passo, validações e referências.
```

Subpastas canônicas:
- `scripts/`: Utilitários executáveis (Node.js, PowerShell, Bash).
- `references/`: Manuais densos e especificações carregadas apenas sob demanda.
- `examples/`: Código e padrões de referência.
- `resources/`: Templates e ativos estáticos.

---

## 5. Carregamento de Regras e Ferramentas MCP

### Regras Hierárquicas (`AGENTS.md` / `GEMINI.md`)
- O agente varre a árvore de diretórios do CWD até a raiz do repositório.
- **Budget de Regras:** 24 KB por arquivo individual; 20.000 tokens no agregado. Arquivos que ultrapassam o orçamento são convertidos em apontadores de arquivo (carregados sob demanda).

### Ferramentas MCP (Model Context Protocol)
- Configuração Global: `C:\Users\zaqq1\.gemini\config\mcp_config.json`
- Configuração por Plugin: `plugins/<nome>/mcp_config.json`

---

## 6. Inventário de Ferramentas e Runtime Locais

| Ferramenta | Status | Versão / Caminho | Observações |
| :--- | :--- | :--- | :--- |
| **Node.js** | Presente | `v22.14.0` (LTS) | `C:\Users\zaqq1\AppData\Local\Programs\nodejs\node.exe` |
| **npm** | Presente | `10.9.2` | `C:\Users\zaqq1\AppData\Local\Programs\nodejs\npm.cmd` |
| **npx** | Presente | `10.9.2` | Operacional |
| **Git** | Presente | `2.48.1.windows.1` | `C:\Users\zaqq1\AppData\Local\Programs\MinGit\cmd\git.exe` |
| **GitHub CLI (gh)** | Presente | `gh.exe` | Autenticado e operacional |
| **Python** | Ausente/Alias | WindowsApps stub | Sem executável Python nativo registrado no PATH |
| **Dart** | Ausente | Não encontrado | Não presente no PATH |
| **Flutter** | Ausente | Não encontrado | Não presente no PATH |

*Impacto no NXA Skills Engine:* Utilitários e scripts de automação das skills devem prioritariamente ser escritos em **Node.js / TypeScript** ou **PowerShell**, garantindo compatibilidade total e imediata com o ambiente sem requerer a instalação externa de Python.

---

## 7. Diagnóstico das Skills e Configurações Existentes

### Skills Existentes em `C:\Users\zaqq1\.gemini\config\skills\` (32 itens)
- `agent-elements`, `api-and-interface-design`, `banner-design`, `brand`, `browser-testing-with-devtools`, `ci-cd-and-automation`, `code-review-and-quality`, `code-simplification`, `context-engineering`, `debugging-and-error-recovery`, `deprecation-and-migration`, `design`, `design-system`, `documentation-and-adrs`, `doubt-driven-development`, `frontend-ui-engineering`, `git-workflow-and-versioning`, `idea-refine`, `incremental-implementation`, `interview-me`, `observability-and-instrumentation`, `performance-optimization`, `planning-and-task-breakdown`, `security-and-hardening`, `shipping-and-launch`, `slides`, `source-driven-development`, `spec-driven-development`, `test-driven-development`, `ui-styling`, `ui-ux-pro-max`, `using-agent-skills`.

### Plugins Existentes em `C:\Users\zaqq1\.gemini\config\plugins\`
- `agent-skills`: Repositório clonado contendo suas próprias pastas de `skills/`, `agents/`, `commands/`, `hooks/`.

---

## 8. Conflitos, Duplicidades e Riscos Identificados

1. **Duplicação Ativa de Skills:**
   - 21 skills estão duplicadas entre `~/.gemini/config/skills/` e `~/.gemini/config/plugins/agent-skills/skills/`.
   - O Antigravity acusa carregamento duplo nos metadados de contexto.
2. **Diretório `ui-ux-pro-max-skill`:**
   - Foi clonado como repositório Git bruto dentro de `~/.gemini/config/skills/ui-ux-pro-max-skill`, coexistindo com a skill estruturada `ui-ux-pro-max`.
3. **Workspace com Projetos de Clientes:**
   - O diretório de trabalho atual contém projetos reais (`sources/`, planos B2B/B2C). A regra inegociável é manter isolamento estrito: o `nxa-skills-engine` e os testes devem residir em diretórios específicos sem tocar nas bases de código em produção.

---

## 9. Proteção e Permissões do Diretório de Destino

- Caminho: `C:\Users\zaqq1\.gemini\`
- Permissões: Acesso de leitura e escrita irrestrito para o usuário atual (`zaqq1`).
- Sincronização em nuvem: Não há bloqueio por OneDrive/Dropbox nas pastas `.gemini`.

---

## 10. Registro de Backup Executado

Antes de qualquer modificação, foi realizado o backup completo e íntegro:
- **Origem:** `C:\Users\zaqq1\.gemini\config`
- **Destino do Backup:** `C:\Users\zaqq1\.gemini\backups\config_backup_20261016`
- **Conteúdo Preservado:** Todas as 32 skills globais, plugins (`agent-skills`), `config.json`, `mcp_config.json`, projetos e referências.
