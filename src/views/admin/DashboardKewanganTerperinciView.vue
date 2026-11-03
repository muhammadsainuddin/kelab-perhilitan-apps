<template>
  <div class="space-y-5">
    <section class="overflow-hidden rounded-3xl bg-gradient-to-br from-[#073b30] via-[#0F4C3A] to-[#176b52] text-white shadow-xl shadow-emerald-950/10">
      <div class="relative px-5 py-6 md:px-8 md:py-8">
        <div class="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5"></div>
        <div class="absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-emerald-300/10"></div>
        <div class="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Pengurusan Kewangan Kelab</p>
            <h2 class="mt-1.5 text-2xl font-black tracking-tight">Dashboard Kewangan</h2>
            <p class="mt-1 max-w-xl text-xs leading-relaxed text-emerald-100/80">Prestasi keseluruhan, operasi biasa dan acara khas bagi tahun {{ tahun }}.</p>
          </div>
          <label class="flex w-fit items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-sm">
            <span class="text-[9px] font-black uppercase tracking-wider text-emerald-100/70">Tahun</span>
            <select v-model="tahun" class="bg-transparent text-sm font-black text-white outline-none">
              <option v-for="item in pilihanTahun" :key="item" :value="item" class="text-gray-900">{{ item }}</option>
            </select>
          </label>
        </div>
        <div class="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p class="text-[9px] font-black uppercase tracking-wider text-emerald-100/65">Jumlah Pendapatan</p>
            <p class="mt-1.5 text-xl font-black tabular-nums">RM {{ formatRM(data.jumlah_pendapatan) }}</p>
            <p class="mt-1 text-[9px] text-emerald-100/60">Semua sumber kewangan</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p class="text-[9px] font-black uppercase tracking-wider text-emerald-100/65">Jumlah Perbelanjaan</p>
            <p class="mt-1.5 text-xl font-black tabular-nums">RM {{ formatRM(data.jumlah_perbelanjaan) }}</p>
            <p class="mt-1 text-[9px] text-emerald-100/60">Operasi dan acara khas</p>
          </div>
          <div class="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 backdrop-blur-sm">
            <p class="text-[9px] font-black uppercase tracking-wider text-amber-100/70">Baki Keseluruhan</p>
            <p class="mt-1.5 text-xl font-black tabular-nums">RM {{ formatRM(data.baki_akhir) }}</p>
            <p class="mt-1 text-[9px] text-amber-100/60">Termasuk baki bawa RM {{ formatRM(data.baki_bawa) }}</p>
          </div>
        </div>
      </div>
    </section>

    <div v-if="memuat" class="space-y-5">
      <div class="h-20 animate-pulse rounded-2xl bg-gray-100"></div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3"><div v-for="i in 3" :key="i" class="h-28 animate-pulse rounded-2xl bg-gray-100"></div></div>
      <div class="h-80 animate-pulse rounded-2xl bg-gray-100"></div>
    </div>

    <template v-else>
      <nav class="grid grid-cols-1 gap-2 rounded-2xl border border-gray-200 bg-gray-100/70 p-1.5 shadow-sm sm:grid-cols-2" role="tablist" aria-label="Skop kewangan">
        <button type="button" role="tab" :aria-selected="tabAktif === 'biasa'" @click="tabAktif = 'biasa'"
          :class="['group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left transition-all', tabAktif === 'biasa' ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60']">
          <span><span class="block text-xs font-black">Kewangan Operasi Biasa</span><span class="mt-0.5 block text-[9px] font-semibold text-gray-400">Urusan harian tanpa acara khas</span></span>
          <span :class="['rounded-lg px-2.5 py-1.5 text-[10px] font-black tabular-nums', tabAktif === 'biasa' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200/60 text-gray-500']">RM {{ formatRingkas(data.jumlah_pendapatan_biasa) }}</span>
        </button>
        <button type="button" role="tab" :aria-selected="tabAktif === 'acara'" @click="tabAktif = 'acara'"
          :class="['group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left transition-all', tabAktif === 'acara' ? 'bg-white text-violet-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-white/60']">
          <span><span class="block text-xs font-black">Kewangan Acara Khas</span><span class="mt-0.5 block text-[9px] font-semibold text-gray-400">Semua transaksi bertag acara</span></span>
          <span :class="['rounded-lg px-2.5 py-1.5 text-[10px] font-black tabular-nums', tabAktif === 'acara' ? 'bg-violet-50 text-violet-700' : 'bg-gray-200/60 text-gray-500']">{{ acaraKhas.length }} acara</span>
        </button>
      </nav>

      <section :class="['overflow-hidden rounded-2xl border bg-white shadow-sm', tabAktif === 'biasa' ? 'border-emerald-100' : 'border-violet-100']">
        <header :class="['flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between', tabAktif === 'biasa' ? 'border-emerald-100 bg-emerald-50/50' : 'border-violet-100 bg-violet-50/50']">
          <div><p :class="['text-[9px] font-black uppercase tracking-[0.2em]', tabAktif === 'biasa' ? 'text-emerald-600' : 'text-violet-600']">{{ tabAktif === 'biasa' ? 'Operasi Biasa' : 'Acara Khas' }}</p><h3 class="mt-1 text-sm font-black text-gray-900">Ringkasan prestasi tahun {{ tahun }}</h3></div>
          <p class="text-[10px] font-semibold text-gray-400">{{ tabAktif === 'biasa' ? 'Tidak termasuk transaksi bertag acara' : 'Hanya transaksi yang dipautkan kepada acara' }}</p>
        </header>
        <div class="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div class="p-5">
            <div class="flex items-center justify-between"><p class="text-[9px] font-black uppercase tracking-wider text-gray-400">Pendapatan</p><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span></div>
            <p class="mt-2 text-xl font-black tabular-nums text-gray-900">RM {{ formatRM(jumlahMasukAktif) }}</p>
            <p class="mt-1 text-[9px] font-semibold text-emerald-600">{{ bilPendapatanAktif }} rekod sumber</p>
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between"><p class="text-[9px] font-black uppercase tracking-wider text-gray-400">Perbelanjaan</p><span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span></div>
            <p class="mt-2 text-xl font-black tabular-nums text-gray-900">RM {{ formatRM(jumlahKeluarAktif) }}</p>
            <p class="mt-1 text-[9px] font-semibold text-rose-600">{{ bilPerbelanjaanAktif }} rekod bayaran</p>
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between"><p class="text-[9px] font-black uppercase tracking-wider text-gray-400">Lebihan / Kurangan</p><span :class="['h-2.5 w-2.5 rounded-full', bakiAktif >= 0 ? 'bg-sky-500' : 'bg-orange-500']"></span></div>
            <p :class="['mt-2 text-xl font-black tabular-nums', bakiAktif >= 0 ? 'text-sky-700' : 'text-orange-700']">RM {{ formatRM(bakiAktif) }}</p>
            <p class="mt-1 text-[9px] font-semibold text-gray-400">Bagi tahun {{ tahun }} sahaja</p>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
          <div class="mb-4 flex items-start justify-between gap-3">
            <div><p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Trend Bulanan</p><h3 class="mt-1 text-sm font-black text-gray-900">Aliran masuk dan keluar</h3></div>
            <div class="flex items-center gap-3 text-[9px] font-bold text-gray-500"><span class="flex items-center gap-1.5"><i class="h-2 w-2 rounded-full bg-emerald-500"></i>Masuk</span><span class="flex items-center gap-1.5"><i class="h-2 w-2 rounded-full bg-rose-500"></i>Keluar</span></div>
          </div>
          <div class="relative h-72"><canvas ref="aliranChartRef" aria-label="Graf aliran kewangan bulanan"></canvas></div>
        </section>
        <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div class="mb-4"><p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Agihan Perbelanjaan</p><h3 class="mt-1 text-sm font-black text-gray-900">Komposisi mengikut kategori</h3></div>
          <div v-if="perbelanjaanBergraf.length" class="relative h-72"><canvas ref="kategoriChartRef" aria-label="Graf komposisi perbelanjaan"></canvas></div>
          <div v-else class="flex h-72 flex-col items-center justify-center rounded-xl bg-gray-50 text-center"><p class="text-xs font-black text-gray-500">Belum ada perbelanjaan</p><p class="mt-1 text-[10px] text-gray-400">Tiada data bagi tahun {{ tahun }}.</p></div>
        </section>
      </div>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section class="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <header class="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/40 px-5 py-4">
            <div><p class="text-[9px] font-black uppercase tracking-widest text-emerald-600">Sumber Kewangan</p><h3 class="mt-1 text-sm font-black text-gray-900">{{ tabAktif === 'biasa' ? 'Pendapatan operasi biasa' : 'Pendapatan acara khas' }}</h3></div>
            <span class="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-emerald-700 shadow-sm">RM {{ formatRM(jumlahMasukAktif) }}</span>
          </header>
          <div v-if="senaraiPendapatanAktif.length" class="divide-y divide-gray-100">
            <div v-for="item in senaraiPendapatanAktif" :key="item.kategori" class="px-5 py-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0"><p class="truncate text-xs font-bold text-gray-800">{{ item.nama }}</p><p class="mt-0.5 text-[9px] font-semibold text-gray-400">{{ item.bil }} rekod · {{ item.peratus.toFixed(1) }}%</p></div>
                <p class="shrink-0 text-xs font-black tabular-nums text-emerald-700">RM {{ formatRM(item.jumlah) }}</p>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-50"><div class="h-full rounded-full bg-emerald-500" :style="{ width: `${item.peratus}%` }"></div></div>
            </div>
          </div>
          <div v-else class="px-5 py-12 text-center"><p class="text-xs font-bold text-gray-500">Tiada sumber kewangan direkodkan.</p></div>
        </section>
        <section class="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
          <header class="flex items-center justify-between border-b border-rose-100 bg-rose-50/40 px-5 py-4">
            <div><p class="text-[9px] font-black uppercase tracking-widest text-rose-600">Penggunaan Dana</p><h3 class="mt-1 text-sm font-black text-gray-900">{{ tabAktif === 'biasa' ? 'Perbelanjaan operasi biasa' : 'Perbelanjaan acara khas' }}</h3></div>
            <span class="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-rose-700 shadow-sm">RM {{ formatRM(jumlahKeluarAktif) }}</span>
          </header>
          <div v-if="senaraiPerbelanjaanAktif.length" class="divide-y divide-gray-100">
            <div v-for="item in senaraiPerbelanjaanAktif" :key="item.kategori" class="px-5 py-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0"><p class="truncate text-xs font-bold text-gray-800">{{ item.nama }}</p><p class="mt-0.5 text-[9px] font-semibold text-gray-400">{{ item.bil }} rekod · {{ item.peratus.toFixed(1) }}%</p></div>
                <p class="shrink-0 text-xs font-black tabular-nums text-rose-700">RM {{ formatRM(item.jumlah) }}</p>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-rose-50"><div class="h-full rounded-full bg-rose-500" :style="{ width: `${item.peratus}%` }"></div></div>
            </div>
          </div>
          <div v-else class="px-5 py-12 text-center"><p class="text-xs font-bold text-gray-500">Tiada perbelanjaan direkodkan.</p></div>
        </section>
      </div>

      <section v-if="tabAktif === 'acara'" class="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
        <header class="flex flex-col gap-2 border-b border-violet-100 bg-violet-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p class="text-[9px] font-black uppercase tracking-widest text-violet-600">Prestasi Acara</p><h3 class="mt-1 text-sm font-black text-gray-900">Ringkasan setiap acara khas</h3></div>
          <span class="w-fit rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-violet-700 shadow-sm">{{ acaraKhas.length }} acara</span>
        </header>
        <div v-if="acaraKhas.length" class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="acara in acaraKhas" :key="acara.id" class="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
            <div class="flex items-start justify-between gap-3 p-4">
              <div class="min-w-0"><p class="truncate text-xs font-black text-gray-900">{{ acara.nama }}</p><p class="mt-1 truncate text-[9px] text-gray-400">{{ formatTempoh(acara) }}</p></div>
              <span :class="['shrink-0 rounded-full px-2 py-1 text-[8px] font-black uppercase', acara.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">{{ acara.status }}</span>
            </div>
            <div class="grid grid-cols-3 border-y border-gray-100 bg-gray-50/60 py-3 text-center">
              <div><p class="text-[8px] font-bold uppercase text-gray-400">Masuk</p><p class="mt-1 text-[10px] font-black text-emerald-700">RM {{ formatRingkas(acara.jumlah_masuk) }}</p></div>
              <div class="border-x border-gray-200"><p class="text-[8px] font-bold uppercase text-gray-400">Keluar</p><p class="mt-1 text-[10px] font-black text-rose-700">RM {{ formatRingkas(acara.jumlah_keluar) }}</p></div>
              <div><p class="text-[8px] font-bold uppercase text-gray-400">Baki</p><p :class="['mt-1 text-[10px] font-black', acara.baki >= 0 ? 'text-sky-700' : 'text-orange-700']">RM {{ formatRingkas(acara.baki) }}</p></div>
            </div>
            <div class="flex items-center justify-between px-4 py-3 text-[9px] font-semibold text-gray-400"><span>{{ acara.bil_transaksi }} transaksi</span><span>{{ kadarBelanja(acara) }}% digunakan</span></div>
          </article>
        </div>
        <div v-else class="px-5 py-14 text-center"><p class="text-xs font-bold text-gray-500">Tiada acara khas diwujudkan.</p></div>
      </section>

      <section v-if="tabAktif === 'biasa'" class="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
        <p class="text-xs font-black text-amber-900">Nota Dana Kebajikan</p>
        <p class="mt-1 text-[10px] leading-relaxed text-amber-800">Kutipan derma kebajikan dan bantuan yang disalurkan kekal dalam operasi biasa selagi rekod tersebut tidak dipautkan kepada acara khas.</p>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '../../services/api';
import { useToast } from '../../composables/useToast';

Chart.register(...registerables);

const toast = useToast();
const tahun = ref(new Date().getFullYear());
const tabAktif = ref('biasa');
const memuat = ref(true);
const aliranChartRef = ref(null);
const kategoriChartRef = ref(null);
const kategori = ref([]);
let aliranChart = null;
let kategoriChart = null;

const data = ref({
  jumlah_pendapatan: 0, jumlah_perbelanjaan: 0,
  jumlah_pendapatan_biasa: 0, jumlah_perbelanjaan_biasa: 0,
  jumlah_pendapatan_acara: 0, jumlah_perbelanjaan_acara: 0,
  baki_bawa: 0, baki_akhir: 0,
  pendapatan_biasa: [], perbelanjaan_biasa: [],
  pendapatan_acara: [], perbelanjaan_acara: [],
  trend_biasa: [], trend_acara: [], acara_khas: [],
});

const pilihanTahun = computed(() => Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i));
const acaraKhas = computed(() => data.value.acara_khas || []);
const jumlahMasukAktif = computed(() => Number(tabAktif.value === 'biasa' ? data.value.jumlah_pendapatan_biasa : data.value.jumlah_pendapatan_acara) || 0);
const jumlahKeluarAktif = computed(() => Number(tabAktif.value === 'biasa' ? data.value.jumlah_perbelanjaan_biasa : data.value.jumlah_perbelanjaan_acara) || 0);
const bakiAktif = computed(() => jumlahMasukAktif.value - jumlahKeluarAktif.value);
const trendAktif = computed(() => data.value[tabAktif.value === 'biasa' ? 'trend_biasa' : 'trend_acara'] || []);

const labelKategori = {
  YURAN: 'Kutipan Yuran Ahli — Angkasa', YURAN_FPX: 'Kutipan Yuran Ahli — Sistem Kelab',
  GERAN_JABATAN: 'Geran Jabatan', PELABURAN: 'Pelaburan Kelab',
  KUTIPAN_PENAJAAN: 'Sumbangan / Penajaan', DERMA_KEBAJIKAN: 'Derma Kebajikan Ahli',
  JUALAN_AIR: 'Hasil Jualan Air Minuman', JUALAN_TSHIRT: 'Hasil Jualan T-shirt',
  JUALAN_SAMPUL_RAYA: 'Hasil Jualan Sampul Raya', JUALAN_LAIN: 'Hasil Jualan Lain-lain',
  KEBAJIKAN: 'Sumbangan Kebajikan', PEROLEHAN_ASET: 'Perolehan Aset Kelab',
  GERAN_NEGERI: 'Geran kepada PERHILITAN Negeri', BAYARAN_AKTIVITI_AM: 'Bayaran Aktiviti dan Am',
  SUMBANGAN: 'Sumbangan / Penajaan Acara', TUNTUTAN_MAKSWIP: 'Diterima daripada MAKSWIP',
};

const namaKategori = kod => kategori.value.find(item => item.kod === kod)?.nama || labelKategori[kod] || String(kod || 'LAIN_LAIN').toLowerCase().split('_').map(perkataan => perkataan.charAt(0).toUpperCase() + perkataan.slice(1)).join(' ');
const binaSenarai = (rekod, jumlah, jenisAliran) => {
  const mengikutKod = new Map((rekod || []).map(item => [item.kategori, item]));
  const kategoriTetap = kategori.value
    .filter(item => item.aktif && [jenisAliran, 'KEDUA'].includes(item.jenis_aliran))
    .map(item => {
      const nilai = mengikutKod.get(item.kod);
      mengikutKod.delete(item.kod);
      return { kategori: item.kod, nama: item.nama, jumlah: Number(nilai?.jumlah || 0), bil: Number(nilai?.bil || 0) };
    });
  const kategoriTambahan = Array.from(mengikutKod.values())
    .map(item => ({ ...item, jumlah: Number(item.jumlah || 0), bil: Number(item.bil || 0), nama: namaKategori(item.kategori) }))
    .sort((a, b) => b.jumlah - a.jumlah);
  return [...kategoriTetap, ...kategoriTambahan].map(item => ({
    ...item,
    peratus: jumlah > 0 ? (item.jumlah / jumlah) * 100 : 0,
  }));
};
const senaraiPendapatanAktif = computed(() => binaSenarai(data.value[tabAktif.value === 'biasa' ? 'pendapatan_biasa' : 'pendapatan_acara'], jumlahMasukAktif.value, 'MASUK'));
const senaraiPerbelanjaanAktif = computed(() => binaSenarai(data.value[tabAktif.value === 'biasa' ? 'perbelanjaan_biasa' : 'perbelanjaan_acara'], jumlahKeluarAktif.value, 'KELUAR'));
const perbelanjaanBergraf = computed(() => senaraiPerbelanjaanAktif.value.filter(item => item.jumlah > 0));
const bilPendapatanAktif = computed(() => senaraiPendapatanAktif.value.reduce((jumlah, item) => jumlah + item.bil, 0));
const bilPerbelanjaanAktif = computed(() => senaraiPerbelanjaanAktif.value.reduce((jumlah, item) => jumlah + item.bil, 0));

const formatRM = nilai => Number(nilai || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatRingkas = nilai => Number(nilai || 0).toLocaleString('ms-MY', { notation: 'compact', maximumFractionDigits: 1 });
const formatPaksi = nilai => `RM ${formatRingkas(nilai)}`;
const formatTarikhPendek = nilai => {
  if (!nilai) return '';
  const [tahunNilai, bulan, hari] = String(nilai).slice(0, 10).split('-');
  return tahunNilai && bulan && hari ? `${hari}/${bulan}/${tahunNilai}` : String(nilai);
};
const formatTempoh = acara => {
  if (acara.tarikh_mula && acara.tarikh_tamat) return `${formatTarikhPendek(acara.tarikh_mula)} – ${formatTarikhPendek(acara.tarikh_tamat)}`;
  if (acara.tarikh_mula) return `Mulai ${formatTarikhPendek(acara.tarikh_mula)}`;
  return 'Tarikh tidak ditetapkan';
};
const kadarBelanja = acara => {
  const masuk = Number(acara.jumlah_masuk || 0);
  return masuk > 0 ? Math.round((Number(acara.jumlah_keluar || 0) / masuk) * 100) : 0;
};

const musnahkanGraf = () => {
  if (aliranChart) { aliranChart.destroy(); aliranChart = null; }
  if (kategoriChart) { kategoriChart.destroy(); kategoriChart = null; }
};
const pilihanAsasGraf = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#111827', padding: 10, titleFont: { size: 11, weight: 'bold' }, bodyFont: { size: 10, weight: 'bold' }, callbacks: { label: konteks => `${konteks.dataset.label}: RM ${formatRM(konteks.parsed.y ?? konteks.parsed)}` } },
  },
};

const renderGraf = () => {
  musnahkanGraf();
  const labelBulan = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  if (aliranChartRef.value) {
    aliranChart = new Chart(aliranChartRef.value, {
      type: 'line',
      data: { labels: labelBulan, datasets: [
        { label: 'Masuk', data: trendAktif.value.map(item => Number(item.jumlah_masuk || 0)), borderColor: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.10)', pointBackgroundColor: '#059669', pointRadius: 3, pointHoverRadius: 5, borderWidth: 2.5, tension: 0.35, fill: true },
        { label: 'Keluar', data: trendAktif.value.map(item => Number(item.jumlah_keluar || 0)), borderColor: '#e11d48', backgroundColor: 'rgba(225, 29, 72, 0.07)', pointBackgroundColor: '#e11d48', pointRadius: 3, pointHoverRadius: 5, borderWidth: 2.5, tension: 0.35, fill: true },
      ] },
      options: { ...pilihanAsasGraf, interaction: { intersect: false, mode: 'index' }, scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 9, weight: 'bold' } }, border: { display: false } },
        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af', font: { size: 9 }, callback: formatPaksi }, border: { display: false } },
      } },
    });
  }
  if (kategoriChartRef.value && perbelanjaanBergraf.value.length) {
    const warna = ['#e11d48', '#f97316', '#8b5cf6', '#0ea5e9', '#f59e0b', '#14b8a6', '#64748b'];
    kategoriChart = new Chart(kategoriChartRef.value, {
      type: 'doughnut',
      data: { labels: perbelanjaanBergraf.value.map(item => item.nama), datasets: [{ label: 'Jumlah', data: perbelanjaanBergraf.value.map(item => item.jumlah), backgroundColor: perbelanjaanBergraf.value.map((_, indeks) => warna[indeks % warna.length]), borderColor: '#ffffff', borderWidth: 3, hoverOffset: 5 }] },
      options: { ...pilihanAsasGraf, cutout: '67%', plugins: { ...pilihanAsasGraf.plugins,
        legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 7, boxHeight: 7, padding: 14, color: '#6b7280', font: { size: 9, weight: 'bold' } } },
        tooltip: { ...pilihanAsasGraf.plugins.tooltip, callbacks: { label: konteks => `${konteks.label}: RM ${formatRM(konteks.parsed)}` } },
      } },
    });
  }
};

const muat = async () => {
  memuat.value = true;
  musnahkanGraf();
  try {
    const [responsPenyata, responsKategori] = await Promise.all([
      api.get(`/admin/kewangan/penyata-tahunan?tahun=${tahun.value}`),
      api.get('/admin/kewangan/kategori'),
    ]);
    const respons = responsPenyata.data;
    if (respons.success) data.value = { ...data.value, ...respons.data };
    kategori.value = responsKategori.data.data || [];
  } catch (error) {
    toast.ralat(error.response?.data?.message || 'Gagal memuatkan dashboard kewangan.');
  } finally {
    memuat.value = false;
    await nextTick();
    renderGraf();
  }
};

watch(tahun, muat);
watch(tabAktif, async () => { await nextTick(); renderGraf(); });
onMounted(muat);
onBeforeUnmount(musnahkanGraf);
</script>
