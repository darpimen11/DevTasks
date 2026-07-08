import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { PRIORITY_CONFIG } from './PriorityBadge'
import { useCategoriesStore } from '../../../store/categoriesStore'
import type { Priority } from '../types'

interface TaskFormProps {
  onSubmit: (
    title: string,
    description: string,
    priority: Priority,
    categoryId?: string,
    tags?: string[],
  ) => void
  initialTitle?: string
  initialDescription?: string
  initialPriority?: Priority
  initialCategoryId?: string
  initialTags?: string[]
  onCancel: () => void
  submitLabel?: string
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  initialCategoryId = '',
  initialTags = [],
  onCancel,
  submitLabel = 'Salvar',
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [priority, setPriority] = useState<Priority>(initialPriority)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')

  const { categories } = useCategoriesStore()

  const normalizeTag = (value: string) => value.trim().replace(/\s+/g, ' ')

  const hasTag = (value: string, currentTags = tags) =>
    currentTags.some((tag) => tag.toLowerCase() === value.toLowerCase())

  const handleAddTag = () => {
    const nextTag = normalizeTag(tagInput)
    if (!nextTag || hasTag(nextTag)) {
      setTagInput('')
      return
    }

    setTags((currentTags) => [...currentTags, nextTag])
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }

    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((currentTags) => currentTags.slice(0, -1))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    const pendingTag = normalizeTag(tagInput)
    const submitTags =
      pendingTag && !hasTag(pendingTag) ? [...tags, pendingTag] : tags

    onSubmit(title.trim(), description.trim(), priority, categoryId || undefined, submitTags)
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

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="ex: frontend"
            className="min-w-0 flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-border/20 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            title="Adicionar tag"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-text-secondary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="-mr-0.5 rounded-full p-0.5 hover:bg-border/50 hover:text-text-primary transition-colors"
                  title={`Remover tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

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
