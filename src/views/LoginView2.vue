<template>
  <div class="min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col font-sans selection:bg-[#87BCB5] selection:text-[#08151D]">
    <div class="relative bg-[#08151D] pt-12 pb-20 px-8 z-10 curve-bottom shadow-xl">
      <button @click="router.push('/')" class="text-[#567778] mb-6 hover:text-[#87BCB5] transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-4xl text-[#87BCB5] font-hago tracking-wider mb-1">HAGO</h1>
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
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    successMessage.value = response.data.message || 'Berjaya log masuk!';
    
    // Simpan token & objek user ke dalam store anda
    authStore.login(response.data.token, response.data.user);

    const role = response.data.user?.role;
    const destination = (role === 'Admin' || role === 'Super Admin') ? '/admin' : '/dashboard';

    setTimeout(() => {
      router.push(destination);
    }, 1200);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'E-mel atau kata laluan salah.';
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