import React, { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { PRIORITY_CONFIG } from './PriorityBadge'
import { useCategoriesStore } from '../../../store/categoriesStore'
import type { Priority } from '../types'

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Priority, categoryId?: string) => void
  initialTitle?: string
  initialDescription?: string
  initialPriority?: Priority
  initialCategoryId?: string
  onCancel: () => void
  submitLabel?: string
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  initialCategoryId = '',
  onCancel,
  submitLabel = 'Salvar',
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [priority, setPriority] = useState<Priority>(initialPriority)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [error, setError] = useState('')

  const { categories } = useCategoriesStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }
    onSubmit(title.trim(), description.trim(), priority, categoryId || undefined)
  }

  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          placeholder="ex: Configurar base de dados"
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent ${
            error ? 'border-priority-urgent' : 'border-border'
          }`}
          autoFocus
        />
        {error && <p className="mt-1 text-xs text-priority-urgent">{error}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ex: Instalar PostgreSQL e configurar Prisma..."
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none font-sans"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Prioridade
        </label>
        <div className="flex flex-wrap gap-2">
          {priorities.map((p) => {
            const { label, color, bg } = PRIORITY_CONFIG[p]
            const isSelected = priority === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-offset-surface scale-105 border-transparent'
                    : 'border-border bg-surface text-text-secondary hover:border-border/80'
                }`}
                style={isSelected ? { color, backgroundColor: bg } : undefined}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
