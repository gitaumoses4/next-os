'use client'

import { useState } from 'react'
import type { ModeToggleTheme } from '@/themes/types'

interface ModeToggleProps {
  mode: 'desktop' | 'web'
  onToggle: () => void
  themeTokens: ModeToggleTheme
}

export function ModeToggle({ mode, onToggle, themeTokens: mt }: ModeToggleProps) {
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
        padding: hovered ? mt.hoverPadding : '8px 10px',
        background: mt.bg,
        backdropFilter: mt.blur,
        WebkitBackdropFilter: mt.blur,
        border: mt.border,
        borderRadius: mt.borderRadius,
        color: mt.color,
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
