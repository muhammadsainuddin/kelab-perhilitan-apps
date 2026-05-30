<template>
  <div class="space-y-5 font-sans text-gray-900 pb-10">

    <!-- ── HEADER ── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-gray-900 font-bold text-xl">Selamat datang, {{ adminName }}</h2>
        <p class="text-gray-400 text-xs mt-0.5">{{ tarikhHari }}</p>
      </div>
      <button @click="muatSemua" :disabled="loading"
        class="flex items-center gap-1.5 text-xs bg-white hover:bg-gray-50 text-gray-600 font-semibold px-3.5 py-2 rounded-xl transition-all border border-gray-200 shadow-sm disabled:opacity-50 w-fit">
        <svg :class="['w-3.5 h-3.5', loading && 'animate-spin']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Muat Semula
      </button>
    </div>

    <!-- ── ROW 1: 6 KPI CARDS ── -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">

      <!-- Ahli Aktif -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Ahli Aktif</p>
          <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
        <p class="text-2xl font-black text-gray-900 tabular-nums leading-none">
          <span v-if="loading" class="inline-block w-10 h-6 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.jumlah_aktif }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">/ {{ stat.jumlah_staff }} kakitangan</p>
      </div>

      <!-- Tunggakan -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Tunggakan</p>
          <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
        </div>
        <p class="text-2xl font-black text-amber-500 tabular-nums leading-none">
          <span v-if="loading" class="inline-block w-10 h-6 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.jumlah_tunggakan }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">belum bayar {{ tahunSemasa }}</p>
      </div>

      <!-- Baki Kewangan -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Baki</p>
          <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h.01M11 15h2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>
          </div>
        </div>
        <p class="text-lg font-black tabular-nums leading-none" :class="kewangan.baki >= 0 ? 'text-blue-600' : 'text-rose-600'">
          <span v-if="loadingKewangan" class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"/>
          <span v-else>RM {{ formatRM(kewangan.baki) }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">tahun {{ tahunSemasa }}</p>
      </div>

      <!-- Jumlah Masuk -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Masuk</p>
          <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
          </div>
        </div>
        <p class="text-lg font-black text-emerald-600 tabular-nums leading-none">
          <span v-if="loadingKewangan" class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"/>
          <span v-else>RM {{ formatRM(kewangan.jumlah_masuk) }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">penerimaan tahun ini</p>
      </div>

      <!-- Perbelanjaan -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Perbelanjaan</p>
          <div class="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
          </div>
        </div>
        <p class="text-lg font-black text-rose-500 tabular-nums leading-none">
          <span v-if="loadingKewangan" class="inline-block w-16 h-5 bg-gray-100 rounded animate-pulse"/>
          <span v-else>RM {{ formatRM(kewangan.jumlah_keluar) }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">laporan perbelanjaan</p>
      </div>

      <!-- Kebajikan Menunggu -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-tight">Kebajikan</p>
          <div class="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
        </div>
        <p class="text-2xl font-black text-rose-500 tabular-nums leading-none">
          <span v-if="loading" class="inline-block w-10 h-6 bg-gray-100 rounded animate-pulse"/>
          <span v-else>{{ stat.kebajikan_menunggu }}</span>
        </p>
        <p class="text-gray-400 text-[10px]">perlu diproses</p>
      </div>

    </div>

    <!-- ── ROW 2: KEWANGAN + KEAHLIAN + AKSES PANTAS ── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- LAPORAN KEWANGAN (2/3) -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Laporan Perbelanjaan {{ tahunSemasa }}</h3>
            <p class="text-[10px] text-gray-400 mt-0.5">Ringkasan aliran kewangan mengikut kategori</p>
          </div>
          <router-link to="/admin/kewangan" class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-2.5 py-1.5 rounded-lg transition-colors">
            Buku Penuh →
          </router-link>
        </div>

        <div class="p-5 space-y-4">
          <!-- Bar Nisbah Masuk / Keluar -->
          <div v-if="!loadingKewangan" class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <span>Masuk</span><span>Keluar</span>
            </div>
            <div class="flex h-3 rounded-full overflow-hidden bg-gray-100 shadow-inner">
              <div class="bg-emerald-500 transition-all duration-700" :style="{ width: nisbahMasuk + '%' }"></div>
              <div class="bg-rose-400 transition-all duration-700" :style="{ width: nisbahKeluar + '%' }"></div>
            </div>
            <div class="flex justify-between text-[10px] text-gray-500">
              <span class="font-bold text-emerald-600">RM {{ formatRM(kewangan.jumlah_masuk) }}</span>
              <span class="font-medium text-gray-400">Baki: <span :class="kewangan.baki >= 0 ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'">RM {{ formatRM(kewangan.baki) }}</span></span>
              <span class="font-bold text-rose-500">RM {{ formatRM(kewangan.jumlah_keluar) }}</span>
            </div>
          </div>
          <div v-else class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>

          <!-- Breakdown Kategori -->
          <div class="grid grid-cols-3 gap-3 pt-1">
            <div v-for="item in kategoriKewangan" :key="item.label"
              class="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
              <div :class="['w-6 h-6 rounded-lg flex items-center justify-center mx-auto mb-2', item.iconBg]">
                <svg class="w-3.5 h-3.5" :class="item.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
                </svg>
              </div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{{ item.label }}</p>
              <p class="text-xs font-black tabular-nums" :class="item.color">
                <span v-if="loadingKewangan" class="inline-block w-12 h-3 bg-gray-200 rounded animate-pulse"/>
                <span v-else>RM {{ formatRM(item.nilai) }}</span>
              </p>
            </div>
          </div>

          <!-- Bar aktiviti bulanan (sparkline ringkas) -->
          <div v-if="!loadingKewangan && kewangan.bulanan" class="pt-1">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Aktiviti Bulanan</p>
            <div class="flex items-end gap-0.5 h-14">
              <div v-for="(b, i) in kewangan.bulanan" :key="i" class="flex-1 flex flex-col items-center gap-0.5">
                <div class="w-full flex flex-col items-center gap-0.5" style="height:44px">
                  <div class="w-full bg-emerald-400 rounded-sm transition-all duration-500"
                    :style="{ height: maxBulanan > 0 ? Math.max(2, (b.masuk / maxBulanan) * 40) + 'px' : '2px' }"></div>
                  <div class="w-full bg-rose-300 rounded-sm transition-all duration-500"
                    :style="{ height: maxBulanan > 0 ? Math.max(2, (b.keluar / maxBulanan) * 40) + 'px' : '2px' }"></div>
                </div>
                <span class="text-[7px] text-gray-300 font-bold">{{ namaBulan[i] }}</span>
              </div>
            </div>
            <div class="flex gap-3 mt-1.5">
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-emerald-400 shrink-0"></span><span class="text-[9px] text-gray-400">Masuk</span></div>
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-rose-300 shrink-0"></span><span class="text-[9px] text-gray-400">Keluar</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- AKSES PANTAS + KADAR KEAHLIAN (1/3) -->
      <div class="space-y-4">

        <!-- Kadar Keahlian -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold text-gray-900">Kadar Keahlian {{ tahunSemasa }}</h3>
            <span class="text-xs font-black text-[#0F4C3A]">
              {{ stat.jumlah_staff > 0 ? Math.round((stat.jumlah_aktif / stat.jumlah_staff) * 100) : 0 }}%
            </span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden shadow-inner">
            <div class="h-full rounded-full bg-gradient-to-r from-[#0F4C3A] to-emerald-400 transition-all duration-1000"
              :style="{ width: stat.jumlah_staff > 0 ? `${Math.round((stat.jumlah_aktif / stat.jumlah_staff) * 100)}%` : '0%' }"/>
          </div>
          <div class="flex justify-between text-center">
            <div>
              <p class="text-base font-black text-emerald-600 tabular-nums">{{ stat.jumlah_aktif }}</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Berbayar</p>
            </div>
            <div class="border-x border-gray-100 px-4">
              <p class="text-base font-black text-amber-500 tabular-nums">{{ stat.jumlah_tunggakan }}</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Tunggakan</p>
            </div>
            <div>
              <p class="text-base font-black text-gray-900 tabular-nums">{{ stat.jumlah_staff }}</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase">Jumlah</p>
            </div>
          </div>
        </div>

        <!-- Akses Pantas -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 class="text-xs font-bold text-gray-900 mb-3">Akses Pantas</h3>
          <div class="space-y-2">
            <router-link v-for="link in aksesLaju" :key="link.to" :to="link.to"
              class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all group">
              <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-sm', link.bg]">{{ link.emoji }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-800 text-xs font-bold group-hover:text-[#0F4C3A] transition-colors leading-tight">{{ link.label }}</p>
                <p class="text-gray-400 text-[9px] truncate">{{ link.sub }}</p>
              </div>
              <svg class="w-3 h-3 text-gray-300 group-hover:text-[#0F4C3A] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- ── ROW 3: MARKETPLACE STATS ── -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-900">Marketplace — Ringkasan Pesanan</h3>
        </div>
        <router-link to="/admin/kedai" class="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
          Urus Pesanan →
        </router-link>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        <div v-for="item in statMarketplace" :key="item.label" class="p-4 text-center">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{{ item.label }}</p>
          <p class="text-lg font-black tabular-nums" :class="item.color">
            <span v-if="loadingResit" class="inline-block w-10 h-5 bg-gray-100 rounded animate-pulse"/>
            <span v-else>{{ item.nilai }}</span>
          </p>
          <p v-if="item.rm" class="text-[9px] text-gray-400 mt-0.5">{{ item.rm }}</p>
        </div>
      </div>
    </div>

    <!-- ── ROW 4: RESIT BAYARAN TERKINI (BAWAH) ── -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Resit Bayaran Terkini</h3>
          <p class="text-[10px] text-gray-400 mt-0.5">Yuran & transaksi marketplace terbaharu</p>
        </div>
        <router-link to="/admin/bayaran" class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-2.5 py-1.5 rounded-lg transition-colors">
          Lihat Semua →
        </router-link>
      </div>

      <div v-if="loadingResit" class="p-5 space-y-3">
        <div v-for="i in 5" :key="i" class="h-8 rounded-lg bg-gray-100 animate-pulse"/>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/80 text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 font-bold">Ahli</th>
              <th class="px-4 py-3 font-bold hidden sm:table-cell">Butiran</th>
              <th class="px-4 py-3 font-bold hidden md:table-cell">No. Bil</th>
              <th class="px-4 py-3 font-bold hidden lg:table-cell">Tarikh</th>
              <th class="text-right px-5 py-3 font-bold">Amaun</th>
              <th class="text-center px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="resitTerkini.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-gray-400 text-xs font-medium">Tiada rekod bayaran terkini.</td>
            </tr>
            <tr v-for="resit in resitTerkini" :key="resit.billCode" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-2.5">
                <p class="text-gray-900 font-bold text-xs">{{ resit.nama_penuh || '—' }}</p>
                <p class="text-gray-400 text-[9px] font-mono mt-0.5">{{ resit.no_kp }}</p>
              </td>
              <td class="px-4 py-2.5 hidden sm:table-cell">
                <p class="text-gray-600 text-xs font-medium truncate max-w-[200px]">{{ resit.keterangan || '—' }}</p>
              </td>
              <td class="px-4 py-2.5 hidden md:table-cell">
                <span class="text-gray-400 text-[10px] font-mono">{{ resit.billCode || '—' }}</span>
              </td>
              <td class="px-4 py-2.5 hidden lg:table-cell">
                <span class="text-gray-500 text-[10px] whitespace-nowrap">{{ resit.tarikh }}</span>
              </td>
              <td class="px-5 py-2.5 text-right font-black text-xs tabular-nums text-gray-900">
                RM {{ parseFloat(resit.amaun || 0).toFixed(2) }}
              </td>
              <td class="px-4 py-2.5 text-center">
                <span :class="['text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border', badgeResit(resit.status)]">
                  {{ resit.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';

const authStore = useAuthStore();
const adminName   = computed(() => authStore.user?.name || 'Admin');
const tahunSemasa = new Date().getFullYear();

const tarikhHari = new Intl.DateTimeFormat('ms-MY', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

const namaBulan = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogs','Sep','Okt','Nov','Dis'];

// ── State ──
const loading         = ref(true);
const loadingKewangan = ref(true);
const loadingResit    = ref(true);

const stat = ref({ jumlah_aktif: 0, jumlah_staff: 0, jumlah_tunggakan: 0, kebajikan_menunggu: 0 });
const kewangan = ref({ jumlah_masuk: 0, jumlah_keluar: 0, baki: 0, by_kategori: [], bulanan: [] });
const resitTerkini = ref([]);
const statMarketplace = ref([
  { label: 'Jumlah Pesanan', nilai: 0, color: 'text-gray-900' },
  { label: 'Jumlah Berjaya', nilai: 0, color: 'text-emerald-600', rm: '' },
  { label: 'Pending', nilai: 0, color: 'text-amber-500' },
  { label: 'Hasil Marketplace', nilai: 'RM 0', color: 'text-blue-600' },
]);

// ── Helpers ──
const formatRM = (v) => {
  const n = parseFloat(v) || 0;
  return n >= 1000
    ? n.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toFixed(2);
};

const nisbahMasuk = computed(() => {
  const total = kewangan.value.jumlah_masuk + kewangan.value.jumlah_keluar;
  return total > 0 ? Math.round((kewangan.value.jumlah_masuk / total) * 100) : 0;
});
const nisbahKeluar = computed(() => 100 - nisbahMasuk.value);

const maxBulanan = computed(() =>
  Math.max(...(kewangan.value.bulanan || []).map(b => Math.max(b.masuk, b.keluar)), 1)
);

const kategoriKewangan = computed(() => {
  const getVal = (key) => {
    const row = (kewangan.value.by_kategori || []).find(k => k.kategori === key);
    return row ? parseFloat(row.jumlah) : 0;
  };
  return [
    { label: 'Yuran Ahli', nilai: getVal('YURAN'),     color: 'text-emerald-600', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Kedai/Merch', nilai: getVal('KEDAI'),     color: 'text-blue-600',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { label: 'Perbelanjaan', nilai: kewangan.value.jumlah_keluar, color: 'text-rose-500', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', icon: 'M17 13l-5 5m0 0l-5-5m5 5V6' },
  ];
});

const badgeResit = (s) => {
  const status = (s || '').toUpperCase();
  if (status === 'BERJAYA') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'PENDING')  return 'bg-amber-50 text-amber-600 border-amber-200';
  if (status === 'GAGAL')    return 'bg-rose-50 text-rose-600 border-rose-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const aksesLaju = [
  { to: '/admin/ahli',      label: 'Pengurusan Ahli',       sub: 'Senarai & pendaftaran',  emoji: '👥', bg: 'bg-emerald-50 border-emerald-100' },
  { to: '/admin/kewangan',  label: 'Laporan Perbelanjaan',  sub: 'Buku tunai & statistik',  emoji: '📊', bg: 'bg-amber-50 border-amber-100' },
  { to: '/admin/kedai',     label: 'Marketplace',           sub: 'Produk & pesanan ahli',  emoji: '🛍️', bg: 'bg-blue-50 border-blue-100' },
  { to: '/admin/kebajikan', label: 'Bantuan Kebajikan',     sub: 'Semakan permohonan',     emoji: '❤️', bg: 'bg-rose-50 border-rose-100' },
];

// ── API Calls ──
const muatStatistik = async () => {
  loading.value = true;
  try {
    const [resTunggakan, resKebajikan] = await Promise.all([
      api.get('/admin/statistik-tunggakan'),
      api.get('/admin/kebajikan'),
    ]);
    if (resTunggakan.data.success) {
      const { berbayar, tidak_berbayar } = resTunggakan.data.data;
      stat.value.jumlah_aktif     = berbayar.total;
      stat.value.jumlah_tunggakan = tidak_berbayar.total;
      stat.value.jumlah_staff     = berbayar.total + tidak_berbayar.total;
    }
    if (resKebajikan.data.success) {
      stat.value.kebajikan_menunggu = (resKebajikan.data.data || []).filter(k => k.status_permohonan === 'MENUNGGU').length;
    }
  } catch (e) { console.error('[DASHBOARD] stat:', e.message); }
  finally { loading.value = false; }
};

const muatKewangan = async () => {
  loadingKewangan.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/statistik?tahun=${tahunSemasa}`);
    if (data.success) kewangan.value = data.data;
  } catch (e) { console.error('[DASHBOARD] kewangan:', e.message); }
  finally { loadingKewangan.value = false; }
};

const muatResit = async () => {
  loadingResit.value = true;
  try {
    const { data } = await api.get('/admin/sejarah-bayaran');
    if (data.success) {
      const semua = data.data || [];
      resitTerkini.value = semua.slice(0, 8);

      // Kira stat marketplace dari data pesanan kedai yang ada dalam semua resit
      const kedai = semua.filter(r => (r.keterangan || '').toLowerCase().includes('kedai') || (r.keterangan || '').toLowerCase().includes('pesanan'));
      const berjaya = kedai.filter(r => r.status === 'BERJAYA');
      const pending  = kedai.filter(r => r.status === 'PENDING');
      const hasilRM  = berjaya.reduce((sum, r) => sum + parseFloat(r.amaun || 0), 0);

      statMarketplace.value = [
        { label: 'Jumlah Pesanan',   nilai: kedai.length,               color: 'text-gray-900'    },
        { label: 'Berjaya',          nilai: berjaya.length,             color: 'text-emerald-600' },
        { label: 'Pending',          nilai: pending.length,             color: 'text-amber-500'   },
        { label: 'Hasil Marketplace', nilai: `RM ${formatRM(hasilRM)}`, color: 'text-blue-600'    },
      ];
    }
  } catch (e) { console.error('[DASHBOARD] resit:', e.message); }
  finally { loadingResit.value = false; }
};

const muatSemua = () => {
  muatStatistik();
  muatKewangan();
  muatResit();
};

onMounted(muatSemua);
</script>
