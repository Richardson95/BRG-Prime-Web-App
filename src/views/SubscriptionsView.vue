<template>
  <AppLayout>
    <div class="page-pad pb-10">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-extrabold text-secondary mb-2">Choose Your Plan</h2>
        <p class="text-brand-muted text-sm mb-5">Scale your real estate business with the right tools</p>
        <!-- Billing toggle -->
        <div class="inline-flex items-center gap-2 bg-brand-bg border border-brand-border rounded-full p-1">
          <button
            @click="annual = false"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            :class="!annual ? 'bg-white text-secondary shadow-sm' : 'text-brand-muted'"
          >Monthly</button>
          <button
            @click="annual = true"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
            :class="annual ? 'bg-white text-secondary shadow-sm' : 'text-brand-muted'"
          >Annual <span class="badge bg-success text-white text-[10px]">Save 20%</span></button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="plan in plans" :key="plan.name"
          class="card p-6 relative flex flex-col"
          :class="plan.popular ? 'border-2 border-primary ring-2 ring-primary/20' : ''"
        >
          <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="badge bg-primary text-white px-4 py-1.5 text-xs">Most Popular</span>
          </div>

          <div class="mb-5">
            <div class="w-12 h-12 rounded-md flex items-center justify-center mb-3" :class="plan.iconBg">
              <component :is="plan.icon" :size="22" :class="plan.iconColor" />
            </div>
            <h3 class="text-lg font-extrabold text-secondary">{{ plan.name }}</h3>
            <div class="mt-1">
              <template v-if="plan.price">
                <span class="text-2xl font-extrabold text-primary">
                  {{ (plan.name === 'Professional' && annual) ? '₦20,000' : plan.price }}
                </span>
                <span v-if="plan.period" class="text-brand-muted text-sm">/{{ annual && plan.name === 'Professional' ? 'month (billed annually)' : plan.period }}</span>
              </template>
              <span v-else class="text-lg font-bold text-secondary">Contact Sales</span>
            </div>
          </div>

          <ul class="space-y-2.5 flex-1 mb-6">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-2 text-sm">
              <CheckCircle2 :size="15" class="text-success flex-shrink-0 mt-0.5" />
              <span class="text-brand-muted">{{ feat }}</span>
            </li>
          </ul>

          <button class="w-full" :class="plan.popular ? 'btn-primary' : 'btn-secondary'">
            {{ plan.cta }}
          </button>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mt-10">
        <h3 class="text-lg font-bold text-secondary mb-4">Frequently Asked Questions</h3>
        <div class="space-y-3">
          <div v-for="faq in faqs" :key="faq.q" class="card p-4">
            <button class="w-full flex items-center justify-between text-left" @click="faq.open = !faq.open">
              <span class="font-semibold text-secondary text-sm">{{ faq.q }}</span>
              <ChevronDown :size="16" class="text-brand-muted transition-transform" :class="faq.open ? 'rotate-180' : ''" />
            </button>
            <p v-if="faq.open" class="mt-2 text-brand-muted text-sm leading-relaxed">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { CheckCircle2, ChevronDown, Sparkles, Zap, Building2 } from 'lucide-vue-next'

const annual = ref(false)

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    period: null,
    popular: false,
    icon: Sparkles,
    iconBg: 'bg-brand-bg',
    iconColor: 'text-brand-muted',
    features: [
      'Up to 2 listings',
      'Basic analytics',
      'Standard support',
      'Messaging',
      'Property search',
    ],
    cta: 'Current Plan',
  },
  {
    name: 'Professional',
    price: '₦25,000',
    period: 'month',
    popular: true,
    icon: Zap,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    features: [
      'Unlimited listings',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      'Verified agent badge',
      'Lead management',
    ],
    cta: 'Upgrade Now',
  },
  {
    name: 'Enterprise',
    price: null,
    period: null,
    popular: false,
    icon: Building2,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    features: [
      'Custom solutions',
      'Dedicated account manager',
      'API access',
      'White-label option',
      'Unlimited verified agents',
      'Custom reporting',
    ],
    cta: 'Contact Sales',
  },
]

const faqs = reactive([
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Upgrades take effect immediately; downgrades take effect at the end of your billing cycle.', open: false },
  { q: 'Is there a free trial for the Professional plan?', a: 'Yes, we offer a 14-day free trial on the Professional plan. No credit card required.', open: false },
  { q: 'How are payments processed?', a: 'We accept bank transfers, card payments via Paystack, and USSD. All payments are processed securely.', open: false },
])
</script>
