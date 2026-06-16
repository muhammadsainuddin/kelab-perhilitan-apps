<template>
  <div class="space-y-4 font-sans text-gray-900 pb-10 text-xs">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="font-bold text-base text-gray-900">Pengurusan Ahli</h2>
        <p class="text-gray-400 text-[11px] mt-0.5">Urus data ahli, jawatan, pendaftaran dan jejak profil 360°.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-if="tabAktif === 'semua' && isSuperAdmin" @click="janaSemulaAhli" :disabled="janaLoading"
          class="flex items-center gap-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-3 py-2 rounded-lg transition-all shadow-sm">
          <svg v-if="!janaLoading" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          <span v-else class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
          Jana Semula No. Ahli
        </button>
        <button v-if="tabAktif === 'semua'" @click="eksportCSV"
          class="flex items-center gap-1.5 text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-bold px-3 py-2 rounded-lg transition-all border border-gray-200 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Eksport CSV
        </button>
        <button v-if="tabAktif === 'semua' && filterPenempatan" @click="cetakAhliPenempatan"
          class="flex items-center gap-1.5 text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-bold px-3 py-2 rounded-lg transition-all border border-gray-200 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Cetak Senarai
        </button>
        <button @click="showDirektoriAJK = true"
          class="flex items-center gap-1.5 text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded-lg transition-all shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          Direktori AJK
        </button>
        <button v-if="tabAktif === 'jawatankuasa'" @click="cetakJawatankuasa"
          class="flex items-center gap-1.5 text-[11px] bg-white hover:bg-gray-50 text-gray-700 font-bold px-3 py-2 rounded-lg transition-all border border-gray-200 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Cetak Senarai
        </button>
        <button @click="bukaModalDaftar"
          class="flex items-center gap-1.5 text-[11px] bg-[#0F4C3A] hover:bg-[#155d47] text-white font-bold px-3 py-2 rounded-lg transition-all shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Daftar Ahli Baru
        </button>
      </div>
    </div>

    <!-- TAB SWITCHER -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button @click="tabAktif = 'semua'"
        :class="['px-4 py-1.5 rounded-lg text-xs font-bold transition-all', tabAktif === 'semua' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        Semua Ahli
      </button>
      <button @click="tabAktif = 'jawatankuasa'"
        :class="['px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5', tabAktif === 'jawatankuasa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Jawatankuasa
        <span class="bg-[#0F4C3A] text-white text-[9px] font-black px-1.5 py-px rounded-full leading-none">{{ ahliJawatankuasa.length }}</span>
      </button>
    </div>

    <!-- NOTIS JANA -->
    <Transition name="fade">
      <div v-if="mesejJana" :class="['text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 border', mesejJana.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
        {{ mesejJana.text }}
      </div>
    </Transition>

    <!-- ======================================== -->
    <!-- TAB: SEMUA AHLI                          -->
    <!-- ======================================== -->
    <template v-if="tabAktif === 'semua'">

      <!-- PENAPIS -->
      <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <div class="relative lg:col-span-1">
            <input v-model="carian" type="text" placeholder="Cari Nama, No. KP, Jawatan..."
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
            <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <select v-model="filterStatus" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Status</option><option value="aktif">Aktif</option><option value="tidak aktif">Tidak Aktif</option>
          </select>
          <select v-model="filterPenempatan" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Penempatan</option>
            <template v-for="induk in ptjInduk" :key="induk.id">
              <optgroup v-if="ptjAnak[induk.id]?.length" :label="induk.nama_penempatan">
                <option :value="induk.id">Semua {{ induk.nama_penempatan }}</option>
                <option v-for="anak in ptjAnak[induk.id]" :key="anak.id" :value="anak.id">↳ {{ anak.nama_penempatan }}</option>
              </optgroup>
              <option v-else :value="induk.id">{{ induk.nama_penempatan }}</option>
            </template>
          </select>
          <select v-model="filterGred" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Gred</option><option v-for="gred in senaraiGred" :key="gred" :value="gred">{{ gred }}</option>
          </select>
          <select v-model="filterPotongan" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Kaedah Potongan</option><option value="Potongan Biro angkasa">Biro Angkasa</option><option value="Bayar secara manual">Manual / FPX</option>
          </select>
        </div>
        <!-- Quick filter chips -->
        <div class="mt-2 flex flex-wrap gap-2">
          <button @click="filterBelumBayar = !filterBelumBayar"
            :class="['flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all', filterBelumBayar ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700']">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Belum Bayar Sahaja
            <span v-if="filterBelumBayar" class="bg-rose-600 text-white text-[8px] font-black px-1 py-px rounded-full leading-none">AKTIF</span>
          </button>
        </div>
      </div>

      <p class="text-gray-400 text-[11px]">
        Menunjukkan <span class="text-gray-700 font-bold">{{ ahliTertapis.length }}</span> daripada <span class="text-gray-700 font-bold">{{ semuaAhli.length }}</span> rekod
        <span v-if="jumlahBelumDaftar > 0" class="ml-2 text-amber-600 font-bold">· <span class="bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{{ jumlahBelumDaftar }} belum daftar apps</span> (baris kuning)</span>
      </p>

      <!-- JADUAL AHLI -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 font-bold">Nama Ahli</th>
                <th class="px-3 py-3 font-bold hidden md:table-cell">No. Ahli</th>
                <th class="px-3 py-3 font-bold hidden lg:table-cell">Jawatan Kelab</th>
                <th class="px-3 py-3 font-bold hidden lg:table-cell">Penempatan</th>
                <th class="px-3 py-3 font-bold hidden sm:table-cell">Gred / Potongan</th>
                <th class="text-center px-3 py-3 font-bold">Status</th>
                <th class="text-center px-3 py-3 font-bold">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loading"><td colspan="7" class="px-4 py-10 text-center text-gray-400"><div class="flex justify-center items-center gap-2 text-xs"><svg class="animate-spin w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memuatkan...</div></td></tr>
              <tr v-else-if="ahliTertapis.length === 0"><td colspan="7" class="px-4 py-12 text-center text-gray-400 text-xs">Tiada rekod dijumpai.</td></tr>
              <tr v-for="ahli in ahliTerpapar" :key="ahli.no_kp"
                :class="['transition-colors', !ahli.has_daftar ? 'bg-yellow-50 hover:bg-amber-50' : 'hover:bg-gray-50/80']">
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 overflow-hidden">
                      <img v-if="ahli.gambar" :src="`${apiBase}/uploads/images/${ahli.gambar}`" class="w-full h-full object-cover"/>
                      <span v-else class="text-emerald-700 text-xs font-black">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-gray-800 font-bold text-xs leading-tight uppercase">{{ ahli.nama_pegawai || '—' }}</p>
                      <p class="text-gray-400 text-[10px] font-mono">{{ ahli.no_kp }}</p>
                      <span v-if="!ahli.has_daftar" class="inline-block text-[9px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-px rounded font-bold leading-none mt-0.5">Belum Daftar Apps</span>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2.5 hidden md:table-cell">
                  <span class="text-gray-600 font-mono font-bold text-[10px] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{{ ahli.no_ahli || 'BELUM JANA' }}</span>
                </td>
                <td class="px-3 py-2.5 hidden lg:table-cell">
                  <span v-if="ahli.jawatan_kelab" :class="['text-[10px] font-bold px-2 py-0.5 rounded border', badgeJawatan(ahli.jawatan_kelab)]">{{ ahli.jawatan_kelab }}</span>
                  <span v-else class="text-gray-300 text-[10px]">—</span>
                </td>
                <td class="px-3 py-2.5 hidden lg:table-cell">
                  <span class="text-gray-500 text-[11px] font-medium truncate max-w-40 block" :title="ahli.penempatan">{{ ahli.penempatan || '—' }}</span>
                </td>
                <td class="px-3 py-2.5 hidden sm:table-cell">
                  <p class="text-gray-800 text-xs font-bold">{{ ahli.gred_sspa || '—' }}</p>
                  <span v-if="ahli.jenis_potongan === 'Potongan Biro angkasa'" class="inline-flex items-center gap-1 text-[9px] text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-px rounded font-bold uppercase tracking-wide mt-0.5">
                    <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>Biro Angkasa
                  </span>
                  <span v-else class="text-[9px] text-gray-400 font-medium mt-0.5 block">Manual / FPX</span>
                  <!-- Status yuran -->
                  <span v-if="ahli.is_paid" class="inline-flex items-center gap-1 text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded font-bold mt-0.5">
                    <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>BERBAYAR
                  </span>
                  <span v-else class="inline-flex items-center gap-1 text-[9px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-px rounded font-bold mt-0.5">
                    <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>BELUM BAYAR
                  </span>
                </td>
                <td class="px-3 py-2.5 text-center">
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border', badgeStatus(ahli.status_ahli)]">{{ ahli.status_ahli || 'TIDAK AKTIF' }}</span>
                </td>
                <td class="px-3 py-2.5 text-center">
                  <div class="flex justify-center gap-1">
                    <button @click="bukaDetails(ahli)" class="text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 border border-[#0F4C3A]/20 p-1.5 rounded-lg transition-colors">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button @click="bukaEdit(ahli)" class="text-[10px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2 py-1 rounded-lg transition-colors">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p class="text-gray-400 text-[10px] font-medium">Halaman {{ halamanSemasa }} / {{ jumlahHalaman }}</p>
          <div class="flex gap-1">
            <button @click="halamanSemasa--" :disabled="halamanSemasa === 1" class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors flex items-center justify-center text-xs">‹</button>
            <button v-for="p in halamanDipapar" :key="p" @click="halamanSemasa = p" :class="['w-7 h-7 rounded-lg text-[10px] font-bold transition-colors border flex items-center justify-center', p === halamanSemasa ? 'bg-[#0F4C3A] border-[#0F4C3A] text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100']">{{ p }}</button>
            <button @click="halamanSemasa++" :disabled="halamanSemasa === jumlahHalaman" class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors flex items-center justify-center text-xs">›</button>
          </div>
        </div>
      </div>

    </template>

    <!-- ======================================== -->
    <!-- TAB: JAWATANKUASA KELAB                  -->
    <!-- ======================================== -->
    <template v-else>

      <!-- PENAPIS JAWATANKUASA -->
      <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
        <div class="flex flex-wrap gap-2 items-center">
          <div class="relative flex-1 min-w-40">
            <input v-model="carianAJK" type="text" placeholder="Cari nama ahli jawatankuasa..."
              class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
            <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <select v-model="filterJawatanAJK"
            class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Jawatan AJK</option>
            <option v-for="j in hierarkiJawatan" :key="j" :value="j">{{ j }}</option>
          </select>
          <select v-model="filterPenempatanAJK"
            class="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Penempatan</option>
            <template v-for="induk in ptjInduk" :key="induk.id">
              <optgroup v-if="ptjAnak[induk.id]?.length" :label="induk.nama_penempatan">
                <option :value="induk.id">Semua {{ induk.nama_penempatan }}</option>
                <option v-for="anak in ptjAnak[induk.id]" :key="anak.id" :value="anak.id">↳ {{ anak.nama_penempatan }}</option>
              </optgroup>
              <option v-else :value="induk.id">{{ induk.nama_penempatan }}</option>
            </template>
          </select>
          <button @click="filterBelumBayarAJK = !filterBelumBayarAJK"
            :class="['flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border transition-all shrink-0', filterBelumBayarAJK ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700']">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Belum Bayar
            <span v-if="filterBelumBayarAJK" class="bg-rose-600 text-white text-[8px] font-black px-1 py-px rounded-full leading-none">AKTIF</span>
          </button>
        </div>
      </div>

      <p class="text-gray-400 text-[11px]">
        Menunjukkan <span class="text-gray-700 font-bold">{{ ahliJawatankuasaTertapis.length }}</span> daripada <span class="text-gray-700 font-bold">{{ ahliJawatankuasa.length }}</span> ahli jawatankuasa
        <span v-if="jumlahBelumBayarAJK > 0" class="ml-2 text-rose-600 font-bold">· <span class="bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">{{ jumlahBelumBayarAJK }} belum bayar</span></span>
      </p>

      <!-- HIERARKI VIEW -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-400">
        <div class="flex justify-center items-center gap-2 text-xs">
          <svg class="animate-spin w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          Memuatkan...
        </div>
      </div>
      <div v-else-if="ahliJawatankuasaTertapis.length === 0" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400 text-xs">
        Tiada ahli jawatankuasa dijumpai dengan penapis semasa.
      </div>
      <div v-else class="space-y-3">
        <div v-for="jawatan in hierarkiDipapar" :key="jawatan" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Section header -->
          <div :class="['flex items-center justify-between px-4 py-2.5 border-b', bgSeksyenJawatan(jawatan)]">
            <div class="flex items-center gap-2">
              <span :class="['text-[10px] font-black uppercase tracking-wider', warnaTeksJawatan(jawatan)]">{{ jawatan }}</span>
            </div>
            <span :class="['text-[9px] font-bold px-2 py-0.5 rounded-full border', badgeJawatan(jawatan)]">
              {{ ahliMengikutJawatan(jawatan).length }} orang
            </span>
          </div>
          <!-- Members -->
          <div class="divide-y divide-gray-50">
            <div v-for="(ahli, idx) in ahliMengikutJawatan(jawatan)" :key="ahli.no_kp"
              class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/70 transition-colors group">
              <span class="text-[9px] text-gray-300 font-mono w-5 text-right shrink-0">{{ idx + 1 }}.</span>
              <!-- Avatar -->
              <div class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="ahli.gambar" :src="`${apiBase}/uploads/images/${ahli.gambar}`" class="w-full h-full object-cover"/>
                <span v-else class="text-emerald-700 text-xs font-black">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
              </div>
              <!-- Info utama -->
              <div class="flex-1 min-w-0">
                <p class="text-gray-800 font-bold text-xs leading-tight truncate uppercase">{{ ahli.nama_pegawai || '—' }}</p>
                <p class="text-gray-400 text-[10px] mt-px">{{ ahli.penempatan || '—' }}<span v-if="ahli.gred_sspa"> · {{ ahli.gred_sspa }}</span></p>
              </div>
              <!-- Kontak -->
              <div class="hidden md:flex items-center gap-1 shrink-0">
                <a v-if="ahli.no_tel" :href="`tel:${ahli.no_tel}`" :title="ahli.no_tel"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </a>
                <a v-if="ahli.no_tel" :href="waLink(ahli.no_tel)" target="_blank" rel="noopener" title="WhatsApp"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a v-if="ahli.email" :href="`mailto:${ahli.email}`" :title="ahli.email"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </a>
              </div>
              <!-- Status yuran -->
              <span :class="['text-[9px] font-bold px-2 py-0.5 rounded border shrink-0', ahli.is_paid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                {{ ahli.is_paid ? 'BERBAYAR' : 'BELUM BAYAR' }}
              </span>
              <!-- Tindakan -->
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button @click="bukaDetails(ahli)" class="text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 border border-[#0F4C3A]/20 p-1.5 rounded-lg transition-colors">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                <button @click="bukaEdit(ahli)" class="text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200 p-1.5 rounded-lg transition-colors">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- MODAL DIREKTORI AJK -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDirektoriAJK" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" @click.self="showDirektoriAJK = false">
          <div class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl flex flex-col max-h-[85vh]">
            <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div class="flex-1">
                <h3 class="text-gray-900 font-black text-sm">Direktori AJK</h3>
                <p class="text-gray-400 text-[10px]">{{ ahliJawatankuasa.length }} ahli jawatankuasa</p>
              </div>
              <button @click="showDirektoriAJK = false" class="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="px-4 pt-3 pb-2 shrink-0">
              <div class="relative">
                <input v-model="cariDirektoriAJK" type="text" placeholder="Cari nama atau jawatan..."
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"/>
                <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-50">
              <div v-if="direktoriAJKTertapis.length === 0" class="p-8 text-center text-gray-400 text-xs">Tiada rekod dijumpai.</div>
              <div v-for="ahli in direktoriAJKTertapis" :key="ahli.no_kp" class="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img v-if="ahli.gambar" :src="`${apiBase}/uploads/images/${ahli.gambar}`" class="w-full h-full object-cover"/>
                    <span v-else class="text-emerald-700 text-sm font-black">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-gray-900 font-bold text-xs uppercase truncate">{{ ahli.nama_pegawai || '—' }}</p>
                    <p class="text-gray-400 text-[10px]">{{ ahli.jawatan_kelab }}</p>
                    <p v-if="ahli.penempatan" class="text-gray-400 text-[10px] truncate">{{ ahli.penempatan }}</p>
                  </div>
                </div>
                <div class="mt-2 flex flex-wrap gap-2 pl-12">
                  <a v-if="ahli.no_tel" :href="`tel:${ahli.no_tel}`"
                    class="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    {{ ahli.no_tel }}
                  </a>
                  <a v-if="ahli.no_tel" :href="waLink(ahli.no_tel)" target="_blank" rel="noopener"
                    class="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a v-if="ahli.email" :href="`mailto:${ahli.email}`"
                    class="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors truncate max-w-[160px]">
                    <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <span class="truncate">{{ ahli.email }}</span>
                  </a>
                  <span v-if="!ahli.no_tel && !ahli.email" class="text-[10px] text-gray-300 italic">Tiada maklumat hubungan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL PROFIL 360 -->
    <ProfilAhli360 :show="showDetails" :ahliBase="ahliDipilih" @close="showDetails = false" @edit="bukaEditDariProfil" />

    <!-- MODAL DAFTAR STAF -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDaftar" class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showDaftar = false">
          <div class="bg-white border border-gray-200 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-start px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="text-gray-900 font-black text-sm">Daftar Ahli Baru</h3>
                <p class="text-gray-400 text-[11px] mt-0.5">Tambah ahli secara tunggal atau serentak. Nama, No. KP dan Penempatan diwajibkan.</p>
              </div>
              <button @click="showDaftar = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-5 overflow-y-auto flex-1 custom-scrollbar bg-gray-50/50">
              <div class="space-y-3">
                <div v-for="(row, index) in borangDaftar" :key="index" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                  <span class="absolute -left-2 -top-2 bg-[#0F4C3A] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">{{ index + 1 }}</span>
                  <button v-if="borangDaftar.length > 1" @click="buangBaris(index)" class="absolute top-2 right-2 text-rose-400 hover:text-rose-600 bg-rose-50 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="md:col-span-2">
                      <label class="field-lbl">Nama Penuh *</label>
                      <input v-model="row.nama_pegawai" type="text" placeholder="Nama Staf" required class="field-inp"/>
                    </div>
                    <div>
                      <label class="field-lbl">No. Kad Pengenalan *</label>
                      <input v-model="row.no_kp" type="text" placeholder="Tanpa sengkang (-)" required class="field-inp font-mono"/>
                    </div>
                    <div>
                      <label class="field-lbl">Cawangan / Penempatan *</label>
                      <input v-model="row.penempatan" type="text" :list="`listPTJ-${index}`" placeholder="Cth: Ibu Pejabat" required class="field-inp"/>
                      <datalist :id="`listPTJ-${index}`"><option v-for="ptj in senaraiPenempatanLengkap" :key="ptj.id" :value="ptj.nama_penempatan"></option></datalist>
                    </div>
                    <div>
                      <label class="field-lbl">Gred SSPA</label>
                      <input v-model="row.gred_sspa" type="text" :list="`listGred-${index}`" placeholder="Cth: N19, VU5" class="field-inp uppercase"/>
                      <datalist :id="`listGred-${index}`"><option v-for="g in senaraiGred" :key="g" :value="g"></option></datalist>
                    </div>
                    <div>
                      <label class="field-lbl">Jawatan Dalam Kelab</label>
                      <select v-model="row.jawatan_kelab" class="field-inp">
                        <option value="">— Tiada Jawatan —</option>
                        <option v-for="j in senaraiJawatan" :key="j" :value="j">{{ j }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 flex justify-center">
                <button @click="tambahBaris" type="button" class="text-xs font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-4 py-1.5 rounded-xl border border-[#0F4C3A]/20 transition-colors flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> Tambah Baris
                </button>
              </div>
              <Transition name="fade">
                <div v-if="mesejDaftar" :class="['mt-3 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 border', mesejDaftar.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesejDaftar.text }}
                </div>
              </Transition>
            </div>
            <div class="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0 bg-white rounded-b-2xl">
              <button @click="showDaftar = false" class="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors">Batal</button>
              <button @click="simpanDaftarPukal" :disabled="saving" class="px-6 py-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-xs font-black shadow-md disabled:opacity-60 flex items-center gap-2 transition-colors">
                <span v-if="saving" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Semua Rekod' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL EDIT PROFIL AHLI -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEdit" class="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showEdit = false">
          <div class="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">

            <!-- Header modal dengan avatar -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0 bg-linear-to-r from-[#0F4C3A]/5 to-transparent rounded-t-2xl">
              <div class="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="formEdit._gambar" :src="`${apiBase}/uploads/images/${formEdit._gambar}`" class="w-full h-full object-cover"/>
                <span v-else class="text-emerald-700 text-sm font-black">{{ (formEdit.nama_pegawai || '?').charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-gray-900 font-black text-sm truncate">{{ formEdit.nama_pegawai || 'Kemaskini Profil' }}</h3>
                <p class="text-gray-400 text-[10px] font-mono">{{ formEdit.no_kp }}</p>
              </div>
              <button @click="showEdit = false" class="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-full transition-all border border-gray-200 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 custom-scrollbar">
              <!-- BAHAGIAN 1: MAKLUMAT PERIBADI -->
              <div class="px-5 pt-4 pb-3">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-4 h-4 bg-[#0F4C3A] text-white rounded-full flex items-center justify-center text-[8px] font-black shrink-0">1</span>
                  Maklumat Peribadi
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="sm:col-span-2">
                    <label class="field-lbl">Nama Penuh</label>
                    <input v-model="formEdit.nama_pegawai" type="text" class="field-inp"/>
                  </div>
                  <div>
                    <label class="field-lbl">E-mel</label>
                    <input v-model="formEdit.email" type="email" placeholder="e-mel@kerajaan.my" class="field-inp"/>
                  </div>
                  <div>
                    <label class="field-lbl">No. Telefon</label>
                    <input v-model="formEdit.no_tel" type="tel" placeholder="0123456789" class="field-inp"/>
                  </div>
                  <div>
                    <label class="field-lbl">Gred SSPA</label>
                    <input v-model="formEdit.gred_sspa" type="text" placeholder="Cth: N19, VU5" class="field-inp"/>
                  </div>
                  <div>
                    <label class="field-lbl">Penempatan / Cawangan</label>
                    <input v-model="formEdit.penempatan" type="text" list="listPTJEdit" placeholder="Cth: Ibu Pejabat" class="field-inp"/>
                    <datalist id="listPTJEdit"><option v-for="ptj in senaraiPenempatanLengkap" :key="ptj.id" :value="ptj.nama_penempatan"></option></datalist>
                  </div>
                  <div>
                    <label class="field-lbl">Saiz Baju</label>
                    <select v-model="formEdit.saiz_baju" class="field-inp">
                      <option value="">Pilih Saiz</option>
                      <option v-for="s in ['XS','S','M','L','XL','XXL','XXXL']" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mx-5 border-t border-gray-100"></div>

              <!-- BAHAGIAN 2: KEANGGOTAAN & SISTEM -->
              <div class="px-5 pt-3 pb-4">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px] font-black shrink-0">2</span>
                  Keanggotaan &amp; Sistem
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="field-lbl">No. Ahli</label>
                    <input v-model="formEdit.no_ahli" type="text" placeholder="Jana Automatik / Isi Manual" class="field-inp font-mono font-bold"/>
                  </div>
                  <div>
                    <label class="field-lbl">Jawatan Dalam Kelab</label>
                    <select v-model="formEdit.jawatan_kelab" class="field-inp">
                      <option value="">— Tiada Jawatan —</option>
                      <option v-for="j in senaraiJawatan" :key="j" :value="j">{{ j }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="field-lbl">Jenis Potongan</label>
                    <select v-model="formEdit.jenis_potongan" class="field-inp">
                      <option value="Potongan Biro angkasa">Biro Angkasa</option>
                      <option value="Bayar secara manual">Bayar Manual / FPX</option>
                    </select>
                  </div>
                  <div>
                    <label class="field-lbl">Yuran Bulanan (RM)</label>
                    <input v-model="formEdit.yuran_kelab_bulanan" type="number" min="0" step="0.01" placeholder="0.00" class="field-inp"/>
                  </div>
                  <div>
                    <label class="field-lbl">Status Ahli</label>
                    <select v-model="formEdit.status_ahli" class="field-inp font-bold">
                      <option value="aktif">Aktif</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label class="field-lbl">Peranan Sistem</label>
                    <select v-model="formEdit.role" class="field-inp font-bold">
                      <option value="Ahli">Ahli</option>
                      <option value="Admin">Admin</option>
                      <option value="Bendahari">Bendahari</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <Transition name="fade">
                <div v-if="mesejEdit" :class="['mx-5 mb-4 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 border', mesejEdit.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesejEdit.text }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0 bg-white rounded-b-2xl">
              <button @click="showEdit = false" class="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors">Batal</button>
              <button @click="simpanEdit" :disabled="saving" class="px-6 py-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-xs font-black transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../services/api';
import ProfilAhli360 from '../../components/admin/ProfilAhli360.vue';
import { KELAB } from '../../config/kelab';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const isSuperAdmin = computed(() => authStore.user?.role === 'Super Admin');

const semuaAhli = ref([]);
const senaraiPenempatanLengkap = ref([]);
const loading = ref(true);
const saving = ref(false);
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const senaraiJawatan = [
  'Penaung',
  'Yang Dipertua', 'Naib Yang Dipertua', 'Setiausaha', 'Penolong Setiausaha',
  'Bendahari', 'Penolong Bendahari', 'Auditor',
  'Ahli Jawatankuasa', 'Ahli Jawatankuasa Negeri', 'Ahli Kelab',
];

// Hierarki untuk tab jawatankuasa (tanpa 'Ahli Kelab')
const hierarkiJawatan = [
  'Penaung',
  'Yang Dipertua', 'Naib Yang Dipertua', 'Setiausaha', 'Penolong Setiausaha',
  'Bendahari', 'Penolong Bendahari', 'Auditor',
  'Ahli Jawatankuasa', 'Ahli Jawatankuasa Negeri',
];

// ── Tab ──
const tabAktif = ref('semua');

// ── Filter: Semua Ahli ──
const carian = ref('');
const filterStatus = ref('');
const filterPenempatan = ref('');
const filterGred = ref('');
const filterPotongan = ref('');
const filterBelumBayar = ref(false);
const halamanSemasa = ref(1);
const hadPerHalaman = 20;

// ── Filter: Jawatankuasa ──
const carianAJK = ref('');
const filterJawatanAJK = ref('');
const filterPenempatanAJK = ref('');
const filterBelumBayarAJK = ref(false);

// ── Modal edit ──
const showEdit = ref(false);
const mesejEdit = ref(null);
const formEdit = ref({
  no_kp: '', nama_pegawai: '', email: '', no_tel: '', gred_sspa: '', penempatan: '',
  saiz_baju: '', jenis_potongan: '', yuran_kelab_bulanan: 0,
  no_ahli: '', jawatan_kelab: '', status_ahli: '', role: '', _gambar: ''
});

// ── Modal daftar ──
const showDaftar = ref(false);
const mesejDaftar = ref(null);
const borangDaftar = ref([{ nama_pegawai: '', no_kp: '', penempatan: '', gred_sspa: '', jawatan_kelab: '' }]);

// ── Profil 360 ──
const showDetails = ref(false);
const ahliDipilih = ref(null);

// ── Jana ──
const janaLoading = ref(false);
const mesejJana = ref(null);

// ── Computed: Hierarki Penempatan ──
const ptjInduk = computed(() =>
  senaraiPenempatanLengkap.value.filter(p => !p.induk_id)
);
const ptjAnak = computed(() => {
  const map = {};
  senaraiPenempatanLengkap.value.forEach(p => {
    if (p.induk_id) {
      if (!map[p.induk_id]) map[p.induk_id] = [];
      map[p.induk_id].push(p);
    }
  });
  return map;
});

// Dapatkan Set ID yang dibenarkan: PTJ yang dipilih + semua anaknya
const idPenempatanDibenarkan = computed(() => {
  if (!filterPenempatan.value) return null;
  const id = Number(filterPenempatan.value);
  const ids = new Set([id]);
  (ptjAnak.value[id] || []).forEach(a => ids.add(a.id));
  return ids;
});

const idPenempatanAJKDibenarkan = computed(() => {
  if (!filterPenempatanAJK.value) return null;
  const id = Number(filterPenempatanAJK.value);
  const ids = new Set([id]);
  (ptjAnak.value[id] || []).forEach(a => ids.add(a.id));
  return ids;
});

// ── Computed: Semua Ahli ──
const jumlahBelumDaftar = computed(() => semuaAhli.value.filter(a => !a.has_daftar).length);
const senaraiGred = computed(() => [...new Set(semuaAhli.value.map(a => a.gred_sspa).filter(Boolean))].sort());

const ahliTertapis = computed(() => {
  return semuaAhli.value.filter(a => {
    const coc = carian.value.toLowerCase();
    const matchCarian = !coc ||
      (a.nama_pegawai || '').toLowerCase().includes(coc) ||
      (a.no_kp || '').includes(coc) ||
      (a.no_ahli || '').toLowerCase().includes(coc) ||
      (a.jawatan_kelab || '').toLowerCase().includes(coc);
    const matchStatus = !filterStatus.value || (a.status_ahli || '').toLowerCase() === filterStatus.value;
    const matchPenempatan = !filterPenempatan.value
      || (idPenempatanDibenarkan.value && idPenempatanDibenarkan.value.has(a.penempatan_id));
    const matchGred = !filterGred.value || a.gred_sspa === filterGred.value;
    const matchPotongan = !filterPotongan.value || a.jenis_potongan === filterPotongan.value;
    const matchBelumBayar = !filterBelumBayar.value || !a.is_paid;
    return matchCarian && matchStatus && matchPenempatan && matchGred && matchPotongan && matchBelumBayar;
  });
});

const jumlahHalaman = computed(() => Math.max(1, Math.ceil(ahliTertapis.value.length / hadPerHalaman)));
const ahliTerpapar = computed(() => {
  const start = (halamanSemasa.value - 1) * hadPerHalaman;
  return ahliTertapis.value.slice(start, start + hadPerHalaman);
});
const halamanDipapar = computed(() => {
  const total = jumlahHalaman.value; const semasa = halamanSemasa.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (semasa <= 3) return [1, 2, 3, 4, 5];
  if (semasa >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
  return [semasa - 2, semasa - 1, semasa, semasa + 1, semasa + 2];
});

// ── Computed: Jawatankuasa ──
const ahliJawatankuasa = computed(() =>
  semuaAhli.value.filter(a => a.jawatan_kelab && hierarkiJawatan.includes(a.jawatan_kelab))
);

const jumlahBelumBayarAJK = computed(() =>
  ahliJawatankuasa.value.filter(a => !a.is_paid).length
);

const ahliJawatankuasaTertapis = computed(() => {
  const coc = carianAJK.value.toLowerCase();
  return ahliJawatankuasa.value.filter(a => {
    const matchCarian = !coc ||
      (a.nama_pegawai || '').toLowerCase().includes(coc) ||
      (a.no_kp || '').includes(coc);
    const matchJawatan = !filterJawatanAJK.value || a.jawatan_kelab === filterJawatanAJK.value;
    const matchPenempatan = !filterPenempatanAJK.value
      || (idPenempatanAJKDibenarkan.value && idPenempatanAJKDibenarkan.value.has(a.penempatan_id));
    const matchBelumBayar = !filterBelumBayarAJK.value || !a.is_paid;
    return matchCarian && matchJawatan && matchPenempatan && matchBelumBayar;
  });
});

const hierarkiDipapar = computed(() =>
  hierarkiJawatan.filter(j => ahliJawatankuasaTertapis.value.some(a => a.jawatan_kelab === j))
);

const ahliMengikutJawatan = (jawatan) =>
  ahliJawatankuasaTertapis.value.filter(a => a.jawatan_kelab === jawatan);

// ── Watcher ──
watch([carian, filterStatus, filterPenempatan, filterGred, filterPotongan, filterBelumBayar], () => { halamanSemasa.value = 1; });

// ── Badge helpers ──
const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const badgeJawatan = (j) => {
  if (!j) return '';
  if (j === 'Penaung') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (j === 'Yang Dipertua') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (j === 'Naib Yang Dipertua') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  if (['Setiausaha', 'Penolong Setiausaha'].includes(j)) return 'bg-sky-100 text-sky-800 border-sky-200';
  if (['Bendahari', 'Penolong Bendahari'].includes(j)) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (j === 'Auditor') return 'bg-rose-100 text-rose-800 border-rose-200';
  if (['Ahli Jawatankuasa', 'Ahli Jawatankuasa Negeri'].includes(j)) return 'bg-teal-100 text-teal-800 border-teal-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const bgSeksyenJawatan = (j) => {
  if (j === 'Penaung') return 'bg-yellow-50 border-yellow-200';
  if (j === 'Yang Dipertua') return 'bg-purple-50 border-purple-100';
  if (j === 'Naib Yang Dipertua') return 'bg-indigo-50 border-indigo-100';
  if (['Setiausaha', 'Penolong Setiausaha'].includes(j)) return 'bg-sky-50 border-sky-100';
  if (['Bendahari', 'Penolong Bendahari'].includes(j)) return 'bg-amber-50 border-amber-100';
  if (j === 'Auditor') return 'bg-rose-50 border-rose-100';
  return 'bg-teal-50 border-teal-100';
};

const warnaTeksJawatan = (j) => {
  if (j === 'Penaung') return 'text-yellow-800';
  if (j === 'Yang Dipertua') return 'text-purple-800';
  if (j === 'Naib Yang Dipertua') return 'text-indigo-800';
  if (['Setiausaha', 'Penolong Setiausaha'].includes(j)) return 'text-sky-800';
  if (['Bendahari', 'Penolong Bendahari'].includes(j)) return 'text-amber-800';
  if (j === 'Auditor') return 'text-rose-800';
  return 'text-teal-800';
};

// ── API ──
const muatSenaraiPTJ = async () => {
  try {
    const { data } = await api.get('/user/senarai-ptj');
    if (data.success) senaraiPenempatanLengkap.value = data.data;
  } catch (e) { console.error(e); }
};

const muatAhli = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/semua-ahli');
    if (data.success) semuaAhli.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const janaSemulaAhli = async () => {
  if (!confirm('Jana Semula No. Ahli Biro Angkasa\n\nNombor akan ditetapkan semula mengikut susunan:\n  VU → VK → G14 → lain-lain\n  Format: KP-0001/2026, KP-0002/2026 ...\n\nNombor sedia ada akan DIGANTI. Teruskan?')) return;
  janaLoading.value = true;
  mesejJana.value = null;
  try {
    const { data } = await api.post('/admin/jana-semula-no-ahli-biro');
    mesejJana.value = { type: 'success', text: data.message };
    await muatAhli();
  } catch (e) {
    mesejJana.value = { type: 'error', text: e.response?.data?.message || 'Ralat semasa menjana nombor ahli.' };
  } finally {
    janaLoading.value = false;
    setTimeout(() => { mesejJana.value = null; }, 8000);
  }
};

// ── Edit ──
const bukaEdit = (ahli) => {
  mesejEdit.value = null;
  formEdit.value = {
    no_kp:               ahli.no_kp,
    nama_pegawai:        ahli.nama_pegawai || '',
    email:               ahli.email || ahli.emel || '',
    no_tel:              ahli.no_tel || ahli.phone || '',
    gred_sspa:           ahli.gred_sspa || '',
    penempatan:          ahli.penempatan || '',
    saiz_baju:           ahli.saiz_baju || '',
    jenis_potongan:      ahli.jenis_potongan || 'Potongan Biro angkasa',
    yuran_kelab_bulanan: ahli.yuran_kelab_bulanan || 0,
    no_ahli:             ahli.no_ahli || '',
    jawatan_kelab:       ahli.jawatan_kelab || '',
    status_ahli:         (ahli.status_ahli || 'tidak aktif').toLowerCase(),
    role:                ahli.role || 'Ahli',
    _gambar:             ahli.gambar || '',
  };
  showEdit.value = true;
};

const bukaEditDariProfil = (ahliLengkap) => bukaEdit(ahliLengkap);

const simpanEdit = async () => {
  saving.value = true;
  mesejEdit.value = null;
  try {
    await api.put(`/admin/kemaskini-profil-ahli/${formEdit.value.no_kp}`, {
      nama_pegawai:        formEdit.value.nama_pegawai,
      email:               formEdit.value.email,
      no_tel:              formEdit.value.no_tel,
      gred_sspa:           formEdit.value.gred_sspa,
      penempatan:          formEdit.value.penempatan,
      saiz_baju:           formEdit.value.saiz_baju,
      jenis_potongan:      formEdit.value.jenis_potongan,
      yuran_kelab_bulanan: formEdit.value.yuran_kelab_bulanan,
    });
    await api.put(`/admin/kemaskini-ahli/${formEdit.value.no_kp}`, {
      no_ahli:       formEdit.value.no_ahli,
      jawatan_kelab: formEdit.value.jawatan_kelab,
      status_ahli:   formEdit.value.status_ahli,
      role:          formEdit.value.role,
    });
    mesejEdit.value = { type: 'success', text: 'Profil ahli berjaya dikemas kini!' };
    await muatAhli();
    setTimeout(() => {
      showEdit.value = false;
      if (showDetails.value && ahliDipilih.value?.no_kp === formEdit.value.no_kp) showDetails.value = false;
    }, 1000);
  } catch (e) {
    mesejEdit.value = { type: 'error', text: e.response?.data?.message || 'Ralat menyimpan maklumat.' };
  } finally {
    saving.value = false;
  }
};

// ── Daftar ──
const bukaModalDaftar = () => {
  borangDaftar.value = [{ nama_pegawai: '', no_kp: '', penempatan: '', gred_sspa: '', jawatan_kelab: '' }];
  mesejDaftar.value = null;
  showDaftar.value = true;
};
const tambahBaris = () => borangDaftar.value.push({ nama_pegawai: '', no_kp: '', penempatan: '', gred_sspa: '', jawatan_kelab: '' });
const buangBaris = (idx) => borangDaftar.value.splice(idx, 1);

const simpanDaftarPukal = async () => {
  for (const row of borangDaftar.value) {
    if (!row.nama_pegawai || !row.no_kp || !row.penempatan) {
      mesejDaftar.value = { type: 'error', text: 'Sila lengkapkan medan wajib: Nama, No. KP dan Penempatan.' };
      return;
    }
  }
  saving.value = true; mesejDaftar.value = null;
  try {
    const staffList = borangDaftar.value.map(row => ({
      no_kp:        row.no_kp.trim(),
      nama_pegawai: row.nama_pegawai.trim(),
      penempatan:   row.penempatan.trim(),
      gred_sspa:    row.gred_sspa.trim(),
      jawatan_kelab: row.jawatan_kelab || '',
    }));
    const { data } = await api.post('/admin/tambah-staff-pukal', { staffList });
    mesejDaftar.value = { type: data.gagal?.length ? 'error' : 'success', text: data.message };
    await muatAhli();
    if (!data.gagal?.length) setTimeout(() => { showDaftar.value = false; }, 1500);
  } catch (e) {
    mesejDaftar.value = { type: 'error', text: e.response?.data?.message || 'Gagal menyimpan rekod.' };
  } finally {
    saving.value = false;
  }
};

// ── Direktori AJK ──
const showDirektoriAJK   = ref(false);
const cariDirektoriAJK   = ref('');

const direktoriAJKTertapis = computed(() => {
  const q = cariDirektoriAJK.value.toLowerCase();
  return ahliJawatankuasa.value.filter(a =>
    !q || (a.nama_pegawai || '').toLowerCase().includes(q) || (a.jawatan_kelab || '').toLowerCase().includes(q)
  );
});

const waLink = (no) => {
  if (!no) return '#';
  const cleaned = (no || '').replace(/\D/g, '');
  const num = cleaned.startsWith('60') ? cleaned : '60' + cleaned.replace(/^0/, '');
  return `https://wa.me/${num}`;
};

// ── Details ──
const bukaDetails = (ahliAsas) => {
  ahliDipilih.value = ahliAsas;
  showDetails.value = true;
};

// ── Eksport CSV ──
const eksportCSV = () => {
  const headers = 'No KP,Nama,Gred,Jawatan Kelab,Penempatan,Jenis Potongan,No Ahli,Status\n';
  const rows = ahliTertapis.value.map(a =>
    `"${a.no_kp}","${a.nama_pegawai || ''}","${a.gred_sspa || ''}","${a.jawatan_kelab || ''}","${a.penempatan || ''}","${a.jenis_potongan || ''}","${a.no_ahli || ''}","${a.status_ahli || ''}"`
  ).join('\n');
  const blob = new Blob(['﻿' + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Ahli_Kelab.csv'; a.click();
  URL.revokeObjectURL(url);
};

// ── Cetak Ahli Mengikut Penempatan ──
const cetakAhliPenempatan = () => {
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  const penempatanId = Number(filterPenempatan.value);
  const namaPenempatan = senaraiPenempatanLengkap.value.find(p => p.id === penempatanId)?.nama_penempatan || 'Penempatan';

  // Pecah gred_sspa kepada { skim, gred } — nilai uppercase
  const pecahGred = (val) => {
    const g = (val || '').trim().toUpperCase();
    if (!g) return { skim: '', gred: -1 };
    // JUSA A / JUSA B / JUSA C
    const jusa = g.match(/^JUSA\s+([ABC])$/);
    if (jusa) return { skim: 'JUSA', gred: { A: 3, B: 2, C: 1 }[jusa[1]] ?? 0 };
    // Skim + nombor: N19, VU7, G14, F41 dsb
    const biasa = g.match(/^([A-Z]+)(\d+)$/);
    if (biasa) return { skim: biasa[1], gred: parseInt(biasa[2]) };
    return { skim: g, gred: 0 };
  };

  // Urutan: JUSA dahulu → skim A-Z → gred tertinggi dalam skim → tiada gred paling bawah
  const sortGred = (a, b) => {
    const ga = (a.gred_sspa || '').trim().toUpperCase();
    const gb = (b.gred_sspa || '').trim().toUpperCase();
    if (!ga && !gb) return 0;
    if (!ga) return 1;
    if (!gb) return -1;
    const pA = pecahGred(ga);
    const pB = pecahGred(gb);
    // JUSA sentiasa paling atas
    if (pA.skim === 'JUSA' && pB.skim !== 'JUSA') return -1;
    if (pB.skim === 'JUSA' && pA.skim !== 'JUSA') return 1;
    // Sama skim → gred tertinggi dahulu
    if (pA.skim === pB.skim) return pB.gred - pA.gred;
    // Skim berlainan → ikut abjad skim
    return pA.skim.localeCompare(pB.skim);
  };

  const senarai = [...ahliTertapis.value].sort(sortGred);
  const jumlahBerbayar = senarai.filter(a => a.is_paid).length;
  const jumlahBelumBayar = senarai.filter(a => !a.is_paid).length;

  let rowsHtml = '';
  let skimSemasa = null;
  senarai.forEach((ahli, i) => {
    const { skim } = pecahGred(ahli.gred_sspa);
    if (skim !== skimSemasa) {
      skimSemasa = skim;
      const bil = senarai.filter(x => pecahGred(x.gred_sspa).skim === skimSemasa).length;
      const label = skimSemasa || 'TIDAK DITETAPKAN';
      rowsHtml += `<tr><td colspan="6" style="background:#1e293b;color:#fff;font-weight:bold;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:5px 10px;">SKIM ${label} &nbsp;(${bil} orang)</td></tr>`;
    }
    const bayarStyle = ahli.is_paid ? 'color:#065f46;font-weight:bold;' : 'color:#991b1b;font-weight:bold;';
    rowsHtml += `<tr>
      <td style="text-align:center;color:#94a3b8;font-size:10px;">${i + 1}</td>
      <td style="font-weight:600;text-transform:uppercase;">${ahli.nama_pegawai || '—'}</td>
      <td style="font-family:monospace;font-size:10px;color:#475569;">${ahli.no_ahli || '—'}</td>
      <td style="text-align:center;font-weight:bold;">${(ahli.gred_sspa || '').toUpperCase() || '—'}</td>
      <td>${ahli.penempatan || '—'}</td>
      <td style="${bayarStyle}">${ahli.is_paid ? '✓ BERBAYAR' : '✗ BELUM BAYAR'}</td>
    </tr>`;
  });

  const filterInfo = [
    filterStatus.value ? `Status: ${filterStatus.value}` : '',
    filterGred.value ? `Gred: ${filterGred.value}` : '',
    filterBelumBayar.value ? 'Belum bayar sahaja' : '',
  ].filter(Boolean).join(' · ');

  const html = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Senarai Ahli — ${namaPenempatan}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; padding: 24px; }
    .kop { text-align: center; border-bottom: 3px solid #0F4C3A; padding-bottom: 14px; margin-bottom: 18px; }
    .kop-sub { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 5px; }
    .kop h1 { font-size: 15px; font-weight: bold; color: #0F4C3A; letter-spacing: 0.5px; }
    .kop h2 { font-size: 12px; font-weight: bold; color: #1e293b; margin-top: 4px; }
    .kop h3 { font-size: 11px; color: #0F4C3A; margin-top: 3px; }
    .kop-meta { font-size: 10px; color: #64748b; margin-top: 7px; }
    .kop-filter { font-size: 9px; color: #94a3b8; margin-top: 4px; font-style: italic; }
    .stat-bar { display: flex; justify-content: center; gap: 24px; margin: 12px 0 16px; }
    .stat { text-align: center; }
    .stat-num { font-size: 18px; font-weight: bold; }
    .stat-lbl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .stat-berbayar .stat-num { color: #065f46; }
    .stat-belum .stat-num { color: #991b1b; }
    .stat-jumlah .stat-num { color: #1e293b; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #0F4C3A; color: #fff; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody td { padding: 5px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10.5px; }
    tbody tr:not([class]):nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 20px; font-size: 9px; color: #94a3b8; text-align: right; }
    @media print { @page { size: A4 portrait; margin: 1.5cm; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="kop">
    <p class="kop-sub">${KELAB.namaPendek}</p>
    <h1>KELAB PERHILITAN</h1>
    <h2>SENARAI AHLI MENGIKUT PENEMPATAN</h2>
    <h3>${namaPenempatan.toUpperCase()}</h3>
    <p class="kop-meta">Dijana pada: ${tarikh}</p>
    ${filterInfo ? `<p class="kop-filter">Penapis: ${filterInfo}</p>` : ''}
  </div>
  <div class="stat-bar">
    <div class="stat stat-jumlah"><div class="stat-num">${senarai.length}</div><div class="stat-lbl">Jumlah Ahli</div></div>
    <div class="stat stat-berbayar"><div class="stat-num">${jumlahBerbayar}</div><div class="stat-lbl">Berbayar</div></div>
    <div class="stat stat-belum"><div class="stat-num">${jumlahBelumBayar}</div><div class="stat-lbl">Belum Bayar</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:5%;">Bil.</th>
        <th style="width:28%;">Nama</th>
        <th style="width:14%;">No. Ahli</th>
        <th style="width:8%;text-align:center;">Gred</th>
        <th style="width:27%;">Penempatan</th>
        <th style="width:18%;">Status Yuran</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="footer">Dokumen ini dijana secara automatik oleh sistem Kelab PERHILITAN</div>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) { win.document.write(html); win.document.close(); }
};

// ── Cetak Jawatankuasa ──
const cetakJawatankuasa = () => {
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  let rowsHtml = '';
  let bil = 1;

  for (const jawatan of hierarkiDipapar.value) {
    const ahliDlm = ahliMengikutJawatan(jawatan);
    rowsHtml += `
      <tr class="section-row">
        <td colspan="6" style="background:#0F4C3A;color:#ffffff;font-weight:bold;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:5px 10px;">
          ${jawatan} &nbsp;(${ahliDlm.length} orang)
        </td>
      </tr>`;
    for (const ahli of ahliDlm) {
      const statusStyle = ahli.is_paid
        ? 'color:#065f46;font-weight:bold;'
        : 'color:#991b1b;font-weight:bold;';
      rowsHtml += `
        <tr>
          <td style="text-align:center;color:#94a3b8;font-size:10px;">${bil++}</td>
          <td style="font-weight:600;">${ahli.nama_pegawai || '—'}</td>
          <td style="font-family:monospace;font-size:10px;color:#475569;">${ahli.no_ahli || '—'}</td>
          <td>${ahli.penempatan || '—'}</td>
          <td style="text-align:center;">${ahli.gred_sspa || '—'}</td>
          <td style="${statusStyle}">${ahli.is_paid ? 'BERBAYAR' : 'BELUM BAYAR'}</td>
        </tr>`;
    }
  }

  const filterInfo = [
    filterJawatanAJK.value ? `Jawatan: ${filterJawatanAJK.value}` : '',
    filterPenempatanAJK.value ? `Penempatan: ${senaraiPenempatanLengkap.value.find(p => p.id === Number(filterPenempatanAJK.value))?.nama_penempatan || filterPenempatanAJK.value}` : '',
    filterBelumBayarAJK.value ? 'Menunjukkan belum bayar sahaja' : '',
  ].filter(Boolean).join(' &nbsp;·&nbsp; ');

  const html = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Senarai AJK — Kelab PERHILITAN</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; padding: 24px; }
    .kop { text-align: center; border-bottom: 3px solid #0F4C3A; padding-bottom: 14px; margin-bottom: 18px; }
    .kop-sub { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 5px; }
    .kop h1 { font-size: 15px; font-weight: bold; color: #0F4C3A; letter-spacing: 0.5px; }
    .kop h2 { font-size: 12px; font-weight: bold; color: #1e293b; margin-top: 4px; letter-spacing: 0.5px; }
    .kop-meta { font-size: 10px; color: #64748b; margin-top: 7px; }
    .kop-filter { font-size: 9px; color: #94a3b8; margin-top: 4px; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    thead th { background: #1e293b; color: #ffffff; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody td { padding: 5px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10.5px; }
    tbody tr:not(.section-row):nth-child(even) { background: #f8fafc; }
    .jumlah { margin-top: 16px; text-align: right; font-size: 10px; color: #64748b; }
    @media print {
      @page { size: A4 portrait; margin: 1.5cm; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="kop">
    <p class="kop-sub">${KELAB.namaPendek}</p>
    <h1>KELAB PERHILITAN</h1>
    <h2>SENARAI AHLI JAWATANKUASA KELAB</h2>
    <p class="kop-meta">Dijana pada: ${tarikh}</p>
    ${filterInfo ? `<p class="kop-filter">Penapis: ${filterInfo}</p>` : ''}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:5%;">Bil.</th>
        <th style="width:28%;">Nama</th>
        <th style="width:14%;">No. Ahli</th>
        <th style="width:27%;">Penempatan</th>
        <th style="width:10%;text-align:center;">Gred</th>
        <th style="width:16%;">Status Yuran</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <p class="jumlah">Jumlah ahli jawatankuasa: <strong>${ahliJawatankuasaTertapis.value.length}</strong> orang</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
};

onMounted(() => {
  muatAhli();
  muatSenaraiPTJ();
});
</script>

<style scoped>
@reference "tailwindcss";

.field-lbl { @apply block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1; }
.field-inp { @apply w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 transition-all; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
