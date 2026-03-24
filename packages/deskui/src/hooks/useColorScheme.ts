'use client'

import { useState, useCallback, useEffect } from 'react'
import { defaultTheme } from '@/themes/default'
import { defaultDarkTheme } from '@/themes/default-dark'
import type { OSTheme } from '@/themes/types'

const STORAGE_KEY = 'deskui-color-scheme'

interface UseColorSchemeOptions {
  defaultScheme?: 'light' | 'dark' | 'system'
  lightTheme?: OSTheme
  darkTheme?: OSTheme
}

/**
 * Manages color scheme state with persistence and system preference detection.
 * Returns the resolved theme and a toggle function.
 *
 * @example
 * const { theme, colorScheme, setColorScheme, toggle } = useColorScheme()
 * <OSShell theme={theme}>...</OSShell>
 */
export function useColorScheme(options: UseColorSchemeOptions = {}) {
  const {
    defaultScheme = 'system',
    lightTheme = defaultTheme,
    darkTheme = defaultDarkTheme,
  } = options

  const [scheme, setSchemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'

    // Check localStorage first
    const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    if (saved) return saved

    // Fall back to default or system preference
    if (defaultScheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return defaultScheme
  })

  // Listen for system preference changes when using 'system'
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return // User has explicitly chosen, don't override

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setSchemeState(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setColorScheme = useCallback((newScheme: 'light' | 'dark') => {
    setSchemeState(newScheme)
    localStorage.setItem(STORAGE_KEY, newScheme)
  }, [])

  const toggle = useCallback(() => {
    setColorScheme(scheme === 'dark' ? 'light' : 'dark')
  }, [scheme, setColorScheme])

  const theme = scheme === 'dark' ? darkTheme : lightTheme

  return {
    theme,
    colorScheme: scheme,
    setColorScheme,
    toggle,
  }
}
