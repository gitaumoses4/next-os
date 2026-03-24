'use client'

import { useState, useEffect } from 'react'

/**
 * Detects the prefers-contrast media query.
 * Returns true when the user has requested high contrast mode.
 */
export function useHighContrast(): boolean {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-contrast: more)')
    setHighContrast(mq.matches)

    const handler = (e: MediaQueryListEvent) => setHighContrast(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return highContrast
}
