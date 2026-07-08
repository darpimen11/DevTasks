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
  ) => void
  toggleTask: (id: string) => void
  editTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (activeId: string, overId: string) => void
  /** Called when a category is deleted — clears categoryId from all affected tasks */
  clearCategory: (categoryId: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description, priority, categoryId, tags = [], subtasks = []) =>
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
