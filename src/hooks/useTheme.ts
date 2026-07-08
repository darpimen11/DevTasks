import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'devtasks-11-theme'
const THEME_KEY_LEGACY = 'devtasks-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Read new key first, then fall back to the old key (migration), then system preference
    const stored =
      (localStorage.getItem(THEME_KEY) as Theme | null) ||
      (localStorage.getItem(THEME_KEY_LEGACY) as Theme | null)

    const resolved: Theme = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

    setTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')

    // Migrate old key if present
    if (!localStorage.getItem(THEME_KEY) && localStorage.getItem(THEME_KEY_LEGACY)) {
      localStorage.setItem(THEME_KEY, resolved)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }

  return { theme, toggleTheme }
}
