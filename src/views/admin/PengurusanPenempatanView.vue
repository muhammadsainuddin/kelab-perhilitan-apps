<template>
  <div class="space-y-4 font-sans text-gray-900 pb-10 text-xs">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h2 class="font-bold text-base text-gray-900">Pengurusan Penempatan (PTJ)</h2>
        <p class="text-gray-500 text-[11px] mt-0.5">Urus senarai jabatan, bahagian, dan unit yang menjadi penempatan ahli.</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button @click="muatData"
          class="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Semula
        </button>
        <button @click="bukaModalTambah"
          class="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#0F4C3A] hover:bg-[#0a3328] px-3 py-2 rounded-lg transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Tambah Penempatan
        </button>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Jumlah PTJ</p>
        <p class="text-2xl font-black text-gray-800 mt-1 tabular-nums">{{ senaraiPenempatan.length }}</p>
        <p class="text-[9px] text-gray-400 mt-0.5">rekod penempatan</p>
      </div>
      <div class="bg-white border border-blue-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-blue-500 uppercase tracking-wider">PTJ Induk</p>
        <p class="text-2xl font-black text-blue-700 mt-1 tabular-nums">{{ jumlahInduk }}</p>
        <p class="text-[9px] text-blue-400 mt-0.5">jabatan / bahagian</p>
      </div>
      <div class="bg-white border border-violet-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-violet-500 uppercase tracking-wider">PTJ Anak</p>
        <p class="text-2xl font-black text-violet-700 mt-1 tabular-nums">{{ jumlahAnak }}</p>
        <p class="text-[9px] text-violet-400 mt-0.5">unit / sub-unit</p>
      </div>
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Jumlah Ahli</p>
        <p class="text-2xl font-black text-emerald-700 mt-1 tabular-nums">{{ jumlahAhliKeseluruhan }}</p>
        <p class="text-[9px] text-emerald-500 mt-0.5">dalam semua PTJ</p>
      </div>
    </div>

    <!-- CARIAN -->
    <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
      <div class="relative">
        <input v-model="carian" type="text" placeholder="Cari nama penempatan..."
          class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
        <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>

    <p class="text-gray-400 text-[11px]">
      Menunjukkan <span class="text-gray-700 font-bold">{{ senaraiTertapis.length }}</span> daripada <span class="text-gray-700 font-bold">{{ senaraiPenempatan.length }}</span> penempatan
    </p>

    <!-- JADUAL -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="sedangMuat" class="py-16 flex flex-col items-center gap-3 text-gray-400">
        <svg class="w-6 h-6 animate-spin text-[#0F4C3A]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="text-[11px]">Memuat data...</span>
      </div>

      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3 w-8">#</th>
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3">Nama Penempatan</th>
            <th class="text-left font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Induk</th>
            <th class="text-center font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3 w-20">Ahli</th>
            <th class="text-center font-bold text-[10px] text-gray-500 uppercase tracking-wider px-4 py-3 w-24">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="senaraiTertapis.length === 0">
            <td colspan="5" class="py-12 text-center text-gray-400 text-[11px]">Tiada rekod penempatan dijumpai.</td>
          </tr>
          <tr v-for="(ptj, i) in senaraiTertapis" :key="ptj.id"
            :class="['border-b border-gray-50 hover:bg-gray-50/60 transition-colors', ptj.induk_id ? 'bg-gray-50/30' : '']">
            <td class="px-4 py-3 text-gray-400 text-[10px] tabular-nums">{{ i + 1 }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span v-if="ptj.induk_id" class="text-gray-300 text-sm select-none">↳</span>
                <div>
                  <p :class="['font-semibold text-xs', ptj.induk_id ? 'text-gray-600' : 'text-gray-900']">
                    {{ ptj.nama_penempatan }}
                  </p>
                  <span v-if="!ptj.induk_id && hitungAnak(ptj.id) > 0"
                    class="inline-block mt-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-px rounded-full">
                    {{ hitungAnak(ptj.id) }} sub-unit
                  </span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span v-if="ptj.nama_induk" class="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                {{ ptj.nama_induk }}
              </span>
              <span v-else class="text-[10px] text-gray-300">—</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="[
                'inline-block text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums',
                ptj.jumlah_ahli > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 bg-gray-50'
              ]">{{ ptj.jumlah_ahli }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <button @click="bukaModalEdit(ptj)" title="Kemaskini"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="confirmPadam(ptj)" title="Padam"
                  :disabled="ptj.jumlah_ahli > 0 || hitungAnak(ptj.id) > 0"
                  :class="[
                    'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                    ptj.jumlah_ahli > 0 || hitungAnak(ptj.id) > 0
                      ? 'text-gray-200 cursor-not-allowed'
                      : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                  ]">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL TAMBAH / EDIT -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="tutupModal">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-sm text-gray-900">{{ modEdit ? 'Kemaskini Penempatan' : 'Tambah Penempatan Baru' }}</h3>
              <button @click="tutupModal" class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 space-y-4">
              <!-- Ralat -->
              <div v-if="mesejRalat" class="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-xs text-rose-700 font-medium">
                {{ mesejRalat }}
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-600 mb-1.5">Nama Penempatan <span class="text-rose-500">*</span></label>
                <input v-model="form.nama_penempatan" type="text" placeholder="e.g. Bahagian Pengurusan Biodiversiti"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-600 mb-1.5">PTJ Induk (pilihan)</label>
                <select v-model="form.induk_id"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
                  <option :value="null">— Tiada Induk (PTJ Utama) —</option>
                  <option v-for="induk in senaraiInduk" :key="induk.id" :value="induk.id"
                    :disabled="modEdit && induk.id === form.id">
                    {{ induk.nama_penempatan }}
                  </option>
                </select>
                <p class="text-[10px] text-gray-400 mt-1">Biarkan kosong jika ini adalah jabatan / bahagian utama.</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button @click="tutupModal"
                class="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Batal
              </button>
              <button @click="simpan" :disabled="sedangSimpan"
                class="px-4 py-2 text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0a3328] disabled:opacity-60 rounded-lg transition-colors flex items-center gap-1.5">
                <svg v-if="sedangSimpan" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ modEdit ? 'Kemaskini' : 'Tambah' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL CONFIRM PADAM -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showConfirmPadam" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showConfirmPadam = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="px-6 py-5 text-center">
              <div class="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <h3 class="font-bold text-sm text-gray-900 mb-1">Padam Penempatan?</h3>
              <p class="text-[11px] text-gray-500">
                <span class="font-semibold text-gray-700">{{ ptjDipilihPadam?.nama_penempatan }}</span> akan dipadam secara kekal.
              </p>
              <div v-if="mesejRalatPadam" class="mt-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-[11px] text-rose-700 font-medium text-left">
                {{ mesejRalatPadam }}
              </div>
            </div>
            <div class="px-6 pb-5 flex gap-2">
              <button @click="showConfirmPadam = false; mesejRalatPadam = ''"
                class="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Batal
              </button>
              <button @click="padamPenempatan" :disabled="sedangPadam"
                class="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <svg v-if="sedangPadam" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Ya, Padam
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

const senaraiPenempatan = ref([]);
const sedangMuat    = ref(false);
const sedangSimpan  = ref(false);
const sedangPadam   = ref(false);
const carian        = ref('');
const showModal     = ref(false);
const showConfirmPadam  = ref(false);
const modEdit       = ref(false);
const mesejRalat    = ref('');
const mesejRalatPadam = ref('');
const ptjDipilihPadam = ref(null);

const form = ref({ id: null, nama_penempatan: '', induk_id: null });

// ── Computed ──
const senaraiInduk = computed(() =>
  senaraiPenempatan.value.filter(p => !p.induk_id)
);

const jumlahInduk = computed(() =>
  senaraiPenempatan.value.filter(p => !p.induk_id).length
);

const jumlahAnak = computed(() =>
  senaraiPenempatan.value.filter(p => !!p.induk_id).length
);

const jumlahAhliKeseluruhan = computed(() =>
  senaraiPenempatan.value.reduce((sum, p) => sum + (p.jumlah_ahli || 0), 0)
);

const senaraiTertapis = computed(() => {
  if (!carian.value.trim()) return senaraiPenempatan.value;
  const q = carian.value.toLowerCase();
  return senaraiPenempatan.value.filter(p =>
    (p.nama_penempatan || '').toLowerCase().includes(q) ||
    (p.nama_induk || '').toLowerCase().includes(q)
  );
});

const hitungAnak = (id) =>
  senaraiPenempatan.value.filter(p => p.induk_id === id).length;

// ── Data ──
const muatData = async () => {
  sedangMuat.value = true;
  try {
    const { data } = await api.get('/admin/penempatan');
    if (data.success) senaraiPenempatan.value = data.data;
  } catch {
    /* senyap */
  } finally {
    sedangMuat.value = false;
  }
};

// ── Modal Tambah / Edit ──
const bukaModalTambah = () => {
  modEdit.value = false;
  form.value = { id: null, nama_penempatan: '', induk_id: null };
  mesejRalat.value = '';
  showModal.value = true;
};

const bukaModalEdit = (ptj) => {
  modEdit.value = true;
  form.value = { id: ptj.id, nama_penempatan: ptj.nama_penempatan, induk_id: ptj.induk_id || null };
  mesejRalat.value = '';
  showModal.value = true;
};

const tutupModal = () => {
  showModal.value = false;
  mesejRalat.value = '';
};

const simpan = async () => {
  if (!form.value.nama_penempatan.trim()) {
    mesejRalat.value = 'Nama penempatan wajib diisi.';
    return;
  }
  sedangSimpan.value = true;
  mesejRalat.value = '';
  try {
    const payload = {
      nama_penempatan: form.value.nama_penempatan.trim(),
      induk_id: form.value.induk_id || null,
    };
    if (modEdit.value) {
      await api.put(`/admin/penempatan/${form.value.id}`, payload);
    } else {
      await api.post('/admin/penempatan', payload);
    }
    tutupModal();
    await muatData();
  } catch (err) {
    mesejRalat.value = err.response?.data?.message || 'Ralat berlaku. Sila cuba lagi.';
  } finally {
    sedangSimpan.value = false;
  }
};

// ── Padam ──
const confirmPadam = (ptj) => {
  ptjDipilihPadam.value = ptj;
  mesejRalatPadam.value = '';
  showConfirmPadam.value = true;
};

const padamPenempatan = async () => {
  if (!ptjDipilihPadam.value) return;
  sedangPadam.value = true;
  mesejRalatPadam.value = '';
  try {
    await api.delete(`/admin/penempatan/${ptjDipilihPadam.value.id}`);
    showConfirmPadam.value = false;
    await muatData();
  } catch (err) {
    mesejRalatPadam.value = err.response?.data?.message || 'Gagal memadam penempatan.';
  } finally {
    sedangPadam.value = false;
  }
};

onMounted(muatData);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
