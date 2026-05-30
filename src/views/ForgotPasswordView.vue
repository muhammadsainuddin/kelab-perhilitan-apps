<template>
  <div class="min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col font-sans selection:bg-[#87BCB5] selection:text-[#08151D]">
    <div class="relative bg-[#08151D] pt-12 pb-24 px-8 curve-bottom shadow-xl">
      <button @click="router.push('/login')" class="text-[#567778] mb-6 hover:text-[#87BCB5] transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-3xl text-[#87BCB5] font-hago tracking-wider mb-2">LUPA KATA LALUAN</h1>
      <p class="text-[#D0D7D7] text-xs leading-relaxed">Masukkan e-mel berdaftar anda untuk menerima pautan tetapan semula.</p>
    </div>
    
    <div class="px-8 -mt-10 relative z-20">
      
      <transition name="fade" mode="out-in">
        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-xs rounded shadow-sm mb-4">
          {{ errorMessage }}
        </div>
        <div v-else-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 text-xs rounded shadow-sm mb-4">
          {{ successMessage }}
        </div>
      </transition>

      <div class="bg-[#0E303D] p-6 rounded-[30px] shadow-2xl">
        <form @submit.prevent="handleForgotPassword" class="space-y-5">
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">Alamat E-mel</label>
            <input v-model="email" type="email" placeholder="email@perhilitan.gov.my" required class="w-full bg-[#08151D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" />
          </div>
          <button type="submit" :disabled="isLoading" class="w-full bg-[#87BCB5] hover:bg-[#6CA39C] text-[#08151D] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70">
            <span v-if="!isLoading">Hantar Pautan</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              Memproses...
            </span>
          </button>
        </form>
      </div>
      <button @click="router.push('/login')" class="w-full text-center text-xs text-[#08151D] font-bold mt-8 hover:underline">Kembali ke Log Masuk</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleForgotPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await api.post('/auth/forgot-password', {
      email: email.value
    });

    // Berjaya menghantar e-mel pengesahan
    successMessage.value = response.data.message || 'E-mel tetapan semula berjaya dihantar. Sila semak peti masuk anda.';
    email.value = ''; 
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'E-mel tidak dijumpai atau berlaku ralat pelayan.';
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
.curve-bottom { border-bottom-left-radius: 50px; border-bottom-right-radius: 50px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>