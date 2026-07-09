# DevTasks-11

Task manager built with the programmer's workflow in mind. Beyond the basics (create, organize, prioritize), it has some features that a generic to-do list doesn't: Markdown descriptions, code snippets with highlighting, task templates, and importing issues directly from GitHub.

**Demo:** [devtasks-11.vercel.app](https://devtasks-11.vercel.app/)

## Features

- Create, edit, complete, and delete tasks, with subtasks/checklists
- Categories and priorities, with combined filters and text search
- Free tags for additional organization
- List or Kanban view (To Do / Doing / Done) with drag-and-drop — Kanban available on desktop screens
- Dark mode with automatic detection of system preference
- Markdown descriptions, including code blocks with syntax highlighting
- Templates to create tasks faster (bug report, feature request, etc.)
- Import issues from public GitHub repositories as tasks
- Command Palette (`Cmd/Ctrl + K`) to navigate and perform actions without taking your hands off the keyboard
- Keyboard shortcuts (`N` new task, `/` search, `Esc` closes modals)

## Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand (with persistence in localStorage)
- **Animations:** Framer Motion
- **Drag and drop:** dnd-kit
- **Markdown:** react-markdown + remark-gfm + react-syntax-highlighter
- **Deployment:** Vercel

There is no backend behind it — the data is saved in the browser (localStorage). This is intentional at this stage of the project; a dedicated backend with cross-device synchronization is on the roadmap.

## Running locally

```bash
git clone https://github.com/darpimen11/DevTasks.git
cd DevTasks
npm install
npm run dev
```

Requires Node.js 18+. To generate the production build: `npm run build`.

## Project Structure

```
src/
├── components/ # Generic UI components (Button, Modal, Checkbox...)
├── features/ # Domain logic (tasks, categories)
├── store/ # Global state (Zustand)
├── styles/ # Color tokens and global configuration
└── utils/

```

## Roadmap

The project progress (what has already been done and what comes next) is documented in [ROADMAP.md](./ROADMAP.md).

## Contributing

Pull requests are welcome. For larger changes, please open an issue first to discuss your ideas.

1. Fork the project
2. Create a branch (`git checkout -b feature/feature-name`)
3. Commit your changes
4. Open a PR

## License

MIT.