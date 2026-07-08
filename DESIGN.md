# 🎨 DESIGN.md — Arquitetura, Layout e Design System

## 1. Estrutura de pastas completa

```
devtasks/
├── public/
│   └── icons/
├── src/
│   ├── assets/
│   ├── components/           # componentes de UI reutilizáveis e "burros"
│   │   ├── ui/                # Button, Input, Badge, Modal, Checkbox...
│   │   └── layout/             # Sidebar, Header, PageWrapper
│   ├── features/               # organizado por domínio, não por tipo de arquivo
│   │   ├── tasks/
│   │   │   ├── components/    # TaskCard, TaskForm, TaskList
│   │   │   ├── hooks/         # useTasks, useTaskFilters
│   │   │   └── types.ts
│   │   ├── categories/
│   │   ├── priorities/
│   │   └── dashboard/
│   ├── store/                  # Zustand stores (tasksStore, uiStore, themeStore)
│   ├── hooks/                   # hooks genéricos (useLocalStorage, useDebounce)
│   ├── lib/                     # integrações externas (github.ts, markdown.ts)
│   ├── styles/
│   │   └── globals.css
│   ├── utils/                    # funções puras (formatDate, sortTasks)
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── ROADMAP.md
└── DESIGN.md
```

**Por que por "feature" e não por "tipo"?** Fica muito mais fácil crescer o projeto sem virar bagunça — tudo que é sobre tarefas mora dentro de `features/tasks`, ao invés de espalhado entre pastas gerais de `components`, `hooks`, etc.

---

## 2. Paleta de cores

Base neutra + uma cor de destaque (accent) + cores semânticas para prioridade.

### Light mode
| Token | Hex | Uso |
|---|---|---|
| `background` | `#F8FAFC` | fundo geral |
| `surface` | `#FFFFFF` | cards, modais |
| `border` | `#E2E8F0` | divisórias |
| `text-primary` | `#0F172A` | texto principal |
| `text-secondary` | `#64748B` | texto secundário |
| `accent` | `#6366F1` (indigo) | botões, links, foco |
| `accent-hover` | `#4F46E5` | hover do accent |

### Dark mode
| Token | Hex | Uso |
|---|---|---|
| `background` | `#0F172A` | fundo geral |
| `surface` | `#1E293B` | cards, modais |
| `border` | `#334155` | divisórias |
| `text-primary` | `#F1F5F9` | texto principal |
| `text-secondary` | `#94A3B8` | texto secundário |
| `accent` | `#818CF8` | botões, links, foco (mais claro que no light) |
| `accent-hover` | `#6366F1` | hover do accent |

### Cores semânticas de prioridade (iguais nos dois modos, ajustando saturação)
| Prioridade | Hex | 
|---|---|
| Baixa | `#22C55E` (verde) |
| Média | `#EAB308` (amarelo) |
| Alta | `#F97316` (laranja) |
| Urgente | `#EF4444` (vermelho) |

> Dica: implemente as cores como CSS variables (`--color-background`, etc.) e só troque os valores via classe `.dark` no `<html>`. O Tailwind lida bem com isso via `darkMode: 'class'` no config.

---

## 3. Tipografia

- **Fonte:** `Inter` (interface) — grátis, ótima legibilidade, tem "cara de produto SaaS".
- **Fonte mono:** `JetBrains Mono` ou `Fira Code` — para snippets de código nas tarefas.
- Escala: `12px` (caption) / `14px` (body pequeno) / `16px` (body) / `20px` (h3) / `24px` (h2) / `32px` (h1).
- Peso: `400` texto normal, `500` para labels/botões, `600–700` para títulos.

---

## 4. Layout geral

Estrutura de 3 áreas, estilo Linear/Notion:

```
┌───────────┬─────────────────────────────────────┐
│           │  Header (busca, filtros, + Nova)      │
│ Sidebar   ├─────────────────────────────────────┤
│ (categorias,  │                                   │
│  filtros,     │   Lista de tarefas / Kanban       │
│  dark mode)   │                                   │
│           │                                        │
└───────────┴─────────────────────────────────────┘
```

- **Sidebar:** logo, lista de categorias (com bolinha de cor + contador), filtros de prioridade, toggle de dark mode fixo no rodapé.
- **Header:** busca com atalho `/`, botão "+ Nova Tarefa", avatar/menu do usuário (fase de backend).
- **Área central:** lista de tarefas agrupadas por status ou visão Kanban (toggle entre os dois).
- **Card de tarefa:** checkbox → título → badges de categoria/prioridade → data de vencimento → menu de ações (⋮).

Em mobile: sidebar vira um drawer (menu lateral que desliza), header colapsa a busca num ícone.

---

## 5. Animações (Framer Motion)

| Interação | Animação sugerida |
|---|---|
| Criar tarefa | Card entra com `fade + slight slide-up` (200ms, ease-out) |
| Concluir tarefa | Checkbox com "pop" (scale 1 → 1.2 → 1) + strikethrough animado no texto + card esmaece e sobe para o topo da seção "concluídas" |
| Excluir tarefa | Fade-out + collapse de altura (evita "pulo" no layout) |
| Toggle dark mode | Transição de cores via `transition: background-color 300ms, color 300ms` no CSS (não precisa de Framer aqui) + ícone sol/lua com rotação cruzada |
| Abrir modal/drawer | Overlay fade-in + painel slide-in (from bottom no mobile, from right no desktop) |
| Drag and drop | `layout` prop do Framer Motion nas listas — reordenação suave automática |
| Filtros | `AnimatePresence` para itens que entram/saem da lista filtrada |
| Command Palette | Fade + scale-in rápido (150ms), como Spotlight do Mac |

Regra geral: **durações curtas (150–300ms)**, easing `ease-out` para entradas e `ease-in` para saídas. Nada deve durar mais que ~350ms — o objetivo é dar "vida", não deixar o app lento.

---

## 6. Componentes de UI essenciais a construir

- `Button` (variants: primary, secondary, ghost, danger)
- `Badge` (para categoria e prioridade)
- `Checkbox` (animado)
- `Modal` / `Drawer`
- `Input` / `Textarea` (com suporte a Markdown no textarea de descrição)
- `Select` / `Dropdown`
- `Toast`
- `EmptyState`
- `Skeleton`

Se quiser algo pronto como base, **shadcn/ui** encaixa muito bem nessa stack (Tailwind + Radix) e já vem com boa parte disso.
