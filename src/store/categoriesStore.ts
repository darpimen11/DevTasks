import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '../features/categories/types'

interface CategoriesState {
  categories: Category[]
  addCategory: (name: string, color: string) => void
  editCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void
  deleteCategory: (id: string) => void
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: [],
      addCategory: (name, color) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: crypto.randomUUID(), name, color },
          ],
        })),
      editCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat,
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        })),
    }),
    { name: 'devtasks-categories' },
  ),
)
