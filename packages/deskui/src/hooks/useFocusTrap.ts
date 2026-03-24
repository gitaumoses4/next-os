'use client'

import { useEffect } from 'react'
import { useOSStore } from '@/store/windowStore'

/**
 * Traps keyboard focus within the currently focused window.
 * Tab cycles through focusable elements inside the window's container.
 * Escape blurs the window (configurable).
 */
export function useFocusTrap(escapeBlurs = true) {
  const windows = useOSStore((s) => s.windows)
  const blurAll = useOSStore((s) => s.blurAll)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const focused = Object.values(windows).find((w) => w.isFocused)
      if (!focused) return

      // Escape: blur all windows
      if (e.key === 'Escape' && escapeBlurs) {
        // Don't interfere with context menus or command palette
        const target = e.target as HTMLElement
        if (target.closest('[role="dialog"]') === null) return
        blurAll()
        return
      }

      // Tab: trap focus within the window
      if (e.key === 'Tab') {
        const windowEl = document.querySelector(`[data-window-id="${focused.id}"]`)
        if (!windowEl) return

        const focusables = windowEl.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first || !windowEl.contains(document.activeElement)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last || !windowEl.contains(document.activeElement)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [windows, blurAll, escapeBlurs])
}
