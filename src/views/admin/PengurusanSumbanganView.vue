<template>
  <div class="space-y-6">

    <!-- ── STAT CARDS ── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label"
        class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          :style="`background: ${s.bg}`">
          <svg class="w-5 h-5" :style="`color: ${s.clr}`" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon"/>
          </svg>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">{{ s.label }}</p>
          <p class="text-xl font-black" :style="`color: ${s.clr}`">{{ s.val }}</p>
        </div>
      </div>
    </div>

    <!-- ── TOOLBAR ── -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="flex gap-1.5 bg-gray-100 rounded-xl p-1">
        <button v-for="f in ['Semua','Aktif','Ditutup']" :key="f"
          @click="filter = f"
          :class="['px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                   filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          {{ f }}
          <span v-if="f !== 'Semua'" class="ml-1 px-1.5 py-0.5 rounded-full text-[9px]"
            :class="f === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'">
            {{ f === 'Aktif' ? bilanganAktif : bilanganTutup }}
          </span>
        </button>
      </div>
      <button @click="bukaModalCipta"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white transition-all active:scale-95"
        style="background: #0F4C3A;">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Kempen Baharu
      </button>
    </div>

    <!-- ── SENARAI KEMPEN ── -->
    <div v-if="muatan" class="flex items-center justify-center py-16 text-gray-400">
      <svg class="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>

    <div v-else-if="!senaraiTerpapar.length" class="text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
      </svg>
      <p class="font-bold text-sm">Tiada kempen sumbangan</p>
    </div>

    <div v-else class="grid gap-4">
      <div v-for="k in senaraiTerpapar" :key="k.id"
        class="bg-white rounded-2xl border shadow-sm overflow-hidden"
        :class="k.status === 'AKTIF' ? 'border-emerald-100' : 'border-gray-100'">

        <div class="p-5">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  :class="k.status === 'AKTIF'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'">
                  {{ k.status }}
                </span>
                <span v-if="k.tarikh_tamat" class="text-[9px] text-gray-400 font-medium">
                  Tamat: {{ fmtTarikh(k.tarikh_tamat) }}
                </span>
              </div>
              <h3 class="font-black text-gray-900 text-sm leading-tight">{{ k.tajuk }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">Penerima: <span class="font-bold text-gray-700">{{ k.nama_penerima }}</span></p>
            </div>
            <img v-if="k.qr_code" :src="`${uploadBase}/uploads/images/${k.qr_code}`"
              class="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0" />
            <div v-else class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z"/>
              </svg>
            </div>
          </div>

          <p class="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{{ k.sebab }}</p>

          <!-- Progress -->
          <div class="mb-3">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-bold text-gray-500">Terkumpul</span>
              <span class="text-[10px] font-black text-emerald-700">
                {{ rm(k.jumlah_terkumpul) }}
                <span v-if="k.amaun_sasaran" class="text-gray-400 font-medium"> / {{ rm(k.amaun_sasaran) }}</span>
              </span>
            </div>
            <div v-if="k.amaun_sasaran" class="w-full bg-gray-100 rounded-full h-1.5">
              <div class="h-1.5 rounded-full transition-all"
                style="background: #0F4C3A;"
                :style="`width: ${Math.min(100, (k.jumlah_terkumpul / k.amaun_sasaran) * 100).toFixed(1)}%`"></div>
            </div>
            <p class="text-[9px] text-gray-400 mt-1">{{ k.jumlah_rekod }} rekod sumbangan</p>
          </div>

          <!-- Bank info -->
          <div class="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-4">
            <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            <span class="text-[10px] font-bold text-gray-700">{{ k.nama_bank }}</span>
            <span class="text-[10px] text-gray-400 font-mono">{{ k.no_akaun }}</span>
          </div>

          <!-- Butang -->
          <div class="flex gap-2">
            <button @click="bukaModalRekod(k)"
              class="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all hover:bg-emerald-50 border border-emerald-200 text-emerald-700">
              Lihat Rekod
            </button>
            <button @click="bukaModalEdit(k)"
              class="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all bg-gray-50 hover:bg-gray-100 text-gray-700">
              Kemaskini
            </button>
            <button v-if="k.status === 'AKTIF'" @click="tutupKempen(k)"
              class="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all">
              Tutup
            </button>
            <button v-else @click="bukaKempen(k)"
              class="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-all">
              Buka
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         FULLSCREEN: CIPTA / EDIT KEMPEN
    ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showModalForm"
          class="absolute inset-0 bg-white flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <button @click="showModalForm = false"
              class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div>
              <h3 class="font-black text-gray-900">{{ editId ? 'Kemaskini Kempen' : 'Kempen Sumbangan Baharu' }}</h3>
              <p class="text-xs text-gray-400">{{ editId ? 'Kemaskini maklumat kempen sedia ada' : 'Cipta kempen bantuan untuk ahli yang memerlukan' }}</p>
            </div>
          </div>

          <!-- Content scrollable -->
          <div class="flex-1 overflow-y-auto">
            <form @submit.prevent="simpanKempen" class="max-w-2xl mx-auto p-6 space-y-5">

              <!-- Cari Ahli Penerima (live search) -->
              <div v-if="!editId" class="relative">
                <label class="text-xs font-bold text-gray-600 mb-1 block">Cari Ahli Penerima *</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 16.803z"/>
                  </svg>
                  <input v-model="cariInput" type="text"
                    placeholder="Taip nama atau no. KP (tanpa -)"
                    autocomplete="off"
                    @input="onCariInput"
                    @focus="showDropdown = true"
                    @blur="tutupDropdown"
                    class="w-full pl-9 pr-4 border border-gray-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                  <svg v-if="sedangCari" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>

                <!-- Dropdown hasil -->
                <div v-if="showDropdown && hasilCarian.length"
                  class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <button v-for="a in hasilCarian" :key="a.no_kp"
                    type="button"
                    @mousedown.prevent="pilihAhli(a)"
                    class="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors text-left">
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ a.nama_pegawai }}</p>
                      <p class="text-[10px] font-mono text-gray-400">{{ a.no_kp }}</p>
                    </div>
                    <div v-if="a.no_akaun_bank" class="text-right shrink-0 ml-3">
                      <p class="text-[9px] text-gray-500 font-bold">{{ a.nama_bank }}</p>
                      <p class="text-[9px] font-mono text-gray-400">{{ a.no_akaun_bank }}</p>
                    </div>
                  </button>
                </div>
                <div v-if="showDropdown && cariInput.length >= 2 && !hasilCarian.length && !sedangCari"
                  class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-xs text-gray-400 font-bold">
                  Tiada ahli dijumpai
                </div>

                <!-- Ahli terpilih -->
                <div v-if="namaAhliDijumpai" class="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl" style="background: #ECFDF5; border: 1px solid #A7F3D0;">
                  <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-xs font-black text-emerald-700">{{ namaAhliDijumpai }}</span>
                  <span class="text-[9px] font-mono text-emerald-600 ml-1">{{ form.no_kp_penerima }}</span>
                  <button type="button" @click="resetPilihan"
                    class="ml-auto text-emerald-400 hover:text-emerald-700">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <p v-if="ralat.no_kp" class="mt-1 text-xs text-red-500">{{ ralat.no_kp }}</p>
              </div>

              <!-- Tajuk -->
              <div>
                <label class="text-xs font-bold text-gray-600 mb-1 block">Tajuk Kempen *</label>
                <input v-model="form.tajuk" type="text" placeholder="Contoh: Bantuan Perubatan Pengajian"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
              </div>

              <!-- Sebab -->
              <div>
                <label class="text-xs font-bold text-gray-600 mb-1 block">Keterangan / Sebab *</label>
                <textarea v-model="form.sebab" rows="3" placeholder="Jelaskan situasi yang memerlukan sumbangan..."
                  class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"></textarea>
              </div>

              <!-- Bank -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-gray-600 mb-1 block">Nama Bank *</label>
                  <input v-model="form.nama_bank" type="text" placeholder="Contoh: Maybank"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-600 mb-1 block">No. Akaun *</label>
                  <input v-model="form.no_akaun" type="text" placeholder="Contoh: 1234567890"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
              </div>

              <!-- QR Code -->
              <div>
                <label class="text-xs font-bold text-gray-600 mb-1 block">QR Code Bank</label>
                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-400 transition-all">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    <span class="text-xs font-bold text-gray-500">{{ qrFile ? qrFile.name : 'Muat Naik QR' }}</span>
                    <input type="file" accept="image/*" class="hidden" @change="onQrChange" />
                  </label>
                  <img v-if="qrPreview || (editId && form.qr_code_sedia)"
                    :src="qrPreview || `${uploadBase}/uploads/images/${form.qr_code_sedia}`"
                    class="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                </div>
              </div>

              <!-- Tarikh + Sasaran -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-gray-600 mb-1 block">Tarikh Mula *</label>
                  <input v-model="form.tarikh_mula" type="date"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-600 mb-1 block">Tarikh Tamat</label>
                  <input v-model="form.tarikh_tamat" type="date"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                  <p class="text-[9px] text-gray-400 mt-0.5">Kosongkan = tiada tarikh tamat</p>
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-600 mb-1 block">Sasaran Amaun (RM)</label>
                <input v-model="form.amaun_sasaran" type="number" min="0" step="0.01" placeholder="Contoh: 5000 (Sekiranya perlu)"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
              </div>

              <!-- Toggle FPX -->
              <div class="flex items-center justify-between p-4 rounded-2xl" style="background: #FFFBEB; border: 1px solid rgba(251,191,36,0.25);">
                <div class="flex-1 pr-4">
                  <p class="text-xs font-black text-gray-900">Benarkan Bayaran FPX (ToyyibPay)</p>
                  <p class="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Ahli boleh bayar terus melalui FPX. Caj RM1.00 dikenakan oleh ToyyibPay ke atas penderma.
                    Pastikan <strong>Kod Kategori FPX Sumbangan</strong> sudah ditetapkan dalam Tetapan.
                  </p>
                </div>
                <button type="button" @click="form.allow_fpx = !form.allow_fpx"
                  class="relative inline-flex items-center shrink-0 w-12 h-6 rounded-full transition-all duration-300"
                  :class="form.allow_fpx ? 'bg-[#0F4C3A]' : 'bg-gray-200'">
                  <span class="inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-0.5"
                    :class="form.allow_fpx ? 'translate-x-6' : 'translate-x-0'"></span>
                </button>
              </div>

              <!-- ── Gambar Sokongan ── -->
              <div class="border-t border-gray-100 pt-5">
                <label class="text-xs font-bold text-gray-600 mb-2 block">
                  Gambar Sokongan
                  <span class="font-normal text-gray-400 ml-1">(rumah rosak, sijil perubatan, dll — maks 10)</span>
                </label>

                <!-- Gambar sedia ada (edit mode) -->
                <div v-if="editId && galeriSedia.length" class="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  <div v-for="g in galeriSedia" :key="g.id" class="relative group">
                    <img :src="`${uploadBase}/uploads/images/${g.filename}`"
                      class="w-full aspect-square object-cover rounded-xl border border-gray-200" />
                    <button type="button" @click="hapusGambarSedia(g)"
                      class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Upload baharu -->
                <label class="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                  <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 3.75H3M12 3v9"/>
                  </svg>
                  <span class="text-xs font-bold text-gray-400">
                    {{ gambarPending.length ? `${gambarPending.length} gambar dipilih` : 'Pilih Gambar' }}
                  </span>
                  <input type="file" accept="image/*" multiple class="hidden" @change="onGaleriChange" />
                </label>

                <!-- Preview gambar baharu -->
                <div v-if="gambarPending.length" class="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                  <div v-for="(p, i) in gambarPending" :key="i" class="relative group">
                    <img :src="p.preview" class="w-full aspect-square object-cover rounded-xl border border-gray-200" />
                    <button type="button" @click="buangGambarPending(i)"
                      class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <p v-if="ralat.umum" class="text-xs text-red-500 font-bold bg-red-50 px-3 py-2 rounded-xl">{{ ralat.umum }}</p>

              <button type="submit" :disabled="menyimpan"
                class="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all"
                style="background: #0F4C3A;" :class="menyimpan ? 'opacity-60' : 'hover:opacity-90'">
                {{ menyimpan ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Cipta Kempen') }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════════════
         FULLSCREEN: REKOD SUMBANGAN
    ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showModalRekod" class="absolute inset-0 bg-white flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0">
            <button @click="showModalRekod = false"
              class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all shrink-0">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <h3 class="font-black text-gray-900">Rekod Sumbangan</h3>
              <p class="text-xs text-gray-500 truncate">{{ kempenDipilih?.tajuk }}</p>
            </div>
            <!-- Toggle nama anon -->
            <button @click="tunjukNamaAnon = !tunjukNamaAnon"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
              :class="tunjukNamaAnon ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="tunjukNamaAnon ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4.418-5.373 8-9 8S3 16.418 3 12 8.373 4 12 4s9 3.582 9 8z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18'"/>
              </svg>
              Anon
            </button>
            <!-- Cetak -->
            <button @click="cetakSenaraiSumbangan"
              class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Cetak
            </button>
            <div class="text-right shrink-0">
              <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Terkumpul</p>
              <p class="text-base font-black text-emerald-700">{{ rm(kempenDipilih?.jumlah_terkumpul) }}</p>
            </div>
          </div>

          <!-- Table -->
          <div class="flex-1 overflow-auto">
            <div v-if="muatanRekod" class="flex justify-center py-16">
              <svg class="animate-spin w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
            <div v-else-if="!senaraRekod.length" class="text-center py-16 text-gray-400">
              <p class="text-sm font-bold">Tiada rekod sumbangan lagi</p>
            </div>
            <table v-else class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left px-6 py-3 text-[10px] font-black uppercase tracking-wide text-gray-400">Penyumbang</th>
                  <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wide text-gray-400">Penempatan</th>
                  <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wide text-gray-400">Tarikh</th>
                  <th class="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wide text-gray-400">Kaedah</th>
                  <th class="text-right px-6 py-3 text-[10px] font-black uppercase tracking-wide text-gray-400">Amaun</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="r in senaraRekod" :key="r.id"
                  class="hover:bg-gray-50/50 transition-colors"
                  :class="r.kaedah === 'FPX' && r.status_fpx === 'PENDING' ? 'opacity-60' : ''">
                  <td class="px-6 py-3.5">
                    <div class="flex items-center gap-1.5">
                      <p class="font-bold text-gray-900 text-sm">
                        {{ r.is_anon && !tunjukNamaAnon ? 'Ahli Kelab (Anon)' : (r.nama_sebenar || r.nama_penyumbang) }}
                      </p>
                      <span v-if="r.is_anon" class="text-[7px] font-black px-1.5 py-0.5 rounded-full"
                        :class="tunjukNamaAnon ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'">
                        Anon
                      </span>
                    </div>
                    <p v-if="r.catatan" class="text-xs text-gray-400 italic mt-0.5">{{ r.catatan }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="text-xs text-gray-600">{{ r.penempatan_penyumbang || '—' }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="text-xs text-gray-500 whitespace-nowrap">{{ fmtTarikhMasa(r.tarikh_rekod) }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="text-[9px] font-black px-2 py-0.5 rounded-full"
                      :class="r.kaedah === 'FPX'
                        ? (r.status_fpx === 'BERJAYA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                       : 'bg-amber-50 text-amber-700 border border-amber-200')
                        : 'bg-gray-100 text-gray-500'">
                      {{ r.kaedah === 'FPX' ? (r.status_fpx === 'BERJAYA' ? 'FPX ✓' : 'FPX Menunggu') : 'Manual' }}
                    </span>
                  </td>
                  <td class="px-6 py-3.5 text-right">
                    <span class="font-black" :class="r.kaedah === 'FPX' && r.status_fpx === 'PENDING' ? 'text-gray-400' : 'text-emerald-700'">
                      {{ rm(r.amaun) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Notifikasi toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white"
          :class="toast.ok ? 'bg-emerald-700' : 'bg-red-600'">
          {{ toast.mesej }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';

const kempen   = ref([]);
const muatan   = ref(false);
const filter   = ref('Semua');

const showModalForm = ref(false);
const showModalRekod = ref(false);
const editId         = ref(null);
const kempenDipilih  = ref(null);
const senaraRekod   = ref([]);
const muatanRekod   = ref(false);
const menyimpan      = ref(false);
const namaAhliDijumpai = ref('');
const tunjukNamaAnon = ref(false);

// ── Live search ahli ──
const cariInput    = ref('');
const hasilCarian  = ref([]);
const showDropdown = ref(false);
const sedangCari   = ref(false);
let   cariTimer    = null;

// ── Galeri gambar sokongan ──
const galeriSedia    = ref([]);   // gambar sedia ada (edit mode)
const gambarPending  = ref([]);   // gambar baharu yang dipilih (belum upload)

const form = ref({
  no_kp_penerima: '',
  tajuk: '', sebab: '',
  nama_bank: '', no_akaun: '',
  amaun_sasaran: '',
  tarikh_mula: new Date().toISOString().substring(0, 10),
  tarikh_tamat: '',
  qr_code_sedia: ''
});
const ralat = ref({ no_kp: '', umum: '' });
const qrFile    = ref(null);
const qrPreview = ref('');

const toast = ref({ show: false, ok: true, mesej: '' });

// ── Helpers ──
const rm = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtTarikh = (t) => {
  if (!t) return '';
  return t.substring(0, 10).split('-').reverse().join('/');
};
const fmtTarikhMasa = (t) => {
  if (!t) return '';
  const d = t.substring(0, 10).split('-').reverse().join('/');
  const m = t.substring(11, 16);
  return `${d} ${m}`;
};
const tunjukToast = (mesej, ok = true) => {
  toast.value = { show: true, ok, mesej };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

// ── Computed ──
const senaraiTerpapar = computed(() => {
  if (filter.value === 'Aktif') return kempen.value.filter(k => k.status === 'AKTIF');
  if (filter.value === 'Ditutup') return kempen.value.filter(k => k.status === 'TUTUP');
  return kempen.value;
});
const bilanganAktif  = computed(() => kempen.value.filter(k => k.status === 'AKTIF').length);
const bilanganTutup  = computed(() => kempen.value.filter(k => k.status === 'TUTUP').length);
const jumlahTerkumpul = computed(() => kempen.value.reduce((s, k) => s + parseFloat(k.jumlah_terkumpul || 0), 0));
const jumlahRekod    = computed(() => kempen.value.reduce((s, k) => s + parseInt(k.jumlah_rekod || 0), 0));

const stats = computed(() => [
  { label: 'Kempen Aktif', val: bilanganAktif.value, bg: '#ECFDF5', clr: '#047857', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  { label: 'Ditutup', val: bilanganTutup.value, bg: '#F9FAFB', clr: '#6B7280', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Jumlah Rekod', val: jumlahRekod.value, bg: '#EFF6FF', clr: '#1D4ED8', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Terkumpul', val: rm(jumlahTerkumpul.value), bg: '#FFFBEB', clr: '#92400E', icon: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
]);

// ── Muat data ──
const muatKempen = async () => {
  muatan.value = true;
  try {
    const res = await api.get('/admin/sumbangan/kempen');
    kempen.value = res.data.data;
  } catch (e) { console.error(e); }
  finally { muatan.value = false; }
};

// ── Live search ahli ──
const onCariInput = () => {
  namaAhliDijumpai.value = '';
  form.value.no_kp_penerima = '';
  ralat.value.no_kp = '';
  clearTimeout(cariTimer);
  if (cariInput.value.length < 2) { hasilCarian.value = []; return; }
  sedangCari.value = true;
  cariTimer = setTimeout(async () => {
    try {
      const res = await api.get('/admin/sumbangan/cari-ahli', { params: { q: cariInput.value } });
      hasilCarian.value = res.data.data || [];
    } catch { hasilCarian.value = []; }
    finally { sedangCari.value = false; }
  }, 300);
};

const pilihAhli = (a) => {
  form.value.no_kp_penerima = a.no_kp;
  namaAhliDijumpai.value    = a.nama_pegawai;
  cariInput.value           = a.nama_pegawai;
  // Auto-isi bank jika ada dalam profil dan belum diisi
  if (a.no_akaun_bank) form.value.no_akaun  = a.no_akaun_bank;
  if (a.nama_bank)     form.value.nama_bank = a.nama_bank;
  showDropdown.value  = false;
  hasilCarian.value   = [];
  ralat.value.no_kp   = '';
};

const tutupDropdown = () => { setTimeout(() => { showDropdown.value = false; }, 150); };

const resetPilihan = () => {
  cariInput.value = '';
  namaAhliDijumpai.value = '';
  form.value.no_kp_penerima = '';
  hasilCarian.value = [];
};

// ── Modal cipta ──
const muatGaleriSedia = async (id) => {
  galeriSedia.value = [];
  try {
    const res = await api.get(`/admin/sumbangan/kempen/${id}/gambar`);
    galeriSedia.value = res.data.data || [];
  } catch (e) { console.error(e); }
};

const onGaleriChange = (e) => {
  const files = Array.from(e.target.files);
  for (const f of files) {
    gambarPending.value.push({ file: f, preview: URL.createObjectURL(f) });
  }
  e.target.value = '';
};

const buangGambarPending = (i) => {
  URL.revokeObjectURL(gambarPending.value[i].preview);
  gambarPending.value.splice(i, 1);
};

const hapusGambarSedia = async (g) => {
  if (!confirm('Padam gambar ini?')) return;
  try {
    await api.delete(`/admin/sumbangan/kempen/${editId.value}/gambar/${g.id}`);
    galeriSedia.value = galeriSedia.value.filter(x => x.id !== g.id);
    tunjukToast('Gambar dipadam.');
  } catch (e) { tunjukToast(e.response?.data?.message || 'Ralat.', false); }
};

const uploadGambarPending = async (kempenId) => {
  if (!gambarPending.value.length) return;
  const fd = new FormData();
  gambarPending.value.forEach(p => fd.append('gambar', p.file));
  try {
    await api.post(`/admin/sumbangan/kempen/${kempenId}/gambar`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    gambarPending.value.forEach(p => URL.revokeObjectURL(p.preview));
    gambarPending.value = [];
  } catch (e) { console.error('[galeri upload]', e); }
};

const bukaModalCipta = () => {
  editId.value = null;
  namaAhliDijumpai.value = '';
  cariInput.value = '';
  hasilCarian.value = [];
  qrFile.value = null;
  qrPreview.value = '';
  ralat.value = { no_kp: '', umum: '' };
  galeriSedia.value = [];
  gambarPending.value = [];
  form.value = {
    no_kp_penerima: '', tajuk: '', sebab: '',
    nama_bank: '', no_akaun: '', amaun_sasaran: '',
    tarikh_mula: new Date().toISOString().substring(0, 10),
    tarikh_tamat: '', qr_code_sedia: '', allow_fpx: false
  };
  showModalForm.value = true;
};

// ── Modal edit ──
const bukaModalEdit = (k) => {
  editId.value = k.id;
  qrFile.value = null;
  qrPreview.value = '';
  ralat.value = { no_kp: '', umum: '' };
  gambarPending.value = [];
  form.value = {
    no_kp_penerima: k.no_kp_penerima,
    tajuk: k.tajuk, sebab: k.sebab,
    nama_bank: k.nama_bank, no_akaun: k.no_akaun,
    amaun_sasaran: k.amaun_sasaran || '',
    tarikh_mula: k.tarikh_mula?.substring(0, 10) || '',
    tarikh_tamat: k.tarikh_tamat?.substring(0, 10) || '',
    qr_code_sedia: k.qr_code || '',
    allow_fpx: !!k.allow_fpx
  };
  muatGaleriSedia(k.id);
  showModalForm.value = true;
};

// ── Handle QR file ──
const onQrChange = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  qrFile.value = f;
  qrPreview.value = URL.createObjectURL(f);
};

// ── Simpan kempen ──
const simpanKempen = async () => {
  ralat.value = { no_kp: '', umum: '' };
  if (!editId.value && !namaAhliDijumpai.value) {
    ralat.value.no_kp = 'Sila cari dan sahkan no. KP penerima terlebih dahulu.';
    return;
  }
  if (!form.value.tajuk || !form.value.sebab || !form.value.nama_bank || !form.value.no_akaun || !form.value.tarikh_mula) {
    ralat.value.umum = 'Sila lengkapkan semua maklumat wajib.';
    return;
  }

  menyimpan.value = true;
  try {
    const fd = new FormData();
    Object.entries(form.value).forEach(([k, v]) => {
      if (k === 'qr_code_sedia') return;
      if (k === 'allow_fpx') { fd.append(k, v ? '1' : '0'); return; }
      if (v !== null && v !== undefined) fd.append(k, v);
    });
    if (qrFile.value) fd.append('qr_code', qrFile.value);

    if (editId.value) {
      await api.put(`/admin/sumbangan/kempen/${editId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await uploadGambarPending(editId.value);
      tunjukToast('Kempen berjaya dikemaskini.');
    } else {
      const res = await api.post('/admin/sumbangan/kempen', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newId = res.data.id;
      if (newId) await uploadGambarPending(newId);
      tunjukToast('Kempen berjaya dicipta.');
    }
    showModalForm.value = false;
    await muatKempen();
  } catch (e) {
    ralat.value.umum = e.response?.data?.message || 'Ralat sistem.';
  } finally {
    menyimpan.value = false;
  }
};

// ── Tutup / Buka kempen ──
const tutupKempen = async (k) => {
  if (!confirm(`Tutup kempen "${k.tajuk}"? Ahli tidak lagi dapat melihatnya dalam news feed.`)) return;
  try {
    await api.put(`/admin/sumbangan/kempen/${k.id}`, new URLSearchParams({ status: 'TUTUP' }));
    tunjukToast('Kempen ditutup.');
    await muatKempen();
  } catch (e) { tunjukToast(e.response?.data?.message || 'Ralat.', false); }
};

const bukaKempen = async (k) => {
  try {
    await api.put(`/admin/sumbangan/kempen/${k.id}`, new URLSearchParams({ status: 'AKTIF' }));
    tunjukToast('Kempen dibuka semula.');
    await muatKempen();
  } catch (e) { tunjukToast(e.response?.data?.message || 'Ralat.', false); }
};

// ── Rekod sumbangan ──
const bukaModalRekod = async (k) => {
  kempenDipilih.value = k;
  senaraRekod.value = [];
  tunjukNamaAnon.value = false;
  showModalRekod.value = true;
  muatanRekod.value = true;
  try {
    const res = await api.get(`/admin/sumbangan/kempen/${k.id}/rekod`);
    senaraRekod.value = res.data.data;
  } catch (e) { console.error(e); }
  finally { muatanRekod.value = false; }
};

// ── Cetak senarai sumbangan ──
const cetakSenaraiSumbangan = () => {
  const k = kempenDipilih.value;
  if (!k) return;

  const rows = senaraRekod.value.map((r, i) => {
    const nama = tunjukNamaAnon.value ? (r.nama_sebenar || r.nama_penyumbang) : r.nama_penyumbang;
    const kaedah = r.kaedah === 'FPX' ? (r.status_fpx === 'BERJAYA' ? 'FPX ✓' : 'FPX Menunggu') : 'Manual';
    const anonBadge = r.is_anon ? ' <span style="font-size:9px;padding:1px 6px;background:#FEF3C7;color:#92400E;border-radius:20px">Anon</span>' : '';
    return `<tr style="border-bottom:1px solid #eee">
      <td style="padding:7px 10px">${i + 1}</td>
      <td style="padding:7px 10px;font-weight:600">${nama}${anonBadge}</td>
      <td style="padding:7px 10px;color:#6b7280">${r.penempatan_penyumbang || '—'}</td>
      <td style="padding:7px 10px;color:#6b7280;font-size:11px">${fmtTarikhMasa(r.tarikh_rekod)}</td>
      <td style="padding:7px 10px">${kaedah}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:700;color:#047857">${r.kaedah === 'FPX' && r.status_fpx === 'PENDING' ? '<span style="color:#d97706">' + rm(r.amaun) + ' (menunggu)</span>' : rm(r.amaun)}</td>
    </tr>`;
  }).join('');

  const jumlahSah = senaraRekod.value
    .filter(r => r.kaedah === 'MANUAL' || r.status_fpx === 'BERJAYA')
    .reduce((s, r) => s + parseFloat(r.amaun), 0);

  const w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(`<!DOCTYPE html><html><head><title>Senarai Sumbangan — ${k.tajuk}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:28px;color:#222;font-size:12px}
  h2{font-size:15px;color:#064E3B;margin-bottom:4px}p{color:#555;font-size:11px;margin-bottom:2px}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th{background:#1e293b;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  .foot{margin-top:20px;padding-top:12px;border-top:2px solid #064E3B;display:flex;justify-content:space-between}
  .tot{font-size:15px;font-weight:900;color:#047857}
  @media print{body{padding:14px}}</style>
  </head><body>
  <h2>Senarai Sumbangan — ${k.tajuk}</h2>
  <p>Penerima: <strong>${k.nama_penerima}</strong>${k.penempatan_penerima ? ' (' + k.penempatan_penerima + ')' : ''}</p>
  <p>Tempoh: ${fmtTarikh(k.tarikh_mula)}${k.tarikh_tamat ? ' — ' + fmtTarikh(k.tarikh_tamat) : ''} &nbsp;|&nbsp; Jumlah Rekod: ${senaraRekod.value.length}</p>
  <table>
    <thead><tr>
      <th style="width:36px">#</th><th>Penyumbang</th><th>Penempatan</th><th>Tarikh</th><th>Kaedah</th><th style="text-align:right">Amaun</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="foot">
    <div><p style="font-size:10px;color:#999">Dicetak: ${new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' })}</p></div>
    <div class="tot">Jumlah Disahkan: ${rm(jumlahSah)}</div>
  </div>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

onMounted(muatKempen);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(24px); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
