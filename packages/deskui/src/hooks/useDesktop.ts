'use client'

import { useCallback } from 'react'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'

export function useDesktop() {
  const store = useOSStore()
  const { apps } = useOSContext()

  const showDesktop = useCallback(() => store.showDesktop(), [store])
  const toggleMissionControl = useCallback(() => store.toggleMissionControl(), [store])

  const getOpenWindows = useCallback(
    () => Object.values(store.windows).filter((w) => w.status !== 'minimized'),
    [store.windows],
  )

  const getFocusedWindow = useCallback(
    () => Object.values(store.windows).find((w) => w.isFocused) ?? null,
    [store.windows],
  )

  const cascadeWindows = useCallback(() => {
    const visible = Object.values(store.windows).filter((w) => w.status !== 'minimized')
    visible.forEach((win, i) => {
      store.moveWindow(win.id, { x: 60 + i * 30, y: 60 + i * 30 })
    })
  }, [store])

  const tileWindows = useCallback(() => {
    const visible = Object.values(store.windows).filter((w) => w.status !== 'minimized')
    if (visible.length === 0) return

    const cols = Math.ceil(Math.sqrt(visible.length))
    const rows = Math.ceil(visible.length / cols)
    const cellW = Math.floor(window.innerWidth / cols)
    const cellH = Math.floor(window.innerHeight / rows)

    visible.forEach((win, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      store.moveWindow(win.id, { x: col * cellW, y: row * cellH })
      store.resizeWindow(win.id, { w: cellW, h: cellH })
    })
  }, [store])

  const closeAll = useCallback(() => {
    for (const id of Object.keys(store.windows)) {
      store.closeWindow(id)
    }
  }, [store])

  const openApp = useCallback((appId: string) => store.openWindow(appId, apps), [store, apps])

  return {
    showDesktop,
    toggleMissionControl,
    getOpenWindows,
    getFocusedWindow,
    cascadeWindows,
    tileWindows,
    closeAll,
    openApp,
  }
}
