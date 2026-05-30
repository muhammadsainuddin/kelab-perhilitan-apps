<template>
  <div class="space-y-6 pb-4">

    <!-- Sapaan -->
    <div class="reveal px-1 flex justify-between items-end" style="--d: 0ms">
      <div>
        <p class="text-[10px] uppercase tracking-[0.22em] text-[#567778] font-black">Selamat Datang</p>
        <h2 class="text-xl font-black text-[#08151D] mt-1">
          Hai, <span class="text-[#0E303D]">{{ firstName }}</span>
        </h2>
      </div>
      <button v-if="!isAhliAktif" @click="$router.push('/dashboard/yuran')"
              class="bg-[#FEF3C7] text-[#92660C] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform border border-[#FBBF24]/40">
        <span class="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
        <span class="text-[9px] font-black uppercase tracking-widest">Yuran Tertunggak</span>
      </button>
    </div>

    <!-- Kad Keahlian Digital -->
    <div class="reveal relative overflow-hidden rounded-[32px] p-6 text-white shadow-[0_12px_32px_rgba(8,21,29,0.18)] border border-[#567778]/20 bg-gradient-to-br from-[#08151D] via-[#0E303D] to-[#143d4e] min-h-[185px] flex flex-col justify-between" style="--d: 80ms">
      <img src="/logo.png" class="absolute -bottom-12 -right-12 w-60 opacity-[0.04] grayscale invert pointer-events-none rotate-12" />

      <!-- Garisan aksen amber halus -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FBBF24]/40 to-transparent"></div>

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
        <span class="text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border"
              :class="isAhliAktif
                ? 'bg-[#87BCB5]/15 text-[#87BCB5] border-[#87BCB5]/30'
                : 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30'">
          {{ isAhliAktif ? '● Aktif' : '● Tertunggak' }}
        </span>
      </div>

      <div class="relative z-10 mt-8 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black shadow-inner shrink-0">
          <img v-if="profil.gambar" :src="`http://localhost:5001/uploads/images/${profil.gambar}`" class="w-full h-full object-cover" />
          <span v-else class="text-[#87BCB5]">{{ profil.nama_penuh?.charAt(0) || '?' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-base font-black leading-tight truncate tracking-tight text-[#D0D7D7]">
            {{ profil.nama_penuh || 'Memuatkan...' }}
          </h2>
          <div class="mt-1.5 flex items-center gap-2">
            <p class="text-[10px] font-mono font-bold text-[#87BCB5] bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
              ID: {{ profil.no_ahli || 'PENDING' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Pantas -->
    <div class="reveal" style="--d: 160ms">
      <h3 class="text-[11px] font-black text-[#567778] uppercase tracking-widest px-1 mb-3">Menu Pantas</h3>
      <div class="grid grid-cols-4 gap-3 bg-white p-5 rounded-[28px] shadow-[0_4px_16px_rgba(8,21,29,0.06)] border border-[#E2E8E8]">

        <button @click="$router.push('/dashboard/yuran')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-[#FEF3C7] text-[#92660C] flex items-center justify-center border border-[#FBBF24]/30 group-hover:bg-[#FBBF24]/20 transition-colors relative">
            <span v-if="!isAhliAktif" class="absolute -top-1 -right-1 w-4 h-4 bg-[#E24B4A] rounded-full border-2 border-white animate-bounce"></span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight leading-tight">Yuran<br>Kelab</span>
        </button>

        <button @click="$router.push('/dashboard/kedai')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-[#87BCB5]/15 text-[#0E303D] flex items-center justify-center border border-[#87BCB5]/30 group-hover:bg-[#87BCB5]/25 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight leading-tight">Kedai<br>Merch</span>
        </button>

        <button @click="$router.push('/dashboard/aktiviti')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-[#0E303D]/10 text-[#0E303D] flex items-center justify-center border border-[#0E303D]/15 group-hover:bg-[#0E303D]/15 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight leading-tight">Sukan<br>Aktiviti</span>
        </button>

        <button @click="$router.push('/dashboard/profil')" class="flex flex-col items-center gap-2 group active:scale-95 transition-all">
          <div class="w-14 h-14 rounded-[18px] bg-[#567778]/12 text-[#567778] flex items-center justify-center border border-[#567778]/20 group-hover:bg-[#567778]/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <span class="text-[9px] font-black text-[#08151D] text-center uppercase tracking-tight leading-tight">Profil<br>Saya</span>
        </button>

      </div>
    </div>

    <!-- Banner Amaran Yuran (amber) -->
    <div v-if="!isAhliAktif" class="reveal bg-[#FEF3C7] border border-[#FBBF24]/40 rounded-[24px] p-4 flex items-start gap-3" style="--d: 240ms">
      <div class="w-9 h-9 rounded-xl bg-[#FBBF24]/25 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-[#92660C]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <div class="flex-1">
        <p class="text-xs font-black text-[#92660C] uppercase tracking-wide">Yuran Tahunan Belum Dijelaskan</p>
        <p class="text-[10px] text-[#92660C]/80 mt-0.5 leading-relaxed">Akses modul Bantuan Kebajikan dan pendaftaran Aktiviti disekat sehingga yuran diselesaikan.</p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-2 text-[10px] font-black text-[#92660C] underline underline-offset-2">
          Bayar Sekarang →
        </button>
      </div>
    </div>

    <!-- Banner Kejohanan Sukan -->
    <div class="reveal bg-[#08151D] text-white p-6 rounded-[28px] shadow-[0_8px_24px_rgba(8,21,29,0.15)] flex items-center justify-between border border-[#567778]/20" style="--d: 320ms">
      <div>
        <h3 class="text-sm font-black uppercase tracking-widest text-[#87BCB5]">Kejohanan Sukan</h3>
        <p class="text-[10px] text-[#567778] font-medium mt-1.5 w-4/5 leading-relaxed">Sertai aktiviti kelab, semak tab Aktiviti untuk jadual penuh.</p>
      </div>
      <button @click="$router.push('/dashboard/aktiviti')" class="w-12 h-12 rounded-full bg-[#0E303D] flex items-center justify-center text-[#87BCB5] shrink-0 border border-[#87BCB5]/20 hover:bg-[#87BCB5] hover:text-[#08151D] transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
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

// Status berbayar — satu sumber kebenaran dari backend
const isAhliAktif = computed(() => !!profil.value.is_paid);

const firstName = computed(() => {
  if (!profil.value.nama_penuh) return 'Ahli';
  return profil.value.nama_penuh.split(' ')[0];
});

const fetchProfil = async () => {
  try {
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

<style scoped>
/* Animasi pemuatan berperingkat (staggered reveal) */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  animation: revealUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes revealUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>