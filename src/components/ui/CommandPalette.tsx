import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface Command {
  id: string
  title: string
  icon: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Palette */}
      <div 
        className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-text-secondary mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="O que você precisa fazer?"
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/50 focus:outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-text-secondary/60 bg-border/30 px-1.5 py-0.5 rounded font-mono ml-3">
            ESC
          </kbd>
        </div>

        <div 
          ref={listRef}
          className="max-h-[300px] overflow-y-auto py-2 px-2"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-secondary">
              Nenhum comando encontrado.
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action()
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-primary hover:bg-border/20'
                }`}
              >
                <span className={`mr-3 ${index === selectedIndex ? 'text-accent' : 'text-text-secondary'}`}>
                  {cmd.icon}
                </span>
                {cmd.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
