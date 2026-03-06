<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <div class="card p-8">

        <!-- Logo + Heading -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home :size="24" class="text-white" />
          </div>
          <h1 class="text-2xl font-extrabold text-secondary">
            <span v-if="step === 1">Create account</span>
            <span v-else-if="step === 2">Verify identity</span>
            <span v-else-if="step === 3">Verify email</span>
            <span v-else>You're all set!</span>
          </h1>
          <p class="text-brand-muted text-sm mt-1">
            <span v-if="step < 4">Step {{ step }} of 3</span>
            <span v-else>Welcome to BRG Prime</span>
          </p>
          <div v-if="step < 4" class="mt-3 bg-brand-border rounded-full h-1 max-w-[200px] mx-auto overflow-hidden">
            <div
              class="h-1 primary-gradient rounded-full transition-all duration-500"
              :style="`width: ${(step / 3) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Step 1: Account Details -->
        <div v-if="step === 1">
          <form @submit.prevent="handleStep1" class="space-y-3">
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1">First Name</label>
                <input v-model="form.firstName" class="input-field" placeholder="Tunde" required />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-semibold text-secondary mb-1">Last Name</label>
                <input v-model="form.lastName" class="input-field" placeholder="Adeyemi" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.email" type="email" class="input-field pl-8" placeholder="you@example.com" autocomplete="email" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Phone Number</label>
              <div class="flex gap-2">
                <span class="input-field w-16 text-center text-sm font-medium bg-brand-bg flex items-center justify-center">+234</span>
                <input v-model="form.phone" class="input-field flex-1" placeholder="8012345678" maxlength="10" required />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Password</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pl-8 pr-9" placeholder="Min 8 characters" autocomplete="new-password" required minlength="8" />
                <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                  <component :is="showPw ? EyeOff : Eye" :size="14" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Confirm Password</label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input v-model="form.confirmPassword" :type="showPw ? 'text' : 'password'" class="input-field pl-8" placeholder="Repeat password" autocomplete="new-password" required />
              </div>
            </div>

            <label class="flex items-start gap-2 cursor-pointer pt-1">
              <input type="checkbox" v-model="form.agreed" class="mt-0.5 accent-primary" required />
              <span class="text-xs text-brand-muted leading-relaxed">
                I agree to the
                <router-link to="/generic/Terms%20%26%20Conditions" class="text-primary hover:underline">Terms & Conditions</router-link>
                and
                <router-link to="/generic/Privacy%20Policy" class="text-primary hover:underline">Privacy Policy</router-link>
              </span>
            </label>

            <p v-if="formError" class="text-danger text-xs bg-danger/10 border border-danger/20 px-3 py-2 rounded-md">{{ formError }}</p>

            <button type="submit" class="btn-primary w-full py-3 text-sm font-bold">Create Account</button>

            <div class="flex items-center gap-3 my-1">
              <div class="flex-1 h-px bg-brand-border"></div>
              <span class="text-brand-light text-xs">or sign up with</span>
              <div class="flex-1 h-px bg-brand-border"></div>
            </div>
            <div class="flex gap-3">
              <button type="button" class="btn-secondary flex-1 py-2.5 text-xs gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-4 h-4" /> Google
              </button>
              <button type="button" class="btn-secondary flex-1 py-2.5 text-xs gap-2">
                <img src="https://www.svgrepo.com/show/448234/facebook.svg" class="w-4 h-4" /> Facebook
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Identity Verification -->
        <div v-else-if="step === 2">
          <form @submit.prevent="handleStep2" class="space-y-4">

            <div class="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex gap-3 items-start">
              <ShieldCheck :size="16" class="text-primary mt-0.5 flex-shrink-0" />
              <p class="text-xs text-brand-muted leading-relaxed">
                To keep BRG Prime safe and trustworthy, we require a valid government-issued ID.
                Your information is encrypted and never shared publicly.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">ID Type</label>
              <select v-model="idForm.type" class="input-field" required>
                <option value="" disabled>Select ID type</option>
                <option value="nin">NIN — National Identification Number</option>
                <option value="bvn">BVN — Bank Verification Number</option>
                <option value="passport">International Passport</option>
                <option value="drivers">Driver's Licence</option>
                <option value="voters">Voter's Card</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">
                {{ idLabels[idForm.type] || 'ID Number' }}
              </label>
              <div class="relative">
                <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" :size="14" />
                <input
                  v-model="idForm.number"
                  class="input-field pl-8"
                  :placeholder="idPlaceholders[idForm.type] || 'Enter your ID number'"
                  :maxlength="idForm.type === 'nin' || idForm.type === 'bvn' ? 11 : 20"
                  inputmode="numeric"
                  required
                />
              </div>
              <p v-if="idForm.type === 'nin'" class="text-[11px] text-brand-light mt-1">11-digit number on your NIN slip or NIMC card</p>
              <p v-else-if="idForm.type === 'bvn'" class="text-[11px] text-brand-light mt-1">Dial *565*0# on your registered line to retrieve your BVN</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1">Upload ID Document <span class="text-brand-light font-normal">(optional)</span></label>
              <label class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-border rounded-lg py-5 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Upload :size="20" class="text-brand-light" />
                <span class="text-xs text-brand-muted">Click to upload front of ID</span>
                <span class="text-[11px] text-brand-light">JPG, PNG or PDF · max 5MB</span>
                <input type="file" accept="image/*,.pdf" class="hidden" @change="handleFileUpload" />
              </label>
              <p v-if="idForm.fileName" class="text-xs text-success mt-1.5 flex items-center gap-1">
                <CheckCircle2 :size="12" /> {{ idForm.fileName }}
              </p>
            </div>

            <p v-if="idError" class="text-danger text-xs bg-danger/10 border border-danger/20 px-3 py-2 rounded-md">{{ idError }}</p>

            <button type="submit" class="btn-primary w-full py-3 text-sm font-bold">Continue</button>
          </form>
        </div>

        <!-- Step 3: OTP -->
        <div v-else-if="step === 3" class="text-center">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck :size="26" class="text-primary" />
          </div>
          <p class="text-sm text-brand-muted mb-6">
            Enter the 6-digit code sent to <strong class="text-secondary">{{ form.email }}</strong>
          </p>
          <div class="flex gap-2 justify-center mb-6">
            <input
              v-for="(_, i) in otp" :key="i"
              :ref="el => otpInputs[i] = el"
              v-model="otp[i]"
              @input="handleOtpInput(i)"
              @keydown.backspace="handleOtpBack(i)"
              type="text" inputmode="numeric" maxlength="1"
              class="w-11 h-12 text-center text-lg font-bold border-2 rounded-md outline-none transition-all duration-150"
              :class="otp[i] ? 'border-primary bg-primary/5 text-primary' : 'border-brand-border text-secondary focus:border-primary'"
            />
          </div>
          <p class="text-brand-muted text-xs mb-4">
            Didn't get it? <button @click="resendOtp" class="text-primary font-semibold hover:underline">Resend code</button>
          </p>
          <button @click="verifyOtp" class="btn-primary w-full py-3 text-sm font-bold">Verify & Continue</button>
        </div>

        <!-- Step 4: Success -->
        <div v-else class="text-center py-4">
          <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 :size="36" class="text-success" />
          </div>
          <h3 class="text-xl font-extrabold text-secondary mb-1">Account created!</h3>
          <p class="text-brand-muted text-sm mb-1">Welcome to BRG Prime, {{ form.firstName }}!</p>
          <p class="text-brand-light text-xs">Redirecting to dashboard...</p>
          <div class="mt-4 h-1 bg-brand-border rounded-full overflow-hidden max-w-[120px] mx-auto">
            <div class="h-1 bg-success rounded-full animate-pulse w-full"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6 text-sm text-brand-muted">
          <span v-if="step === 1">Already have an account? <router-link to="/login" class="text-primary font-semibold hover:underline">Sign In</router-link></span>
          <button v-else-if="step === 2 || step === 3" @click="step--" class="text-brand-muted hover:text-secondary font-medium transition-colors">← Go back</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Home, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, CreditCard, Upload } from 'lucide-vue-next'

const router    = useRouter()
const userStore = useUserStore()

const step      = ref(1)
const showPw    = ref(false)
const formError = ref('')
const idError   = ref('')
const otp       = ref(['', '', '', '', '', ''])
const otpInputs = ref([])

const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', agreed: false,
})

const idForm = reactive({ type: '', number: '', fileName: '' })

const idLabels = {
  nin:      'NIN (National Identification Number)',
  bvn:      'BVN (Bank Verification Number)',
  passport: 'Passport Number',
  drivers:  'Licence Number',
  voters:   'Voter\'s Card Number',
}

const idPlaceholders = {
  nin:      '12345678901',
  bvn:      '12345678901',
  passport: 'A12345678',
  drivers:  'ABC123456789',
  voters:   'Enter voter\'s card number',
}

const handleStep1 = () => {
  formError.value = ''
  if (form.password !== form.confirmPassword) { formError.value = 'Passwords do not match.'; return }
  if (form.password.length < 8) { formError.value = 'Password must be at least 8 characters.'; return }
  step.value = 2
}

const handleStep2 = () => {
  idError.value = ''
  if (!idForm.type) { idError.value = 'Please select an ID type.'; return }
  if (!idForm.number.trim()) { idError.value = 'Please enter your ID number.'; return }
  if ((idForm.type === 'nin' || idForm.type === 'bvn') && idForm.number.length !== 11) {
    idError.value = `${idForm.type.toUpperCase()} must be exactly 11 digits.`; return
  }
  step.value = 3
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) idForm.fileName = file.name
}

const handleOtpInput = (i) => {
  if (otp.value[i] && i < 5) otpInputs.value[i + 1]?.focus()
  if (otp.value.every(v => v)) verifyOtp()
}

const handleOtpBack = (i) => {
  if (!otp.value[i] && i > 0) otpInputs.value[i - 1]?.focus()
}

const resendOtp = () => {
  otp.value = ['', '', '', '', '', '']
  otpInputs.value[0]?.focus()
}

const verifyOtp = async () => {
  step.value = 4
  userStore.login({
    name:  `${form.firstName} ${form.lastName}`,
    email: form.email,
    phone: `0${form.phone}`,
    token: 'mock_token_' + Date.now(),
  })
  await new Promise(r => setTimeout(r, 2000))
  router.push('/dashboard')
}
</script>
