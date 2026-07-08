import React from 'react'
import { Plus, Menu, Search, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { PRIORITY_CONFIG } from '../../features/tasks/components/PriorityBadge'
import type { Priority } from '../../features/tasks/types'

type SortOrder = 'createdAt' | 'priority' | 'alphabetical' | 'manual'

interface HeaderProps {
  onMenuClick: () => void
  onNewTaskClick: () => void
  priorityFilter: Priority[]
  onPriorityFilterChange: (p: Priority[]) => void
  sortOrder: SortOrder
  onSortOrderChange: (s: SortOrder) => void
  searchQuery: string
  onSearchQueryChange: (q: string) => void
}

const ALL_PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low']

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNewTaskClick,
  priorityFilter,
  onPriorityFilterChange,
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchQueryChange,
}) => {
  const togglePriority = (p: Priority) => {
    if (priorityFilter.includes(p)) {
      onPriorityFilterChange(priorityFilter.filter((x) => x !== p))
    } else {
      onPriorityFilterChange([...priorityFilter, p])
    }
  }

  return (
    <header className="border-b border-border bg-surface shrink-0 transition-colors duration-300">
      {/* Top row */}
      <div className="h-14 flex items-center justify-between px-5 gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile burger */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/20 transition-colors shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="relative max-w-md w-full hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
              <Search className="h-4 w-4" />
            </span>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border border-border bg-background/50 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="absolute inset-y-0 right-2 flex items-center text-text-secondary hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {!searchQuery && (
              <kbd className="absolute inset-y-0 right-3 flex items-center text-[10px] text-text-secondary/40 font-mono pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Sort selector */}
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            className="text-xs rounded-lg border border-border bg-surface text-text-secondary px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
          >
            <option value="createdAt">Mais recente</option>
            <option value="priority">Prioridade</option>
            <option value="alphabetical">Alfabética</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <Button onClick={onNewTaskClick} className="flex items-center gap-1.5 shadow-sm shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Priority filter row */}
      <div className="px-5 pb-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mr-1">
          Prioridade:
        </span>
        {ALL_PRIORITIES.map((p) => {
          const { label, color, bg } = PRIORITY_CONFIG[p]
          const isActive = priorityFilter.includes(p)
          return (
            <button
              key={p}
              onClick={() => togglePriority(p)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                isActive
                  ? 'border-transparent ring-1'
                  : 'border-border bg-surface text-text-secondary hover:border-border/60'
              }`}
              style={isActive ? { color, backgroundColor: bg } : undefined}
            >
              {label}
            </button>
          )
        })}
        {priorityFilter.length > 0 && (
          <button
            onClick={() => onPriorityFilterChange([])}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-text-secondary hover:text-text-primary border border-border/50 hover:bg-border/20 transition-colors ml-1"
          >
            Limpar
          </button>
        )}
      </div>
    </header>
  )
}
