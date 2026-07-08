import React, { useState } from 'react'
import { Edit2, Trash2, Calendar } from 'lucide-react'
import type { Task } from '../types'
import { Checkbox } from '../../../components/ui/Checkbox'
import { useTasksStore } from '../../../store/tasksStore'
import { useCategoriesStore } from '../../../store/categoriesStore'
import { Modal } from '../../../components/ui/Modal'
import { TaskForm } from './TaskForm'
import { PriorityBadge } from './PriorityBadge'
import { CategoryBadge } from '../../categories/components/CategoryBadge'

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTask, deleteTask, editTask } = useTasksStore()
  const { categories } = useCategoriesStore()
  const [isEditing, setIsEditing] = useState(false)

  const category = task.categoryId ? categories.find((c) => c.id === task.categoryId) : undefined

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(task.id)
    }
  }

  const handleEditSubmit = (
    title: string,
    description: string,
    priority: Task['priority'],
    categoryId?: string,
  ) => {
    editTask(task.id, { title, description, priority, categoryId })
    setIsEditing(false)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <>
      <div
        className={`p-4 rounded-xl border border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4 ${
          task.completed ? 'opacity-60' : ''
        }`}
      >
        <div className="pt-0.5">
          <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <h4
            className={`text-sm font-semibold text-text-primary break-words leading-tight ${
              task.completed ? 'line-through text-text-secondary' : ''
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-xs text-text-secondary whitespace-pre-wrap break-words leading-normal ${
                task.completed ? 'line-through opacity-70' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <PriorityBadge priority={task.priority} size="xs" />
            {category && <CategoryBadge category={category} size="xs" />}
            <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary ml-auto">
              <Calendar className="h-3 w-3" />
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/20 transition-colors focus:outline-none"
            title="Editar tarefa"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-text-secondary hover:text-priority-urgent hover:bg-priority-urgent/10 transition-colors focus:outline-none"
            title="Excluir tarefa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Tarefa">
        <TaskForm
          onSubmit={handleEditSubmit}
          initialTitle={task.title}
          initialDescription={task.description}
          initialPriority={task.priority}
          initialCategoryId={task.categoryId}
          onCancel={() => setIsEditing(false)}
          submitLabel="Salvar"
        />
      </Modal>
    </>
  )
}
