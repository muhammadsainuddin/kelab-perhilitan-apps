<template>
  <div class="space-y-5 pb-4">

    <div class="reveal px-1" style="--d: 0ms">
      <h2 class="text-xl font-black text-[#08151D] uppercase tracking-wide">Acara &amp; Aktiviti</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Sertai acara rasmi kelab — sukan, jamuan, hari keluarga dan banyak lagi.</p>
    </div>

    <div v-if="profilDimuatkan && !isPaid" class="reveal bg-[#FEF3C7] border border-[#FBBF24]/40 rounded-[20px] p-4 flex items-start gap-3" style="--d: 60ms">
      <svg class="w-5 h-5 text-[#92660C] shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div>
        <p class="text-xs font-black text-[#92660C]">Akses Pendaftaran Disekat</p>
        <p class="text-[10px] text-[#92660C]/80 mt-0.5 leading-relaxed">Sila jelaskan yuran tahunan dahulu sebelum mendaftar mana-mana acara.</p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-2 text-[10px] font-black text-[#92660C] underline underline-offset-2">Bayar Sekarang →</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-xs text-[#567778] font-medium uppercase tracking-wider">Memuatkan acara...</div>

    <div v-else-if="senaraiAcara.length === 0" class="reveal bg-white rounded-[24px] p-10 text-center border border-[#E2E8E8]" style="--d: 80ms">
      <div class="w-14 h-14 rounded-2xl bg-[#567778]/10 flex items-center justify-center mx-auto mb-3">
        <svg class="w-7 h-7 text-[#567778]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <p class="text-xs font-black text-[#567778] uppercase tracking-wider">Tiada Acara Aktif</p>
      <p class="text-[10px] text-[#567778]/70 mt-1">Acara baru akan dipaparkan di sini.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="(acara, i) in senaraiAcara" :key="acara.id"
           class="reveal bg-white rounded-[24px] overflow-hidden border border-[#E2E8E8] shadow-[0_4px_16px_rgba(8,21,29,0.06)] flex flex-col group"
           :style="`--d: ${100 + i * 70}ms`">

        <div v-if="acara.poster" @click="bukaGaleri(acara.poster)" class="relative w-full h-40 bg-[#0E303D] overflow-hidden cursor-pointer">
          <img :src="`http://localhost:5001/uploads/images/${dapatkanPosterUtama(acara.poster)}`" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="bg-white/90 text-[#08151D] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              Lihat Gambar ({{ kiraBilanganGambar(acara.poster) }})
            </span>
          </div>

          <div v-if="kiraBilanganGambar(acara.poster) > 1" class="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
             1 / {{ kiraBilanganGambar(acara.poster) }}
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col">
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
          <p class="text-xs text-[#567778] mt-2 leading-relaxed font-medium whitespace-pre-wrap line-clamp-3">{{ acara.keterangan || 'Tiada butiran tambahan disediakan.' }}</p>

          <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#567778] font-medium border-t border-gray-100 pt-3">
            <span class="inline-flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ acara.lokasi || 'Akan dimaklumkan' }}
            </span>
            <span v-if="acara.tarikh_tutup" class="inline-flex items-center gap-1.5 text-[#92660C]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Tutup Pendaftaran: {{ formatTarikh(acara.tarikh_tutup) }}
            </span>
          </div>

          <div class="mt-auto pt-4 flex items-center justify-between gap-3">
            <span v-if="acara.sudah_daftar" class="text-[10px] font-black uppercase tracking-wider text-[#0F6E56] bg-[#E1F5EE] px-3 py-2 rounded-xl inline-flex items-center gap-1 border border-[#0F4C3A]/10">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              Telah Mendaftar
            </span>
            <span v-else></span>

            <div class="flex gap-2">
              <button v-if="acara.sudah_daftar" @click="batalDaftar(acara)" :disabled="aksiLoading"
                      class="text-[11px] font-bold text-[#E24B4A] px-4 py-2.5 rounded-xl hover:bg-[#FCEBEB] transition-all disabled:opacity-50">
                Batal
              </button>
              <button v-else @click="bukaDaftar(acara)" :disabled="!isPaid"
                      class="bg-[#08151D] text-[#87BCB5] disabled:bg-gray-200 disabled:text-gray-400 font-bold text-xs py-2.5 px-6 rounded-xl transition-all active:scale-95 disabled:active:scale-100 shadow-md">
                {{ isPaid ? 'Sertai Acara' : 'Yuran Tertunggak' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalGaleri.show" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
          <button @click="modalGaleri.show = false" class="absolute top-6 right-6 text-white hover:text-rose-500 z-50 p-2 bg-white/10 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          <div class="absolute top-6 left-6 text-white/70 font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
            {{ modalGaleri.currentIndex + 1 }} / {{ modalGaleri.images.length }}
          </div>

          <div class="relative w-full h-full max-w-4xl flex items-center justify-center p-4">
            <button v-if="modalGaleri.images.length > 1" @click="prevGambar" class="absolute left-4 sm:left-10 text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <img :src="`http://localhost:5001/uploads/images/${modalGaleri.images[modalGaleri.currentIndex]}`" 
                 class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all duration-300" />

            <button v-if="modalGaleri.images.length > 1" @click="nextGambar" class="absolute right-4 sm:right-10 text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div v-if="modalGaleri.images.length > 1" class="absolute bottom-10 flex gap-2">
            <button v-for="(img, idx) in modalGaleri.images" :key="idx" @click="modalGaleri.currentIndex = idx"
                    class="w-2.5 h-2.5 rounded-full transition-colors"
                    :class="idx === modalGaleri.currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'"></button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal.show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div class="bg-white rounded-[32px] w-full max-w-sm p-7 shadow-2xl">
            <h3 class="text-base font-black text-[#08151D] uppercase border-b border-gray-100 pb-3 mb-4">Maklumat Pendaftaran</h3>
            
            <p class="text-[11px] text-[#567778] leading-relaxed mb-5">
              Anda sedang mendaftar untuk: <br><strong class="text-[#08151D] text-sm">{{ modal.acara?.nama_acara }}</strong>
            </p>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[10px] text-[#567778] font-bold uppercase tracking-wider block">Acara / Sukan Yang Ingin Disertai *</label>
                <input v-model="modal.kategori" type="text" placeholder="Cth: Bola Sepak, Badminton Beregu, Ping Pong..."
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all" />
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] text-[#567778] font-bold uppercase tracking-wider block">Catatan / Nota Kepada Urusetia</label>
                <textarea v-model="modal.catatan" rows="3" placeholder="Sila beritahu jika anda perlukan maklumat lanjut..."
                          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 resize-none transition-all"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
              <button @click="modal.show = false" class="text-xs font-bold text-gray-500 px-5 py-2.5 hover:bg-gray-100 rounded-xl transition-all">Batal</button>
              <button @click="hantarPendaftaran" :disabled="aksiLoading || !modal.kategori" 
                      class="bg-[#0F4C3A] hover:bg-[#166b52] text-white text-xs font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 shadow-md transition-all">
                {{ aksiLoading ? 'Memproses...' : 'Sahkan & Hantar' }}
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

const senaraiAcara = ref([]);
const profil = ref({});
const profilDimuatkan = ref(false);
const loading = ref(true);
const aksiLoading = ref(false);

const modal = ref({ show: false, acara: null, kategori: '', catatan: '' });
const modalGaleri = ref({ show: false, images: [], currentIndex: 0 });

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

const warnaJenis = (jenis) => {
  const j = (jenis || '').toLowerCase();
  if (j.includes('sukan') || j.includes('kejohanan') || j.includes('futsal') || j.includes('larian'))
    return 'bg-[#E1F5EE] text-[#0F6E56]';
  if (j.includes('jamuan') || j.includes('raya') || j.includes('makan'))
    return 'bg-[#FEF3C7] text-[#92660C]';
  if (j.includes('keluarga') || j.includes('famili') || j.includes('luar'))
    return 'bg-[#E6F1FB] text-[#0C447C]';
  if (j.includes('mesyuarat') || j.includes('agm') || j.includes('taklimat'))
    return 'bg-[#EEEDFE] text-[#3C3489]';
  return 'bg-[#87BCB5]/20 text-[#0E303D]';
};

// ── PENGENDALIAN JSON GAMBAR (Multiple Images) ──
const dapatkanPosterUtama = (posterStr) => {
  if (!posterStr) return null;
  try {
    const arr = JSON.parse(posterStr);
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : posterStr;
  } catch (e) {
    return posterStr;
  }
};

const dapatkanSemuaPoster = (posterStr) => {
  if (!posterStr) return [];
  try {
    const arr = JSON.parse(posterStr);
    return Array.isArray(arr) ? arr : [posterStr];
  } catch (e) {
    return [posterStr];
  }
};

const kiraBilanganGambar = (posterStr) => {
  return dapatkanSemuaPoster(posterStr).length;
};

// ── FUNGSI GALERI SLAID ──
const bukaGaleri = (posterStr) => {
  const images = dapatkanSemuaPoster(posterStr);
  if (images.length > 0) {
    modalGaleri.value = { show: true, images, currentIndex: 0 };
  }
};

const nextGambar = () => {
  if (modalGaleri.value.currentIndex < modalGaleri.value.images.length - 1) {
    modalGaleri.value.currentIndex++;
  } else {
    modalGaleri.value.currentIndex = 0; // Pusing balik ke mula
  }
};

const prevGambar = () => {
  if (modalGaleri.value.currentIndex > 0) {
    modalGaleri.value.currentIndex--;
  } else {
    modalGaleri.value.currentIndex = modalGaleri.value.images.length - 1;
  }
};

// ── PENDAFTARAN ACARA ──
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>