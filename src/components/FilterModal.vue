<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-secondary/60 backdrop-blur-sm"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition name="slide-up">
          <div
            v-if="modelValue"
            class="bg-white w-full sm:max-w-md sm:rounded-lg max-h-[92vh] overflow-y-auto rounded-t-2xl"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-brand-border sticky top-0 bg-white rounded-t-2xl sm:rounded-t-lg z-10">
              <div>
                <h2 class="font-bold text-secondary">Filter Properties</h2>
                <p class="text-xs text-brand-muted mt-0.5">Narrow down your results</p>
              </div>
              <button
                @click="$emit('update:modelValue', false)"
                class="p-1.5 rounded-md text-brand-muted hover:bg-brand-bg hover:text-secondary transition-colors"
              >
                <X :size="18" />
              </button>
            </div>

            <!-- Drag handle (mobile) -->
            <div class="flex justify-center pt-3 sm:hidden">
              <div class="w-10 h-1 bg-brand-border rounded-full"></div>
            </div>

            <div class="p-5 space-y-7">
              <!-- Price Range -->
              <div>
                <label class="block text-sm font-bold text-secondary mb-3">Price Range</label>
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="text-xs text-brand-muted mb-1.5 block">Min (₦)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-xs font-bold">₦</span>
                      <input
                        :value="fmtDisplay(local.minPrice)"
                        @input="numInput($event, v => local.minPrice = v)"
                        type="text" inputmode="numeric"
                        class="input-field pl-7 text-sm" placeholder="100,000"
                      />
                    </div>
                  </div>
                  <div class="flex items-end pb-3 text-brand-light text-sm">—</div>
                  <div class="flex-1">
                    <label class="text-xs text-brand-muted mb-1.5 block">Max (₦)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-xs font-bold">₦</span>
                      <input
                        :value="fmtDisplay(local.maxPrice)"
                        @input="numInput($event, v => local.maxPrice = v)"
                        type="text" inputmode="numeric"
                        class="input-field pl-7 text-sm" placeholder="50,000,000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Property Type -->
              <div>
                <label class="block text-sm font-bold text-secondary mb-3">Property Type</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="t in propertyTypes"
                    :key="t"
                    @click="local.propertyType = t"
                    class="chip text-xs"
                    :class="local.propertyType === t ? 'chip-active' : 'chip-inactive'"
                  >{{ t }}</button>
                </div>
              </div>

              <!-- Bedrooms -->
              <div>
                <label class="block text-sm font-bold text-secondary mb-3">Bedrooms</label>
                <div class="flex gap-2">
                  <button
                    v-for="b in ['Any','1','2','3','4','5']"
                    :key="b"
                    @click="local.bedrooms = b"
                    class="flex-1 py-2 rounded-md border text-xs font-semibold transition-all duration-150 text-center"
                    :class="local.bedrooms === b
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-brand-muted border-brand-border hover:border-primary hover:text-primary'"
                  >{{ b === 'Any' ? 'Any' : b + '+' }}</button>
                </div>
              </div>

              <!-- Bathrooms -->
              <div>
                <label class="block text-sm font-bold text-secondary mb-3">Bathrooms</label>
                <div class="flex gap-2">
                  <button
                    v-for="b in ['Any','1','2','3','4']"
                    :key="b"
                    @click="local.bathrooms = b"
                    class="flex-1 py-2 rounded-md border text-xs font-semibold transition-all duration-150 text-center"
                    :class="local.bathrooms === b
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-brand-muted border-brand-border hover:border-primary hover:text-primary'"
                  >{{ b === 'Any' ? 'Any' : b + '+' }}</button>
                </div>
              </div>

              <!-- Verified Only -->
              <div class="flex items-center justify-between p-4 bg-brand-bg rounded-md">
                <div>
                  <div class="text-sm font-semibold text-secondary">Verified Listings Only</div>
                  <div class="text-xs text-brand-muted mt-0.5">Show agent-verified properties</div>
                </div>
                <button
                  @click="local.verifiedOnly = !local.verifiedOnly"
                  class="w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0"
                  :class="local.verifiedOnly ? 'bg-primary' : 'bg-brand-border'"
                  role="switch"
                  :aria-checked="local.verifiedOnly"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                    :class="local.verifiedOnly ? 'left-7' : 'left-1'"
                  />
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-5 pb-6 pt-2 border-t border-brand-border flex gap-3 sticky bottom-0 bg-white">
              <button @click="reset" class="btn-secondary flex-1 py-2.5 text-sm">Reset</button>
              <button @click="apply" class="btn-primary flex-1 py-2.5 text-sm">Apply Filters</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { usePropertyStore } from '@/stores/property'
import { X } from 'lucide-vue-next'

const fmtDisplay = (val) => (val != null && val !== '') ? Number(val).toLocaleString('en-NG') : ''
const numInput = (e, setter) => {
  const digits    = e.target.value.replace(/\D/g, '')
  const num       = digits ? parseInt(digits) : null
  setter(num)
  const formatted  = num != null ? num.toLocaleString('en-NG') : ''
  const sel        = e.target.selectionStart
  const prevCommas = (e.target.value.substring(0, sel).match(/,/g) || []).length
  e.target.value   = formatted
  const newCommas  = (formatted.substring(0, sel).match(/,/g) || []).length
  try { e.target.setSelectionRange(sel + newCommas - prevCommas, sel + newCommas - prevCommas) } catch (_) {}
}

const props = defineProps({ modelValue: Boolean })
const emit  = defineEmits(['update:modelValue'])

const propStore = usePropertyStore()
const propertyTypes = ['All', 'Apartment', 'House', 'Duplex', 'Studio', 'Bungalow', 'Terrace', 'Penthouse', 'Commercial', 'Land']

const local = reactive({ ...propStore.filterOptions })

watch(() => props.modelValue, (v) => {
  if (v) Object.assign(local, propStore.filterOptions)
})

const apply = () => {
  Object.assign(propStore.filterOptions, local)
  emit('update:modelValue', false)
}

const reset = () => {
  propStore.resetFilters()
  Object.assign(local, propStore.filterOptions)
}
</script>
