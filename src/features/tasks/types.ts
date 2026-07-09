export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: number
  priority: Priority
  categoryId?: string
  tags: string[]
  subtasks?: Subtask[]
  order: number
  status?: 'todo' | 'doing' | 'done'
  githubUrl?: string
  dueDate?: number
}
