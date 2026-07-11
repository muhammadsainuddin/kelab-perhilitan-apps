
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

        <!-- ── Body ── -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-5xl mx-auto px-5 py-6">
            <div class="grid lg:grid-cols-3 gap-5">

              <!-- Left: Form (2 cols) -->
              <div class="lg:col-span-2 space-y-4">

                <!-- Jenis Tab Selector -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div class="flex divide-x divide-gray-100 border-b border-gray-100">
                    <button v-for="j in jenisTab" :key="j.id" @click="pilihJenis(j.id)"
                      :class="['flex-1 py-3 px-2 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 leading-tight',
                        jenisAktif === j.id ? j.aktif : 'text-gray-400 hover:bg-gray-50']">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="j.ikon"/>
                      </svg>
                      {{ j.label }}
                    </button>
                  </div>

                  <div class="p-5 space-y-4">

                    <!-- Baris 1: Amaun + Tarikh -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="field-label">Amaun (RM) *</label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold select-none">RM</span>
                          <input v-model="form.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
                            :class="['field-input pl-9 text-right font-bold tabular-nums text-sm',
                              jenisAktif === 'masuk' ? 'focus:border-emerald-500 text-emerald-700' :
                              jenisAktif === 'keluar' ? 'focus:border-rose-500 text-rose-700' :
                              'focus:border-amber-500 text-amber-700']" />
                        </div>
                      </div>
                      <div>
                        <label class="field-label">Tarikh Transaksi *</label>
                        <input v-model="form.tarikh" type="date" class="field-input" />
                      </div>
                    </div>

                    <!-- MASUK -->
                    <template v-if="jenisAktif === 'masuk'">
                      <div>
                        <label class="field-label">Kategori Pendapatan *</label>
                        <select v-model="form.kategori" class="field-input">
                          <option value="YURAN">Yuran Keahlian</option>
                          <option value="KEDAI">Jualan Kedai / Merchandise</option>
                          <option value="ACARA">Bayaran Penyertaan Acara</option>
                          <option value="LAIN">Lain-lain Pendapatan</option>
                          <optgroup v-if="senaraiAcaraKhas.length" label="── Acara Khas ──">
                            <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="`ACARA_KHAS_${a.id}`">
                              {{ a.nama }}
                            </option>
                          </optgroup>
                        </select>
                        <p class="mt-1 text-[10px] text-amber-600 font-semibold">
                          Sumbangan syarikat luar? Gunakan tab <strong>Sumbangan MAKSWIP</strong> di bawah.
                        </p>
                      </div>
                      <div>
                        <label class="field-label">Diterima Daripada / Sumber</label>
                        <input v-model="form.penerima_bayaran" type="text"
                          placeholder="Nama individu, jabatan atau syarikat pembayar"
                          class="field-input" />
                        <p class="mt-1 text-[10px] text-gray-400">Biarkan kosong jika pemasukan kolektif (contoh: kiriman automatik sistem).</p>
                      </div>
                    </template>

                    <!-- KELUAR -->
                    <template v-else-if="jenisAktif === 'keluar'">
                      <div>
                        <label class="field-label">Kategori Perbelanjaan *</label>
                        <select v-model="form.kategori" class="field-input">
                          <option value="KEBAJIKAN">Bantuan Kebajikan Ahli</option>
                          <option value="ACARA">Kos Acara / Sukan Kelab</option>
                          <option value="BELIAN_BARANG">Pembelian Barang / Aset</option>
                          <option value="PERKHIDMATAN">Pembayaran Perkhidmatan</option>
                          <option value="LAIN">Lain-lain Pengurusan</option>
                          <optgroup v-if="senaraiAcaraKhas.length" label="── Acara Khas ──">
                            <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="`ACARA_KHAS_${a.id}`">
                              {{ a.nama }}
                            </option>
                          </optgroup>
                        </select>
                      </div>

                      <div v-if="form.kategori === 'KEBAJIKAN'" class="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
                        <label class="field-label text-blue-700">Ahli Penerima Bantuan *</label>
                        <select v-model="form.no_kp_pihak" class="field-input bg-white border-blue-200 focus:border-blue-500">
                          <option value="" disabled>-- Pilih Ahli Kelab --</option>
                          <option v-for="a in senaraiAhli" :key="a.no_kp" :value="a.no_kp">
                            {{ a.nama_pegawai }} &nbsp;({{ a.no_kp }})
                          </option>
                        </select>
                        <p class="text-[10px] text-blue-600">Bantuan kebajikan akan direkodkan atas nama ahli yang dipilih.</p>
                      </div>
                      <div v-else>
                        <label class="field-label">Dibayar Kepada (Vendor / Syarikat / Individu) *</label>
                        <input v-model="form.penerima_bayaran" type="text"
                          placeholder="Cth: Syarikat Katering ABC Sdn Bhd / Tuan Haji Ahmad"
                          class="field-input" />
                      </div>
                    </template>

                    <!-- SUMBANGAN MAKSWIP -->
                    <template v-else>
                      <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                        <svg class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-[10px] text-amber-700 leading-relaxed">
                          Sumbangan ini akan direkodkan dalam <strong>Kutipan Sumbangan Luar</strong> — bukan terus ke ledger. Tuntutan ke MAKSWIP dibuat kemudian melalui tab Kutipan Sumbangan.
                        </p>
                      </div>
                      <div>
                        <label class="field-label">Acara Khas *</label>
                        <select v-if="senaraiAcaraKhas.length" v-model="form.acara_khas_id_sumbangan" class="field-input">
                          <option value="">— Pilih Acara —</option>
                          <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                        </select>
                        <div v-else class="field-input bg-amber-50 border-amber-200 text-amber-700 text-[10px]">
                          Tiada acara khas. Tambah dahulu dalam
                          <strong>Tetapan → Acara Khas</strong>.
                        </div>
                      </div>

                      <!-- Pakej Sumbangan -->
                      <div v-if="form.acara_khas_id_sumbangan">
                        <label class="field-label">Pakej Sumbangan</label>
                        <div v-if="loadingPakejBorang" class="field-input text-[10px] text-gray-400">Memuatkan pakej...</div>
                        <select v-else-if="senaraiPakejBorang.length" v-model="form.pakej_id" class="field-input">
                          <option value="">— Tiada Pakej Khusus —</option>
                          <option v-for="p in senaraiPakejBorang" :key="p.id" :value="p.id">
                            {{ p.nama }}{{ p.amaun_pakej ? ` (RM ${parseFloat(p.amaun_pakej).toLocaleString('ms-MY', { minimumFractionDigits: 2 })})` : '' }}
                          </option>
                        </select>
                        <div v-else class="field-input bg-gray-50 border-gray-200 text-gray-400 text-[10px]">
                          Tiada pakej ditakrifkan untuk acara ini.
                        </div>
                      </div>

                      <!-- Person In Charge (PIC) -->
                      <div class="relative">
                        <label class="field-label">Person In Charge (PIC)</label>
                        <div class="relative">
                          <input
                            v-model="cariStaff"
                            type="text"
                            placeholder="Taip nama atau no. KP staff..."
                            class="field-input pr-8"
                            @focus="showStaffDropdown = true"
                            @blur="setTimeout(() => { showStaffDropdown = false }, 180)"
                            autocomplete="off"
                          />
                          <button v-if="form.pic_no_kp" @click="clearStaff" type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                        <!-- Dropdown staff -->
                        <div v-if="showStaffDropdown && (staffDicari.length || loadingStaff)"
                          class="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                          <div v-if="loadingStaff" class="px-3 py-2 text-[10px] text-gray-400">Memuatkan...</div>
                          <div v-else-if="!staffDicari.length" class="px-3 py-2 text-[10px] text-gray-400">Tiada staf dijumpai.</div>
                          <button v-else v-for="s in staffDicari" :key="s.no_kp"
                            type="button"
                            @mousedown.prevent="pilihStaff(s)"
                            class="w-full text-left px-3 py-2 hover:bg-violet-50 transition-colors"
                            :class="form.pic_no_kp === s.no_kp ? 'bg-violet-50' : ''">
                            <p class="text-[11px] font-semibold text-gray-800">{{ s.nama }}</p>
                            <p class="text-[9px] text-gray-400 font-mono">{{ s.no_kp }}</p>
                          </button>
                        </div>
                        <p v-if="form.pic_no_kp" class="mt-1 text-[9px] text-violet-600 font-medium">
                          ✓ {{ form.pic_nama }} dipilih sebagai PIC
                        </p>
                      </div>

                      <div>
                        <label class="field-label">Nama Syarikat / Penyumbang *</label>
                        <input v-model="form.nama_syarikat" type="text"
                          placeholder="Nama penuh syarikat atau individu penyumbang"
                          class="field-input" />
                      </div>
                    </template>

                    <!-- Rujukan + Nota (common) -->
                    <div>
                      <label class="field-label">No. Rujukan / Baucer / Invois / Resit</label>
                      <input v-model="form.rujukan" type="text"
                        placeholder="Cth: INV-2025-001 / BV-001 / RES-001"
                        class="field-input font-mono tracking-wide" />
                      <p class="mt-1 text-[10px] text-gray-400">No. baucer untuk bayaran keluar; no. resit untuk pemasukan. Gunakan 'AUTO' jika tiada rujukan fizikal.</p>
                    </div>
                    <div>
                      <label class="field-label">Nota / Keterangan</label>
                      <textarea v-model="form.nota" rows="2"
                        placeholder="Catatan tambahan mengenai transaksi ini..."
                        class="field-input resize-none"></textarea>
                    </div>

                  </div>
                </div>

              </div>

              <!-- Right: Panduan + Preview -->
              <div class="lg:col-span-1">
                <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-0 space-y-4">

                  <!-- Context block -->
                  <div :class="['rounded-lg p-3 border text-[11px]',
                    jenisAktif === 'masuk' ? 'bg-emerald-50 border-emerald-200' :
                    jenisAktif === 'keluar' ? 'bg-rose-50 border-rose-200' :
                    'bg-amber-50 border-amber-200']">
                    <p :class="['font-bold text-[10px] uppercase tracking-wider mb-1',
                      jenisAktif === 'masuk' ? 'text-emerald-700' :
                      jenisAktif === 'keluar' ? 'text-rose-700' : 'text-amber-700']">
                      {{ jenisAktif === 'masuk' ? 'KREDIT — Wang Masuk' : jenisAktif === 'keluar' ? 'DEBIT — Wang Keluar' : 'Sumbangan / Derma' }}
                    </p>
                    <p :class="jenisAktif === 'masuk' ? 'text-emerald-800' : jenisAktif === 'keluar' ? 'text-rose-800' : 'text-amber-800'">
                      {{ jenisAktif === 'masuk'
                        ? 'Rekod semua wang yang MASUK ke akaun kelab — yuran ahli, jualan kedai atau bayaran penyertaan acara.'
                        : jenisAktif === 'keluar'
                        ? 'Rekod semua wang yang KELUAR dari akaun kelab — bayaran vendor, belian aset, bantuan kebajikan atau kos acara.'
                        : 'Rekod sumbangan syarikat luar melalui MAKSWIP. Wang disimpan di MAKSWIP dahulu — tuntutan dibuat kemudian dan MAKSWIP akan tolak 10%.' }}
                    </p>
                  </div>

                  <!-- Panduan ringkas -->
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Panduan Pengisian</p>
                    <ul class="space-y-1.5 text-[11px] text-gray-600">
                      <template v-if="jenisAktif === 'masuk'">
                        <li class="flex gap-1.5"><span class="text-emerald-500 shrink-0 font-bold">✓</span> Amaun = nilai bersih yang diterima (selepas potongan jika ada)</li>
                        <li class="flex gap-1.5"><span class="text-emerald-500 shrink-0 font-bold">✓</span> Rujukan = No. resit, bil atau slip bayaran</li>
                        <li class="flex gap-1.5"><span class="text-emerald-500 shrink-0 font-bold">✓</span> Gunakan kategori KEDAI untuk bayaran dari marketplace</li>
                        <li class="flex gap-1.5"><span class="text-emerald-500 shrink-0 font-bold">✓</span> Yuran masuk secara automatik — hanya rekod bayaran tunai manual di sini</li>
                      </template>
                      <template v-else-if="jenisAktif === 'keluar'">
                        <li class="flex gap-1.5"><span class="text-rose-500 shrink-0 font-bold">✓</span> Rujukan = No. baucer rasmi atau invois vendor</li>
                        <li class="flex gap-1.5"><span class="text-rose-500 shrink-0 font-bold">✓</span> Untuk KEBAJIKAN — pilih nama ahli penerima dari senarai</li>
                        <li class="flex gap-1.5"><span class="text-rose-500 shrink-0 font-bold">✓</span> Sertakan nota jika perbelanjaan luar biasa atau atas kelulusan khas</li>
                        <li class="flex gap-1.5"><span class="text-rose-500 shrink-0 font-bold">✓</span> Setiap rekod keluar akan menolak Baki Semasa kelab</li>
                      </template>
                      <template v-else>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Nama Acara wajib diisi — rekod dikelompok mengikut acara</li>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Rekod ini TIDAK masuk ledger — ia dalam kutipan sumbangan luar</li>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Buat tuntutan melalui tab <strong>Kutipan Sumbangan</strong> apabila terima dari MAKSWIP</li>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> MAKSWIP akan tolak 10% — hanya 90% masuk ke ledger kelab</li>
                      </template>
                    </ul>
                  </div>

                  <!-- Live preview -->
                  <div v-if="parseFloat(form.amaun) > 0" class="border border-dashed border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pratonton Entri Lejar</p>
                    <div class="space-y-1.5">
                      <div class="flex justify-between text-[11px]">
                        <span class="text-gray-500">Jenis</span>
                        <span :class="['font-bold text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded',
                          jenisAktif === 'masuk' ? 'bg-emerald-100 text-emerald-700' :
                          jenisAktif === 'keluar' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700']">
                          {{ jenisAktif === 'masuk' ? 'KREDIT (+)' : jenisAktif === 'keluar' ? 'DEBIT (-)' : 'KUTIPAN LUAR' }}
                        </span>
                      </div>
                      <div class="flex justify-between text-[11px]">
                        <span class="text-gray-500">Amaun</span>
                        <span :class="['font-bold tabular-nums',
                          jenisAktif === 'masuk' ? 'text-emerald-600' :
                          jenisAktif === 'keluar' ? 'text-rose-600' : 'text-amber-600']">
                          {{ jenisAktif === 'keluar' ? '- ' : '+ ' }}RM {{ parseFloat(form.amaun || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
                        </span>
                      </div>
                      <div v-if="form.kategori" class="flex justify-between text-[11px]">
                        <span class="text-gray-500">Kategori</span>
                        <span class="font-semibold text-gray-700">{{ labelKategori(form.kategori) }}</span>
                      </div>
                      <div v-if="form.tarikh" class="flex justify-between text-[11px]">
                        <span class="text-gray-500">Tarikh</span>
                        <span class="font-medium text-gray-700 font-mono">{{ form.tarikh }}</span>
                      </div>
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
import { ref, watch, computed } from 'vue';
import api from '../../services/api';

const props = defineProps({
  senaraiAhli:    { type: Array, default: () => [] },
  senaraAcara:    { type: Array, default: () => [] },
  senaraiAcaraKhas: { type: Array, default: () => [] },
  jenisAwal:      { type: String, default: 'masuk' },
});
const emit = defineEmits(['tutup', 'berjaya']);

const jenisTab = [
  {
    id: 'masuk', label: 'Pendapatan (Kredit)',
    aktif: 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500',
    ikon: 'M7 11l5-5m0 0l5 5m-5-5v12',
  },
  {
    id: 'keluar', label: 'Perbelanjaan (Debit)',
    aktif: 'bg-rose-50 text-rose-700 border-b-2 border-rose-500',
    ikon: 'M17 13l-5 5m0 0l-5-5m5 5V6',
  },
  {
    id: 'sumbangan', label: 'Sumbangan MAKSWIP',
    aktif: 'bg-amber-50 text-amber-700 border-b-2 border-amber-500',
    ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
];

const LABEL_KATEGORI = {
  YURAN: 'Yuran Keahlian', KEDAI: 'Jualan Kedai', ACARA: 'Bayaran Acara',
  SUMBANGAN: 'Sumbangan', LAIN: 'Lain-lain',
  KEBAJIKAN: 'Bantuan Kebajikan', BELIAN_BARANG: 'Pembelian Barang', PERKHIDMATAN: 'Pembayaran Perkhidmatan',
};
const labelKategori = (k) => LABEL_KATEGORI[k] || k;

const todayStr = () => new Date().toISOString().split('T')[0];

const formAsal = (jenis) => ({
  amaun: '',
  tarikh: todayStr(),
  kategori: jenis === 'masuk' ? 'YURAN' : 'KEBAJIKAN',
  rujukan: '',
  nota: '',
  penerima_bayaran: '',
  no_kp_pihak: '',
  nama_syarikat: '',
  acara_khas_id_sumbangan: '',
  pakej_id: '',
  pic_no_kp: '',
  pic_nama: '',   // display only, not sent to API
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

const pilihJenis = (id) => {
  jenisAktif.value = id;
  form.value = formAsal(id);
  cariStaff.value = '';
  showStaffDropdown.value = false;
  senaraiPakejBorang.value = [];
};

watch(() => props.jenisAwal, (v) => {
  jenisAktif.value = v;
  form.value = formAsal(v);
});

const simpan = async () => {
  const amaun = parseFloat(form.value.amaun);
  if (!amaun || amaun <= 0) return alert('Sila masukkan amaun yang sah.');

  if (jenisAktif.value === 'keluar') {
    const katSekarang = form.value.kategori;
    if (katSekarang === 'KEBAJIKAN' && !form.value.no_kp_pihak) {
      return alert('Sila pilih ahli penerima bantuan kebajikan.');
    }
    if (katSekarang !== 'KEBAJIKAN' && !form.value.penerima_bayaran?.trim()) {
      return alert('Sila isi nama vendor / pihak penerima bayaran.');
    }
  }
  if (jenisAktif.value === 'sumbangan') {
    if (!form.value.acara_khas_id_sumbangan) return alert('Sila pilih acara khas untuk sumbangan ini.');
    if (!form.value.nama_syarikat?.trim()) return alert('Sila isi nama syarikat / penyumbang.');
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
      const isAcaraKhas = form.value.kategori.startsWith('ACARA_KHAS_');
      const kategoriSebenar = isAcaraKhas ? 'ACARA_KHAS' : form.value.kategori;
      const acaraKhasId = isAcaraKhas ? parseInt(form.value.kategori.replace('ACARA_KHAS_', '')) : null;

      const { data } = await api.post('/admin/kewangan/rekod', {
        jenis:            jenisAktif.value === 'masuk' ? 'MASUK' : 'KELUAR',
        kategori:         kategoriSebenar,
        amaun:            form.value.amaun,
        rujukan:          form.value.rujukan          || null,
        nota:             form.value.nota             || null,
        no_kp_pihak:      form.value.no_kp_pihak      || null,
        penerima_bayaran: form.value.penerima_bayaran || null,
        tarikh:           form.value.tarikh           || null,
        acara_khas_id:    acaraKhasId,
      });
      respData = data;
    }

    if (respData.success) {
      emit('berjaya', jenisAktif.value);
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan rekod. Sila cuba lagi.');
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
