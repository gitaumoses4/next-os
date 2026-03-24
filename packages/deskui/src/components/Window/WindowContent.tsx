'use client'

import { useState } from 'react'
import { useOSContext } from '@/context/OSContext'

interface WindowContentProps {
  route: string
  skeleton?: React.ReactNode
}

export function WindowContent({ route, skeleton }: WindowContentProps) {
  const { theme } = useOSContext()
  const [loaded, setLoaded] = useState(false)
  const { contentBg, loadingSpinnerColor } = theme.windowChrome

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {!loaded &&
        (skeleton ?? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: contentBg,
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              gap: 16,
            }}
          >
            {/* Skeleton blocks */}
            <div
              style={{
                width: '40%',
                height: 20,
                borderRadius: 6,
                background: loadingSpinnerColor,
                opacity: 0.15,
                animation: 'nos-pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '100%',
                height: 14,
                borderRadius: 4,
                background: loadingSpinnerColor,
                opacity: 0.1,
                animation: 'nos-pulse 1.5s ease-in-out 0.1s infinite',
              }}
            />
            <div
              style={{
                width: '80%',
                height: 14,
                borderRadius: 4,
                background: loadingSpinnerColor,
                opacity: 0.1,
                animation: 'nos-pulse 1.5s ease-in-out 0.2s infinite',
              }}
            />
            <div style={{ flex: 1 }} />
            <div
              style={{
                width: 24,
                height: 24,
                border: `2px solid ${contentBg}`,
                borderTopColor: loadingSpinnerColor,
                borderRadius: '50%',
                animation: 'nos-spin 0.6s linear infinite',
                alignSelf: 'center',
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      <iframe
        src={route}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: loaded ? 1 : 0,
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        loading="lazy"
      />
    </div>
  )
}
