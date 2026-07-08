import { useState, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { useTheme } from './hooks/useTheme'
import { PageWrapper } from './components/layout/PageWrapper'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { TaskList } from './features/tasks/components/TaskList'
import { Modal } from './components/ui/Modal'
import { TaskForm } from './features/tasks/components/TaskForm'
import { useTasksStore } from './store/tasksStore'
import type { Priority, Subtask } from './features/tasks/types'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanBoard } from './features/tasks/components/KanbanBoard'

type SortOrder = 'createdAt' | 'priority' | 'alphabetical' | 'manual'

const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export const App: React.FC = () => {
  const { theme } = useTheme()
  const { tasks, addTask, reorderTasks } = useTasksStore()

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsNewTaskModalOpen(true)
      } else if (e.key === '/') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter & sort state (ephemeral — not persisted)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>('createdAt')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Category filter
    if (activeCategoryId) {
      result = result.filter((t) => t.categoryId === activeCategoryId)
    }

    // Priority filter (multi-select OR logic)
    if (priorityFilter.length > 0) {
      result = result.filter((t) => priorityFilter.includes(t.priority))
    }

    // Tag filter
    if (activeTag) {
      result = result.filter((t) =>
        (t.tags ?? []).some((tag) => tag.toLowerCase() === activeTag.toLowerCase()),
      )
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'manual') return (b.order ?? 0) - (a.order ?? 0)
      if (sortOrder === 'createdAt') return b.createdAt - a.createdAt
      if (sortOrder === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sortOrder === 'alphabetical') return a.title.localeCompare(b.title, 'pt-BR')
      return 0
    })

    return result
  }, [tasks, activeCategoryId, priorityFilter, activeTag, sortOrder, searchQuery])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string)
      setSortOrder('manual')
    }
  }

  const hasActiveFilters =
    !!activeCategoryId || priorityFilter.length > 0 || !!searchQuery.trim() || !!activeTag

  const handleTagFilter = (tag: string) => {
    setActiveTag((currentTag) =>
      currentTag?.toLowerCase() === tag.toLowerCase() ? null : tag,
    )
  }

  const handleCreateTask = (
    title: string,
    description: string,
    priority: Priority,
    categoryId?: string,
    tags?: string[],
    subtasks?: Omit<Subtask, 'id'>[],
  ) => {
    addTask(title, description, priority, categoryId, tags, subtasks)
    setIsNewTaskModalOpen(false)
    toast.success('Tarefa criada com sucesso')
  }

  return (
    <>
      <Toaster theme={theme} richColors position="bottom-right" />
      <PageWrapper
        sidebar={
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            activeCategoryId={activeCategoryId}
            onCategorySelect={setActiveCategoryId}
          />
        }
        header={
          <Header
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onNewTaskClick={() => setIsNewTaskModalOpen(true)}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary transition-colors duration-300">
                {activeCategoryId ? 'Categoria' : 'Minhas Tarefas'}
              </h1>
              <p className="text-sm text-text-secondary transition-colors duration-300">
                {!hasActiveFilters
                  ? `${tasks.filter((t) => !t.completed).length} tarefa${tasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} em andamento`
                  : `${filteredAndSortedTasks.filter((t) => !t.completed).length} tarefa${filteredAndSortedTasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} encontrada${filteredAndSortedTasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} com os filtros ativos`}
              </p>
              {activeTag && (
                <div className="mt-2 flex">
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/15 transition-colors"
                    title="Remover filtro de tag"
                  >
                    <span className="truncate">{activeTag}</span>
                    <X className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </div>
              )}
            </div>

            {viewMode === 'list' ? (
              <TaskList
                tasks={filteredAndSortedTasks}
                onNewTaskClick={() => setIsNewTaskModalOpen(true)}
                activeTag={activeTag}
                onTagClick={handleTagFilter}
                isLoading={isLoading}
              />
            ) : (
              <KanbanBoard
                tasks={filteredAndSortedTasks}
                activeTag={activeTag}
                onTagClick={handleTagFilter}
              />
            )}
          </div>
        </DndContext>
      </PageWrapper>

      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Criar Nova Tarefa"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsNewTaskModalOpen(false)}
          submitLabel="Criar"
        />
      </Modal>
    </>
  )
}

export default App
