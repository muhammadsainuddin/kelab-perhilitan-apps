<template>
  <div class="space-y-4 pb-8 animate-page-in">

    <!-- HEADER -->
    <div class="px-1 pt-1">
      <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Pengurusan Kewangan</p>
      <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Yuran Tahunan</h2>
      <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
        Sesi Januari – Disember {{ tahunSemasa }}
      </p>
    </div>

    <!-- STATUS CARD -->
    <div class="relative overflow-hidden rounded-3xl"
      :style="!profil.yuran_tertunggak
        ? 'background: #081C15; box-shadow: 0 16px 40px rgba(8,28,21,0.25), 0 0 0 1px rgba(82,183,136,0.12);'
        : 'background: #1a0808; box-shadow: 0 16px 40px rgba(28,8,8,0.25), 0 0 0 1px rgba(239,68,68,0.15);'">
      <div class="absolute inset-0 opacity-[0.025]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 96px;"></div>
      <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        :style="!profil.yuran_tertunggak
          ? 'background: radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 65%);'
          : 'background: radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 65%);'"></div>
      <div class="absolute top-0 left-0 right-0"
        :style="!profil.yuran_tertunggak
          ? 'height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 40%, #D4AF37 60%, transparent);'
          : 'height: 1.5px; background: linear-gradient(90deg, transparent, #ef4444 50%, transparent);'"></div>

      <div class="relative z-10 p-5">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-[8px] font-black uppercase tracking-[0.2em] mb-1"
              :style="!profil.yuran_tertunggak ? 'color: rgba(149,213,178,0.5);' : 'color: rgba(252,165,165,0.5);'">
              Sesi Kewangan {{ tahunSemasa }}
            </p>
            <h3 class="text-[20px] font-black text-white uppercase leading-tight tracking-wide">
              {{ profil.yuran_tertunggak ? 'Yuran Tertunggak' : 'Yuran Dijelaskan' }}
            </h3>
          </div>
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            :style="!profil.yuran_tertunggak
              ? 'background: rgba(82,183,136,0.15); border: 1px solid rgba(82,183,136,0.25);'
              : 'background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.25);'">
            <svg v-if="!profil.yuran_tertunggak" class="w-5 h-5" style="color: #52B788;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid rgba(255,255,255,0.08);">
          <p v-if="!profil.yuran_tertunggak" class="text-[11px] font-medium leading-relaxed"
            style="color: rgba(149,213,178,0.7);">
            Keahlian anda aktif. Akses penuh bagi modul bantuan kebajikan dan pendaftaran acara dibuka sehingga
            <strong class="text-white font-black">31 Disember {{ tahunSemasa }}</strong>.
          </p>
          <p v-else class="text-[11px] font-medium leading-relaxed" style="color: rgba(252,165,165,0.7);">
            Fungsi pendaftaran acara dan permohonan bantuan disekat sementara sehingga yuran tahunan diselesaikan.
          </p>
        </div>
      </div>
    </div>

    <!-- PENDING TX BANNER -->
    <div v-if="hasPendingTx"
      class="rounded-[20px] p-4 flex items-center gap-3"
      style="background: #FFFBEB; border: 1px solid rgba(245,158,11,0.3);">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style="background: rgba(245,158,11,0.15);">
        <svg class="w-5 h-5 text-amber-500 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </div>
      <div>
        <p class="text-[11px] font-black uppercase tracking-wide" style="color: #92400e;">Semakan Bank Sedang Berjalan</p>
        <p class="text-[10px] font-medium mt-0.5 leading-relaxed" style="color: rgba(146,64,14,0.75);">
          Sistem menunggu pengesahan FPX. Sila tunggu sebentar (maks. 15 minit).
        </p>
      </div>
    </div>

    <!-- INVOICE CARD -->
    <div v-if="profil.yuran_tertunggak && !hasPendingTx"
      class="rounded-3xl overflow-hidden bg-white"
      style="border: 1px solid #F1F5F9; box-shadow: 0 2px 16px rgba(15,23,42,0.06);">
      <div class="px-5 py-4 flex items-center justify-between" style="border-bottom: 1px solid #F1F5F9; background: #F8FAFC;">
        <div>
          <p class="text-[8px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Invois Pembaharuan</p>
          <p class="text-[11px] font-black mt-0.5" style="color: #0F172A;">Yuran Tahunan {{ tahunSemasa }}</p>
        </div>
        <span class="text-[9px] font-black font-mono px-2.5 py-1 rounded-lg"
          style="background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0;">
          INV-{{ tahunSemasa }}-{{ profil.no_kp?.slice(-4) || '0000' }}
        </span>
      </div>

      <div class="p-5 space-y-3">
        <div class="space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase tracking-wide" style="color: #94a3b8;">Tempoh Sesi</span>
            <span class="text-[11px] font-black uppercase" style="color: #0F172A;">Jan – Dis {{ tahunSemasa }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase tracking-wide" style="color: #94a3b8;">Kadar Bulanan</span>
            <span class="text-[11px] font-black font-mono" style="color: #0F172A;">RM {{ kadarYuranBulanan.toFixed(2) }} × 12 Bulan</span>
          </div>
        </div>

        <div class="flex justify-between items-center py-3.5 px-4 rounded-2xl" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
          <span class="text-[11px] font-black uppercase tracking-wide" style="color: #0F172A;">Jumlah Perlu Dibayar</span>
          <span class="text-[24px] font-black leading-none font-mono" style="color: #0F172A;">RM {{ jumlahPerluBayar.toFixed(2) }}</span>
        </div>

        <button @click="bayarYuran" :disabled="isProcessing || jumlahPerluBayar <= 0"
          class="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-60"
          style="background: #081C15; color: #95D5B2;">
          <span v-if="isProcessing" class="animate-pulse">Menghubungi Bank...</span>
          <template v-else>
            <span>Bayar via ToyyibPay</span>
            <span class="flex items-center px-2 py-0.5 rounded shadow-sm" style="background: white;">
              <span class="font-black italic text-[9px] text-rose-600">F</span>
              <span class="font-black italic text-[9px] text-blue-800">P</span>
              <span class="font-black italic text-[9px] text-amber-500">X</span>
            </span>
          </template>
        </button>
      </div>
    </div>

    <!-- TRANSACTION HISTORY -->
    <div class="rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #F1F5F9; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #F1F5F9;">
        <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Sejarah Transaksi FPX</p>
        <button @click="fetchSejarah"
          class="text-[9px] font-black uppercase tracking-wide transition-all active:scale-95"
          style="color: #52B788;">
          Muat Semula
        </button>
      </div>

      <div v-if="sejarahBayaran.length === 0" class="py-10 text-center">
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada rekod transaksi</p>
      </div>

      <div v-else class="divide-y" style="border-color: #F8FAFC;">
        <div v-for="tx in sejarahBayaran" :key="tx.billCode"
          class="flex items-center gap-3 px-4 py-3.5">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            :style="tx.status === 'BERJAYA'
              ? 'background: rgba(82,183,136,0.1);'
              : tx.status === 'PENDING'
                ? 'background: rgba(245,158,11,0.1);'
                : 'background: rgba(239,68,68,0.1);'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              :style="tx.status === 'BERJAYA' ? 'color: #2D6A4F;' : tx.status === 'PENDING' ? 'color: #92400e;' : 'color: #991b1b;'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black uppercase truncate" style="color: #0F172A;">{{ tx.keterangan }}</p>
            <p class="text-[9px] font-mono mt-0.5" style="color: #94a3b8;">{{ tx.billCode }} · {{ tx.tarikh }}</p>
          </div>
          <div class="text-right shrink-0 flex items-center gap-2">
            <div>
              <p class="text-[13px] font-black tabular-nums" style="color: #0F172A;">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
              <span class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-0.5"
                :style="tx.status === 'BERJAYA'
                  ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                  : tx.status === 'PENDING'
                    ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                    : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                {{ tx.status }}
              </span>
            </div>
            <button v-if="tx.status === 'BERJAYA'" @click="lihatResit(tx)"
              class="text-[9px] font-black uppercase tracking-wide flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
              style="color: #2D6A4F; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.18);">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Resit
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../../services/api';
import { cetakResitTransaksi } from '../../config/kelab';

const profil = ref({});

const lihatResit = (tx) => cetakResitTransaksi(tx, profil.value);
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

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>