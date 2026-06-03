<template>
  <nav class="fixed bottom-0 left-0 w-full z-50">
    <div class="w-full bg-[#08151D] rounded-t-[28px] shadow-[0_-8px_24px_rgba(8,21,29,0.12)] border-t border-[#567778]/20">
      <div class="max-w-lg mx-auto px-6 pt-3 pb-safe">
        <div class="flex justify-between items-end">

          <!-- UTAMA -->
          <router-link to="/dashboard/utama" custom v-slot="{ isActive, navigate }">
            <button @click="navigate" class="tab-btn" :class="isActive ? 'tab-on' : 'tab-off'">
              <span class="tab-icon-wrap">
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span v-if="isActive" class="tab-dot"></span>
              </span>
              <span class="tab-label">Utama</span>
            </button>
          </router-link>

          <!-- AKTIVITI -->
          <router-link v-if="settingsStore.modulAktif('modul_acara')" to="/dashboard/aktiviti" custom v-slot="{ isActive, navigate }">
            <button @click="navigate" class="tab-btn" :class="isActive ? 'tab-on' : 'tab-off'">
              <span class="tab-icon-wrap">
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span v-if="isActive" class="tab-dot"></span>
              </span>
              <span class="tab-label">Aktiviti</span>
            </button>
          </router-link>

          <!-- YURAN (Butang Timbul Tengah - Amber) -->
          <router-link to="/dashboard/yuran" custom v-slot="{ isActive, navigate }">
            <button @click="navigate" class="flex flex-col items-center gap-1.5 -mt-9 w-16 group">
              <span class="relative flex items-center justify-center w-[58px] h-[58px] rounded-full bg-[#FBBF24] border-4 border-[#08151D] shadow-[0_6px_16px_rgba(251,191,36,0.35)] transition-all duration-300 group-active:scale-90"
                    :class="isActive ? 'ring-2 ring-[#FBBF24]/40 ring-offset-2 ring-offset-[#08151D]' : ''">
                <svg class="w-7 h-7 text-[#08151D]" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                <!-- Penanda yuran tertunggak -->
                <span v-if="yuranTertunggak" class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#E24B4A] rounded-full border-2 border-[#08151D] animate-pulse"></span>
              </span>
              <span class="text-[9px] font-black tracking-wider uppercase transition-colors duration-300"
                    :class="isActive ? 'text-[#FBBF24]' : 'text-[#87BCB5]'">Yuran</span>
            </button>
          </router-link>

          <!-- BANTUAN -->
          <router-link v-if="settingsStore.modulAktif('modul_bantuan')" to="/dashboard/bantuan" custom v-slot="{ isActive, navigate }">
            <button @click="navigate" class="tab-btn" :class="isActive ? 'tab-on' : 'tab-off'">
              <span class="tab-icon-wrap">
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                <span v-if="isActive" class="tab-dot"></span>
              </span>
              <span class="tab-label">Bantuan</span>
            </button>
          </router-link>

          <!-- PROFIL -->
          <router-link to="/dashboard/profil" custom v-slot="{ isActive, navigate }">
            <button @click="navigate" class="tab-btn" :class="isActive ? 'tab-on' : 'tab-off'">
              <span class="tab-icon-wrap">
                <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span v-if="isActive" class="tab-dot"></span>
              </span>
              <span class="tab-label">Profil</span>
            </button>
          </router-link>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();

const yuranTertunggak = ref(false);

const semakStatusYuran = async () => {
  try {
    const res = await api.get('/user/profil');
    yuranTertunggak.value = !res.data.data.is_paid;
  } catch (e) {
    // Senyap — penanda tak muncul jika gagal
  }
};

onMounted(async () => {
  semakStatusYuran();
  await settingsStore.muatTetapan();
});
</script>

<style scoped>
.tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 56px;
  padding-top: 6px;
  transition: color 0.25s ease;
}
.tab-on  { color: #87BCB5; }
.tab-off { color: #567778; }
.tab-off:hover { color: #A9D2CC; }

.tab-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}
.tab-on .tab-icon-wrap { transform: translateY(-2px); }

.tab-dot {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: #87BCB5;
}

.tab-label {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Ruang selamat bawah (notch) — kekal, tapi minimum supaya tab bar rapat */
.pb-safe { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
</style>