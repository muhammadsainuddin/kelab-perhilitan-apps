
<template>
  <Transition name="fullscreen-fade">
    <div v-if="show" class="fixed inset-0 z-50 bg-gray-50 flex flex-col">

      <!-- HEADER BAR -->
      <div class="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-[#0F4C3A]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Pengurusan Acara</p>
            <h2 class="text-base font-black text-gray-900 leading-tight">{{ modEdit ? 'Kemaskini Maklumat Acara' : 'Cipta Acara Baru' }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="emit('tutup')"
            class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            Batal
          </button>
          <button @click="simpan" :disabled="menyimpan"
            class="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2 min-w-38 justify-center">
            <svg v-if="menyimpan" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            {{ menyimpan ? 'Menyimpan...' : (modEdit ? 'Simpan Perubahan' : 'Cipta Acara') }}
          </button>
        </div>
      </div>

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- KIRI: Form Fields -->
          <div class="lg:col-span-2 space-y-5">

            <div v-if="errorMsg"
              class="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium">
              <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorMsg }}
            </div>

            <!-- Maklumat Asas -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Maklumat Asas</h4>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Nama Acara <span class="text-rose-500 font-black">*</span>
                </label>
                <input type="text" v-model="form.nama_acara"
                  placeholder="cth: Karnival Sukan PERHILITAN 2025"
                  class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Kategori Aktiviti</label>
                  <select v-model="form.jenis_acara"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                    <option value="SUKAN">SUKAN & PERTANDINGAN</option>
                    <option value="KEBAJIKAN">SUMBANGAN & KEBAJIKAN</option>
                    <option value="SOSIAL">SOSIAL & KESUKARELAAN</option>
                    <option value="MESYUARAT">MESYUARAT & SAMBUTAN</option>
                  </select>
                </div>
                <div v-if="modEdit">
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status Sesi</label>
                  <select v-model="form.status"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                    <option value="AKTIF">AKTIF — Daftar Terbuka</option>
                    <option value="TUTUP">TUTUP — Pendaftaran Ditutup</option>
                    <option value="SELESAI">SELESAI — Sesi Tamat</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Konfigurasi Sukan -->
            <div v-if="form.jenis_acara === 'SUKAN'" class="bg-white rounded-2xl border border-emerald-200 p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Konfigurasi Sukan</h4>
                </div>
                <div class="flex items-center gap-2.5">
                  <span class="text-[11px] font-bold text-gray-500">Benarkan Pelbagai Sukan?</span>
                  <button type="button" @click="form.benarkan_pelbagai_sukan = !form.benarkan_pelbagai_sukan"
                    :class="form.benarkan_pelbagai_sukan ? 'bg-emerald-600' : 'bg-gray-200'"
                    class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0">
                    <span :class="form.benarkan_pelbagai_sukan ? 'translate-x-5' : 'translate-x-0.5'"
                      class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 block"></span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase mb-2">Klik untuk Pilih / Buang Sukan:</label>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" v-for="sukan in sukanPreset" :key="sukan" @click="toggleSukanPreset(sukan)"
                    :class="form.senarai_sukan.includes(sukan)
                      ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
                    class="text-xs px-3 py-1.5 border rounded-lg font-semibold transition-all">
                    {{ sukan }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase mb-2">Tambah Sukan Lain:</label>
                <div class="flex gap-2">
                  <input type="text" v-model="inputSukanManual" @keyup.enter="tambahSukanKeSenarai"
                    placeholder="cth: Gasing Moden, Tarik Tali..."
                    class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                  <button type="button" @click="tambahSukanKeSenarai"
                    class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-colors shrink-0">
                    Tambah
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase mb-2">
                  Senarai Dipilih ({{ form.senarai_sukan.length }}):
                </label>
                <div v-if="form.senarai_sukan.length === 0"
                  class="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Sila pilih sekurang-kurangnya satu sukan.
                </div>
                <div v-else class="flex flex-wrap gap-1.5">
                  <span v-for="sukan in form.senarai_sukan" :key="sukan"
                    class="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                    {{ sukan }}
                    <button type="button" @click="padamSukanDariSenarai(sukan)"
                      class="text-emerald-400 hover:text-rose-500 font-black transition-colors text-sm leading-none">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Masa & Lokasi -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Masa & Lokasi</h4>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lokasi Aktiviti</label>
                <input type="text" v-model="form.lokasi"
                  placeholder="cth: Stadium MSN Bukit Jalil, Kuala Lumpur"
                  class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tarikh Acara Mula</label>
                  <input type="date" v-model="form.tarikh_acara"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tarikh Tutup Pendaftaran</label>
                  <input type="date" v-model="form.tarikh_tutup"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                </div>
              </div>
            </div>

            <!-- Maklumat Urusetia -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div class="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Maklumat Urusetia</h4>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">E-mel Urusetia</label>
                  <input type="email" v-model="form.emel_urusetia"
                    placeholder="urusetia@kelabperhilitan.my"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">No. Telefon Urusetia</label>
                  <input type="text" v-model="form.no_tel_urusetia"
                    placeholder="013X-XXXXXXX"
                    class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500">
                </div>
              </div>
            </div>

            <!-- Keterangan -->
            <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Keterangan / Atur Cara</h4>
              </div>
              <textarea v-model="form.keterangan" rows="5"
                placeholder="Perincian kelayakan peserta, pakaian, syarat, jadual pertandingan, dsb."
                class="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"></textarea>
            </div>

          </div>

          <!-- KANAN: Image Upload Panel -->
          <div class="lg:col-span-1">
            <div class="sticky top-6 space-y-4">

              <!-- Image Upload Card -->
              <div class="bg-white rounded-2xl border border-gray-200 p-5">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                      <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h4 class="text-xs font-black text-gray-600 uppercase tracking-widest">Gambar / Poster</h4>
                  </div>
                  <span class="text-[11px] font-black px-2.5 py-1 rounded-lg tabular-nums"
                    :class="failGambar.length >= MAX_GAMBAR ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-500'">
                    {{ failGambar.length }}/{{ MAX_GAMBAR }}
                  </span>
                </div>

                <!-- Existing images (edit mode, no new images selected yet) -->
                <div v-if="modEdit && gambarSedia.length > 0 && failGambar.length === 0"
                  class="mb-4 p-3 bg-sky-50 border border-sky-100 rounded-xl">
                  <p class="text-[11px] font-black text-sky-700 mb-1">{{ gambarSedia.length }} gambar sedia ada</p>
                  <p class="text-[11px] text-sky-600 mb-2">Muat naik gambar baru untuk menggantikan.</p>
                  <div class="grid grid-cols-5 gap-1.5">
                    <div v-for="(fn, i) in gambarSedia" :key="i"
                      class="aspect-square rounded-lg overflow-hidden bg-sky-100 border border-sky-200">
                      <img :src="`${apiBase}/uploads/images/${fn}`" class="w-full h-full object-cover"
                        @error="e => { e.target.style.display='none'; }">
                    </div>
                  </div>
                </div>

                <!-- Drop zone -->
                <label v-if="failGambar.length < MAX_GAMBAR" class="block cursor-pointer group">
                  <input ref="inputGambar" type="file" multiple accept="image/*" @change="handleFileChange" class="hidden">
                  <div class="border-2 border-dashed border-gray-200 group-hover:border-emerald-400 group-hover:bg-emerald-50/40 rounded-xl py-8 px-4 text-center transition-all">
                    <svg class="w-9 h-9 text-gray-300 group-hover:text-emerald-400 mx-auto mb-2.5 transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.25 5.25 0 011.813 6.526A4.5 4.5 0 0117.25 19.5H6.75z"/>
                    </svg>
                    <p class="text-sm font-bold text-gray-500 group-hover:text-emerald-600 transition-colors">Klik untuk pilih gambar</p>
                    <p class="text-[11px] text-gray-400 mt-1">
                      <span class="font-semibold text-emerald-600">{{ MAX_GAMBAR - failGambar.length }}</span> slot lagi tersedia
                    </p>
                  </div>
                </label>
                <div v-else
                  class="border-2 border-dashed border-amber-200 bg-amber-50/50 rounded-xl py-4 text-center">
                  <p class="text-xs text-amber-600 font-bold">Had {{ MAX_GAMBAR }} gambar dicapai</p>
                  <p class="text-[11px] text-amber-500 mt-0.5">Buang gambar untuk muat naik yang baru.</p>
                </div>

                <!-- Preview Grid -->
                <div v-if="failGambar.length > 0" class="mt-3 grid grid-cols-3 gap-2">
                  <div v-for="(item, idx) in failGambar" :key="idx"
                    class="relative group rounded-xl overflow-hidden aspect-square border-2 transition-all"
                    :class="idx === 0 ? 'border-emerald-400' : 'border-gray-200 hover:border-gray-300'">
                    <img :src="item.preview" :alt="`Gambar ${idx + 1}`" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors"></div>
                    <button @click.prevent="buangGambar(idx)"
                      class="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black shadow-md">
                      ✕
                    </button>
                    <div v-if="idx === 0"
                      class="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                      UTAMA
                    </div>
                    <div class="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {{ idx + 1 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Panduan -->
              <div class="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                <h5 class="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-3">Panduan Gambar</h5>
                <ul class="space-y-2">
                  <li class="flex items-start gap-2 text-[11px] text-blue-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    <span>Muat naik maksimum <strong>{{ MAX_GAMBAR }} gambar</strong> setiap acara</span>
                  </li>
                  <li class="flex items-start gap-2 text-[11px] text-blue-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    <span>Gambar <strong>pertama</strong> dijadikan poster utama</span>
                  </li>
                  <li class="flex items-start gap-2 text-[11px] text-blue-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    <span>Format: JPG, PNG, WEBP, GIF</span>
                  </li>
                  <li class="flex items-start gap-2 text-[11px] text-blue-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    <span>Saiz maksimum <strong>20MB</strong> per gambar</span>
                  </li>
                  <li v-if="modEdit" class="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2 mt-1">
                    <span class="shrink-0 font-black">!</span>
                    <span>Muat naik baru akan <strong>menggantikan</strong> semua gambar lama.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({
  show: Boolean,
  modEdit: Boolean,
  idAcara: { type: Number, default: null },
  formAsal: { type: Object, default: null }
});

const emit = defineEmits(['tutup', 'disimpan']);

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
const MAX_GAMBAR = 5;
const sukanPreset = ['Bola Sepak', 'Futsal', 'Badminton', 'Bola Jaring', 'Dart', 'Sumpit', 'Bola Tampar', 'Tenis Meja'];

const inputSukanManual = ref('');
const errorMsg = ref('');
const menyimpan = ref(false);
const failGambar = ref([]);
const gambarSedia = ref([]);
const inputGambar = ref(null);

const formKosong = () => ({
  nama_acara: '',
  jenis_acara: 'SUKAN',
  keterangan: '',
  lokasi: '',
  tarikh_acara: '',
  tarikh_tutup: '',
  emel_urusetia: '',
  no_tel_urusetia: '',
  status: 'AKTIF',
  senarai_sukan: [],
  benarkan_pelbagai_sukan: false
});

const form = ref(formKosong());

watch(() => props.show, (val) => {
  if (!val) return;
  errorMsg.value = '';
  inputSukanManual.value = '';
  failGambar.value = [];

  if (props.modEdit && props.formAsal) {
    form.value = { ...props.formAsal, senarai_sukan: [...(props.formAsal.senarai_sukan || [])] };
    try {
      const p = props.formAsal.poster;
      const parsed = p ? (typeof p === 'string' ? JSON.parse(p) : p) : [];
      gambarSedia.value = Array.isArray(parsed) ? parsed : (parsed ? [String(parsed)] : []);
    } catch {
      gambarSedia.value = [];
    }
  } else {
    form.value = formKosong();
    gambarSedia.value = [];
  }
});

const tambahSukanKeSenarai = () => {
  const sukan = inputSukanManual.value.trim();
  if (sukan && !form.value.senarai_sukan.includes(sukan)) {
    form.value.senarai_sukan.push(sukan);
    inputSukanManual.value = '';
  }
};

const padamSukanDariSenarai = (sukan) => {
  form.value.senarai_sukan = form.value.senarai_sukan.filter(i => i !== sukan);
};

const toggleSukanPreset = (sukan) => {
  if (form.value.senarai_sukan.includes(sukan)) padamSukanDariSenarai(sukan);
  else form.value.senarai_sukan.push(sukan);
};

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const ruang = MAX_GAMBAR - failGambar.value.length;
  files.slice(0, ruang).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      failGambar.value.push({ file, preview: ev.target.result, nama: file.name });
    };
    reader.readAsDataURL(file);
  });
  if (inputGambar.value) inputGambar.value.value = '';
};

const buangGambar = (idx) => {
  failGambar.value.splice(idx, 1);
};

const simpan = async () => {
  errorMsg.value = '';
  if (!form.value.nama_acara.trim()) {
    errorMsg.value = 'Nama acara wajib diisi.';
    return;
  }
  if (form.value.jenis_acara === 'SUKAN' && form.value.senarai_sukan.length === 0) {
    errorMsg.value = 'Sila pilih sekurang-kurangnya satu sukan untuk acara jenis SUKAN.';
    return;
  }

  const fd = new FormData();
  fd.append('nama_acara', form.value.nama_acara);
  fd.append('jenis_acara', form.value.jenis_acara);
  fd.append('keterangan', form.value.keterangan || '');
  fd.append('lokasi', form.value.lokasi || '');
  fd.append('tarikh_acara', form.value.tarikh_acara || '');
  fd.append('tarikh_tutup', form.value.tarikh_tutup || '');
  fd.append('emel_urusetia', form.value.emel_urusetia || '');
  fd.append('no_tel_urusetia', form.value.no_tel_urusetia || '');
  fd.append('status', form.value.status || 'AKTIF');
  fd.append('benarkan_pelbagai_sukan', form.value.benarkan_pelbagai_sukan ? 'true' : 'false');
  fd.append('senarai_sukan',
    form.value.jenis_acara === 'SUKAN' && form.value.senarai_sukan.length > 0
      ? JSON.stringify(form.value.senarai_sukan) : ''
  );
  failGambar.value.forEach(item => fd.append('poster', item.file));

  menyimpan.value = true;
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const res = props.modEdit
      ? await api.put(`/acara/admin/kemaskini/${props.idAcara}`, fd, config)
      : await api.post('/acara/admin/cipta', fd, config);

    if (res.data.success) {
      emit('disimpan', res.data.message || 'Rekod acara berjaya disimpan!');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Ralat sistem berlaku semasa menyimpan maklumat.';
  } finally {
    menyimpan.value = false;
  }
};
</script>

<style scoped>
.fullscreen-fade-enter-active,
.fullscreen-fade-leave-active { transition: opacity 0.18s ease; }
.fullscreen-fade-enter-from,
.fullscreen-fade-leave-to { opacity: 0; }
</style>
