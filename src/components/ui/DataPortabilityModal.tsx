import React, { useRef, useState } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useTasksStore } from '../../store/tasksStore'
import type { Category } from '../../features/categories/types'
import type { Task } from '../../features/tasks/types'
import { Button } from './Button'
import { Modal } from './Modal'

interface DataPortabilityModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DevTasksExport {
  app: 'devtasks-11'
  version: 1
  exportedAt: string
  tasks: Task[]
  categories: Category[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isTask = (value: unknown): value is Task => {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'number' &&
    typeof value.priority === 'string' &&
    Array.isArray(value.tags) &&
    typeof value.order === 'number'
  )
}

const isCategory = (value: unknown): value is Category => {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.color === 'string'
  )
}

const parseExport = (value: unknown): DevTasksExport | null => {
  if (!isRecord(value)) return null
  if (value.app !== 'devtasks-11' || value.version !== 1) return null
  if (!Array.isArray(value.tasks) || !Array.isArray(value.categories)) return null
  if (!value.tasks.every(isTask) || !value.categories.every(isCategory)) return null

  return {
    app: 'devtasks-11',
    version: 1,
    exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : new Date().toISOString(),
    tasks: value.tasks,
    categories: value.categories,
  }
}

export const DataPortabilityModal: React.FC<DataPortabilityModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { tasks, replaceTasks } = useTasksStore()
  const { categories, replaceCategories } = useCategoriesStore()

  const handleExport = () => {
    const payload: DevTasksExport = {
      app: 'devtasks-11',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `devtasks-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exportado')
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsImporting(true)
    try {
      const parsed = parseExport(JSON.parse(await file.text()))
      if (!parsed) {
        toast.error('Arquivo de backup inválido')
        return
      }

      const confirmed = window.confirm(
        `Importar ${parsed.tasks.length} tarefa(s) e ${parsed.categories.length} categoria(s)? Seus dados locais atuais serão substituídos.`,
      )
      if (!confirmed) return

      replaceTasks(parsed.tasks)
      replaceCategories(parsed.categories)
      toast.success('Backup importado')
      onClose()
    } catch {
      toast.error('Não foi possível ler o arquivo')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dados">
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-priority-medium" />
            <p>
              A importação substitui as tarefas e categorias salvas neste navegador. Exporte um
              backup antes se quiser preservar o estado atual.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar JSON
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar JSON
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>
    </Modal>
  )
}
