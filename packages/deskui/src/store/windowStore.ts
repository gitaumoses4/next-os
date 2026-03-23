import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { AppDefinition } from '@/types'

export interface WindowState {
  id: string
  appId: string
  title: string
  position: { x: number; y: number }
  size: { w: number; h: number }
  preMaximizePosition: { x: number; y: number } | null
  preMaximizeSize: { w: number; h: number } | null
  status: 'open' | 'minimized' | 'maximized'
  zIndex: number
  isFocused: boolean
  isAnimating: boolean
}

const BASE_Z = 100

export interface OSStore {
  windows: Record<string, WindowState>
  zStack: string[]
  showDesktopSnapshot: string[] | null
  draggingWindowId: string | null
  setDragging: (windowId: string | null) => void

  openWindow: (appId: string, apps: AppDefinition[]) => string | null
  closeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, size: { w: number; h: number }) => void
  blurAll: () => void
  showDesktop: () => void
}

function deriveZIndexes(
  windows: Record<string, WindowState>,
  zStack: string[],
): Record<string, WindowState> {
  const updated = { ...windows }
  for (const [i, wid] of zStack.entries()) {
    if (updated[wid]) {
      updated[wid] = { ...updated[wid], zIndex: BASE_Z + i }
    }
  }
  return updated
}

function setFocused(
  windows: Record<string, WindowState>,
  focusedId: string | null,
): Record<string, WindowState> {
  const updated: Record<string, WindowState> = {}
  for (const [id, win] of Object.entries(windows)) {
    updated[id] = { ...win, isFocused: id === focusedId }
  }
  return updated
}

const CASCADE_OFFSET = 30

export const useOSStore = create<OSStore>((set, get) => ({
  windows: {},
  zStack: [],
  showDesktopSnapshot: null,
  draggingWindowId: null,
  setDragging: (windowId) => set({ draggingWindowId: windowId }),

  openWindow: (appId, apps) => {
    const app = apps.find((a) => a.id === appId)
    if (!app) return null

    const state = get()

    // If not instanceable, focus existing window instead
    if (!app.instanceable) {
      const existing = Object.values(state.windows).find((w) => w.appId === appId)
      if (existing) {
        get().focusWindow(existing.id)
        return existing.id
      }
    }

    const windowId = uuid()

    // Cascade offset for instanceable apps
    const sameAppCount = Object.values(state.windows).filter((w) => w.appId === appId).length
    const basePosition = app.defaultPosition ?? {
      x: Math.round((window.innerWidth - app.defaultSize.w) / 2),
      y: Math.round((window.innerHeight - app.defaultSize.h) / 2),
    }
    const position = {
      x: basePosition.x + sameAppCount * CASCADE_OFFSET,
      y: basePosition.y + sameAppCount * CASCADE_OFFSET,
    }

    const newWindow: WindowState = {
      id: windowId,
      appId,
      title: app.titlebarTitle ?? app.label,
      position,
      size: { ...app.defaultSize },
      preMaximizePosition: null,
      preMaximizeSize: null,
      status: 'open',
      zIndex: 0,
      isFocused: false,
      isAnimating: false,
    }

    const newZStack = [...state.zStack, windowId]
    let newWindows = { ...state.windows, [windowId]: newWindow }
    newWindows = deriveZIndexes(newWindows, newZStack)
    newWindows = setFocused(newWindows, windowId)

    set({ windows: newWindows, zStack: newZStack })
    return windowId
  },

  closeWindow: (windowId) => {
    const state = get()
    if (!state.windows[windowId]) return

    const { [windowId]: _, ...remainingWindows } = state.windows
    const newZStack = state.zStack.filter((id) => id !== windowId)

    // Focus the top window in the stack after closing
    const topWindowId = newZStack.length > 0 ? newZStack[newZStack.length - 1] : null
    let newWindows = deriveZIndexes(remainingWindows, newZStack)
    newWindows = setFocused(newWindows, topWindowId)

    set({ windows: newWindows, zStack: newZStack })
  },

  focusWindow: (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    // If minimized, restore it first
    let windows = state.windows
    if (win.status === 'minimized') {
      windows = { ...windows, [windowId]: { ...win, status: 'open' } }
    }

    const newZStack = [...state.zStack.filter((id) => id !== windowId), windowId]
    let newWindows = deriveZIndexes(windows, newZStack)
    newWindows = setFocused(newWindows, windowId)

    set({ windows: newWindows, zStack: newZStack })
  },

  minimizeWindow: (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win || win.status === 'minimized') return

    const newWindows = {
      ...state.windows,
      [windowId]: { ...win, status: 'minimized' as const, isFocused: false },
    }

    // Focus the next top visible window
    const visibleStack = state.zStack.filter(
      (id) => id !== windowId && newWindows[id]?.status !== 'minimized',
    )
    const topWindowId = visibleStack.length > 0 ? visibleStack[visibleStack.length - 1] : null

    set({ windows: setFocused(newWindows, topWindowId) })
  },

  maximizeWindow: (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win || win.status === 'maximized') return

    const newWindows = {
      ...state.windows,
      [windowId]: {
        ...win,
        preMaximizePosition: { ...win.position },
        preMaximizeSize: { ...win.size },
        status: 'maximized' as const,
        position: { x: 0, y: 0 },
        size: { w: window.innerWidth, h: window.innerHeight },
      },
    }

    set({ windows: newWindows })
  },

  restoreWindow: (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    if (win.status === 'maximized' && win.preMaximizePosition && win.preMaximizeSize) {
      set({
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            status: 'open',
            position: { ...win.preMaximizePosition },
            size: { ...win.preMaximizeSize },
            preMaximizePosition: null,
            preMaximizeSize: null,
          },
        },
      })
    } else if (win.status === 'minimized') {
      get().focusWindow(windowId)
    }
  },

  moveWindow: (windowId, position) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win || win.status === 'maximized') return

    set({
      windows: {
        ...state.windows,
        [windowId]: { ...win, position },
      },
    })
  },

  resizeWindow: (windowId, size) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    set({
      windows: {
        ...state.windows,
        [windowId]: { ...win, size },
      },
    })
  },

  blurAll: () => {
    set({ windows: setFocused(get().windows, null) })
  },

  showDesktop: () => {
    const state = get()

    // If we have a snapshot, restore those windows
    if (state.showDesktopSnapshot) {
      const snapshot = state.showDesktopSnapshot
      let windows = { ...state.windows }
      for (const wid of snapshot) {
        if (windows[wid]) {
          windows[wid] = { ...windows[wid], status: 'open' as const }
        }
      }
      const topId = snapshot.length > 0 ? snapshot[snapshot.length - 1] : null
      windows = setFocused(windows, topId)
      set({ windows, showDesktopSnapshot: null })
      return
    }

    // Minimize all visible windows and save snapshot
    const visibleIds = Object.values(state.windows)
      .filter((w) => w.status !== 'minimized')
      .map((w) => w.id)

    if (visibleIds.length === 0) return

    const windows: Record<string, WindowState> = {}
    for (const [id, win] of Object.entries(state.windows)) {
      windows[id] =
        win.status !== 'minimized'
          ? { ...win, status: 'minimized' as const, isFocused: false }
          : win
    }
    set({ windows, showDesktopSnapshot: visibleIds })
  },
}))
