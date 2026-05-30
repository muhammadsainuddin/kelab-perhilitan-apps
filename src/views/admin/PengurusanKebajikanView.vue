<template>
  <div class="space-y-6 font-sans text-gray-900 pb-10">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-2xl text-gray-900">Permohonan Kebajikan</h2>
        <p class="text-gray-500 text-sm mt-1">Urus kelulusan dan sumbangan kebajikan kepada ahli kelab.</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-5 py-4 font-bold">Pemohon</th>
              <th class="px-4 py-4 font-bold">Jenis Bantuan</th>
              <th class="px-4 py-4 font-bold hidden md:table-cell">Keterangan</th>
              <th class="px-4 py-4 font-bold text-center">Status / Amaun</th>
              <th class="text-center px-4 py-4 font-bold">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500">Memuatkan data...</td>
            </tr>
            <tr v-else-if="senarai.length === 0">
              <td colspan="5" class="px-5 py-16 text-center text-gray-500">Tiada permohonan ditemui.</td>
            </tr>
            <tr v-for="b in senarai" :key="b.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-4">
                <p class="text-gray-900 font-bold text-sm">{{ b.nama_pegawai }}</p>
                <p class="text-gray-500 text-[11px] font-mono mt-0.5">{{ b.no_kp }}</p>
                <p class="text-gray-400 text-[10px] mt-0.5">{{ b.penempatan }}</p>
              </td>
              <td class="px-4 py-4 font-medium text-gray-800">
                {{ b.jenis_bantuan }}
                <div v-if="b.dokumen_sokongan && b.dokumen_sokongan !== '[]'" class="mt-1.5 flex flex-wrap gap-1">
                  <a v-for="doc in parseDoc(b.dokumen_sokongan)" :key="doc"
                     :href="`${apiBase}/uploads/bantuan/${doc}`" target="_blank"
                     class="text-[9px] font-bold text-[#0F4C3A] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md hover:underline">
                    📄 Lampiran
                  </a>
                </div>
              </td>
              <td class="px-4 py-4 text-gray-500 text-xs hidden md:table-cell max-w-[200px] truncate" :title="b.keterangan">
                {{ b.keterangan }}
              </td>
              <td class="px-4 py-4 text-center">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider', badgeStatus(b.status_permohonan)]">
                  {{ b.status_permohonan || 'DIPROSES' }}
                </span>
                <p v-if="b.status_permohonan === 'LULUS'" class="text-emerald-700 font-black text-xs mt-1.5">
                  RM {{ parseFloat(b.amaun_lulus || 0).toFixed(2) }}
                </p>
              </td>
              <td class="px-4 py-4 text-center space-x-2">
                <template v-if="b.status_permohonan === 'DIPROSES' || !b.status_permohonan">
                  <button @click="bukaLulus(b)" class="text-[11px] font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">Lulus</button>
                  <button @click="tolakBantuan(b.id)" class="text-[11px] font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors">Tolak</button>
                </template>
                <span v-else class="text-xs text-gray-400 font-medium italic">Selesai</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalLulus" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showModalLulus = false">
          <div class="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-md shadow-2xl">
            <h3 class="text-gray-900 font-bold text-xl mb-1">Kelulusan Bantuan</h3>
            <p class="text-gray-500 text-xs mb-5">Sila masukkan jumlah sumbangan (RM) untuk disalurkan ke buku tunai.</p>
            
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
              <p class="text-[10px] font-bold text-gray-500 uppercase">Pemohon</p>
              <p class="font-bold text-gray-900">{{ permohonanDipilih?.nama_pegawai }}</p>
              <p class="text-[10px] font-bold text-gray-500 uppercase mt-2">Jenis Bantuan</p>
              <p class="font-bold text-[#0F4C3A]">{{ permohonanDipilih?.jenis_bantuan }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Amaun Lulus (RM) *</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">RM</span>
                <input v-model="amaunLulus" type="number" min="0" step="0.50" placeholder="0.00" required
                  class="w-full bg-white border border-gray-300 text-emerald-700 font-black text-lg rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"/>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button @click="showModalLulus = false" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">Batal</button>
              <button @click="sahkanLulus" :disabled="memproses" class="px-5 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                {{ memproses ? 'Memproses...' : 'Sahkan Kelulusan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
const senarai = ref([]);
const loading = ref(true);

const showModalLulus = ref(false);
const permohonanDipilih = ref(null);
const amaunLulus = ref('');
const memproses = ref(false);

const badgeStatus = (s) => {
  if (s === 'LULUS') return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (s === 'DITOLAK') return 'bg-rose-100 text-rose-800 border border-rose-200';
  return 'bg-amber-100 text-amber-800 border border-amber-200';
};

const parseDoc = (str) => { try { return JSON.parse(str); } catch { return [str]; } };

const muatKebajikan = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/kebajikan');
    if (data.success) senarai.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const bukaLulus = (bantuan) => {
  permohonanDipilih.value = bantuan;
  amaunLulus.value = '';
  showModalLulus.value = true;
};

const sahkanLulus = async () => {
  if (!amaunLulus.value || parseFloat(amaunLulus.value) <= 0) return alert('Sila masukkan amaun yang sah.');
  memproses.value = true;
  try {
    await api.put(`/admin/kebajikan/${permohonanDipilih.value.id}`, {
      status_permohonan: 'LULUS',
      amaun_lulus: amaunLulus.value
    });
    showModalLulus.value = false;
    alert('Bantuan diluluskan dan direkodkan ke buku tunai secara automatik.');
    muatKebajikan();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat memproses kelulusan.');
  } finally { memproses.value = false; }
};

const tolakBantuan = async (id) => {
  if (!confirm("Pasti mahu menolak permohonan ini?")) return;
  try {
    await api.put(`/admin/kebajikan/${id}`, { status_permohonan: 'DITOLAK' });
    muatKebajikan();
  } catch (e) { alert("Ralat menolak bantuan."); }
};

onMounted(muatKebajikan);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>