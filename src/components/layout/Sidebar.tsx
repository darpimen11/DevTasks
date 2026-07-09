import React, { useState, useEffect } from 'react'
import { Moon, Sun, CheckSquare, X, Plus, Edit2, Trash2, FolderOpen, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useTasksStore } from '../../store/tasksStore'
import { Modal } from '../ui/Modal'
import { CategoryForm } from '../../features/categories/components/CategoryForm'
import { useTheme } from '../../hooks/useTheme'
import logo2 from '../../assets/logo-2.png'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeCategoryId: string | null
  onCategorySelect: (id: string | null) => void
  onDataClick: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  activeCategoryId,
  onCategorySelect,
  onDataClick,
}) => {
  const { theme, toggleTheme } = useTheme()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null)

  const { categories, addCategory, editCategory, deleteCategory } = useCategoriesStore()
  const { tasks, clearCategory } = useTasksStore()

  useEffect(() => {
    const handleOpenNewCategory = () => {
      setIsCategoryModalOpen(true)
      if (onClose) onClose() // close sidebar if open on mobile
    }
    window.addEventListener('open-new-category', handleOpenNewCategory)
    return () => window.removeEventListener('open-new-category', handleOpenNewCategory)
  }, [onClose])

  const handleAddCategory = (name: string, color: string) => {
    addCategory(name, color)
    setIsCategoryModalOpen(false)
    toast.success('Category created')
  }

  const handleEditCategory = (name: string, color: string) => {
    if (editingCategory) {
      editCategory(editingCategory.id, { name, color })
      setEditingCategory(null)
      toast.success('Category updated')
    }
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id)
    clearCategory(id)
    if (activeCategoryId === id) onCategorySelect(null)
    setCategoryToDelete(null)
    toast.info('Category deleted')
  }

  const taskCountForCategory = (categoryId: string) =>
    tasks.filter((t) => t.categoryId === categoryId).length

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-surface transition-colors duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 overflow-hidden rounded-lg shrink-0 bg-background/60 border border-border/60">
            <img src={logo2} alt="DevTasks-11" className="h-full w-full object-contain p-1" />
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight transition-colors duration-300">DevTasks-11</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/20"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Navigation */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider transition-colors duration-300">
            Menu
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onCategorySelect(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeCategoryId === null
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border/20'
              }`}
            >
              <CheckSquare className="h-4 w-4 shrink-0" />
              All tasks
              <span className="ml-auto text-xs font-semibold bg-border/40 px-1.5 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Categories */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between transition-colors duration-300">
            <span>Categories</span>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="p-0.5 rounded text-text-secondary hover:text-accent transition-colors"
              title="New category"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {categories.length === 0 ? (
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full text-left text-sm text-text-secondary px-3 py-2 rounded-lg hover:bg-border/20 transition-colors flex items-center gap-2 italic"
            >
              <FolderOpen className="h-4 w-4 shrink-0" />
              Create your first category
            </button>
          ) : (
            <nav className="space-y-0.5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeCategoryId === cat.id
                      ? 'bg-accent/10'
                      : 'hover:bg-border/20'
                  }`}
                  onClick={() => onCategorySelect(activeCategoryId === cat.id ? null : cat.id)}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      activeCategoryId === cat.id ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-semibold text-text-secondary bg-border/40 px-1.5 py-0.5 rounded-full shrink-0 transition-colors duration-300">
                    {taskCountForCategory(cat.id)}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCategory(cat)
                      }}
                      className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-border/30"
                      title="Edit"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCategoryToDelete({ id: cat.id, name: cat.name })
                      }}
                      className="p-1 rounded text-text-secondary hover:text-priority-urgent hover:bg-priority-urgent/10"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>

      <Modal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        title="Delete category"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {categoryToDelete
              ? `Delete category "${categoryToDelete.name}"? Associated tasks will remain, but without a category.`
              : 'Delete this category? Associated tasks will remain, but without a category.'}
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCategoryToDelete(null)}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete.id)}
              className="inline-flex items-center justify-center rounded-lg bg-priority-urgent px-4 py-2 text-sm font-medium text-white hover:bg-priority-urgent/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer / Dark Mode Toggle / Shortcuts */}
      <div className="mt-auto shrink-0">
        <div className="px-4 py-3 border-t border-border transition-colors duration-300">
          <button
            onClick={onDataClick}
            className="mb-2 w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-colors border border-border bg-background/30"
          >
            <Database className="h-4 w-4" />
            Data
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-colors border border-border bg-background/30"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="dark"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <Sun className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="light"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <Moon className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
        </div>
        
        {/* Shortcuts hint */}
        <div className="px-4 pb-4 pt-1 flex justify-center text-[10px] text-text-secondary/60 gap-3 font-mono">
          <span>[N] New task</span>
          <span>[/] Search</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-surface flex-col h-full shrink-0 transition-colors duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-surface shadow-2xl z-10 border-r border-border transition-colors duration-300">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* New Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="New Category"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsCategoryModalOpen(false)}
          submitLabel="Create"
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            onSubmit={handleEditCategory}
            initialName={editingCategory.name}
            initialColor={editingCategory.color}
            onCancel={() => setEditingCategory(null)}
            submitLabel="Save"
          />
        )}
      </Modal>
    </>
  )
}
