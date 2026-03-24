'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '@/store/notificationStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'

export function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts)
  const dismissToast = useNotificationStore((s) => s.dismissToast)
  const { theme } = useOSContext()
  const nt = theme.notification

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9995,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: nt.panelWidth,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={() => dismissToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              background: nt.bg,
              backdropFilter: nt.blur,
              WebkitBackdropFilter: nt.blur,
              border: nt.border,
              borderRadius: nt.borderRadius,
              boxShadow: nt.shadow,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            {toast.icon && (
              <div style={{ width: 28, height: 28, flexShrink: 0 }}>
                <AppIcon icon={toast.icon} size={28} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: nt.titleColor,
                  marginBottom: 2,
                }}
              >
                {toast.title}
              </div>
              {toast.body && (
                <div
                  style={{
                    fontSize: 12,
                    color: nt.bodyColor,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {toast.body}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
