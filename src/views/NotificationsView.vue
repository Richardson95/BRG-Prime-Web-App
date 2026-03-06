<template>
  <AppLayout>
    <div class="page-pad">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-brand-muted"><span class="font-semibold text-secondary">{{ unreadCount }}</span> unread</p>
        <button @click="markAllRead" class="text-primary text-sm font-semibold hover:underline">Mark all read</button>
      </div>

      <div class="space-y-3">
        <div
          v-for="n in notifications" :key="n.id"
          @click="n.read = true"
          class="card p-4 flex items-start gap-4 cursor-pointer hover:shadow-card-hover transition-shadow"
          :class="!n.read ? 'border-l-4 border-primary' : ''"
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="iconBg(n.type)">
            <component :is="notifIcon(n.type)" :size="18" :class="iconColor(n.type)" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <span class="font-semibold text-secondary text-sm">{{ n.title }}</span>
              <span class="text-xs text-brand-light flex-shrink-0">{{ n.time }}</span>
            </div>
            <p class="text-brand-muted text-xs mt-0.5 leading-relaxed">{{ n.message }}</p>
          </div>
          <div v-if="!n.read" class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
        </div>
      </div>

      <div v-if="!notifications.length" class="text-center py-16">
        <Bell :size="32" class="text-brand-light mx-auto mb-3" />
        <p class="text-brand-muted text-sm">No notifications yet</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { mockNotifications } from '@/data/mockData'
import { Bell, MessageSquare, BadgeCheck, CreditCard, TrendingUp, Calendar } from 'lucide-vue-next'

const notifications = ref(mockNotifications.map(n => ({ ...n })))
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const markAllRead = () => notifications.value.forEach(n => n.read = true)

const notifIcon = (type) => ({
  inquiry: MessageSquare, success: BadgeCheck, payment: CreditCard,
  message: MessageSquare, subscription: TrendingUp, viewing: Calendar,
}[type] || Bell)

const iconBg = (type) => ({
  inquiry: 'bg-primary/10', success: 'bg-success/10', payment: 'bg-warning/10',
  message: 'bg-primary/10', subscription: 'bg-secondary/10', viewing: 'bg-success/10',
}[type] || 'bg-brand-bg')

const iconColor = (type) => ({
  inquiry: 'text-primary', success: 'text-success', payment: 'text-warning',
  message: 'text-primary', subscription: 'text-secondary', viewing: 'text-success',
}[type] || 'text-brand-muted')
</script>
