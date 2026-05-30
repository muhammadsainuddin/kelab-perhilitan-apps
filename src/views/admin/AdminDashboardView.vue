<template>
  <div class="space-y-6 font-sans text-gray-900 pb-10">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-gray-900 font-bold text-2xl">Selamat datang, {{ adminName }} 👋</h2>
        <p class="text-gray-500 text-sm mt-1">{{ tarikhHari }} — Ringkasan sistem kelab hari ini.</p>
      </div>
      <button @click="muatSemua" :disabled="loading"
        class="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-all border border-gray-300 shadow-sm disabled:opacity-50">
        <svg :class="['w-4 h-4', loading && 'animate-spin']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Muat Semula
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3 hover:border-emerald-300 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Ahli Aktif</p>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-3xl font-black text-gray-900 tabular-nums">
          <span v-if="loading" class="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.jumlah_aktif }}</span>
        </p>
        <p class="text-gray-500 text-xs font-medium">daripada <span class="font-bold text-gray-700">{{ stat.jumlah_staff }}</span> kakitangan</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3 hover:border-amber-300 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Tunggakan</p>
          <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        </div>
        <p class="text-3xl font-black text-amber-600 tabular-nums">
          <span v-if="loading" class="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.jumlah_tunggakan }}</span>
        </p>
        <p class="text-gray-500 text-xs font-medium">ahli belum bayar yuran {{ tahunSemasa }}</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3 hover:border-blue-300 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Pengesahan</p>
          <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-3xl font-black text-blue-600 tabular-nums">
          <span v-if="loading" class="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.menunggu_pengesahan }}</span>
        </p>
        <p class="text-gray-500 text-xs font-medium">permohonan akaun baharu</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3 hover:border-rose-300 transition-colors">
        <div class="flex items-center justify-between">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Kebajikan</p>
          <div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-3xl font-black text-rose-600 tabular-nums">
          <span v-if="loading" class="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.kebajikan_menunggu }}</span>
        </p>
        <p class="text-gray-500 text-xs font-medium">permohonan perlu diproses</p>
      </div>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 class="text-gray-900 font-bold text-lg mb-5">Akses Pantas</h3>
        <div class="space-y-3">
          <router-link v-for="link in aksesLaju" :key="link.to" :to="link.to"
            class="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all group">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', link.bg]">
              <span class="text-lg">{{ link.emoji }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-gray-900 text-sm font-bold group-hover:text-[#0F4C3A] transition-colors">{{ link.label }}</p>
              <p class="text-gray-500 text-[11px] font-medium truncate">{{ link.sub }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400 group-hover:text-[#0F4C3A] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 class="text-gray-900 font-bold text-lg">Resit Bayaran Terkini</h3>
          <router-link to="/admin/kewangan"
            class="text-[#0F4C3A] hover:text-[#166b52] font-semibold text-xs transition-colors bg-[#0F4C3A]/10 px-3 py-1.5 rounded-lg">
            Lihat semua →
          </router-link>
        </div>

        <div v-if="loadingResit" class="p-6 space-y-4">
          <div v-for="i in 5" :key="i" class="h-10 rounded-xl bg-gray-100 animate-pulse"/>
        </div>

        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th class="px-6 py-3.5 font-bold">Nama Ahli</th>
                <th class="px-4 py-3.5 font-bold hidden sm:table-cell">Keterangan</th>
                <th class="px-4 py-3.5 font-bold hidden md:table-cell">Tarikh</th>
                <th class="text-right px-6 py-3.5 font-bold">Amaun</th>
                <th class="text-center px-4 py-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="resitTerkini.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500 font-medium">Tiada rekod bayaran terkini.</td>
              </tr>
              <tr v-for="resit in resitTerkini" :key="resit.id || resit.billCode"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-3">
                  <p class="text-gray-900 font-bold text-xs">{{ resit.nama_penuh || '—' }}</p>
                  <p class="text-gray-500 text-[10px] font-mono mt-0.5">{{ resit.no_kp }}</p>
                </td>
                <td class="px-4 py-3 text-gray-700 hidden sm:table-cell max-w-[180px] truncate text-xs font-medium">
                  {{ resit.keterangan || '—' }}
                </td>
                <td class="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap text-xs font-medium">
                  {{ resit.tarikh }}
                </td>
                <td class="px-6 py-3 text-right font-black text-gray-900 tabular-nums">
                  RM {{ parseFloat(resit.amaun || 0).toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider', badgeResit(resit.status)]">
                    {{ resit.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-gray-900 font-bold text-lg">Kadar Keahlian {{ tahunSemasa }}</h3>
          <p class="text-gray-500 text-xs font-medium mt-0.5">Peratusan ahli yang telah menjelaskan yuran tahunan.</p>
        </div>
        <span class="bg-[#0F4C3A]/10 text-[#0F4C3A] px-3 py-1.5 rounded-lg text-lg font-black border border-[#0F4C3A]/20">
          {{ stat.jumlah_staff > 0 ? Math.round((stat.jumlah_aktif / stat.jumlah_staff) * 100) : 0 }}%
        </span>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-3.5 mb-5 overflow-hidden shadow-inner">
        <div
          class="h-full rounded-full bg-gradient-to-r from-[#0F4C3A] to-[#FBBF24] transition-all duration-1000 ease-out"
          :style="{ width: stat.jumlah_staff > 0 ? `${Math.round((stat.jumlah_aktif / stat.jumlah_staff) * 100)}%` : '0%' }"
        />
      </div>

      <div class="grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
        <div class="text-center">
          <p class="text-emerald-600 font-black text-2xl tabular-nums">{{ stat.jumlah_aktif }}</p>
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">Aktif / Berbayar</p>
        </div>
        <div class="text-center border-x border-gray-100">
          <p class="text-amber-500 font-black text-2xl tabular-nums">{{ stat.jumlah_tunggakan }}</p>
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">Belum Bayar</p>
        </div>
        <div class="text-center">
          <p class="text-gray-900 font-black text-2xl tabular-nums">{{ stat.jumlah_staff }}</p>
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">Jumlah Kakitangan</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';

const authStore = useAuthStore();
const adminName = computed(() => authStore.user?.name || 'Admin');
const tahunSemasa = new Date().getFullYear();

const tarikhHari = new Intl.DateTimeFormat('ms-MY', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

// ── State ──
const loading      = ref(true);
const loadingResit = ref(true);

const stat = ref({
  jumlah_aktif:        0,
  jumlah_staff:        0,
  jumlah_tunggakan:    0,
  menunggu_pengesahan: 0,
  kebajikan_menunggu:  0,
});

const resitTerkini = ref([]);

// ── Akses Pantas (Warna dikemaskini untuk Light Mode) ──
const aksesLaju = [
  { to: '/admin/ahli',      label: 'Pengurusan Ahli',  sub: 'Senarai & pendaftaran',  emoji: '👥', bg: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
  { to: '/admin/kewangan',  label: 'Buku Kewangan',    sub: 'Tunai & statistik',      emoji: '💰', bg: 'bg-amber-50 border-amber-100 text-amber-600' },
  { to: '/admin/kedai',     label: 'Marketplace',      sub: 'Produk & pesanan',       emoji: '🛍️', bg: 'bg-blue-50 border-blue-100 text-blue-600'  },
  { to: '/admin/kebajikan', label: 'Bantuan Menunggu', sub: 'Permohonan kebajikan',   emoji: '❤️', bg: 'bg-rose-50 border-rose-100 text-rose-600'   },
];

// ── Badge status resit ──
const badgeResit = (s) => {
  const status = (s || '').toUpperCase();
  if (status === 'BERJAYA') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  if (status === 'PENDING') return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (status === 'GAGAL') return 'bg-rose-100 text-rose-700 border border-rose-200';
  return 'bg-gray-100 text-gray-600 border border-gray-200';
};

// ── Muat Statistik ──
const muatStatistik = async () => {
  loading.value = true;
  try {
    // 1. Statistik tunggakan (endpoint sedia ada)
    const { data: dataTunggakan } = await api.get('/admin/statistik-tunggakan');
    if (dataTunggakan.success) {
      const { berbayar, tidak_berbayar } = dataTunggakan.data;
      stat.value.jumlah_aktif     = berbayar.total;
      stat.value.jumlah_tunggakan = tidak_berbayar.total;
      stat.value.jumlah_staff     = berbayar.total + tidak_berbayar.total;
    }

    // 2. Bilangan menunggu pengesahan
    const { data: dataEsahan } = await api.get('/admin/pengesahan');
    if (dataEsahan.success) {
      stat.value.menunggu_pengesahan = dataEsahan.data?.length ?? 0;
    }

    // 3. Bilangan kebajikan menunggu
    const { data: dataKebajikan } = await api.get('/admin/kebajikan');
    if (dataKebajikan.success) {
      stat.value.kebajikan_menunggu = (dataKebajikan.data || []).filter(
        k => k.status_permohonan === 'MENUNGGU'
      ).length;
    }

  } catch (e) {
    console.error('[DASHBOARD] Gagal muat statistik:', e.message);
  } finally {
    loading.value = false;
  }
};

// ── Muat Resit Terkini ──
const muatResit = async () => {
  loadingResit.value = true;
  try {
    const { data } = await api.get('/admin/sejarah-bayaran');
    if (data.success) {
      // Ambil 6 terkini sahaja supaya muat cantik dalam kotak
      resitTerkini.value = (data.data || []).slice(0, 6);
    }
  } catch (e) {
    console.error('[DASHBOARD] Gagal muat resit:', e.message);
  } finally {
    loadingResit.value = false;
  }
};

const muatSemua = () => {
  muatStatistik();
  muatResit();
};

onMounted(muatSemua);
</script>