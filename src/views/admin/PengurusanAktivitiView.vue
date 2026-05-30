<template>
  <div class="space-y-6 font-sans text-gray-900 pb-10">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-2xl text-gray-900">Pengurusan Acara & Aktiviti</h2>
        <p class="text-gray-500 text-sm mt-1">Urus hebahan, kemas kini butiran, dan senarai peserta.</p>
      </div>
      <button @click="bukaModalBaru"
        class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Buka Acara Baharu
      </button>
    </div>

    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i" class="h-64 rounded-2xl bg-white border border-gray-200 animate-pulse"/>
    </div>

    <div v-else-if="senaraiAcara.length === 0"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <p class="text-gray-600 font-medium">Tiada acara dibuka pada masa ini.</p>
    </div>

    <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="p in senaraiAcara" :key="p.id"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-[#0F4C3A]/30 transition-all flex flex-col group">

        <div class="relative h-40 bg-gray-100 overflow-hidden cursor-pointer" @click="paparButiran(p)">
          <img v-if="dapatkanPosterUtama(p.poster)" :src="`http://localhost:5001/uploads/images/${dapatkanPosterUtama(p.poster)}`" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
            <svg class="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          
          <div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="bg-white/90 text-gray-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Lihat Butiran</span>
          </div>

          <div class="absolute top-3 right-3 flex gap-2 pointer-events-none">
            <span v-if="kiraBilanganGambar(p.poster) > 1" class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ kiraBilanganGambar(p.poster) }}
            </span>
            <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm', p.status === 'AKTIF' ? 'bg-emerald-500/90 text-white' : 'bg-gray-800/80 text-white']">
              {{ p.status }}
            </span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col gap-3">
          <div class="flex gap-2 items-start">
            <span class="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">{{ p.jenis_acara || 'Umum' }}</span>
          </div>
          <h3 class="text-gray-900 font-bold text-base leading-snug line-clamp-2 cursor-pointer hover:text-[#0F4C3A]" @click="paparButiran(p)">{{ p.nama_acara }}</h3>
          
          <div class="space-y-1.5 mt-auto pt-2">
            <p class="text-gray-600 text-xs flex items-center gap-2 font-medium">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ formatTarikh(p.tarikh_acara) }}
            </p>
            <p class="text-gray-600 text-xs flex items-center gap-2 font-medium">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ p.lokasi || 'Akan Dimaklumkan' }}
            </p>
          </div>
        </div>

        <div class="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200">{{ p.jumlah_peserta || 0 }}</span>
            <span class="text-[11px] text-gray-500 font-medium">Peserta</span>
          </div>
          <button @click="bukaPeserta(p)"
            class="text-[11px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A] hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Urus Peserta
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalDetail" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showModalDetail = false">
          <div class="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div class="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div>
                <h3 class="text-gray-900 font-bold text-xl">{{ isEditMode ? 'Kemaskini Acara' : 'Butiran Acara' }}</h3>
              </div>
              <button @click="showModalDetail = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div v-if="!isEditMode" class="space-y-5">
              <div v-if="kiraBilanganGambar(acara_dipilih.poster) > 0" class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <img v-for="(img, idx) in dapatkanSemuaPoster(acara_dipilih.poster)" :key="idx" 
                     :src="`http://localhost:5001/uploads/images/${img}`" 
                     class="h-32 w-auto object-cover rounded-xl border border-gray-200 shadow-sm" />
              </div>

              <div>
                <h2 class="text-xl font-black text-gray-900">{{ acara_dipilih.nama_acara }}</h2>
                <div class="flex gap-2 mt-2">
                  <span class="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100 uppercase">{{ acara_dipilih.jenis_acara }}</span>
                  <span :class="['text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider', acara_dipilih.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700']">
                    Status: {{ acara_dipilih.status }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Tarikh Acara</p>
                  <p class="text-gray-900 font-bold text-sm mt-0.5">{{ formatTarikh(acara_dipilih.tarikh_acara) }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Tarikh Tutup</p>
                  <p class="text-rose-600 font-bold text-sm mt-0.5">{{ formatTarikh(acara_dipilih.tarikh_tutup) }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Lokasi</p>
                  <p class="text-gray-900 font-bold text-sm mt-0.5">{{ acara_dipilih.lokasi || '-' }}</p>
                </div>
              </div>

              <div>
                <p class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Keterangan / Aturcara</p>
                <p class="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{{ acara_dipilih.keterangan || 'Tiada keterangan disediakan.' }}</p>
              </div>

              <div class="border-t border-gray-100 pt-4 flex justify-between items-center">
                <button @click="padamAcara(acara_dipilih.id)" class="text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Padam Acara
                </button>
                <button @click="bukaModEdit" class="bg-[#0F4C3A] text-white hover:bg-[#166b52] px-6 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
                  Kemas Kini Maklumat
                </button>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Nama Acara *</label>
                  <input v-model="formEdit.nama_acara" type="text" class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
                </div>
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Jenis Acara *</label>
                  <select v-model="formEdit.jenis_acara" class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all font-semibold">
                    <option value="Sukan & Rekreasi">Sukan & Rekreasi</option>
                    <option value="Majlis & Jamuan">Majlis & Jamuan</option>
                    <option value="Mesyuarat / AGM">Mesyuarat / AGM</option>
                    <option value="Aktiviti Luar">Aktiviti Luar (Outdoor)</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Status Acara</label>
                  <select v-model="formEdit.status" class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all font-semibold">
                    <option value="AKTIF">AKTIF</option>
                    <option value="SELESAI">SELESAI</option>
                    <option value="DITUTUP">DITUTUP / BATAL</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Lokasi (Tempat) *</label>
                  <input v-model="formEdit.lokasi" type="text" class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
                </div>
              </div>

              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Keterangan / Aturcara</label>
                <textarea v-model="formEdit.keterangan" rows="3" class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Tarikh Acara *</label>
                  <input v-model="formEdit.tarikh_acara" type="date" class="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
                </div>
                <div>
                  <label class="text-rose-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Tutup Pendaftaran *</label>
                  <input v-model="formEdit.tarikh_tutup" type="date" class="w-full bg-rose-50 border border-rose-200 text-rose-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"/>
                </div>
              </div>

              <div class="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/50 text-center relative hover:bg-gray-50 transition-colors mt-2">
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 block">Ganti Poster (Biarkan kosong jika kekal)</label>
                <input type="file" @change="handlePosterEdit" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div class="flex flex-col items-center justify-center pointer-events-none">
                  <svg class="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span v-if="posterFiles.length === 0" class="text-xs text-gray-500 mt-1">Pilih sehingga 5 gambar baharu</span>
                  <div v-else class="flex flex-wrap gap-2 justify-center mt-2">
                    <span v-for="(file, i) in posterFiles" :key="i" class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-medium border border-emerald-200">
                      {{ file.name }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button @click="isEditMode = false" class="px-5 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-xs font-bold transition-colors">Batal Edit</button>
                <button @click="simpanEdit" :disabled="saving" class="bg-[#0F4C3A] text-white hover:bg-[#166b52] px-6 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-60">
                  {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModalPeserta" class="fixed inset-0 z-[100] bg-gray-50 flex flex-col h-screen overflow-hidden">
          
          <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div class="flex items-center gap-4">
              <button @click="showModalPeserta = false" class="text-gray-500 hover:text-[#0F4C3A] bg-gray-100 hover:bg-emerald-50 p-2 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              </button>
              <div>
                <h3 class="text-gray-900 font-bold text-lg leading-tight">Urus Peserta: {{ acara_dipilih?.nama_acara }}</h3>
                <p class="text-[#0F4C3A] text-[11px] font-bold uppercase tracking-wider mt-0.5">Jumlah Berdaftar: {{ pesertaTertapis.length }} Orang</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="relative hidden sm:block">
                <input v-model="carianPeserta" type="text" placeholder="Cari nama atau penempatan..."
                  class="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 transition-all"/>
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <button @click="eksportPesertaCSV" class="text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Eksport CSV
              </button>
            </div>
          </div>

          <div class="sm:hidden px-4 py-3 bg-white border-b border-gray-100 shrink-0">
            <input v-model="carianPeserta" type="text" placeholder="Cari peserta..."
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#0F4C3A] transition-all"/>
          </div>

          <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
              <div class="overflow-x-auto flex-1">
                <table class="w-full text-sm text-left">
                  <thead class="sticky top-0 bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200 z-10">
                    <tr>
                      <th class="px-5 py-4 font-bold">Nama Ahli & Emel</th>
                      <th class="px-4 py-4 font-bold">PTJ / Penempatan</th>
                      <th class="px-4 py-4 font-bold">Gred & Saiz Baju</th>
                      <th class="px-4 py-4 font-bold">Kategori/Sukan</th>
                      <th class="px-4 py-4 font-bold">Catatan</th>
                      <th class="px-4 py-4 font-bold text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-if="loadingPeserta">
                      <td colspan="6" class="px-5 py-16 text-center text-gray-500">
                        <div class="flex items-center justify-center gap-2"><svg class="animate-spin w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Memuatkan...</div>
                      </td>
                    </tr>
                    <tr v-else-if="pesertaTertapis.length === 0">
                      <td colspan="6" class="px-5 py-16 text-center text-gray-500 font-medium">Tiada peserta dijumpai.</td>
                    </tr>
                    <tr v-for="(p, i) in pesertaTertapis" :key="i" class="hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5">
                        <p class="text-gray-900 font-bold text-xs">{{ p.nama_pegawai }}</p>
                        <p class="text-gray-500 text-[10px] font-mono mt-0.5">{{ p.no_kp }}</p>
                      </td>
                      <td class="px-4 py-3.5 text-gray-700 text-[11px] font-medium max-w-[200px] truncate" :title="p.penempatan">
                        {{ p.penempatan || '—' }}
                      </td>
                      <td class="px-4 py-3.5">
                        <div class="flex items-center gap-2">
                          <span class="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold">{{ p.gred_sspa || '—' }}</span>
                          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">Saiz: {{ p.saiz_baju || '?' }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3.5">
                        <span class="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">{{ p.kategori || 'Umum' }}</span>
                      </td>
                      <td class="px-4 py-3.5 text-gray-600 text-[11px] max-w-[150px] truncate" :title="p.catatan">
                        {{ p.catatan || '—' }}
                      </td>
                      <td class="px-4 py-3.5 text-center">
                        <button class="text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-100">Buang</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

const senaraiAcara    = ref([]);
const peserta         = ref([]);
const carianPeserta   = ref('');
const loading         = ref(true);
const loadingPeserta  = ref(false);
const saving          = ref(false);

const showModalBaru   = ref(false);
const showModalDetail = ref(false);
const isEditMode      = ref(false);
const showModalPeserta= ref(false);

const acara_dipilih   = ref(null);
const mesejBaru       = ref(null);
const posterFiles     = ref([]);

const formBaru = ref({
  nama_acara: '', jenis_acara: 'Sukan & Rekreasi', lokasi: '', keterangan: '',
  tarikh_acara: '', tarikh_tutup: '', emel_urusetia: '', no_tel_urusetia: '',
});

const formEdit = ref({});

const formatTarikh = (t) => t ? new Date(t).toISOString().split('T')[0] : ''; // Format untuk input date

// Carian & Filter Peserta
const pesertaTertapis = computed(() => {
  if (!carianPeserta.value) return peserta.value;
  const cari = carianPeserta.value.toLowerCase();
  return peserta.value.filter(p => 
    (p.nama_pegawai || '').toLowerCase().includes(cari) ||
    (p.penempatan || '').toLowerCase().includes(cari) ||
    (p.kategori || '').toLowerCase().includes(cari)
  );
});

// ── PENGENDALIAN JSON GAMBAR ──
const dapatkanPosterUtama = (posterStr) => {
  if (!posterStr) return null;
  try { const arr = JSON.parse(posterStr); return Array.isArray(arr) && arr.length > 0 ? arr[0] : posterStr; } 
  catch (e) { return posterStr; }
};
const dapatkanSemuaPoster = (posterStr) => {
  if (!posterStr) return [];
  try { const arr = JSON.parse(posterStr); return Array.isArray(arr) ? arr : [posterStr]; } 
  catch (e) { return [posterStr]; }
};
const kiraBilanganGambar = (posterStr) => dapatkanSemuaPoster(posterStr).length;

// ── API: Muat Acara ──
const muatAcara = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/acara/admin/semua');
    if (data.success) senaraiAcara.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Buka Modal Baharu ──
const bukaModalBaru = () => {
  formBaru.value = { nama_acara: '', jenis_acara: 'Sukan & Rekreasi', lokasi: '', keterangan: '', tarikh_acara: '', tarikh_tutup: '', emel_urusetia: '', no_tel_urusetia: '' };
  posterFiles.value = []; mesejBaru.value = null; showModalBaru.value = true;
};
const handlePoster = (e) => { posterFiles.value = Array.from(e.target.files).slice(0, 5); };
const handlePosterEdit = (e) => { posterFiles.value = Array.from(e.target.files).slice(0, 5); };

const simpanAcara = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    Object.entries(formBaru.value).forEach(([k, v]) => fd.append(k, v));
    posterFiles.value.forEach(file => fd.append('poster', file));
    await api.post('/acara/admin/cipta', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    await muatAcara();
    showModalBaru.value = false;
  } catch (e) { alert("Ralat menyimpan acara."); } 
  finally { saving.value = false; }
};

// ── Lihat Butiran & Edit ──
const paparButiran = (acara) => {
  acara_dipilih.value = acara;
  isEditMode.value = false;
  showModalDetail.value = true;
};

const bukaModEdit = () => {
  formEdit.value = { ...acara_dipilih.value };
  // Format tarikh ke YYYY-MM-DD untuk input type date
  formEdit.value.tarikh_acara = formatTarikh(acara_dipilih.value.tarikh_acara);
  formEdit.value.tarikh_tutup = formatTarikh(acara_dipilih.value.tarikh_tutup);
  posterFiles.value = [];
  isEditMode.value = true;
};

const simpanEdit = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    Object.entries(formEdit.value).forEach(([k, v]) => fd.append(k, v));
    posterFiles.value.forEach(file => fd.append('poster', file));

    await api.put(`/acara/admin/kemaskini/${acara_dipilih.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert("Berjaya dikemaskini.");
    showModalDetail.value = false;
    await muatAcara();
  } catch (e) { alert("Gagal kemaskini."); }
  finally { saving.value = false; }
};

const padamAcara = async (id) => {
  if (!confirm("Padam acara ini secara kekal? Peserta juga akan dipadam.")) return;
  try {
    await api.delete(`/acara/admin/padam/${id}`);
    alert("Berjaya dipadam.");
    showModalDetail.value = false;
    await muatAcara();
  } catch (e) { alert("Gagal memadam acara."); }
};

// ── Urus Peserta (Full Screen) ──
const bukaPeserta = async (acara) => {
  acara_dipilih.value = acara;
  carianPeserta.value = '';
  showModalPeserta.value = true;
  loadingPeserta.value = true;
  peserta.value = [];
  try {
    const { data } = await api.get(`/acara/admin/peserta/${acara.id}`);
    if (data.success) peserta.value = data.data;
  } catch (e) { console.error(e); }
  finally { loadingPeserta.value = false; }
};

const eksportPesertaCSV = () => {
  const headers = 'Nama,No KP,Penempatan,Saiz Baju,Kategori,Tarikh Daftar,Catatan\n';
  const rows = pesertaTertapis.value.map(p =>
    `"${p.nama_pegawai}","${p.no_kp}","${p.penempatan || ''}","${p.saiz_baju || ''}","${p.kategori || 'Umum'}","${p.tarikh_daftar || ''}","${p.catatan || ''}"`
  ).join('\n');
  const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); 
  const a = document.createElement('a'); a.href = url; a.download = `peserta.csv`; a.click();
  URL.revokeObjectURL(url);
};

onMounted(muatAcara);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
</style>