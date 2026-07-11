<template>
  <div class="space-y-4 font-sans text-gray-900 pb-10 text-xs">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h2 class="font-bold text-base text-gray-900">Pengurusan Kebajikan</h2>
        <p class="text-gray-500 text-[11px] mt-0.5">
          Semak permohonan bantuan ahli, kemukakan kepada jawatankuasa, dan rekod keputusan.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="bukaModalBagiPihak"
          class="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-rose-700 hover:bg-rose-800 px-3 py-2 rounded-lg transition-colors shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Permohonan Bagi Pihak Waris
        </button>
        <button @click="muatKebajikan"
          class="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Semula
        </button>
      </div>
    </div>

    <!-- STATS SUMMARY -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white border border-amber-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Menunggu Semakan</p>
        <p class="text-2xl font-black text-amber-700 mt-1 tabular-nums">{{ bilMenunggu }}</p>
        <p class="text-[9px] text-amber-500 mt-0.5">perlu tindakan</p>
      </div>
      <div class="bg-white border border-indigo-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Dikemukakan JK</p>
        <p class="text-2xl font-black text-indigo-700 mt-1 tabular-nums">{{ bilDikemukakan }}</p>
        <p class="text-[9px] text-indigo-500 mt-0.5">menunggu keputusan</p>
      </div>
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Diluluskan</p>
        <p class="text-2xl font-black text-emerald-700 mt-1 tabular-nums">{{ bilLulus }}</p>
        <p class="text-[9px] text-emerald-500 mt-0.5">
          RM {{ jumlahLulus.toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
        </p>
      </div>
      <div class="bg-white border border-rose-100 rounded-xl p-4">
        <p class="text-[9px] font-bold text-rose-600 uppercase tracking-wider">Ditolak</p>
        <p class="text-2xl font-black text-rose-700 mt-1 tabular-nums">{{ bilDitolak }}</p>
        <p class="text-[9px] text-rose-400 mt-0.5">tidak dilulus</p>
      </div>
    </div>

    <!-- FILTER TABS -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="tab in tabs" :key="tab.value"
        @click="filterAktif = tab.value"
        :class="['px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors border',
          filterAktif === tab.value
            ? tab.activeClass
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']">
        {{ tab.label }}
        <span class="ml-1 opacity-75">({{ tab.count }})</span>
      </button>
    </div>

    <!-- PANEL KADAR BANTUAN -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <!-- Header toggle -->
      <button @click="showKadarPanel = !showKadarPanel"
        class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-[#0F4C3A]/8 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="text-left">
            <p class="text-[12px] font-bold text-gray-800">Kadar Bantuan Semasa</p>
            <p class="text-[10px] text-gray-400">
              {{ adaHakLulus ? 'Klik untuk lihat dan ubah kadar standard' : 'Klik untuk lihat kadar standard' }}
            </p>
          </div>
        </div>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="showKadarPanel ? 'rotate-180' : ''"
          fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Kandungan panel (collapsible) -->
      <Transition name="slide-down">
        <div v-if="showKadarPanel" class="border-t border-gray-100">

          <!-- Info YDP -->
          <div v-if="adaHakLulus"
            class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
            <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            <p class="text-[10px] text-emerald-700 font-semibold">Anda boleh mengedit kadar bantuan sebagai Yang Dipertua.</p>
          </div>

          <!-- Senarai kadar -->
          <div class="divide-y divide-gray-50">
            <div v-for="k in kadarBantuan" :key="k.kunci"
              class="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">

              <!-- Label -->
              <div class="flex-1 min-w-0 mr-4">
                <p class="text-[12px] font-semibold text-gray-800 truncate">{{ k.label }}</p>
                <p class="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5 font-mono">{{ k.kunci }}</p>
              </div>

              <!-- Nilai / Edit -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- Mode edit -->
                <template v-if="editKunci === k.kunci">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] font-bold text-gray-500">RM</span>
                    <input v-model="editNilai" type="number" min="0" step="1"
                      class="w-20 text-[12px] font-black text-emerald-700 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-right"
                      @keyup.enter="simpanKadar(k.kunci)"
                      @keyup.escape="batalEdit" />
                    <button @click="simpanKadar(k.kunci)" :disabled="simpanLoading"
                      class="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                      {{ simpanLoading ? '...' : 'Simpan' }}
                    </button>
                    <button @click="batalEdit"
                      class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors">
                      Batal
                    </button>
                  </div>
                </template>

                <!-- Mode papar -->
                <template v-else>
                  <span class="text-[13px] font-black text-emerald-700 tabular-nums">
                    RM {{ parseFloat(k.amaun).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
                  </span>
                  <button v-if="adaHakLulus && k.boleh_ubah" @click="mulaEdit(k)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-[#0F4C3A] hover:bg-gray-100 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                </template>
              </div>

            </div>

            <!-- Baris: Pertimbangan JK (fixed, tidak boleh edit) -->
            <div class="flex items-center justify-between px-4 py-3 bg-amber-50/40">
              <div class="flex-1">
                <p class="text-[12px] font-semibold text-gray-600">Bencana - Lain-lain / Kes Kritikal</p>
                <p class="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">Dinilai oleh Jawatankuasa</p>
              </div>
              <span class="text-[11px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg">
                Pertimbangan JK
              </span>
            </div>
          </div>

        </div>
      </Transition>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 font-bold">Pemohon</th>
              <th class="px-4 py-3 font-bold">Jenis Bantuan</th>
              <th class="px-4 py-3 font-bold hidden lg:table-cell">Keterangan</th>
              <th class="px-4 py-3 font-bold text-center">Dokumen</th>
              <th class="px-4 py-3 font-bold">Status</th>
              <th class="px-4 py-3 font-bold hidden md:table-cell">Tarikh Mohon</th>
              <th class="px-4 py-3 font-bold text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-14 text-center text-gray-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-[#0F4C3A] border-t-transparent animate-spin"></div>
                  <span>Memuatkan data...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="senaraiTapis.length === 0">
              <td colspan="7" class="px-4 py-16 text-center">
                <p class="text-gray-400 font-medium">Tiada permohonan dalam kategori ini.</p>
              </td>
            </tr>
            <tr v-for="p in senaraiTapis" :key="p.id"
              class="hover:bg-gray-50/70 cursor-pointer transition-colors"
              @click="bukaModal(p)">
              <!-- Pemohon -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <p class="font-bold text-gray-900 text-[12px]">{{ p.nama_pegawai }}</p>
                  <span v-if="p.bagi_pihak"
                    class="text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md shrink-0">
                    Arwah
                  </span>
                </div>
                <p class="text-[10px] text-gray-500 font-mono mt-0.5">{{ p.no_kp }}</p>
                <p class="text-[10px] text-gray-400">{{ p.penempatan || '—' }}</p>
                <p v-if="p.bagi_pihak && p.nama_pemohon_admin" class="text-[9px] text-rose-600 mt-0.5">
                  Dikemukakan oleh: {{ p.nama_pemohon_admin }}
                </p>
              </td>
              <!-- Jenis Bantuan -->
              <td class="px-4 py-3.5">
                <p class="font-semibold text-gray-800 text-[12px]">{{ p.jenis_bantuan }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5 md:hidden">{{ formatTarikh(p.tarikh_mohon) }}</p>
              </td>
              <!-- Keterangan -->
              <td class="px-4 py-3.5 hidden lg:table-cell text-gray-500 max-w-[220px]">
                <p class="truncate text-[11px]" :title="p.keterangan">{{ p.keterangan || '—' }}</p>
              </td>
              <!-- Dokumen -->
              <td class="px-4 py-3.5 text-center">
                <span v-if="parseDokumen(p.dokumen_sokongan).length > 0"
                  class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  {{ parseDokumen(p.dokumen_sokongan).length }}
                </span>
                <span v-else class="text-gray-300 text-[10px]">—</span>
              </td>
              <!-- Status -->
              <td class="px-4 py-3.5">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide whitespace-nowrap', badgeStatus(p.status_permohonan)]">
                  {{ labelStatus(p.status_permohonan) }}
                </span>
                <p v-if="p.status_permohonan === 'LULUS'" class="text-emerald-700 font-black text-[11px] mt-1 tabular-nums">
                  RM {{ parseFloat(p.amaun_lulus || 0).toFixed(2) }}
                </p>
                <p v-if="p.status_permohonan === 'DITOLAK' && p.sebab_tolak"
                  class="text-rose-600 text-[10px] mt-0.5 truncate max-w-[150px]" :title="p.sebab_tolak">
                  {{ p.sebab_tolak }}
                </p>
              </td>
              <!-- Tarikh -->
              <td class="px-4 py-3.5 text-gray-500 hidden md:table-cell text-[11px] whitespace-nowrap">
                {{ formatTarikh(p.tarikh_mohon) }}
              </td>
              <!-- Tindakan -->
              <td class="px-4 py-3.5 text-center" @click.stop>
                <button @click="bukaModal(p)"
                  class="text-[11px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors whitespace-nowrap">
                  Semak
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- ==================== MODAL SEMAKAN ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal"
          class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModal = false">
          <div v-if="dipilih" class="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Semakan Permohonan Kebajikan</p>
                  <p class="text-[10px] text-gray-400 font-mono">ID #{{ dipilih.id }} · {{ formatTarikh(dipilih.tarikh_mohon) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2.5 shrink-0">
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide', badgeStatus(dipilih.status_permohonan)]">
                  {{ labelStatus(dipilih.status_permohonan) }}
                </span>
                <button @click="showModal = false"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                  <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-6 space-y-5">

                <!-- MAKLUMAT PEMOHON -->
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-3">Maklumat Pemohon</p>
                  <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Nama Penuh</p>
                      <p class="font-bold text-gray-900 text-[12px] mt-0.5">{{ dipilih.nama_pegawai }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">No. K/P</p>
                      <p class="font-mono font-bold text-gray-700 text-[11px] mt-0.5">{{ dipilih.no_kp }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Penempatan</p>
                      <p class="font-semibold text-gray-700 text-[11px] mt-0.5">{{ dipilih.penempatan || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide">No. Ahli / Gred</p>
                      <p class="font-mono text-gray-700 text-[11px] mt-0.5">
                        {{ dipilih.no_ahli || '—' }}
                        <span v-if="dipilih.gred" class="text-gray-400"> · {{ dipilih.gred }}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- BUTIRAN PERMOHONAN -->
                <div class="space-y-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Butiran Permohonan</p>
                  <div class="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p class="text-[9px] text-amber-600 font-bold uppercase tracking-wide mb-1">Kategori Bantuan</p>
                    <p class="font-black text-amber-900 text-sm">{{ dipilih.jenis_bantuan }}</p>
                  </div>
                  <div class="rounded-xl border border-gray-200 p-4 bg-white">
                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-2">Keterangan / Kronologi</p>
                    <p class="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">{{ dipilih.keterangan || 'Tiada keterangan diberikan.' }}</p>
                  </div>
                </div>

                <!-- MAKLUMAT WARIS (hanya jika bagi_pihak) -->
                <div v-if="dipilih.bagi_pihak" class="space-y-2">
                  <p class="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Maklumat Waris (Penerima Bantuan)</p>
                  <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p class="text-[10px] text-rose-700 font-semibold">
                        Permohonan ini dikemukakan bagi pihak arwah oleh {{ dipilih.nama_pemohon_admin || dipilih.pemohon_admin_no_kp }}.
                        Wang akan dipindahkan ke akaun waris di bawah.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <p class="text-[9px] text-rose-400 font-bold uppercase tracking-wide">Nama Waris</p>
                        <p class="font-bold text-gray-900 text-[12px] mt-0.5">{{ dipilih.nama_waris || '—' }}</p>
                      </div>
                      <div>
                        <p class="text-[9px] text-rose-400 font-bold uppercase tracking-wide">Hubungan</p>
                        <p class="font-semibold text-gray-700 text-[12px] mt-0.5">{{ dipilih.hubungan_waris || '—' }}</p>
                      </div>
                      <div v-if="dipilih.no_kp_waris">
                        <p class="text-[9px] text-rose-400 font-bold uppercase tracking-wide">No. K/P Waris</p>
                        <p class="font-mono text-gray-700 text-[11px] mt-0.5">{{ dipilih.no_kp_waris }}</p>
                      </div>
                      <div class="col-span-2">
                        <p class="text-[9px] text-rose-400 font-bold uppercase tracking-wide">No. Akaun Bank (Untuk Pindahan)</p>
                        <p class="font-black text-[#0F4C3A] text-sm font-mono mt-0.5 tracking-wider">{{ dipilih.no_akaun_waris || '—' }}</p>
                        <p class="text-[10px] text-gray-500 mt-0.5">{{ dipilih.nama_bank_waris || '' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- DOKUMEN SOKONGAN -->
                <div class="space-y-2">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Dokumen Sokongan
                    <span v-if="parseDokumen(dipilih.dokumen_sokongan).length > 0" class="normal-case font-normal ml-1">
                      ({{ parseDokumen(dipilih.dokumen_sokongan).length }} fail)
                    </span>
                  </p>
                  <div v-if="parseDokumen(dipilih.dokumen_sokongan).length > 0" class="space-y-2">
                    <template v-for="(doc, i) in parseDokumen(dipilih.dokumen_sokongan)" :key="doc">
                      <!-- Gambar — tunjuk thumbnail + pautan buka penuh -->
                      <div v-if="isGambar(doc)" class="rounded-xl overflow-hidden border border-gray-200">
                        <a :href="`${apiBase}/uploads/bantuan/${doc}`" target="_blank" rel="noopener">
                          <img :src="`${apiBase}/uploads/bantuan/${doc}`" :alt="`Dokumen ${i + 1}`"
                            class="w-full max-h-48 object-contain bg-gray-50 hover:opacity-90 transition-opacity" />
                        </a>
                        <div class="px-3 py-1.5 flex items-center justify-between bg-gray-50 border-t border-gray-100">
                          <span class="text-[10px] text-gray-500">Gambar {{ i + 1 }}</span>
                          <a :href="`${apiBase}/uploads/bantuan/${doc}`" target="_blank" rel="noopener"
                            class="text-[10px] font-bold text-blue-600 hover:text-blue-800">Buka penuh ↗</a>
                        </div>
                      </div>
                      <!-- PDF -->
                      <button v-else type="button"
                        @click="bukaPreviewPdf(`${apiBase}/uploads/bantuan/${doc}`)"
                        class="w-full flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-3 py-2.5 rounded-xl hover:bg-red-100 transition-colors text-left">
                        <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 15.5h-1V12H9c.8 0 1.5.7 1.5 1.5S9.8 15 9 15v.5h-.5zm3.5 0h-1v-3.5h1.5c1.1 0 2 .9 2 2s-.9 1.5-2 1.5H12zm5 0h-2.5V12H14v3.5h-1v-3.5h1V12h1.5c.3 0 .5.2.5.5v2.5h1v.5z"/>
                        </svg>
                        <div class="flex-1 min-w-0">
                          <p class="text-[11px] font-bold truncate">PDF — Dokumen {{ i + 1 }}</p>
                          <p class="text-[9px] opacity-60">Klik untuk lihat</p>
                        </div>
                        <svg class="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                    </template>
                  </div>
                  <p v-else class="text-[11px] text-gray-400 italic bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                    Tiada dokumen dilampirkan oleh pemohon.
                  </p>
                </div>

                <!-- REKOD TINDAKAN (Timeline) -->
                <div class="space-y-2">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rekod Proses</p>
                  <div class="border border-gray-200 rounded-xl overflow-hidden">
                    <div class="divide-y divide-gray-100">

                      <!-- Step 1: Diterima -->
                      <div class="flex items-start gap-3 px-4 py-3">
                        <div class="w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                          <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-[11px] font-bold text-gray-700">Permohonan diterima daripada ahli</p>
                          <p class="text-[10px] text-gray-400 mt-0.5">{{ formatTarikhmasa(dipilih.tarikh_mohon) }}</p>
                        </div>
                        <span class="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md shrink-0">Selesai</span>
                      </div>

                      <!-- Step 2: Dikemukakan -->
                      <div class="flex items-start gap-3 px-4 py-3"
                        :class="!dipilih.tarikh_dikemukakan ? 'opacity-40' : ''">
                        <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                          dipilih.tarikh_dikemukakan
                            ? 'bg-indigo-100 border-indigo-300'
                            : 'bg-gray-50 border-gray-200']">
                          <div :class="['w-2 h-2 rounded-full', dipilih.tarikh_dikemukakan ? 'bg-indigo-500' : 'bg-gray-300']"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-[11px] font-bold text-gray-700">Dikemukakan kepada Jawatankuasa</p>
                          <p v-if="dipilih.tarikh_dikemukakan" class="text-[10px] text-gray-400 mt-0.5">
                            {{ formatTarikhmasa(dipilih.tarikh_dikemukakan) }}
                            <span v-if="dipilih.diproses_oleh" class="ml-1 text-gray-500">· oleh {{ dipilih.diproses_oleh }}</span>
                          </p>
                          <p v-if="dipilih.catatan_admin && dipilih.tarikh_dikemukakan"
                            class="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1.5 mt-1.5 italic leading-relaxed">
                            "{{ dipilih.catatan_admin }}"
                          </p>
                          <p v-else class="text-[10px] text-gray-400 mt-0.5">Menunggu tindakan</p>
                        </div>
                        <span v-if="dipilih.tarikh_dikemukakan" class="text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">Selesai</span>
                        <span v-else class="text-[9px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md shrink-0">Belum</span>
                      </div>

                      <!-- Step 3: Keputusan JK -->
                      <div class="flex items-start gap-3 px-4 py-3"
                        :class="!dipilih.tarikh_keputusan ? 'opacity-40' : ''">
                        <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                          dipilih.status_permohonan === 'LULUS' ? 'bg-emerald-100 border-emerald-300'
                          : dipilih.status_permohonan === 'DITOLAK' ? 'bg-rose-100 border-rose-300'
                          : 'bg-gray-50 border-gray-200']">
                          <div :class="['w-2 h-2 rounded-full',
                            dipilih.status_permohonan === 'LULUS' ? 'bg-emerald-500'
                            : dipilih.status_permohonan === 'DITOLAK' ? 'bg-rose-500'
                            : 'bg-gray-300']"></div>
                        </div>
                        <div class="flex-1">
                          <p class="text-[11px] font-bold text-gray-700">Keputusan Jawatankuasa</p>
                          <p v-if="dipilih.tarikh_keputusan" class="text-[10px] text-gray-400 mt-0.5">
                            {{ formatTarikhmasa(dipilih.tarikh_keputusan) }}
                          </p>
                          <div v-if="dipilih.status_permohonan === 'LULUS'" class="mt-1.5">
                            <p class="text-[11px] font-black text-emerald-700">
                              Diluluskan — RM {{ parseFloat(dipilih.amaun_lulus || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
                            </p>
                            <p class="text-[10px] text-emerald-600 mt-0.5">Direkod ke buku tunai secara automatik.</p>
                          </div>
                          <div v-else-if="dipilih.status_permohonan === 'DITOLAK'" class="mt-1.5">
                            <p class="text-[10px] font-bold text-rose-600 uppercase tracking-wide">Sebab Penolakan:</p>
                            <p class="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 rounded-md px-2.5 py-1.5 mt-1 leading-relaxed">
                              {{ dipilih.sebab_tolak }}
                            </p>
                          </div>
                          <p v-else class="text-[10px] text-gray-400 mt-0.5">Menunggu keputusan</p>
                        </div>
                        <span v-if="dipilih.status_permohonan === 'LULUS'" class="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md shrink-0">Lulus</span>
                        <span v-else-if="dipilih.status_permohonan === 'DITOLAK'" class="text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md shrink-0">Tolak</span>
                        <span v-else class="text-[9px] font-bold bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md shrink-0">Belum</span>
                      </div>

                    </div>
                  </div>
                </div>

                <!-- CATATAN PENTADBIR (hanya untuk yang belum selesai) -->
                <div v-if="!['LULUS', 'DITOLAK'].includes(dipilih.status_permohonan)" class="space-y-1.5">
                  <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Catatan Pentadbir <span class="text-gray-300 font-normal">(disertakan semasa dikemukakan kepada JK)</span>
                  </label>
                  <textarea v-model="catatanAdmin" rows="2"
                    placeholder="Tambah catatan atau ulasan sebelum dikemukakan kepada Jawatankuasa..."
                    class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] resize-none transition-all">
                  </textarea>
                </div>

              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
              <!-- Tindakan — belum selesai -->
              <div v-if="!['LULUS', 'DITOLAK'].includes(dipilih.status_permohonan)"
                class="space-y-3">

                <!-- Notis jika bukan Yang Dipertua -->
                <div v-if="dipilih.status_permohonan === 'DIKEMUKAKAN' && !adaHakLulus"
                  class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p class="text-[10px] text-amber-800 font-semibold">
                    Kelulusan permohonan ini hanya boleh dilakukan oleh <strong>Yang Dipertua</strong> Kelab PERHILITAN.
                  </p>
                </div>

                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div class="flex items-center gap-2">
                    <button @click="showModal = false"
                      class="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                      Tutup
                    </button>
                    <button @click="bukaModalEdit"
                      class="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold hover:bg-amber-100 transition-colors inline-flex items-center gap-1.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                      </svg>
                      Edit
                    </button>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="bukaModalTolak"
                      class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold hover:bg-rose-100 transition-colors">
                      Tolak Permohonan
                    </button>
                    <!-- Jika sudah dikemukakan DAN ada hak → tunjuk butang Lulus -->
                    <button v-if="dipilih.status_permohonan === 'DIKEMUKAKAN' && adaHakLulus"
                      @click="bukaModalLulus"
                      class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                      Lulus (Keputusan JK)
                    </button>
                    <!-- Belum dikemukakan → tunjuk butang Kemukakan -->
                    <button v-else-if="dipilih.status_permohonan !== 'DIKEMUKAKAN'"
                      @click="kemukakan"
                      :disabled="memproses"
                      class="px-4 py-2 bg-[#0F4C3A] text-white rounded-lg text-[11px] font-bold hover:bg-[#155d47] transition-colors shadow-sm disabled:opacity-60">
                      {{ memproses ? 'Memproses...' : 'Kemukakan kepada JK' }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- Permohonan selesai -->
              <div v-else class="flex justify-end">
                <button @click="showModal = false"
                  class="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ==================== MODAL LULUS ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalLulus"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalLulus = false">
          <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <svg class="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">Kelulusan Permohonan</h3>
                <p class="text-[10px] text-gray-500">Rekod keputusan Jawatankuasa Kebajikan</p>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-3 mb-4">
              <p class="text-[9px] text-gray-400 font-bold uppercase">Pemohon</p>
              <p class="font-bold text-gray-900 text-[12px]">{{ dipilih?.nama_pegawai }}</p>
              <p class="text-[9px] text-gray-400 font-bold uppercase mt-2">Jenis Bantuan</p>
              <p class="font-semibold text-[#0F4C3A] text-[12px]">{{ dipilih?.jenis_bantuan }}</p>
            </div>
            <div class="space-y-1.5 mb-5">
              <div class="flex items-center justify-between">
                <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amaun Diluluskan (RM) *</label>
                <span v-if="PETA_KUNCI[dipilih?.jenis_bantuan] && kadarMap[PETA_KUNCI[dipilih?.jenis_bantuan]] != null"
                  class="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md">
                  Auto-isi ✓
                </span>
                <span v-else
                  class="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md">
                  Pertimbangan JK
                </span>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">RM</span>
                <input v-model="amaunLulus" type="number" min="0.01" step="0.50" placeholder="0.00" required
                  class="w-full bg-white border border-gray-300 text-emerald-700 font-black text-base rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"/>
              </div>
              <p class="text-[10px] text-gray-400">Amaun ini akan direkod ke dalam Buku Tunai secara automatik.</p>
            </div>
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <button @click="showModalLulus = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="sahkanLulus" :disabled="memproses"
                class="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm">
                {{ memproses ? 'Memproses...' : 'Sahkan Kelulusan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- ==================== MODAL TOLAK ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalTolak"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalTolak = false">
          <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <svg class="w-4.5 h-4.5 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">Penolakan Permohonan</h3>
                <p class="text-[10px] text-gray-500">Sebab penolakan wajib dinyatakan kepada pemohon</p>
              </div>
            </div>
            <div class="bg-rose-50 border border-rose-100 rounded-lg p-3 mb-4">
              <p class="text-[11px] font-bold text-rose-800">{{ dipilih?.nama_pegawai }}</p>
              <p class="text-[10px] text-rose-600 mt-0.5">{{ dipilih?.jenis_bantuan }}</p>
            </div>
            <div class="space-y-1.5 mb-5">
              <label class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Sebab Penolakan *
              </label>
              <textarea v-model="sebabTolak" rows="3" required
                placeholder="Nyatakan sebab mengapa permohonan ini tidak dapat diluluskan..."
                :class="['w-full text-[12px] bg-gray-50 border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 resize-none transition-all',
                  tunjukRalat && !sebabTolak.trim()
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-gray-300 focus:ring-rose-500/20 focus:border-rose-500']">
              </textarea>
              <p v-if="tunjukRalat && !sebabTolak.trim()" class="text-[10px] text-rose-600 font-bold">
                Sebab penolakan wajib diisi sebelum boleh menolak permohonan.
              </p>
            </div>
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <button @click="showModalTolak = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="sahkanTolak" :disabled="memproses"
                class="flex-[2] py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm">
                {{ memproses ? 'Memproses...' : 'Sahkan Penolakan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ==================== MODAL BAGI PIHAK WARIS ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalBagiPihak"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalBagiPihak = false">
          <div class="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-rose-50 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-rose-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-rose-900 text-sm">Permohonan Bantuan Bagi Pihak Waris</p>
                  <p class="text-[10px] text-rose-600">Diisi oleh AJK Negeri / Ketua PTJ bagi pihak ahli yang telah meninggal dunia</p>
                </div>
              </div>
              <button @click="showModalBagiPihak = false"
                class="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-100 transition-colors">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5">

              <!-- Pilih ahli (si mati) -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Nama Ahli (Arwah) <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input v-model="cariAhli" type="text"
                    placeholder="Taip nama atau No. K/P untuk cari..."
                    class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
                    @input="pilihSimati = null; formWaris.no_akaun_waris = ''; formWaris.nama_bank_waris = ''; formWaris.nama_waris = ''" />
                  <svg v-if="!pilihSimati" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 105.65 5.65a7 7 0 0011 11z"/>
                  </svg>
                </div>
                <!-- Dropdown carian -->
                <div v-if="cariAhli.length >= 2 && !pilihSimati && ahliTapisBagiPihak.length > 0"
                  class="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-48 overflow-y-auto bg-white">
                  <button v-for="a in ahliTapisBagiPihak.slice(0, 8)" :key="a.no_kp"
                    type="button"
                    @click="pilihAhliSimati(a)"
                    class="w-full text-left px-3 py-2.5 hover:bg-rose-50 transition-colors border-b border-gray-50 last:border-0">
                    <p class="font-bold text-gray-900 text-[12px]">{{ a.nama_pegawai }}</p>
                    <p class="text-[10px] text-gray-500 font-mono">{{ a.no_kp }} <span class="mx-1 text-gray-300">·</span> {{ a.penempatan || '—' }}</p>
                  </button>
                </div>
                <!-- Ahli dipilih -->
                <div v-if="pilihSimati"
                  class="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                  <div>
                    <p class="font-bold text-rose-900 text-[12px]">{{ pilihSimati.nama_pegawai }}</p>
                    <p class="text-[10px] text-rose-600 font-mono">{{ pilihSimati.no_kp }} · {{ pilihSimati.penempatan || '—' }}</p>
                  </div>
                  <button @click="pilihSimati = null; cariAhli = ''"
                    class="text-rose-400 hover:text-rose-600 p-1 rounded hover:bg-rose-100 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Jenis Bantuan -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Jenis Bantuan <span class="text-rose-500">*</span>
                </label>
                <select v-model="formBagiPihak.jenis_bantuan"
                  class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all">
                  <option value="Khairat Kematian">Khairat Kematian</option>
                  <option value="Kemalangan - Rawatan Luar (Tanpa Wad)">Kemalangan - Rawatan Luar (Tanpa Wad)</option>
                  <option value="Kemalangan - Dimasukkan Wad">Kemalangan - Dimasukkan Wad</option>
                  <option value="Bencana Alam - Banjir">Bencana Alam - Banjir</option>
                  <option value="Bencana Alam - Kebakaran">Bencana Alam - Kebakaran</option>
                  <option value="Persaraan">Persaraan</option>
                </select>
              </div>

              <!-- Keterangan -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Keterangan / Kronologi</label>
                <textarea v-model="formBagiPihak.keterangan" rows="3"
                  placeholder="Nyatakan kronologi atau butiran kejadian..."
                  class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none transition-all">
                </textarea>
              </div>

              <!-- Bahagian Maklumat Waris -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-px bg-rose-100"></div>
                  <p class="text-[9px] font-bold text-rose-500 uppercase tracking-wider px-2">Maklumat Waris (Penerima Bantuan)</p>
                  <div class="flex-1 h-px bg-rose-100"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <!-- Nama Waris -->
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Nama Penuh Waris <span class="text-rose-500">*</span>
                    </label>
                    <input v-model="formWaris.nama_waris" type="text" placeholder="Nama penuh waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all" />
                  </div>

                  <!-- Hubungan -->
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Hubungan Dengan Arwah <span class="text-rose-500">*</span>
                    </label>
                    <select v-model="formWaris.hubungan_waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all">
                      <option value="">-- Pilih --</option>
                      <option>Suami / Isteri</option>
                      <option>Anak</option>
                      <option>Ibu / Bapa</option>
                      <option>Adik-beradik</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>

                  <!-- No K/P Waris -->
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No. K/P Waris</label>
                    <input v-model="formWaris.no_kp_waris" type="text" placeholder="000000-00-0000"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 font-mono transition-all" />
                  </div>

                  <!-- No Akaun -->
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      No. Akaun Bank <span class="text-rose-500">*</span>
                    </label>
                    <input v-model="formWaris.no_akaun_waris" type="text" placeholder="Contoh: 1234567890"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 font-mono transition-all" />
                  </div>

                  <!-- Nama Bank -->
                  <div class="col-span-2 space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Nama Bank <span class="text-rose-500">*</span>
                    </label>
                    <select v-model="formWaris.nama_bank_waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all">
                      <option value="">-- Pilih Bank --</option>
                      <option>Maybank</option>
                      <option>CIMB Bank</option>
                      <option>Public Bank</option>
                      <option>RHB Bank</option>
                      <option>Hong Leong Bank</option>
                      <option>AmBank</option>
                      <option>Bank Islam</option>
                      <option>Bank Rakyat</option>
                      <option>Bank Muamalat</option>
                      <option>BSN (Bank Simpanan Nasional)</option>
                      <option>Affin Bank</option>
                      <option>Alliance Bank</option>
                      <option>OCBC Bank</option>
                      <option>Standard Chartered</option>
                      <option>HSBC Bank</option>
                      <option>Agrobank</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>
                </div>

                <p class="text-[10px] text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  Sila pastikan nombor akaun dan nama bank adalah betul. Wang bantuan akan dipindahkan terus ke akaun ini setelah diluluskan.
                </p>
              </div>

              <!-- Upload Dokumen -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Dokumen Sokongan <span class="text-[10px] text-gray-400 font-normal">(Sijil Kematian, dll. — Maks 20 fail)</span>
                </label>
                <input ref="inputDokumenBagiPihak" type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                  @change="onDokumenBagiPihak"
                  class="w-full text-[12px] text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all" />
                <div v-if="failBagiPihak.length > 0" class="flex flex-wrap gap-1.5 mt-1">
                  <span v-for="(f, i) in failBagiPihak" :key="i"
                    class="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-medium">
                    {{ f.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
              <div v-if="ralatBagiPihak" class="mb-3 text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 font-semibold">
                {{ ralatBagiPihak }}
              </div>
              <div class="flex items-center justify-between gap-3">
                <button @click="showModalBagiPihak = false"
                  class="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button @click="hantarBagiPihak" :disabled="memprosesBagiPihak"
                  class="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm">
                  {{ memprosesBagiPihak ? 'Menghantar...' : 'Hantar Permohonan' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ==================== MODAL EDIT PERMOHONAN ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalEdit"
          class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalEdit = false">
          <div class="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-amber-50/60 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">Edit Permohonan Kebajikan</p>
                  <p class="text-[10px] text-gray-400 font-mono">ID #{{ dipilih?.id }} · {{ dipilih?.nama_pegawai }}</p>
                </div>
              </div>
              <button @click="showModalEdit = false"
                class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5">

              <!-- Jenis Bantuan -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Jenis Bantuan <span class="text-rose-500">*</span>
                </label>
                <select v-model="formEdit.jenis_bantuan"
                  class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all">
                  <option value="Khairat Kematian">Khairat Kematian</option>
                  <option value="Kemalangan - Rawatan Luar (Tanpa Wad)">Kemalangan - Rawatan Luar (Tanpa Wad)</option>
                  <option value="Kemalangan - Dimasukkan Wad">Kemalangan - Dimasukkan Wad</option>
                  <option value="Bencana Alam - Banjir">Bencana Alam - Banjir</option>
                  <option value="Bencana Alam - Kebakaran">Bencana Alam - Kebakaran</option>
                  <option value="Persaraan">Persaraan</option>
                </select>
              </div>

              <!-- Keterangan -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Keterangan / Kronologi</label>
                <textarea v-model="formEdit.keterangan" rows="4"
                  placeholder="Nyatakan kronologi atau butiran kejadian..."
                  class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 resize-none transition-all">
                </textarea>
              </div>

              <!-- Maklumat Waris (hanya jika bagi pihak) -->
              <div v-if="dipilih?.bagi_pihak" class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-px bg-rose-100"></div>
                  <p class="text-[9px] font-bold text-rose-500 uppercase tracking-wider px-2">Maklumat Waris</p>
                  <div class="flex-1 h-px bg-rose-100"></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Nama Waris <span class="text-rose-500">*</span>
                    </label>
                    <input v-model="formEditWaris.nama_waris" type="text" placeholder="Nama penuh waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Hubungan <span class="text-rose-500">*</span>
                    </label>
                    <select v-model="formEditWaris.hubungan_waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all">
                      <option value="">-- Pilih --</option>
                      <option>Suami / Isteri</option>
                      <option>Anak</option>
                      <option>Ibu / Bapa</option>
                      <option>Adik-beradik</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No. K/P Waris</label>
                    <input v-model="formEditWaris.no_kp_waris" type="text" placeholder="000000-00-0000"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 font-mono transition-all" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      No. Akaun Bank <span class="text-rose-500">*</span>
                    </label>
                    <input v-model="formEditWaris.no_akaun_waris" type="text" placeholder="Contoh: 1234567890"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 font-mono transition-all" />
                  </div>
                  <div class="col-span-2 space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Nama Bank <span class="text-rose-500">*</span>
                    </label>
                    <select v-model="formEditWaris.nama_bank_waris"
                      class="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all">
                      <option value="">-- Pilih Bank --</option>
                      <option>Maybank</option>
                      <option>CIMB Bank</option>
                      <option>Public Bank</option>
                      <option>RHB Bank</option>
                      <option>Hong Leong Bank</option>
                      <option>AmBank</option>
                      <option>Bank Islam</option>
                      <option>Bank Rakyat</option>
                      <option>Bank Muamalat</option>
                      <option>BSN (Bank Simpanan Nasional)</option>
                      <option>Affin Bank</option>
                      <option>Alliance Bank</option>
                      <option>OCBC Bank</option>
                      <option>Standard Chartered</option>
                      <option>HSBC Bank</option>
                      <option>Agrobank</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Dokumen Sedia Ada -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dokumen Sedia Ada</label>
                  <span v-if="dokumenEditKeep.length > 0"
                    class="text-[10px] text-gray-400">{{ dokumenEditKeep.length }} fail disimpan</span>
                </div>
                <div v-if="dokumenEditKeep.length > 0" class="space-y-1.5">
                  <div v-for="(doc, i) in dokumenEditKeep" :key="doc"
                    class="flex items-center gap-3 px-3 py-2 rounded-xl border"
                    :class="isGambar(doc) ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'">
                    <!-- Ikon jenis fail -->
                    <svg v-if="!isGambar(doc)" class="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <button v-if="!isGambar(doc)" type="button"
                      @click="bukaPreviewPdf(`${apiBase}/uploads/bantuan/${doc}`)"
                      class="flex-1 text-[11px] font-medium truncate text-left text-red-700 hover:text-red-900">
                      PDF {{ i + 1 }} — Klik lihat
                    </button>
                    <a v-else :href="`${apiBase}/uploads/bantuan/${doc}`" target="_blank" rel="noopener"
                      class="flex-1 text-[11px] font-medium truncate text-blue-700 hover:text-blue-900">
                      Gambar {{ i + 1 }} ↗
                    </a>
                    <button type="button" @click="buangDokumenEdit(doc)"
                      class="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors shrink-0"
                      title="Buang fail ini">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p v-else class="text-[11px] text-gray-400 italic px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
                  Tiada dokumen sedia ada (semua telah dibuang atau tiada dari mula).
                </p>
              </div>

              <!-- Tambah Dokumen Baru -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Tambah Dokumen Baharu <span class="text-[10px] text-gray-400 font-normal">(PDF, JPG, PNG — Maks 20 fail)</span>
                </label>
                <input ref="inputDokumenEdit" type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                  @change="onFailEdit"
                  class="w-full text-[12px] text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all" />
                <div v-if="failEdit.length > 0" class="flex flex-wrap gap-1.5 mt-1">
                  <span v-for="(f, i) in failEdit" :key="i"
                    class="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-medium">
                    {{ f.name }}
                  </span>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
              <div class="flex items-center justify-between gap-3">
                <button @click="showModalEdit = false"
                  class="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button @click="simpanEdit" :disabled="memprosesEdit"
                  class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-60 shadow-sm inline-flex items-center gap-2">
                  <svg v-if="memprosesEdit" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  {{ memprosesEdit ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ==================== PDF VIEWER ==================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="pdfPratontonUrl"
          class="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col"
          @click.self="tutupPreviewPdf">

          <!-- Toolbar -->
          <div class="flex items-center justify-between px-4 py-3 bg-gray-900/95 shrink-0">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/>
              </svg>
              <span class="text-white text-[12px] font-bold">Dokumen PDF</span>
            </div>
            <div class="flex items-center gap-2">
              <a :href="pdfPratontonUrl" download
                class="text-[11px] font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Muat Turun
              </a>
              <button @click="tutupPreviewPdf"
                class="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- PDF content -->
          <div class="flex-1 overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
            <!-- Loading -->
            <div v-if="pdfMuatLoading && !pdfMuatRalat"
              class="flex flex-col items-center justify-center gap-3 text-white/60 py-20">
              <div class="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              <p class="text-[12px]">Memuatkan PDF...</p>
            </div>
            <!-- Ralat -->
            <div v-if="pdfMuatRalat"
              class="flex flex-col items-center gap-3 text-white/60 py-20">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
              <p class="text-[13px] font-bold text-white">Gagal memuatkan PDF</p>
              <a :href="pdfPratontonUrl" target="_blank" rel="noopener"
                class="text-[11px] text-blue-400 hover:text-blue-300 underline">
                Cuba buka dalam tab baharu ↗
              </a>
            </div>
            <!-- PDF Pages -->
            <VuePdfEmbed
              :source="pdfPratontonUrl"
              class="w-full max-w-3xl shadow-2xl"
              @loaded="pdfMuatLoading = false"
              @loading-failed="pdfMuatLoading = false; pdfMuatRalat = true"
            />
          </div>

        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import VuePdfEmbed from 'vue-pdf-embed';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

// ── PDF Viewer ────────────────────────────────────────────────────────
const pdfPratontonUrl = ref(null);
const pdfMuatLoading = ref(false);
const pdfMuatRalat = ref(false);
const bukaPreviewPdf = (url) => {
  pdfPratontonUrl.value = url;
  pdfMuatLoading.value = true;
  pdfMuatRalat.value = false;
};
const tutupPreviewPdf = () => { pdfPratontonUrl.value = null; };

const senarai = ref([]);
const loading = ref(true);
const filterAktif = ref('SEMUA');

const showModal = ref(false);
const dipilih = ref(null);
const catatanAdmin = ref('');

const showModalLulus = ref(false);
const amaunLulus = ref('');

const showModalTolak = ref(false);
const sebabTolak = ref('');
const tunjukRalat = ref(false);

const memproses = ref(false);

// Jawatan semasa admin yang log masuk
const jawatanKelab = ref('');
const adaHakLulus = computed(() => jawatanKelab.value === 'Yang Dipertua');

// Kadar bantuan dari DB
const kadarBantuan = ref([]);
const showKadarPanel = ref(false);
const editKunci = ref(null);
const editNilai = ref('');
const simpanLoading = ref(false);

// Peta jenis_bantuan → kunci kadar_bantuan (sama dengan backend PETA_KUNCI)
const PETA_KUNCI = {
  'Khairat Kematian':                      'khairat_kematian',
  'Kemalangan - Rawatan Luar (Tanpa Wad)': 'kemalangan_rawatan_luar',
  'Kemalangan - Dimasukkan Wad':           'kemalangan_wad',
  'Bencana Alam - Banjir':                 'bencana_banjir',
  'Bencana Alam - Kebakaran':              'bencana_kebakaran',
  'Persaraan':                             'persaraan',
};

// Lookup amaun dinamik dari kadarBantuan yang diambil dari API
const kadarMap = computed(() => {
  const m = {};
  for (const k of kadarBantuan.value) m[k.kunci] = parseFloat(k.amaun);
  return m;
});

// ── Helpers ──────────────────────────────────────────────────────────
const parseDokumen = (str) => {
  if (!str || str === '[]' || str === 'null') return [];
  try { return JSON.parse(str); } catch { return str ? [str] : []; }
};

const isGambar = (filename) => /\.(jpe?g|png|webp|gif)$/i.test(filename);

const labelStatus = (s) => {
  if (!s || s === 'DIPROSES') return 'Menunggu';
  if (s === 'DIKEMUKAKAN') return 'Dikemukakan JK';
  if (s === 'LULUS') return 'Diluluskan';
  if (s === 'DITOLAK') return 'Ditolak';
  return s;
};

const badgeStatus = (s) => {
  if (!s || s === 'DIPROSES') return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (s === 'DIKEMUKAKAN')    return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
  if (s === 'LULUS')          return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (s === 'DITOLAK')        return 'bg-rose-100 text-rose-800 border border-rose-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const formatTarikh = (t) => {
  if (!t) return '—';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTarikhmasa = (t) => {
  if (!t) return '—';
  return new Date(t).toLocaleString('ms-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ── Computed ─────────────────────────────────────────────────────────
const bilMenunggu    = computed(() => senarai.value.filter(p => !p.status_permohonan || p.status_permohonan === 'DIPROSES').length);
const bilDikemukakan = computed(() => senarai.value.filter(p => p.status_permohonan === 'DIKEMUKAKAN').length);
const bilLulus       = computed(() => senarai.value.filter(p => p.status_permohonan === 'LULUS').length);
const bilDitolak     = computed(() => senarai.value.filter(p => p.status_permohonan === 'DITOLAK').length);
const jumlahLulus    = computed(() =>
  senarai.value
    .filter(p => p.status_permohonan === 'LULUS')
    .reduce((t, p) => t + parseFloat(p.amaun_lulus || 0), 0)
);

const tabs = computed(() => [
  { value: 'SEMUA',        label: 'Semua',           count: senarai.value.length, activeClass: 'bg-gray-800 text-white border-gray-800' },
  { value: 'MENUNGGU',     label: 'Menunggu',         count: bilMenunggu.value,    activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'DIKEMUKAKAN',  label: 'Dikemukakan JK',  count: bilDikemukakan.value, activeClass: 'bg-indigo-600 text-white border-indigo-600' },
  { value: 'LULUS',        label: 'Diluluskan',       count: bilLulus.value,       activeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { value: 'DITOLAK',      label: 'Ditolak',          count: bilDitolak.value,     activeClass: 'bg-rose-600 text-white border-rose-600' },
]);

const senaraiTapis = computed(() => {
  if (filterAktif.value === 'SEMUA')    return senarai.value;
  if (filterAktif.value === 'MENUNGGU') return senarai.value.filter(p => !p.status_permohonan || p.status_permohonan === 'DIPROSES');
  return senarai.value.filter(p => p.status_permohonan === filterAktif.value);
});

// ── API ───────────────────────────────────────────────────────────────
const muatKebajikan = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/kebajikan');
    if (data.success) senarai.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Modal actions ─────────────────────────────────────────────────────
const bukaModal = (p) => {
  dipilih.value = p;
  catatanAdmin.value = p.catatan_admin || '';
  showModal.value = true;
};

const muatKadar = async () => {
  try {
    const { data } = await api.get('/bantuan/kadar');
    if (data.success) kadarBantuan.value = data.data;
  } catch {}
};

const mulaEdit = (k) => {
  editKunci.value = k.kunci;
  editNilai.value = String(parseFloat(k.amaun));
};

const batalEdit = () => { editKunci.value = null; editNilai.value = ''; };

const simpanKadar = async (kunci) => {
  const amaun = parseFloat(editNilai.value);
  if (isNaN(amaun) || amaun < 0) return alert('Sila masukkan amaun yang sah.');
  simpanLoading.value = true;
  try {
    await api.put(`/bantuan/kadar/${kunci}`, { amaun });
    await muatKadar();
    batalEdit();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat menyimpan kadar.');
  } finally { simpanLoading.value = false; }
};

const bukaModalLulus = () => {
  const kunci = PETA_KUNCI[dipilih.value?.jenis_bantuan];
  const autoAmaun = kunci != null ? kadarMap.value[kunci] : undefined;
  amaunLulus.value = autoAmaun != null ? String(autoAmaun) : '';
  showModalLulus.value = true;
};

const bukaModalTolak = () => {
  sebabTolak.value = '';
  tunjukRalat.value = false;
  showModalTolak.value = true;
};

const kemukakan = async () => {
  if (!dipilih.value) return;
  memproses.value = true;
  try {
    await api.put(`/admin/kebajikan/${dipilih.value.id}`, {
      status_permohonan: 'DIKEMUKAKAN',
      catatan_admin: catatanAdmin.value || null,
    });
    showModal.value = false;
    await muatKebajikan();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat memproses.');
  } finally { memproses.value = false; }
};

const sahkanLulus = async () => {
  if (!amaunLulus.value || parseFloat(amaunLulus.value) <= 0) {
    return alert('Sila masukkan amaun yang sah (> RM 0.00).');
  }
  memproses.value = true;
  try {
    await api.put(`/admin/kebajikan/${dipilih.value.id}`, {
      status_permohonan: 'LULUS',
      amaun_lulus: amaunLulus.value,
      catatan_admin: catatanAdmin.value || null,
    });
    showModalLulus.value = false;
    showModal.value = false;
    await muatKebajikan();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat meluluskan permohonan.');
  } finally { memproses.value = false; }
};

const sahkanTolak = async () => {
  tunjukRalat.value = true;
  if (!sebabTolak.value.trim()) return;
  memproses.value = true;
  try {
    await api.put(`/admin/kebajikan/${dipilih.value.id}`, {
      status_permohonan: 'DITOLAK',
      sebab_tolak: sebabTolak.value.trim(),
      catatan_admin: catatanAdmin.value || null,
    });
    showModalTolak.value = false;
    showModal.value = false;
    await muatKebajikan();
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat menolak permohonan.');
  } finally { memproses.value = false; }
};

// ── Edit Permohonan ───────────────────────────────────────────────────
const showModalEdit = ref(false);
const memprosesEdit = ref(false);
const dokumenEditKeep = ref([]);
const failEdit = ref([]);
const inputDokumenEdit = ref(null);

const formEdit = ref({ jenis_bantuan: '', keterangan: '' });
const formEditWaris = ref({
  nama_waris: '', no_kp_waris: '', hubungan_waris: '', no_akaun_waris: '', nama_bank_waris: ''
});

const bukaModalEdit = () => {
  formEdit.value = {
    jenis_bantuan: dipilih.value.jenis_bantuan,
    keterangan: dipilih.value.keterangan || '',
  };
  formEditWaris.value = {
    nama_waris: dipilih.value.nama_waris || '',
    no_kp_waris: dipilih.value.no_kp_waris || '',
    hubungan_waris: dipilih.value.hubungan_waris || '',
    no_akaun_waris: dipilih.value.no_akaun_waris || '',
    nama_bank_waris: dipilih.value.nama_bank_waris || '',
  };
  dokumenEditKeep.value = [...parseDokumen(dipilih.value.dokumen_sokongan)];
  failEdit.value = [];
  if (inputDokumenEdit.value) inputDokumenEdit.value.value = '';
  showModalEdit.value = true;
};

const buangDokumenEdit = (filename) => {
  dokumenEditKeep.value = dokumenEditKeep.value.filter(f => f !== filename);
};

const onFailEdit = (e) => {
  failEdit.value = Array.from(e.target.files || []);
};

const simpanEdit = async () => {
  if (!formEdit.value.jenis_bantuan) return alert('Jenis bantuan wajib dipilih.');
  memprosesEdit.value = true;
  try {
    const fd = new FormData();
    fd.append('jenis_bantuan', formEdit.value.jenis_bantuan);
    fd.append('keterangan', formEdit.value.keterangan);
    fd.append('dokumen_keep', JSON.stringify(dokumenEditKeep.value));

    if (dipilih.value.bagi_pihak) {
      fd.append('nama_waris', formEditWaris.value.nama_waris);
      fd.append('no_kp_waris', formEditWaris.value.no_kp_waris);
      fd.append('hubungan_waris', formEditWaris.value.hubungan_waris);
      fd.append('no_akaun_waris', formEditWaris.value.no_akaun_waris);
      fd.append('nama_bank_waris', formEditWaris.value.nama_bank_waris);
    }

    for (const f of failEdit.value) fd.append('dokumen', f);

    await api.put(`/admin/kebajikan/${dipilih.value.id}/edit`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    showModalEdit.value = false;
    await muatKebajikan();
    const updated = senarai.value.find(p => p.id === dipilih.value.id);
    if (updated) dipilih.value = updated;
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat menyimpan perubahan.');
  } finally {
    memprosesEdit.value = false;
  }
};

// ── Bagi Pihak Waris ─────────────────────────────────────────────────
const showModalBagiPihak = ref(false);
const memprosesBagiPihak = ref(false);
const ralatBagiPihak = ref('');
const cariAhli = ref('');
const pilihSimati = ref(null);
const senaraiAhliRingkas = ref([]);
const failBagiPihak = ref([]);
const inputDokumenBagiPihak = ref(null);

const formBagiPihak = ref({
  jenis_bantuan: 'Khairat Kematian',
  keterangan: '',
});

const formWaris = ref({
  nama_waris: '',
  no_kp_waris: '',
  hubungan_waris: '',
  no_akaun_waris: '',
  nama_bank_waris: '',
});

const ahliTapisBagiPihak = computed(() => {
  const carian = cariAhli.value.toLowerCase();
  if (carian.length < 2) return [];
  return senaraiAhliRingkas.value.filter(a =>
    a.nama_pegawai.toLowerCase().includes(carian) ||
    a.no_kp.includes(carian)
  );
});

const pilihAhliSimati = (ahli) => {
  pilihSimati.value = ahli;
  cariAhli.value = ahli.nama_pegawai;
  // Auto-isi maklumat waris dari profil ahli jika ada
  formWaris.value.nama_waris = ahli.nama_waris || '';
  formWaris.value.no_akaun_waris = ahli.no_akaun_waris || '';
  formWaris.value.nama_bank_waris = ahli.nama_bank_waris || '';
};

const onDokumenBagiPihak = (e) => {
  failBagiPihak.value = Array.from(e.target.files || []);
};

const bukaModalBagiPihak = async () => {
  pilihSimati.value = null;
  cariAhli.value = '';
  failBagiPihak.value = [];
  ralatBagiPihak.value = '';
  formBagiPihak.value = { jenis_bantuan: 'Khairat Kematian', keterangan: '' };
  formWaris.value = { nama_waris: '', no_kp_waris: '', hubungan_waris: '', no_akaun_waris: '', nama_bank_waris: '' };
  showModalBagiPihak.value = true;
  if (senaraiAhliRingkas.value.length === 0) {
    try {
      const { data } = await api.get('/admin/ahli-ringkas');
      if (data.success) senaraiAhliRingkas.value = data.data;
    } catch {}
  }
};

const hantarBagiPihak = async () => {
  ralatBagiPihak.value = '';
  if (!pilihSimati.value)
    return (ralatBagiPihak.value = 'Sila pilih ahli (arwah) terlebih dahulu.');
  if (!formWaris.value.nama_waris.trim())
    return (ralatBagiPihak.value = 'Nama waris wajib diisi.');
  if (!formWaris.value.hubungan_waris)
    return (ralatBagiPihak.value = 'Hubungan waris wajib dipilih.');
  if (!formWaris.value.no_akaun_waris.trim())
    return (ralatBagiPihak.value = 'No. akaun bank waris wajib diisi.');
  if (!formWaris.value.nama_bank_waris)
    return (ralatBagiPihak.value = 'Nama bank waris wajib dipilih.');

  memprosesBagiPihak.value = true;
  try {
    const fd = new FormData();
    fd.append('no_kp_simati', pilihSimati.value.no_kp);
    fd.append('jenis_bantuan', formBagiPihak.value.jenis_bantuan);
    fd.append('keterangan', formBagiPihak.value.keterangan || '');
    fd.append('nama_waris', formWaris.value.nama_waris);
    fd.append('no_kp_waris', formWaris.value.no_kp_waris || '');
    fd.append('hubungan_waris', formWaris.value.hubungan_waris);
    fd.append('no_akaun_waris', formWaris.value.no_akaun_waris);
    fd.append('nama_bank_waris', formWaris.value.nama_bank_waris);
    for (const f of failBagiPihak.value) fd.append('dokumen', f);

    const { data } = await api.post('/bantuan/mohon-bagi-pihak', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (data.success) {
      showModalBagiPihak.value = false;
      await muatKebajikan();
      alert(data.message);
    }
  } catch (e) {
    ralatBagiPihak.value = e.response?.data?.message || 'Ralat menghantar permohonan.';
  } finally {
    memprosesBagiPihak.value = false;
  }
};

onMounted(async () => {
  muatKebajikan();
  muatKadar();
  try {
    const { data } = await api.get('/admin/profil-saya');
    jawatanKelab.value = data.data?.jawatan_kelab || '';
  } catch {}
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }

.slide-down-enter-active { transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-leave-active { transition: all 0.16s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
