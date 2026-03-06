<template>
  <div class="page-pad max-w-5xl mx-auto space-y-6 pb-8">
    <!-- Greeting row -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-brand-muted text-sm">{{ greeting }},</p>
        <h2 class="text-xl font-extrabold text-secondary leading-tight">
          {{ userStore.name.split(' ')[0] }}
        </h2>
        <p class="text-xs text-brand-muted mt-0.5">
          {{ isRenter ? 'Find your perfect rental property' : 'Discover your dream property' }}
        </p>
      </div>
      <router-link
        to="/notifications"
        class="relative w-11 h-11 bg-white rounded-md flex items-center justify-center shadow-card hover:shadow-card-hover transition-shadow"
      >
        <Bell :size="19" class="text-secondary" />
        <span
          v-if="unread"
          class="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg"
        >{{ unread }}</span>
      </router-link>
    </div>

    <!-- Search Bar -->
    <div
      class="relative cursor-pointer"
      @click="$router.push('/properties')"
    >
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" :size="17" />
      <div
        class="input-field pl-12 cursor-pointer bg-white select-none flex items-center text-brand-light"
        style="pointer-events: none"
      >
        {{ isRenter ? 'Search rentals, locations...' : 'Search properties, locations...' }}
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        v-for="chip in filterChips"
        :key="chip"
        @click="activeChip = chip"
        class="chip flex-shrink-0"
        :class="activeChip === chip ? 'chip-active' : 'chip-inactive'"
      >{{ chip }}</button>
    </div>

    <!-- Browse By -->
    <div>
      <h3 class="section-title">Browse By</h3>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <router-link
          v-for="cat in categories"
          :key="cat.label"
          to="/properties"
          class="flex-shrink-0 flex flex-col items-center gap-2.5 bg-white rounded-md px-4 py-4 shadow-card hover:shadow-card-hover transition-shadow min-w-[76px]"
        >
          <div class="w-10 h-10 rounded-md flex items-center justify-center" :class="cat.bg">
            <component :is="cat.icon" :size="20" :class="cat.color" />
          </div>
          <span class="text-xs font-semibold text-secondary whitespace-nowrap">{{ cat.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Featured Listings -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Featured Listings</h3>
        <router-link to="/properties" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          See All <ChevronRight :size="14" />
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PropertyCard v-for="p in featured" :key="p.id" :property="p" />
      </div>
    </div>

    <!-- Popular Locations -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-title mb-0">Popular Locations</h3>
        <router-link to="/properties" class="text-primary text-sm font-semibold hover:underline">Explore</router-link>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <div
          v-for="loc in popularLocations"
          :key="loc.name"
          class="flex-shrink-0 relative rounded-md overflow-hidden cursor-pointer w-36 h-24 group"
          @click="$router.push('/properties')"
        >
          <img
            :src="loc.image"
            :alt="loc.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent flex flex-col justify-end p-2.5">
            <span class="text-white text-xs font-bold leading-tight">{{ loc.name }}</span>
            <span class="text-white/60 text-[10px]">{{ loc.count }}+ listings</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePropertyStore } from '@/stores/property'
import { mockNotifications } from '@/data/mockData'
import { popularLocations } from '@/data/nigerianLocations'
import PropertyCard from '@/components/PropertyCard.vue'
import { Bell, Search, ChevronRight, Home, Tag, Key, FileText, Moon, Building2, Landmark, HardHat } from 'lucide-vue-next'

const userStore = useUserStore()
const propStore = usePropertyStore()

const isRenter = computed(() => userStore.isRenter)
const unread = computed(() => mockNotifications.filter(n => !n.read).length)
const featured = computed(() => propStore.featuredListings)

// Time-aware greeting
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

const buyerChips  = ['All', 'Buy', 'Land', 'New Dev', 'Commercial']
const renterChips = ['All', 'Rent', 'Lease', 'Shortlet', 'Commercial']
const filterChips = computed(() => isRenter.value ? renterChips : buyerChips)
const activeChip  = ref('All')

const categories = [
  { icon: Home,      label: 'Buy',        color: 'text-primary',  bg: 'bg-primary/10'  },
  { icon: Tag,       label: 'Sell',       color: 'text-success',  bg: 'bg-success/10'  },
  { icon: Key,       label: 'Rent',       color: 'text-warning',  bg: 'bg-warning/10'  },
  { icon: FileText,  label: 'Lease',      color: 'text-secondary',bg: 'bg-secondary/10'},
  { icon: Moon,      label: 'Shortlet',   color: 'text-secondary-variant', bg: 'bg-secondary/10' },
  { icon: Building2, label: 'Commercial', color: 'text-primary',  bg: 'bg-primary/10'  },
  { icon: Landmark,  label: 'Land',       color: 'text-success',  bg: 'bg-success/10'  },
  { icon: HardHat,   label: 'New Dev',    color: 'text-warning',  bg: 'bg-warning/10'  },
]
</script>
