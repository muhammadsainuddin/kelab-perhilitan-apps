<template>
  <div class="space-y-6 font-sans text-gray-900 pb-10">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-2xl text-gray-900">Buku Tunai Kelab</h2>
        <p class="text-gray-500 text-sm mt-1">Pantau dan rekod aliran tunai secara masa nyata.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select v-model="tahunPilihan" @change="muatData"
          class="bg-white border border-gray-300 text-gray-700 font-semibold text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] shadow-sm transition-all">
          <option v-for="y in senaraITahun" :key="y" :value="y">Tahun {{ y }}</option>
        </select>
        
        <button @click="cetakPenyataTahunan" :disabled="menjanaPenyata"
          class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ menjanaPenyata ? 'Menjana...' : 'Penyata Tahunan' }}
        </button>

        <button @click="bukaSumbangan"
          class="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          Kutipan Sumbangan
        </button>

        <button @click="eksportCSV"
          class="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all border border-gray-300 shadow-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Eksport CSV
        </button>

        <button @click="showModalKeluar = true"
          class="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Rekod Perbelanjaan
        </button>
      </div>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
          <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Pemasukan</p>
          <h3 class="text-xl font-black text-gray-900 mt-0.5">{{ fmt(statistik.jumlah_masuk) }}</h3>
          <p class="text-[10px] font-medium text-emerald-600 mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">Yuran + Jualan Kedai</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
          <svg class="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Perbelanjaan</p>
          <h3 class="text-xl font-black text-gray-900 mt-0.5">{{ fmt(statistik.jumlah_keluar) }}</h3>
          <p class="text-[10px] font-medium text-rose-600 mt-1 bg-rose-50 inline-block px-2 py-0.5 rounded">Kebajikan + Kos Pengurusan</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-[#0F4C3A] to-[#08151D] rounded-2xl p-5 border border-[#0F4C3A] shadow-lg flex items-center gap-4 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-sm z-10">
          <svg class="w-6 h-6 text-[#FBBF24]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        </div>
        <div class="z-10">
          <p class="text-xs font-bold text-white/70 uppercase tracking-wider">Baki Akaun Semasa</p>
          <h3 class="text-2xl font-black text-white mt-0.5">{{ fmt(statistik.baki) }}</h3>
          <p class="text-[10px] font-medium text-[#FBBF24] mt-1">Baki bersih setakat hari ini</p>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="h-28 rounded-2xl bg-white border border-gray-200 animate-pulse"/>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 class="text-gray-900 font-bold mb-6 text-lg">Aliran Kewangan Bulanan {{ tahunPilihan }}</h3>
      <div class="h-72">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-200 bg-gray-50/50">
        <h3 class="text-gray-900 font-bold text-lg">Rekod Transaksi</h3>
        <div class="flex gap-2">
          <select v-model="filterJenis" @change="muatTransaksi"
            class="bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all">
            <option value="">Semua Jenis</option>
            <option value="MASUK">Pemasukan (+)</option>
            <option value="KELUAR">Perbelanjaan (-)</option>
          </select>
          <div class="relative">
            <input v-model="carian" @input="debounceSearch" type="text" placeholder="Cari rujukan / nota..."
              class="w-48 sm:w-64 bg-white border border-gray-300 text-gray-900 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all placeholder-gray-400"/>
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th class="px-5 py-4 font-bold">Tarikh</th>
              <th class="px-4 py-4 font-bold">Jenis</th>
              <th class="px-4 py-4 font-bold">Kategori</th>
              <th class="px-4 py-4 font-bold">Nota / Rujukan</th>
              <th class="px-4 py-4 font-bold">Pihak Penerima / Pembayar</th>
              <th class="text-right px-5 py-4 font-bold">Amaun (RM)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="transaksiLoading">
              <td colspan="6" class="px-5 py-12 text-center">
                <div class="flex items-center justify-center gap-2 text-gray-500">
                  <svg class="animate-spin w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Memuatkan rekod transaksi...
                </div>
              </td>
            </tr>
            <tr v-else-if="transaksi.length === 0">
              <td colspan="6" class="px-5 py-16 text-center text-gray-500 font-medium">Tiada rekod kewangan dijumpai.</td>
            </tr>
            <tr v-for="tx in transaksi" :key="tx.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 text-gray-700 whitespace-nowrap font-medium">{{ tx.tarikh }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider',
                  tx.jenis_aliran === 'MASUK' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                ]">
                  {{ tx.jenis_aliran === 'MASUK' ? '▲' : '▼' }} {{ tx.jenis_aliran }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md font-semibold">{{ tx.kategori }}</span>
              </td>
              <td class="px-4 py-3 text-gray-900 max-w-xs">
                <p class="truncate font-semibold">{{ tx.nota || '—' }}</p>
                <p class="text-[10px] text-gray-500 font-mono mt-0.5">{{ tx.rujukan || 'Tiada Rujukan' }}</p>
              </td>
              <td class="px-4 py-3 text-gray-600 text-xs font-medium">
                {{ tx.nama_ahli || tx.penerima_bayaran || '—' }}
              </td>
              <td :class="['px-5 py-3 text-right font-black tabular-nums text-base',
                tx.jenis_aliran === 'MASUK' ? 'text-emerald-600' : 'text-rose-600']">
                {{ tx.jenis_aliran === 'MASUK' ? '+' : '-' }}{{ fmt(tx.amaun) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
        <p class="text-gray-500 text-xs font-medium">Jumlah: <span class="font-bold text-gray-900">{{ meta.total }}</span> rekod transaksi</p>
        <div class="flex gap-1">
          <button v-for="p in totalPages" :key="p"
            @click="halamanSemasa = p; muatTransaksi()"
            :class="['w-8 h-8 rounded-lg text-xs font-bold transition-colors border flex items-center justify-center',
              p === halamanSemasa ? 'bg-[#0F4C3A] border-[#0F4C3A] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100']">
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalKeluar"
          class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalKeluar = false">
          <div class="bg-white border border-gray-200 rounded-3xl p-7 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div class="flex justify-between items-start mb-5 border-b border-gray-100 pb-4">
              <div>
                <h3 class="text-gray-900 font-bold text-xl">Rekod Perbelanjaan</h3>
                <p class="text-gray-500 text-xs mt-1">Masukkan rekod pengeluaran wang secara manual.</p>
              </div>
              <button @click="showModalKeluar = false" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 sm:col-span-1">
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Kategori Belanja</label>
                  <select v-model="formKeluar.kategori"
                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all font-semibold">
                    <option value="KEBAJIKAN">Bantuan Kebajikan (Ahli)</option>
                    <option value="ACARA">Kos Acara / Sukan Kelab</option>
                    <option value="BELIAN_BARANG">Pembelian Barang / Aset</option>
                    <option value="PERKHIDMATAN">Pembayaran Perkhidmatan</option>
                    <option value="LAIN">Lain-lain Pengurusan</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Amaun Belanja (RM) *</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">RM</span>
                    <input v-model="formKeluar.amaun" type="number" min="0.01" step="0.01" placeholder="0.00" required
                      class="w-full bg-gray-50 border border-gray-300 text-rose-600 font-black rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"/>
                  </div>
                </div>
              </div>

              <div v-if="formKeluar.kategori === 'KEBAJIKAN'" class="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <label class="text-blue-800 text-xs font-bold uppercase tracking-wider mb-1.5 block">Pilih Ahli Penerima *</label>
                <select v-model="formKeluar.no_kp_pihak" required
                  class="w-full bg-white border border-blue-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium">
                  <option value="" disabled>-- Pilih Ahli --</option>
                  <option v-for="ahli in senaraiAhli" :key="ahli.no_kp" :value="ahli.no_kp">
                    {{ ahli.nama_pegawai }} ({{ ahli.no_kp }})
                  </option>
                </select>
              </div>

              <div v-else class="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <label class="text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">Dibayar Kepada (Vendor/Syarikat) *</label>
                <input v-model="formKeluar.penerima_bayaran" type="text" placeholder="Cth: Syarikat Katering ABC Sdn Bhd" required
                  class="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>

              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Rujukan / No. Baucer / Invois</label>
                <input v-model="formKeluar.rujukan" type="text" placeholder="Cth: INV-2025-001 / BV-001"
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 font-mono rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all placeholder-gray-400"/>
              </div>

              <div>
                <label class="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5 block">Nota & Keterangan Terperinci</label>
                <textarea v-model="formKeluar.nota" rows="2" placeholder="Catatan perbelanjaan..."
                  class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all placeholder-gray-400 resize-none"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button @click="showModalKeluar = false"
                class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">
                Batal
              </button>
              <button @click="simpanKeluar" :disabled="savingKeluar"
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                <span v-if="savingKeluar" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ savingKeluar ? 'Menyimpan...' : 'Simpan Rekod' }}
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL KUTIPAN SUMBANGAN ===================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModalSumbangan"
          class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          @click.self="showModalSumbangan = false">
          <div class="bg-white border border-gray-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

            <div class="flex justify-between items-start px-7 py-5 border-b border-gray-100 bg-amber-50/50">
              <div>
                <h3 class="text-gray-900 font-bold text-xl">Kutipan Sumbangan {{ tahunPilihan }}</h3>
                <p class="text-gray-500 text-xs mt-1">Rekod & senarai penyumbang kelab. Sumbangan dikira sebagai pemasukan dalam buku tunai.</p>
              </div>
              <button @click="showModalSumbangan = false" class="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-full transition-all border border-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Ringkasan + Aksi -->
            <div class="px-7 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Jumlah Kutipan</span>
                <p class="text-lg font-black text-amber-700 leading-tight">{{ fmt(jumlahSumbangan) }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button @click="showFormSumbangan = !showFormSumbangan"
                  class="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah Manual
                </button>
                <label class="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 shadow-sm cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  Import CSV
                  <input type="file" accept=".csv,text/csv" class="hidden" @change="handleCsvSumbangan"/>
                </label>
                <button @click="cetakSumbangan" :disabled="senaraiSumbangan.length===0"
                  class="flex items-center gap-1.5 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm disabled:opacity-50">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
                  Cetak Laporan
                </button>
              </div>
            </div>

            <!-- Borang Tambah Manual -->
            <div v-if="showFormSumbangan" class="px-7 py-4 border-b border-gray-100 bg-gray-50/60">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                <div class="sm:col-span-4">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Nama Penyumbang *</label>
                  <input v-model="formSumbangan.nama_penyumbang" type="text" placeholder="Nama / Syarikat"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"/>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Amaun (RM) *</label>
                  <input v-model="formSumbangan.amaun" type="number" min="0.01" step="0.01" placeholder="0.00"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"/>
                </div>
                <div class="sm:col-span-3">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Program / Tujuan</label>
                  <input v-model="formSumbangan.program" type="text" placeholder="Cth: Tabung Kebajikan"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"/>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Tarikh</label>
                  <input v-model="formSumbangan.tarikh" type="date"
                    class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"/>
                </div>
                <div class="sm:col-span-1">
                  <button @click="simpanSumbangan" :disabled="savingSumbangan"
                    class="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2 py-2 text-sm font-bold disabled:opacity-60">+</button>
                </div>
              </div>
              <p class="text-[10px] text-gray-400 mt-2">Format CSV: <code class="bg-gray-200 px-1 rounded">nama, amaun, program, tarikh</code> (baris pertama tajuk akan dilangkau automatik). Tarikh: YYYY-MM-DD.
                <a href="/templat-sumbangan.csv" download class="text-amber-600 font-bold underline ml-1">Muat turun templat CSV</a>
              </p>
            </div>

            <!-- Senarai -->
            <div class="flex-1 overflow-y-auto">
              <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 sticky top-0">
                  <tr>
                    <th class="px-6 py-3 font-bold">#</th>
                    <th class="px-4 py-3 font-bold">Nama Penyumbang</th>
                    <th class="px-4 py-3 font-bold">Program</th>
                    <th class="px-4 py-3 font-bold">Tarikh</th>
                    <th class="px-6 py-3 font-bold text-right">Amaun (RM)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="loadingSumbangan"><td colspan="5" class="px-6 py-10 text-center text-gray-400">Memuatkan...</td></tr>
                  <tr v-else-if="senaraiSumbangan.length===0"><td colspan="5" class="px-6 py-12 text-center text-gray-400">Tiada rekod sumbangan untuk tahun {{ tahunPilihan }}.</td></tr>
                  <tr v-for="(s, i) in senaraiSumbangan" :key="s.id" class="hover:bg-amber-50/40">
                    <td class="px-6 py-2.5 text-gray-400 text-xs">{{ i + 1 }}</td>
                    <td class="px-4 py-2.5 font-semibold text-gray-900">{{ s.nama_penyumbang }}</td>
                    <td class="px-4 py-2.5 text-gray-600 text-xs">{{ s.program || '—' }}</td>
                    <td class="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{{ s.tarikh }}</td>
                    <td class="px-6 py-2.5 text-right font-black text-amber-600 tabular-nums">{{ fmt(s.amaun) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';

Chart.register(...registerables);

// Label kategori mesra pengguna untuk penyata
const LABEL_KATEGORI = {
  YURAN: 'Yuran Keahlian', KEDAI: 'Jualan Kedai / Merchandise', SUMBANGAN: 'Sumbangan & Derma',
  KEBAJIKAN: 'Bantuan Kebajikan Ahli', ACARA: 'Kos Acara / Sukan', BELIAN_BARANG: 'Pembelian Barang / Aset',
  PERKHIDMATAN: 'Pembayaran Perkhidmatan', LAIN: 'Lain-lain',
};
const labelKat = (k) => LABEL_KATEGORI[k] || k;

// ── State ──
const loading          = ref(true);
const transaksiLoading = ref(true);
const statistik        = ref({ jumlah_masuk: 0, jumlah_keluar: 0, baki: 0, bulanan: [] });
const transaksi        = ref([]);
const senaraiAhli      = ref([]);
const meta             = ref({ total: 0, page: 1, limit: 20 });
const tahunPilihan     = ref(new Date().getFullYear());
const filterJenis      = ref('');
const carian           = ref('');
const halamanSemasa    = ref(1);
const chartRef         = ref(null);
const showModalKeluar  = ref(false);
const savingKeluar     = ref(false);
let chartInstance      = null;
let debounceTimer      = null;

const formKeluar = ref({ kategori: 'KEBAJIKAN', amaun: '', rujukan: '', nota: '', no_kp_pihak: '', penerima_bayaran: '' });

// ── State Penyata & Sumbangan ──
const menjanaPenyata     = ref(false);
const showModalSumbangan = ref(false);
const showFormSumbangan  = ref(false);
const senaraiSumbangan   = ref([]);
const jumlahSumbangan    = ref(0);
const loadingSumbangan   = ref(false);
const savingSumbangan    = ref(false);
const formSumbangan      = ref({ nama_penyumbang: '', amaun: '', program: '', tarikh: '' });

const senaraITahun = computed(() => {
  const y = new Date().getFullYear();
  return [y, y - 1, y - 2];
});
const totalPages = computed(() => Math.ceil(meta.value.total / meta.value.limit) || 1);

const fmt = (v) => `RM ${parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

// ── Tarik Senarai Kakitangan (Untuk Dropdown Kebajikan) ──
const muatSenaraiAhli = async () => {
  try {
    const { data } = await api.get('/admin/semua-ahli');
    if (data.success) senaraiAhli.value = data.data;
  } catch (e) { console.error("Gagal muat senarai ahli", e); }
};

// ── Muatkan Statistik & Carta ──
const muatData = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/statistik?tahun=${tahunPilihan.value}`);
    if (data.success) {
      statistik.value = data.data;
      await nextTick();
      renderChart(data.data.bulanan);
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── Carta Bar Chart.js ──
const renderChart = (bulanan) => {
  if (chartInstance) chartInstance.destroy();
  const labels = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Pemasukan (+)',
          data: bulanan.map(b => b.masuk),
          backgroundColor: '#059669',
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
        {
          label: 'Perbelanjaan (-)',
          data: bulanan.map(b => b.keluar),
          backgroundColor: '#e11d48',
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#4b5563', font: { family: "'Inter', sans-serif", size: 12, weight: 'bold' }, usePointStyle: true, boxWidth: 8 } },
        tooltip: { backgroundColor: '#1f2937', titleFont: { family: "'Inter', sans-serif", size: 13 }, bodyFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' }, padding: 12, callbacks: { label: ctx => ` RM ${ctx.parsed.y.toFixed(2)}` } }
      },
      scales: {
        x: { ticks: { color: '#6b7280', font: { family: "'Inter', sans-serif" } }, grid: { display: false } },
        y: { ticks: { color: '#6b7280', font: { family: "'Inter', sans-serif" }, callback: v => 'RM ' + v }, grid: { color: '#f3f4f6', drawBorder: false } },
      },
    },
  });
};

// ── Muatkan Transaksi ──
const muatTransaksi = async () => {
  transaksiLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: halamanSemasa.value,
      limit: 20,
      ...(filterJenis.value && { jenis: filterJenis.value }),
      ...(carian.value && { cari: carian.value }),
    });
    const { data } = await api.get(`/admin/kewangan/transaksi?${params}`);
    if (data.success) {
      transaksi.value = data.data;
      meta.value = data.meta;
    }
  } catch (e) { console.error(e); }
  finally { transaksiLoading.value = false; }
};

const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    halamanSemasa.value = 1;
    muatTransaksi();
  }, 400);
};

// ── Simpan Rekod Keluar ──
const simpanKeluar = async () => {
  if (!formKeluar.value.amaun || parseFloat(formKeluar.value.amaun) <= 0) return;
  if (formKeluar.value.kategori === 'KEBAJIKAN' && !formKeluar.value.no_kp_pihak) return alert('Sila pilih Ahli Kelab');
  if (formKeluar.value.kategori !== 'KEBAJIKAN' && !formKeluar.value.penerima_bayaran) return alert('Sila masukkan nama Vendor / Penerima');

  savingKeluar.value = true;
  try {
    const { data } = await api.post('/admin/kewangan/keluar', formKeluar.value);
    if (data.success) {
      showModalKeluar.value = false;
      formKeluar.value = { kategori: 'KEBAJIKAN', amaun: '', rujukan: '', nota: '', no_kp_pihak: '', penerima_bayaran: '' };
      await muatData();
      await muatTransaksi();
      alert("Rekod perbelanjaan berjaya disimpan.");
    }
  } catch (e) { 
    alert(e.response?.data?.message || "Gagal menyimpan rekod perbelanjaan.");
  }
  finally { savingKeluar.value = false; }
};

const eksportCSV = () => { window.open(`${import.meta.env.VITE_API_URL}/admin/kewangan/eksport?tahun=${tahunPilihan.value}`, '_blank'); };

// ============================================================
// PENYATA KEWANGAN TAHUNAN (cetak)
// ============================================================
const cetakPenyataTahunan = async () => {
  menjanaPenyata.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/penyata-tahunan?tahun=${tahunPilihan.value}`);
    if (!data.success) throw new Error();
    const d = data.data;
    const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });
    const rm = (v) => 'RM ' + parseFloat(v||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const barisPendapatan = d.pendapatan.length
      ? d.pendapatan.map(r => `<tr><td>${labelKat(r.kategori)}</td><td style="text-align:center">${r.bil}</td><td style="text-align:right">${rm(r.jumlah)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:#999">Tiada rekod pendapatan.</td></tr>`;
    const barisPerbelanjaan = d.perbelanjaan.length
      ? d.perbelanjaan.map(r => `<tr><td>${labelKat(r.kategori)}</td><td style="text-align:center">${r.bil}</td><td style="text-align:right">${rm(r.jumlah)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:#999">Tiada rekod perbelanjaan.</td></tr>`;

    const w = window.open('', '_blank', 'width=850,height=700');
    w.document.write(`<html><head><title>Penyata Kewangan ${d.tahun}</title><style>
      body{font-family:Arial;padding:34px;color:#222;max-width:720px;margin:auto}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:6px}
      th{background:#0F4C3A;color:#fff;padding:7px 10px;text-align:left;font-size:11px;text-transform:uppercase}
      td{padding:6px 10px;border-bottom:1px solid #eee}
      h2.sek{font-size:13px;color:#0F4C3A;margin:22px 0 8px;border-bottom:2px solid #0F4C3A;padding-bottom:4px}
      tr.jum td{font-weight:bold;background:#f0f7f4;border-top:2px solid #0F4C3A}
      .ringkas{margin-top:24px;border:2px solid #0F4C3A;border-radius:10px;overflow:hidden}
      .ringkas .r{display:flex;justify-content:space-between;padding:9px 16px;font-size:13px;border-bottom:1px solid #eee}
      .ringkas .r:last-child{border-bottom:none}
      .ringkas .akhir{background:#0F4C3A;color:#fff;font-weight:bold;font-size:15px}
      .pos{color:#0F4C3A;font-weight:bold}.neg{color:#b91c1c;font-weight:bold}
    </style></head><body>
    ${headerResitHTML(`Penyata Kewangan Tahunan &bull; Tahun ${d.tahun} &bull; Dicetak: ${tarikhCetak}`)}
    <h2 class="sek">A. PENDAPATAN / PERUNTUKAN MASUK</h2>
    <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
    <tbody>${barisPendapatan}<tr class="jum"><td>JUMLAH PENDAPATAN</td><td></td><td style="text-align:right">${rm(d.jumlah_pendapatan)}</td></tr></tbody></table>
    <h2 class="sek">B. PERBELANJAAN</h2>
    <table><thead><tr><th>Kategori</th><th style="text-align:center">Bil. Transaksi</th><th style="text-align:right">Jumlah (RM)</th></tr></thead>
    <tbody>${barisPerbelanjaan}<tr class="jum"><td>JUMLAH PERBELANJAAN</td><td></td><td style="text-align:right">${rm(d.jumlah_perbelanjaan)}</td></tr></tbody></table>
    <div class="ringkas">
      <div class="r"><span>Baki Bawa Ke Hadapan (sebelum ${d.tahun})</span><span>${rm(d.baki_bawa)}</span></div>
      <div class="r"><span>Jumlah Pendapatan ${d.tahun}</span><span class="pos">${rm(d.jumlah_pendapatan)}</span></div>
      <div class="r"><span>Jumlah Perbelanjaan ${d.tahun}</span><span class="neg">${rm(d.jumlah_perbelanjaan)}</span></div>
      <div class="r"><span>Lebihan / (Kurangan) Tahun Semasa</span><span class="${d.lebihan_kurangan>=0?'pos':'neg'}">${rm(d.lebihan_kurangan)}</span></div>
      <div class="r akhir"><span>BAKI AKHIR TERKUMPUL</span><span>${rm(d.baki_akhir)}</span></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:46px;font-size:11px;color:#444">
      <div style="text-align:center">________________________<br/>Disediakan oleh (Bendahari)</div>
      <div style="text-align:center">________________________<br/>Disahkan oleh (Pengerusi)</div>
    </div>
    ${footerResitHTML()}
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  } catch (e) {
    alert('Gagal menjana penyata tahunan.');
  } finally {
    menjanaPenyata.value = false;
  }
};

// ============================================================
// KUTIPAN SUMBANGAN
// ============================================================
const bukaSumbangan = async () => {
  showModalSumbangan.value = true;
  await muatSumbangan();
};

const muatSumbangan = async () => {
  loadingSumbangan.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/sumbangan?tahun=${tahunPilihan.value}`);
    if (data.success) { senaraiSumbangan.value = data.data; jumlahSumbangan.value = data.jumlah; }
  } catch (e) { console.error(e); }
  finally { loadingSumbangan.value = false; }
};

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

// Penghurai CSV ringkas (sokong medan dalam petikan)
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

    // Langkau baris tajuk jika lajur pertama bukan nombor pada lajur amaun
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
    if (senarai.length === 0) return alert('Tiada data sah dijumpai dalam CSV. Pastikan format: nama, amaun, program, tarikh.');
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
  } finally {
    e.target.value = ''; // reset input
  }
};

const cetakSumbangan = () => {
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });
  const rm = (v) => 'RM ' + parseFloat(v||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const baris = senaraiSumbangan.value
    .map((s, i) => `<tr><td style="text-align:center">${i+1}</td><td>${s.nama_penyumbang}</td><td>${s.program||'—'}</td><td>${s.tarikh}</td><td style="text-align:right">${rm(s.amaun)}</td></tr>`)
    .join('');
  const w = window.open('', '_blank', 'width=850,height=700');
  w.document.write(`<html><head><title>Laporan Kutipan Sumbangan ${tahunPilihan.value}</title><style>
    body{font-family:Arial;padding:34px;color:#222;max-width:720px;margin:auto}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#0F4C3A;color:#fff;padding:7px 10px;text-align:left;font-size:11px;text-transform:uppercase}
    td{padding:6px 10px;border-bottom:1px solid #eee}
    tr.jum td{font-weight:bold;background:#f0f7f4;border-top:2px solid #0F4C3A;font-size:13px}
  </style></head><body>
  ${headerResitHTML(`Laporan Kutipan Sumbangan &bull; Tahun ${tahunPilihan.value} &bull; Dicetak: ${tarikhCetak}`)}
  <table><thead><tr><th style="width:36px;text-align:center">#</th><th>Nama Penyumbang</th><th>Program / Tujuan</th><th>Tarikh</th><th style="text-align:right">Amaun (RM)</th></tr></thead>
  <tbody>${baris}<tr class="jum"><td colspan="4">JUMLAH KESELURUHAN KUTIPAN (${senaraiSumbangan.value.length} penyumbang)</td><td style="text-align:right">${rm(jumlahSumbangan.value)}</td></tr></tbody></table>
  ${footerResitHTML()}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

onMounted(() => {
  muatSenaraiAhli();
  muatData();
  muatTransaksi();
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>