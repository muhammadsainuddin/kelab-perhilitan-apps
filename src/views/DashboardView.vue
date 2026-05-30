<template>
  <div class="min-h-screen bg-[#D0D7D7] font-sans selection:bg-[#87BCB5] selection:text-[#08151D] flex flex-col h-screen overflow-hidden">
    
    <div class="bg-[#08151D] pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg flex-shrink-0 z-20">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl text-[#87BCB5] font-hago tracking-widest">HAGO</h1>
          <p class="text-[#567778] text-xs font-medium uppercase tracking-widest mt-1">Kelab Perhilitan</p>
        </div>
        <div class="w-10 h-10 bg-[#0E303D] rounded-full flex items-center justify-center border border-[#567778]/30">
          <svg class="w-5 h-5 text-[#87BCB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-28 custom-scrollbar relative z-10">
      <transition name="fade" mode="out-in">
        
        <div v-if="activeTab === 'utama'" key="utama" class="space-y-6">
          
          <div class="relative bg-gradient-to-br from-[#0E303D] to-[#08151D] rounded-3xl p-6 shadow-[0_10px_25px_rgba(8,21,29,0.4)] overflow-hidden border border-[#567778]/30">
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#87BCB5] rounded-full blur-3xl opacity-20"></div>
            <div class="flex justify-between items-start relative z-10">
              <div>
                <p class="text-[#567778] text-[10px] font-bold uppercase tracking-widest mb-1">Kad Keahlian Digital</p>
                <h2 class="text-xl font-bold text-[#D0D7D7]">Ahmad Faiz Bin Othman</h2>
                <p class="text-[#87BCB5] text-sm mt-1 font-mono tracking-wider">ID: PHL-2026-0891</p>
              </div>
              <img src="/logo.png" class="w-12 h-12 object-contain opacity-80" />
            </div>
            <div class="mt-6 flex justify-between items-end relative z-10">
              <div>
                <p class="text-[#567778] text-[10px] uppercase tracking-wider">Status Ahli</p>
                <p class="text-green-400 font-bold text-sm flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Aktif
                </p>
              </div>
              <p class="text-[#567778] text-[10px]">Sah sehingga: Dis 2026</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D0D7D7]">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-[#08151D] text-sm">Yuran Tahunan 2026</h3>
              <span class="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Belum Bayar</span>
            </div>
            <p class="text-xs text-[#567778] mb-4">Sila jelaskan yuran keahlian kelab anda sebanyak <strong class="text-[#08151D]">RM 50.00</strong> untuk tahun ini.</p>
            <button class="w-full bg-[#08151D] hover:bg-[#0E303D] text-[#87BCB5] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              Bayar via ToyyibPay
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'aktiviti'" key="aktiviti" class="space-y-4">
          <h2 class="font-bold text-[#08151D] text-lg mb-2">Acara & Sukan Terkini</h2>
          
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#D0D7D7] flex gap-4">
            <div class="w-20 h-20 bg-[#0E303D] rounded-xl flex flex-col items-center justify-center text-[#87BCB5] flex-shrink-0">
              <span class="text-sm font-bold">15</span>
              <span class="text-[10px] uppercase tracking-widest">Ogos</span>
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <h3 class="font-bold text-[#08151D] text-sm">Kejohanan Futsal Tertutup</h3>
              <p class="text-[#567778] text-[10px] mt-1">Kompleks Sukan Negara</p>
              <button class="mt-2 text-xs bg-[#87BCB5] text-[#08151D] font-bold py-1.5 px-4 rounded-lg self-start">Daftar</button>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#D0D7D7] flex gap-4">
            <div class="w-20 h-20 bg-[#0E303D] rounded-xl flex flex-col items-center justify-center text-[#87BCB5] flex-shrink-0">
              <span class="text-sm font-bold">02</span>
              <span class="text-[10px] uppercase tracking-widest">Sep</span>
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <h3 class="font-bold text-[#08151D] text-sm">Hari Keluarga Perhilitan</h3>
              <p class="text-[#567778] text-[10px] mt-1">Taman Botani, Putrajaya</p>
              <button class="mt-2 text-xs border border-[#08151D] text-[#08151D] font-bold py-1.5 px-4 rounded-lg self-start">Daftar</button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'kedai'" key="kedai" class="space-y-4">
          <h2 class="font-bold text-[#08151D] text-lg mb-2">Kedai Kelab</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl p-3 shadow-sm border border-[#D0D7D7]">
              <div class="w-full h-32 bg-[#D0D7D7]/50 rounded-xl mb-3 flex items-center justify-center text-[#567778]">👕</div>
              <h3 class="font-bold text-[#08151D] text-xs">Baju Korporat Kelab</h3>
              <p class="text-[#87BCB5] font-bold text-sm mt-1">RM 45.00</p>
              <button class="w-full mt-2 text-xs bg-[#08151D] text-[#87BCB5] font-bold py-2 rounded-lg">Beli</button>
            </div>
            <div class="bg-white rounded-2xl p-3 shadow-sm border border-[#D0D7D7]">
              <div class="w-full h-32 bg-[#D0D7D7]/50 rounded-xl mb-3 flex items-center justify-center text-[#567778]">🧢</div>
              <h3 class="font-bold text-[#08151D] text-xs">Topi Eksklusif</h3>
              <p class="text-[#87BCB5] font-bold text-sm mt-1">RM 25.00</p>
              <button class="w-full mt-2 text-xs bg-[#08151D] text-[#87BCB5] font-bold py-2 rounded-lg">Beli</button>
            </div>
            <div class="bg-white rounded-2xl p-3 shadow-sm border border-[#D0D7D7]">
              <div class="w-full h-32 bg-[#D0D7D7]/50 rounded-xl mb-3 flex items-center justify-center text-[#567778]">✉️</div>
              <h3 class="font-bold text-[#08151D] text-xs">Sampul Raya Edisi 2026</h3>
              <p class="text-[#87BCB5] font-bold text-sm mt-1">RM 10.00</p>
              <button class="w-full mt-2 text-xs bg-[#08151D] text-[#87BCB5] font-bold py-2 rounded-lg">Beli</button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'bantuan'" key="bantuan" class="space-y-4">
          <h2 class="font-bold text-[#08151D] text-lg mb-2">Permohonan Bantuan</h2>
          <p class="text-xs text-[#567778] mb-4">Pilih kategori bantuan yang ingin dimohon. Tertakluk kepada kelulusan AJK Kelab.</p>
          
          <div class="space-y-3">
            <button class="w-full bg-white rounded-xl p-4 shadow-sm border border-[#D0D7D7] flex items-center justify-between hover:border-[#87BCB5] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🌊</div>
                <div class="text-left">
                  <h3 class="font-bold text-[#08151D] text-sm">Bantuan Bencana / Banjir</h3>
                  <p class="text-[#567778] text-[10px]">Untuk ahli yang terjejas</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-[#567778]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>

            <button class="w-full bg-white rounded-xl p-4 shadow-sm border border-[#D0D7D7] flex items-center justify-between hover:border-[#87BCB5] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">👶</div>
                <div class="text-left">
                  <h3 class="font-bold text-[#08151D] text-sm">Sumbangan Kelahiran Anak</h3>
                  <p class="text-[#567778] text-[10px]">Cahaya mata baru</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-[#567778]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>

            <button class="w-full bg-white rounded-xl p-4 shadow-sm border border-[#D0D7D7] flex items-center justify-between hover:border-[#87BCB5] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">🖤</div>
                <div class="text-left">
                  <h3 class="font-bold text-[#08151D] text-sm">Khairat Kematian</h3>
                  <p class="text-[#567778] text-[10px]">Ahli keluarga terdekat</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-[#567778]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'profil'" key="profil" class="space-y-6">
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 bg-[#0E303D] rounded-full flex items-center justify-center text-[#87BCB5] text-2xl font-bold border-4 border-white shadow-md">
              AF
            </div>
            <h2 class="text-xl font-bold text-[#08151D] mt-3">Ahmad Faiz Othman</h2>
            <p class="text-[#567778] text-xs">Bahagian Penguatkuasaan</p>
          </div>

          <div class="bg-white rounded-2xl p-5 shadow-sm border border-[#D0D7D7] space-y-4">
            <h3 class="font-bold text-[#08151D] text-sm border-b pb-2">Maklumat Asas</h3>
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase">No. Telefon</label>
              <input type="text" value="012-3456789" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#08151D] outline-none focus:border-[#87BCB5]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase">Alamat Semasa</label>
              <textarea class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#08151D] outline-none focus:border-[#87BCB5]" rows="2">No 12, Jalan Putrajaya, Presint 9</textarea>
            </div>
            <button class="w-full bg-[#87BCB5] text-[#08151D] font-bold py-3 rounded-xl mt-2 shadow-sm">Kemaskini Profil</button>
          </div>

          <button @click="logout" class="w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 rounded-xl transition-all">
            Log Keluar
          </button>
        </div>

      </transition>
    </div>

    <div class="absolute bottom-0 left-0 w-full bg-[#08151D] rounded-t-[30px] px-6 py-4 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.15)] z-20 pb-safe">
      
      <button @click="activeTab = 'utama'" class="flex flex-col items-center gap-1 transition-colors w-14" :class="activeTab === 'utama' ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{'fill-[#87BCB5]/20': activeTab === 'utama'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span class="text-[9px] font-bold tracking-wider">UTAMA</span>
      </button>

      <button @click="activeTab = 'aktiviti'" class="flex flex-col items-center gap-1 transition-colors w-14" :class="activeTab === 'aktiviti' ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{'fill-[#87BCB5]/20': activeTab === 'aktiviti'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="text-[9px] font-bold tracking-wider">AKTIVITI</span>
      </button>

      <button @click="activeTab = 'kedai'" class="flex flex-col items-center gap-1 transition-colors w-14" :class="activeTab === 'kedai' ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{'fill-[#87BCB5]/20': activeTab === 'kedai'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="text-[9px] font-bold tracking-wider">KEDAI</span>
      </button>

      <button @click="activeTab = 'bantuan'" class="flex flex-col items-center gap-1 transition-colors w-14" :class="activeTab === 'bantuan' ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{'fill-[#87BCB5]/20': activeTab === 'bantuan'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        <span class="text-[9px] font-bold tracking-wider">BANTUAN</span>
      </button>

      <button @click="activeTab = 'profil'" class="flex flex-col items-center gap-1 transition-colors w-14" :class="activeTab === 'profil' ? 'text-[#87BCB5]' : 'text-[#567778] hover:text-[#D0D7D7]'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{'fill-[#87BCB5]/20': activeTab === 'profil'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="text-[9px] font-bold tracking-wider">PROFIL</span>
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Guna auth store anda

const router = useRouter();
const authStore = useAuthStore();

// Kawalan tab (utama, aktiviti, kedai, bantuan, profil)
const activeTab = ref('utama');

const logout = () => {
  authStore.logout(); // Panggil fungsi logout dari Pinia/Vuex
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }

/* Safe area for mobile notch at the bottom */
.pb-safe { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }

/* Sembunyikan scrollbar tapi masih boleh scroll */
.custom-scrollbar::-webkit-scrollbar { width: 0px; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Animasi tab */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>