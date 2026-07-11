<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">Sistem Sokongan</p>
        <h1 class="text-2xl font-black text-gray-900">Tiket Sokongan</h1>
        <p class="text-sm font-medium text-gray-500 mt-0.5">Urus pertanyaan dan aduan ahli melalui sistem</p>
      </div>
      <div v-if="bilBaru > 0"
        class="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black animate-pulse"
        style="background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.2); color: #1d4ed8;">
        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
        {{ bilBaru }} Tiket Baru
      </div>
    </div>

    <!-- FILTER TABS + CARI -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-wrap">
        <button v-for="s in statusPilihan" :key="s.nilai" @click="filterStatus = s.nilai"
          class="px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all"
          :class="filterStatus === s.nilai
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'">
          {{ s.label }}
          <span v-if="s.nilai === 'BARU' && bilBaru > 0"
            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[8px]">
            {{ bilBaru }}
          </span>
        </button>
        <div class="flex-1 min-w-[180px] relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="cariTeks" type="text" placeholder="Cari no. tiket, nama, subjek..."
            class="w-full pl-8 pr-4 py-2 text-xs font-medium rounded-xl outline-none border border-gray-200 focus:border-emerald-400 transition-colors" />
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="flex items-center justify-center py-16 gap-3">
          <div class="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin border-emerald-400"></div>
          <span class="text-sm font-medium text-gray-400">Memuatkan tiket...</span>
        </div>

        <div v-else-if="tiketTertapis.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <p class="text-sm font-black text-gray-900 uppercase">Tiada Tiket</p>
          <p class="text-xs text-gray-400">Tiada tiket yang sepadan dengan carian atau penapis ini</p>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">No. Tiket</th>
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Pengirim</th>
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Subjek</th>
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Kategori</th>
              <th class="text-center px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Balasan</th>
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Status</th>
              <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Tarikh</th>
              <th class="text-center px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="t in tiketTertapis" :key="t.id"
              class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <span v-if="t.status === 'BARU'" class="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                  <span class="text-xs font-black font-mono text-gray-700">{{ t.no_tiket }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <p class="text-xs font-bold text-gray-900 leading-tight">{{ t.nama_pengirim }}</p>
                <p class="text-[9px] font-mono text-gray-400 mt-0.5">{{ t.no_kp }}</p>
              </td>
              <td class="px-4 py-3.5 max-w-[220px]">
                <p class="text-xs font-bold text-gray-900 truncate">{{ t.subjek }}</p>
                <p v-if="t.jenis_balasan_terkini === 'AHLI'" class="text-[9px] text-amber-600 font-bold mt-0.5">↩ Ahli membalas</p>
              </td>
              <td class="px-4 py-3.5">
                <span class="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{{ t.kategori }}</span>
              </td>
              <td class="px-4 py-3.5 text-center">
                <span class="text-xs font-black" :class="t.bil_balasan > 0 ? 'text-gray-700' : 'text-gray-300'">
                  {{ t.bil_balasan }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <span class="text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full"
                  :class="t.status === 'BARU' ? 'bg-blue-50 text-blue-700'
                    : t.status === 'DALAM_PROSES' ? 'bg-amber-50 text-amber-700'
                    : t.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'">
                  {{ t.status === 'DALAM_PROSES' ? 'Dalam Proses' : t.status === 'BARU' ? 'Baru' : t.status === 'SELESAI' ? 'Selesai' : 'Ditolak' }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <p class="text-[10px] text-gray-500">{{ formatTarikh(t.tarikh_hantar) }}</p>
              </td>
              <td class="px-4 py-3.5 text-center">
                <button @click="bukaTiket(t.id)"
                  class="text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-xl transition-all active:scale-95"
                  style="background: rgba(15,76,58,0.08); color: #0F4C3A; border: 1px solid rgba(15,76,58,0.15);">
                  Buka
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  <!-- ═══════════════════════════════════════
       MODAL — DETAIL TIKET (Thread + Balas)
       ═══════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="modal-slide">
      <div v-if="modalDetail"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(8,28,21,0.55); backdrop-filter: blur(6px);"
        @click.self="modalDetail = false">

        <div class="bg-white w-full max-w-2xl mx-4 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style="max-height: 88vh; border: 1px solid #E2E8F0;">

          <!-- Header Modal -->
          <div class="shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-[10px] font-black font-mono text-gray-400">{{ tiketAktif?.no_tiket }}</span>
                <span class="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{{ tiketAktif?.kategori }}</span>
                <span class="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
                  :class="tiketAktif?.status === 'BARU' ? 'bg-blue-50 text-blue-700'
                    : tiketAktif?.status === 'DALAM_PROSES' ? 'bg-amber-50 text-amber-700'
                    : tiketAktif?.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'">
                  {{ tiketAktif?.status === 'DALAM_PROSES' ? 'Dalam Proses' : tiketAktif?.status === 'BARU' ? 'Baru' : tiketAktif?.status === 'SELESAI' ? 'Selesai' : 'Ditolak' }}
                </span>
              </div>
              <h3 class="text-base font-black text-gray-900 leading-tight">{{ tiketAktif?.subjek }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Daripada: <strong class="text-gray-600">{{ tiketAktif?.nama_pengirim }}</strong>
                · {{ formatTarikh(tiketAktif?.tarikh_hantar) }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <!-- Tukar Status -->
              <select v-model="statusBaharu" @change="() => sahkanTukarStatus()"
                class="text-xs font-bold rounded-xl px-3 py-2 outline-none border border-gray-200 cursor-pointer"
                :disabled="savingStatus">
                <option value="BARU">Baru</option>
                <option value="DALAM_PROSES">Dalam Proses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
              <button @click="modalDetail = false"
                class="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 bg-gray-100 text-gray-500">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Thread -->
          <div ref="adminThreadEl" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">

            <div v-if="loadingDetail" class="flex items-center justify-center py-10 gap-2">
              <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin border-emerald-400"></div>
              <span class="text-sm text-gray-400">Memuatkan...</span>
            </div>

            <template v-else-if="tiketAktif">

              <!-- Mesej Asal -->
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-black"
                  style="background: #1B4332; color: #95D5B2;">
                  {{ tiketAktif.nama_pengirim?.charAt(0) || '?' }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs font-black text-gray-900">{{ tiketAktif.nama_pengirim }}</span>
                    <span class="text-[9px] text-gray-400">{{ formatTarikhMasa(tiketAktif.tarikh_hantar) }}</span>
                    <span class="text-[8px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">Mesej Asal</span>
                  </div>
                  <div class="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                    style="background: #F0FDF4; border: 1px solid rgba(34,197,94,0.15); color: #0F172A;">
                    {{ tiketAktif.kandungan }}
                  </div>
                </div>
              </div>

              <!-- Balasan -->
              <template v-for="balas in tiketAktif.balasan" :key="balas.id">
                <!-- Balasan Ahli -->
                <div v-if="balas.jenis === 'AHLI'" class="flex gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-black"
                    style="background: #1B4332; color: #95D5B2;">
                    {{ balas.nama_pengirim?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="text-xs font-black text-gray-900">{{ balas.nama_pengirim }}</span>
                      <span class="text-[9px] text-gray-400">{{ formatTarikhMasa(balas.tarikh) }}</span>
                    </div>
                    <div class="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                      style="background: #F0FDF4; border: 1px solid rgba(34,197,94,0.15); color: #0F172A;">
                      {{ balas.kandungan }}
                    </div>
                  </div>
                </div>

                <!-- Balasan Admin (kanan) -->
                <div v-else class="flex gap-3 flex-row-reverse">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-black"
                    style="background: #081C15; color: #52B788;">A</div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1.5 flex-row-reverse">
                      <span class="text-xs font-black text-gray-900">{{ balas.nama_pengirim }}</span>
                      <span class="text-[9px] text-gray-400">{{ formatTarikhMasa(balas.tarikh) }}</span>
                      <span class="text-[8px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Admin</span>
                    </div>
                    <div class="rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed ml-auto"
                      style="background: #EFF6FF; border: 1px solid rgba(59,130,246,0.15); color: #0F172A;">
                      {{ balas.kandungan }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- Status penutup -->
              <div v-if="tiketAktif.status === 'SELESAI' || tiketAktif.status === 'DITOLAK'"
                class="flex justify-center pt-2">
                <div class="rounded-2xl px-5 py-3 text-center"
                  :class="tiketAktif.status === 'SELESAI' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'">
                  <p class="text-xs font-black uppercase tracking-wide"
                    :class="tiketAktif.status === 'SELESAI' ? 'text-emerald-700' : 'text-red-600'">
                    Tiket {{ tiketAktif.status === 'SELESAI' ? 'Diselesaikan' : 'Ditolak' }}
                  </p>
                  <p v-if="tiketAktif.catatan_penutup" class="text-xs text-gray-500 mt-1">{{ tiketAktif.catatan_penutup }}</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Kotak Balas Admin -->
          <div v-if="tiketAktif && tiketAktif.status !== 'SELESAI' && tiketAktif.status !== 'DITOLAK'"
            class="shrink-0 p-4 border-t border-gray-100 bg-white">
            <div class="flex gap-3 items-end">
              <textarea v-model="balasanAdmin" rows="3"
                placeholder="Tulis balasan kepada ahli... (Ctrl+Enter untuk hantar)"
                class="flex-1 text-sm rounded-2xl px-4 py-3 outline-none resize-none leading-relaxed border border-gray-200 focus:border-emerald-400 transition-colors custom-scrollbar"
                style="color: #0F172A; background: #F8FAFC; max-height: 120px;"
                @keydown.enter.ctrl.prevent="hantarBalasanAdmin"
                @keydown.enter.meta.prevent="hantarBalasanAdmin"></textarea>
              <button @click="hantarBalasanAdmin"
                :disabled="!balasanAdmin.trim() || savingBalasan"
                class="shrink-0 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                style="background: #081C15; color: #95D5B2;">
                <span v-if="savingBalasan" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ savingBalasan ? 'Menghantar...' : 'Balas' }}
              </button>
            </div>

            <!-- Nota cepat status -->
            <div class="flex gap-2 mt-3 flex-wrap">
              <button @click="sahkanTukarStatus('SELESAI')"
                class="text-[9px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
                style="background: rgba(34,197,94,0.1); color: #16a34a; border: 1px solid rgba(34,197,94,0.2);">
                Tandakan Selesai
              </button>
              <button @click="sahkanTukarStatus('DITOLAK')"
                class="text-[9px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
                style="background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.2);">
                Tolak Tiket
              </button>
            </div>
          </div>

          <!-- Nota emel (info) -->
          <div class="shrink-0 px-6 py-3 flex items-center gap-2 border-t border-gray-100" style="background: #FFFBEB;">
            <svg class="w-3 h-3 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <p class="text-[9px] font-medium text-amber-700">
              Notifikasi emel dihantar secara automatik. Semua balasan <strong>mesti melalui sistem ini</strong>.
            </p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Modal catatan penutup sebelum tukar status SELESAI/DITOLAK -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modalCatatan"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.4);"
        @click.self="modalCatatan = false">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-base font-black text-gray-900 mb-1">
            {{ pendingStatus === 'SELESAI' ? 'Selesaikan Tiket' : 'Tolak Tiket' }}
          </h3>
          <p class="text-xs text-gray-400 mb-4">
            Catatan ini akan dihantar ke ahli sebagai maklum balas penutup.
          </p>
          <textarea v-model="catatanPenutup" rows="3"
            :placeholder="pendingStatus === 'SELESAI' ? 'Isu telah diselesaikan. Terima kasih...' : 'Nyatakan sebab penolakan...'"
            class="w-full text-sm rounded-xl px-4 py-3 outline-none resize-none border border-gray-200 focus:border-emerald-400 leading-relaxed mb-4">
          </textarea>
          <div class="flex gap-3">
            <button @click="modalCatatan = false; statusBaharu = tiketAktif?.status"
              class="flex-1 py-3 rounded-xl text-xs font-black uppercase bg-gray-100 text-gray-500">
              Batal
            </button>
            <button @click="laksanakanTukarStatus" :disabled="savingStatus"
              class="flex-2 grow py-3 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 text-white"
              :class="pendingStatus === 'SELESAI' ? 'bg-emerald-600' : 'bg-red-600'">
              <span v-if="savingStatus" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              {{ savingStatus ? 'Menyimpan...' : 'Sahkan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import api from '../../services/api';

const loading      = ref(false);
const senaraiTiket = ref([]);
const bilBaru      = ref(0);
const filterStatus = ref('');
const cariTeks     = ref('');

const modalDetail  = ref(false);
const tiketAktif   = ref(null);
const loadingDetail = ref(false);
const balasanAdmin  = ref('');
const savingBalasan = ref(false);
const adminThreadEl = ref(null);

const statusBaharu   = ref('');
const savingStatus   = ref(false);
const modalCatatan   = ref(false);
const pendingStatus  = ref('');
const catatanPenutup = ref('');

const statusPilihan = [
  { nilai: '',             label: 'Semua' },
  { nilai: 'BARU',         label: 'Baru' },
  { nilai: 'DALAM_PROSES', label: 'Dalam Proses' },
  { nilai: 'SELESAI',      label: 'Selesai' },
  { nilai: 'DITOLAK',      label: 'Ditolak' },
];

const tiketTertapis = computed(() => {
  const q = cariTeks.value.toLowerCase();
  return senaraiTiket.value.filter(t => {
    const statusOk = !filterStatus.value || t.status === filterStatus.value;
    const cariOk   = !q || t.no_tiket.toLowerCase().includes(q)
                      || t.subjek.toLowerCase().includes(q)
                      || (t.nama_pengirim || '').toLowerCase().includes(q);
    return statusOk && cariOk;
  });
});

const muatTiket = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/sokongan/admin/senarai');
    senaraiTiket.value = data.data || [];
    bilBaru.value = data.bil_baru || 0;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const bukaTiket = async (id) => {
  modalDetail.value = true;
  loadingDetail.value = true;
  tiketAktif.value = null;
  balasanAdmin.value = '';
  try {
    const { data } = await api.get(`/sokongan/admin/${id}`);
    tiketAktif.value = data.data;
    statusBaharu.value = data.data.status;
    await nextTick();
    if (adminThreadEl.value) adminThreadEl.value.scrollTop = adminThreadEl.value.scrollHeight;
  } catch {
    alert('Gagal memuatkan tiket.');
    modalDetail.value = false;
  } finally {
    loadingDetail.value = false;
  }
};

const hantarBalasanAdmin = async () => {
  if (!balasanAdmin.value.trim() || !tiketAktif.value) return;
  savingBalasan.value = true;
  try {
    await api.post(`/sokongan/admin/${tiketAktif.value.id}/balas`, { kandungan: balasanAdmin.value });
    balasanAdmin.value = '';
    await bukaTiket(tiketAktif.value.id);
    await muatTiket();
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghantar balasan.');
  } finally {
    savingBalasan.value = false;
  }
};

const sahkanTukarStatus = (statusTerus = null) => {
  const s = statusTerus || statusBaharu.value;
  if (s === tiketAktif.value?.status) return;
  pendingStatus.value = s;
  catatanPenutup.value = '';
  if (s === 'SELESAI' || s === 'DITOLAK') {
    modalCatatan.value = true;
  } else {
    laksanakanTukarStatus();
  }
};

const laksanakanTukarStatus = async () => {
  if (!tiketAktif.value) return;
  savingStatus.value = true;
  try {
    await api.put(`/sokongan/admin/${tiketAktif.value.id}/status`, {
      status: pendingStatus.value,
      catatan_penutup: catatanPenutup.value || null
    });
    modalCatatan.value = false;
    await bukaTiket(tiketAktif.value.id);
    await muatTiket();
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal kemaskini status.');
    statusBaharu.value = tiketAktif.value?.status;
  } finally {
    savingStatus.value = false;
  }
};

const formatTarikh = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTarikhMasa = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

onMounted(() => muatTiket());
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.modal-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-slide-leave-active { transition: all 0.2s ease; }
.modal-slide-enter-from { opacity: 0; }
.modal-slide-leave-to { opacity: 0; }
.modal-slide-enter-from > div { transform: scale(0.96) translateY(12px); }
.modal-slide-leave-to > div { transform: scale(0.96); }

.fade-enter-active { transition: opacity 0.2s ease; }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 99px; }
select { -webkit-appearance: none; }
</style>
