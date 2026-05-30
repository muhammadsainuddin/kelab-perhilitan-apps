<template>
  <div :class="[
    'rounded-2xl border p-5 flex flex-col gap-3',
    highlight
      ? 'bg-[#0F4C3A]/30 border-[#0F4C3A]/50'
      : 'bg-[#08151D] border-white/5'
  ]">
    <div class="flex items-center justify-between">
      <p class="text-[#567778] text-xs font-medium uppercase tracking-wider">{{ title }}</p>
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', iconBg]">
        <!-- Arrow Up (Masuk) -->
        <svg v-if="icon === 'arrow-up'" class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
        <!-- Arrow Down (Keluar) -->
        <svg v-else-if="icon === 'arrow-down'" class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 7L7 17M7 17h10M7 17V7"/>
        </svg>
        <!-- Wallet (Baki) -->
        <svg v-else class="w-4 h-4 text-[#FBBF24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h.01M11 15h2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>
        </svg>
      </div>
    </div>

    <p :class="['text-2xl font-bold tabular-nums', valueColor]">{{ value }}</p>

    <div class="flex items-center justify-between">
      <p class="text-[#567778] text-xs">{{ subtitle }}</p>
      <span v-if="trend" class="text-xs text-green-400 font-medium">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title:     { type: String, required: true },
  value:     { type: String, required: true },
  subtitle:  { type: String, default: '' },
  icon:      { type: String, default: 'wallet' },
  color:     { type: String, default: 'green' },  // green | red | amber
  trend:     { type: String, default: null },
  highlight: { type: Boolean, default: false },
});

const iconBg = computed(() => ({
  green: 'bg-green-500/15',
  red:   'bg-red-500/15',
  amber: 'bg-amber-500/15',
}[props.color]));

const valueColor = computed(() => ({
  green: 'text-green-400',
  red:   'text-red-400',
  amber: 'text-[#FBBF24]',
}[props.color]));
</script>
