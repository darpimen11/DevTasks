import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'devtasks-11-theme'
const THEME_KEY_LEGACY = 'devtasks-theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'

  return (
    (localStorage.getItem(THEME_KEY) as Theme | null) ||
    (localStorage.getItem(THEME_KEY_LEGACY) as Theme | null) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')

    // Migrate old key if present
    if (!localStorage.getItem(THEME_KEY) && localStorage.getItem(THEME_KEY_LEGACY)) {
      localStorage.setItem(THEME_KEY, theme)
    }
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  return { theme, toggleTheme }
}
