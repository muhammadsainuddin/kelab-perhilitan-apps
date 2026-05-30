<template>
  <div class="min-h-screen bg-[#D0D7D7] font-sans selection:bg-[#87BCB5] selection:text-[#08151D] flex flex-col h-screen overflow-hidden">
    
    <div 
      class="bg-[#08151D] pt-10 pb-4 px-6 rounded-b-[24px] shadow-md flex-shrink-0 z-50 absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out border-b border-[#567778]/30"
      :class="showHeader ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="flex items-center gap-3 max-w-lg mx-auto">
        <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner shrink-0 p-1.5">
          <img src="/logo.png" alt="Logo" class="w-full h-full object-contain drop-shadow-sm" />
        </div>
        
        <div class="flex-1">
          <h1 class="text-lg text-[#87BCB5] font-black uppercase tracking-widest leading-none">
            Kelab PERHILITAN
          </h1>
          <p class="text-[#567778] text-[9px] font-bold uppercase tracking-[0.2em] mt-1">
            Sukan & Kebajikan Kakitangan
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-6 pt-24 pb-28 custom-scrollbar relative z-10 w-full max-w-lg mx-auto" @scroll="handleScroll">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <UserTabbar />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserTabbar from '../../components/UserTabbar.vue'; // Pastikan path ini betul mengikut folder anda

const showHeader = ref(true);
let lastScrollY = 0;

const handleScroll = (event) => {
  const currentScrollY = event.target.scrollTop;
  // Sembunyi header bila scroll turun, muncul bila scroll atas
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    showHeader.value = false;
  } else {
    showHeader.value = true;
  }
  lastScrollY = currentScrollY;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
/* Kita boleh abaikan font Righteous/Hago memandangkan nama rasmi sudah digunakan */

.font-sans { 
  font-family: 'Inter', sans-serif; 
}

.custom-scrollbar::-webkit-scrollbar { width: 0px; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Transisi antara halaman Tab */
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }
</style>