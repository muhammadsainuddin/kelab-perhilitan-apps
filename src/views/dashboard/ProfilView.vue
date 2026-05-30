<template>
  <div class="space-y-5 animate-fade-in pb-10">
    
    <div class="px-1 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-[#08151D] uppercase tracking-wide">Profil Saya</h2>
        <p class="text-xs text-[#567778] font-medium mt-0.5">Urus maklumat peribadi, waris dan keselamatan akaun.</p>
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
          <p class="text-xs text-[#567778] mt-0.5 truncate font-medium">{{ profil.penempatan || 'Sila Kemaskini Penempatan' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 pt-4 text-xs border-t border-gray-100">
        <div>
          <span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-0.5">Gred SSPA</span>
          <span class="font-bold text-[#08151D] uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{{ profil.gred_sspa || '-' }}</span>
        </div>
        <div>
          <span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-0.5">Saiz Baju</span>
          <span class="font-bold text-[#08151D] uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{{ profil.saiz_baju || '-' }}</span>
        </div>
        <div>
          <span class="text-[9px] text-[#567778] font-bold uppercase tracking-wider block mb-0.5">Yuran (DB)</span>
          <span class="font-bold text-[#08151D] font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">RM {{ parseFloat(profil.yuran_kelab_bulanan || 0).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[24px] border border-gray-200/60 p-4 shadow-sm flex gap-3">
      <button @click="bukaModalEdit" class="flex-1 py-3.5 bg-[#08151D]/5 hover:bg-[#08151D]/10 text-[#08151D] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        Kemas Kini Data
      </button>
      <button @click="bukaModalBerhenti" class="flex-1 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-amber-200/50"
              :disabled="profil.status_ahli === 'tidak aktif'"
              :class="{'opacity-50 cursor-not-allowed': profil.status_ahli === 'tidak aktif'}">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
        {{ profil.status_ahli === 'tidak aktif' ? 'Telah Berhenti' : 'Mohon Berhenti' }}
      </button>
    </div>

    <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 space-y-3">
      <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
        <svg class="w-4 h-4 text-[#87BCB5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        <h4 class="text-[11px] font-black text-[#08151D] uppercase tracking-wider">Maklumat Perbankan Ahli</h4>
      </div>
      <div class="grid grid-cols-2 gap-4 text-xs pt-1">
        <div>
          <p class="text-[#567778] font-medium mb-0.5">Nama Bank</p>
          <p class="font-bold text-[#08151D] uppercase">{{ profil.bank_ahli || 'Belum Diisi' }}</p>
        </div>
        <div>
          <p class="text-[#567778] font-medium mb-0.5">No. Akaun Bank</p>
          <p class="font-bold text-[#08151D] font-mono">{{ profil.no_acc_bank || 'Belum Diisi' }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/60 space-y-3">
      <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
        <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        <h4 class="text-[11px] font-black text-[#08151D] uppercase tracking-wider">Maklumat Waris / Khairat</h4>
      </div>
      <div class="space-y-4 text-xs pt-1">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 sm:col-span-1">
            <p class="text-[#567778] font-medium mb-0.5">Nama Penuh Waris</p>
            <p class="font-bold text-[#08151D] uppercase">{{ profil.nama_waris || 'Belum Diisi' }}</p>
          </div>
          <div>
            <p class="text-[#567778] font-medium mb-0.5">No. Telefon Waris</p>
            <p class="font-bold text-[#08151D] font-mono">{{ profil.no_tel_waris || 'Belum Diisi' }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-[#567778] font-medium mb-0.5">Nama Bank Waris</p>
            <p class="font-bold text-[#08151D] uppercase">{{ profil.bank_waris || 'Belum Diisi' }}</p>
          </div>
          <div>
            <p class="text-[#567778] font-medium mb-0.5">No. Akaun Bank Waris</p>
            <p class="font-bold text-[#08151D] font-mono">{{ profil.no_acc_waris || 'Belum Diisi' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[24px] border border-gray-200/60 p-4 shadow-sm flex flex-col gap-3">
      <button @click="bukaModalTransaksi" class="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-emerald-200/50">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Sejarah Transaksi FPX (Keseluruhan)
      </button>

    </div>

    <button @click="logKeluar" class="w-full group relative flex justify-center items-center gap-3 py-4 bg-rose-50 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-sm overflow-hidden mt-2">
      <div class="absolute inset-0 w-0 bg-rose-600 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
      
      <svg class="w-5 h-5 z-10 transition-transform duration-300 group-hover:-translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span class="z-10 relative drop-shadow-sm">Log Keluar Sistem</span>
    </button>

    <Teleport to="body">
      <div v-if="modalEdit" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 class="text-sm font-black text-[#08151D] uppercase">Kemas Kini Maklumat</h3>
            <button @click="modalEdit = false" class="text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 p-1.5 rounded-full transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <form @submit.prevent="simpanProfil" class="space-y-5">
            
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-[#87BCB5] uppercase tracking-wider mb-2">1. Peribadi & Pekerjaan</h4>
              
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Cawangan Penempatan (PTJ)</label>
                <select v-model="form.penempatan_id" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20">
                  <option value="" disabled>-- Pilih Lokasi Tugas --</option>
                  <option v-for="ptj in senaraiPTJ" :key="ptj.id" :value="ptj.id">{{ ptj.nama_penempatan }}</option>
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">No. Telefon</label>
                  <input v-model="form.no_tel" type="text" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Saiz Baju</label>
                  <select v-model="form.saiz_baju" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20">
                    <option v-for="s in ['XS','S','M','L','XL','2XL','3XL','4XL','5XL']" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Nama Bank (Ahli)</label>
                  <input v-model="form.bank_ahli" type="text" placeholder="Cth: Maybank" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none uppercase focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">No. Akaun Bank (Ahli)</label>
                  <input v-model="form.no_acc_bank" type="text" placeholder="Cth: 16401010101" class="w-full bg-gray-50 border border-gray-200 text-xs font-mono font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <h4 class="text-[10px] font-black text-[#87BCB5] uppercase tracking-wider mb-2">2. Maklumat Waris</h4>
              <div class="space-y-1">
                <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Nama Penuh Waris</label>
                <input v-model="form.nama_waris" type="text" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 uppercase outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Tel Waris</label>
                  <input v-model="form.no_tel_waris" type="text" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Hubungan</label>
                  <select v-model="form.hubungan_waris" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20">
                    <option value="Suami / Isteri">Suami / Isteri</option>
                    <option value="Ibu / Bapa">Ibu / Bapa</option>
                    <option value="Adik Beradik">Adik Beradik</option>
                    <option value="Anak">Anak</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Nama Bank Waris</label>
                  <input v-model="form.bank_waris" type="text" placeholder="Cth: CIMB" class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 uppercase outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">No. Akaun Bank Waris</label>
                  <input v-model="form.no_acc_waris" type="text" class="w-full bg-gray-50 border border-gray-200 text-xs font-mono font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
              </div>
            </div>
            
            <div class="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-200/80 mt-4">
              <h4 class="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-2">3. Tukar Kata Laluan (Opsyenal)</h4>
              <div class="space-y-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Kata Laluan Semasa</label>
                  <input v-model="pwdForm.oldPassword" type="password" placeholder="Wajib diisi jika ingin tukar" class="w-full bg-white border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Kata Laluan Baru</label>
                    <input v-model="pwdForm.newPassword" type="password" placeholder="Kata laluan baru" class="w-full bg-white border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Sahkan Kata Laluan</label>
                    <input v-model="pwdForm.confirmPassword" type="password" placeholder="Sahkan kata laluan" class="w-full bg-white border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-[#08151D] focus:ring-2 focus:ring-[#87BCB5]/20" />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-2 flex justify-end gap-2 border-t border-gray-100">
              <button type="button" @click="modalEdit = false" class="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
              <button type="submit" :disabled="loading" class="py-3 px-5 bg-[#08151D] text-[#87BCB5] font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2">
                <span v-if="loading" class="w-3 h-3 rounded-full border-2 border-[#87BCB5] border-t-transparent animate-spin"></span>
                {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="modalBerhenti" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-pop-in">
          
          <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 class="text-sm font-black text-rose-700 uppercase">Penamatan Keahlian</h3>
            <button @click="modalBerhenti = false" class="text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 p-1.5 rounded-full transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <form @submit.prevent="hantarBerhenti" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Alasan Utama Berhenti</label>
              <select v-model="formBerhenti.sebab_utama" required class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-500/20">
                <option value="" disabled>-- Pilih Alasan --</option>
                <option value="Berhenti Kerja (Resignation)">Berhenti Kerja (Resignation)</option>
                <option value="Bersara (Wajib / Pilihan)">Bersara (Wajib / Pilihan)</option>
                <option value="Berpindah Jabatan / Kementerian">Berpindah Jabatan / Kementerian</option>
                <option value="Lain-lain Alasan">Lain-lain Alasan</option>
              </select>
            </div>
            
            <div class="space-y-1">
              <label class="text-[10px] text-[#567778] font-bold uppercase ml-1">Ulasan / Catatan Tambahan</label>
              <textarea v-model="formBerhenti.ulasan" rows="3" required placeholder="Nyatakan tarikh berkuatkuasa dan butiran lanjut..." class="w-full bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl p-3 outline-none resize-none focus:border-rose-700 focus:ring-2 focus:ring-rose-500/20"></textarea>
            </div>

            <div class="pt-4 mt-2 flex justify-end gap-2 border-t border-gray-100">
              <button type="button" @click="modalBerhenti = false" class="text-xs font-bold text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
              <button type="submit" :disabled="loading" class="py-3 px-5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-2">
                <span v-if="loading" class="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                {{ loading ? 'Memproses...' : 'Sahkan Penamatan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="modalTransaksi" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="modalTransaksi = false">
        <div class="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          
          <div class="flex justify-between items-center px-6 py-5 border-b border-gray-100">
            <h3 class="text-sm font-black text-[#08151D] uppercase">Sejarah Transaksi FPX</h3>
            <button @click="modalTransaksi = false" class="text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 p-1.5 rounded-full transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/50">
            <div v-if="loadingTransaksi" class="text-center py-10 text-xs font-bold text-gray-500">Memuatkan rekod...</div>
            <div v-else-if="sejarahSemua.length === 0" class="text-center py-10 text-xs font-bold text-gray-500">Tiada transaksi direkodkan.</div>
            
            <div v-else class="space-y-3">
              <div v-for="tx in sejarahSemua" :key="tx.billCode" class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
                <div class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border" 
                     :class="tx.status === 'BERJAYA' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : (tx.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-rose-50 border-rose-200 text-rose-600')">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 text-xs truncate uppercase">{{ tx.keterangan }}</p>
                  <span class="text-[9px] text-gray-500 block mt-0.5 font-mono">{{ tx.billCode }} | {{ tx.tarikh }}</span>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-black text-[#08151D] text-sm tabular-nums">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
                  <span class="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border inline-block mt-1"
                        :class="tx.status === 'BERJAYA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : (tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100')">
                    {{ tx.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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

const modalTransaksi = ref(false);
const sejarahSemua = ref([]);
const loadingTransaksi = ref(false);

// 1. Tarik Profil Kakitangan
const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil'); 
    profil.value = res.data.data;
  } catch (e) { console.error("Gagal menarik profil:", e); }
};

// 2. Tarik Senarai Penempatan
const fetchSenaraiPTJ = async () => {
  try {
    const res = await api.get('/user/senarai-ptj'); 
    senaraiPTJ.value = res.data.data || [];
  } catch (error) { console.error("Gagal menarik senarai PTJ:", error); }
};

// 3. Muat Naik Gambar Profil Menggunakan Multer
const triggerUpload = () => fileInput.value.click();
const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('gambar', file);
  
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

const bukaModalTransaksi = async () => {
  modalTransaksi.value = true;
  loadingTransaksi.value = true;
  try {
    const { data } = await api.get('/bayaran/sejarah-semua');
    if (data.success) sejarahSemua.value = data.data;
  } catch (e) {
    console.error("Gagal muat transaksi", e);
  } finally {
    loadingTransaksi.value = false;
  }
};

const bukaModalEdit = () => {
  form.value = {
    penempatan_id: profil.value.penempatan_id || '',
    saiz_baju: profil.value.saiz_baju || 'M',
    no_tel: profil.value.no_tel || '',
    email: profil.value.email || '',
    nama_waris: profil.value.nama_waris || '',
    hubungan_waris: profil.value.hubungan_waris || 'Suami / Isteri',
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

// 5. Permohonan Penamatan Keahlian
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

.animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>