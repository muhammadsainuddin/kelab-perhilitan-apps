<template>
  <div class="space-y-5">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-gray-900 font-bold text-xl">Pengurusan Kebajikan</h2>
        <p class="text-gray-500 text-sm">Semak dan proses permohonan bantuan ahli.</p>
      </div>
      <div class="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
        <button v-for="tab in tabs" :key="tab.id" @click="tabAktif = tab.id; muatData()"
          :class="['px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
            tabAktif === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          {{ tab.label }}
          <span v-if="tab.id==='kebajikan' && bilanganMenunggu > 0"
            class="ml-1.5 bg-red-100 text-red-600 text-[9px] font-bold px-1.5 rounded-full">{{ bilanganMenunggu }}</span>
        </button>
      </div>
    </div>

    <!-- FILTER -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="f in filterOpsyen" :key="f.value" @click="filterStatus = f.value"
        :class="['text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
          filterStatus === f.value ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
        {{ f.label }}
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl bg-gray-100 animate-pulse"/>
    </div>

    <!-- KOSONG -->
    <div v-else-if="permohonanTertapis.length === 0"
      class="bg-white rounded-xl border border-gray-200 py-14 text-center text-gray-400 text-sm">
      Tiada permohonan dijumpai.
    </div>

    <!-- SENARAI -->
    <div v-else class="space-y-3">
      <div v-for="p in permohonanTertapis" :key="p.id"
        class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">

          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
                <span class="text-[#0F4C3A] text-sm font-bold">{{ (p.nama_pegawai||'?').charAt(0) }}</span>
              </div>
              <div>
                <p class="text-gray-900 font-semibold text-sm">{{ p.nama_pegawai }}</p>
                <p class="text-gray-400 text-xs">{{ p.no_kp }} · {{ p.penempatan || '—' }}</p>
              </div>
            </div>

            <template v-if="tabAktif==='kebajikan'">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-medium">{{ p.jenis_bantuan }}</span>
                <span class="text-gray-400 text-xs">{{ formatTarikh(p.tarikh_mohon) }}</span>
              </div>
              <p v-if="p.keterangan" class="text-gray-600 text-xs leading-relaxed line-clamp-2">{{ p.keterangan }}</p>
            </template>
            <template v-else>
              <p class="text-gray-600 text-xs"><span class="text-gray-400">Sebab: </span>{{ p.sebab_berhenti||'—' }}</p>
              <p class="text-gray-400 text-xs">{{ formatTarikh(p.tarikh_mohon) }}</p>
            </template>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', badgeStatus(p.status_permohonan)]">
              {{ p.status_permohonan || 'MENUNGGU' }}
            </span>
            <div class="flex gap-2">
              <!-- View Details -->
              <button @click="bukaDetail(p)"
                class="text-xs text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-3 py-1.5 rounded-lg transition-colors font-medium border border-[#0F4C3A]/20">
                Details
              </button>
              <!-- Aksi jika masih MENUNGGU -->
              <template v-if="!p.status_permohonan || p.status_permohonan==='MENUNGGU'">
                <button @click="tindakan(p,'DITOLAK')" :disabled="memproses===p.id"
                  class="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100 disabled:opacity-50">Tolak</button>
                <button @click="tindakan(p,'LULUS')" :disabled="memproses===p.id"
                  class="text-xs text-white bg-[#0F4C3A] hover:bg-[#155d47] px-3 py-1.5 rounded-lg transition-colors font-semibold disabled:opacity-50">
                  {{ memproses===p.id ? '...' : 'Lulus' }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         MODAL VIEW DETAILS + CETAK
    ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetail" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          @click.self="showDetail=false">
          <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="text-gray-900 font-bold text-lg">Maklumat Permohonan</h3>
              <div class="flex gap-2">
                <button @click="cetakPermohonan"
                  class="flex items-center gap-1.5 text-xs bg-[#0F4C3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#155d47] transition-colors font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Cetak
                </button>
                <button @click="showDetail=false" class="text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Kandungan yang boleh dicetak -->
            <div id="cetakKebajikan" class="p-6 space-y-4">

              <!-- Header Cetak (hanya nampak bila cetak) -->
              <div class="hidden print:block text-center mb-6">
                <h2 class="text-xl font-bold text-gray-900">KELAB KAKITANGAN PERHILITAN</h2>
                <p class="text-sm text-gray-600">Borang Permohonan Bantuan Kebajikan</p>
                <p class="text-xs text-gray-400 mt-1">Dicetak pada: {{ tarikhSekarang }}</p>
                <hr class="mt-3"/>
              </div>

              <!-- Status Badge -->
              <div class="flex items-center justify-between">
                <span :class="['text-xs font-bold px-3 py-1 rounded-full', badgeStatus(pilihan?.status_permohonan)]">
                  {{ pilihan?.status_permohonan || 'MENUNGGU' }}
                </span>
                <span class="text-gray-400 text-xs font-mono">ID: #{{ pilihan?.id }}</span>
              </div>

              <!-- Maklumat Pemohon -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Maklumat Pemohon</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div><p class="text-xs text-gray-400">Nama</p><p class="font-semibold text-gray-900">{{ pilihan?.nama_pegawai }}</p></div>
                  <div><p class="text-xs text-gray-400">No. KP</p><p class="font-semibold text-gray-900 font-mono">{{ pilihan?.no_kp }}</p></div>
                  <div><p class="text-xs text-gray-400">Penempatan</p><p class="font-semibold text-gray-900">{{ pilihan?.penempatan||'—' }}</p></div>
                  <div><p class="text-xs text-gray-400">Tarikh Mohon</p><p class="font-semibold text-gray-900">{{ formatTarikh(pilihan?.tarikh_mohon) }}</p></div>
                </div>
              </div>

              <!-- Butiran Permohonan (Kebajikan) -->
              <div v-if="tabAktif==='kebajikan'" class="bg-gray-50 rounded-xl p-4 space-y-2">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Butiran Permohonan</p>
                <div><p class="text-xs text-gray-400">Jenis Bantuan</p><p class="font-semibold text-gray-900">{{ pilihan?.jenis_bantuan }}</p></div>
                <div><p class="text-xs text-gray-400">Keterangan</p><p class="text-sm text-gray-700 leading-relaxed mt-1">{{ pilihan?.keterangan||'Tiada keterangan.' }}</p></div>
              </div>

              <!-- Butiran (Berhenti) -->
              <div v-else class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sebab Berhenti</p>
                <p class="text-sm text-gray-700 leading-relaxed">{{ pilihan?.sebab_berhenti||'—' }}</p>
              </div>

              <!-- Dokumen -->
              <div v-if="tabAktif==='kebajikan' && pilihan?.dokumen_sokongan" class="space-y-2">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Dokumen Sokongan</p>
                <div class="flex flex-wrap gap-2">
                  <a v-for="(dok,i) in parseDokumen(pilihan.dokumen_sokongan)" :key="i"
                    :href="`/uploads/bantuan/${dok}`" target="_blank"
                    class="flex items-center gap-1.5 text-xs text-[#0F4C3A] bg-[#0F4C3A]/10 px-3 py-1.5 rounded-lg hover:bg-[#0F4C3A]/20 transition-colors border border-[#0F4C3A]/20">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                    Dokumen {{ i+1 }}
                  </a>
                </div>
              </div>

              <!-- Cop / Tandatangan untuk cetak -->
              <div class="hidden print:block mt-8 grid grid-cols-2 gap-8 text-center text-xs text-gray-500">
                <div>
                  <div class="border-t border-gray-400 pt-2 mt-8">Tandatangan Pemohon</div>
                </div>
                <div>
                  <div class="border-t border-gray-400 pt-2 mt-8">Cop & Tandatangan Admin</div>
                </div>
              </div>

            </div>

            <!-- Footer Modal -->
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

const tabAktif   = ref('kebajikan');
const permohonan = ref([]);
const loading    = ref(true);
const memproses  = ref(null);
const filterStatus = ref('');
const showDetail = ref(false);
const pilihan    = ref(null);

const tarikhSekarang = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });

const tabs = [
  { id: 'kebajikan', label: 'Bantuan Kebajikan' },
  { id: 'berhenti',  label: 'Permohonan Berhenti' },
];
const filterOpsyen = [
  { value: '',         label: 'Semua' },
  { value: 'MENUNGGU', label: '⏳ Menunggu' },
  { value: 'LULUS',    label: '✅ Lulus' },
  { value: 'DITOLAK',  label: '❌ Ditolak' },
];

const bilanganMenunggu = computed(() =>
  permohonan.value.filter(p => !p.status_permohonan || p.status_permohonan==='MENUNGGU').length
);
const permohonanTertapis = computed(() => {
  if (!filterStatus.value) return permohonan.value;
  return permohonan.value.filter(p => (p.status_permohonan||'MENUNGGU') === filterStatus.value);
});

const badgeStatus = (s) => ({
  'MENUNGGU': 'bg-amber-100 text-amber-700',
  'LULUS':    'bg-green-100 text-green-700',
  'DITOLAK':  'bg-red-100 text-red-600',
}[s||'MENUNGGU'] || 'bg-amber-100 text-amber-700');

const formatTarikh = (t) => t ? new Date(t).toLocaleDateString('ms-MY', { day:'numeric', month:'short', year:'numeric' }) : '—';
const parseDokumen = (dok) => { try { return JSON.parse(dok); } catch { return [dok]; } };

const muatData = async () => {
  loading.value = true; permohonan.value = [];
  try {
    const { data } = await api.get(tabAktif.value==='kebajikan' ? '/admin/kebajikan' : '/admin/berhenti');
    if (data.success) permohonan.value = data.data;
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
};

const tindakan = async (p, status) => {
  memproses.value = p.id;
  try {
    if (tabAktif.value==='kebajikan') await api.put(`/admin/kebajikan/${p.id}`, { status_permohonan: status });
    else await api.put(`/admin/berhenti/${p.id}/lulus`, { no_kp: p.no_kp, status_permohonan: status });
    await muatData();
  } catch(e) { console.error(e); }
  finally { memproses.value = null; }
};

const bukaDetail = (p) => { pilihan.value = p; showDetail.value = true; };

const cetakPermohonan = () => {
  const el = document.getElementById('cetakKebajikan');
  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(`
    <html><head><title>Permohonan Kebajikan #${pilihan.value?.id}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
      h2 { text-align: center; font-size: 18px; margin-bottom: 4px; }
      p { text-align: center; font-size: 12px; color: #666; margin: 2px 0; }
      hr { margin: 12px 0; }
      .section { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 16px; margin: 12px 0; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .label { font-size: 11px; color: #888; }
      .value { font-weight: bold; font-size: 13px; }
      .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
      .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; text-align: center; font-size: 11px; color: #888; }
      .sign-line { border-top: 1px solid #aaa; padding-top: 4px; margin-top: 40px; }
    </style></head><body>
    <h2>KELAB KAKITANGAN PERHILITAN</h2>
    <p>Borang Permohonan Bantuan Kebajikan</p>
    <p>Dicetak pada: ${tarikhSekarang}</p>
    <hr/>
    ${el.innerHTML}
    </body></html>
  `);
  w.document.close();
  setTimeout(() => { w.print(); }, 400);
};

onMounted(muatData);
</script>
<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
@media print { .no-print { display: none !important; } }
</style>