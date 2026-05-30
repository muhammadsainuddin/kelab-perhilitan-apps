<template>
  <div class="space-y-6 animate-fade-in pb-10">
    
    <div class="px-1">
      <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Yuran Tahunan</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Pengurusan yuran kelab sesi Januari - Disember {{ tahunSemasa }}.</p>
    </div>

    <div class="relative overflow-hidden rounded-[24px] p-6 shadow-xl border"
         :class="!profil.yuran_tertunggak ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 border-emerald-700' : 'bg-gradient-to-br from-rose-800 to-rose-900 border-rose-700'">
      <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      
      <div class="relative z-10 flex justify-between items-start">
        <div>
          <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">Sesi Kewangan {{ tahunSemasa }}</p>
          <h3 class="text-xl font-black text-white uppercase tracking-tight leading-none">
            {{ profil.yuran_tertunggak ? 'YURAN TERTUNGGAK' : 'YURAN DIJELASKAN' }}
          </h3>
        </div>
        <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-inner text-white shrink-0">
          <svg v-if="!profil.yuran_tertunggak" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
      </div>
      
      <div class="relative z-10 mt-5 pt-4 border-t border-white/20">
        <p v-if="!profil.yuran_tertunggak" class="text-[11px] text-white/90 font-medium leading-relaxed">
          Keahlian anda aktif. Akses penuh bagi modul bantuan kebajikan dan pendaftaran acara dibuka sehingga <strong class="text-white font-black">31 Disember {{ tahunSemasa }}</strong>.
        </p>
        <p v-else class="text-[11px] text-white/90 font-medium leading-relaxed">
          Akaun anda kekal aktif. Walau bagaimanapun, fungsi pendaftaran acara dan permohonan bantuan disekat sementara sehingga yuran tahunan diselesaikan.
        </p>
      </div>
    </div>

    <div v-if="hasPendingTx" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-center shadow-sm">
      <svg class="w-6 h-6 text-amber-500 animate-spin shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      <div>
        <p class="text-xs font-bold text-amber-800 uppercase tracking-wide">Semakan Bank Sedang Berjalan</p>
        <p class="text-[10px] text-amber-700 mt-0.5 leading-relaxed">Sistem sedang menunggu pengesahan FPX. Sila tunggu sebentar (maksimum 15 minit).</p>
      </div>
    </div>

    <div v-if="profil.yuran_tertunggak && !hasPendingTx" class="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-200/60">
      <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <span class="text-[10px] font-black text-[#567778] uppercase tracking-widest">Invois Pembaharuan</span>
        <span class="text-[10px] font-mono font-bold text-[#08151D] bg-white border border-gray-200 px-2 py-1 rounded-md">INV-{{ tahunSemasa }}-{{ profil.no_kp?.slice(-4) || '0000' }}</span>
      </div>
      
      <div class="p-5 space-y-4">
        <div class="space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="font-bold text-[#567778] uppercase text-[10px]">Tempoh Sesi</span>
            <span class="font-black text-[#08151D] uppercase">Jan - Dis {{ tahunSemasa }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-bold text-[#567778] uppercase text-[10px]">Kadar Kiraan</span>
            <span class="font-mono font-black text-[#08151D]">RM {{ kadarYuranBulanan.toFixed(2) }} x 12 Bulan</span>
          </div>
        </div>

        <div class="border-t border-dashed border-gray-200 pt-3 flex justify-between items-end">
          <span class="text-[11px] font-black text-[#08151D] uppercase tracking-widest">Jumlah Perlu Dibayar</span>
          <span class="text-2xl font-mono font-black text-[#08151D] leading-none">RM {{ jumlahPerluBayar.toFixed(2) }}</span>
        </div>

        <button @click="bayarYuran" :disabled="isProcessing || jumlahPerluBayar <= 0"
                class="w-full mt-2 py-4 bg-[#08151D] text-[#87BCB5] hover:bg-[#0E303D] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70">
          <span v-if="isProcessing" class="animate-pulse">Menghubungi Bank...</span>
          <template v-else>
            <span class="uppercase tracking-widest">Bayar via ToyyibPay</span>
            <span class="bg-white px-1.5 py-0.5 rounded flex items-center shadow-sm">
              <span class="text-rose-600 font-black italic text-[9px]">F</span>
              <span class="text-blue-800 font-black italic text-[9px]">P</span>
              <span class="text-amber-500 font-black italic text-[9px]">X</span>
            </span>
          </template>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-[24px] shadow-sm border border-gray-200/60 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 class="text-[10px] font-black text-[#08151D] uppercase tracking-widest">Sejarah Transaksi FPX</h3>
        <button @click="fetchSejarah" class="text-[#87BCB5] hover:text-[#08151D] text-xs font-bold transition-colors">
          Muat Semula
        </button>
      </div>
      
      <div class="divide-y divide-gray-100">
        <div v-if="sejarahBayaran.length === 0" class="text-center py-8 text-[11px] text-[#567778] font-medium uppercase tracking-wider">Tiada rekod transaksi ditemui.</div>
        <div v-else v-for="tx in sejarahBayaran" :key="tx.billCode" class="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-1.5 h-8 rounded-full shrink-0" 
                 :class="tx.status === 'BERJAYA' ? 'bg-[#87BCB5]' : (tx.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500')"></div>
            <div class="min-w-0">
              <p class="font-bold text-[#08151D] text-[11px] truncate uppercase">{{ tx.keterangan }}</p>
              <span class="text-[9px] text-[#567778] block mt-0.5 font-mono">{{ tx.billCode }} | {{ tx.tarikh }}</span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="font-mono font-bold text-[#08151D] text-xs">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
            <span class="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border inline-block mt-1"
                  :class="tx.status === 'BERJAYA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : (tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100')">
              {{ tx.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../../services/api';

const profil = ref({});
const sejarahBayaran = ref([]);
const isProcessing = ref(false);
const tahunSemasa = new Date().getFullYear();
let autoPollInterval = null;

// Mengira kadar bulanan pintar (Fallback) jika database bernilai 0.00
const kadarYuranBulanan = computed(() => {
  const yuranDB = parseFloat(profil.value.yuran_kelab_bulanan || 0);
  if (yuranDB > 0) return yuranDB;

  const gred = (profil.value.gred_sspa || '').toUpperCase();
  if (gred.includes('JUSA') || gred.includes('VU') || gred.includes('VK') || gred.includes('UTAMA')) return 15.00;
  
  const match = gred.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 9 && num <= 14) return 10.00;
    if (num >= 1 && num <= 8) return 5.00;
  }
  return 5.00; 
});

const jumlahPerluBayar = computed(() => kadarYuranBulanan.value * 12);
const hasPendingTx = computed(() => sejarahBayaran.value.some(tx => tx.status === 'PENDING'));

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil'); 
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

const fetchSejarah = async () => {
  try {
    // Ubah URL di bawah:
    const res = await api.get('/bayaran/sejarah-yuran');
    sejarahBayaran.value = res.data.data || [];
    if (hasPendingTx.value) mulakanAutoPolling();
    else hentikanAutoPolling();
  } catch (e) { console.error(e); }
};

const mulakanAutoPolling = () => {
  if (autoPollInterval) return;
  autoPollInterval = setInterval(async () => {
    const pendingTx = sejarahBayaran.value.find(tx => tx.status === 'PENDING');
    if (!pendingTx) {
      hentikanAutoPolling();
      return;
    }
    try {
      const res = await api.get(`/bayaran/semak-status/${pendingTx.billCode}`);
      if (res.data.status === 'BERJAYA' || res.data.status === 'GAGAL' || res.data.status === 'DIBATALKAN') {
        hentikanAutoPolling();
        await fetchSejarah();
        await fetchProfil();
      }
    } catch (e) {}
  }, 10000); 
};

const hentikanAutoPolling = () => {
  if (autoPollInterval) {
    clearInterval(autoPollInterval);
    autoPollInterval = null;
  }
};

const bayarYuran = async () => {
  isProcessing.value = true;
  try {
    const response = await api.post('/bayaran/cipta-bil', {
      jenis_bayaran: 'YURAN',
      keterangan: `Yuran Tahunan Sesi ${tahunSemasa}`,
      amaun: jumlahPerluBayar.value
    });
    if (response.data.success && response.data.bill_url) {
      window.location.href = response.data.bill_url;
    }
  } catch (error) {
    alert(error.response?.data?.message || "Gagal memproses pautan ToyyibPay.");
  } finally { isProcessing.value = false; }
};

onMounted(() => {
  fetchProfil();
  fetchSejarah();
});

onUnmounted(() => {
  hentikanAutoPolling();
});
</script>