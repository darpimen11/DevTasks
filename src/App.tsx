import { useState } from 'react'
import { PageWrapper } from './components/layout/PageWrapper'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { TaskList } from './features/tasks/components/TaskList'
import { Modal } from './components/ui/Modal'
import { TaskForm } from './features/tasks/components/TaskForm'
import { useTasksStore } from './store/tasksStore'

function App() {
  const { tasks, addTask } = useTasksStore()
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleCreateTask = (title: string, description: string) => {
    addTask(title, description)
    setIsNewTaskModalOpen(false)
  }

  return (
    <>
      <PageWrapper
        sidebar={
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        }
        header={
          <Header
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onNewTaskClick={() => setIsNewTaskModalOpen(true)}
          />
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Minhas Tarefas
            </h1>
            <p className="text-sm text-text-secondary">
              Gerencie suas tarefas de desenvolvimento locais.
            </p>
          </div>

          <TaskList
            tasks={tasks}
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
