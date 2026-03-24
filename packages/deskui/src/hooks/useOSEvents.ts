'use client'

import { useEffect } from 'react'
import { deskuiEvents, type DeskuiEvent } from '@/utils/eventEmitter'

/**
 * Subscribe to deskui events. The listener is automatically
 * cleaned up when the component unmounts.
 */
export function useOSEvents(listener: (event: DeskuiEvent) => void) {
  useEffect(() => {
    return deskuiEvents.on(listener)
  }, [listener])
}
