<template>
  <div class="space-y-6">
    <section class="rounded-2xl bg-gradient-to-br from-[#083d31] via-[#0F4C3A] to-[#0a2e23] px-5 py-6 text-white shadow-lg md:px-7">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">Pengurusan Kewangan Kelab</p>
          <h2 class="mt-1 text-xl font-black">Dashboard Kewangan Terperinci</h2>
          <p class="mt-1 text-xs text-emerald-100/80">Pecahan sumber kewangan dan perbelanjaan bagi tahun {{ tahun }}.</p>
        </div>
        <select v-model="tahun" class="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white outline-none">
          <option v-for="item in pilihanTahun" :key="item" :value="item" class="text-gray-900">{{ item }}</option>
        </select>
      </div>
      <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-white/10 bg-white/10 p-3.5"><p class="text-[10px] font-bold uppercase tracking-wider text-emerald-100/70">Jumlah Masuk</p><p class="mt-1 text-lg font-black tabular-nums">RM {{ formatRM(data.jumlah_pendapatan) }}</p></div>
        <div class="rounded-xl border border-white/10 bg-white/10 p-3.5"><p class="text-[10px] font-bold uppercase tracking-wider text-emerald-100/70">Jumlah Keluar</p><p class="mt-1 text-lg font-black tabular-nums">RM {{ formatRM(data.jumlah_perbelanjaan) }}</p></div>
        <div class="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3.5"><p class="text-[10px] font-bold uppercase tracking-wider text-amber-100/80">Baki Akhir</p><p class="mt-1 text-lg font-black tabular-nums">RM {{ formatRM(data.baki_akhir) }}</p></div>
      </div>
    </section>

    <div v-if="memuat" class="grid grid-cols-1 gap-6 xl:grid-cols-2"><div v-for="i in 2" :key="i" class="h-96 animate-pulse rounded-2xl bg-gray-100" /></div>
    <template v-else>
      <section class="rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div class="flex items-start justify-between border-b border-emerald-50 px-5 py-4">
          <div><p class="text-[10px] font-black uppercase tracking-widest text-emerald-600">A. Sumber Kewangan Kelab</p><h3 class="mt-1 text-sm font-black text-gray-900">Pendapatan dan kutipan</h3></div>
          <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">RM {{ formatRM(data.jumlah_pendapatan) }}</span>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="item in sumber" :key="item.kod" class="flex items-center gap-3 px-5 py-3.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-700">{{ item.no }}</span>
            <div class="min-w-0 flex-1"><p class="text-xs font-bold text-gray-800">{{ item.nama }}</p><p class="mt-0.5 text-[10px] text-gray-400">{{ item.keterangan }}</p></div>
            <div class="text-right"><p class="text-xs font-black tabular-nums text-emerald-700">RM {{ formatRM(item.jumlah) }}</p><p class="text-[9px] font-semibold text-gray-400">{{ item.bil }} rekod</p></div>
          </div>
        </div>
        <div class="border-t border-emerald-100 bg-emerald-50/50 px-5 py-3 text-right text-xs font-black text-emerald-800">Jumlah sumber: RM {{ formatRM(data.jumlah_pendapatan) }}</div>
      </section>

      <section class="rounded-2xl border border-rose-100 bg-white shadow-sm">
        <div class="flex items-start justify-between border-b border-rose-50 px-5 py-4">
          <div><p class="text-[10px] font-black uppercase tracking-widest text-rose-600">B. Perbelanjaan Kelab</p><h3 class="mt-1 text-sm font-black text-gray-900">Penggunaan dana kelab</h3></div>
          <span class="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black text-rose-700">RM {{ formatRM(data.jumlah_perbelanjaan) }}</span>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="item in perbelanjaan" :key="item.kod" class="flex items-center gap-3 px-5 py-3.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-[10px] font-black text-rose-700">{{ item.no }}</span>
            <div class="min-w-0 flex-1"><p class="text-xs font-bold text-gray-800">{{ item.nama }}</p><p class="mt-0.5 text-[10px] text-gray-400">{{ item.keterangan }}</p></div>
            <div class="text-right"><p class="text-xs font-black tabular-nums text-rose-700">RM {{ formatRM(item.jumlah) }}</p><p class="text-[9px] font-semibold text-gray-400">{{ item.bil }} rekod</p></div>
          </div>
        </div>
        <div class="border-t border-rose-100 bg-rose-50/50 px-5 py-3 text-right text-xs font-black text-rose-800">Jumlah perbelanjaan: RM {{ formatRM(data.jumlah_perbelanjaan) }}</div>
      </section>

      <section class="rounded-2xl border border-amber-200 bg-amber-50/50 px-5 py-4">
        <p class="text-xs font-black text-amber-900">Dana Kebajikan Ahli</p>
        <p class="mt-1 text-[11px] leading-relaxed text-amber-800">Kutipan Derma Kebajikan Ahli dipantau berasingan daripada dana operasi kelab. Gunakan kategori <strong>Derma Kebajikan Ahli</strong> semasa rekod kutipan dan <strong>Sumbangan Kebajikan</strong> semasa dana disalurkan kepada ahli atau waris.</p>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import api from '../../services/api';
import { useToast } from '../../composables/useToast';

const toast = useToast();
const tahun = ref(new Date().getFullYear());
const memuat = ref(true);
const data = ref({ jumlah_pendapatan: 0, jumlah_perbelanjaan: 0, baki_akhir: 0, pendapatan: [], perbelanjaan: [] });
const pilihanTahun = computed(() => Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i));

const butiran = (jenis, kod) => (data.value[jenis] || []).find(item => item.kategori === kod) || { jumlah: 0, bil: 0 };
const binaSenarai = (jenis, konfigurasi) => konfigurasi.map(item => ({ ...item, ...butiran(jenis, item.kod) }));

const sumber = computed(() => binaSenarai('pendapatan', [
  { no: '1a', kod: 'YURAN', nama: 'Kutipan Yuran Ahli — Angkasa', keterangan: 'Dikira automatik daripada rekod potongan Angkasa.' },
  { no: '1b', kod: 'YURAN_FPX', nama: 'Kutipan Yuran Ahli — Sistem Kelab', keterangan: 'Dikira automatik daripada bayaran melalui sistem kelab.' },
  { no: '2', kod: 'GERAN_JABATAN', nama: 'Geran Jabatan', keterangan: 'Rekod manual oleh Bendahari.' },
  { no: '3', kod: 'PELABURAN', nama: 'Pelaburan Kelab', keterangan: 'Fixed deposit, saham atau faedah pelaburan.' },
  { no: '4', kod: 'KUTIPAN_PENAJAAN', nama: 'Kutipan Sumbangan / Penajaan Program', keterangan: 'Termasuk MAKSWIP dan penaja program kelab.' },
  { no: '5', kod: 'DERMA_KEBAJIKAN', nama: 'Kutipan Derma Kebajikan Ahli', keterangan: 'Dana amanah sebelum disalurkan kepada mangsa atau waris.' },
  { no: '6a', kod: 'JUALAN_AIR', nama: 'Hasil Jualan — Air Minuman', keterangan: 'Jualan manual kelab.' },
  { no: '6b', kod: 'JUALAN_TSHIRT', nama: 'Hasil Jualan — T-shirt Kelab', keterangan: 'Jualan manual kelab.' },
  { no: '6c', kod: 'JUALAN_SAMPUL_RAYA', nama: 'Hasil Jualan — Sampul Raya', keterangan: 'Jualan manual kelab.' },
  { no: '6d', kod: 'JUALAN_LAIN', nama: 'Hasil Jualan — Lain-lain', keterangan: 'Kategori jualan tambahan.' },
]));

const perbelanjaan = computed(() => binaSenarai('perbelanjaan', [
  { no: '1', kod: 'KEBAJIKAN', nama: 'Sumbangan Kebajikan', keterangan: 'Jumlah bantuan yang telah disalurkan kepada ahli.' },
  { no: '2', kod: 'PEROLEHAN_ASET', nama: 'Perolehan Aset Kelab', keterangan: 'Pembelian aset atau peralatan kelab.' },
  { no: '3', kod: 'GERAN_NEGERI', nama: 'Geran kepada PERHILITAN Negeri', keterangan: 'Pemberian geran kepada negeri.' },
  { no: '4', kod: 'BAYARAN_AKTIVITI_AM', nama: 'Bayaran Aktiviti dan Am', keterangan: 'Perbelanjaan operasi dan program lain.' },
]));

const formatRM = (nilai) => Number(nilai || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const muat = async () => {
  memuat.value = true;
  try {
    const { data: respons } = await api.get(`/admin/kewangan/penyata-tahunan?tahun=${tahun.value}`);
    if (respons.success) data.value = respons.data;
  } catch (error) { toast.ralat(error.response?.data?.message || 'Gagal memuatkan dashboard kewangan.'); }
  finally { memuat.value = false; }
};

watch(tahun, muat);
onMounted(muat);
</script>
