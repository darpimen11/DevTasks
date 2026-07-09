# 📋 DevTasks-11

> Um To-do App de nível profissional, feito **por dev, para devs**.

DevTasks-11 não é só mais um gerenciador de tarefas — é pensado para o fluxo de trabalho de quem programa: categorias por projeto, prioridades reais, dark mode de verdade (não só invertendo cor), e diferenciais como integração com GitHub e suporte a Markdown nas descrições.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![license](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Funcionalidades

### Core
- Criar, editar, concluir e excluir tarefas
- Categorias/Projetos personalizados (com cor própria)
- Prioridades (Baixa, Média, Alta, Urgente) com indicador visual
- Dark mode (com detecção automática do sistema)
- Busca e filtros combinados (categoria + prioridade + status)
- Datas de vencimento e lembretes

### Diferenciais "Dev"
- Importar issues do GitHub como tarefas
- Descrições em Markdown (com preview)
- Snippets de código na descrição da tarefa
- Command Palette (`Cmd/Ctrl + K`) estilo Linear/VS Code
- Subtarefas/checklists aninhadas

### Produtividade
- Dashboard com estatísticas (tarefas concluídas por dia, streak, etc.)
- Tarefas recorrentes
- Drag and drop para reordenar e mudar status (Kanban-like)
- Exportar/Importar dados (JSON)

Veja a lista completa e priorizada em [ROADMAP.md](./ROADMAP.md).

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite |
| Estilo | Tailwind CSS |
| Estado | Zustand |
| Animações | Framer Motion |
| Persistência (MVP) | localStorage / IndexedDB |
| Backend (fase 2) | Node.js + Express + Prisma |
| Banco (fase 2) | PostgreSQL (ou SQLite em dev) |
| Autenticação (fase 2) | Clerk ou Auth.js |
| Deploy | Vercel (front) + Railway/Render (back) |

Detalhes de arquitetura, estrutura de pastas, paleta de cores e animações estão em [DESIGN.md](./DESIGN.md).

---

## Como rodar localmente

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/devtasks-11.git
cd devtasks-11

# Instalar dependências
npm install

# Rodar em modo dev
npm run dev

# Build de produção
npm run build
```

Requisitos: Node.js 18+.

---

## Estrutura do projeto

```
devtasks-11/
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── store/
│   ├── styles/
│   └── utils/
├── public/
├── README.md
├── ROADMAP.md
└── DESIGN.md
```
(Estrutura completa e comentada em [DESIGN.md](./DESIGN.md))

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona X'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

Sugestão: siga [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`...) — deixa o histórico limpo e facilita gerar changelog automático.