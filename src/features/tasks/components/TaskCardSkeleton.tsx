import React from 'react'

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface shadow-sm flex items-start gap-4 animate-pulse">
      <div className="pt-0.5">
        <div className="h-5 w-5 rounded border border-border bg-border/20" />
      </div>

      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Title */}
        <div className="h-4 bg-border/30 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 bg-border/20 rounded w-full" />
          <div className="h-3 bg-border/20 rounded w-5/6" />
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="h-5 w-16 bg-border/20 rounded-full" />
          <div className="h-5 w-20 bg-border/20 rounded-full" />
          <div className="h-3 w-24 bg-border/20 rounded ml-auto" />
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div className="h-7 w-7 rounded-lg bg-border/20" />
        <div className="h-7 w-7 rounded-lg bg-border/20" />
      </div>
    </div>
  )
}
