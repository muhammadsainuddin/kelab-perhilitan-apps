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

        <button @click="router.back()"
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

          <!-- Berjaya -->
          <div v-if="berjaya" class="py-4 space-y-4 text-center">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style="background: #F0FDF4; border: 1px solid #BBF7D0;">
              <svg class="w-7 h-7" style="color: #15803D;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h2 class="text-[18px] font-black" style="color: #0F172A;">Permohonan Diterima</h2>
              <p class="text-[11px] font-medium mt-2 leading-relaxed" style="color: #64748B;">
                Permohonan pemadaman akaun anda telah dihantar kepada pihak pentadbir. Proses akan diselesaikan dalam tempoh <strong>14 hari bekerja</strong>.
              </p>
            </div>
            <button @click="router.push('/login')"
              class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] mt-2"
              style="background: #08151D; color: #87BCB5;">
              Kembali ke Log Masuk
            </button>
          </div>

          <!-- Borang -->
          <div v-else class="space-y-4">
            <div class="pt-1 pb-0.5">
              <h2 class="text-[21px] font-black" style="color: #0F172A;">Padam Akaun</h2>
              <p class="text-[11px] font-medium mt-0.5 leading-relaxed" style="color: #94A3B8;">
                Isi maklumat di bawah. Pentadbir akan menghubungi anda dalam 14 hari bekerja.
              </p>
            </div>

            <!-- Notis -->
            <div class="rounded-2xl px-3.5 py-3 space-y-1.5" style="background: #FEF3C7; border: 1px solid #FDE68A;">
              <p class="text-[10px] font-black uppercase tracking-wider" style="color: #92400E;">Yang akan dipadam</p>
              <ul class="text-[10px] font-medium space-y-0.5" style="color: #78350F;">
                <li>• Akaun log masuk dan kata laluan</li>
                <li>• Maklumat profil dan penempatan</li>
                <li>• Sejarah transaksi FPX</li>
                <li>• Data waris dan perbankan</li>
              </ul>
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

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Alamat E-mel</label>
              <input v-model="form.email" type="email" placeholder="email@perhilitan.gov.my"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Kad Pengenalan</label>
              <input v-model="form.no_kp" type="text" placeholder="XXXXXXXXXXXXXX"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all font-mono"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Sebab Pemadaman <span class="font-medium normal-case tracking-normal" style="color: #94A3B8;">(pilihan)</span></label>
              <textarea v-model="form.sebab" rows="3" placeholder="Nyatakan sebab jika ada..."
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all resize-none"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }"></textarea>
            </div>

            <button @click="hantar" :disabled="isLoading"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #7F1D1D; color: #FECACA; box-shadow: 0 4px 16px rgba(127,29,29,0.25);">
              <span v-if="!isLoading">Hantar Permohonan</span>
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

        <div v-if="!berjaya" class="mt-4 text-center">
          <button @click="router.back()"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] bg-white"
            style="color: #08151D; border: 1.5px solid #D1D5DB; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         DESKTOP
         ═══════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">
      <AuthBrandPanel
        eyebrow="Pengurusan Akaun"
        description="Anda berhak untuk meminta pemadaman akaun dan semua data peribadi yang berkaitan dalam sistem kami.">
        <template #heading>Padam<br><span class="text-[#87BCB5]">Akaun</span></template>
      </AuthBrandPanel>

      <div class="w-1/2 bg-white flex items-center justify-center p-12">
        <div class="w-full max-w-md">

          <button @click="router.back()" class="text-gray-400 hover:text-[#0F4C3A] transition-colors mb-6 flex items-center gap-1 text-xs font-bold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Kembali
          </button>

          <!-- Berjaya -->
          <div v-if="berjaya" class="text-center space-y-4 py-8">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-green-50 border border-green-200">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Permohonan Diterima</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Permohonan pemadaman akaun anda telah dihantar kepada pihak pentadbir. Proses akan diselesaikan dalam tempoh <strong>14 hari bekerja</strong>.</p>
            <button @click="router.push('/login')" class="mt-4 bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold py-3 px-8 rounded-xl transition-all">
              Kembali ke Log Masuk
            </button>
          </div>

          <!-- Borang -->
          <div v-else>
            <h3 class="text-gray-900 text-3xl font-bold mb-2">Padam Akaun</h3>
            <p class="text-gray-500 text-sm mb-6">Isi maklumat di bawah untuk memohon pemadaman akaun dan data anda.</p>

            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p class="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">Yang akan dipadam</p>
              <ul class="text-xs text-amber-700 space-y-1">
                <li>• Akaun log masuk dan kata laluan</li>
                <li>• Maklumat profil dan penempatan</li>
                <li>• Sejarah transaksi FPX</li>
                <li>• Data waris dan perbankan</li>
              </ul>
            </div>

            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 p-3 text-xs rounded-xl mb-5">{{ errorMessage }}</div>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Alamat E-mel</label>
                <input v-model="form.email" type="email" placeholder="email@perhilitan.gov.my"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Kad Pengenalan</label>
                <input v-model="form.no_kp" type="text" placeholder="XXXXXXXXXXXXXX"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-mono placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Sebab <span class="normal-case font-normal tracking-normal text-gray-400">(pilihan)</span></label>
                <textarea v-model="form.sebab" rows="3" placeholder="Nyatakan sebab jika ada..."
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all resize-none"></textarea>
              </div>
              <button @click="hantar" :disabled="isLoading"
                class="w-full bg-red-800 hover:bg-red-900 text-red-100 font-bold py-4 rounded-xl transition-all disabled:opacity-60">
                <span v-if="!isLoading">Hantar Permohonan Pemadaman</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Memproses...
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import AuthBrandPanel from '../components/AuthBrandPanel.vue';

const router = useRouter();

const form = ref({ email: '', no_kp: '', sebab: '' });
const isLoading   = ref(false);
const errorMessage = ref('');
const berjaya      = ref(false);

const hantar = async () => {
  errorMessage.value = '';
  if (!form.value.email || !form.value.no_kp) {
    errorMessage.value = 'Sila isi e-mel dan No. Kad Pengenalan.';
    return;
  }
  isLoading.value = true;
  try {
    await api.post('/auth/request-deletion', {
      email: form.value.email,
      no_kp: form.value.no_kp,
      sebab: form.value.sebab,
    });
    berjaya.value = true;
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal menghantar permohonan. Sila cuba lagi.';
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
</style>
