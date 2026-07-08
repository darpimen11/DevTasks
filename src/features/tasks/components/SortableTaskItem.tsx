import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Task } from '../types'
import { TaskCard } from './TaskCard'

interface SortableTaskItemProps {
  task: Task
  activeTag?: string | null
  onTagClick?: (tag: string) => void
}

export const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ task, activeTag, onTagClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 p-1 text-text-secondary opacity-0 group-hover/sortable:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:text-text-primary hidden sm:block z-10 bg-background rounded shadow-sm border border-border"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="sm:ml-4">
        <TaskCard task={task} activeTag={activeTag} onTagClick={onTagClick} />
      </div>
    </div>
  )
}
