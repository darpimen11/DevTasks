import React from 'react'
import { motion } from 'framer-motion'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
        checked
          ? 'bg-accent border-accent text-white'
          : 'border-border bg-surface hover:border-text-secondary'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {checked && (
        <motion.svg
          className="h-3 w-3 stroke-current"
          viewBox="0 0 12 12"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <motion.path
            d="M2.5 6L5 8.5L9.5 3.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      )}
    </button>
  )
}
