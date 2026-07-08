import React from 'react'
import type { Priority } from '../types'

interface PriorityBadgeProps {
  priority: Priority
  size?: 'sm' | 'xs'
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Baixa', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  medium: { label: 'Média', color: '#EAB308', bg: 'rgba(234,179,8,0.12)' },
  high: { label: 'Alta', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  urgent: { label: 'Urgente', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const { label, color, bg } = PRIORITY_CONFIG[priority]
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const dotSize = size === 'xs' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${textSize}`}
      style={{ color, backgroundColor: bg }}
    >
      <span className={`${dotSize} rounded-full shrink-0`} style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

export { PRIORITY_CONFIG }
