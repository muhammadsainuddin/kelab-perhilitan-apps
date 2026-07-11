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
      <div class="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">

        <!-- Jenis -->
        <select v-model="filterJenis" @change="setFilterJenis(filterJenis)"
          class="bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]">
          <option value="">Semua Jenis</option>
          <option value="MASUK">▲ Kredit (Masuk)</option>
          <option value="KELUAR">▼ Debit (Keluar)</option>
        </select>

        <!-- Bulan -->
        <select v-model="filterBulan" @change="setFilterBulan(filterBulan)"
          class="bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]">
          <option :value="0">Semua Bulan</option>
          <option v-for="b in senaraiMinggu" :key="b.val" :value="b.val">{{ b.label }}</option>
        </select>

        <!-- Kategori -->
        <select v-model="filterKategori" @change="setFilterKategori(filterKategori)"
          class="bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]">
          <option value="">Semua Kategori</option>
          <option v-for="k in filterKategoriOps" :key="k.val" :value="k.val">{{ k.label }}</option>
        </select>

        <!-- Carian -->
        <div class="relative flex-1 min-w-40">
          <input v-model="carian" @input="debounceSearch" type="text" placeholder="Cari rujukan, nota, pihak..."
            class="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] placeholder-gray-400"/>
          <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Padam semua filter -->
        <button v-if="filterJenis || filterBulan || filterKategori || carian"
          @click="filterJenis=''; filterBulan=0; filterKategori=''; carian=''; halamanSemasa=1; muatTransaksi()"
          class="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-2 rounded-lg transition-colors shrink-0">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Reset
        </button>

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
                <div class="flex flex-wrap items-center gap-1">
                  <span class="text-[10px] bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded font-semibold">{{ labelKat(tx.kategori) }}</span>
                  <span v-if="tx.nama_acara_khas"
                    class="text-[9px] bg-violet-100 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded font-bold">
                    {{ tx.nama_acara_khas }}
                  </span>
                </div>
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
         TAB: KUTIPAN SUMBANGAN (MAKSWIP)
    ══════════════════════════════════════ -->
    <div v-if="tabAktif === 'sumbangan'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm overflow-hidden">

      <!-- Header stats -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-amber-50/40">
        <div class="flex flex-wrap items-center gap-3">
          <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <p class="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Jumlah Kutipan Kasar</p>
            <p class="text-base font-black text-amber-700 leading-tight tabular-nums">{{ fmt(jumlahKasarSumbangan) }}</p>
          </div>
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
            <p class="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Diterima dari MAKSWIP</p>
            <p class="text-base font-black text-emerald-700 leading-tight tabular-nums">{{ fmt(jumlahDiterimaSumbangan) }}</p>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <p class="text-[9px] font-bold text-orange-700 uppercase tracking-wider">Belum Dituntut</p>
            <p class="text-base font-black text-orange-700 leading-tight tabular-nums">{{ fmt(jumlahBelumTuntutSumbangan) }}</p>
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
          <button @click="bukaModalTuntutan"
            class="flex items-center gap-1.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Tuntutan MAKSWIP
          </button>
        </div>
      </div>

      <!-- Notis MAKSWIP -->
      <div class="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-start gap-2">
        <svg class="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-[10px] text-blue-700">
          Sumbangan syarikat luar melalui <strong>MAKSWIP</strong> — wang masuk ke akaun MAKSWIP dahulu.
          Buat tuntutan apabila ingin memasukkan wang ke ledger. Masukkan amaun sebenar yang diterima dari MAKSWIP.
        </p>
      </div>

      <!-- Borang tambah manual -->
      <div v-if="showFormSumbangan" class="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Acara / Event <span class="text-red-500">*</span></label>
            <input v-model="formSumbangan.nama_acara" type="text" list="senarai-acara-dl" placeholder="Cth: SAKOM 2026"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
            <datalist id="senarai-acara-dl">
              <option v-for="a in acaraSumbangan" :key="a.nama_acara" :value="a.nama_acara"/>
            </datalist>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Syarikat / Penyumbang <span class="text-red-500">*</span></label>
            <input v-model="formSumbangan.nama_penyumbang" type="text" placeholder="Nama syarikat"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amaun (RM) <span class="text-red-500">*</span></label>
            <input v-model="formSumbangan.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tarikh</label>
            <input v-model="formSumbangan.tarikh" type="date"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-2">
            <button @click="simpanSumbangan" :disabled="savingSumbangan"
              class="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2 py-2 text-xs font-bold disabled:opacity-60 transition-colors">
              <span v-if="savingSumbangan" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              <span v-else>Rekod Sumbangan</span>
            </button>
          </div>
        </div>
        <p class="text-[10px] text-gray-400 mt-2">
          Format CSV: <code class="bg-gray-200 px-1 rounded">nama_syarikat, amaun, nama_acara, tarikh</code>. Tarikh: YYYY-MM-DD.
        </p>
      </div>

      <!-- Senarai Rekod Sumbangan -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3 w-10">#</th>
              <th class="px-4 py-3">Acara</th>
              <th class="px-4 py-3">Syarikat / Penyumbang</th>
              <th class="px-4 py-3">Tarikh</th>
              <th class="px-4 py-3">Nota</th>
              <th class="px-5 py-3 text-right">Amaun (RM)</th>
              <th class="px-4 py-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loadingSumbangan">
              <td colspan="7" class="px-5 py-10 text-center text-gray-400 text-xs">Memuatkan...</td>
            </tr>
            <tr v-else-if="rekodSumbanganSemua.length === 0">
              <td colspan="7" class="px-5 py-14 text-center text-gray-400 text-xs">
                Tiada rekod sumbangan. Mulakan dengan tambah sumbangan syarikat untuk sesuatu acara.
              </td>
            </tr>
            <tr v-for="(r, i) in rekodSumbanganSemua" :key="r.id" class="hover:bg-amber-50/20 transition-colors">
              <td class="px-5 py-2.5 text-gray-400 text-[11px]">{{ i + 1 }}</td>
              <td class="px-4 py-2.5 text-[11px] text-gray-600 font-medium">{{ r.nama_acara }}</td>
              <td class="px-4 py-2.5 text-[11px] font-semibold text-gray-800">{{ r.nama_syarikat }}</td>
              <td class="px-4 py-2.5 text-[10px] text-gray-500 font-mono">{{ r.tarikh }}</td>
              <td class="px-4 py-2.5 text-[10px] text-gray-400 max-w-[160px] truncate">{{ r.nota || '—' }}</td>
              <td class="px-5 py-2.5 text-right font-black text-amber-700 tabular-nums text-[12px]">{{ num(r.amaun) }}</td>
              <td class="px-4 py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="bukaSumbanganView(r)" title="Lihat"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button @click="bukaSumbanganEdit(r)" title="Edit"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="padamRekodSumbangan(r)" title="Padam"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="rekodSumbanganSemua.length > 0" class="border-t-2 border-gray-200 bg-gray-50">
            <tr>
              <td colspan="6" class="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase">
                Jumlah {{ rekodSumbanganSemua.length }} rekod
              </td>
              <td class="px-5 py-2.5 text-right font-black text-amber-800 tabular-nums text-[13px]">
                {{ num(jumlahKasarSumbangan) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Sejarah Tuntutan MAKSWIP -->
      <div v-if="sejarahTuntutanMakswip.length > 0" class="border-t border-gray-200 mt-1">
        <div class="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sejarah Tuntutan MAKSWIP</p>
        </div>
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-2">#</th>
              <th class="px-4 py-2">Merangkumi</th>
              <th class="px-4 py-2">Tarikh Terima</th>
              <th class="px-4 py-2">Nota</th>
              <th class="px-4 py-2 text-right">Jumlah Kasar</th>
              <th class="px-5 py-2 text-right">Bersih Diterima</th>
              <th class="px-4 py-2 text-center">Dokumen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(t, i) in sejarahTuntutanMakswip" :key="t.id" class="hover:bg-emerald-50/20 transition-colors">
              <td class="px-5 py-2.5 text-[10px] text-gray-400">{{ i + 1 }}</td>
              <td class="px-4 py-2.5 text-[11px] font-semibold text-gray-700 max-w-[200px] truncate">{{ t.nama_acara }}</td>
              <td class="px-4 py-2.5 text-[10px] text-gray-500 font-mono">{{ t.tarikh_tuntutan }}</td>
              <td class="px-4 py-2.5 text-[10px] text-gray-400 max-w-[160px] truncate">{{ t.nota || '—' }}</td>
              <td class="px-4 py-2.5 text-right text-[11px] text-amber-700 font-semibold tabular-nums">{{ num(t.jumlah_kasar) }}</td>
              <td class="px-5 py-2.5 text-right text-[12px] font-black text-emerald-700 tabular-nums">{{ num(t.jumlah_bersih) }}</td>
              <td class="px-4 py-2.5 text-center">
                <a v-if="t.fail_dokumen" :href="apiBase + t.fail_dokumen" target="_blank"
                  class="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors">
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Lihat
                </a>
                <span v-else class="text-[9px] text-gray-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ═══ MODAL TUNTUTAN MAKSWIP ═══ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModalTuntutan" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);"
          @click.self="showModalTuntutan = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">

            <!-- Header -->
            <div class="px-6 py-4 bg-[#0F4C3A] flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <svg class="w-4.5 h-4.5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="font-bold text-white text-sm">Rekod Tuntutan MAKSWIP</p>
              </div>
              <button @click="showModalTuntutan = false" class="text-white/60 hover:text-white p-1 rounded transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

              <!-- Pilih Acara Khas -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Acara Khas <span class="text-red-500">*</span>
                </label>
                <select v-model="formTuntutan.acara_khas_id"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500">
                  <option value="">— Pilih Acara —</option>
                  <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                </select>
                <!-- Info ringkasan sumbangan acara ini -->
                <div v-if="formTuntutan.acara_khas_id && ringkasanAcaraTuntutan" class="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <p class="text-[9px] text-amber-700">
                    Jumlah sumbangan dikutip untuk acara ini:
                    <strong class="tabular-nums">RM {{ num(ringkasanAcaraTuntutan.jumlah) }}</strong>
                    ({{ ringkasanAcaraTuntutan.bil }} penyumbang)
                  </p>
                </div>
              </div>

              <!-- Jumlah bersih (manual) -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Jumlah Bersih Diterima dari MAKSWIP (RM) <span class="text-red-500">*</span>
                </label>
                <input v-model="formTuntutan.jumlah_bersih" type="number" min="0" step="0.01"
                  placeholder="Masukkan amaun sebenar yang diterima"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"/>
              </div>

              <!-- Tarikh tuntutan -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tarikh Terima dari MAKSWIP <span class="text-red-500">*</span></label>
                <input v-model="formTuntutan.tarikh_tuntutan" type="date"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"/>
              </div>

              <!-- Upload dokumen -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dokumen Tuntutan (PDF / Gambar)</label>
                <div class="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
                  @click="$refs.inputFailTuntutan.click()">
                  <input ref="inputFailTuntutan" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" class="hidden"
                    @change="onPilihFailTuntutan"/>
                  <div v-if="!failTuntutan">
                    <svg class="w-6 h-6 text-gray-300 mx-auto mb-1.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.987 4.095H18a3.75 3.75 0 010 7.5H6.75z"/>
                    </svg>
                    <p class="text-[10px] text-gray-400">Klik untuk muat naik atau seret fail ke sini</p>
                    <p class="text-[9px] text-gray-300 mt-0.5">PDF, JPG, PNG (maks 20MB)</p>
                  </div>
                  <div v-else class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-[11px] font-semibold text-emerald-700 truncate max-w-[200px]">{{ failTuntutan.name }}</p>
                    <button @click.stop="failTuntutan = null" type="button" class="text-gray-400 hover:text-red-500">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Nota -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nota (Pilihan)</label>
                <input v-model="formTuntutan.nota" type="text" placeholder="Cth: Resit MAKSWIP No. XXX"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"/>
              </div>

              <p class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 leading-relaxed">
                Amaun <strong>{{ fmt(formTuntutan.jumlah_bersih || 0) }}</strong> akan dimasukkan ke ledger utama sebagai MASUK / SUMBANGAN.
              </p>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-2">
              <button @click="showModalTuntutan = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="sahkanTuntutan" :disabled="savingTuntutan || !formTuntutan.acara_khas_id || !formTuntutan.tarikh_tuntutan || !formTuntutan.jumlah_bersih"
                class="flex-[2] py-2.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-60 shadow-sm">
                {{ savingTuntutan ? 'Menyimpan...' : 'Sahkan & Rekod ke Ledger' }}
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL VIEW SUMBANGAN ═══ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showViewSumbangan" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)"
          @click.self="showViewSumbangan = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-amber-500 flex items-center justify-between">
              <p class="font-bold text-white text-sm">Maklumat Sumbangan</p>
              <button @click="showViewSumbangan = false" class="text-white/70 hover:text-white p-1 rounded transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div v-if="dipilihSumbangan" class="p-5 space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2 bg-gray-50 rounded-xl px-4 py-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Acara</p>
                  <p class="font-bold text-gray-800 text-sm mt-0.5">{{ dipilihSumbangan.nama_acara }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl px-4 py-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Syarikat / Penyumbang</p>
                  <p class="font-semibold text-gray-800 text-xs mt-0.5">{{ dipilihSumbangan.nama_syarikat }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl px-4 py-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tarikh</p>
                  <p class="font-semibold text-gray-800 text-xs mt-0.5 font-mono">{{ dipilihSumbangan.tarikh }}</p>
                </div>
                <div class="bg-amber-50 rounded-xl px-4 py-3 col-span-2">
                  <p class="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Amaun</p>
                  <p class="font-black text-amber-700 text-xl mt-0.5 tabular-nums">{{ fmt(dipilihSumbangan.amaun) }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl px-4 py-3 col-span-2">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nota</p>
                  <p class="text-gray-600 text-xs mt-0.5">{{ dipilihSumbangan.nota || '—' }}</p>
                </div>
              </div>
            </div>
            <div class="px-5 py-4 border-t border-gray-100">
              <button @click="showViewSumbangan = false"
                class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL EDIT SUMBANGAN ═══ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEditSumbangan" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)"
          @click.self="showEditSumbangan = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-amber-500 flex items-center justify-between">
              <p class="font-bold text-white text-sm">Edit Sumbangan</p>
              <button @click="showEditSumbangan = false" class="text-white/70 hover:text-white p-1 rounded transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-5 space-y-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Acara <span class="text-red-500">*</span></label>
                <input v-model="formEditSumbangan.nama_acara" type="text" list="edit-acara-dl"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
                <datalist id="edit-acara-dl">
                  <option v-for="a in acaraSumbangan" :key="a.nama_acara" :value="a.nama_acara"/>
                </datalist>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Syarikat / Penyumbang <span class="text-red-500">*</span></label>
                <input v-model="formEditSumbangan.nama_syarikat" type="text"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amaun (RM) <span class="text-red-500">*</span></label>
                  <input v-model="formEditSumbangan.amaun" type="number" min="0.01" step="0.01"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tarikh</label>
                  <input v-model="formEditSumbangan.tarikh" type="date"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nota</label>
                <input v-model="formEditSumbangan.nota" type="text" placeholder="(Pilihan)"
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
              </div>
            </div>
            <div class="px-5 py-4 border-t border-gray-100 flex gap-2">
              <button @click="showEditSumbangan = false"
                class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="simpanEditSumbangan" :disabled="savingEditSumbangan"
                class="flex-[2] py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-60">
                {{ savingEditSumbangan ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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

    <!-- ══════════════════════════════════════
         TAB: ACARA KHAS
    ══════════════════════════════════════ -->
    <div v-if="tabAktif === 'acara'" class="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-violet-50/40">
        <div>
          <h3 class="text-[13px] font-bold text-gray-800">Penyata Acara Khas</h3>
          <p class="text-[11px] text-gray-500 mt-0.5">Pilih acara untuk lihat penyata khas — semua transaksi di bawah kategori acara tersebut.</p>
        </div>
        <router-link to="/admin/tetapan"
          class="flex items-center gap-1.5 px-3 py-2 border border-violet-300 text-violet-700 text-[11px] font-bold rounded-lg hover:bg-violet-50 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Urus Acara
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loadingAcaraKhas" class="flex items-center justify-center py-16 text-gray-400">
        <div class="w-6 h-6 rounded-full border-2 border-violet-200 border-t-violet-500 animate-spin mr-2"></div>
        <span class="text-[12px]">Memuatkan...</span>
      </div>

      <!-- Senarai kosong -->
      <div v-else-if="!senaraiAcaraKhas.length" class="text-center py-16 text-gray-400">
        <svg class="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="text-[13px] font-bold">Tiada acara khas</p>
        <p class="text-[11px] mt-1">Klik "Acara Baharu" untuk mulakan.</p>
      </div>

      <!-- Grid kad acara -->
      <div v-else class="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="acara in senaraiAcaraKhas" :key="acara.id"
          class="border rounded-xl overflow-hidden cursor-pointer transition-all"
          :class="acaraKhasDipilih?.id === acara.id
            ? 'border-violet-400 ring-2 ring-violet-200 shadow-md'
            : 'border-gray-200 hover:border-violet-200 hover:shadow-sm'"
          @click="bukaAcara(acara)">

          <!-- Kad header -->
          <div class="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-[12px] font-bold text-gray-800 truncate">{{ acara.nama }}</p>
              <p v-if="acara.deskripsi" class="text-[10px] text-gray-500 truncate mt-0.5">{{ acara.deskripsi }}</p>
            </div>
            <span :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0',
              acara.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
              {{ acara.status }}
            </span>
          </div>

          <!-- Stats -->
          <div class="px-4 py-3 grid grid-cols-3 gap-2 bg-gray-50/50">
            <div class="text-center">
              <p class="text-[9px] text-gray-400 uppercase font-bold">Masuk</p>
              <p class="text-[11px] font-bold text-emerald-600 tabular-nums">RM {{ fmtRM(acara.jumlah_masuk) }}</p>
            </div>
            <div class="text-center border-x border-gray-100">
              <p class="text-[9px] text-gray-400 uppercase font-bold">Keluar</p>
              <p class="text-[11px] font-bold text-rose-600 tabular-nums">RM {{ fmtRM(acara.jumlah_keluar) }}</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] text-gray-400 uppercase font-bold">Baki</p>
              <p :class="['text-[11px] font-bold tabular-nums',
                parseFloat(acara.jumlah_masuk) - parseFloat(acara.jumlah_keluar) >= 0 ? 'text-gray-700' : 'text-rose-600']">
                RM {{ fmtRM(parseFloat(acara.jumlah_masuk) - parseFloat(acara.jumlah_keluar)) }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 py-2 text-[10px] text-gray-400">
            {{ acara.bil_transaksi }} transaksi
          </div>
        </div>
      </div>

      <!-- Penyata khas -->
      <div v-if="acaraKhasDipilih" class="border-t border-gray-100 bg-gray-50/30 px-5 py-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-[13px] font-bold text-gray-800">
              Penyata Khas — {{ acaraKhasDipilih.nama }}
            </h4>
            <p class="text-[11px] text-gray-500 mt-0.5">Semua transaksi yang ditag di bawah acara ini</p>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="penyataAcara" @click="cetakPenyataAcara"
              class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"/>
              </svg>
              Cetak Penyata
            </button>
            <button @click="acaraKhasDipilih = null; penyataAcara = null"
              class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading penyata -->
        <div v-if="loadingPenyata" class="flex items-center gap-2 text-gray-400 py-8 justify-center">
          <div class="w-5 h-5 rounded-full border-2 border-violet-200 border-t-violet-500 animate-spin"></div>
          <span class="text-[11px]">Memuatkan penyata...</span>
        </div>

        <template v-else-if="penyataAcara">
          <!-- Ringkasan KPI -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <p class="text-[9px] font-bold uppercase tracking-wider text-amber-600">Kutipan Sumbangan</p>
              <p class="text-[14px] font-black text-amber-700 tabular-nums mt-1">
                RM {{ fmtRM(penyataAcara.ringkasan.sumbangan_kasar) }}
              </p>
              <p class="text-[9px] text-amber-500 mt-0.5">{{ penyataAcara.ringkasan.bil_sumbangan }} penyumbang</p>
            </div>
            <div class="bg-sky-50 border border-sky-100 rounded-xl p-3 text-center">
              <p class="text-[9px] font-bold uppercase tracking-wider text-sky-600">Diterima dari MAKSWIP</p>
              <p class="text-[14px] font-black text-sky-700 tabular-nums mt-1">
                RM {{ fmtRM(penyataAcara.ringkasan.jumlah_diterima_makswip) }}
              </p>
              <p v-if="penyataAcara.ringkasan.bil_tuntutan === 0" class="text-[9px] text-gray-400 mt-0.5">
                Belum ada tuntutan
              </p>
            </div>
            <div class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
              <p class="text-[9px] font-bold uppercase tracking-wider text-rose-600">Perbelanjaan</p>
              <p class="text-[14px] font-black text-rose-700 tabular-nums mt-1">
                RM {{ fmtRM(penyataAcara.ringkasan.jumlah_keluar) }}
              </p>
            </div>
            <div :class="['border rounded-xl p-3 text-center',
              penyataAcara.ringkasan.baki >= 0 ? 'bg-violet-50 border-violet-100' : 'bg-orange-50 border-orange-100']">
              <p :class="['text-[9px] font-bold uppercase tracking-wider',
                penyataAcara.ringkasan.baki >= 0 ? 'text-violet-600' : 'text-orange-600']">Baki Lejar</p>
              <p :class="['text-[14px] font-black tabular-nums mt-1',
                penyataAcara.ringkasan.baki >= 0 ? 'text-violet-700' : 'text-orange-700']">
                RM {{ fmtRM(penyataAcara.ringkasan.baki) }}
              </p>
            </div>
          </div>

          <!-- Sumbangan MAKSWIP dikutip -->
          <div v-if="penyataAcara.sumbangan?.length" class="mb-5">
            <p class="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
              Kutipan Sumbangan ({{ penyataAcara.sumbangan.length }} penyumbang)
            </p>
            <div class="overflow-x-auto rounded-xl border border-amber-200 shadow-sm">
              <table class="w-full text-[11px]">
                <thead class="bg-amber-50 border-b border-amber-200">
                  <tr>
                    <th class="px-3 py-2 text-left font-bold text-amber-700 uppercase tracking-wider">Tarikh</th>
                    <th class="px-3 py-2 text-left font-bold text-amber-700 uppercase tracking-wider">Syarikat / Penyumbang</th>
                    <th class="px-3 py-2 text-left font-bold text-amber-700 uppercase tracking-wider">Pakej</th>
                    <th class="px-3 py-2 text-left font-bold text-amber-700 uppercase tracking-wider">PIC</th>
                    <th class="px-3 py-2 text-right font-bold text-amber-700 uppercase tracking-wider">Amaun (RM)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-amber-50">
                  <tr v-for="s in penyataAcara.sumbangan" :key="s.id" class="hover:bg-amber-50/40">
                    <td class="px-3 py-2 text-gray-500 font-mono">{{ s.tarikh }}</td>
                    <td class="px-3 py-2 text-gray-700 font-medium">{{ s.nama_syarikat }}</td>
                    <td class="px-3 py-2 text-gray-500">
                      <span v-if="s.nama_pakej" class="text-[10px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
                        {{ s.nama_pakej }}
                      </span>
                      <span v-else class="text-gray-400 text-[10px]">—</span>
                    </td>
                    <td class="px-3 py-2 text-gray-600 text-[10px]">{{ s.nama_pic || '—' }}</td>
                    <td class="px-3 py-2 text-right font-bold text-amber-700 tabular-nums">{{ fmtRM(s.amaun) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-amber-50 border-t border-amber-200">
                  <tr>
                    <td colspan="4" class="px-3 py-2 font-bold text-amber-700 text-right">Jumlah Dikutip</td>
                    <td class="px-3 py-2 text-right font-black text-amber-700 tabular-nums">
                      RM {{ fmtRM(penyataAcara.ringkasan.sumbangan_kasar) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Tuntutan MAKSWIP (penerimaan sebenar) -->
          <div v-if="penyataAcara.tuntutan?.length" class="mb-5">
            <p class="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
              Penerimaan dari MAKSWIP ({{ penyataAcara.tuntutan.length }} tuntutan)
            </p>
            <div class="overflow-x-auto rounded-xl border border-sky-200 shadow-sm">
              <table class="w-full text-[11px]">
                <thead class="bg-sky-50 border-b border-sky-200">
                  <tr>
                    <th class="px-3 py-2 text-left font-bold text-sky-700 uppercase tracking-wider">Tarikh Terima</th>
                    <th class="px-3 py-2 text-right font-bold text-sky-700 uppercase tracking-wider">Bersih Diterima</th>
                    <th class="px-3 py-2 text-left font-bold text-sky-700 uppercase tracking-wider">Nota</th>
                    <th class="px-3 py-2 text-center font-bold text-sky-700 uppercase tracking-wider">Dokumen</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-sky-50">
                  <tr v-for="t in penyataAcara.tuntutan" :key="t.id" class="hover:bg-sky-50/40">
                    <td class="px-3 py-2 text-gray-500 font-mono">{{ t.tarikh_tuntutan }}</td>
                    <td class="px-3 py-2 text-right font-black text-sky-700 tabular-nums">{{ fmtRM(t.jumlah_bersih) }}</td>
                    <td class="px-3 py-2 text-gray-500 text-[10px]">{{ t.nota || '—' }}</td>
                    <td class="px-3 py-2 text-center">
                      <a v-if="t.fail_dokumen" :href="apiBase + t.fail_dokumen" target="_blank"
                        class="text-[9px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                        Lihat
                      </a>
                      <span v-else class="text-[9px] text-gray-300">—</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-sky-50 border-t border-sky-200">
                  <tr>
                    <td class="px-3 py-2 font-bold text-sky-700 text-right">Jumlah Bersih Diterima</td>
                    <td class="px-3 py-2 text-right font-black text-sky-700 tabular-nums">
                      RM {{ fmtRM(penyataAcara.ringkasan.jumlah_diterima_makswip) }}
                    </td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div v-else-if="penyataAcara.sumbangan?.length" class="mb-5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p class="text-[11px] text-amber-700">
              <strong>Belum ada tuntutan MAKSWIP</strong> untuk acara ini. Kutipan dari penyumbang belum lagi dituntut daripada MAKSWIP.
            </p>
          </div>

          <!-- Jadual transaksi -->
          <div v-if="penyataAcara.transaksi.length" class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table class="w-full text-[11px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-3 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider">Tarikh</th>
                  <th class="px-3 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th class="px-3 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-3 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider">Nota / Penerima</th>
                  <th class="px-3 py-2.5 text-right font-bold text-gray-500 uppercase tracking-wider">Amaun (RM)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="t in penyataAcara.transaksi" :key="t.id" class="hover:bg-gray-50/80">
                  <td class="px-3 py-2.5 text-gray-500 font-mono">{{ t.tarikh }}</td>
                  <td class="px-3 py-2.5">
                    <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                      t.jenis_aliran === 'MASUK' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                      {{ t.jenis_aliran === 'MASUK' ? 'Masuk' : 'Keluar' }}
                    </span>
                  </td>
                  <td class="px-3 py-2.5 text-gray-600">{{ labelKat(t.kategori) }}</td>
                  <td class="px-3 py-2.5 text-gray-600 max-w-[200px] truncate">
                    {{ t.nota || t.penerima_bayaran || t.nama_ahli || '—' }}
                  </td>
                  <td :class="['px-3 py-2.5 text-right font-bold tabular-nums',
                    t.jenis_aliran === 'MASUK' ? 'text-emerald-600' : 'text-rose-600']">
                    {{ t.jenis_aliran === 'KELUAR' ? '- ' : '+ ' }}{{ fmtRM(t.amaun) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colspan="4" class="px-3 py-2.5 font-bold text-gray-700 text-right">Baki Acara</td>
                  <td :class="['px-3 py-2.5 font-black text-right tabular-nums',
                    penyataAcara.ringkasan.baki >= 0 ? 'text-violet-700' : 'text-rose-700']">
                    RM {{ fmtRM(penyataAcara.ringkasan.baki) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p v-else class="text-center text-[12px] text-gray-400 py-8">
            Tiada transaksi direkodkan untuk acara ini lagi.
          </p>
        </template>
      </div>

    </div>

    <!-- ── Full-Screen Form Modal ── -->
    <ModalBorangKewangan
      v-if="showBorang"
      :senaraiAhli="senaraiAhli"
      :senaraAcara="acaraSumbangan"
      :senaraiAcaraKhas="senaraiAcaraKhas.filter(a => a.status === 'AKTIF')"
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
  YURAN: 'Yuran Kelab (FPX)', YURAN_BA: 'Yuran Biro Angkasa', KEDAI: 'Jualan Kedai', SUMBANGAN: 'Sumbangan', ACARA: 'Bayaran Acara',
  KEBAJIKAN: 'Kebajikan', BELIAN_BARANG: 'Pembelian Barang', PERKHIDMATAN: 'Perkhidmatan',
  OPERASI: 'Kos Operasi (FPX)', 'LAIN-LAIN': 'Lain-lain', LAIN: 'Lain-lain',
  ACARA_KHAS: 'Acara Khas',
};
const labelKat = (k) => LABEL_KATEGORI[k] || k;

// Senarai unik untuk butang filter (buang alias LAIN)
const filterKategoriOps = Object.entries(LABEL_KATEGORI)
  .filter(([k]) => k !== 'LAIN')
  .map(([k, label]) => ({ val: k, label }));

// ── Tabs ──
const tabs = [
  { id: 'lejar',     label: 'Lejar Tunai',     ikon: 'M4 7h16M4 12h16M4 17h7' },
  { id: 'laporan',   label: 'Laporan Berkala',  ikon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'produk',    label: 'Produk Paling Laris', ikon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'sumbangan', label: 'Kutipan Sumbangan', ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { id: 'acara',     label: 'Acara Khas',        ikon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
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
const filterKategori   = ref('');
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

// Sumbangan MAKSWIP
const showFormSumbangan       = ref(false);
const senaraiSumbangan        = ref([]);
const acaraSumbangan          = ref([]);
const rekodSumbanganSemua     = ref([]);
const sejarahTuntutanMakswip  = ref([]);
const jumlahSumbangan         = ref(0);
const jumlahKasarSumbangan    = ref(0);
const jumlahDiterimaSumbangan = ref(0);
const jumlahBelumTuntutSumbangan = ref(0);
const loadingSumbangan        = ref(false);
const savingSumbangan         = ref(false);
const formSumbangan           = ref({ acara_khas_id: '', pakej_id: '', nama_penyumbang: '', amaun: '', tarikh: new Date().toISOString().split('T')[0], nota: '', pic_no_kp: '', pic_nama: '' });
const acaraTerbuka            = ref(new Set());

// Staff & pakej untuk form tambah sumbangan
const senaraiStaffSumb        = ref([]);
const loadingStaffSumb        = ref(false);
const senaraiPakejSumb        = ref([]);
const cariPicSumb             = ref('');
const showPicDropdownSumb     = ref(false);
const senaraiPakejEditSumb    = ref([]);
const cariPicEditSumb         = ref('');
const showPicEditDropdownSumb = ref(false);

const picDicariSumb = computed(() => {
  const q = cariPicSumb.value.toLowerCase();
  return q ? senaraiStaffSumb.value.filter(s => s.nama?.toLowerCase().includes(q) || s.no_kp?.includes(q)) : senaraiStaffSumb.value.slice(0, 10);
});
const picDicariEditSumb = computed(() => {
  const q = cariPicEditSumb.value.toLowerCase();
  return q ? senaraiStaffSumb.value.filter(s => s.nama?.toLowerCase().includes(q) || s.no_kp?.includes(q)) : senaraiStaffSumb.value.slice(0, 10);
});

const muatStaffSumb = async () => {
  if (senaraiStaffSumb.value.length) return;
  loadingStaffSumb.value = true;
  try { const { data } = await api.get('/admin/kewangan/staff'); senaraiStaffSumb.value = data.staff || []; }
  catch { /* */ } finally { loadingStaffSumb.value = false; }
};
const pilihPicSumb = (s) => { formSumbangan.value.pic_no_kp = s.no_kp; formSumbangan.value.pic_nama = s.nama; cariPicSumb.value = s.nama; showPicDropdownSumb.value = false; };
const clearPicSumb = () => { formSumbangan.value.pic_no_kp = ''; formSumbangan.value.pic_nama = ''; cariPicSumb.value = ''; };
const pilihPicEditSumb = (s) => { formEditSumbangan.value.pic_no_kp = s.no_kp; formEditSumbangan.value.pic_nama = s.nama; cariPicEditSumb.value = s.nama; showPicEditDropdownSumb.value = false; };
const clearPicEditSumb = () => { formEditSumbangan.value.pic_no_kp = ''; formEditSumbangan.value.pic_nama = ''; cariPicEditSumb.value = ''; };

watch(() => formSumbangan.value.acara_khas_id, async (id) => {
  formSumbangan.value.pakej_id = '';
  senaraiPakejSumb.value = [];
  if (!id) return;
  try { const { data } = await api.get(`/admin/kewangan/acara-khas/${id}/pakej`); senaraiPakejSumb.value = data.pakej?.filter(p => p.status === 'AKTIF') || []; }
  catch { /* */ }
});

watch(() => formEditSumbangan.value.acara_khas_id, async (id) => {
  formEditSumbangan.value.pakej_id = '';
  senaraiPakejEditSumb.value = [];
  if (!id) return;
  try { const { data } = await api.get(`/admin/kewangan/acara-khas/${id}/pakej`); senaraiPakejEditSumb.value = data.pakej?.filter(p => p.status === 'AKTIF') || []; }
  catch { /* */ }
});

// Modal Tuntutan MAKSWIP
const showModalTuntutan  = ref(false);
const savingTuntutan     = ref(false);
const formTuntutan       = ref({ acara_khas_id: '', jumlah_bersih: '', tarikh_tuntutan: '', nota: '' });
const failTuntutan       = ref(null);

const ringkasanAcaraTuntutan = computed(() => {
  const id = parseInt(formTuntutan.value.acara_khas_id);
  if (!id) return null;
  const rekod = rekodSumbanganSemua.value.filter(r => r.acara_khas_id === id);
  return { bil: rekod.length, jumlah: rekod.reduce((s, r) => s + parseFloat(r.amaun), 0) };
});

// Modal View / Edit Sumbangan
const dipilihSumbangan    = ref(null);
const showViewSumbangan   = ref(false);
const showEditSumbangan   = ref(false);
const savingEditSumbangan = ref(false);
const formEditSumbangan   = ref({ id: null, acara_khas_id: '', pakej_id: '', nama_syarikat: '', amaun: '', tarikh: '', nota: '', pic_no_kp: '', pic_nama: '' });

const acaraBelumDituntut = computed(() =>
  acaraSumbangan.value.filter(a => parseInt(a.bil_belum_dituntut) > 0)
);

// ── Acara Khas ──────────────────────────────────────────────────────
const senaraiAcaraKhas  = ref([]);
const loadingAcaraKhas  = ref(false);
const acaraKhasDipilih  = ref(null);
const penyataAcara      = ref(null);
const loadingPenyata    = ref(false);

const muatAcaraKhas = async () => {
  loadingAcaraKhas.value = true;
  try {
    const { data } = await api.get('/admin/kewangan/acara-khas');
    senaraiAcaraKhas.value = data.data || [];
  } catch { /* */ } finally { loadingAcaraKhas.value = false; }
};

const bukaAcara = async (acara) => {
  acaraKhasDipilih.value = acara;
  penyataAcara.value = null;
  loadingPenyata.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/acara-khas/${acara.id}/penyata`);
    penyataAcara.value = data;
  } catch { /* */ } finally { loadingPenyata.value = false; }
};

const fmtRM = (n) => parseFloat(n || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 });

const cetakPenyataAcara = () => {
  const d  = penyataAcara.value;
  const rk = d.ringkasan;
  const acara = acaraKhasDipilih.value;
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  // Jadual sumbangan
  const barisSumbangan = d.sumbangan?.length
    ? d.sumbangan.map((s, i) => `<tr>
        <td style="text-align:center;color:#64748b">${i + 1}</td>
        <td>${s.tarikh || '—'}</td>
        <td style="font-weight:600">${s.nama_syarikat}</td>
        <td>${s.nama_pakej ? `<span style="background:#ede9fe;color:#6d28d9;padding:1px 5px;border-radius:3px;font-size:9px;font-weight:700">${s.nama_pakej}</span>` : '—'}</td>
        <td style="color:#475569">${s.nama_pic || '—'}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#b45309">${num(s.amaun)}</td>
      </tr>`).join('')
    : `<tr><td colspan="6" style="text-align:center;color:#999;padding:12px">Tiada rekod sumbangan.</td></tr>`;

  // Jadual tuntutan MAKSWIP
  const barisTuntutan = d.tuntutan?.length
    ? d.tuntutan.map((t, i) => `<tr>
        <td style="text-align:center;color:#64748b">${i + 1}</td>
        <td>${t.tarikh_tuntutan || '—'}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0369a1">${num(t.jumlah_bersih)}</td>
        <td style="color:#475569;font-size:10px">${t.nota || '—'}</td>
      </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;color:#999;padding:12px">Tiada tuntutan MAKSWIP.</td></tr>`;

  // Jadual lejar
  const barisLejar = d.transaksi?.length
    ? d.transaksi.map((t, i) => `<tr>
        <td style="text-align:center;color:#64748b">${i + 1}</td>
        <td>${t.tarikh || '—'}</td>
        <td><span style="font-size:8px;font-weight:700;color:${t.jenis_aliran === 'MASUK' ? '#047857' : '#b91c1c'}">${t.jenis_aliran === 'MASUK' ? '▲ KREDIT' : '▼ DEBIT'}</span></td>
        <td>${labelKat(t.kategori)}</td>
        <td style="color:#475569;font-size:10px">${(t.nota || t.rujukan || '—').substring(0, 40)}</td>
        <td style="text-align:right;font-family:monospace;color:#b91c1c;font-weight:700">${t.jenis_aliran === 'KELUAR' ? num(t.amaun) : ''}</td>
        <td style="text-align:right;font-family:monospace;color:#047857;font-weight:700">${t.jenis_aliran === 'MASUK'  ? num(t.amaun) : ''}</td>
      </tr>`).join('')
    : `<tr><td colspan="7" style="text-align:center;color:#999;padding:12px">Tiada transaksi lejar.</td></tr>`;

  const badan = `
    <div style="margin-bottom:14px;font-size:11px;color:#475569">
      Tarikh Cetak: <strong>${tarikhCetak}</strong>
    </div>

    <!-- KPI ringkasan -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px">
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:8px;color:#92400e;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Kutipan Sumbangan</div>
        <div style="font-size:13px;font-weight:800;color:#b45309;font-family:monospace;margin-top:2px">${rm(rk.sumbangan_kasar)}</div>
        <div style="font-size:8px;color:#b45309;margin-top:2px">${rk.bil_sumbangan} penyumbang</div>
      </div>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:8px;color:#075985;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Diterima MAKSWIP</div>
        <div style="font-size:13px;font-weight:800;color:#0369a1;font-family:monospace;margin-top:2px">${rm(rk.jumlah_diterima_makswip)}</div>
      </div>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:8px;color:#9f1239;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Perbelanjaan</div>
        <div style="font-size:13px;font-weight:800;color:#be123c;font-family:monospace;margin-top:2px">${rm(rk.jumlah_keluar)}</div>
      </div>
      <div style="background:${rk.baki >= 0 ? '#f5f3ff' : '#fff7ed'};border:1px solid ${rk.baki >= 0 ? '#ddd6fe' : '#fed7aa'};border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:8px;color:${rk.baki >= 0 ? '#5b21b6' : '#c2410c'};font-weight:700;text-transform:uppercase;letter-spacing:.05em">Baki Lejar</div>
        <div style="font-size:13px;font-weight:800;color:${rk.baki >= 0 ? '#6d28d9' : '#ea580c'};font-family:monospace;margin-top:2px">${rm(rk.baki)}</div>
      </div>
    </div>

    ${d.sumbangan?.length ? `
    <h3 style="font-size:10px;color:#1e293b;margin:0 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">A. Kutipan Sumbangan (dari Penyumbang ke MAKSWIP)</h3>
    <table>
      <thead><tr>
        <th style="width:24px;text-align:center">#</th>
        <th>Tarikh</th><th>Syarikat / Penyumbang</th><th>Pakej</th><th>PIC</th>
        <th style="text-align:right">Amaun (RM)</th>
      </tr></thead>
      <tbody>${barisSumbangan}
        <tr style="font-weight:700;background:#fef9c3;border-top:1.5px solid #fbbf24">
          <td colspan="5" style="text-align:right">JUMLAH DIKUTIP</td>
          <td style="text-align:right;font-family:monospace">${num(rk.sumbangan_kasar)}</td>
        </tr>
      </tbody>
    </table>` : ''}

    ${d.tuntutan?.length ? `
    <h3 style="font-size:10px;color:#1e293b;margin:14px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">B. Penerimaan daripada MAKSWIP</h3>
    <table>
      <thead><tr>
        <th style="width:24px;text-align:center">#</th>
        <th>Tarikh Terima</th>
        <th style="text-align:right">Bersih Diterima (RM)</th>
        <th>Nota</th>
      </tr></thead>
      <tbody>${barisTuntutan}
        <tr style="font-weight:700;background:#e0f2fe;border-top:1.5px solid #7dd3fc">
          <td colspan="2" style="text-align:right">JUMLAH BERSIH DITERIMA</td>
          <td style="text-align:right;font-family:monospace;color:#0369a1">${num(rk.jumlah_diterima_makswip)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>` : `<p style="font-size:10px;color:#92400e;background:#fffbeb;padding:8px 12px;border-radius:4px;border:1px solid #fde68a;margin:14px 0 0">Tiada tuntutan MAKSWIP direkodkan untuk acara ini.</p>`}

    ${d.transaksi?.length ? `
    <h3 style="font-size:10px;color:#1e293b;margin:14px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">C. Transaksi Lejar</h3>
    <table>
      <thead><tr>
        <th style="width:24px;text-align:center">#</th>
        <th>Tarikh</th><th>Jenis</th><th>Kategori</th><th>Nota / Rujukan</th>
        <th style="text-align:right">Debit (–) RM</th>
        <th style="text-align:right">Kredit (+) RM</th>
      </tr></thead>
      <tbody>${barisLejar}</tbody>
    </table>` : ''}

    <div class="ringkas" style="margin-top:18px">
      <div class="r"><span>Jumlah Kutipan Sumbangan (dari penyumbang)</span><span style="color:#b45309;font-weight:700">${rm(rk.sumbangan_kasar)}</span></div>
      <div class="r"><span>Jumlah Diterima daripada MAKSWIP</span><span style="color:#0369a1;font-weight:700">${rm(rk.jumlah_diterima_makswip)}</span></div>
      <div class="r"><span>Jumlah Perbelanjaan</span><span class="neg">${rm(rk.jumlah_keluar)}</span></div>
      <div class="r akhir"><span>BAKI LEJAR ACARA</span><span style="color:${rk.baki >= 0 ? '#a78bfa' : '#fb923c'}">${rm(rk.baki)}</span></div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:10px;color:#444">
      <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
      <div style="text-align:center">________________________<br/>Disahkan oleh (Yang Dipertua)</div>
    </div>`;

  bukaCetakWindow(`Penyata Acara Khas &bull; ${acara.nama} &bull; Dicetak: ${tarikhCetak}`, badan);
};

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

const setFilterKategori = (val) => {
  filterKategori.value = val;
  halamanSemasa.value = 1;
  muatTransaksi();
};

const onTahunBertukar = async () => {
  halamanSemasa.value = 1;
  filterBulan.value = 0;
  filterKategori.value = '';
  await muatData();
  await muatTransaksi();
  if (tabAktif.value === 'sumbangan') await muatSumbangan();
  if (tabAktif.value === 'produk') await muatProdukLaris();
  if (tabAktif.value === 'acara') await muatAcaraKhas();
};

const onTransaksiBerjaya = async (jenis) => {
  showBorang.value = false;
  if (jenis === 'sumbangan') {
    await muatSumbangan();
  } else {
    await muatData();
    await muatTransaksi();
  }
};

// ── Edit & Padam Transaksi ──
const bukaEdit = (tx) => {
  editingId.value = tx.id;
  // tx.tarikh format dari DB: "DD-MM-YYYY HH:mm" — balik sekali sahaja jadi YYYY-MM-DD
  const tarikh = tx.tarikh
    ? tx.tarikh.substring(0, 10).split('-').reverse().join('-')
    : new Date().toISOString().split('T')[0];
  formEdit.value = {
    jenis_aliran:     tx.jenis_aliran,
    kategori:         tx.kategori,
    amaun:            tx.amaun,
    nota:             tx.nota || '',
    rujukan:          tx.rujukan || '',
    penerima_bayaran: tx.penerima_bayaran || tx.nama_ahli || '',
    tarikh,
  };
  showEditModal.value = true;
};

const simpanEdit = async () => {
  if (!formEdit.value.kategori || !formEdit.value.amaun || parseFloat(formEdit.value.amaun) <= 0) {
    return alert('Sila isi kategori dan amaun yang sah.');
  }
  const jenis = formEdit.value.jenis_aliran === 'MASUK' ? 'KREDIT' : 'DEBIT';
  const sahkan = confirm(
    `Sahkan kemaskini rekod ini?\n\n` +
    `Jenis   : ${jenis}\n` +
    `Kategori: ${formEdit.value.kategori}\n` +
    `Amaun   : RM ${parseFloat(formEdit.value.amaun).toFixed(2)}\n` +
    `Tarikh  : ${formEdit.value.tarikh}`
  );
  if (!sahkan) return;

  savingEdit.value = true;
  try {
    const { data } = await api.put(`/admin/kewangan/transaksi/${editingId.value}`, formEdit.value);
    if (data.success) {
      showEditModal.value = false;
      await Promise.all([muatData(), muatTransaksi()]);
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
      ...(filterBulan.value    && { bulan: filterBulan.value }),
      ...(filterJenis.value    && { jenis: filterJenis.value }),
      ...(filterKategori.value && { kategori: filterKategori.value }),
      ...(carian.value         && { cari: carian.value }),
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
    const { data } = await api.get('/admin/kewangan/sumbangan');
    if (data.success) {
      acaraSumbangan.value             = data.acara            || [];
      rekodSumbanganSemua.value        = data.rekod            || [];
      sejarahTuntutanMakswip.value     = data.sejarah_tuntutan || [];
      jumlahKasarSumbangan.value       = data.jumlah_kasar     || 0;
      jumlahDiterimaSumbangan.value    = data.jumlah_diterima  || 0;
      jumlahBelumTuntutSumbangan.value = data.jumlah_belum_tuntut || 0;
      jumlahSumbangan.value            = data.jumlah           || 0;
      senaraiSumbangan.value           = data.rekod            || [];
    }
  } catch (e) { console.error(e); }
  finally { loadingSumbangan.value = false; }
};

const rekodBagiAcara = (namaAcara) =>
  rekodSumbanganSemua.value.filter(r => r.nama_acara === namaAcara);

const togolAcara = (namaAcara) => {
  const s = new Set(acaraTerbuka.value);
  s.has(namaAcara) ? s.delete(namaAcara) : s.add(namaAcara);
  acaraTerbuka.value = s;
};

const onPilihFailTuntutan = (e) => {
  failTuntutan.value = e.target.files[0] || null;
};

const bukaModalTuntutan = () => {
  failTuntutan.value  = null;
  formTuntutan.value  = { acara_khas_id: '', jumlah_bersih: '', tarikh_tuntutan: new Date().toISOString().split('T')[0], nota: '' };
  showModalTuntutan.value = true;
};

const sahkanTuntutan = async () => {
  if (!formTuntutan.value.acara_khas_id) return alert('Sila pilih acara khas.');
  if (!formTuntutan.value.jumlah_bersih || parseFloat(formTuntutan.value.jumlah_bersih) <= 0)
    return alert('Sila masukkan jumlah bersih diterima.');
  if (!formTuntutan.value.tarikh_tuntutan) return alert('Sila pilih tarikh tuntutan.');

  savingTuntutan.value = true;
  try {
    const fd = new FormData();
    fd.append('acara_khas_id',   formTuntutan.value.acara_khas_id);
    fd.append('tarikh_tuntutan', formTuntutan.value.tarikh_tuntutan);
    fd.append('jumlah_bersih',   formTuntutan.value.jumlah_bersih);
    fd.append('nota',            formTuntutan.value.nota || '');
    if (failTuntutan.value) fd.append('fail_dokumen', failTuntutan.value);

    const { data } = await api.post('/admin/kewangan/tuntutan-makswip', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (data.success) {
      showModalTuntutan.value = false;
      alert(data.message);
      await muatSumbangan();
      await muatData();
      await muatTransaksi();
    }
  } catch (e) { alert(e.response?.data?.message || 'Ralat menyimpan tuntutan.'); }
  finally { savingTuntutan.value = false; }
};

const bukaSumbanganView = (r) => {
  dipilihSumbangan.value  = r;
  showViewSumbangan.value = true;
};

const bukaSumbanganEdit = (r) => {
  formEditSumbangan.value = {
    id:            r.id,
    acara_khas_id: r.acara_khas_id || '',
    pakej_id:      r.pakej_id || '',
    nama_syarikat: r.nama_syarikat,
    amaun:         r.amaun,
    tarikh:        r.tarikh ? r.tarikh.split('-').reverse().join('-') : '',
    nota:          r.nota || '',
    pic_no_kp:     r.pic_no_kp || '',
    pic_nama:      r.nama_pic || '',
  };
  cariPicEditSumb.value = r.nama_pic || '';
  // Muat pakej untuk acara ini jika ada
  if (r.acara_khas_id) {
    api.get(`/admin/kewangan/acara-khas/${r.acara_khas_id}/pakej`)
      .then(({ data }) => { senaraiPakejEditSumb.value = data.pakej?.filter(p => p.status === 'AKTIF') || []; })
      .catch(() => {});
  } else {
    senaraiPakejEditSumb.value = [];
  }
  showEditSumbangan.value = true;
};

const simpanEditSumbangan = async () => {
  const f = formEditSumbangan.value;
  if (!f.nama_acara?.trim() || !f.nama_syarikat?.trim() || !f.amaun || parseFloat(f.amaun) <= 0) {
    return alert('Sila lengkapkan semua medan wajib.');
  }
  savingEditSumbangan.value = true;
  try {
    const { data } = await api.put(`/admin/kewangan/sumbangan/${f.id}`, {
      nama_acara:    f.nama_acara.trim(),
      nama_syarikat: f.nama_syarikat.trim(),
      amaun:         parseFloat(f.amaun),
      tarikh:        f.tarikh || null,
      nota:          f.nota || null,
    });
    if (data.success) {
      showEditSumbangan.value = false;
      await muatSumbangan();
    }
  } catch (e) { alert(e.response?.data?.message || 'Ralat mengemaskini rekod.'); }
  finally { savingEditSumbangan.value = false; }
};

const padamRekodSumbangan = async (r) => {
  if (!confirm(`Padam sumbangan "${r.nama_syarikat}" (${fmt(r.amaun)})?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  try {
    const { data } = await api.delete(`/admin/kewangan/sumbangan/${r.id}`);
    if (data.success) await muatSumbangan();
  } catch (e) { alert(e.response?.data?.message || 'Ralat memadam rekod.'); }
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
  if (newVal === 'sumbangan' && acaraSumbangan.value.length === 0) {
    await muatSumbangan();
  }
  if (newVal === 'acara') {
    await muatAcaraKhas();
  }
});

// ── Simpan sumbangan ──
const simpanSumbangan = async () => {
  if (!formSumbangan.value.nama_penyumbang || !formSumbangan.value.amaun || parseFloat(formSumbangan.value.amaun) <= 0) {
    return alert('Sila isi nama syarikat/penyumbang dan amaun yang sah.');
  }
  if (!formSumbangan.value.nama_acara?.trim()) {
    return alert('Sila isi nama acara / event.');
  }
  savingSumbangan.value = true;
  try {
    const { data } = await api.post('/admin/kewangan/sumbangan', {
      nama_syarikat: formSumbangan.value.nama_penyumbang,
      amaun:         formSumbangan.value.amaun,
      nama_acara:    formSumbangan.value.nama_acara,
      tarikh:        formSumbangan.value.tarikh || null,
    });
    if (data.success) {
      formSumbangan.value = { nama_penyumbang: '', amaun: '', nama_acara: formSumbangan.value.nama_acara, program: '', tarikh: '' };
      await muatSumbangan();
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
    const adaTajuk = pertama.some(c => ['nama','syarikat','penyumbang','amaun','jumlah','acara','program','tarikh'].includes(c));
    const mula = adaTajuk ? 1 : 0;
    const senarai = [];
    for (let i = mula; i < baris.length; i++) {
      const k = huraiBarisCSV(baris[i]);
      const nama = k[0] || '';
      const amaun = parseFloat((k[1] || '').replace(/[^0-9.]/g, ''));
      if (!nama || !amaun) continue;
      // Format: nama_syarikat, amaun, nama_acara, tarikh
      senarai.push({ nama_syarikat: nama, nama_penyumbang: nama, amaun, nama_acara: k[2] || 'Umum', program: k[2] || null, tarikh: k[3] || null });
    }
    if (senarai.length === 0) return alert('Tiada data sah dijumpai dalam CSV.\nFormat: nama_syarikat, amaun, nama_acara, tarikh');
    if (!confirm(`${senarai.length} rekod sumbangan dikesan. Teruskan import?`)) return;
    const { data } = await api.post('/admin/kewangan/sumbangan/import', { senarai });
    if (data.success) {
      alert(data.message);
      await muatSumbangan();
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
  await Promise.all([muatSenaraiAhli(), muatData(), muatTransaksi(), muatAcaraKhas()]);
  muatBakiTerkumpul();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
