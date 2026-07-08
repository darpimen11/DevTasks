import React from 'react'
import { Plus, Menu, Search } from 'lucide-react'
import { Button } from '../ui/Button'

interface HeaderProps {
  onMenuClick: () => void
  onNewTaskClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onNewTaskClick }) => {
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/20 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar Visual Placeholder */}
        <div className="relative max-w-md w-full hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar tarefas... (Fase 2)"
            disabled
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border bg-background/50 text-text-secondary placeholder:text-text-secondary/50 cursor-not-allowed"
          />
          <kbd className="absolute inset-y-0 right-3 flex items-center text-[10px] text-text-secondary/40 font-mono">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onNewTaskClick} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>
    </header>
  )
}
