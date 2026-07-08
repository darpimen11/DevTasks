# CLAUDE.md — Instruções do Agente para o projeto DevTasks

Este arquivo é o guia operacional para você (agente de código) trabalhar neste repositório.
Antes de tocar em qualquer código, leia `README.md`, `ROADMAP.md` e `DESIGN.md` na raiz — eles têm o contexto completo do produto, da stack e do design system. Este arquivo aqui é o "o que fazer agora", não repita decisões que já estão nesses três arquivos.

## 🎯 Objetivo de hoje
Entregar **Fase 0 (Setup) + Fase 1 (MVP)** do ROADMAP.md, 100% funcional, rodando localmente. Não avance para Fase 2+ antes de terminar e validar a Fase 1.

## Regras gerais de execução
1. Trabalhe em ordem — cada tarefa abaixo depende da anterior. Não pule etapas.
2. Depois de cada tarefa concluída, rode o projeto (`npm run dev`) e confirme que não quebrou nada antes de seguir.
3. Faça commits pequenos e frequentes, seguindo Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`). Um commit por tarefa concluída, não um commit gigante no final.
4. Não decida stack por conta própria — use exatamente o que está em `README.md` (React + TypeScript + Vite + Tailwind + Zustand + Framer Motion). Se algo não estiver claro, siga a estrutura de pastas definida em `DESIGN.md`.
5. Use as cores, tipografia e tokens de `DESIGN.md` desde o primeiro componente — não estilize "provisoriamente" com cores aleatórias.
6. Não implemente autenticação, backend, GitHub integration, ou qualquer coisa de Fase 2+ hoje. Foco total no MVP local (localStorage).
7. Se encontrar ambiguidade não coberta nos arquivos de contexto, tome a decisão mais simples possível que não comprometa o roadmap, e documente a decisão num comentário curto no código.

## 🧱 Ordem de execução

### 1. Setup do projeto
- [ ] Criar projeto com Vite (`npm create vite@latest . -- --template react-ts`)
- [ ] Instalar e configurar Tailwind CSS (`darkMode: 'class'` no config, conforme DESIGN.md)
- [ ] Instalar Zustand e Framer Motion
- [ ] Configurar ESLint + Prettier
- [ ] Criar a estrutura de pastas exatamente como descrita em `DESIGN.md` (features/tasks, components/ui, components/layout, store, hooks, lib, styles, utils)
- [ ] Configurar `globals.css` com as CSS variables de cor (light + dark) definidas em DESIGN.md
- [ ] Adicionar fonte Inter (via Google Fonts ou self-hosted)
- [ ] Validar: `npm run dev` sobe sem erros, tela em branco estilizada com as cores corretas

### 2. Layout base
- [ ] Componente `PageWrapper` (estrutura sidebar + header + conteúdo, conforme DESIGN.md seção 4)
- [ ] `Sidebar` estático (sem lógica ainda — só estrutura visual: logo, espaço para categorias, espaço para toggle de dark mode)
- [ ] `Header` estático (busca visual, botão "+ Nova Tarefa")
- [ ] Responsivo: sidebar vira drawer em mobile (pode ser só o esqueleto, funcionalidade de abrir/fechar entra na Fase 3)
- [ ] Validar: layout reconhecível nas duas resoluções (desktop e mobile), fiel ao DESIGN.md

### 3. Store de tarefas (Zustand)
- [ ] Definir tipo `Task` (id, título, descrição, concluída, createdAt — nada de categoria/prioridade ainda, isso é Fase 2)
- [ ] Store com: `addTask`, `toggleTask`, `editTask`, `deleteTask`, `tasks[]`
- [ ] Persistência em localStorage (middleware `persist` do Zustand)
- [ ] Validar: dar refresh na página e as tarefas continuam lá

### 4. CRUD de tarefas na UI
- [ ] `TaskForm` — criar nova tarefa (título obrigatório, descrição opcional)
- [ ] `TaskList` + `TaskCard` — listar tarefas
- [ ] Checkbox para marcar como concluída (visual: strikethrough no texto quando concluída)
- [ ] Editar tarefa (pode ser inline ou modal simples — decida pelo mais rápido de implementar bem)
- [ ] Excluir tarefa, com confirmação (modal simples ou `window.confirm` mesmo, não precisa ser bonito hoje)
- [ ] Empty state: quando não há tarefas, mostrar mensagem amigável + call-to-action para criar a primeira
- [ ] Validar: fluxo completo de criar → editar → concluir → excluir funciona sem bugs

### 5. Finalização do MVP
- [ ] Revisar responsividade em mobile
- [ ] Revisar se as cores/tipografia batem com DESIGN.md em todos os componentes criados
- [ ] Rodar build de produção (`npm run build`) e confirmar que não há erros
- [ ] Atualizar o `ROADMAP.md`: marcar os checkboxes concluídos de Fase 0 e Fase 1
- [ ] Commit final: `chore: MVP da Fase 1 completo`

## ✅ Definição de "MVP pronto hoje"
- App sobe com `npm run dev` sem erros e sem warnings de console.
- Dá para criar, ver, editar, concluir e excluir uma tarefa, com os dados sobrevivendo a um refresh de página.
- Visual já reflete a paleta de cores e tipografia do DESIGN.md (mesmo que dark mode ainda não tenha o toggle funcional — isso é Fase 3).
- Nenhum código de Fase 2 em diante foi implementado antes disso estar 100% funcionando.

## 🚫 Não fazer hoje
- Categorias e prioridades (Fase 2)
- Dark mode toggle funcional (Fase 3) — pode deixar os tokens de cor prontos, mas o switch em si não é hoje
- Backend, autenticação, GitHub integration (Fase 5+)
- Testes automatizados (Fase 8) — foco em entregar funcional primeiro

Se terminar tudo isso com tempo sobrando, pode começar a Fase 2 (categorias/prioridades), mas registre isso claramente separado no commit, não misture com o MVP.
