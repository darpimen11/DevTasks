import React from 'react'
import { Plus, Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { PRIORITY_CONFIG } from '../../features/tasks/components/PriorityBadge'
import type { Priority } from '../../features/tasks/types'

type SortOrder = 'createdAt' | 'priority' | 'alphabetical'

interface HeaderProps {
  onMenuClick: () => void
  onNewTaskClick: () => void
  priorityFilter: Priority[]
  onPriorityFilterChange: (p: Priority[]) => void
  sortOrder: SortOrder
  onSortOrderChange: (s: SortOrder) => void
}

const ALL_PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low']

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNewTaskClick,
  priorityFilter,
  onPriorityFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const togglePriority = (p: Priority) => {
    if (priorityFilter.includes(p)) {
      onPriorityFilterChange(priorityFilter.filter((x) => x !== p))
    } else {
      onPriorityFilterChange([...priorityFilter, p])
    }
  }

  return (
    <header className="border-b border-border bg-surface shrink-0">
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

          {/* Sort selector */}
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            className="text-xs rounded-lg border border-border bg-surface text-text-secondary px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="createdAt">Mais recente</option>
            <option value="priority">Prioridade</option>
            <option value="alphabetical">Alfabética</option>
          </select>
        </div>

        <Button onClick={onNewTaskClick} className="flex items-center gap-1.5 shadow-sm shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova tarefa</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Filter row */}
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
              style={
                isActive
                  ? { color, backgroundColor: bg }
                  : undefined
              }
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
