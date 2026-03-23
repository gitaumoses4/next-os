'use client'

import { AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { Window } from './Window'

export function WindowManager() {
  const windows = useOSStore((s) => s.windows)

  return (
    <AnimatePresence>
      {Object.keys(windows).map((windowId) => (
        <Window key={windowId} windowId={windowId} />
      ))}
    </AnimatePresence>
  )
}
