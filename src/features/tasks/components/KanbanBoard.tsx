import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Task } from '../types'
import { SortableTaskItem } from './SortableTaskItem'
import { useTasksStore } from '../../../store/tasksStore'

interface KanbanBoardProps {
  tasks: Task[]
  activeTag?: string | null
  onTagClick?: (tag: string) => void
}

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' }
] as const

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, activeTag, onTagClick }) => {
  const { editTask, reorderTasks } = useTasksStore()
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const activeTask = tasks.find(t => t.id === active.id)
      const overTask = tasks.find(t => t.id === over.id)

      if (activeTask && overTask && activeTask.status === overTask.status) {
        reorderTasks(active.id as string, over.id as string)
      } else if (activeTask) {
        const newStatus = overTask ? overTask.status : over.id as 'todo' | 'doing' | 'done'
        if (activeTask.status !== newStatus) {
          editTask(active.id as string, { status: newStatus })
        }
      }
    }
  }

  const DroppableColumn = ({ colId, children }: { colId: string, children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id: colId })
    return (
      <div ref={setNodeRef} className="p-3 flex-1 min-h-[300px] flex flex-col gap-3">
        {children}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          // As tarefas que não têm status (legado) vão para 'todo'
          const columnTasks = tasks.filter(t => (t.status || 'todo') === col.id)
          
          return (
            <div key={col.id} className="flex flex-col bg-surface/50 border border-border rounded-xl overflow-hidden min-w-[280px]">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">{col.title}</h3>
                <span className="text-xs font-medium bg-background border border-border text-text-secondary px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              
              <DroppableColumn colId={col.id}>
                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {columnTasks.map((task) => (
                    <SortableTaskItem key={task.id} task={task} activeTag={activeTag} onTagClick={onTagClick} />
                  ))}
                </SortableContext>
                
                {/* Drop target para coluna vazia */}
                {columnTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg opacity-50">
                    <span className="text-xs text-text-secondary">Arraste tarefas para cá</span>
                  </div>
                )}
              </DroppableColumn>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}
