<template>
  <aside class="hidden md:flex md:w-[44%] xl:w-[42%] shrink-0 flex-col justify-between
                p-12 xl:p-16 relative overflow-hidden"
    style="background: linear-gradient(148deg, #071812 0%, #0D3526 52%, #1A4130 100%);">

    <!-- Dot grid -->
    <div class="absolute inset-0 pointer-events-none"
      style="background-image: radial-gradient(rgba(135,188,181,0.08) 1px, transparent 1px); background-size: 26px 26px;"></div>
    <!-- Glow top-right -->
    <div class="absolute -top-28 -right-28 w-[400px] h-[400px] rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(82,183,136,0.14) 0%, transparent 62%);"></div>
    <!-- Glow bottom-left -->
    <div class="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(15,76,58,0.85) 0%, transparent 70%);"></div>
    <!-- Glow center subtle -->
    <div class="absolute top-1/2 right-8 w-48 h-48 -translate-y-1/2 rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(82,183,136,0.05) 0%, transparent 70%);"></div>
    <!-- Gold accent line top -->
    <div class="absolute top-0 left-0 right-0 h-0.5"
      style="background: linear-gradient(90deg, transparent 5%, #52B788 30%, #D4AF37 62%, transparent 95%);"></div>

    <!-- Logo + brand name -->
    <div class="relative z-10 flex items-center gap-4">
      <img src="/logo.png" alt="Logo Kelab PERHILITAN"
        class="w-[52px] h-[52px] rounded-2xl object-contain shrink-0"
        style="box-shadow: 0 4px 24px rgba(0,0,0,0.45);" />
      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.28em]" style="color: #95D5B2;">
          Kelab Sukan &amp; Kebajikan
        </p>
        <span class="font-hago text-white text-[19px] tracking-wide leading-tight">Kelab PERHILITAN</span>
      </div>
    </div>

    <!-- Main copy -->
    <div class="relative z-10">
      <p class="text-[9px] font-black uppercase tracking-[0.3em] mb-5" style="color: #D4AF37;">
        {{ eyebrow }}
      </p>
      <h2 class="font-bold leading-[1.1] mb-5"
        style="color: white; font-size: clamp(36px, 3.5vw, 52px);">
        <slot name="heading">
          Sistem<br>
          <span style="color: #95D5B2;">Pengurusan</span><br>
          Bersepadu
        </slot>
      </h2>
      <p class="text-[13px] leading-[1.75]" style="color: rgba(210,225,218,0.82); max-width: 320px;">
        {{ description }}
      </p>
    </div>

    <!-- Feature list -->
    <div class="relative z-10 space-y-3">
      <div v-for="ciri in ciriSistem" :key="ciri" class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style="background: rgba(82,183,136,0.14); border: 1px solid rgba(82,183,136,0.22);">
          <svg class="w-3.5 h-3.5" style="color: #52B788;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="text-[13px] font-medium" style="color: rgba(255,255,255,0.72);">{{ ciri }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  eyebrow:     { type: String, default: 'Portal Rasmi Ahli' },
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
