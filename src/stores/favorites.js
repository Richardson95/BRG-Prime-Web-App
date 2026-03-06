import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    savedIds: new Set(JSON.parse(localStorage.getItem('saved_properties') || '[]')),
  }),
  getters: {
    count: (state) => state.savedIds.size,
    isSaved: (state) => (id) => state.savedIds.has(id),
  },
  actions: {
    toggle(id) {
      if (this.savedIds.has(id)) {
        this.savedIds.delete(id)
      } else {
        this.savedIds.add(id)
      }
      localStorage.setItem('saved_properties', JSON.stringify([...this.savedIds]))
    },
  },
})
