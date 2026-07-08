# 🗺️ ROADMAP — DevTasks

Roadmap organizado em fases incrementais. A ideia é sempre ter algo funcional e "mostrável" ao final de cada fase — bom tanto pra motivação quanto pra portfólio.

---

## Fase 0 — Setup & Fundação
- [x] Criar repositório e estrutura inicial (Vite + React + TS)
- [x] Configurar Tailwind CSS
- [x] Configurar ESLint + Prettier
- [x] Configurar Zustand (store base)
- [x] Configurar roteamento (React Router, se necessário)
- [x] Definir design tokens (cores, fontes, espaçamentos) — ver DESIGN.md
- [ ] Deploy inicial "hello world" na Vercel (pra já ter CI/CD rodando desde o início)

## Fase 1 — MVP (Core do To-do)
- [x] Criar tarefa (título + descrição)
- [x] Listar tarefas
- [x] Marcar como concluída
- [x] Editar tarefa
- [x] Excluir tarefa (com confirmação)
- [x] Persistência em localStorage
- [x] Estado vazio (empty state) bem cuidado
- [x] Responsivo (mobile-first)

## Fase 2 — Organização
- [x] Categorias/Projetos (criar, editar, cor personalizada, excluir)
- [x] Prioridades (Baixa/Média/Alta/Urgente) com cores e ícones
- [ ] Datas de vencimento (com destaque para atrasadas/"hoje")
- [x] Filtros combinados (categoria + prioridade + status + busca por texto)
- [x] Ordenação (por prioridade, data, criação, alfabética)

## Fase 3 — Dark Mode & UX
- [x] Dark mode com toggle manual
- [ ] Detecção automática de preferência do sistema (`prefers-color-scheme`)
- [ ] Persistir escolha do usuário
- [ ] Transição suave entre temas (ver DESIGN.md)
- [ ] Microanimações (criar/concluir/excluir tarefa)
- [ ] Skeleton loaders / estados de carregamento
- [ ] Toasts de feedback (tarefa criada, excluída, etc.)
- [ ] Atalhos de teclado básicos (ex: `N` para nova tarefa)

## Fase 4 — Produtividade Avançada
- [ ] Subtarefas / checklists aninhados
- [ ] Tarefas recorrentes (diária, semanal, mensal, custom)
- [ ] Drag and drop para reordenar
- [ ] Visão Kanban (To Do / Doing / Done) como alternativa à lista
- [ ] Command Palette (`Cmd/Ctrl + K`)
- [ ] Tags (além de categorias — mais granular e livre)

## Fase 5 — Diferenciais "Dev" 🐙
- [ ] Descrições em Markdown com preview
- [ ] Syntax highlighting para snippets de código na descrição
- [ ] Integração com GitHub: importar issues como tarefas
- [ ] Vincular tarefa a uma branch/commit (link manual ou via API)
- [ ] Templates de tarefa (ex: "Bug report", "Feature request")

## Fase 6 — Dados & Backend
- [ ] Migrar persistência de localStorage → backend próprio (Node + Prisma + PostgreSQL)
- [ ] Autenticação (login/cadastro, OAuth com GitHub faz sentido pro projeto)
- [ ] Sincronização multi-dispositivo
- [ ] Exportar/Importar dados (JSON, CSV)
- [ ] Backup automático

## Fase 7 — Insights & Engajamento
- [ ] Dashboard de estatísticas (tarefas concluídas por dia/semana, distribuição por categoria)
- [ ] Streak de produtividade (dias seguidos completando ao menos 1 tarefa)
- [ ] Gráfico de burndown simples por categoria/projeto
- [ ] Notificações/lembretes (push do navegador)

## Fase 8 — Polimento & Lançamento
- [ ] PWA (instalável, funciona offline)
- [ ] Testes (unitários com Vitest + componentes com Testing Library)
- [ ] Acessibilidade (navegação por teclado, contraste, aria-labels)
- [ ] Onboarding para novos usuários (tour rápido)
- [ ] Página de landing/marketing simples
- [ ] Deploy final + domínio próprio
- [ ] README com GIFs/screenshots reais do app funcionando

---

## 💡 Ideias para o futuro (backlog sem prazo)
- Colaboração (compartilhar categoria/projeto com outra pessoa)
- App mobile (React Native/Expo reaproveitando lógica)
- Extensão de navegador (criar tarefa rápida de qualquer aba)
- Integração com Google Calendar
- Modo "foco" (Pomodoro embutido, vinculado à tarefa ativa)
- IA para sugerir prioridade/categoria automaticamente com base no texto da tarefa

---

### Como usar este roadmap
Recomendo tratar cada fase como um milestone no GitHub Issues/Projects, e cada checkbox como uma issue. Isso já deixa o repositório com uma "gestão de projeto" visível — ótimo para quem for ver seu perfil.
