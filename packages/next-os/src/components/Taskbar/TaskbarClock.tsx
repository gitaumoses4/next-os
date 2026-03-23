'use client'

import { useState, useEffect } from 'react'

export function TaskbarClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [])

  return <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{time}</span>
}
