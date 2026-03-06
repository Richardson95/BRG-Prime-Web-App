<template>
  <AppLayout>
    <div class="page-pad max-w-5xl mx-auto pb-10 space-y-4">
      <!-- Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          class="chip flex-shrink-0" :class="activeTab === tab ? 'chip-active' : 'chip-inactive'">{{ tab }}</button>
      </div>

      <!-- Property Grid -->
      <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PropertyCard v-for="p in filtered" :key="p.id" :property="p" />
      </div>

      <div v-else class="text-center py-16">
        <ClipboardList :size="32" class="text-brand-light mx-auto mb-3" />
        <h3 class="font-bold text-secondary mb-1">No listings found</h3>
        <router-link to="/properties" class="btn-primary inline-block w-40">Explore All</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PropertyCard from '@/components/PropertyCard.vue'
import { usePropertyStore } from '@/stores/property'
import { ClipboardList } from 'lucide-vue-next'

const propStore = usePropertyStore()
const activeTab = ref('Rent')
const tabs = ['Rent', 'Lease', 'Shortlet', 'Buy']

const typeMap = { Rent: 'rent', Lease: 'lease', Shortlet: 'shortlet', Buy: 'sale' }
const filtered = computed(() =>
  propStore.listings.filter(p => p.listingType === typeMap[activeTab.value])
)
</script>
