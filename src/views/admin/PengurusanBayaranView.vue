<template>
  <div class="space-y-5">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-gray-900 font-bold text-xl">Pengurusan Bayaran</h2>
        <p class="text-gray-500 text-sm">Semak sejarah bayaran & resit ahli.</p>
      </div>
      <div class="flex gap-2">
        <input v-model="carian" type="text" placeholder="Cari nama, No. KP, BillCode..."
          class="bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] placeholder-gray-400"/>
        <select v-model="filterStatus"
          class="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
          <option value="">Semua Status</option>
          <option value="BERJAYA">Berjaya</option>
          <option value="PENDING">Pending</option>
          <option value="GAGAL">Gagal</option>
          <option value="DIBATALKAN">Dibatalkan</option>
        </select>
      </div>
    </div>

    <!-- JADUAL -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3 font-medium">Ahli</th>
              <th class="text-left px-4 py-3 font-medium hidden md:table-cell">BillCode</th>
              <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Keterangan</th>
              <th class="text-left px-4 py-3 font-medium hidden lg:table-cell">Tarikh</th>
              <th class="text-right px-4 py-3 font-medium">Amaun</th>
              <th class="text-center px-4 py-3 font-medium">Status</th>
              <th class="text-center px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-5 py-10 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg> Memuatkan...
                </div>
              </td>
            </tr>
            <tr v-else-if="resitTertapis.length === 0">
              <td colspan="7" class="px-5 py-10 text-center text-gray-400">Tiada rekod dijumpai.</td>
            </tr>
            <tr v-for="r in resitTerpapar" :key="r.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3.5">
                <p class="text-gray-900 font-medium">{{ r.nama_penuh || '—' }}</p>
                <p class="text-gray-400 text-xs font-mono">{{ r.no_kp }}</p>
              </td>
              <td class="px-4 py-3.5 hidden md:table-cell">
                <span class="text-gray-500 font-mono text-xs">{{ r.billCode }}</span>
              </td>
              <td class="px-4 py-3.5 hidden sm:table-cell text-gray-600 text-xs max-w-[180px] truncate">{{ r.keterangan||'—' }}</td>
              <td class="px-4 py-3.5 hidden lg:table-cell text-gray-400 text-xs whitespace-nowrap">{{ r.tarikh }}</td>
              <td class="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums">
                RM {{ parseFloat(r.amaun||0).toFixed(2) }}
              </td>
              <td class="px-4 py-3.5 text-center">
                <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', badgeResit(r.status)]">{{ r.status }}</span>
              </td>
              <td class="px-4 py-3.5 text-center">
                <button @click="bukaDetail(r)"
                  class="text-xs text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-3 py-1.5 rounded-lg transition-colors font-medium border border-[#0F4C3A]/20">
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
        <p class="text-gray-400 text-xs">{{ resitTertapis.length }} rekod</p>
        <div class="flex gap-1">
          <button @click="hal--" :disabled="hal===1" class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm transition-colors">‹</button>
          <button v-for="p in halamanDipapar" :key="p" @click="hal=p"
            :class="['w-8 h-8 rounded-lg text-xs font-medium transition-colors border',
              p===hal ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100']">{{ p }}</button>
          <button @click="hal++" :disabled="hal===jumlahHal" class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm transition-colors">›</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         MODAL DETAILS BAYARAN + RESIT CETAK
    ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetail" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          @click.self="showDetail=false">
          <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="text-gray-900 font-bold text-lg">Resit Pembayaran</h3>
              <div class="flex gap-2">
                <button @click="cetakResit"
                  class="flex items-center gap-1.5 text-xs bg-[#0F4C3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#155d47] transition-colors font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Cetak Resit
                </button>
                <button @click="showDetail=false" class="text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div id="cetakResit" class="p-6 space-y-4">

              <!-- Header Cetak -->
              <div class="text-center border-b border-gray-100 pb-4">
                <div class="w-12 h-12 rounded-xl bg-[#0F4C3A] flex items-center justify-center mx-auto mb-2">
                  <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h4 class="text-gray-900 font-bold text-base">KELAB KAKITANGAN PERHILITAN</h4>
                <p class="text-gray-400 text-xs">Resit Rasmi Pembayaran</p>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-between">
                <span :class="['text-xs font-bold px-3 py-1 rounded-full', badgeResit(pilihan?.status)]">{{ pilihan?.status }}</span>
                <span class="text-gray-400 text-xs font-mono">{{ pilihan?.tarikh }}</span>
              </div>

              <!-- Info Ahli -->
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Maklumat Ahli</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div><p class="text-xs text-gray-400">Nama</p><p class="font-semibold text-gray-900">{{ pilihan?.nama_penuh||'—' }}</p></div>
                  <div><p class="text-xs text-gray-400">No. KP</p><p class="font-semibold text-gray-900 font-mono text-xs">{{ pilihan?.no_kp }}</p></div>
                  <div><p class="text-xs text-gray-400">E-mel</p><p class="font-semibold text-gray-900 text-xs truncate">{{ pilihan?.email||'—' }}</p></div>
                  <div><p class="text-xs text-gray-400">No. Ahli</p><p class="font-semibold text-gray-900 font-mono text-xs">{{ pilihan?.no_ahli||'BELUM DITETAPKAN' }}</p></div>
                </div>
              </div>

              <!-- Info Transaksi -->
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Butiran Transaksi</p>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between"><span class="text-gray-500">BillCode</span><span class="font-mono font-semibold text-gray-900 text-xs">{{ pilihan?.billCode }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Keterangan</span><span class="font-semibold text-gray-900 text-right text-xs max-w-[200px]">{{ pilihan?.keterangan||'—' }}</span></div>
                  <hr class="border-gray-200"/>
                  <div class="flex justify-between">
                    <span class="text-gray-700 font-semibold">Jumlah Bayaran</span>
                    <span class="text-[#0F4C3A] font-bold text-lg">RM {{ parseFloat(pilihan?.amaun||0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Sejarah Bayaran Lain -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Sejarah Bayaran Ahli</p>
                  <button v-if="!sejarahDimuatkan" @click="muatSejarah(pilihan?.no_kp)"
                    class="text-xs text-[#0F4C3A] hover:underline">Muat Sejarah</button>
                </div>
                <div v-if="loadingSejarah" class="text-xs text-gray-400 py-2">Memuatkan...</div>
                <div v-else-if="sejarahAhli.length > 0" class="space-y-1 max-h-40 overflow-y-auto">
                  <div v-for="s in sejarahAhli" :key="s.billCode"
                    class="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <div>
                      <p class="text-gray-700 font-medium">{{ s.keterangan||'—' }}</p>
                      <p class="text-gray-400 font-mono">{{ s.tarikh }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">RM {{ parseFloat(s.amaun).toFixed(2) }}</p>
                      <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', badgeResit(s.status)]">{{ s.status }}</span>
                    </div>
                  </div>
                </div>
                <p v-else-if="sejarahDimuatkan" class="text-xs text-gray-400 py-2">Tiada sejarah lain.</p>
              </div>

            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button @click="showDetail=false" class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-5 rounded-xl text-sm transition-colors">Tutup</button>
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

const semuaResit    = ref([]);
const loading       = ref(true);
const carian        = ref('');
const filterStatus  = ref('');
const hal           = ref(1);
const hadPerHal     = 20;
const showDetail    = ref(false);
const pilihan       = ref(null);
const sejarahAhli   = ref([]);
const loadingSejarah = ref(false);
const sejarahDimuatkan = ref(false);

const badgeResit = (s) => ({
  'BERJAYA':    'bg-green-100 text-green-700',
  'PENDING':    'bg-amber-100 text-amber-700',
  'GAGAL':      'bg-red-100 text-red-600',
  'DIBATALKAN': 'bg-gray-100 text-gray-500',
}[s] || 'bg-gray-100 text-gray-500');

const resitTertapis = computed(() => {
  return semuaResit.value.filter(r => {
    const c = carian.value.toLowerCase();
    const cocok = !c || (r.nama_penuh||'').toLowerCase().includes(c) || (r.no_kp||'').includes(c) || (r.billCode||'').toLowerCase().includes(c);
    const statusCocok = !filterStatus.value || r.status === filterStatus.value;
    return cocok && statusCocok;
  });
});

const jumlahHal = computed(() => Math.max(1, Math.ceil(resitTertapis.value.length / hadPerHal)));
const resitTerpapar = computed(() => {
  const s = (hal.value - 1) * hadPerHal;
  return resitTertapis.value.slice(s, s + hadPerHal);
});
const halamanDipapar = computed(() => {
  const t = jumlahHal.value, h = hal.value;
  if (t <= 5) return Array.from({length:t},(_,i)=>i+1);
  if (h <= 3) return [1,2,3,4,5];
  if (h >= t-2) return [t-4,t-3,t-2,t-1,t];
  return [h-2,h-1,h,h+1,h+2];
});

const muatResit = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/sejarah-bayaran');
    if (data.success) semuaResit.value = data.data;
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
};

const bukaDetail = (r) => {
  pilihan.value = r;
  sejarahAhli.value = [];
  sejarahDimuatkan.value = false;
  showDetail.value = true;
};

const muatSejarah = async (no_kp) => {
  if (!no_kp) return;
  loadingSejarah.value = true;
  try {
    const { data } = await api.get('/admin/sejarah-bayaran');
    if (data.success) {
      sejarahAhli.value = data.data.filter(r => r.no_kp === no_kp && r.billCode !== pilihan.value?.billCode);
    }
    sejarahDimuatkan.value = true;
  } catch(e) { console.error(e); }
  finally { loadingSejarah.value = false; }
};

const cetakResit = () => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });
  const w = window.open('', '_blank', 'width=700,height=600');
  w.document.write(`
    <html><head><title>Resit - ${pilihan.value?.billCode}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: auto; }
      .header { text-align: center; border-bottom: 2px solid #0F4C3A; padding-bottom: 16px; margin-bottom: 20px; }
      .header h1 { font-size: 16px; color: #0F4C3A; letter-spacing: 1px; }
      .header p { font-size: 11px; color: #888; margin-top: 3px; }
      .section { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 14px; margin: 10px 0; }
      .section-title { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 10px; }
      .row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
      .label { color: #888; }
      .value { font-weight: bold; }
      .total-row { border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px; }
      .total-row .value { color: #0F4C3A; font-size: 16px; }
      .status-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; background: #d1fae5; color: #065f46; }
      .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #aaa; }
    </style></head><body>
    <div class="header">
      <h1>KELAB KAKITANGAN PERHILITAN</h1>
      <p>Resit Rasmi Pembayaran &bull; Dicetak: ${tarikhCetak}</p>
    </div>
    <div class="section">
      <div class="section-title">Maklumat Ahli</div>
      <div class="row"><span class="label">Nama</span><span class="value">${pilihan.value?.nama_penuh||'—'}</span></div>
      <div class="row"><span class="label">No. KP</span><span class="value" style="font-family:monospace">${pilihan.value?.no_kp||'—'}</span></div>
      <div class="row"><span class="label">No. Ahli</span><span class="value" style="font-family:monospace">${pilihan.value?.no_ahli||'BELUM DITETAPKAN'}</span></div>
      <div class="row"><span class="label">E-mel</span><span class="value">${pilihan.value?.email||'—'}</span></div>
    </div>
    <div class="section">
      <div class="section-title">Butiran Transaksi</div>
      <div class="row"><span class="label">BillCode</span><span class="value" style="font-family:monospace">${pilihan.value?.billCode||'—'}</span></div>
      <div class="row"><span class="label">Keterangan</span><span class="value">${pilihan.value?.keterangan||'—'}</span></div>
      <div class="row"><span class="label">Tarikh</span><span class="value">${pilihan.value?.tarikh||'—'}</span></div>
      <div class="row"><span class="label">Status</span><span class="status-badge">${pilihan.value?.status||'—'}</span></div>
      <div class="row total-row"><span class="label" style="font-weight:bold">JUMLAH BAYARAN</span><span class="value">RM ${parseFloat(pilihan.value?.amaun||0).toFixed(2)}</span></div>
    </div>
    <div class="footer">
      Resit ini adalah dijana secara automatik oleh sistem. Sah tanpa tandatangan.
    </div>
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

onMounted(muatResit);
</script>
<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>