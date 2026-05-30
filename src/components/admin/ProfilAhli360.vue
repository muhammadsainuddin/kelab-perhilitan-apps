<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[100] bg-black/60 flex flex-col h-screen overflow-hidden backdrop-blur-sm" @click.self="$emit('close')">
        
        <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div class="flex items-center gap-4">
            <button @click="$emit('close')" class="text-gray-500 hover:text-[#0F4C3A] bg-gray-100 hover:bg-emerald-50 p-2 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h3 class="text-gray-900 font-bold text-lg leading-tight">Profil Lengkap Ahli 360°</h3>
              <p class="text-[#0F4C3A] text-[11px] font-bold uppercase tracking-wider mt-0.5">{{ ahliBase?.no_kp }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider border hidden sm:block', badgeStatus(ahliLengkap?.status_ahli)]">
              {{ ahliLengkap?.status_ahli || 'TIDAK AKTIF' }}
            </span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div v-if="loading" class="flex flex-col items-center justify-center h-64 gap-3 text-white">
            <svg class="animate-spin w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            <p class="font-bold text-sm tracking-widest uppercase">Menarik Rekod 360°...</p>
          </div>

          <div v-else class="max-w-6xl mx-auto space-y-6 pb-10">
            <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/60 relative">
              <button @click="$emit('edit', ahliLengkap)" class="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors border border-gray-200">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                Edit Data
              </button>

              <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div class="w-24 h-24 rounded-2xl bg-[#08151D] text-[#87BCB5] flex items-center justify-center font-black text-4xl shadow-inner uppercase overflow-hidden shrink-0">
                  <img v-if="ahliLengkap?.gambar" :src="`${apiBase}/uploads/images/${ahliLengkap.gambar}`" class="w-full h-full object-cover" />
                  <span v-else>{{ (ahliLengkap?.nama_pegawai || '?').charAt(0) }}</span>
                </div>
                
                <div class="flex-1 text-center sm:text-left min-w-0">
                  <h3 class="text-xl font-black text-[#08151D] uppercase leading-tight">{{ ahliLengkap?.nama_pegawai || 'Nama Kakitangan' }}</h3>
                  <p class="text-sm text-[#567778] mt-1 font-medium">{{ ahliLengkap?.penempatan || 'Sila Kemaskini Penempatan' }}</p>
                  
                  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    <span class="text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded">No Ahli: {{ ahliLengkap?.no_ahli || 'BELUM JANA' }}</span>
                    <span class="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> {{ ahliLengkap?.jenis_potongan || 'Manual' }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100 text-xs text-center sm:text-left">
                <div><span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-1">No. Telefon</span><span class="font-bold text-[#08151D]">{{ ahliLengkap?.phone || '-' }}</span></div>
                <div><span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-1">Gred SSPA</span><span class="font-bold text-[#08151D] uppercase">{{ ahliLengkap?.gred_sspa || '-' }}</span></div>
                <div><span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-1">Umur</span><span class="font-bold text-[#08151D]">{{ kiraUmur(ahliLengkap?.no_kp) }} Tahun</span></div>
                <div><span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-1">Saiz Baju</span><span class="font-bold text-[#08151D] uppercase">{{ ahliLengkap?.saiz_baju || '-' }}</span></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 flex flex-col justify-center">
                <div class="flex items-center gap-2 mb-3"><svg class="w-4 h-4 text-[#87BCB5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg><h4 class="text-[11px] font-black text-[#08151D] uppercase tracking-wider">Perbankan Ahli</h4></div>
                <div>
                  <p class="text-[10px] text-[#567778] font-bold uppercase mb-0.5">Nama Bank</p><p class="text-sm font-bold text-[#08151D] uppercase mb-3">{{ ahliLengkap?.nama_bank || 'Tiada Rekod' }}</p>
                  <p class="text-[10px] text-[#567778] font-bold uppercase mb-0.5">No. Akaun Bank</p><p class="text-sm font-bold text-[#08151D] font-mono">{{ ahliLengkap?.no_akaun_bank || '-' }}</p>
                </div>
              </div>

              <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 flex flex-col justify-center">
                <div class="flex items-center gap-2 mb-3"><svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg><h4 class="text-[11px] font-black text-[#08151D] uppercase tracking-wider">Waris / Khairat</h4></div>
                <div class="space-y-2 text-xs">
                  <div><p class="text-[#567778] font-medium mb-0.5">Nama Waris</p><p class="font-bold text-[#08151D] uppercase line-clamp-1">{{ ahliLengkap?.nama_waris || 'Tiada Rekod' }}</p></div>
                  <div class="flex justify-between">
                    <div><p class="text-[#567778] font-medium mb-0.5">Tel Waris</p><p class="font-bold text-[#08151D] font-mono">{{ ahliLengkap?.no_phone_waris || '-' }}</p></div>
                    <div class="text-right"><p class="text-[#567778] font-medium mb-0.5">Bank Waris</p><p class="font-bold text-[#08151D] uppercase">{{ ahliLengkap?.nama_bank_waris || '-' }}</p><p class="font-mono text-gray-500 text-[10px]">{{ ahliLengkap?.akaun_bank_waris || '' }}</p></div>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-[#0F4C3A] to-[#08151D] rounded-[24px] p-5 border border-[#0F4C3A] shadow-lg flex flex-col justify-center text-center relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <p class="text-white/70 text-[10px] font-bold uppercase tracking-wider z-10">Sumbangan Kewangan</p>
                <h3 class="text-white text-3xl font-black mt-1 z-10 tabular-nums">RM {{ jumlahSumbangan.toFixed(2) }}</h3>
                <p class="text-[#87BCB5] text-[10px] font-medium mt-2 z-10">Yuran Tahunan & Pembelian Kedai</p>
              </div>
            </div>

            <div v-if="tuntutBajuPercuma" class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
              <div class="w-10 h-10 bg-amber-400 text-white rounded-full flex items-center justify-center text-lg shadow-sm shrink-0">👕</div>
              <div class="flex-1">
                <p class="text-amber-900 font-bold text-sm">Tuntutan Baju / Item Percuma Kelab</p>
                <p class="text-amber-700 text-[11px] font-medium mt-0.5">Ahli ini telah menuntut merchandise percuma kelab.</p>
              </div>
              <div class="bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-black uppercase shrink-0">Telah Dituntut</div>
            </div>

            <div class="bg-white rounded-[24px] border border-gray-200/60 shadow-sm overflow-hidden min-h-[400px]">
              <div class="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto custom-scrollbar">
                <button @click="tab = 'kewangan'" :class="['px-6 py-4 text-xs font-black border-b-2 whitespace-nowrap transition-colors uppercase tracking-widest', tab === 'kewangan' ? 'border-[#08151D] text-[#08151D] bg-white' : 'border-transparent text-gray-400 hover:text-gray-800']">Sejarah FPX</button>
                <button @click="tab = 'acara'" :class="['px-6 py-4 text-xs font-black border-b-2 whitespace-nowrap transition-colors uppercase tracking-widest', tab === 'acara' ? 'border-[#08151D] text-[#08151D] bg-white' : 'border-transparent text-gray-400 hover:text-gray-800']">Acara Disertai</button>
                <button @click="tab = 'kebajikan'" :class="['px-6 py-4 text-xs font-black border-b-2 whitespace-nowrap transition-colors uppercase tracking-widest', tab === 'kebajikan' ? 'border-[#08151D] text-[#08151D] bg-white' : 'border-transparent text-gray-400 hover:text-gray-800']">Bantuan Diterima</button>
              </div>

              <div class="p-0">
                <div v-if="tab === 'kewangan'" class="overflow-x-auto">
                  <table class="w-full text-xs text-left">
                    <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr><th class="px-5 py-3.5">Tarikh</th><th class="px-5 py-3.5">Perkara / Butiran</th><th class="px-5 py-3.5">No. FPX</th><th class="px-5 py-3.5 text-right">Amaun</th><th class="px-5 py-3.5 text-center">Status</th><th class="px-5 py-3.5 text-center">Tindakan</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-if="rekodTransaksi.length === 0"><td colspan="6" class="px-5 py-12 text-center text-gray-400 font-medium text-sm">Tiada sebarang rekod bayaran untuk ahli ini.</td></tr>
                      <tr v-for="tx in rekodTransaksi" :key="tx.billCode" class="hover:bg-gray-50/50">
                        <td class="px-5 py-3 text-gray-600 font-medium whitespace-nowrap">{{ tx.tarikh }}</td>
                        <td class="px-5 py-3 font-bold text-gray-900 truncate max-w-[250px]" :title="tx.keterangan">{{ tx.keterangan }}</td>
                        <td class="px-5 py-3 font-mono text-gray-500 text-[10px]">{{ tx.billCode }}</td>
                        <td class="px-5 py-3 text-right font-black tabular-nums text-sm" :class="tx.status==='BERJAYA'?'text-emerald-600':'text-gray-900'">RM {{ parseFloat(tx.amaun).toFixed(2) }}</td>
                        <td class="px-5 py-3 text-center"><span :class="['text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border', tx.status==='BERJAYA'?'bg-emerald-50 border-emerald-200 text-emerald-700':(tx.status==='PENDING'?'bg-amber-50 border-amber-200 text-amber-700':'bg-rose-50 border-rose-200 text-rose-700')]">{{ tx.status }}</span></td>
                        <td class="px-5 py-3 text-center">
                          <button v-if="tx.status==='BERJAYA'" @click="cetakResit(tx)" class="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 mx-auto">
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg> Cetak
                          </button>
                          <span v-else class="text-gray-300 text-[10px] font-bold">-</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else-if="tab === 'acara'" class="overflow-x-auto">
                  <table class="w-full text-xs text-left">
                    <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <tr><th class="px-5 py-3.5">Tarikh Acara</th><th class="px-5 py-3.5">Nama Acara</th><th class="px-5 py-3.5">Kategori / Pasukan</th><th class="px-5 py-3.5">Tarikh Daftar</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-if="rekodAcara.length === 0"><td colspan="4" class="px-5 py-12 text-center text-gray-400 font-medium text-sm">Ahli ini belum menyertai sebarang acara kelab.</td></tr>
                      <tr v-for="(a, idx) in rekodAcara" :key="idx" class="hover:bg-gray-50/50">
                        <td class="px-5 py-3.5 font-bold text-[#0F4C3A] whitespace-nowrap">{{ a.tarikh_acara }}</td>
                        <td class="px-5 py-3.5 font-bold text-gray-900">{{ a.nama_acara }} <span class="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 ml-1 rounded">{{ a.jenis_acara || 'Umum' }}</span></td>
                        <td class="px-5 py-3.5 text-gray-700 font-medium">{{ a.kategori || 'Individu' }}</td>
                        <td class="px-5 py-3.5 text-gray-500 font-mono text-[10px]">{{ a.tarikh_daftar }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else-if="tab === 'kebajikan'" class="p-5 space-y-3">
                  <div v-if="rekodBantuan.length === 0" class="text-center py-10 text-gray-400 font-medium text-sm">Tiada rekod permohonan bantuan/kebajikan.</div>
                  <div v-for="b in rekodBantuan" :key="b.id" class="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p class="text-gray-900 font-bold text-sm">{{ b.jenis_bantuan }}</p>
                      <p class="text-gray-600 text-xs mt-1 max-w-xl">{{ b.keterangan || 'Tiada butiran lanjut' }}</p>
                      <p class="text-gray-400 text-[10px] font-medium mt-2">Dimohon pada: <span class="font-mono">{{ b.tarikh_mohon }}</span></p>
                    </div>
                    <div class="text-right sm:shrink-0 bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-[120px]">
                      <span :class="['text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded block mb-1 text-center border', b.status_permohonan==='LULUS'?'bg-emerald-100 text-emerald-800 border-emerald-200':(b.status_permohonan==='DITOLAK'?'bg-rose-100 text-rose-800 border-rose-200':'bg-amber-100 text-amber-800 border-amber-200')]">
                        {{ b.status_permohonan || 'DIPROSES' }}
                      </span>
                      <p v-if="b.status_permohonan === 'LULUS'" class="text-emerald-600 font-black text-sm text-center tabular-nums">RM {{ parseFloat(b.amaun_lulus || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({ show: Boolean, ahliBase: Object });
const emit = defineEmits(['close', 'edit']);
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const loading = ref(false);
const ahliLengkap = ref(null);
const tab = ref('kewangan');

const rekodTransaksi = ref([]);
const rekodBantuan = ref([]);
const rekodAcara = ref([]);
const jumlahSumbangan = ref(0);
const tuntutBajuPercuma = ref(false);

const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const kiraUmur = (ic) => {
  if (!ic || ic.length < 12) return '-';
  let year = parseInt(ic.substring(0, 2));
  year += (year > parseInt(new Date().getFullYear().toString().substring(2))) ? 1900 : 2000;
  return new Date().getFullYear() - year;
};

// Tarik data bila modal dibuka
watch(() => props.show, async (newVal) => {
  if (newVal && props.ahliBase?.no_kp) {
    loading.value = true;
    tab.value = 'kewangan';
    ahliLengkap.value = { ...props.ahliBase }; // Default fallback
    jumlahSumbangan.value = 0;
    tuntutBajuPercuma.value = false;
    rekodTransaksi.value = [];
    rekodBantuan.value = [];
    rekodAcara.value = [];

    try {
      // 1. Profil Penuh
      const resProfil = await api.get(`/admin/profil-ahli/${props.ahliBase.no_kp}`);
      if (resProfil.data?.success) ahliLengkap.value = resProfil.data.data;

      // 2. Transaksi FPX (Dari adminController.js)
      const resResit = await api.get('/admin/sejarah-bayaran');
      if (resResit.data?.success) {
        const semuaTx = resResit.data.data.filter(t => t.no_kp === props.ahliBase.no_kp);
        rekodTransaksi.value = semuaTx;
        jumlahSumbangan.value = semuaTx.filter(t => t.status === 'BERJAYA').reduce((sum, t) => sum + parseFloat(t.amaun), 0);
        tuntutBajuPercuma.value = semuaTx.some(t => parseFloat(t.amaun) === 0 && t.keterangan.toLowerCase().includes('kedai'));
      }

      // 3. Kebajikan
      const resKebajikan = await api.get('/admin/kebajikan');
      if (resKebajikan.data?.success) {
        rekodBantuan.value = resKebajikan.data.data.filter(b => b.no_kp === props.ahliBase.no_kp);
      }

      // 4. Acara
      try {
        const resAcara = await api.get(`/admin/acara-ahli/${props.ahliBase.no_kp}`);
        if (resAcara.data?.success) rekodAcara.value = resAcara.data.data;
      } catch (e) {}

    } catch (e) {
      console.error("Gagal muat profil 360", e);
    } finally {
      loading.value = false;
    }
  }
});

const cetakResit = (tx) => {
  const w = window.open('', '_blank', 'width=600,height=500');
  w.document.write(`
    <html><head><title>Resit ${tx.billCode}</title>
    <style>body{font-family:Arial;padding:30px;color:#333} h1{color:#0F4C3A;font-size:18px;text-align:center} .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}</style>
    </head><body>
    <h1>KELAB KAKITANGAN PERHILITAN</h1>
    <p style="text-align:center;font-size:11px;color:#888;margin-top:-10px;margin-bottom:20px">Resit Transaksi Pembayaran</p>
    <div style="background:#f9f9f9;padding:15px;border-radius:8px">
      <div class="row"><span style="color:#888">Nama Pembayar:</span><strong>${ahliLengkap.value?.nama_pegawai}</strong></div>
      <div class="row"><span style="color:#888">No KP:</span><strong>${ahliLengkap.value?.no_kp}</strong></div>
      <div class="row"><span style="color:#888">Tarikh:</span><strong>${tx.tarikh}</strong></div>
      <div class="row"><span style="color:#888">Rujukan Sistem:</span><strong>${tx.billCode}</strong></div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:15px 0"/>
      <div class="row"><span style="color:#888">Keterangan:</span><strong>${tx.keterangan}</strong></div>
      <div class="row" style="margin-top:15px;font-size:16px"><span style="color:#888">JUMLAH (RM):</span><strong style="color:#0F4C3A">${parseFloat(tx.amaun).toFixed(2)}</strong></div>
    </div>
    <p style="text-align:center;margin-top:40px;font-size:10px;color:#888">Cetakan berkomputer tidak memerlukan tandatangan.</p>
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>