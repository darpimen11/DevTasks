import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Task } from '../types'
import { TaskCard } from './TaskCard'
import { EmptyState } from '../../../components/ui/EmptyState'

import { TaskCardSkeleton } from './TaskCardSkeleton'

interface TaskListProps {
  tasks: Task[]
  onNewTaskClick: () => void
  isLoading?: boolean
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onNewTaskClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    )
  }

  if (tasks.length === 0) {
    return <EmptyState onActionClick={onNewTaskClick} />
  }

  const activeTasks = tasks.filter((t) => !t.completed).sort((a, b) => b.createdAt - a.createdAt)
  const completedTasks = tasks.filter((t) => t.completed).sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary px-1">
            Em andamento ({activeTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {activeTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary px-1">
            Concluídas ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
