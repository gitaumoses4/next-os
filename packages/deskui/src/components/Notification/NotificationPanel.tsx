'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '@/store/notificationStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return new Date(timestamp).toLocaleDateString()
}

export function NotificationPanel() {
  const { notifications, panelOpen, closePanel, dismiss, markRead, clearAll } =
    useNotificationStore()
  const { theme } = useOSContext()
  const nt = theme.notification

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          <div
            onClick={closePanel}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9993,
            }}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: 8,
              right: 8,
              bottom: 8,
              width: nt.panelWidth,
              zIndex: 9994,
              background: nt.panelBg,
              backdropFilter: nt.blur,
              WebkitBackdropFilter: nt.blur,
              border: nt.border,
              borderRadius: nt.borderRadius,
              boxShadow: nt.shadow,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${nt.border.split('solid ')[1] ?? 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: nt.titleColor }}>
                Notifications
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: nt.actionColor,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
              {notifications.length === 0 && (
                <div
                  style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: nt.timeColor,
                    fontSize: 13,
                  }}
                >
                  No notifications
                </div>
              )}
              <AnimatePresence>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => markRead(notif.id)}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      opacity: notif.read ? 0.6 : 1,
                    }}
                  >
                    {notif.icon && (
                      <div style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }}>
                        <AppIcon icon={notif.icon} size={24} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: nt.titleColor }}>
                          {notif.title}
                        </span>
                        <span style={{ fontSize: 11, color: nt.timeColor, flexShrink: 0 }}>
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>
                      {notif.body && (
                        <div style={{ fontSize: 12, color: nt.bodyColor, marginTop: 2 }}>
                          {notif.body}
                        </div>
                      )}
                      {notif.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            notif.action!.onClick()
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: nt.actionColor,
                            fontSize: 12,
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: 4,
                          }}
                        >
                          {notif.action.label}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dismiss(notif.id)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: nt.timeColor,
                        fontSize: 14,
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
