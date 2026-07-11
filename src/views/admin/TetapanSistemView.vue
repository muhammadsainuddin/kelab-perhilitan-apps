<template>
  <div class="space-y-6 max-w-2xl">

    <!-- HEADER INFO -->
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="w-11 h-11 rounded-xl bg-[#0F4C3A]/8 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-black text-gray-900">Tetapan Modul Sistem</h2>
          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Aktifkan atau nyahaktifkan modul dalam aplikasi ahli. Modul yang dinyahaktifkan tidak akan kelihatan kepada ahli.
          </p>
        </div>
      </div>
    </div>

    <!-- SENARAI MODUL -->
    <div class="space-y-3">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Modul Aplikasi</p>

      <div v-if="loading" class="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
        <p class="text-xs text-gray-400 font-medium">Memuatkan tetapan...</p>
      </div>

      <div v-else v-for="modul in senaraModul" :key="modul.kunci"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
        :class="{ 'opacity-60': toggling === modul.kunci }">

        <div class="flex items-center gap-4 p-4">
          <!-- Ikon Modul -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :style="modulStatus(modul.kunci)
              ? 'background: rgba(15,76,58,0.07); color: #0F4C3A;'
              : 'background: rgba(239,68,68,0.07); color: #dc2626;'">
            <svg v-if="modul.kunci === 'modul_kedai'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <svg v-else-if="modul.kunci === 'modul_bantuan'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <svg v-else-if="modul.kunci === 'modul_acara'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>

          <!-- Maklumat -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-bold text-gray-900">{{ modul.label }}</p>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="modulStatus(modul.kunci)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-600 border border-red-200'">
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="modulStatus(modul.kunci) ? 'bg-emerald-500' : 'bg-red-500'"></span>
                {{ modulStatus(modul.kunci) ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
            <p class="text-xs text-gray-400">{{ modul.penerangan }}</p>
          </div>

          <!-- Toggle Switch -->
          <button @click="togolModul(modul.kunci)"
            :disabled="toggling === modul.kunci"
            class="relative inline-flex items-center shrink-0 w-12 h-6 rounded-full transition-all duration-300 focus:outline-none disabled:cursor-wait"
            :class="modulStatus(modul.kunci) ? 'bg-[#0F4C3A]' : 'bg-gray-200'">
            <span class="inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-0.5"
              :class="modulStatus(modul.kunci) ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- Notis jika tidak aktif -->
        <Transition name="expand">
          <div v-if="!modulStatus(modul.kunci)"
            class="px-4 pb-3">
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-[10px] font-medium text-amber-700">
                Modul ini tersembunyi daripada semua ahli. Paparkan semula dengan aktifkan toggle.
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- MOD PENYELENGGARAAN -->
    <div class="space-y-3">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Kawalan Sistem</p>

      <div class="bg-white rounded-2xl border overflow-hidden shadow-sm transition-all"
        :class="maintenanceAktif ? 'border-red-300' : 'border-gray-100'">

        <div class="flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
            :style="maintenanceAktif
              ? 'background: rgba(239,68,68,0.1); color: #dc2626;'
              : 'background: rgba(100,116,139,0.08); color: #64748b;'">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-bold text-gray-900">Mod Penyelenggaraan</p>
              <span v-if="maintenanceAktif"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                AKTIF
              </span>
            </div>
            <p class="text-xs text-gray-400">
              Semua ahli akan melihat skrin penyelenggaraan dan tidak boleh log masuk. Admin tetap boleh akses.
            </p>
          </div>

          <button @click="togolMaintenance"
            :disabled="togglingMaintenance"
            class="relative inline-flex items-center shrink-0 w-12 h-6 rounded-full transition-all duration-300 focus:outline-none disabled:cursor-wait"
            :class="maintenanceAktif ? 'bg-red-500' : 'bg-gray-200'">
            <span class="inline-block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-0.5"
              :class="maintenanceAktif ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>

        <!-- Amaran bila aktif -->
        <Transition name="expand">
          <div v-if="maintenanceAktif" class="px-4 pb-3">
            <div class="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
              <svg class="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p class="text-[10px] font-medium text-red-700 leading-relaxed">
                <strong>Sistem dalam penyelenggaraan.</strong> Semua ahli kini melihat skrin penyelenggaraan. Matikan toggle ini untuk pulihkan akses.
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- KONFIGURASI FPX -->
    <div class="space-y-3">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Konfigurasi Pembayaran FPX</p>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style="background: rgba(251,191,36,0.1);">
            <svg class="w-6 h-6" style="color: #92660C;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-black text-gray-900">Kategori Kod FPX — Sumbangan</h2>
            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Kod kategori dari ToyyibPay untuk bil sumbangan ahli. Dapatkan kod ini dari dashboard ToyyibPay anda
              di bawah seksyen <em>Category</em>. Kosongkan untuk menggunakan kategori yuran lalai.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="text-xs font-bold text-gray-600 mb-1 block">Kod Kategori</label>
            <input v-model="categoryCodeSumbangan" type="text"
              placeholder="Contoh: ABCD1234"
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
              :disabled="menyimpanFpx" />
          </div>
          <div class="flex items-end">
            <button @click="simpanCategoryCode" :disabled="menyimpanFpx"
              class="px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all"
              style="background: #0F4C3A;" :class="menyimpanFpx ? 'opacity-60' : 'hover:opacity-90'">
              {{ menyimpanFpx ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>

        <p v-if="fpxSimpanMesej" class="mt-2 text-xs font-bold" :class="fpxSimpanOk ? 'text-emerald-700' : 'text-red-600'">
          {{ fpxSimpanMesej }}
        </p>
      </div>
    </div>

    <!-- ACARA KHAS KEWANGAN -->
    <div class="space-y-3">
      <p class="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Kategori Khas Kewangan</p>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-start gap-4 p-5 border-b border-gray-100">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style="background: rgba(124,58,237,0.08);">
            <svg class="w-6 h-6" style="color: #7c3aed;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-sm font-black text-gray-900">Acara Khas</h2>
            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Kategori khas untuk merekod perbelanjaan dan pendapatan bagi sesuatu acara (contoh: Sakom 2026).
              Kategori ini akan muncul dalam dropdown semasa merekod transaksi kewangan.
            </p>
          </div>
          <button @click="showFormAcara = true"
            class="flex items-center gap-1.5 px-3 py-2 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
            style="background: #7c3aed;">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah
          </button>
        </div>

        <!-- Form tambah inline -->
        <Transition name="expand">
          <div v-if="showFormAcara" class="px-5 py-4 border-b border-violet-100 bg-violet-50/30">
            <div class="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Nama Acara *</label>
                <input v-model="formAcara.nama" type="text" placeholder="Cth: Sakom 2026"
                  class="w-full border border-violet-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 bg-white"/>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Keterangan</label>
                <input v-model="formAcara.deskripsi" type="text" placeholder="Huraian ringkas (pilihan)"
                  class="w-full border border-violet-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 bg-white"/>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="simpanAcara" :disabled="savingAcara"
                class="px-4 py-2 text-white text-[11px] font-bold rounded-lg disabled:opacity-60 transition-colors"
                style="background: #7c3aed;">
                {{ savingAcara ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button @click="showFormAcara = false; formAcara = { nama: '', deskripsi: '' }"
                class="px-4 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Batal
              </button>
            </div>
          </div>
        </Transition>

        <!-- Senarai acara -->
        <div v-if="loadingAcara" class="px-5 py-6 text-center text-xs text-gray-400">Memuatkan...</div>
        <div v-else-if="!senaraiAcara.length" class="px-5 py-6 text-center text-xs text-gray-400">
          Tiada acara khas. Klik <strong>Tambah</strong> untuk mulakan.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div v-for="acara in senaraiAcara" :key="acara.id">
            <!-- Row acara -->
            <div class="flex items-center justify-between px-5 py-3 gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="text-[12px] font-bold text-gray-800 truncate">{{ acara.nama }}</p>
                  <span :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase',
                    acara.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
                    {{ acara.status }}
                  </span>
                </div>
                <p v-if="acara.deskripsi" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ acara.deskripsi }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ acara.bil_transaksi || 0 }} transaksi</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button @click="togolPakej(acara.id)"
                  class="text-[10px] font-bold px-2 py-1 rounded-lg transition-colors"
                  :class="acaraTerbukaPakej === acara.id
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-violet-600 hover:bg-violet-50'">
                  {{ acaraTerbukaPakej === acara.id ? 'Tutup Pakej ▲' : 'Pakej ▼' }}
                </button>
                <button v-if="acara.status === 'AKTIF'" @click="tutupAcara(acara.id)"
                  class="text-[10px] font-bold text-rose-500 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors">
                  Selesai
                </button>
                <button v-else @click="aktifkanAcara(acara.id)"
                  class="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
                  Aktif Semula
                </button>
              </div>
            </div>

            <!-- Panel pakej (expandable) -->
            <div v-if="acaraTerbukaPakej === acara.id" class="bg-violet-50/40 border-t border-violet-100 px-6 py-4">
              <div class="flex items-center justify-between mb-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Pakej Sumbangan — {{ acara.nama }}
                </p>
                <button @click="bukaFormPakej(acara.id)"
                  class="text-[10px] font-bold text-violet-600 hover:text-violet-800 px-2 py-1 rounded-lg hover:bg-violet-100 transition-colors flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  Tambah Pakej
                </button>
              </div>

              <!-- Form tambah pakej -->
              <div v-if="formPakejAcaraId === acara.id" class="bg-white rounded-xl border border-violet-200 p-3 mb-3">
                <div class="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label class="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Nama Pakej *</label>
                    <input v-model="formPakej.nama" type="text" placeholder="Cth: Gangsa, Utama, Platinum"
                      class="w-full border border-violet-200 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-violet-500 bg-white"/>
                  </div>
                  <div>
                    <label class="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Amaun Pakej (RM)</label>
                    <input v-model="formPakej.amaun_pakej" type="number" min="0" step="0.01" placeholder="0.00 (pilihan)"
                      class="w-full border border-violet-200 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-violet-500 bg-white"/>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="simpanPakej(acara.id)" :disabled="savingPakej"
                    class="px-3 py-1.5 text-white text-[10px] font-bold rounded-lg disabled:opacity-60 transition-colors"
                    style="background: #7c3aed;">
                    {{ savingPakej ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                  <button @click="formPakejAcaraId = null"
                    class="px-3 py-1.5 text-[10px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Batal
                  </button>
                </div>
              </div>

              <!-- Senarai pakej -->
              <div v-if="loadingPakej" class="text-[11px] text-gray-400 py-2">Memuatkan pakej...</div>
              <div v-else-if="!senaraiPakej[acara.id]?.length" class="text-[11px] text-gray-400 py-2">
                Tiada pakej. Klik <strong>Tambah Pakej</strong>.
              </div>
              <div v-else class="space-y-1.5">
                <div v-for="pkj in senaraiPakej[acara.id]" :key="pkj.id"
                  class="flex items-center justify-between bg-white rounded-lg border border-violet-100 px-3 py-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-[11px] font-bold text-gray-800">{{ pkj.nama }}</p>
                      <span v-if="pkj.amaun_pakej" class="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                        RM {{ parseFloat(pkj.amaun_pakej).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }}
                      </span>
                      <span :class="['text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                        pkj.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
                        {{ pkj.status }}
                      </span>
                    </div>
                    <p class="text-[9px] text-gray-400 mt-0.5">{{ pkj.bil_penyumbang || 0 }} penyumbang · RM {{ parseFloat(pkj.jumlah_kutipan || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) }} dikutip</p>
                  </div>
                  <button @click="togolStatusPakej(pkj)"
                    :class="['text-[9px] font-bold px-2 py-1 rounded-lg transition-colors',
                      pkj.status === 'AKTIF'
                        ? 'text-rose-500 hover:bg-rose-50'
                        : 'text-emerald-600 hover:bg-emerald-50']">
                    {{ pkj.status === 'AKTIF' ? 'Tutup' : 'Aktifkan' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MESEJ STATUS -->
    <Transition name="fade">
      <div v-if="mesej" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-xl"
        :class="mesejOk ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
        {{ mesej }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '../../stores/settings';
import api from '../../services/api';

const settingsStore = useSettingsStore();

const loading  = ref(false);
const toggling = ref(null);
const mesej    = ref('');
const mesejOk  = ref(true);

const maintenanceAktif    = computed(() => !!settingsStore.tetapan['maintenance_mode']);
const togglingMaintenance = ref(false);

const togolMaintenance = async () => {
  if (togglingMaintenance.value) return;
  const nilaiBaru = maintenanceAktif.value ? 0 : 1;
  if (nilaiBaru === 1 && !confirm('Semua ahli akan TIDAK BOLEH menggunakan sistem. Teruskan?')) return;
  togglingMaintenance.value = true;
  try {
    await api.put('/settings/maintenance_mode', { nilai: nilaiBaru });
    settingsStore.setTetapan('maintenance_mode', nilaiBaru);
    tunjukMesej(nilaiBaru ? 'Mod penyelenggaraan DIAKTIFKAN' : 'Sistem dipulihkan — ahli boleh akses semula', nilaiBaru === 0);
  } catch (e) {
    tunjukMesej(e.response?.data?.mesej || 'Gagal kemaskini', false);
  } finally {
    togglingMaintenance.value = false;
  }
};

// FPX category code
const categoryCodeSumbangan = ref('');
const menyimpanFpx          = ref(false);
const fpxSimpanMesej        = ref('');
const fpxSimpanOk           = ref(true);

const senaraModul = [
  {
    kunci:      'modul_kedai',
    label:      'Kedai Merchandise',
    penerangan: 'Paparan Kedai Merch dalam menu pantas dan halaman utama ahli.',
  },
  {
    kunci:      'modul_bantuan',
    label:      'Bantuan Kebajikan',
    penerangan: 'Tab Bantuan dalam bar navigasi bawah aplikasi ahli.',
  },
  {
    kunci:      'modul_acara',
    label:      'Acara & Aktiviti',
    penerangan: 'Tab Aktiviti dalam bar navigasi bawah dan pautan program kelab.',
  },
];

const modulStatus = (kunci) => settingsStore.modulAktif(kunci);

const togolModul = async (kunci) => {
  if (toggling.value) return;
  toggling.value = kunci;
  const nilaiBaru = modulStatus(kunci) ? 0 : 1;
  try {
    await api.put(`/settings/${kunci}`, { nilai: nilaiBaru });
    settingsStore.setTetapan(kunci, nilaiBaru);
    tunjukMesej('Tetapan berjaya dikemaskini', true);
  } catch (e) {
    tunjukMesej(e.response?.data?.mesej || 'Gagal kemaskini tetapan', false);
  } finally {
    toggling.value = null;
  }
};

const tunjukMesej = (teks, ok) => {
  mesej.value   = teks;
  mesejOk.value = ok;
  setTimeout(() => { mesej.value = ''; }, 3000);
};

const simpanCategoryCode = async () => {
  menyimpanFpx.value = true;
  fpxSimpanMesej.value = '';
  try {
    await api.put('/settings/teks/category_code_sumbangan', { nilai_teks: categoryCodeSumbangan.value });
    fpxSimpanOk.value   = true;
    fpxSimpanMesej.value = 'Kod kategori berjaya disimpan.';
    setTimeout(() => { fpxSimpanMesej.value = ''; }, 3000);
  } catch (e) {
    fpxSimpanOk.value   = false;
    fpxSimpanMesej.value = e.response?.data?.mesej || 'Gagal menyimpan.';
  } finally { menyimpanFpx.value = false; }
};

const muatCategoryCode = async () => {
  try {
    const res = await api.get('/settings/teks/category_code_sumbangan');
    categoryCodeSumbangan.value = res.data.nilai_teks || '';
  } catch { categoryCodeSumbangan.value = ''; }
};

// ── Acara Khas ────────────────────────────────────────────────────
const senaraiAcara  = ref([]);
const loadingAcara  = ref(false);
const showFormAcara = ref(false);
const savingAcara   = ref(false);
const formAcara     = ref({ nama: '', deskripsi: '' });

const muatAcara = async () => {
  loadingAcara.value = true;
  try {
    const { data } = await api.get('/admin/kewangan/acara-khas');
    senaraiAcara.value = data.data || [];
  } catch { /* */ } finally { loadingAcara.value = false; }
};

const simpanAcara = async () => {
  if (!formAcara.value.nama.trim()) return tunjukMesej('Nama acara wajib diisi.', false);
  savingAcara.value = true;
  try {
    await api.post('/admin/kewangan/acara-khas', formAcara.value);
    showFormAcara.value = false;
    formAcara.value = { nama: '', deskripsi: '' };
    await muatAcara();
    tunjukMesej('Acara khas berjaya ditambah.', true);
  } catch (e) {
    tunjukMesej(e.response?.data?.message || 'Gagal menyimpan.', false);
  } finally { savingAcara.value = false; }
};

const tutupAcara = async (id) => {
  if (!confirm('Tandakan acara ini sebagai SELESAI? Ia tidak akan muncul dalam senarai pilihan transaksi baharu.')) return;
  try {
    await api.put(`/admin/kewangan/acara-khas/${id}`, { status: 'SELESAI' });
    await muatAcara();
    tunjukMesej('Acara ditandakan selesai.', true);
  } catch (e) { tunjukMesej(e.response?.data?.message || 'Gagal.', false); }
};

const aktifkanAcara = async (id) => {
  try {
    await api.put(`/admin/kewangan/acara-khas/${id}`, { status: 'AKTIF' });
    await muatAcara();
    tunjukMesej('Acara diaktifkan semula.', true);
  } catch (e) { tunjukMesej(e.response?.data?.message || 'Gagal.', false); }
};

// ── Pakej Sumbangan ────────────────────────────────────────────────
const acaraTerbukaPakej = ref(null);
const senaraiPakej      = ref({});  // keyed by acara.id
const loadingPakej      = ref(false);
const formPakejAcaraId  = ref(null);
const savingPakej       = ref(false);
const formPakej         = ref({ nama: '', amaun_pakej: '' });

const togolPakej = async (acaraId) => {
  if (acaraTerbukaPakej.value === acaraId) {
    acaraTerbukaPakej.value = null;
    return;
  }
  acaraTerbukaPakej.value = acaraId;
  if (!senaraiPakej.value[acaraId]) {
    await muatPakej(acaraId);
  }
};

const muatPakej = async (acaraId) => {
  loadingPakej.value = true;
  try {
    const { data } = await api.get(`/admin/kewangan/acara-khas/${acaraId}/pakej`);
    senaraiPakej.value = { ...senaraiPakej.value, [acaraId]: data.data || [] };
  } catch { /* */ } finally { loadingPakej.value = false; }
};

const bukaFormPakej = (acaraId) => {
  formPakejAcaraId.value = acaraId;
  formPakej.value = { nama: '', amaun_pakej: '' };
};

const simpanPakej = async (acaraId) => {
  if (!formPakej.value.nama.trim()) return tunjukMesej('Nama pakej wajib diisi.', false);
  savingPakej.value = true;
  try {
    await api.post(`/admin/kewangan/acara-khas/${acaraId}/pakej`, formPakej.value);
    formPakejAcaraId.value = null;
    await muatPakej(acaraId);
    tunjukMesej('Pakej berjaya ditambah.', true);
  } catch (e) {
    tunjukMesej(e.response?.data?.message || 'Gagal menyimpan pakej.', false);
  } finally { savingPakej.value = false; }
};

const togolStatusPakej = async (pkj) => {
  const statusBaharu = pkj.status === 'AKTIF' ? 'TUTUP' : 'AKTIF';
  try {
    await api.put(`/admin/kewangan/pakej/${pkj.id}`, { status: statusBaharu });
    await muatPakej(acaraTerbukaPakej.value);
    tunjukMesej(`Pakej ${statusBaharu === 'AKTIF' ? 'diaktifkan' : 'ditutup'}.`, true);
  } catch (e) { tunjukMesej(e.response?.data?.message || 'Gagal.', false); }
};

onMounted(async () => {
  if (!settingsStore.dimuat) {
    loading.value = true;
    await settingsStore.muatTetapan();
    loading.value = false;
  }
  muatCategoryCode();
  muatAcara();
});
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 60px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
