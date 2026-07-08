import React from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  onActionClick: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6 animate-pulse">
        <ClipboardList className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Nenhuma tarefa por aqui
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        Crie sua primeira tarefa para começar a organizar seu fluxo de desenvolvimento e acompanhar seu progresso.
      </p>
      <Button onClick={onActionClick} className="flex items-center gap-2 shadow-sm">
        <Plus className="h-4 w-4" />
        Criar primeira tarefa
      </Button>
    </div>
  )
}
