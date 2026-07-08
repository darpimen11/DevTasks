import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../features/tasks/types'

interface TasksState {
  tasks: Task[]
  addTask: (title: string, description: string) => void
  toggleTask: (id: string) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              description,
              completed: false,
              createdAt: Date.now(),
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      editTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'devtasks-storage',
    }
  )
)
