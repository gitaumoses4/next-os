import { create } from 'zustand'

export interface Notification {
  id: string
  title: string
  body?: string
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
  timestamp: number
  read: boolean
}

interface NotificationStore {
  notifications: Notification[]
  toasts: Notification[]
  panelOpen: boolean

  push: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  dismiss: (id: string) => void
  dismissToast: (id: string) => void
  markRead: (id: string) => void
  clearAll: () => void
  togglePanel: () => void
  closePanel: () => void
}

let notifCounter = 0

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  toasts: [],
  panelOpen: false,

  push: (notif) => {
    const id = `notif-${++notifCounter}`
    const notification: Notification = {
      ...notif,
      id,
      timestamp: Date.now(),
      read: false,
    }

    set((state) => ({
      notifications: [notification, ...state.notifications],
      toasts: [...state.toasts, notification],
    }))

    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  },

  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearAll: () => set({ notifications: [] }),

  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),

  closePanel: () => set({ panelOpen: false }),
}))
