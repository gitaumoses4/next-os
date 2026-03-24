'use client'

import { useState } from 'react'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { useReservedSpace } from '@/hooks/useReservedSpace'
import type { AppDefinition } from '@/types'

interface WindowControlsProps {
  windowId: string
  app: AppDefinition
}

export function WindowControls({ windowId, app }: WindowControlsProps) {
  const { theme } = useOSContext()
  const { controlStyle, controlsPosition } = theme.windowChrome
  const requestClose = useOSStore((s) => s.requestClose)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const win = useOSStore((s) => s.windows[windowId])
  const isMaximized = win?.status === 'maximized'
  const isFocused = win?.isFocused ?? false
  const reservedSpace = useReservedSpace()

  const onClose = () => requestClose(windowId)
  const onMinimize = () => minimizeWindow(windowId)
  const onMaximize = () => maximizeWindow(windowId, reservedSpace)
  const onRestore = () => restoreWindow(windowId)
  const toggleMaximize = () => (isMaximized ? onRestore() : onMaximize())

  // Custom controls render prop
  if (app.renderControls) {
    return (
      <>
        {app.renderControls({
          windowId,
          isFocused,
          isMaximized,
          onClose,
          onMinimize,
          onMaximize,
          onRestore,
        })}
      </>
    )
  }

  if (controlStyle === 'traffic-lights') {
    return (
      <TrafficLights
        position={controlsPosition}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={toggleMaximize}
      />
    )
  }

  return (
    <Squares
      position={controlsPosition}
      isMaximized={isMaximized}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={toggleMaximize}
    />
  )
}

// --- Traffic Lights (macOS) ---

interface TrafficLightsProps {
  position: 'left' | 'right'
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

function TrafficLights({ position, onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  const [hovered, setHovered] = useState(false)

  const dotSize = 14
  const buttonStyle: React.CSSProperties = {
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    lineHeight: 1,
    color: 'transparent',
    padding: 0,
    outline: '4px solid transparent',
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 2px',
        order: position === 'left' ? -1 : 1,
        [position === 'left' ? 'marginRight' : 'marginLeft']: 'auto',
      }}
    >
      <button
        onClick={onClose}
        style={{
          ...buttonStyle,
          backgroundColor: '#ff5f57',
          color: hovered ? 'rgba(0,0,0,0.5)' : 'transparent',
        }}
        aria-label="Close"
      >
        ×
      </button>
      <button
        onClick={onMinimize}
        style={{
          ...buttonStyle,
          backgroundColor: '#ffbd2e',
          color: hovered ? 'rgba(0,0,0,0.5)' : 'transparent',
        }}
        aria-label="Minimize"
      >
        −
      </button>
      <button
        onClick={onMaximize}
        style={{
          ...buttonStyle,
          backgroundColor: '#28c840',
          color: hovered ? 'rgba(0,0,0,0.5)' : 'transparent',
        }}
        aria-label="Maximize"
      >
        ↗
      </button>
    </div>
  )
}

// --- Squares (Windows) ---

interface SquaresProps {
  position: 'left' | 'right'
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

function Squares({ position, isMaximized, onClose, onMinimize, onMaximize }: SquaresProps) {
  const baseStyle: React.CSSProperties = {
    width: 46,
    height: '100%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: 'inherit',
    padding: 0,
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '100%',
        order: position === 'right' ? 1 : -1,
        [position === 'right' ? 'marginLeft' : 'marginRight']: 'auto',
      }}
    >
      <button onClick={onMinimize} style={baseStyle} className="nos-sq-btn" aria-label="Minimize">
        ─
      </button>
      <button
        onClick={onMaximize}
        style={baseStyle}
        className="nos-sq-btn"
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? '❐' : '□'}
      </button>
      <button
        onClick={onClose}
        style={baseStyle}
        className="nos-sq-btn nos-sq-close"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}
