<template>
  <div class="space-y-6 font-sans text-gray-900 pb-10">

    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-2xl text-gray-900">Pengurusan Ahli</h2>
        <p class="text-gray-500 text-sm mt-1">Urus data ahli, pendaftaran, dan jejak profil 360°.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="janaNoAhliBiro" :disabled="janaLoading" class="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <svg v-if="!janaLoading" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
          <span v-else class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          Jana No. Ahli Biro Angkasa
        </button>
        <button @click="eksportCSV" class="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-all border border-gray-300 shadow-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Eksport CSV
        </button>
        <button @click="bukaModalDaftar" class="flex items-center gap-2 text-sm bg-[#0F4C3A] hover:bg-[#155d47] text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Daftar Staf Baharu
        </button>
      </div>
    </div>

    <!-- NOTIS JANA -->
    <Transition name="fade">
      <div v-if="mesejJana" :class="['text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2 border', mesejJana.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
        {{ mesejJana.text }}
      </div>
    </Transition>

    <!-- TAB UTAMA / BELUM DAFTAR -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button @click="tabUtama = 'semua'" :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all', tabUtama==='semua' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        Semua Ahli
        <span class="ml-1.5 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-black">{{ semuaAhli.length }}</span>
      </button>
      <button @click="tabUtama = 'belum'" :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5', tabUtama==='belum' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        Belum Daftar Apps
        <span v-if="belumDaftar.length > 0" class="text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-black">{{ belumDaftar.length }}</span>
      </button>
    </div>

    <!-- ============================== -->
    <!-- PANEL: SEMUA AHLI              -->
    <!-- ============================== -->
    <template v-if="tabUtama === 'semua'">
      <!-- PENAPIS -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div class="relative lg:col-span-1">
            <input v-model="carian" type="text" placeholder="Cari Nama, No. KP..."
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <select v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Status</option><option value="aktif">Aktif</option><option value="tidak aktif">Tidak Aktif</option>
          </select>
          <select v-model="filterPenempatan" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Penempatan</option><option v-for="ptj in senaraiPenempatan" :key="ptj" :value="ptj">{{ ptj }}</option>
          </select>
          <select v-model="filterGred" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Semua Gred</option><option v-for="gred in senaraiGred" :key="gred" :value="gred">{{ gred }}</option>
          </select>
          <select v-model="filterPotongan" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20">
            <option value="">Kaedah Potongan</option><option value="Potongan Biro angkasa">Biro Angkasa</option><option value="Bayar secara manual">Manual / FPX</option>
          </select>
        </div>
      </div>

      <p class="text-gray-500 text-sm">Menunjukkan <span class="text-gray-900 font-bold">{{ ahliTertapis.length }}</span> daripada <span class="text-gray-900 font-bold">{{ semuaAhli.length }}</span> rekod</p>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th class="px-5 py-4 font-bold">Nama Ahli</th>
                <th class="px-4 py-4 font-bold hidden md:table-cell">No. Ahli</th>
                <th class="px-4 py-4 font-bold hidden lg:table-cell">Penempatan</th>
                <th class="px-4 py-4 font-bold hidden sm:table-cell">Maklumat Gaji</th>
                <th class="text-center px-4 py-4 font-bold">Status</th>
                <th class="text-center px-4 py-4 font-bold">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loading"><td colspan="6" class="px-5 py-12 text-center text-gray-500"><div class="flex justify-center items-center gap-2"><svg class="animate-spin w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memuatkan...</div></td></tr>
              <tr v-else-if="ahliTertapis.length === 0"><td colspan="6" class="px-5 py-16 text-center text-gray-500 font-medium">Tiada rekod dijumpai.</td></tr>
              <tr v-for="ahli in ahliTerpapar" :key="ahli.no_kp" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 overflow-hidden">
                      <img v-if="ahli.gambar" :src="`${apiBase}/uploads/images/${ahli.gambar}`" class="w-full h-full object-cover"/>
                      <span v-else class="text-emerald-700 text-sm font-black">{{ (ahli.nama_pegawai || '?').charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-gray-900 font-bold text-xs">{{ ahli.nama_pegawai || '—' }}</p>
                      <p class="text-gray-500 text-[10px] font-mono mt-0.5">{{ ahli.no_kp }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell"><span class="text-gray-700 font-mono font-bold text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded">{{ ahli.no_ahli || 'BELUM JANA' }}</span></td>
                <td class="px-4 py-3 hidden lg:table-cell"><span class="text-gray-600 text-[11px] font-semibold truncate max-w-[180px] block" :title="ahli.penempatan">{{ ahli.penempatan || '—' }}</span></td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <p class="text-gray-900 text-xs font-bold">{{ ahli.gred_sspa || 'GRED TIADA' }}</p>
                  <div v-if="ahli.jenis_potongan === 'Potongan Biro angkasa'" class="flex items-center gap-1 text-[9px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md mt-1 w-fit font-bold uppercase tracking-wide">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>Biro Angkasa
                  </div>
                  <div v-else class="text-[9px] text-gray-500 mt-1 font-bold uppercase tracking-wide">Manual / FPX</div>
                </td>
                <td class="px-4 py-3 text-center"><span :class="['text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider', badgeStatus(ahli.status_ahli)]">{{ ahli.status_ahli || 'TIDAK AKTIF' }}</span></td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center gap-1.5">
                    <button @click="bukaDetails(ahli)" class="text-[11px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 border border-[#0F4C3A]/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> Profil 360°
                    </button>
                    <button @click="bukaEdit(ahli)" class="text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2 py-1.5 rounded-lg transition-colors"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
          <p class="text-gray-500 text-xs font-medium">Halaman {{ halamanSemasa }} / {{ jumlahHalaman }}</p>
          <div class="flex gap-1">
            <button @click="halamanSemasa--" :disabled="halamanSemasa === 1" class="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center">‹</button>
            <button v-for="p in halamanDipapar" :key="p" @click="halamanSemasa = p" :class="['w-8 h-8 rounded-lg text-xs font-bold transition-colors border flex items-center justify-center', p === halamanSemasa ? 'bg-[#0F4C3A] border-[#0F4C3A] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100']">{{ p }}</button>
            <button @click="halamanSemasa++" :disabled="halamanSemasa === jumlahHalaman" class="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center">›</button>
          </div>
        </div>
      </div>
    </template>

    <!-- ============================== -->
    <!-- PANEL: BELUM DAFTAR APPS       -->
    <!-- ============================== -->
    <template v-else>
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-sm">
        <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-amber-800 font-medium">Kakitangan di bawah <strong>wujud dalam sistem</strong> tetapi <strong>belum mengaktifkan akaun</strong> melalui halaman pendaftaran aplikasi (tiada kata laluan).</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th class="px-5 py-4 font-bold">Nama Kakitangan</th>
                <th class="px-4 py-4 font-bold hidden md:table-cell">Gred</th>
                <th class="px-4 py-4 font-bold hidden lg:table-cell">Penempatan</th>
                <th class="px-4 py-4 font-bold hidden sm:table-cell">E-mel Didaftar</th>
                <th class="px-4 py-4 font-bold hidden sm:table-cell">No. Ahli</th>
                <th class="text-center px-4 py-4 font-bold">Potongan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loadingBelum"><td colspan="6" class="px-5 py-12 text-center text-gray-500"><div class="flex justify-center items-center gap-2"><svg class="animate-spin w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memuatkan...</div></td></tr>
              <tr v-else-if="belumDaftar.length === 0"><td colspan="6" class="px-5 py-16 text-center text-emerald-600 font-bold">Semua kakitangan telah mendaftar akaun. 🎉</td></tr>
              <tr v-for="s in belumDaftar" :key="s.no_kp" class="hover:bg-amber-50/40 transition-colors">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                      <span class="text-amber-700 text-sm font-black">{{ (s.nama_pegawai || '?').charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-gray-900 font-bold text-xs">{{ s.nama_pegawai || '—' }}</p>
                      <p class="text-gray-500 text-[10px] font-mono mt-0.5">{{ s.no_kp }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell"><span class="text-gray-700 text-xs font-bold uppercase">{{ s.gred_sspa || '—' }}</span></td>
                <td class="px-4 py-3 hidden lg:table-cell"><span class="text-gray-600 text-[11px] font-semibold truncate max-w-[160px] block">{{ s.penempatan || '—' }}</span></td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span v-if="s.email" class="text-gray-700 text-xs font-mono">{{ s.email }}</span>
                  <span v-else class="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Tiada E-mel</span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span class="text-gray-700 font-mono font-bold text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded">{{ s.no_ahli || 'BELUM JANA' }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="s.jenis_potongan === 'Potongan Biro angkasa'" class="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">Biro Angkasa</span>
                  <span v-else class="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{{ s.jenis_potongan || '—' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-5 py-3 border-t border-gray-200 bg-gray-50">
          <p class="text-gray-500 text-xs font-medium">Jumlah: <span class="font-black text-gray-900">{{ belumDaftar.length }}</span> kakitangan belum mendaftar</p>
        </div>
      </div>
    </template>

    <!-- MODAL PROFIL 360 -->
    <ProfilAhli360 :show="showDetails" :ahliBase="ahliDipilih" @close="showDetails = false" @edit="bukaEditDariProfil" />

    <!-- MODAL DAFTAR STAF -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDaftar" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showDaftar = false">
          <div class="bg-white border border-gray-200 rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-start p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="text-gray-900 font-black text-xl">Daftar Staf Baharu</h3>
                <p class="text-gray-500 text-xs font-medium mt-1">Tambah staf secara tunggal atau serentak (bulk). Nama Penuh, No. KP dan Penempatan diwajibkan.</p>
              </div>
              <button @click="showDaftar = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 custom-scrollbar bg-gray-50/50">
              <div class="space-y-4">
                <div v-for="(row, index) in borangDaftar" :key="index" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                  <span class="absolute -left-2 -top-2 bg-[#0F4C3A] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">{{ index + 1 }}</span>
                  <button v-if="borangDaftar.length > 1" @click="buangBaris(index)" class="absolute top-2 right-2 text-rose-400 hover:text-rose-600 bg-rose-50 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Penuh *</label>
                      <input v-model="row.nama_pegawai" type="text" placeholder="Nama Staf" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0F4C3A]"/>
                    </div>
                    <div>
                      <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">No. Kad Pengenalan *</label>
                      <input v-model="row.no_kp" type="text" placeholder="Tanpa sengkang (-)" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs font-mono font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0F4C3A]"/>
                    </div>
                    <div>
                      <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Cawangan / Penempatan *</label>
                      <input v-model="row.penempatan" type="text" list="listPTJ" placeholder="Cth: Ibu Pejabat" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0F4C3A]"/>
                      <datalist id="listPTJ"><option v-for="ptj in senaraiPenempatanLengkap" :key="ptj.id" :value="ptj.nama_penempatan"></option></datalist>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex justify-center">
                <button @click="tambahBaris" type="button" class="text-xs font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-4 py-2 rounded-xl border border-[#0F4C3A]/20 transition-colors flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> Tambah Baris
                </button>
              </div>
              <Transition name="fade">
                <div v-if="mesejDaftar" :class="['mt-4 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border shadow-sm', mesejDaftar.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesejDaftar.text }}
                </div>
              </Transition>
            </div>
            <div class="flex justify-end gap-3 p-6 border-t border-gray-100 shrink-0 bg-white rounded-b-[24px]">
              <button @click="showDaftar = false" class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-bold shadow-sm transition-colors">Batal</button>
              <button @click="simpanDaftarPukal" :disabled="saving" class="px-8 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-black shadow-md disabled:opacity-60 flex items-center gap-2 transition-colors">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Semua Rekod' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL EDIT PROFIL PENUH AHLI -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEdit" class="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showEdit = false">
          <div class="bg-white border border-gray-200 rounded-[24px] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-start p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 class="text-gray-900 font-black text-lg">Kemaskini Profil Ahli</h3>
                <p class="text-gray-500 text-xs mt-1 font-bold font-mono">{{ formEdit.no_kp }}</p>
              </div>
              <button @click="showEdit = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 p-6 space-y-5 custom-scrollbar">

              <!-- BAHAGIAN 1: MAKLUMAT PERIBADI -->
              <div>
                <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-5 h-5 bg-[#0F4C3A] text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">1</span>
                  Maklumat Peribadi
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Penuh</label>
                    <input v-model="formEdit.nama_pegawai" type="text" class="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">E-mel</label>
                    <input v-model="formEdit.email" type="email" placeholder="e-mel@kerajaan.my" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">No. Telefon</label>
                    <input v-model="formEdit.no_tel" type="tel" placeholder="0123456789" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Gred SSPA</label>
                    <input v-model="formEdit.gred_sspa" type="text" placeholder="Cth: N19, F41" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Penempatan / Cawangan</label>
                    <input v-model="formEdit.penempatan" type="text" list="listPTJEdit" placeholder="Cth: Ibu Pejabat" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                    <datalist id="listPTJEdit"><option v-for="ptj in senaraiPenempatanLengkap" :key="ptj.id" :value="ptj.nama_penempatan"></option></datalist>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Saiz Baju</label>
                    <select v-model="formEdit.saiz_baju" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]">
                      <option value="">Pilih Saiz</option>
                      <option v-for="s in ['XS','S','M','L','XL','XXL','XXXL']" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- DIVIDER -->
              <div class="border-t border-gray-100"></div>

              <!-- BAHAGIAN 2: KEANGGOTAAN & SISTEM -->
              <div>
                <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span class="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">2</span>
                  Keanggotaan & Sistem
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">No. Ahli</label>
                    <input v-model="formEdit.no_ahli" type="text" placeholder="Jana Automatik / Isi Manual" class="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Jenis Potongan</label>
                    <select v-model="formEdit.jenis_potongan" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]">
                      <option value="Potongan Biro angkasa">Biro Angkasa</option>
                      <option value="Bayar secara manual">Bayar Manual / FPX</option>
                    </select>
                  </div>
                  <div v-if="formEdit.jenis_potongan !== 'Potongan Biro angkasa'">
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Yuran Bulanan (RM)</label>
                    <input v-model="formEdit.yuran_kelab_bulanan" type="number" min="0" step="0.01" placeholder="0.00" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Status Ahli</label>
                    <select v-model="formEdit.status_ahli" class="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]">
                      <option value="aktif">Aktif</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Peranan Sistem</label>
                    <select v-model="formEdit.role" class="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]">
                      <option value="Ahli">Ahli</option>
                      <option value="Admin">Admin</option>
                      <option value="Bendahari">Bendahari</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <Transition name="fade">
                <div v-if="mesejEdit" :class="['text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 border', mesejEdit.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ mesejEdit.text }}
                </div>
              </Transition>
            </div>

            <div class="flex justify-end gap-3 p-6 border-t border-gray-100 shrink-0 bg-white rounded-b-[24px]">
              <button @click="showEdit = false" class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-bold shadow-sm transition-colors">Batal</button>
              <button @click="simpanEdit" :disabled="saving" class="px-6 py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-sm font-black transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ saving ? 'Menyimpan...' : 'Simpan Semua Perubahan' }}
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

const semuaAhli = ref([]);
const belumDaftar = ref([]);
const senaraiPenempatanLengkap = ref([]);
const loading = ref(true);
const loadingBelum = ref(false);
const saving = ref(false);
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const tabUtama = ref('semua');

// Filter
const carian = ref('');
const filterStatus = ref('');
const filterPenempatan = ref('');
const filterGred = ref('');
const filterPotongan = ref('');
const halamanSemasa = ref(1);
const hadPerHalaman = 20;

// Modal edit
const showEdit = ref(false);
const mesejEdit = ref(null);
const formEdit = ref({
  no_kp: '', nama_pegawai: '', email: '', no_tel: '', gred_sspa: '', penempatan: '',
  saiz_baju: '', jenis_potongan: '', yuran_kelab_bulanan: 0,
  no_ahli: '', status_ahli: '', role: ''
});

// Modal daftar
const showDaftar = ref(false);
const mesejDaftar = ref(null);
const borangDaftar = ref([{ nama_pegawai: '', no_kp: '', penempatan: '' }]);

// Profil 360
const showDetails = ref(false);
const ahliDipilih = ref(null);

// Jana No Ahli Biro
const janaLoading = ref(false);
const mesejJana = ref(null);

const muatSenaraiPTJ = async () => {
  try {
    const { data } = await api.get('/user/senarai-ptj');
    if (data.success) senaraiPenempatanLengkap.value = data.data;
  } catch (e) { console.error(e); }
};

const senaraiPenempatan = computed(() => [...new Set(semuaAhli.value.map(a => a.penempatan).filter(Boolean))].sort());
const senaraiGred = computed(() => [...new Set(semuaAhli.value.map(a => a.gred_sspa).filter(Boolean))].sort());

const ahliTertapis = computed(() => {
  return semuaAhli.value.filter(a => {
    const coc = carian.value.toLowerCase();
    const matchCarian = !coc || (a.nama_pegawai || '').toLowerCase().includes(coc) || (a.no_kp || '').includes(coc) || (a.no_ahli || '').toLowerCase().includes(coc);
    const matchStatus = !filterStatus.value || (a.status_ahli || '').toLowerCase() === filterStatus.value;
    const matchPenempatan = !filterPenempatan.value || a.penempatan === filterPenempatan.value;
    const matchGred = !filterGred.value || a.gred_sspa === filterGred.value;
    const matchPotongan = !filterPotongan.value || a.jenis_potongan === filterPotongan.value;
    return matchCarian && matchStatus && matchPenempatan && matchGred && matchPotongan;
  });
});

const jumlahHalaman = computed(() => Math.max(1, Math.ceil(ahliTertapis.value.length / hadPerHalaman)));
const ahliTerpapar = computed(() => { const start = (halamanSemasa.value - 1) * hadPerHalaman; return ahliTertapis.value.slice(start, start + hadPerHalaman); });

const halamanDipapar = computed(() => {
  const total = jumlahHalaman.value; const semasa = halamanSemasa.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (semasa <= 3) return [1, 2, 3, 4, 5];
  if (semasa >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
  return [semasa - 2, semasa - 1, semasa, semasa + 1, semasa + 2];
});

watch([carian, filterStatus, filterPenempatan, filterGred, filterPotongan], () => { halamanSemasa.value = 1; });

// Muat senarai belum daftar apabila tab dibuka
watch(tabUtama, async (val) => {
  if (val === 'belum' && belumDaftar.value.length === 0) {
    await muatBelumDaftar();
  }
});

const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const muatAhli = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/semua-ahli');
    if (data.success) semuaAhli.value = data.data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const muatBelumDaftar = async () => {
  loadingBelum.value = true;
  try {
    const { data } = await api.get('/admin/belum-daftar');
    if (data.success) belumDaftar.value = data.data;
  } catch (e) { console.error(e); }
  finally { loadingBelum.value = false; }
};

const janaNoAhliBiro = async () => {
  if (!confirm('Jana nombor ahli untuk SEMUA ahli Biro Angkasa yang belum ada nombor?')) return;
  janaLoading.value = true;
  mesejJana.value = null;
  try {
    const { data } = await api.post('/admin/jana-no-ahli-biro');
    mesejJana.value = { type: 'success', text: data.message };
    await muatAhli();
  } catch (e) {
    mesejJana.value = { type: 'error', text: e.response?.data?.message || 'Ralat semasa menjana nombor ahli.' };
  } finally {
    janaLoading.value = false;
    setTimeout(() => { mesejJana.value = null; }, 6000);
  }
};

const bukaEdit = (ahli) => {
  mesejEdit.value = null;
  formEdit.value = {
    no_kp: ahli.no_kp,
    nama_pegawai: ahli.nama_pegawai || '',
    email: ahli.email || ahli.emel || '',
    no_tel: ahli.no_tel || ahli.phone || '',
    gred_sspa: ahli.gred_sspa || '',
    penempatan: ahli.penempatan || '',
    saiz_baju: ahli.saiz_baju || '',
    jenis_potongan: ahli.jenis_potongan || 'Potongan Biro angkasa',
    yuran_kelab_bulanan: ahli.yuran_kelab_bulanan || 0,
    no_ahli: ahli.no_ahli || '',
    status_ahli: (ahli.status_ahli || 'tidak aktif').toLowerCase(),
    role: ahli.role || 'Ahli',
  };
  showEdit.value = true;
};

const bukaEditDariProfil = (ahliLengkap) => bukaEdit(ahliLengkap);

const simpanEdit = async () => {
  saving.value = true;
  mesejEdit.value = null;
  try {
    // Kemaskini profil penuh (nama, emel, telefon, gred, penempatan, saiz, yuran, potongan)
    await api.put(`/admin/kemaskini-profil-ahli/${formEdit.value.no_kp}`, {
      nama_pegawai:       formEdit.value.nama_pegawai,
      email:              formEdit.value.email,
      no_tel:             formEdit.value.no_tel,
      gred_sspa:          formEdit.value.gred_sspa,
      penempatan:         formEdit.value.penempatan,
      saiz_baju:          formEdit.value.saiz_baju,
      jenis_potongan:     formEdit.value.jenis_potongan,
      yuran_kelab_bulanan: formEdit.value.yuran_kelab_bulanan,
    });
    // Kemaskini no_ahli, status, role secara berasingan
    await api.put(`/admin/kemaskini-ahli/${formEdit.value.no_kp}`, {
      no_ahli:    formEdit.value.no_ahli,
      status_ahli: formEdit.value.status_ahli,
      role:        formEdit.value.role,
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

const bukaModalDaftar = () => {
  borangDaftar.value = [{ nama_pegawai: '', no_kp: '', penempatan: '' }];
  mesejDaftar.value = null;
  showDaftar.value = true;
};
const tambahBaris = () => borangDaftar.value.push({ nama_pegawai: '', no_kp: '', penempatan: '' });
const buangBaris = (idx) => borangDaftar.value.splice(idx, 1);

const simpanDaftarPukal = async () => {
  for (const row of borangDaftar.value) {
    if (!row.nama_pegawai || !row.no_kp || !row.penempatan) {
      mesejDaftar.value = { type: 'error', text: 'Sila lengkapkan semua medan (Nama, KP, Penempatan).' };
      return;
    }
  }
  saving.value = true; mesejDaftar.value = null;
  let berjaya = 0; let gagal = 0;
  for (const row of borangDaftar.value) {
    try {
      await api.post('/admin/daftar-ahli', { no_kp: row.no_kp, nama_pegawai: row.nama_pegawai, penempatan: row.penempatan, pilihan_potongan: 'Potongan Biro angkasa', yuran_bulanan: 0 });
      berjaya++;
    } catch (e) { gagal++; }
  }
  if (gagal === 0) {
    mesejDaftar.value = { type: 'success', text: `${berjaya} staf berjaya didaftarkan!` };
    await muatAhli(); setTimeout(() => { showDaftar.value = false; }, 1500);
  } else {
    mesejDaftar.value = { type: 'error', text: `${berjaya} berjaya, ${gagal} gagal. Semak jika No KP wujud.` };
    await muatAhli();
  }
  saving.value = false;
};

const bukaDetails = (ahliAsas) => {
  ahliDipilih.value = ahliAsas;
  showDetails.value = true;
};

const eksportCSV = () => {
  const headers = 'No KP,Nama,Gred,Penempatan,Jenis Potongan,No Ahli,Status\n';
  const rows = ahliTertapis.value.map(a => `"${a.no_kp}","${a.nama_pegawai || ''}","${a.gred_sspa || ''}","${a.penempatan || ''}","${a.jenis_potongan || ''}","${a.no_ahli || ''}","${a.status_ahli || ''}"`).join('\n');
  const blob = new Blob(['﻿' + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Ahli_Kelab.csv'; a.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  muatAhli();
  muatSenaraiPTJ();
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>
