<template>
  <div class="space-y-5 animate-fade-in pb-10">
    
    <div class="px-1 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Pengurusan Profil</h2>
        <p class="text-xs text-[#567778] font-medium mt-0.5">Kemaskini maklumat penempatan, data waris, dan tetapan keselamatan.</p>
      </div>
    </div>

    <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 space-y-4">
      <div class="flex items-center gap-4">
        <div @click="triggerUpload" class="relative w-16 h-16 rounded-2xl bg-[#08151D] text-[#87BCB5] flex items-center justify-center font-black text-xl shadow-inner uppercase cursor-pointer overflow-hidden group shrink-0">
          <img v-if="profil.gambar" :src="`http://localhost:5001/uploads/images/${profil.gambar}`" class="w-full h-full object-cover" />
          <span v-else>{{ profil.nama_penuh ? profil.nama_penuh.charAt(0) : '?' }}</span>
          <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span class="text-[8px] uppercase tracking-widest font-bold text-white">Ubah</span>
          </div>
        </div>
        <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileChange" />
        
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-black text-[#08151D] uppercase leading-tight truncate">{{ profil.nama_penuh || 'Nama Kakitangan' }}</h3>
          <p class="text-xs text-[#567778] mt-0.5 truncate">{{ profil.penempatan || 'Sila Kemaskini Penempatan' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-gray-100">
        <div>
          <span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block">Gred SSPA</span>
          <span class="font-bold text-[#08151D] uppercase">{{ profil.gred_sspa || '-' }}</span>
        </div>
        <div>
          <span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block">Yuran Bulanan (DB)</span>
          <span class="font-bold text-[#08151D] font-mono">RM {{ parseFloat(profil.yuran_kelab_bulanan || 0).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[24px] border border-gray-200/60 p-4 shadow-sm flex gap-3">
      <button @click="bukaModalEdit" class="flex-1 py-3 bg-[#08151D]/5 hover:bg-[#08151D]/10 text-[#08151D] font-bold text-xs rounded-xl transition-all">
        Kemas Kini Data
      </button>
      <button @click="bukaModalBerhenti" class="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all"
              :disabled="profil.status_ahli === 'tidak aktif'"
              :class="{'opacity-50 cursor-not-allowed': profil.status_ahli === 'tidak aktif'}">
        {{ profil.status_ahli === 'tidak aktif' ? 'Tidak Aktif' : 'Mohon Berhenti' }}
      </button>
    </div>

    <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 space-y-3">
      <h4 class="text-xs font-black text-[#08151D] uppercase tracking-wider border-b pb-2">Maklumat Waris & Khairat</h4>
      <div class="space-y-2 text-xs">
        <p class="text-[#567778] font-medium">Nama Waris: <strong class="text-[#08151D] uppercase">{{ profil.nama_waris || 'Belum dikemaskini' }}</strong></p>
        <p class="text-[#567778] font-medium">No. Telefon: <strong class="text-[#08151D] font-mono">{{ profil.no_tel_waris || '-' }}</strong></p>
        <p class="text-[#567778] font-medium">Akaun Bank: <strong class="text-[#08151D] uppercase">{{ profil.bank_waris || 'N/A' }} ({{ profil.no_acc_waris || '-' }})</strong></p>
      </div>
    </div>

    <button @click="logKeluar" class="w-full py-3.5 border-2 border-rose-500 text-rose-500 font-bold text-xs rounded-xl hover:bg-rose-500 hover:text-white transition-all">
      Log Keluar Sistem
    </button>

    <div v-if="modalEdit" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <h3 class="text-sm font-black text-[#08151D] uppercase border-b pb-2">Kemas Kini Maklumat</h3>
        
        <div class="space-y-4 text-xs">
          <div class="space-y-3">
            <h4 class="text-[10px] font-black text-[#87BCB5] uppercase tracking-wider">1. Peribadi & Pekerjaan</h4>
            
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase">Cawangan Penempatan (PTJ)</label>
              <select v-model="form.penempatan_id" class="w-full bg-gray-50 border rounded-xl px-3 py-2.5 outline-none font-bold text-gray-700">
                <option value="" disabled>-- Pilih Lokasi Tugas --</option>
                <option v-for="ptj in senaraiPTJ" :key="ptj.id" :value="ptj.id">{{ ptj.nama_penempatan }}</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">No. Telefon</label>
                <input v-model="form.no_tel" type="text" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">Saiz Baju</label>
                <select v-model="form.saiz_baju" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none font-bold text-gray-700">
                  <option v-for="s in ['XS','S','M','L','XL','2XL','3XL','4XL','5XL']" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">Nama Bank (Ahli)</label>
                <input v-model="form.bank_ahli" type="text" placeholder="Cth: Maybank" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none uppercase" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">No. Akaun Bank (Ahli)</label>
                <input v-model="form.no_acc_bank" type="text" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none font-mono" />
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-[10px] font-black text-[#87BCB5] uppercase tracking-wider">2. Maklumat Waris</h4>
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase">Nama Penuh Waris</label>
              <input v-model="form.nama_waris" type="text" class="w-full bg-gray-50 border rounded-xl px-3 py-2 uppercase outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">Tel Waris</label>
                <input v-model="form.no_tel_waris" type="text" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase">Nama Bank Waris</label>
                <input v-model="form.bank_waris" type="text" placeholder="Cth: CIMB" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none uppercase" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase">No. Akaun Bank Waris</label>
              <input v-model="form.no_acc_waris" type="text" class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none font-mono" />
            </div>
          </div>
          
          <div class="space-y-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <h4 class="text-[10px] font-black text-rose-500 uppercase tracking-wider">3. Tukar Kata Laluan (Opsyenal)</h4>
            <div class="space-y-2">
              <div class="space-y-1">
                <label class="text-[9px] text-[#567778] font-bold uppercase">Kata Laluan Semasa</label>
                <input v-model="pwdForm.oldPassword" type="password" placeholder="Wajib diisi jika ingin tukar" class="w-full bg-white border rounded-xl px-3 py-2 outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-[9px] text-[#567778] font-bold uppercase">Kata Laluan Baru</label>
                <input v-model="pwdForm.newPassword" type="password" placeholder="Kata laluan baru" class="w-full bg-white border rounded-xl px-3 py-2 outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-[9px] text-[#567778] font-bold uppercase">Sahkan Kata Laluan Baru</label>
                <input v-model="pwdForm.confirmPassword" type="password" placeholder="Sahkan kata laluan baru" class="w-full bg-white border rounded-xl px-3 py-2 outline-none" />
              </div>
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-2 pt-2 border-t">
          <button @click="modalEdit = false" class="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all">Batal</button>
          <button @click="simpanProfil" :disabled="loading" class="bg-[#08151D] text-[#87BCB5] text-xs font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="modalBerhenti" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
        <h3 class="text-sm font-black text-rose-700 uppercase border-b border-rose-100 pb-2">Penamatan Keahlian</h3>
        
        <form @submit.prevent="hantarBerhenti" class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase">Alasan Utama Berhenti</label>
            <select v-model="formBerhenti.sebab_utama" required class="w-full bg-gray-50 border rounded-xl px-3 py-2.5 outline-none font-bold text-gray-700">
              <option value="" disabled>Pilih Alasan</option>
              <option value="Berhenti Kerja (Resignation)">Berhenti Kerja (Resignation)</option>
              <option value="Bersara (Wajib / Pilihan)">Bersara (Wajib / Pilihan)</option>
              <option value="Berpindah Jabatan / Kementerian">Berpindah Jabatan / Kementerian</option>
              <option value="Lain-lain Alasan">Lain-lain Alasan</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-[#567778] font-bold uppercase">Ulasan / Catatan Tambahan</label>
            <textarea v-model="formBerhenti.ulasan" rows="3" required placeholder="Nyatakan tarikh berkuatkuasa dan butiran lanjut..." class="w-full bg-gray-50 border rounded-xl px-3 py-2 outline-none resize-none font-medium text-gray-700"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t">
            <button type="button" @click="modalBerhenti = false" class="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-xl">Batal</button>
            <button type="submit" :disabled="loading" class="bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
              {{ loading ? 'Memproses...' : 'Sahkan Penamatan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const profil = ref({});
const senaraiPTJ = ref([]);

const modalEdit = ref(false);
const modalBerhenti = ref(false);
const fileInput = ref(null);
const loading = ref(false);

const form = ref({ penempatan_id: '', saiz_baju: '', no_tel: '', email: '', nama_waris: '', no_tel_waris: '', no_acc_waris: '', bank_waris: '', no_acc_bank: '', bank_ahli: '' });
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const formBerhenti = ref({ sebab_utama: '', ulasan: '' });

// 1. Tarik Profil Kakitangan ( getMyProfile )
const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil'); 
    profil.value = res.data.data;
  } catch (e) { console.error("Gagal menarik profil:", e); }
};

// 2. Tarik Senarai Penempatan untuk Dropdown ( getSenaraiPTJ )
const fetchSenaraiPTJ = async () => {
  try {
    const res = await api.get('/user/senarai-ptj'); 
    senaraiPTJ.value = res.data.data || [];
  } catch (error) { console.error("Gagal menarik senarai PTJ:", error); }
};

// 3. Muat Naik Gambar Profil Menggunakan Multer ( updateGambarProfil )
const triggerUpload = () => fileInput.value.click();
const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('gambar', file); // 'gambar' mestilah sepadan dengan nama input backend
  
  try {
    await api.put('/user/kemaskini-gambar', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    fetchProfil();
    alert("Gambar profil anda berjaya dikemas kini!");
  } catch (error) {
    alert("Gagal memuat naik gambar profil.");
  }
};

const bukaModalEdit = () => {
  form.value = {
    penempatan_id: profil.value.penempatan_id || '',
    saiz_baju: profil.value.saiz_baju || 'M',
    no_tel: profil.value.no_tel || '',
    email: profil.value.email || '',
    nama_waris: profil.value.nama_waris || '',
    no_tel_waris: profil.value.no_tel_waris || '',
    no_acc_waris: profil.value.no_acc_waris || '',
    bank_waris: profil.value.bank_waris || '',
    no_acc_bank: profil.value.no_acc_bank || '',
    bank_ahli: profil.value.bank_ahli || ''
  };
  pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  modalEdit.value = true;
};

// 4. Pengendalian Kemaskini Profil & Keselamatan
const simpanProfil = async () => {
  loading.value = true;
  try {
    // Kemaskini Profil Asas ( updateMyProfile )
    await api.put('/user/kemaskini-profil', {
      email: form.value.email,
      no_tel: form.value.no_tel,
      saiz_baju: form.value.saiz_baju,
      nama_waris: form.value.nama_waris,
      no_tel_waris: form.value.no_tel_waris,
      no_acc_waris: form.value.no_acc_waris,
      bank_waris: form.value.bank_waris,
      penempatan_id: form.value.penempatan_id,
      no_acc_bank: form.value.no_acc_bank,
      bank_ahli: form.value.bank_ahli
    });

    // Proses Penukaran Kata Laluan Jika Diisi ( changePassword )
    if (pwdForm.value.newPassword && pwdForm.value.newPassword.trim() !== '') {
      if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
        alert("Sila pastikan pengesahan kata laluan baru adalah sepadan.");
        loading.value = false;
        return;
      }
      await api.put('/user/tukar-password', {
        oldPassword: pwdForm.value.oldPassword,
        newPassword: pwdForm.value.newPassword
      });
    }

    alert("Segala perubahan profil berjaya disimpan.");
    modalEdit.value = false;
    fetchProfil();
  } catch (e) { 
    alert(e.response?.data?.message || "Gagal mengemaskini maklumat akaun."); 
  } finally { loading.value = false; }
};

const bukaModalBerhenti = () => {
  formBerhenti.value = { sebab_utama: '', ulasan: '' };
  modalBerhenti.value = true;
};

// 5. Permohonan Penamatan Keahlian ( applyResignation )
const hantarBerhenti = async () => {
  if (!confirm("Adakah anda benar-benar pasti? Tindakan ini akan terus menukar status keahlian anda kepada Tidak Aktif.")) return;
  loading.value = true;
  try {
    await api.post('/user/mohon-berhenti', {
      sebab_berhenti: `${formBerhenti.value.sebab_utama}: ${formBerhenti.value.ulasan}`
    });
    alert("Permohonan penamatan kelab anda telah diproses secara automatik.");
    modalBerhenti.value = false;
    fetchProfil();
  } catch (error) {
    alert(error.response?.data?.message || "Gagal memproses permohonan penamatan.");
  } finally { loading.value = false; }
};

const logKeluar = () => {
  if (confirm("Adakah anda pasti mahu log keluar dari aplikasi?")) {
    authStore.logout();
    router.push('/login');
  }
};

onMounted(() => {
  fetchProfil();
  fetchSenaraiPTJ();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
</style>