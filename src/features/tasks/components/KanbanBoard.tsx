import React from 'react'
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

// This component is only rendered on lg+ screens (controlled by App.tsx + effectiveViewMode).
// No mobile layout is needed here — App.tsx forces 'list' view below 1024px.
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
      <div ref={setNodeRef} className="p-3 flex-1 min-h-[200px] min-w-0 flex flex-col gap-3">
        {children}
      </div>
    )
  }

  const columnData = COLUMNS.map(col => ({
    ...col,
    tasks: tasks.filter(t => (t.status || 'todo') === col.id)
  }))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid min-w-0 grid-cols-3 gap-4">
        {columnData.map((col) => (
          <div key={col.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface/50">
            <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between shrink-0">
              <h3 className="text-sm font-semibold text-text-primary">{col.title}</h3>
              <span className="text-xs font-medium bg-background border border-border text-text-secondary px-2 py-0.5 rounded-full">
                {col.tasks.length}
              </span>
            </div>
            <DroppableColumn colId={col.id}>
              <SortableContext items={col.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {col.tasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    activeTag={activeTag}
                    onTagClick={onTagClick}
                    variant="compact"
                  />
                ))}
              </SortableContext>
              {col.tasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg opacity-50 min-h-[200px]">
                  <span className="text-xs text-text-secondary">Drag tasks here</span>
                </div>
              )}
            </DroppableColumn>
          </div>
        ))}
      </div>
    </DndContext>
  )
}
