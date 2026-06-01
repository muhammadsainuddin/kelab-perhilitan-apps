<template>
  <div style="font-family: Tahoma, 'Segoe UI', Arial, sans-serif" class="text-xs text-gray-800 pb-10">

    <!-- ══════════════════════ HEADER ══════════════════════ -->
    <div class="mb-5">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h2 class="text-gray-900 font-bold text-xl tracking-tight">Pengurusan Kedai</h2>
          <p class="text-gray-500 text-xs mt-0.5">Inventori produk · Tempahan ahli · Penjual berdaftar</p>
        </div>
        <button @click="bukaModalProduk(null)"
          class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          Tambah Produk
        </button>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk Aktif</p>
          <p class="text-2xl font-black text-[#0F4C3A] mt-0.5">{{ produkAktif }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">daripada {{ produk.length }} produk</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Hari Ini</p>
          <p class="text-2xl font-black text-amber-600 mt-0.5">{{ pesananHariIni }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">{{ pesanan.length }} jumlah keseluruhan</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jualan Hari Ini</p>
          <p class="text-2xl font-black text-emerald-600 mt-0.5">RM {{ jualanHariIni }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">DIBAYAR / SELESAI</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Penjual Aktif</p>
          <p class="text-2xl font-black text-blue-600 mt-0.5">{{ penjualAktifCom }}</p>
          <p class="text-[10px] text-amber-600 mt-0.5 font-bold" v-if="penjualPending > 0">{{ penjualPending }} menunggu kelulusan</p>
          <p class="text-[10px] text-gray-400 mt-0.5" v-else>tiada permohonan baharu</p>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ TABS ══════════════════════ -->
    <div class="flex bg-gray-100 rounded-xl p-1 w-fit border border-gray-200 mb-5">
      <button v-for="tab in tabs" :key="tab.id" @click="tukarTab(tab.id)"
        :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
          tabAktif===tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        {{ tab.label }}
        <span v-if="tab.id==='penjual' && penjualPending > 0"
          class="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center">{{ penjualPending }}</span>
      </button>
    </div>

    <!-- ══════════════════════ TAB: INVENTORI ══════════════════════ -->
    <div v-if="tabAktif==='produk'">
      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="carianProduk" type="text" placeholder="Cari produk..."
            class="w-full bg-white border border-gray-200 text-gray-800 text-xs rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] placeholder-gray-400"/>
        </div>
        <select v-model="filterStatusProduk" class="bg-white border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0F4C3A] font-bold">
          <option value="">Semua Status</option>
          <option value="AKTIF">Aktif sahaja</option>
          <option value="HABIS">Habis / Ditutup</option>
        </select>
      </div>

      <div v-if="loadingProduk" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div v-for="i in 10" :key="i" class="h-56 rounded-xl bg-gray-100 animate-pulse"/>
      </div>
      <p v-else-if="produkTertapis.length===0" class="text-center py-16 text-gray-400 text-sm">
        Tiada produk dijumpai. Klik "Tambah Produk" untuk mulakan.
      </p>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div v-for="prod in produkTertapis" :key="prod.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col group">
          <!-- Gambar -->
          <div class="relative bg-gray-50 overflow-hidden" style="aspect-ratio:4/3">
            <img v-if="gambarUtama(prod)" :src="apiBase + gambarUtama(prod)" :alt="prod.nama_produk"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <!-- Badges -->
            <div class="absolute top-1.5 left-1.5 flex flex-col gap-1">
              <span v-if="prod.is_percuma" class="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-900">PERCUMA</span>
              <span v-if="prod.is_preorder" class="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-500 text-white">PRE</span>
            </div>
            <span :class="['absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md',
              prod.status==='AKTIF' ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600']">{{ prod.status }}</span>
            <!-- Margin badge -->
            <span v-if="marginProduk(prod)" :class="['absolute bottom-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md', margColor(prod)]">
              +{{ marginProduk(prod) }}%
            </span>
          </div>
          <!-- Info -->
          <div class="p-2.5 flex-1 flex flex-col justify-between gap-1.5">
            <p class="text-gray-900 text-[11px] font-bold line-clamp-2 leading-tight">{{ prod.nama_produk }}</p>
            <div>
              <div v-if="prod.is_percuma">
                <p class="text-amber-600 text-[11px] font-black">PERCUMA</p>
                <p class="text-gray-400 text-[10px]">Stok: {{ stokProduk(prod) }}</p>
              </div>
              <div v-else-if="prod.is_variasi">
                <p class="text-[#0F4C3A] text-[10px] font-bold">{{ parseVariasi(prod.variasi_data).length }} Variasi</p>
              </div>
              <div v-else>
                <p class="text-[#0F4C3A] text-[11px] font-black">RM {{ fmtRM(prod.harga) }}</p>
                <p v-if="prod.harga_modal" class="text-gray-400 text-[10px]">Modal: RM {{ fmtRM(prod.harga_modal) }}</p>
                <p class="text-gray-400 text-[10px]">Stok: {{ prod.stok_semasa }}</p>
              </div>
            </div>
          </div>
          <!-- Aksi -->
          <div class="flex border-t border-gray-100 shrink-0">
            <button @click="bukaModalProduk(prod)" class="flex-1 py-2 text-[10px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[#0F4C3A] transition-colors">Edit</button>
            <div class="w-px bg-gray-100"/>
            <button @click="padamProduk(prod.id)" class="flex-1 py-2 text-[10px] font-bold text-red-400 hover:bg-red-50 transition-colors">Padam</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ TAB: PESANAN ══════════════════════ -->
    <div v-if="tabAktif==='pesanan'">

      <!-- Notis Caj -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p class="text-amber-800 text-[11px] font-bold">Caj FPX ToyyibPay — RM1.00</p>
            <p class="text-amber-700 text-[10px] mt-0.5">Direkod secara automatik sebagai perbelanjaan operasi apabila bayaran berjaya.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p class="text-purple-800 text-[11px] font-bold">Komisyen Kelab Sukan — RM1.00</p>
            <p class="text-purple-700 text-[10px] mt-0.5">Bayaran penggunaan platform Marketplace bagi setiap transaksi penjual berdaftar.</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 mb-3 items-start sm:items-center justify-between">
        <div class="flex gap-1.5 flex-wrap">
          <button v-for="s in statusPesanan" :key="s.v" @click="filterPesanan=s.v"
            :class="['text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors',
              filterPesanan===s.v ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
            {{ s.l }}
            <span v-if="s.v" class="ml-1 opacity-70">({{ pesanan.filter(p=>p.status_pesanan===s.v).length }})</span>
          </button>
        </div>
        <div class="flex gap-1.5">
          <button @click="bukaLaporanKilang" class="flex items-center gap-1.5 text-[10px] text-white bg-[#0F4C3A] hover:bg-[#155d47] px-3 py-2 rounded-xl font-bold">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Laporan Kilang
          </button>
          <button @click="cetakSemua" class="flex items-center gap-1.5 text-[10px] text-[#0F4C3A] bg-white hover:bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 font-bold">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Cetak Senarai
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100 bg-gray-50">
                <th class="text-left px-4 py-3 font-bold">#</th>
                <th class="text-left px-4 py-3 font-bold">Ahli</th>
                <th class="text-left px-4 py-3 font-bold">Produk</th>
                <th class="text-left px-4 py-3 font-bold hidden md:table-cell">Tarikh</th>
                <th class="text-right px-4 py-3 font-bold">Jumlah</th>
                <th class="text-center px-4 py-3 font-bold">Status</th>
                <th class="text-center px-4 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingPesanan"><td colspan="7" class="px-4 py-8 text-center text-gray-400">Memuatkan...</td></tr>
              <tr v-else-if="pesananTertapis.length===0"><td colspan="7" class="px-4 py-10 text-center text-gray-400">Tiada pesanan untuk status ini.</td></tr>
              <tr v-for="p in pesananTertapis" :key="p.id" class="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td class="px-4 py-3 text-amber-600 font-mono text-xs font-black">#{{ p.id }}</td>
                <td class="px-4 py-3">
                  <p class="font-bold text-gray-900 text-[11px]">{{ p.nama_ahli || '—' }}</p>
                  <p class="text-gray-400 text-[10px] font-mono">{{ p.no_kp }}</p>
                  <p v-if="p.ptj" class="text-gray-400 text-[10px] truncate max-w-[140px]">{{ p.ptj }}</p>
                  <span class="mt-0.5 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded"
                    :class="p.kaedah_penghantaran === 'POS' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                    {{ p.kaedah_penghantaran === 'POS' ? 'Pos' : 'PTJ' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div v-for="item in p.items" :key="item.nama_produk" class="text-gray-600 text-[10px] leading-relaxed">
                    {{ item.nama_produk }}<span v-if="item.saiz" class="text-[#0F4C3A] font-bold"> ({{ item.saiz }})</span> ×{{ item.kuantiti }}
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-400 text-[10px] hidden md:table-cell whitespace-nowrap">{{ p.tarikh_pesanan }}</td>
                <td class="px-4 py-3 text-right">
                  <span v-if="p.is_percuma" class="text-amber-600 text-[10px] font-black">PERCUMA</span>
                  <span v-else class="font-black text-gray-900 text-[11px]">RM {{ fmtRM(p.jumlah_keseluruhan) }}</span>
                  <p v-if="!p.is_percuma && ['DIBAYAR','DIPROSES','SELESAI'].includes(p.status_pesanan)"
                    class="text-[9px] text-amber-600 font-bold">Caj FPX: -RM1.00</p>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="['text-[9px] font-black uppercase px-2 py-0.5 rounded-full', badgePesanan(p.status_pesanan)]">{{ p.status_pesanan }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="bukaTempahan(p)" class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-2.5 py-1.5 rounded-lg border border-[#0F4C3A]/20">Detail</button>
                    <select v-if="['PENDING','DIBAYAR','DIPROSES'].includes(p.status_pesanan)"
                      @change="e=>kemaskiniStatus(p.id,e.target.value)" :value="p.status_pesanan"
                      class="text-[10px] border font-bold border-gray-200 text-gray-700 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#0F4C3A]">
                      <option value="PENDING">PENDING</option>
                      <option value="DIBAYAR">DIBAYAR</option>
                      <option value="DIPROSES">DIPROSES</option>
                      <option value="SELESAI">SELESAI</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ TAB: PENJUAL ══════════════════════ -->
    <div v-if="tabAktif==='penjual'">

      <!-- Info permohonan ahli -->
      <div class="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
        <svg class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div>
          <p class="text-blue-800 text-[11px] font-bold">Pendaftaran Penjual Marketplace</p>
          <p class="text-blue-700 text-[10px] mt-0.5 leading-relaxed">
            Ahli daftar melalui tab "Daftar Jual" dalam paparan Kedai mereka. Permohonan perlu <strong>diaktifkan oleh Admin</strong> sebelum boleh menjual.
            Caj dikenakan bagi setiap transaksi: <strong>RM1.00 FPX (ToyyibPay)</strong> + <strong>RM1.00 Komisyen Kelab</strong>.
            Penghantaran: <strong>ke PTJ (percuma)</strong> atau <strong>Pos Malaysia (+RM8.00)</strong> — dipilih oleh pembeli.
          </p>
        </div>
      </div>

      <div class="flex gap-1.5 mb-3 flex-wrap">
        <button v-for="s in statusPenjualF" :key="s.v" @click="filterPenjual=s.v"
          :class="['text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors',
            filterPenjual===s.v ? badgePenjualTab(s.v) : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">
          {{ s.l }} ({{ s.v === '' ? penjual.length : penjual.filter(p=>p.status===s.v).length }})
        </button>
      </div>

      <div v-if="loadingPenjual" class="text-center py-8 text-gray-400">Memuatkan...</div>
      <p v-else-if="penjualTertapis.length===0" class="text-center py-10 text-gray-400">Tiada permohonan penjual.</p>

      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table class="w-full text-xs">
          <thead>
            <tr class="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100 bg-gray-50">
              <th class="text-left px-4 py-3 font-bold">#</th>
              <th class="text-left px-4 py-3 font-bold">Pemohon</th>
              <th class="text-left px-4 py-3 font-bold">Nama Perniagaan</th>
              <th class="text-left px-4 py-3 font-bold hidden md:table-cell">Jenis Produk</th>
              <th class="text-left px-4 py-3 font-bold hidden lg:table-cell">Tarikh Daftar</th>
              <th class="text-center px-4 py-3 font-bold">Status</th>
              <th class="text-center px-4 py-3 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pj in penjualTertapis" :key="pj.id" class="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
              <td class="px-4 py-3 text-gray-400 font-mono text-[10px]">{{ pj.id }}</td>
              <td class="px-4 py-3">
                <p class="font-bold text-gray-900 text-[11px]">{{ pj.nama_pegawai || pj.no_kp }}</p>
                <p class="text-gray-400 text-[10px] font-mono">{{ pj.no_kp }}</p>
                <p v-if="pj.ptj" class="text-gray-400 text-[10px]">{{ pj.ptj }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="font-bold text-gray-900 text-[11px]">{{ pj.nama_perniagaan }}</p>
                <p v-if="pj.bil_produk > 0" class="text-[#0F4C3A] text-[10px] font-bold">{{ pj.bil_produk }} produk aktif</p>
              </td>
              <td class="px-4 py-3 text-gray-500 hidden md:table-cell">{{ pj.jenis_produk || '—' }}</td>
              <td class="px-4 py-3 text-gray-400 text-[10px] hidden lg:table-cell whitespace-nowrap">{{ pj.tarikh_daftar }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="['text-[9px] font-black uppercase px-2 py-0.5 rounded-full', badgePenjual(pj.status)]">{{ pj.status }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="bukaPenjualDetail(pj)" class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-2.5 py-1.5 rounded-lg border border-[#0F4C3A]/20">Urus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════ MODAL: PRODUK (FULL SCREEN) ══════════ -->
    <Teleport to="body">
      <Transition name="fs-fade">
        <div v-if="showModalProduk" class="fixed inset-0 z-[200] flex flex-col bg-gray-50">
          <!-- Header bar -->
          <div :class="['flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white shadow-sm shrink-0']">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#0F4C3A]/10 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <div>
                <p class="text-gray-900 font-bold text-sm">{{ formProduk.id ? 'Kemaskini Produk' : 'Tambah Produk Baharu' }}</p>
                <p class="text-gray-400 text-[10px]">{{ formProduk.id ? 'Edit maklumat produk sedia ada' : 'Isi maklumat produk untuk dijual' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="showModalProduk=false" class="px-4 py-2 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">Batal</button>
              <button @click="simpanProduk" :disabled="savingProduk"
                class="px-5 py-2 text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#155d47] rounded-xl transition-colors disabled:opacity-50 shadow-sm">
                {{ savingProduk ? 'Menyimpan...' : (formProduk.id ? 'Kemaskini' : 'Simpan Produk') }}
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto">
            <div class="max-w-5xl mx-auto p-5 lg:p-8">
              <div class="flex flex-col lg:flex-row gap-6">

                <!-- Kiri: Form -->
                <div class="flex-1 space-y-5">

                  <!-- Nama Produk -->
                  <div>
                    <label class="field-label">Nama Produk *</label>
                    <input v-model="formProduk.nama_produk" type="text" placeholder="Cth: Baju Kelab Perhilitan 2025"
                      class="field-input"/>
                    <p class="text-[10px] text-gray-400 mt-1">Gunakan nama yang jelas dan mudah difahami oleh ahli.</p>
                  </div>

                  <!-- Toggle Ciri-ciri -->
                  <div>
                    <label class="field-label">Ciri-ciri Produk</label>
                    <div class="grid grid-cols-3 gap-2">
                      <label class="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-100 cursor-pointer">
                        <input v-model="formProduk.is_percuma" type="checkbox" class="accent-amber-500 w-3.5 h-3.5"/>
                        <span class="text-[11px] font-bold text-amber-800">PERCUMA</span>
                      </label>
                      <label class="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5 border border-blue-100 cursor-pointer">
                        <input v-model="formProduk.is_preorder" type="checkbox" class="accent-blue-500 w-3.5 h-3.5"/>
                        <span class="text-[11px] font-bold text-blue-800">Preorder</span>
                      </label>
                      <label class="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2.5 border border-purple-100 cursor-pointer">
                        <input v-model="formProduk.is_variasi" type="checkbox" class="accent-purple-600 w-3.5 h-3.5"/>
                        <span class="text-[11px] font-bold text-purple-800">Ada Variasi</span>
                      </label>
                    </div>
                    <p v-if="formProduk.is_percuma" class="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-2 font-medium">
                      Item PERCUMA hanya untuk ahli aktif — had 1 unit setiap ahli.
                    </p>
                  </div>

                  <!-- Harga + Modal (tanpa variasi) -->
                  <div v-if="!formProduk.is_variasi" class="bg-gray-100/60 rounded-xl p-4 border border-gray-200 space-y-3">
                    <label class="field-label">Maklumat Harga & Stok</label>
                    <div class="grid grid-cols-2 gap-3">
                      <div v-if="!formProduk.is_percuma">
                        <label class="field-label">Harga Jual (RM) *</label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">RM</span>
                          <input v-model="formProduk.harga" type="number" min="0" step="0.50" placeholder="0.00"
                            class="field-input pl-9"/>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-1">Harga yang ahli bayar.</p>
                      </div>
                      <div v-if="!formProduk.is_percuma">
                        <label class="field-label">Harga Modal (RM)</label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">RM</span>
                          <input v-model="formProduk.harga_modal" type="number" min="0" step="0.50" placeholder="0.00"
                            class="field-input pl-9"/>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-1">Kos belian / pengeluaran.</p>
                      </div>
                      <div :class="formProduk.is_percuma ? 'col-span-2' : ''">
                        <label class="field-label">Stok Semasa</label>
                        <input v-model="formProduk.stok_semasa" type="number" min="0" placeholder="0"
                          class="field-input"/>
                      </div>
                      <div :class="formProduk.is_percuma ? 'col-span-2' : ''">
                        <label class="field-label">Saiz Tersedia <span class="normal-case font-normal text-gray-400">(pisah koma)</span></label>
                        <input v-model="formProduk.saiz_tersedia" type="text" placeholder="Cth: S, M, L, XL"
                          class="field-input"/>
                      </div>
                    </div>
                  </div>

                  <!-- Variasi -->
                  <div v-if="formProduk.is_variasi" class="bg-gray-100/60 p-4 rounded-xl border border-gray-200 space-y-3">
                    <div class="flex justify-between items-center">
                      <label class="field-label">{{ formProduk.is_percuma ? 'Saiz & Stok' : 'Senarai Variasi / Pakej' }}</label>
                      <button @click="tambahVariasi" type="button"
                        class="text-[10px] bg-[#0F4C3A] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#166b52]">
                        + Tambah {{ formProduk.is_percuma ? 'Saiz' : 'Variasi' }}
                      </button>
                    </div>
                    <!-- Header row -->
                    <div :class="['grid gap-1.5 text-[9px] font-bold text-gray-400 uppercase px-1', formProduk.is_percuma ? 'grid-cols-[1fr_60px_16px]' : 'grid-cols-[1fr_72px_72px_60px_16px]']">
                      <span>Nama</span>
                      <span v-if="!formProduk.is_percuma" class="text-center">Harga Jual</span>
                      <span v-if="!formProduk.is_percuma" class="text-center">Harga Modal</span>
                      <span class="text-center">Stok</span>
                    </div>
                    <div v-for="(v, idx) in formProduk.variasi_data" :key="idx"
                      class="flex gap-1.5 items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                      <input v-model="v.nama" type="text"
                        :placeholder="formProduk.is_percuma ? 'Cth: Saiz M' : 'Cth: 10 Keping / XL'"
                        class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-[11px] font-bold focus:border-[#0F4C3A] outline-none"/>
                      <input v-if="!formProduk.is_percuma" v-model="v.harga" type="number" step="0.50" placeholder="RM"
                        class="w-[68px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-bold focus:border-[#0F4C3A] outline-none text-center"/>
                      <input v-if="!formProduk.is_percuma" v-model="v.harga_modal" type="number" step="0.50" placeholder="Modal"
                        class="w-[68px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-bold focus:border-emerald-400 outline-none text-center"/>
                      <input v-model="v.stok" type="number" placeholder="Stok"
                        class="w-14 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-bold focus:border-[#0F4C3A] outline-none text-center"/>
                      <button @click="buangVariasi(idx)" type="button"
                        class="text-red-400 hover:bg-red-50 p-1.5 rounded-lg shrink-0">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <p v-if="formProduk.variasi_data.length===0" class="text-[10px] text-rose-500 font-bold italic">Tambah sekurang-kurangnya 1 variasi.</p>
                  </div>

                  <!-- Preorder date -->
                  <div v-if="formProduk.is_preorder">
                    <label class="field-label">Tarikh Tutup Preorder</label>
                    <input v-model="formProduk.tarikh_tutup_preorder" type="date" class="field-input"/>
                  </div>

                  <!-- Penjual (linked seller) -->
                  <div v-if="penjualAktifList.length > 0">
                    <label class="field-label">Penjual <span class="normal-case font-normal text-gray-400">(Pilihan — hubungkan dengan penjual berdaftar)</span></label>
                    <select v-model="formProduk.penjual_id" class="field-input">
                      <option :value="null">— Produk Kelab (tiada penjual) —</option>
                      <option v-for="pj in penjualAktifList" :key="pj.id" :value="pj.id">{{ pj.nama_perniagaan }} ({{ pj.nama_pegawai || pj.no_kp }})</option>
                    </select>
                  </div>

                  <!-- Deskripsi -->
                  <div>
                    <label class="field-label">Deskripsi / Keterangan Lanjut</label>
                    <textarea v-model="formProduk.deskripsi" rows="4" placeholder="Huraian produk, ciri-ciri, dan maklumat tambahan..."
                      class="field-input resize-none"/>
                  </div>

                  <!-- Upload Gambar -->
                  <div>
                    <label class="field-label">Gambar Produk <span class="normal-case font-normal text-gray-400">(Max 6 gambar)</span></label>
                    <div class="border border-dashed border-gray-300 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors text-center cursor-pointer" @click="$refs.fileInput.click()">
                      <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <p class="text-xs text-gray-500 font-medium">Klik untuk pilih gambar</p>
                      <p class="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP — Max 6 gambar</p>
                      <input ref="fileInput" type="file" @change="handleFiles" accept="image/*" multiple class="hidden"/>
                    </div>
                    <!-- Preview -->
                    <div v-if="previewGambar.length > 0" class="grid grid-cols-4 gap-2 mt-3">
                      <div v-for="(url, i) in previewGambar" :key="i" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img :src="url" class="w-full h-full object-cover"/>
                        <button @click.stop="buangGambar(i)" type="button"
                          class="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">×</button>
                        <span v-if="i===0" class="absolute bottom-1 left-1 bg-[#0F4C3A] text-white text-[8px] font-bold px-1 rounded">UTAMA</span>
                      </div>
                    </div>
                    <!-- Existing images (edit mode) -->
                    <div v-if="formProduk.id && gambarSedia.length > 0 && previewGambar.length === 0" class="mt-3">
                      <p class="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">Gambar Sedia Ada</p>
                      <div class="grid grid-cols-4 gap-2">
                        <div v-for="(g, i) in gambarSedia" :key="i" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img :src="apiBase + g" class="w-full h-full object-cover"/>
                          <span v-if="i===0" class="absolute bottom-1 left-1 bg-[#0F4C3A] text-white text-[8px] font-bold px-1 rounded">UTAMA</span>
                        </div>
                      </div>
                      <p class="text-[10px] text-gray-400 mt-1">Muat naik gambar baharu untuk menggantikan.</p>
                    </div>
                  </div>

                  <!-- Status (edit mode) -->
                  <div v-if="formProduk.id">
                    <label class="field-label">Status Penjualan</label>
                    <select v-model="formProduk.status" class="field-input">
                      <option value="AKTIF">AKTIF — Boleh dibeli oleh ahli</option>
                      <option value="HABIS">HABIS / DITUTUP — Tidak dipapar</option>
                    </select>
                  </div>

                  <p v-if="ralatProduk" class="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">{{ ralatProduk }}</p>
                </div>

                <!-- Kanan: Preview / Panduan -->
                <div class="lg:w-64 xl:w-72 shrink-0">
                  <div class="sticky top-5 space-y-4">

                    <!-- Analisis Untung -->
                    <div v-if="!formProduk.is_percuma && !formProduk.is_variasi && formProduk.harga"
                      class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Analisis Keuntungan</p>
                      <div class="space-y-2">
                        <div class="flex justify-between text-[11px]">
                          <span class="text-gray-500">Harga Jual</span>
                          <span class="font-black text-gray-900">RM {{ fmtRM(formProduk.harga) }}</span>
                        </div>
                        <div v-if="formProduk.harga_modal" class="flex justify-between text-[11px]">
                          <span class="text-gray-500">Harga Modal</span>
                          <span class="font-black text-gray-700">- RM {{ fmtRM(formProduk.harga_modal) }}</span>
                        </div>
                        <div class="flex justify-between text-[11px]">
                          <span class="text-gray-500">Caj FPX ToyyibPay</span>
                          <span class="font-black text-amber-600">- RM 1.00</span>
                        </div>
                        <div class="border-t border-gray-100 pt-2">
                          <div class="flex justify-between text-[11px]">
                            <span class="text-gray-600 font-bold">Untung Kasar</span>
                            <span :class="['font-black', untungKasar >= 0 ? 'text-emerald-600' : 'text-red-600']">
                              RM {{ fmtRM(untungKasar) }}
                            </span>
                          </div>
                          <div class="flex justify-between text-[11px] mt-1">
                            <span class="text-gray-600 font-bold">Untung Bersih (tolak FPX)</span>
                            <span :class="['font-black', untungBersih >= 0 ? 'text-[#0F4C3A]' : 'text-red-600']">
                              RM {{ fmtRM(untungBersih) }}
                            </span>
                          </div>
                          <div v-if="marginPeratus !== null" class="mt-2 text-center">
                            <span :class="['text-xs font-black px-3 py-1 rounded-full', marginPeratus >= 30 ? 'bg-green-100 text-green-700' : marginPeratus >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700']">
                              Margin {{ marginPeratus }}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Panduan Pengisian -->
                    <div class="bg-[#0F4C3A]/5 border border-[#0F4C3A]/20 rounded-xl p-4">
                      <p class="text-[10px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-2">Panduan Pengisian</p>
                      <ul class="space-y-1.5 text-[10px] text-gray-600">
                        <li class="flex gap-1.5"><span class="text-[#0F4C3A] font-black shrink-0">•</span> <span><strong>Harga Modal</strong> adalah kos membeli atau menghasilkan produk.</span></li>
                        <li class="flex gap-1.5"><span class="text-[#0F4C3A] font-black shrink-0">•</span> <span><strong>Caj FPX RM1</strong> dikenakan oleh ToyyibPay bagi setiap transaksi bayaran.</span></li>
                        <li class="flex gap-1.5"><span class="text-[#0F4C3A] font-black shrink-0">•</span> <span>Gunakan <strong>Variasi</strong> untuk produk dengan pelbagai saiz atau pakej harga berbeza.</span></li>
                        <li class="flex gap-1.5"><span class="text-[#0F4C3A] font-black shrink-0">•</span> <span>Gambar pertama akan dijadikan <strong>gambar utama</strong> produk.</span></li>
                        <li class="flex gap-1.5"><span class="text-[#0F4C3A] font-black shrink-0">•</span> <span>Status <strong>HABIS</strong> menyembunyikan produk daripada paparan ahli.</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════ MODAL: TEMPAHAN DETAIL ══════════ -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showTempahan" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showTempahan=false">
        <div class="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Tempahan #{{ pilihanTempahan?.id }}</h3>
              <span :class="['text-[9px] font-black uppercase px-2 py-0.5 rounded-full', badgePesanan(pilihanTempahan?.status_pesanan)]">{{ pilihanTempahan?.status_pesanan }}</span>
            </div>
            <div class="flex gap-2">
              <button @click="cetakSatu" class="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>Cetak
              </button>
              <button @click="showTempahan=false" class="text-gray-400 hover:text-red-500 p-1.5 rounded-full bg-gray-50"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
          </div>
          <div class="p-5 space-y-3">
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Maklumat Ahli</p>
              <div class="grid grid-cols-2 gap-2">
                <div><p class="text-[9px] font-bold text-gray-400 uppercase">Nama</p><p class="font-bold text-gray-900 text-[11px]">{{ pilihanTempahan?.nama_ahli }}</p></div>
                <div><p class="text-[9px] font-bold text-gray-400 uppercase">No. KP</p><p class="font-bold text-[#0F4C3A] font-mono text-[10px]">{{ pilihanTempahan?.no_kp }}</p></div>
                <div class="col-span-2"><p class="text-[9px] font-bold text-gray-400 uppercase">Tarikh Pesanan</p><p class="font-medium text-gray-700 text-[10px]">{{ pilihanTempahan?.tarikh_pesanan }}</p></div>
              </div>
            </div>

            <!-- Penghantaran -->
            <div class="bg-sky-50 border border-sky-200 rounded-xl p-3.5">
              <p class="text-[9px] font-bold text-sky-600 uppercase tracking-wider mb-2">Kaedah Penghantaran</p>
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full"
                  :class="pilihanTempahan?.kaedah_penghantaran === 'POS' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                  {{ pilihanTempahan?.kaedah_penghantaran === 'POS' ? 'Pos Malaysia' : 'Hantar ke PTJ (Percuma)' }}
                </span>
                <span v-if="pilihanTempahan?.kos_postage > 0" class="text-[10px] font-bold text-amber-700">
                  +RM {{ fmtRM(pilihanTempahan?.kos_postage) }}
                </span>
              </div>
              <div v-if="pilihanTempahan?.kaedah_penghantaran === 'POS' && pilihanTempahan?.alamat_penghantaran" class="mt-2">
                <p class="text-[9px] font-bold text-sky-500 uppercase mb-0.5">Alamat</p>
                <p class="text-[10px] text-sky-900 font-medium leading-relaxed">{{ pilihanTempahan.alamat_penghantaran }}</p>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Item Pembelian</p>
              <div v-for="item in pilihanTempahan?.items" :key="item.nama_produk" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p class="font-bold text-gray-900 text-[11px]">{{ item.nama_produk }}</p>
                  <p v-if="item.saiz" class="text-[9px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 px-1.5 py-0.5 rounded inline-block mt-0.5">{{ item.saiz }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-400 text-[10px] font-bold">× {{ item.kuantiti }}</p>
                  <p class="font-black text-gray-900 text-[11px]">{{ pilihanTempahan?.is_percuma ? 'PERCUMA' : `RM ${fmtRM(item.harga_seunit * item.kuantiti)}` }}</p>
                </div>
              </div>
              <div v-if="!pilihanTempahan?.is_percuma" class="mt-3 pt-3 border-t-2 border-gray-200 space-y-1">
                <div v-if="pilihanTempahan?.kos_postage > 0" class="flex justify-between text-[10px]">
                  <span class="text-gray-500">Kos Postage</span>
                  <span class="font-bold text-amber-600">RM {{ fmtRM(pilihanTempahan?.kos_postage) }}</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Jumlah Bayar (FPX)</span>
                  <span class="font-black text-gray-900">RM {{ fmtRM(pilihanTempahan?.jumlah_keseluruhan) }}</span>
                </div>
                <div v-if="['DIBAYAR','DIPROSES','SELESAI'].includes(pilihanTempahan?.status_pesanan)" class="flex justify-between text-[10px]">
                  <span class="text-amber-600">Caj FPX ToyyibPay</span>
                  <span class="font-bold text-amber-600">- RM 1.00</span>
                </div>
                <div v-if="['DIBAYAR','DIPROSES','SELESAI'].includes(pilihanTempahan?.status_pesanan)" class="flex justify-between text-[10px]">
                  <span class="text-purple-600">Komisyen Kelab Sukan</span>
                  <span class="font-bold text-purple-600">- RM 1.00</span>
                </div>
                <div v-if="['DIBAYAR','DIPROSES','SELESAI'].includes(pilihanTempahan?.status_pesanan)" class="flex justify-between text-[11px] pt-1 border-t border-gray-100">
                  <span class="text-gray-600 font-bold">Bersih Diterima Penjual</span>
                  <span class="font-black text-[#0F4C3A]">RM {{ fmtRM(parseFloat(pilihanTempahan?.jumlah_keseluruhan||0) - parseFloat(pilihanTempahan?.kos_postage||0) - 2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition></Teleport>

    <!-- ══════════ MODAL: LAPORAN KILANG ══════════ -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showLaporanKilang" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showLaporanKilang=false">
        <div class="bg-white rounded-[20px] w-full max-w-lg shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#0F4C3A]/5">
            <div>
              <h3 class="font-bold text-gray-900 text-sm">Laporan Pengeluaran (Kilang)</h3>
              <p class="text-gray-500 text-[10px] mt-0.5">Jana ringkasan saiz untuk dihantar ke kilang.</p>
            </div>
            <button @click="showLaporanKilang=false" class="text-gray-400 hover:text-red-500 bg-gray-50 p-1.5 rounded-full"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="field-label">Pilih Produk *</label>
              <select v-model="produkPilihanLaporan" class="field-input">
                <option value="">— Semua Produk —</option>
                <option v-for="nama in senaraiProdukLaporan" :key="nama" :value="nama">{{ nama }}</option>
              </select>
            </div>
            <label class="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 cursor-pointer">
              <input v-model="ringkasPTJ" type="checkbox" class="accent-[#0F4C3A] w-3.5 h-3.5"/>
              <span class="text-[11px] text-gray-700 font-bold">Sertakan ringkasan pembahagian ikut PTJ</span>
            </label>
            <p class="text-[10px] text-gray-400">Hanya pesanan SAH (Dibayar / Diproses / Selesai) diambilkira.</p>
            <!-- Rekod Kos -->
            <div class="bg-rose-50 border border-rose-100 rounded-xl p-3.5 space-y-2">
              <p class="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Rekod Kos Pengeluaran (Pilihan)</p>
              <p class="text-[10px] text-rose-600">Rekod kos cetakan/kilang sebagai perbelanjaan kelab.</p>
              <div class="flex gap-2 items-center">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">RM</span>
                  <input v-model="kosPengeluaran" type="number" min="0" step="0.01" placeholder="0.00"
                    class="w-full bg-white border border-rose-200 text-rose-700 font-bold rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-rose-400"/>
                </div>
                <button @click="rekodKosPengeluaran" :disabled="merekodKos || !kosPengeluaran"
                  class="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg disabled:opacity-50 whitespace-nowrap">
                  {{ merekodKos ? 'Menyimpan...' : 'Rekod' }}
                </button>
              </div>
              <p v-if="mesejKos" class="text-[10px] font-bold" :class="mesejKosOk ? 'text-emerald-600' : 'text-rose-600'">{{ mesejKos }}</p>
            </div>
          </div>
          <div class="flex gap-2 px-5 py-4 border-t border-gray-100">
            <button @click="showLaporanKilang=false" class="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-bold">Tutup</button>
            <button @click="cetakPengeluaran" class="flex-1 bg-[#0F4C3A] hover:bg-[#155d47] text-white py-2.5 rounded-xl text-xs font-bold">Cetak Laporan</button>
          </div>
        </div>
      </div>
    </Transition></Teleport>

    <!-- ══════════ MODAL: PENJUAL DETAIL ══════════ -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showPenjualDetail" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showPenjualDetail=false">
        <div class="bg-white rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 text-sm">Maklumat Penjual</h3>
            <button @click="showPenjualDetail=false" class="text-gray-400 hover:text-red-500 bg-gray-50 p-1.5 rounded-full"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="p-5 space-y-3" v-if="pilihanPenjual">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#0F4C3A]/10 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <p class="font-black text-gray-900 text-sm">{{ pilihanPenjual.nama_perniagaan }}</p>
                <p class="text-gray-500 text-[10px]">{{ pilihanPenjual.nama_pegawai || pilihanPenjual.no_kp }} · {{ pilihanPenjual.ptj || '—' }}</p>
              </div>
              <span :class="['ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded-full', badgePenjual(pilihanPenjual.status)]">{{ pilihanPenjual.status }}</span>
            </div>

            <div class="bg-gray-50 rounded-xl p-3.5 border border-gray-200 grid grid-cols-2 gap-3">
              <div><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">No. KP</p><p class="font-mono text-[10px] font-bold text-gray-700">{{ pilihanPenjual.no_kp }}</p></div>
              <div><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Telefon</p><p class="text-[10px] font-bold text-gray-700">{{ pilihanPenjual.telefon || '—' }}</p></div>
              <div><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Jenis Produk</p><p class="text-[10px] font-bold text-gray-700">{{ pilihanPenjual.jenis_produk || '—' }}</p></div>
              <div><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Produk Aktif</p><p class="text-[10px] font-black text-[#0F4C3A]">{{ pilihanPenjual.bil_produk }} produk</p></div>
              <div class="col-span-2"><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Tarikh Permohonan</p><p class="text-[10px] font-bold text-gray-700">{{ pilihanPenjual.tarikh_daftar }}</p></div>
              <div v-if="pilihanPenjual.deskripsi" class="col-span-2"><p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Keterangan</p><p class="text-[10px] text-gray-600">{{ pilihanPenjual.deskripsi }}</p></div>
            </div>

            <div v-if="pilihanPenjual.nota_admin && pilihanPenjual.status === 'DITOLAK'" class="bg-red-50 border border-red-100 rounded-xl p-3 text-[10px] text-red-700">
              <p class="font-bold uppercase text-[9px] mb-1">Sebab Penolakan</p>{{ pilihanPenjual.nota_admin }}
            </div>

            <div v-if="pilihanPenjual.status !== 'AKTIF'">
              <label class="field-label">Nota Admin (Pilihan — untuk penolakan)</label>
              <textarea v-model="notaAdmin" rows="2" placeholder="Sebab penolakan atau nota untuk pemohon..."
                class="field-input resize-none"/>
            </div>

            <div class="flex gap-2 pt-2">
              <button v-if="pilihanPenjual.status !== 'AKTIF'" @click="uruskanPenjual('AKTIF')" :disabled="savingPenjual"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold disabled:opacity-50">
                Aktifkan
              </button>
              <button v-if="pilihanPenjual.status !== 'DITOLAK'" @click="uruskanPenjual('DITOLAK')" :disabled="savingPenjual"
                class="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold disabled:opacity-50">
                Tolak Permohonan
              </button>
              <button v-if="pilihanPenjual.status === 'AKTIF'" @click="uruskanPenjual('PENDING')" :disabled="savingPenjual"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50">
                Tangguh Semula
              </button>
            </div>
            <p v-if="mesejPenjual" class="text-[10px] font-bold text-center" :class="mesejPenjualOk ? 'text-emerald-600' : 'text-red-600'">{{ mesejPenjual }}</p>
          </div>
        </div>
      </div>
    </Transition></Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api','');

// ── State ──
const tabAktif  = ref('produk');
const produk    = ref([]);
const pesanan   = ref([]);
const penjual   = ref([]);
const loadingProduk  = ref(true);
const loadingPesanan = ref(true);
const loadingPenjual = ref(false);
const penjualDimuat  = ref(false);

const carianProduk      = ref('');
const filterStatusProduk = ref('');
const filterPesanan     = ref('');
const filterPenjual     = ref('');

// Modal states
const showModalProduk   = ref(false);
const showTempahan      = ref(false);
const showLaporanKilang = ref(false);
const showPenjualDetail = ref(false);
const savingProduk      = ref(false);
const savingPenjual     = ref(false);
const gambarFiles       = ref([]);
const previewGambar     = ref([]);
const gambarSedia       = ref([]);
const ralatProduk       = ref('');
const pilihanTempahan   = ref(null);
const pilihanPenjual    = ref(null);
const notaAdmin         = ref('');
const mesejPenjual      = ref('');
const mesejPenjualOk    = ref(false);
const fileInput         = ref(null);

// Laporan kilang
const produkPilihanLaporan = ref('');
const ringkasPTJ           = ref(true);
const kosPengeluaran       = ref('');
const merekodKos           = ref(false);
const mesejKos             = ref('');
const mesejKosOk           = ref(false);

// Form produk
const formProduk = ref({
  id: null, nama_produk: '', harga: '', harga_modal: '', stok_semasa: 0, deskripsi: '', status: 'AKTIF',
  saiz_tersedia: '', is_percuma: false, is_preorder: false, tarikh_tutup_preorder: '',
  is_variasi: false, variasi_data: [{ nama: '', harga: '', harga_modal: '', stok: '' }],
  penjual_id: null,
});

// ── Tabs ──
const tabs = [
  { id: 'produk',  label: 'Inventori Produk' },
  { id: 'pesanan', label: 'Tempahan Masuk' },
  { id: 'penjual', label: 'Penjual Berdaftar' },
];
const statusPesanan  = [
  { v: '', l: 'Semua' }, { v: 'PENDING', l: 'Pending' }, { v: 'DIBAYAR', l: 'Dibayar' },
  { v: 'DIPROSES', l: 'Diproses' }, { v: 'SELESAI', l: 'Selesai' },
];
const statusPenjualF = [
  { v: '', l: 'Semua' }, { v: 'PENDING', l: 'Menunggu' }, { v: 'AKTIF', l: 'Aktif' }, { v: 'DITOLAK', l: 'Ditolak' },
];

// ── Stats ──
const todayFmt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
const produkAktif  = computed(() => produk.value.filter(p => p.status === 'AKTIF').length);
const pesananHariIni = computed(() => pesanan.value.filter(p => p.tarikh_pesanan?.startsWith(todayFmt)).length);
const jualanHariIni  = computed(() => {
  const t = pesanan.value
    .filter(p => p.tarikh_pesanan?.startsWith(todayFmt) && ['DIBAYAR','DIPROSES','SELESAI'].includes(p.status_pesanan) && !p.is_percuma)
    .reduce((s, p) => s + parseFloat(p.jumlah_keseluruhan || 0), 0);
  return fmtRM(t);
});
const penjualAktifCom = computed(() => penjual.value.filter(p => p.status === 'AKTIF').length);
const penjualPending  = computed(() => penjual.value.filter(p => p.status === 'PENDING').length);
const penjualAktifList = computed(() => penjual.value.filter(p => p.status === 'AKTIF'));

// ── Filters ──
const produkTertapis = computed(() => {
  let list = produk.value;
  if (filterStatusProduk.value) list = list.filter(p => p.status === filterStatusProduk.value);
  if (carianProduk.value) list = list.filter(p => p.nama_produk.toLowerCase().includes(carianProduk.value.toLowerCase()));
  return list;
});
const pesananTertapis = computed(() => !filterPesanan.value ? pesanan.value : pesanan.value.filter(p => p.status_pesanan === filterPesanan.value));
const penjualTertapis = computed(() => !filterPenjual.value ? penjual.value : penjual.value.filter(p => p.status === filterPenjual.value));

// ── Helpers ──
const fmtRM = (v) => parseFloat(v || 0).toFixed(2);
const parseGaleri = (raw) => { try { return JSON.parse(raw || '[]'); } catch { return raw ? [raw] : []; } };
const parseVariasi = (raw) => { try { return JSON.parse(raw || '[]'); } catch { return []; } };
const gambarUtama = (prod) => {
  if (prod.gambar) return prod.gambar;
  const g = parseGaleri(prod.gambar_galeri);
  return g.length ? g[0] : null;
};
const stokProduk = (prod) => {
  if (prod.is_variasi) {
    const v = parseVariasi(prod.variasi_data);
    return v.reduce((s, x) => s + (parseInt(x.stok) || 0), 0);
  }
  return prod.stok_semasa;
};
const marginProduk = (prod) => {
  if (prod.is_percuma || prod.is_variasi || !prod.harga_modal) return null;
  const h = parseFloat(prod.harga) || 0;
  const m = parseFloat(prod.harga_modal) || 0;
  if (!h || !m) return null;
  return ((h - m) / h * 100).toFixed(0);
};
const margColor = (prod) => {
  const m = parseFloat(marginProduk(prod));
  if (m >= 30) return 'bg-green-500 text-white';
  if (m >= 10) return 'bg-amber-400 text-amber-900';
  return 'bg-red-100 text-red-700';
};

// Analisis untung (form produk)
const untungKasar = computed(() => {
  const h = parseFloat(formProduk.value.harga) || 0;
  const m = parseFloat(formProduk.value.harga_modal) || 0;
  return h - m;
});
const untungBersih = computed(() => untungKasar.value - 1.00);
const marginPeratus = computed(() => {
  const h = parseFloat(formProduk.value.harga) || 0;
  if (!h) return null;
  return ((untungBersih.value / h) * 100).toFixed(1);
});

const badgePesanan = (s) => ({
  PENDING: 'bg-amber-100 text-amber-700', DIBAYAR: 'bg-blue-100 text-blue-700',
  DIPROSES: 'bg-purple-100 text-purple-700', SELESAI: 'bg-green-100 text-green-700',
  DIBATALKAN: 'bg-gray-100 text-gray-500',
}[s] || 'bg-gray-100 text-gray-500');

const badgePenjual = (s) => ({
  PENDING: 'bg-amber-100 text-amber-700', AKTIF: 'bg-green-100 text-green-700', DITOLAK: 'bg-red-100 text-red-600',
}[s] || 'bg-gray-100 text-gray-500');

const badgePenjualTab = (s) => ({
  PENDING: 'bg-amber-500 text-white border-amber-500',
  AKTIF: 'bg-emerald-600 text-white border-emerald-600',
  DITOLAK: 'bg-red-500 text-white border-red-500',
}[s] || 'bg-[#0F4C3A] text-white border-[#0F4C3A]');

// ── Muat data ──
const muatProduk  = async () => { loadingProduk.value=true; try { const {data}=await api.get('/kedai/admin/produk'); if(data.success) produk.value=data.data; } catch(e){} finally{loadingProduk.value=false;} };
const muatPesanan = async () => { loadingPesanan.value=true; try { const {data}=await api.get('/kedai/admin/pesanan'); if(data.success) pesanan.value=data.data; } catch(e){} finally{loadingPesanan.value=false;} };
const muatPenjual = async () => {
  if (penjualDimuat.value) return;
  loadingPenjual.value=true;
  try { const {data}=await api.get('/kedai/admin/penjual'); if(data.success) penjual.value=data.data; penjualDimuat.value=true; } catch(e){}
  finally{loadingPenjual.value=false;}
};

// Muat penjual bila tab dibuka
const tukarTab = (id) => {
  tabAktif.value = id;
  if (id === 'penjual' && !penjualDimuat.value) muatPenjual();
};

// ── Modal Produk ──
const bukaModalProduk = (item) => {
  ralatProduk.value=''; gambarFiles.value=[]; previewGambar.value=[];
  if (item) {
    gambarSedia.value = parseGaleri(item.gambar_galeri).length ? parseGaleri(item.gambar_galeri) : (item.gambar ? [item.gambar] : []);
    const vData = parseVariasi(item.variasi_data);
    formProduk.value = {
      ...item,
      is_percuma: !!item.is_percuma, is_preorder: !!item.is_preorder, is_variasi: !!item.is_variasi,
      variasi_data: vData.length ? vData.map(v=>({nama:v.nama,harga:v.harga||'',harga_modal:v.harga_modal||'',stok:v.stok})) : [{ nama:'',harga:'',harga_modal:'',stok:'' }],
      tarikh_tutup_preorder: item.tarikh_tutup_preorder ? item.tarikh_tutup_preorder.split('T')[0] : '',
      penjual_id: item.penjual_id || null,
    };
  } else {
    gambarSedia.value = [];
    formProduk.value = {
      id:null, nama_produk:'', harga:'', harga_modal:'', stok_semasa:0, deskripsi:'', status:'AKTIF',
      saiz_tersedia:'', is_percuma:false, is_preorder:false, tarikh_tutup_preorder:'',
      is_variasi:false, variasi_data:[{ nama:'',harga:'',harga_modal:'',stok:'' }], penjual_id:null,
    };
  }
  showModalProduk.value=true;
};

const handleFiles = (e) => {
  gambarFiles.value = Array.from(e.target.files).slice(0, 6);
  previewGambar.value = gambarFiles.value.map(f => URL.createObjectURL(f));
};
const buangGambar = (i) => {
  gambarFiles.value.splice(i, 1);
  URL.revokeObjectURL(previewGambar.value[i]);
  previewGambar.value.splice(i, 1);
};
const tambahVariasi = () => formProduk.value.variasi_data.push({ nama:'',harga:'',harga_modal:'',stok:'' });
const buangVariasi  = (idx) => formProduk.value.variasi_data.splice(idx, 1);

const simpanProduk = async () => {
  ralatProduk.value='';
  if (!formProduk.value.nama_produk) { ralatProduk.value='Nama produk wajib diisi.'; return; }
  if (!formProduk.value.is_percuma && !formProduk.value.is_variasi && (!formProduk.value.harga || parseFloat(formProduk.value.harga) <= 0)) { ralatProduk.value='Sila isi harga yang sah.'; return; }
  if (formProduk.value.is_variasi && formProduk.value.variasi_data.length === 0) { ralatProduk.value='Sila tambah sekurang-kurangnya 1 variasi.'; return; }
  if (formProduk.value.is_variasi && formProduk.value.variasi_data.some(v => !String(v.nama||'').trim())) { ralatProduk.value='Setiap variasi mesti ada nama.'; return; }

  savingProduk.value=true;
  try {
    const fd = new FormData();
    fd.append('nama_produk', formProduk.value.nama_produk);
    fd.append('deskripsi', formProduk.value.deskripsi || '');
    fd.append('is_variasi', formProduk.value.is_variasi ? '1' : '0');
    fd.append('is_percuma', formProduk.value.is_percuma ? '1' : '0');
    fd.append('is_preorder', formProduk.value.is_preorder ? '1' : '0');
    fd.append('tarikh_tutup_preorder', formProduk.value.tarikh_tutup_preorder || '');
    fd.append('saiz_tersedia', formProduk.value.saiz_tersedia || '');
    fd.append('harga_modal', formProduk.value.harga_modal || '');
    fd.append('penjual_id', formProduk.value.penjual_id || '');

    if (formProduk.value.is_variasi) {
      const vBersih = formProduk.value.variasi_data.map(v => ({
        nama: String(v.nama).trim(),
        harga: formProduk.value.is_percuma ? 0 : (parseFloat(v.harga) || 0),
        harga_modal: parseFloat(v.harga_modal) || 0,
        stok: parseInt(v.stok) || 0,
      }));
      fd.append('variasi_data', JSON.stringify(vBersih));
      fd.append('harga', 0); fd.append('stok_semasa', 0);
    } else {
      fd.append('harga', formProduk.value.is_percuma ? 0 : (formProduk.value.harga || 0));
      fd.append('stok_semasa', formProduk.value.stok_semasa || 0);
      fd.append('variasi_data', '[]');
    }

    if (formProduk.value.id) fd.append('status', formProduk.value.status);
    gambarFiles.value.forEach(f => fd.append('gambar', f));

    const headers = { 'Content-Type': 'multipart/form-data' };
    if (formProduk.value.id) await api.put(`/kedai/admin/produk/${formProduk.value.id}`, fd, { headers });
    else await api.post('/kedai/admin/produk', fd, { headers });

    showModalProduk.value=false;
    await muatProduk();
  } catch (e) {
    ralatProduk.value = e.response?.data?.message || 'Ralat menyimpan produk.';
  } finally { savingProduk.value=false; }
};

const padamProduk = async (id) => {
  if (!confirm('Padam produk ini? Tindakan tidak boleh dibatalkan.')) return;
  try { await api.delete(`/kedai/admin/produk/${id}`); await muatProduk(); } catch(e) {}
};

const kemaskiniStatus = async (id, s) => {
  try { await api.put(`/kedai/admin/pesanan/${id}/status`, { status_pesanan: s }); await muatPesanan(); } catch(e) {}
};

const bukaTempahan = (p) => { pilihanTempahan.value=p; showTempahan.value=true; };

// ── Penjual ──
const bukaPenjualDetail = (pj) => {
  pilihanPenjual.value = pj;
  notaAdmin.value = pj.nota_admin || '';
  mesejPenjual.value='';
  showPenjualDetail.value=true;
};
const uruskanPenjual = async (status) => {
  savingPenjual.value=true; mesejPenjual.value='';
  try {
    await api.put(`/kedai/admin/penjual/${pilihanPenjual.value.id}`, { status, nota_admin: notaAdmin.value });
    mesejPenjualOk.value=true;
    mesejPenjual.value = status==='AKTIF' ? 'Penjual berjaya diaktifkan.' : status==='DITOLAK' ? 'Permohonan ditolak.' : 'Status dikemaskini.';
    penjualDimuat.value=false;
    await muatPenjual();
    const updated = penjual.value.find(p => p.id === pilihanPenjual.value.id);
    if (updated) pilihanPenjual.value = updated;
  } catch (e) {
    mesejPenjualOk.value=false;
    mesejPenjual.value = e.response?.data?.message || 'Gagal mengemaskini.';
  } finally { savingPenjual.value=false; }
};

// ── Laporan Kilang ──
const pesananSah = computed(() => pesanan.value.filter(p => ['DIBAYAR','DIPROSES','SELESAI'].includes(p.status_pesanan)));
const senaraiProdukLaporan = computed(() => {
  const set = new Set();
  for (const p of pesananSah.value) for (const it of (p.items||[])) set.add(it.nama_produk||'Tanpa Nama');
  return [...set].sort();
});
const bukaLaporanKilang = () => { mesejKos.value=''; kosPengeluaran.value=''; produkPilihanLaporan.value=''; showLaporanKilang.value=true; };

const rekodKosPengeluaran = async () => {
  const kos = parseFloat(kosPengeluaran.value);
  if (!kos || kos <= 0) return;
  merekodKos.value=true; mesejKos.value='';
  try {
    const namaItem = produkPilihanLaporan.value || 'Pelbagai Produk';
    await api.post('/admin/kewangan/keluar', {
      kategori: 'BELIAN_BARANG', amaun: kos,
      penerima_bayaran: `Kos Pengeluaran/Kilang — ${namaItem}`,
      nota: `Kos pengeluaran tempahan kedai: ${namaItem}`,
    });
    mesejKosOk.value=true; mesejKos.value='Kos berjaya direkod.'; kosPengeluaran.value='';
  } catch (e) { mesejKosOk.value=false; mesejKos.value=e.response?.data?.message||'Gagal merekod.'; }
  finally { merekodKos.value=false; }
};

// ── Cetak ──
const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day:'numeric',month:'long',year:'numeric' });

const cetakSatu = () => {
  const p = pilihanTempahan.value;
  const w = window.open('','_blank','width=600,height=500');
  w.document.write(`<html><head><title>Tempahan #${p?.id}</title>
  <style>body{font-family:Tahoma,Arial;padding:30px;max-width:520px;margin:auto;color:#222;font-size:12px}
  h1{font-size:15px;text-align:center;color:#0F4C3A}.sec{background:#f8f8f8;border-radius:6px;padding:12px;margin:8px 0}
  .r{display:flex;justify-content:space-between;margin:5px 0}.l{color:#888}.v{font-weight:bold}
  .t{font-size:14px;font-weight:bold;color:#0F4C3A}hr{border:none;border-top:1px solid #eee;margin:8px 0}
  .fpx{font-size:10px;color:#B45309;background:#FFFBEB;padding:6px 10px;border-radius:4px;margin-top:4px}</style>
  </head><body>
  ${headerResitHTML(`Slip Tempahan Kedai &bull; ${tarikhCetak}`)}
  <div class="sec">
  <div class="r"><span class="l">No. Tempahan</span><span class="v">#${p?.id}</span></div>
  <div class="r"><span class="l">Ahli</span><span class="v">${p?.nama_ahli||'—'}</span></div>
  <div class="r"><span class="l">No. KP</span><span class="v">${p?.no_kp||'—'}</span></div>
  <div class="r"><span class="l">Tarikh</span><span class="v">${p?.tarikh_pesanan||'—'}</span></div>
  <div class="r"><span class="l">Status</span><span class="v">${p?.status_pesanan||'—'}</span></div>
  </div>
  <div class="sec">
  ${(p?.items||[]).map(i=>`<div class="r"><span>${i.nama_produk}${i.saiz?` (${i.saiz})`:''} × ${i.kuantiti}</span><span class="v">${p?.is_percuma?'PERCUMA':`RM ${fmtRM(i.harga_seunit*i.kuantiti)}`}</span></div>`).join('')}
  <hr/>
  <div class="r"><span>Jumlah</span><span class="t">${p?.is_percuma?'PERCUMA':`RM ${fmtRM(p?.jumlah_keseluruhan)}`}</span></div>
  ${!p?.is_percuma&&['DIBAYAR','DIPROSES','SELESAI'].includes(p?.status_pesanan)?`<div class="r"><span>Caj ToyyibPay FPX</span><span style="color:#B45309;font-weight:bold">- RM 1.00</span></div><div class="r"><span>Bersih Diterima</span><span class="t">RM ${fmtRM(parseFloat(p?.jumlah_keseluruhan||0)-1)}</span></div>`:''}
  ${!p?.is_percuma?`<div class="fpx">* Caj RM1.00 ToyyibPay dikenakan oleh platform bagi setiap transaksi FPX.</div>`:''}
  </div>
  ${footerResitHTML()}</body></html>`);
  w.document.close(); setTimeout(()=>w.print(),400);
};

const cetakSemua = () => {
  const list = pesananTertapis.value;
  const w = window.open('','_blank','width=800,height=600');
  w.document.write(`<html><head><title>Senarai Tempahan</title>
  <style>body{font-family:Tahoma,Arial;padding:30px;font-size:11px;color:#222}
  h1{font-size:15px;text-align:center;color:#0F4C3A}
  table{width:100%;border-collapse:collapse}th{background:#0F4C3A;color:#fff;padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase}
  td{padding:6px 8px;border-bottom:1px solid #eee}</style></head><body>
  ${headerResitHTML(`Senarai Tempahan &bull; ${tarikhCetak} &bull; ${list.length} rekod`)}
  <table><thead><tr><th>#</th><th>Ahli</th><th>Produk</th><th>Tarikh</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>
  ${list.map(p=>`<tr><td>#${p.id}</td><td>${p.nama_ahli||'—'}<br/><small style="color:#888;font-family:monospace">${p.no_kp}</small></td>
  <td>${(p.items||[]).map(i=>`${i.nama_produk}${i.saiz?` (${i.saiz})`:''} ×${i.kuantiti}`).join(', ')}</td>
  <td>${p.tarikh_pesanan||'—'}</td><td>${p.is_percuma?'PERCUMA':`RM ${fmtRM(p.jumlah_keseluruhan)}`}</td><td>${p.status_pesanan}</td></tr>`).join('')}
  </tbody></table>${footerResitHTML()}</body></html>`);
  w.document.close(); setTimeout(()=>w.print(),400);
};

const cetakPengeluaran = () => {
  let sumber = pesananSah.value;
  if (!sumber.length) { alert('Tiada pesanan sah untuk dijana laporan.'); return; }
  const fokus = produkPilihanLaporan.value;
  const produkMap = {};
  for (const p of sumber) {
    for (const it of (p.items||[])) {
      const nama = it.nama_produk||'Tanpa Nama';
      if (fokus && nama !== fokus) continue;
      if (!produkMap[nama]) produkMap[nama]={ saizKira:{}, baris:[], ptjKira:{} };
      const saiz = it.saiz||'— (Tiada saiz)'; const qty=parseInt(it.kuantiti)||0; const ptj=p.ptj||'—';
      produkMap[nama].saizKira[saiz]=(produkMap[nama].saizKira[saiz]||0)+qty;
      if (!produkMap[nama].ptjKira[ptj]) produkMap[nama].ptjKira[ptj]={saiz:{},total:0};
      produkMap[nama].ptjKira[ptj].saiz[saiz]=(produkMap[nama].ptjKira[ptj].saiz[saiz]||0)+qty;
      produkMap[nama].ptjKira[ptj].total+=qty;
      produkMap[nama].baris.push({nama:p.nama_ahli||'—',ptj,no_kp:p.no_kp||'—',saiz,kuantiti:qty});
    }
  }
  if (!Object.keys(produkMap).length) { alert('Tiada data untuk produk dipilih.'); return; }
  const esc=(s)=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const seksyen = Object.entries(produkMap).map(([nama,d])=>{
    const total=Object.values(d.saizKira).reduce((a,b)=>a+b,0);
    const ringk=Object.entries(d.saizKira).sort((a,b)=>a[0].localeCompare(b[0])).map(([s,q])=>`<tr><td>${esc(s)}</td><td style="text-align:center;font-weight:bold">${q}</td></tr>`).join('');
    let blokPTJ='';
    if (ringkasPTJ.value) {
      const bp=Object.entries(d.ptjKira).sort((a,b)=>a[0].localeCompare(b[0])).map(([ptj,info])=>{
        const pc=Object.entries(info.saiz).map(([s,q])=>`${esc(s)}: ${q}`).join(', ');
        return `<tr><td>${esc(ptj)}</td><td>${pc}</td><td style="text-align:center;font-weight:bold">${info.total}</td></tr>`;
      }).join('');
      blokPTJ=`<p style="font-size:10px;font-weight:bold;text-transform:uppercase;color:#666;margin:12px 0 6px">Ringkasan PTJ</p>
      <table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:left">PTJ</th><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:left">Pecahan</th><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:center">Jumlah</th></tr></thead><tbody>${bp}</tbody></table>`;
    }
    const baris=d.baris.sort((a,b)=>(a.ptj||'').localeCompare(b.ptj||'')||(a.nama||'').localeCompare(b.nama||'')).map((r,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${esc(r.nama)}</td><td>${esc(r.ptj)}</td><td>${esc(r.no_kp)}</td><td style="text-align:center;font-weight:bold">${esc(r.saiz)}</td><td style="text-align:center">${r.kuantiti}</td></tr>`).join('');
    return `<div style="margin-bottom:24px;page-break-inside:avoid">
    <h2 style="font-size:13px;color:#0F4C3A;border-bottom:2px solid #0F4C3A;padding-bottom:4px;margin-bottom:8px">${esc(nama)}</h2>
    <div style="display:flex;gap:16px;align-items:flex-start">
      <div><p style="font-size:10px;font-weight:bold;text-transform:uppercase;color:#666;margin:0 0 6px">Ringkasan Saiz</p>
      <table style="border-collapse:collapse;font-size:11px;min-width:140px"><thead><tr><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:left">Saiz</th><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:center">Jumlah</th></tr></thead>
      <tbody>${ringk}<tr style="font-weight:bold;background:#f0f7f4"><td style="padding:5px 8px;border-top:2px solid #0F4C3A">JUMLAH</td><td style="padding:5px 8px;text-align:center;border-top:2px solid #0F4C3A">${total}</td></tr></tbody></table></div>
      <div style="text-align:center;background:#f0f7f4;border-radius:8px;padding:12px;min-width:100px">
        <p style="font-size:10px;font-weight:bold;color:#666;margin:0">Jumlah Pesanan</p>
        <p style="font-size:32px;font-weight:bold;color:#0F4C3A;margin:4px 0">${total}</p>
        <p style="font-size:10px;color:#888;margin:0">${d.baris.length} ahli</p>
      </div>
    </div>
    ${blokPTJ}
    <p style="font-size:10px;font-weight:bold;text-transform:uppercase;color:#666;margin:12px 0 6px">Senarai Penerima</p>
    <table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr>
      <th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:center">#</th>
      <th style="background:#0F4C3A;color:#fff;padding:5px 8px">Nama</th><th style="background:#0F4C3A;color:#fff;padding:5px 8px">PTJ</th>
      <th style="background:#0F4C3A;color:#fff;padding:5px 8px">No. KP</th><th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:center">Saiz</th>
      <th style="background:#0F4C3A;color:#fff;padding:5px 8px;text-align:center">Qty</th>
    </tr></thead><tbody>${baris}</tbody></table></div>`;
  }).join('');
  const w=window.open('','_blank','width=900,height=700');
  w.document.write(`<html><head><title>Laporan Pengeluaran</title>
  <style>body{font-family:Tahoma,Arial;padding:28px;color:#222}td{padding:5px 8px;border-bottom:1px solid #eee}</style>
  </head><body>
  ${headerResitHTML(`Laporan Pengeluaran &bull; ${tarikhCetak} &bull; ${fokus?esc(fokus):'Semua Produk'}`)}
  ${seksyen}${footerResitHTML()}</body></html>`);
  w.document.close(); setTimeout(()=>w.print(),400);
};

onMounted(async () => {
  await Promise.all([muatProduk(), muatPesanan()]);
  // Muat penjual di latar belakang untuk stats
  muatPenjual();
});
</script>

<style scoped>
@reference "tailwindcss";

.field-label {
  @apply block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1;
}
.field-input {
  @apply w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-xs
    focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-colors;
}

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

.fs-fade-enter-active, .fs-fade-leave-active { transition: opacity 0.2s ease; }
.fs-fade-enter-from, .fs-fade-leave-to { opacity: 0; }
</style>
