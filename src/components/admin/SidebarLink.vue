<template>
  <router-link
    :to="to"
    custom
    v-slot="{ isActive, navigate }"
  >
    <button
      @click="navigate"
      :title="collapsed ? label : ''"
      :class="[
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all group',
        isActive
          ? 'bg-[#0F4C3A] text-white'
          : 'text-[#567778] hover:bg-white/5 hover:text-[#D0D7D7]'
      ]"
    >
      <!-- Icon -->
      <span class="w-5 h-5 shrink-0 flex items-center justify-center">
        <component :is="iconMap[icon]" :active="isActive" />
      </span>

      <!-- Label -->
      <Transition name="fade-text">
        <span v-if="!collapsed" class="text-sm font-medium whitespace-nowrap flex-1 text-left">{{ label }}</span>
      </Transition>

      <!-- Badge -->
      <Transition name="fade-text">
        <span v-if="!collapsed && badge"
          class="ml-auto bg-[#FBBF24] text-[#08151D] text-[10px] font-bold px-1.5 rounded-full">
          {{ badge }}
        </span>
      </Transition>

      <!-- Active indicator -->
      <span v-if="isActive && !collapsed" class="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shrink-0"></span>
    </button>
  </router-link>
</template>

<script setup>
import { defineProps, h } from 'vue';

defineProps({
  to:        { type: String, required: true },
  icon:      { type: String, required: true },
  label:     { type: String, required: true },
  collapsed: { type: Boolean, default: false },
  badge:     { type: [String, Number], default: null },
});

// Inline SVG icons (kecil, tidak perlu install library)
const iconMap = {
  home: defineComponent({
    setup: (props) => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'})]
    ),
  }),
  users: defineComponent({
    setup: () => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'})]
    ),
  }),
  chart: defineComponent({
    setup: () => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'})]
    ),
  }),
  shop: defineComponent({
    setup: () => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'})]
    ),
  }),
  heart: defineComponent({
    setup: () => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'})]
    ),
  }),
  calendar: defineComponent({
    setup: () => () => h('svg', { fill:'none', viewBox:'0 0 24 24', stroke:'currentColor', class:'w-5 h-5' },
      [h('path', { 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'1.8',
        d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'})]
    ),
  }),
};

// Needed for h() inside setup
import { defineComponent } from 'vue';
</script>

<style scoped>
.fade-text-enter-active, .fade-text-leave-active { transition: opacity 0.15s; }
.fade-text-enter-from, .fade-text-leave-to { opacity: 0; }
</style>
