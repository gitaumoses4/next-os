export type MiddlewareAction =
  | { type: 'openWindow'; appId: string }
  | { type: 'closeWindow'; windowId: string }
  | { type: 'focusWindow'; windowId: string }
  | { type: 'minimizeWindow'; windowId: string }
  | { type: 'maximizeWindow'; windowId: string }
  | { type: 'restoreWindow'; windowId: string }
  | { type: 'moveWindow'; windowId: string; position: { x: number; y: number } }
  | { type: 'resizeWindow'; windowId: string; size: { w: number; h: number } }

/**
 * Middleware receives the action and calls next() to continue the chain.
 * Not calling next() blocks the action.
 */
export type MiddlewareFn = (action: MiddlewareAction, next: () => void) => void

class MiddlewareRegistry {
  private middlewares: MiddlewareFn[] = []

  use(fn: MiddlewareFn) {
    this.middlewares.push(fn)
    return () => {
      this.middlewares = this.middlewares.filter((m) => m !== fn)
    }
  }

  run(action: MiddlewareAction, execute: () => void): void {
    const chain = [...this.middlewares]
    let index = 0

    const next = () => {
      if (index < chain.length) {
        chain[index++](action, next)
      } else {
        execute()
      }
    }

    next()
  }

  clear() {
    this.middlewares = []
  }
}

export const deskuiMiddleware = new MiddlewareRegistry()
