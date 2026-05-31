<template>
  <div class="space-y-4 pb-8 animate-page-in">

    <!-- HEADER -->
    <div class="px-1 pt-1">
      <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Program Kebajikan</p>
      <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Kebajikan &amp; Tabung</h2>
      <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
        Mohon bantuan kebajikan luar jangka khas untuk kakitangan berdaftar.
      </p>
    </div>

    <!-- STATUS KELAYAKAN -->
    <div class="rounded-[20px] p-4 flex items-center justify-between"
      :style="isAhliAktif
        ? 'background: rgba(82,183,136,0.07); border: 1px solid rgba(82,183,136,0.16);'
        : 'background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);'">
      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.18em] mb-1" style="color: #94a3b8;">Status Kelayakan Bantuan</p>
        <h3 class="text-[14px] font-black uppercase" :style="isAhliAktif ? 'color: #1B4332;' : 'color: #dc2626;'">
          {{ isAhliAktif ? 'Layak Memohon' : 'Tidak Layak — Bayar Yuran' }}
        </h3>
      </div>
      <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        :style="isAhliAktif ? 'background: rgba(82,183,136,0.12);' : 'background: rgba(239,68,68,0.1);'">
        <svg v-if="isAhliAktif" class="w-5 h-5" style="color: #2D6A4F;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
    </div>

    <!-- ACCESS BLOCKED -->
    <div v-if="!isAhliAktif"
      class="rounded-[18px] p-4 flex items-start gap-3"
      style="background: #FFF1F2; border: 1px solid rgba(239,68,68,0.2);">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(239,68,68,0.1);">
        <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-[11px] font-black text-rose-800">Akses Disekat</p>
        <p class="text-[10px] text-rose-700 mt-0.5 leading-relaxed">
          Sila jelaskan yuran tahunan terlebih dahulu untuk mendapatkan kelayakan memohon bantuan kebajikan.
        </p>
        <button @click="$router.push('/dashboard/yuran')"
          class="mt-1.5 text-[10px] font-black text-rose-700 underline underline-offset-2">
          Pergi ke Yuran →
        </button>
      </div>
    </div>

    <!-- NEW APPLICATION BUTTON -->
    <button v-if="isAhliAktif" @click="showModal = true"
      class="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
      style="background: #081C15; color: #95D5B2;">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      Permohonan Baru
    </button>

    <!-- HISTORY LIST -->
    <div class="rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #F1F5F9; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #F1F5F9;">
        <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Rekod Permohonan</p>
        <button @click="fetchSejarahBantuan"
          class="text-[9px] font-black uppercase tracking-wide" style="color: #52B788;">
          Muat Semula
        </button>
      </div>

      <div v-if="loadingSejarah" class="py-10 flex items-center justify-center gap-2">
        <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
        <span class="text-[11px] font-medium" style="color: #94a3b8;">Memuatkan rekod...</span>
      </div>

      <div v-else-if="sejarahBantuan.length === 0" class="py-10 text-center">
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada rekod permohonan</p>
      </div>

      <div v-else class="divide-y" style="border-color: #F8FAFC;">
        <div v-for="rekod in sejarahBantuan" :key="rekod.id"
          class="flex items-start gap-3 px-4 py-4">
          <!-- status icon -->
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            :style="rekod.status_permohonan === 'LULUS'
              ? 'background: rgba(82,183,136,0.1);'
              : rekod.status_permohonan === 'DITOLAK'
                ? 'background: rgba(239,68,68,0.1);'
                : 'background: rgba(245,158,11,0.1);'">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              :style="rekod.status_permohonan === 'LULUS' ? 'color: #2D6A4F;' : rekod.status_permohonan === 'DITOLAK' ? 'color: #dc2626;' : 'color: #92400e;'">
              <path stroke-linecap="round" stroke-linejoin="round" v-if="rekod.status_permohonan === 'LULUS'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" v-else d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <!-- info -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-black uppercase leading-tight" style="color: #0F172A;">{{ rekod.jenis_bantuan }}</p>
            <p class="text-[10px] font-medium mt-0.5 leading-snug" style="color: #64748B;">{{ rekod.keterangan }}</p>
            <p class="text-[9px] font-mono mt-1" style="color: #94a3b8;">Dimohon: {{ formatTarikh(rekod.tarikh_mohon) }}</p>
            <div v-if="rekod.dokumen_sokongan && rekod.dokumen_sokongan.length > 0" class="mt-1.5 flex flex-wrap gap-1">
              <a v-for="doc in rekod.dokumen_sokongan" :key="doc"
                :href="`https://kelabperhilitan.msdev.com.my/uploads/documents/${doc}`"
                target="_blank"
                class="text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1"
                style="background: rgba(82,183,136,0.1); color: #1B4332; border: 1px solid rgba(82,183,136,0.2);">
                📎 Dokumen
              </a>
            </div>
          </div>
          <!-- status + amount -->
          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              :style="rekod.status_permohonan === 'LULUS'
                ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                : rekod.status_permohonan === 'DITOLAK'
                  ? 'background: rgba(239,68,68,0.1); color: #dc2626;'
                  : 'background: rgba(245,158,11,0.1); color: #92400e;'">
              {{ rekod.status_permohonan || 'Menunggu' }}
            </span>
            <span v-if="rekod.status_permohonan === 'LULUS' && rekod.amaun_lulus"
              class="text-[12px] font-black tabular-nums" style="color: #1B4332;">
              RM {{ parseFloat(rekod.amaun_lulus).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL PERMOHONAN -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showModal"
          class="fixed inset-0 z-9999 flex items-end justify-center"
          style="background: rgba(8,28,21,0.7); backdrop-filter: blur(8px);"
          @click.self="closeModal">
          <div class="bg-white w-full max-w-md max-h-[92vh] overflow-y-auto"
            style="border-radius: 28px 28px 0 0; box-shadow: 0 -12px 48px rgba(0,0,0,0.15);">
            <div class="flex justify-center pt-3 mb-4 shrink-0">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>
            <div class="px-6">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style="color: #52B788;">Kebajikan Kelab</p>
              <h3 class="text-[17px] font-black mb-4" style="color: #0F172A;">Permohonan Baru</h3>

              <form @submit.prevent="hantarPermohonan" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Kategori Sumbangan *</label>
                  <select v-model="form.jenis_bantuan" required
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                    <option value="" disabled>— Pilih Kategori —</option>
                    <option value="Bencana Alam (Banjir)">Bencana Alam / Banjir</option>
                    <option value="Khairat Kematian">Khairat Kematian (Ahli/Waris)</option>
                    <option value="Kemalangan (Warded)">Kemalangan & Kemasukan Wad</option>
                    <option value="Sumbangan Kelahiran">Sumbangan Cahaya Mata Baru</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Butiran & Tarikh Kejadian *</label>
                  <textarea v-model="form.keterangan" rows="3" required
                    placeholder="Sila berikan ulasan ringkas mengenai kronologi kejadian..."
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none resize-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"></textarea>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Dokumen Sokongan (PDF)</label>
                  <div class="relative w-full rounded-2xl p-4 text-center transition-colors"
                    style="border: 2px dashed #E2E8F0; background: #F8FAFC;">
                    <input type="file" accept="application/pdf" @change="handleFileUpload"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div class="flex flex-col items-center gap-1.5 pointer-events-none">
                      <svg class="w-6 h-6" style="color: #94a3b8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p class="text-[10px] font-bold" style="color: #64748B;">
                        {{ failTerpilih ? failTerpilih.name : 'Lampirkan surat pengesahan / sijil' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div v-if="formMessage.text" class="rounded-2xl p-3 text-[10px] font-bold leading-relaxed"
                  :class="formMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'">
                  {{ formMessage.text }}
                </div>

                <div class="flex gap-3 pb-6 pt-2">
                  <button type="button" @click="closeModal"
                    class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98]"
                    style="background: #F1F5F9; color: #64748B;">
                    Batal
                  </button>
                  <button type="submit" :disabled="submitting"
                    class="flex-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                    style="background: #081C15; color: #95D5B2;">
                    <span v-if="submitting" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                    {{ submitting ? 'Memproses...' : 'Hantar Permohonan' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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

const showModal = ref(false); // State untuk mengawal Modal
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

const closeModal = () => {
  showModal.value = false;
  form.value = { jenis_bantuan: '', keterangan: '' };
  failTerpilih.value = null;
  formMessage.value = { type: '', text: '' };
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

    // Call API untuk simpan data bantuan
    await api.post('/bantuan/mohon', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Alert dipapar untuk beri feedback pantas kemudian tutup modal
    alert('Permohonan kebajikan anda berjaya dihantar ke sistem untuk semakan urusetia.');
    closeModal();
    fetchSejarahBantuan();

  } catch (error) {
    formMessage.value = { 
      type: 'error', 
      text: error.response?.data?.message || 'Ralat semasa memproses penyerahan borang. Sila cuba lagi.' 
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

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.sheet-enter-active { transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div { transform: translateY(100%); }
.sheet-leave-to > div { transform: translateY(100%); }
</style>