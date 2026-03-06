<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <div class="card p-8">

        <!-- Logo + heading -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound :size="24" class="text-primary" />
          </div>
          <h1 class="text-2xl font-extrabold text-secondary">Reset password</h1>
          <p class="text-brand-muted text-sm mt-1">Enter your email and we'll send a reset link</p>
        </div>

        <div v-if="!sent">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-secondary mb-1.5">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="15" />
                <input
                  v-model="email"
                  type="email"
                  class="input-field pl-9"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>
            <button type="submit" class="btn-primary w-full py-3 text-sm font-bold" :disabled="loading">
              <span v-if="!loading">Send Reset Link</span>
              <span v-else class="flex items-center justify-center gap-2">
                <Loader2 :size="15" class="animate-spin" /> Sending...
              </span>
            </button>
          </form>
        </div>

        <!-- Success -->
        <div v-else class="text-center py-4">
          <div class="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 :size="28" class="text-success" />
          </div>
          <h3 class="font-bold text-secondary mb-1">Check your inbox</h3>
          <p class="text-brand-muted text-sm mb-4">
            We sent a reset link to <strong class="text-secondary">{{ email }}</strong>
          </p>
          <router-link to="/login" class="btn-primary w-full py-2.5 text-sm">Back to Sign In</router-link>
        </div>

        <!-- Footer -->
        <p class="text-center text-brand-muted text-sm mt-6">
          Remembered it?
          <router-link to="/login" class="text-primary font-semibold hover:underline">Sign In</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { KeyRound, Mail, Loader2, CheckCircle2 } from 'lucide-vue-next'

const email   = ref('')
const loading = ref(false)
const sent    = ref(false)

const handleSubmit = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
  sent.value    = true
}
</script>
