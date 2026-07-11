<template>
  <div style="font-family: Tahoma, 'Segoe UI', Arial, sans-serif" class="text-xs text-gray-800 pb-10">

    <!-- ══ HEADER ══ -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#0F4C3A]/60 mb-0.5">Pengurusan Kewangan</p>
        <h2 class="text-gray-900 font-bold text-lg leading-tight">Resit Bayaran FPX</h2>
        <p class="text-gray-400 text-[11px] mt-0.5">Sejarah transaksi pembayaran melalui ToyyibPay — yuran & kedai.</p>
      </div>
      <button @click="muatResit" :disabled="loading"
        class="flex items-center gap-1.5 text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 self-start sm:self-auto">
        <svg class="w-3.5 h-3.5" :class="loading && 'animate-spin'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Muat Semula
      </button>
    </div>

    <!-- ══ STATS CARDS ══ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Berjaya</p>
        <p class="text-xl font-bold text-emerald-600 mt-1 tabular-nums">{{ statBerjaya.bil }}</p>
        <p class="text-[11px] text-emerald-600 font-semibold">RM {{ statBerjaya.amaun.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pending</p>
        <p class="text-xl font-bold text-amber-500 mt-1 tabular-nums">{{ statPending.bil }}</p>
        <p class="text-[11px] text-amber-500 font-semibold">RM {{ statPending.amaun.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gagal</p>
        <p class="text-xl font-bold text-red-500 mt-1 tabular-nums">{{ statGagal.bil }}</p>
        <p class="text-[11px] text-red-500 font-semibold">RM {{ statGagal.amaun.toFixed(2) }}</p>
      </div>
      <div class="bg-[#0F4C3A] rounded-xl px-4 py-3 shadow-sm">
        <p class="text-[10px] text-white/60 font-bold uppercase tracking-wider">Jumlah Keseluruhan</p>
        <p class="text-xl font-bold text-white mt-1 tabular-nums">{{ resitTertapis.length }}</p>
        <p class="text-[11px] text-white/80 font-semibold">RM {{ jumlahAmaun.toFixed(2) }}</p>
      </div>
    </div>

    <!-- ══ FILTER BAR ══ -->
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 px-4 py-3">
      <div class="flex flex-wrap gap-2 items-end">
        <!-- Carian -->
        <div class="flex-1 min-w-[180px]">
          <label class="field-label">Carian</label>
          <div class="relative">
            <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="carian" type="text" placeholder="Nama, No. KP, No. Ahli, BillCode..."
              class="field-input pl-8"/>
          </div>
        </div>
        <!-- Tahun -->
        <div class="w-24">
          <label class="field-label">Tahun</label>
          <select v-model="filterTahun" class="field-input">
            <option value="">Semua</option>
            <option v-for="y in senaraiTahun" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>
        <!-- Bulan -->
        <div class="w-28">
          <label class="field-label">Bulan</label>
          <select v-model="filterBulan" class="field-input">
            <option value="">Semua</option>
            <option v-for="b in senaraibulan" :key="b.val" :value="b.val">{{ b.label }}</option>
          </select>
        </div>
        <!-- Hari -->
        <div class="w-20">
          <label class="field-label">Hari</label>
          <select v-model="filterHari" class="field-input">
            <option value="">Semua</option>
            <option v-for="d in 31" :key="d" :value="String(d).padStart(2,'0')">{{ String(d).padStart(2,'0') }}</option>
          </select>
        </div>
        <!-- Status -->
        <div class="w-32">
          <label class="field-label">Status</label>
          <select v-model="filterStatus" class="field-input">
            <option value="">Semua Status</option>
            <option value="BERJAYA">Berjaya</option>
            <option value="PENDING">Pending</option>
            <option value="GAGAL">Gagal</option>
            <option value="DIBATALKAN">Dibatalkan</option>
          </select>
        </div>
        <!-- Reset -->
        <button v-if="adaFilter" @click="resetFilter"
          class="flex items-center gap-1 text-[11px] text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors mt-auto">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          Reset
        </button>
      </div>
      <p v-if="adaFilter" class="text-[10px] text-gray-400 mt-2">
        Menunjukkan <span class="font-bold text-gray-600">{{ resitTertapis.length }}</span> daripada <span class="font-bold">{{ semuaResit.length }}</span> rekod.
      </p>
    </div>

    <!-- ══ JADUAL ══ -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

      <!-- loading -->
      <div v-if="loading" class="flex items-center justify-center gap-2 py-16 text-gray-400">
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Memuatkan rekod...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="th-cell text-left w-8">#</th>
              <th class="th-cell text-left">Ahli</th>
              <th class="th-cell text-left hidden md:table-cell">BillCode</th>
              <th class="th-cell text-left hidden sm:table-cell">Keterangan</th>
              <th class="th-cell text-left hidden lg:table-cell">Tarikh</th>
              <th class="th-cell text-right">Amaun (RM)</th>
              <th class="th-cell text-center">Status</th>
              <th class="th-cell text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="resitTertapis.length === 0">
              <td colspan="8" class="py-12 text-center text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Tiada rekod dijumpai.
              </td>
            </tr>
            <tr v-for="(r, idx) in resitTerpapar" :key="r.billCode + idx"
              class="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
              <!-- # -->
              <td class="td-cell text-gray-300 tabular-nums text-[10px]">{{ (hal-1)*hadPerHal + idx + 1 }}</td>
              <!-- Ahli -->
              <td class="td-cell">
                <p class="font-semibold text-gray-800 leading-tight">{{ r.nama_penuh || '—' }}</p>
                <p class="text-gray-400 font-mono text-[10px] mt-0.5">{{ r.no_kp }}</p>
                <p v-if="r.no_ahli" class="text-[#0F4C3A] font-bold text-[10px]">No. {{ r.no_ahli }}</p>
              </td>
              <!-- BillCode -->
              <td class="td-cell hidden md:table-cell">
                <a :href="`${toyyibpayBase}/${r.billCode}`" target="_blank" rel="noopener"
                  class="font-mono text-[11px] text-[#0F4C3A] hover:text-[#155d47] hover:underline flex items-center gap-1">
                  {{ r.billCode }}
                  <svg class="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </td>
              <!-- Keterangan -->
              <td class="td-cell hidden sm:table-cell text-gray-500 max-w-[160px] truncate">{{ r.keterangan || '—' }}</td>
              <!-- Tarikh -->
              <td class="td-cell hidden lg:table-cell text-gray-400 whitespace-nowrap font-mono text-[10px]">{{ r.tarikh }}</td>
              <!-- Amaun -->
              <td class="td-cell text-right font-bold tabular-nums text-gray-900">
                {{ parseFloat(r.amaun || 0).toFixed(2) }}
              </td>
              <!-- Status -->
              <td class="td-cell text-center">
                <span :class="['badge', badgeResit(r.status)]">{{ r.status }}</span>
              </td>
              <!-- Aksi -->
              <td class="td-cell text-center">
                <button @click="bukaDetail(r)"
                  class="text-[11px] text-[#0F4C3A] font-semibold bg-[#0F4C3A]/8 hover:bg-[#0F4C3A]/15 border border-[#0F4C3A]/20 px-3 py-1 rounded-lg transition-colors">
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination + footer -->
      <div v-if="!loading" class="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
        <p class="text-[11px] text-gray-400">
          {{ resitTertapis.length }} rekod &bull; Halaman {{ hal }}/{{ jumlahHal }}
        </p>
        <div class="flex gap-1">
          <button @click="hal=1" :disabled="hal===1" class="pag-btn">«</button>
          <button @click="hal--"  :disabled="hal===1" class="pag-btn">‹</button>
          <button v-for="p in halamanDipapar" :key="p" @click="hal=p"
            :class="['pag-btn', p===hal ? 'pag-aktif' : '']">{{ p }}</button>
          <button @click="hal++"          :disabled="hal===jumlahHal" class="pag-btn">›</button>
          <button @click="hal=jumlahHal"  :disabled="hal===jumlahHal" class="pag-btn">»</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL DETAILS — GAYA PENYATA BANK
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetail" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showDetail=false">
          <div class="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl overflow-hidden">

            <!-- Modal Header -->
            <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="font-bold text-gray-800 text-[13px]">Resit Rasmi Pembayaran</span>
              </div>
              <div class="flex gap-2">
                <button @click="cetakResit"
                  class="flex items-center gap-1.5 text-[11px] bg-[#0F4C3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#155d47] transition-colors font-semibold">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  Cetak
                </button>
                <button @click="showDetail=false" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div id="cetakResit" class="overflow-y-auto max-h-[75vh]">

              <!-- Letterhead -->
              <div class="bg-[#0F4C3A] px-5 py-5 text-white text-center">
                <img src="/logo.png" alt="Logo" class="w-14 h-14 object-contain rounded-full bg-white/10 p-1 mx-auto mb-3"/>
                <p class="font-bold text-[12px] leading-snug">{{ KELAB.nama }}</p>
                <p class="text-white/60 text-[10px] mt-1">No. Pendaftaran: {{ KELAB.noPertubuhan }}</p>
                <p class="text-white/50 text-[10px] mt-0.5 leading-snug">{{ KELAB.alamat }}</p>
                <div class="mt-3 inline-block bg-white/15 border border-white/30 rounded-full px-4 py-0.5">
                  <span class="text-[11px] font-bold tracking-wider uppercase">Resit Rasmi Pembayaran</span>
                </div>
              </div>

              <!-- Status Bar -->
              <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                <span :class="['badge text-xs px-3 py-1', badgeResit(pilihan?.status)]">{{ pilihan?.status }}</span>
                <div class="text-right">
                  <p class="text-[10px] text-gray-400">Tarikh Transaksi</p>
                  <p class="font-mono font-semibold text-gray-700 text-[11px]">{{ pilihan?.tarikh }}</p>
                </div>
              </div>

              <div class="px-5 py-4 space-y-4">

                <!-- Maklumat Ahli -->
                <div>
                  <p class="section-title">Maklumat Ahli</p>
                  <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <div class="info-row">
                      <span class="info-label">Nama Penuh</span>
                      <span class="info-val font-semibold">{{ pilihan?.nama_penuh || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">No. Kad Pengenalan</span>
                      <span class="info-val font-mono">{{ pilihan?.no_kp || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">No. Ahli</span>
                      <span :class="['info-val font-bold', pilihan?.no_ahli ? 'text-[#0F4C3A]' : 'text-gray-300 italic']">
                        {{ pilihan?.no_ahli || 'Belum ditetapkan' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">E-mel</span>
                      <span class="info-val">{{ pilihan?.email || '—' }}</span>
                    </div>
                    <div class="info-row border-none">
                      <span class="info-label">No. Telefon</span>
                      <span class="info-val">{{ pilihan?.no_tel || '—' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Butiran Transaksi -->
                <div>
                  <p class="section-title">Butiran Transaksi</p>
                  <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <div class="info-row">
                      <span class="info-label">BillCode / Rujukan</span>
                      <a :href="`${toyyibpayBase}/${pilihan?.billCode}`" target="_blank" rel="noopener"
                        class="info-val font-mono text-[#0F4C3A] hover:underline flex items-center gap-1 justify-end">
                        {{ pilihan?.billCode }}
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </a>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Keterangan</span>
                      <span class="info-val text-right max-w-[200px]">{{ pilihan?.keterangan || '—' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Kaedah Bayaran</span>
                      <span class="info-val font-semibold">FPX / ToyyibPay</span>
                    </div>
                    <div class="info-row border-none">
                      <span class="info-label">Status</span>
                      <span :class="['info-val font-bold', statusColor(pilihan?.status)]">{{ pilihan?.status }}</span>
                    </div>
                  </div>
                </div>

                <!-- Jumlah -->
                <div class="bg-[#0F4C3A] rounded-xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p class="text-white/60 text-[10px] uppercase tracking-wider font-bold">Jumlah Bayaran</p>
                    <p class="text-white text-2xl font-bold tabular-nums mt-0.5">
                      RM <span>{{ parseFloat(pilihan?.amaun || 0).toFixed(2) }}</span>
                    </p>
                  </div>
                  <svg class="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>

                <!-- Sejarah Bayaran Ahli -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <p class="section-title mb-0">Sejarah Bayaran Ahli</p>
                    <button v-if="!sejarahDimuatkan" @click="muatSejarah(pilihan?.no_kp)"
                      class="text-[10px] text-[#0F4C3A] font-semibold hover:underline">
                      Muat →
                    </button>
                  </div>
                  <div v-if="loadingSejarah" class="text-[11px] text-gray-400 py-2">Memuatkan...</div>
                  <div v-else-if="sejarahAhli.length > 0" class="space-y-1.5 max-h-36 overflow-y-auto">
                    <div v-for="s in sejarahAhli" :key="s.billCode"
                      class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      <div class="min-w-0 flex-1 mr-3">
                        <p class="text-gray-700 font-medium truncate text-[11px]">{{ s.keterangan || '—' }}</p>
                        <p class="text-gray-400 font-mono text-[10px]">{{ s.tarikh }}</p>
                      </div>
                      <div class="text-right flex-shrink-0">
                        <p class="font-bold text-gray-800 tabular-nums text-[11px]">RM {{ parseFloat(s.amaun).toFixed(2) }}</p>
                        <span :class="['badge text-[9px]', badgeResit(s.status)]">{{ s.status }}</span>
                      </div>
                    </div>
                  </div>
                  <p v-else-if="sejarahDimuatkan" class="text-[11px] text-gray-400 py-1">Tiada sejarah lain.</p>
                </div>

              </div>

              <!-- Footer modal -->
              <div class="px-5 pb-4 pt-1 text-center border-t border-gray-100">
                <p class="text-[10px] text-gray-300">{{ KELAB.namaPendek }} &bull; {{ KELAB.noPertubuhan }}</p>
                <p class="text-[10px] text-gray-300">Dokumen ini dijana automatik oleh sistem. Sah tanpa tandatangan.</p>
              </div>
            </div>

            <!-- Bottom action -->
            <div class="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button @click="showDetail=false"
                class="text-[12px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-5 py-2 rounded-xl transition-colors">
                Tutup
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
import { KELAB } from '../../config/kelab';

const toyyibpayBase = import.meta.env.VITE_TOYYIBPAY_URL || 'https://toyyibpay.com';

const semuaResit      = ref([]);
const loading         = ref(true);
const carian          = ref('');
const filterStatus    = ref('');
const filterTahun     = ref('');
const filterBulan     = ref('');
const filterHari      = ref('');
const hal             = ref(1);
const hadPerHal       = 20;
const showDetail      = ref(false);
const pilihan         = ref(null);
const sejarahAhli     = ref([]);
const loadingSejarah  = ref(false);
const sejarahDimuatkan = ref(false);

// ── Helpers ──
const badgeResit = (s) => ({
  BERJAYA:    'badge-green',
  PENDING:    'badge-amber',
  GAGAL:      'badge-red',
  DIBATALKAN: 'badge-gray',
}[s] || 'badge-gray');

const statusColor = (s) => ({
  BERJAYA:    'text-emerald-600',
  PENDING:    'text-amber-500',
  GAGAL:      'text-red-500',
  DIBATALKAN: 'text-gray-400',
}[s] || 'text-gray-500');

// ── Senarai dropdown ──
const tahunSemasa = new Date().getFullYear();
const senaraiTahun = computed(() => {
  const tahun = new Set(semuaResit.value.map(r => r.tarikh?.substring(6, 10)).filter(Boolean));
  const hasil = [...tahun].sort((a, b) => b - a);
  if (hasil.length === 0) {
    return Array.from({ length: 4 }, (_, i) => tahunSemasa - i);
  }
  return hasil;
});

const senaraibulan = [
  { val: '01', label: 'Januari' }, { val: '02', label: 'Februari' }, { val: '03', label: 'Mac' },
  { val: '04', label: 'April' },   { val: '05', label: 'Mei' },       { val: '06', label: 'Jun' },
  { val: '07', label: 'Julai' },   { val: '08', label: 'Ogos' },      { val: '09', label: 'September' },
  { val: '10', label: 'Oktober' }, { val: '11', label: 'November' },  { val: '12', label: 'Disember' },
];

// ── Filter ──
// Format tarikh dari backend: "DD-MM-YYYY hh:mm AM/PM"
// substring(0,2)=DD, substring(3,5)=MM, substring(6,10)=YYYY
const resitTertapis = computed(() => {
  hal.value = 1;
  const c = carian.value.toLowerCase().trim();
  return semuaResit.value.filter(r => {
    if (c && ![(r.nama_penuh||''), (r.no_kp||''), (r.no_ahli||''), (r.billCode||''), (r.keterangan||'')]
      .join(' ').toLowerCase().includes(c)) return false;
    if (filterStatus.value && r.status !== filterStatus.value) return false;
    const t = r.tarikh || '';
    if (filterTahun.value && t.substring(6, 10) !== filterTahun.value) return false;
    if (filterBulan.value && t.substring(3, 5) !== filterBulan.value) return false;
    if (filterHari.value  && t.substring(0, 2) !== filterHari.value)  return false;
    return true;
  });
});

const adaFilter = computed(() =>
  carian.value || filterStatus.value || filterTahun.value || filterBulan.value || filterHari.value
);

const resetFilter = () => {
  carian.value = ''; filterStatus.value = '';
  filterTahun.value = ''; filterBulan.value = ''; filterHari.value = '';
};

// ── Stats ──
const statBerjaya = computed(() => ({
  bil: semuaResit.value.filter(r => r.status === 'BERJAYA').length,
  amaun: semuaResit.value.filter(r => r.status === 'BERJAYA').reduce((a, b) => a + parseFloat(b.amaun || 0), 0),
}));
const statPending = computed(() => ({
  bil: semuaResit.value.filter(r => r.status === 'PENDING').length,
  amaun: semuaResit.value.filter(r => r.status === 'PENDING').reduce((a, b) => a + parseFloat(b.amaun || 0), 0),
}));
const statGagal = computed(() => ({
  bil: semuaResit.value.filter(r => r.status === 'GAGAL').length,
  amaun: semuaResit.value.filter(r => r.status === 'GAGAL').reduce((a, b) => a + parseFloat(b.amaun || 0), 0),
}));
const jumlahAmaun = computed(() =>
  resitTertapis.value.reduce((a, b) => a + parseFloat(b.amaun || 0), 0)
);

// ── Pagination ──
const jumlahHal = computed(() => Math.max(1, Math.ceil(resitTertapis.value.length / hadPerHal)));
const resitTerpapar = computed(() => {
  const s = (hal.value - 1) * hadPerHal;
  return resitTertapis.value.slice(s, s + hadPerHal);
});
const halamanDipapar = computed(() => {
  const t = jumlahHal.value, h = hal.value;
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
  if (h <= 4) return [1, 2, 3, 4, 5];
  if (h >= t - 3) return [t-4, t-3, t-2, t-1, t];
  return [h-2, h-1, h, h+1, h+2];
});

// ── API ──
const muatResit = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/sejarah-bayaran');
    if (data.success) semuaResit.value = data.data;
  } catch (e) { console.error(e); }
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
    sejarahAhli.value = semuaResit.value.filter(
      r => r.no_kp === no_kp && r.billCode !== pilihan.value?.billCode
    );
    sejarahDimuatkan.value = true;
  } finally { loadingSejarah.value = false; }
};

// ── Cetak Resit ──
const cetakResit = () => {
  const p = pilihan.value;
  if (!p) return;
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const rm = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const statusLabel = { BERJAYA: 'LUNAS', PENDING: 'BELUM SELESAI', GAGAL: 'GAGAL', DIBATALKAN: 'DIBATALKAN' }[p.status] || p.status;
  const statusClr = { BERJAYA: '#047857', PENDING: '#b45309', GAGAL: '#b91c1c', DIBATALKAN: '#6b7280' }[p.status] || '#6b7280';
  const statusBg  = { BERJAYA: '#d1fae5', PENDING: '#fef3c7', GAGAL: '#fee2e2', DIBATALKAN: '#f3f4f6' }[p.status] || '#f3f4f6';

  // Logo sebagai data URL (baca dari DOM untuk elak CORS)
  const logoEl = document.querySelector('#cetakResit img');
  const logoSrc = logoEl?.src || '';

  const w = window.open('', '_blank', 'width=740,height=740');
  w.document.write(`<html><head><title>Resit — ${esc(p.billCode || '')}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;color:#222;max-width:620px;margin:auto;padding:0}
    .header{background:#0F4C3A;color:#fff;text-align:center;padding:28px 24px 22px}
    .header img{width:56px;height:56px;object-fit:contain;border-radius:50%;background:rgba(255,255,255,0.12);padding:4px;margin-bottom:10px}
    .header h1{font-size:13px;line-height:1.4;margin:0}
    .header p{font-size:10px;color:rgba(255,255,255,0.6);margin:3px 0 0}
    .header .tajuk{display:inline-block;margin-top:10px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:20px;padding:3px 16px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase}
    .status-bar{display:flex;justify-content:space-between;align-items:center;padding:10px 22px;background:#f9fafb;border-bottom:1px solid #eee}
    .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:bold;background:${statusBg};color:${statusClr}}
    .body{padding:18px 22px}
    .cap{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.8px;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #f0f0f0;padding-bottom:4px}
    .box{background:#f9fafb;border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:14px}
    .row{display:flex;justify-content:space-between;padding:7px 14px;border-bottom:1px solid #f0f0f0;font-size:11px}
    .row:last-child{border-bottom:none}
    .row .l{color:#888}.row .v{font-weight:bold;text-align:right;max-width:240px}
    .total{background:#0F4C3A;color:#fff;border-radius:10px;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .total .lbl{font-size:11px;text-transform:uppercase;letter-spacing:1px}
    .total .amt{font-size:22px;font-weight:bold}
    .footer{text-align:center;padding:14px;border-top:1px solid #eee;font-size:9px;color:#aaa;line-height:1.5}
    @media print{body{padding:0}}
  </style></head><body>
  <div class="header">
    <img src="${logoSrc}" alt="Logo" onerror="this.style.display='none'"/>
    <h1>${esc(KELAB.nama)}</h1>
    <p>No. Pendaftaran: ${esc(KELAB.noPertubuhan)}</p>
    <p style="font-size:10px;color:rgba(255,255,255,0.5);line-height:1.4;margin-top:2px">${esc(KELAB.alamat)}</p>
    <div class="tajuk">Resit Rasmi Pembayaran</div>
  </div>
  <div class="status-bar">
    <span class="badge">${statusLabel}</span>
    <div style="text-align:right">
      <div style="font-size:9px;color:#888">Tarikh Transaksi</div>
      <div style="font-size:11px;font-weight:bold;font-family:monospace">${esc(p.tarikh || '—')}</div>
    </div>
  </div>
  <div class="body">
    <p class="cap">Maklumat Ahli</p>
    <div class="box">
      <div class="row"><span class="l">Nama Penuh</span><span class="v">${esc(p.nama_penuh||'—')}</span></div>
      <div class="row"><span class="l">No. Kad Pengenalan</span><span class="v" style="font-family:monospace">${esc(p.no_kp||'—')}</span></div>
      <div class="row"><span class="l">No. Ahli</span><span class="v" style="color:#0F4C3A">${esc(p.no_ahli||'Belum ditetapkan')}</span></div>
      <div class="row"><span class="l">E-mel</span><span class="v">${esc(p.email||'—')}</span></div>
      <div class="row"><span class="l">No. Telefon</span><span class="v">${esc(p.no_tel||'—')}</span></div>
    </div>
    <p class="cap">Butiran Transaksi</p>
    <div class="box">
      <div class="row"><span class="l">BillCode / Rujukan</span><span class="v" style="font-family:monospace;color:#0F4C3A">${esc(p.billCode||'—')}</span></div>
      <div class="row"><span class="l">Keterangan</span><span class="v">${esc(p.keterangan||'—')}</span></div>
      <div class="row"><span class="l">Kaedah Bayaran</span><span class="v">FPX / ToyyibPay</span></div>
      <div class="row"><span class="l">Status</span><span class="v" style="color:${statusClr}">${esc(p.status||'—')}</span></div>
    </div>
    <div class="total">
      <span class="lbl">Jumlah Dibayar</span>
      <span class="amt">${rm(p.amaun)}</span>
    </div>
    <p style="font-size:9px;color:#aaa;text-align:center">Dicetak: ${tarikhCetak} &bull; Disahkan melalui FPX / ToyyibPay</p>
  </div>
  <div class="footer">
    <p>${esc(KELAB.namaPendek)} &bull; No. Pendaftaran ${esc(KELAB.noPertubuhan)}</p>
    <p>Dokumen ini dijana secara automatik oleh sistem. Sah tanpa tandatangan.</p>
  </div>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 450);
};

onMounted(muatResit);
</script>

<style scoped>
@reference "tailwindcss";

.field-label { @apply block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1; }
.field-input  { @apply w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-colors; }

.th-cell { @apply px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400; }
.td-cell { @apply px-3 py-3 text-xs; }

.badge       { @apply inline-block text-[10px] font-bold px-2 py-0.5 rounded-full; }
.badge-green { @apply bg-emerald-100 text-emerald-700; }
.badge-amber { @apply bg-amber-100 text-amber-700; }
.badge-red   { @apply bg-red-100 text-red-600; }
.badge-gray  { @apply bg-gray-100 text-gray-500; }

.pag-btn   { @apply w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 text-xs transition-colors; }
.pag-aktif { @apply bg-[#0F4C3A] text-white border-[#0F4C3A] hover:bg-[#155d47]; }

.section-title { @apply text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2; }
.info-row    { @apply flex items-start justify-between px-3 py-2 border-b border-gray-100 gap-3; }
.info-label  { @apply text-[11px] text-gray-400 flex-shrink-0; }
.info-val    { @apply text-[11px] text-gray-800 text-right; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }
</style>
