
<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">

      <!-- ── Header ── -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-start shrink-0 bg-white">
        <div class="flex-1 min-w-0 pr-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Senarai Atlet</p>
          <h3 class="text-base font-black text-gray-900 leading-tight">{{ namaAcara }}</h3>
          <div v-if="hadPeserta" class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-48">
              <div class="h-full rounded-full transition-all duration-300"
                :class="isPenuh ? 'bg-rose-500' : peratusIsian >= 80 ? 'bg-amber-500' : 'bg-emerald-500'"
                :style="`width: ${Math.min(100, peratusIsian)}%`"></div>
            </div>
            <span class="text-[10px] font-black tabular-nums"
              :class="isPenuh ? 'text-rose-600' : 'text-gray-500'">
              {{ senarai.length }} / {{ hadPeserta }}
              <span v-if="isPenuh" class="ml-1 bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full text-[9px] font-black">PENUH</span>
            </span>
          </div>
          <p v-else class="text-[10px] text-gray-400 mt-0.5">{{ senarai.length }} atlet</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button @click="bukaModalTambah"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0c3d2e] rounded-xl transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Tambah Atlet
          </button>
          <button v-if="senaraiTertapis.length > 0" @click="cetak"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Cetak
          </button>
          <button @click="emit('tutup')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">✕</button>
        </div>
      </div>

      <!-- ── Filter bar ── -->
      <div class="px-5 py-3 border-b border-gray-100 bg-gray-50/60 space-y-2.5 shrink-0">
        <!-- Baris 1: carian + reset -->
        <div class="flex gap-2 items-center">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="carian" type="text" placeholder="Cari nama atau No. KP..."
              class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"/>
          </div>
          <button v-if="adaFilter" @click="resetFilter"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Reset
          </button>
        </div>

        <!-- Baris 2: dropdown + pill filters -->
        <div class="flex flex-wrap gap-2 items-center">

          <!-- Sukan -->
          <select v-if="senaraiSukanUnik.length > 0" v-model="filterSukan"
            class="text-[11px] font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none"
            :class="filterSukan ? 'border-indigo-400 text-indigo-700 bg-indigo-50' : 'text-gray-600'">
            <option value="">Semua Sukan</option>
            <option v-for="s in senaraiSukanUnik" :key="s" :value="s">{{ s }}</option>
          </select>

          <!-- Gred -->
          <select v-if="senaraiGredUnik.length > 0" v-model="filterGred"
            class="text-[11px] font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none"
            :class="filterGred ? 'border-amber-400 text-amber-700 bg-amber-50' : 'text-gray-600'">
            <option value="">Semua Gred</option>
            <option v-for="g in senaraiGredUnik" :key="g" :value="g">{{ g }}</option>
          </select>

          <!-- Penempatan -->
          <select v-if="senaraiPenempatanUnik.length > 1" v-model="filterPenempatan"
            class="text-[11px] font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none max-w-44 truncate"
            :class="filterPenempatan ? 'border-violet-400 text-violet-700 bg-violet-50' : 'text-gray-600'">
            <option value="">Semua Penempatan</option>
            <option v-for="p in senaraiPenempatanUnik" :key="p" :value="p">{{ p }}</option>
          </select>

          <!-- Jantina pills -->
          <div class="flex gap-1">
            <button v-for="j in ['Semua','Lelaki','Perempuan']" :key="j"
              @click="filterJantina = j"
              :class="['text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all',
                filterJantina === j
                  ? j === 'Lelaki'     ? 'bg-blue-600 text-white border-blue-600'
                  : j === 'Perempuan'  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
              {{ j === 'Lelaki' ? '♂' : j === 'Perempuan' ? '♀' : '♂♀' }}
              {{ j === 'Semua' ? 'Semua' : j }}
            </button>
          </div>

          <!-- Status yuran pills -->
          <div class="flex gap-1">
            <button v-for="s in [{val:'', lbl:'Semua'},{val:'bayar', lbl:'✓ Berbayar'},{val:'belum', lbl:'⚠ Belum'}]" :key="s.val"
              @click="filterYuran = s.val"
              :class="['text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all',
                filterYuran === s.val
                  ? s.val === 'bayar'  ? 'bg-emerald-600 text-white border-emerald-600'
                  : s.val === 'belum'  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
              {{ s.lbl }}
            </button>
          </div>
        </div>

        <!-- Kiraan hasil ditapis -->
        <div class="flex items-center justify-between text-[10px]">
          <span class="font-medium text-gray-500">
            Menunjukkan <span class="font-black text-gray-800">{{ senaraiTertapis.length }}</span> daripada <span class="font-black text-gray-800">{{ senarai.length }}</span> atlet
          </span>
          <div class="flex gap-3 font-bold">
            <span class="text-blue-600">♂ {{ kiraBilangan('Lelaki') }}</span>
            <span class="text-pink-600">♀ {{ kiraBilangan('Perempuan') }}</span>
            <span class="text-emerald-600">✓ {{ senaraiTertapis.filter(p => p.is_paid).length }} bayar</span>
            <span v-if="senaraiTertapis.filter(p => !p.is_paid).length" class="text-rose-600">
              ⚠ {{ senaraiTertapis.filter(p => !p.is_paid).length }} belum
            </span>
          </div>
        </div>
      </div>

      <!-- ── Amaran belum bayar ── -->
      <div v-if="senarai.length > 0 && jumlahBelumBayar > 0 && !filterYuran"
        class="px-6 py-2 bg-rose-50 border-b border-rose-100 flex items-center gap-2 shrink-0">
        <svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-[11px] font-bold text-rose-700">
          <span class="font-black">{{ jumlahBelumBayar }} peserta</span> belum menjelaskan yuran tahunan
        </p>
      </div>

      <!-- ── Jadual ── -->
      <div class="flex-1 p-5 overflow-y-auto">
        <div v-if="senarai.length === 0" class="text-center py-12 text-gray-400 italic">
          Belum ada penyertaan ahli direkodkan.
        </div>
        <div v-else-if="senaraiTertapis.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
          <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <p class="text-sm font-black text-gray-500">Tiada atlet sepadan dengan penapis</p>
          <button @click="resetFilter" class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
            Reset Penapis
          </button>
        </div>
        <div v-else class="overflow-x-auto border border-gray-100 rounded-xl">
          <table class="min-w-full text-left text-xs divide-y divide-gray-100">
            <thead class="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th class="px-4 py-3">No.</th>
                <th class="px-4 py-3">Nama Penuh</th>
                <th class="px-4 py-3">No. KP</th>
                <th class="px-4 py-3 text-center">Jantina</th>
                <th class="px-4 py-3 text-center">Umur</th>
                <th class="px-4 py-3">Gred SSPA</th>
                <th class="px-4 py-3">Penempatan / PTJ</th>
                <th class="px-4 py-3 text-center">Saiz</th>
                <th class="px-4 py-3">Sukan Dipilih</th>
                <th class="px-4 py-3 text-center">Yuran</th>
                <th class="px-4 py-3 text-center">Pergerakan</th>
                <th class="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(p, idx) in senaraiTertapis" :key="p.id"
                :class="p.is_paid ? 'hover:bg-gray-50/50' : 'bg-rose-50/30 hover:bg-rose-50/60'">
                <td class="px-4 py-3 text-gray-400 font-bold">{{ idx + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-gray-800">{{ p.nama_pegawai }}</div>
                  <div class="text-[10px] text-gray-400 mt-0.5">
                    {{ p.no_ahli ? 'Ahli: ' + p.no_ahli : 'Bukan Ahli' }}
                  </div>
                </td>
                <td class="px-4 py-3 font-mono text-gray-700 tracking-wide">{{ p.no_kp }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="['inline-block px-2 py-0.5 rounded-full text-[9px] font-black',
                    p.jantina === 'Lelaki' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-pink-50 text-pink-700 border border-pink-100']">
                    {{ p.jantina === 'Lelaki' ? '♂ L' : '♀ P' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="font-bold text-gray-700">{{ hitungUmur(p.no_kp) }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="font-semibold text-gray-700 px-2 py-0.5 bg-gray-100 rounded-md">{{ p.gred_sspa || '—' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ p.penempatan || '—' }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">{{ p.saiz_baju || '—' }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="sukan in safeArr(p.sukan_dipilih)" :key="sukan"
                      class="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded text-[10px]">
                      {{ sukan }}
                    </span>
                    <span v-if="safeArr(p.sukan_dipilih).length === 0" class="text-gray-400 italic">Umum</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="p.is_paid"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black rounded-full">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    BAYAR
                  </span>
                  <span v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-black rounded-full">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    BELUM
                  </span>
                </td>
                <!-- Pergerakan -->
                <td class="px-4 py-3 text-center">
                  <button @click="bukaModalPergerakan(p)"
                    :class="['inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-colors whitespace-nowrap border',
                      p.kaedah_pergerakan
                        ? p.kaedah_pergerakan === 'Penerbangan'
                          ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                          : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600']">
                    <svg v-if="p.kaedah_pergerakan === 'Penerbangan'" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                    <svg v-else-if="p.kaedah_pergerakan" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                    <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                    {{ p.kaedah_pergerakan || 'Isi' }}
                  </button>
                </td>
                <!-- Aksi -->
                <td class="px-4 py-3 text-center">
                  <button @click="padamPeserta(p)"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Buang
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </Transition>

  <!-- ═══════ MODAL TAMBAH PESERTA ═══════ -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modalTambah.show" class="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Admin</p>
              <h4 class="text-base font-black text-gray-900">Tambah Peserta</h4>
            </div>
            <button @click="modalTambah.show = false" class="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">✕</button>
          </div>

          <div class="p-5 space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Cari Ahli (Nama / No. KP / No. Ahli)
              </label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input v-model="modalTambah.carian" type="text" placeholder="Taip nama, no. KP atau no. ahli..."
                  @input="cariAhli"
                  class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
              </div>
            </div>

            <div v-if="modalTambah.hasilCarian.length > 0" class="border border-gray-100 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
              <div v-for="ahli in modalTambah.hasilCarian" :key="ahli.no_kp"
                @click="pilihAhli(ahli)"
                :class="[
                  'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-50 last:border-0',
                  ahli.sudah_daftar ? 'bg-gray-50 opacity-60 cursor-not-allowed' :
                  modalTambah.ahliDipilih?.no_kp === ahli.no_kp ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : 'hover:bg-gray-50'
                ]">
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ ahli.nama_pegawai }}</p>
                  <p class="text-[10px] text-gray-400">{{ ahli.no_kp }} · {{ ahli.penempatan || '—' }} · {{ ahli.gred || '—' }}</p>
                  <span v-if="ahli.sudah_daftar" class="text-[9px] text-amber-600 font-bold">Sudah mendaftar</span>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span v-if="ahli.is_paid"
                    class="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">BERBAYAR</span>
                  <span v-else
                    class="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">BELUM BAYAR</span>
                </div>
              </div>
            </div>
            <p v-else-if="modalTambah.carian.length >= 2 && !modalTambah.memuatCarian"
              class="text-xs text-gray-400 text-center py-3">Tiada ahli dijumpai</p>
            <div v-if="modalTambah.memuatCarian" class="text-center py-3">
              <svg class="w-5 h-5 animate-spin text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>

            <div v-if="modalTambah.ahliDipilih" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Ahli Dipilih</p>
              <p class="text-sm font-black text-gray-900">{{ modalTambah.ahliDipilih.nama_pegawai }}</p>
              <p class="text-[11px] text-gray-500">{{ modalTambah.ahliDipilih.no_kp }}</p>
              <div v-if="!modalTambah.ahliDipilih.is_paid"
                class="mt-2 flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Ahli ini belum menjelaskan yuran. Admin boleh tambah, status akan dipaparkan dalam senarai.
              </div>
            </div>

            <div v-if="senaraiSukan && senaraiSukan.length > 0 && modalTambah.ahliDipilih">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Sukan Yang Disertai</label>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="sukan in senaraiSukan" :key="sukan" type="button"
                  @click="toggleSukanTambah(sukan)"
                  :class="modalTambah.sukanDipilih.includes(sukan)
                    ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
                  class="text-xs px-3 py-1.5 border rounded-lg font-semibold transition-all">
                  {{ sukan }}
                </button>
              </div>
            </div>

            <div v-if="modalTambah.ralat" class="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {{ modalTambah.ralat }}
            </div>
          </div>

          <div class="px-5 pb-5 flex gap-3">
            <button @click="modalTambah.show = false"
              class="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              Batal
            </button>
            <button @click="hantarTambahPeserta"
              :disabled="!modalTambah.ahliDipilih || modalTambah.menyimpan"
              class="flex-2 py-3 rounded-xl text-xs font-black uppercase tracking-wide bg-[#0F4C3A] text-white hover:bg-[#0c3d2e] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
              <svg v-if="modalTambah.menyimpan" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ modalTambah.menyimpan ? 'Mendaftar...' : 'Daftar Peserta' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ═══════ MODAL PERGERAKAN PESERTA ═══════ -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modalPergerakan.show" class="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-600">Maklumat Pergerakan</p>
              <h4 class="text-sm font-black text-gray-900 leading-tight">{{ modalPergerakan.peserta?.nama_pegawai }}</h4>
            </div>
            <button @click="modalPergerakan.show = false" class="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">✕</button>
          </div>

          <div class="p-5 space-y-4">
            <!-- Ralat -->
            <div v-if="modalPergerakan.ralat" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
              {{ modalPergerakan.ralat }}
            </div>

            <!-- Kaedah Pergerakan -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Kaedah Pergerakan</label>
              <div class="flex gap-2">
                <button v-for="k in ['Darat','Bot','Penerbangan']" :key="k" type="button"
                  @click="modalPergerakan.form.kaedah_pergerakan = modalPergerakan.form.kaedah_pergerakan === k ? '' : k"
                  :class="['flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all',
                    modalPergerakan.form.kaedah_pergerakan === k
                      ? k === 'Penerbangan' ? 'bg-sky-600 text-white border-sky-600'
                      : k === 'Bot' ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
                  {{ k === 'Penerbangan' ? '✈ Penerbangan' : k === 'Bot' ? '⛵ Bot' : '🚗 Darat' }}
                </button>
              </div>
            </div>

            <!-- Tarikh Pergi & Balik -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tarikh Pergi</label>
                <input type="date" v-model="modalPergerakan.form.tarikh_pergi"
                  class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tarikh Balik</label>
                <input type="date" v-model="modalPergerakan.form.tarikh_balik"
                  class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
              </div>
            </div>

            <!-- Butiran Penerbangan (hanya tunjuk kalau pilih Penerbangan) -->
            <Transition name="modal-fade">
              <div v-if="modalPergerakan.form.kaedah_pergerakan === 'Penerbangan'" class="space-y-3 p-4 bg-sky-50 border border-sky-100 rounded-xl">
                <p class="text-[10px] font-black text-sky-700 uppercase tracking-widest">Butiran Penerbangan</p>

                <!-- Pergi -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-sky-600 mb-1">No. Penerbangan (Pergi)</label>
                    <input type="text" v-model="modalPergerakan.form.no_penerbangan_pergi"
                      placeholder="cth: AK123"
                      class="w-full border border-sky-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 uppercase">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-sky-600 mb-1">Masa Berlepas (Pergi)</label>
                    <input type="time" v-model="modalPergerakan.form.masa_penerbangan_pergi"
                      class="w-full border border-sky-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
                  </div>
                </div>

                <!-- Balik -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-sky-600 mb-1">No. Penerbangan (Balik)</label>
                    <input type="text" v-model="modalPergerakan.form.no_penerbangan_balik"
                      placeholder="cth: AK456"
                      class="w-full border border-sky-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 uppercase">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-sky-600 mb-1">Masa Berlepas (Balik)</label>
                    <input type="time" v-model="modalPergerakan.form.masa_penerbangan_balik"
                      class="w-full border border-sky-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-5 flex gap-2">
            <button @click="modalPergerakan.show = false"
              class="flex-1 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Batal
            </button>
            <button @click="simpanPergerakan" :disabled="modalPergerakan.menyimpan"
              class="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-60 rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <svg v-if="modalPergerakan.menyimpan" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '../../services/api';
import { KELAB } from '../../config/kelab';

const props = defineProps({
  show: Boolean,
  namaAcara: { type: String, default: '' },
  acaraId: { type: Number, default: null },
  hadPeserta: { type: Number, default: null },
  senaraiSukan: { type: Array, default: () => [] },
  senarai: { type: Array, default: () => [] }
});

const emit = defineEmits(['tutup', 'pesertaDitambah', 'pesertaDipadam']);

// ── Filter state ──
const carian        = ref('');
const filterSukan   = ref('');
const filterGred    = ref('');
const filterPenempatan = ref('');
const filterJantina = ref('Semua');
const filterYuran   = ref('');

const resetFilter = () => {
  carian.value = '';
  filterSukan.value = '';
  filterGred.value = '';
  filterPenempatan.value = '';
  filterJantina.value = 'Semua';
  filterYuran.value = '';
};

const adaFilter = computed(() =>
  carian.value || filterSukan.value || filterGred.value ||
  filterPenempatan.value || filterJantina.value !== 'Semua' || filterYuran.value
);

// ── Senarai unik untuk dropdown ──
const safeArr = (v) => {
  if (!v) return [];
  try { return Array.isArray(v) ? v : JSON.parse(v); } catch { return []; }
};

const rankGred = (gred) => {
  if (!gred || gred === '—') return 0;
  const g = String(gred).toUpperCase().trim();
  if (g.startsWith('JUSA')) return 10000;
  const m = g.match(/(\d+)/);
  return m ? parseInt(m[1]) : 1;
};

const senaraiSukanUnik = computed(() => {
  const s = new Set();
  props.senarai.forEach(p => safeArr(p.sukan_dipilih).forEach(x => s.add(x)));
  return [...s].sort();
});

const senaraiGredUnik = computed(() =>
  [...new Set(props.senarai.map(p => p.gred_sspa).filter(Boolean))].sort()
);

const senaraiPenempatanUnik = computed(() =>
  [...new Set(props.senarai.map(p => p.penempatan).filter(Boolean))].sort()
);

// ── Senarai tertapis ──
const senaraiTertapis = computed(() => {
  return props.senarai.filter(p => {
    const kata = carian.value.toLowerCase().trim();
    if (kata && !(p.nama_pegawai || '').toLowerCase().includes(kata) &&
                !(p.no_kp || '').includes(kata)) return false;

    if (filterSukan.value) {
      const sukan = safeArr(p.sukan_dipilih);
      if (!sukan.includes(filterSukan.value)) return false;
    }

    if (filterGred.value && p.gred_sspa !== filterGred.value) return false;

    if (filterPenempatan.value && p.penempatan !== filterPenempatan.value) return false;

    if (filterJantina.value !== 'Semua' && p.jantina !== filterJantina.value) return false;

    if (filterYuran.value === 'bayar'  && !p.is_paid) return false;
    if (filterYuran.value === 'belum'  && p.is_paid)  return false;

    return true;
  }).sort((a, b) => rankGred(b.gred_sspa) - rankGred(a.gred_sspa));
});

const kiraBilangan = (jantina) => senaraiTertapis.value.filter(p => p.jantina === jantina).length;

// ── Stat keseluruhan ──
const isPenuh = computed(() => props.hadPeserta !== null && props.senarai.length >= props.hadPeserta);
const peratusIsian = computed(() => props.hadPeserta ? Math.round((props.senarai.length / props.hadPeserta) * 100) : 0);
const jumlahBelumBayar = computed(() => props.senarai.filter(p => !p.is_paid).length);

// ── Modal tambah peserta ──
const modalTambah = ref({
  show: false, carian: '', hasilCarian: [], ahliDipilih: null,
  sukanDipilih: [], memuatCarian: false, menyimpan: false, ralat: ''
});

let cariTimer = null;

const bukaModalTambah = () => {
  modalTambah.value = {
    show: true, carian: '', hasilCarian: [], ahliDipilih: null,
    sukanDipilih: [], memuatCarian: false, menyimpan: false, ralat: ''
  };
};

const cariAhli = () => {
  clearTimeout(cariTimer);
  const q = modalTambah.value.carian.trim();
  if (q.length < 2) { modalTambah.value.hasilCarian = []; return; }
  modalTambah.value.memuatCarian = true;
  cariTimer = setTimeout(async () => {
    try {
      const res = await api.get('/acara/admin/cari-ahli', { params: { q, acara_id: props.acaraId } });
      modalTambah.value.hasilCarian = res.data.data || [];
    } catch { modalTambah.value.hasilCarian = []; }
    finally { modalTambah.value.memuatCarian = false; }
  }, 350);
};

const pilihAhli = (ahli) => {
  if (ahli.sudah_daftar) return;
  modalTambah.value.ahliDipilih = ahli;
  modalTambah.value.sukanDipilih = [];
};

const toggleSukanTambah = (sukan) => {
  const arr = modalTambah.value.sukanDipilih;
  modalTambah.value.sukanDipilih = arr.includes(sukan) ? arr.filter(s => s !== sukan) : [...arr, sukan];
};

const hantarTambahPeserta = async () => {
  if (!modalTambah.value.ahliDipilih) return;
  modalTambah.value.menyimpan = true;
  modalTambah.value.ralat = '';
  try {
    const res = await api.post('/acara/admin/tambah-peserta', {
      acara_id: props.acaraId,
      no_kp: modalTambah.value.ahliDipilih.no_kp,
      sukan_dipilih: modalTambah.value.sukanDipilih.length > 0 ? modalTambah.value.sukanDipilih : null
    });
    if (res.data.success) {
      modalTambah.value.show = false;
      emit('pesertaDitambah');
    }
  } catch (err) {
    modalTambah.value.ralat = err.response?.data?.message || 'Gagal mendaftarkan peserta.';
  } finally {
    modalTambah.value.menyimpan = false;
  }
};

const hitungUmur = (no_kp) => {
  if (!no_kp) return '—';
  const clean = no_kp.replace(/-/g, '');
  if (clean.length < 6) return '—';
  const yy = parseInt(clean.substring(0, 2));
  const mm = parseInt(clean.substring(2, 4));
  const dd = parseInt(clean.substring(4, 6));
  const tahunSemasa2D = new Date().getFullYear() % 100;
  const tahun = yy <= tahunSemasa2D ? 2000 + yy : 1900 + yy;
  const lahir = new Date(tahun, mm - 1, dd);
  const today = new Date();
  let umur = today.getFullYear() - lahir.getFullYear();
  if (today.getMonth() < lahir.getMonth() ||
    (today.getMonth() === lahir.getMonth() && today.getDate() < lahir.getDate())) umur--;
  return (isNaN(umur) || umur < 0 || umur > 120) ? '—' : umur + ' thn';
};

// ── Modal Pergerakan ──
const formPergerakanKosong = () => ({
  kaedah_pergerakan: '',
  tarikh_pergi: '',
  tarikh_balik: '',
  no_penerbangan_pergi: '',
  masa_penerbangan_pergi: '',
  no_penerbangan_balik: '',
  masa_penerbangan_balik: '',
});

const modalPergerakan = ref({
  show: false,
  peserta: null,
  form: formPergerakanKosong(),
  menyimpan: false,
  ralat: '',
});

const bukaModalPergerakan = (p) => {
  modalPergerakan.value = {
    show: true,
    peserta: p,
    form: {
      kaedah_pergerakan:      p.kaedah_pergerakan      || '',
      tarikh_pergi:           p.tarikh_pergi ? p.tarikh_pergi.substring(0, 10) : '',
      tarikh_balik:           p.tarikh_balik ? p.tarikh_balik.substring(0, 10) : '',
      no_penerbangan_pergi:   p.no_penerbangan_pergi   || '',
      masa_penerbangan_pergi: p.masa_penerbangan_pergi || '',
      no_penerbangan_balik:   p.no_penerbangan_balik   || '',
      masa_penerbangan_balik: p.masa_penerbangan_balik || '',
    },
    menyimpan: false,
    ralat: '',
  };
};

const simpanPergerakan = async () => {
  const mp = modalPergerakan.value;
  mp.menyimpan = true;
  mp.ralat = '';
  try {
    const res = await api.put(`/acara/admin/pergerakan-peserta/${mp.peserta.id}`, mp.form);
    if (res.data.success) {
      mp.show = false;
      emit('pesertaDitambah');
    }
  } catch (err) {
    mp.ralat = err.response?.data?.message || 'Gagal menyimpan maklumat pergerakan.';
  } finally {
    mp.menyimpan = false;
  }
};

// ── Padam peserta ──
const padamPeserta = async (p) => {
  if (!confirm(`Buang "${p.nama_pegawai}" daripada acara ini?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  try {
    const res = await api.delete(`/acara/admin/padam-peserta/${p.id}`);
    if (res.data.success) {
      emit('pesertaDitambah');
    } else {
      alert(res.data.message || 'Gagal memadam peserta.');
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Ralat semasa memadam peserta.');
  }
};

// ── Cetak senarai yang ditapis ──
const cetak = () => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const list = senaraiTertapis.value;
  const jumlahBayar    = list.filter(p => p.is_paid).length;
  const jumlahBelum    = list.filter(p => !p.is_paid).length;
  const jumlahLelaki   = list.filter(p => p.jantina === 'Lelaki').length;
  const jumlahPerempuan = list.filter(p => p.jantina === 'Perempuan').length;

  const aktifFilter = [];
  if (filterSukan.value)      aktifFilter.push(`Sukan: ${filterSukan.value}`);
  if (filterGred.value)       aktifFilter.push(`Gred: ${filterGred.value}`);
  if (filterPenempatan.value) aktifFilter.push(`Penempatan: ${filterPenempatan.value}`);
  if (filterJantina.value !== 'Semua') aktifFilter.push(`Jantina: ${filterJantina.value}`);
  if (filterYuran.value === 'bayar')   aktifFilter.push('Status: Berbayar');
  if (filterYuran.value === 'belum')   aktifFilter.push('Status: Belum Bayar');
  if (carian.value) aktifFilter.push(`Carian: "${carian.value}"`);

  const rows = list.map((p, i) => {
    const jantina = p.jantina || '—';
    const jantinaStyle = jantina === 'Lelaki'
      ? 'color:#1d4ed8;font-weight:bold;background:#dbeafe;padding:2px 6px;border-radius:4px;font-size:9px'
      : 'color:#9d174d;font-weight:bold;background:#fce7f3;padding:2px 6px;border-radius:4px;font-size:9px';
    return `<tr style="${!p.is_paid ? 'background:#fff5f5;' : ''}">
      <td>${i + 1}</td>
      <td><strong>${p.nama_pegawai}</strong><br><small style="color:#888">${p.no_ahli ? 'Ahli: ' + p.no_ahli : 'Bukan Ahli'}</small></td>
      <td style="font-family:monospace">${p.no_kp}</td>
      <td style="text-align:center"><span style="${jantinaStyle}">${jantina}</span></td>
      <td style="text-align:center">${hitungUmur(p.no_kp)}</td>
      <td style="text-align:center">${p.gred_sspa || '—'}</td>
      <td>${p.penempatan || '—'}</td>
      <td style="text-align:center"><strong>${p.saiz_baju || '—'}</strong></td>
      <td>${safeArr(p.sukan_dipilih).join(', ') || 'Umum'}</td>
      <td style="text-align:center">
        ${p.is_paid
          ? '<span style="color:#166534;font-weight:bold;background:#dcfce7;padding:2px 6px;border-radius:4px;font-size:8px">✓ BERBAYAR</span>'
          : '<span style="color:#991b1b;font-weight:bold;background:#fee2e2;padding:2px 6px;border-radius:4px;font-size:8px">⚠ BELUM BAYAR</span>'
        }
      </td>
    </tr>`;
  }).join('');

  const hadInfo = props.hadPeserta
    ? `<strong>HAD ATLET:</strong> ${props.senarai.length} / ${props.hadPeserta} orang`
    : `<strong>JUMLAH ATLET:</strong> ${props.senarai.length} ATLET`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Senarai Peserta — ${props.namaAcara}</title>
<style>
  @page { margin: 15mm 18mm; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #111; }
  .hdr { text-align:center; border-bottom:2px solid #0F4C3A; padding-bottom:10px; margin-bottom:12px; }
  .hdr h1 { font-size:13px; margin:0; text-transform:uppercase; letter-spacing:.05em; }
  .hdr h2 { font-size:11px; margin:3px 0 0; color:#0F4C3A; text-transform:uppercase; }
  .meta { display:flex; justify-content:space-between; margin-bottom:8px; font-size:10px; }
  .filter-strip { margin-bottom:8px; padding:5px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:9px; color:#475569; }
  .stat-strip { display:flex; gap:16px; margin-bottom:10px; padding:6px 10px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; font-size:9px; flex-wrap:wrap; }
  .stat-strip .belum { color:#991b1b; font-weight:bold; }
  .stat-strip .lelaki { color:#1d4ed8; font-weight:bold; }
  .stat-strip .perempuan { color:#9d174d; font-weight:bold; }
  table { width:100%; border-collapse:collapse; }
  thead { background:#0F4C3A; color:#fff; }
  th { padding:6px 7px; text-align:left; font-size:9px; text-transform:uppercase; letter-spacing:.04em; }
  td { padding:5px 7px; border-bottom:1px solid #eee; vertical-align:top; }
  .foot { margin-top:20px; display:flex; justify-content:space-between; }
  .sign { width:45%; text-align:center; }
  .sign-line { border-top:1px solid #000; margin-top:38px; padding-top:4px; font-size:9px; text-transform:uppercase; }
  .legend { margin-top:10px; font-size:9px; color:#555; }
</style></head><body>
<div class="hdr">
  <h1>${KELAB.namaPendek}</h1>
  <h2>Senarai Atlet Berdaftar</h2>
</div>
<div class="meta">
  <div><strong>ACARA:</strong> ${props.namaAcara}<br>${hadInfo}</div>
  <div style="text-align:right"><strong>DICETAK:</strong> ${tarikhCetak}</div>
</div>
${aktifFilter.length ? `<div class="filter-strip"><strong>Penapis aktif:</strong> ${aktifFilter.join(' &nbsp;·&nbsp; ')} &nbsp;(${list.length} daripada ${props.senarai.length} atlet)</div>` : ''}
<div class="stat-strip">
  <span class="lelaki">Lelaki: ${jumlahLelaki} atlet</span>
  <span class="perempuan">Perempuan: ${jumlahPerempuan} atlet</span>
  <span>Berbayar Yuran: <strong style="color:#166534">${jumlahBayar} atlet</strong></span>
  ${jumlahBelum > 0 ? `<span class="belum">⚠ Belum Bayar: ${jumlahBelum} atlet</span>` : ''}
</div>
<table>
  <thead><tr>
    <th>No.</th><th>Nama Penuh</th><th>No. KP</th><th>Jantina</th><th>Umur</th><th>Gred</th>
    <th>Penempatan</th><th>Saiz</th><th>Sukan</th><th>Status Yuran</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
${jumlahBelum > 0 ? '<div class="legend">* Baris berlatar merah: atlet belum menjelaskan yuran tahunan kelab.</div>' : ''}
<div class="foot">
  <div class="sign"><div class="sign-line">Disediakan oleh / Prepared by</div></div>
  <div class="sign"><div class="sign-line">${KELAB.namaTandatangan}</div></div>
</div>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};
</script>

<style scoped>
.modal-fade-enter-active { transition: opacity 0.18s ease; }
.modal-fade-leave-active { transition: opacity 0.15s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
