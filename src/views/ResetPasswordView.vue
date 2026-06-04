<template>
  <div class="font-sans min-h-screen selection:bg-[#52B788]/30">

    <!-- ═══════════════════════════════════
         MOBILE
         ═══════════════════════════════════ -->
    <div class="md:hidden min-h-screen flex flex-col" style="background: #EEF2EE;">

      <!-- Latar hijau gradient -->
      <div class="relative overflow-hidden" style="padding-bottom: 72px; background: linear-gradient(145deg, #081C15 0%, #0D3526 45%, #1B4332 100%);">
        <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(rgba(135,188,181,0.07) 1px, transparent 1px); background-size: 22px 22px;"></div>
        <div class="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 65%);"></div>
        <div class="absolute bottom-0 -left-10 w-40 h-40 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(27,67,50,0.7) 0%, transparent 65%);"></div>
        <div class="absolute top-0 left-0 right-0" style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 55%, #95D5B2 80%, transparent);"></div>

        <button @click="router.push('/login')"
          class="relative z-10 mt-12 ml-5 w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95"
          style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #95D5B2;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="relative z-10 flex items-center gap-3.5 mt-5 pb-2 px-6">
          <img src="/logo.png" alt="Logo" class="w-14 h-14 rounded-2xl object-contain shrink-0"
            style="box-shadow: 0 4px 20px rgba(0,0,0,0.35);" />
          <div>
            <h1 class="font-hago text-white text-[20px] tracking-widest leading-tight">Kelab PERHILITAN</h1>
            <p class="text-[9px] font-black uppercase tracking-[0.22em] mt-1" style="color: rgba(149,213,178,0.5);">Sistem Pengurusan Ahli</p>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div class="px-4 flex-1 pb-8" style="margin-top: -60px; position: relative; z-index: 10;">
        <div class="bg-white rounded-[28px] p-6" style="box-shadow: 0 8px 40px rgba(8,28,21,0.22), 0 2px 10px rgba(0,0,0,0.06);">

          <!-- Token tidak sah -->
          <div v-if="tokenTidakSah" class="text-center py-4 space-y-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style="background: #FEF2F2;">
              <svg class="w-7 h-7" style="color: #DC2626;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-[17px] font-black" style="color: #0F172A;">Pautan Tidak Sah</h3>
              <p class="text-[11px] font-medium mt-1" style="color: #94A3B8;">Pautan tetapan semula ini telah tamat tempoh atau tidak sah.</p>
            </div>
            <button @click="router.push('/forgot-password')"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
              Mohon Pautan Baru
            </button>
          </div>

          <!-- Berjaya -->
          <div v-else-if="berjaya" class="text-center py-4 space-y-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style="background: #F0FDF4;">
              <svg class="w-7 h-7" style="color: #15803D;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 class="text-[17px] font-black" style="color: #0F172A;">Kata Laluan Berjaya Ditukar!</h3>
              <p class="text-[11px] font-medium mt-1" style="color: #94A3B8;">Anda akan dibawa ke halaman Log Masuk dalam beberapa saat...</p>
            </div>
            <button @click="router.push('/login')"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
              Log Masuk Sekarang
            </button>
          </div>

          <!-- Borang reset -->
          <div v-else class="space-y-4">

            <div class="pt-1 pb-0.5">
              <h2 class="text-[21px] font-black" style="color: #0F172A;">Tetapan Semula</h2>
              <p class="text-[11px] font-medium mt-0.5" style="color: #94A3B8;">Cipta kata laluan baru untuk akaun anda</p>
            </div>

            <transition name="slide-down">
              <div v-if="errorMessage"
                class="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold"
                style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                {{ errorMessage }}
              </div>
            </transition>

            <!-- Kata laluan baru -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Kata Laluan Baru</label>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Minimum 8 aksara" required
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 pr-12 outline-none transition-all"
                  style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                  @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                  @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2" style="color: #94A3B8;">
                  <svg v-if="!showPassword" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <!-- Indikator kekuatan -->
              <div v-if="password" class="flex gap-1 mt-1.5 px-0.5">
                <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                  :class="i <= kuatKataLaluan ? kuatWarna : 'bg-gray-200'"></div>
              </div>
              <p v-if="password" class="text-[9px] px-0.5 font-bold" :class="kuatWarnaText">{{ kuatLabel }}</p>
            </div>

            <!-- Sahkan kata laluan -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Sahkan Kata Laluan</label>
              <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Ulang semula kata laluan" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                :style="`background: #F1F5F9; border: 1.5px solid ${confirmPassword && password !== confirmPassword ? '#FECACA' : '#E8EEF4'}; color: #0F172A;`"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
              <p v-if="confirmPassword && password !== confirmPassword"
                class="text-[10px] font-bold" style="color: #DC2626;">Kata laluan tidak sepadan.</p>
            </div>

            <!-- Butang -->
            <button @click="handleReset" :disabled="isLoading || !bolehHantar"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
              <span v-if="!isLoading">Kemaskini Kata Laluan</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Memproses...
              </span>
            </button>

          </div>
        </div>

        <div class="mt-4 text-center">
          <button @click="router.push('/login')"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] bg-white"
            style="color: #08151D; border: 1.5px solid #D1D5DB; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            Kembali ke Log Masuk
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         DESKTOP
         ═══════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">
      <AuthBrandPanel
        eyebrow="Keselamatan Akaun"
        description="Cipta kata laluan baru yang kukuh. Gabungkan huruf besar, nombor, dan simbol untuk perlindungan terbaik.">
        <template #heading>Reset<br><span class="text-[#87BCB5]">Kata Laluan</span></template>
      </AuthBrandPanel>

      <div class="w-1/2 bg-white flex items-center justify-center p-12">
        <div class="w-full max-w-md">

          <div v-if="tokenTidakSah" class="text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="text-gray-900 text-2xl font-bold">Pautan Tidak Sah</h3>
            <p class="text-gray-500 text-sm">Pautan tetapan semula ini telah tamat tempoh atau tidak sah. Sila mohon semula.</p>
            <button @click="router.push('/forgot-password')" class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold py-4 rounded-xl shadow-lg transition-all">Mohon Pautan Baru</button>
          </div>

          <div v-else-if="berjaya" class="text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 class="text-gray-900 text-2xl font-bold">Kata Laluan Berjaya Ditukar!</h3>
            <p class="text-gray-500 text-sm">Anda akan dibawa ke halaman Log Masuk dalam beberapa saat...</p>
            <button @click="router.push('/login')" class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold py-4 rounded-xl shadow-lg transition-all">Log Masuk Sekarang</button>
          </div>

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
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
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
const route  = useRoute();

const password        = ref('');
const confirmPassword = ref('');
const showPassword    = ref(false);
const isLoading       = ref(false);
const errorMessage    = ref('');
const berjaya         = ref(false);
const tokenTidakSah   = ref(false);

const token = computed(() => route.params.token || '');

onMounted(() => { if (!token.value) tokenTidakSah.value = true; });

const kuatKataLaluan = computed(() => {
  const p = password.value;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
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
  if (s <= 1) return 'text-rose-500';
  if (s === 2) return 'text-amber-500';
  if (s === 3) return 'text-blue-500';
  return 'text-emerald-600';
});

const kuatLabel = computed(() => {
  const s = kuatKataLaluan.value;
  if (s <= 1) return 'Lemah';
  if (s === 2) return 'Sederhana';
  if (s === 3) return 'Kuat';
  return 'Sangat Kuat';
});

const bolehHantar = computed(() => password.value.length >= 8 && password.value === confirmPassword.value);

const handleReset = async () => {
  errorMessage.value = '';
  if (password.value.length < 8) { errorMessage.value = 'Kata laluan mestilah sekurang-kurangnya 8 aksara.'; return; }
  if (password.value !== confirmPassword.value) { errorMessage.value = 'Kata laluan dan pengesahan tidak sepadan.'; return; }
  isLoading.value = true;
  try {
    await api.post(`/auth/reset-password/${token.value}`, { newPassword: password.value });
    berjaya.value = true;
    setTimeout(() => router.push('/login'), 3000);
  } catch (error) {
    const msg = error.response?.data?.message || '';
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
