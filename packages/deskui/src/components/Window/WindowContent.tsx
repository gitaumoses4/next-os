'use client'

import { useState } from 'react'

interface WindowContentProps {
  route: string
}

export function WindowContent({ route }: WindowContentProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f8f8',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '2px solid #e0e0e0',
              borderTopColor: '#999',
              borderRadius: '50%',
              animation: 'nos-spin 0.6s linear infinite',
            }}
          />
        </div>
      )}
      <iframe
        src={route}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: loaded ? 'block' : 'block',
          opacity: loaded ? 1 : 0,
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        loading="lazy"
      />
    </div>
  )
}
