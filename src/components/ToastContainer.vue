<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-md shadow-xl border border-white/10"
          :class="bgClass[toast.type]"
        >
          <component :is="icons[toast.type]" :size="17" class="flex-shrink-0 mt-0.5 opacity-90" />
          <p class="text-sm font-medium flex-1 leading-snug">{{ toast.message }}</p>
          <button
            @click="toastStore.dismiss(toast.id)"
            class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity -mr-1"
          >
            <X :size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const toastStore = useToastStore()

const bgClass = {
  success: 'bg-success text-white',
  error:   'bg-danger text-white',
  info:    'bg-primary text-white',
  warning: 'bg-warning text-white',
}

const icons = {
  success: CheckCircle2,
  error:   XCircle,
  info:    Info,
  warning: AlertTriangle,
}
</script>
