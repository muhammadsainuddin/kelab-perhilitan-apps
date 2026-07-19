
<template>
  <Teleport to="body">
    <Transition name="fs-fade">
      <div class="fixed inset-0 z-[200] flex flex-col bg-gray-50"
        style="font-family: Tahoma, 'Segoe UI', Arial, sans-serif">

        <!-- ── Header Bar ── -->
        <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-md bg-[#0F4C3A] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0F4C3A]">Lejar Kewangan</p>
              <h2 class="text-sm font-bold text-gray-900 leading-none mt-0.5">Rekod Transaksi Baharu</h2>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="emit('tutup')"
              class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200">
              Batal
            </button>
            <button @click="simpan" :disabled="saving"
              :class="['px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1.5',
                jenisAktif === 'masuk' ? 'bg-emerald-600 hover:bg-emerald-700' :
                jenisAktif === 'keluar' ? 'bg-rose-600 hover:bg-rose-700' :
                'bg-amber-500 hover:bg-amber-600']">
              <span v-if="saving" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ saving ? 'Menyimpan...' : 'Simpan Rekod' }}
            </button>
          </div>
        </div>

        <!-- ── Jenis Selector Bar ── -->
        <div class="bg-white border-b border-gray-100 px-5 py-3 shrink-0">
          <div class="max-w-3xl mx-auto grid grid-cols-3 gap-2">
            <button v-for="j in jenisTab" :key="j.id" @click="pilihJenis(j.id)"
              :class="['rounded-xl py-2.5 px-3 text-[11px] font-bold transition-all flex items-center justify-center gap-2 border',
                jenisAktif === j.id ? j.aktifKad : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600']">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="j.ikon"/>
              </svg>
              {{ j.label }}
            </button>
          </div>
        </div>

        <!-- ── Body ── -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-3xl mx-auto px-5 py-5 space-y-4">

            <!-- Amaun (prominent) -->
            <div :class="['rounded-2xl border p-5',
              jenisAktif === 'masuk'  ? 'bg-emerald-50 border-emerald-200' :
              jenisAktif === 'keluar' ? 'bg-rose-50 border-rose-200' :
              'bg-amber-50 border-amber-200']">
              <p :class="['text-[9px] font-bold uppercase tracking-widest mb-2',
                jenisAktif === 'masuk' ? 'text-emerald-600' : jenisAktif === 'keluar' ? 'text-rose-600' : 'text-amber-600']">
                {{ jenisAktif === 'masuk' ? 'DEBIT — Wang Masuk' : jenisAktif === 'keluar' ? 'KREDIT — Wang Keluar' : 'Kutipan Sumbangan Luar' }}
              </p>
              <div class="flex items-end gap-4">
                <div class="flex-1">
                  <div class="relative">
                    <span :class="['absolute left-4 top-1/2 -translate-y-1/2 text-base font-black select-none',
                      jenisAktif === 'masuk' ? 'text-emerald-400' : jenisAktif === 'keluar' ? 'text-rose-400' : 'text-amber-400']">RM</span>
                    <input v-model="form.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
                      :class="['w-full bg-white border-2 rounded-xl pl-12 pr-4 py-3 text-2xl font-black tabular-nums focus:outline-none focus:ring-0 transition-colors',
                        jenisAktif === 'masuk'  ? 'border-emerald-300 text-emerald-700 focus:border-emerald-500' :
                        jenisAktif === 'keluar' ? 'border-rose-300 text-rose-700 focus:border-rose-500' :
                        'border-amber-300 text-amber-700 focus:border-amber-500']" />
                  </div>
                </div>
                <div class="w-40 shrink-0">
                  <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Tarikh</p>
                  <input v-model="form.tarikh" type="date"
                    class="w-full bg-white border-2 border-gray-200 rounded-xl px-3 py-3 text-[12px] font-semibold text-gray-700 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-5 space-y-4">

                <!-- MASUK -->
                <template v-if="jenisAktif === 'masuk'">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="field-label">Kategori Pendapatan *</label>
                      <select v-model="form.kategori" class="field-input">
                        <option value="" disabled>-- Pilih kategori --</option>
                        <option v-for="k in kategoriMasuk" :key="k.kod" :value="k.kod">{{ k.nama }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="field-label">Diterima Daripada</label>
                      <div class="flex gap-4 pt-1.5 pb-1">
                        <label class="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 cursor-pointer">
                          <input type="radio" :value="false" v-model="form.masuk_dari_ahli" class="accent-[#0F4C3A]" />
                          Nama Bebas
                        </label>
                        <label class="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 cursor-pointer">
                          <input type="radio" :value="true" v-model="form.masuk_dari_ahli" class="accent-[#0F4C3A]" />
                          Ahli Kelab
                        </label>
                      </div>
                      <select v-if="form.masuk_dari_ahli" v-model="form.no_kp_pihak"
                        class="field-input border-emerald-300 focus:border-emerald-500">
                        <option value="" disabled>-- Pilih ahli --</option>
                        <option v-for="a in senaraiAhli" :key="a.no_kp" :value="a.no_kp">
                          {{ a.nama_pegawai }} ({{ a.no_kp }})
                        </option>
                      </select>
                      <input v-else v-model="form.penerima_bayaran" type="text"
                        placeholder="Nama pembayar (kosongkan jika kolektif)"
                        class="field-input" />
                    </div>
                  </div>

                  <!-- Sempena -->
                  <div>
                    <label class="field-label">Sempena</label>
                    <select v-model="form.acara_khas_id" class="field-input">
                      <option :value="null">Pendapatan Biasa</option>
                      <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                    </select>
                    <p v-if="form.acara_khas_id" class="text-[10px] text-violet-600 mt-1 font-medium">
                      Pendapatan ini akan dikira di bawah acara khas yang dipilih.
                    </p>
                    <p v-else class="text-[10px] text-gray-400 mt-1">
                      Tiada acara khas — pendapatan biasa kelab.
                    </p>
                  </div>

                  <div class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <svg class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-[10px] text-amber-700">Sumbangan syarikat luar melalui MAKSWIP? Gunakan tab <strong>Sumbangan MAKSWIP</strong>.</p>
                  </div>
                </template>

                <!-- KELUAR -->
                <template v-else-if="jenisAktif === 'keluar'">
                  <div>
                    <label class="field-label">Kategori Perbelanjaan *</label>
                    <select v-model="form.kategori" class="field-input">
                      <option value="" disabled>-- Pilih kategori --</option>
                      <option v-for="k in kategoriKeluar" :key="k.kod" :value="k.kod">{{ k.nama }}</option>
                    </select>
                  </div>

                  <div v-if="form.kategori === 'KEBAJIKAN'" class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                    <label class="field-label text-blue-700">Ahli Penerima Bantuan *</label>
                    <select v-model="form.no_kp_pihak" class="field-input bg-white border-blue-300 focus:border-blue-500">
                      <option value="" disabled>-- Taip nama atau pilih ahli --</option>
                      <option v-for="a in senaraiAhli" :key="a.no_kp" :value="a.no_kp">
                        {{ a.nama_pegawai }} ({{ a.no_kp }})
                      </option>
                    </select>
                    <p class="text-[10px] text-blue-600">Bantuan kebajikan akan direkodkan atas nama ahli yang dipilih.</p>
                  </div>
                  <div v-else>
                    <label class="field-label">Dibayar Kepada *</label>
                    <input v-model="form.penerima_bayaran" type="text"
                      placeholder="Nama vendor / syarikat / individu penerima"
                      class="field-input" />
                  </div>

                  <!-- Sempena -->
                  <div>
                    <label class="field-label">Sempena</label>
                    <select v-model="form.acara_khas_id" class="field-input">
                      <option :value="null">Perbelanjaan Biasa</option>
                      <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                    </select>
                    <p v-if="form.acara_khas_id" class="text-[10px] text-violet-600 mt-1 font-medium">
                      Perbelanjaan ini akan dikira di bawah acara khas yang dipilih.
                    </p>
                    <p v-else class="text-[10px] text-gray-400 mt-1">
                      Tiada acara khas — perbelanjaan biasa kelab.
                    </p>
                  </div>
                </template>

                <!-- SUMBANGAN MAKSWIP -->
                <template v-else>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="field-label">Acara Khas *</label>
                      <select v-if="senaraiAcaraKhas.length" v-model="form.acara_khas_id_sumbangan" class="field-input">
                        <option value="">— Pilih Acara —</option>
                        <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                      </select>
                      <div v-else class="field-input bg-amber-50 border-amber-200 text-amber-700 text-[10px]">
                        Tiada acara khas. Tambah dalam <strong>Tetapan → Acara Khas</strong>.
                      </div>
                    </div>
                    <div v-if="form.acara_khas_id_sumbangan">
                      <label class="field-label">Pakej Sumbangan</label>
                      <div v-if="loadingPakejBorang" class="field-input text-[10px] text-gray-400">Memuatkan...</div>
                      <select v-else-if="senaraiPakejBorang.length" v-model="form.pakej_id" class="field-input">
                        <option value="">— Tiada Pakej Khusus —</option>
                        <option v-for="p in senaraiPakejBorang" :key="p.id" :value="p.id">
                          {{ p.nama }}{{ p.amaun_pakej ? ` — RM ${parseFloat(p.amaun_pakej).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}` : '' }}
                        </option>
                      </select>
                      <div v-else class="field-input bg-gray-50 text-gray-400 text-[10px]">Tiada pakej untuk acara ini.</div>
                    </div>
                  </div>

                  <div>
                    <label class="field-label">Nama Syarikat / Penyumbang *</label>
                    <input v-model="form.nama_syarikat" type="text"
                      placeholder="Nama penuh syarikat atau individu penyumbang"
                      class="field-input" />
                  </div>

                  <!-- PIC -->
                  <div class="relative">
                    <label class="field-label">Person In Charge (PIC)</label>
                    <div class="relative">
                      <input v-model="cariStaff" type="text"
                        placeholder="Taip nama atau no. KP staff..."
                        class="field-input pr-8"
                        @focus="showStaffDropdown = true"
                        @blur="setTimeout(() => { showStaffDropdown = false }, 180)"
                        autocomplete="off" />
                      <button v-if="form.pic_no_kp" @click="clearStaff" type="button"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <div v-if="showStaffDropdown && (staffDicari.length || loadingStaff)"
                      class="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                      <div v-if="loadingStaff" class="px-3 py-2 text-[10px] text-gray-400">Memuatkan...</div>
                      <div v-else-if="!staffDicari.length" class="px-3 py-2 text-[10px] text-gray-400">Tiada staf dijumpai.</div>
                      <button v-else v-for="s in staffDicari" :key="s.no_kp" type="button"
                        @mousedown.prevent="pilihStaff(s)"
                        :class="['w-full text-left px-3 py-2 hover:bg-violet-50 transition-colors', form.pic_no_kp === s.no_kp ? 'bg-violet-50' : '']">
                        <p class="text-[11px] font-semibold text-gray-800">{{ s.nama }}</p>
                        <p class="text-[9px] text-gray-400 font-mono">{{ s.no_kp }}</p>
                      </button>
                    </div>
                    <p v-if="form.pic_no_kp" class="mt-1 text-[9px] text-violet-600 font-medium">
                      ✓ {{ form.pic_nama }} dipilih sebagai PIC
                    </p>
                  </div>

                  <div class="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[10px] text-amber-700">
                    Rekod ini disimpan dalam <strong>Kutipan Sumbangan Luar</strong> — bukan terus ke ledger. Tuntutan ke MAKSWIP dibuat kemudian.
                  </div>
                </template>

                <!-- Rujukan + Nota + Direkod oleh -->
                <div class="grid grid-cols-3 gap-3 pt-1 border-t border-gray-100">
                  <div>
                    <label class="field-label">No. Rujukan / Baucer</label>
                    <input v-model="form.rujukan" type="text"
                      placeholder="INV-001 / BV-001 / AUTO"
                      class="field-input font-mono tracking-wide" />
                  </div>
                  <div>
                    <label class="field-label">Nota / Keterangan</label>
                    <input v-model="form.nota" type="text"
                      placeholder="Catatan tambahan (pilihan)"
                      class="field-input" />
                  </div>
                  <div>
                    <label class="field-label">Direkod Oleh</label>
                    <div class="field-input bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed select-none truncate">
                      {{ authStore.user?.name || '—' }}
                    </div>
                  </div>
                </div>

                <!-- Upload Dokumen Sokongan -->
                <div class="pt-1 border-t border-gray-100">
                  <label class="field-label">Dokumen Sokongan <span class="normal-case font-normal text-gray-400">(gambar / PDF, maks 5 fail)</span></label>

                  <!-- Drop zone -->
                  <div
                    @click="$refs.inputFail.click()"
                    @dragover.prevent
                    @drop.prevent="tambahFail($event.dataTransfer.files)"
                    :class="['mt-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors',
                      dokumenFail.length ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100']">
                    <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    <p class="text-[11px] text-gray-500">
                      <span class="font-semibold text-gray-700">Klik untuk pilih</span> atau seret fail ke sini
                    </p>
                    <input ref="inputFail" type="file" multiple accept=".jpg,.jpeg,.jfif,.png,.webp,.pdf"
                      class="hidden" @change="tambahFail($event.target.files)" />
                  </div>

                  <!-- Senarai fail dipilih -->
                  <div v-if="dokumenFail.length" class="mt-2 space-y-1.5">
                    <div v-for="(f, i) in dokumenFail" :key="i"
                      class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <!-- Thumbnail gambar / ikon PDF -->
                      <div class="w-8 h-8 shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img v-if="f.preview" :src="f.preview" class="w-full h-full object-cover" />
                        <svg v-else class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5H7zm5 1l4 4h-4V4zM9 13h6v1H9v-1zm0 3h4v1H9v-1z"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-semibold text-gray-700 truncate">{{ f.fail.name }}</p>
                        <p class="text-[9px] text-gray-400">{{ (f.fail.size / 1024).toFixed(0) }} KB</p>
                      </div>
                      <button type="button" @click="buangFail(i)"
                        class="shrink-0 text-gray-400 hover:text-rose-500 transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p v-if="ralatFail" class="mt-1 text-[10px] text-rose-600 font-medium">{{ ralatFail }}</p>
                </div>

              </div>

              <!-- Live preview strip -->
              <div v-if="parseFloat(form.amaun) > 0"
                :class="['px-5 py-3 border-t flex items-center justify-between gap-4',
                  jenisAktif === 'masuk' ? 'bg-emerald-50 border-emerald-100' :
                  jenisAktif === 'keluar' ? 'bg-rose-50 border-rose-100' :
                  'bg-amber-50 border-amber-100']">
                <div class="flex items-center gap-3 flex-wrap">
                  <span :class="['text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border',
                    jenisAktif === 'masuk' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    jenisAktif === 'keluar' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                    'bg-amber-100 text-amber-700 border-amber-200']">
                    {{ jenisAktif === 'masuk' ? 'DEBIT (+)' : jenisAktif === 'keluar' ? 'KREDIT (−)' : 'KUTIPAN' }}
                  </span>
                  <span class="text-[11px] text-gray-500">{{ form.tarikh || '—' }}</span>
                  <span v-if="form.kategori" class="text-[11px] text-gray-600 font-medium">{{ labelKategori(form.kategori) }}</span>
                </div>
                <span :class="['text-base font-black tabular-nums',
                  jenisAktif === 'masuk' ? 'text-emerald-700' :
                  jenisAktif === 'keluar' ? 'text-rose-700' : 'text-amber-700']">
                  {{ jenisAktif === 'keluar' ? '−' : '+' }} RM {{ parseFloat(form.amaun || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { useToast } from '../../composables/useToast';

const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
  senaraiAhli:    { type: Array, default: () => [] },
  senaraAcara:    { type: Array, default: () => [] },
  senaraiAcaraKhas: { type: Array, default: () => [] },
  jenisAwal:      { type: String, default: 'masuk' },
});
const emit = defineEmits(['tutup', 'berjaya']);

const jenisTab = [
  {
    id: 'masuk', label: 'Pendapatan (Debit)',
    aktif: 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500',
    aktifKad: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    ikon: 'M7 11l5-5m0 0l5 5m-5-5v12',
  },
  {
    id: 'keluar', label: 'Perbelanjaan (Kredit)',
    aktif: 'bg-rose-50 text-rose-700 border-b-2 border-rose-500',
    aktifKad: 'bg-rose-600 text-white border-rose-600 shadow-sm',
    ikon: 'M17 13l-5 5m0 0l-5-5m5 5V6',
  },
  {
    id: 'sumbangan', label: 'Sumbangan MAKSWIP',
    aktif: 'bg-amber-50 text-amber-700 border-b-2 border-amber-500',
    aktifKad: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
];

// ── Upload Dokumen ──────────────────────────────────────────────────
const dokumenFail  = ref([]); // [{ fail: File, preview: string|null }]
const ralatFail    = ref('');

const tambahFail = (files) => {
  ralatFail.value = '';
  const senarai = Array.from(files || []);
  if (dokumenFail.value.length + senarai.length > 5) {
    ralatFail.value = 'Maksimum 5 fail sahaja dibenarkan.';
    return;
  }
  for (const f of senarai) {
    if (f.size > 20 * 1024 * 1024) { ralatFail.value = `${f.name} melebihi had 20MB.`; continue; }
    const preview = f.type.startsWith('image/') ? URL.createObjectURL(f) : null;
    dokumenFail.value.push({ fail: f, preview });
  }
};

const buangFail = (i) => {
  const entry = dokumenFail.value[i];
  if (entry?.preview) URL.revokeObjectURL(entry.preview);
  dokumenFail.value.splice(i, 1);
};

// Kategori dari API
const senaraiKategoriKewangan = ref([]);
const kategoriKeluar = computed(() =>
  senaraiKategoriKewangan.value.filter(k => ['KELUAR', 'KEDUA'].includes(k.jenis_aliran) && k.aktif)
);
const kategoriMasuk = computed(() =>
  senaraiKategoriKewangan.value.filter(k => ['MASUK', 'KEDUA'].includes(k.jenis_aliran) && k.aktif)
);

const LABEL_KATEGORI_FALLBACK = {
  YURAN: 'Yuran Keahlian', YURAN_FPX: 'Yuran Kelab (FPX)',
  KEDAI: 'Jualan Kedai', ACARA: 'Bayaran Penyertaan Acara',
  SUMBANGAN_AHLI: 'Sumbangan Ahli', KEBAJIKAN: 'Bantuan Kebajikan Ahli',
  TIKET_KAPALTERBANG: 'Tiket Kapal Terbang', SEWAAN_KENDERAAN: 'Sewaan Kenderaan',
  TOKEN_MAKAN: 'Token Makan', TOKEN_PENGANGKUTAN: 'Token Pengangkutan',
  LATIHAN_PASUKAN: 'Latihan Pasukan', PERALATAN_SUKAN: 'Peralatan Sukan',
  PERUBATAN: 'Perubatan', PENGINAPAN: 'Penginapan', PERCETAKAN: 'Percetakan',
  KOS_OPERASI_FPX: 'Kos Operasi (FPX)', 'LAIN-LAIN': 'Lain-lain',
  BELI_TIKET: 'Beli Tiket', BELI_MAKANAN: 'Beli Makanan', BELI_BARANG: 'Beli Barang',
  BAYAR_PERKHIDMATAN: 'Bayar Perkhidmatan', OPERASI: 'Kos Operasi', LAIN: 'Lain-lain',
};
const labelKategori = (k) =>
  senaraiKategoriKewangan.value.find(c => c.kod === k)?.nama || LABEL_KATEGORI_FALLBACK[k] || k;

const todayStr = () => new Date().toISOString().split('T')[0];

const formAsal = (jenis) => ({
  amaun: '',
  tarikh: todayStr(),
  kategori: jenis === 'masuk' ? 'YURAN' : 'KEBAJIKAN',
  rujukan: '',
  nota: '',
  penerima_bayaran: '',
  no_kp_pihak: '',
  masuk_dari_ahli: false,
  nama_syarikat: '',
  acara_khas_id_sumbangan: '',
  pakej_id: '',
  pic_no_kp: '',
  pic_nama: '',   // display only, not sent to API
  acara_khas_id: null,  // sempena (MASUK & KELUAR)
});

// ── Pakej & PIC (MAKSWIP tab) ──────────────────────────────────────
const senaraiPakejBorang = ref([]);
const loadingPakejBorang = ref(false);
const senaraiStaff       = ref([]);
const loadingStaff       = ref(false);
const cariStaff          = ref('');
const showStaffDropdown  = ref(false);

const staffDicari = computed(() => {
  const q = cariStaff.value.toLowerCase().trim();
  if (!q) return senaraiStaff.value;
  return senaraiStaff.value.filter(s =>
    s.nama?.toLowerCase().includes(q) || s.no_kp?.includes(q)
  );
});

const pilihStaff = (s) => {
  form.value.pic_no_kp = s.no_kp;
  form.value.pic_nama  = s.nama;
  cariStaff.value      = s.nama;
  showStaffDropdown.value = false;
};

const clearStaff = () => {
  form.value.pic_no_kp = '';
  form.value.pic_nama  = '';
  cariStaff.value      = '';
};

// Load staff once when component mounts (if not yet loaded)
const muatStaff = async () => {
  if (senaraiStaff.value.length) return;
  loadingStaff.value = true;
  try {
    const { data } = await api.get('/admin/kewangan/staff');
    senaraiStaff.value = data.data || [];
  } catch { /* */ } finally { loadingStaff.value = false; }
};
muatStaff();

const muatKategori = async () => {
  if (senaraiKategoriKewangan.value.length) return;
  try {
    const { data } = await api.get('/admin/kewangan/kategori');
    senaraiKategoriKewangan.value = data.data || [];
  } catch { /* */ }
};
muatKategori();

const jenisAktif = ref(props.jenisAwal);
const form       = ref(formAsal(jenisAktif.value));
const saving     = ref(false);

// Load pakej when acara changes (must be after `form` is declared)
watch(() => form.value.acara_khas_id_sumbangan, async (id) => {
  senaraiPakejBorang.value = [];
  form.value.pakej_id = '';
  if (!id) return;
  loadingPakejBorang.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/acara-khas/${id}/pakej`);
    senaraiPakejBorang.value = (data.data || []).filter(p => p.status === 'AKTIF');
  } catch { /* */ } finally { loadingPakejBorang.value = false; }
});

// Auto-isi amaun dari amaun_pakej apabila pakej dipilih (boleh ubah manual)
watch(() => form.value.pakej_id, (id) => {
  if (!id) return;
  const pakej = senaraiPakejBorang.value.find(p => p.id === parseInt(id));
  if (pakej?.amaun_pakej) form.value.amaun = parseFloat(pakej.amaun_pakej);
});

// Kosongkan medan pihak apabila toggle diterima-daripada bertukar
watch(() => form.value.masuk_dari_ahli, () => {
  form.value.no_kp_pihak     = '';
  form.value.penerima_bayaran = '';
});

const pilihJenis = (id) => {
  jenisAktif.value = id;
  form.value = formAsal(id);
  cariStaff.value = '';
  showStaffDropdown.value = false;
  senaraiPakejBorang.value = [];
  dokumenFail.value.forEach(e => e.preview && URL.revokeObjectURL(e.preview));
  dokumenFail.value = [];
  ralatFail.value = '';
};

watch(() => props.jenisAwal, (v) => {
  jenisAktif.value = v;
  form.value = formAsal(v);
});

const simpan = async () => {
  const amaun = parseFloat(form.value.amaun);
  if (!amaun || amaun <= 0) { toast.amaran('Sila masukkan amaun yang sah.'); return; }

  if (jenisAktif.value === 'masuk') {
    if (form.value.masuk_dari_ahli && !form.value.no_kp_pihak) {
      toast.amaran('Sila pilih ahli yang membuat sumbangan.'); return;
    }
  }
  if (jenisAktif.value === 'keluar') {
    const katSekarang = form.value.kategori;
    if (katSekarang === 'KEBAJIKAN' && !form.value.no_kp_pihak) {
      toast.amaran('Sila pilih ahli penerima bantuan kebajikan.'); return;
    }
    if (katSekarang !== 'KEBAJIKAN' && !form.value.penerima_bayaran?.trim()) {
      toast.amaran('Sila isi nama vendor / pihak penerima bayaran.'); return;
    }
  }
  if (jenisAktif.value === 'sumbangan') {
    if (!form.value.acara_khas_id_sumbangan) { toast.amaran('Sila pilih acara khas untuk sumbangan ini.'); return; }
    if (!form.value.nama_syarikat?.trim()) { toast.amaran('Sila isi nama syarikat / penyumbang.'); return; }
  }

  saving.value = true;
  try {
    let respData;
    if (jenisAktif.value === 'sumbangan') {
      const acaraDipilih = props.senaraiAcaraKhas.find(a => a.id === parseInt(form.value.acara_khas_id_sumbangan));
      const { data } = await api.post('/admin/kewangan/sumbangan', {
        nama_syarikat: form.value.nama_syarikat.trim(),
        nama_acara:    acaraDipilih?.nama || '',
        acara_khas_id: form.value.acara_khas_id_sumbangan || null,
        pakej_id:      form.value.pakej_id  || null,
        pic_no_kp:     form.value.pic_no_kp || null,
        amaun:         form.value.amaun,
        nota:          form.value.nota   || null,
        tarikh:        form.value.tarikh || null,
      });
      respData = data;
    } else {
      const fd = new FormData();
      fd.append('jenis',    jenisAktif.value === 'masuk' ? 'MASUK' : 'KELUAR');
      fd.append('kategori', form.value.kategori);
      fd.append('amaun',    form.value.amaun);
      if (form.value.rujukan)          fd.append('rujukan',          form.value.rujukan);
      if (form.value.nota)             fd.append('nota',             form.value.nota);
      if (form.value.no_kp_pihak)      fd.append('no_kp_pihak',      form.value.no_kp_pihak);
      if (form.value.penerima_bayaran) fd.append('penerima_bayaran', form.value.penerima_bayaran);
      if (form.value.tarikh)           fd.append('tarikh',           form.value.tarikh);
      if (form.value.acara_khas_id)    fd.append('acara_khas_id',    form.value.acara_khas_id);
      dokumenFail.value.forEach(e => fd.append('dokumen', e.fail));

      const { data } = await api.post('/admin/kewangan/rekod', fd);
      respData = data;
    }

    if (respData.success) {
      toast.sukses('Rekod berjaya disimpan.');
      dokumenFail.value.forEach(e => e.preview && URL.revokeObjectURL(e.preview));
      dokumenFail.value = [];
      emit('berjaya', jenisAktif.value);
    }
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal menyimpan rekod. Sila cuba lagi.');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.field-label {
  @apply block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1;
}
.field-input {
  @apply w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs
    focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-colors;
}
.fs-fade-enter-active, .fs-fade-leave-active { transition: opacity 0.2s ease; }
.fs-fade-enter-from, .fs-fade-leave-to { opacity: 0; }
</style>
