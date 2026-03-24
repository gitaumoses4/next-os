export type DeskuiEvent =
  | { type: 'window:open'; windowId: string; appId: string }
  | { type: 'window:close'; windowId: string }
  | { type: 'window:focus'; windowId: string }
  | { type: 'window:blur'; windowId: string }
  | { type: 'window:move'; windowId: string; position: { x: number; y: number } }
  | { type: 'window:resize'; windowId: string; size: { w: number; h: number } }
  | { type: 'window:maximize'; windowId: string }
  | { type: 'window:minimize'; windowId: string }
  | { type: 'window:restore'; windowId: string }
  | { type: 'mode:change'; mode: 'desktop' | 'web' }
  | { type: 'lock'; locked: boolean }

type Listener = (event: DeskuiEvent) => void

class EventEmitter {
  private listeners = new Set<Listener>()

  on(listener: Listener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(event: DeskuiEvent) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }

  removeAll() {
    this.listeners.clear()
  }
}

export const deskuiEvents = new EventEmitter()
