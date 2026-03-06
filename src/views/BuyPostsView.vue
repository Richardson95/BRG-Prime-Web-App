<template>
  <AppLayout>
    <div class="page-pad pb-10">

      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-extrabold text-secondary">Buy Post Credits</h2>
        <p class="text-brand-muted text-sm mt-1">Purchase credits to publish listings on BRG Prime</p>
      </div>

      <!-- Current Balance -->
      <div class="card p-5 mb-6 navy-gradient relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Current Balance</p>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-extrabold text-white">{{ creditsStore.balance }}</span>
              <span class="text-white/50">credits</span>
            </div>
            <p class="text-white/40 text-xs mt-1">
              {{ creditsStore.balance > 0 ? `Good for ${creditsStore.balance} more listing${creditsStore.balance > 1 ? 's' : ''}` : 'No credits — buy a bundle below' }}
            </p>
          </div>
          <div class="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
            <Layers :size="26" class="text-white" />
          </div>
        </div>
      </div>

      <!-- Bundles -->
      <div class="space-y-4 mb-8">
        <div
          v-for="bundle in bundles"
          :key="bundle.id"
          @click="select(bundle)"
          class="card p-5 cursor-pointer border-2 transition-all duration-200 hover:border-primary hover:shadow-card-hover"
          :class="selected?.id === bundle.id ? 'border-primary bg-primary/5' : 'border-transparent'"
        >
          <div class="flex items-center gap-4">
            <!-- Icon -->
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="bundle.bg"
            >
              <component :is="bundle.icon" :size="24" :class="bundle.color" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-extrabold text-secondary text-base">{{ bundle.name }}</span>
                <span v-if="bundle.popular" class="badge bg-primary text-white">Best Value</span>
              </div>
              <p class="text-brand-muted text-xs">{{ bundle.description }}</p>
              <p class="text-xs text-brand-muted mt-1">
                <span class="font-semibold text-secondary">₦{{ perPost(bundle) }}</span> per post
              </p>
            </div>

            <!-- Price + Radio -->
            <div class="text-right flex-shrink-0">
              <div class="text-xl font-extrabold text-secondary">₦{{ formatPrice(bundle.price) }}</div>
              <div class="text-xs text-brand-muted">{{ bundle.posts }} posts</div>
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-2 ml-auto"
                :class="selected?.id === bundle.id ? 'border-primary bg-primary' : 'border-brand-border'"
              >
                <Check v-if="selected?.id === bundle.id" :size="11" class="text-white" />
              </div>
            </div>
          </div>

          <!-- Savings badge -->
          <div v-if="bundle.savings" class="mt-3 pt-3 border-t border-brand-border-light">
            <span class="text-xs text-success font-semibold bg-success/10 px-2 py-0.5 rounded-full">
              Save ₦{{ formatPrice(bundle.savings) }} vs buying individually
            </span>
          </div>
        </div>
      </div>

      <!-- Proceed Button -->
      <button
        @click="proceed"
        class="btn-primary w-full py-4 text-base font-bold"
        :disabled="!selected"
      >
        <Layers :size="18" class="mr-2" />
        Pay ₦{{ selected ? formatPrice(selected.price) : '—' }} for {{ selected?.posts || '—' }} Credits
      </button>

      <p class="text-center text-brand-light text-xs mt-4">
        All payments are processed securely via Paystack
      </p>

      <!-- Usage History -->
      <div v-if="creditsStore.history.length" class="mt-8">
        <h3 class="section-title">Credit History</h3>
        <div class="card divide-y divide-brand-border-light overflow-hidden">
          <div
            v-for="(h, i) in creditsStore.history.slice(0, 10)"
            :key="i"
            class="flex items-center gap-3 px-5 py-3.5"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="h.type === 'purchase' ? 'bg-success/10' : 'bg-danger/10'"
            >
              <component :is="h.type === 'purchase' ? Plus : Minus" :size="14" :class="h.type === 'purchase' ? 'text-success' : 'text-danger'" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-secondary">
                {{ h.type === 'purchase' ? `Purchased ${h.bundle || 'Credits'}` : 'Used for listing' }}
              </div>
              <div class="text-xs text-brand-muted">{{ formatDate(h.date) }}</div>
            </div>
            <span
              class="text-sm font-bold"
              :class="h.type === 'purchase' ? 'text-success' : 'text-danger'"
            >
              {{ h.type === 'purchase' ? '+' : '' }}{{ h.amount }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <PaystackModal
      :show="showModal"
      :bundle="selectedBundle"
      @close="showModal = false"
      @success="onPaymentSuccess"
    />
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import PaystackModal from '@/components/PaystackModal.vue'
import { useCreditsStore } from '@/stores/credits'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { Layers, Check, Plus, Minus, Zap, Star, Rocket } from 'lucide-vue-next'

const creditsStore = useCreditsStore()
const toast        = useToastStore()
const router       = useRouter()

const selected       = ref(null)
const showModal      = ref(false)
const selectedBundle = ref(null)

const bundles = [
  {
    id:          'starter',
    name:        'Starter Pack',
    posts:       5,
    price:       100000,
    savings:     null,
    popular:     false,
    description: 'Great for individuals with a few properties to list',
    icon:        Zap,
    color:       'text-primary',
    bg:          'bg-primary/10',
  },
  {
    id:          'standard',
    name:        'Standard Pack',
    posts:       10,
    price:       150000,
    savings:     50000,
    popular:     true,
    description: 'Best value for active sellers and landlords',
    icon:        Star,
    color:       'text-warning',
    bg:          'bg-warning/10',
  },
  {
    id:          'pro',
    name:        'Pro Pack',
    posts:       20,
    price:       200000,
    savings:     200000,
    popular:     false,
    description: 'For professionals managing multiple properties',
    icon:        Rocket,
    color:       'text-success',
    bg:          'bg-success/10',
  },
]

const formatPrice = (n) => n ? n.toLocaleString() : '0'
const perPost     = (b) => Math.round(b.price / b.posts).toLocaleString()
const formatDate  = (iso) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const select = (bundle) => {
  selected.value = bundle
}

const proceed = () => {
  if (!selected.value) return
  selectedBundle.value = selected.value
  showModal.value = true
}

const onPaymentSuccess = (bundle) => {
  creditsStore.addCredits(bundle.posts, bundle.name)
  showModal.value = false
  toast.success(`${bundle.posts} post credits added to your account!`)
  setTimeout(() => router.push('/add-listing'), 600)
}
</script>
