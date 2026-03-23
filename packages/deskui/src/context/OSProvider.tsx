'use client'

import { useEffect, useRef } from 'react'
import { OSContext, type OSContextValue } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'

interface OSProviderProps extends OSContextValue {
  initialWindows?: string[]
  children: React.ReactNode
}

export function OSProvider({ initialWindows, children, ...contextValue }: OSProviderProps) {
  const openWindow = useOSStore((s) => s.openWindow)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !initialWindows?.length) return
    initialized.current = true

    for (const appId of initialWindows) {
      openWindow(appId, contextValue.apps)
    }
  }, [initialWindows, contextValue.apps, openWindow])

  return <OSContext.Provider value={contextValue}>{children}</OSContext.Provider>
}
