'use client'

import { useEffect, useState } from 'react'
import { HeroUIProvider } from '@heroui/react'

function getColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  const params = new URLSearchParams(window.location.search)
  return (params.get('_deskui_colorScheme') as 'light' | 'dark') ?? 'dark'
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Read initial color scheme from URL param
    setColorScheme(getColorScheme())

    // Listen for color scheme changes from deskui shell
    const handler = (e: MessageEvent) => {
      if (e.data?.__deskui && e.data.type === 'colorScheme') {
        setColorScheme(e.data.colorScheme)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    // Update the html class for HeroUI/Tailwind dark mode
    document.documentElement.className = colorScheme
  }, [colorScheme])

  return <HeroUIProvider>{children}</HeroUIProvider>
}
