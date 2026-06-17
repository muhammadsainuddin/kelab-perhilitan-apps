<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="show"
        class="fixed inset-0 z-[100] flex justify-end"
        style="background: rgba(8,28,21,0.45); backdrop-filter: blur(4px);"
        @click.self="$emit('close')">

        <!-- Side Panel -->
        <div class="relative flex flex-col w-full max-w-2xl h-full bg-white overflow-hidden shadow-2xl">

          <!-- ── TOP BAR ── -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-white z-10">
            <div class="flex items-center gap-3">
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div>
                <p class="text-gray-900 font-black text-sm uppercase tracking-wide leading-none">Profil Ahli 360°</p>
                <p class="text-gray-400 text-xs font-mono mt-0.5">{{ ahliBase?.no_kp }}</p>
              </div>
            </div>
            <button @click="$emit('edit', ahliLengkap)" class="flex items-center gap-2 text-sm font-bold bg-[#0F4C3A] hover:bg-[#155d47] text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Edit Profil
            </button>
          </div>

          <!-- ── LOADING ── -->
          <div v-if="loading" class="flex-1 flex items-center justify-center bg-gray-50">
            <div class="flex flex-col items-center gap-3">
              <svg class="animate-spin w-8 h-8 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">Memuatkan rekod...</p>
            </div>
          </div>

          <!-- ── CONTENT ── -->
          <div v-else class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/60">

            <!-- PROFILE HERO -->
            <div class="bg-white border-b border-gray-100">
              <div class="max-w-5xl mx-auto px-6 py-5">
              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="relative shrink-0">
                  <div class="w-18 h-18 rounded-2xl overflow-hidden bg-linear-to-br from-[#0F4C3A] to-[#08151D] flex items-center justify-center shadow-md">
                    <img v-if="ahliLengkap?.gambar" :src="`${apiBase}/uploads/images/${ahliLengkap.gambar}`" :alt="ahliLengkap?.nama_pegawai || 'Foto ahli'" class="w-full h-full object-cover"/>
                    <span v-else class="text-white text-2xl font-black uppercase">{{ (ahliLengkap?.nama_pegawai || '?').charAt(0) }}</span>
                  </div>
                  <div :class="['absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm', ahliLengkap?.status_ahli === 'aktif' ? 'bg-emerald-400' : 'bg-rose-400']"></div>
                </div>

                <!-- Name + badges -->
                <div class="flex-1 min-w-0 pt-0.5">
                  <h2 class="text-lg font-black text-gray-900 uppercase leading-tight">{{ ahliLengkap?.nama_pegawai || '—' }}</h2>
                  <p class="text-gray-500 text-sm mt-0.5 truncate">{{ ahliLengkap?.penempatan || 'Tiada penempatan' }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span :class="['text-xs font-black px-2.5 py-0.5 rounded-full border uppercase', badgeStatus(ahliLengkap?.status_ahli)]">
                      {{ ahliLengkap?.status_ahli || 'TIDAK AKTIF' }}
                    </span>
                    <span v-if="ahliLengkap?.jawatan_kelab" :class="['text-xs font-bold px-2.5 py-0.5 rounded-full border', badgeJawatan(ahliLengkap?.jawatan_kelab)]">
                      {{ ahliLengkap?.jawatan_kelab }}
                    </span>
                    <span class="text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full font-mono">
                      {{ ahliLengkap?.no_ahli || 'BELUM JANA' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- YURAN STRIP -->
              <div class="mt-4 grid grid-cols-3 gap-3">
                <!-- Yuran bulanan -->
                <div :class="['col-span-1 rounded-xl border p-3.5 text-center', ahliLengkap?.is_paid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200']">
                  <p :class="['text-xs font-bold uppercase tracking-wider', ahliLengkap?.is_paid ? 'text-emerald-500' : 'text-rose-500']">Yuran Bulanan</p>
                  <p :class="['text-xl font-black tabular-nums mt-1', ahliLengkap?.is_paid ? 'text-emerald-700' : 'text-rose-700']">RM {{ parseFloat(ahliLengkap?.yuran_kelab_bulanan || 0).toFixed(2) }}</p>
                  <div :class="['inline-flex items-center gap-1 mt-2 text-xs font-black uppercase px-2.5 py-0.5 rounded-full', ahliLengkap?.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="ahliLengkap?.is_paid" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                    {{ ahliLengkap?.is_paid ? 'BERBAYAR' : 'BELUM BAYAR' }}
                  </div>
                </div>

                <!-- Jumlah sumbangan -->
                <div class="col-span-1 bg-linear-to-br from-[#0F4C3A] to-[#08151D] rounded-xl p-3.5 text-center relative overflow-hidden">
                  <div class="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full pointer-events-none"></div>
                  <p class="text-xs font-bold uppercase tracking-wider text-emerald-300 relative z-10">Jumlah Sumbangan</p>
                  <p class="text-xl font-black tabular-nums mt-1 text-white relative z-10">RM {{ jumlahSumbangan.toFixed(2) }}</p>
                  <p class="text-xs text-white/40 mt-1 relative z-10">Yuran + Kedai</p>
                </div>

                <!-- Gred + saiz + umur -->
                <div class="col-span-1 bg-white border border-gray-200 rounded-xl p-3.5 space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400 font-bold uppercase">Gred</span>
                    <span class="text-sm font-black text-gray-800 uppercase">{{ ahliLengkap?.gred_sspa || '—' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400 font-bold uppercase">Saiz</span>
                    <span class="text-sm font-black text-gray-800 uppercase">{{ ahliLengkap?.saiz_baju || '—' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400 font-bold uppercase">Umur</span>
                    <span class="text-sm font-black text-gray-800">{{ kiraUmur(ahliLengkap?.no_kp) }} thn</span>
                  </div>
                </div>
              </div>
              </div><!-- /max-w-5xl hero -->
            </div>

            <!-- MAKLUMAT GRID -->
            <div class="p-5 space-y-3 max-w-5xl mx-auto">

              <!-- Hubungan + Bank (2 col) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <!-- Maklumat hubungan -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div class="flex items-center gap-2 mb-3.5">
                    <div class="w-7 h-7 bg-sky-100 rounded-lg flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <p class="text-xs font-black text-gray-600 uppercase tracking-wider">Maklumat Peribadi</p>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-400 font-bold uppercase">No. Telefon</p>
                      <p class="text-sm font-bold text-gray-800 font-mono mt-0.5">{{ ahliLengkap?.phone || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 font-bold uppercase">E-mel</p>
                      <p class="text-sm font-bold text-gray-800 truncate mt-0.5">{{ ahliLengkap?.email || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 font-bold uppercase">Kaedah Potongan</p>
                      <span :class="['inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg border mt-0.5', ahliLengkap?.jenis_potongan === 'Potongan Biro angkasa' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200']">
                        {{ ahliLengkap?.jenis_potongan === 'Potongan Biro angkasa' ? 'Biro Angkasa' : 'Bayar Manual / FPX' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Perbankan -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div class="flex items-center gap-2 mb-3.5">
                    <div class="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    </div>
                    <p class="text-xs font-black text-gray-600 uppercase tracking-wider">Perbankan Ahli</p>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-400 font-bold uppercase">Nama Bank</p>
                      <p class="text-sm font-bold text-gray-800 uppercase mt-0.5">{{ ahliLengkap?.nama_bank || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 font-bold uppercase">No. Akaun</p>
                      <p class="text-sm font-bold text-gray-800 font-mono mt-0.5">{{ ahliLengkap?.no_akaun_bank || '—' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Waris -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div class="flex items-center gap-2 mb-3.5">
                  <div class="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  </div>
                  <p class="text-xs font-black text-gray-600 uppercase tracking-wider">Waris / Khairat Kematian</p>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-gray-400 font-bold uppercase">Nama Waris</p>
                    <p class="text-sm font-bold text-gray-800 uppercase mt-0.5">{{ ahliLengkap?.nama_waris || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-bold uppercase">No. Telefon Waris</p>
                    <p class="text-sm font-bold text-gray-800 font-mono mt-0.5">{{ ahliLengkap?.no_phone_waris || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400 font-bold uppercase">Bank Waris</p>
                    <p class="text-sm font-bold text-gray-800 uppercase mt-0.5">{{ ahliLengkap?.nama_bank_waris || '—' }}</p>
                    <p class="text-xs text-gray-400 font-mono mt-0.5">{{ ahliLengkap?.akaun_bank_waris || '' }}</p>
                  </div>
                </div>
              </div>

              <!-- Baju percuma -->
              <div v-if="tuntutBajuPercuma" class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <div class="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg shrink-0">👕</div>
                <div class="flex-1">
                  <p class="text-amber-900 font-bold text-sm">Tuntutan Baju / Item Percuma Kelab</p>
                  <p class="text-amber-600 text-xs mt-0.5">Ahli ini telah menuntut merchandise percuma kelab.</p>
                </div>
                <span class="bg-amber-200 text-amber-900 px-3 py-1 rounded-lg text-xs font-black uppercase shrink-0">Dituntut</span>
              </div>

              <!-- TABS -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="flex border-b border-gray-100 bg-gray-50/80 overflow-x-auto">
                  <button @click="tab = 'kewangan'" :class="['flex items-center gap-1.5 px-5 py-3.5 text-xs font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-wide', tab === 'kewangan' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Sejarah FPX
                    <span v-if="rekodTransaksi.length > 0" :class="['text-xs font-black px-1.5 py-px rounded-full leading-none', tab === 'kewangan' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodTransaksi.length }}</span>
                  </button>
                  <button @click="tab = 'acara'" :class="['flex items-center gap-1.5 px-5 py-3.5 text-xs font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-wide', tab === 'acara' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Acara Disertai
                    <span v-if="rekodAcara.length > 0" :class="['text-xs font-black px-1.5 py-px rounded-full leading-none', tab === 'acara' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodAcara.length }}</span>
                  </button>
                  <button @click="tab = 'kebajikan'" :class="['flex items-center gap-1.5 px-5 py-3.5 text-xs font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-wide', tab === 'kebajikan' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Bantuan
                    <span v-if="rekodBantuan.length > 0" :class="['text-xs font-black px-1.5 py-px rounded-full leading-none', tab === 'kebajikan' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodBantuan.length }}</span>
                  </button>
                  <button v-if="isBiroAngkasa" @click="tab = 'resitba'" :class="['flex items-center gap-1.5 px-5 py-3.5 text-xs font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-wide', tab === 'resitba' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Resit Biro Angkasa
                    <span v-if="rekodResitBA.length > 0" :class="['text-xs font-black px-1.5 py-px rounded-full leading-none', tab === 'resitba' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']">{{ rekodResitBA.length }}</span>
                  </button>
                </div>

                <!-- TAB: Sejarah FPX -->
                <div v-if="tab === 'kewangan'" class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-3 font-bold">Tarikh</th>
                        <th class="px-4 py-3 font-bold">Butiran</th>
                        <th class="px-4 py-3 font-bold text-right">Amaun</th>
                        <th class="px-4 py-3 font-bold text-center">Status</th>
                        <th class="px-4 py-3 font-bold text-center">Resit</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="rekodTransaksi.length === 0">
                        <td colspan="5" class="px-4 py-10 text-center text-gray-400 text-sm">Tiada rekod bayaran untuk ahli ini.</td>
                      </tr>
                      <tr v-for="tx in rekodTransaksi" :key="tx.billCode" class="hover:bg-gray-50/60 transition-colors">
                        <td class="px-4 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{{ tx.tarikh }}</td>
                        <td class="px-4 py-3.5 text-sm font-bold text-gray-800 max-w-45 truncate" :title="tx.keterangan">{{ tx.keterangan }}</td>
                        <td class="px-4 py-3.5 text-right font-black text-sm tabular-nums" :class="tx.status === 'BERJAYA' ? 'text-emerald-600' : 'text-gray-700'">RM {{ parseFloat(tx.amaun).toFixed(2) }}</td>
                        <td class="px-4 py-3.5 text-center">
                          <span :class="['text-xs font-black uppercase px-2.5 py-0.5 rounded-lg border', tx.status === 'BERJAYA' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : tx.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700']">{{ tx.status }}</span>
                        </td>
                        <td class="px-4 py-3.5 text-center">
                          <button v-if="tx.status === 'BERJAYA'" @click="cetakResit(tx)" class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5">
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>Cetak
                          </button>
                          <span v-else class="text-gray-300 text-xs">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TAB: Acara -->
                <div v-else-if="tab === 'acara'" class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-3 font-bold">Tarikh Acara</th>
                        <th class="px-4 py-3 font-bold">Nama Acara</th>
                        <th class="px-4 py-3 font-bold">Kategori</th>
                        <th class="px-4 py-3 font-bold">Tarikh Daftar</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="rekodAcara.length === 0">
                        <td colspan="4" class="px-4 py-10 text-center text-gray-400 text-sm">Ahli ini belum menyertai sebarang acara kelab.</td>
                      </tr>
                      <tr v-for="(a, idx) in rekodAcara" :key="idx" class="hover:bg-gray-50/60 transition-colors">
                        <td class="px-4 py-3.5 text-xs font-bold text-[#0F4C3A] whitespace-nowrap">{{ a.tarikh_acara }}</td>
                        <td class="px-4 py-3.5 text-sm font-bold text-gray-800">
                          {{ a.nama_acara }}
                          <span class="ml-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">{{ a.jenis_acara || 'Umum' }}</span>
                        </td>
                        <td class="px-4 py-3.5 text-xs text-gray-600 font-medium">{{ a.kategori || 'Individu' }}</td>
                        <td class="px-4 py-3.5 text-xs text-gray-400 font-mono">{{ a.tarikh_daftar }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TAB: Resit Biro Angkasa -->
                <div v-else-if="tab === 'resitba'">
                  <!-- Header filter -->
                  <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                    <div class="flex items-center gap-2.5">
                      <span class="text-xs font-black uppercase tracking-wide text-gray-500">Tahun:</span>
                      <select v-model="filterTahunBA"
                        class="text-sm font-bold border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-gray-700">
                        <option v-for="t in senaraíTahunBA" :key="t" :value="t">{{ t }}</option>
                      </select>
                      <span class="text-xs text-gray-400 font-mono">{{ rekodResitBATertapis.length }} resit</span>
                    </div>
                    <button v-if="rekodResitBATertapis.length > 0" @click="cetakResitSetahunBA"
                      class="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      PDF Setahun
                    </button>
                  </div>
                  <!-- Jadual -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-left">
                      <thead class="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                        <tr>
                          <th class="px-4 py-3 font-bold">No. Resit</th>
                          <th class="px-4 py-3 font-bold">Bulan Potongan</th>
                          <th class="px-4 py-3 font-bold text-right">Amaun (RM)</th>
                          <th class="px-4 py-3 font-bold text-center">Cetak</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-50">
                        <tr v-if="rekodResitBATertapis.length === 0">
                          <td colspan="4" class="px-4 py-10 text-center text-gray-400 text-sm">
                            {{ rekodResitBA.length === 0 ? 'Resit belum dijana untuk ahli ini.' : `Tiada resit untuk tahun ${filterTahunBA}.` }}
                          </td>
                        </tr>
                        <tr v-for="r in rekodResitBATertapis" :key="r.no_resit" class="hover:bg-blue-50/30 transition-colors">
                          <td class="px-4 py-3.5 font-mono text-xs font-bold text-blue-700">{{ r.no_resit }}</td>
                          <td class="px-4 py-3.5 text-sm font-bold text-gray-800">{{ namaBulan(r.bulan_potongan) }}</td>
                          <td class="px-4 py-3.5 text-right font-black text-sm tabular-nums text-emerald-600">{{ parseFloat(r.amaun).toFixed(2) }}</td>
                          <td class="px-4 py-3.5 text-center">
                            <button @click="cetakResitBA(r)"
                              class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5">
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                              Cetak
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <!-- Baris jumlah -->
                      <tfoot v-if="rekodResitBATertapis.length > 0">
                        <tr class="border-t-2 border-blue-100 bg-blue-50/50">
                          <td colspan="2" class="px-4 py-3 text-xs font-black uppercase tracking-wide text-blue-700">
                            Jumlah Potongan {{ filterTahunBA }}
                          </td>
                          <td class="px-4 py-3 text-right font-black text-base tabular-nums text-blue-800">
                            RM {{ rekodResitBATertapis.reduce((s, r) => s + parseFloat(r.amaun), 0).toFixed(2) }}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <!-- Info tiada resit -->
                  <div v-if="rekodResitBA.length === 0" class="px-4 pb-4">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 mt-2">
                      <svg class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <p class="text-blue-700 text-sm font-medium">Resit belum dijana. Gunakan butang <strong>Jana Resit</strong> di halaman pengurusan resit untuk menjana resit bulanan.</p>
                    </div>
                  </div>
                </div>

                <!-- TAB: Kebajikan -->
                <div v-else-if="tab === 'kebajikan'" class="p-4 space-y-3">
                  <div v-if="rekodBantuan.length === 0" class="text-center py-10 text-gray-400 text-sm">Tiada rekod permohonan bantuan kebajikan.</div>
                  <div v-for="b in rekodBantuan" :key="b.id" class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <div class="flex-1 min-w-0">
                      <p class="text-gray-900 font-bold text-sm">{{ b.jenis_bantuan }}</p>
                      <p class="text-gray-500 text-xs mt-0.5 line-clamp-2">{{ b.keterangan || 'Tiada butiran lanjut' }}</p>
                      <p class="text-gray-400 text-xs font-mono mt-1.5">{{ b.tarikh_mohon }}</p>
                    </div>
                    <div class="shrink-0 text-right">
                      <span :class="['text-xs font-black uppercase px-3 py-1 rounded-lg border block text-center', b.status_permohonan === 'LULUS' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : b.status_permohonan === 'DITOLAK' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200']">
                        {{ b.status_permohonan || 'DIPROSES' }}
                      </span>
                      <p v-if="b.status_permohonan === 'LULUS'" class="text-emerald-600 font-black text-sm mt-1 tabular-nums">RM {{ parseFloat(b.amaun_lulus || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';

const props = defineProps({ show: Boolean, ahliBase: Object });
const emit = defineEmits(['close', 'edit']);
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const loading = ref(false);
const ahliLengkap = ref(null);
const tab = ref('kewangan');
const rekodTransaksi = ref([]);
const rekodBantuan = ref([]);
const rekodAcara = ref([]);
const rekodResitBA = ref([]);
const filterTahunBA = ref(new Date().getFullYear().toString());
const jumlahSumbangan = ref(0);
const tuntutBajuPercuma = ref(false);

const isBiroAngkasa = computed(() => ahliLengkap.value?.jenis_potongan === 'Potongan Biro angkasa');

const senaraíTahunBA = computed(() => {
  const tahunSet = new Set(rekodResitBA.value.map(r => r.bulan_potongan?.substring(0, 4)).filter(Boolean));
  const list = [...tahunSet].sort((a, b) => b - a);
  return list.length ? list : [new Date().getFullYear().toString()];
});

const rekodResitBATertapis = computed(() =>
  rekodResitBA.value.filter(r => r.bulan_potongan?.startsWith(filterTahunBA.value))
);

const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const badgeJawatan = (j) => {
  if (!j) return '';
  if (j === 'Yang Dipertua') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (j === 'Naib Yang Dipertua') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  if (['Setiausaha', 'Penolong Setiausaha'].includes(j)) return 'bg-sky-100 text-sky-800 border-sky-200';
  if (['Bendahari', 'Penolong Bendahari'].includes(j)) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (j === 'Auditor') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-teal-100 text-teal-800 border-teal-200';
};

const kiraUmur = (ic) => {
  if (!ic || ic.length < 6) return '—';
  let year = parseInt(ic.substring(0, 2));
  year += (year > parseInt(new Date().getFullYear().toString().substring(2))) ? 1900 : 2000;
  return new Date().getFullYear() - year;
};

watch(() => props.show, async (newVal) => {
  if (newVal && props.ahliBase?.no_kp) {
    loading.value = true;
    tab.value = 'kewangan';
    ahliLengkap.value = { ...props.ahliBase };
    jumlahSumbangan.value = 0;
    tuntutBajuPercuma.value = false;
    rekodTransaksi.value = [];
    rekodBantuan.value = [];
    rekodAcara.value = [];
    rekodResitBA.value = [];

    try {
      const resProfil = await api.get(`/admin/profil-ahli/${props.ahliBase.no_kp}`);
      if (resProfil.data?.success) ahliLengkap.value = resProfil.data.data;

      const resResit = await api.get('/admin/sejarah-bayaran');
      if (resResit.data?.success) {
        const semuaTx = resResit.data.data.filter(t => t.no_kp === props.ahliBase.no_kp);
        rekodTransaksi.value = semuaTx;
        jumlahSumbangan.value = semuaTx.filter(t => t.status === 'BERJAYA').reduce((sum, t) => sum + parseFloat(t.amaun), 0);
        tuntutBajuPercuma.value = semuaTx.some(t => parseFloat(t.amaun) === 0 && t.keterangan.toLowerCase().includes('kedai'));
      }

      const resKebajikan = await api.get('/admin/kebajikan');
      if (resKebajikan.data?.success) {
        rekodBantuan.value = resKebajikan.data.data.filter(b => b.no_kp === props.ahliBase.no_kp);
      }

      try {
        const resAcara = await api.get(`/admin/acara-ahli/${props.ahliBase.no_kp}`);
        if (resAcara.data?.success) rekodAcara.value = resAcara.data.data;
      } catch (e) {}

      try {
        const resBA = await api.get('/admin/resit-biro-angkasa', { params: { no_kp: props.ahliBase.no_kp } });
        if (resBA.data?.success) {
          rekodResitBA.value = resBA.data.data;
          filterTahunBA.value = new Date().getFullYear().toString();
        }
      } catch (e) {}

    } catch (e) {
      console.error('Gagal muat profil 360', e);
    } finally {
      loading.value = false;
    }
  }
});

const namaBulan = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ms-MY', { year: 'numeric', month: 'long' });
};

const cetakResitBA = (r) => {
  const w = window.open('', '_blank', 'width=600,height=520');
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  w.document.write(`
    <html><head><title>Resit ${r.no_resit}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:30px;color:#333}
      .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}
      .divider{border:none;border-top:1px dashed #ccc;margin:14px 0}
      .badge{display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:bold}
    </style></head><body>
    ${headerResitHTML('Resit Potongan Yuran — Biro Angkasa')}
    <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin-top:8px">
      <div class="row"><span style="color:#888">No. Resit:</span><strong style="font-family:monospace;letter-spacing:.5px">${r.no_resit}</strong></div>
      <div class="row"><span style="color:#888">Kaedah:</span><span class="badge">Potongan Biro Angkasa</span></div>
      <hr class="divider"/>
      <div class="row"><span style="color:#888">Nama:</span><strong style="text-transform:uppercase">${ahliLengkap.value?.nama_pegawai || '—'}</strong></div>
      <div class="row"><span style="color:#888">No. Ahli:</span><strong>${ahliLengkap.value?.no_ahli || '—'}</strong></div>
      <div class="row"><span style="color:#888">No. KP:</span><strong>${ahliLengkap.value?.no_kp || '—'}</strong></div>
      <div class="row"><span style="color:#888">Penempatan:</span><strong>${ahliLengkap.value?.penempatan || '—'}</strong></div>
      <hr class="divider"/>
      <div class="row"><span style="color:#888">Bulan Potongan:</span><strong>${namaBulan(r.bulan_potongan)}</strong></div>
      <div class="row"><span style="color:#888">Keterangan:</span><strong>Yuran Kelab PERHILITAN</strong></div>
      <div class="row" style="margin-top:12px;font-size:15px"><span style="color:#888">JUMLAH (RM):</span><strong style="color:#0F4C3A">${parseFloat(r.amaun).toFixed(2)}</strong></div>
      <hr class="divider"/>
      <p style="font-size:9px;color:#aaa;text-align:center;margin:0">Dicetak: ${tarikh}</p>
    </div>
    ${footerResitHTML()}
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

const cetakResitSetahunBA = () => {
  const senarai = rekodResitBATertapis.value;
  if (!senarai.length) return;
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const jumlah = senarai.reduce((a, r) => a + parseFloat(r.amaun || 0), 0);
  const ahli = ahliLengkap.value;

  const baris = senarai.map((r, i) => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:7px 10px;font-size:11px;color:#64748b;">${i + 1}</td>
      <td style="padding:7px 10px;font-size:11px;font-family:monospace;color:#1D4ED8;">${r.no_resit}</td>
      <td style="padding:7px 10px;font-size:11px;">${namaBulan(r.bulan_potongan)}</td>
      <td style="padding:7px 10px;font-size:11px;text-align:right;font-weight:700;color:#0F4C3A;">RM ${parseFloat(r.amaun).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html><html lang="ms"><head>
    <meta charset="UTF-8"/>
    <title>Penyata Potongan Biro Angkasa — ${filterTahunBA.value}</title>
    <style>
      *{box-sizing:border-box;}
      body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#0F172A;background:white;}
      table{width:100%;border-collapse:collapse;margin-top:14px;}
      th{background:#1D4ED8;color:white;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:8px 10px;text-align:left;}
      tr:nth-child(even){background:#f8fafc;}
      .info p{margin:0 0 4px;font-size:11px;color:#334155;}
      .info span{font-weight:700;color:#0F172A;}
      .badge{display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:2px 10px;border-radius:12px;font-size:10px;font-weight:bold;}
      .jumlah-row td{background:#0F4C3A;color:white;font-weight:700;font-size:12px;padding:9px 10px;}
      @media print{body{padding:12px;}}
    </style>
  </head><body>
    ${headerResitHTML(`Penyata Potongan Biro Angkasa &mdash; Tahun ${filterTahunBA.value}`)}
    <div class="info" style="margin:12px 0;padding:10px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
      <p>Nama: <span>${ahli?.nama_pegawai || '—'}</span></p>
      <p>No. KP: <span>${ahli?.no_kp || '—'}</span></p>
      <p>No. Ahli: <span>${ahli?.no_ahli || '—'}</span></p>
      <p>Kaedah Potongan: <span class="badge">Potongan Biro Angkasa</span></p>
      <p>Kod Majikan: <span style="font-family:monospace;">${ahli?.kod_majikan || 'N/A'}</span></p>
      <p>Dicetak: <span>${tarikh}</span></p>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th style="width:160px">No. Resit</th>
          <th>Bulan Potongan</th>
          <th style="width:130px;text-align:right">Amaun (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${baris}
        <tr>
          <td colspan="3" class="jumlah-row" style="text-align:right">JUMLAH POTONGAN TAHUN ${filterTahunBA.value}</td>
          <td class="jumlah-row" style="text-align:right">RM ${jumlah.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    ${footerResitHTML()}
    <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=820,height=640');
  if (w) { w.document.write(html); w.document.close(); }
};

const cetakResit = (tx) => {
  const w = window.open('', '_blank', 'width=600,height=500');
  w.document.write(`
    <html><head><title>Resit ${tx.billCode}</title>
    <style>body{font-family:Arial;padding:30px;color:#333} .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}</style>
    </head><body>
    ${headerResitHTML('Resit Transaksi Pembayaran')}
    <div style="background:#f9f9f9;padding:15px;border-radius:8px">
      <div class="row"><span style="color:#888">Nama:</span><strong>${ahliLengkap.value?.nama_pegawai}</strong></div>
      <div class="row"><span style="color:#888">No KP:</span><strong>${ahliLengkap.value?.no_kp}</strong></div>
      <div class="row"><span style="color:#888">Tarikh:</span><strong>${tx.tarikh}</strong></div>
      <div class="row"><span style="color:#888">Rujukan:</span><strong>${tx.billCode}</strong></div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:15px 0"/>
      <div class="row"><span style="color:#888">Keterangan:</span><strong>${tx.keterangan}</strong></div>
      <div class="row" style="margin-top:15px;font-size:16px"><span style="color:#888">JUMLAH (RM):</span><strong style="color:#0F4C3A">${parseFloat(tx.amaun).toFixed(2)}</strong></div>
    </div>
    ${footerResitHTML()}
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

/* Backdrop fade */
.drawer-enter-active { transition: opacity 0.25s ease; }
.drawer-leave-active { transition: opacity 0.2s ease; }
.drawer-enter-from { opacity: 0; }
.drawer-leave-to   { opacity: 0; }

/* Panel slide from right */
.drawer-enter-active > div { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-leave-active > div { transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1); }
.drawer-enter-from > div { transform: translateX(100%); }
.drawer-leave-to   > div { transform: translateX(100%); }
</style>
