'use client'

import { useOSContext } from '@/context/OSContext'

/**
 * Returns the reserved space for the current bar variant.
 * Dock mode: no reserved space (dock auto-hides behind maximized windows).
 * Taskbar mode: reserves taskbar height (taskbar is always visible).
 */
export function useReservedSpace() {
  const { theme, taskbarVariant } = useOSContext()

  if (taskbarVariant === 'taskbar') {
    return {
      height: theme.taskbar.height,
      position: theme.taskbar.position,
    } as const
  }

  // Dock auto-hides — no reserved space
  return undefined
}
