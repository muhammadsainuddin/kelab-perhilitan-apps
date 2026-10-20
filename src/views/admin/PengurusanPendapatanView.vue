<template>
  <div class="space-y-5 pb-10 text-xs text-gray-800" style="font-family: Tahoma, 'Segoe UI', Arial, sans-serif">
    <section class="overflow-hidden rounded-2xl bg-gradient-to-br from-[#083d31] via-[#0F4C3A] to-[#0a2e23] p-5 text-white shadow-lg md:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">Lejar Wang Masuk</p>
          <h2 class="mt-1 text-xl font-black">Rekod Pendapatan Kelab</h2>
          <p class="mt-1 max-w-2xl text-[11px] leading-relaxed text-emerald-100/75">
            Kunci masuk kutipan, geran, jualan, tajaan dan semua penerimaan lain. Rekod yang disimpan terus dikira dalam dashboard dan laporan kewangan.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:min-w-[300px]">
          <div class="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-100/65">Jumlah {{ tahunPilihan }}</p>
            <p class="mt-1 text-lg font-black tabular-nums">RM {{ formatRM(jumlahPendapatan) }}</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-100/65">Bilangan Rekod</p>
            <p class="mt-1 text-lg font-black tabular-nums">{{ meta.total }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
      <section class="self-start overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm xl:sticky xl:top-4">
        <div class="border-b border-emerald-100 bg-emerald-50/70 px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </span>
            <div>
              <h3 class="text-sm font-black text-gray-900">Kunci Masuk Pendapatan</h3>
              <p class="text-[10px] text-gray-500">Medan bertanda * wajib diisi.</p>
            </div>
          </div>
        </div>

        <form class="space-y-4 p-5" @submit.prevent="simpanPendapatan">
          <div class="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-3">
            <label for="amaun-pendapatan" class="field-label text-emerald-700">Amaun Diterima *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-500">RM</span>
              <input id="amaun-pendapatan" v-model="form.amaun" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="0.00"
                class="w-full rounded-xl border border-emerald-300 bg-white py-3 pl-11 pr-3 text-2xl font-black text-emerald-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label for="tarikh-pendapatan" class="field-label">Tarikh *</label>
              <input id="tarikh-pendapatan" v-model="form.tarikh" type="date" :max="hariIni" class="field-input" />
            </div>
            <div>
              <label for="kategori-pendapatan" class="field-label">Kategori *</label>
              <select id="kategori-pendapatan" v-model="form.kategori" class="field-input">
                <option value="" disabled>— Pilih kategori —</option>
                <option v-for="kategori in kategoriPendapatan" :key="kategori.kod" :value="kategori.kod">{{ kategori.nama }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="field-label">Diterima Daripada</label>
            <div class="mb-2 flex gap-4 rounded-lg bg-gray-50 px-3 py-2">
              <label class="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                <input v-model="sumberAhli" type="radio" :value="false" class="accent-emerald-700" /> Nama bebas
              </label>
              <label class="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-gray-700">
                <input v-model="sumberAhli" type="radio" :value="true" class="accent-emerald-700" /> Ahli kelab
              </label>
            </div>
            <select v-if="sumberAhli" v-model="form.no_kp_pihak" class="field-input">
              <option value="">— Pilih ahli —</option>
              <option v-for="ahli in senaraiAhli" :key="ahli.no_kp" :value="ahli.no_kp">
                {{ ahli.nama_pegawai }} ({{ ahli.no_kp }})
              </option>
            </select>
            <input v-else v-model.trim="form.penerima_bayaran" type="text" maxlength="255" placeholder="Contoh: Jabatan PERHILITAN / Syarikat ABC" class="field-input" />
            <p class="mt-1 text-[9px] text-gray-400">Boleh dikosongkan untuk kutipan kolektif.</p>
          </div>

          <div>
            <label for="acara-pendapatan" class="field-label">Sempena Acara</label>
            <select id="acara-pendapatan" v-model="form.acara_khas_id" class="field-input">
              <option value="">Pendapatan biasa kelab</option>
              <option v-for="acara in acaraAktif" :key="acara.id" :value="acara.id">{{ acara.nama }}</option>
            </select>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label for="rujukan-pendapatan" class="field-label">No. Rujukan / Resit</label>
              <input id="rujukan-pendapatan" v-model.trim="form.rujukan" type="text" maxlength="100" placeholder="Contoh: RES-001" class="field-input font-mono" />
            </div>
            <div>
              <label class="field-label">Direkod Oleh</label>
              <div class="field-input truncate border-gray-200 bg-gray-100 text-gray-500">{{ authStore.user?.name || '—' }}</div>
            </div>
          </div>

          <div>
            <label for="nota-pendapatan" class="field-label">Keterangan</label>
            <textarea id="nota-pendapatan" v-model.trim="form.nota" rows="3" maxlength="1000" placeholder="Masukkan butiran penerimaan..." class="field-input resize-none"></textarea>
          </div>

          <div>
            <label class="field-label">Dokumen Sokongan <span class="normal-case font-normal text-gray-400">(maks. 5 fail)</span></label>
            <button type="button" class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-[11px] text-gray-500 transition hover:border-emerald-400 hover:bg-emerald-50" @click="inputDokumen?.click()">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4" />
              </svg>
              Pilih gambar atau PDF
            </button>
            <input ref="inputDokumen" type="file" multiple accept=".jpg,.jpeg,.jfif,.png,.webp,.pdf" class="hidden" @change="pilihDokumen" />
            <div v-if="dokumen.length" class="mt-2 space-y-1.5">
              <div v-for="(fail, index) in dokumen" :key="`${fail.name}-${index}`" class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white text-[9px] font-black uppercase text-gray-500">{{ sambunganFail(fail.name) }}</span>
                <div class="min-w-0 flex-1"><p class="truncate text-[10px] font-semibold text-gray-700">{{ fail.name }}</p><p class="text-[9px] text-gray-400">{{ formatSaiz(fail.size) }}</p></div>
                <button type="button" class="text-gray-400 hover:text-rose-600" aria-label="Buang fail" @click="buangDokumen(index)">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <p v-if="ralatDokumen" class="mt-1 text-[10px] font-semibold text-rose-600">{{ ralatDokumen }}</p>
          </div>

          <div v-if="Number(form.amaun) > 0" class="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <div><p class="text-[9px] font-black uppercase tracking-wider text-emerald-600">Jumlah akan direkod</p><p class="mt-0.5 text-[10px] text-gray-500">{{ namaKategoriDipilih }}</p></div>
            <p class="text-base font-black tabular-nums text-emerald-700">+ RM {{ formatRM(form.amaun) }}</p>
          </div>

          <button type="submit" :disabled="menyimpan" class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            <svg v-if="menyimpan" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ menyimpan ? 'Menyimpan...' : 'Simpan Rekod Pendapatan' }}
          </button>
        </form>
      </section>

      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-100 px-5 py-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 class="text-sm font-black text-gray-900">Senarai Pendapatan</h3><p class="text-[10px] text-gray-500">Semua rekod wang masuk bagi tahun yang dipilih.</p></div>
            <select v-model="tahunPilihan" class="field-input w-auto min-w-32" @change="tukarPenapis">
              <option v-for="tahun in pilihanTahun" :key="tahun" :value="tahun">Tahun {{ tahun }}</option>
            </select>
          </div>
          <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_190px]">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input v-model="carian" type="search" placeholder="Cari rujukan, keterangan atau pembayar..." class="field-input pl-9" @input="jadualCarian" />
            </div>
            <select v-model="kategoriPilihan" class="field-input" @change="tukarPenapis">
              <option value="">Semua kategori</option>
              <option v-for="kategori in kategoriPendapatan" :key="kategori.kod" :value="kategori.kod">{{ kategori.nama }}</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left">
            <thead class="border-b border-gray-200 bg-gray-50 text-[9px] font-black uppercase tracking-wider text-gray-500">
              <tr><th class="px-5 py-3">Tarikh</th><th class="px-4 py-3">Kategori</th><th class="px-4 py-3">Sumber / Keterangan</th><th class="px-4 py-3">Rujukan</th><th class="px-4 py-3">Direkod Oleh</th><th class="px-5 py-3 text-right">Amaun</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="memuatRekod"><td colspan="6" class="px-5 py-14 text-center text-gray-400"><span class="inline-flex items-center gap-2"><span class="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></span>Memuatkan rekod...</span></td></tr>
              <tr v-else-if="!rekod.length"><td colspan="6" class="px-5 py-14 text-center"><p class="font-bold text-gray-500">Tiada rekod pendapatan dijumpai.</p><p class="mt-1 text-[10px] text-gray-400">Gunakan borang di sebelah untuk menambah rekod pertama.</p></td></tr>
              <template v-else>
                <tr v-for="item in rekod" :key="item.id" class="transition hover:bg-emerald-50/30">
                  <td class="whitespace-nowrap px-5 py-3 font-mono text-[10px] text-gray-600">{{ item.tarikh }}</td>
                  <td class="px-4 py-3"><span class="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">{{ labelKategori(item.kategori) }}</span><p v-if="item.nama_acara_khas" class="mt-1 text-[9px] text-violet-600">{{ item.nama_acara_khas }}</p></td>
                  <td class="max-w-56 px-4 py-3"><p class="truncate text-[11px] font-semibold text-gray-700">{{ item.nama_ahli || item.penerima_bayaran || 'Kutipan kolektif' }}</p><p v-if="item.nota" class="mt-0.5 truncate text-[9px] text-gray-400">{{ item.nota }}</p></td>
                  <td class="px-4 py-3 font-mono text-[10px] text-gray-500">{{ item.rujukan || '—' }}</td>
                  <td class="px-4 py-3 text-[10px] text-gray-600">{{ item.nama_direkod_oleh || 'Sistem / Auto' }}</td>
                  <td class="whitespace-nowrap px-5 py-3 text-right text-xs font-black tabular-nums text-emerald-700">+ RM {{ formatRM(item.amaun) }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="meta.total" class="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[10px] text-gray-500">Memaparkan {{ rekod.length }} daripada {{ meta.total }} rekod</p>
          <div class="flex items-center gap-1">
            <button type="button" :disabled="halaman === 1" class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-600 disabled:opacity-40" @click="ubahHalaman(halaman - 1)">Sebelum</button>
            <span class="px-2 text-[10px] font-bold text-gray-500">{{ halaman }} / {{ jumlahHalaman }}</span>
            <button type="button" :disabled="halaman >= jumlahHalaman" class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-600 disabled:opacity-40" @click="ubahHalaman(halaman + 1)">Seterusnya</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { useToast } from '../../composables/useToast';

const authStore = useAuthStore();
const toast = useToast();
const PAD_LIMIT = 15;

const tarikhTempatan = () => {
  const sekarang = new Date();
  const offset = sekarang.getTimezoneOffset() * 60_000;
  return new Date(sekarang.getTime() - offset).toISOString().slice(0, 10);
};

const hariIni = tarikhTempatan();
const borangKosong = () => ({ amaun: '', tarikh: hariIni, kategori: '', no_kp_pihak: '', penerima_bayaran: '', acara_khas_id: '', rujukan: '', nota: '' });

const form = ref(borangKosong());
const sumberAhli = ref(false);
const dokumen = ref([]);
const ralatDokumen = ref('');
const inputDokumen = ref(null);
const menyimpan = ref(false);
const kategori = ref([]);
const senaraiAhli = ref([]);
const senaraiAcara = ref([]);
const rekod = ref([]);
const memuatRekod = ref(true);
const jumlahPendapatan = ref(0);
const tahunPilihan = ref(new Date().getFullYear());
const kategoriPilihan = ref('');
const carian = ref('');
const halaman = ref(1);
const meta = ref({ total: 0, page: 1, limit: PAD_LIMIT });
let carianTimer;

const kategoriPendapatan = computed(() => kategori.value.filter(item => item.aktif && ['MASUK', 'KEDUA'].includes(item.jenis_aliran)));
const acaraAktif = computed(() => senaraiAcara.value.filter(item => item.status === 'AKTIF'));
const pilihanTahun = computed(() => Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - index));
const jumlahHalaman = computed(() => Math.max(1, Math.ceil(meta.value.total / PAD_LIMIT)));
const namaKategoriDipilih = computed(() => labelKategori(form.value.kategori));

watch(sumberAhli, () => {
  form.value.no_kp_pihak = '';
  form.value.penerima_bayaran = '';
});

const labelKategori = kod => kategori.value.find(item => item.kod === kod)?.nama || kod || '—';
const formatRM = nilai => Number(nilai || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatSaiz = saiz => saiz >= 1024 * 1024 ? `${(saiz / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(saiz / 1024)} KB`;
const sambunganFail = nama => nama.split('.').pop()?.slice(0, 4) || 'FAIL';

const pilihDokumen = event => {
  ralatDokumen.value = '';
  const failBaharu = Array.from(event.target.files || []);
  if (dokumen.value.length + failBaharu.length > 5) {
    ralatDokumen.value = 'Maksimum 5 fail sahaja dibenarkan.';
    event.target.value = '';
    return;
  }
  const sah = failBaharu.filter(fail => {
    if (fail.size > 20 * 1024 * 1024) {
      ralatDokumen.value = `${fail.name} melebihi had 20 MB.`;
      return false;
    }
    return true;
  });
  dokumen.value.push(...sah);
  event.target.value = '';
};

const buangDokumen = index => dokumen.value.splice(index, 1);

const muatRujukan = async () => {
  try {
    const [responsKategori, responsAhli, responsAcara] = await Promise.all([
      api.get('/admin/kewangan/kategori'),
      api.get('/admin/semua-ahli'),
      api.get('/admin/kewangan/acara-khas'),
    ]);
    kategori.value = responsKategori.data.data || [];
    senaraiAhli.value = responsAhli.data.data || [];
    senaraiAcara.value = responsAcara.data.data || [];
    if (!form.value.kategori && kategoriPendapatan.value.length) form.value.kategori = kategoriPendapatan.value[0].kod;
  } catch (error) {
    toast.ralat(error.response?.data?.message || 'Gagal memuatkan pilihan borang pendapatan.');
  }
};

const muatRekod = async () => {
  memuatRekod.value = true;
  try {
    const params = new URLSearchParams({ jenis: 'MASUK', tahun: String(tahunPilihan.value), page: String(halaman.value), limit: String(PAD_LIMIT) });
    if (kategoriPilihan.value) params.set('kategori', kategoriPilihan.value);
    if (carian.value.trim()) params.set('cari', carian.value.trim());
    const { data } = await api.get(`/admin/kewangan/transaksi?${params.toString()}`);
    if (data.success) {
      rekod.value = data.data || [];
      meta.value = data.meta || { total: 0, page: 1, limit: PAD_LIMIT };
    }
    const { data: statistik } = await api.get(`/admin/kewangan/statistik?tahun=${tahunPilihan.value}`);
    jumlahPendapatan.value = statistik.success ? statistik.data.jumlah_masuk : 0;
  } catch (error) {
    toast.ralat(error.response?.data?.message || 'Gagal memuatkan rekod pendapatan.');
  } finally {
    memuatRekod.value = false;
  }
};

const tukarPenapis = () => { halaman.value = 1; muatRekod(); };
const jadualCarian = () => { clearTimeout(carianTimer); carianTimer = setTimeout(tukarPenapis, 350); };
const ubahHalaman = nilai => { halaman.value = nilai; muatRekod(); };

const simpanPendapatan = async () => {
  const amaun = Number(form.value.amaun);
  if (!amaun || amaun <= 0) return toast.amaran('Sila masukkan amaun pendapatan yang sah.');
  if (!form.value.tarikh) return toast.amaran('Sila pilih tarikh penerimaan.');
  if (!form.value.kategori) return toast.amaran('Sila pilih kategori pendapatan.');
  if (sumberAhli.value && !form.value.no_kp_pihak) return toast.amaran('Sila pilih ahli yang membuat bayaran.');

  menyimpan.value = true;
  try {
    const dataBorang = new FormData();
    dataBorang.append('jenis', 'MASUK');
    dataBorang.append('kategori', form.value.kategori);
    dataBorang.append('amaun', String(amaun));
    dataBorang.append('tarikh', form.value.tarikh);
    if (form.value.no_kp_pihak) dataBorang.append('no_kp_pihak', form.value.no_kp_pihak);
    if (form.value.penerima_bayaran) dataBorang.append('penerima_bayaran', form.value.penerima_bayaran);
    if (form.value.acara_khas_id) dataBorang.append('acara_khas_id', String(form.value.acara_khas_id));
    if (form.value.rujukan) dataBorang.append('rujukan', form.value.rujukan);
    if (form.value.nota) dataBorang.append('nota', form.value.nota);
    dokumen.value.forEach(fail => dataBorang.append('dokumen', fail));

    const { data } = await api.post('/admin/kewangan/rekod', dataBorang);
    if (data.success) {
      toast.sukses('Rekod pendapatan berjaya disimpan.');
      const kategoriSediaAda = form.value.kategori;
      const tahunRekod = Number(form.value.tarikh.slice(0, 4));
      form.value = { ...borangKosong(), kategori: kategoriSediaAda };
      sumberAhli.value = false;
      dokumen.value = [];
      ralatDokumen.value = '';
      tahunPilihan.value = tahunRekod;
      halaman.value = 1;
      await muatRekod();
    }
  } catch (error) {
    toast.ralat(error.response?.data?.message || 'Gagal menyimpan rekod pendapatan.');
  } finally {
    menyimpan.value = false;
  }
};

onMounted(async () => {
  await muatRujukan();
  await muatRekod();
});

onBeforeUnmount(() => clearTimeout(carianTimer));
</script>

<style scoped>
@reference "tailwindcss";

.field-label {
  @apply mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500;
}

.field-input {
  @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-900 outline-none transition-colors focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10;
}
</style>
