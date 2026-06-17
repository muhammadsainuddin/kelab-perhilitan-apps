<template>
  <div class="space-y-4 font-sans text-gray-900 pb-10 text-xs">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h2 class="font-bold text-base text-gray-900">Resit Biro Angkasa</h2>
        <p class="text-gray-500 text-[11px] mt-0.5">Jana dan urus resit potongan yuran bulanan ahli Biro Angkasa.</p>
      </div>
      <button @click="showModalJana = true"
        class="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#0F4C3A] hover:bg-[#0a3328] px-3 py-2 rounded-lg transition-colors shrink-0">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Jana Resit Bulanan
      </button>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Ahli Layak</p>
        <p class="text-2xl font-black text-gray-800 mt-1 tabular-nums">{{ statistik.jumlah_ahli_layak ?? '—' }}</p>
        <p class="text-[9px] text-gray-400 mt-0.5">Biro Angkasa aktif</p>
      </div>
      <div class="bg-white border border-blue-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Resit Dijana</p>
        <p class="text-2xl font-black text-blue-700 mt-1 tabular-nums">{{ statistik.bulanList?.[0]?.bilangan ?? '—' }}</p>
        <p class="text-[9px] text-blue-400 mt-0.5">{{ statistik.bulanList?.[0]?.bulan ?? 'Tiada' }}</p>
      </div>
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Kutipan Terkini</p>
        <p class="text-2xl font-black text-emerald-700 mt-1 tabular-nums">
          {{ statistik.bulanList?.[0] ? 'RM ' + parseFloat(statistik.bulanList[0].jumlah_kutipan).toFixed(2) : '—' }}
        </p>
        <p class="text-[9px] text-emerald-500 mt-0.5">{{ statistik.bulanList?.[0]?.bulan ?? '' }}</p>
      </div>
      <div class="bg-white border border-violet-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-violet-500 uppercase tracking-wider">Jumlah Bulan</p>
        <p class="text-2xl font-black text-violet-700 mt-1 tabular-nums">{{ statistik.bulanList?.length ?? '—' }}</p>
        <p class="text-[9px] text-violet-400 mt-0.5">bulan ada rekod</p>
      </div>
    </div>

    <!-- FILTER -->
    <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="relative flex-1">
          <input v-model="filterCarian" type="text" placeholder="Cari nama / no. KP / no. ahli..."
            class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
          <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <select v-model="filterBulan"
          class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
          <option value="">Semua Bulan</option>
          <option v-for="b in statistik.bulanList" :key="b.bulan" :value="b.bulan">{{ labelBulan(b.bulan) }}</option>
        </select>
        <button @click="muatResit"
          class="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Semula
        </button>
      </div>
    </div>

    <p class="text-gray-400 text-[11px]">
      Menunjukkan <span class="text-gray-700 font-bold">{{ senaraiTertapis.length }}</span> daripada
      <span class="text-gray-700 font-bold">{{ senaraiResit.length }}</span> resit
    </p>

    <!-- JADUAL -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="sedangMuat" class="py-16 flex flex-col items-center gap-3 text-gray-400">
        <svg class="w-6 h-6 animate-spin text-[#0F4C3A]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="text-[11px]">Memuat resit...</span>
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">No. Resit</th>
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">Nama / No. KP</th>
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Penempatan</th>
            <th class="text-center font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">Bulan</th>
            <th class="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">Amaun (RM)</th>
            <th class="text-center font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">Cetak</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="senaraiTertapis.length === 0">
            <td colspan="6" class="py-12 text-center text-gray-400 text-[11px]">
              {{ senaraiResit.length === 0 ? 'Tiada resit dijana lagi. Klik "Jana Resit Bulanan" untuk mula.' : 'Tiada rekod sepadan carian.' }}
            </td>
          </tr>
          <tr v-for="r in senaraiTertapis" :key="r.id"
            class="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
            <td class="px-4 py-3 font-mono text-[10px] font-bold text-blue-700">{{ r.no_resit }}</td>
            <td class="px-4 py-3">
              <p class="font-semibold text-xs text-gray-900 uppercase">{{ r.nama_pegawai }}</p>
              <p class="text-[10px] text-gray-400 font-mono mt-px">{{ r.no_kp }} · No. Ahli: {{ r.no_ahli || '—' }}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell text-[11px] text-gray-500">{{ r.penempatan || '—' }}</td>
            <td class="px-4 py-3 text-center">
              <span class="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{{ labelBulan(r.bulan_potongan) }}</span>
            </td>
            <td class="px-4 py-3 text-right font-black text-sm text-emerald-600 tabular-nums">{{ parseFloat(r.amaun).toFixed(2) }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="cetakResit(r)"
                class="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Cetak
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div v-if="jumlahHalaman > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <p class="text-[10px] text-gray-400">Halaman {{ halamanSemasa }} / {{ jumlahHalaman }}</p>
        <div class="flex gap-1">
          <button @click="tukarHalaman(halamanSemasa - 1)" :disabled="halamanSemasa === 1"
            class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button @click="tukarHalaman(halamanSemasa + 1)" :disabled="halamanSemasa === jumlahHalaman"
            class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL JANA RESIT -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModalJana" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showModalJana = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-sm text-gray-900">Jana Resit Biro Angkasa</h3>
              <button @click="showModalJana = false" class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="px-6 py-5 space-y-4">
              <p class="text-[11px] text-gray-500 leading-relaxed">
                Resit akan dijana untuk <strong class="text-gray-700">semua ahli Biro Angkasa aktif</strong> bagi bulan yang dipilih. Ahli yang sudah ada resit untuk bulan itu akan dilangkau.
              </p>
              <div>
                <label class="block text-[11px] font-bold text-gray-600 mb-1.5">Bulan Potongan <span class="text-rose-500">*</span></label>
                <input v-model="bulanJana" type="month"
                  :max="bulanMaksimum"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"/>
              </div>
              <div v-if="mesejJana" :class="['text-[11px] font-medium px-3 py-2.5 rounded-lg border', mesejJana.jenis === 'berjaya' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700']">
                {{ mesejJana.teks }}
              </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button @click="showModalJana = false"
                class="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Tutup
              </button>
              <button @click="janaResit" :disabled="sedangJana || !bulanJana"
                class="px-4 py-2 text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0a3328] disabled:opacity-60 rounded-lg transition-colors flex items-center gap-1.5">
                <svg v-if="sedangJana" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ sedangJana ? 'Menjana...' : 'Jana Sekarang' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';

const senaraiResit  = ref([]);
const statistik     = ref({ bulanList: [], jumlah_ahli_layak: null });
const sedangMuat    = ref(false);
const sedangJana    = ref(false);
const showModalJana = ref(false);
const filterCarian  = ref('');
const filterBulan   = ref('');
const halamanSemasa = ref(1);
const jumlahResit   = ref(0);
const HAD_HALAMAN   = 50;

const bulanMaksimum = new Date().toISOString().slice(0, 7);
const bulanJana = ref(bulanMaksimum);
const mesejJana = ref(null);

const jumlahHalaman = computed(() => Math.ceil(jumlahResit.value / HAD_HALAMAN));

const senaraiTertapis = computed(() => {
  const q = filterCarian.value.toLowerCase().trim();
  if (!q) return senaraiResit.value;
  return senaraiResit.value.filter(r =>
    (r.nama_pegawai || '').toLowerCase().includes(q) ||
    (r.no_kp || '').includes(q) ||
    (r.no_ahli || '').includes(q)
  );
});

const labelBulan = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  return d.toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' });
};

const muatStatistik = async () => {
  try {
    const { data } = await api.get('/admin/resit-biro-angkasa/statistik');
    if (data.success) statistik.value = data;
  } catch { /* senyap */ }
};

const muatResit = async () => {
  sedangMuat.value = true;
  try {
    const params = { page: halamanSemasa.value };
    if (filterBulan.value) params.bulan = filterBulan.value;
    const { data } = await api.get('/admin/resit-biro-angkasa', { params });
    if (data.success) {
      senaraiResit.value = data.data;
      jumlahResit.value  = data.jumlah;
    }
  } catch { /* senyap */ }
  finally { sedangMuat.value = false; }
};

const tukarHalaman = (h) => {
  if (h < 1 || h > jumlahHalaman.value) return;
  halamanSemasa.value = h;
  muatResit();
};

const janaResit = async () => {
  if (!bulanJana.value) return;
  sedangJana.value = true;
  mesejJana.value  = null;
  try {
    const { data } = await api.post('/admin/resit-biro-angkasa/jana', { bulan: bulanJana.value }, { timeout: 60000 });
    mesejJana.value = { jenis: data.success ? 'berjaya' : 'ralat', teks: data.message };
    if (data.success) {
      await muatStatistik();
      await muatResit();
    }
  } catch (err) {
    console.error('[JANA RESIT BA]', err.response?.status, err.response?.data, err.message);
    mesejJana.value = { jenis: 'ralat', teks: err.response?.data?.message || err.message || 'Ralat semasa menjana resit.' };
  } finally {
    sedangJana.value = false;
  }
};

const cetakResit = (r) => {
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const w = window.open('', '_blank', 'width=620,height=580');
  w.document.write(`<html><head><title>Resit ${r.no_resit}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:30px;color:#222;max-width:560px;margin:auto}
    .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}
    .divider{border:none;border-top:1px dashed #ddd;margin:14px 0}
    .badge{display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:bold}
    .total-box{background:#0F4C3A;color:white;border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:14px}
    @media print{body{padding:14px}}
  </style></head><body>
  ${headerResitHTML('Resit Potongan Yuran — Biro Angkasa')}
  <div style="background:#f9fafb;border:1px solid #eee;border-radius:10px;padding:16px;margin-top:12px">
    <div class="row"><span style="color:#888">No. Resit</span><strong style="font-family:monospace">${r.no_resit}</strong></div>
    <div class="row"><span style="color:#888">Kaedah Potongan</span><span class="badge">Biro Angkasa</span></div>
    <hr class="divider"/>
    <div class="row"><span style="color:#888">Nama</span><strong style="text-transform:uppercase">${r.nama_pegawai || '—'}</strong></div>
    <div class="row"><span style="color:#888">No. Ahli Kelab</span><strong>${r.no_ahli || '—'}</strong></div>
    <div class="row"><span style="color:#888">No. Kad Pengenalan</span><strong style="font-family:monospace">${r.no_kp || '—'}</strong></div>
    <div class="row"><span style="color:#888">Penempatan</span><strong>${r.penempatan || '—'}</strong></div>
    <hr class="divider"/>
    <div class="row"><span style="color:#888">Bulan Potongan</span><strong>${labelBulan(r.bulan_potongan)}</strong></div>
    <div class="row"><span style="color:#888">Keterangan</span><strong>Yuran Kelab PERHILITAN</strong></div>
  </div>
  <div class="total-box">
    <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px">Jumlah Potongan</span>
    <strong style="font-size:22px">RM ${parseFloat(r.amaun).toFixed(2)}</strong>
  </div>
  <p style="font-size:9px;color:#aaa;text-align:center;margin-top:10px">Dicetak: ${tarikh}</p>
  ${footerResitHTML()}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

onMounted(async () => {
  await muatStatistik();
  await muatResit();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
