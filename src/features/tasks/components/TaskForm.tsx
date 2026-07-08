import React, { useState } from 'react'
import { Button } from '../../../components/ui/Button'

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void
  initialTitle?: string
  initialDescription?: string
  onCancel: () => void
  submitLabel?: string
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  onCancel,
  submitLabel = 'Salvar',
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }
    onSubmit(title.trim(), description.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ex: Instalar PostgreSQL e configurar Prisma..."
          rows={4}
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none font-sans"
        />
      </div>

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
