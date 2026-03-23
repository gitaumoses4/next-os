import type { DeepPartial } from '@/types'
import type { OSTheme } from '@/themes/types'

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const baseVal = base[key]
    const overrideVal = override[key]

    if (isObject(baseVal) && isObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal)
    } else {
      result[key] = overrideVal
    }
  }
  return result
}

export function mergeTheme(base: OSTheme, override: DeepPartial<OSTheme>): OSTheme {
  return deepMerge(
    base as unknown as Record<string, unknown>,
    override as Record<string, unknown>,
  ) as unknown as OSTheme
}
