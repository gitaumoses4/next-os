'use client'

import { useCallback } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

export function useNotification() {
  const push = useNotificationStore((s) => s.push)
  const dismiss = useNotificationStore((s) => s.dismiss)
  const clearAll = useNotificationStore((s) => s.clearAll)
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)

  const notify = useCallback(
    (options: {
      title: string
      body?: string
      icon?: React.ReactNode
      action?: { label: string; onClick: () => void }
    }) => {
      push(options)
    },
    [push],
  )

  return { notify, dismiss, clearAll, unreadCount }
}
