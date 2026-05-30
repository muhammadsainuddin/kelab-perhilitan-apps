<template>
  <div class="space-y-5 pb-4">

    <!-- Tajuk -->
    <div class="reveal px-1" style="--d: 0ms">
      <h2 class="text-xl font-black text-[#08151D] uppercase tracking-wide">Acara &amp; Aktiviti</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Sertai acara rasmi kelab — sukan, jamuan, hari keluarga dan banyak lagi.</p>
    </div>

    <!-- Notis yuran tertunggak -->
    <div v-if="profilDimuatkan && !isPaid" class="reveal bg-[#FEF3C7] border border-[#FBBF24]/40 rounded-[20px] p-4 flex items-start gap-3" style="--d: 60ms">
      <svg class="w-5 h-5 text-[#92660C] shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div>
        <p class="text-xs font-black text-[#92660C]">Akses Pendaftaran Disekat</p>
        <p class="text-[10px] text-[#92660C]/80 mt-0.5 leading-relaxed">Sila jelaskan yuran tahunan dahulu sebelum mendaftar mana-mana acara.</p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-2 text-[10px] font-black text-[#92660C] underline underline-offset-2">Bayar Sekarang →</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-xs text-[#567778] font-medium uppercase tracking-wider">Memuatkan acara...</div>

    <!-- Tiada acara -->
    <div v-else-if="senaraiAcara.length === 0" class="reveal bg-white rounded-[24px] p-10 text-center border border-[#E2E8E8]" style="--d: 80ms">
      <div class="w-14 h-14 rounded-2xl bg-[#567778]/10 flex items-center justify-center mx-auto mb-3">
        <svg class="w-7 h-7 text-[#567778]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <p class="text-xs font-black text-[#567778] uppercase tracking-wider">Tiada Acara Aktif</p>
      <p class="text-[10px] text-[#567778]/70 mt-1">Acara baru akan dipaparkan di sini.</p>
    </div>

    <!-- Senarai acara -->
    <div v-else class="space-y-4">
      <div v-for="(acara, i) in senaraiAcara" :key="acara.id"
           class="reveal bg-white rounded-[24px] overflow-hidden border border-[#E2E8E8] shadow-[0_4px_16px_rgba(8,21,29,0.06)]"
           :style="`--d: ${100 + i * 70}ms`">

        <!-- Poster jika ada -->
        <div v-if="acara.poster" class="w-full h-36 bg-[#0E303D] overflow-hidden">
          <img :src="`http://localhost:5001/uploads/images/${acara.poster}`" class="w-full h-full object-cover" />
        </div>

        <div class="p-5">
          <!-- Jenis + tarikh -->
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span v-if="acara.jenis_acara" class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md"
                  :class="warnaJenis(acara.jenis_acara)">
              {{ acara.jenis_acara }}
            </span>
            <span class="text-[9px] font-black uppercase tracking-wider text-[#87BCB5] bg-[#08151D] px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ formatTarikh(acara.tarikh_acara) }}
            </span>
          </div>

          <h3 class="text-base font-black text-[#08151D] leading-tight">{{ acara.nama_acara }}</h3>
          <p class="text-xs text-[#567778] mt-1.5 leading-relaxed font-medium line-clamp-2">{{ acara.keterangan || 'Tiada butiran tambahan disediakan.' }}</p>

          <!-- Meta info -->
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#567778] font-medium">
            <span class="inline-flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ acara.lokasi || 'Akan dimaklumkan' }}
            </span>
            <span class="inline-flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z"/></svg>
              {{ acara.jumlah_peserta || 0 }} peserta
            </span>
            <span v-if="acara.tarikh_tutup" class="inline-flex items-center gap-1 text-[#92660C]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Tutup {{ formatTarikh(acara.tarikh_tutup) }}
            </span>
          </div>

          <!-- Butang aksi -->
          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <span v-if="acara.sudah_daftar" class="text-[10px] font-black uppercase tracking-wider text-[#0F6E56] bg-[#E1F5EE] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              Telah Mendaftar
            </span>
            <span v-else></span>

            <div class="flex gap-2">
              <button v-if="acara.sudah_daftar" @click="batalDaftar(acara)" :disabled="aksiLoading"
                      class="text-[11px] font-bold text-[#E24B4A] px-3 py-2 rounded-xl hover:bg-[#FCEBEB] transition-all disabled:opacity-50">
                Batal
              </button>
              <button v-else @click="bukaDaftar(acara)" :disabled="!isPaid"
                      class="bg-[#08151D] text-[#87BCB5] disabled:bg-gray-200 disabled:text-gray-400 font-bold text-xs py-2.5 px-5 rounded-xl transition-all active:scale-95 disabled:active:scale-100">
                {{ isPaid ? 'Sertai Sekarang' : 'Yuran Belum Bayar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL PENDAFTARAN (Teleport ke body) -->
    <Teleport to="body">
      <div v-if="modal.show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
          <h3 class="text-sm font-black text-[#08151D] uppercase border-b pb-2">Pengesahan Pendaftaran</h3>
          <p class="text-xs text-[#567778] leading-relaxed">
            Anda ingin mendaftar untuk acara <strong class="text-[#08151D]">{{ modal.acara?.nama_acara }}</strong>.
          </p>

          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase">Kategori (jika berkaitan)</label>
            <input v-model="modal.kategori" type="text" placeholder="Cth: Perseorangan / Beregu / Lelaki"
                   class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#08151D]" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase">Catatan (opsyenal)</label>
            <textarea v-model="modal.catatan" rows="2" placeholder="Sebarang nota tambahan..."
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#08151D] resize-none"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t">
            <button @click="modal.show = false" class="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all">Batal</button>
            <button @click="hantarPendaftaran" :disabled="aksiLoading" class="bg-[#08151D] text-[#87BCB5] text-xs font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
              {{ aksiLoading ? 'Memproses...' : 'Sahkan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

const senaraiAcara = ref([]);
const profil = ref({});
const profilDimuatkan = ref(false);
const loading = ref(true);
const aksiLoading = ref(false);

const modal = ref({ show: false, acara: null, kategori: '', catatan: '' });

const isPaid = computed(() => !!profil.value.is_paid);

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    profilDimuatkan.value = true;
  }
};

const fetchAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/acara/aktif');
    senaraiAcara.value = res.data.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'TBA';

// Warna badge ikut jenis acara (dipadankan secara longgar dari teks bebas)
const warnaJenis = (jenis) => {
  const j = (jenis || '').toLowerCase();
  if (j.includes('sukan') || j.includes('kejohanan') || j.includes('futsal') || j.includes('larian'))
    return 'bg-[#E1F5EE] text-[#0F6E56]';
  if (j.includes('jamuan') || j.includes('raya') || j.includes('makan'))
    return 'bg-[#FEF3C7] text-[#92660C]';
  if (j.includes('keluarga') || j.includes('famili'))
    return 'bg-[#E6F1FB] text-[#0C447C]';
  if (j.includes('mesyuarat') || j.includes('agm') || j.includes('taklimat'))
    return 'bg-[#EEEDFE] text-[#3C3489]';
  return 'bg-[#87BCB5]/20 text-[#0E303D]';
};

const bukaDaftar = (acara) => {
  modal.value = { show: true, acara, kategori: '', catatan: '' };
};

const hantarPendaftaran = async () => {
  aksiLoading.value = true;
  try {
    const res = await api.post('/acara/daftar', {
      acara_id: modal.value.acara.id,
      kategori: modal.value.kategori,
      catatan: modal.value.catatan
    });
    alert(res.data.message || "Pendaftaran berjaya!");
    modal.value.show = false;
    fetchAcara();
  } catch (error) {
    alert(error.response?.data?.message || "Gagal mendaftar acara.");
  } finally {
    aksiLoading.value = false;
  }
};

const batalDaftar = async (acara) => {
  if (!confirm(`Batalkan pendaftaran untuk "${acara.nama_acara}"?`)) return;
  aksiLoading.value = true;
  try {
    const res = await api.delete(`/acara/batal/${acara.id}`);
    alert(res.data.message || "Pendaftaran dibatalkan.");
    fetchAcara();
  } catch (error) {
    alert(error.response?.data?.message || "Gagal membatalkan pendaftaran.");
  } finally {
    aksiLoading.value = false;
  }
};

onMounted(() => {
  fetchProfil();
  fetchAcara();
});
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  animation: revealUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes revealUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>