<template>
  <div class="space-y-6 font-sans text-gray-900">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-2xl text-gray-900">Pengurusan Ahli</h2>
        <p class="text-gray-500 text-sm mt-1">Urus data, status, peranan, dan maklumat potongan ahli kelab.</p>
      </div>
      <div class="flex gap-2">
        <button @click="eksportCSV"
          class="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-all border border-gray-300 shadow-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Eksport CSV
        </button>
        <button @click="bukaModalDaftar"
          class="flex items-center gap-2 text-sm bg-[#0F4C3A] hover:bg-[#155d47] text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Daftar Ahli
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="relative lg:col-span-1">
          <input v-model="carian" type="text" placeholder="Cari Nama, No. KP, No. Ahli..."
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <select v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="tidak aktif">Tidak Aktif</option>
        </select>

        <select v-model="filterPenempatan" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
          <option value="">Semua Penempatan (PTJ)</option>
          <option v-for="ptj in senaraiPenempatan" :key="ptj" :value="ptj">{{ ptj }}</option>
        </select>

        <select v-model="filterGred" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
          <option value="">Semua Gred SSPA</option>
          <option v-for="gred in senaraiGred" :key="gred" :value="gred">{{ gred }}</option>
        </select>

        <select v-model="filterPotongan" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
          <option value="">Semua Jenis Potongan</option>
          <option v-for="potongan in senaraiPotongan" :key="potongan" :value="potongan">{{ potongan }}</option>
        </select>
      </div>
    </div>

    <p class="text-gray-500 text-sm">
      Menunjukkan <span class="text-gray-900 font-bold">{{ ahliTertapis.length }}</span> daripada
      <span class="text-gray-900 font-bold">{{ semuaAhli.length }}</span> rekod
    </p>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-5 py-4 font-bold">Nama Ahli</th>
              <th class="px-4 py-4 font-bold hidden md:table-cell">No. Ahli</th>
              <th class="px-4 py-4 font-bold hidden lg:table-cell">Penempatan</th>
              <th class="px-4 py-4 font-bold hidden sm:table-cell">Potongan / Gred</th>
              <th class="text-center px-4 py-4 font-bold">Status</th>
              <th class="text-center px-4 py-4 font-bold">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="6" class="px-5 py-12 text-center">
                <div class="flex items-center justify-center gap-2 text-gray-500">
                  <svg class="animate-spin w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Memuatkan data ahli...
                </div>
              </td>
            </tr>
            <tr v-else-if="ahliTertapis.length === 0">
              <td colspan="6" class="px-5 py-16 text-center text-gray-500 font-medium">Tiada rekod dijumpai berdasarkan carian/tapisan anda.</td>
            </tr>
            <tr v-for="ahli in ahliTerpapar" :key="ahli.no_kp" class="hover:bg-gray-50 transition-colors">
              
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                    <span class="text-emerald-700 text-xs font-bold">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="text-gray-900 font-bold text-sm">{{ ahli.nama_pegawai || '—' }}</p>
                    <p class="text-gray-500 text-[11px] font-mono mt-0.5">{{ ahli.no_kp }}</p>
                  </div>
                </div>
              </td>
              
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="text-gray-700 font-mono font-medium text-xs bg-gray-100 px-2 py-1 rounded">{{ ahli.no_ahli || 'BELUM JANA' }}</span>
              </td>
              
              <td class="px-4 py-3 hidden lg:table-cell">
                <span class="text-gray-600 text-xs truncate max-w-[180px] block font-medium">{{ ahli.penempatan || '—' }}</span>
              </td>
              
              <td class="px-4 py-3 hidden sm:table-cell">
                <p class="text-gray-800 text-xs font-semibold">{{ ahli.jenis_potongan || 'Manual' }}</p>
                <p class="text-gray-500 text-[10px] uppercase font-bold mt-0.5">{{ ahli.gred_sspa || 'GRED TIADA' }}</p>
              </td>
              
              <td class="px-4 py-3 text-center">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider', badgeStatus(ahli.status_ahli)]">
                  {{ ahli.status_ahli || 'TIDAK AKTIF' }}
                </span>
              </td>
              
              <td class="px-4 py-3 text-center">
                <button @click="bukaEdit(ahli)"
                  class="text-xs font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A] hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                  Edit Data
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
        <p class="text-gray-500 text-xs font-medium">Halaman {{ halamanSemasa }} / {{ jumlahHalaman }}</p>
        <div class="flex gap-1">
          <button @click="halamanSemasa--" :disabled="halamanSemasa === 1"
            class="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center">‹</button>
          <button v-for="p in halamanDipapar" :key="p" @click="halamanSemasa = p"
            :class="['w-8 h-8 rounded-lg text-xs font-bold transition-colors border flex items-center justify-center',
              p === halamanSemasa ? 'bg-[#0F4C3A] border-[#0F4C3A] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100']">
            {{ p }}
          </button>
          <button @click="halamanSemasa++" :disabled="halamanSemasa === jumlahHalaman"
            class="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center">›</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEdit" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showEdit = false">
          <div class="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-md shadow-2xl">
            <div class="flex justify-between items-start mb-5 border-b border-gray-100 pb-4">
              <div>
                <h3 class="text-gray-900 font-bold text-lg">Kemaskini Ahli</h3>
                <p class="text-gray-500 text-xs mt-1">{{ formEdit.nama_pegawai }} ({{ formEdit.no_kp }})</p>
              </div>
              <button @click="showEdit = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">No. Ahli</label>
                <input v-model="formEdit.no_ahli" type="text" placeholder="Cth: KP-0001/2026"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Status Ahli</label>
                  <select v-model="formEdit.status_ahli"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all">
                    <option value="aktif">Aktif</option>
                    <option value="tidak aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Peranan (Role)</label>
                  <select v-model="formEdit.role"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all">
                    <option value="Ahli">Ahli</option>
                    <option value="Admin">Admin</option>
                    <option value="Bendahari">Bendahari</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-8">
              <button @click="showEdit = false"
                class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">Batal</button>
              <button @click="simpanEdit" :disabled="saving"
                class="px-5 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDaftar" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showDaftar = false">
          <div class="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-md shadow-2xl">
            <div class="flex justify-between items-start mb-5 border-b border-gray-100 pb-4">
              <div>
                <h3 class="text-gray-900 font-bold text-lg">Daftar Ahli Manual</h3>
                <p class="text-gray-500 text-xs mt-1">Daftar ahli yang tiada dalam sistem CSV.</p>
              </div>
              <button @click="showDaftar = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">No. KP Kakitangan *</label>
                <input v-model="formDaftar.no_kp" type="text" placeholder="Cth: 850101014567" required
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all placeholder-gray-400"/>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Yuran Bulanan</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">RM</span>
                    <input v-model="formDaftar.yuran_bulanan" type="number" min="0" step="0.50" placeholder="5.00"
                      class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
                  </div>
                </div>
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">No. Ahli</label>
                  <input v-model="formDaftar.no_ahli" type="text" placeholder="Auto Jana"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all placeholder-gray-400"/>
                </div>
              </div>
              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Kaedah Potongan Yuran</label>
                <select v-model="formDaftar.pilihan_potongan"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all">
                  <option value="Potongan Biro angkasa">Potongan Biro Angkasa</option>
                  <option value="Bayar secara manual">Bayar Secara Manual / FPX</option>
                </select>
              </div>

              <Transition name="fade">
                <div v-if="mesejDaftar" :class="['text-xs px-4 py-3 rounded-xl flex items-center gap-2 border shadow-sm', mesejDaftar.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200']">
                  <svg v-if="mesejDaftar.type === 'success'" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  {{ mesejDaftar.text }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button @click="showDaftar = false"
                class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">Batal</button>
              <button @click="simpanDaftar" :disabled="saving"
                class="px-5 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Mendaftar...' : 'Daftar Sekarang' }}
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

const semuaAhli   = ref([]);
const loading     = ref(true);
const saving      = ref(false);

// State untuk Filters
const carian           = ref('');
const filterStatus     = ref('');
const filterPenempatan = ref('');
const filterGred       = ref('');
const filterPotongan   = ref('');

// Pagination
const halamanSemasa = ref(1);
const hadPerHalaman = 15;

// State Modals
const showEdit   = ref(false);
const showDaftar = ref(false);
const mesejDaftar = ref(null);

const formEdit = ref({ no_kp: '', nama_pegawai: '', no_ahli: '', status_ahli: '', role: '' });
const formDaftar = ref({ no_kp: '', yuran_bulanan: '', pilihan_potongan: 'Potongan Biro angkasa', no_ahli: '' });

// ── Senarai Dropdown Dinamik ──
const senaraiPenempatan = computed(() => {
  const senarai = semuaAhli.value.map(a => a.penempatan).filter(Boolean);
  return [...new Set(senarai)].sort();
});

const senaraiGred = computed(() => {
  const senarai = semuaAhli.value.map(a => a.gred_sspa).filter(Boolean);
  return [...new Set(senarai)].sort();
});

const senaraiPotongan = computed(() => {
  const senarai = semuaAhli.value.map(a => a.jenis_potongan).filter(Boolean);
  return [...new Set(senarai)].sort();
});

// ── Penapisan (Filtering) ──
const ahliTertapis = computed(() => {
  return semuaAhli.value.filter(a => {
    // 1. Cari Teks
    const coc = carian.value.toLowerCase();
    const matchCarian = !coc ||
      (a.nama_pegawai || '').toLowerCase().includes(coc) ||
      (a.no_kp || '').includes(coc) ||
      (a.no_ahli || '').toLowerCase().includes(coc);
      
    // 2. Filter Status, Penempatan, Gred, Potongan
    const matchStatus     = !filterStatus.value || (a.status_ahli || '').toLowerCase() === filterStatus.value;
    const matchPenempatan = !filterPenempatan.value || a.penempatan === filterPenempatan.value;
    const matchGred       = !filterGred.value || a.gred_sspa === filterGred.value;
    const matchPotongan   = !filterPotongan.value || a.jenis_potongan === filterPotongan.value;

    return matchCarian && matchStatus && matchPenempatan && matchGred && matchPotongan;
  });
});

// ── Logic Pagination ──
const jumlahHalaman = computed(() => Math.max(1, Math.ceil(ahliTertapis.value.length / hadPerHalaman)));

const ahliTerpapar = computed(() => {
  const start = (halamanSemasa.value - 1) * hadPerHalaman;
  return ahliTertapis.value.slice(start, start + hadPerHalaman);
});

const halamanDipapar = computed(() => {
  const total = jumlahHalaman.value;
  const semasa = halamanSemasa.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (semasa <= 3) return [1, 2, 3, 4, 5];
  if (semasa >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
  return [semasa - 2, semasa - 1, semasa, semasa + 1, semasa + 2];
});

// Reset pagination jika filter bertukar
import { watch } from 'vue';
watch([carian, filterStatus, filterPenempatan, filterGred, filterPotongan], () => {
  halamanSemasa.value = 1;
});

// ── Badge & Label Status ──
const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-green-100 text-green-700 border border-green-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-gray-100 text-gray-600 border border-gray-200';
};

// ── Hubungi API ──
const muatAhli = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/semua-ahli');
    if (data.success) semuaAhli.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Edit Ahli ──
const bukaEdit = (ahli) => {
  // Sediakan data untuk diubah. Jika status null, letak 'tidak aktif'
  formEdit.value = { 
    no_kp: ahli.no_kp, 
    nama_pegawai: ahli.nama_pegawai, 
    no_ahli: ahli.no_ahli || '', 
    status_ahli: (ahli.status_ahli || 'tidak aktif').toLowerCase(), 
    role: ahli.role || 'Ahli' 
  };
  showEdit.value = true;
};

const simpanEdit = async () => {
  saving.value = true;
  try {
    await api.put(`/admin/kemaskini-ahli/${formEdit.value.no_kp}`, {
      no_ahli: formEdit.value.no_ahli,
      status_ahli: formEdit.value.status_ahli,
      role: formEdit.value.role,
    });
    showEdit.value = false;
    await muatAhli();
  } catch (e) { 
    alert(e.response?.data?.message || 'Ralat menyimpan maklumat.');
  } finally { saving.value = false; }
};

// ── Daftar Ahli Manual ──
const bukaModalDaftar = () => {
  formDaftar.value = { no_kp: '', yuran_bulanan: '', pilihan_potongan: 'Potongan Biro angkasa', no_ahli: '' };
  mesejDaftar.value = null;
  showDaftar.value = true;
};

const simpanDaftar = async () => {
  if (!formDaftar.value.no_kp) {
    mesejDaftar.value = { type: 'error', text: 'No KP diwajibkan.' };
    return;
  }
  saving.value = true;
  mesejDaftar.value = null;
  
  try {
    const { data } = await api.post('/admin/daftar-ahli', formDaftar.value);
    if (data.success) {
      mesejDaftar.value = { type: 'success', text: data.message || 'Ahli berjaya didaftar.' };
      await muatAhli();
      setTimeout(() => { showDaftar.value = false; }, 1500);
    }
  } catch (e) {
    mesejDaftar.value = { type: 'error', text: e.response?.data?.message || 'Ralat berlaku. Semak no KP.' };
  } finally { saving.value = false; }
};

// ── Eksport CSV ──
const eksportCSV = () => {
  // Hanya eksport data yang tertapis sekarang
  const headers = 'No KP,Nama,Gred,Penempatan,Jenis Potongan,No Ahli,Status\n';
  const rows = ahliTertapis.value.map(a =>
    `"${a.no_kp}","${a.nama_pegawai || ''}","${a.gred_sspa || ''}","${a.penempatan || ''}","${a.jenis_potongan || ''}","${a.no_ahli || ''}","${a.status_ahli || ''}"`
  ).join('\n');
  const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Ahli_Kelab.csv'; a.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  muatAhli();
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>