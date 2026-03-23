'use client'

import { useState } from 'react'

interface ModeToggleProps {
  mode: 'desktop' | 'web'
  onToggle: () => void
}

export function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  const [hovered, setHovered] = useState(false)

  const isDesktop = mode === 'desktop'
  const label = isDesktop ? 'Switch to Web' : 'Switch to Desktop'
  const icon = isDesktop ? '🌐' : '🖥️'

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${label} (Ctrl+Shift+D)`}
      style={{
        position: 'fixed',
        bottom: isDesktop ? 90 : 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: hovered ? '8px 14px' : '8px 10px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        color: '#fff',
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
      {hovered && <span>{label}</span>}
    </button>
  )
}
