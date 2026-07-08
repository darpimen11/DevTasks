import React, { useState } from 'react'
import { Terminal, Moon, Sun, CheckSquare, X, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useTasksStore } from '../../store/tasksStore'
import { Modal } from '../ui/Modal'
import { CategoryForm } from '../../features/categories/components/CategoryForm'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeCategoryId: string | null
  onCategorySelect: (id: string | null) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  activeCategoryId,
  onCategorySelect,
}) => {
  const [isDark, setIsDark] = React.useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null)

  const { categories, addCategory, editCategory, deleteCategory } = useCategoriesStore()
  const { tasks, clearCategory } = useTasksStore()

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
  }

  const handleAddCategory = (name: string, color: string) => {
    addCategory(name, color)
    setIsCategoryModalOpen(false)
  }

  const handleEditCategory = (name: string, color: string) => {
    if (editingCategory) {
      editCategory(editingCategory.id, { name, color })
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Excluir esta categoria? As tarefas associadas continuarão existindo, mas sem categoria.')) {
      deleteCategory(id)
      clearCategory(id)
      if (activeCategoryId === id) onCategorySelect(null)
    }
  }

  const taskCountForCategory = (categoryId: string) =>
    tasks.filter((t) => t.categoryId === categoryId && !t.completed).length

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-surface">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent text-white p-1.5 rounded-lg shadow-sm">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">DevTasks</span>
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
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
              Todas as tarefas
              <span className="ml-auto text-xs font-semibold bg-border/40 px-1.5 py-0.5 rounded-full">
                {tasks.filter((t) => !t.completed).length}
              </span>
            </button>
          </nav>
        </div>

        {/* Categories */}
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-between">
            <span>Categorias</span>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="p-0.5 rounded text-text-secondary hover:text-accent transition-colors"
              title="Nova categoria"
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
              Criar primeira categoria
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
                  <span className="text-[10px] font-semibold text-text-secondary bg-border/40 px-1.5 py-0.5 rounded-full shrink-0">
                    {taskCountForCategory(cat.id)}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCategory(cat)
                      }}
                      className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-border/30"
                      title="Editar"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCategory(cat.id)
                      }}
                      className="p-1 rounded text-text-secondary hover:text-priority-urgent hover:bg-priority-urgent/10"
                      title="Excluir"
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

      {/* Footer / Dark Mode Toggle */}
      <div className="p-4 border-t border-border shrink-0">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-colors border border-border bg-background/30"
        >
          <span className="flex items-center gap-2">
            {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-surface flex-col h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-surface shadow-2xl z-10 border-r border-border">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* New Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Nova Categoria"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsCategoryModalOpen(false)}
          submitLabel="Criar"
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Editar Categoria"
      >
        {editingCategory && (
          <CategoryForm
            onSubmit={handleEditCategory}
            initialName={editingCategory.name}
            initialColor={editingCategory.color}
            onCancel={() => setEditingCategory(null)}
            submitLabel="Salvar"
          />
        )}
      </Modal>
    </>
  )
}
