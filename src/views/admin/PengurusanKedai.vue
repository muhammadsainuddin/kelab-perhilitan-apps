<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-gray-900 font-bold text-xl">Pengurusan Kedai</h2>
        <p class="text-gray-500 text-sm">Urus produk, variasi harga, preorder & tempahan ahli.</p>
      </div>
    </div>

    <div class="flex bg-gray-100 rounded-xl p-1 w-fit border border-gray-200">
      <button v-for="tab in tabs" :key="tab.id" @click="tabAktif=tab.id"
        :class="['px-5 py-2 rounded-lg text-sm font-medium transition-all',
          tabAktif===tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="tabAktif==='produk'">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input v-model="carianProduk" type="text" placeholder="Cari produk..."
          class="bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] placeholder-gray-400"/>
        <button @click="bukaModalProduk(null)"
          class="flex items-center gap-2 bg-[#0F4C3A] hover:bg-[#155d47] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Produk
        </button>
      </div>

      <div v-if="loadingProduk" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="h-56 rounded-xl bg-gray-100 animate-pulse"/>
      </div>
      <div v-else-if="produkTertapis.length===0" class="text-center py-16 text-gray-400">Tiada produk. Klik "Tambah Produk".</div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="prod in produkTertapis" :key="prod.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div class="relative aspect-square bg-gray-50 shrink-0">
            <img v-if="gambarUtama(prod)" :src="apiBase + gambarUtama(prod)" :alt="prod.nama_produk" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <span :class="['absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full', prod.status==='AKTIF' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">{{ prod.status }}</span>
            <span v-if="prod.is_percuma" class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">PERCUMA</span>
            <span v-if="prod.is_preorder" class="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">PREORDER</span>
          </div>
          <div class="p-3 space-y-1 flex-1 flex flex-col justify-center">
            <p class="text-gray-900 text-sm font-semibold line-clamp-2">{{ prod.nama_produk }}</p>
            <div v-if="prod.is_percuma">
              <p class="text-amber-600 text-sm font-bold">PERCUMA</p>
            </div>
            <div v-else-if="prod.is_variasi">
              <p class="text-blue-600 text-[11px] font-bold mt-1">Variasi Harga/Pakej</p>
              <p class="text-gray-400 text-[10px] font-medium">{{ parseVariasi(prod.variasi_data).length }} Pilihan</p>
            </div>
            <div v-else>
              <p class="text-[#0F4C3A] text-sm font-bold">RM {{ parseFloat(prod.harga).toFixed(2) }}</p>
              <p class="text-gray-400 text-xs">Stok: {{ prod.stok_semasa }}</p>
            </div>
          </div>
          <div class="flex border-t border-gray-100 shrink-0">
            <button @click="bukaModalProduk(prod)" class="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">Edit</button>
            <div class="w-px bg-gray-100"/>
            <button @click="padamProduk(prod.id)" class="flex-1 py-2.5 text-xs font-bold text-red-400 hover:bg-red-50 transition-colors">Padam</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tabAktif==='pesanan'">
      <div class="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
        <div class="flex gap-2 flex-wrap">
          <button v-for="s in statusPesanan" :key="s.v" @click="filterPesanan=s.v"
            :class="['text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors', filterPesanan===s.v ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300']">{{ s.l }}</button>
        </div>
        <button @click="cetakSemua" class="flex items-center gap-1.5 text-xs text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-3 py-2 rounded-xl border border-[#0F4C3A]/20 font-medium">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Print Senarai
        </button>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50">
              <th class="text-left px-4 py-3 font-medium">#</th>
              <th class="text-left px-4 py-3 font-medium">Ahli</th>
              <th class="text-left px-4 py-3 font-medium">Produk</th>
              <th class="text-left px-4 py-3 font-medium hidden md:table-cell">Tarikh</th>
              <th class="text-right px-4 py-3 font-medium">Jumlah</th>
              <th class="text-center px-4 py-3 font-medium">Status</th>
              <th class="text-center px-4 py-3 font-medium">Aksi</th>
            </tr></thead>
            <tbody>
              <tr v-if="loadingPesanan"><td colspan="7" class="px-4 py-8 text-center text-gray-400">Memuatkan...</td></tr>
              <tr v-else-if="pesananTertapis.length===0"><td colspan="7" class="px-4 py-10 text-center text-gray-400">Tiada pesanan.</td></tr>
              <tr v-for="p in pesananTertapis" :key="p.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-amber-600 font-mono text-xs font-bold">#{{ p.id }}</td>
                <td class="px-4 py-3"><p class="text-gray-900 font-medium text-sm">{{ p.nama_ahli||'—' }}</p><p class="text-gray-400 text-xs">{{ p.no_kp }}</p></td>
                <td class="px-4 py-3">
                  <div v-for="item in p.items" :key="item.nama_produk" class="text-gray-600 text-xs">
                    {{ item.nama_produk }}<span v-if="item.saiz" class="text-gray-400 font-bold"> ({{ item.saiz }})</span> × {{ item.kuantiti }}
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">{{ p.tarikh_pesanan }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">
                  <span v-if="p.is_percuma" class="text-amber-600 text-xs font-bold">PERCUMA</span>
                  <span v-else>RM {{ parseFloat(p.jumlah_keseluruhan).toFixed(2) }}</span>
                </td>
                <td class="px-4 py-3 text-center"><span :class="['text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', badgePesanan(p.status_pesanan)]">{{ p.status_pesanan }}</span></td>
                <td class="px-4 py-3 text-center">
                  <div class="flex gap-1 justify-center">
                    <button @click="bukaTempahan(p)" class="text-xs font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 px-3 py-1.5 rounded-lg border border-[#0F4C3A]/20">Details</button>
                    <select v-if="['PENDING','DIBAYAR','DIPROSES'].includes(p.status_pesanan)" @change="e=>kemaskiniStatus(p.id,e.target.value)" :value="p.status_pesanan"
                      class="text-xs border font-bold border-gray-200 text-gray-700 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#0F4C3A]">
                      <option value="PENDING">PENDING</option><option value="DIBAYAR">DIBAYAR</option>
                      <option value="DIPROSES">DIPROSES</option><option value="SELESAI">SELESAI</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Teleport to="body"><Transition name="modal">
      <div v-if="showModalProduk" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm" @click.self="showModalProduk=false">
        <div class="bg-white rounded-[24px] p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <h3 class="text-gray-900 font-bold text-xl mb-5">{{ formProduk.id ? 'Kemaskini Produk' : 'Tambah Produk Baharu' }}</h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 block">Nama Produk *</label>
              <input v-model="formProduk.nama_produk" type="text" placeholder="Cth: Sampul Raya 2025"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"/>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                <input v-model="formProduk.is_percuma" type="checkbox" id="chkP" class="accent-amber-500 w-4 h-4 cursor-pointer"/>
                <label for="chkP" class="text-xs text-amber-800 font-bold cursor-pointer">Item PERCUMA</label>
              </div>
              <div class="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                <input v-model="formProduk.is_preorder" type="checkbox" id="chkPre" class="accent-blue-500 w-4 h-4 cursor-pointer"/>
                <label for="chkPre" class="text-xs text-blue-800 font-bold cursor-pointer">Set Preorder</label>
              </div>
            </div>

            <div v-if="!formProduk.is_percuma" class="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-3 border border-purple-100">
              <input v-model="formProduk.is_variasi" type="checkbox" id="chkVar" class="accent-purple-600 w-4 h-4 cursor-pointer"/>
              <label for="chkVar" class="text-xs text-purple-800 font-bold cursor-pointer">Produk ini ada pelbagai variasi (Saiz/Pakej berbeza harga)</label>
            </div>

            <div v-if="!formProduk.is_variasi && !formProduk.is_percuma" class="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Harga Jualan (RM) *</label>
                <input v-model="formProduk.harga" type="number" min="0" step="0.50" placeholder="0.00"
                  class="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
              </div>
              <div>
                <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Stok Semasa</label>
                <input v-model="formProduk.stok_semasa" type="number" min="0" placeholder="0"
                  class="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
              </div>
              <div class="col-span-2">
                <label class="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Saiz Tersedia <span class="text-gray-400 normal-case font-medium">(Jika ada, pisah dengan koma)</span></label>
                <input v-model="formProduk.saiz_tersedia" type="text" placeholder="Cth: S, M, L, XL"
                  class="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
              </div>
            </div>

            <div v-if="formProduk.is_variasi && !formProduk.is_percuma" class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
              <div class="flex justify-between items-center mb-2">
                <label class="text-gray-700 text-xs font-bold uppercase tracking-wider">Senarai Variasi & Pakej</label>
                <button @click="tambahVariasi" type="button" class="text-[10px] bg-[#0F4C3A] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#166b52]">+ Tambah Variasi</button>
              </div>

              <div v-for="(v, index) in formProduk.variasi_data" :key="index" class="flex gap-2 items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <input v-model="v.nama" type="text" placeholder="Cth: 10 Keping / Saiz XL" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:border-[#0F4C3A] outline-none"/>
                <input v-model="v.harga" type="number" step="0.50" placeholder="RM" class="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:border-[#0F4C3A] outline-none text-center"/>
                <input v-model="v.stok" type="number" placeholder="Stok" class="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold focus:border-[#0F4C3A] outline-none text-center"/>
                <button @click="buangVariasi(index)" type="button" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
              <p v-if="formProduk.variasi_data.length === 0" class="text-[10px] text-rose-500 font-bold italic">Sila tambah sekurang-kurangnya 1 variasi.</p>
            </div>

            <div v-if="formProduk.is_preorder">
              <label class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 block">Tarikh Tutup Preorder</label>
              <input v-model="formProduk.tarikh_tutup_preorder" type="date"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F4C3A]"/>
            </div>

            <div>
              <label class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 block">Deskripsi / Keterangan Lanjut</label>
              <textarea v-model="formProduk.deskripsi" rows="3" placeholder="Huraian produk..."
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 resize-none"/>
            </div>

            <div>
              <label class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 block">Gambar Produk (Max 6 Gambar)</label>
              <div class="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <input type="file" @change="handleFiles" accept="image/*" multiple
                  class="w-full text-gray-600 text-xs file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer file:font-bold"/>
                <p v-if="gambarFiles.length" class="text-[10px] text-[#0F4C3A] font-bold mt-2">{{ gambarFiles.length }} gambar sedia untuk dimuat naik.</p>
              </div>
            </div>

            <div v-if="formProduk.id">
              <label class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 block">Status Penjualan</label>
              <select v-model="formProduk.status" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none">
                <option value="AKTIF">AKTIF (Boleh Dibeli)</option><option value="HABIS">HABIS / DITUTUP</option>
              </select>
            </div>

            <p v-if="ralatProduk" class="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{{ ralatProduk }}</p>
          </div>
          
          <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button @click="showModalProduk=false" class="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">Batal</button>
            <button @click="simpanProduk" :disabled="savingProduk" class="flex-1 bg-[#0F4C3A] hover:bg-[#155d47] text-white py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 shadow-md">
              {{ savingProduk ? 'Menyimpan...' : (formProduk.id ? 'Kemaskini Produk' : 'Tambah Produk') }}
            </button>
          </div>
        </div>
      </div>
    </Transition></Teleport>

    <Teleport to="body"><Transition name="modal">
      <div v-if="showTempahan" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4" @click.self="showTempahan=false">
        <div class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-gray-900 font-bold text-lg">Tempahan #{{ pilihanTempahan?.id }}</h3>
            <div class="flex gap-2">
              <button @click="cetakSatu" class="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>Cetak
              </button>
              <button @click="showTempahan=false" class="text-gray-400 hover:text-red-500 bg-gray-50 p-1.5 rounded-full"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span :class="['text-[10px] uppercase font-bold px-3 py-1 rounded-full', badgePesanan(pilihanTempahan?.status_pesanan)]">{{ pilihanTempahan?.status_pesanan }}</span>
              <span class="text-gray-500 text-xs font-medium">{{ pilihanTempahan?.tarikh_pesanan }}</span>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Maklumat Ahli</p>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div><p class="text-[10px] font-bold text-gray-500 uppercase">Nama</p><p class="font-bold text-gray-900 leading-tight">{{ pilihanTempahan?.nama_ahli }}</p></div>
                <div><p class="text-[10px] font-bold text-gray-500 uppercase">No. KP</p><p class="font-bold text-[#0F4C3A] font-mono text-xs">{{ pilihanTempahan?.no_kp }}</p></div>
              </div>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Item Pembelian</p>
              <div v-for="item in pilihanTempahan?.items" :key="item.nama_produk" class="flex items-center justify-between text-sm py-2 border-b border-gray-200/50 last:border-0">
                <div>
                  <p class="font-bold text-gray-900 leading-tight">{{ item.nama_produk }}</p>
                  <p v-if="item.saiz" class="text-[10px] font-bold text-[#0F4C3A] bg-[#0F4C3A]/10 px-1.5 py-0.5 rounded inline-block mt-1">{{ item.saiz }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 text-[11px] font-bold">× {{ item.kuantiti }} unit</p>
                  <p class="font-black text-gray-900">{{ pilihanTempahan?.is_percuma ? 'PERCUMA' : `RM ${parseFloat(item.harga_seunit*item.kuantiti).toFixed(2)}` }}</p>
                </div>
              </div>
              <div v-if="!pilihanTempahan?.is_percuma" class="flex justify-between font-bold text-sm mt-3 pt-3 border-t-2 border-gray-200">
                <span class="uppercase text-[10px] tracking-wider text-gray-500 mt-1">Jumlah Keseluruhan</span>
                <span class="text-[#0F4C3A] text-lg font-black">RM {{ parseFloat(pilihanTempahan?.jumlah_keseluruhan||0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition></Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api','');

const tabAktif = ref('produk');
const produk = ref([]); const pesanan = ref([]);
const loadingProduk = ref(true); const loadingPesanan = ref(true);
const carianProduk = ref(''); const filterPesanan = ref('');
const showModalProduk = ref(false); const showTempahan = ref(false);
const savingProduk = ref(false); const gambarFiles = ref([]);
const pilihanTempahan = ref(null); const ralatProduk = ref('');

// Updated form state format with variation support
const formProduk = ref({ 
  id:null, nama_produk:'', harga:'', stok_semasa:0, deskripsi:'', status:'AKTIF', 
  saiz_tersedia:'', is_percuma:false, is_preorder:false, tarikh_tutup_preorder:'',
  is_variasi: false, variasi_data: [{ nama: '', harga: '', stok: '' }]
});

const tabs = [{id:'produk',label:'Inventori Produk'},{id:'pesanan',label:'Tempahan Masuk'}];
const statusPesanan = [{v:'',l:'Semua'},{v:'PENDING',l:'⏳ Pending'},{v:'DIBAYAR',l:'💳 Dibayar'},{v:'DIPROSES',l:'📦 Diproses'},{v:'SELESAI',l:'✅ Selesai'}];

const produkTertapis = computed(() => !carianProduk.value ? produk.value : produk.value.filter(p=>p.nama_produk.toLowerCase().includes(carianProduk.value.toLowerCase())));
const pesananTertapis = computed(() => !filterPesanan.value ? pesanan.value : pesanan.value.filter(p=>p.status_pesanan===filterPesanan.value));

const badgePesanan = (s)=>({PENDING:'bg-amber-100 text-amber-700',DIBAYAR:'bg-blue-100 text-blue-700',DIPROSES:'bg-purple-100 text-purple-700',SELESAI:'bg-green-100 text-green-700',DIBATALKAN:'bg-gray-100 text-gray-500'}[s]||'bg-gray-100 text-gray-500');

// Pengecaman Gambar
const parseGaleri = (raw) => { if(!raw) return []; try { return JSON.parse(raw); } catch { return [raw]; } };
const gambarUtama = (prod) => {
  if (prod.gambar) return prod.gambar;
  const g = parseGaleri(prod.gambar_galeri);
  return g.length ? g[0] : null;
};
// Pengecaman Variasi
const parseVariasi = (raw) => { if(!raw) return []; try { return JSON.parse(raw); } catch { return []; } };

const muatProduk = async()=>{loadingProduk.value=true;try{const{data}=await api.get('/kedai/admin/produk');if(data.success)produk.value=data.data;}catch(e){console.error(e);}finally{loadingProduk.value=false;}};
const muatPesanan = async()=>{loadingPesanan.value=true;try{const{data}=await api.get('/kedai/admin/pesanan');if(data.success)pesanan.value=data.data;}catch(e){console.error(e);}finally{loadingPesanan.value=false;}};

const bukaModalProduk=(item)=>{
  ralatProduk.value=''; gambarFiles.value=[];
  formProduk.value = item
    ? {
        ...item, 
        is_percuma:!!item.is_percuma, 
        is_preorder:!!item.is_preorder, 
        is_variasi:!!item.is_variasi,
        variasi_data: item.variasi_data ? JSON.parse(item.variasi_data) : [{ nama: '', harga: '', stok: '' }],
        tarikh_tutup_preorder:item.tarikh_tutup_preorder?item.tarikh_tutup_preorder.split('T')[0]:''
      }
    : {
        id:null,nama_produk:'',harga:'',stok_semasa:0,deskripsi:'',status:'AKTIF',saiz_tersedia:'',
        is_percuma:false,is_preorder:false,tarikh_tutup_preorder:'',
        is_variasi:false, variasi_data:[{ nama: '', harga: '', stok: '' }]
      };
  showModalProduk.value=true;
};
const handleFiles=(e)=>{gambarFiles.value=Array.from(e.target.files);};
const tambahVariasi = () => formProduk.value.variasi_data.push({ nama: '', harga: '', stok: '' });
const buangVariasi = (idx) => formProduk.value.variasi_data.splice(idx, 1);

const simpanProduk=async()=>{
  ralatProduk.value='';
  if(!formProduk.value.nama_produk){ralatProduk.value='Nama produk wajib diisi.';return;}
  if(!formProduk.value.is_percuma && !formProduk.value.is_variasi && (!formProduk.value.harga || parseFloat(formProduk.value.harga)<=0)){ralatProduk.value='Sila isi harga yang sah.';return;}
  if(!formProduk.value.is_percuma && formProduk.value.is_variasi && formProduk.value.variasi_data.length === 0){ralatProduk.value='Sila tambah variasi produk.';return;}
  
  savingProduk.value=true;
  try{
    const fd=new FormData();
    fd.append('nama_produk',formProduk.value.nama_produk);
    fd.append('deskripsi',formProduk.value.deskripsi||'');
    
    // Logik Harga / Stok vs Variasi
    fd.append('is_variasi', formProduk.value.is_variasi ? '1' : '0');
    if (formProduk.value.is_variasi) {
      fd.append('variasi_data', JSON.stringify(formProduk.value.variasi_data));
      fd.append('harga', 0);
      fd.append('stok_semasa', 0);
    } else {
      fd.append('harga',formProduk.value.is_percuma?0:(formProduk.value.harga||0));
      fd.append('stok_semasa',formProduk.value.stok_semasa||0);
      fd.append('variasi_data', '[]');
    }

    fd.append('saiz_tersedia',formProduk.value.saiz_tersedia||'');
    fd.append('is_percuma',formProduk.value.is_percuma?'1':'0');
    fd.append('is_preorder',formProduk.value.is_preorder?'1':'0');
    fd.append('tarikh_tutup_preorder',formProduk.value.tarikh_tutup_preorder||'');
    
    if(formProduk.value.id)fd.append('status',formProduk.value.status);
    gambarFiles.value.forEach(f=>fd.append('gambar',f));
    
    const headers={'Content-Type':'multipart/form-data'};
    if(formProduk.value.id)await api.put(`/kedai/admin/produk/${formProduk.value.id}`,fd,{headers});
    else await api.post('/kedai/admin/produk',fd,{headers});
    
    showModalProduk.value=false;
    await muatProduk();
  }catch(e){ralatProduk.value=e.response?.data?.message||'Ralat menyimpan produk.';console.error(e);}
  finally{savingProduk.value=false;}
};

const padamProduk=async(id)=>{if(!confirm('Padam produk ini?'))return;try{await api.delete(`/kedai/admin/produk/${id}`);await muatProduk();}catch(e){console.error(e);}};
const kemaskiniStatus=async(id,s)=>{try{await api.put(`/kedai/admin/pesanan/${id}/status`,{status_pesanan:s});await muatPesanan();}catch(e){console.error(e);}};
const bukaTempahan=(p)=>{pilihanTempahan.value=p;showTempahan.value=true;};

const tarikhCetak=new Date().toLocaleDateString('ms-MY',{day:'numeric',month:'long',year:'numeric'});
const cetakSatu=()=>{
  const p=pilihanTempahan.value;const w=window.open('','_blank','width=600,height=500');
  w.document.write(`<html><head><title>Tempahan #${p?.id}</title><style>body{font-family:Arial;padding:30px;max-width:500px;margin:auto;color:#333}h1{font-size:15px;text-align:center;color:#0F4C3A}p.s{text-align:center;font-size:11px;color:#888;margin-bottom:16px}.sec{background:#f9f9f9;border-radius:6px;padding:12px;margin:8px 0}.r{display:flex;justify-content:space-between;font-size:12px;margin:5px 0}.l{color:#888}.v{font-weight:bold}.t{font-size:14px;font-weight:bold;color:#0F4C3A}hr{border:none;border-top:1px solid #eee;margin:8px 0}</style></head><body>
  <h1>KELAB KAKITANGAN PERHILITAN</h1><p class="s">Slip Tempahan Kedai &bull; ${tarikhCetak}</p>
  <div class="sec"><div class="r"><span class="l">No. Tempahan</span><span class="v">#${p?.id}</span></div><div class="r"><span class="l">Ahli</span><span class="v">${p?.nama_ahli||'—'}</span></div><div class="r"><span class="l">No. KP</span><span class="v">${p?.no_kp||'—'}</span></div><div class="r"><span class="l">Tarikh</span><span class="v">${p?.tarikh_pesanan||'—'}</span></div><div class="r"><span class="l">Status</span><span class="v">${p?.status_pesanan||'—'}</span></div></div>
  <div class="sec">${(p?.items||[]).map(i=>`<div class="r"><span>${i.nama_produk}${i.saiz?` (${i.saiz})`:''} × ${i.kuantiti}</span><span class="v">${p?.is_percuma?'PERCUMA':`RM ${parseFloat(i.harga_seunit*i.kuantiti).toFixed(2)}`}</span></div>`).join('')}<hr/><div class="r"><span>Jumlah</span><span class="t">${p?.is_percuma?'PERCUMA':`RM ${parseFloat(p?.jumlah_keseluruhan||0).toFixed(2)}`}</span></div></div>
  </body></html>`);w.document.close();setTimeout(()=>w.print(),400);
};
const cetakSemua=()=>{
  const list=pesananTertapis.value;const w=window.open('','_blank','width=800,height=600');
  w.document.write(`<html><head><title>Senarai Tempahan</title><style>body{font-family:Arial;padding:30px}h1{font-size:16px;text-align:center;color:#0F4C3A}p.s{text-align:center;font-size:11px;color:#888;margin-bottom:16px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f0f0f0;padding:8px;text-align:left;font-size:11px;text-transform:uppercase;color:#555}td{padding:7px 8px;border-bottom:1px solid #eee}</style></head><body>
  <h1>KELAB KAKITANGAN PERHILITAN</h1><p class="s">Senarai Tempahan Kedai &bull; ${tarikhCetak} &bull; ${list.length} rekod</p>
  <table><thead><tr><th>#</th><th>Ahli</th><th>Produk</th><th>Tarikh</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>
  ${list.map(p=>`<tr><td>#${p.id}</td><td>${p.nama_ahli||'—'}<br/><small style="color:#888">${p.no_kp}</small></td><td>${(p.items||[]).map(i=>`${i.nama_produk}${i.saiz?` (${i.saiz})`:''} ×${i.kuantiti}`).join(', ')}</td><td>${p.tarikh_pesanan||'—'}</td><td>${p.is_percuma?'PERCUMA':`RM ${parseFloat(p.jumlah_keseluruhan||0).toFixed(2)}`}</td><td>${p.status_pesanan}</td></tr>`).join('')}
  </tbody></table></body></html>`);w.document.close();setTimeout(()=>w.print(),400);
};

onMounted(()=>{muatProduk();muatPesanan();});
</script>
<style scoped>
.modal-enter-active,.modal-leave-active{transition:all 0.2s ease}
.modal-enter-from,.modal-leave-to{opacity:0;transform:scale(0.95)}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
</style>