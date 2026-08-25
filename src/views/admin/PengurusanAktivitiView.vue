
<template>
  <div class="w-full space-y-6">

    <!-- TOOLBAR: Stat Cards + Butang Tambah -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:max-w-xl">
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Jumlah</p>
            <p class="text-xl font-black text-gray-900 mt-0.5">{{ jumlahAcara }}</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Aktif</p>
            <p class="text-xl font-black text-emerald-600 mt-0.5">{{ jumlahAktif }}</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Atlet</p>
            <p class="text-xl font-black text-gray-900 mt-0.5">{{ jumlahPeserta }}</p>
          </div>
        </div>
      </div>

      <button @click="bukaBorangBaru"
        class="shrink-0 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-sm">Tambah Acara Baru</span>
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium flex items-center gap-2">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      {{ successMsg }}
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <!-- Search & Filter Bar -->
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="carian" type="text" placeholder="Cari nama acara atau lokasi..."
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all">
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button @click="filterStatus = ''"
            :class="filterStatus === '' ? 'bg-gray-800 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Semua</button>
          <button @click="filterStatus = 'AKTIF'"
            :class="filterStatus === 'AKTIF' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Aktif</button>
          <button @click="filterStatus = 'TUTUP'"
            :class="filterStatus === 'TUTUP' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Tutup</button>
          <button @click="filterStatus = 'SELESAI'"
            :class="filterStatus === 'SELESAI' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            class="px-3 py-2 text-xs font-bold rounded-lg transition-colors">Selesai</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-16 text-center">
        <svg class="w-6 h-6 animate-spin text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-sm text-gray-400 font-medium">Memuatkan data...</p>
      </div>

      <!-- Empty (tiada data langsung) -->
      <div v-else-if="senaraiAcara.length === 0" class="p-16 flex flex-col items-center text-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-800">Tiada rekod acara</p>
          <p class="text-xs text-gray-400 mt-0.5">Klik "Tambah Acara Baru" untuk mula.</p>
        </div>
      </div>

      <!-- Empty (ada data tapi tiada carian match) -->
      <div v-else-if="acaraTapis.length === 0" class="p-12 flex flex-col items-center text-center gap-2">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <p class="text-sm font-bold text-gray-500">Tiada acara sepadan carian</p>
        <button @click="carian = ''; filterStatus = ''" class="text-xs text-emerald-600 font-bold hover:underline">Papar semua</button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3 pl-6">Acara</th>
              <th class="px-4 py-3">Tarikh</th>
              <th class="px-4 py-3 text-center">Atlet</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="acara in acaraTapis" :key="acara.id"
              class="hover:bg-gray-50/60 transition-colors cursor-pointer group"
              @click="paparkanDetail(acara)">

              <!-- Acara -->
              <td class="px-5 py-3.5 pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                    <img v-if="getPosterUrl(acara.poster)"
                      :src="getPosterUrl(acara.poster)" :alt="acara.nama_acara"
                      class="w-full h-full object-cover"
                      @error="e => e.target.style.display='none'">
                    <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 text-sm leading-tight truncate max-w-56 group-hover:text-[#0F4C3A] transition-colors">{{ acara.nama_acara }}</p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                        :class="{
                          'bg-emerald-50 text-emerald-700': acara.jenis_acara === 'SUKAN',
                          'bg-blue-50 text-blue-700': acara.jenis_acara === 'KEBAJIKAN',
                          'bg-violet-50 text-violet-700': acara.jenis_acara === 'SOSIAL',
                          'bg-amber-50 text-amber-700': acara.jenis_acara === 'MESYUARAT'
                        }">{{ acara.jenis_acara }}</span>
                      <span v-if="acara.lokasi" class="text-[11px] text-gray-400 truncate max-w-36">{{ acara.lokasi }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Tarikh -->
              <td class="px-4 py-3.5">
                <p class="text-sm font-semibold text-gray-700">
                  {{ formatTarikh(acara.tarikh_acara) }}<span v-if="acara.tarikh_tamat" class="text-gray-400 font-normal"> – {{ formatTarikh(acara.tarikh_tamat) }}</span>
                </p>
                <p v-if="acara.tarikh_tutup" class="text-[11px] text-gray-400 mt-0.5">Tutup daftar: {{ formatTarikh(acara.tarikh_tutup) }}</p>
              </td>

              <!-- Atlet -->
              <td class="px-4 py-3.5 text-center" @click.stop>
                <button @click="paparkanPeserta(acara)"
                  class="inline-flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <span class="text-sm font-black leading-none"
                    :class="acara.had_peserta && Number(acara.jumlah_peserta) >= Number(acara.had_peserta) ? 'text-rose-600' : 'text-gray-800'">
                    {{ acara.jumlah_peserta || 0 }}<span v-if="acara.had_peserta" class="text-[11px] font-medium text-gray-400"> / {{ acara.had_peserta }}</span>
                  </span>
                  <div v-if="acara.had_peserta" class="w-14 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full"
                      :class="Number(acara.jumlah_peserta) >= Number(acara.had_peserta) ? 'bg-rose-500' : 'bg-emerald-500'"
                      :style="`width:${Math.min(100, Math.round((acara.jumlah_peserta / acara.had_peserta) * 100))}%`"/>
                  </div>
                </button>
              </td>

              <!-- Status -->
              <td class="px-4 py-3.5 text-center">
                <span v-if="acara.status === 'AKTIF'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Aktif
                </span>
                <span v-else-if="acara.status === 'TUTUP'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Tutup
                </span>
                <span v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Selesai
                </span>
              </td>

              <!-- Aksi -->
              <td class="px-4 py-3.5 pr-6" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <!-- Lihat Butiran -->
                  <button @click="paparkanDetail(acara)" title="Lihat Butiran"
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-200 hover:border-gray-800 transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <!-- Kemaskini -->
                  <button @click="bukaBorangEdit(acara)" title="Kemaskini Acara"
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-500 hover:text-white border border-indigo-100 hover:border-indigo-600 transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <!-- Padam -->
                  <button @click="padamAcaraId(acara.id)" title="Padam Acara"
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-rose-600 text-gray-300 hover:text-white border border-gray-200 hover:border-rose-600 transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table Footer -->
        <div class="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p class="text-xs text-gray-400 font-medium">
            Papar <span class="font-bold text-gray-700">{{ acaraTapis.length }}</span>
            <template v-if="acaraTapis.length !== senaraiAcara.length">
              daripada {{ senaraiAcara.length }}
            </template>
            rekod
          </p>
          <p v-if="carian || filterStatus" class="text-xs text-emerald-600 font-bold cursor-pointer hover:underline"
            @click="carian = ''; filterStatus = ''">
            Kosongkan penapis
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL BUTIRAN ACARA -->
    <Teleport to="body">
      <Transition name="modal-backdrop">
        <div v-if="acaraDipilihDetail"
          class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          style="background: rgba(0,0,0,0.65); backdrop-filter: blur(7px);"
          @click.self="acaraDipilihDetail = null">

          <Transition name="modal-card" appear>
            <div class="bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden max-h-[93vh] sm:max-h-[88vh]">

              <!-- ═══ HERO ═══ -->
              <div class="relative h-56 shrink-0 overflow-hidden">
                <!-- Gradient fallback background -->
                <div class="absolute inset-0 bg-gradient-to-br from-[#0F4C3A] via-[#1a7a5e] to-[#0c3d2e]"/>
                <!-- Poster image -->
                <img v-if="getPosterUrl(acaraDipilihDetail.poster)"
                  :src="getPosterUrl(acaraDipilihDetail.poster)"
                  :alt="acaraDipilihDetail.nama_acara"
                  class="absolute inset-0 w-full h-full object-cover">
                <!-- Gradient overlay for text legibility -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"/>
                <!-- Pattern overlay (subtle texture when no image) -->
                <div v-if="!getPosterUrl(acaraDipilihDetail.poster)"
                  class="absolute inset-0 opacity-10"
                  style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 40px 40px;"/>

                <!-- Close button -->
                <button @click="acaraDipilihDetail = null"
                  class="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors"
                  style="background: rgba(0,0,0,0.32); backdrop-filter: blur(8px);">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>

                <!-- Overlaid info -->
                <div class="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-12">
                  <!-- Badges -->
                  <div class="flex items-center gap-1.5 flex-wrap mb-2.5">
                    <span class="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border"
                      :class="{
                        'bg-emerald-400/20 text-emerald-200 border-emerald-400/30': acaraDipilihDetail.jenis_acara === 'SUKAN',
                        'bg-blue-400/20 text-blue-200 border-blue-400/30': acaraDipilihDetail.jenis_acara === 'KEBAJIKAN',
                        'bg-violet-400/20 text-violet-200 border-violet-400/30': acaraDipilihDetail.jenis_acara === 'SOSIAL',
                        'bg-amber-400/20 text-amber-200 border-amber-400/30': acaraDipilihDetail.jenis_acara === 'MESYUARAT'
                      }">{{ acaraDipilihDetail.jenis_acara }}</span>
                    <span v-if="acaraDipilihDetail.status === 'AKTIF'"
                      class="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-500/25 text-emerald-200 border border-emerald-500/35">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Aktif
                    </span>
                    <span v-else-if="acaraDipilihDetail.status === 'TUTUP'"
                      class="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-500/25 text-amber-200 border border-amber-500/35">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"/>Tutup
                    </span>
                    <span v-else
                      class="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-500/25 text-blue-200 border border-blue-500/35">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-400"/>Selesai
                    </span>
                    <span v-if="acaraDipilihDetail.kategori_jantina && acaraDipilihDetail.kategori_jantina !== 'Semua'"
                      class="text-[10px] font-black px-2.5 py-1 rounded-full border"
                      :class="acaraDipilihDetail.kategori_jantina === 'Lelaki'
                        ? 'bg-blue-400/20 text-blue-200 border-blue-400/30'
                        : 'bg-pink-400/20 text-pink-200 border-pink-400/30'">
                      {{ acaraDipilihDetail.kategori_jantina === 'Lelaki' ? '♂ Lelaki' : '♀ Perempuan' }}
                    </span>
                  </div>
                  <!-- Nama acara -->
                  <h2 class="text-white font-black text-xl leading-tight drop-shadow">{{ acaraDipilihDetail.nama_acara }}</h2>
                  <!-- Lokasi -->
                  <p v-if="acaraDipilihDetail.lokasi" class="text-white/60 text-xs font-medium mt-1.5 flex items-center gap-1.5">
                    <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ acaraDipilihDetail.lokasi }}
                  </p>
                </div>
              </div>

              <!-- ═══ CONTENT (scrollable) ═══ -->
              <div class="flex-1 overflow-y-auto custom-scrollbar">
                <div class="p-5 space-y-5">

                  <!-- STAT CARDS: Tarikh | Peserta | Tutup Daftar -->
                  <div class="grid grid-cols-3 gap-3">
                    <!-- Tarikh -->
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                      <div class="w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2">
                        <svg class="w-3.5 h-3.5 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <p class="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none mb-1.5">Tarikh</p>
                      <p class="text-[11px] font-black text-gray-800 leading-snug">{{ formatTarikh(acaraDipilihDetail.tarikh_acara) }}</p>
                      <p v-if="acaraDipilihDetail.tarikh_tamat" class="text-[9px] text-gray-400 mt-0.5">hingga {{ formatTarikh(acaraDipilihDetail.tarikh_tamat) }}</p>
                    </div>
                    <!-- Peserta -->
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                      <div class="w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2">
                        <svg class="w-3.5 h-3.5 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <p class="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none mb-1.5">Peserta</p>
                      <p class="text-sm font-black leading-none"
                        :class="acaraDipilihDetail.had_peserta && Number(acaraDipilihDetail.jumlah_peserta) >= Number(acaraDipilihDetail.had_peserta) ? 'text-rose-600' : 'text-gray-800'">
                        {{ acaraDipilihDetail.jumlah_peserta || 0 }}
                        <span v-if="acaraDipilihDetail.had_peserta" class="text-[10px] text-gray-400 font-medium"> / {{ acaraDipilihDetail.had_peserta }}</span>
                      </p>
                      <div v-if="acaraDipilihDetail.had_peserta" class="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                          :class="Number(acaraDipilihDetail.jumlah_peserta) >= Number(acaraDipilihDetail.had_peserta) ? 'bg-rose-500' : 'bg-emerald-500'"
                          :style="`width:${Math.min(100, Math.round(((acaraDipilihDetail.jumlah_peserta || 0) / acaraDipilihDetail.had_peserta) * 100))}%`"/>
                      </div>
                      <p v-if="acaraDipilihDetail.had_peserta && Number(acaraDipilihDetail.jumlah_peserta) >= Number(acaraDipilihDetail.had_peserta)"
                        class="text-[8px] font-black text-rose-500 uppercase tracking-wider mt-1">PENUH</p>
                    </div>
                    <!-- Tutup Daftar -->
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                      <div class="w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2">
                        <svg class="w-3.5 h-3.5 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <p class="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none mb-1.5">Tutup</p>
                      <p class="text-[11px] font-black text-gray-800 leading-snug">
                        {{ acaraDipilihDetail.tarikh_tutup ? formatTarikh(acaraDipilihDetail.tarikh_tutup) : '—' }}
                      </p>
                    </div>
                  </div>

                  <!-- SUKAN LIST -->
                  <div v-if="acaraDipilihDetail.jenis_acara === 'SUKAN' && safeArr(acaraDipilihDetail.senarai_sukan).length > 0"
                    class="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sukan Disertai</p>
                      <span class="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style="background: rgba(15,76,58,0.1); color: #0F4C3A;">
                        {{ safeArr(acaraDipilihDetail.senarai_sukan).length }} sukan
                      </span>
                    </div>
                    <!-- Numbered list -->
                    <ol class="divide-y divide-gray-100">
                      <li v-for="(sukan, i) in safeArr(acaraDipilihDetail.senarai_sukan)" :key="sukan"
                        class="flex items-center gap-3 px-4 py-2.5">
                        <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black text-white"
                          style="background: #0F4C3A;">{{ i + 1 }}</span>
                        <span class="text-sm font-bold text-gray-800">{{ sukan }}</span>
                      </li>
                    </ol>
                    <!-- Nota pelbagai sukan -->
                    <div v-if="acaraDipilihDetail.benarkan_pelbagai_sukan"
                      class="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100 bg-indigo-50/60">
                      <svg class="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      <p class="text-[11px] text-indigo-600 font-bold">Boleh daftar lebih daripada satu sukan</p>
                    </div>
                  </div>

                  <!-- KETERANGAN -->
                  <div v-if="acaraDipilihDetail.keterangan"
                    class="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Keterangan</p>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ acaraDipilihDetail.keterangan }}</p>
                  </div>

                </div>
              </div>

              <!-- ═══ FOOTER ACTIONS ═══ -->
              <div class="p-4 border-t border-gray-100 shrink-0">
                <div class="grid grid-cols-2 gap-2.5">

                  <!-- Senarai Peserta -->
                  <button @click="paparkanPeserta(acaraDipilihDetail); acaraDipilihDetail = null"
                    class="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl text-white font-black transition-all active:scale-[0.97] shadow-sm"
                    style="background: linear-gradient(135deg, #0F4C3A 0%, #1a7a5e 100%);">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-xs">Senarai Peserta</span>
                  </button>

                  <!-- Kemaskini -->
                  <button @click="bukaBorangEdit(acaraDipilihDetail); acaraDipilihDetail = null"
                    class="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 font-black transition-all active:scale-[0.97]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span class="text-xs">Kemaskini</span>
                  </button>

                  <!-- Laporan Kontinjen -->
                  <button @click="bukaKontinjen(acaraDipilihDetail); acaraDipilihDetail = null"
                    class="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 font-black transition-all active:scale-[0.97]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span class="text-xs">Lap. Kontinjen</span>
                  </button>

                  <!-- Padam -->
                  <button @click="padamAcaraId(acaraDipilihDetail.id); acaraDipilihDetail = null"
                    class="flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 font-black transition-all active:scale-[0.97]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span class="text-xs">Padam Acara</span>
                  </button>

                </div>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- KOMPONEN MODAL & PANEL -->

    <ModalBorangAcara
      :show="paparanModalBorang"
      :modEdit="modEdit"
      :idAcara="idAcaraDipilih"
      :formAsal="formEditAsal"
      @tutup="paparanModalBorang = false"
      @disimpan="onAcaraDisimpan"
    />

    <ModalSenaraiPeserta
      :show="paparanModalPeserta"
      :namaAcara="namaAcaraDipilih"
      :acaraId="acaraIdPeserta"
      :hadPeserta="hadPesertaDipilih"
      :senaraiSukan="senaraiSukanDipilih"
      :senarai="senaraiPeserta"
      @tutup="paparanModalPeserta = false"
      @pesertaDitambah="onPesertaDitambah"
    />

    <PanelKontinjenSukan
      :show="paparanPanel"
      :acaraId="idAcaraKontinjen"
      @tutup="paparanPanel = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import ModalBorangAcara from '../../components/aktiviti/ModalBorangAcara.vue';
import ModalSenaraiPeserta from '../../components/aktiviti/ModalSenaraiPeserta.vue';
import PanelKontinjenSukan from '../../components/aktiviti/PanelKontinjenSukan.vue';
import { useToast } from '../../composables/useToast';

const toast   = useToast();
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

// STATE UTAMA
const senaraiAcara = ref([]);
const senaraiPeserta = ref([]);
const loading = ref(false);
const successMsg = ref('');

// PAPARAN
const paparanModalBorang = ref(false);
const paparanModalPeserta = ref(false);
const paparanPanel = ref(false);
const acaraDipilihDetail = ref(null);

// CARIAN & FILTER
const carian = ref('');
const filterStatus = ref('');

// DATA KOMPONEN ANAK
const modEdit = ref(false);
const idAcaraDipilih = ref(null);
const namaAcaraDipilih = ref('');
const hadPesertaDipilih = ref(null);
const acaraIdPeserta = ref(null);
const senaraiSukanDipilih = ref([]);
const formEditAsal = ref(null);
const idAcaraKontinjen = ref(null);

// STATISTIK
const jumlahAcara = computed(() => senaraiAcara.value.length);
const jumlahAktif = computed(() => senaraiAcara.value.filter(a => a.status === 'AKTIF').length);
const jumlahPeserta = computed(() => senaraiAcara.value.reduce((t, a) => t + (Number(a.jumlah_peserta) || 0), 0));

// ACARA TAPIS (search + filter)
const acaraTapis = computed(() => {
  const kata = carian.value.trim().toLowerCase();
  return senaraiAcara.value.filter(a => {
    const cocokCarian = !kata
      || a.nama_acara.toLowerCase().includes(kata)
      || (a.lokasi || '').toLowerCase().includes(kata);
    const cocokStatus = !filterStatus.value || a.status === filterStatus.value;
    return cocokCarian && cocokStatus;
  });
});

// UTILITI
const safeArr = (v) => {
  if (!v) return [];
  try { return Array.isArray(v) ? v : JSON.parse(v); } catch { return []; }
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const getPosterUrl = (poster) => {
  if (!poster) return null;
  try {
    const arr = typeof poster === 'string' ? JSON.parse(poster) : poster;
    if (Array.isArray(arr) && arr.length > 0) return `${apiBase}/uploads/images/${arr[0]}`;
  } catch { }
  return null;
};

// FUNGSI

const muatNaikAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/acara/admin/semua');
    if (res.data.success) senaraiAcara.value = res.data.data;
  } catch {
    // senyap
  } finally {
    loading.value = false;
  }
};

const bukaBorangBaru = () => {
  modEdit.value = false;
  idAcaraDipilih.value = null;
  formEditAsal.value = null;
  paparanModalBorang.value = true;
};

const bukaBorangEdit = (acara) => {
  modEdit.value = true;
  idAcaraDipilih.value = acara.id;
  const isoDate = (d) => d ? d.substring(0, 10) : '';
  formEditAsal.value = {
    nama_acara: acara.nama_acara,
    jenis_acara: acara.jenis_acara,
    keterangan: acara.keterangan || '',
    lokasi: acara.lokasi || '',
    tarikh_acara: isoDate(acara.tarikh_acara),
    tarikh_tamat: isoDate(acara.tarikh_tamat),
    tarikh_tutup: isoDate(acara.tarikh_tutup),
    emel_urusetia: acara.emel_urusetia || '',
    no_tel_urusetia: acara.no_tel_urusetia || '',
    status: acara.status,
    senarai_sukan: safeArr(acara.senarai_sukan),
    benarkan_pelbagai_sukan: acara.benarkan_pelbagai_sukan === 1,
    had_peserta: acara.had_peserta ?? null,
    poster: acara.poster || null,
    link_google_form: acara.link_google_form || ''
  };
  paparanModalBorang.value = true;
};

const onAcaraDisimpan = (msg) => {
  successMsg.value = msg;
  paparanModalBorang.value = false;
  muatNaikAcara();
  setTimeout(() => { successMsg.value = ''; }, 4000);
};

const padamAcaraId = async (id) => {
  if (!confirm('Adakah anda pasti mahu memadam acara ini? Semua data pendaftaran peserta akan terhapus.')) return;
  try {
    const res = await api.delete(`/acara/admin/padam/${id}`);
    if (res.data.success) {
      muatNaikAcara();
      successMsg.value = 'Acara berjaya dipadam.';
      setTimeout(() => { successMsg.value = ''; }, 3000);
    }
  } catch {
    toast.ralat('Gagal memadam acara.');
  }
};

const paparkanPeserta = async (acara) => {
  namaAcaraDipilih.value = acara.nama_acara;
  hadPesertaDipilih.value = acara.had_peserta ?? null;
  acaraIdPeserta.value = acara.id;
  senaraiSukanDipilih.value = safeArr(acara.senarai_sukan);
  try {
    const res = await api.get(`/acara/admin/peserta/${acara.id}`);
    if (res.data.success) {
      senaraiPeserta.value = res.data.data;
      paparanModalPeserta.value = true;
    }
  } catch {
    toast.ralat('Gagal mengambil senarai peserta.');
  }
};

const onPesertaDitambah = async () => {
  if (!acaraIdPeserta.value) return;
  try {
    const res = await api.get(`/acara/admin/peserta/${acaraIdPeserta.value}`);
    if (res.data.success) {
      senaraiPeserta.value = res.data.data;
      muatNaikAcara();
    }
  } catch { /* senyap */ }
};

const paparkanDetail = (acara) => {
  acaraDipilihDetail.value = acara;
};

const bukaKontinjen = (acara) => {
  idAcaraKontinjen.value = acara.id;
  paparanPanel.value = true;
};

onMounted(() => {
  muatNaikAcara();
});
</script>

<style scoped>
/* Backdrop fade */
.modal-backdrop-enter-active { transition: opacity 0.25s ease; }
.modal-backdrop-leave-active { transition: opacity 0.2s ease; }
.modal-backdrop-enter-from,
.modal-backdrop-leave-to   { opacity: 0; }

/* Card slide up (mobile) / scale in (desktop) */
.modal-card-enter-active { transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-card-leave-active { transition: all 0.2s ease-in; }
.modal-card-enter-from   { transform: translateY(24px); opacity: 0; }
.modal-card-leave-to     { transform: translateY(12px); opacity: 0; }

.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
</style>
