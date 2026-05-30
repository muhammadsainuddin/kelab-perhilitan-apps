<template>
  <div class="space-y-5 font-sans text-gray-900 pb-10">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-bold text-xl text-gray-900">Acara & Aktiviti</h2>
        <p class="text-gray-400 text-xs mt-0.5">Urus hebahan, peserta, dan status acara kelab.</p>
      </div>
      <button @click="bukaModalBaru"
        class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm w-fit">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Buka Acara Baharu
      </button>
    </div>

    <!-- FILTER STATUS -->
    <div class="flex gap-1.5 flex-wrap">
      <button v-for="s in statusFilter" :key="s.val"
        @click="filterStatus = s.val"
        :class="['px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all', filterStatus === s.val ? s.aktifClass : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
        {{ s.label }}
        <span class="ml-1 opacity-70">{{ kiraBilAcara(s.val) }}</span>
      </button>
    </div>

    <!-- GRID ACARA -->
    <div v-if="loading" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-64 rounded-2xl bg-white border border-gray-200 animate-pulse"/>
    </div>

    <div v-else-if="acaraTertapis.length === 0"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
      <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
        <svg class="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      </div>
      <p class="text-gray-500 font-medium text-sm">Tiada acara dalam kategori ini.</p>
    </div>

    <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="acara in acaraTertapis" :key="acara.id"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-[#0F4C3A]/30 transition-all flex flex-col group">

        <!-- Poster -->
        <div class="relative h-36 bg-gray-100 overflow-hidden cursor-pointer" @click="bukaDetail(acara)">
          <img v-if="posterUtama(acara.poster)"
            :src="`${apiBase}/uploads/images/${posterUtama(acara.poster)}`"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-white text-[10px] font-bold uppercase tracking-wider">Lihat Butiran →</span>
          </div>
          <!-- Badges -->
          <div class="absolute top-2.5 right-2.5 flex gap-1.5">
            <span v-if="bilanganPoster(acara.poster) > 1" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center gap-1">
              <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ bilanganPoster(acara.poster) }}
            </span>
            <span :class="['text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide backdrop-blur-sm', badgeAcara(acara.status)]">
              {{ acara.status }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4 flex-1 flex flex-col gap-2">
          <span class="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase w-fit">
            {{ acara.jenis_acara || 'Umum' }}
          </span>
          <h3 class="text-gray-900 font-bold text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#0F4C3A] transition-colors" @click="bukaDetail(acara)">
            {{ acara.nama_acara }}
          </h3>
          <div class="space-y-1 mt-auto">
            <p class="text-gray-500 text-[11px] flex items-center gap-1.5 font-medium">
              <svg class="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ paparTarikh(acara.tarikh_acara) }}
            </p>
            <p v-if="acara.lokasi" class="text-gray-500 text-[11px] flex items-center gap-1.5 font-medium truncate">
              <svg class="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ acara.lokasi }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 pb-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600">{{ acara.jumlah_peserta || 0 }}</span>
            <span class="text-[10px] text-gray-400 font-medium">Peserta</span>
          </div>
          <div class="flex gap-1.5">
            <button @click="bukaEdit(acara)" class="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200">
              Edit
            </button>
            <button @click="bukaPeserta(acara)"
              class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A] hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-[#0F4C3A]/20 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              Peserta
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- ══════════════════════════════════════ -->
    <!-- MODAL: CIPTA ACARA BAHARU             -->
    <!-- ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalBaru" class="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="tutupModalBaru">
          <div class="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col border border-gray-200">

            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="font-black text-gray-900">Buka Acara Baharu</h3>
                <p class="text-[10px] text-gray-400 mt-0.5">Isikan maklumat acara. Status akan ditetapkan AKTIF secara automatik.</p>
              </div>
              <button @click="tutupModalBaru" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4 custom-scrollbar">

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Acara *</label>
                  <input v-model="formBaru.nama_acara" type="text" placeholder="Cth: Hari Sukan Tahunan 2026"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all" :class="{ 'border-rose-400': ralat.nama_acara }"/>
                  <p v-if="ralat.nama_acara" class="text-[10px] text-rose-500 mt-1">{{ ralat.nama_acara }}</p>
                </div>

                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Jenis Acara *</label>
                  <select v-model="formBaru.jenis_acara" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all">
                    <option value="Sukan & Rekreasi">Sukan & Rekreasi</option>
                    <option value="Majlis & Jamuan">Majlis & Jamuan</option>
                    <option value="Mesyuarat / AGM">Mesyuarat / AGM</option>
                    <option value="Aktiviti Luar">Aktiviti Luar (Outdoor)</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Lokasi</label>
                  <input v-model="formBaru.lokasi" type="text" placeholder="Cth: Padang Kawad JPM"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>

                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Tarikh Acara *</label>
                  <input v-model="formBaru.tarikh_acara" type="date" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"
                    :class="{ 'border-rose-400': ralat.tarikh_acara }"/>
                  <p v-if="ralat.tarikh_acara" class="text-[10px] text-rose-500 mt-1">{{ ralat.tarikh_acara }}</p>
                </div>

                <div>
                  <label class="text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-1 block">Tutup Pendaftaran</label>
                  <input v-model="formBaru.tarikh_tutup" type="date" class="w-full bg-rose-50 border border-rose-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 transition-all"/>
                </div>

                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">E-mel Urusetia</label>
                  <input v-model="formBaru.emel_urusetia" type="email" placeholder="urusetia@perhilitan.gov.my"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>

                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">No. Tel Urusetia</label>
                  <input v-model="formBaru.no_tel_urusetia" type="tel" placeholder="03-XXXXXXXX"
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>

                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Keterangan / Aturcara</label>
                  <textarea v-model="formBaru.keterangan" rows="3" placeholder="Keterangan ringkas program, aturcara, syarat penyertaan..."
                    class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all resize-none"></textarea>
                </div>
              </div>

              <!-- Upload Poster -->
              <div>
                <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Poster / Gambar (sehingga 5 gambar)</label>
                <label class="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-gray-100 hover:border-[#0F4C3A]/40 cursor-pointer transition-all text-center relative">
                  <svg class="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span v-if="posterBaru.length === 0" class="text-xs text-gray-400">Klik untuk pilih gambar atau seret ke sini</span>
                  <div v-else class="flex flex-wrap gap-1.5 justify-center">
                    <span v-for="(f, i) in posterBaru" :key="i" class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium">{{ f.name }}</span>
                  </div>
                  <input type="file" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="e => posterBaru = Array.from(e.target.files).slice(0,5)"/>
                </label>
              </div>

              <!-- Mesej Ralat/Berjaya -->
              <Transition name="fade">
                <div v-if="mesej" :class="['text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border', mesej.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesej.text }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 rounded-b-[24px] bg-white">
              <button @click="tutupModalBaru" class="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-bold transition-colors">Batal</button>
              <button @click="simpanAcara" :disabled="saving" class="px-7 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Buka Acara' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ══════════════════════════════════════ -->
    <!-- MODAL: LIHAT BUTIRAN                  -->
    <!-- ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalDetail" class="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showModalDetail = false">
          <div class="bg-white rounded-[24px] w-full max-w-xl shadow-2xl max-h-[92vh] flex flex-col border border-gray-200">

            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 class="font-black text-gray-900 text-sm">Butiran Acara</h3>
              <button @click="showModalDetail = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4 custom-scrollbar">
              <!-- Poster gallery -->
              <div v-if="bilanganPoster(acaraDipilih?.poster) > 0" class="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                <img v-for="(img, i) in semuaPoster(acaraDipilih?.poster)" :key="i"
                  :src="`${apiBase}/uploads/images/${img}`"
                  class="h-28 w-auto object-cover rounded-xl border border-gray-200 shadow-sm shrink-0"/>
              </div>

              <div>
                <div class="flex items-start gap-2 flex-wrap mb-1">
                  <span class="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">{{ acaraDipilih?.jenis_acara }}</span>
                  <span :class="['text-[9px] font-bold px-2 py-0.5 rounded uppercase', badgeAcara(acaraDipilih?.status)]">{{ acaraDipilih?.status }}</span>
                </div>
                <h2 class="text-base font-black text-gray-900 leading-snug">{{ acaraDipilih?.nama_acara }}</h2>
              </div>

              <div class="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                <div><p class="text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Tarikh Acara</p><p class="font-bold text-gray-900">{{ paparTarikh(acaraDipilih?.tarikh_acara) }}</p></div>
                <div><p class="text-rose-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Tutup Daftar</p><p class="font-bold text-rose-600">{{ paparTarikh(acaraDipilih?.tarikh_tutup) || '—' }}</p></div>
                <div class="col-span-2"><p class="text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Lokasi</p><p class="font-bold text-gray-900">{{ acaraDipilih?.lokasi || '—' }}</p></div>
                <div v-if="acaraDipilih?.emel_urusetia"><p class="text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">E-mel Urusetia</p><p class="font-medium text-gray-700">{{ acaraDipilih.emel_urusetia }}</p></div>
                <div v-if="acaraDipilih?.no_tel_urusetia"><p class="text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Tel Urusetia</p><p class="font-medium text-gray-700">{{ acaraDipilih.no_tel_urusetia }}</p></div>
              </div>

              <div v-if="acaraDipilih?.keterangan">
                <p class="text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-1">Keterangan</p>
                <p class="text-gray-700 text-xs whitespace-pre-wrap leading-relaxed">{{ acaraDipilih.keterangan }}</p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <button @click="pahamPadam(acaraDipilih?.id)" class="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors border border-rose-100">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Padam
                </button>
                <button @click="bukaEditDariDetail" class="text-sm bg-[#0F4C3A] text-white hover:bg-[#155d47] px-5 py-2 rounded-xl font-bold transition-colors shadow-sm">
                  Kemas Kini Maklumat
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ══════════════════════════════════════ -->
    <!-- MODAL: EDIT ACARA                     -->
    <!-- ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalEdit" class="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showModalEdit = false">
          <div class="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col border border-gray-200">

            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="font-black text-gray-900">Kemaskini Acara</h3>
                <p class="text-[10px] text-gray-400 font-mono mt-0.5">ID: {{ formEdit.id }}</p>
              </div>
              <button @click="showModalEdit = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4 custom-scrollbar">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Acara *</label>
                  <input v-model="formEdit.nama_acara" type="text" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Jenis Acara</label>
                  <select v-model="formEdit.jenis_acara" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all">
                    <option value="Sukan & Rekreasi">Sukan & Rekreasi</option>
                    <option value="Majlis & Jamuan">Majlis & Jamuan</option>
                    <option value="Mesyuarat / AGM">Mesyuarat / AGM</option>
                    <option value="Aktiviti Luar">Aktiviti Luar (Outdoor)</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Status</label>
                  <select v-model="formEdit.status" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all">
                    <option value="AKTIF">AKTIF</option>
                    <option value="SELESAI">SELESAI</option>
                    <option value="DITUTUP">DITUTUP / BATAL</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Lokasi</label>
                  <input v-model="formEdit.lokasi" type="text" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Tarikh Acara</label>
                  <input v-model="formEdit.tarikh_acara" type="date" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-1 block">Tutup Pendaftaran</label>
                  <input v-model="formEdit.tarikh_tutup" type="date" class="w-full bg-rose-50 border border-rose-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10 transition-all"/>
                </div>
                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">E-mel Urusetia</label>
                  <input v-model="formEdit.emel_urusetia" type="email" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>
                <div>
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">No. Tel Urusetia</label>
                  <input v-model="formEdit.no_tel_urusetia" type="tel" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"/>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Keterangan</label>
                  <textarea v-model="formEdit.keterangan" rows="3" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all resize-none"></textarea>
                </div>
              </div>

              <div>
                <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Ganti Poster (kosongkan jika kekal)</label>
                <label class="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-center relative">
                  <span v-if="posterEdit.length === 0" class="text-xs text-gray-400">Klik untuk pilih gambar baharu</span>
                  <div v-else class="flex flex-wrap gap-1.5 justify-center">
                    <span v-for="(f,i) in posterEdit" :key="i" class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">{{ f.name }}</span>
                  </div>
                  <input type="file" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="e => posterEdit = Array.from(e.target.files).slice(0,5)"/>
                </label>
              </div>

              <Transition name="fade">
                <div v-if="mesejEdit" :class="['text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border', mesejEdit.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesejEdit.text }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 rounded-b-[24px] bg-white">
              <button @click="showModalEdit = false" class="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-bold transition-colors">Batal</button>
              <button @click="simpanEdit" :disabled="saving" class="px-7 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ══════════════════════════════════════ -->
    <!-- FULLSCREEN: URUS PESERTA              -->
    <!-- ══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModalPeserta" class="fixed inset-0 z-[110] bg-gray-50 flex flex-col h-screen overflow-hidden">

          <div class="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
            <div class="flex items-center gap-3">
              <button @click="showModalPeserta = false" class="text-gray-500 hover:text-[#0F4C3A] bg-gray-100 hover:bg-emerald-50 p-2 rounded-xl transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              </button>
              <div>
                <h3 class="text-gray-900 font-bold text-sm leading-tight">Peserta: {{ acaraDipilih?.nama_acara }}</h3>
                <p class="text-[#0F4C3A] text-[10px] font-bold uppercase tracking-wider mt-0.5">{{ pesertaTertapis.length }} Orang Berdaftar</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative hidden sm:block">
                <input v-model="carianPeserta" type="text" placeholder="Cari nama, penempatan..."
                  class="w-56 bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-[#0F4C3A] transition-all"/>
                <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <button @click="eksportPesertaCSV" class="text-xs text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors font-bold flex items-center gap-1.5 shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Eksport CSV
              </button>
            </div>
          </div>

          <div class="sm:hidden px-4 py-2.5 bg-white border-b border-gray-100 shrink-0">
            <input v-model="carianPeserta" type="text" placeholder="Cari peserta..."
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-[#0F4C3A]"/>
          </div>

          <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left">
                  <thead class="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th class="px-5 py-3.5 font-bold">Nama & No. KP</th>
                      <th class="px-4 py-3.5 font-bold hidden sm:table-cell">Penempatan</th>
                      <th class="px-4 py-3.5 font-bold hidden md:table-cell">Gred & Saiz</th>
                      <th class="px-4 py-3.5 font-bold">Kategori</th>
                      <th class="px-4 py-3.5 font-bold hidden lg:table-cell">Catatan</th>
                      <th class="px-4 py-3.5 font-bold hidden lg:table-cell">Tarikh Daftar</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-if="loadingPeserta">
                      <td colspan="6" class="px-5 py-14 text-center text-gray-400">
                        <div class="flex items-center justify-center gap-2"><svg class="animate-spin w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memuatkan...</div>
                      </td>
                    </tr>
                    <tr v-else-if="pesertaTertapis.length === 0">
                      <td colspan="6" class="px-5 py-14 text-center text-gray-400 font-medium">Tiada peserta dijumpai.</td>
                    </tr>
                    <tr v-for="p in pesertaTertapis" :key="p.id" class="hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3">
                        <p class="font-bold text-gray-900">{{ p.nama_pegawai }}</p>
                        <p class="text-gray-400 font-mono text-[9px] mt-0.5">{{ p.no_kp }}</p>
                      </td>
                      <td class="px-4 py-3 hidden sm:table-cell text-gray-600 font-medium max-w-[160px] truncate">{{ p.penempatan || '—' }}</td>
                      <td class="px-4 py-3 hidden md:table-cell">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 rounded text-[9px] font-bold">{{ p.gred_sspa || '—' }}</span>
                          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-bold">{{ p.saiz_baju || '?' }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3"><span class="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{{ p.kategori || 'Umum' }}</span></td>
                      <td class="px-4 py-3 hidden lg:table-cell text-gray-500 max-w-[140px] truncate" :title="p.catatan">{{ p.catatan || '—' }}</td>
                      <td class="px-4 py-3 hidden lg:table-cell text-gray-400 font-mono text-[9px]">{{ p.tarikh_daftar ? new Date(p.tarikh_daftar).toLocaleDateString('ms-MY') : '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p class="text-[10px] text-gray-400 font-medium">Jumlah: <span class="font-black text-gray-700">{{ pesertaTertapis.length }}</span> peserta</p>
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

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const senaraiAcara   = ref([]);
const peserta        = ref([]);
const carianPeserta  = ref('');
const filterStatus   = ref('SEMUA');
const loading        = ref(true);
const loadingPeserta = ref(false);
const saving         = ref(false);

const showModalBaru   = ref(false);
const showModalDetail = ref(false);
const showModalEdit   = ref(false);
const showModalPeserta= ref(false);

const acaraDipilih = ref(null);
const mesej        = ref(null);
const mesejEdit    = ref(null);
const ralat        = ref({});
const posterBaru   = ref([]);
const posterEdit   = ref([]);

const formBaru = ref({
  nama_acara: '', jenis_acara: 'Sukan & Rekreasi', lokasi: '',
  keterangan: '', tarikh_acara: '', tarikh_tutup: '',
  emel_urusetia: '', no_tel_urusetia: '',
});

const formEdit = ref({});

// ── Helpers ──
const posterUtama = (s) => {
  if (!s) return null;
  try { const a = JSON.parse(s); return Array.isArray(a) ? a[0] : s; } catch { return s; }
};
const semuaPoster = (s) => {
  if (!s) return [];
  try { const a = JSON.parse(s); return Array.isArray(a) ? a : [s]; } catch { return [s]; }
};
const bilanganPoster = (s) => semuaPoster(s).length;

const paparTarikh = (t) => {
  if (!t) return null;
  // Ambil bahagian tarikh sahaja (YYYY-MM-DD) untuk elak isu UTC timezone
  const d = typeof t === 'string' ? t.substring(0, 10) : new Date(t).toISOString().substring(0, 10);
  const [y, m, day] = d.split('-');
  const bulan = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogs','Sep','Okt','Nov','Dis'];
  return `${parseInt(day)} ${bulan[parseInt(m) - 1]} ${y}`;
};

const tarikhUntukInput = (t) => {
  if (!t) return '';
  if (typeof t === 'string' && t.length >= 10) return t.substring(0, 10);
  return new Date(t).toISOString().substring(0, 10);
};

const badgeAcara = (s) => {
  if (s === 'AKTIF')   return 'bg-emerald-500/90 text-white';
  if (s === 'SELESAI') return 'bg-blue-600/80 text-white';
  return 'bg-gray-700/80 text-white';
};

const statusFilter = [
  { val: 'SEMUA',   label: 'Semua',    aktifClass: 'bg-gray-900 text-white border-gray-900' },
  { val: 'AKTIF',   label: 'Aktif',    aktifClass: 'bg-emerald-600 text-white border-emerald-600' },
  { val: 'SELESAI', label: 'Selesai',  aktifClass: 'bg-blue-600 text-white border-blue-600' },
  { val: 'DITUTUP', label: 'Ditutup',  aktifClass: 'bg-gray-500 text-white border-gray-500' },
];

const acaraTertapis = computed(() =>
  filterStatus.value === 'SEMUA'
    ? senaraiAcara.value
    : senaraiAcara.value.filter(a => a.status === filterStatus.value)
);

const kiraBilAcara = (val) =>
  val === 'SEMUA' ? senaraiAcara.value.length : senaraiAcara.value.filter(a => a.status === val).length;

const pesertaTertapis = computed(() => {
  if (!carianPeserta.value) return peserta.value;
  const c = carianPeserta.value.toLowerCase();
  return peserta.value.filter(p =>
    (p.nama_pegawai || '').toLowerCase().includes(c) ||
    (p.penempatan || '').toLowerCase().includes(c) ||
    (p.kategori || '').toLowerCase().includes(c)
  );
});

// ── API ──
const muatAcara = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/acara/admin/semua');
    if (data.success) senaraiAcara.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Buka Modal Baru ──
const bukaModalBaru = () => {
  formBaru.value = {
    nama_acara: '', jenis_acara: 'Sukan & Rekreasi', lokasi: '',
    keterangan: '', tarikh_acara: '', tarikh_tutup: '',
    emel_urusetia: '', no_tel_urusetia: '',
  };
  posterBaru.value = [];
  ralat.value = {};
  mesej.value = null;
  showModalBaru.value = true;
};

const tutupModalBaru = () => {
  if (saving.value) return;
  showModalBaru.value = false;
};

const simpanAcara = async () => {
  // Validasi asas
  ralat.value = {};
  if (!formBaru.value.nama_acara?.trim()) { ralat.value.nama_acara = 'Nama acara wajib diisi.'; return; }
  if (!formBaru.value.tarikh_acara)       { ralat.value.tarikh_acara = 'Tarikh acara wajib diisi.'; return; }

  saving.value = true;
  mesej.value = null;
  try {
    const fd = new FormData();
    Object.entries(formBaru.value).forEach(([k, v]) => { if (v) fd.append(k, v); });
    posterBaru.value.forEach(f => fd.append('poster', f));

    await api.post('/acara/admin/cipta', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

    mesej.value = { type: 'success', text: 'Acara berjaya dibuka!' };
    await muatAcara();
    setTimeout(() => { showModalBaru.value = false; }, 1200);
  } catch (e) {
    mesej.value = { type: 'error', text: e.response?.data?.message || 'Ralat menyimpan acara.' };
  } finally { saving.value = false; }
};

// ── Detail ──
const bukaDetail = (acara) => {
  acaraDipilih.value = acara;
  showModalDetail.value = true;
};

// ── Edit ──
const bukaEdit = (acara) => {
  acaraDipilih.value = acara;
  formEdit.value = {
    id:              acara.id,
    nama_acara:      acara.nama_acara || '',
    jenis_acara:     acara.jenis_acara || 'Sukan & Rekreasi',
    lokasi:          acara.lokasi || '',
    keterangan:      acara.keterangan || '',
    tarikh_acara:    tarikhUntukInput(acara.tarikh_acara),
    tarikh_tutup:    tarikhUntukInput(acara.tarikh_tutup),
    emel_urusetia:   acara.emel_urusetia || '',
    no_tel_urusetia: acara.no_tel_urusetia || '',
    status:          acara.status || 'AKTIF',
  };
  posterEdit.value = [];
  mesejEdit.value = null;
  showModalEdit.value = true;
};

const bukaEditDariDetail = () => {
  showModalDetail.value = false;
  bukaEdit(acaraDipilih.value);
};

const simpanEdit = async () => {
  saving.value = true;
  mesejEdit.value = null;
  try {
    const fd = new FormData();
    Object.entries(formEdit.value).forEach(([k, v]) => { if (k !== 'id' && v !== null && v !== undefined) fd.append(k, v); });
    posterEdit.value.forEach(f => fd.append('poster', f));

    await api.put(`/acara/admin/kemaskini/${formEdit.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

    mesejEdit.value = { type: 'success', text: 'Acara berjaya dikemas kini!' };
    await muatAcara();
    setTimeout(() => { showModalEdit.value = false; }, 1000);
  } catch (e) {
    mesejEdit.value = { type: 'error', text: e.response?.data?.message || 'Gagal mengemaskini acara.' };
  } finally { saving.value = false; }
};

// ── Padam ──
const pahamPadam = async (id) => {
  if (!confirm('Padam acara ini secara kekal? Semua rekod peserta turut dipadam.')) return;
  try {
    await api.delete(`/acara/admin/padam/${id}`);
    showModalDetail.value = false;
    await muatAcara();
  } catch (e) { alert(e.response?.data?.message || 'Gagal memadam acara.'); }
};

// ── Peserta ──
const bukaPeserta = async (acara) => {
  acaraDipilih.value = acara;
  carianPeserta.value = '';
  peserta.value = [];
  showModalPeserta.value = true;
  loadingPeserta.value = true;
  try {
    const { data } = await api.get(`/acara/admin/peserta/${acara.id}`);
    if (data.success) peserta.value = data.data;
  } catch (e) { console.error(e); }
  finally { loadingPeserta.value = false; }
};

const eksportPesertaCSV = () => {
  const headers = 'Nama,No KP,Penempatan,Gred,Saiz Baju,Kategori,Catatan,Tarikh Daftar\n';
  const rows = pesertaTertapis.value.map(p =>
    `"${p.nama_pegawai}","${p.no_kp}","${p.penempatan||''}","${p.gred_sspa||''}","${p.saiz_baju||''}","${p.kategori||'Umum'}","${p.catatan||''}","${p.tarikh_daftar||''}"`
  ).join('\n');
  const blob = new Blob(['﻿' + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `peserta-${acaraDipilih.value?.nama_acara || 'acara'}.csv`; a.click();
  URL.revokeObjectURL(url);
};

onMounted(muatAcara);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
</style>
