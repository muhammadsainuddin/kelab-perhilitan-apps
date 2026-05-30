<template>
  <div class="space-y-5 animate-fade-in pb-10">
    
    <div class="px-1">
      <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Kedai Kelab</h2>
      <p class="text-xs text-[#567778] font-medium mt-0.5">Beli koleksi cenderamata eksklusif rasmi Kelab PERHILITAN.</p>
    </div>

    <!-- Notis FPX -->
    <div class="bg-[#0E303D] text-[#87BCB5] rounded-2xl p-4 border border-[#567778]/20 flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-[#08151D] flex items-center justify-center shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      </div>
      <div>
        <h3 class="text-[11px] font-black uppercase tracking-widest text-[#D0D7D7]">Pembayaran FPX Disokong</h3>
        <p class="text-[10px] mt-0.5 leading-relaxed">Pembelian akan direkodkan terus ke dalam sistem transaksi anda secara automatik.</p>
      </div>
    </div>

    <!-- Notis yuran tertunggak -->
    <div v-if="profilDimuatkan && !isAhliAktif" class="bg-rose-50 border border-rose-200 rounded-[20px] p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div>
        <p class="text-xs font-black text-rose-800">Yuran Belum Dijelaskan</p>
        <p class="text-[10px] text-rose-700 mt-0.5 leading-relaxed">
          Sila jelaskan yuran tahunan terlebih dahulu sebelum membuat pembelian di kedai.
        </p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-2 text-[10px] font-black text-rose-700 underline underline-offset-2">
          Pergi ke Yuran →
        </button>
      </div>
    </div>

    <!-- Senarai Produk -->
    <div class="grid grid-cols-2 gap-4">
      <div v-for="item in produk" :key="item.id" class="bg-white rounded-[24px] p-4 shadow-sm border border-gray-200/60 flex flex-col justify-between"
           :class="{ 'opacity-60': profilDimuatkan && !isAhliAktif }">
        
        <div>
          <div class="w-full h-32 bg-gray-50 rounded-2xl mb-3 flex items-center justify-center text-4xl select-none shadow-inner border border-gray-100">
            {{ item.icon }}
          </div>
          <h4 class="font-black text-[#08151D] text-xs px-1 line-clamp-1 uppercase tracking-tight">{{ item.nama }}</h4>
          <p class="text-[9px] font-bold text-[#567778] px-1 mt-1 uppercase">{{ item.desc }}</p>
        </div>
        
        <div class="mt-4">
          <div class="flex justify-between items-center px-1 mb-2.5">
            <span class="text-sm font-mono font-black text-[#08151D]">RM {{ item.harga.toFixed(2) }}</span>
          </div>
          
          <button @click="beliItem(item)" 
                  :disabled="(isProcessing && activeItem === item.id) || (profilDimuatkan && !isAhliAktif)" 
                  class="w-full bg-[#08151D] hover:bg-[#0E303D] text-[#87BCB5] font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isProcessing && activeItem === item.id" class="animate-pulse">Sila Tunggu...</span>
            <span v-else-if="profilDimuatkan && !isAhliAktif">Yuran Belum Bayar</span>
            <template v-else>
              <span>Beli (FPX)</span>
            </template>
          </button>
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
const isProcessing = ref(false);
const activeItem = ref(null);
const profil = ref({});
const profilDimuatkan = ref(false);

// FIX: Guna is_paid — konsisten dengan semua view lain
const isAhliAktif = computed(() => !!profil.value.is_paid);

const produk = ref([
  { id: 1, nama: 'Baju Korporat', desc: 'Kain Dry-Fit Premium', harga: 45.00, icon: '👕' },
  { id: 2, nama: 'Topi SAKOM', desc: 'Sulaman Logo 3D', harga: 25.00, icon: '🧢' },
  { id: 3, nama: 'Sampul Raya 2026', desc: '1 pek (10 keping)', harga: 10.00, icon: '🧧' },
  { id: 4, nama: 'Lanyard & ID', desc: 'Tali Cetakan Premium', harga: 15.00, icon: '🆔' }
]);

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

const beliItem = async (item) => {
  // FIX: Semak status ahli sebelum teruskan pembelian
  if (!isAhliAktif.value) {
    router.push('/dashboard/yuran');
    return;
  }

  if (!confirm(`Teruskan pembelian ${item.nama} berharga RM ${item.harga.toFixed(2)} melalui FPX?`)) return;
  
  isProcessing.value = true;
  activeItem.value = item.id;
  
  try {
    const response = await api.post('/bayaran/cipta-bil', {
      jenis_bayaran: 'KEDAI',
      keterangan: `Pembelian Kedai: ${item.nama}`, 
      amaun: item.harga
    });
    
    if (response.data.success && response.data.bill_url) {
      window.location.href = response.data.bill_url;
    }
  } catch (error) {
    alert(error.response?.data?.message || "Gagal memulakan transaksi. Sila cuba lagi.");
  } finally {
    isProcessing.value = false;
    activeItem.value = null;
  }
};

onMounted(() => {
  fetchProfil();
});
</script>