
<template>
  <Teleport to="body">
    <Transition name="slide-in">
      <div v-if="show" class="fixed inset-0 z-[60] bg-[#F8FAFC] flex flex-col overflow-hidden">

        <!-- Top Bar -->
        <div class="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-4">
            <button @click="emit('tutup')"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Panel Ketua Kontinjen Sukan</p>
              <h2 class="text-base font-black text-gray-900 leading-tight">{{ data?.acara?.nama_acara || '...' }}</h2>
            </div>
          </div>

          <!-- Butang cetak + tarikh -->
          <div class="flex items-center gap-3">
            <button v-if="sukanAktifData && !loading" @click="cetakSenaraiSukan"
              class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Cetak Sukan Ini
            </button>
            <button v-if="data && !loading" @click="cetakSemuaSukan"
              class="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Cetak Semua
            </button>
            <span class="text-xs text-gray-400 font-medium hidden sm:block">
              {{ data?.acara?.tarikh_acara ? formatTarikh(data.acara.tarikh_acara) : '' }}
            </span>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-gray-400">
            <div class="w-8 h-8 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin"></div>
            <p class="text-sm font-medium">Memuatkan data kontinjen...</p>
          </div>
        </div>

        <div v-else-if="data" class="flex-1 overflow-y-auto p-6 space-y-6">

          <!-- ── RINGKASAN ATAS ── -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="bg-[#0F4C3A] text-white rounded-2xl px-5 py-4 shadow-sm">
              <p class="text-[10px] font-bold uppercase tracking-wider opacity-60">Jumlah Peserta</p>
              <p class="text-3xl font-black mt-1">{{ data.ringkasan.jumlah_peserta }}</p>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pegawai</p>
              <p class="text-3xl font-black text-gray-900 mt-1">{{ data.ringkasan.pegawai }}</p>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sokongan</p>
              <p class="text-3xl font-black text-gray-900 mt-1">{{ data.ringkasan.sokongan }}</p>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 shadow-sm">
              <p class="text-[10px] font-bold uppercase tracking-wider text-amber-600">Bil. Sukan</p>
              <p class="text-3xl font-black text-amber-700 mt-1">{{ data.per_sukan.length }}</p>
            </div>
          </div>

          <!-- ── RINGKASAN PER SUKAN + SAIZ BAJU ── -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <!-- Jadual Per Sukan (klik untuk tukar tab) -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100">
                <h3 class="text-sm font-black text-gray-900">Ringkasan Per Sukan</h3>
              </div>
              <table class="min-w-full text-sm divide-y divide-gray-100">
                <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th class="px-4 py-3 text-left">Acara / Sukan</th>
                    <th class="px-4 py-3 text-center">Peserta</th>
                    <th class="px-4 py-3 text-center">Pegawai</th>
                    <th class="px-4 py-3 text-center">Sokongan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="s in data.per_sukan" :key="s.sukan"
                    @click="sukanAktif = s.sukan"
                    :class="sukanAktif === s.sukan ? 'bg-amber-50' : 'hover:bg-gray-50/60 cursor-pointer'"
                    class="transition-colors">
                    <td class="px-4 py-3 font-semibold text-gray-800">
                      <div class="flex items-center gap-2">
                        <span v-if="sukanAktif === s.sukan" class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        {{ s.sukan }}
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center font-black text-gray-900">{{ s.jumlah }}</td>
                    <td class="px-4 py-3 text-center text-[#0F4C3A] font-bold">{{ s.pegawai }}</td>
                    <td class="px-4 py-3 text-center text-indigo-600 font-bold">{{ s.sokongan }}</td>
                  </tr>
                  <tr class="bg-gray-50 font-black text-gray-700 text-xs uppercase">
                    <td class="px-4 py-3">JUMLAH</td>
                    <td class="px-4 py-3 text-center">{{ data.ringkasan.jumlah_peserta }}</td>
                    <td class="px-4 py-3 text-center text-[#0F4C3A]">{{ data.ringkasan.pegawai }}</td>
                    <td class="px-4 py-3 text-center text-indigo-600">{{ data.ringkasan.sokongan }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Statistik Saiz Baju -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100">
                <h3 class="text-sm font-black text-gray-900">Saiz Baju / Jersi</h3>
              </div>
              <div class="p-4 space-y-1.5">
                <div v-for="s in data.statistik_saiz" :key="s.saiz" class="flex items-center gap-3">
                  <span class="w-12 text-[11px] font-black text-gray-600 uppercase">{{ s.saiz }}</span>
                  <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div class="h-2 rounded-full bg-[#0F4C3A] transition-all duration-500"
                      :style="`width: ${data.ringkasan.jumlah_peserta > 0 ? (s.bilangan / data.ringkasan.jumlah_peserta * 100).toFixed(1) : 0}%`">
                    </div>
                  </div>
                  <span class="w-8 text-right text-[11px] font-black text-gray-700">{{ s.bilangan }}</span>
                </div>
                <div class="pt-2 border-t border-gray-100 flex justify-between text-[11px] font-black text-gray-600 uppercase mt-2">
                  <span>JUMLAH</span>
                  <span>{{ data.statistik_saiz.reduce((t, s) => t + s.bilangan, 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── SENARAI DETAIL PESERTA PER SUKAN ── -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <!-- Tab sukan -->
            <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
              <button v-for="s in data.per_sukan" :key="s.sukan"
                @click="sukanAktif = s.sukan"
                :class="sukanAktif === s.sukan ? 'bg-[#0F4C3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                class="shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
                {{ s.sukan }}
                <span class="ml-1 opacity-70">{{ s.jumlah }}</span>
              </button>
            </div>

            <!-- Header tab aktif -->
            <div v-if="sukanAktifData" class="px-5 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
              <div class="text-sm font-black text-gray-800">
                {{ sukanAktifData.sukan }}
                <span class="text-xs font-semibold text-gray-400 ml-2">{{ sukanAktifData.jumlah }} peserta</span>
              </div>
              <div class="flex gap-3 text-xs font-bold">
                <span class="text-[#0F4C3A]">Pegawai: {{ sukanAktifData.pegawai }}</span>
                <span class="text-indigo-600">Sokongan: {{ sukanAktifData.sokongan }}</span>
              </div>
            </div>

            <!-- ── JADUAL DETAIL PESERTA (Maklumat Lengkap Ketua Kontinjen) ── -->
            <div v-if="sukanAktifData" class="overflow-x-auto">
              <table class="min-w-full text-xs divide-y divide-gray-100">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th class="px-4 py-3 text-left w-8">#</th>
                    <th class="px-4 py-3 text-left">Nama Penuh</th>
                    <th class="px-4 py-3 text-left">No. KP</th>
                    <th class="px-4 py-3 text-center">Umur</th>
                    <th class="px-4 py-3 text-left">Gred SSPA</th>
                    <th class="px-4 py-3 text-left">Kategori</th>
                    <th class="px-4 py-3 text-left">Penempatan Kerja</th>
                    <th class="px-4 py-3 text-center">Saiz Baju</th>
                    <th class="px-4 py-3 text-left">No. Jersi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(p, idx) in sukanAktifData.peserta" :key="p.penyertaan_id" class="hover:bg-gray-50/60">

                    <td class="px-4 py-3 text-gray-400 font-bold">{{ idx + 1 }}</td>

                    <!-- Nama + No Ahli -->
                    <td class="px-4 py-3">
                      <div class="font-semibold text-gray-800 leading-snug">{{ p.nama_pegawai }}</div>
                      <div class="text-[10px] text-gray-400 mt-0.5">
                        {{ p.no_ahli !== '—' ? 'Ahli: ' + p.no_ahli : 'Bukan Ahli' }}
                      </div>
                    </td>

                    <!-- No KP -->
                    <td class="px-4 py-3 font-mono text-gray-700 tracking-wide text-[11px]">{{ p.no_kp }}</td>

                    <!-- Umur -->
                    <td class="px-4 py-3 text-center">
                      <span class="font-black text-gray-800">{{ hitungUmur(p.no_kp) }}</span>
                      <span class="text-gray-400 text-[9px]"> thn</span>
                    </td>

                    <!-- Gred SSPA -->
                    <td class="px-4 py-3">
                      <span class="font-bold text-gray-700 px-2 py-0.5 bg-gray-100 rounded-md">{{ p.gred }}</span>
                    </td>

                    <!-- Kategori -->
                    <td class="px-4 py-3">
                      <span :class="p.kategori === 'pegawai'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'"
                        class="px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase">
                        {{ p.kategori === 'pegawai' ? 'Pegawai' : 'Sokongan' }}
                      </span>
                    </td>

                    <!-- Penempatan -->
                    <td class="px-4 py-3 text-gray-600 max-w-[200px]">{{ p.penempatan }}</td>

                    <!-- Saiz Baju -->
                    <td class="px-4 py-3 text-center">
                      <span class="font-bold text-gray-700 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-md">
                        {{ p.saiz_baju }}
                      </span>
                    </td>

                    <!-- No Jersi (Boleh edit & simpan) -->
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-1.5">
                        <input
                          :value="jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                          @input="jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`] = $event.target.value"
                          type="text" placeholder="—"
                          class="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                        <button
                          @click="simpanJersi(p.penyertaan_id, sukanAktifData.sukan, jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`])"
                          :disabled="jersiLoading[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                          class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0F4C3A] text-white hover:bg-[#0c3d2e] transition-colors disabled:opacity-50"
                          title="Simpan">
                          <span v-if="jersiLoading[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                            class="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin"></span>
                          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="p-10 text-center text-gray-400 italic text-sm">Tiada sukan dipilih.</div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({
  show: Boolean,
  acaraId: { type: Number, default: null }
});

const emit = defineEmits(['tutup']);

const loading = ref(false);
const data = ref(null);
const sukanAktif = ref(null);
const jersiSimpan = ref({});
const jersiLoading = ref({});

// Muat data analisis bila panel dibuka
watch(() => props.show, async (val) => {
  if (!val || !props.acaraId) return;
  loading.value = true;
  data.value = null;
  jersiSimpan.value = {};
  jersiLoading.value = {};
  try {
    const res = await api.get(`/acara/admin/analisis/${props.acaraId}`);
    if (res.data.success) {
      data.value = res.data.data;
      sukanAktif.value = res.data.data.per_sukan?.[0]?.sukan ?? null;
      res.data.data.per_sukan.forEach(s => {
        s.peserta.forEach(p => {
          jersiSimpan.value[`${p.penyertaan_id}_${s.sukan}`] = p.no_jersi || '';
        });
      });
    }
  } catch {
    alert('Gagal memuatkan data analisis kontinjen.');
    emit('tutup');
  } finally {
    loading.value = false;
  }
});

const sukanAktifData = computed(() =>
  data.value?.per_sukan.find(s => s.sukan === sukanAktif.value) || null
);

// Kira umur dari No. KP Malaysia (format: YYMMDD-PP-XXXX)
const hitungUmur = (no_kp) => {
  if (!no_kp) return '—';
  const clean = no_kp.replace(/-/g, '');
  if (clean.length < 6) return '—';
  const yy = parseInt(clean.substring(0, 2));
  const mm = parseInt(clean.substring(2, 4));
  const dd = parseInt(clean.substring(4, 6));
  const tahunSemasa2D = new Date().getFullYear() % 100;
  const tahun = yy <= tahunSemasa2D ? 2000 + yy : 1900 + yy;
  const lahir = new Date(tahun, mm - 1, dd);
  const today = new Date();
  let umur = today.getFullYear() - lahir.getFullYear();
  if (today.getMonth() < lahir.getMonth() ||
    (today.getMonth() === lahir.getMonth() && today.getDate() < lahir.getDate())) {
    umur--;
  }
  return (isNaN(umur) || umur < 0 || umur > 120) ? '—' : umur;
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
  : '—';

// Simpan nombor jersi ke server
const simpanJersi = async (penyertaan_id, sukan, nilai) => {
  const key = `${penyertaan_id}_${sukan}`;
  jersiLoading.value[key] = true;
  try {
    await api.put('/acara/admin/jersi', { penyertaan_id, sukan, no_jersi: nilai });
    const blok = data.value.per_sukan.find(s => s.sukan === sukan);
    if (blok) {
      const p = blok.peserta.find(p => p.penyertaan_id === penyertaan_id);
      if (p) p.no_jersi = nilai;
    }
  } catch {
    alert('Gagal menyimpan nombor jersi.');
  } finally {
    jersiLoading.value[key] = false;
  }
};

// ── FUNGSI CETAK ──

const buatHtmlCetak = (tajuk, senaraiBaris, perihalRingkas) => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const namaAcara = data.value?.acara?.nama_acara || '';
  const tarikhAcara = data.value?.acara?.tarikh_acara ? formatTarikh(data.value.acara.tarikh_acara) : '—';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Senarai Peserta Kontinjen — ${namaAcara}</title>
<style>
  @page { margin: 15mm 18mm; size: A4 landscape; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #111; }
  .hdr { text-align: center; border-bottom: 3px solid #0F4C3A; padding-bottom: 10px; margin-bottom: 12px; }
  .hdr h1 { font-size: 14px; margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: #0F4C3A; }
  .hdr h2 { font-size: 11px; margin: 3px 0 0; font-weight: bold; text-transform: uppercase; letter-spacing: .05em; }
  .hdr h3 { font-size: 13px; margin: 6px 0 0; font-weight: 900; text-transform: uppercase; color: #333; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 9.5px; background: #f9fafb; padding: 8px 10px; border-radius: 6px; }
  .meta-kiri p, .meta-kanan p { margin: 2px 0; }
  .lbl { color: #666; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  thead { background: #0F4C3A; color: #fff; }
  th { padding: 6px 8px; text-align: left; font-size: 8.5px; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
  td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
  tr:nth-child(even) td { background: #f9fafb; }
  .badge { display: inline-block; padding: 1px 5px; border-radius: 4px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
  .b-peg { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
  .b-sok { background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe; }
  .b-saiz { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; font-weight: 900; }
  .ringkasan { margin-top: 8px; font-size: 9px; font-weight: bold; color: #555; border-top: 1px solid #e5e7eb; padding-top: 6px; }
  .foot { margin-top: 24px; display: flex; justify-content: space-between; gap: 20px; }
  .sign { flex: 1; text-align: center; }
  .sign-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; font-size: 9px; text-transform: uppercase; font-weight: bold; }
  .sign-sub { font-size: 8px; color: #666; margin-top: 2px; }
  .seksyen-hdr { background: #1a5c47; color: white; font-size: 11px; font-weight: 900; padding: 8px 12px; margin-top: 20px; margin-bottom: 0; border-radius: 4px 4px 0 0; letter-spacing: .04em; text-transform: uppercase; }
</style></head><body>
<div class="hdr">
  <h1>Kelab Sukan &amp; Rekreasi Perhilitan Malaysia</h1>
  <h2>Senarai Peserta Kontinjen Sukan</h2>
  <h3>${namaAcara}</h3>
</div>
<div class="meta">
  <div class="meta-kiri">
    <p><span class="lbl">Tarikh Acara:</span> <strong>${tarikhAcara}</strong></p>
    <p><span class="lbl">Sukan:</span> <strong>${tajuk}</strong></p>
  </div>
  <div class="meta-kanan">
    <p><span class="lbl">Dicetak:</span> <strong>${tarikhCetak}</strong></p>
    <p>${perihalRingkas}</p>
  </div>
</div>
${senaraiBaris}
<div class="foot">
  <div class="sign">
    <div class="sign-line">Ketua Kontinjen</div>
    <div class="sign-sub">Nama &amp; Tarikh</div>
  </div>
  <div class="sign">
    <div class="sign-line">Disemak oleh</div>
    <div class="sign-sub">Setiausaha Kelab</div>
  </div>
  <div class="sign">
    <div class="sign-line">Pengerusi Kelab Sukan &amp; Rekreasi Perhilitan</div>
    <div class="sign-sub">Nama &amp; Tarikh</div>
  </div>
</div>
</body></html>`;
};

const jadualHtml = (peserta, namaS) => {
  const rows = peserta.map((p, i) => {
    const badgeKls = p.kategori === 'pegawai' ? 'b-peg' : 'b-sok';
    const kategoriLabel = p.kategori === 'pegawai' ? 'Pegawai' : 'Sokongan';
    const umur = hitungUmur(p.no_kp);
    const jersi = jersiSimpan.value[`${p.penyertaan_id}_${namaS}`] || '—';
    return `<tr>
      <td style="text-align:center;color:#888;font-weight:bold">${i + 1}</td>
      <td><strong>${p.nama_pegawai}</strong></td>
      <td style="font-family:monospace;font-size:9.5px">${p.no_kp}</td>
      <td style="text-align:center;font-weight:900">${umur}</td>
      <td style="text-align:center"><strong>${p.gred}</strong></td>
      <td style="text-align:center"><span class="badge ${badgeKls}">${kategoriLabel}</span></td>
      <td>${p.penempatan}</td>
      <td style="text-align:center"><span class="badge b-saiz">${p.saiz_baju}</span></td>
      <td style="text-align:center;font-weight:900;font-size:12px">${jersi}</td>
    </tr>`;
  }).join('');

  return `<table>
    <thead><tr>
      <th style="width:30px;text-align:center">No.</th>
      <th>Nama Penuh</th>
      <th>No. Kad Pengenalan</th>
      <th style="text-align:center">Umur</th>
      <th style="text-align:center">Gred SSPA</th>
      <th style="text-align:center">Kategori</th>
      <th>Penempatan Kerja</th>
      <th style="text-align:center">Saiz Baju</th>
      <th style="text-align:center">No. Jersi</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
};

// Cetak sukan yang sedang aktif sahaja
const cetakSenaraiSukan = () => {
  if (!sukanAktifData.value) return;
  const s = sukanAktifData.value;
  const ringkasan = `<span class="lbl">Peserta:</span> <strong>${s.jumlah}</strong> &nbsp;|&nbsp; Pegawai: <strong>${s.pegawai}</strong> &nbsp;|&nbsp; Sokongan: <strong>${s.sokongan}</strong>`;
  const kandungan = jadualHtml(s.peserta, s.sukan);
  const html = buatHtmlCetak(s.sukan, kandungan, ringkasan);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};

// Cetak semua sukan dalam satu dokumen
const cetakSemuaSukan = () => {
  if (!data.value) return;
  const jumlah = data.value.ringkasan.jumlah_peserta;
  const ringkasan = `<span class="lbl">Jumlah:</span> <strong>${jumlah} peserta</strong> &nbsp;|&nbsp; Pegawai: <strong>${data.value.ringkasan.pegawai}</strong> &nbsp;|&nbsp; Sokongan: <strong>${data.value.ringkasan.sokongan}</strong>`;

  let kandunganSemua = '';
  data.value.per_sukan.forEach(s => {
    kandunganSemua += `<div class="seksyen-hdr">${s.sukan} &mdash; ${s.jumlah} Peserta (Pegawai: ${s.pegawai} | Sokongan: ${s.sokongan})</div>`;
    kandunganSemua += jadualHtml(s.peserta, s.sukan);
    kandunganSemua += `<div class="ringkasan">Jumlah ${s.sukan}: ${s.jumlah} peserta</div>`;
  });

  const html = buatHtmlCetak('Semua Sukan', kandunganSemua, ringkasan);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};
</script>

<style scoped>
.slide-in-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-in-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateX(40px); }
</style>
