<template>
  <div class="min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col font-sans">
    <div class="p-6 flex items-center justify-between bg-[#08151D] flex-shrink-0">
      <h1 class="text-xl text-[#87BCB5] font-hago uppercase">Terma & Syarat</h1>
      <button @click="router.back()" class="text-[#D0D7D7] hover:text-[#87BCB5]">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    
    <div class="flex-1 p-8 overflow-y-auto text-xs text-[#08151D] leading-relaxed space-y-5">
      <div>
        <h3 class="font-bold text-sm mb-1">1. Pendahuluan</h3>
        <p class="text-[#567778]">Selamat datang ke aplikasi HAGO Kelab Perhilitan. Dengan menggunakan aplikasi ini, anda bersetuju untuk terikat dengan syarat-syarat yang ditetapkan di sini.</p>
      </div>
      <div>
        <h3 class="font-bold text-sm mb-1">2. Keahlian</h3>
        <p class="text-[#567778]">Keahlian adalah terbuka kepada semua kakitangan PERHILITAN yang berdaftar secara sah mengikut perlembagaan kelab. Segala maklumat yang diberikan haruslah tepat.</p>
      </div>
      <div>
        <h3 class="font-bold text-sm mb-1">3. Polisi Privasi Data</h3>
        <p class="text-[#567778]">Kami komited untuk melindungi data peribadi anda. Segala maklumat yang dikumpul hanya digunakan untuk tujuan pengurusan kebajikan dan sukan ahli kelab sahaja. Data anda tidak akan dikongsi dengan pihak ketiga tanpa kebenaran bertulis daripada pihak pengurusan kelab atau kecuali dikehendaki oleh undang-undang.</p>
      </div>
      <div class="h-10"></div>
    </div>

    <div class="p-6 bg-[#D0D7D7] border-t border-[#08151D]/10 flex-shrink-0">
      <button @click="router.back()" class="w-full bg-[#08151D] hover:bg-[#0E303D] text-[#87BCB5] font-bold py-3.5 rounded-xl transition-colors">Saya Faham</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #08151D; border-radius: 10px; }
</style>