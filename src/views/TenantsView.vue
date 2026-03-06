<template>
  <AppLayout>
    <div class="page-pad max-w-4xl mx-auto pb-10 space-y-4">
      <!-- Search -->
      <div class="relative">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input v-model="search" class="input-field pl-9" placeholder="Search tenants..." />
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center"><div class="text-xl font-extrabold text-primary">{{ tenants.length }}</div><div class="text-xs text-brand-muted">Total</div></div>
        <div class="card p-3 text-center"><div class="text-xl font-extrabold text-success">{{ active }}</div><div class="text-xs text-brand-muted">Active</div></div>
        <div class="card p-3 text-center"><div class="text-xl font-extrabold text-danger">{{ expired }}</div><div class="text-xs text-brand-muted">Expired</div></div>
      </div>

      <!-- Tenant List -->
      <div class="space-y-3">
        <div v-for="t in filtered" :key="t.id" class="card p-4 flex items-start gap-4">
          <img :src="t.avatar" class="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="font-bold text-secondary">{{ t.name }}</div>
                <div class="text-xs text-brand-muted">{{ t.email }}</div>
              </div>
              <span class="badge flex-shrink-0" :class="t.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">{{ t.status }}</span>
            </div>
            <div class="mt-2 text-xs text-brand-muted">
              <div class="flex items-center gap-1 mb-0.5"><Building2 :size="11" /> {{ t.property }}</div>
              <div class="flex items-center gap-1"><Calendar :size="11" /> {{ t.leaseStart }} → {{ t.leaseEnd }}</div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <span class="text-primary font-bold text-sm">₦{{ t.rentAmount.toLocaleString() }}/yr</span>
              <div class="flex gap-2">
                <a :href="`tel:${t.phone}`" class="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                  <Phone :size="12" /> Call
                </a>
                <a :href="`mailto:${t.email}`" class="px-3 py-1 rounded-md bg-brand-bg text-brand-muted text-xs font-semibold flex items-center gap-1">
                  <Mail :size="12" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!filtered.length" class="text-center py-16">
        <Users :size="32" class="text-brand-light mx-auto mb-3" />
        <p class="text-brand-muted text-sm">No tenants found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { mockTenants } from '@/data/mockData'
import { Search, Building2, Calendar, Phone, Mail, Users } from 'lucide-vue-next'

const search = ref('')
const tenants = ref(mockTenants)
const filtered = computed(() => tenants.value.filter(t =>
  !search.value || t.name.toLowerCase().includes(search.value.toLowerCase()) || t.property.toLowerCase().includes(search.value.toLowerCase())
))
const active = computed(() => tenants.value.filter(t => t.status === 'Active').length)
const expired = computed(() => tenants.value.filter(t => t.status !== 'Active').length)
</script>
