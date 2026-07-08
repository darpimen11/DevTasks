import React, { useState } from 'react'
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
  // Mobile: track active column tab (0=todo, 1=doing, 2=done)
  const [activeColIndex, setActiveColIndex] = useState(0)

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
      <div ref={setNodeRef} className="p-3 flex-1 min-h-[200px] flex flex-col gap-3">
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
      {/* Mobile: tab navigation */}
      <div className="md:hidden flex border-b border-border mb-4">
        {columnData.map((col, i) => (
          <button
            key={col.id}
            onClick={() => setActiveColIndex(i)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${
              activeColIndex === i
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {col.title}
            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
              activeColIndex === i ? 'bg-accent/20 text-accent' : 'bg-border/40 text-text-secondary'
            }`}>
              {col.tasks.length}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: single column view */}
      <div className="md:hidden">
        {(() => {
          const col = columnData[activeColIndex]
          return (
            <div className="flex flex-col bg-surface/50 border border-border rounded-xl overflow-hidden">
              <DroppableColumn colId={col.id}>
                <SortableContext items={col.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {col.tasks.map((task) => (
                    <SortableTaskItem key={task.id} task={task} activeTag={activeTag} onTagClick={onTagClick} />
                  ))}
                </SortableContext>
                {col.tasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg opacity-50 py-12">
                    <span className="text-xs text-text-secondary">Sem tarefas aqui</span>
                  </div>
                )}
              </DroppableColumn>
            </div>
          )
        })()}
      </div>

      {/* Desktop: 3-column grid — scroll is contained here, never the full page */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-4 min-w-0">
          {columnData.map((col) => (
            <div key={col.id} className="flex flex-col bg-surface/50 border border-border rounded-xl overflow-hidden min-w-0">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-text-primary">{col.title}</h3>
                <span className="text-xs font-medium bg-background border border-border text-text-secondary px-2 py-0.5 rounded-full">
                  {col.tasks.length}
                </span>
              </div>
              <DroppableColumn colId={col.id}>
                <SortableContext items={col.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {col.tasks.map((task) => (
                    <SortableTaskItem key={task.id} task={task} activeTag={activeTag} onTagClick={onTagClick} />
                  ))}
                </SortableContext>
                {col.tasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg opacity-50 min-h-[200px]">
                    <span className="text-xs text-text-secondary">Arraste tarefas para cá</span>
                  </div>
                )}
              </DroppableColumn>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  )
}
