
<template>
  <div class="w-full space-y-6">

    <!-- TOOLBAR: Stat Cards + Butang Tambah -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="grid grid-cols-3 gap-3 w-full lg:max-w-xl">
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Jumlah</p>
            <p class="text-xl font-black text-gray-900 mt-0.5">{{ jumlahAcara }}</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Aktif</p>
            <p class="text-xl font-black text-emerald-600 mt-0.5">{{ jumlahAktif }}</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Peserta</p>
            <p class="text-xl font-black text-gray-900 mt-0.5">{{ jumlahPeserta }}</p>
          </div>
        </div>
      </div>

      <button @click="bukaBorangBaru"
        class="shrink-0 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-sm">Tambah Acara Baru</span>
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium flex items-center gap-2">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      {{ successMsg }}
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <!-- Search & Filter Bar -->
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="carian" type="text" placeholder="Cari nama acara atau lokasi..."
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all">
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button @click="filterStatus = ''"
            :class="filterStatus === '' ? 'bg-gray-800 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Semua</button>
          <button @click="filterStatus = 'AKTIF'"
            :class="filterStatus === 'AKTIF' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Aktif</button>
          <button @click="filterStatus = 'TUTUP'"
            :class="filterStatus === 'TUTUP' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Tutup</button>
          <button @click="filterStatus = 'SELESAI'"
            :class="filterStatus === 'SELESAI' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Selesai</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-16 text-center">
        <svg class="w-6 h-6 animate-spin text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-sm text-gray-400 font-medium">Memuatkan data...</p>
      </div>

      <!-- Empty (tiada data langsung) -->
      <div v-else-if="senaraiAcara.length === 0" class="p-16 flex flex-col items-center text-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-800">Tiada rekod acara</p>
          <p class="text-xs text-gray-400 mt-0.5">Klik "Tambah Acara Baru" untuk mula.</p>
        </div>
      </div>

      <!-- Empty (ada data tapi tiada carian match) -->
      <div v-else-if="acaraTapis.length === 0" class="p-12 flex flex-col items-center text-center gap-2">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <p class="text-sm font-bold text-gray-500">Tiada acara sepadan carian</p>
        <button @click="carian = ''; filterStatus = ''" class="text-xs text-emerald-600 font-bold hover:underline">Papar semua</button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="px-5 py-3.5 pl-6">Acara</th>
              <th class="px-5 py-3.5">Lokasi & Tarikh</th>
              <th class="px-5 py-3.5">Sukan</th>
              <th class="px-5 py-3.5 text-center">Peserta</th>
              <th class="px-5 py-3.5">Status</th>
              <th class="px-5 py-3.5 pr-6 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 text-gray-700">
            <tr v-for="acara in acaraTapis" :key="acara.id"
              class="hover:bg-gray-50/80 transition-colors group">

              <!-- Acara -->
              <td class="px-5 py-4 pl-6">
                <div class="flex items-center gap-3">
                  <!-- Poster thumbnail -->
                  <div class="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                    <img v-if="getPosterUrl(acara.poster)"
                      :src="getPosterUrl(acara.poster)"
                      :alt="acara.nama_acara"
                      class="w-full h-full object-cover"
                      @error="e => e.target.style.display='none'">
                    <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-gray-900 leading-snug truncate max-w-55">{{ acara.nama_acara }}</div>
                    <span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                      :class="{
                        'bg-emerald-50 text-emerald-700': acara.jenis_acara === 'SUKAN',
                        'bg-blue-50 text-blue-700': acara.jenis_acara === 'KEBAJIKAN',
                        'bg-violet-50 text-violet-700': acara.jenis_acara === 'SOSIAL',
                        'bg-amber-50 text-amber-700': acara.jenis_acara === 'MESYUARAT'
                      }">
                      {{ acara.jenis_acara }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Lokasi & Tarikh -->
              <td class="px-5 py-4">
                <div class="font-semibold text-gray-800 text-xs truncate max-w-45">{{ acara.lokasi || '—' }}</div>
                <div class="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatTarikh(acara.tarikh_acara) }}
                </div>
                <div v-if="acara.tarikh_tutup" class="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Tutup: {{ formatTarikh(acara.tarikh_tutup) }}
                </div>
              </td>

              <!-- Sukan -->
              <td class="px-5 py-4">
                <div v-if="acara.jenis_acara === 'SUKAN'">
                  <div class="flex flex-wrap gap-1 max-w-55">
                    <span v-for="sukan in safeArr(acara.senarai_sukan).slice(0, 3)" :key="sukan"
                      class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-semibold">
                      {{ sukan }}
                    </span>
                    <span v-if="safeArr(acara.senarai_sukan).length > 3"
                      class="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-bold">
                      +{{ safeArr(acara.senarai_sukan).length - 3 }}
                    </span>
                    <span v-if="safeArr(acara.senarai_sukan).length === 0" class="text-[11px] text-gray-300 italic">Belum ditetapkan</span>
                  </div>
                  <div class="text-[10px] mt-1.5 font-semibold flex items-center gap-1"
                    :class="acara.benarkan_pelbagai_sukan ? 'text-indigo-500' : 'text-gray-400'">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path v-if="acara.benarkan_pelbagai_sukan" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    {{ acara.benarkan_pelbagai_sukan ? 'Pelbagai sukan' : 'Had 1 sukan' }}
                  </div>
                </div>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>

              <!-- Peserta -->
              <td class="px-5 py-4 text-center">
                <button @click="paparkanPeserta(acara)"
                  class="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ acara.jumlah_peserta || 0 }} orang
                </button>
              </td>

              <!-- Status -->
              <td class="px-5 py-4">
                <span v-if="acara.status === 'AKTIF'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>AKTIF
                </span>
                <span v-else-if="acara.status === 'TUTUP'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>TUTUP
                </span>
                <span v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>SELESAI
                </span>
              </td>

              <!-- Tindakan -->
              <td class="px-5 py-4 pr-6">
                <div class="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button @click="bukaKontinjen(acara)" title="Panel Ketua Kontinjen"
                    class="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </button>
                  <div class="w-px h-5 bg-gray-200 mx-0.5"></div>
                  <button @click="bukaBorangEdit(acara)" title="Kemaskini"
                    class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="padamAcaraId(acara.id)" title="Padam"
                    class="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table Footer -->
        <div class="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p class="text-xs text-gray-400 font-medium">
            Papar <span class="font-bold text-gray-700">{{ acaraTapis.length }}</span>
            <template v-if="acaraTapis.length !== senaraiAcara.length">
              daripada {{ senaraiAcara.length }}
            </template>
            rekod
          </p>
          <p v-if="carian || filterStatus" class="text-xs text-emerald-600 font-bold cursor-pointer hover:underline"
            @click="carian = ''; filterStatus = ''">
            Kosongkan penapis
          </p>
        </div>
      </div>
    </div>

    <!-- KOMPONEN MODAL & PANEL -->

    <ModalBorangAcara
      :show="paparanModalBorang"
      :modEdit="modEdit"
      :idAcara="idAcaraDipilih"
      :formAsal="formEditAsal"
      @tutup="paparanModalBorang = false"
      @disimpan="onAcaraDisimpan"
    />

    <ModalSenaraiPeserta
      :show="paparanModalPeserta"
      :namaAcara="namaAcaraDipilih"
      :senarai="senaraiPeserta"
      @tutup="paparanModalPeserta = false"
    />

    <PanelKontinjenSukan
      :show="paparanPanel"
      :acaraId="idAcaraKontinjen"
      @tutup="paparanPanel = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import ModalBorangAcara from '../../components/aktiviti/ModalBorangAcara.vue';
import ModalSenaraiPeserta from '../../components/aktiviti/ModalSenaraiPeserta.vue';
import PanelKontinjenSukan from '../../components/aktiviti/PanelKontinjenSukan.vue';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

// STATE UTAMA
const senaraiAcara = ref([]);
const senaraiPeserta = ref([]);
const loading = ref(false);
const successMsg = ref('');

// PAPARAN
const paparanModalBorang = ref(false);
const paparanModalPeserta = ref(false);
const paparanPanel = ref(false);

// CARIAN & FILTER
const carian = ref('');
const filterStatus = ref('');

// DATA KOMPONEN ANAK
const modEdit = ref(false);
const idAcaraDipilih = ref(null);
const namaAcaraDipilih = ref('');
const formEditAsal = ref(null);
const idAcaraKontinjen = ref(null);

// STATISTIK
const jumlahAcara = computed(() => senaraiAcara.value.length);
const jumlahAktif = computed(() => senaraiAcara.value.filter(a => a.status === 'AKTIF').length);
const jumlahPeserta = computed(() => senaraiAcara.value.reduce((t, a) => t + (Number(a.jumlah_peserta) || 0), 0));

// ACARA TAPIS (search + filter)
const acaraTapis = computed(() => {
  const kata = carian.value.trim().toLowerCase();
  return senaraiAcara.value.filter(a => {
    const cocokCarian = !kata
      || a.nama_acara.toLowerCase().includes(kata)
      || (a.lokasi || '').toLowerCase().includes(kata);
    const cocokStatus = !filterStatus.value || a.status === filterStatus.value;
    return cocokCarian && cocokStatus;
  });
});

// UTILITI
const safeArr = (v) => {
  if (!v) return [];
  try { return Array.isArray(v) ? v : JSON.parse(v); } catch { return []; }
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const getPosterUrl = (poster) => {
  if (!poster) return null;
  try {
    const arr = typeof poster === 'string' ? JSON.parse(poster) : poster;
    if (Array.isArray(arr) && arr.length > 0) return `${apiBase}/uploads/images/${arr[0]}`;
  } catch { }
  return null;
};

// FUNGSI

const muatNaikAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/acara/admin/semua');
    if (res.data.success) senaraiAcara.value = res.data.data;
  } catch {
    // senyap
  } finally {
    loading.value = false;
  }
};

const bukaBorangBaru = () => {
  modEdit.value = false;
  idAcaraDipilih.value = null;
  formEditAsal.value = null;
  paparanModalBorang.value = true;
};

const bukaBorangEdit = (acara) => {
  modEdit.value = true;
  idAcaraDipilih.value = acara.id;
  const isoDate = (d) => d ? d.substring(0, 10) : '';
  formEditAsal.value = {
    nama_acara: acara.nama_acara,
    jenis_acara: acara.jenis_acara,
    keterangan: acara.keterangan || '',
    lokasi: acara.lokasi || '',
    tarikh_acara: isoDate(acara.tarikh_acara),
    tarikh_tutup: isoDate(acara.tarikh_tutup),
    emel_urusetia: acara.emel_urusetia || '',
    no_tel_urusetia: acara.no_tel_urusetia || '',
    status: acara.status,
    senarai_sukan: safeArr(acara.senarai_sukan),
    benarkan_pelbagai_sukan: acara.benarkan_pelbagai_sukan === 1,
    poster: acara.poster || null
  };
  paparanModalBorang.value = true;
};

const onAcaraDisimpan = (msg) => {
  successMsg.value = msg;
  paparanModalBorang.value = false;
  muatNaikAcara();
  setTimeout(() => { successMsg.value = ''; }, 4000);
};

const padamAcaraId = async (id) => {
  if (!confirm('Adakah anda pasti mahu memadam acara ini? Semua data pendaftaran peserta akan terhapus.')) return;
  try {
    const res = await api.delete(`/acara/admin/padam/${id}`);
    if (res.data.success) {
      muatNaikAcara();
      successMsg.value = 'Acara berjaya dipadam.';
      setTimeout(() => { successMsg.value = ''; }, 3000);
    }
  } catch {
    alert('Gagal memadam acara.');
  }
};

const paparkanPeserta = async (acara) => {
  namaAcaraDipilih.value = acara.nama_acara;
  try {
    const res = await api.get(`/acara/admin/peserta/${acara.id}`);
    if (res.data.success) {
      senaraiPeserta.value = res.data.data;
      paparanModalPeserta.value = true;
    }
  } catch {
    alert('Gagal mengambil senarai peserta.');
  }
};

const bukaKontinjen = (acara) => {
  idAcaraKontinjen.value = acara.id;
  paparanPanel.value = true;
};

onMounted(() => {
  muatNaikAcara();
});
</script>

<style scoped>
</style>
