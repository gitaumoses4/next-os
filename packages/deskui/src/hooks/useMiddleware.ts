'use client'

import { useEffect } from 'react'
import { deskuiMiddleware, type MiddlewareFn } from '@/utils/middleware'

/**
 * Register a middleware that intercepts store actions.
 * Return false from the middleware to prevent the action.
 *
 * @example
 * useMiddleware((action, next) => {
 *   if (action.type === 'openWindow') {
 *     console.log('Opening', action.appId)
 *   }
 *   next() // continue to next middleware / execute action
 * })
 *
 * @example
 * // Limit max windows
 * useMiddleware((action, next) => {
 *   if (action.type === 'openWindow') {
 *     const count = Object.keys(useOSStore.getState().windows).length
 *     if (count >= 5) return false // block
 *   }
 *   next()
 * })
 */
export function useMiddleware(fn: MiddlewareFn) {
  useEffect(() => {
    return deskuiMiddleware.use(fn)
  }, [fn])
}
