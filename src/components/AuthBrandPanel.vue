<template>
  <!-- Panel jenama kiri untuk paparan desktop halaman auth -->
  <div class="w-1/2 bg-gradient-to-br from-[#0F4C3A] to-[#08151D] flex flex-col justify-between p-12 relative overflow-hidden">

    <div class="absolute inset-0 pointer-events-none opacity-[0.05]">
      <div class="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full border-[60px] border-white"/>
      <div class="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full border-[50px] border-white"/>
      <div class="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full border-[30px] border-white"/>
    </div>

    <div class="relative z-10">
      <div class="flex items-center gap-4 mb-12">
        <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
          <img src="/logo.png" alt="Logo Kelab PERHILITAN" class="w-full h-full object-contain" />
        </div>
        <span class="text-white font-hago text-2xl tracking-wide mt-1">Kelab<br>PERHILITAN</span>
      </div>
    </div>

    <div class="relative z-10 flex-1 flex flex-col justify-center">
      <p class="text-[#FBBF24] text-xs font-bold uppercase tracking-[0.2em] mb-4">{{ eyebrow }}</p>
      <h2 class="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
        <slot name="heading">
          Sistem<br>
          <span class="text-[#87BCB5]">Pengurusan</span><br>
          Bersepadu Ahli
        </slot>
      </h2>
      <p class="text-[#D0D7D7] text-sm leading-relaxed max-w-sm">{{ description }}</p>
    </div>

    <div class="relative z-10 space-y-3">
      <div v-for="ciri in ciriSistem" :key="ciri" class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
          <svg class="w-3.5 h-3.5 text-[#87BCB5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="text-white/80 text-xs font-medium">{{ ciri }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  eyebrow:     { type: String, default: 'Portal Rasmi' },
  description: { type: String, default: 'Akses penuh kepada yuran, bantuan kebajikan, aktiviti sukan, dan kedai kelab dalam satu platform berpusat yang moden.' },
  ciriSistem:  { type: Array,  default: () => [
    'Bayaran yuran pantas melalui FPX',
    'Permohonan bantuan kebajikan ahli',
    'Pendaftaran sukan & aktiviti kelab',
    'Pembelian barangan kedai eksklusif',
  ] },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
.font-hago { font-family: 'Righteous', cursive; }
</style>
