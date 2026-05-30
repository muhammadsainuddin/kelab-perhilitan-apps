<template>
  <div class="min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col overflow-y-auto font-sans selection:bg-[#87BCB5] selection:text-[#08151D]">
    
    <div class="relative bg-[#08151D] pt-10 pb-12 px-8 z-10 curve-bottom flex-shrink-0 shadow-xl">
      <button @click="router.push('/login')" class="text-[#567778] mb-4 hover:text-[#87BCB5] transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-3xl text-[#87BCB5] font-hago tracking-wider mb-1">PENGAKTIFAN AKAUN</h1>
      <p class="text-[#D0D7D7] text-xs leading-relaxed">Sahkan No. KP anda untuk mengaktifkan profil keahlian Kelab Perhilitan.</p>
    </div>
    
    <div class="px-8 py-6 space-y-4">
      
      <transition name="fade" mode="out-in">
        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-xs rounded shadow-sm">
          {{ errorMessage }}
        </div>
        <div v-else-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 text-xs rounded shadow-sm">
          {{ successMessage }}
        </div>
      </transition>

      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">No. Kad Pengenalan</label>
          <input 
            v-model="form.no_kp" 
            type="text" 
            required
            placeholder="Tanpa sengkang (-)"
            class="w-full bg-[#08151D]/5 border-2 border-[#08151D]/10 rounded-xl px-4 py-3 text-sm text-[#08151D] outline-none focus:border-[#08151D] focus:bg-white transition-all" 
          />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">No. Telefon</label>
          <input 
            v-model="form.no_tel" 
            type="text" 
            required
            placeholder="Contoh: 0123456789"
            class="w-full bg-[#08151D]/5 border-2 border-[#08151D]/10 rounded-xl px-4 py-3 text-sm text-[#08151D] outline-none focus:border-[#08151D] focus:bg-white transition-all" 
          />
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">E-mel Kakitangan</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="email@perhilitan.gov.my"
            class="w-full bg-[#08151D]/5 border-2 border-[#08151D]/10 rounded-xl px-4 py-3 text-sm text-[#08151D] outline-none focus:border-[#08151D] focus:bg-white transition-all" 
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">K. Laluan</label>
            <input 
              v-model="form.password" 
              type="password" 
              required
              class="w-full bg-[#08151D]/5 border-2 border-[#08151D]/10 rounded-xl px-4 py-3 text-sm text-[#08151D] outline-none focus:border-[#08151D] focus:bg-white transition-all" 
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">Sahkan</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              required
              class="w-full bg-[#08151D]/5 border-2 border-[#08151D]/10 rounded-xl px-4 py-3 text-sm text-[#08151D] outline-none focus:border-[#08151D] focus:bg-white transition-all" 
            />
          </div>
        </div>

        <div class="flex items-start gap-2 pt-2 px-1">
          <input 
            v-model="form.acceptTerms" 
            type="checkbox" 
            required
            id="terms" 
            class="mt-1 accent-[#08151D]"
          >
          <label for="terms" class="text-[10px] text-[#567778] leading-relaxed cursor-pointer">
            Saya bersetuju dengan 
            <button type="button" @click.prevent="router.push('/terms')" class="text-[#08151D] font-bold hover:underline">Terma & Syarat</button> 
            serta Polisi Privasi Kelab.
          </label>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[#08151D] hover:bg-[#0E303D] text-[#87BCB5] font-bold py-4 rounded-2xl shadow-lg mt-4 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          <span v-if="!isLoading">Aktifkan Akaun</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            Menyemak Rekod...
          </span>
        </button>

      </form>

      <p class="text-center text-[11px] text-[#567778] pt-2">
        Sudah ada akaun? 
        <button type="button" @click="router.push('/login')" class="text-[#08151D] font-bold hover:underline">Log Masuk</button>
      </p>
      
      <div class="pb-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; // Pastikan path ini betul mengikut konfigurasi axios anda

const router = useRouter();

const form = reactive({
  no_kp: '',
  no_tel: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  // Reset mesej
  errorMessage.value = '';
  successMessage.value = '';

  // Validasi Frontend asas
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Kata laluan dan pengesahan kata laluan tidak sepadan.';
    return;
  }

  isLoading.value = true;

  try {
    // Hantar data ke endpoint backend
    const response = await api.post('/auth/register', {
      no_kp: form.no_kp,
      email: form.email,
      password: form.password,
      no_tel: form.no_tel
    });

    // Jika berjaya (status 201)
    successMessage.value = response.data.message || 'Pendaftaran berjaya! Anda akan dibawa ke halaman Log Masuk...';
    
    // Bawa pengguna ke halaman log masuk selepas 2.5 saat
    setTimeout(() => {
      router.push('/login');
    }, 2500);

  } catch (error) {
    // Paparkan ralat dari backend (Contoh: No KP tiada, Emel telah wujud, dsb.)
    errorMessage.value = error.response?.data?.message || 'Berlaku ralat pelayan. Sila cuba lagi.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }
.curve-bottom { border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #08151D; border-radius: 10px; }

/* Transisi mesej ralat/berjaya */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>