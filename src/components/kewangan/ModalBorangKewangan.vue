
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
                          <option value="SUMBANGAN">Sumbangan / Derma</option>
                          <option value="LAIN">Lain-lain Pendapatan</option>
                        </select>
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

                    <!-- SUMBANGAN -->
                    <template v-else>
                      <div>
                        <label class="field-label">Nama Penyumbang *</label>
                        <input v-model="form.penerima_bayaran" type="text"
                          placeholder="Nama penuh individu atau syarikat penyumbang"
                          class="field-input" />
                      </div>
                      <div>
                        <label class="field-label">Program / Tujuan Sumbangan</label>
                        <input v-model="form.program" type="text"
                          placeholder="Cth: Tabung Kebajikan, Sukan Tahunan 2025"
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
                        ? 'Rekod semua wang yang MASUK ke akaun kelab — yuran ahli, jualan kedai, sumbangan atau bayaran penyertaan.'
                        : jenisAktif === 'keluar'
                        ? 'Rekod semua wang yang KELUAR dari akaun kelab — bayaran vendor, belian aset, bantuan kebajikan atau kos acara.'
                        : 'Rekod penerimaan sumbangan atau derma. Dikira sebagai Kredit dalam lejar dan disimpan berasingan untuk laporan sumbangan.' }}
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
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Rekodkan nama penyumbang dengan tepat untuk laporan audit</li>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Program = tujuan spesifik sumbangan (jika berkenaan)</li>
                        <li class="flex gap-1.5"><span class="text-amber-500 shrink-0 font-bold">✓</span> Import CSV boleh dibuat dari tab Sumbangan untuk sumbangan pukal</li>
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
                          {{ jenisAktif === 'masuk' ? 'KREDIT (+)' : jenisAktif === 'keluar' ? 'DEBIT (-)' : 'SUMBANGAN' }}
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
import { ref, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({
  senaraiAhli: { type: Array, default: () => [] },
  jenisAwal:   { type: String, default: 'masuk' },
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
    id: 'sumbangan', label: 'Sumbangan / Derma',
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
  kategori: jenis === 'masuk' ? 'YURAN' : jenis === 'keluar' ? 'KEBAJIKAN' : 'SUMBANGAN',
  rujukan: '',
  nota: '',
  penerima_bayaran: '',
  no_kp_pihak: '',
  program: '',
});

const jenisAktif = ref(props.jenisAwal);
const form       = ref(formAsal(jenisAktif.value));
const saving     = ref(false);

const pilihJenis = (id) => {
  jenisAktif.value = id;
  form.value = formAsal(id);
};

watch(() => props.jenisAwal, (v) => {
  jenisAktif.value = v;
  form.value = formAsal(v);
});

const simpan = async () => {
  const amaun = parseFloat(form.value.amaun);
  if (!amaun || amaun <= 0) return alert('Sila masukkan amaun yang sah.');

  if (jenisAktif.value === 'keluar') {
    if (form.value.kategori === 'KEBAJIKAN' && !form.value.no_kp_pihak) {
      return alert('Sila pilih ahli penerima bantuan kebajikan.');
    }
    if (form.value.kategori !== 'KEBAJIKAN' && !form.value.penerima_bayaran?.trim()) {
      return alert('Sila isi nama vendor / pihak penerima bayaran.');
    }
  }
  if (jenisAktif.value === 'sumbangan' && !form.value.penerima_bayaran?.trim()) {
    return alert('Sila isi nama penyumbang.');
  }

  saving.value = true;
  try {
    let respData;
    if (jenisAktif.value === 'sumbangan') {
      const { data } = await api.post('/admin/kewangan/sumbangan', {
        nama_penyumbang: form.value.penerima_bayaran.trim(),
        amaun:   form.value.amaun,
        program: form.value.program   || null,
        nota:    form.value.nota      || null,
        tarikh:  form.value.tarikh    || null,
      });
      respData = data;
    } else {
      const { data } = await api.post('/admin/kewangan/rekod', {
        jenis:            jenisAktif.value === 'masuk' ? 'MASUK' : 'KELUAR',
        kategori:         form.value.kategori,
        amaun:            form.value.amaun,
        rujukan:          form.value.rujukan          || null,
        nota:             form.value.nota             || null,
        no_kp_pihak:      form.value.no_kp_pihak      || null,
        penerima_bayaran: form.value.penerima_bayaran || null,
        tarikh:           form.value.tarikh           || null,
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
