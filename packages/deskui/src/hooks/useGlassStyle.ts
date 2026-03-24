'use client'

import { useMemo } from 'react'
import { supportsBackdropFilter } from '@/utils/supportsBackdropFilter'

/**
 * Returns glass-effect styles with a solid fallback
 * for browsers that don't support backdrop-filter.
 */
export function useGlassStyle(bg: string, blur: string, fallbackBg?: string) {
  return useMemo(() => {
    if (supportsBackdropFilter()) {
      return {
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
      } as React.CSSProperties
    }

    // Fallback: use a more opaque solid background
    return {
      background: fallbackBg ?? bg.replace(/[\d.]+\)$/, '0.95)'),
    } as React.CSSProperties
  }, [bg, blur, fallbackBg])
}
