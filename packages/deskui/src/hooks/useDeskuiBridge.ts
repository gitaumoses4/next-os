'use client'

import { useEffect, useCallback, useState } from 'react'

export interface DeskuiMessage {
  type: 'setTitle' | 'close' | 'minimize' | 'maximize' | 'setBadge' | 'focus'
  title?: string
  count?: number
}

/**
 * Returns the color scheme from the URL param set by the deskui shell.
 */
function getInitialColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const params = new URLSearchParams(window.location.search)
  return (params.get('_deskui_colorScheme') as 'light' | 'dark') ?? 'light'
}

/**
 * Hook for use inside iframe content to communicate with the parent deskui shell.
 * Only works when the page is rendered inside a deskui window iframe.
 */
export function useDeskuiBridge() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(getInitialColorScheme)

  // Listen for color scheme changes from the parent shell
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.__deskui && e.data.type === 'colorScheme') {
        setColorScheme(e.data.colorScheme)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const send = useCallback((message: DeskuiMessage) => {
    if (typeof window === 'undefined') return
    if (window.self === window.top) return
    window.parent.postMessage({ __deskui: true, ...message }, '*')
  }, [])

  return {
    colorScheme,
    setTitle: (title: string) => send({ type: 'setTitle', title }),
    close: () => send({ type: 'close' }),
    minimize: () => send({ type: 'minimize' }),
    maximize: () => send({ type: 'maximize' }),
    setBadge: (count: number) => send({ type: 'setBadge', count }),
    focus: () => send({ type: 'focus' }),
  }
}
