<template>
  <div class="-mx-5 -mt-6 bg-[#F8FAFC] animate-page-in">

    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileChange" />

    <!-- ═══════════════════════════════════════
         HERO — Premium Identity Card
         ═══════════════════════════════════════ -->
    <!-- Hero — flat bottom, body overlaps -->
    <div class="relative overflow-hidden bg-[#081C15]">
      <!-- noise texture -->
      <div class="absolute inset-0 opacity-[0.035]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 128px;"></div>
      <!-- glow blobs -->
      <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 70%);"></div>
      <div class="absolute top-1/2 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(27,67,50,0.45) 0%, transparent 70%);"></div>
      <!-- gold top line -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full"
        style="background: linear-gradient(90deg, transparent, #D4AF37, transparent);"></div>

      <div class="relative z-10 px-5 pt-10 pb-16">
        <!-- avatar + identity row -->
        <div class="flex items-center gap-4 mb-6">
          <!-- avatar with gradient ring -->
          <div class="relative shrink-0">
            <div class="absolute -inset-1 rounded-full pointer-events-none"
              style="background: conic-gradient(from 0deg, #52B788, #D4AF37, #95D5B2, #52B788); border-radius: 9999px;"></div>
            <div class="absolute -inset-0.75 rounded-full pointer-events-none"
              style="background: conic-gradient(from 90deg, #52B788 0%, #D4AF37 50%, #95D5B2 100%); filter: blur(8px); opacity: 0.4;"></div>
            <div @click="triggerUpload"
              class="relative w-21 h-21 rounded-full cursor-pointer group overflow-hidden"
              style="box-shadow: 0 0 0 2.5px #081C15, 0 0 28px rgba(82,183,136,0.25);">
              <img v-if="profil.gambar"
                :src="`${uploadBase}/uploads/images/${profil.gambar}`"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-[#1B4332] text-[2rem] font-black leading-none"
                style="color: #95D5B2;">
                {{ profil.nama_penuh?.charAt(0) || '?' }}
              </div>
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style="background: rgba(8,28,21,0.78); backdrop-filter: blur(4px);">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-[7px] text-white/80 font-bold uppercase tracking-widest">Ubah</span>
              </div>
            </div>
          </div>

          <!-- identity -->
          <div class="flex-1 min-w-0">
            <p class="text-[9px] font-bold uppercase tracking-[0.22em] mb-1" style="color: rgba(82,183,136,0.7);">Profil Ahli</p>
            <h1 class="text-[19px] font-black text-white leading-tight tracking-wide truncate">
              {{ profil.nama_penuh || 'Nama Kakitangan' }}
            </h1>
            <p class="text-[11px] font-medium mt-1 leading-snug truncate" style="color: rgba(149,213,178,0.5);">
              {{ profil.penempatan || 'Sila kemaskini penempatan' }}
            </p>
            <!-- status pill -->
            <div class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.12em]"
              :style="profil.status_ahli !== 'tidak aktif'
                ? 'background: rgba(82,183,136,0.12); color: #95D5B2; border: 1px solid rgba(82,183,136,0.22);'
                : 'background: rgba(239,68,68,0.12); color: #fca5a5; border: 1px solid rgba(239,68,68,0.22);'">
              <span class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="profil.status_ahli !== 'tidak aktif' ? 'bg-[#52B788] animate-pulse' : 'bg-red-400'"></span>
              {{ profil.status_ahli !== 'tidak aktif' ? 'Ahli Aktif' : 'Tidak Aktif' }}
            </div>
          </div>
        </div>

        <!-- stats row — inside hero, before overlap -->
        <div class="grid grid-cols-3 rounded-2xl overflow-hidden"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);">
          <div class="py-3.5 text-center" style="border-right: 1px solid rgba(255,255,255,0.07);">
            <p class="text-[7.5px] font-bold uppercase tracking-[0.16em] mb-1" style="color: rgba(149,213,178,0.4);">Gred SSPA</p>
            <p class="text-[15px] font-black text-white uppercase leading-none">{{ profil.gred_sspa || '—' }}</p>
          </div>
          <div class="py-3.5 text-center" style="border-right: 1px solid rgba(255,255,255,0.07);">
            <p class="text-[7.5px] font-bold uppercase tracking-[0.16em] mb-1" style="color: rgba(149,213,178,0.4);">Saiz Baju</p>
            <p class="text-[15px] font-black text-white uppercase leading-none">{{ profil.saiz_baju || '—' }}</p>
          </div>
          <div class="py-3.5 text-center">
            <p class="text-[7.5px] font-bold uppercase tracking-[0.16em] mb-1" style="color: rgba(149,213,178,0.4);">Yuran DB</p>
            <p class="text-[15px] font-black leading-none font-mono" style="color: #D4AF37;">
              RM {{ parseFloat(profil.yuran_kelab_bulanan || 0).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════
         CONTENT BODY — overlaps hero
         ═══════════════════════════════════════ -->
    <div class="px-4 space-y-4 -mt-10 relative z-10">

      <!-- ─── FPX SPEND CARD — Revolut style ─── -->
      <div class="rounded-[24px] overflow-hidden" style="background: #0F172A; box-shadow: 0 4px 24px rgba(8,28,21,0.15);">
        <div class="p-5">
          <div class="flex items-start justify-between mb-1">
            <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: rgba(148,163,184,0.7);">Jumlah Perbelanjaan FPX</p>
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(82,183,136,0.12);">
              <svg class="w-4 h-4" style="color: #52B788;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
          </div>
          <p class="text-[34px] font-black text-white tabular-nums leading-none tracking-tight">
            {{ fmtRM(jumlahPerbelanjaan) }}
          </p>
          <p class="text-[10px] font-medium mt-2" style="color: rgba(100,116,139,0.8);">
            {{ txBerjaya.length }} transaksi berjaya sepanjang masa
          </p>

          <!-- split bar -->
          <div class="mt-4 h-[3px] rounded-full overflow-hidden" style="background: rgba(255,255,255,0.06);">
            <div class="h-full rounded-full transition-all duration-700"
              :style="`width: ${jumlahPerbelanjaan > 0 ? (jumlahYuran / jumlahPerbelanjaan * 100).toFixed(1) : 50}%; background: linear-gradient(90deg, #52B788, #2D6A4F);`"></div>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-3">
            <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
              <div class="flex items-center gap-1.5 mb-1.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background: #52B788;"></div>
                <p class="text-[8px] font-black uppercase tracking-wider" style="color: rgba(100,116,139,0.8);">Yuran Keahlian</p>
              </div>
              <p class="text-[13px] font-black text-white tabular-nums">{{ fmtRM(jumlahYuran) }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
              <div class="flex items-center gap-1.5 mb-1.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background: #D4AF37;"></div>
                <p class="text-[8px] font-black uppercase tracking-wider" style="color: rgba(100,116,139,0.8);">Belian Kedai</p>
              </div>
              <p class="text-[13px] font-black text-white tabular-nums">{{ fmtRM(jumlahKedai) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── QUICK ACTIONS ─── -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Kemas Kini -->
        <button @click="bukaModalEdit"
          class="relative overflow-hidden rounded-[20px] p-4 text-left group transition-all duration-200 active:scale-[0.96]"
          style="background: #1B4332; border: 1px solid rgba(82,183,136,0.2); box-shadow: 0 2px 12px rgba(8,28,21,0.2);">
          <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
            style="background: radial-gradient(circle, rgba(82,183,136,0.15) 0%, transparent 70%);"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style="background: rgba(82,183,136,0.15);">
            <svg class="w-4.5 h-4.5" style="color: #95D5B2;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <p class="text-[11px] font-black text-white uppercase tracking-wider leading-tight">Kemas Kini</p>
          <p class="text-[9px] font-medium mt-0.5" style="color: rgba(149,213,178,0.5);">Data profil</p>
        </button>

        <!-- Mohon Berhenti -->
        <button @click="bukaModalBerhenti"
          :disabled="profil.status_ahli === 'tidak aktif'"
          class="relative overflow-hidden rounded-[20px] p-4 text-left group transition-all duration-200"
          :class="profil.status_ahli === 'tidak aktif' ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.96]'"
          style="background: #fefce8; border: 1px solid rgba(217,119,6,0.2); box-shadow: 0 2px 12px rgba(217,119,6,0.06);">
          <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
            style="background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%);"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-amber-100">
            <svg class="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
          </div>
          <p class="text-[11px] font-black text-amber-900 uppercase tracking-wider leading-tight">
            {{ profil.status_ahli === 'tidak aktif' ? 'Telah Berhenti' : 'Mohon Berhenti' }}
          </p>
          <p class="text-[9px] font-medium mt-0.5 text-amber-600/60">Penamatan keahlian</p>
        </button>
      </div>

      <!-- ─── BENTO INFO GRID ─── -->
      <!-- Section label -->
      <div class="flex items-center gap-2 px-1 pt-1">
        <div class="w-1 h-4 rounded-full" style="background: #52B788;"></div>
        <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #64748B;">Maklumat Peribadi</p>
      </div>

      <!-- Bank + Waris Bento -->
      <div class="grid grid-cols-2 gap-3">

        <!-- Bank Ahli - spans left -->
        <div class="col-span-2 rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #E2E8F0; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
          <div class="flex items-center gap-2.5 px-4 pt-4 pb-2.5">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center" style="background: #081C15;">
              <svg class="w-3 h-3" style="color: #52B788;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">Perbankan Ahli</p>
          </div>
          <div class="px-4 pb-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">Nama Bank</p>
              <p class="text-[12px] font-black uppercase leading-snug" style="color: #0F172A;">{{ profil.bank_ahli || '—' }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">No. Akaun</p>
              <p class="text-[12px] font-black font-mono leading-snug truncate" style="color: #0F172A;">{{ profil.no_acc_bank || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Waris - full width bento -->
        <div class="col-span-2 rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #E2E8F0; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
          <div class="flex items-center gap-2.5 px-4 pt-4 pb-2.5">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center" style="background: #fff1f2; border: 1px solid #fecdd3;">
              <svg class="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">Waris / Khairat</p>
          </div>
          <div class="px-4 pb-4 grid grid-cols-2 gap-2.5">
            <div class="col-span-2 rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">Nama Penuh Waris</p>
              <p class="text-[12px] font-black uppercase leading-snug" style="color: #0F172A;">{{ profil.nama_waris || '—' }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">No. Telefon</p>
              <p class="text-[12px] font-black font-mono leading-snug" style="color: #0F172A;">{{ profil.no_tel_waris || '—' }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">Nama Bank</p>
              <p class="text-[12px] font-black uppercase leading-snug" style="color: #0F172A;">{{ profil.bank_waris || '—' }}</p>
            </div>
            <div class="col-span-2 rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #94a3b8;">No. Akaun Bank Waris</p>
              <p class="text-[12px] font-black font-mono leading-snug" style="color: #0F172A;">{{ profil.no_acc_waris || '—' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── LIST ACTIONS ─── -->
      <div class="rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #E2E8F0; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">

        <!-- Sejarah Transaksi -->
        <button @click="bukaModalTransaksi"
          class="w-full flex items-center gap-3.5 px-4 py-4 transition-colors active:bg-[#F8FAFC] group">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(82,183,136,0.1);">
            <svg class="w-4.5 h-4.5" style="color: #2D6A4F;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[12px] font-black tracking-wide" style="color: #0F172A;">Sejarah Transaksi FPX</p>
            <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Semak semua rekod pembayaran</p>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[9px] font-black px-2 py-0.5 rounded-full" style="background: rgba(82,183,136,0.1); color: #2D6A4F;">
              {{ txBerjaya.length }}
            </span>
            <svg class="w-4 h-4 transition-transform group-active:translate-x-0.5" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </button>

        <!-- divider -->
        <div class="mx-4" style="height: 1px; background: #F1F5F9;"></div>

        <!-- Log Keluar -->
        <button @click="logKeluar"
          class="w-full flex items-center gap-3.5 px-4 py-4 transition-colors active:bg-rose-50/60 group">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(239,68,68,0.08);">
            <svg class="w-4.5 h-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[12px] font-black tracking-wide text-rose-600">Log Keluar Sistem</p>
            <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Tamat sesi log masuk semasa</p>
          </div>
          <svg class="w-4 h-4 transition-transform group-active:translate-x-0.5" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- ─── FOOTER CREDIT ─── -->
      <footer class="pt-2 flex flex-col items-center gap-1.5 text-center select-none">
        <p class="text-[10px] font-medium" style="color: #94a3b8;">
          Develop by <span class="font-black" style="color: #64748B;">Muhammad.S</span>
        </p>
        <div class="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em]" style="color: #94a3b8;">
          <span>Backend</span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black" style="background: #081C15; color: #52B788;">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-4.35-7-10a7 7 0 1114 0c0 5.65-7 10-7 10z"/>
              <circle cx="12" cy="11" r="2.2"/>
            </svg>
            AiGeo
          </span>
        </div>
      </footer>

    </div><!-- end content body -->

    <!-- ═══════════════════════════════════════
         MODAL — KEMAS KINI PROFIL
         ═══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalEdit" class="fixed inset-0 z-9999 flex items-end sm:items-center justify-center"
          style="background: rgba(8,28,21,0.6); backdrop-filter: blur(8px);">
          <div class="bg-white w-full max-w-md shadow-2xl custom-scrollbar overflow-y-auto"
            style="border-radius: 28px 28px 0 0; max-height: 92vh; border-top: 1px solid #E2E8F0;">

            <!-- drag handle -->
            <div class="flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>

            <!-- header -->
            <div class="flex items-center justify-between px-6 py-4 shrink-0" style="border-bottom: 1px solid #F1F5F9;">
              <div>
                <h3 class="text-[15px] font-black uppercase tracking-wide" style="color: #0F172A;">Kemas Kini</h3>
                <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Maklumat profil & keselamatan</p>
              </div>
              <button @click="modalEdit = false"
                class="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                style="background: #F1F5F9; color: #64748B;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="simpanProfil" class="px-6 py-5 space-y-6">

              <!-- section 1 -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-3.5 rounded-full" style="background: #52B788;"></div>
                  <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #52B788;">Peribadi & Pekerjaan</p>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Cawangan Penempatan (PTJ)</label>
                  <select v-model="form.penempatan_id"
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                    <option value="" disabled>— Pilih Lokasi Tugas —</option>
                    <option v-for="ptj in senaraiPTJ" :key="ptj.id" :value="ptj.id">{{ ptj.nama_penempatan }}</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">No. Telefon</label>
                    <input v-model="form.no_tel" type="text"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Saiz Baju</label>
                    <select v-model="form.saiz_baju"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                      <option v-for="s in ['XS','S','M','L','XL','2XL','3XL','4XL','5XL']" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Nama Bank</label>
                    <input v-model="form.bank_ahli" type="text" placeholder="Maybank"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none uppercase transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">No. Akaun Bank</label>
                    <input v-model="form.no_acc_bank" type="text" placeholder="164010…"
                      class="w-full text-xs font-bold font-mono rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                </div>
              </div>

              <!-- section 2 -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-3.5 rounded-full bg-rose-400"></div>
                  <p class="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400">Maklumat Waris</p>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Nama Penuh Waris</label>
                  <input v-model="form.nama_waris" type="text"
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none uppercase transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Tel Waris</label>
                    <input v-model="form.no_tel_waris" type="text"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Hubungan</label>
                    <select v-model="form.hubungan_waris"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                      <option value="Suami / Isteri">Suami / Isteri</option>
                      <option value="Ibu / Bapa">Ibu / Bapa</option>
                      <option value="Adik Beradik">Adik Beradik</option>
                      <option value="Anak">Anak</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Bank Waris</label>
                    <input v-model="form.bank_waris" type="text" placeholder="CIMB"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none uppercase transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">No. Akaun Waris</label>
                    <input v-model="form.no_acc_waris" type="text"
                      class="w-full text-xs font-bold font-mono rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                </div>
              </div>

              <!-- section 3 — password -->
              <div class="rounded-2xl p-4 space-y-3" style="background: #FFF7ED; border: 1px solid rgba(234,88,12,0.15);">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-3.5 rounded-full bg-orange-400"></div>
                  <p class="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Tukar Kata Laluan (Opsyenal)</p>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Kata Laluan Semasa</label>
                  <input v-model="pwdForm.oldPassword" type="password" placeholder="Wajib jika ingin tukar"
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                    style="background: white; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Kata Laluan Baru</label>
                    <input v-model="pwdForm.newPassword" type="password" placeholder="Baru"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: white; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Sahkan</label>
                    <input v-model="pwdForm.confirmPassword" type="password" placeholder="Sahkan"
                      class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                      style="background: white; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                  </div>
                </div>
              </div>

              <!-- actions -->
              <div class="flex gap-3 pb-2">
                <button type="button" @click="modalEdit = false"
                  class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98]"
                  style="background: #F1F5F9; color: #64748B;">
                  Batal
                </button>
                <button type="submit" :disabled="loading"
                  class="flex-2 grow-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                  style="background: #081C15; color: #95D5B2;">
                  <span v-if="loading" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                  {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════
         MODAL — PENAMATAN KEAHLIAN
         ═══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalBerhenti" class="fixed inset-0 z-9999 flex items-end sm:items-center justify-center"
          style="background: rgba(8,28,21,0.6); backdrop-filter: blur(8px);">
          <div class="bg-white w-full max-w-md shadow-2xl"
            style="border-radius: 28px 28px 0 0; border-top: 1px solid #E2E8F0;">

            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>

            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid #FEE2E2;">
              <div>
                <h3 class="text-[15px] font-black uppercase tracking-wide text-rose-700">Penamatan Keahlian</h3>
                <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Tindakan ini tidak boleh diundur</p>
              </div>
              <button @click="modalBerhenti = false"
                class="w-8 h-8 flex items-center justify-center rounded-xl"
                style="background: #FFF1F2; color: #f43f5e;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="hantarBerhenti" class="px-6 py-5 space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Alasan Utama Berhenti</label>
                <select v-model="formBerhenti.sebab_utama" required
                  class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                  <option value="" disabled>— Pilih Alasan —</option>
                  <option value="Berhenti Kerja (Resignation)">Berhenti Kerja (Resignation)</option>
                  <option value="Bersara (Wajib / Pilihan)">Bersara (Wajib / Pilihan)</option>
                  <option value="Berpindah Jabatan / Kementerian">Berpindah Jabatan / Kementerian</option>
                  <option value="Lain-lain Alasan">Lain-lain Alasan</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider ml-0.5" style="color: #64748B;">Ulasan / Catatan Tambahan</label>
                <textarea v-model="formBerhenti.ulasan" rows="3" required
                  placeholder="Nyatakan tarikh berkuatkuasa dan butiran lanjut..."
                  class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none resize-none"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"></textarea>
              </div>
              <div class="flex gap-3 pb-2">
                <button type="button" @click="modalBerhenti = false"
                  class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider"
                  style="background: #F1F5F9; color: #64748B;">Batal</button>
                <button type="submit" :disabled="loading"
                  class="flex-2 grow-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                  style="background: #dc2626; color: white;">
                  <span v-if="loading" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ loading ? 'Memproses...' : 'Sahkan Penamatan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════
         FULLSCREEN — SEJARAH TRANSAKSI
         ═══════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modalTransaksi" class="fixed inset-0 z-9999 flex flex-col" style="background: #F8FAFC;">

        <!-- Header -->
        <div class="shrink-0 px-4 pt-5 pb-3" style="background: white; border-bottom: 1px solid #F1F5F9;">
          <div class="flex items-center gap-3 mb-4">
            <button @click="modalTransaksi = false"
              class="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-95"
              style="background: #F1F5F9; color: #0F172A;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h3 class="text-[14px] font-black uppercase tracking-wide" style="color: #0F172A;">Sejarah Transaksi FPX</h3>
              <p class="text-[10px] font-medium" style="color: #94a3b8;">{{ txTertapis.length }} rekod dijumpai</p>
            </div>
          </div>

          <!-- Search -->
          <div class="relative mb-3">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: #94a3b8;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="cariTx" type="text" placeholder="Cari keterangan atau kod bil..."
              class="w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-2xl outline-none transition-all"
              style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
            <button v-if="cariTx" @click="cariTx = ''"
              class="absolute right-3.5 top-1/2 -translate-y-1/2"
              style="color: #94a3b8;">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Filters -->
          <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <select v-model="filterBulan"
              class="shrink-0 text-[11px] font-bold rounded-xl px-3 py-2 outline-none"
              style="background: #F8FAFC; border: 1px solid #E2E8F0; color: #0F172A;">
              <option value="">Semua Bulan</option>
              <option v-for="b in senaraibulan" :key="b.nilai" :value="b.nilai">{{ b.label }}</option>
            </select>
            <select v-model="filterTahun"
              class="shrink-0 text-[11px] font-bold rounded-xl px-3 py-2 outline-none"
              style="background: #F8FAFC; border: 1px solid #E2E8F0; color: #0F172A;">
              <option value="">Semua Tahun</option>
              <option v-for="t in senaraiTahun" :key="t" :value="t">{{ t }}</option>
            </select>
            <button v-for="s in ['SEMUA','BERJAYA','PENDING','GAGAL']" :key="s"
              @click="filterStatus = s"
              class="shrink-0 text-[10px] font-black uppercase tracking-wide px-3 py-2 rounded-xl transition-all"
              :style="filterStatus === s
                ? 'background: #081C15; color: #95D5B2; border: 1px solid #081C15;'
                : 'background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0;'">
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Stats mini -->
        <div v-if="!loadingTransaksi && txTertapis.length > 0"
          class="shrink-0 px-4 py-3 flex gap-2.5" style="background: white; border-bottom: 1px solid #F1F5F9;">
          <div class="flex-1 rounded-xl p-2.5 text-center" style="background: rgba(82,183,136,0.08); border: 1px solid rgba(82,183,136,0.15);">
            <p class="text-[7px] font-black uppercase tracking-wider mb-0.5" style="color: #2D6A4F;">Jumlah Ditapis</p>
            <p class="text-[12px] font-black tabular-nums" style="color: #1B4332;">
              {{ fmtRM(txTertapis.filter(t => t.status === 'BERJAYA').reduce((a,t) => a + parseFloat(t.amaun||0), 0)) }}
            </p>
          </div>
          <div class="flex-1 rounded-xl p-2.5 text-center" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
            <p class="text-[7px] font-black uppercase tracking-wider mb-0.5" style="color: #94a3b8;">Berjaya</p>
            <p class="text-[12px] font-black tabular-nums" style="color: #0F172A;">{{ txTertapis.filter(t => t.status === 'BERJAYA').length }}</p>
          </div>
          <div class="flex-1 rounded-xl p-2.5 text-center" style="background: #fffbeb; border: 1px solid rgba(245,158,11,0.2);">
            <p class="text-[7px] font-black uppercase tracking-wider mb-0.5" style="color: #92400e;">Pending</p>
            <p class="text-[12px] font-black tabular-nums text-amber-700">{{ txTertapis.filter(t => t.status === 'PENDING').length }}</p>
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <!-- Loading -->
          <div v-if="loadingTransaksi" class="flex flex-col items-center justify-center h-full gap-3">
            <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
            <p class="text-xs font-bold" style="color: #94a3b8;">Memuatkan rekod...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="txTertapis.length === 0" class="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: #F1F5F9;">
              <svg class="w-8 h-8" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="text-center">
              <p class="text-[13px] font-black uppercase" style="color: #0F172A;">Tiada Rekod</p>
              <p class="text-[10px] font-medium mt-1" style="color: #94a3b8;">Cuba ubah carian atau penapis anda</p>
            </div>
            <button @click="resetFilter"
              class="text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all active:scale-95"
              style="background: rgba(82,183,136,0.1); color: #1B4332; border: 1px solid rgba(82,183,136,0.2);">
              Reset Penapis
            </button>
          </div>

          <!-- Transaction items -->
          <div v-else class="p-4 space-y-2.5 pb-8">
            <div v-for="tx in txTertapis" :key="tx.billCode"
              class="bg-white rounded-[18px] overflow-hidden"
              style="border: 1px solid #F1F5F9; box-shadow: 0 1px 4px rgba(15,23,42,0.04);">
              <div class="flex items-center gap-3 px-4 py-3.5">
                <!-- status icon -->
                <div class="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center"
                  :style="tx.status === 'BERJAYA'
                    ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                    : tx.status === 'PENDING'
                      ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                      : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-black uppercase leading-tight truncate" style="color: #0F172A;">{{ tx.keterangan }}</p>
                  <p class="text-[9px] font-mono mt-0.5" style="color: #94a3b8;">{{ tx.billCode }}</p>
                  <p class="text-[9px] font-medium mt-0.5" style="color: #94a3b8;">{{ formatTarikh(tx.tarikh) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-[13px] font-black tabular-nums" style="color: #0F172A;">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
                  <span class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1"
                    :style="tx.status === 'BERJAYA'
                      ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                      : tx.status === 'PENDING'
                        ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                        : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                    {{ tx.status }}
                  </span>
                </div>
              </div>
              <div v-if="tx.status === 'BERJAYA'"
                class="px-4 py-2.5 flex justify-end"
                style="background: #F8FAFC; border-top: 1px solid #F1F5F9;">
                <button @click="lihatResit(tx)"
                  class="text-[9px] font-black uppercase tracking-wide flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                  style="color: #2D6A4F; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.2);">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Lihat Resit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';
import { cetakResitTransaksi } from '../../config/kelab';

const router = useRouter();
const authStore = useAuthStore();

const profil = ref({});
const senaraiPTJ = ref([]);

const modalEdit = ref(false);
const modalBerhenti = ref(false);
const fileInput = ref(null);
const loading = ref(false);

const form = ref({ penempatan_id: '', saiz_baju: '', no_tel: '', email: '', nama_waris: '', no_tel_waris: '', no_acc_waris: '', bank_waris: '', no_acc_bank: '', bank_ahli: '' });
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const formBerhenti = ref({ sebab_utama: '', ulasan: '' });

const modalTransaksi = ref(false);
const sejarahSemua = ref([]);
const loadingTransaksi = ref(false);

// Filter & Search
const cariTx = ref('');
const filterStatus = ref('SEMUA');
const filterBulan = ref('');
const filterTahun = ref('');

const senaraibulan = [
  { nilai: '01', label: 'Januari' }, { nilai: '02', label: 'Februari' },
  { nilai: '03', label: 'Mac' }, { nilai: '04', label: 'April' },
  { nilai: '05', label: 'Mei' }, { nilai: '06', label: 'Jun' },
  { nilai: '07', label: 'Julai' }, { nilai: '08', label: 'Ogos' },
  { nilai: '09', label: 'September' }, { nilai: '10', label: 'Oktober' },
  { nilai: '11', label: 'November' }, { nilai: '12', label: 'Disember' },
];

const senaraiTahun = computed(() => {
  const tahun = new Set(sejarahSemua.value.map(t => (t.tarikh || '').substring(0, 4)).filter(Boolean));
  return [...tahun].sort((a, b) => b - a);
});

const txTertapis = computed(() => {
  return sejarahSemua.value.filter(tx => {
    const cari = cariTx.value.toLowerCase();
    const padan = !cari || (tx.keterangan || '').toLowerCase().includes(cari) || (tx.billCode || '').toLowerCase().includes(cari);
    const statusOk = filterStatus.value === 'SEMUA' || tx.status === filterStatus.value;
    const tarikh = tx.tarikh || '';
    const bulanOk = !filterBulan.value || tarikh.substring(5, 7) === filterBulan.value;
    const tahunOk = !filterTahun.value || tarikh.substring(0, 4) === filterTahun.value;
    return padan && statusOk && bulanOk && tahunOk;
  });
});

const resetFilter = () => {
  cariTx.value = '';
  filterStatus.value = 'SEMUA';
  filterBulan.value = '';
  filterTahun.value = '';
};

const formatTarikh = (tarikh) => {
  if (!tarikh) return '-';
  const d = new Date(tarikh);
  if (isNaN(d)) return tarikh;
  return d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
};

// Ringkasan perbelanjaan (FPX berjaya sahaja)
const txBerjaya = computed(() => sejarahSemua.value.filter(t => t.status === 'BERJAYA'));
const adalahKedai = (t) => /kedai|pesanan|pembelian/i.test(t.keterangan || '');
const jumlahPerbelanjaan = computed(() => txBerjaya.value.reduce((a, t) => a + parseFloat(t.amaun || 0), 0));
const jumlahYuran = computed(() => txBerjaya.value.filter(t => !adalahKedai(t)).reduce((a, t) => a + parseFloat(t.amaun || 0), 0));
const jumlahKedai = computed(() => txBerjaya.value.filter(t => adalahKedai(t)).reduce((a, t) => a + parseFloat(t.amaun || 0), 0));
const fmtRM = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const lihatResit = (tx) => cetakResitTransaksi(tx, profil.value);

// Muat sejarah transaksi (untuk ringkasan + modal)
const muatSejarahSemua = async () => {
  loadingTransaksi.value = true;
  try {
    const { data } = await api.get('/bayaran/sejarah-semua');
    if (data.success) sejarahSemua.value = data.data;
  } catch (e) { console.error('Gagal muat transaksi', e); }
  finally { loadingTransaksi.value = false; }
};

// 1. Tarik Profil Kakitangan
const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error("Gagal menarik profil:", e); }
};

// 2. Tarik Senarai Penempatan
const fetchSenaraiPTJ = async () => {
  try {
    const res = await api.get('/user/senarai-ptj');
    senaraiPTJ.value = res.data.data || [];
  } catch (error) { console.error("Gagal menarik senarai PTJ:", error); }
};

// 3. Muat Naik Gambar Profil Menggunakan Multer
const triggerUpload = () => fileInput.value.click();
const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('gambar', file);

  try {
    await api.put('/user/kemaskini-gambar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    fetchProfil();
    alert("Gambar profil anda berjaya dikemas kini!");
  } catch (error) {
    alert("Gagal memuat naik gambar profil.");
  }
};

const bukaModalTransaksi = async () => {
  modalTransaksi.value = true;
  if (sejarahSemua.value.length === 0) await muatSejarahSemua();
};

const bukaModalEdit = () => {
  form.value = {
    penempatan_id: profil.value.penempatan_id || '',
    saiz_baju: profil.value.saiz_baju || 'M',
    no_tel: profil.value.no_tel || '',
    email: profil.value.email || '',
    nama_waris: profil.value.nama_waris || '',
    hubungan_waris: profil.value.hubungan_waris || 'Suami / Isteri',
    no_tel_waris: profil.value.no_tel_waris || '',
    no_acc_waris: profil.value.no_acc_waris || '',
    bank_waris: profil.value.bank_waris || '',
    no_acc_bank: profil.value.no_acc_bank || '',
    bank_ahli: profil.value.bank_ahli || ''
  };
  pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  modalEdit.value = true;
};

// 4. Pengendalian Kemaskini Profil & Keselamatan
const simpanProfil = async () => {
  loading.value = true;
  try {
    await api.put('/user/kemaskini-profil', {
      email: form.value.email,
      no_tel: form.value.no_tel,
      saiz_baju: form.value.saiz_baju,
      nama_waris: form.value.nama_waris,
      no_tel_waris: form.value.no_tel_waris,
      no_acc_waris: form.value.no_acc_waris,
      bank_waris: form.value.bank_waris,
      penempatan_id: form.value.penempatan_id,
      no_acc_bank: form.value.no_acc_bank,
      bank_ahli: form.value.bank_ahli
    });

    if (pwdForm.value.newPassword && pwdForm.value.newPassword.trim() !== '') {
      if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
        alert("Sila pastikan pengesahan kata laluan baru adalah sepadan.");
        loading.value = false;
        return;
      }
      await api.put('/user/tukar-password', {
        oldPassword: pwdForm.value.oldPassword,
        newPassword: pwdForm.value.newPassword
      });
    }

    alert("Segala perubahan profil berjaya disimpan.");
    modalEdit.value = false;
    fetchProfil();
  } catch (e) {
    alert(e.response?.data?.message || "Gagal mengemaskini maklumat akaun.");
  } finally { loading.value = false; }
};

const bukaModalBerhenti = () => {
  formBerhenti.value = { sebab_utama: '', ulasan: '' };
  modalBerhenti.value = true;
};

// 5. Permohonan Penamatan Keahlian
const hantarBerhenti = async () => {
  if (!confirm("Adakah anda benar-benar pasti? Tindakan ini akan terus menukar status keahlian anda kepada Tidak Aktif.")) return;
  loading.value = true;
  try {
    await api.post('/user/mohon-berhenti', {
      sebab_berhenti: `${formBerhenti.value.sebab_utama}: ${formBerhenti.value.ulasan}`
    });
    alert("Permohonan penamatan kelab anda telah diproses secara automatik.");
    modalBerhenti.value = false;
    fetchProfil();
  } catch (error) {
    alert(error.response?.data?.message || "Gagal memproses permohonan penamatan.");
  } finally { loading.value = false; }
};

const logKeluar = () => {
  if (confirm("Adakah anda pasti mahu log keluar dari aplikasi?")) {
    authStore.logout();
    router.push('/login');
  }
};

onMounted(() => {
  fetchProfil();
  fetchSenaraiPTJ();
  muatSejarahSemua();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 99px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }

/* Page enter */
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* Modal transitions */
.modal-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-enter-from > div { transform: translateY(40px); }
.modal-leave-to > div { transform: translateY(40px); }

/* Pop-in for modals inner */
.animate-pop-in { animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>
