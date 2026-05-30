<template>
  <div class="min-h-screen bg-[#D0D7D7] font-sans selection:bg-[#87BCB5] selection:text-[#08151D] flex flex-col h-screen overflow-hidden">

    <!-- HEADER -->
    <header
      class="bg-[#08151D] flex-shrink-0 z-40 absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out border-b border-[#567778]/20"
      :class="showHeader ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="max-w-lg mx-auto px-6 pt-5 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0 p-1.5">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div class="flex-1 min-w-0">
            <h1 class="text-base text-[#87BCB5] font-black uppercase tracking-[0.15em] leading-none truncate">
              Kelab PERHILITAN
            </h1>
            <p class="text-[#567778] text-[9px] font-bold uppercase tracking-[0.22em] mt-1.5">
              Sukan &amp; Kebajikan Kakitangan
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- KANDUNGAN -->
    <main
      class="flex-1 overflow-y-auto px-5 pt-28 pb-32 custom-scrollbar relative z-10 w-full max-w-lg mx-auto"
      @scroll="handleScroll"
    >
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- TAB BAR -->
    <UserTabbar />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserTabbar from '../../components/UserTabbar.vue';

const showHeader = ref(true);
let lastScrollY = 0;

const handleScroll = (event) => {
  const currentScrollY = event.target.scrollTop;
  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    showHeader.value = false;
  } else {
    showHeader.value = true;
  }
  lastScrollY = currentScrollY;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.font-sans { font-family: 'Inter', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 0px; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Transisi antara halaman */
.page-enter-active, .page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>