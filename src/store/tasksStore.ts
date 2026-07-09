import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Priority, Subtask } from '../features/tasks/types'

interface TasksState {
  tasks: Task[]
  addTask: (
    title: string,
    description: string,
    priority: Priority,
    categoryId?: string,
    tags?: string[],
    subtasks?: Omit<Subtask, 'id'>[],
    githubUrl?: string,
    dueDate?: number,
  ) => void
  toggleTask: (id: string) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (activeId: string, overId: string) => void
  replaceTasks: (tasks: Task[]) => void
  /** Called when a category is deleted — clears categoryId from all affected tasks */
  clearCategory: (categoryId: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description, priority, categoryId, tags = [], subtasks = [], githubUrl, dueDate) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              description,
              completed: false,
              createdAt: Date.now(),
              priority,
              categoryId,
              tags,
              subtasks: subtasks.map(st => ({ ...st, id: crypto.randomUUID() })),
              order: Date.now(),
              status: 'todo',
              githubUrl,
              dueDate,
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task
            const newCompleted = !task.completed
            let newStatus = task.status
            if (newCompleted) newStatus = 'done'
            else if (task.status === 'done') newStatus = 'todo'
            return { ...task, completed: newCompleted, status: newStatus }
          }),
        })),
      editTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task

            const normalizedUpdates: Partial<Task> = updates.subtasks
              ? {
                  ...updates,
                  subtasks: updates.subtasks.map((subtask) => ({
                    ...subtask,
                    id: subtask.id ?? crypto.randomUUID(),
                  })),
                }
              : updates

            const updatedTask = { ...task, ...normalizedUpdates }
            
            // Regra: Mover para 'done' implica completed: true.
            // Mover para fora de 'done' implica completed: false.
            if (normalizedUpdates.status) {
              if (normalizedUpdates.status === 'done' && task.status !== 'done') {
                updatedTask.completed = true
              } else if (normalizedUpdates.status !== 'done' && task.status === 'done') {
                updatedTask.completed = false
              }
            }
            // Regra reversa: Marcar como completed manualmente (pela checkbox) muda status para 'done'
            // Desmarcar completed muda status para 'todo' se estava 'done'
            if (normalizedUpdates.completed !== undefined) {
              if (normalizedUpdates.completed) {
                updatedTask.status = 'done'
              } else if (task.status === 'done') {
                updatedTask.status = 'todo'
              }
            }
            
            return updatedTask
          }),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      reorderTasks: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId)
          const newIndex = state.tasks.findIndex((t) => t.id === overId)
          if (oldIndex === -1 || newIndex === -1) return state
          
          const newTasks = [...state.tasks]
          const [movedItem] = newTasks.splice(oldIndex, 1)
          newTasks.splice(newIndex, 0, movedItem)

          // Update the order property for all tasks to match their new array index
          const reorderedTasks = newTasks.map((t, index) => ({
            ...t,
            order: newTasks.length - index, // highest order at the top
          }))

          return { tasks: reorderedTasks }
        }),
      replaceTasks: (tasks) => set({ tasks }),
      clearCategory: (categoryId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.categoryId === categoryId ? { ...task, categoryId: undefined } : task,
          ),
        })),
    }),
    { name: 'devtasks-storage' },
  ),
)
