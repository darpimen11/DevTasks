# 📋 DevTasks

> A professional-level To-do App, made **by devs, for devs**.

DevTasks isn't just another task manager — it's designed for the workflow of programmers: project categories, real priorities, true dark mode (not just inverting colors), and features like GitHub integration and Markdown support for descriptions.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![license](https://img.shields.io/badge/license-MIT-blue)

---

## Features

### Core
- ✅ Create, edit, complete, and delete tasks
- Custom categories/projects (with their own color)
- Priorities (Low, Medium, High, Urgent) with visual indicator
- Dark mode (with automatic system detection)
- Combined search and filters (category + priority + status)
- 📅 Due dates and reminders

### "Dev" Differentiators
- Import GitHub issues as tasks
- Markdown descriptions (with preview)
- Code snippets in the task description
- Command Palette (`Cmd/Ctrl + K`) Linear/VS Code style
- Nested Subtasks/Checklists

### Productivity
- 📊 Dashboard with statistics (tasks completed per day, streak, etc.)
- Recurring tasks
- Drag and drop to reorder and change status (Kanban-like)
- 📤 Export/Import data (JSON)

See the complete and prioritized list in [ROADMAP.md](./ROADMAP.md).

---

## Tech Stack

| Layer | Technology |

|---|---|

| Frontend | React + TypeScript + Vite |

| Style | Tailwind CSS |

| State | Zustand |

| Animations | Framer Motion |

| Persistence (MVP) | localStorage / IndexedDB |

| Backend (phase 2) | Node.js + Express + Prisma |

| Database (phase 2) | PostgreSQL (or SQLite in dev mode) |

| Authentication (phase 2) | Clerk or Auth.js |

| Deployment | Vercel (front-end) + Railway/Render (back-end) |

Architecture details, folder structure, color palette, and animations are in [DESIGN.md](./DESIGN.md).

---

## How to run locally

```bash
# Clone the repository
git clone https://github.com/darpimen11/devtasks.git
cd devtasks

# Install dependencies
npm install

# Run in dev mode
npm run dev

# Production build
npm run build
```

Requirements: Node.js 18+.

---

## 📁 Project Structure

```
devtasks/
├── src/
│ ├── components/
│ ├── features/
│ ├── hooks/
│ ├── store/
│ ├── styles/
│ └── utils/
├── public/
├── README.md
├── ROADMAP.md
└── DESIGN.md
```
(Complete and commented structure in [DESIGN.md](./DESIGN.md))

---

## 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'feat: adds X'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

Suggestion: follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`...) — keeps the history clean and makes it easier to generate an automatic changelog.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.
