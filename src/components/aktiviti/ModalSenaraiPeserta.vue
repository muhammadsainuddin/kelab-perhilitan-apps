
<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-stretch md:items-center justify-center md:p-6">
      <div class="bg-white w-full md:max-w-5xl md:rounded-2xl shadow-2xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Senarai Pendaftar</p>
            <h3 class="text-lg font-black text-gray-900">{{ namaAcara }}</h3>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="senarai.length > 0" @click="cetak"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Cetak
            </button>
            <button @click="emit('tutup')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">✕</button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <div v-if="senarai.length === 0" class="text-center py-12 text-gray-400 italic">Belum ada penyertaan ahli direkodkan.</div>
          <div v-else class="overflow-x-auto border border-gray-100 rounded-xl">
            <table class="min-w-full text-left text-xs divide-y divide-gray-100">
              <thead class="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="px-4 py-3">No.</th>
                  <th class="px-4 py-3">Nama Penuh</th>
                  <th class="px-4 py-3">No. KP</th>
                  <th class="px-4 py-3 text-center">Umur</th>
                  <th class="px-4 py-3">Gred SSPA</th>
                  <th class="px-4 py-3">Penempatan / PTJ</th>
                  <th class="px-4 py-3 text-center">Saiz</th>
                  <th class="px-4 py-3">Sukan Dipilih</th>
                  <th class="px-4 py-3">Tarikh Daftar</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(p, idx) in senarai" :key="p.id" class="hover:bg-gray-50/50">
                  <td class="px-4 py-3 text-gray-400 font-bold">{{ idx + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="font-semibold text-gray-800">{{ p.nama_pegawai }}</div>
                    <div class="text-[10px] text-gray-400 mt-0.5">
                      {{ p.no_ahli ? 'Ahli: ' + p.no_ahli : 'Bukan Ahli' }}
                    </div>
                  </td>
                  <td class="px-4 py-3 font-mono text-gray-700 tracking-wide">{{ p.no_kp }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="font-bold text-gray-700">{{ hitungUmur(p.no_kp) }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="font-semibold text-gray-700 px-2 py-0.5 bg-gray-100 rounded-md">{{ p.gred_sspa || '—' }}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ p.penempatan || '—' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="font-bold text-gray-700 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">{{ p.saiz_baju || '—' }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="sukan in safeArr(p.sukan_dipilih)" :key="sukan"
                        class="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded text-[10px]">
                        {{ sukan }}
                      </span>
                      <span v-if="safeArr(p.sukan_dipilih).length === 0" class="text-gray-400 italic">Umum / Semua</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-400">{{ formatTarikh(p.tarikh_daftar) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Ringkasan kaki jadual -->
          <div v-if="senarai.length > 0" class="mt-3 text-xs text-gray-500 font-medium">
            Jumlah: <span class="font-black text-gray-900">{{ senarai.length }}</span> pendaftar
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  namaAcara: { type: String, default: '' },
  senarai: { type: Array, default: () => [] }
});

const emit = defineEmits(['tutup']);

const safeArr = (v) => {
  if (!v) return [];
  try { return Array.isArray(v) ? v : JSON.parse(v); } catch { return []; }
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

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
  return (isNaN(umur) || umur < 0 || umur > 120) ? '—' : umur + ' thn';
};

const cetak = () => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const rows = props.senarai.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${p.nama_pegawai}</strong><br><small style="color:#888">${p.no_ahli ? 'Ahli: ' + p.no_ahli : 'Bukan Ahli'}</small></td>
      <td style="font-family:monospace">${p.no_kp}</td>
      <td style="text-align:center">${hitungUmur(p.no_kp)}</td>
      <td style="text-align:center">${p.gred_sspa || '—'}</td>
      <td>${p.penempatan || '—'}</td>
      <td style="text-align:center"><strong>${p.saiz_baju || '—'}</strong></td>
      <td>${safeArr(p.sukan_dipilih).join(', ') || 'Umum'}</td>
      <td>${formatTarikh(p.tarikh_daftar)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Senarai Peserta — ${props.namaAcara}</title>
<style>
  @page { margin: 15mm 18mm; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #111; }
  .hdr { text-align: center; border-bottom: 2px solid #0F4C3A; padding-bottom: 10px; margin-bottom: 12px; }
  .hdr h1 { font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: .05em; }
  .hdr h2 { font-size: 11px; margin: 3px 0 0; color: #0F4C3A; text-transform: uppercase; }
  .meta { display:flex; justify-content:space-between; margin-bottom:10px; font-size:10px; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #0F4C3A; color: #fff; }
  th { padding: 6px 7px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing:.04em; }
  td { padding: 5px 7px; border-bottom: 1px solid #eee; vertical-align: top; }
  tr:nth-child(even) { background: #f9fafb; }
  .foot { margin-top: 20px; display:flex; justify-content:space-between; }
  .sign { width: 45%; text-align: center; }
  .sign-line { border-top: 1px solid #000; margin-top: 38px; padding-top: 4px; font-size: 9px; text-transform: uppercase; }
</style></head><body>
<div class="hdr">
  <h1>Kelab Sukan &amp; Rekreasi Perhilitan Malaysia</h1>
  <h2>Senarai Peserta Berdaftar</h2>
</div>
<div class="meta">
  <div><strong>ACARA:</strong> ${props.namaAcara}<br><strong>JUMLAH PESERTA:</strong> ${props.senarai.length} ORANG</div>
  <div style="text-align:right"><strong>DICETAK:</strong> ${tarikhCetak}</div>
</div>
<table>
  <thead><tr>
    <th>No.</th><th>Nama Penuh</th><th>No. KP</th><th>Umur</th><th>Gred</th>
    <th>Penempatan</th><th>Saiz</th><th>Sukan</th><th>Tarikh Daftar</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="foot">
  <div class="sign"><div class="sign-line">Disediakan oleh / Prepared by</div></div>
  <div class="sign"><div class="sign-line">Pengerusi Kelab Sukan &amp; Rekreasi Perhilitan</div></div>
</div>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active > div, .modal-fade-leave-active > div { transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from > div, .modal-fade-leave-to > div { transform: translateY(16px) scale(0.98); }
</style>
