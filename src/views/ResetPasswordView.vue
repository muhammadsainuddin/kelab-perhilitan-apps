<template>
  <div class="font-sans min-h-screen selection:bg-[#87BCB5] selection:text-[#08151D]">

  <!-- ============== PAPARAN TELEFON ============== -->
  <div class="md:hidden min-h-screen bg-[#D0D7D7] relative h-screen shadow-2xl flex flex-col">

    <div class="relative bg-[#08151D] pt-12 pb-24 px-8 curve-bottom shadow-xl">
      <h1 class="text-3xl text-[#87BCB5] font-hago tracking-wider mb-2">RESET KATA LALUAN</h1>
      <p class="text-[#D0D7D7] text-xs leading-relaxed">Cipta kata laluan baru yang lebih kukuh untuk akaun anda.</p>
    </div>
    
    <div class="px-8 -mt-10 relative z-20 space-y-4">

      <!-- Token tidak sah / tamat tempoh -->
      <div v-if="tokenTidakSah" class="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 text-xs rounded shadow-sm">
        <p class="font-black uppercase mb-1">Pautan Tidak Sah</p>
        <p>Pautan tetapan semula ini telah tamat tempoh atau tidak sah. Sila mohon semula.</p>
        <button @click="router.push('/forgot-password')" class="mt-3 font-black underline underline-offset-2">
          Mohon Pautan Baru →
        </button>
      </div>

      <!-- Berjaya tukar kata laluan -->
      <div v-else-if="berjaya" class="bg-emerald-50 border border-emerald-200 rounded-[30px] p-6 text-center shadow-xl space-y-3">
        <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h3 class="text-sm font-black text-emerald-800 uppercase tracking-wide">Kata Laluan Berjaya Ditukar!</h3>
        <p class="text-xs text-emerald-700">Anda akan dibawa ke halaman Log Masuk dalam beberapa saat...</p>
        <button @click="router.push('/login')" class="w-full mt-2 bg-[#08151D] text-[#87BCB5] font-bold py-3 rounded-xl text-xs transition-all">
          Log Masuk Sekarang
        </button>
      </div>

      <!-- Borang Reset -->
      <div v-else class="bg-[#0E303D] p-6 rounded-[30px] shadow-2xl space-y-4">

        <transition name="fade" mode="out-in">
          <div v-if="errorMessage" class="bg-red-900/40 border border-red-500/50 text-red-300 p-3 text-xs rounded-xl">
            {{ errorMessage }}
          </div>
        </transition>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">Kata Laluan Baru</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Minimum 8 aksara"
              required
              class="w-full bg-[#08151D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none pr-10" 
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#567778] hover:text-[#87BCB5]">
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            </button>
          </div>
          <!-- Indikator kekuatan kata laluan -->
          <div v-if="password" class="flex gap-1 mt-1.5 px-1">
            <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                 :class="i <= kuatKataLaluan ? kuatWarna : 'bg-white/10'"></div>
          </div>
          <p v-if="password" class="text-[9px] px-1 mt-0.5 font-bold" :class="kuatWarnaText">{{ kuatLabel }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase tracking-widest ml-1">Sahkan Kata Laluan Baru</label>
          <input 
            v-model="confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Ulang semula kata laluan baru"
            required
            class="w-full bg-[#08151D] border-none rounded-xl px-4 py-3 text-sm text-[#D0D7D7] focus:ring-1 focus:ring-[#87BCB5] outline-none" 
            :class="confirmPassword && password !== confirmPassword ? 'ring-1 ring-rose-500' : ''"
          />
          <p v-if="confirmPassword && password !== confirmPassword" class="text-[9px] text-rose-400 px-1 mt-0.5 font-bold">
            Kata laluan tidak sepadan.
          </p>
        </div>

        <button 
          @click="handleReset" 
          :disabled="isLoading || !bolehHantar"
          class="w-full bg-[#87BCB5] hover:bg-[#6CA39C] text-[#08151D] font-bold py-3.5 rounded-xl shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          <span v-if="!isLoading">Kemaskini Kata Laluan</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Memproses...
          </span>
        </button>
      </div>

      <button @click="router.push('/login')" class="w-full text-center text-xs text-[#08151D] font-bold mt-4 hover:underline">
        Kembali ke Log Masuk
      </button>
    </div>
  </div>

  <!-- ============== PAPARAN PC ============== -->
  <div class="hidden md:flex min-h-screen">
    <AuthBrandPanel
      eyebrow="Keselamatan Akaun"
      description="Cipta kata laluan baru yang kukuh. Gabungkan huruf besar, nombor, dan simbol untuk perlindungan terbaik.">
      <template #heading>Reset<br><span class="text-[#87BCB5]">Kata Laluan</span></template>
    </AuthBrandPanel>

    <div class="w-1/2 bg-white flex items-center justify-center p-12">
      <div class="w-full max-w-md">

        <!-- Token tidak sah -->
        <div v-if="tokenTidakSah" class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-gray-900 text-2xl font-bold">Pautan Tidak Sah</h3>
          <p class="text-gray-500 text-sm">Pautan tetapan semula ini telah tamat tempoh atau tidak sah. Sila mohon semula.</p>
          <button @click="router.push('/forgot-password')" class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold py-4 rounded-xl shadow-lg transition-all">Mohon Pautan Baru</button>
        </div>

        <!-- Berjaya -->
        <div v-else-if="berjaya" class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="text-gray-900 text-2xl font-bold">Kata Laluan Berjaya Ditukar!</h3>
          <p class="text-gray-500 text-sm">Anda akan dibawa ke halaman Log Masuk dalam beberapa saat...</p>
          <button @click="router.push('/login')" class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold py-4 rounded-xl shadow-lg transition-all">Log Masuk Sekarang</button>
        </div>

        <!-- Borang -->
        <div v-else>
          <div class="mb-8">
            <h3 class="text-gray-900 text-3xl font-bold mb-2">Reset Kata Laluan</h3>
            <p class="text-gray-500 text-sm">Cipta kata laluan baru yang lebih kukuh untuk akaun anda.</p>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 p-3 text-xs rounded-xl shadow-sm mb-5">{{ errorMessage }}</div>
          </transition>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Kata Laluan Baru</label>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Minimum 8 aksara" required
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all pr-12"/>
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F4C3A]">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                </button>
              </div>
              <div v-if="password" class="flex gap-1 mt-2">
                <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300" :class="i <= kuatKataLaluan ? kuatWarna : 'bg-gray-200'"></div>
              </div>
              <p v-if="password" class="text-[10px] mt-1 font-bold" :class="kuatWarnaText">{{ kuatLabel }}</p>
            </div>

            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Sahkan Kata Laluan Baru</label>
              <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Ulang semula kata laluan baru" required
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"
                :class="confirmPassword && password !== confirmPassword ? 'ring-2 ring-rose-300 border-rose-300' : ''"/>
              <p v-if="confirmPassword && password !== confirmPassword" class="text-[10px] text-rose-500 mt-1 font-bold">Kata laluan tidak sepadan.</p>
            </div>

            <button @click="handleReset" :disabled="isLoading || !bolehHantar"
              class="w-full bg-[#08151D] hover:bg-[#0F4C3A] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="!isLoading">Kemaskini Kata Laluan</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Memproses...
              </span>
            </button>
          </div>

          <button @click="router.push('/login')" class="w-full text-center text-xs text-gray-500 hover:text-[#0F4C3A] font-bold mt-6 hover:underline">Kembali ke Log Masuk</button>
        </div>

      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';
import AuthBrandPanel from '../components/AuthBrandPanel.vue';

const router = useRouter();
const route = useRoute();

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const berjaya = ref(false);
const tokenTidakSah = ref(false);

// Ambil token dari URL params — contoh: /reset-password/:token
const token = computed(() => route.params.token || '');

// Pastikan token wujud dalam URL, jika tidak papar ralat
onMounted(() => {
  if (!token.value) {
    tokenTidakSah.value = true;
  }
});

// Indikator kekuatan kata laluan
const kuatKataLaluan = computed(() => {
  const p = password.value;
  if (!p) return 0;
  let skor = 0;
  if (p.length >= 8) skor++;
  if (/[A-Z]/.test(p)) skor++;
  if (/[0-9]/.test(p)) skor++;
  if (/[^A-Za-z0-9]/.test(p)) skor++;
  return skor;
});

const kuatWarna = computed(() => {
  const s = kuatKataLaluan.value;
  if (s <= 1) return 'bg-rose-500';
  if (s === 2) return 'bg-amber-400';
  if (s === 3) return 'bg-blue-400';
  return 'bg-emerald-500';
});

const kuatWarnaText = computed(() => {
  const s = kuatKataLaluan.value;
  if (s <= 1) return 'text-rose-400';
  if (s === 2) return 'text-amber-400';
  if (s === 3) return 'text-blue-400';
  return 'text-emerald-400';
});

const kuatLabel = computed(() => {
  const s = kuatKataLaluan.value;
  if (s <= 1) return 'Lemah';
  if (s === 2) return 'Sederhana';
  if (s === 3) return 'Kuat';
  return 'Sangat Kuat';
});

const bolehHantar = computed(() => {
  return password.value.length >= 8 && password.value === confirmPassword.value;
});

const handleReset = async () => {
  errorMessage.value = '';

  if (password.value.length < 8) {
    errorMessage.value = 'Kata laluan mestilah sekurang-kurangnya 8 aksara.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Kata laluan dan pengesahan tidak sepadan.';
    return;
  }

  isLoading.value = true;

  try {
    await api.post(`/auth/reset-password/${token.value}`, {
      newPassword: password.value
    });

    berjaya.value = true;

    // Redirect ke login selepas 3 saat
    setTimeout(() => {
      router.push('/login');
    }, 3000);

  } catch (error) {
    const msg = error.response?.data?.message || '';

    // Kesan token tamat tempoh atau tidak sah
    if (error.response?.status === 400 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('tamat')) {
      tokenTidakSah.value = true;
    } else {
      errorMessage.value = msg || 'Berlaku ralat pelayan. Sila cuba lagi.';
    }
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