<template>
  <div class="min-h-screen bg-brand-bg">
    <!-- Sidebar -->
    <NavSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-secondary/60 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <TopNav @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavSidebar from './NavSidebar.vue'
import TopNav from './TopNav.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
