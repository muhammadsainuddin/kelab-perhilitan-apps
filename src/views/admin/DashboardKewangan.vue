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
      <!-- Debit -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Jumlah Debit<br/><span class="text-[9px] normal-case font-normal text-gray-400">Pendapatan {{ tahunPilihan }}</span></p>
          <div class="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
            </svg>
          </div>
        </div>
        <p class="text-lg font-black text-emerald-700 tabular-nums leading-none">{{ fmt(statistik.jumlah_masuk) }}</p>
        <p class="text-[9px] text-gray-400 mt-1">Yuran + Jualan + Sumbangan</p>
      </div>
      <!-- Kredit -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Jumlah Kredit<br/><span class="text-[9px] normal-case font-normal text-gray-400">Perbelanjaan {{ tahunPilihan }}</span></p>
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
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>Debit</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>Kredit</span>
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
          <option value="MASUK">▲ Debit (Masuk)</option>
          <option value="KELUAR">▼ Kredit (Keluar)</option>
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
              <th class="px-4 py-3">Sempena</th>
              <th class="px-4 py-3">Nota / Rujukan</th>
              <th class="px-4 py-3">Pihak</th>
              <th class="px-5 py-3 text-right text-rose-600">Kredit (–) RM</th>
              <th class="px-5 py-3 text-right text-emerald-600">Debit (+) RM</th>
              <th class="px-4 py-3">Direkod Oleh</th>
              <th class="px-4 py-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="transaksiLoading">
              <td colspan="9" class="px-5 py-10 text-center">
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
              <td colspan="9" class="px-5 py-14 text-center text-gray-400 text-xs">Tiada rekod transaksi dijumpai.</td>
            </tr>
            <tr v-for="tx in transaksi" :key="tx.id" class="hover:bg-gray-50/70 transition-colors group">
              <td class="px-5 py-2.5 text-gray-600 whitespace-nowrap font-mono text-[11px]">{{ tx.tarikh }}</td>
              <td class="px-4 py-2.5">
                <span :class="['inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider',
                  tx.jenis_aliran === 'MASUK'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200']">
                  {{ tx.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT' }}
                </span>
              </td>
              <td class="px-4 py-2.5">
                <span class="text-[10px] bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded font-semibold">{{ labelKat(tx.kategori) }}</span>
              </td>
              <td class="px-4 py-2.5">
                <span v-if="tx.nama_acara_khas"
                  class="text-[9px] bg-violet-100 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                  {{ tx.nama_acara_khas }}
                </span>
                <span v-else class="text-[10px] text-gray-300">—</span>
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
              <td class="px-4 py-2.5">
                <span v-if="tx.nama_direkod_oleh" class="text-[11px] text-gray-700">{{ tx.nama_direkod_oleh }}</span>
                <span v-else class="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">AUTO</span>
              </td>
              <td class="px-4 py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="txDetail = tx" title="Lihat details"
                    class="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <template v-if="tx.direkod_oleh">
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
                  </template>
                  <span v-else class="text-[9px] text-gray-400 font-medium">AUTO</span>
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

      <!-- ── Laporan Mengikut Kategori ── -->
      <div class="mt-5 border border-gray-200 rounded-xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
          <div class="w-7 h-7 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
            </svg>
          </div>
          <div>
            <h4 class="text-xs font-bold text-gray-800">Laporan Mengikut Kategori</h4>
            <p class="text-[10px] text-gray-500">Filter mengikut tarikh, kategori, acara &amp; jenis aliran</p>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="px-5 py-4 bg-white">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dari</label>
              <input v-model="filtKat.dari" type="date"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400"/>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hingga</label>
              <input v-model="filtKat.hingga" type="date"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400"/>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
              <select v-model="filtKat.kategori"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400">
                <option value="">Semua Kategori</option>
                <option v-for="k in senaraiKategoriKewangan.filter(c => c.aktif)" :key="k.kod" :value="k.kod">{{ k.nama }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Acara</label>
              <select v-model="filtKat.acara_khas_id"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400">
                <option value="">Semua Acara</option>
                <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Jenis</label>
              <select v-model="filtKat.jenis"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400">
                <option value="">Masuk &amp; Keluar</option>
                <option value="MASUK">Debit (Masuk) sahaja</option>
                <option value="KELUAR">Kredit (Keluar) sahaja</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <button @click="muatLaporanKategori" :disabled="loadingLaporanKat"
              class="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
              <span v-if="loadingLaporanKat" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
              Lihat Ringkasan
            </button>
            <button v-if="dataLaporanKat" @click="cetakLaporanKategori"
              class="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-800 text-white font-bold text-[11px] px-4 py-2 rounded-lg transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/>
              </svg>
              Cetak
            </button>
            <button v-if="dataLaporanKat" @click="dataLaporanKat = null"
              class="text-[11px] text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Kosongkan
            </button>
          </div>
        </div>

        <!-- Hasil -->
        <div v-if="loadingLaporanKat" class="flex items-center gap-2 justify-center py-10 text-gray-400">
          <div class="w-5 h-5 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin"></div>
          <span class="text-[11px]">Memuatkan...</span>
        </div>

        <template v-else-if="dataLaporanKat">
          <div class="border-t border-gray-100 px-5 py-4 bg-white space-y-5">
            <!-- KPI -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Jumlah Debit (Masuk)</p>
                <p class="text-[15px] font-black text-emerald-700 tabular-nums mt-1">RM {{ fmtRM(dataLaporanKat.ringkasan.masuk) }}</p>
              </div>
              <div class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
                <p class="text-[9px] font-bold uppercase tracking-wider text-rose-600">Jumlah Kredit (Keluar)</p>
                <p class="text-[15px] font-black text-rose-700 tabular-nums mt-1">RM {{ fmtRM(dataLaporanKat.ringkasan.keluar) }}</p>
              </div>
              <div :class="['border rounded-xl p-3 text-center', dataLaporanKat.ringkasan.lebihan >= 0 ? 'bg-violet-50 border-violet-100' : 'bg-orange-50 border-orange-100']">
                <p :class="['text-[9px] font-bold uppercase tracking-wider', dataLaporanKat.ringkasan.lebihan >= 0 ? 'text-violet-600' : 'text-orange-600']">Lebihan / Kurangan</p>
                <p :class="['text-[15px] font-black tabular-nums mt-1', dataLaporanKat.ringkasan.lebihan >= 0 ? 'text-violet-700' : 'text-orange-700']">
                  RM {{ fmtRM(dataLaporanKat.ringkasan.lebihan) }}
                </p>
              </div>
            </div>

            <!-- Pecahan kategori -->
            <div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pecahan Mengikut Kategori</p>
              <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="w-full text-[11px]">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-4 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider text-[9px]">Kategori</th>
                      <th class="px-4 py-2.5 text-right font-bold text-emerald-600 uppercase tracking-wider text-[9px]">Debit (+) RM</th>
                      <th class="px-4 py-2.5 text-right font-bold text-rose-600 uppercase tracking-wider text-[9px]">Kredit (−) RM</th>
                      <th class="px-4 py-2.5 text-right font-bold text-gray-600 uppercase tracking-wider text-[9px]">Lebihan RM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="[kod, v] in Object.entries(dataLaporanKat.by_kategori).sort(([,a],[,b])=>(b.masuk+b.keluar)-(a.masuk+a.keluar))" :key="kod"
                      class="hover:bg-gray-50/80">
                      <td class="px-4 py-2.5 font-medium text-gray-700">{{ labelKat(kod) }}</td>
                      <td class="px-4 py-2.5 text-right tabular-nums" :class="v.masuk > 0 ? 'text-emerald-600 font-semibold' : 'text-gray-300'">
                        {{ v.masuk > 0 ? fmtRM(v.masuk) : '—' }}
                      </td>
                      <td class="px-4 py-2.5 text-right tabular-nums" :class="v.keluar > 0 ? 'text-rose-600 font-semibold' : 'text-gray-300'">
                        {{ v.keluar > 0 ? fmtRM(v.keluar) : '—' }}
                      </td>
                      <td class="px-4 py-2.5 text-right tabular-nums font-bold" :class="(v.masuk - v.keluar) >= 0 ? 'text-gray-700' : 'text-rose-600'">
                        {{ fmtRM(v.masuk - v.keluar) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td class="px-4 py-2.5 font-bold text-gray-700">JUMLAH ({{ dataLaporanKat.ringkasan.bil }} transaksi)</td>
                      <td class="px-4 py-2.5 text-right font-black text-emerald-700 tabular-nums">{{ fmtRM(dataLaporanKat.ringkasan.masuk) }}</td>
                      <td class="px-4 py-2.5 text-right font-black text-rose-700 tabular-nums">{{ fmtRM(dataLaporanKat.ringkasan.keluar) }}</td>
                      <td class="px-4 py-2.5 text-right font-black tabular-nums" :class="dataLaporanKat.ringkasan.lebihan >= 0 ? 'text-violet-700' : 'text-orange-600'">
                        {{ fmtRM(dataLaporanKat.ringkasan.lebihan) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Senarai transaksi -->
            <div v-if="dataLaporanKat.data.length">
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Senarai Transaksi ({{ dataLaporanKat.data.length }})
              </p>
              <div class="overflow-x-auto rounded-xl border border-gray-200 max-h-80 overflow-y-auto">
                <table class="w-full text-[11px]">
                  <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th class="px-3 py-2 text-left font-bold text-gray-500 uppercase tracking-wider text-[9px]">Tarikh</th>
                      <th class="px-3 py-2 text-left font-bold text-gray-500 uppercase tracking-wider text-[9px]">Jenis</th>
                      <th class="px-3 py-2 text-left font-bold text-gray-500 uppercase tracking-wider text-[9px]">Kategori</th>
                      <th class="px-3 py-2 text-left font-bold text-gray-500 uppercase tracking-wider text-[9px]">Nota / Penerima</th>
                      <th class="px-3 py-2 text-right font-bold text-gray-500 uppercase tracking-wider text-[9px]">Amaun RM</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="t in dataLaporanKat.data" :key="t.id" class="hover:bg-gray-50/80">
                      <td class="px-3 py-2 text-gray-500 font-mono">{{ t.tarikh }}</td>
                      <td class="px-3 py-2">
                        <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold', t.jenis_aliran==='MASUK'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700']">
                          {{ t.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT' }}
                        </span>
                      </td>
                      <td class="px-3 py-2 text-gray-600">{{ labelKat(t.kategori) }}</td>
                      <td class="px-3 py-2 text-gray-500 max-w-[180px] truncate">{{ t.nota || t.penerima_bayaran || t.nama_ahli || '—' }}</td>
                      <td :class="['px-3 py-2 text-right font-bold tabular-nums', t.jenis_aliran==='MASUK'?'text-emerald-600':'text-rose-600']">
                        {{ t.jenis_aliran === 'KELUAR' ? '- ' : '+ ' }}{{ fmtRM(t.amaun) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p v-else class="text-center text-[11px] text-gray-400 py-4">Tiada transaksi ditemui untuk penapis yang dipilih.</p>
          </div>
        </template>
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
      <div v-if="showFormSumbangan" class="px-5 py-4 border-b border-gray-100 bg-gray-50/60 space-y-2">
        <!-- Baris 1: Acara, Pakej, Syarikat, Amaun, Tarikh -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Acara Khas <span class="text-red-500">*</span></label>
            <select v-model="formSumbangan.acara_khas_id"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500">
              <option value="">— Pilih Acara —</option>
              <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pakej</label>
            <select v-model="formSumbangan.pakej_id" :disabled="!formSumbangan.acara_khas_id || !senaraiPakejSumb.length"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 disabled:bg-gray-50 disabled:text-gray-400">
              <option value="">— Pilih Pakej —</option>
              <option v-for="p in senaraiPakejSumb" :key="p.id" :value="p.id">{{ p.nama }}</option>
            </select>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Syarikat / Penyumbang <span class="text-red-500">*</span></label>
            <input v-model="formSumbangan.nama_penyumbang" type="text" placeholder="Nama syarikat atau individu"
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
        </div>
        <!-- Baris 2: PIC, Nota, Butang -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
          <div class="sm:col-span-4 relative">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PIC (Pegawai Bertanggungjawab)</label>
            <div class="flex gap-1">
              <input v-model="cariPicSumb" type="text" placeholder="Cari nama atau no. K/P..."
                @focus="showPicDropdownSumb = true" @blur="setTimeout(() => showPicDropdownSumb = false, 150)"
                class="flex-1 bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
              <button v-if="formSumbangan.pic_no_kp" @click="clearPicSumb"
                class="px-2 text-gray-400 hover:text-rose-500 border border-gray-200 rounded-lg text-xs">✕</button>
            </div>
            <div v-if="showPicDropdownSumb && picDicariSumb.length"
              class="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-0.5 max-h-32 overflow-y-auto">
              <div v-for="s in picDicariSumb" :key="s.no_kp"
                @mousedown.prevent="pilihPicSumb(s)"
                class="px-3 py-1.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0">
                <span class="font-semibold text-gray-800">{{ s.nama }}</span>
                <span class="text-gray-400 ml-2 font-mono text-[10px]">{{ s.no_kp }}</span>
              </div>
            </div>
          </div>
          <div class="sm:col-span-5">
            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nota</label>
            <input v-model="formSumbangan.nota" type="text" placeholder="(Pilihan)"
              class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
          </div>
          <div class="sm:col-span-3">
            <button @click="simpanSumbangan" :disabled="savingSumbangan"
              class="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2 py-2 text-xs font-bold disabled:opacity-60 transition-colors">
              <span v-if="savingSumbangan" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
              <span>{{ savingSumbangan ? 'Menyimpan...' : 'Rekod Sumbangan' }}</span>
            </button>
          </div>
        </div>
        <p class="text-[10px] text-gray-400">
          Import CSV: <code class="bg-gray-200 px-1 rounded">nama_syarikat, amaun, nama_acara, tarikh</code>. Tarikh: YYYY-MM-DD.
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
              <th class="px-4 py-3">Direkod Oleh</th>
              <th class="px-4 py-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loadingSumbangan">
              <td colspan="8" class="px-5 py-10 text-center text-gray-400 text-xs">Memuatkan...</td>
            </tr>
            <tr v-else-if="rekodSumbanganSemua.length === 0">
              <td colspan="8" class="px-5 py-14 text-center text-gray-400 text-xs">
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
              <td class="px-4 py-2.5 text-[11px] text-gray-700">{{ r.nama_direkod_oleh || r.direkod_oleh || '—' }}</td>
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
              <td colspan="7" class="px-5 py-2.5 text-[10px] font-bold text-gray-500 uppercase">
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
              <th class="px-4 py-2">Direkod Oleh</th>
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
              <td class="px-4 py-2.5 text-[11px] text-gray-700">{{ t.nama_direkod_oleh || t.direkod_oleh || '—' }}</td>
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
                  <p class="font-bold text-gray-800 text-sm mt-0.5">{{ dipilihSumbangan.nama_acara_khas || dipilihSumbangan.nama_acara }}</p>
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
                <div class="bg-gray-50 rounded-xl px-4 py-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pakej</p>
                  <p class="text-gray-700 text-xs mt-0.5">
                    <span v-if="dipilihSumbangan.nama_pakej" class="text-[10px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">{{ dipilihSumbangan.nama_pakej }}</span>
                    <span v-else class="text-gray-400">—</span>
                  </p>
                </div>
                <div class="bg-gray-50 rounded-xl px-4 py-3">
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">PIC</p>
                  <p class="text-gray-700 text-xs mt-0.5">{{ dipilihSumbangan.nama_pic || '—' }}</p>
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
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Acara Khas <span class="text-red-500">*</span></label>
                  <select v-model="formEditSumbangan.acara_khas_id"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500">
                    <option value="">— Pilih Acara —</option>
                    <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pakej</label>
                  <select v-model="formEditSumbangan.pakej_id" :disabled="!senaraiPakejEditSumb.length"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">— Pilih Pakej —</option>
                    <option v-for="p in senaraiPakejEditSumb" :key="p.id" :value="p.id">{{ p.nama }}</option>
                  </select>
                </div>
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
              <div class="relative">
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">PIC</label>
                <div class="flex gap-1">
                  <input v-model="cariPicEditSumb" type="text" placeholder="Cari nama atau no. K/P..."
                    @focus="showPicEditDropdownSumb = true" @blur="setTimeout(() => showPicEditDropdownSumb = false, 150)"
                    class="flex-1 bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"/>
                  <button v-if="formEditSumbangan.pic_no_kp" @click="clearPicEditSumb"
                    class="px-2 text-gray-400 hover:text-rose-500 border border-gray-200 rounded-lg text-xs">✕</button>
                </div>
                <div v-if="showPicEditDropdownSumb && picDicariEditSumb.length"
                  class="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-0.5 max-h-32 overflow-y-auto">
                  <div v-for="s in picDicariEditSumb" :key="s.no_kp"
                    @mousedown.prevent="pilihPicEditSumb(s)"
                    class="px-3 py-1.5 text-xs hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0">
                    <span class="font-semibold text-gray-800">{{ s.nama }}</span>
                    <span class="text-gray-400 ml-2 font-mono text-[10px]">{{ s.no_kp }}</span>
                  </div>
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
                    <option value="MASUK">▲ DEBIT (Masuk)</option>
                    <option value="KELUAR">▼ KREDIT (Keluar)</option>
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
                    <option v-if="senaraiKategoriKewangan.length" value="" disabled>-- Pilih kategori --</option>
                    <template v-if="senaraiKategoriKewangan.length">
                      <option v-for="k in senaraiKategoriKewangan.filter(c => c.aktif)" :key="k.kod" :value="k.kod">{{ k.nama }}</option>
                    </template>
                    <template v-else>
                      <option v-for="(label, key) in LABEL_KATEGORI_FALLBACK" :key="key" :value="key">{{ label }}</option>
                    </template>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amaun (RM) *</label>
                  <input v-model="formEdit.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
                </div>
              </div>

              <!-- Sempena -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Sempena</label>
                <select v-model="formEdit.acara_khas_id"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]">
                  <option :value="null">{{ formEdit.jenis_aliran === 'MASUK' ? 'Pendapatan Biasa' : 'Perbelanjaan Biasa' }}</option>
                  <option v-for="a in senaraiAcaraKhas" :key="a.id" :value="a.id">{{ a.nama }}</option>
                </select>
              </div>

              <!-- Pihak -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {{ formEdit.jenis_aliran === 'MASUK' ? 'Diterima Daripada' : 'Nama Pihak / Penerima' }}
                </label>
                <template v-if="formEdit.jenis_aliran === 'MASUK'">
                  <div class="flex gap-4 py-1">
                    <label class="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 cursor-pointer">
                      <input type="radio" :value="false" v-model="editMasukDariAhli" class="accent-[#0F4C3A]" />
                      Nama Bebas
                    </label>
                    <label class="flex items-center gap-1.5 text-[11px] font-medium text-gray-700 cursor-pointer">
                      <input type="radio" :value="true" v-model="editMasukDariAhli" class="accent-[#0F4C3A]" />
                      Ahli Kelab
                    </label>
                  </div>
                  <select v-if="editMasukDariAhli" v-model="formEdit.no_kp_pihak"
                    class="w-full bg-gray-50 border border-emerald-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500">
                    <option value="" disabled>-- Pilih ahli --</option>
                    <option v-for="a in senaraiAhli" :key="a.no_kp" :value="a.no_kp">
                      {{ a.nama_pegawai }} ({{ a.no_kp }})
                    </option>
                  </select>
                  <input v-else v-model="formEdit.penerima_bayaran" type="text"
                    placeholder="Nama pembayar (kosongkan jika kolektif)"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A]"/>
                </template>
                <input v-else v-model="formEdit.penerima_bayaran" type="text"
                  placeholder="Nama individu atau syarikat"
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

              <!-- Dokumen Sokongan -->
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Dokumen Sokongan</label>

                <!-- Fail sedia ada -->
                <div v-if="failEditSediaAda.length" class="space-y-1.5 mb-2">
                  <div v-for="(fp, i) in failEditSediaAda" :key="i"
                    :class="['flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors',
                      failEditPadam.includes(fp) ? 'bg-rose-50 border-rose-300 opacity-60' : 'bg-gray-50 border-gray-200']">
                    <!-- Thumbnail / ikon -->
                    <div class="w-7 h-7 rounded overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                      <img v-if="/\.(webp|jpg|jpeg|png|gif)$/i.test(fp)" :src="apiBase + fp"
                        class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
                      <svg v-else class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5H7zm5 1l4 4h-4V4zM9 13h6v1H9v-1zm0 3h4v1H9v-1z"/>
                      </svg>
                    </div>
                    <span class="flex-1 text-[10px] text-gray-600 truncate">{{ fp.split('/').pop() }}</span>
                    <!-- Lihat -->
                    <a :href="apiBase + fp" target="_blank"
                      class="text-[9px] font-bold text-blue-600 hover:text-blue-800 px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">
                      Lihat
                    </a>
                    <!-- Tanda padam / batal -->
                    <button type="button" @click="tandaPadam(fp)"
                      :class="['text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors shrink-0',
                        failEditPadam.includes(fp)
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100']">
                      {{ failEditPadam.includes(fp) ? 'Batal' : 'Padam' }}
                    </button>
                  </div>
                </div>

                <!-- Fail baru dipilih -->
                <div v-if="failEditBaru.length" class="space-y-1.5 mb-2">
                  <div v-for="(e, i) in failEditBaru" :key="i"
                    class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <div class="w-7 h-7 rounded overflow-hidden bg-white shrink-0 flex items-center justify-center border border-emerald-200">
                      <img v-if="e.preview" :src="e.preview" class="w-full h-full object-cover" />
                      <svg v-else class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5H7zm5 1l4 4h-4V4zM9 13h6v1H9v-1zm0 3h4v1H9v-1z"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[10px] font-semibold text-emerald-800 truncate">{{ e.fail.name }}</p>
                      <p class="text-[9px] text-emerald-600">{{ (e.fail.size / 1024).toFixed(0) }} KB · Baru</p>
                    </div>
                    <button type="button" @click="buangFailEdit(i)"
                      class="text-emerald-600 hover:text-rose-500 transition-colors shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Drop zone tambah fail -->
                <div @click="$refs.inputFailEdit.click()" @dragover.prevent
                  @drop.prevent="tambahFailEdit($event.dataTransfer.files)"
                  class="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <p class="text-[10px] text-gray-500"><span class="font-semibold text-gray-700">Tambah fail</span> — gambar atau PDF (maks 5)</p>
                  <input ref="inputFailEdit" type="file" multiple accept=".jpg,.jpeg,.jfif,.png,.webp,.pdf"
                    class="hidden" @change="tambahFailEdit($event.target.files)" />
                </div>
                <p v-if="ralatFailEdit" class="mt-1 text-[10px] text-rose-600 font-medium">{{ ralatFailEdit }}</p>
              </div>
            </div>

            <!-- Sejarah Edit -->
            <div v-if="loadingLog || logEdit.length" class="border-t border-gray-100 px-6 py-4 bg-gray-50/40">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Sejarah Kemaskini</p>

              <div v-if="loadingLog" class="flex items-center gap-2 text-gray-400">
                <div class="w-3 h-3 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin"></div>
                <span class="text-[11px]">Memuatkan...</span>
              </div>

              <div v-else class="space-y-3">
                <div v-for="log in logEdit" :key="log.id" class="bg-white border border-gray-200 rounded-xl p-3">
                  <!-- Header log -->
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <svg class="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                      </div>
                      <span class="text-[11px] font-bold text-gray-800">{{ log.nama_editor || log.diedit_oleh || '—' }}</span>
                    </div>
                    <span class="text-[10px] text-gray-400 font-mono">{{ new Date(log.tarikh_edit).toLocaleString('ms-MY', { dateStyle: 'short', timeStyle: 'short' }) }}</span>
                  </div>

                  <!-- Perubahan -->
                  <div class="space-y-1">
                    <template v-for="(nilaiSelepas, kunci) in (typeof log.selepas === 'string' ? JSON.parse(log.selepas) : log.selepas)" :key="kunci">
                      <div v-if="(typeof log.sebelum === 'string' ? JSON.parse(log.sebelum) : log.sebelum)[kunci] != nilaiSelepas"
                        class="flex items-start gap-2 text-[10px]">
                        <span class="text-gray-400 w-24 shrink-0 capitalize">{{ kunci.replace('_', ' ') }}</span>
                        <span class="text-rose-600 line-through truncate max-w-[100px]">{{ (typeof log.sebelum === 'string' ? JSON.parse(log.sebelum) : log.sebelum)[kunci] ?? '—' }}</span>
                        <svg class="w-2.5 h-2.5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span class="text-emerald-700 font-semibold truncate max-w-[100px]">{{ nilaiSelepas ?? '—' }}</span>
                      </div>
                    </template>
                  </div>
                </div>
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
            <button v-if="penyataAcara" @click="cetakLaporanPerbelanjaanAcara"
              class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
              </svg>
              Laporan Perbelanjaan
            </button>
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

          <!-- Filter transaksi acara -->
          <div v-if="penyataAcara.transaksi.length" class="mb-3 flex flex-wrap items-end gap-2">
            <div class="flex-1 min-w-[130px]">
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
              <select v-model="filtAcara.kategori"
                class="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-violet-400">
                <option value="">Semua Kategori</option>
                <option v-for="k in kategoriDalamAcara" :key="k.kod" :value="k.kod">{{ k.nama }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Dari</label>
              <input v-model="filtAcara.tarikhMula" type="date"
                class="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-violet-400"/>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hingga</label>
              <input v-model="filtAcara.tarikhAkhir" type="date"
                class="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-violet-400"/>
            </div>
            <button v-if="filtAcara.kategori || filtAcara.tarikhMula || filtAcara.tarikhAkhir"
              @click="filtAcara = { kategori: '', tarikhMula: '', tarikhAkhir: '' }"
              class="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Reset
            </button>
            <!-- Mini KPI apabila filter aktif -->
            <div v-if="filtAcara.kategori || filtAcara.tarikhMula || filtAcara.tarikhAkhir"
              class="ml-auto flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <span class="text-[10px] text-gray-500">{{ transaksiAcaraFiltered.length }} rekod</span>
              <span class="text-[10px] font-bold text-emerald-600 tabular-nums">+RM {{ fmtRM(filtAcaraRingkasan.masuk) }}</span>
              <span class="text-[10px] font-bold text-rose-600 tabular-nums">−RM {{ fmtRM(filtAcaraRingkasan.keluar) }}</span>
              <span class="text-[10px] font-bold tabular-nums" :class="filtAcaraRingkasan.baki >= 0 ? 'text-violet-600' : 'text-orange-600'">
                = RM {{ fmtRM(filtAcaraRingkasan.baki) }}
              </span>
            </div>
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
                <tr v-for="t in transaksiAcaraFiltered" :key="t.id" class="hover:bg-gray-50/80">
                  <td class="px-3 py-2.5 text-gray-500 font-mono">{{ t.tarikh }}</td>
                  <td class="px-3 py-2.5">
                    <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                      t.jenis_aliran === 'MASUK' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                      {{ t.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT' }}
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
                <tr v-if="!transaksiAcaraFiltered.length">
                  <td colspan="5" class="px-3 py-6 text-center text-[11px] text-gray-400">
                    Tiada transaksi sepadan dengan penapis yang dipilih.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colspan="4" class="px-3 py-2.5 font-bold text-gray-700 text-right">
                    {{ filtAcara.kategori || filtAcara.tarikhMula || filtAcara.tarikhAkhir ? 'Baki (Ditapis)' : 'Baki Acara' }}
                  </td>
                  <td :class="['px-3 py-2.5 font-black text-right tabular-nums',
                    filtAcaraRingkasan.baki >= 0 ? 'text-violet-700' : 'text-rose-700']">
                    RM {{ fmtRM(filtAcaraRingkasan.baki) }}
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

    <!-- ==================== PDF VIEWER ==================== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="pdfPratontonUrl"
          class="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex flex-col"
          @click.self="tutupPreviewPdf">
          <div class="flex items-center justify-between px-4 py-3 shrink-0">
            <div class="flex items-center gap-2 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-[12px] font-bold">Dokumen PDF</span>
            </div>
            <div class="flex items-center gap-2">
              <a :href="pdfPratontonUrl" download
                class="text-[11px] font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Muat turun
              </a>
              <button @click="tutupPreviewPdf"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
            <div v-if="pdfMuatLoading && !pdfMuatRalat"
              class="flex flex-col items-center justify-center gap-3 text-white/60 py-20">
              <div class="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              <p class="text-[12px]">Memuatkan PDF...</p>
            </div>
            <div v-if="pdfMuatRalat" class="flex flex-col items-center gap-3 text-white/60 py-20">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
              <p class="text-[13px] font-bold text-white">Gagal memuatkan PDF</p>
            </div>
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

    <!-- ==================== IMAGE LIGHTBOX ==================== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="imgPratontonUrl"
          class="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col"
          @click.self="imgPratontonUrl = null">
          <div class="flex items-center justify-end px-4 py-3 shrink-0">
            <button @click="imgPratontonUrl = null"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-auto flex items-center justify-center px-4 pb-6">
            <img :src="imgPratontonUrl" alt="Pratonton gambar"
              class="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL DETAIL TRANSAKSI ═══ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="txDetail" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background:rgba(0,0,0,0.55);backdrop-filter:blur(4px)"
          @click.self="txDetail = null">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            <!-- Header -->
            <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span :class="['inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider',
                    txDetail.jenis_aliran === 'MASUK'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200']">
                    {{ txDetail.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT' }}
                  </span>
                  <span class="text-[10px] bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded font-semibold">
                    {{ labelKat(txDetail.kategori) }}
                  </span>
                  <span v-if="txDetail.nama_acara_khas"
                    class="text-[9px] bg-violet-100 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded font-bold">
                    {{ txDetail.nama_acara_khas }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-400 font-mono">Rekod #{{ txDetail.id }} &bull; {{ txDetail.tarikh }}</p>
              </div>
              <button @click="txDetail = null"
                class="ml-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Scroll body -->
            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              <!-- Amaun hero -->
              <div :class="['text-center py-4 rounded-xl', txDetail.jenis_aliran==='MASUK' ? 'bg-emerald-50' : 'bg-rose-50']">
                <p class="text-[10px] font-bold uppercase tracking-wider mb-1"
                  :class="txDetail.jenis_aliran==='MASUK' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ txDetail.jenis_aliran === 'MASUK' ? 'Jumlah Diterima' : 'Jumlah Dibayar' }}
                </p>
                <p :class="['text-3xl font-black tabular-nums', txDetail.jenis_aliran==='MASUK' ? 'text-emerald-700' : 'text-rose-700']">
                  RM {{ num(txDetail.amaun) }}
                </p>
              </div>

              <!-- Fields -->
              <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                <div v-if="txDetail.nota" class="col-span-2">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nota / Keterangan</p>
                  <p class="text-xs text-gray-800 font-semibold leading-relaxed">{{ txDetail.nota }}</p>
                </div>
                <div v-if="txDetail.rujukan">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">No. Rujukan</p>
                  <p class="text-xs text-gray-700 font-mono break-all">{{ txDetail.rujukan }}</p>
                </div>
                <div v-if="txDetail.nama_ahli || txDetail.penerima_bayaran">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pihak Berkaitan</p>
                  <p class="text-xs text-gray-700">{{ txDetail.nama_ahli || txDetail.penerima_bayaran }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Direkod Oleh</p>
                  <p class="text-xs text-gray-700">
                    <span v-if="txDetail.nama_direkod_oleh">{{ txDetail.nama_direkod_oleh }}</span>
                    <span v-else class="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">SISTEM / AUTO</span>
                  </p>
                </div>
              </div>

              <!-- Dokumen / Resit -->
              <div>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  Dokumen / Resit
                  <span v-if="failDokumenDetail.length" class="bg-[#0F4C3A]/10 text-[#0F4C3A] text-[9px] font-bold px-1.5 py-0.5 rounded-full">{{ failDokumenDetail.length }}</span>
                </p>

                <div v-if="failDokumenDetail.length" class="space-y-2">
                  <template v-for="(fp, i) in failDokumenDetail" :key="fp">
                    <!-- Gambar — papar inline, klik untuk besarkan -->
                    <div v-if="isGambar(fp)" class="rounded-xl overflow-hidden border border-gray-200">
                      <button type="button" class="w-full block group relative" @click="imgPratontonUrl = apiBase + fp">
                        <img :src="apiBase + fp" :alt="`Dokumen ${i + 1}`"
                          class="w-full max-h-48 object-contain bg-gray-50 group-hover:opacity-90 transition-opacity" />
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          <div class="bg-white/90 rounded-full p-1.5 shadow">
                            <svg class="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div class="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span class="text-[10px] text-gray-500">Gambar {{ i + 1 }}</span>
                        <button type="button" @click="imgPratontonUrl = apiBase + fp"
                          class="text-[10px] font-bold text-blue-600 hover:text-blue-800">Besarkan ↗</button>
                      </div>
                    </div>
                    <!-- PDF — buka inline viewer -->
                    <button v-else type="button"
                      @click="bukaPreviewPdf(apiBase + fp)"
                      class="w-full flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-3 py-2.5 rounded-xl hover:bg-red-100 transition-colors text-left">
                      <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/>
                      </svg>
                      <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-bold truncate">{{ fp.split('/').pop() }}</p>
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
                  Tiada dokumen atau resit dilampirkan.
                </p>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';
import ModalBorangKewangan from '../../components/kewangan/ModalBorangKewangan.vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useToast } from '../../composables/useToast';

Chart.register(...registerables);

const toast = useToast();
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

// Kategori kewangan dari API
const senaraiKategoriKewangan = ref([]);
const LABEL_KATEGORI_FALLBACK = {
  YURAN: 'Yuran Keahlian', YURAN_FPX: 'Yuran Kelab (FPX)',
  KEDAI: 'Jualan Kedai', ACARA: 'Bayaran Penyertaan Acara',
  SUMBANGAN_AHLI: 'Sumbangan Ahli', KEBAJIKAN: 'Bantuan Kebajikan Ahli',
  TIKET_KAPALTERBANG: 'Tiket Kapal Terbang', SEWAAN_KENDERAAN: 'Sewaan Kenderaan',
  TOKEN_MAKAN: 'Token Makan', TOKEN_PENGANGKUTAN: 'Token Pengangkutan',
  LATIHAN_PASUKAN: 'Latihan Pasukan', PERALATAN_SUKAN: 'Peralatan Sukan',
  PERUBATAN: 'Perubatan', PENGINAPAN: 'Penginapan', PERCETAKAN: 'Percetakan',
  KOS_OPERASI_FPX: 'Kos Operasi (FPX)', 'LAIN-LAIN': 'Lain-lain',
  // Kod lama (backward compat)
  BELI_TIKET: 'Beli Tiket', BELI_MAKANAN: 'Beli Makanan', BELI_BARANG: 'Beli Barang',
  BAYAR_PERKHIDMATAN: 'Bayar Perkhidmatan', OPERASI: 'Kos Operasi',
  BELIAN_BARANG: 'Pembelian Barang', PERKHIDMATAN: 'Perkhidmatan',
  ACARA_KHAS: 'Acara Khas', LAIN: 'Lain-lain',
};
const labelKat = (k) =>
  senaraiKategoriKewangan.value.find(c => c.kod === k)?.nama || LABEL_KATEGORI_FALLBACK[k] || k;

// Pilihan filter — semua kategori aktif
const filterKategoriOps = computed(() => {
  if (senaraiKategoriKewangan.value.length) {
    return senaraiKategoriKewangan.value
      .filter(k => k.aktif)
      .map(k => ({ val: k.kod, label: k.nama }));
  }
  return Object.entries(LABEL_KATEGORI_FALLBACK)
    .filter(([k]) => k !== 'LAIN')
    .map(([k, label]) => ({ val: k, label }));
});

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

// Filter laporan kategori (Laporan Berkala tab)
const today = new Date().toISOString().split('T')[0];
const firstOfMonth = today.substring(0, 8) + '01';
const filtKat = ref({ dari: firstOfMonth, hingga: today, kategori: '', acara_khas_id: '', jenis: '' });
const loadingLaporanKat = ref(false);
const dataLaporanKat    = ref(null);

// Produk laris
const produkLaris      = ref([]);
const loadingProduk    = ref(false);

// Detail rekod transaksi
const txDetail = ref(null);
const failDokumenDetail = computed(() => {
  if (!txDetail.value?.fail_dokumen) return [];
  let fd = txDetail.value.fail_dokumen;
  if (typeof fd === 'string') { try { fd = JSON.parse(fd); } catch { return []; } }
  return Array.isArray(fd) ? fd : [];
});
const isGambar = (p) => /\.(jpg|jpeg|png|gif|webp)$/i.test(p);

// PDF Viewer (inline — sama seperti kebajikan)
const pdfPratontonUrl = ref(null);
const pdfMuatLoading  = ref(false);
const pdfMuatRalat    = ref(false);
const bukaPreviewPdf  = (url) => { pdfPratontonUrl.value = url; pdfMuatLoading.value = true; pdfMuatRalat.value = false; };
const tutupPreviewPdf = () => { pdfPratontonUrl.value = null; };

// Image Lightbox
const imgPratontonUrl = ref(null);

// Edit transaksi
const showEditModal      = ref(false);
const savingEdit         = ref(false);
const editingId          = ref(null);
const formEdit           = ref({ jenis_aliran: 'KELUAR', kategori: '', amaun: '', nota: '', rujukan: '', penerima_bayaran: '', no_kp_pihak: '', tarikh: '', acara_khas_id: null });
const editMasukDariAhli  = ref(false);
const failEditSediaAda   = ref([]);
const failEditPadam      = ref([]);
const failEditBaru       = ref([]);
const ralatFailEdit      = ref('');
const logEdit            = ref([]);
const loadingLog         = ref(false);

watch(editMasukDariAhli, () => {
  formEdit.value.no_kp_pihak      = '';
  formEdit.value.penerima_bayaran = '';
});

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
  try { const { data } = await api.get('/admin/kewangan/staff'); senaraiStaffSumb.value = data.data || []; }
  catch { /* */ } finally { loadingStaffSumb.value = false; }
};
const pilihPicSumb = (s) => { formSumbangan.value.pic_no_kp = s.no_kp; formSumbangan.value.pic_nama = s.nama; cariPicSumb.value = s.nama; showPicDropdownSumb.value = false; };
const clearPicSumb = () => { formSumbangan.value.pic_no_kp = ''; formSumbangan.value.pic_nama = ''; cariPicSumb.value = ''; };
const pilihPicEditSumb = (s) => { formEditSumbangan.value.pic_no_kp = s.no_kp; formEditSumbangan.value.pic_nama = s.nama; cariPicEditSumb.value = s.nama; showPicEditDropdownSumb.value = false; };
const clearPicEditSumb = () => { formEditSumbangan.value.pic_no_kp = ''; formEditSumbangan.value.pic_nama = ''; cariPicEditSumb.value = ''; };

watch(() => formSumbangan.value.acara_khas_id, async (id) => {
  formSumbangan.value.pakej_id = '';
  formSumbangan.value.amaun = '';
  senaraiPakejSumb.value = [];
  if (!id) return;
  try { const { data } = await api.get(`/admin/kewangan/acara-khas/${id}/pakej`); senaraiPakejSumb.value = (data.data || []).filter(p => p.status === 'AKTIF'); }
  catch { /* */ }
});

watch(() => formSumbangan.value.pakej_id, (id) => {
  if (!id) return;
  const pakej = senaraiPakejSumb.value.find(p => p.id === parseInt(id));
  if (pakej?.amaun_pakej) formSumbangan.value.amaun = parseFloat(pakej.amaun_pakej);
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

watch(() => formEditSumbangan.value.acara_khas_id, async (id) => {
  formEditSumbangan.value.pakej_id = '';
  senaraiPakejEditSumb.value = [];
  if (!id) return;
  try { const { data } = await api.get(`/admin/kewangan/acara-khas/${id}/pakej`); senaraiPakejEditSumb.value = (data.data || []).filter(p => p.status === 'AKTIF'); }
  catch { /* */ }
});

watch(() => formEditSumbangan.value.pakej_id, (id) => {
  if (!id) return;
  const pakej = senaraiPakejEditSumb.value.find(p => p.id === parseInt(id));
  if (pakej?.amaun_pakej) formEditSumbangan.value.amaun = parseFloat(pakej.amaun_pakej);
});

const acaraBelumDituntut = computed(() =>
  acaraSumbangan.value.filter(a => parseInt(a.bil_belum_dituntut) > 0)
);

// ── Acara Khas ──────────────────────────────────────────────────────
const senaraiAcaraKhas  = ref([]);
const loadingAcaraKhas  = ref(false);
const acaraKhasDipilih  = ref(null);
const penyataAcara      = ref(null);
const loadingPenyata    = ref(false);

// Filter transaksi dalam penyata acara khas — dideklarasi selepas penyataAcara
const filtAcara = ref({ kategori: '', tarikhMula: '', tarikhAkhir: '' });
const kategoriDalamAcara = computed(() => {
  if (!penyataAcara.value?.transaksi) return [];
  const kods = [...new Set(penyataAcara.value.transaksi.map(t => t.kategori))];
  return kods.map(k => ({ kod: k, nama: labelKat(k) })).sort((a, b) => a.nama.localeCompare(b.nama));
});
const transaksiAcaraFiltered = computed(() => {
  if (!penyataAcara.value?.transaksi) return [];
  const { kategori, tarikhMula, tarikhAkhir } = filtAcara.value;
  return penyataAcara.value.transaksi.filter(t => {
    if (kategori && t.kategori !== kategori) return false;
    if (tarikhMula || tarikhAkhir) {
      const p = t.tarikh.split('-');
      const iso = `${p[2]}-${p[1]}-${p[0]}`;
      if (tarikhMula && iso < tarikhMula) return false;
      if (tarikhAkhir && iso > tarikhAkhir) return false;
    }
    return true;
  });
});
const filtAcaraRingkasan = computed(() => {
  const masuk  = transaksiAcaraFiltered.value.filter(t => t.jenis_aliran === 'MASUK').reduce((s, t) => s + parseFloat(t.amaun), 0);
  const keluar = transaksiAcaraFiltered.value.filter(t => t.jenis_aliran === 'KELUAR').reduce((s, t) => s + parseFloat(t.amaun), 0);
  return { masuk, keluar, baki: masuk - keluar };
});

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
  filtAcara.value = { kategori: '', tarikhMula: '', tarikhAkhir: '' };
  try {
    const { data } = await api.get(`/admin/kewangan/acara-khas/${acara.id}/penyata`);
    penyataAcara.value = data;
  } catch { /* */ } finally { loadingPenyata.value = false; }
};

// ── Laporan Mengikut Kategori ──────────────────────────────────────
const muatLaporanKategori = async () => {
  loadingLaporanKat.value = true;
  dataLaporanKat.value = null;
  try {
    const q = new URLSearchParams();
    if (filtKat.value.dari)          q.set('dari',          filtKat.value.dari);
    if (filtKat.value.hingga)        q.set('hingga',        filtKat.value.hingga);
    if (filtKat.value.kategori)      q.set('kategori',      filtKat.value.kategori);
    if (filtKat.value.acara_khas_id) q.set('acara_khas_id', filtKat.value.acara_khas_id);
    if (filtKat.value.jenis)         q.set('jenis',         filtKat.value.jenis);
    const { data } = await api.get('/admin/kewangan/laporan-kategori?' + q.toString());
    if (data.success) dataLaporanKat.value = data;
    else toast.ralat('Gagal memuatkan laporan kategori.');
  } catch { toast.ralat('Gagal memuatkan laporan kategori.'); }
  finally { loadingLaporanKat.value = false; }
};

const cetakLaporanKategori = () => {
  if (!dataLaporanKat.value) return;
  const d  = dataLaporanKat.value;
  const r  = d.ringkasan;
  const tc = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const perihal = [
    filtKat.value.dari && filtKat.value.hingga ? `${filtKat.value.dari} hingga ${filtKat.value.hingga}` : 'Semua Tarikh',
    filtKat.value.kategori ? labelKat(filtKat.value.kategori) : 'Semua Kategori',
    filtKat.value.acara_khas_id ? (senaraiAcaraKhas.value.find(a => a.id == filtKat.value.acara_khas_id)?.nama || '') : 'Semua Acara',
    filtKat.value.jenis === 'MASUK' ? 'Pendapatan Sahaja' : filtKat.value.jenis === 'KELUAR' ? 'Perbelanjaan Sahaja' : 'Masuk & Keluar',
  ].filter(Boolean).join(' · ');

  // Senarai pecahan kategori
  const barisKat = Object.entries(d.by_kategori)
    .sort(([, a], [, b]) => (b.masuk + b.keluar) - (a.masuk + a.keluar))
    .map(([kod, v]) => `
      <tr>
        <td style="padding:4px 8px">${labelKat(kod)}</td>
        <td style="padding:4px 8px;text-align:right;color:#059669">${v.masuk > 0 ? 'RM ' + fmtRM(v.masuk) : '—'}</td>
        <td style="padding:4px 8px;text-align:right;color:#e11d48">${v.keluar > 0 ? 'RM ' + fmtRM(v.keluar) : '—'}</td>
        <td style="padding:4px 8px;text-align:right;font-weight:bold">${v.masuk > 0 || v.keluar > 0 ? 'RM ' + fmtRM(v.masuk - v.keluar) : '—'}</td>
      </tr>`).join('');

  // Senarai transaksi
  const barisTx = d.data.map(t => `
    <tr>
      <td style="padding:3px 6px;font-family:monospace;color:#475569">${t.tarikh}</td>
      <td style="padding:3px 6px"><span style="font-size:9px;font-weight:bold;padding:1px 5px;border-radius:3px;background:${t.jenis_aliran==='MASUK'?'#dcfce7':'#fee2e2'};color:${t.jenis_aliran==='MASUK'?'#166534':'#991b1b'}">${t.jenis_aliran==='MASUK'?'DEBIT':'KREDIT'}</span></td>
      <td style="padding:3px 6px;color:#475569">${labelKat(t.kategori)}</td>
      <td style="padding:3px 6px;color:#475569">${t.nota || t.penerima_bayaran || t.nama_ahli || '—'}</td>
      <td style="padding:3px 6px;text-align:right;font-weight:600;color:${t.jenis_aliran==='MASUK'?'#059669':'#e11d48'}">${t.jenis_aliran==='KELUAR'?'- ':'+ '}${fmtRM(t.amaun)}</td>
    </tr>`).join('');

  const badan = `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px">
      <div><strong>PENAPIS:</strong> ${perihal}</div>
      <div style="text-align:right"><strong>DICETAK:</strong> ${tc}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      <div style="border:1px solid #d1fae5;background:#f0fdf4;padding:8px 10px;border-radius:6px;text-align:center">
        <div style="font-size:9px;font-weight:bold;color:#059669;text-transform:uppercase;letter-spacing:.05em">Jumlah Debit (Masuk)</div>
        <div style="font-size:15px;font-weight:900;color:#059669;margin-top:3px">RM ${fmtRM(r.masuk)}</div>
      </div>
      <div style="border:1px solid #fee2e2;background:#fff1f2;padding:8px 10px;border-radius:6px;text-align:center">
        <div style="font-size:9px;font-weight:bold;color:#e11d48;text-transform:uppercase;letter-spacing:.05em">Jumlah Kredit (Keluar)</div>
        <div style="font-size:15px;font-weight:900;color:#e11d48;margin-top:3px">RM ${fmtRM(r.keluar)}</div>
      </div>
      <div style="border:1px solid #e9d5ff;background:#faf5ff;padding:8px 10px;border-radius:6px;text-align:center">
        <div style="font-size:9px;font-weight:bold;color:#7c3aed;text-transform:uppercase;letter-spacing:.05em">Lebihan / Kurangan</div>
        <div style="font-size:15px;font-weight:900;color:${r.lebihan>=0?'#7c3aed':'#e11d48'};margin-top:3px">RM ${fmtRM(r.lebihan)}</div>
      </div>
    </div>
    <p style="font-size:10px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px">Pecahan Mengikut Kategori</p>
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px">
      <thead><tr style="background:#f3f4f6;border-bottom:2px solid #d1d5db">
        <th style="padding:5px 8px;text-align:left;font-size:9px;color:#6b7280;text-transform:uppercase">Kategori</th>
        <th style="padding:5px 8px;text-align:right;font-size:9px;color:#6b7280;text-transform:uppercase">Debit (+)</th>
        <th style="padding:5px 8px;text-align:right;font-size:9px;color:#6b7280;text-transform:uppercase">Kredit (−)</th>
        <th style="padding:5px 8px;text-align:right;font-size:9px;color:#6b7280;text-transform:uppercase">Lebihan</th>
      </tr></thead>
      <tbody style="border-bottom:1px solid #e5e7eb">${barisKat}</tbody>
    </table>
    <p style="font-size:10px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px">Senarai Transaksi (${r.bil} rekod)</p>
    <table style="width:100%;border-collapse:collapse;font-size:10.5px">
      <thead><tr style="background:#f3f4f6;border-bottom:2px solid #d1d5db">
        <th style="padding:4px 6px;text-align:left;font-size:8.5px;color:#6b7280;text-transform:uppercase">Tarikh</th>
        <th style="padding:4px 6px;text-align:left;font-size:8.5px;color:#6b7280;text-transform:uppercase">Jenis</th>
        <th style="padding:4px 6px;text-align:left;font-size:8.5px;color:#6b7280;text-transform:uppercase">Kategori</th>
        <th style="padding:4px 6px;text-align:left;font-size:8.5px;color:#6b7280;text-transform:uppercase">Nota / Penerima</th>
        <th style="padding:4px 6px;text-align:right;font-size:8.5px;color:#6b7280;text-transform:uppercase">Amaun (RM)</th>
      </tr></thead>
      <tbody>${barisTx}</tbody>
    </table>
    <div style="margin-top:6px;font-size:8.5px;color:#64748b">${r.bil} rekod &bull; Laporan dijana: ${tc}</div>`;

  bukaCetakWindow(`Laporan Mengikut Kategori &bull; ${perihal}`, badan);
};

const fmtRM = (n) => parseFloat(n || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 });

const cetakPenyataAcara = () => {
  const d  = penyataAcara.value;
  const rk = d.ringkasan;
  const acara = acaraKhasDipilih.value;
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  // Hanya transaksi lejar (transaksi_kewangan) — kutipan sumbangan tidak dicetak
  const barisLejar = d.transaksi?.length
    ? d.transaksi.map((t, i) => `<tr>
        <td style="text-align:center;color:#64748b">${i + 1}</td>
        <td>${t.tarikh || '—'}</td>
        <td><span style="font-size:8px;font-weight:700;color:${t.jenis_aliran === 'MASUK' ? '#047857' : '#b91c1c'}">${t.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT'}</span></td>
        <td>${labelKat(t.kategori)}</td>
        <td style="color:#475569;font-size:10px">${(t.nota || t.penerima_bayaran || t.nama_ahli || '—').substring(0, 40)}</td>
        <td style="text-align:right;font-family:monospace;color:#b91c1c;font-weight:700">${t.jenis_aliran === 'KELUAR' ? num(t.amaun) : ''}</td>
        <td style="text-align:right;font-family:monospace;color:#047857;font-weight:700">${t.jenis_aliran === 'MASUK'  ? num(t.amaun) : ''}</td>
      </tr>`).join('')
    : `<tr><td colspan="7" style="text-align:center;color:#999;padding:12px">Tiada transaksi lejar direkodkan.</td></tr>`;

  const badan = `
    <div style="margin-bottom:14px;font-size:11px;color:#475569">
      Tarikh Cetak: <strong>${tarikhCetak}</strong>
    </div>

    <!-- KPI ringkasan — lejar sahaja -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 10px;text-align:center">
        <div style="font-size:8px;color:#065f46;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Pendapatan</div>
        <div style="font-size:13px;font-weight:800;color:#047857;font-family:monospace;margin-top:2px">${rm(rk.jumlah_masuk)}</div>
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

    <h3 style="font-size:10px;color:#1e293b;margin:0 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">Transaksi Lejar</h3>
    <table>
      <thead><tr>
        <th style="width:24px;text-align:center">#</th>
        <th>Tarikh</th><th>Jenis</th><th>Kategori</th><th>Nota / Penerima</th>
        <th style="text-align:right">Kredit (–) RM</th>
        <th style="text-align:right">Debit (+) RM</th>
      </tr></thead>
      <tbody>${barisLejar}</tbody>
    </table>

    <div class="ringkas" style="margin-top:18px">
      <div class="r"><span>Jumlah Pendapatan</span><span style="color:#047857;font-weight:700">${rm(rk.jumlah_masuk)}</span></div>
      <div class="r"><span>Jumlah Perbelanjaan</span><span class="neg">${rm(rk.jumlah_keluar)}</span></div>
      <div class="r akhir"><span>BAKI LEJAR ACARA</span><span style="color:${rk.baki >= 0 ? '#a78bfa' : '#fb923c'}">${rm(rk.baki)}</span></div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:10px;color:#444">
      <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
      <div style="text-align:center">________________________<br/>Disahkan oleh (Yang Dipertua)</div>
    </div>`;

  bukaCetakWindow(`Penyata Acara Khas &bull; ${acara.nama} &bull; Dicetak: ${tarikhCetak}`, badan);
};

const cetakLaporanPerbelanjaanAcara = async () => {
  if (!acaraKhasDipilih.value) return;
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  try {
    const { data } = await api.get(`/admin/kewangan/acara-khas/${acaraKhasDipilih.value.id}/laporan-perbelanjaan`);
    if (!data.success) { toast.ralat('Gagal muat laporan perbelanjaan.'); return; }
    const { acara, transaksi, by_kategori, ringkasan } = data;

    const barisKategori = by_kategori?.length
      ? by_kategori.map((k, i) => `<tr>
          <td style="text-align:center;color:#64748b">${i + 1}</td>
          <td style="font-weight:600">${k.nama_kategori || labelKat(k.kategori)}</td>
          <td style="text-align:center">${k.bil}</td>
          <td style="text-align:right;font-family:monospace;font-weight:700;color:#b91c1c">${num(k.jumlah)}</td>
        </tr>`).join('')
      : `<tr><td colspan="4" style="text-align:center;color:#999;padding:12px">Tiada perbelanjaan.</td></tr>`;

    const barisTransaksi = transaksi?.length
      ? transaksi.map((t, i) => `<tr>
          <td style="text-align:center;color:#64748b">${i + 1}</td>
          <td>${t.tarikh || '—'}</td>
          <td>${labelKat(t.kategori)}</td>
          <td style="color:#475569;font-size:10px">${(t.pihak || t.nota || '—').substring(0, 40)}</td>
          <td style="text-align:right;font-family:monospace;font-weight:700;color:#b91c1c">${num(t.amaun)}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" style="text-align:center;color:#999;padding:12px">Tiada perbelanjaan direkodkan.</td></tr>`;

    const badan = `
      <div style="margin-bottom:14px;font-size:11px;color:#475569">Tarikh Cetak: <strong>${tarikhCetak}</strong></div>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:12px;text-align:center;margin-bottom:18px">
        <div style="font-size:9px;color:#9f1239;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Jumlah Perbelanjaan</div>
        <div style="font-size:22px;font-weight:800;color:#be123c;font-family:monospace;margin-top:3px">RM ${num(ringkasan.jumlah_perbelanjaan)}</div>
        <div style="font-size:9px;color:#9f1239;margin-top:2px">${ringkasan.bil_transaksi} transaksi</div>
      </div>
      <h3 style="font-size:10px;color:#1e293b;margin:0 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">A. Pecahan Ikut Kategori</h3>
      <table>
        <thead><tr>
          <th style="width:24px;text-align:center">#</th>
          <th>Kategori</th><th style="text-align:center">Bil</th>
          <th style="text-align:right">Amaun (RM)</th>
        </tr></thead>
        <tbody>${barisKategori}
          <tr style="font-weight:700;background:#fff1f2;border-top:1.5px solid #fca5a5">
            <td colspan="3" style="text-align:right">JUMLAH</td>
            <td style="text-align:right;font-family:monospace;color:#b91c1c">${num(ringkasan.jumlah_perbelanjaan)}</td>
          </tr>
        </tbody>
      </table>
      <h3 style="font-size:10px;color:#1e293b;margin:18px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">B. Senarai Perbelanjaan</h3>
      <table>
        <thead><tr>
          <th style="width:24px;text-align:center">#</th>
          <th>Tarikh</th><th>Kategori</th><th>Pihak / Nota</th>
          <th style="text-align:right">Amaun (RM)</th>
        </tr></thead>
        <tbody>${barisTransaksi}</tbody>
      </table>
      <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:10px;color:#444">
        <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
        <div style="text-align:center">________________________<br/>Disahkan oleh (Yang Dipertua)</div>
      </div>`;

    bukaCetakWindow(`Laporan Perbelanjaan Acara &bull; ${acara.nama} &bull; Dicetak: ${tarikhCetak}`, badan);
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal menjana laporan perbelanjaan.');
  }
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
  const tarikh = tx.tarikh
    ? tx.tarikh.substring(0, 10).split('-').reverse().join('-')
    : new Date().toISOString().split('T')[0];
  formEdit.value = {
    jenis_aliran:     tx.jenis_aliran,
    kategori:         tx.kategori,
    amaun:            tx.amaun,
    nota:             tx.nota || '',
    rujukan:          tx.rujukan || '',
    penerima_bayaran: tx.penerima_bayaran || '',
    no_kp_pihak:      tx.no_kp_pihak || '',
    tarikh,
    acara_khas_id:    tx.acara_khas_id || null,
  };
  editMasukDariAhli.value = !!(tx.no_kp_pihak);
  // Dokumen sedia ada — mysql2 auto-parse JSON column
  let fd = tx.fail_dokumen;
  if (typeof fd === 'string') { try { fd = JSON.parse(fd); } catch { fd = []; } }
  failEditSediaAda.value = Array.isArray(fd) ? fd : [];
  failEditPadam.value    = [];
  failEditBaru.value     = [];
  ralatFailEdit.value    = '';
  logEdit.value          = [];
  showEditModal.value    = true;

  // Muatkan log edit secara async
  loadingLog.value = true;
  api.get(`/admin/kewangan/transaksi/${tx.id}/log`)
    .then(r => { logEdit.value = r.data.data || []; })
    .catch(() => {})
    .finally(() => { loadingLog.value = false; });
};

const tambahFailEdit = (files) => {
  ralatFailEdit.value = '';
  const senarai = Array.from(files || []);
  const jumlahKekal = failEditSediaAda.value.filter(f => !failEditPadam.value.includes(f)).length;
  if (jumlahKekal + failEditBaru.value.length + senarai.length > 5) {
    ralatFailEdit.value = 'Maksimum 5 fail sahaja dibenarkan.'; return;
  }
  for (const f of senarai) {
    if (f.size > 20 * 1024 * 1024) { ralatFailEdit.value = `${f.name} melebihi had 20MB.`; continue; }
    failEditBaru.value.push({ fail: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null });
  }
};

const buangFailEdit = (i) => {
  const e = failEditBaru.value[i];
  if (e?.preview) URL.revokeObjectURL(e.preview);
  failEditBaru.value.splice(i, 1);
};

const tandaPadam = (path) => {
  if (failEditPadam.value.includes(path)) {
    failEditPadam.value = failEditPadam.value.filter(p => p !== path);
  } else {
    failEditPadam.value.push(path);
  }
};

const simpanEdit = async () => {
  if (!formEdit.value.kategori || !formEdit.value.amaun || parseFloat(formEdit.value.amaun) <= 0) {
    toast.amaran('Sila isi kategori dan amaun yang sah.'); return;
  }
  const jenis = formEdit.value.jenis_aliran === 'MASUK' ? 'DEBIT' : 'KREDIT';
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
    const fd = new FormData();
    fd.append('jenis_aliran',     formEdit.value.jenis_aliran);
    fd.append('kategori',         formEdit.value.kategori);
    fd.append('amaun',            formEdit.value.amaun);
    fd.append('nota',             formEdit.value.nota || '');
    fd.append('rujukan',          formEdit.value.rujukan || '');
    if (formEdit.value.no_kp_pihak)      fd.append('no_kp_pihak',      formEdit.value.no_kp_pihak);
    fd.append('penerima_bayaran', formEdit.value.no_kp_pihak ? '' : (formEdit.value.penerima_bayaran || ''));
    fd.append('tarikh',           formEdit.value.tarikh || '');
    fd.append('fail_padam',       JSON.stringify(failEditPadam.value));
    if (formEdit.value.acara_khas_id) fd.append('acara_khas_id', formEdit.value.acara_khas_id);
    failEditBaru.value.forEach(e => fd.append('dokumen', e.fail));

    const { data } = await api.put(`/admin/kewangan/transaksi/${editingId.value}`, fd);
    if (data.success) {
      toast.sukses('Rekod berjaya dikemaskini.');
      failEditBaru.value.forEach(e => e.preview && URL.revokeObjectURL(e.preview));
      api.get(`/admin/kewangan/transaksi/${editingId.value}/log`)
        .then(r => { logEdit.value = r.data.data || []; }).catch(() => {});
      showEditModal.value = false;
      await Promise.all([muatData(), muatTransaksi()]);
    } else {
      toast.ralat(data.message || 'Gagal mengemaskini rekod.');
    }
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Ralat mengemaskini rekod.');
  } finally {
    savingEdit.value = false;
  }
};

const padamTx = async (tx) => {
  if (!confirm(`Padam rekod ${tx.jenis_aliran === 'MASUK' ? 'DEBIT' : 'KREDIT'} ${fmt(tx.amaun)}?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  try {
    const { data } = await api.delete(`/admin/kewangan/transaksi/${tx.id}`);
    if (data.success) {
      toast.sukses('Rekod berjaya dipadam.');
      await muatData();
      await muatTransaksi();
    } else {
      toast.ralat(data.message || 'Gagal memadam rekod.');
    }
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Ralat memadam rekod.');
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
  if (!formTuntutan.value.acara_khas_id) { toast.amaran('Sila pilih acara khas.'); return; }
  if (!formTuntutan.value.jumlah_bersih || parseFloat(formTuntutan.value.jumlah_bersih) <= 0) {
    toast.amaran('Sila masukkan jumlah bersih diterima.'); return;
  }
  if (!formTuntutan.value.tarikh_tuntutan) { toast.amaran('Sila pilih tarikh tuntutan.'); return; }

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
      toast.sukses(data.message || 'Tuntutan berjaya direkod.');
      showModalTuntutan.value = false;
      await muatSumbangan();
      await muatData();
      await muatTransaksi();
    }
  } catch (e) { toast.ralat(e.response?.data?.message || 'Ralat menyimpan tuntutan.'); }
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
      .then(({ data }) => { senaraiPakejEditSumb.value = (data.data || []).filter(p => p.status === 'AKTIF'); })
      .catch(() => {});
  } else {
    senaraiPakejEditSumb.value = [];
  }
  showEditSumbangan.value = true;
};

const simpanEditSumbangan = async () => {
  const f = formEditSumbangan.value;
  if (!f.acara_khas_id) { toast.amaran('Sila pilih acara khas.'); return; }
  if (!f.nama_syarikat?.trim() || !f.amaun || parseFloat(f.amaun) <= 0) {
    toast.amaran('Sila lengkapkan semua medan wajib.'); return;
  }
  savingEditSumbangan.value = true;
  try {
    const { data } = await api.put(`/admin/kewangan/sumbangan/${f.id}`, {
      acara_khas_id: f.acara_khas_id,
      pakej_id:      f.pakej_id || null,
      nama_syarikat: f.nama_syarikat.trim(),
      amaun:         parseFloat(f.amaun),
      tarikh:        f.tarikh || null,
      nota:          f.nota || null,
      pic_no_kp:     f.pic_no_kp || null,
    });
    if (data.success) {
      toast.sukses('Sumbangan berjaya dikemaskini.');
      showEditSumbangan.value = false;
      await muatSumbangan();
    }
  } catch (e) { toast.ralat(e.response?.data?.message || 'Ralat mengemaskini rekod.'); }
  finally { savingEditSumbangan.value = false; }
};

const padamRekodSumbangan = async (r) => {
  if (!confirm(`Padam sumbangan "${r.nama_syarikat}" (${fmt(r.amaun)})?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  try {
    const { data } = await api.delete(`/admin/kewangan/sumbangan/${r.id}`);
    if (data.success) await muatSumbangan();
  } catch (e) { toast.ralat(e.response?.data?.message || 'Ralat memadam rekod.'); }
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
        { label: 'Debit (+)', data: bulanan.map(b => b.masuk),  backgroundColor: '#059669', borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.75 },
        { label: 'Kredit (–)', data: bulanan.map(b => b.keluar), backgroundColor: '#e11d48', borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.75 },
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
  const f = formSumbangan.value;
  if (!f.acara_khas_id) { toast.amaran('Sila pilih acara khas.'); return; }
  if (!f.nama_penyumbang?.trim() || !f.amaun || parseFloat(f.amaun) <= 0) {
    toast.amaran('Sila isi nama syarikat/penyumbang dan amaun yang sah.'); return;
  }
  savingSumbangan.value = true;
  try {
    const { data } = await api.post('/admin/kewangan/sumbangan', {
      acara_khas_id: f.acara_khas_id,
      pakej_id:      f.pakej_id || null,
      nama_syarikat: f.nama_penyumbang.trim(),
      amaun:         f.amaun,
      tarikh:        f.tarikh || null,
      nota:          f.nota || null,
      pic_no_kp:     f.pic_no_kp || null,
    });
    if (data.success) {
      const kekalAcara = f.acara_khas_id;
      formSumbangan.value = { acara_khas_id: kekalAcara, pakej_id: '', nama_penyumbang: '', amaun: '', tarikh: new Date().toISOString().split('T')[0], nota: '', pic_no_kp: '', pic_nama: '' };
      toast.sukses('Sumbangan berjaya direkod.');
      cariPicSumb.value = '';
      await muatSumbangan();
    }
  } catch (e) { toast.ralat(e.response?.data?.message || 'Gagal menyimpan sumbangan.'); }
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
    if (baris.length === 0) { toast.amaran('Fail CSV kosong.'); return; }
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
    if (senarai.length === 0) { toast.amaran('Tiada data sah dijumpai dalam CSV. Format: nama_syarikat, amaun, nama_acara, tarikh'); return; }
    if (!confirm(`${senarai.length} rekod sumbangan dikesan. Teruskan import?`)) return;
    const { data } = await api.post('/admin/kewangan/sumbangan/import', { senarai });
    if (data.success) {
      toast.sukses(data.message || 'Import CSV berjaya.');
      await muatSumbangan();
    }
  } catch (err) {
    toast.ralat(err.response?.data?.message || 'Gagal memproses fail CSV.');
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
    <td><span style="font-size:8px;font-weight:700;letter-spacing:.04em;color:${tx.jenis_aliran === 'MASUK' ? '#047857' : '#b91c1c'}">${tx.jenis_aliran === 'MASUK' ? '▲ DEBIT' : '▼ KREDIT'}</span></td>
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
      <h3 style="font-size:10px;color:#1e293b;margin:18px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">A. Pendapatan / Debit</h3>
      <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
      <tbody>${barisPendapatan}<tr style="font-weight:700;background:#f1f5f9;border-top:1.5px solid #334155"><td>JUMLAH DEBIT</td><td></td><td style="text-align:right;font-family:monospace">${num(d.jumlah_pendapatan)}</td></tr></tbody></table>
      <h3 style="font-size:10px;color:#1e293b;margin:18px 0 5px;border-bottom:1.5px solid #334155;padding-bottom:3px;font-weight:700;letter-spacing:.05em;text-transform:uppercase">B. Perbelanjaan / Kredit</h3>
      <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
      <tbody>${barisPerbelanjaan}<tr style="font-weight:700;background:#f1f5f9;border-top:1.5px solid #334155"><td>JUMLAH KREDIT</td><td></td><td style="text-align:right;font-family:monospace">${num(d.jumlah_perbelanjaan)}</td></tr></tbody></table>
      <div class="ringkas">
        <div class="r"><span>Baki Bawa Ke Hadapan (sebelum ${d.tahun})</span><span>${rm(d.baki_bawa)}</span></div>
        <div class="r"><span>Jumlah Debit ${d.tahun}</span><span class="pos">${rm(d.jumlah_pendapatan)}</span></div>
        <div class="r"><span>Jumlah Kredit ${d.tahun}</span><span class="neg">${rm(d.jumlah_perbelanjaan)}</span></div>
        <div class="r"><span>Lebihan / (Kurangan) Tahun Semasa</span><span class="${d.lebihan_kurangan >= 0 ? 'pos' : 'neg'}">${rm(d.lebihan_kurangan)}</span></div>
        <div class="r akhir"><span>BAKI AKHIR TERKUMPUL</span><span>${rm(d.baki_akhir)}</span></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:10px;color:#444">
        <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
        <div style="text-align:center">________________________<br/>Disahkan oleh (Yang Dipertua)</div>
      </div>`;

    bukaCetakWindow(`Penyata Kewangan Tahunan &bull; Tahun ${d.tahun} &bull; Dicetak: ${tarikhCetak}`, badan);
  } catch (e) {
    toast.ralat('Gagal menjana penyata tahunan.');
  } finally { menjanaPenyata.value = false; }
};

// ── Laporan Harian ──
const cetakLaporanHarian = async () => {
  if (!laporanTarikh.value) { toast.amaran('Sila pilih tarikh laporan.'); return; }
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
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Debit</div>
          <div style="font-size:13px;font-weight:700;color:#047857;font-family:monospace">+${rm(r.masuk)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Kredit</div>
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
        <th style="text-align:right">Kredit (–) RM</th>
        <th style="text-align:right">Debit (+) RM</th>
      </tr></thead>
      <tbody>${baris}</tbody></table>
      <div style="margin-top:6px;font-size:8.5px;color:#64748b">Jumlah: <strong>${r.bil}</strong> transaksi</div>`;

    bukaCetakWindow(`Laporan Tunai Harian &bull; ${tarikhLaporan}`, badan);
  } catch (e) {
    toast.ralat('Gagal menjana laporan harian.');
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
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Debit</div>
          <div style="font-size:13px;font-weight:700;color:#047857;font-family:monospace">+${rm(r.masuk)}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:5px;padding:7px 14px;text-align:center;flex:1">
          <div style="font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Jumlah Kredit</div>
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
        <th style="text-align:right">Kredit (–) RM</th>
        <th style="text-align:right">Debit (+) RM</th>
      </tr></thead>
      <tbody>${baris}</tbody></table>
      <div style="margin-top:6px;font-size:8.5px;color:#64748b">Jumlah: <strong>${r.bil}</strong> transaksi &bull; ${namaBulan} ${laporanTahunBulan.value}</div>`;

    bukaCetakWindow(`Laporan Kewangan Bulanan &bull; ${namaBulan} ${laporanTahunBulan.value}`, badan);
  } catch (e) {
    toast.ralat('Gagal menjana laporan bulanan.');
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

const muatKategoriKewangan = async () => {
  try {
    const { data } = await api.get('/admin/kewangan/kategori');
    senaraiKategoriKewangan.value = data.data || [];
  } catch { /* fallback ke LABEL_KATEGORI_FALLBACK */ }
};

onMounted(async () => {
  await Promise.all([muatSenaraiAhli(), muatData(), muatTransaksi(), muatAcaraKhas(), muatKategoriKewangan()]);
  muatBakiTerkumpul();
  muatStaffSumb();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
