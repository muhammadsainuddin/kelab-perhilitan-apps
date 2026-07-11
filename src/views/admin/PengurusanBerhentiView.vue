<template>
  <div class="space-y-4 font-sans text-gray-900 pb-10 text-xs">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h2 class="font-bold text-base text-gray-900">Permohonan Berhenti Ahli</h2>
        <p class="text-gray-500 text-[11px] mt-0.5">
          Semak permohonan penarikan keahlian dan rekod keputusan jawatankuasa.
        </p>
      </div>
      <button @click="muatData"
        class="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors shrink-0">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Muat Semula
      </button>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white border border-amber-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Menunggu</p>
        <p class="text-2xl font-black text-amber-700 mt-1 tabular-nums">{{ bilMenunggu }}</p>
        <p class="text-[9px] text-amber-500 mt-0.5">perlu tindakan</p>
      </div>
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Diluluskan</p>
        <p class="text-2xl font-black text-emerald-700 mt-1 tabular-nums">{{ bilLulus }}</p>
        <p class="text-[9px] text-emerald-500 mt-0.5">ahli dilucutkan</p>
      </div>
      <div class="bg-white border border-rose-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-rose-600 uppercase tracking-wider">Ditolak</p>
        <p class="text-2xl font-black text-rose-700 mt-1 tabular-nums">{{ bilDitolak }}</p>
        <p class="text-[9px] text-rose-400 mt-0.5">tidak dilulus</p>
      </div>
    </div>

    <!-- FILTER TABS -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="tab in tabs" :key="tab.value"
        @click="filterAktif = tab.value"
        :class="['px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors border',
          filterAktif === tab.value ? tab.activeClass : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']">
        {{ tab.label }}
        <span class="ml-1 opacity-75">({{ tab.count }})</span>
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 font-bold">Pemohon</th>
              <th class="px-4 py-3 font-bold hidden lg:table-cell">Sebab Berhenti</th>
              <th class="px-4 py-3 font-bold">Status</th>
              <th class="px-4 py-3 font-bold hidden md:table-cell">Tarikh Mohon</th>
              <th class="px-4 py-3 font-bold text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-14 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-[#0F4C3A] border-t-transparent animate-spin"></div>
                  <span>Memuatkan data...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="senaraiTapis.length === 0">
              <td colspan="5" class="px-4 py-16 text-center">
                <p class="text-gray-400 font-medium">Tiada permohonan dalam kategori ini.</p>
              </td>
            </tr>
            <tr v-for="p in senaraiTapis" :key="p.id"
              class="hover:bg-gray-50/70 cursor-pointer transition-colors"
              @click="bukaModal(p)">
              <td class="px-4 py-3.5">
                <p class="font-bold text-gray-900 text-[12px]">{{ p.nama_pegawai }}</p>
                <p class="text-[10px] text-gray-500 font-mono mt-0.5">{{ p.no_kp }}</p>
                <p class="text-[10px] text-gray-400">{{ p.penempatan || '—' }}</p>
              </td>
              <td class="px-4 py-3.5 hidden lg:table-cell text-gray-500 max-w-[280px]">
                <p class="truncate text-[11px]" :title="p.sebab_berhenti">{{ p.sebab_berhenti || '—' }}</p>
              </td>
              <td class="px-4 py-3.5">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide whitespace-nowrap', badgeStatus(p.status_permohonan)]">
                  {{ labelStatus(p.status_permohonan) }}
                </span>
                <p v-if="p.status_permohonan === 'DITOLAK' && p.catatan_admin"
                  class="text-rose-600 text-[10px] mt-0.5 truncate max-w-[150px]" :title="p.catatan_admin">
                  {{ p.catatan_admin }}
                </p>
              </td>
              <td class="px-4 py-3.5 text-gray-500 hidden md:table-cell text-[11px] whitespace-nowrap">
                {{ formatTarikh(p.tarikh_mohon) }}
              </td>
              <td class="px-4 py-3.5 text-center" @click.stop>
                <button @click="bukaModal(p)"
                  class="text-[11px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors whitespace-nowrap">
                  Semak
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- ==================== MODAL SEMAKAN ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal"
          class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModal = false">
          <div v-if="dipilih" class="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Semakan Permohonan Berhenti</p>
                  <p class="text-[10px] text-gray-400 font-mono">ID #{{ dipilih.id }} · {{ formatTarikh(dipilih.tarikh_mohon) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2.5 shrink-0">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide', badgeStatus(dipilih.status_permohonan)]">
                  {{ labelStatus(dipilih.status_permohonan) }}
                </span>
                <button @click="showModal = false"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-6 space-y-5">

                <!-- Maklumat Ahli -->
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-3">Maklumat Pemohon</p>
                  <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Nama Penuh</p>
                      <p class="font-bold text-gray-900 text-[12px] mt-0.5">{{ dipilih.nama_pegawai }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">No. K/P</p>
                      <p class="font-mono font-bold text-gray-700 text-[11px] mt-0.5">{{ dipilih.no_kp }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Penempatan</p>
                      <p class="font-semibold text-gray-700 text-[11px] mt-0.5">{{ dipilih.penempatan || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">No. Ahli / Gred</p>
                      <p class="font-mono text-gray-700 text-[11px] mt-0.5">
                        {{ dipilih.no_ahli || '—' }}
                        <span v-if="dipilih.gred" class="text-gray-400"> · {{ dipilih.gred }}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Sebab Berhenti -->
                <div class="space-y-2">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sebab Permohonan Berhenti</p>
                  <div class="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
                    <p class="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {{ dipilih.sebab_berhenti || 'Tiada sebab dinyatakan oleh pemohon.' }}
                    </p>
                  </div>
                </div>

                <!-- Rekod Tindakan -->
                <div class="space-y-2">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rekod Proses</p>
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="divide-y divide-gray-100">

                      <!-- Step 1: Diterima -->
                      <div class="flex items-start gap-3 px-4 py-3">
                        <div class="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                          <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-[11px] font-bold text-gray-700">Permohonan diterima daripada ahli</p>
                          <p class="text-[10px] text-gray-400 mt-0.5">{{ formatTarikh(dipilih.tarikh_mohon) }}</p>
                        </div>
                        <span class="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md shrink-0">Selesai</span>
                      </div>

                      <!-- Step 2: Keputusan -->
                      <div class="flex items-start gap-3 px-4 py-3"
                        :class="isMenunggu(dipilih.status_permohonan) ? 'opacity-40' : ''">
                        <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                          dipilih.status_permohonan === 'LULUS'   ? 'bg-emerald-100 border-emerald-300'
                          : dipilih.status_permohonan === 'DITOLAK' ? 'bg-rose-100 border-rose-300'
                          : 'bg-gray-50 border-gray-200']">
                          <div :class="['w-2 h-2 rounded-full',
                            dipilih.status_permohonan === 'LULUS'   ? 'bg-emerald-500'
                            : dipilih.status_permohonan === 'DITOLAK' ? 'bg-rose-500'
                            : 'bg-gray-300']"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-[11px] font-bold text-gray-700">Keputusan Jawatankuasa</p>
                          <template v-if="dipilih.status_permohonan === 'LULUS'">
                            <p class="text-[11px] font-black text-emerald-700 mt-1">Diluluskan — keahlian ditamatkan</p>
                            <p class="text-[10px] text-emerald-600 mt-0.5">Status akaun ahli telah ditetapkan kepada tidak aktif.</p>
                          </template>
                          <template v-else-if="dipilih.status_permohonan === 'DITOLAK'">
                            <p class="text-[10px] font-bold text-rose-600 uppercase tracking-wide mt-1">Sebab Penolakan:</p>
                            <p class="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 rounded-md px-2.5 py-1.5 mt-1 leading-relaxed">
                              {{ dipilih.catatan_admin || '—' }}
                            </p>
                          </template>
                          <p v-else class="text-[10px] text-gray-400 mt-0.5">Menunggu keputusan jawatankuasa</p>
                        </div>
                        <span v-if="dipilih.status_permohonan === 'LULUS'" class="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md shrink-0">Lulus</span>
                        <span v-else-if="dipilih.status_permohonan === 'DITOLAK'" class="text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md shrink-0">Tolak</span>
                        <span v-else class="text-[9px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md shrink-0">Belum</span>
                      </div>

                    </div>
                  </div>
                </div>

                <!-- Nota Admin (jika masih menunggu) -->
                <div v-if="isMenunggu(dipilih.status_permohonan)" class="space-y-1.5">
                  <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Catatan / Sebab Penolakan
                    <span class="text-gray-300 font-normal">(diperlukan jika menolak)</span>
                  </label>
                  <textarea v-model="catatanAdmin" rows="2"
                    placeholder="Nyatakan sebab jika permohonan ditolak..."
                    class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] resize-none transition-all">
                  </textarea>
                </div>

                <!-- Amaran Lulus -->
                <div v-if="isMenunggu(dipilih.status_permohonan)"
                  class="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p class="text-[10px] text-amber-800 leading-relaxed">
                    <strong>Jika diluluskan</strong>, akaun ahli akan ditetapkan kepada <strong>tidak aktif</strong> secara automatik dan ahli tidak akan dapat log masuk ke aplikasi.
                  </p>
                </div>

              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
              <div v-if="isMenunggu(dipilih.status_permohonan)" class="flex items-center justify-between gap-3 flex-wrap">
                <button @click="showModal = false"
                  class="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                  Tutup
                </button>
                <div class="flex items-center gap-2">
                  <button @click="bukaModalTolak"
                    class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold hover:bg-rose-100 transition-colors">
                    Tolak Permohonan
                  </button>
                  <button @click="bukaModalLulus"
                    class="px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-[11px] font-bold hover:bg-[#155d47] transition-colors shadow-sm">
                    Lulus Permohonan
                  </button>
                </div>
              </div>
              <div v-else class="flex justify-end">
                <button @click="showModal = false"
                  class="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ==================== MODAL LULUS ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalLulus"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalLulus = false">
          <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">Lulus Permohonan Berhenti</h3>
                <p class="text-[10px] text-gray-500">Tindakan ini tidak boleh dibatalkan</p>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-3 mb-4">
              <p class="text-[9px] text-gray-400 font-bold uppercase">Pemohon</p>
              <p class="font-bold text-gray-900 text-[12px]">{{ dipilih?.nama_pegawai }}</p>
              <p class="text-[10px] font-mono text-gray-500 mt-0.5">{{ dipilih?.no_kp }}</p>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 mb-5">
              <p class="text-[11px] text-amber-800 leading-relaxed">
                Akaun ahli ini akan ditetapkan kepada <strong>tidak aktif</strong>. Ahli tidak akan dapat log masuk selepas ini.
              </p>
            </div>
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <button @click="showModalLulus = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="sahkanLulus" :disabled="memproses"
                class="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm">
                {{ memproses ? 'Memproses...' : 'Ya, Lulus & Tamatkan Keahlian' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ==================== MODAL TOLAK ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalTolak"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalTolak = false">
          <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">Tolak Permohonan Berhenti</h3>
                <p class="text-[10px] text-gray-500">Sebab penolakan wajib dinyatakan</p>
              </div>
            </div>
            <div class="bg-rose-50 border border-rose-100 rounded-lg p-3 mb-4">
              <p class="text-[11px] font-bold text-rose-800">{{ dipilih?.nama_pegawai }}</p>
              <p class="text-[10px] font-mono text-rose-600 mt-0.5">{{ dipilih?.no_kp }}</p>
            </div>
            <div class="space-y-1.5 mb-5">
              <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Sebab Penolakan *
              </label>
              <textarea v-model="sebabTolak" rows="3" required
                placeholder="Nyatakan sebab mengapa permohonan ini tidak dapat diluluskan..."
                :class="['w-full text-[12px] bg-gray-50 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 resize-none transition-all',
                  tunjukRalat && !sebabTolak.trim()
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-gray-300 focus:ring-rose-500/20 focus:border-rose-500']">
              </textarea>
              <p v-if="tunjukRalat && !sebabTolak.trim()" class="text-[10px] text-rose-600 font-bold">
                Sebab penolakan wajib diisi.
              </p>
            </div>
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <button @click="showModalTolak = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="sahkanTolak" :disabled="memproses"
                class="flex-[2] py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm">
                {{ memproses ? 'Memproses...' : 'Sahkan Penolakan' }}
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

const senarai     = ref([]);
const loading     = ref(true);
const filterAktif = ref('SEMUA');

const showModal  = ref(false);
const dipilih    = ref(null);
const catatanAdmin = ref('');

const showModalLulus = ref(false);
const showModalTolak = ref(false);
const sebabTolak     = ref('');
const tunjukRalat    = ref(false);
const memproses      = ref(false);

// ── Helpers ──────────────────────────────────────────────────────────
const isMenunggu = (status) => !status || status === 'MENUNGGU';

const labelStatus = (s) => {
  if (!s || s === 'MENUNGGU') return 'Menunggu';
  if (s === 'LULUS')   return 'Diluluskan';
  if (s === 'DITOLAK') return 'Ditolak';
  return s;
};

const badgeStatus = (s) => {
  if (!s || s === 'MENUNGGU') return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (s === 'LULUS')   return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (s === 'DITOLAK') return 'bg-rose-100 text-rose-800 border border-rose-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const formatTarikh = (t) => {
  if (!t) return '—';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── Computed ─────────────────────────────────────────────────────────
const bilMenunggu = computed(() => senarai.value.filter(p => isMenunggu(p.status_permohonan)).length);
const bilLulus    = computed(() => senarai.value.filter(p => p.status_permohonan === 'LULUS').length);
const bilDitolak  = computed(() => senarai.value.filter(p => p.status_permohonan === 'DITOLAK').length);

const tabs = computed(() => [
  { value: 'SEMUA',    label: 'Semua',      count: senarai.value.length, activeClass: 'bg-gray-800 text-white border-gray-800' },
  { value: 'MENUNGGU', label: 'Menunggu',   count: bilMenunggu.value,    activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'LULUS',    label: 'Diluluskan', count: bilLulus.value,       activeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { value: 'DITOLAK',  label: 'Ditolak',    count: bilDitolak.value,     activeClass: 'bg-rose-600 text-white border-rose-600' },
]);

const senaraiTapis = computed(() => {
  if (filterAktif.value === 'SEMUA')    return senarai.value;
  if (filterAktif.value === 'MENUNGGU') return senarai.value.filter(p => isMenunggu(p.status_permohonan));
  return senarai.value.filter(p => p.status_permohonan === filterAktif.value);
});

// ── API ───────────────────────────────────────────────────────────────
const muatData = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/berhenti');
    if (data.success) senarai.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Modal ─────────────────────────────────────────────────────────────
const bukaModal = (p) => {
  dipilih.value    = p;
  catatanAdmin.value = p.catatan_admin || '';
  showModal.value  = true;
};

const bukaModalLulus = () => {
  showModalLulus.value = true;
};

const bukaModalTolak = () => {
  sebabTolak.value  = catatanAdmin.value;
  tunjukRalat.value = false;
  showModalTolak.value = true;
};

const sahkanLulus = async () => {
  memproses.value = true;
  try {
    await api.put(`/admin/berhenti/${dipilih.value.id}`, {
      no_kp: dipilih.value.no_kp,
      status_permohonan: 'LULUS',
      catatan_admin: catatanAdmin.value || null,
    });
    showModalLulus.value = false;
    showModal.value      = false;
    await muatData();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat meluluskan permohonan.');
  } finally { memproses.value = false; }
};

const sahkanTolak = async () => {
  tunjukRalat.value = true;
  if (!sebabTolak.value.trim()) return;
  memproses.value = true;
  try {
    await api.put(`/admin/berhenti/${dipilih.value.id}`, {
      no_kp: dipilih.value.no_kp,
      status_permohonan: 'DITOLAK',
      catatan_admin: sebabTolak.value.trim(),
    });
    showModalTolak.value = false;
    showModal.value      = false;
    await muatData();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat menolak permohonan.');
  } finally { memproses.value = false; }
};

onMounted(muatData);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }
</style>
