<template>
  <div class="space-y-5 animate-fade-in pb-10">
    
    <div class="px-1">
      <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Sukan & Aktiviti</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Sertai program rekreasi dan kejohanan rasmi anjuran kelab.</p>
    </div>

    <div v-if="!profil.is_paid" class="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
      <span class="text-lg mt-0.5">⚠️</span>
      <p class="text-xs text-rose-800 font-medium leading-relaxed">
        <strong>Akses Disekat:</strong> Pendaftaran aktiviti sukan atau acara kelab ditangguhkan sehingga yuran tahunan anda dijelaskan di menu Utama.
      </p>
    </div>

    <div v-if="loading" class="text-center py-10 text-xs text-[#567778]">Memuatkan acara aktif...</div>
    <div v-else-if="senaraiAcara.length === 0" class="bg-white rounded-2xl p-8 text-center border border-gray-200/60">
      <p class="text-xs font-bold text-[#567778] uppercase tracking-wider">Tiada Acara Dibuka</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="acara in senaraiAcara" :key="acara.id" class="bg-white rounded-[24px] overflow-hidden border border-gray-200/60 shadow-sm flex flex-col">
        <div class="p-5 flex-1">
          <span class="text-[9px] font-black uppercase tracking-wider text-[#87BCB5] bg-[#08151D] px-2.5 py-1 rounded-md inline-block mb-3">
            {{ formatTarikh(acara.tarikh_kejohanan || acara.tarikh_mula) }}
          </span>
          <h3 class="text-base font-bold text-[#08151D] leading-tight">{{ acara.nama_pertandingan }}</h3>
          <p class="text-xs text-[#567778] mt-1.5 line-clamp-2 leading-relaxed font-medium">{{ acara.keterangan || 'Tiada butiran tambahan disediakan.' }}</p>
          
          <div class="mt-4 flex items-center gap-2 text-[11px] text-[#567778]">
            <span>📍 {{ acara.lokasi || 'Akan Dimaklumkan' }}</span>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button @click="bukaDaftar(acara)" :disabled="!profil.is_paid"
                  class="bg-[#08151D] text-[#87BCB5] disabled:bg-gray-300 disabled:text-gray-500 font-bold text-xs py-2 px-5 rounded-xl transition-all">
            {{ profil.is_paid ? 'Sertai Sekarang' : 'Yuran Belum Dibayar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="modal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
        <h3 class="text-sm font-black text-[#08151D] uppercase">Pengesahan Pendaftaran</h3>
        <p class="text-xs text-[#567778]">Anda ingin mendaftar untuk acara <strong>{{ modal.acara?.nama_pertandingan }}</strong>.</p>
        
        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase">Kategori Pilihan</label>
          <input v-model="modal.kategori" type="text" placeholder="Cth: Perseorangan / Beregu" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#08151D]" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="modal.show = false" class="text-xs font-bold text-gray-500 px-4 py-2">Batal</button>
          <button @click="hantarPendaftaran" class="bg-[#08151D] text-[#87BCB5] text-xs font-bold px-5 py-2 rounded-xl">Sahkan</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const senaraiAcara = ref([]);
const profil = ref({});
const loading = ref(true);

const modal = ref({ show: false, acara: null, kategori: 'Umum' });

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

const fetchAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/pertandingan');
    if (res.data.success) {
      senaraiAcara.value = res.data.data.filter(a => a.status === 'BUKA');
    }
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

const formatTarikh = (t) => t ? new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';

const bukaDaftar = (acara) => {
  modal.value = { show: true, acara, kategori: 'Umum' };
};

const hantarPendaftaran = async () => {
  try {
    const res = await api.post('/pertandingan/daftar', {
      pertandingan_id: modal.value.acara.id,
      kategori: modal.value.kategori
    });
    alert(res.data.message || "Pendaftaran berjaya direkodkan!");
    modal.value.show = false;
  } catch (error) {
    alert(error.response?.data?.message || "Gagal mendaftar acara.");
  }
};

onMounted(() => {
  fetchProfil();
  fetchAcara();
});
</script>