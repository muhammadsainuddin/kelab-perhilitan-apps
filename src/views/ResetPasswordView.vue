<template>
  <div class="min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col font-sans">
    <div class="relative bg-[#08151D] pt-12 pb-24 px-8 curve-bottom shadow-xl">
      <h1 class="text-3xl text-[#87BCB5] font-hago tracking-wider mb-2">RESET KATA LALUAN</h1>
      <p class="text-[#D0D7D7] text-xs">Cipta kata laluan baru yang lebih kukuh.</p>
    </div>
    
    <div class="px-8 -mt-10 relative z-20 space-y-6">
      <div class="bg-[#0E303D] p-6 rounded-[30px] shadow-2xl space-y-4">
        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">K. Laluan Baru</label>
          <input type="password" class="w-full bg-[#08151D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">Sahkan Baru</label>
          <input type="password" class="w-full bg-[#08151D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" />
        </div>
        <button @click="router.push('/login')" class="w-full bg-[#87BCB5] hover:bg-[#6CA39C] text-[#08151D] font-bold py-3.5 rounded-xl shadow-lg transition-colors">Kemaskini Kata Laluan</button>
      </div>
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
.curve-bottom { border-bottom-left-radius: 50px; border-bottom-right-radius: 50px; }
</style>