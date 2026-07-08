export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: number
  priority: Priority
  categoryId?: string
  tags: string[]
}
