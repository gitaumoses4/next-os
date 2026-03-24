'use client'

import { useEffect, useCallback } from 'react'

export interface DeskuiMessage {
  type: 'setTitle' | 'close' | 'minimize' | 'maximize' | 'setBadge' | 'focus'
  title?: string
  count?: number
}

/**
 * Hook for use inside iframe content to communicate with the parent deskui shell.
 * Only works when the page is rendered inside a deskui window iframe.
 */
export function useDeskuiBridge() {
  const send = useCallback((message: DeskuiMessage) => {
    if (typeof window === 'undefined') return
    if (window.self === window.top) return
    window.parent.postMessage({ __deskui: true, ...message }, '*')
  }, [])

  return {
    setTitle: (title: string) => send({ type: 'setTitle', title }),
    close: () => send({ type: 'close' }),
    minimize: () => send({ type: 'minimize' }),
    maximize: () => send({ type: 'maximize' }),
    setBadge: (count: number) => send({ type: 'setBadge', count }),
    focus: () => send({ type: 'focus' }),
  }
}
