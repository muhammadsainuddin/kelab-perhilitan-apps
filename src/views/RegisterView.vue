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
      <div class="px-4 pb-10" style="margin-top: -60px; position: relative; z-index: 10;">
        <div class="bg-white rounded-[28px] p-6 space-y-4" style="box-shadow: 0 8px 40px rgba(8,28,21,0.22), 0 2px 10px rgba(0,0,0,0.06);">

          <div class="pt-1 pb-0.5">
            <h2 class="text-[21px] font-black" style="color: #0F172A;">Pengaktifan Akaun</h2>
            <p class="text-[11px] font-medium mt-0.5" style="color: #94A3B8;">Sahkan No. KP anda untuk mengaktifkan keahlian</p>
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
            <div v-else-if="successMessage"
              class="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold"
              style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D;">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              {{ successMessage }}
            </div>
          </transition>

          <!-- No. KP -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Kad Pengenalan</label>
            <input v-model="form.no_kp" type="text" placeholder="Tanpa sengkang (-)" required
              class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
              style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
              @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
              @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
          </div>

          <!-- No. Tel -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Telefon</label>
            <input v-model="form.no_tel" type="text" placeholder="Contoh: 0123456789" required
              class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
              style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
              @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
              @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
          </div>

          <!-- E-mel -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">E-mel Kakitangan</label>
            <input v-model="form.email" type="email" placeholder="email@perhilitan.gov.my" required
              class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
              style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
              @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
              @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
          </div>

          <!-- Kata laluan -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">K. Laluan</label>
              <input v-model="form.password" type="password" placeholder="••••••••" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Sahkan</label>
              <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                :style="`background: #F1F5F9; border: 1.5px solid ${form.confirmPassword && form.password !== form.confirmPassword ? '#FECACA' : '#E8EEF4'}; color: #0F172A;`"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
          </div>
          <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
            class="text-[10px] font-bold -mt-2" style="color: #DC2626;">
            Kata laluan tidak sepadan.
          </p>

          <!-- Terma -->
          <div class="flex items-start gap-2.5 pt-1">
            <input v-model="form.acceptTerms" type="checkbox" required id="terms-m"
              class="mt-0.5 w-3.5 h-3.5 rounded accent-[#0F4C3A] cursor-pointer shrink-0" />
            <label for="terms-m" class="text-[10px] font-medium leading-relaxed cursor-pointer" style="color: #64748B;">
              Saya bersetuju dengan
              <button type="button" @click.prevent="router.push('/terms')"
                class="font-black hover:underline" style="color: #0F4C3A;">Terma & Syarat</button>
              serta Polisi Privasi Kelab.
            </label>
          </div>

          <!-- Butang -->
          <button @click="handleRegister" :disabled="isLoading"
            class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
            <span v-if="!isLoading">Aktifkan Akaun</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Menyemak Rekod...
            </span>
          </button>

        </div>

        <div class="mt-4 text-center">
          <p class="text-[11px] font-medium mb-3" style="color: #6B7280;">Sudah ada akaun?</p>
          <button @click="router.push('/login')"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] bg-white"
            style="color: #08151D; border: 1.5px solid #D1D5DB; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            Log Masuk
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         DESKTOP
         ═══════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">
      <AuthBrandPanel
        eyebrow="Pengaktifan Akaun"
        description="Aktifkan akaun keahlian anda untuk mengakses yuran, kebajikan, aktiviti, dan kedai kelab secara dalam talian.">
        <template #heading>Aktifkan<br><span class="text-[#87BCB5]">Keahlian</span><br>Anda</template>
      </AuthBrandPanel>

      <div class="w-1/2 bg-white flex items-center justify-center p-12 overflow-y-auto">
        <div class="w-full max-w-md">
          <div class="mb-8">
            <button @click="router.push('/login')" class="text-gray-400 hover:text-[#0F4C3A] transition-colors mb-5 flex items-center gap-1 text-xs font-bold">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali Log Masuk
            </button>
            <h3 class="text-gray-900 text-3xl font-bold mb-2">Pengaktifan Akaun</h3>
            <p class="text-gray-500 text-sm">Sahkan No. KP anda untuk mengaktifkan profil keahlian.</p>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 p-3 text-xs rounded-xl shadow-sm mb-5">{{ errorMessage }}</div>
            <div v-else-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 p-3 text-xs rounded-xl shadow-sm mb-5">{{ successMessage }}</div>
          </transition>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Kad Pengenalan</label>
              <input v-model="form.no_kp" type="text" required placeholder="Tanpa sengkang (-)"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Telefon</label>
                <input v-model="form.no_tel" type="text" required placeholder="0123456789"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">E-mel</label>
                <input v-model="form.email" type="email" required placeholder="email@perhilitan.gov.my"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Kata Laluan</label>
                <input v-model="form.password" type="password" required placeholder="••••••••"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Sahkan</label>
                <input v-model="form.confirmPassword" type="password" required placeholder="••••••••"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div class="flex items-start gap-2 pt-1">
              <input v-model="form.acceptTerms" type="checkbox" required id="terms-pc" class="mt-1 accent-[#0F4C3A]">
              <label for="terms-pc" class="text-[11px] text-gray-500 leading-relaxed cursor-pointer">
                Saya bersetuju dengan
                <button type="button" @click.prevent="router.push('/terms')" class="text-[#0F4C3A] font-bold hover:underline">Terma & Syarat</button>
                serta Polisi Privasi Kelab.
              </label>
            </div>
            <button type="submit" :disabled="isLoading"
              class="w-full bg-[#08151D] hover:bg-[#0F4C3A] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60">
              <span v-if="!isLoading">Aktifkan Akaun</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Menyemak Rekod...
              </span>
            </button>
          </form>

          <p class="text-center text-xs text-gray-500 font-medium mt-8 border-t border-gray-100 pt-6">
            Sudah ada akaun?
            <button @click="router.push('/login')" class="text-[#0F4C3A] font-bold hover:underline ml-1">Log Masuk</button>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import AuthBrandPanel from '../components/AuthBrandPanel.vue';

const router = useRouter();

const form = reactive({
  no_kp: '', no_tel: '', email: '',
  password: '', confirmPassword: '', acceptTerms: false
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Kata laluan dan pengesahan kata laluan tidak sepadan.';
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.post('/auth/register', {
      no_kp: form.no_kp, email: form.email,
      password: form.password, no_tel: form.no_tel
    });
    successMessage.value = response.data.message || 'Pendaftaran berjaya! Anda akan dibawa ke halaman Log Masuk...';
    setTimeout(() => router.push('/login'), 2500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Berlaku ralat pelayan. Sila cuba lagi.';
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
