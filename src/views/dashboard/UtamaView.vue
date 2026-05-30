<template>
  <div class="space-y-6 animate-fade-in pb-10">
    
    <div class="px-1 flex justify-between items-end">
      <div>
        <p class="text-[10px] uppercase tracking-[0.2em] text-[#567778] font-bold">Selamat Datang</p>
        <h2 class="text-xl font-bold text-[#08151D] mt-0.5">
          Hai, <span class="text-[#0E303D]">{{ firstName }}</span>
        </h2>
      </div>
      <button v-if="!isAhliAktif" @click="$router.push('/dashboard/yuran')" class="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform">
        <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        <span class="text-[9px] font-black uppercase tracking-widest">Yuran Tertunggak</span>
      </button>
    </div>

    <div class="relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl border border-[#567778]/20 bg-gradient-to-br from-[#08151D] via-[#0E303D] to-[#143d4e] min-h-[180px] flex flex-col justify-between">
      <img src="/logo.png" class="absolute -bottom-10 -right-10 w-56 opacity-[0.05] grayscale invert pointer-events-none rotate-12" />
      <div class="relative z-10 flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md">
            <img src="/logo.png" alt="logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <p class="text-[8px] uppercase tracking-[0.25em] text-[#87BCB5] font-black">Digital Membership</p>
            <h3 class="text-sm font-black mt-0.5 text-[#D0D7D7]">Kelab PERHILITAN</h3>
          </div>
        </div>
      </div>
      <div class="relative z-10 mt-8 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black shadow-inner shrink-0">
          <img v-if="profil.gambar" :src="`http://localhost:5001/uploads/images/${profil.gambar}`" class="w-full h-full object-cover" />
          <span v-else class="text-[#87BCB5]">{{ profil.nama_penuh?.charAt(0) || '?' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-base font-black leading-tight truncate tracking-tight text-[#D0D7D7]">
            {{ profil.nama_penuh || 'Memuatkan...' }}
          </h2>
          <div class="mt-1 flex items-center gap-2">
            <p class="text-[10px] font-mono font-bold text-[#87BCB5] bg-[#08151D]/50 px-2 py-0.5 rounded-md border border-white/10">ID: {{ profil.no_ahli || 'PENDING' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-[11px] font-black text-[#567778] uppercase tracking-widest px-1 mb-3">Menu Pantas</h3>
      <div class="grid grid-cols-4 gap-4 bg-white p-5 rounded-[32px] shadow-sm border border-gray-200/60">
        
        <button @click="$router.push('/dashboard/yuran')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:bg-amber-100 transition-colors relative">
            <div v-if="!isAhliAktif" class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-bounce"></div>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight">Yuran<br>Kelab</span>
        </button>

        <button @click="$router.push('/dashboard/kedai')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight">Kedai<br>Merch</span>
        </button>

        <button class="flex flex-col items-center gap-2 group active:scale-95 transition-all opacity-60">
          <div class="w-14 h-14 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight">Perle<br>mbagaan</span>
        </button>
        
        <button class="flex flex-col items-center gap-2 group active:scale-95 transition-all opacity-50">
          <div class="w-14 h-14 rounded-[18px] bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 transition-colors">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight">Lain<br>Lain</span>
        </button>

      </div>
    </div>

    <div class="bg-[#08151D] text-white p-6 rounded-[32px] shadow-lg flex items-center justify-between border border-[#567778]/30 mt-4">
       <div>
         <h3 class="text-sm font-black uppercase tracking-widest text-[#87BCB5]">Kejohanan Sukan</h3>
         <p class="text-[10px] text-[#567778] font-medium mt-1 w-4/5">Sertai aktiviti kelab, semak tab Aktiviti untuk jadual penuh.</p>
       </div>
       <button @click="$router.push('/dashboard/aktiviti')" class="w-12 h-12 rounded-full bg-[#0E303D] flex items-center justify-center text-[#87BCB5] shrink-0 border border-[#87BCB5]/20 hover:bg-[#87BCB5] hover:text-[#08151D] transition-colors">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
       </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const profil = ref({});

const isAhliAktif = computed(() => {
  return profil.value.is_paid || profil.value.pilihan_potongan === 'Potongan Gaji / Jabatan';
});

const firstName = computed(() => {
  if (!profil.value.nama_penuh) return 'Ahli';
  return profil.value.nama_penuh.split(' ')[0];
});

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Petang' : 'Selamat Malam';
};

const fetchProfil = async () => {
  try {
    // FIX: URL ditukar dari /ahli/profil kepada /user/profil
    const res = await api.get('/user/profil'); 
    profil.value = res.data.data;
  } catch (e) { 
    console.error(e); 
  }
};

onMounted(() => {
  fetchProfil();
});
</script>