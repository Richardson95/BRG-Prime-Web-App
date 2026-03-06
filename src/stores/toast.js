import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({ toasts: [] }),
  actions: {
    show(message, type = 'success', duration = 3500) {
      const id = Date.now() + Math.random()
      this.toasts.push({ id, message, type })
      setTimeout(() => this.dismiss(id), duration)
    },
    dismiss(id) {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx > -1) this.toasts.splice(idx, 1)
    },
    success(msg) { this.show(msg, 'success') },
    error(msg)   { this.show(msg, 'error', 5000) },
    info(msg)    { this.show(msg, 'info') },
    warning(msg) { this.show(msg, 'warning') },
  },
})
