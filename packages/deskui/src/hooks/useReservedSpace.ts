'use client'

import { useOSContext } from '@/context/OSContext'

/**
 * Returns the reserved space for the current bar variant.
 * Dock mode: reserves menu bar height at the top.
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

  // Dock mode: menu bar at top
  return {
    height: theme.menuBar.height,
    position: 'top' as const,
  }
}
