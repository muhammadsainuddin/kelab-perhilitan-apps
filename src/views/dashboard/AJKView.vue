<template>
  <div class="space-y-4 pb-6 animate-page-in">

    <!-- HEADER -->
    <div class="flex items-center gap-3 pt-1 px-1">
      <button @click="$router.back()" class="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
        style="background: #F1F5F9; border: 1px solid #E2E8F0;">
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div>
        <h2 class="text-lg font-black" style="color: #0F172A;">Jawatankuasa Kelab</h2>
        <p class="text-[10px] font-bold uppercase tracking-wider" style="color: #52B788;">
          {{ loading ? 'Memuatkan...' : `${senaraiAJK.length} ahli jawatankuasa` }}
        </p>
      </div>
    </div>

    <!-- CARIAN -->
    <div class="relative">
      <input v-model="carian" type="text" placeholder="Cari nama atau jawatan..."
        class="w-full rounded-2xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none transition-all"
        style="background: #F1F5F9; border: 1.5px solid #E2E8F0; color: #0F172A;"
        @focus="e => e.target.style.borderColor='#52B788'"
        @blur="e => e.target.style.borderColor='#E2E8F0'"/>
      <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="rounded-2xl p-4 animate-pulse" style="background: #F1F5F9;">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full" style="background: #E2E8F0;"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 rounded-lg w-3/4" style="background: #E2E8F0;"></div>
            <div class="h-2.5 rounded-lg w-1/2" style="background: #E2E8F0;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SENARAI -->
    <div v-else-if="tertapis.length === 0" class="text-center py-12">
      <p class="text-sm font-bold text-gray-400">Tiada rekod dijumpai.</p>
    </div>

    <div v-else class="space-y-2">
      <template v-for="jawatan in hierarkiDipapar" :key="jawatan">
        <!-- Label jawatan -->
        <div class="flex items-center gap-2 mt-4 mb-1 first:mt-0">
          <span class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            :style="badgeJawatanStyle(jawatan)">{{ jawatan }}</span>
          <div class="flex-1 h-px" style="background: #E2E8F0;"></div>
        </div>

        <!-- Kad ahli -->
        <div v-for="ahli in ahliMengikutJawatan(jawatan)" :key="ahli.nama_pegawai + ahli.jawatan_kelab"
          class="rounded-2xl p-4 transition-all active:scale-[0.98]"
          style="background: #ffffff; border: 1px solid #F1F5F9; box-shadow: 0 1px 6px rgba(0,0,0,0.04);">
          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style="background: #ECFDF5; border: 2px solid #D1FAE5;">
              <img v-if="ahli.gambar" :src="`${apiBase}/uploads/images/${ahli.gambar}`" :alt="ahli.nama_pegawai || 'Foto ahli'" loading="lazy" class="w-full h-full object-cover"/>
              <span v-else class="font-black text-base" style="color: #065F46;">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
            </div>
            <!-- Nama + Penempatan -->
            <div class="flex-1 min-w-0">
              <p class="font-black text-sm uppercase truncate" style="color: #0F172A;">{{ ahli.nama_pegawai || '—' }}</p>
              <p v-if="ahli.penempatan" class="text-[11px] font-medium truncate mt-0.5" style="color: #64748B;">{{ ahli.penempatan }}</p>
            </div>
          </div>

          <!-- Butang hubungi -->
          <div v-if="ahli.no_tel || ahli.email" class="flex flex-wrap gap-2 mt-3">
            <a v-if="ahli.no_tel" :href="`tel:${ahli.no_tel}`"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95"
              style="background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE;">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {{ ahli.no_tel }}
            </a>
            <a v-if="ahli.no_tel" :href="waLink(ahli.no_tel)" target="_blank" rel="noopener"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95"
              style="background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0;">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a v-if="ahli.email" :href="`mailto:${ahli.email}`"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 max-w-full overflow-hidden"
              style="background: #F8FAFC; color: #475569; border: 1px solid #E2E8F0;">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span class="truncate">{{ ahli.email }}</span>
            </a>
          </div>
          <p v-else class="mt-2 text-[11px] italic" style="color: #CBD5E1;">Tiada maklumat hubungan</p>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

const apiBase  = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
const loading  = ref(true);
const senaraiAJK = ref([]);
const carian   = ref('');

const hierarki = ['Yang Dipertua','Naib Yang Dipertua','Setiausaha','Penolong Setiausaha','Bendahari','Penolong Bendahari','Auditor','Ahli Jawatankuasa','Ahli Jawatankuasa Negeri'];

const tertapis = computed(() => {
  const q = carian.value.toLowerCase();
  return senaraiAJK.value.filter(a =>
    !q || (a.nama_pegawai || '').toLowerCase().includes(q) || (a.jawatan_kelab || '').toLowerCase().includes(q)
  );
});

const hierarkiDipapar = computed(() =>
  hierarki.filter(j => tertapis.value.some(a => a.jawatan_kelab === j))
);

const ahliMengikutJawatan = (jawatan) =>
  tertapis.value.filter(a => a.jawatan_kelab === jawatan);

const waLink = (no) => {
  if (!no) return '#';
  const cleaned = (no || '').replace(/\D/g, '');
  const num = cleaned.startsWith('60') ? cleaned : '60' + cleaned.replace(/^0/, '');
  return `https://wa.me/${num}`;
};

const badgeJawatanStyle = (j) => {
  if (j === 'Penaung')           return 'background:#FEF9C3;color:#854D0E;border:1px solid #FDE68A;';
  if (j === 'Yang Dipertua')     return 'background:#F3E8FF;color:#6B21A8;border:1px solid #DDD6FE;';
  if (j === 'Naib Yang Dipertua')return 'background:#EEF2FF;color:#3730A3;border:1px solid #C7D2FE;';
  if (j.includes('Setiausaha'))  return 'background:#E0F2FE;color:#075985;border:1px solid #BAE6FD;';
  if (j.includes('Bendahari'))   return 'background:#FEF3C7;color:#92400E;border:1px solid #FDE68A;';
  if (j === 'Auditor')           return 'background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;';
  return 'background:#ECFDF5;color:#065F46;border:1px solid #A7F3D0;';
};

onMounted(async () => {
  try {
    const { data } = await api.get('/user/senarai-ajk');
    if (data.success) senaraiAJK.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
});
</script>
