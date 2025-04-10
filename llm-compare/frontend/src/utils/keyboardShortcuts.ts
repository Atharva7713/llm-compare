type ShortcutHandler = () => void

interface Shortcut {
  key: string
  description: string
  handler: ShortcutHandler
}

class KeyboardShortcuts {
  private shortcuts: Map<string, Shortcut> = new Map()
  private isEnabled: boolean = true

  register(key: string, description: string, handler: ShortcutHandler) {
    this.shortcuts.set(key, { key, description, handler })
  }

  unregister(key: string) {
    this.shortcuts.delete(key)
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  handleKeyPress(event: KeyboardEvent) {
    if (!this.isEnabled) return

    const key = event.key.toLowerCase()
    const shortcut = this.shortcuts.get(key)

    if (shortcut) {
      event.preventDefault()
      shortcut.handler()
    }
  }

  getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values())
  }
}

export const keyboardShortcuts = new KeyboardShortcuts()

// Initialize keyboard event listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (event) => keyboardShortcuts.handleKeyPress(event))
} 