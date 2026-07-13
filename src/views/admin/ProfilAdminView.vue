<template>
  <div class="max-w-3xl mx-auto space-y-6 font-sans pb-10">

    <!-- HEADER -->
    <div>
      <h2 class="font-bold text-2xl text-gray-900">Profil Pentadbir</h2>
      <p class="text-gray-500 text-sm mt-1">Urus maklumat peribadi, gambar profil, dan keselamatan akaun.</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-24">
      <svg class="animate-spin w-8 h-8 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <template v-else>
      <!-- KAD PROFIL -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0F4C3A] to-[#08151D] flex items-center justify-center text-white font-black text-3xl overflow-hidden shadow-lg">
              <img v-if="profil.gambar" :src="`${apiBase}/uploads/images/${profil.gambar}`" :alt="profil.nama_penuh || 'Foto profil'" class="w-full h-full object-cover"/>
              <span v-else>{{ (profil.nama_penuh || '?').charAt(0) }}</span>
            </div>
            <label class="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <input type="file" accept="image/*" class="hidden" @change="muatNaikGambar"/>
            </label>
          </div>

          <!-- Maklumat -->
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-xl font-black text-gray-900 uppercase">{{ profil.nama_penuh || '—' }}</h3>
            <p class="text-gray-500 text-sm mt-1">{{ profil.nama_majikan || 'Tiada Penempatan' }}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">{{ profil.role || 'Admin' }}</span>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full uppercase">{{ profil.gred_sspa || 'Tiada Gred' }}</span>
              <span :class="['text-[10px] font-bold border px-2.5 py-1 rounded-full uppercase', profil.status_ahli === 'aktif' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                {{ profil.status_ahli || 'tidak aktif' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KEMASKINI MAKLUMAT PERIBADI -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h4 class="font-black text-gray-900 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Maklumat Peribadi
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Nama Penuh</label>
            <input v-model="formProfil.nama_penuh" type="text" placeholder="Nama penuh"
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all"/>
          </div>
          <div>
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">E-mel</label>
            <input v-model="formProfil.email" type="email" placeholder="E-mel rasmi"
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all"/>
          </div>
          <div>
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">No. Telefon</label>
            <input v-model="formProfil.no_tel" type="tel" placeholder="0123456789"
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all"/>
          </div>
          <div>
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Saiz Baju</label>
            <select v-model="formProfil.saiz_baju" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all">
              <option value="">Pilih Saiz</option>
              <option v-for="s in ['XS','S','M','L','XL','XXL','XXXL']" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="sm:col-span-1">
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">No. KP (Tidak boleh ubah)</label>
            <input :value="profil.no_kp" disabled type="text"
              class="w-full bg-gray-100 border border-gray-200 text-gray-400 font-mono rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"/>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="mesejProfil" :class="['mt-4 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border', mesejProfil.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
            {{ mesejProfil.text }}
          </div>
        </Transition>

        <div class="flex justify-end mt-5 pt-4 border-t border-gray-100">
          <button @click="simpanProfil" :disabled="savingProfil" class="flex items-center gap-2 px-6 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-60">
            <span v-if="savingProfil" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ savingProfil ? 'Menyimpan...' : 'Simpan Maklumat' }}
          </button>
        </div>
      </div>

      <!-- TUKAR KATA LALUAN -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h4 class="font-black text-gray-900 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Keselamatan Akaun
        </h4>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Kata Laluan Semasa</label>
            <div class="relative">
              <input v-model="formKatalaluan.lama" :type="tunjukLama ? 'text' : 'password'" placeholder="••••••••"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all pr-10"/>
              <button type="button" @click="tunjukLama = !tunjukLama" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tunjukLama ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/></svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Kata Laluan Baru</label>
              <input v-model="formKatalaluan.baru" :type="tunjukBaru ? 'text' : 'password'" placeholder="Min. 8 aksara"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] transition-all"/>
            </div>
            <div>
              <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Sahkan Kata Laluan Baru</label>
              <input v-model="formKatalaluan.sahkan" :type="tunjukBaru ? 'text' : 'password'" placeholder="Ulang semula"
                :class="['w-full bg-gray-50 border text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all', formKatalaluan.sahkan && formKatalaluan.baru !== formKatalaluan.sahkan ? 'border-rose-400 focus:border-rose-500' : 'border-gray-200 focus:border-[#0F4C3A]']"/>
              <p v-if="formKatalaluan.sahkan && formKatalaluan.baru !== formKatalaluan.sahkan" class="text-[9px] text-rose-500 font-bold mt-1">Tidak sepadan.</p>
            </div>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="mesejKatalaluan" :class="['mt-4 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border', mesejKatalaluan.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
            {{ mesejKatalaluan.text }}
          </div>
        </Transition>

        <div class="flex justify-end mt-5 pt-4 border-t border-gray-100">
          <button @click="tukarKatalaluan" :disabled="savingKatalaluan || !bolehTukar" class="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-50">
            <span v-if="savingKatalaluan" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ savingKatalaluan ? 'Memproses...' : 'Tukar Kata Laluan' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import { useToast } from '../../composables/useToast';

const toast   = useToast();
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const loading = ref(true);
const profil  = ref({});

const formProfil = ref({ nama_penuh: '', email: '', no_tel: '', saiz_baju: '' });
const savingProfil = ref(false);
const mesejProfil  = ref(null);

const formKatalaluan = ref({ lama: '', baru: '', sahkan: '' });
const savingKatalaluan = ref(false);
const mesejKatalaluan  = ref(null);
const tunjukLama = ref(false);
const tunjukBaru = ref(false);

const bolehTukar = computed(() =>
  formKatalaluan.value.lama &&
  formKatalaluan.value.baru.length >= 8 &&
  formKatalaluan.value.baru === formKatalaluan.value.sahkan
);

const muatProfil = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/profil-saya');
    if (data.success) {
      profil.value = data.data;
      formProfil.value = {
        nama_penuh: data.data.nama_penuh || '',
        email:      data.data.email || '',
        no_tel:     data.data.no_tel || '',
        saiz_baju:  data.data.saiz_baju || '',
      };
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const simpanProfil = async () => {
  savingProfil.value = true;
  mesejProfil.value = null;
  try {
    await api.put('/admin/profil-saya', formProfil.value);
    mesejProfil.value = { type: 'success', text: 'Profil berjaya dikemas kini!' };
    await muatProfil();
  } catch (e) {
    mesejProfil.value = { type: 'error', text: e.response?.data?.message || 'Ralat menyimpan profil.' };
  } finally {
    savingProfil.value = false;
    setTimeout(() => { mesejProfil.value = null; }, 4000);
  }
};

const muatNaikGambar = async (e) => {
  const fail = e.target.files[0];
  if (!fail) return;
  const form = new FormData();
  form.append('gambar', fail);
  try {
    await api.put('/user/kemaskini-gambar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.sukses('Gambar profil berjaya dikemas kini.');
    await muatProfil();
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal muat naik gambar.');
  }
};

const tukarKatalaluan = async () => {
  savingKatalaluan.value = true;
  mesejKatalaluan.value = null;
  try {
    await api.put('/admin/tukar-katalaluan', {
      kata_laluan_lama: formKatalaluan.value.lama,
      kata_laluan_baru: formKatalaluan.value.baru,
    });
    mesejKatalaluan.value = { type: 'success', text: 'Kata laluan berjaya ditukar!' };
    formKatalaluan.value = { lama: '', baru: '', sahkan: '' };
  } catch (e) {
    mesejKatalaluan.value = { type: 'error', text: e.response?.data?.message || 'Ralat menukar kata laluan.' };
  } finally {
    savingKatalaluan.value = false;
    setTimeout(() => { mesejKatalaluan.value = null; }, 4000);
  }
};

onMounted(muatProfil);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
