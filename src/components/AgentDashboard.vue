<template>
  <div class="page-pad max-w-5xl mx-auto space-y-6 pb-24">
    <!-- Banner -->
    <div class="navy-gradient rounded-lg p-5 text-white relative overflow-hidden">
      <div class="absolute -right-6 -top-6 w-40 h-40 bg-white/5 rounded-full"></div>
      <div class="absolute right-4 bottom-0 w-24 h-24 bg-white/5 rounded-full"></div>
      <Building2 class="absolute right-5 top-5 opacity-10" :size="72" />
      <p class="text-white/60 text-xs font-medium uppercase tracking-wider mb-0.5">Agent Dashboard</p>
      <h2 class="text-2xl font-extrabold mb-0.5">{{ greeting }}, {{ userStore.name.split(' ')[0] }}</h2>
      <p class="text-white/50 text-sm">Overview of your performance</p>
      <div class="flex items-center gap-2 mt-3">
        <span class="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          <BadgeCheck :size="12" /> Verified Agent
        </span>
        <span class="inline-flex items-center gap-1.5 bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
          Professional Plan
        </span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="stat in stats" :key="stat.label"
        class="card p-4 hover:shadow-card-hover transition-shadow cursor-default"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-md flex items-center justify-center" :class="stat.bg">
            <component :is="stat.icon" :size="19" :class="stat.color" />
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="stat.badgeClass">
            +{{ stat.change }}%
          </span>
        </div>
        <div class="text-2xl font-extrabold text-secondary leading-none">{{ stat.value }}</div>
        <div class="text-xs text-brand-muted mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Performance Analytics Card -->
    <div class="card p-5 cursor-pointer hover:shadow-card-hover transition-shadow" @click="$router.push('/analytics')">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="font-bold text-secondary">Performance Analytics</h3>
          <p class="text-xs text-brand-muted mt-0.5">Monthly property views</p>
        </div>
        <span class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
          Full Report <ChevronRight :size="14" />
        </span>
      </div>
      <!-- Animated bar chart -->
      <div class="flex items-end gap-2 h-28">
        <div v-for="(bar, i) in chartData" :key="i" class="flex-1 flex flex-col items-center gap-1.5 group">
          <span class="text-[10px] text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            {{ bar.value }}
          </span>
          <div
            class="w-full rounded-t-md transition-all duration-700 ease-out"
            :class="i === chartData.length - 1 ? 'primary-gradient' : 'bg-primary/20 group-hover:bg-primary/40'"
            :style="{ height: mounted ? `${(bar.value / maxVal) * 100}%` : '4px' }"
          ></div>
          <span class="text-[10px] text-brand-light font-medium">{{ bar.month }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Inquiries -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Recent Inquiries</h3>
        <router-link to="/tenants" class="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
          See All <ChevronRight :size="14" />
        </router-link>
      </div>
      <div class="card divide-y divide-brand-border-light overflow-hidden">
        <div
          v-for="(inq, i) in inquiries" :key="inq.id"
          class="flex items-center gap-3 p-4 hover:bg-brand-bg transition-colors cursor-pointer"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            :class="avatarColors[i % avatarColors.length]"
          >
            {{ inq.initials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-secondary text-sm leading-tight">{{ inq.name }}</div>
            <div class="text-xs text-brand-muted truncate mt-0.5">{{ inq.property }}</div>
          </div>
          <div class="flex-shrink-0 text-right">
            <span class="badge bg-primary/10 text-primary text-[10px]">{{ inq.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB: New Listing -->
    <div class="fixed bottom-6 right-6 z-10">
      <router-link
        to="/add-listing"
        class="primary-gradient text-white font-bold px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2
        hover:opacity-90 active:scale-95 transition-all"
      >
        <Plus :size="18" />
        New Listing
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { Building2, ChevronRight, Plus, Eye, Users, TrendingUp, BadgeCheck } from 'lucide-vue-next'

const userStore = useUserStore()
const mounted = ref(false)

onMounted(() => {
  // Trigger chart animation after brief delay for entrance effect
  setTimeout(() => { mounted.value = true }, 120)
})

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const stats = [
  { label: 'Active Listings', value: '12',   change: 8,  icon: Building2,  color: 'text-primary',          bg: 'bg-primary/10',  badgeClass: 'bg-primary/10 text-primary' },
  { label: 'Total Views',     value: '1.2k', change: 15, icon: Eye,        color: 'text-warning',           bg: 'bg-warning/10',  badgeClass: 'bg-warning/10 text-warning' },
  { label: 'Leads',           value: '45',   change: 12, icon: Users,      color: 'text-secondary-variant', bg: 'bg-secondary/10',badgeClass: 'bg-secondary/10 text-secondary' },
  { label: 'Revenue',         value: '₦8.5M',change: 22, icon: TrendingUp, color: 'text-success',           bg: 'bg-success/10',  badgeClass: 'bg-success/10 text-success' },
]

const chartData = [
  { month: 'Jan', value: 210 }, { month: 'Feb', value: 340 }, { month: 'Mar', value: 290 },
  { month: 'Apr', value: 380 }, { month: 'May', value: 480 }, { month: 'Jun', value: 610 },
]
const maxVal = computed(() => Math.max(...chartData.map(d => d.value)))

const avatarColors = ['bg-primary', 'bg-secondary-variant', 'bg-success', 'bg-warning']

const inquiries = [
  { id: 0, name: 'Adebayo Okafor',   property: 'Inquired: Modern Luxury Apartment', time: '2m ago',  initials: 'AO' },
  { id: 1, name: 'Ngozi Eze',        property: 'Inquired: Studio Apartment, Yaba',   time: '1h ago',  initials: 'NE' },
  { id: 2, name: 'Emeka Chukwu',     property: 'Inquired: 3-Bed Terrace, Gbagada',  time: '3h ago',  initials: 'EC' },
]
</script>
