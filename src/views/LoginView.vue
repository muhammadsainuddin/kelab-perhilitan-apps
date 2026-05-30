<template>
  <div class="font-sans min-h-screen selection:bg-[#87BCB5] selection:text-[#08151D]">

    <div class="md:hidden min-h-screen bg-[#D0D7D7] relative shadow-2xl flex flex-col">
      <div class="relative bg-[#08151D] pt-12 pb-20 px-8 z-10 curve-bottom shadow-xl">
        <button @click="router.push('/')" class="text-[#567778] mb-6 hover:text-[#87BCB5] transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        
        <div class="flex items-center gap-3 mb-2">
          <img src="/logo.png" alt="Logo Kelab PERHILITAN" class="w-14 h-14 object-contain drop-shadow-sm bg-white rounded-xl p-1" />
          <h1 class="text-2xl text-[#87BCB5] font-hago tracking-wide leading-none mt-1">
            Kelab<br>PERHILITAN
          </h1>
        </div>

        <p class="text-[#D0D7D7] text-sm font-medium mb-6">Sila log masuk akaun anda</p>
        
        <transition name="fade" mode="out-in">
          <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-xs rounded shadow-sm mb-4">
            {{ errorMessage }}
          </div>
          <div v-else-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 text-xs rounded shadow-sm mb-4">
            {{ successMessage }}
          </div>
        </transition>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase ml-1 tracking-widest">E-mel Kakitangan</label>
            <input v-model="email" type="email" placeholder="email@perhilitan.gov.my" required class="w-full bg-[#0E303D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase ml-1 tracking-widest">Kata Laluan</label>
            <input v-model="password" type="password" placeholder="••••••••" required class="w-full bg-[#0E303D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" />
          </div>
          <div class="flex justify-between items-center px-1">
            <label class="flex items-center gap-2 text-[10px] text-[#567778] cursor-pointer">
              <input type="checkbox" class="accent-[#87BCB5]"> Ingat Saya
            </label>
            <button type="button" @click="router.push('/forgot-password')" class="text-[10px] text-[#87BCB5] font-bold hover:underline">Lupa Kata Laluan?</button>
          </div>
          <button type="submit" :disabled="isLoading" class="w-full bg-[#87BCB5] hover:bg-[#6CA39C] transition-colors text-[#08151D] font-bold py-3.5 rounded-xl shadow-lg mt-2 disabled:opacity-70">
            <span v-if="!isLoading">Masuk</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              Log Masuk...
            </span>
          </button>
        </form>
      </div>
      <div class="flex-1 flex flex-col justify-center items-center px-8">
        <p class="text-xs text-[#567778] mb-4">Belum ada akaun?</p>
        <button @click="router.push('/register')" class="w-full border-2 border-[#08151D] text-[#08151D] font-bold py-3 rounded-xl hover:bg-[#08151D] hover:text-[#D0D7D7] transition-all">Daftar Sekarang</button>
      </div>
    </div>

    <div class="hidden md:flex min-h-screen">

      <div class="w-1/2 bg-gradient-to-br from-[#0F4C3A] to-[#08151D] flex flex-col justify-between p-12 relative overflow-hidden">

        <div class="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div class="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full border-[60px] border-white"/>
          <div class="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full border-[50px] border-white"/>
          <div class="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full border-[30px] border-white"/>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-12">
            <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo.png" alt="Logo Kelab PERHILITAN" class="w-full h-full object-contain" />
            </div>
            <span class="text-white font-hago text-2xl tracking-wide mt-1">Kelab<br>PERHILITAN</span>
          </div>
        </div>

        <div class="relative z-10 flex-1 flex flex-col justify-center">
          <p class="text-[#FBBF24] text-xs font-bold uppercase tracking-[0.2em] mb-4">Portal Rasmi</p>
          <h2 class="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Sistem<br>
            <span class="text-[#87BCB5]">Pengurusan</span><br>
            Bersepadu Ahli
          </h2>
          <p class="text-[#D0D7D7] text-sm leading-relaxed max-w-sm">
            Akses penuh kepada yuran, bantuan kebajikan, aktiviti sukan, dan kedai kelab dalam satu platform berpusat yang moden.
          </p>
        </div>

        <div class="relative z-10 space-y-3">
          <div v-for="ciri in ciriSistem" :key="ciri.label" class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <svg class="w-3.5 h-3.5 text-[#87BCB5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-white/80 text-xs font-medium">{{ ciri.label }}</span>
          </div>
        </div>
      </div>

      <div class="w-1/2 bg-white flex items-center justify-center p-12">
        <div class="w-full max-w-md">

          <div class="mb-10">
            <h3 class="text-gray-900 text-3xl font-bold mb-2">Selamat Datang 👋</h3>
            <p class="text-gray-500 text-sm">Masukkan maklumat log masuk anda untuk meneruskan.</p>
          </div>

          <div v-if="sesiTamat"
            class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 mb-6 shadow-sm">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Sesi anda telah tamat. Sila log masuk semula.
          </div>

          <div class="mb-5">
            <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">
              E-mel Kakitangan
            </label>
            <input v-model="email" type="email" placeholder="email@perhilitan.gov.my"
              @keyup.enter="handleLogin"
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
          </div>

          <div class="mb-2">
            <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">
              Kata Laluan
            </label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••" @keyup.enter="handleLogin"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all pr-12"/>
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F4C3A] transition-colors">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex justify-end mb-7">
            <button @click="router.push('/forgot-password')"
              class="text-[11px] font-bold text-gray-500 hover:text-[#0F4C3A] transition-colors">
              Lupa kata laluan?
            </button>
          </div>

          <transition name="slide-down">
            <div v-if="errorMessage"
              class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-5 shadow-sm">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ errorMessage }}
            </div>
            <div v-else-if="successMessage"
              class="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 mb-5 shadow-sm">
              <svg class="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ successMessage }}
            </div>
          </transition>

          <button @click="handleLogin" :disabled="isLoading"
            class="w-full bg-[#08151D] hover:bg-[#0F4C3A] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="!isLoading">Log Masuk Sistem</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Mengesahkan...
            </span>
          </button>

          <p class="text-center text-xs text-gray-500 font-medium mt-8 border-t border-gray-100 pt-6">
            Kakitangan baru dan belum mendaftar?
            <button @click="router.push('/register')"
              class="text-[#0F4C3A] font-bold hover:underline ml-1">
              Daftar Akaun Ahli
            </button>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const router    = useRouter();
const route     = useRoute();
const authStore = useAuthStore();

const email        = ref('');
const password     = ref('');
const showPassword = ref(false);
const isLoading    = ref(false);
const errorMessage  = ref('');
const successMessage = ref('');

const sesiTamat = computed(() => route.query.mesej === 'sesi-tamat');

const ciriSistem = [
  { label: 'Bayaran yuran pantas melalui FPX' },
  { label: 'Permohonan bantuan kebajikan ahli' },
  { label: 'Pendaftaran sukan & aktiviti kelab' },
  { label: 'Pembelian barangan kedai eksklusif' },
];

// ── Tentukan destinasi selepas login ──
const tentikanDestinasi = (role) => {
  const isAdmin = role === 'Admin' || role === 'Super Admin';
  const isDesktop = window.innerWidth >= 768;
  return (isAdmin && isDesktop) ? '/admin' : '/dashboard';
};

const handleLogin = async () => {
  errorMessage.value   = '';
  successMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Sila isi e-mel dan kata laluan.';
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    authStore.login(response.data.token, response.data.user);

    const destinasi = tentikanDestinasi(response.data.user?.role);

    successMessage.value = destinasi === '/admin'
      ? 'Selamat datang, Admin! Mengalih ke Panel Pentadbir...'
      : response.data.message || 'Berjaya log masuk!';

    setTimeout(() => router.push(destinasi), 1000);

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'E-mel atau kata laluan salah.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.font-sans  { font-family: 'Inter', sans-serif; }
.font-hago  { font-family: 'Righteous', cursive; }
.curve-bottom { border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>