<template>
  <div style="font-family: Tahoma, 'Segoe UI', Arial, sans-serif" class="text-xs text-gray-800 pb-10">

    <!-- ── PAGE HEADER ── -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
      <div>
        <h2 class="text-base font-bold text-gray-900 tracking-tight">Pengurusan Kewangan Kelab</h2>
        <p class="text-[11px] text-gray-500 mt-0.5">Lejar Tunai &bull; Perakaunan &bull; Laporan Berkala &bull; Analitik Jualan</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select v-model="tahunPilihan" @change="onTahunBertukar"
          class="bg-white border border-gray-300 text-gray-700 font-semibold text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]">
          <option v-for="y in senaraITahun" :key="y" :value="y">Tahun {{ y }}</option>
        </select>
        <button @click="bukaTambahBorang('masuk')"
          class="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-2 rounded-lg transition-colors shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
          </svg>
          Rekod Masuk
        </button>
        <button @click="bukaTambahBorang('keluar')"
          class="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-3 py-2 rounded-lg transition-colors shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
          </svg>
          Rekod Keluar
        </button>
        <button @click="eksportCSV"
          class="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 font-semibold text-[11px] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Eksport CSV
        </button>
      </div>
    </div>

    <!-- ── KPI CARDS ── -->
    <div v-if="!loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <!-- Kredit -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Jumlah Kredit<br/><span class="text-[9px] normal-case font-normal text-gray-400">Pendapatan {{ tahunPilihan }}</span></p>
          <div class="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
            </svg>
          </div>
        </div>
        <p class="text-lg font-black text-emerald-700 tabular-nums leading-none">{{ fmt(statistik.jumlah_masuk) }}</p>
        <p class="text-[9px] text-gray-400 mt-1">Yuran + Jualan + Sumbangan</p>
      </div>
      <!-- Debit -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Jumlah Debit<br/><span class="text-[9px] normal-case font-normal text-gray-400">Perbelanjaan {{ tahunPilihan }}</span></p>
          <div class="w-7 h-7 rounded-md bg-rose-100 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
            </svg>
          </div>
        </div>
        <p class="text-lg font-black text-rose-700 tabular-nums leading-none">{{ fmt(statistik.jumlah_keluar) }}</p>
        <p class="text-[9px] text-gray-400 mt-1">Kebajikan + Acara + Perkhidmatan</p>
      </div>
      <!-- Lebihan/Kurangan -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Lebihan / (Kurangan)<br/><span class="text-[9px] normal-case font-normal text-gray-400">Tahun {{ tahunPilihan }}</span></p>
          <div :class="['w-7 h-7 rounded-md flex items-center justify-center shrink-0', statistik.baki >= 0 ? 'bg-blue-100' : 'bg-orange-100']">
            <svg :class="['w-3.5 h-3.5', statistik.baki >= 0 ? 'text-blue-600' : 'text-orange-600']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
            </svg>
          </div>
        </div>
        <p :class="['text-lg font-black tabular-nums leading-none', statistik.baki >= 0 ? 'text-blue-700' : 'text-orange-600']">
          {{ statistik.baki >= 0 ? '+' : '' }}{{ fmt(statistik.baki) }}
        </p>
        <p :class="['text-[9px] mt-1', statistik.baki >= 0 ? 'text-emerald-600' : 'text-orange-500']">
          {{ statistik.baki >= 0 ? 'Lebihan tahun semasa' : 'Kurangan perlu perhatian' }}
        </p>
      </div>
      <!-- Baki Terkumpul -->
      <div class="bg-gradient-to-br from-[#0F4C3A] to-[#0a2e23] rounded-xl p-4 shadow-md relative overflow-hidden border border-[#0F4C3A]">
        <div class="absolute -right-3 -top-3 w-14 h-14 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
        <div class="flex items-start justify-between mb-2 relative z-10">
          <p class="text-[10px] font-bold text-white/70 uppercase tracking-wider leading-tight">Baki Terkumpul<br/><span class="text-[9px] normal-case font-normal text-white/50">Keseluruhan rekod</span></p>
          <div class="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
        </div>
        <p class="text-lg font-black text-white tabular-nums leading-none relative z-10">{{ fmt(bakiTerkumpul) }}</p>
        <p class="text-[9px] text-amber-300 mt-1 relative z-10">Baki bersih setakat hari ini</p>
      </div>
    </div>

    <!-- Loading skeleton KPI -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div v-for="i in 4" :key="i" class="h-24 rounded-xl bg-white border border-gray-200 animate-pulse"/>
    </div>

    <!-- ── TAB NAVIGATION ── -->
    <div class="flex border-b border-gray-200 mb-0 bg-white rounded-t-xl overflow-x-auto">
      <button v-for="tab in tabs" :key="tab.id" @click="tabAktif = tab.id"
        :class="['flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 border-b-2',
          tabAktif === tab.id
            ? 'text-[#0F4C3A] border-[#0F4C3A] bg-emerald-50/50'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50']">
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="tab.ikon"/>
        </svg>
        {{ tab.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════════
         TAB: LEJAR TUNAI
    ══════════════════════════════════════ -->
    <div v-show="tabAktif === 'lejar'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm">

      <!-- Chart -->
      <div class="p-5 border-b border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Aliran Kewangan Bulanan {{ tahunPilihan }}</h3>
          <div class="flex items-center gap-3 text-[10px] text-gray-500">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>Kredit</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>Debit</span>
          </div>
        </div>
        <div class="h-56">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

      <!-- Transaction Table Controls -->
      <div class="flex flex-col gap-2.5 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <!-- Row 1: Jenis + Carian -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Jenis:</span>
            <button v-for="j in filterJenisOps" :key="j.val" @click="setFilterJenis(j.val)"
              :class="['px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors border',
                filterJenis === j.val
                  ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100']">
              {{ j.label }}
            </button>
          </div>
          <div class="relative">
            <input v-model="carian" @input="debounceSearch" type="text" placeholder="Cari rujukan, nota, pihak..."
              class="w-56 bg-white border border-gray-300 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] placeholder-gray-400"/>
            <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <!-- Row 2: Filter Bulan -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Bulan:</span>
          <button @click="setFilterBulan(0)"
            :class="['px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors border',
              filterBulan === 0
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100']">
            Semua
          </button>
          <button v-for="b in senaraiMinggu" :key="b.val" @click="setFilterBulan(b.val)"
            :class="['px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors border',
              filterBulan === b.val
                ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100']">
            {{ b.label }}
          </button>
        </div>
      </div>

      <!-- Ledger Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Tarikh</th>
              <th class="px-4 py-3">Jenis</th>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Nota / Rujukan</th>
              <th class="px-4 py-3">Pihak</th>
              <th class="px-5 py-3 text-right text-rose-600">Debit (–) RM</th>
              <th class="px-5 py-3 text-right text-emerald-600">Kredit (+) RM</th>
              <th class="px-4 py-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="transaksiLoading">
              <td colspan="8" class="px-5 py-10 text-center">
                <div class="flex items-center justify-center gap-2 text-gray-500 text-xs">
                  <svg class="animate-spin w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Memuatkan rekod...
                </div>
              </td>
            </tr>
            <tr v-else-if="transaksi.length === 0">
              <td colspan="8" class="px-5 py-14 text-center text-gray-400 text-xs">Tiada rekod transaksi dijumpai.</td>
            </tr>
            <tr v-for="tx in transaksi" :key="tx.id" class="hover:bg-gray-50/70 transition-colors group">
              <td class="px-5 py-2.5 text-gray-600 whitespace-nowrap font-mono text-[11px]">{{ tx.tarikh }}</td>
              <td class="px-4 py-2.5">
                <span :class="['inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider',
                  tx.jenis_aliran === 'MASUK'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ tx.jenis_aliran === 'MASUK' ? '▲ KREDIT' : '▼ DEBIT' }}
                </span>
              </td>
              <td class="px-4 py-2.5">
                <span class="text-[10px] bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded font-semibold">{{ labelKat(tx.kategori) }}</span>
              </td>
              <td class="px-4 py-2.5 max-w-48">
                <p class="font-semibold text-gray-800 truncate text-[11px]">{{ tx.nota || '—' }}</p>
                <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ tx.rujukan || 'Tiada rujukan' }}</p>
              </td>
              <td class="px-4 py-2.5 text-gray-600 text-[11px]">
                {{ tx.nama_ahli || tx.penerima_bayaran || '—' }}
              </td>
              <td class="px-5 py-2.5 text-right">
                <span v-if="tx.jenis_aliran === 'KELUAR'" class="font-bold tabular-nums text-rose-600 text-[12px]">{{ num(tx.amaun) }}</span>
                <span v-else class="text-gray-300 text-[11px]">—</span>
              </td>
              <td class="px-5 py-2.5 text-right">
                <span v-if="tx.jenis_aliran === 'MASUK'" class="font-bold tabular-nums text-emerald-600 text-[12px]">{{ num(tx.amaun) }}</span>
                <span v-else class="text-gray-300 text-[11px]">—</span>
              </td>
              <td class="px-4 py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="bukaEdit(tx)" title="Edit rekod"
                    class="w-7 h-7 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="padamTx(tx)" title="Padam rekod"
                    class="w-7 h-7 rounded-md flex items-center justify-center text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <p class="text-[11px] text-gray-500">Jumlah: <span class="font-bold text-gray-800">{{ meta.total }}</span> rekod transaksi</p>
        <div class="flex gap-1">
          <button v-for="p in totalPages" :key="p" @click="halamanSemasa = p; muatTransaksi()"
            :class="['w-7 h-7 rounded-md text-[11px] font-bold transition-colors border flex items-center justify-center',
              p === halamanSemasa
                ? 'bg-[#0F4C3A] border-[#0F4C3A] text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100']">
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         TAB: LAPORAN BERKALA
    ══════════════════════════════════════ -->
    <div v-if="tabAktif === 'laporan'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm p-6">
      <div class="grid md:grid-cols-3 gap-5">

        <!-- Laporan Harian -->
        <div class="border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-sky-100 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-800">Laporan Harian</h4>
              <p class="text-[10px] text-gray-500">Semua transaksi dalam satu hari</p>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pilih Tarikh</label>
            <input v-model="laporanTarikh" type="date"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"/>
          </div>
          <button @click="cetakLaporanHarian" :disabled="menjanaPdf.harian"
            class="w-full flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60">
            <span v-if="menjanaPdf.harian" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/>
            </svg>
            Jana Laporan Harian
          </button>
        </div>

        <!-- Laporan Bulanan -->
        <div class="border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-800">Laporan Bulanan</h4>
              <p class="text-[10px] text-gray-500">Ringkasan & transaksi sebulan</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bulan</label>
              <select v-model="laporanBulan"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                <option v-for="b in senaraiMinggu" :key="b.val" :value="b.val">{{ b.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tahun</label>
              <select v-model="laporanTahunBulan"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                <option v-for="y in senaraITahun" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
          <button @click="cetakLaporanBulanan" :disabled="menjanaPdf.bulanan"
            class="w-full flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60">
            <span v-if="menjanaPdf.bulanan" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/>
            </svg>
            Jana Laporan Bulanan
          </button>
        </div>

        <!-- Penyata Tahunan -->
        <div class="border border-gray-200 rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-800">Penyata Tahunan</h4>
              <p class="text-[10px] text-gray-500">Ringkasan pendapatan & perbelanjaan</p>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tahun Penyata</label>
            <select v-model="tahunPilihan" @change="onTahunBertukar"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]">
              <option v-for="y in senaraITahun" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <button @click="cetakPenyataTahunan" :disabled="menjanaPenyata"
            class="w-full flex items-center justify-center gap-1.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white font-bold text-[11px] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60">
            <span v-if="menjanaPenyata" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/>
            </svg>
            Jana Penyata Tahunan
          </button>
        </div>
      </div>

      <!-- Nota laporan -->
      <div class="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nota</p>
        <ul class="space-y-1 text-[11px] text-gray-600">
          <li>• Laporan dijana dalam format cetakan PDF — gunakan <strong>Cetak ke PDF</strong> dalam dialog cetak pelayar anda.</li>
          <li>• Penyata Tahunan merangkumi pecahan kategori pendapatan &amp; perbelanjaan serta baki terkumpul.</li>
          <li>• Semua laporan menggunakan data sedia ada dalam pangkalan data pada masa jana.</li>
          <li>• Eksport CSV tersedia di bahagian atas untuk analisis lanjut menggunakan Excel / Google Sheets.</li>
        </ul>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         TAB: PRODUK PALING LARIS
    ══════════════════════════════════════ -->
    <div v-if="tabAktif === 'produk'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm">

      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 class="text-xs font-bold text-gray-800">Produk Paling Laris — {{ tahunPilihan }}</h3>
          <p class="text-[10px] text-gray-500 mt-0.5">Berdasarkan pesanan yang telah dibayar / diselesaikan dari Marketplace Kedai Kelab.</p>
        </div>
        <button @click="muatProdukLaris" :disabled="loadingProduk"
          class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors border border-gray-200 disabled:opacity-50">
          <svg :class="['w-3.5 h-3.5', loadingProduk ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Semula
        </button>
      </div>

      <div v-if="loadingProduk" class="p-6 space-y-2">
        <div v-for="i in 5" :key="i" class="h-12 rounded-lg bg-gray-100 animate-pulse"/>
      </div>

      <div v-else-if="produkLaris.length === 0" class="px-5 py-16 text-center text-gray-400 text-xs">
        <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        Tiada data jualan produk untuk tahun {{ tahunPilihan }}.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3 text-center w-10">#</th>
              <th class="px-4 py-3">Produk</th>
              <th class="px-4 py-3 text-right">Harga Jual (RM)</th>
              <th class="px-4 py-3 text-right">Unit Terjual</th>
              <th class="px-4 py-3 text-right">Hasil Jualan (RM)</th>
              <th class="px-4 py-3 text-right">Stok Baki</th>
              <th class="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(p, idx) in produkLaris" :key="p.id"
              class="hover:bg-gray-50/70 transition-colors">
              <td class="px-5 py-3 text-center">
                <span :class="['w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black mx-auto',
                  idx === 0 ? 'bg-amber-100 text-amber-700' :
                  idx === 1 ? 'bg-gray-200 text-gray-600' :
                  idx === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-500']">
                  {{ idx + 1 }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img v-if="p.gambar" :src="apiBase + p.gambar" :alt="p.nama_produk"
                      class="w-full h-full object-cover" @error="($event.target.style.display='none')" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                  </div>
                  <span class="font-semibold text-gray-800 text-[11px]">{{ p.nama_produk }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right font-mono text-[11px] text-gray-700">{{ num(p.harga_jual) }}</td>
              <td class="px-4 py-3 text-right">
                <span :class="['font-black text-sm tabular-nums', p.unit_terjual > 0 ? 'text-emerald-600' : 'text-gray-400']">
                  {{ p.unit_terjual }}
                </span>
                <span class="text-[10px] text-gray-400 ml-1">unit</span>
              </td>
              <td class="px-4 py-3 text-right font-bold tabular-nums text-[12px]"
                :class="p.hasil_jualan > 0 ? 'text-emerald-600' : 'text-gray-400'">
                {{ p.hasil_jualan > 0 ? num(p.hasil_jualan) : '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <span :class="['font-bold tabular-nums text-[11px]',
                  p.stok_baki > 10 ? 'text-gray-700' :
                  p.stok_baki > 0  ? 'text-amber-600' : 'text-rose-600']">
                  {{ p.stok_baki }}
                </span>
                <span class="text-[10px] text-gray-400 ml-1">baki</span>
              </td>
              <td class="px-5 py-3 text-center">
                <span v-if="idx === 0" class="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full">🏆 No. 1</span>
                <span v-else-if="p.unit_terjual === 0" class="text-[10px] text-gray-400">—</span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="4" class="px-4 py-3 text-right text-[10px] font-bold text-gray-600 uppercase tracking-wider">Jumlah Keseluruhan:</td>
              <td class="px-4 py-3 text-right font-black text-emerald-700 tabular-nums text-sm">
                {{ num(produkLaris.reduce((a, b) => a + b.hasil_jualan, 0)) }}
              </td>
              <td colspan="2" class="px-4 py-3 text-right text-[10px] text-gray-500">
                {{ produkLaris.reduce((a, b) => a + b.unit_terjual, 0) }} unit terjual
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <p class="text-[10px] text-gray-500">
          * Hasil jualan dikira berdasarkan harga seunit pada masa transaksi (bukan harga semasa).
          Untuk analisis <strong>harga modal dan untung bersih</strong>, sila tetapkan harga modal pada setiap produk dalam
          <router-link to="/admin/kedai" class="text-[#0F4C3A] font-bold underline hover:no-underline">Pengurusan Marketplace Kedai</router-link>.
        </p>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         TAB: KUTIPAN SUMBANGAN
    ══════════════════════════════════════ -->
    <div v-if="tabAktif === 'sumbangan'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm overflow-hidden">

      <!-- Sumbangan header -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-amber-50/40">
        <div class="flex items-center gap-3">
          <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <p class="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Jumlah Kutipan {{ tahunPilihan }}</p>
            <p class="text-base font-black text-amber-700 leading-tight tabular-nums">{{ fmt(jumlahSumbangan) }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl px-4 py-2">
            <p class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Bil. Penyumbang</p>
            <p class="text-base font-black text-gray-800 leading-tight tabular-nums">{{ senaraiSumbangan.length }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="showFormSumbangan = !showFormSumbangan"
            class="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Tambah Sumbangan
          </button>
          <label class="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-gray-300 shadow-sm cursor-pointer transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            Import CSV
            <input type="file" accept=".csv,text/csv" class="hidden" @change="handleCsvSumbangan"/>
          </label>
          <button @click="cetakSumbangan" :disabled="senaraiSumbangan.length === 0"
            class="flex items-center gap-1.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
            Cetak Laporan
          </button>
        </div>
      </div>

      <!-- Borang tambah manual -->
      <div v-if="showFormSumbangan" class="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
          <div class="sm:col-span-4">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Penyumbang *</label>
            <input v-model="formSumbangan.nama_penyumbang" type="text" placeholder="Nama penuh / syarikat"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amaun (RM) *</label>
            <input v-model="formSumbangan.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Program / Tujuan</label>
            <input v-model="formSumbangan.program" type="text" placeholder="Cth: Tabung Kebajikan"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tarikh</label>
            <input v-model="formSumbangan.tarikh" type="date"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-1">
            <button @click="simpanSumbangan" :disabled="savingSumbangan"
              class="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2 py-2 text-xs font-bold disabled:opacity-60 transition-colors">
              <span v-if="savingSumbangan" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              <span v-else>+</span>
            </button>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 mt-2">
          Format CSV: <code class="bg-gray-200 px-1 rounded">nama, amaun, program, tarikh</code> (baris pertama tajuk dilangkau). Tarikh: YYYY-MM-DD.
        </p>
      </div>

      <!-- Senarai sumbangan -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3 w-10">#</th>
              <th class="px-4 py-3">Nama Penyumbang</th>
              <th class="px-4 py-3">Program / Tujuan</th>
              <th class="px-4 py-3">Tarikh</th>
              <th class="px-5 py-3 text-right">Amaun (RM)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loadingSumbangan">
              <td colspan="5" class="px-5 py-10 text-center text-gray-400 text-xs">Memuatkan...</td>
            </tr>
            <tr v-else-if="senaraiSumbangan.length === 0">
              <td colspan="5" class="px-5 py-14 text-center text-gray-400 text-xs">Tiada rekod sumbangan untuk tahun {{ tahunPilihan }}.</td>
            </tr>
            <tr v-for="(s, i) in senaraiSumbangan" :key="s.id" class="hover:bg-amber-50/30 transition-colors">
              <td class="px-5 py-2.5 text-gray-400 text-[11px]">{{ i + 1 }}</td>
              <td class="px-4 py-2.5 font-semibold text-gray-800 text-[11px]">{{ s.nama_penyumbang }}</td>
              <td class="px-4 py-2.5 text-gray-500 text-[11px]">{{ s.program || '—' }}</td>
              <td class="px-4 py-2.5 text-gray-500 text-[11px] font-mono">{{ s.tarikh }}</td>
              <td class="px-5 py-2.5 text-right font-black text-amber-600 tabular-nums text-[12px]">{{ num(s.amaun) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ── Modal Edit Transaksi ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);"
          @click.self="showEditModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F4C3A]">Lejar Kewangan</p>
                <h3 class="text-[15px] font-black text-gray-900">Kemaskini Rekod</h3>
              </div>
              <button @click="showEditModal = false"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <div class="px-6 py-5 space-y-4">

              <!-- Jenis & Tarikh -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Jenis Aliran *</label>
                  <select v-model="formEdit.jenis_aliran"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#0F4C3A]">
                    <option value="MASUK">▲ KREDIT (Masuk)</option>
                    <option value="KELUAR">▼ DEBIT (Keluar)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tarikh *</label>
                  <input v-model="formEdit.tarikh" type="date"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
                </div>
              </div>

              <!-- Kategori & Amaun -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori *</label>
                  <select v-model="formEdit.kategori"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#0F4C3A]">
                    <option v-for="(label, key) in LABEL_KATEGORI" :key="key" :value="key">{{ label }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amaun (RM) *</label>
                  <input v-model="formEdit.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
                </div>
              </div>

              <!-- Pihak -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Pihak / Penerima</label>
                <input v-model="formEdit.penerima_bayaran" type="text" placeholder="Nama individu atau syarikat"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
              </div>

              <!-- Rujukan -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Rujukan</label>
                <input v-model="formEdit.rujukan" type="text" placeholder="No. resit, invois, dll."
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
              </div>

              <!-- Nota -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nota / Keterangan</label>
                <textarea v-model="formEdit.nota" rows="2" placeholder="Huraian transaksi..."
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A] resize-none"></textarea>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button @click="showEditModal = false"
                class="px-4 py-2 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-300">
                Batal
              </button>
              <button @click="simpanEdit" :disabled="savingEdit"
                class="flex items-center gap-1.5 px-5 py-2 rounded-lg text-[11px] font-bold text-white bg-[#0F4C3A] hover:bg-[#155d47] transition-colors disabled:opacity-60">
                <span v-if="savingEdit" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Simpan Kemaskini
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Full-Screen Form Modal ── -->
    <ModalBorangKewangan
      v-if="showBorang"
      :senaraiAhli="senaraiAhli"
      :jenisAwal="borangJenisAwal"
      @tutup="showBorang = false"
      @berjaya="onTransaksiBerjaya"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';
import ModalBorangKewangan from '../../components/kewangan/ModalBorangKewangan.vue';

Chart.register(...registerables);

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const LABEL_KATEGORI = {
  YURAN: 'Yuran Kelab', KEDAI: 'Jualan Kedai', SUMBANGAN: 'Sumbangan', ACARA: 'Bayaran Acara',
  KEBAJIKAN: 'Kebajikan', BELIAN_BARANG: 'Pembelian Barang', PERKHIDMATAN: 'Perkhidmatan',
  OPERASI: 'Kos Operasi (FPX)', 'LAIN-LAIN': 'Lain-lain', LAIN: 'Lain-lain',
};
const labelKat = (k) => LABEL_KATEGORI[k] || k;

// ── Tabs ──
const tabs = [
  { id: 'lejar',     label: 'Lejar Tunai',     ikon: 'M4 7h16M4 12h16M4 17h7' },
  { id: 'laporan',   label: 'Laporan Berkala',  ikon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'produk',    label: 'Produk Paling Laris', ikon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'sumbangan', label: 'Kutipan Sumbangan', ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
];
const tabAktif = ref('lejar');

// ── State ──
const loading          = ref(true);
const transaksiLoading = ref(true);
const statistik        = ref({ jumlah_masuk: 0, jumlah_keluar: 0, baki: 0, bulanan: [] });
const bakiTerkumpul    = ref(0);
const transaksi        = ref([]);
const senaraiAhli      = ref([]);
const meta             = ref({ total: 0, page: 1, limit: 20 });
const tahunPilihan     = ref(new Date().getFullYear());
const filterJenis      = ref('');
const filterBulan      = ref(0);
const carian           = ref('');
const halamanSemasa    = ref(1);
const chartRef         = ref(null);
let chartInstance      = null;
let debounceTimer      = null;

// Borang modal
const showBorang       = ref(false);
const borangJenisAwal  = ref('masuk');

// Laporan state
const laporanTarikh    = ref(new Date().toISOString().split('T')[0]);
const laporanBulan     = ref(new Date().getMonth() + 1);
const laporanTahunBulan = ref(new Date().getFullYear());
const menjanaPenyata   = ref(false);
const menjanaPdf       = ref({ harian: false, bulanan: false });

// Produk laris
const produkLaris      = ref([]);
const loadingProduk    = ref(false);

// Edit transaksi
const showEditModal  = ref(false);
const savingEdit     = ref(false);
const editingId      = ref(null);
const formEdit       = ref({ jenis_aliran: 'KELUAR', kategori: '', amaun: '', nota: '', rujukan: '', penerima_bayaran: '', tarikh: '' });

// Sumbangan
const showFormSumbangan = ref(false);
const senaraiSumbangan  = ref([]);
const jumlahSumbangan   = ref(0);
const loadingSumbangan  = ref(false);
const savingSumbangan   = ref(false);
const formSumbangan     = ref({ nama_penyumbang: '', amaun: '', program: '', tarikh: '' });

const filterJenisOps = [
  { val: '', label: 'Semua' },
  { val: 'MASUK', label: 'Kredit (Masuk)' },
  { val: 'KELUAR', label: 'Debit (Keluar)' },
];

const senaraiMinggu = [
  { val: 1, label: 'Jan' }, { val: 2, label: 'Feb' }, { val: 3, label: 'Mac' },
  { val: 4, label: 'Apr' }, { val: 5, label: 'Mei' }, { val: 6, label: 'Jun' },
  { val: 7, label: 'Jul' }, { val: 8, label: 'Ogos' }, { val: 9, label: 'Sep' },
  { val: 10, label: 'Okt' }, { val: 11, label: 'Nov' }, { val: 12, label: 'Dis' },
];

const senaraITahun = computed(() => {
  const y = new Date().getFullYear();
  return [y + 1, y, y - 1, y - 2, y - 3];
});
const totalPages = computed(() => Math.ceil(meta.value.total / meta.value.limit) || 1);

const fmt = (v) => `RM ${parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const rm  = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const num = (v) => parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ── Actions ──
const bukaTambahBorang = (jenis) => {
  borangJenisAwal.value = jenis;
  showBorang.value = true;
};

const setFilterJenis = (val) => {
  filterJenis.value = val;
  halamanSemasa.value = 1;
  muatTransaksi();
};

const setFilterBulan = (val) => {
  filterBulan.value = val;
  halamanSemasa.value = 1;
  muatTransaksi();
};

const onTahunBertukar = async () => {
  halamanSemasa.value = 1;
  filterBulan.value = 0;
  await muatData();
  await muatTransaksi();
  if (tabAktif.value === 'sumbangan') await muatSumbangan();
  if (tabAktif.value === 'produk') await muatProdukLaris();
};

const onTransaksiBerjaya = async () => {
  showBorang.value = false;
  await muatData();
  await muatTransaksi();
  if (tabAktif.value === 'sumbangan') await muatSumbangan();
};

// ── Edit & Padam Transaksi ──
const bukaEdit = (tx) => {
  editingId.value = tx.id;
  const tarikhRaw = tx.tarikh ? tx.tarikh.substring(0, 10).split('-').reverse().join('-') : '';
  const [dd, mm, yyyy] = tarikhRaw.split('-');
  formEdit.value = {
    jenis_aliran:    tx.jenis_aliran,
    kategori:        tx.kategori,
    amaun:           tx.amaun,
    nota:            tx.nota || '',
    rujukan:         tx.rujukan || '',
    penerima_bayaran: tx.penerima_bayaran || tx.nama_ahli || '',
    tarikh:          yyyy && mm && dd ? `${yyyy}-${mm}-${dd}` : new Date().toISOString().split('T')[0],
  };
  showEditModal.value = true;
};

const simpanEdit = async () => {
  if (!formEdit.value.kategori || !formEdit.value.amaun || parseFloat(formEdit.value.amaun) <= 0) {
    return alert('Sila isi kategori dan amaun yang sah.');
  }
  savingEdit.value = true;
  try {
    const { data } = await api.put(`/admin/kewangan/transaksi/${editingId.value}`, formEdit.value);
    if (data.success) {
      showEditModal.value = false;
      await muatData();
      await muatTransaksi();
    } else {
      alert(data.message || 'Gagal mengemaskini rekod.');
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat mengemaskini rekod.');
  } finally {
    savingEdit.value = false;
  }
};

const padamTx = async (tx) => {
  if (!confirm(`Padam rekod ${tx.jenis_aliran === 'MASUK' ? 'KREDIT' : 'DEBIT'} ${fmt(tx.amaun)}?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  try {
    const { data } = await api.delete(`/admin/kewangan/transaksi/${tx.id}`);
    if (data.success) {
      await muatData();
      await muatTransaksi();
    } else {
      alert(data.message || 'Gagal memadam rekod.');
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Ralat memadam rekod.');
  }
};

// ── Muat data ──
const muatSenaraiAhli = async () => {
  try {
    const { data } = await api.get('/admin/semua-ahli');
    if (data.success) senaraiAhli.value = data.data;
  } catch (e) { console.error('Gagal muat ahli', e); }
};

const muatBakiTerkumpul = async () => {
  try {
    const tahunSemasa = new Date().getFullYear();
    const { data } = await api.get(`/admin/kewangan/penyata-tahunan?tahun=${tahunSemasa}`);
    if (data.success) bakiTerkumpul.value = data.data.baki_akhir;
    else bakiTerkumpul.value = statistik.value.baki;
  } catch { bakiTerkumpul.value = statistik.value.baki; }
};

const muatData = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/statistik?tahun=${tahunPilihan.value}`);
    if (data.success) {
      statistik.value = data.data;
      if (tabAktif.value === 'lejar') {
        await nextTick();
        renderChart(data.data.bulanan);
      }
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const muatTransaksi = async () => {
  transaksiLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: halamanSemasa.value, limit: 20,
      tahun: tahunPilihan.value,
      ...(filterBulan.value && { bulan: filterBulan.value }),
      ...(filterJenis.value && { jenis: filterJenis.value }),
      ...(carian.value && { cari: carian.value }),
    });
    const { data } = await api.get(`/admin/kewangan/transaksi?${params}`);
    if (data.success) { transaksi.value = data.data; meta.value = data.meta; }
  } catch (e) { console.error(e); }
  finally { transaksiLoading.value = false; }
};

const muatProdukLaris = async () => {
  loadingProduk.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/produk-laris?tahun=${tahunPilihan.value}`);
    if (data.success) produkLaris.value = data.data;
  } catch (e) { console.error(e); }
  finally { loadingProduk.value = false; }
};

const muatSumbangan = async () => {
  loadingSumbangan.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/sumbangan?tahun=${tahunPilihan.value}`);
    if (data.success) { senaraiSumbangan.value = data.data; jumlahSumbangan.value = data.jumlah; }
  } catch (e) { console.error(e); }
  finally { loadingSumbangan.value = false; }
};

const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    halamanSemasa.value = 1;
    muatTransaksi();
  }, 400);
};

// ── Chart ──
const renderChart = (bulanan) => {
  if (!chartRef.value) return;
  if (chartInstance) chartInstance.destroy();
  const labels = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Kredit (+)', data: bulanan.map(b => b.masuk),  backgroundColor: '#059669', borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.75 },
        { label: 'Debit (–)', data: bulanan.map(b => b.keluar), backgroundColor: '#e11d48', borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.75 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#4b5563', font: { family: 'Tahoma, Arial', size: 11, weight: 'bold' }, usePointStyle: true, boxWidth: 7 } },
        tooltip: {
          backgroundColor: '#1f2937', titleFont: { family: 'Tahoma, Arial', size: 12 },
          bodyFont: { family: 'Tahoma, Arial', size: 12, weight: 'bold' }, padding: 10,
          callbacks: { label: ctx => ` ${rm(ctx.parsed.y)}` }
        },
      },
      scales: {
        x: { ticks: { color: '#6b7280', font: { family: 'Tahoma, Arial', size: 11 } }, grid: { display: false } },
        y: { ticks: { color: '#6b7280', font: { family: 'Tahoma, Arial', size: 11 }, callback: v => 'RM ' + v }, grid: { color: '#f3f4f6' } },
      },
    },
  });
};

// ── Watchers ──
watch(tabAktif, async (newVal) => {
  if (newVal === 'lejar' && statistik.value.bulanan.length > 0) {
    await nextTick();
    renderChart(statistik.value.bulanan);
  }
  if (newVal === 'produk' && produkLaris.value.length === 0) {
    await muatProdukLaris();
  }
  if (newVal === 'sumbangan' && senaraiSumbangan.value.length === 0) {
    await muatSumbangan();
  }
});

// ── Simpan sumbangan ──
const simpanSumbangan = async () => {
  if (!formSumbangan.value.nama_penyumbang || !formSumbangan.value.amaun || parseFloat(formSumbangan.value.amaun) <= 0) {
    return alert('Sila isi nama penyumbang dan amaun yang sah.');
  }
  savingSumbangan.value = true;
  try {
    const { data } = await api.post('/admin/kewangan/sumbangan', formSumbangan.value);
    if (data.success) {
      formSumbangan.value = { nama_penyumbang: '', amaun: '', program: '', tarikh: '' };
      await muatSumbangan();
      await muatData();
      await muatTransaksi();
    }
  } catch (e) { alert(e.response?.data?.message || 'Gagal menyimpan sumbangan.'); }
  finally { savingSumbangan.value = false; }
};

// ── CSV Import ──
const huraiBarisCSV = (baris) => {
  const hasil = []; let semasa = ''; let dalamPetik = false;
  for (let i = 0; i < baris.length; i++) {
    const ch = baris[i];
    if (ch === '"') {
      if (dalamPetik && baris[i + 1] === '"') { semasa += '"'; i++; }
      else dalamPetik = !dalamPetik;
    } else if (ch === ',' && !dalamPetik) { hasil.push(semasa); semasa = ''; }
    else semasa += ch;
  }
  hasil.push(semasa);
  return hasil.map(s => s.trim());
};

const handleCsvSumbangan = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const teks = await file.text();
    const baris = teks.split(/\r?\n/).filter(b => b.trim() !== '');
    if (baris.length === 0) return alert('Fail CSV kosong.');
    const pertama = huraiBarisCSV(baris[0]).map(s => s.toLowerCase());
    const adaTajuk = pertama.some(c => ['nama','penyumbang','amaun','jumlah','program','tarikh'].includes(c));
    const mula = adaTajuk ? 1 : 0;
    const senarai = [];
    for (let i = mula; i < baris.length; i++) {
      const k = huraiBarisCSV(baris[i]);
      const nama = k[0] || '';
      const amaun = parseFloat((k[1] || '').replace(/[^0-9.]/g, ''));
      if (!nama || !amaun) continue;
      senarai.push({ nama_penyumbang: nama, amaun, program: k[2] || null, tarikh: k[3] || null });
    }
    if (senarai.length === 0) return alert('Tiada data sah dijumpai dalam CSV. Format: nama, amaun, program, tarikh.');
    if (!confirm(`${senarai.length} rekod sumbangan dikesan. Teruskan import?`)) return;
    const { data } = await api.post('/admin/kewangan/sumbangan/import', { senarai });
    if (data.success) {
      alert(data.message);
      await muatSumbangan();
      await muatData();
      await muatTransaksi();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memproses fail CSV.');
  } finally { e.target.value = ''; }
};

// ── Eksport CSV ──
const eksportCSV = () => {
  window.open(`${import.meta.env.VITE_API_URL}/admin/kewangan/eksport?tahun=${tahunPilihan.value}`, '_blank');
};

// ── Print helpers ──
const fmtTarikhSahaja = (t) => {
  if (!t) return '—';
  const d = String(t).substring(0, 10);
  const [y, m, dy] = d.split('-');
  return `${dy}/${m}/${y}`;
};

const buatBarisTx = (tx, idx) => `
  <tr>
    <td style="text-align:center;color:#64748b">${idx + 1}</td>
    <td style="font-family:monospace">${fmtTarikhSahaja(tx.tarikh)}</td>
    <td><span style="font-size:8px;font-weight:700;letter-spacing:.04em;color:${tx.jenis_aliran === 'MASUK' ? '#047857' : '#b91c1c'}">${tx.jenis_aliran === 'MASUK' ? '▲ KREDIT' : '▼ DEBIT'}</span></td>
    <td>${labelKat(tx.kategori)}</td>
    <td style="color:#475569">${(tx.nota || tx.rujukan || '—').substring(0, 45)}</td>
    <td style="color:#475569">${tx.nama_ahli || tx.penerima_bayaran || '—'}</td>
    <td style="text-align:right;color:#b91c1c;font-weight:700;font-family:monospace">${tx.jenis_aliran === 'KELUAR' ? num(tx.amaun) : ''}</td>
    <td style="text-align:right;color:#047857;font-weight:700;font-family:monospace">${tx.jenis_aliran === 'MASUK' ? num(tx.amaun) : ''}</td>
  </tr>`;

const bukaCetakWindow = (tajuk, badan) => {
  const w = window.open('', '_blank', 'width=920,height=720');
  w.document.write(`<html><head><title>${tajuk}</title><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#1e293b;max-width:820px;margin:auto;font-size:11px;line-height:1.5}
    table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px}
    th{background:#1e293b;color:#f8fafc;padding:5px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;white-space:nowrap}
    td{padding:3.5px 8px;border-bottom:1px solid #e2e8f0;vertical-align:middle}
    tr:nth-child(even) td{background:#f8fafc}
    .ringkas{margin-top:16px;border:1px solid #334155;border-radius:5px;overflow:hidden;font-size:9.5px}
    .ringkas .r{display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #e2e8f0}
    .ringkas .r:last-child{border-bottom:none}
    .ringkas .akhir{background:#1e293b;color:#f8fafc;font-weight:700;font-size:10px}
    .pos{color:#047857;font-weight:700}.neg{color:#b91c1c;font-weight:700}
    @media print{body{padding:8px}}
  </style></head><body>
  ${headerResitHTML(tajuk)}
  ${badan}
  ${footerResitHTML()}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

// ── Penyata Tahunan ──
const cetakPenyataTahunan = async () => {
  menjanaPenyata.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/penyata-tahunan?tahun=${tahunPilihan.value}`);
    if (!data.success) throw new Error();
    const d = data.data;
    const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });

    const barisPendapatan = d.pendapatan.length
      ? d.pendapatan.map(r => `<tr><td>${labelKat(r.kategori)}</td><td style="text-align:center">${r.bil}</td><td style="text-align:right;font-family:monospace">${num(r.jumlah)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:#999">Tiada rekod pendapatan.</td></tr>`;
    const barisPerbelanjaan = d.perbelanjaan.length
      ? d.perbelanjaan.map(r => `<tr><td>${labelKat(r.kategori)}</td><td style="text-align:center">${r.bil}</td><td style="text-align:right;font-family:monospace">${num(r.jumlah)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:#999">Tiada rekod perbelanjaan.</td></tr>`;

    const badan = `
      <h3 style="font-size:10px;color:#1e293b;margin:18px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">A. Pendapatan / Kredit</h3>
      <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
      <tbody>${barisPendapatan}<tr style="font-weight:700;background:#f1f5f9;border-top:1.5px solid #334155"><td>JUMLAH KREDIT</td><td></td><td style="text-align:right;font-family:monospace">${num(d.jumlah_pendapatan)}</td></tr></tbody></table>
      <h3 style="font-size:10px;color:#1e293b;margin:18px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">B. Perbelanjaan / Debit</h3>
      <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
      <tbody>${barisPerbelanjaan}<tr style="font-weight:700;background:#f1f5f9;border-top:1.5px solid #334155"><td>JUMLAH DEBIT</td><td></td><td style="text-align:right;font-family:monospace">${num(d.jumlah_perbelanjaan)}</td></tr></tbody></table>
      <div class="ringkas">
        <div class="r"><span>Baki Bawa Ke Hadapan (sebelum ${d.tahun})</span><span>${rm(d.baki_bawa)}</span></div>
        <div class="r"><span>Jumlah Kredit ${d.tahun}</span><span class="pos">${rm(d.jumlah_pendapatan)}</span></div>
        <div class="r"><span>Jumlah Debit ${d.tahun}</span><span class="neg">${rm(d.jumlah_perbelanjaan)}</span></div>
        <div class="r"><span>Lebihan / (Kurangan) Tahun Semasa</span><span class="${d.lebihan_kurangan >= 0 ? 'pos' : 'neg'}">${rm(d.lebihan_kurangan)}</span></div>
        <div class="r akhir"><span>BAKI AKHIR TERKUMPUL</span><span>${rm(d.baki_akhir)}</span></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:10px;color:#444">
        <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
        <div style="text-align:center">________________________<br/>Disahkan oleh (Yang Dipertua)</div>
      </div>`;

    bukaCetakWindow(`Penyata Kewangan Tahunan &bull; Tahun ${d.tahun} &bull; Dicetak: ${tarikhCetak}`, badan);
  } catch (e) {
    alert('Gagal menjana penyata tahunan.');
  } finally { menjanaPenyata.value = false; }
};

// ── Laporan Harian ──
const cetakLaporanHarian = async () => {
  if (!laporanTarikh.value) return alert('Sila pilih tarikh laporan.');
  menjanaPdf.value.harian = true;
  try {
    const { data } = await api.get(`/admin/kewangan/laporan-harian?tarikh=${laporanTarikh.value}`);
    if (!data.success) throw new Error();
    const { data: rows, ringkasan: r } = data;
    const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    const tarikhLaporan = new Date(laporanTarikh.value).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

    const baris = rows.length
      ? rows.map((tx, i) => buatBarisTx(tx, i)).join('')
      : `<tr><td colspan="8" style="text-align:center;color:#999;padding:16px">Tiada transaksi pada tarikh ini.</td></tr>`;

    const badan = `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:11px">
        <div><strong>TARIKH:</strong> ${tarikhLaporan}</div>
        <div style="text-align:right"><strong>DICETAK:</strong> ${tarikhCetak}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Kredit</div>
          <div style="font-size:13px;font-weight:700;color:#047857;font-family:monospace">+${rm(r.masuk)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Debit</div>
          <div style="font-size:13px;font-weight:700;color:#b91c1c;font-family:monospace">-${rm(r.keluar)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Lebihan / (Kurangan)</div>
          <div style="font-size:13px;font-weight:700;font-family:monospace;color:${r.lebihan >= 0 ? '#047857' : '#b91c1c'}">${r.lebihan >= 0 ? '+' : ''}${rm(r.lebihan)}</div>
        </div>
      </div>
      <table><thead><tr>
        <th style="width:26px;text-align:center">#</th><th>Tarikh</th><th>Jenis</th>
        <th>Kategori</th><th>Nota / Rujukan</th><th>Pihak</th>
        <th style="text-align:right">Debit (–) RM</th>
        <th style="text-align:right">Kredit (+) RM</th>
      </tr></thead>
      <tbody>${baris}</tbody></table>
      <div style="margin-top:6px;font-size:8.5px;color:#64748b">Jumlah: <strong>${r.bil}</strong> transaksi</div>`;

    bukaCetakWindow(`Laporan Tunai Harian &bull; ${tarikhLaporan}`, badan);
  } catch (e) {
    alert('Gagal menjana laporan harian.');
  } finally { menjanaPdf.value.harian = false; }
};

// ── Laporan Bulanan ──
const cetakLaporanBulanan = async () => {
  menjanaPdf.value.bulanan = true;
  try {
    const { data } = await api.get(`/admin/kewangan/laporan-bulanan?tahun=${laporanTahunBulan.value}&bulan=${laporanBulan.value}`);
    if (!data.success) throw new Error();
    const { data: rows, ringkasan: r } = data;
    const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    const namaBulan = senaraiMinggu.find(b => b.val === laporanBulan.value)?.label || laporanBulan.value;

    const baris = rows.length
      ? rows.map((tx, i) => buatBarisTx(tx, i)).join('')
      : `<tr><td colspan="8" style="text-align:center;color:#999;padding:16px">Tiada transaksi untuk bulan ini.</td></tr>`;

    const badan = `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:11px">
        <div><strong>TEMPOH:</strong> ${namaBulan} ${laporanTahunBulan.value}</div>
        <div style="text-align:right"><strong>DICETAK:</strong> ${tarikhCetak}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Kredit</div>
          <div style="font-size:13px;font-weight:700;color:#047857;font-family:monospace">+${rm(r.masuk)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Debit</div>
          <div style="font-size:13px;font-weight:700;color:#b91c1c;font-family:monospace">-${rm(r.keluar)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Lebihan / (Kurangan)</div>
          <div style="font-size:13px;font-weight:700;font-family:monospace;color:${r.lebihan >= 0 ? '#047857' : '#b91c1c'}">${r.lebihan >= 0 ? '+' : ''}${rm(r.lebihan)}</div>
        </div>
      </div>
      <table><thead><tr>
        <th style="width:26px;text-align:center">#</th><th>Tarikh</th><th>Jenis</th>
        <th>Kategori</th><th>Nota / Rujukan</th><th>Pihak</th>
        <th style="text-align:right">Debit (–) RM</th>
        <th style="text-align:right">Kredit (+) RM</th>
      </tr></thead>
      <tbody>${baris}</tbody></table>
      <div style="margin-top:6px;font-size:8.5px;color:#64748b">Jumlah: <strong>${r.bil}</strong> transaksi &bull; ${namaBulan} ${laporanTahunBulan.value}</div>`;

    bukaCetakWindow(`Laporan Kewangan Bulanan &bull; ${namaBulan} ${laporanTahunBulan.value}`, badan);
  } catch (e) {
    alert('Gagal menjana laporan bulanan.');
  } finally { menjanaPdf.value.bulanan = false; }
};

// ── Cetak Sumbangan ──
const cetakSumbangan = () => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });
  const baris = senaraiSumbangan.value.map((s, i) =>
    `<tr><td style="text-align:center">${i+1}</td><td>${s.nama_penyumbang}</td><td>${s.program||'—'}</td><td>${s.tarikh}</td><td style="text-align:right;font-weight:700;font-family:monospace;color:#b45309">${num(s.amaun)}</td></tr>`
  ).join('');

  const badan = `
    <table><thead><tr>
      <th style="width:36px;text-align:center">#</th><th>Nama Penyumbang</th><th>Program / Tujuan</th><th>Tarikh</th>
      <th style="text-align:right">Amaun (RM)</th>
    </tr></thead>
    <tbody>${baris}
    <tr style="font-weight:bold;background:#fffbeb;border-top:2px solid #d97706">
      <td colspan="4">JUMLAH KESELURUHAN KUTIPAN (${senaraiSumbangan.value.length} penyumbang)</td>
      <td style="text-align:right;font-weight:700;font-family:monospace;color:#b45309">${num(jumlahSumbangan.value)}</td>
    </tr></tbody></table>`;

  bukaCetakWindow(`Laporan Kutipan Sumbangan &bull; Tahun ${tahunPilihan.value} &bull; Dicetak: ${tarikhCetak}`, badan);
};

onMounted(async () => {
  await Promise.all([muatSenaraiAhli(), muatData(), muatTransaksi()]);
  muatBakiTerkumpul();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
