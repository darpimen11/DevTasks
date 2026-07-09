import React, { useState } from 'react'
import { Button } from '../../../components/ui/Button'

const PALETTE = [
  '#6366F1', // indigo (matches accent)
  '#22C55E', // green
  '#EAB308', // yellow
  '#F97316', // orange
  '#EF4444', // red
  '#06B6D4', // cyan
  '#A855F7', // purple
  '#EC4899', // pink
]

interface CategoryFormProps {
  onSubmit: (name: string, color: string) => void
  initialName?: string
  initialColor?: string
  onCancel: () => void
  submitLabel?: string
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialName = '',
  initialColor = PALETTE[0],
  onCancel,
  submitLabel = 'Save',
}) => {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    onSubmit(name.trim(), color)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          placeholder="e.g. Frontend, Bug, Infra..."
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent ${
            error ? 'border-priority-urgent' : 'border-border'
          }`}
          autoFocus
        />
        {error && <p className="mt-1 text-xs text-priority-urgent">{error}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none ${
                color === c ? 'ring-2 ring-offset-2 ring-offset-surface scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
