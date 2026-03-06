import { defineStore } from 'pinia'

export const useCreditsStore = defineStore('credits', {
  state: () => ({
    balance: parseInt(localStorage.getItem('credits_balance') || '0'),
    history: JSON.parse(localStorage.getItem('credits_history') || '[]'),
  }),
  getters: {
    hasCredits: (state) => state.balance > 0,
  },
  actions: {
    addCredits(amount, bundleName) {
      this.balance += amount
      this.history.unshift({
        type:   'purchase',
        amount,
        bundle: bundleName,
        date:   new Date().toISOString(),
      })
      this._persist()
    },
    useCredit() {
      if (this.balance <= 0) return false
      this.balance--
      this.history.unshift({
        type:   'used',
        amount: -1,
        date:   new Date().toISOString(),
      })
      this._persist()
      return true
    },
    _persist() {
      localStorage.setItem('credits_balance', String(this.balance))
      localStorage.setItem('credits_history', JSON.stringify(this.history.slice(0, 50)))
    },
  },
})
