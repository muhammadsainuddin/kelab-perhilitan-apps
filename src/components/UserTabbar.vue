<template>
  <div class="fixed bottom-0 left-0 w-full bg-[#08151D] rounded-t-[30px] px-8 py-4 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.15)] z-50 pb-safe">
    <div class="w-full max-w-lg mx-auto flex justify-between items-center">
      
      <router-link to="/dashboard/utama" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center gap-1 transition-colors w-16" :class="isActive ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
          <svg class="w-6 h-6 transition-all duration-300" :class="{'fill-[#87BCB5]/20 scale-110': isActive}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[9px] font-black tracking-wider">UTAMA</span>
        </button>
      </router-link>

      <router-link to="/dashboard/aktiviti" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center gap-1 transition-colors w-16" :class="isActive ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
          <svg class="w-6 h-6 transition-all duration-300" :class="{'fill-[#87BCB5]/20 scale-110': isActive}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span class="text-[9px] font-black tracking-wider">AKTIVITI</span>
        </button>
      </router-link>

      <router-link to="/dashboard/bantuan" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center gap-1 transition-colors w-16" :class="isActive ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
          <svg class="w-6 h-6 transition-all duration-300" :class="{'fill-[#87BCB5]/20 scale-110': isActive}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[9px] font-black tracking-wider">BANTUAN</span>
        </button>
      </router-link>

      <router-link to="/dashboard/profil" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center gap-1 transition-colors w-16" :class="isActive ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
          <svg class="w-6 h-6 transition-all duration-300" :class="{'fill-[#87BCB5]/20 scale-110': isActive}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="text-[9px] font-black tracking-wider">PROFIL</span>
        </button>
      </router-link>

    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
</style>