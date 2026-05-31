<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#87BCB5] selection:text-[#08151D] flex flex-col h-screen overflow-hidden">

    <!-- KANDUNGAN -->
    <main class="flex-1 overflow-y-auto px-5 pt-6 pb-32 custom-scrollbar relative z-10 w-full max-w-lg mx-auto">
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
import UserTabbar from '../../components/UserTabbar.vue';
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