'use client'

import { useOSStore } from '@/store/windowStore'

export function useFocus() {
  const windows = useOSStore((s) => s.windows)
  const zStack = useOSStore((s) => s.zStack)

  const focusedWindowId =
    zStack.length > 0 ? ([...zStack].reverse().find((id) => windows[id]?.isFocused) ?? null) : null

  const focusedAppId = focusedWindowId ? (windows[focusedWindowId]?.appId ?? null) : null

  return { focusedWindowId, focusedAppId }
}
