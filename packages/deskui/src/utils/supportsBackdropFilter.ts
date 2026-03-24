let cached: boolean | null = null

export function supportsBackdropFilter(): boolean {
  if (cached !== null) return cached
  if (typeof window === 'undefined') return true

  cached =
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  return cached
}
