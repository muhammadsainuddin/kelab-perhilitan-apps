<template>
  <div class="space-y-5 animate-fade-in pb-10">
    
    <div class="px-1">
      <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Kebajikan & Tabung</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Mohon bantuan kebajikan luar jangka khas untuk kakitangan berdaftar.</p>
    </div>

    <!-- Status Kelayakan -->
    <div class="bg-white rounded-[24px] p-4 shadow-sm border border-gray-200/60 flex items-center justify-between">
      <div>
        <p class="text-[8px] font-black text-[#567778] uppercase tracking-wider">Status Kelayakan Bantuan</p>
        <h3 class="text-sm font-black uppercase mt-0.5" :class="isAhliAktif ? 'text-emerald-600' : 'text-rose-600'">
          {{ isAhliAktif ? 'LAYAK MEMOHON' : 'TIDAK LAYAK — SILA BAYAR YURAN' }}
        </h3>
      </div>
      <div class="h-9 w-9 rounded-xl flex items-center justify-center text-sm shadow-inner font-black"
           :class="isAhliAktif ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'">
        {{ isAhliAktif ? '✓' : '✗' }}
      </div>
    </div>

    <!-- Notis jika tidak layak -->
    <div v-if="!isAhliAktif" class="bg-rose-50 border border-rose-200 rounded-[20px] p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div>
        <p class="text-xs font-black text-rose-800">Akses Disekat</p>
        <p class="text-[10px] text-rose-700 mt-0.5 leading-relaxed">
          Sila jelaskan yuran tahunan terlebih dahulu untuk mendapatkan kelayakan memohon bantuan kebajikan.
        </p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-2 text-[10px] font-black text-rose-700 underline underline-offset-2">
          Pergi ke Yuran →
        </button>
      </div>
    </div>

    <!-- Borang Permohonan — hanya papar jika layak -->
    <div v-if="isAhliAktif" class="bg-white rounded-[24px] shadow-sm border border-gray-200/60 p-5 space-y-4">
      <h3 class="text-xs font-black text-[#08151D] uppercase tracking-wider border-b pb-2">Borang Permohonan Baru</h3>
      
      <form @submit.prevent="hantarPermohonan" class="space-y-4">
        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Kategori Sumbangan</label>
          <select v-model="form.jenis_bantuan" required class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D]">
            <option value="" disabled>-- Pilih Kategori --</option>
            <option value="Bencana Alam (Banjir)">Bencana Alam / Banjir</option>
            <option value="Khairat Kematian">Khairat Kematian (Ahli/Waris)</option>
            <option value="Kemalangan (Warded)">Kemalangan & Kemasukan Wad</option>
            <option value="Sumbangan Kelahiran">Sumbangan Cahaya Mata Baru</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Butiran & Tarikh Kejadian</label>
          <textarea v-model="form.keterangan" rows="2" required placeholder="Sila berikan ulasan ringkas mengenai kronologi kejadian..." class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] resize-none"></textarea>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Dokumen Sokongan (PDF Sahaja)</label>
          <div class="relative w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/50 hover:bg-white transition-colors group">
            <input type="file" accept="application/pdf" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <p class="text-[10px] font-bold text-[#567778]">
              {{ failTerpilih ? failTerpilih.name : 'Klik untuk melampirkan surat pengesahan / sijil' }}
            </p>
          </div>
        </div>

        <!-- Mesej ralat/berjaya dalam borang -->
        <div v-if="formMessage.text" class="rounded-xl p-3 text-xs font-bold"
             :class="formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'">
          {{ formMessage.text }}
        </div>

        <button type="submit" :disabled="submitting" class="w-full py-3.5 bg-[#08151D] text-[#87BCB5] font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70">
          {{ submitting ? 'Menghantar...' : 'Hantar Permohonan Bantuan' }}
        </button>
      </form>
    </div>

    <!-- Sejarah Permohonan -->
    <div class="bg-white rounded-[24px] shadow-sm border border-gray-200/60 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 class="text-xs font-black text-[#08151D] uppercase tracking-wider">Rekod Permohonan Sejarah</h3>
        <button @click="fetchSejarahBantuan" class="text-[#87BCB5] hover:text-[#08151D] text-xs font-bold transition-colors">
          Muat Semula
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-if="loadingSejarah" class="text-center py-6 text-xs text-[#567778]">Memuatkan rekod...</div>
        <div v-else-if="sejarahBantuan.length === 0" class="text-center py-6 text-xs text-[#567778]">Tiada rekod bantuan permohonan lama.</div>
        <div v-else v-for="rekod in sejarahBantuan" :key="rekod.id" class="p-4 flex justify-between items-start gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-bold text-[#08151D] text-xs uppercase truncate">{{ rekod.jenis_bantuan }}</p>
            <span class="text-[9px] text-[#567778] block mt-0.5">{{ rekod.keterangan }}</span>
            <span class="text-[9px] text-[#567778] block mt-0.5 font-mono">
              Dimohon: {{ formatTarikh(rekod.tarikh_mohon) }}
            </span>
            <!-- Papar senarai dokumen jika ada -->
            <div v-if="rekod.dokumen_sokongan && rekod.dokumen_sokongan.length > 0" class="mt-1 flex flex-wrap gap-1">
              <a v-for="doc in rekod.dokumen_sokongan" :key="doc"
                 :href="`http://localhost:5001/uploads/documents/${doc}`" 
                 target="_blank"
                 class="text-[8px] font-bold text-[#87BCB5] bg-[#08151D] px-1.5 py-0.5 rounded">
                📎 {{ doc }}
              </a>
            </div>
          </div>
          <span class="text-[8px] font-black uppercase px-2 py-0.5 rounded border shrink-0 mt-0.5"
                :class="rekod.status_permohonan === 'LULUS' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                       : rekod.status_permohonan === 'DITOLAK' ? 'bg-rose-50 text-rose-700 border-rose-100'
                       : 'bg-amber-50 text-amber-700 border-amber-100'">
            {{ rekod.status_permohonan || 'MENUNGGU' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const profil = ref({});
const sejarahBantuan = ref([]);
const submitting = ref(false);
const loadingSejarah = ref(false);

const form = ref({ jenis_bantuan: '', keterangan: '' });
const failTerpilih = ref(null);
const formMessage = ref({ type: '', text: '' });

// FIX: Guna is_paid sahaja — konsisten dengan UtamaView dan dikira oleh backend
const isAhliAktif = computed(() => !!profil.value.is_paid);

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

const fetchSejarahBantuan = async () => {
  loadingSejarah.value = true;
  try {
    const res = await api.get('/bantuan/sejarah');
    sejarahBantuan.value = res.data.data || [];
  } catch (e) { 
    console.error(e); 
  } finally {
    loadingSejarah.value = false;
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    failTerpilih.value = file;
  } else {
    alert("Hanya fail berformat PDF (.pdf) sahaja dibenarkan.");
    e.target.value = '';
    failTerpilih.value = null;
  }
};

const formatTarikh = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

const hantarPermohonan = async () => {
  formMessage.value = { type: '', text: '' };
  submitting.value = true;

  try {
    const uploadData = new FormData();
    uploadData.append('jenis_bantuan', form.value.jenis_bantuan);
    uploadData.append('keterangan', form.value.keterangan);
    if (failTerpilih.value) {
      uploadData.append('dokumen', failTerpilih.value);
    }

    await api.post('/bantuan/mohon', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    formMessage.value = { 
      type: 'success', 
      text: 'Permohonan kebajikan anda berjaya dihantar ke sistem untuk penilaian AJK.' 
    };
    // Reset borang
    form.value = { jenis_bantuan: '', keterangan: '' };
    failTerpilih.value = null;
    fetchSejarahBantuan();
  } catch (error) {
    formMessage.value = { 
      type: 'error', 
      text: error.response?.data?.message || 'Ralat semasa memproses penyerahan borang.' 
    };
  } finally { 
    submitting.value = false; 
  }
};

onMounted(() => {
  fetchProfil();
  fetchSejarahBantuan();
});
</script>