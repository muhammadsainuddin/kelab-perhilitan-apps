<template>
  <div class="space-y-6 max-w-2xl">

    <!-- HEADER INFO -->
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="w-11 h-11 rounded-xl bg-[#0F4C3A]/8 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-black text-gray-900">Tetapan Modul Sistem</h2>
          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Aktifkan atau nyahaktifkan modul dalam aplikasi ahli. Modul yang dinyahaktifkan tidak akan kelihatan kepada ahli.
          </p>
        </div>
      </div>
    </div>

    <!-- SENARAI MODUL -->
    <div class="space-y-3">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Modul Aplikasi</p>

      <div v-if="loading" class="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
        <p class="text-xs text-gray-400 font-medium">Memuatkan tetapan...</p>
      </div>

      <div v-else v-for="modul in senaraModul" :key="modul.kunci"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
        :class="{ 'opacity-60': toggling === modul.kunci }">

        <div class="flex items-center gap-4 p-4">
          <!-- Ikon Modul -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :style="modulStatus(modul.kunci)
              ? 'background: rgba(15,76,58,0.07); color: #0F4C3A;'
              : 'background: rgba(239,68,68,0.07); color: #dc2626;'">
            <svg v-if="modul.kunci === 'modul_kedai'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <svg v-else-if="modul.kunci === 'modul_bantuan'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <svg v-else-if="modul.kunci === 'modul_acara'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>

          <!-- Maklumat -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-bold text-gray-900">{{ modul.label }}</p>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="modulStatus(modul.kunci)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-600 border border-red-200'">
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="modulStatus(modul.kunci) ? 'bg-emerald-500' : 'bg-red-500'"></span>
                {{ modulStatus(modul.kunci) ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
            <p class="text-xs text-gray-400">{{ modul.penerangan }}</p>
          </div>

          <!-- Toggle Switch -->
          <button @click="togolModul(modul.kunci)"
            :disabled="toggling === modul.kunci"
            class="relative inline-flex items-center shrink-0 w-12 h-6 rounded-full transition-all duration-300 focus:outline-none disabled:cursor-wait"
            :class="modulStatus(modul.kunci) ? 'bg-[#0F4C3A]' : 'bg-gray-200'">
            <span class="inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-0.5"
              :class="modulStatus(modul.kunci) ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- Notis jika tidak aktif -->
        <Transition name="expand">
          <div v-if="!modulStatus(modul.kunci)"
            class="px-4 pb-3">
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-[10px] font-medium text-amber-700">
                Modul ini tersembunyi daripada semua ahli. Paparkan semula dengan aktifkan toggle.
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- MESEJ STATUS -->
    <Transition name="fade">
      <div v-if="mesej" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-xl"
        :class="mesejOk ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
        {{ mesej }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '../../stores/settings';
import api from '../../services/api';

const settingsStore = useSettingsStore();

const loading  = ref(false);
const toggling = ref(null);
const mesej    = ref('');
const mesejOk  = ref(true);

const senaraModul = [
  {
    kunci:      'modul_kedai',
    label:      'Kedai Merchandise',
    penerangan: 'Paparan Kedai Merch dalam menu pantas dan halaman utama ahli.',
  },
  {
    kunci:      'modul_bantuan',
    label:      'Bantuan Kebajikan',
    penerangan: 'Tab Bantuan dalam bar navigasi bawah aplikasi ahli.',
  },
  {
    kunci:      'modul_acara',
    label:      'Acara & Aktiviti',
    penerangan: 'Tab Aktiviti dalam bar navigasi bawah dan pautan program kelab.',
  },
];

const modulStatus = (kunci) => settingsStore.modulAktif(kunci);

const togolModul = async (kunci) => {
  if (toggling.value) return;
  toggling.value = kunci;
  const nilaiBaru = modulStatus(kunci) ? 0 : 1;
  try {
    await api.put(`/settings/${kunci}`, { nilai: nilaiBaru });
    settingsStore.setTetapan(kunci, nilaiBaru);
    tunjukMesej('Tetapan berjaya dikemaskini', true);
  } catch (e) {
    tunjukMesej(e.response?.data?.mesej || 'Gagal kemaskini tetapan', false);
  } finally {
    toggling.value = null;
  }
};

const tunjukMesej = (teks, ok) => {
  mesej.value   = teks;
  mesejOk.value = ok;
  setTimeout(() => { mesej.value = ''; }, 3000);
};

onMounted(async () => {
  if (!settingsStore.dimuat) {
    loading.value = true;
    await settingsStore.muatTetapan();
    loading.value = false;
  }
});
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 60px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
