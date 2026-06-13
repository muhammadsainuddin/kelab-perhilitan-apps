<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 font-sans">

    <aside :class="[
        'flex flex-col bg-[#08151D] border-r border-white/5 transition-all duration-500 ease-in-out z-40 shadow-2xl',
        sidebarOpen ? 'w-[260px]' : 'w-20',
        'fixed inset-y-0 left-0 md:relative md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">

      <div class="flex items-center gap-4 px-5 py-6 border-b border-white/10 shrink-0">
        <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-white/10 shadow-lg p-1">
          <img src="/logo.png" alt="Logo Kelab" class="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <Transition name="fade-text">
          <div v-if="sidebarOpen" class="whitespace-nowrap overflow-hidden">
            <h2 class="text-white font-black text-sm tracking-wide leading-tight">Kelab PERHILITAN</h2>
            <p class="text-[#87BCB5] text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">Sistem Admin</p>
          </div>
        </Transition>
      </div>

      <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-6 custom-scrollbar">
        <div v-for="group in menuGroups" :key="group.title">
          
          <Transition name="fade-text">
            <h3 v-if="sidebarOpen" class="px-3 text-[10px] font-black uppercase tracking-widest text-[#567778] mb-2 whitespace-nowrap">
              {{ group.title }}
            </h3>
            <div v-else class="h-4"></div> </Transition>

          <div class="space-y-1.5">
            <router-link v-for="item in group.items" :key="item.name"
              :to="item.to" custom v-slot="{ isActive, navigate }">
              <button @click="navigate" :title="!sidebarOpen ? item.label : ''"
                :class="[
                  'w-full flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-300 group text-left relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-[#0F4C3A] to-[#0E303D] text-white shadow-md border border-[#87BCB5]/20'
                    : 'text-[#D0D7D7] hover:bg-white/5 hover:text-white'
                ]">
                
                <div v-if="isActive" class="absolute left-0 top-0 bottom-0 w-1 bg-[#FBBF24] rounded-r-md"></div>

                <span :class="[
                    'w-5 h-5 shrink-0 flex items-center justify-center transition-transform duration-300',
                    isActive ? 'text-[#FBBF24] scale-110' : 'text-[#567778] group-hover:text-[#87BCB5]'
                  ]">
                  <svg v-if="item.icon==='home'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <svg v-else-if="item.icon==='users'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  <svg v-else-if="item.icon==='chart'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  <svg v-else-if="item.icon==='shop'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  <svg v-else-if="item.icon==='heart'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  <svg v-else-if="item.icon==='calendar'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <svg v-else-if="item.icon==='payment'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h.01M11 15h2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>
                  <svg v-else-if="item.icon==='exit'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  <svg v-else-if="item.icon==='settings'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg v-else-if="item.icon==='gift'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                </span>

                <Transition name="fade-text">
                  <span v-if="sidebarOpen" class="text-sm font-semibold whitespace-nowrap">{{ item.label }}</span>
                </Transition>
                
              </button>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- PROFIL RINGKAS + KREDIT -->
      <Transition name="fade-text">
        <div v-if="sidebarOpen" class="px-4 py-3 border-t border-white/10 select-none">
          <!-- Profil Ringkas -->
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img v-if="adminPhoto" :src="adminPhoto" :alt="adminName"
                class="w-full h-full object-cover"
                @error="e => e.target.style.display='none'">
              <div :class="['w-full h-full bg-gradient-to-br from-[#0F4C3A] to-[#0a2e23] flex items-center justify-center', adminPhoto ? 'hidden' : '']">
                <span class="text-white text-sm font-black">{{ adminInitial }}</span>
              </div>
            </div>
            <div class="min-w-0">
              <p class="text-white text-xs font-bold truncate leading-tight">{{ adminName }}</p>
              <p class="text-[#567778] text-[9px] uppercase tracking-wider mt-0.5">{{ authStore.user?.role || 'Admin' }}</p>
            </div>
          </div>
          <!-- Versi + Info -->
          <div class="flex items-center justify-between pt-2 border-t border-white/10">
            <span class="text-[9px] font-bold" style="color: #87BCB5;">
              v{{ appVersion }} · {{ appBuildDate }}
            </span>
            <button @click="showInfoSistem = true" title="Maklumat Sistem"
              class="w-6 h-6 flex items-center justify-center rounded-full text-[#567778] hover:text-[#87BCB5] hover:bg-white/10 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </Transition>

      <button @click="sidebarOpen = !sidebarOpen"
        class="hidden md:flex items-center justify-center p-4 border-t border-white/10 text-[#567778] hover:text-white hover:bg-white/5 transition-colors">
        <svg :class="['w-5 h-5 transition-transform duration-500', sidebarOpen ? '' : 'rotate-180']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
    </aside>

    <Transition name="fade">
      <div v-if="sidebarOpen" class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" @click="sidebarOpen = false"></div>
    </Transition>


    <div class="flex-1 flex flex-col overflow-hidden">

      <header class="bg-white border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm shrink-0 z-20">
        
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = true" class="md:hidden text-gray-500 hover:text-[#0F4C3A] transition-colors p-1">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div class="hidden md:block">
            <h1 class="text-gray-900 font-bold text-lg leading-tight">{{ pageTitle }}</h1>
            <p class="text-gray-500 text-xs font-medium">{{ pageSubtitle }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative" ref="dropdownRef">
            <button @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-2 py-1.5 transition-all shadow-sm">
              <div class="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-inner">
                <img v-if="adminPhoto" :src="adminPhoto" :alt="adminName"
                  class="w-full h-full object-cover"
                  @error="e => e.target.style.display='none'">
                <div :class="['w-full h-full bg-gradient-to-br from-[#0F4C3A] to-[#08151D] flex items-center justify-center', adminPhoto ? 'hidden' : '']">
                  <span class="text-white text-xs font-bold">{{ adminInitial }}</span>
                </div>
              </div>
              <span class="text-gray-700 text-xs font-bold hidden sm:block px-1">{{ adminName }}</span>
              <svg class="w-3.5 h-3.5 text-gray-400 hidden sm:block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <Transition name="dropdown">
              <div v-if="dropdownOpen" class="absolute right-0 top-14 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                <div class="px-4 py-3 border-b border-gray-50 sm:hidden">
                  <p class="text-xs font-bold text-gray-900 truncate">{{ adminName }}</p>
                  <p class="text-[10px] text-gray-500 uppercase tracking-wider">Pentadbir</p>
                </div>
                <router-link to="/admin/profil" @click="dropdownOpen = false"
                  class="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-700 hover:text-[#0F4C3A] hover:bg-emerald-50 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  Profil Pentadbir
                </router-link>
                <div class="h-px bg-gray-100 my-1"></div>
                <button @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  Log Keluar
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-hidden relative">
        <div class="h-full overflow-y-auto bg-gray-50/50 p-4 md:p-8 custom-scrollbar">
          <div class="md:hidden mb-6 mt-2">
            <h1 class="text-gray-900 font-bold text-xl leading-tight">{{ pageTitle }}</h1>
            <p class="text-gray-500 text-xs font-medium mt-1">{{ pageSubtitle }}</p>
          </div>

          <router-view v-slot="{ Component }">
            <transition name="fade-page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>

    </div>
  </div>

  <!-- Modal Info Sistem -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showInfoSistem" class="fixed inset-0 z-[70] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);"
        @click.self="showInfoSistem = false">
        <div class="bg-[#08151D] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-[#87BCB5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-white text-sm font-bold">Maklumat Sistem</span>
            </div>
            <button @click="showInfoSistem = false"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-[#567778] hover:text-white hover:bg-white/10 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- Body -->
          <div class="p-5 space-y-4">
            <!-- Versi -->
            <div class="flex items-center justify-between">
              <span class="text-[#567778] text-xs">Versi Sistem</span>
              <span class="text-[8px] font-black px-2 py-1 rounded-full" style="background: rgba(135,188,181,0.12); color: #87BCB5; border: 1px solid rgba(135,188,181,0.2);">
                v{{ appVersion }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#567778] text-xs">Tarikh Kemaskini</span>
              <span class="text-[#87BCB5] text-xs font-bold">{{ appBuildDate }}</span>
            </div>
            <div class="h-px bg-white/10"></div>
            <!-- Pembangun -->
            <div class="flex items-center justify-between">
              <span class="text-[#567778] text-xs">Dibangunkan oleh</span>
              <span class="text-white text-xs font-bold">Muhammad.S</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#567778] text-xs">Backend & Infrastruktur</span>
              <span class="inline-flex items-center gap-1 text-[#87BCB5] text-xs font-black">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-4.35-7-10a7 7 0 1114 0c0 5.65-7 10-7 10z"/><circle cx="12" cy="11" r="2.2"/></svg>
                AiGeo
              </span>
            </div>
            <div class="h-px bg-white/10"></div>
            <p class="text-[10px] text-[#567778]/60 text-center leading-relaxed">
              Sistem Pengurusan Kelab PERHILITAN<br/>Hak Cipta Terpelihara &copy; {{ new Date().getFullYear() }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';

const router    = useRouter();
const route     = useRoute();
const authStore = useAuthStore();

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

// Semak peranti (Desktop/Mobile) untuk status awal sidebar
const appVersion   = __APP_VERSION__;
const appBuildDate = __APP_BUILD_DATE__;
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
const sidebarOpen    = ref(isDesktop);
const dropdownOpen   = ref(false);
const dropdownRef    = ref(null);
const showInfoSistem = ref(false);

const adminName    = computed(() => authStore.user?.name || 'Admin');
const adminInitial = computed(() => adminName.value.charAt(0).toUpperCase());
const adminPhoto   = computed(() => {
  const g = authStore.user?.gambar;
  return g ? `${apiBase}/uploads/images/${g}` : null;
});

const muatGambarProfil = async () => {
  try {
    const { data } = await api.get('/admin/profil-saya');
    if (data.success && data.data?.gambar !== undefined) {
      authStore.user = { ...authStore.user, gambar: data.data.gambar };
    }
  } catch { /* senyap */ }
};

const pageTitles = {
  '/admin':            { title: 'Dashboard Induk',      sub: 'Ringkasan menyeluruh status sistem' },
  '/admin/dashboard':  { title: 'Dashboard Induk',      sub: 'Ringkasan menyeluruh status sistem' },
  '/admin/ahli':       { title: 'Pengurusan Ahli',      sub: 'Urus pendaftaran dan rekod keahlian' },
  '/admin/kewangan':   { title: 'Laporan Perbelanjaan',  sub: 'Pemantauan aliran tunai dan buku kewangan' },
  '/admin/kedai':      { title: 'Kedai Kelab (Merch)',  sub: 'Urus inventori dan tempahan ahli' },
  '/admin/kebajikan':  { title: 'Bantuan Kebajikan',    sub: 'Semakan dan kelulusan sumbangan ahli' },
  '/admin/aktiviti':   { title: 'Acara & Sukan',        sub: 'Urus hebahan dan peserta program' },
  '/admin/bayaran':    { title: 'Sejarah Bayaran FPX',  sub: 'Pemantauan transaksi dan resit pembayaran' },
  '/admin/profil':     { title: 'Profil Pentadbir',     sub: 'Urus maklumat peribadi dan keselamatan akaun' },
  '/admin/berhenti':   { title: 'Permohonan Berhenti',  sub: 'Semak dan proses permohonan penarikan keahlian' },
  '/admin/sumbangan': { title: 'Kempen Sumbangan',     sub: 'Urus kempen bantuan dan rekod sumbangan ahli' },
  '/admin/tetapan':   { title: 'Tetapan Sistem',       sub: 'Urus keaktifan modul aplikasi ahli' },
};
const pageTitle    = computed(() => pageTitles[route.path]?.title ?? 'Pentadbiran');
const pageSubtitle = computed(() => pageTitles[route.path]?.sub   ?? '');

// ── Kumpulan Menu (Berstruktur) ──
const menuGroups = [
  {
    title: 'Utama',
    items: [
      { name: 'dashboard', to: '/admin/dashboard', label: 'Dashboard', icon: 'home' }
    ]
  },
  {
    title: 'Pentadbiran',
    items: [
      { name: 'ahli',     to: '/admin/ahli',     label: 'Rekod Ahli',    icon: 'users' },
      { name: 'bayaran',  to: '/admin/bayaran',  label: 'Resit Bayaran', icon: 'payment' },
      { name: 'kewangan', to: '/admin/kewangan', label: 'Perbelanjaan', icon: 'chart' },
    ]
  },
  {
    title: 'Modul Sistem',
    items: [
      { name: 'kedai',     to: '/admin/kedai',     label: 'Marketplace',      icon: 'shop' },
      { name: 'kebajikan', to: '/admin/kebajikan', label: 'Kebajikan',        icon: 'heart' },
      { name: 'aktiviti',  to: '/admin/aktiviti',  label: 'Acara Kelab',      icon: 'calendar' },
      { name: 'berhenti',   to: '/admin/berhenti',   label: 'Berhenti Ahli',    icon: 'exit' },
      { name: 'sumbangan', to: '/admin/sumbangan', label: 'Kempen Sumbangan', icon: 'gift' },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { name: 'tetapan', to: '/admin/tetapan', label: 'Tetapan', icon: 'settings' },
    ]
  }
];

const handleLogout = () => { 
  if(confirm("Anda pasti mahu log keluar?")) {
    authStore.logout(); 
    router.push('/login'); 
  }
};

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) dropdownOpen.value = false;
};

// Tutup sidebar secara automatik di mobile apabila route bertukar
watch(() => route.path, () => {
  if (window.innerWidth < 768) sidebarOpen.value = false;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  muatGambarProfil();
});
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }

/* Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
main.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; }

/* Transitions */
.fade-text-enter-active, .fade-text-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-text-enter-from, .fade-text-leave-to { opacity: 0; transform: translateX(-5px); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: top right; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-page-enter-active, .fade-page-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-page-enter-from { opacity: 0; transform: translateY(10px); }
.fade-page-leave-to { opacity: 0; transform: translateY(-10px); }
</style>