'use client'

import { useOSContext } from '@/context/OSContext'
import type { OSTheme } from '@/themes/types'

export function useTheme(): OSTheme {
  return useOSContext().theme
}
