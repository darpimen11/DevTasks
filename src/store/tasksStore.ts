import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Priority } from '../features/tasks/types'

interface TasksState {
  tasks: Task[]
  addTask: (title: string, description: string, priority: Priority, categoryId?: string) => void
  toggleTask: (id: string) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  /** Called when a category is deleted — clears categoryId from all affected tasks */
  clearCategory: (categoryId: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description, priority, categoryId) =>
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
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        })),
      editTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task,
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
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
