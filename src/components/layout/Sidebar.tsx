import React from 'react'
import { Terminal, Moon, Sun, CheckSquare, X } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [isDark, setIsDark] = React.useState(false)

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-surface">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent text-white p-1.5 rounded-lg shadow-sm">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">
            DevTasks
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/20"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Navigation */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Menu
          </div>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-accent/10 text-accent transition-colors"
            >
              <CheckSquare className="h-4 w-4" />
              Tarefas
            </a>
          </nav>
        </div>

        {/* Projects Placeholder */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex justify-between items-center">
            <span>Projetos</span>
            <span className="text-[10px] bg-border/40 text-text-secondary px-1.5 py-0.5 rounded-full">
              Fase 2
            </span>
          </div>
          <div className="space-y-1 text-sm text-text-secondary px-3 py-1.5 italic bg-background/40 dark:bg-background/20 rounded-lg">
            Nenhum projeto ainda
          </div>
        </div>

        {/* Priorities Placeholder */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex justify-between items-center">
            <span>Prioridades</span>
            <span className="text-[10px] bg-border/40 text-text-secondary px-1.5 py-0.5 rounded-full">
              Fase 2
            </span>
          </div>
          <div className="space-y-1 text-sm text-text-secondary px-3 py-1.5 italic bg-background/40 dark:bg-background/20 rounded-lg">
            Filtros desabilitados
          </div>
        </div>
      </div>

      {/* Footer / Dark Mode Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-colors border border-border bg-background/30"
        >
          <span className="flex items-center gap-2">
            {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
          <span className="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase">
            Beta
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-surface flex-col h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-surface shadow-2xl z-10 border-r border-border">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
