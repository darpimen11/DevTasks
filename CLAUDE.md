# CLAUDE.md — Fase 2: Categorias & Prioridades

O MVP (Fase 0 + Fase 1) já está validado e funcionando — não mexa nessa base a não ser que seja estritamente necessário para as tarefas abaixo. Este arquivo substitui o escopo anterior: o objetivo agora é **Fase 2 do ROADMAP.md** (Organização).

Observação: o dark mode toggle já foi implementado (adiantado da Fase 3) — não precisa reimplementar, só garanta que os novos componentes desta fase respeitem as cores de dark mode do `DESIGN.md`.

## 🎯 Objetivo desta etapa
Adicionar Categorias e Prioridades às tarefas, com filtros e ordenação funcionando.

## Regras gerais
1. Siga a ordem abaixo — cada tarefa depende da anterior.
2. Rode `npm run dev` depois de cada tarefa concluída para validar antes de seguir.
3. Commits pequenos, Conventional Commits, um por tarefa.
4. Use as cores semânticas de prioridade já definidas em `DESIGN.md` (seção 2) — não invente novas cores.
5. Não implemente tags, subtarefas, drag-and-drop ou Kanban ainda — isso é Fase 4.
6. Ao terminar, atualize os checkboxes correspondentes no `ROADMAP.md`.

## 🧱 Ordem de execução

### 1. Modelo de dados
- [ ] Criar tipo `Category` (id, nome, cor)
- [ ] Criar tipo `Priority` como union type: `'low' | 'medium' | 'high' | 'urgent'`
- [ ] Atualizar tipo `Task` para incluir `categoryId?: string` e `priority: Priority` (default `'medium'` ao criar)
- [ ] Criar store `categoriesStore.ts` (Zustand + persist): `categories[]`, `addCategory`, `editCategory`, `deleteCategory`
- [ ] Ao excluir uma categoria, decidir e documentar o comportamento: tarefas daquela categoria ficam sem categoria (não excluir as tarefas)

### 2. UI de categorias
- [ ] Componente `CategoryBadge` (bolinha de cor + nome, reutilizável)
- [ ] Seção de categorias na `Sidebar`: listar categorias com contador de tarefas, opção de criar nova (modal simples reutilizando o `Modal` já existente)
- [ ] Formulário de categoria: nome + seletor de cor (pode ser uma paleta fixa de ~8 cores para manter consistência visual, não um color picker livre)
- [ ] Editar e excluir categoria a partir da sidebar
- [ ] Validar: criar categoria, ver refletida na sidebar, refresh mantém os dados

### 3. UI de prioridades
- [ ] Componente `PriorityBadge` (ícone/cor conforme DESIGN.md: verde/amarelo/laranja/vermelho)
- [ ] Adicionar seletor de prioridade no `TaskForm` (default: Média)
- [ ] Exibir `PriorityBadge` no `TaskCard`
- [ ] Validar: criar tarefa com cada uma das 4 prioridades, badge correto aparece

### 4. Associar categoria à tarefa
- [ ] Adicionar seletor de categoria no `TaskForm` (dropdown, opção "Sem categoria" incluída)
- [ ] Exibir `CategoryBadge` no `TaskCard`
- [ ] Validar: criar/editar tarefa mudando a categoria, refletido corretamente no card

### 5. Filtros e ordenação
- [ ] Clicar numa categoria na sidebar filtra a lista de tarefas por aquela categoria (clicar de novo remove o filtro)
- [ ] Filtro por prioridade no `Header` (pode ser um dropdown simples ou badges clicáveis)
- [ ] Os dois filtros devem combinar (categoria + prioridade ao mesmo tempo)
- [ ] Adicionar ordenação: por prioridade (urgente primeiro), por data de criação, alfabética — um seletor simples no Header
- [ ] Validar: combinar filtro de categoria + prioridade + ordenação simultaneamente sem bugs

### 6. Finalização
- [ ] Revisar responsividade dos novos elementos (badges e dropdowns em mobile)
- [ ] Revisar dark mode nos novos componentes
- [ ] Rodar `npm run build` e confirmar sem erros
- [ ] Atualizar `ROADMAP.md` (Fase 2 e o item "dark mode toggle" que já foi feito na Fase 3)
- [ ] Commit final: `feat: categorias e prioridades (Fase 2)`

## ✅ Definição de pronto
- Dá para criar categorias com cor própria e atribuí-las a tarefas.
- Dá para definir prioridade de cada tarefa, com indicador visual claro.
- Filtro por categoria e por prioridade funcionam, inclusive combinados.
- Ordenação funciona nos 3 critérios (prioridade, data, alfabética).
- Nada quebrou do que já existia no MVP.

## 🚫 Não fazer nesta etapa
- Tags livres (Fase 4)
- Subtarefas/checklists (Fase 4)
- Drag and drop / Kanban (Fase 4)
- Qualquer integração com backend/GitHub (Fase 5+)