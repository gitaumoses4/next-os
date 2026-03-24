import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { AppDefinition } from '@/types'
import { deskuiMiddleware } from '@/utils/middleware'

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
  isPip: boolean
  prePipPosition: { x: number; y: number } | null
  prePipSize: { w: number; h: number } | null
}

const BASE_Z = 100
const PIP_Z = 9000
const PIP_SIZE = { w: 320, h: 200 }

export type SnapZone =
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | null

export interface OSStore {
  windows: Record<string, WindowState>
  zStack: string[]
  badges: Record<string, number>
  showDesktopSnapshot: string[] | null
  draggingWindowId: string | null
  snapPreview: SnapZone
  missionControlActive: boolean
  shakeWindowId: string | null
  toggleMissionControl: () => void
  shakeWindow: (windowId: string) => void
  setDragging: (windowId: string | null) => void
  setSnapPreview: (zone: SnapZone) => void
  setBadge: (appId: string, count: number) => void
  setWindowTitle: (windowId: string, title: string) => void
  beforeCloseHandlers: Record<string, () => boolean | Promise<boolean>>
  registerBeforeClose: (appId: string, handler: () => boolean | Promise<boolean>) => void
  unregisterBeforeClose: (appId: string) => void
  requestClose: (windowId: string) => Promise<void>
  snapWindow: (
    windowId: string,
    zone: Exclude<SnapZone, null>,
    barHeight: number,
    barPosition?: 'top' | 'bottom',
  ) => void

  openWindow: (appId: string, apps: AppDefinition[]) => string | null
  closeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (
    windowId: string,
    reservedSpace?: { height: number; position: 'top' | 'bottom' },
  ) => void
  restoreWindow: (windowId: string) => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, size: { w: number; h: number }) => void
  blurAll: () => void
  showDesktop: () => void
  togglePip: (windowId: string, topOffset?: number) => void
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
  badges: {},
  showDesktopSnapshot: null,
  draggingWindowId: null,
  snapPreview: null,
  missionControlActive: false,
  shakeWindowId: null,
  toggleMissionControl: () =>
    set((state) => ({ missionControlActive: !state.missionControlActive })),
  shakeWindow: (windowId) => {
    set({ shakeWindowId: windowId })
    setTimeout(() => set({ shakeWindowId: null }), 500)
  },
  beforeCloseHandlers: {},
  registerBeforeClose: (appId, handler) =>
    set((state) => ({
      beforeCloseHandlers: { ...state.beforeCloseHandlers, [appId]: handler },
    })),
  unregisterBeforeClose: (appId) =>
    set((state) => {
      const { [appId]: _, ...rest } = state.beforeCloseHandlers
      return { beforeCloseHandlers: rest }
    }),
  requestClose: async (windowId) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    const handler = state.beforeCloseHandlers[win.appId]
    if (handler) {
      const canClose = await handler()
      if (!canClose) return
    }
    get().closeWindow(windowId)
  },
  setDragging: (windowId) => set({ draggingWindowId: windowId }),
  setSnapPreview: (zone) => set({ snapPreview: zone }),
  setBadge: (appId, count) => set((state) => ({ badges: { ...state.badges, [appId]: count } })),
  setWindowTitle: (windowId, title) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return
    set({ windows: { ...state.windows, [windowId]: { ...win, title } } })
  },
  snapWindow: (windowId, zone, barHeight, barPosition = 'bottom') => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    const vw = window.innerWidth
    const vh = window.innerHeight - barHeight
    const topOffset = barPosition === 'top' ? barHeight : 0
    const halfW = Math.round(vw / 2)
    const halfH = Math.round(vh / 2)

    const zoneMap: Record<string, { x: number; y: number; w: number; h: number }> = {
      left: { x: 0, y: topOffset, w: halfW, h: vh },
      right: { x: halfW, y: topOffset, w: halfW, h: vh },
      top: { x: 0, y: topOffset, w: vw, h: vh },
      'top-left': { x: 0, y: topOffset, w: halfW, h: halfH },
      'top-right': { x: halfW, y: topOffset, w: halfW, h: halfH },
      'bottom-left': { x: 0, y: topOffset + halfH, w: halfW, h: halfH },
      'bottom-right': { x: halfW, y: topOffset + halfH, w: halfW, h: halfH },
    }

    const rect = zoneMap[zone]
    if (!rect) return

    set({
      windows: {
        ...state.windows,
        [windowId]: {
          ...win,
          preMaximizePosition: win.preMaximizePosition ?? { ...win.position },
          preMaximizeSize: win.preMaximizeSize ?? { ...win.size },
          status: zone === 'top' ? ('maximized' as const) : ('open' as const),
          position: { x: rect.x, y: rect.y },
          size: { w: rect.w, h: rect.h },
        },
      },
      snapPreview: null,
    })
  },

  openWindow: (appId, apps) => {
    let allowed = false
    deskuiMiddleware.run({ type: 'openWindow', appId }, () => {
      allowed = true
    })
    if (!allowed) return null

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
      isPip: false,
      prePipPosition: null,
      prePipSize: null,
    }

    const newZStack = [...state.zStack, windowId]
    let newWindows = { ...state.windows, [windowId]: newWindow }
    newWindows = deriveZIndexes(newWindows, newZStack)
    newWindows = setFocused(newWindows, windowId)

    set({ windows: newWindows, zStack: newZStack })
    return windowId
  },

  closeWindow: (windowId) => {
    let allowed = false
    deskuiMiddleware.run({ type: 'closeWindow', windowId }, () => {
      allowed = true
    })
    if (!allowed) return

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

  maximizeWindow: (windowId, reservedSpace) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win || win.status === 'maximized') return

    const barH = reservedSpace?.height ?? 0
    const barPos = reservedSpace?.position ?? 'bottom'
    const newWindows = {
      ...state.windows,
      [windowId]: {
        ...win,
        preMaximizePosition: { ...win.position },
        preMaximizeSize: { ...win.size },
        status: 'maximized' as const,
        position: { x: 0, y: barPos === 'top' ? barH : 0 },
        size: { w: window.innerWidth, h: window.innerHeight - barH },
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

  togglePip: (windowId, topOffset = 0) => {
    const state = get()
    const win = state.windows[windowId]
    if (!win) return

    if (win.isPip) {
      // Exit PiP — restore original position/size
      set({
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            isPip: false,
            position: win.prePipPosition ?? win.position,
            size: win.prePipSize ?? win.size,
            zIndex: BASE_Z + state.zStack.indexOf(windowId),
            prePipPosition: null,
            prePipSize: null,
          },
        },
      })
    } else {
      // Enter PiP — shrink and pin to corner
      set({
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            isPip: true,
            prePipPosition: { ...win.position },
            prePipSize: { ...win.size },
            position: { x: window.innerWidth - PIP_SIZE.w - 16, y: topOffset + 16 },
            size: PIP_SIZE,
            zIndex: PIP_Z,
            isFocused: false,
          },
        },
      })
    }
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
