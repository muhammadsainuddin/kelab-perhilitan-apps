<template>
  <Teleport to="body">
    <Transition name="modal-slide">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-stretch">

        <!-- Panel fullscreen -->
        <div class="relative flex flex-col w-full h-full bg-white overflow-hidden">

          <!-- ── TOP BAR ── -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0 bg-white z-10">
            <div class="flex items-center gap-2.5">
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div>
                <p class="text-gray-900 font-black text-xs uppercase tracking-wide leading-none">Profil Ahli</p>
                <p class="text-gray-400 text-[10px] font-mono mt-px">{{ ahliBase?.no_kp }}</p>
              </div>
            </div>
            <button @click="$emit('edit', ahliLengkap)" class="flex items-center gap-1.5 text-[10px] font-bold bg-[#0F4C3A] hover:bg-[#155d47] text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Edit Profil
            </button>
          </div>

          <!-- ── LOADING ── -->
          <div v-if="loading" class="flex-1 flex items-center justify-center bg-gray-50">
            <div class="flex flex-col items-center gap-3">
              <svg class="animate-spin w-7 h-7 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Memuatkan rekod...</p>
            </div>
          </div>

          <!-- ── CONTENT ── -->
          <div v-else class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/60">

            <!-- PROFILE HERO -->
            <div class="bg-white border-b border-gray-100">
              <div class="max-w-5xl mx-auto px-6 py-5">
              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="relative shrink-0">
                  <div class="w-18 h-18 rounded-2xl overflow-hidden bg-linear-to-br from-[#0F4C3A] to-[#08151D] flex items-center justify-center shadow-md">
                    <img v-if="ahliLengkap?.gambar" :src="`${apiBase}/uploads/images/${ahliLengkap.gambar}`" class="w-full h-full object-cover"/>
                    <span v-else class="text-white text-2xl font-black uppercase">{{ (ahliLengkap?.nama_pegawai || '?').charAt(0) }}</span>
                  </div>
                  <div :class="['absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm', ahliLengkap?.status_ahli === 'aktif' ? 'bg-emerald-400' : 'bg-rose-400']"></div>
                </div>

                <!-- Name + badges -->
                <div class="flex-1 min-w-0 pt-0.5">
                  <h2 class="text-base font-black text-gray-900 uppercase leading-tight truncate">{{ ahliLengkap?.nama_pegawai || '—' }}</h2>
                  <p class="text-gray-500 text-[11px] mt-0.5 truncate">{{ ahliLengkap?.penempatan || 'Tiada penempatan' }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span :class="['text-[9px] font-black px-2 py-0.5 rounded-full border uppercase', badgeStatus(ahliLengkap?.status_ahli)]">
                      {{ ahliLengkap?.status_ahli || 'TIDAK AKTIF' }}
                    </span>
                    <span v-if="ahliLengkap?.jawatan_kelab" :class="['text-[9px] font-bold px-2 py-0.5 rounded-full border', badgeJawatan(ahliLengkap?.jawatan_kelab)]">
                      {{ ahliLengkap?.jawatan_kelab }}
                    </span>
                    <span class="text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full font-mono">
                      {{ ahliLengkap?.no_ahli || 'BELUM JANA' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- YURAN STRIP -->
              <div class="mt-4 grid grid-cols-3 gap-2.5">
                <!-- Yuran bulanan -->
                <div :class="['col-span-1 rounded-xl border p-3 text-center', ahliLengkap?.is_paid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200']">
                  <p :class="['text-[8px] font-bold uppercase tracking-wider', ahliLengkap?.is_paid ? 'text-emerald-500' : 'text-rose-500']">Yuran Bulanan</p>
                  <p :class="['text-lg font-black tabular-nums mt-0.5', ahliLengkap?.is_paid ? 'text-emerald-700' : 'text-rose-700']">RM {{ parseFloat(ahliLengkap?.yuran_kelab_bulanan || 0).toFixed(2) }}</p>
                  <div :class="['inline-flex items-center gap-1 mt-1.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-full', ahliLengkap?.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                    <svg class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="ahliLengkap?.is_paid" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                    {{ ahliLengkap?.is_paid ? 'BERBAYAR' : 'BELUM BAYAR' }}
                  </div>
                </div>

                <!-- Jumlah sumbangan -->
                <div class="col-span-1 bg-linear-to-br from-[#0F4C3A] to-[#08151D] rounded-xl p-3 text-center relative overflow-hidden">
                  <div class="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full pointer-events-none"></div>
                  <p class="text-[8px] font-bold uppercase tracking-wider text-emerald-300 relative z-10">Jumlah Sumbangan</p>
                  <p class="text-lg font-black tabular-nums mt-0.5 text-white relative z-10">RM {{ jumlahSumbangan.toFixed(2) }}</p>
                  <p class="text-[8px] text-white/40 mt-1 relative z-10">Yuran + Kedai</p>
                </div>

                <!-- Gred + saiz + umur -->
                <div class="col-span-1 bg-white border border-gray-200 rounded-xl p-3 space-y-1.5">
                  <div class="flex justify-between items-center">
                    <span class="text-[8px] text-gray-400 font-bold uppercase">Gred</span>
                    <span class="text-[10px] font-black text-gray-800 uppercase">{{ ahliLengkap?.gred_sspa || '—' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-[8px] text-gray-400 font-bold uppercase">Saiz</span>
                    <span class="text-[10px] font-black text-gray-800 uppercase">{{ ahliLengkap?.saiz_baju || '—' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-[8px] text-gray-400 font-bold uppercase">Umur</span>
                    <span class="text-[10px] font-black text-gray-800">{{ kiraUmur(ahliLengkap?.no_kp) }} thn</span>
                  </div>
                </div>
              </div>
              </div><!-- /max-w-5xl hero -->
            </div>

            <!-- MAKLUMAT GRID -->
            <div class="p-5 space-y-3 max-w-5xl mx-auto">

              <!-- Hubungan + Bank (2 col) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <!-- Maklumat hubungan -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-6 h-6 bg-sky-100 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-wider">Maklumat Peribadi</p>
                  </div>
                  <div class="space-y-2.5">
                    <div>
                      <p class="text-[8px] text-gray-400 font-bold uppercase">No. Telefon</p>
                      <p class="text-xs font-bold text-gray-800 font-mono mt-px">{{ ahliLengkap?.phone || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-gray-400 font-bold uppercase">E-mel</p>
                      <p class="text-xs font-bold text-gray-800 truncate mt-px">{{ ahliLengkap?.email || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-gray-400 font-bold uppercase">Kaedah Potongan</p>
                      <span :class="['inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border mt-px', ahliLengkap?.jenis_potongan === 'Potongan Biro angkasa' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200']">
                        {{ ahliLengkap?.jenis_potongan === 'Potongan Biro angkasa' ? 'Biro Angkasa' : 'Bayar Manual / FPX' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Perbankan -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg class="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-wider">Perbankan Ahli</p>
                  </div>
                  <div class="space-y-2.5">
                    <div>
                      <p class="text-[8px] text-gray-400 font-bold uppercase">Nama Bank</p>
                      <p class="text-xs font-bold text-gray-800 uppercase mt-px">{{ ahliLengkap?.nama_bank || '—' }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-gray-400 font-bold uppercase">No. Akaun</p>
                      <p class="text-xs font-bold text-gray-800 font-mono mt-px">{{ ahliLengkap?.no_akaun_bank || '—' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Waris -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  </div>
                  <p class="text-[9px] font-black text-gray-600 uppercase tracking-wider">Waris / Khairat Kematian</p>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <p class="text-[8px] text-gray-400 font-bold uppercase">Nama Waris</p>
                    <p class="text-xs font-bold text-gray-800 uppercase mt-px">{{ ahliLengkap?.nama_waris || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[8px] text-gray-400 font-bold uppercase">No. Telefon Waris</p>
                    <p class="text-xs font-bold text-gray-800 font-mono mt-px">{{ ahliLengkap?.no_phone_waris || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[8px] text-gray-400 font-bold uppercase">Bank Waris</p>
                    <p class="text-xs font-bold text-gray-800 uppercase mt-px">{{ ahliLengkap?.nama_bank_waris || '—' }}</p>
                    <p class="text-[9px] text-gray-400 font-mono">{{ ahliLengkap?.akaun_bank_waris || '' }}</p>
                  </div>
                </div>
              </div>

              <!-- Baju percuma -->
              <div v-if="tuntutBajuPercuma" class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-base shrink-0">👕</div>
                <div class="flex-1">
                  <p class="text-amber-900 font-bold text-xs">Tuntutan Baju / Item Percuma Kelab</p>
                  <p class="text-amber-600 text-[10px] mt-0.5">Ahli ini telah menuntut merchandise percuma kelab.</p>
                </div>
                <span class="bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase shrink-0">Dituntut</span>
              </div>

              <!-- TABS -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="flex border-b border-gray-100 bg-gray-50/80 overflow-x-auto">
                  <button @click="tab = 'kewangan'" :class="['flex items-center gap-1.5 px-5 py-3 text-[10px] font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-widest', tab === 'kewangan' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Sejarah FPX
                    <span v-if="rekodTransaksi.length > 0" :class="['text-[8px] font-black px-1.5 py-px rounded-full leading-none', tab === 'kewangan' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodTransaksi.length }}</span>
                  </button>
                  <button @click="tab = 'acara'" :class="['flex items-center gap-1.5 px-5 py-3 text-[10px] font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-widest', tab === 'acara' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Acara Disertai
                    <span v-if="rekodAcara.length > 0" :class="['text-[8px] font-black px-1.5 py-px rounded-full leading-none', tab === 'acara' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodAcara.length }}</span>
                  </button>
                  <button @click="tab = 'kebajikan'" :class="['flex items-center gap-1.5 px-5 py-3 text-[10px] font-black border-b-2 whitespace-nowrap transition-all uppercase tracking-widest', tab === 'kebajikan' ? 'border-[#0F4C3A] text-[#0F4C3A] bg-white' : 'border-transparent text-gray-400 hover:text-gray-700']">
                    Bantuan
                    <span v-if="rekodBantuan.length > 0" :class="['text-[8px] font-black px-1.5 py-px rounded-full leading-none', tab === 'kebajikan' ? 'bg-[#0F4C3A] text-white' : 'bg-gray-200 text-gray-600']">{{ rekodBantuan.length }}</span>
                  </button>
                </div>

                <!-- TAB: Sejarah FPX -->
                <div v-if="tab === 'kewangan'" class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-400 text-[9px] uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-3 font-bold">Tarikh</th>
                        <th class="px-4 py-3 font-bold">Butiran</th>
                        <th class="px-4 py-3 font-bold text-right">Amaun</th>
                        <th class="px-4 py-3 font-bold text-center">Status</th>
                        <th class="px-4 py-3 font-bold text-center">Resit</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="rekodTransaksi.length === 0">
                        <td colspan="5" class="px-4 py-10 text-center text-gray-400 text-xs">Tiada rekod bayaran untuk ahli ini.</td>
                      </tr>
                      <tr v-for="tx in rekodTransaksi" :key="tx.billCode" class="hover:bg-gray-50/60 transition-colors">
                        <td class="px-4 py-3 text-[10px] text-gray-500 font-medium whitespace-nowrap">{{ tx.tarikh }}</td>
                        <td class="px-4 py-3 text-[11px] font-bold text-gray-800 max-w-45 truncate" :title="tx.keterangan">{{ tx.keterangan }}</td>
                        <td class="px-4 py-3 text-right font-black text-sm tabular-nums" :class="tx.status === 'BERJAYA' ? 'text-emerald-600' : 'text-gray-700'">RM {{ parseFloat(tx.amaun).toFixed(2) }}</td>
                        <td class="px-4 py-3 text-center">
                          <span :class="['text-[8px] font-black uppercase px-2 py-0.5 rounded border', tx.status === 'BERJAYA' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : tx.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700']">{{ tx.status }}</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <button v-if="tx.status === 'BERJAYA'" @click="cetakResit(tx)" class="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1">
                            <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>Cetak
                          </button>
                          <span v-else class="text-gray-300 text-[9px]">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TAB: Acara -->
                <div v-else-if="tab === 'acara'" class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-400 text-[9px] uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th class="px-4 py-3 font-bold">Tarikh Acara</th>
                        <th class="px-4 py-3 font-bold">Nama Acara</th>
                        <th class="px-4 py-3 font-bold">Kategori</th>
                        <th class="px-4 py-3 font-bold">Tarikh Daftar</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-if="rekodAcara.length === 0">
                        <td colspan="4" class="px-4 py-10 text-center text-gray-400 text-xs">Ahli ini belum menyertai sebarang acara kelab.</td>
                      </tr>
                      <tr v-for="(a, idx) in rekodAcara" :key="idx" class="hover:bg-gray-50/60 transition-colors">
                        <td class="px-4 py-3 text-[10px] font-bold text-[#0F4C3A] whitespace-nowrap">{{ a.tarikh_acara }}</td>
                        <td class="px-4 py-3 text-[11px] font-bold text-gray-800">
                          {{ a.nama_acara }}
                          <span class="ml-1 text-[8px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded">{{ a.jenis_acara || 'Umum' }}</span>
                        </td>
                        <td class="px-4 py-3 text-[10px] text-gray-600 font-medium">{{ a.kategori || 'Individu' }}</td>
                        <td class="px-4 py-3 text-[10px] text-gray-400 font-mono">{{ a.tarikh_daftar }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TAB: Kebajikan -->
                <div v-else-if="tab === 'kebajikan'" class="p-4 space-y-2.5">
                  <div v-if="rekodBantuan.length === 0" class="text-center py-10 text-gray-400 text-xs">Tiada rekod permohonan bantuan kebajikan.</div>
                  <div v-for="b in rekodBantuan" :key="b.id" class="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-center gap-3">
                    <div class="flex-1 min-w-0">
                      <p class="text-gray-900 font-bold text-xs">{{ b.jenis_bantuan }}</p>
                      <p class="text-gray-500 text-[10px] mt-0.5 line-clamp-2">{{ b.keterangan || 'Tiada butiran lanjut' }}</p>
                      <p class="text-gray-400 text-[9px] font-mono mt-1.5">{{ b.tarikh_mohon }}</p>
                    </div>
                    <div class="shrink-0 text-right">
                      <span :class="['text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border block text-center', b.status_permohonan === 'LULUS' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : b.status_permohonan === 'DITOLAK' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200']">
                        {{ b.status_permohonan || 'DIPROSES' }}
                      </span>
                      <p v-if="b.status_permohonan === 'LULUS'" class="text-emerald-600 font-black text-sm mt-1 tabular-nums">RM {{ parseFloat(b.amaun_lulus || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../../services/api';
import { headerResitHTML, footerResitHTML } from '../../config/kelab';

const props = defineProps({ show: Boolean, ahliBase: Object });
const emit = defineEmits(['close', 'edit']);
const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const loading = ref(false);
const ahliLengkap = ref(null);
const tab = ref('kewangan');
const rekodTransaksi = ref([]);
const rekodBantuan = ref([]);
const rekodAcara = ref([]);
const jumlahSumbangan = ref(0);
const tuntutBajuPercuma = ref(false);

const badgeStatus = (s) => {
  const status = (s || '').toLowerCase();
  if (status === 'aktif') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'tidak aktif' || status === 'berhenti') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const badgeJawatan = (j) => {
  if (!j) return '';
  if (j === 'Yang Dipertua') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (j === 'Naib Yang Dipertua') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  if (['Setiausaha', 'Penolong Setiausaha'].includes(j)) return 'bg-sky-100 text-sky-800 border-sky-200';
  if (['Bendahari', 'Penolong Bendahari'].includes(j)) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (j === 'Auditor') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-teal-100 text-teal-800 border-teal-200';
};

const kiraUmur = (ic) => {
  if (!ic || ic.length < 6) return '—';
  let year = parseInt(ic.substring(0, 2));
  year += (year > parseInt(new Date().getFullYear().toString().substring(2))) ? 1900 : 2000;
  return new Date().getFullYear() - year;
};

watch(() => props.show, async (newVal) => {
  if (newVal && props.ahliBase?.no_kp) {
    loading.value = true;
    tab.value = 'kewangan';
    ahliLengkap.value = { ...props.ahliBase };
    jumlahSumbangan.value = 0;
    tuntutBajuPercuma.value = false;
    rekodTransaksi.value = [];
    rekodBantuan.value = [];
    rekodAcara.value = [];

    try {
      const resProfil = await api.get(`/admin/profil-ahli/${props.ahliBase.no_kp}`);
      if (resProfil.data?.success) ahliLengkap.value = resProfil.data.data;

      const resResit = await api.get('/admin/sejarah-bayaran');
      if (resResit.data?.success) {
        const semuaTx = resResit.data.data.filter(t => t.no_kp === props.ahliBase.no_kp);
        rekodTransaksi.value = semuaTx;
        jumlahSumbangan.value = semuaTx.filter(t => t.status === 'BERJAYA').reduce((sum, t) => sum + parseFloat(t.amaun), 0);
        tuntutBajuPercuma.value = semuaTx.some(t => parseFloat(t.amaun) === 0 && t.keterangan.toLowerCase().includes('kedai'));
      }

      const resKebajikan = await api.get('/admin/kebajikan');
      if (resKebajikan.data?.success) {
        rekodBantuan.value = resKebajikan.data.data.filter(b => b.no_kp === props.ahliBase.no_kp);
      }

      try {
        const resAcara = await api.get(`/admin/acara-ahli/${props.ahliBase.no_kp}`);
        if (resAcara.data?.success) rekodAcara.value = resAcara.data.data;
      } catch (e) {}

    } catch (e) {
      console.error('Gagal muat profil 360', e);
    } finally {
      loading.value = false;
    }
  }
});

const cetakResit = (tx) => {
  const w = window.open('', '_blank', 'width=600,height=500');
  w.document.write(`
    <html><head><title>Resit ${tx.billCode}</title>
    <style>body{font-family:Arial;padding:30px;color:#333} .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}</style>
    </head><body>
    ${headerResitHTML('Resit Transaksi Pembayaran')}
    <div style="background:#f9f9f9;padding:15px;border-radius:8px">
      <div class="row"><span style="color:#888">Nama:</span><strong>${ahliLengkap.value?.nama_pegawai}</strong></div>
      <div class="row"><span style="color:#888">No KP:</span><strong>${ahliLengkap.value?.no_kp}</strong></div>
      <div class="row"><span style="color:#888">Tarikh:</span><strong>${tx.tarikh}</strong></div>
      <div class="row"><span style="color:#888">Rujukan:</span><strong>${tx.billCode}</strong></div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:15px 0"/>
      <div class="row"><span style="color:#888">Keterangan:</span><strong>${tx.keterangan}</strong></div>
      <div class="row" style="margin-top:15px;font-size:16px"><span style="color:#888">JUMLAH (RM):</span><strong style="color:#0F4C3A">${parseFloat(tx.amaun).toFixed(2)}</strong></div>
    </div>
    ${footerResitHTML()}
    </body></html>
  `);
  w.document.close();
  setTimeout(() => w.print(), 400);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

.modal-slide-enter-active { transition: opacity 0.18s ease; }
.modal-slide-leave-active { transition: opacity 0.15s ease; }
.modal-slide-enter-from { opacity: 0; }
.modal-slide-leave-to { opacity: 0; }
</style>
