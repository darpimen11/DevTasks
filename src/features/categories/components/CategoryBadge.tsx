import React from 'react'
import type { Category } from '../types'

interface CategoryBadgeProps {
  category: Category
  size?: 'sm' | 'xs'
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const dotSize = size === 'xs' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/50 bg-surface/80 font-medium ${textSize} text-text-secondary`}
    >
      <span
        className={`${dotSize} rounded-full shrink-0`}
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  )
}
