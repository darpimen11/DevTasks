import { useState, useMemo } from 'react'
import { PageWrapper } from './components/layout/PageWrapper'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { TaskList } from './features/tasks/components/TaskList'
import { Modal } from './components/ui/Modal'
import { TaskForm } from './features/tasks/components/TaskForm'
import { useTasksStore } from './store/tasksStore'
import type { Priority } from './features/tasks/types'

type SortOrder = 'createdAt' | 'priority' | 'alphabetical'

const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

function App() {
  const { tasks, addTask } = useTasksStore()

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Filter & sort state (ephemeral — not persisted)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>('createdAt')

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

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'createdAt') return b.createdAt - a.createdAt
      if (sortOrder === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sortOrder === 'alphabetical') return a.title.localeCompare(b.title, 'pt-BR')
      return 0
    })

    return result
  }, [tasks, activeCategoryId, priorityFilter, sortOrder])

  const handleCreateTask = (title: string, description: string, priority: Priority, categoryId?: string) => {
    addTask(title, description, priority, categoryId)
    setIsNewTaskModalOpen(false)
  }

  return (
    <>
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
          />
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {activeCategoryId ? 'Categoria' : 'Minhas Tarefas'}
            </h1>
            <p className="text-sm text-text-secondary">
              {filteredAndSortedTasks.length === tasks.length
                ? `${tasks.filter((t) => !t.completed).length} tarefa${tasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} em andamento`
                : `${filteredAndSortedTasks.filter((t) => !t.completed).length} tarefa${filteredAndSortedTasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} encontrada${filteredAndSortedTasks.filter((t) => !t.completed).length !== 1 ? 's' : ''} com os filtros ativos`}
            </p>
          </div>

          <TaskList
            tasks={filteredAndSortedTasks}
            onNewTaskClick={() => setIsNewTaskModalOpen(true)}
          />
        </div>
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
