<template>
  <div class="space-y-4 pb-8 animate-page-in font-sans">

    <!-- HEADER -->
    <div class="px-1 pt-1">
      <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Merchandise</p>
      <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Kedai Kelab</h2>
      <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
        Koleksi cenderamata & merchandise rasmi Kelab PERHILITAN.
      </p>
    </div>

    <!-- WARNING -->
    <div v-if="profilDimuatkan && !isAhliAktif"
      class="rounded-[18px] p-4 flex items-start gap-3"
      style="background: #FFF1F2; border: 1px solid rgba(239,68,68,0.2);">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style="background: rgba(239,68,68,0.1);">
        <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-[11px] font-black text-rose-800">Yuran Belum Dijelaskan</p>
        <p class="text-[10px] text-rose-700 mt-0.5 leading-relaxed">Sila jelaskan yuran tahunan sebelum membuat tempahan.</p>
        <button @click="$router.push('/dashboard/yuran')" class="mt-1.5 text-[10px] font-black text-rose-700 underline underline-offset-2">Bayar Sekarang →</button>
      </div>
    </div>

    <!-- TABS -->
    <div class="flex rounded-2xl p-1 w-full" style="background: #F1F5F9; border: 1px solid #E2E8F0;">
      <button @click="tabUtama='produk'"
        class="flex-1 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
        :style="tabUtama==='produk' ? 'background: #081C15; color: #95D5B2;' : 'color: #64748B;'">
        Beli-belah
      </button>
      <button @click="tabUtama='pesanan'; muatPesananSaya()"
        class="flex-1 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
        :style="tabUtama==='pesanan' ? 'background: #081C15; color: #95D5B2;' : 'color: #64748B;'">
        Pesanan Saya
      </button>
      <button @click="tabUtama='jual'"
        class="flex-1 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all relative"
        :style="tabUtama==='jual' ? 'background: #081C15; color: #95D5B2;' : 'color: #64748B;'">
        Daftar Jual
        <span v-if="statusPenjual?.status === 'PENDING'" class="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full"></span>
      </button>
    </div>

    <div v-if="tabUtama==='produk'">
      <div v-if="loading" class="grid grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="h-56 rounded-[24px] bg-white animate-pulse border border-gray-100"/>
      </div>
      <div v-else-if="produk.length === 0" class="bg-white rounded-[24px] p-10 text-center border border-gray-200/60">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <p class="text-xs font-bold text-[#567778] uppercase tracking-wider">Tiada Produk Dijual</p>
        <p class="text-[10px] text-[#567778] mt-1">Sila semak semula kemudian.</p>
      </div>
      <div v-else class="grid grid-cols-2 gap-3">
        <div v-for="item in produk" :key="item.id" @click="bukaDetail(item)"
          class="bg-white rounded-[18px] overflow-hidden shadow-sm border border-gray-200/60 active:scale-[0.98] transition-transform cursor-pointer flex flex-col group">
          <div class="relative aspect-square bg-gray-50 shrink-0 overflow-hidden">
            <img v-if="gambarUtama(item)" :src="apiBase + gambarUtama(item)" :alt="item.nama_produk" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
            <span v-if="item.is_percuma" class="absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 shadow-sm">PERCUMA</span>
            <span v-if="item.is_preorder" class="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-sm">PREORDER</span>
          </div>
          <div class="p-3 flex-1 flex flex-col justify-center">
            <h4 class="font-bold text-[#08151D] text-xs line-clamp-2 leading-snug min-h-[2rem]">{{ item.nama_produk }}</h4>
            <div class="mt-2 flex items-end justify-between">
              <span v-if="item.is_percuma" class="text-amber-600 text-sm font-black">PERCUMA</span>
              <span v-else-if="item.is_variasi" class="text-[#0F4C3A] text-[10px] font-bold">Pelbagai Harga</span>
              <span v-else class="text-[#0F4C3A] text-sm font-black">RM {{ parseFloat(item.harga).toFixed(2) }}</span>
            </div>
            <p v-if="!item.is_variasi" class="text-[9px] text-[#567778] mt-1 font-medium">{{ item.stok_semasa > 0 ? `Baki Stok: ${item.stok_semasa}` : 'Kehabisan stok' }}</p>
            <p v-else class="text-[9px] text-[#567778] mt-1 font-medium">{{ parseVariasi(item.variasi_data).length }} Pilihan Tersedia</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tabUtama==='pesanan'" class="space-y-4">
      <div class="flex overflow-x-auto custom-scrollbar gap-2 pb-1 border-b border-gray-200">
        <button v-for="tab in tabStatusPesanan" :key="tab.value" @click="statusPesananAktif = tab.value"
          :class="['px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2', 
                   statusPesananAktif === tab.value ? 'border-[#08151D] text-[#08151D]' : 'border-transparent text-gray-400 hover:text-gray-700']">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loadingPesanan" class="text-center py-10 text-gray-500 text-xs">Memuatkan pesanan anda...</div>
      <div v-else-if="pesananTertapis.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-200/60">
        <svg class="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Tiada Pesanan</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="p in pesananTertapis" :key="p.id" class="bg-white rounded-[20px] shadow-sm border border-gray-200/60 overflow-hidden">
          
          <div class="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Kedai Perhilitan
              </span>
              <span v-if="!p.is_percuma && p.billCode" class="text-[9px] font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                FPX: {{ p.billCode }}
              </span>
            </div>
            <span :class="['text-[10px] font-black uppercase', labelWarnaStatus(p.status_pesanan)]">
              {{ formatStatusLabel(p.status_pesanan) }}
            </span>
          </div>

          <div class="p-4 space-y-3">
            <div v-for="item in p.items" :key="item.produk_id" class="flex gap-3 items-center">
              <div class="w-14 h-14 bg-gray-100 rounded-lg shrink-0 border border-gray-200 overflow-hidden">
                <img v-if="gambarUtama(item)" :src="apiBase + gambarUtama(item)" class="w-full h-full object-cover"/>
                <span v-else class="w-full h-full flex items-center justify-center text-xl">🛍️</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-gray-900 line-clamp-1">{{ item.nama_produk }}</p>
                <p v-if="item.saiz" class="text-[10px] text-[#0F4C3A] font-bold mt-0.5 bg-[#0F4C3A]/10 px-1.5 py-0.5 rounded inline-block">Variasi: {{ item.saiz }}</p>
                <p class="text-[10px] text-gray-500 font-bold mt-0.5">x{{ item.kuantiti }} unit</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-black text-[#08151D]">
                  {{ p.is_percuma ? 'PERCUMA' : `RM ${parseFloat(item.harga_seunit).toFixed(2)}` }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 border-t border-gray-100 flex flex-col items-end gap-2 bg-gray-50/50">
            <p class="text-xs font-medium text-gray-600">
              Jumlah Pesanan: <span class="text-sm font-black text-rose-600 ml-1">{{ p.is_percuma ? 'PERCUMA' : `RM ${parseFloat(p.jumlah_keseluruhan).toFixed(2)}` }}</span>
            </p>
            <div class="flex gap-2 w-full justify-end mt-1">
              <button v-if="p.status_pesanan === 'PENDING' && !p.is_percuma" @click="bayarFPX(p.billCode)"
                      class="px-5 py-2.5 bg-[#08151D] hover:bg-[#0E303D] text-[#87BCB5] text-xs font-bold rounded-xl shadow-md transition-colors">
                Bayar FPX
              </button>
              
              <button @click="bukaTempahan(p)" class="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors border border-gray-200 shadow-sm">
                Lihat Butiran
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- TAB: DAFTAR JUAL -->
    <div v-if="tabUtama==='jual'" class="space-y-4">

      <!-- Peraturan -->
      <div class="rounded-[18px] p-4 space-y-2.5" style="background: #F0FDF4; border: 1px solid rgba(21,128,61,0.2);">
        <p class="text-[10px] font-black uppercase tracking-widest text-[#166534]">Peraturan Marketplace Kelab PERHILITAN</p>
        <ol class="space-y-2">
          <li class="flex gap-2 text-[11px] text-gray-700 leading-snug">
            <span class="text-[#0F4C3A] font-black shrink-0 mt-0.5">1.</span>
            <span>Ahli perlu mendaftar dan mendapat <strong>kelulusan Admin</strong> sebelum boleh menjual.</span>
          </li>
          <li class="flex gap-2 text-[11px] text-gray-700 leading-snug">
            <span class="text-[#0F4C3A] font-black shrink-0 mt-0.5">2.</span>
            <span>Setiap transaksi dikenakan <strong>caj FPX RM1.00</strong> oleh platform ToyyibPay.</span>
          </li>
          <li class="flex gap-2 text-[11px] text-gray-700 leading-snug">
            <span class="text-[#0F4C3A] font-black shrink-0 mt-0.5">3.</span>
            <span>Kelab mengenakan <strong>komisyen RM1.00</strong> bagi setiap transaksi berjaya sebagai bayaran penggunaan platform.</span>
          </li>
          <li class="flex gap-2 text-[11px] text-gray-700 leading-snug">
            <span class="text-[#0F4C3A] font-black shrink-0 mt-0.5">4.</span>
            <span>Penghantaran kepada pembeli: <strong>PTJ (percuma)</strong> atau <strong>Pos Malaysia (+RM8.00)</strong> — pembeli pilih semasa tempah.</span>
          </li>
          <li class="flex gap-2 text-[11px] text-gray-700 leading-snug">
            <span class="text-[#0F4C3A] font-black shrink-0 mt-0.5">5.</span>
            <span>Produk hendaklah halal, sah, dan tidak bertentangan dengan etika perkhidmatan awam. Admin berhak menyahaktifkan produk.</span>
          </li>
        </ol>
      </div>

      <!-- Loading -->
      <div v-if="loadingStatusPenjual" class="bg-white rounded-[18px] p-8 text-center border border-gray-200/60">
        <p class="text-xs text-gray-400">Menyemak status pendaftaran...</p>
      </div>

      <!-- Status: AKTIF -->
      <template v-else-if="statusPenjual?.status === 'AKTIF'">
        <div class="rounded-[18px] p-4 flex items-center gap-3" style="background: #F0FDF4; border: 1px solid rgba(21,128,61,0.2);">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-sm font-black text-emerald-800">Akaun Penjual Aktif</p>
            <p class="text-[10px] text-emerald-700 mt-0.5">Produk anda sedang dipaparkan. Hubungi Admin untuk tambah atau kemaskini produk.</p>
          </div>
        </div>
        <div v-if="produkPenjual.length > 0">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Produk Anda ({{ produkPenjual.length }})</p>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="item in produkPenjual" :key="item.id"
              class="bg-white rounded-[18px] overflow-hidden shadow-sm border border-gray-200/60 flex flex-col">
              <div class="relative aspect-square bg-gray-50 overflow-hidden">
                <img v-if="gambarUtama(item)" :src="apiBase + gambarUtama(item)" class="w-full h-full object-cover"/>
                <div v-else class="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                  <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
              </div>
              <div class="p-3">
                <p class="font-bold text-[#08151D] text-xs line-clamp-2 leading-snug">{{ item.nama_produk }}</p>
                <p class="text-[#0F4C3A] text-sm font-black mt-1">{{ item.is_percuma ? 'PERCUMA' : `RM ${parseFloat(item.harga).toFixed(2)}` }}</p>
                <p class="text-[9px] text-gray-500 mt-0.5">Stok: {{ item.stok_semasa ?? 0 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-[18px] p-6 text-center border border-gray-200/60">
          <p class="text-xs font-bold text-gray-500">Belum ada produk didaftarkan.</p>
          <p class="text-[10px] text-gray-400 mt-1">Hubungi Admin untuk tambah produk anda ke marketplace.</p>
        </div>
      </template>

      <!-- Status: PENDING -->
      <div v-else-if="statusPenjual?.status === 'PENDING'"
        class="rounded-[18px] p-5 text-center" style="background: #FFFBEB; border: 1px solid rgba(217,119,6,0.25);">
        <svg class="w-10 h-10 mx-auto text-amber-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-sm font-black text-amber-800">Permohonan Dalam Semakan</p>
        <p class="text-[10px] text-amber-700 mt-1 leading-relaxed">Admin sedang menyemak permohonan anda. Sila tunggu maklum balas.</p>
        <p class="text-[9px] text-amber-600 font-bold mt-2">Didaftar: {{ statusPenjual?.tarikh_daftar }}</p>
      </div>

      <!-- Status: DITOLAK atau Belum Daftar -->
      <template v-else>
        <div v-if="statusPenjual?.status === 'DITOLAK'"
          class="rounded-[18px] p-4" style="background: #FFF1F2; border: 1px solid rgba(239,68,68,0.2);">
          <p class="text-sm font-black text-rose-800 mb-1">Permohonan Ditolak</p>
          <p v-if="statusPenjual?.nota_admin" class="text-xs text-rose-700">Sebab: {{ statusPenjual.nota_admin }}</p>
          <p class="text-[10px] text-rose-600 mt-1.5">Anda boleh hantar semula permohonan di bawah.</p>
        </div>

        <!-- FORM DAFTAR -->
        <div class="bg-white border border-gray-200 rounded-[18px] p-5 space-y-4">
          <div>
            <p class="text-sm font-black text-gray-900">{{ statusPenjual?.status === 'DITOLAK' ? 'Hantar Semula Permohonan' : 'Daftar Sebagai Penjual' }}</p>
            <p class="text-[10px] text-gray-500 mt-0.5">Admin akan menyemak dalam masa 3 hari bekerja.</p>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Perniagaan / Produk *</label>
              <input v-model="formPenjual.nama_perniagaan" type="text" placeholder="Cth: Kek Batik Puan Aminah"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Jenis Produk</label>
              <input v-model="formPenjual.jenis_produk" type="text" placeholder="Cth: Makanan, Kraftangan, Pakaian"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">No. Telefon</label>
              <input v-model="formPenjual.telefon" type="tel" placeholder="01X-XXXXXXX"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Keterangan Ringkas</label>
              <textarea v-model="formPenjual.deskripsi" rows="3" placeholder="Cerita sedikit tentang produk anda..."
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 resize-none"/>
            </div>
          </div>

          <Transition name="fade">
            <p v-if="mesejPenjual" class="text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              :class="mesejPenjualOk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'">
              {{ mesejPenjual }}
            </p>
          </Transition>

          <button @click="hantarPermohonanPenjual" :disabled="hantarPenjual"
            class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold uppercase tracking-widest text-xs py-3.5 rounded-2xl transition-all shadow-lg disabled:opacity-50">
            {{ hantarPenjual ? 'Menghantar...' : 'Hantar Permohonan' }}
          </button>
        </div>
      </template>

    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTempahan" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4 backdrop-blur-sm" @click.self="tutupTempahan">
          <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 class="text-gray-900 font-bold text-lg leading-tight">Tempahan #{{ pilihanTempahan?.id }}</h3>
                <p class="text-gray-500 text-[10px] font-medium mt-0.5">{{ pilihanTempahan?.tarikh_pesanan }}</p>
              </div>
              <button @click="tutupTempahan" class="text-gray-400 hover:text-rose-500 bg-gray-50 hover:bg-rose-50 p-1.5 rounded-full transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-gray-600 uppercase">Status Pengeposan</span>
                <span :class="['text-[10px] uppercase font-bold px-3 py-1 rounded-full', badgePesanan(pilihanTempahan?.status_pesanan)]">
                  {{ formatStatusLabel(pilihanTempahan?.status_pesanan) }}
                </span>
              </div>

              <div v-if="!pilihanTempahan?.is_percuma" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2">Maklumat Pembayaran (FPX)</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p class="text-[10px] font-bold text-blue-600 uppercase">No. Rujukan (BillCode)</p>
                    <p class="font-mono font-bold text-blue-900 text-xs">{{ pilihanTempahan?.billCode || 'Sedang Dijana' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-blue-600 uppercase">Status Bayaran</p>
                    <p class="font-bold text-xs" :class="['DIBAYAR', 'DIPROSES', 'SELESAI'].includes(pilihanTempahan?.status_pesanan) ? 'text-emerald-600' : (pilihanTempahan?.status_pesanan === 'PENDING' ? 'text-amber-600' : 'text-rose-600')">
                      {{ ['DIBAYAR', 'DIPROSES', 'SELESAI'].includes(pilihanTempahan?.status_pesanan) ? 'Lulus (Berjaya)' : (pilihanTempahan?.status_pesanan === 'PENDING' ? 'Belum Dibayar' : 'Gagal / Dibatalkan') }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Maklumat Penghantaran -->
              <div v-if="pilihanTempahan?.kaedah_penghantaran" class="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <p class="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-2">Kaedah Penghantaran</p>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black px-2 py-0.5 rounded-full"
                    :class="pilihanTempahan.kaedah_penghantaran === 'POS' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                    {{ pilihanTempahan.kaedah_penghantaran === 'POS' ? 'Pos Malaysia' : 'Hantar ke PTJ (Percuma)' }}
                  </span>
                </div>
                <div v-if="pilihanTempahan.kaedah_penghantaran === 'POS' && pilihanTempahan.alamat_penghantaran" class="mt-2">
                  <p class="text-[9px] font-bold text-sky-600 uppercase mb-0.5">Alamat Penghantaran</p>
                  <p class="text-[10px] text-sky-900 font-medium leading-relaxed">{{ pilihanTempahan.alamat_penghantaran }}</p>
                </div>
              </div>

              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 mt-3">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-2">Item Pembelian</p>
                <div v-for="item in pilihanTempahan?.items" :key="item.nama_produk" class="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                  <div class="flex-1 pr-2">
                    <p class="font-bold text-gray-900 leading-tight text-xs">{{ item.nama_produk }}</p>
                    <p v-if="item.saiz" class="text-[9px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 px-1.5 py-0.5 rounded inline-block mt-1">Variasi: {{ item.saiz }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-gray-500 text-[10px] font-bold">× {{ item.kuantiti }} unit</p>
                    <p class="font-black text-[#08151D]">{{ pilihanTempahan?.is_percuma ? 'PERCUMA' : `RM ${parseFloat(item.harga_seunit*item.kuantiti).toFixed(2)}` }}</p>
                  </div>
                </div>
                <div v-if="!pilihanTempahan?.is_percuma" class="pt-2 space-y-1">
                  <div v-if="pilihanTempahan?.kos_postage > 0" class="flex justify-between text-xs text-gray-500">
                    <span>Kos Postage</span>
                    <span class="font-bold text-amber-700">RM {{ parseFloat(pilihanTempahan.kos_postage).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between font-bold text-sm">
                    <span class="uppercase text-[10px] font-bold tracking-wider text-gray-500 mt-1">Jumlah Dibayar (FPX)</span>
                    <span class="text-rose-600 text-lg font-black tabular-nums">RM {{ parseFloat(pilihanTempahan?.jumlah_keseluruhan||0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="pilihanTempahan?.nota_admin" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
                <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Nota Urusetia / Admin</p>
                <p class="text-xs text-amber-900 font-medium whitespace-pre-wrap">{{ pilihanTempahan.nota_admin }}</p>
              </div>
            </div>
            
            <div class="px-6 py-4 border-t border-gray-100 flex gap-2">
              <button v-if="['DIBAYAR','DIPROSES','SELESAI'].includes(pilihanTempahan?.status_pesanan) || pilihanTempahan?.is_percuma"
                @click="simpanResitPesanan" class="flex-1 bg-[#08151D] hover:bg-[#0F4C3A] text-[#87BCB5] font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Simpan PDF / Resit
              </button>
              <button @click="tutupTempahan" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors">Tutup</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="showDetail" class="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center backdrop-blur-sm" @click.self="tutupDetail">
          <div class="bg-white w-full sm:max-w-md sm:rounded-[24px] rounded-t-[28px] max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl">

            <div class="relative">
              <div class="aspect-square bg-gray-50 overflow-hidden">
                <img v-if="senaraiGambar.length" :src="apiBase + senaraiGambar[slideAktif]" :alt="pilihan?.nama_produk" class="w-full h-full object-cover transition-opacity"/>
                <div v-else class="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
              </div>

              <button @click="tutupDetail" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-rose-500 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>

              <template v-if="senaraiGambar.length > 1">
                <button @click="slidePrev" class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button @click="slideNext" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
                <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <button v-for="(g,i) in senaraiGambar" :key="i" @click="slideAktif=i" :class="['w-1.5 h-1.5 rounded-full transition-all', i===slideAktif ? 'bg-white w-4' : 'bg-white/50']"/>
                </div>
              </template>
              <span v-if="pilihan?.is_percuma" class="absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 shadow-md">PERCUMA</span>
            </div>

            <div v-if="senaraiGambar.length > 1" class="flex gap-2 px-5 pt-4 overflow-x-auto custom-scrollbar pb-1">
              <button v-for="(g,i) in senaraiGambar" :key="i" @click="slideAktif=i"
                :class="['w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all shadow-sm', i===slideAktif ? 'border-[#0F4C3A]' : 'border-gray-200']">
                <img :src="apiBase + g" class="w-full h-full object-cover"/>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h3 class="text-xl font-bold text-gray-900 leading-snug">{{ pilihan?.nama_produk }}</h3>
                  <span v-if="pilihan?.is_preorder" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">PREORDER</span>
                </div>
                
                <p class="text-3xl font-black mt-1" :class="pilihan?.is_percuma ? 'text-amber-500' : 'text-[#0F4C3A]'">
                  {{ pilihan?.is_percuma ? 'PERCUMA' : (pilihan?.is_variasi ? `RM ${parseFloat(hargaSemasa).toFixed(2)}` : `RM ${parseFloat(pilihan?.harga||0).toFixed(2)}`) }}
                </p>
                
                <p class="text-xs text-gray-500 font-medium mt-1">
                  Baki Stok: <span class="text-gray-900 font-bold">{{ stokSemasaItem }} unit</span>
                  <span v-if="pilihan?.is_preorder && pilihan?.tarikh_tutup_preorder"> · Tutup: {{ formatTarikh(pilihan?.tarikh_tutup_preorder) }}</span>
                </p>
              </div>

              <div v-if="pilihan?.is_percuma" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-[11px] font-medium text-amber-800">
                ⭐ Item ini <strong>percuma</strong> untuk ahli aktif (had 1 unit sahaja).
              </div>

              <div v-if="pilihan?.deskripsi">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Deskripsi Produk</p>
                <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{{ pilihan?.deskripsi }}</p>
              </div>

              <div v-if="pilihan?.is_variasi" class="pt-2 border-t border-gray-100">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{{ pilihan?.is_percuma ? 'Pilih Saiz *' : 'Pilih Pakej / Variasi *' }}</label>
                <select v-model="variasiDipilih" class="w-full bg-gray-50 border border-gray-300 text-gray-900 font-bold rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all appearance-none">
                  <option :value="null" disabled>-- {{ pilihan?.is_percuma ? 'Pilih Saiz' : 'Pilih Variasi' }} --</option>
                  <option v-for="(v, idx) in parseVariasi(pilihan.variasi_data)" :key="idx" :value="v" :disabled="v.stok <= 0">
                    {{ v.nama }}<template v-if="!pilihan?.is_percuma"> — RM {{ parseFloat(v.harga).toFixed(2) }}</template> ({{ v.stok > 0 ? `Baki: ${v.stok}` : 'Habis' }})
                  </option>
                </select>
              </div>

              <div v-if="!pilihan?.is_variasi && senaraiSaiz.length > 0" class="pt-2 border-t border-gray-100">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Saiz *</p>
                <div class="flex flex-wrap gap-2">
                  <button v-for="s in senaraiSaiz" :key="s" @click="saizDipilih = s"
                    :class="['px-5 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm',
                      saizDipilih===s ? 'bg-[#08151D] text-white border-[#08151D]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900']">
                    {{ s }}
                  </button>
                </div>
              </div>

              <div v-if="!pilihan?.is_percuma" class="flex items-center justify-between pt-2">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kuantiti</p>
                <div class="flex items-center gap-3">
                  <button @click="kuantiti = Math.max(1, kuantiti-1)" class="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors">−</button>
                  <span class="text-sm font-black w-6 text-center text-gray-900">{{ kuantiti }}</span>
                  <button @click="kuantiti = Math.min(stokSemasaItem||1, kuantiti+1)" class="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold flex items-center justify-center transition-colors">+</button>
                </div>
              </div>

              <!-- KAEDAH PENGHANTARAN -->
              <div v-if="!pilihan?.is_percuma" class="pt-2 border-t border-gray-100 space-y-2">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kaedah Penghantaran</p>
                <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                  :class="kaedahHantar==='PTJ' ? 'border-[#0F4C3A] bg-[#0F4C3A]/5' : 'border-gray-200'">
                  <input type="radio" v-model="kaedahHantar" value="PTJ" class="accent-[#0F4C3A]" @click.stop/>
                  <div class="flex-1">
                    <p class="text-xs font-bold text-gray-900">Hantar ke PTJ <span class="text-emerald-600 font-black">(Percuma)</span></p>
                    <p class="text-[10px] text-gray-500 mt-0.5">Admin serahkan terus di pejabat PTJ anda.</p>
                  </div>
                </label>
                <label class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                  :class="kaedahHantar==='POS' ? 'border-[#0F4C3A] bg-[#0F4C3A]/5' : 'border-gray-200'">
                  <input type="radio" v-model="kaedahHantar" value="POS" class="accent-[#0F4C3A] mt-0.5" @click.stop/>
                  <div class="flex-1">
                    <p class="text-xs font-bold text-gray-900">Pos ke Alamat <span class="text-amber-600 font-black">(+RM{{ KOS_POSTAGE.toFixed(2) }})</span></p>
                    <p class="text-[10px] text-gray-500 mt-0.5">Dihantar melalui Pos Malaysia (Semenanjung).</p>
                    <textarea v-if="kaedahHantar==='POS'" v-model="alamatHantar" rows="2"
                      placeholder="No. Rumah, Jalan, Poskod, Bandar, Negeri..."
                      class="mt-2 w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0F4C3A] resize-none"
                      @click.stop/>
                  </div>
                </label>
              </div>

              <!-- JUMLAH -->
              <div v-if="!pilihan?.is_percuma && (pilihan?.harga > 0 || variasiDipilih)" class="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mt-2 space-y-1.5">
                <div v-if="kosPostage > 0" class="flex justify-between text-xs text-gray-600">
                  <span>Subtotal Produk</span>
                  <span class="font-bold">RM {{ (hargaSemasa * kuantiti).toFixed(2) }}</span>
                </div>
                <div v-if="kosPostage > 0" class="flex justify-between text-xs text-amber-700">
                  <span>Kos Postage</span>
                  <span class="font-bold">RM {{ kosPostage.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center" :class="kosPostage > 0 ? 'border-t border-emerald-200 pt-1.5' : ''">
                  <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Jumlah Bayar (FPX)</span>
                  <span class="text-xl font-black text-emerald-700 tabular-nums">RM {{ jumlahTotal.toFixed(2) }}</span>
                </div>
                <p class="text-[9px] text-gray-400 mt-0.5">* Caj FPX RM1.00 dikenakan oleh ToyyibPay.</p>
              </div>

              <Transition name="fade">
                <p v-if="ralat" class="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl flex items-center gap-2">
                  <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  {{ ralat }}
                </p>
              </Transition>

              <button @click="tempah" :disabled="memproses || !isAhliAktif || stokSemasaItem<=0"
                class="w-full bg-[#08151D] hover:bg-[#0F4C3A] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span v-if="memproses"><svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></span>
                <span v-if="memproses">Memproses...</span>
                <span v-else-if="!isAhliAktif">Yuran Tertunggak</span>
                <span v-else-if="stokSemasaItem<=0">Kehabisan Stok</span>
                <span v-else-if="pilihan?.is_percuma">Tempah Percuma</span>
                <span v-else-if="pilihan?.is_preorder">Preorder (FPX)</span>
                <span v-else>Teruskan Pembayaran (FPX)</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="toastBerjaya" class="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg">
          ✅ {{ toastBerjaya }}
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import { cetakResitPesananKedai } from '../../config/kelab';

const router = useRouter();
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const tabUtama = ref('produk');
const statusPesananAktif = ref('');

// Penghantaran
const KOS_POSTAGE = 8; // RM8 flat rate Pos Malaysia
const kaedahHantar = ref('PTJ');
const alamatHantar = ref('');
const kosPostage = computed(() => (!pilihan.value?.is_percuma && kaedahHantar.value === 'POS') ? KOS_POSTAGE : 0);
const jumlahTotal = computed(() => (hargaSemasa.value * kuantiti.value) + kosPostage.value);

// Daftar Jual
const statusPenjual = ref(null);
const loadingStatusPenjual = ref(false);
const formPenjual = ref({ nama_perniagaan: '', jenis_produk: '', telefon: '', deskripsi: '' });
const hantarPenjual = ref(false);
const mesejPenjual = ref('');
const mesejPenjualOk = ref(false);
const produkPenjual = computed(() => {
  if (!statusPenjual.value?.id) return [];
  return produk.value.filter(p => p.penjual_id === statusPenjual.value.id);
});

const tabStatusPesanan = [
  { value: '', label: 'Semua' },
  { value: 'PENDING', label: 'Belum Bayar' },
  { value: 'DIBAYAR', label: 'Untuk Dihantar' },
  { value: 'DIPROSES', label: 'Sedang Diproses' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' }
];

const produk = ref([]);
const pesananSaya = ref([]);
const loading = ref(true);
const loadingPesanan = ref(false);
const profil = ref({});
const profilDimuatkan = ref(false);

const showDetail = ref(false);
const pilihan = ref(null);
const slideAktif = ref(0);
const saizDipilih = ref('');
const variasiDipilih = ref(null);
const kuantiti = ref(1);
const memproses = ref(false);
const ralat = ref('');
const toastBerjaya = ref('');

// MODAL DETAIL PESANAN
const showTempahan = ref(false);
const pilihanTempahan = ref(null);

const isAhliAktif = computed(() => !!profil.value.is_paid);

const pesananTertapis = computed(() => {
  if (!statusPesananAktif.value) return pesananSaya.value;
  return pesananSaya.value.filter(p => p.status_pesanan === statusPesananAktif.value);
});

// Harga Semasa Variasi
const hargaSemasa = computed(() => {
  if (pilihan.value?.is_percuma) return 0;
  if (pilihan.value?.is_variasi && variasiDipilih.value) return parseFloat(variasiDipilih.value.harga);
  return parseFloat(pilihan.value?.harga || 0);
});

// Stok Semasa Variasi
const stokSemasaItem = computed(() => {
  if (pilihan.value?.is_variasi && variasiDipilih.value) return parseInt(variasiDipilih.value.stok);
  return parseInt(pilihan.value?.stok_semasa || 0);
});

const formatStatusLabel = (s) => {
  const map = { PENDING: 'Belum Bayar', DIBAYAR: 'Untuk Dihantar', DIPROSES: 'Sedang Diproses', SELESAI: 'Selesai', DIBATALKAN: 'Dibatalkan' };
  return map[s] || s;
};

const labelWarnaStatus = (s) => {
  if (s === 'PENDING') return 'text-amber-600';
  if (s === 'DIBAYAR') return 'text-blue-600';
  if (s === 'DIPROSES') return 'text-purple-600';
  if (s === 'SELESAI') return 'text-emerald-600';
  return 'text-gray-500';
};

const badgePesanan = (s) => {
  if (s === 'PENDING') return 'bg-amber-100 text-amber-700';
  if (s === 'DIBAYAR') return 'bg-blue-100 text-blue-700';
  if (s === 'DIPROSES') return 'bg-purple-100 text-purple-700';
  if (s === 'SELESAI') return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-500';
};

const gambarUtama = (item) => {
  if (item.gambar) return item.gambar;
  const g = parseGaleri(item.gambar_galeri);
  return g.length ? g[0] : null;
};

const parseGaleri = (raw) => { if(!raw) return []; try { return JSON.parse(raw); } catch { return [raw]; } };
const parseVariasi = (raw) => { if(!raw) return []; try { return JSON.parse(raw); } catch { return []; } };

const senaraiGambar = computed(() => {
  if (!pilihan.value) return [];
  const g = parseGaleri(pilihan.value.gambar_galeri);
  if (g.length) return g;
  return pilihan.value.gambar ? [pilihan.value.gambar] : [];
});

const senaraiSaiz = computed(() => {
  if (!pilihan.value?.saiz_tersedia) return [];
  return pilihan.value.saiz_tersedia.split(',').map(s=>s.trim()).filter(Boolean);
});

const formatTarikh = (t) => t ? new Date(t).toLocaleDateString('ms-MY',{day:'numeric',month:'short',year:'numeric'}) : '';

const fetchProfil = async () => {
  try { const res = await api.get('/user/profil'); profil.value = res.data.data; }
  catch(e){ console.error(e); } finally { profilDimuatkan.value = true; }
};

const fetchProduk = async () => {
  loading.value = true;
  try { const { data } = await api.get('/kedai/produk-aktif'); if(data.success) produk.value = data.data; }
  catch(e){ console.error(e); } finally { loading.value = false; }
};

const muatPesananSaya = async () => {
  loadingPesanan.value = true;
  try {
    const { data } = await api.get('/kedai/pesanan-saya');
    if (data.success) pesananSaya.value = data.data;
  } catch (e) { console.error(e); }
  finally { loadingPesanan.value = false; }
};

const bayarFPX = (billCode) => {
  if (!billCode) return alert("Pautan bayaran tiada. Sila hubungi admin.");
  const toyyibpayBase = import.meta.env.VITE_TOYYIBPAY_URL || 'https://toyyibpay.com';
  window.location.href = `${toyyibpayBase}/${billCode}`;
};

const fetchStatusPenjual = async () => {
  if (loadingStatusPenjual.value) return;
  loadingStatusPenjual.value = true;
  try {
    const { data } = await api.get('/kedai/status-penjual');
    statusPenjual.value = data.data;
  } catch(e) { console.error(e); }
  finally { loadingStatusPenjual.value = false; }
};

const hantarPermohonanPenjual = async () => {
  if (!formPenjual.value.nama_perniagaan) { mesejPenjual.value = 'Nama perniagaan/produk wajib diisi.'; mesejPenjualOk.value = false; return; }
  hantarPenjual.value = true; mesejPenjual.value = '';
  try {
    await api.post('/kedai/daftar-jual', formPenjual.value);
    mesejPenjualOk.value = true;
    mesejPenjual.value = 'Permohonan berjaya dihantar! Sila tunggu semakan Admin.';
    await fetchStatusPenjual();
    formPenjual.value = { nama_perniagaan: '', jenis_produk: '', telefon: '', deskripsi: '' };
  } catch(e) {
    mesejPenjualOk.value = false;
    mesejPenjual.value = e.response?.data?.message || 'Gagal menghantar permohonan.';
  }
  finally { hantarPenjual.value = false; }
};

const bukaDetail = (item) => {
  pilihan.value = item;
  slideAktif.value = 0;
  saizDipilih.value = '';
  variasiDipilih.value = null;
  kuantiti.value = 1;
  ralat.value = '';
  kaedahHantar.value = 'PTJ';
  alamatHantar.value = '';
  showDetail.value = true;
};
const tutupDetail = () => { showDetail.value = false; pilihan.value = null; };

const bukaTempahan = (pesanan) => {
  pilihanTempahan.value = pesanan;
  showTempahan.value = true;
};
const tutupTempahan = () => {
  showTempahan.value = false;
  pilihanTempahan.value = null;
};

const simpanResitPesanan = () => {
  if (pilihanTempahan.value) cetakResitPesananKedai(pilihanTempahan.value, profil.value);
};

const slidePrev = () => { slideAktif.value = (slideAktif.value - 1 + senaraiGambar.value.length) % senaraiGambar.value.length; };
const slideNext = () => { slideAktif.value = (slideAktif.value + 1) % senaraiGambar.value.length; };

const tempah = async () => {
  ralat.value = '';
  if (!isAhliAktif.value) { router.push('/dashboard/yuran'); return; }

  if (!pilihan.value.is_variasi && senaraiSaiz.value.length && !saizDipilih.value) { ralat.value = 'Sila pilih saiz dahulu.'; return; }
  if (pilihan.value.is_variasi && !variasiDipilih.value) { ralat.value = 'Sila pilih pakej/variasi dahulu.'; return; }
  if (!pilihan.value.is_percuma && kaedahHantar.value === 'POS' && !alamatHantar.value.trim()) {
    ralat.value = 'Sila masukkan alamat penghantaran untuk perkhidmatan pos.';
    return;
  }

  memproses.value = true;
  const namaVariasiAtauSaiz = pilihan.value.is_variasi ? variasiDipilih.value.nama : (saizDipilih.value || null);

  try {
    const { data } = await api.post('/kedai/beli', {
      items: [{
        produk_id: pilihan.value.id,
        kuantiti: pilihan.value.is_percuma ? 1 : kuantiti.value,
        saiz: namaVariasiAtauSaiz,
      }],
      kaedah_penghantaran: pilihan.value.is_percuma ? 'PTJ' : kaedahHantar.value,
      alamat_penghantaran: kaedahHantar.value === 'POS' ? alamatHantar.value.trim() : null,
      kos_postage: pilihan.value.is_percuma ? 0 : kosPostage.value,
    });

    if (data.success) {
      if (data.percuma) {
        toastBerjaya.value = data.message || 'Tempahan percuma berjaya!';
        tutupDetail();
        await fetchProduk();
        setTimeout(() => toastBerjaya.value = '', 3500);
      } else if (data.url_bayar) {
        window.location.href = data.url_bayar;
      }
    }
  } catch (e) { ralat.value = e.response?.data?.message || 'Gagal membuat tempahan.'; } 
  finally { memproses.value = false; }
};

onMounted(() => { fetchProfil(); fetchProduk(); fetchStatusPenjual(); });
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; display: none; }
select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
</style>