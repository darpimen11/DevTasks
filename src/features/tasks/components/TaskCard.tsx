import React, { useState } from 'react'
import { Edit2, Trash2, Calendar, ChevronDown, ChevronUp, CheckSquare } from 'lucide-react'
import type { Task, Subtask } from '../types'
import { Checkbox } from '../../../components/ui/Checkbox'
import { useTasksStore } from '../../../store/tasksStore'
import { useCategoriesStore } from '../../../store/categoriesStore'
import { toast } from 'sonner'
import { Modal } from '../../../components/ui/Modal'
import { TaskForm } from './TaskForm'
import { PriorityBadge } from './PriorityBadge'
import { CategoryBadge } from '../../categories/components/CategoryBadge'
import { MarkdownRenderer } from '../../../components/ui/MarkdownRenderer'

interface TaskCardProps {
  task: Task
  activeTag?: string | null
  onTagClick?: (tag: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, activeTag, onTagClick }) => {
  const { toggleTask, deleteTask, editTask } = useTasksStore()
  const { categories } = useCategoriesStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false)

  const category = task.categoryId ? categories.find((c) => c.id === task.categoryId) : undefined
  const tags = task.tags ?? []
  const subtasks = task.subtasks ?? []
  const completedSubtasksCount = subtasks.filter(st => st.completed).length

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(task.id)
      toast.info('Tarefa excluída')
    }
  }

  const handleEditSubmit = (
    title: string,
    description: string,
    priority: Task['priority'],
    categoryId?: string,
    tags?: string[],
    subtasks?: Omit<Subtask, 'id'>[],
  ) => {
    editTask(task.id, { title, description, priority, categoryId, tags: tags ?? [], subtasks: subtasks as Subtask[] })
    setIsEditing(false)
    toast.success('Tarefa atualizada')
  }

  const handleToggleSubtask = (subtaskId: string) => {
    if (!task.subtasks) return
    const newSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    editTask(task.id, { subtasks: newSubtasks })
    // Regra de negócio explícita: Concluir todas as subtarefas NÃO deve marcar a tarefa pai como concluída automaticamente.
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
            <div className={`mt-2 ${task.completed ? 'opacity-70 line-through' : ''}`}>
              <MarkdownRenderer content={task.description} />
            </div>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <PriorityBadge priority={task.priority} size="xs" />
            {category && <CategoryBadge category={category} size="xs" />}
            {task.githubUrl && (
              <a 
                href={task.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 bg-surface text-[10px] border border-border px-1.5 py-0.5 rounded text-accent hover:bg-accent/10 transition-colors"
                title="Ver issue no GitHub"
              >
                GitHub
              </a>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary ml-auto">
              <Calendar className="h-3 w-3" />
              {formatDate(task.createdAt)}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => {
                const isActive = activeTag?.toLowerCase() === tag.toLowerCase()
                const tagClassName = `inline-flex max-w-full items-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-border bg-background/60 text-text-secondary hover:border-border/80 hover:text-text-primary'
                }`

                return onTagClick ? (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick(tag)}
                    className={tagClassName}
                    aria-pressed={isActive}
                    title={`Filtrar por ${tag}`}
                  >
                    <span className="truncate">{tag}</span>
                  </button>
                ) : (
                  <span key={tag} className={tagClassName}>
                    <span className="truncate">{tag}</span>
                  </span>
                )
              })}
            </div>
          )}

          {subtasks.length > 0 && (
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => setIsSubtasksExpanded(!isSubtasksExpanded)}
                className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span>
                  {completedSubtasksCount}/{subtasks.length} subtarefas
                </span>
                {isSubtasksExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                )}
              </button>

              {isSubtasksExpanded && (
                <div className="mt-2 space-y-1.5 pl-1">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-start gap-2 group">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleToggleSubtask(st.id)}
                          className="w-3.5 h-3.5 rounded-sm border-border text-accent focus:ring-accent cursor-pointer transition-colors"
                        />
                      </div>
                      <span className={`text-xs flex-1 break-words leading-tight ${st.completed ? 'line-through text-text-secondary opacity-70' : 'text-text-primary'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
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
          initialTags={tags}
          initialSubtasks={subtasks}
          onCancel={() => setIsEditing(false)}
          submitLabel="Salvar"
        />
      </Modal>
    </>
  )
}
