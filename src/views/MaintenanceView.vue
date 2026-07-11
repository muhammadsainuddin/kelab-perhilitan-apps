<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center px-6"
    style="background: #081C15; z-index: 9998;">

    <!-- Latar belakang -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 right-0 h-0.5"
        style="background: linear-gradient(90deg, transparent, #52B788 30%, #D4AF37 50%, #52B788 70%, transparent);"></div>
      <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10"
        style="background: radial-gradient(circle, #52B788, transparent 70%);"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
        style="background: radial-gradient(circle, #52B788, transparent 70%);"></div>
    </div>

    <!-- Kandungan -->
    <div class="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

      <!-- Ikon animasi -->
      <div class="mb-8 relative">
        <div class="w-24 h-24 rounded-3xl flex items-center justify-center"
          style="background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.2);">
          <svg class="w-12 h-12" style="color: #52B788;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>
          </svg>
        </div>
        <!-- Gelang animasi -->
        <div class="absolute inset-0 rounded-3xl animate-ping opacity-20"
          style="background: rgba(82,183,136,0.3);"></div>
      </div>

      <!-- Teks -->
      <p class="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style="color: #52B788;">
        Kelab PERHILITAN
      </p>
      <h1 class="text-2xl font-black text-white mb-3 leading-tight">
        Sistem Dalam<br>Penyelenggaraan
      </h1>
      <p class="text-sm font-medium leading-relaxed mb-8" style="color: rgba(149,213,178,0.6);">
        Sistem sedang dikemaskini untuk meningkatkan pengalaman anda.
        Sila cuba semula sebentar lagi.
      </p>

      <!-- Loading dots -->
      <div class="flex gap-2 mb-10">
        <span v-for="i in 3" :key="i"
          class="w-2 h-2 rounded-full"
          style="background: #52B788;"
          :style="{ animationDelay: `${(i-1) * 0.2}s` }"
          :class="'animate-bounce'"></span>
      </div>

      <!-- Garis bawah -->
      <div class="w-16 h-0.5 rounded-full" style="background: rgba(82,183,136,0.3);"></div>
      <p class="text-[9px] font-medium mt-3" style="color: rgba(149,213,178,0.3);">
        Hubungi urusetia sekiranya masalah berterusan
      </p>

      <!-- Link tersembunyi untuk admin -->
      <button @click="$router.push('/login')"
        class="mt-8 text-[9px] font-medium transition-opacity opacity-20 hover:opacity-60"
        style="color: rgba(149,213,178,0.8);">
        Log masuk pentadbir
      </button>
    </div>
  </div>
</template>
