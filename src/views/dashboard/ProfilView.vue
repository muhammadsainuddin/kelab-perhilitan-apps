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
            <div @click="!uploadingGambar && triggerUpload()"
              class="relative w-21 h-21 rounded-full group overflow-hidden"
              :class="uploadingGambar ? 'cursor-not-allowed' : 'cursor-pointer'"
              style="box-shadow: 0 0 0 2.5px #081C15, 0 0 28px rgba(82,183,136,0.25);">
              <img v-if="profil.gambar"
                :src="`${uploadBase}/uploads/images/${profil.gambar}`"
                :alt="profil.nama_penuh || 'Foto profil'"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-[#1B4332] text-[2rem] font-black leading-none"
                style="color: #95D5B2;">
                {{ profil.nama_penuh?.charAt(0) || '?' }}
              </div>
              <!-- Loading overlay semasa upload -->
              <div v-if="uploadingGambar"
                class="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                style="background: rgba(8,28,21,0.82); backdrop-filter: blur(4px);">
                <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style="border-color: rgba(82,183,136,0.4); border-top-color: #52B788;"></div>
                <span class="text-[7px] text-white/70 font-bold uppercase tracking-widest">Menghantar</span>
              </div>
              <!-- Hover overlay (tersembunyi semasa upload) -->
              <div v-else
                class="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
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
            <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #94A3B8;">Jumlah Perbelanjaan FPX</p>
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(82,183,136,0.12);">
              <svg class="w-4 h-4" style="color: #52B788;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
          </div>
          <p class="text-[34px] font-black text-white tabular-nums leading-none tracking-tight">
            {{ fmtRM(jumlahPerbelanjaan) }}
          </p>
          <p class="text-[10px] font-medium mt-2" style="color: #94A3B8;">
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
                <p class="text-[8px] font-black uppercase tracking-wider" style="color: #94A3B8;">Yuran Keahlian</p>
              </div>
              <p class="text-[13px] font-black text-white tabular-nums">{{ fmtRM(jumlahYuran) }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
              <div class="flex items-center gap-1.5 mb-1.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background: #D4AF37;"></div>
                <p class="text-[8px] font-black uppercase tracking-wider" style="color: #94A3B8;">Belian Kedai</p>
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
          <p class="text-[9px] font-medium mt-0.5" style="color: #95D5B2;">Data profil</p>
        </button>

        <!-- Mohon Berhenti -->
        <button @click="bukaModalBerhenti"
          :disabled="profil.status_ahli === 'tidak aktif' || statusBerhenti?.status_permohonan === 'MENUNGGU'"
          class="relative overflow-hidden rounded-[20px] p-4 text-left group transition-all duration-200"
          :class="(profil.status_ahli === 'tidak aktif' || statusBerhenti?.status_permohonan === 'MENUNGGU') ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.96]'"
          style="background: #fefce8; border: 1px solid rgba(217,119,6,0.2); box-shadow: 0 2px 12px rgba(217,119,6,0.06);">
          <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
            style="background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%);"></div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-amber-100">
            <svg v-if="statusBerhenti?.status_permohonan === 'MENUNGGU'" class="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-4.5 h-4.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
          </div>
          <p class="text-[11px] font-black text-amber-900 uppercase tracking-wider leading-tight">
            {{ profil.status_ahli === 'tidak aktif' ? 'Telah Berhenti'
               : statusBerhenti?.status_permohonan === 'MENUNGGU' ? 'Dalam Semakan'
               : statusBerhenti?.status_permohonan === 'DITOLAK' ? 'Mohon Semula'
               : 'Mohon Berhenti' }}
          </p>
          <p class="text-[9px] font-medium mt-0.5 text-amber-700">
            {{ statusBerhenti?.status_permohonan === 'MENUNGGU' ? 'Menunggu keputusan admin'
               : statusBerhenti?.status_permohonan === 'DITOLAK' ? 'Permohonan ditolak'
               : 'Penamatan keahlian' }}
          </p>
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
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #64748B;">Nama Bank</p>
              <p class="text-[12px] font-black uppercase leading-snug" style="color: #0F172A;">{{ profil.bank_ahli || '—' }}</p>
            </div>
            <div class="rounded-xl p-3" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #64748B;">No. Akaun</p>
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
              <p class="text-[8px] font-bold uppercase tracking-wider mb-1" style="color: #64748B;">Nama Bank</p>
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

        <!-- Cap Jari (hanya native + biometri tersedia) -->
        <div v-if="biometriTersedia" class="w-full flex items-center gap-3.5 px-4 py-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(15,76,58,0.08);">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="color: #0F4C3A;">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[12px] font-black tracking-wide" style="color: #0F172A;">Log Masuk Cap Jari</p>
            <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Gunakan cap jari untuk log masuk pantas</p>
          </div>
          <button @click="togolBiometrik"
            class="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none"
            :style="authStore.biometrikAktif ? 'background: #0F4C3A;' : 'background: #E2E8F0;'">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300"
              :style="authStore.biometrikAktif ? 'left: calc(100% - 20px);' : 'left: 4px;'"></span>
          </button>
        </div>

        <!-- divider -->
        <div class="mx-4" style="height: 1px; background: #F1F5F9;"></div>

        <!-- Hubungi Kelab -->
        <button @click="modalHubungi = true; muatSenaraiTiket()"
          class="w-full flex items-center gap-3.5 px-4 py-4 transition-colors active:bg-[#F8FAFC] group">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(59,130,246,0.1);">
            <svg class="w-4.5 h-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[12px] font-black tracking-wide" style="color: #0F172A;">Hubungi Kelab</p>
            <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">Pertanyaan, aduan atau permohonan bantuan</p>
          </div>
          <svg class="w-4 h-4 transition-transform group-active:translate-x-0.5" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- divider sebelum log keluar -->
        <div v-if="biometriTersedia" class="mx-4" style="height: 1px; background: #F1F5F9;"></div>

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

      <!-- ─── PADAM AKAUN ─── -->
      <div class="text-center py-2">
        <button @click="router.push('/padam-akaun')"
          class="text-[10px] font-semibold underline underline-offset-2 transition-colors"
          style="color: #CBD5E1;">
          Minta Pemadaman Akaun & Data
        </button>
      </div>

      <!-- ─── FOOTER CREDIT ─── -->
      <footer class="pt-2 pb-2 flex flex-col items-center gap-1.5 text-center select-none">
        <span class="text-[9px] font-black px-2.5 py-1 rounded-full" style="background: rgba(82,183,136,0.1); color: #2D6A4F; border: 1px solid rgba(82,183,136,0.2);">
          v{{ appVersion }}
        </span>
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
                  <p class="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">Tukar Kata Laluan (Sekiranya Perlu)</p>
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
                <p class="text-[10px] font-medium mt-0.5" style="color: #94a3b8;">
                  {{ statusBerhenti?.status_permohonan === 'DITOLAK' ? 'Permohonan sebelum ini ditolak — mohon semula' : 'Permohonan akan disemak oleh pentadbir' }}
                </p>
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
              <!-- Notis tolak sebelumnya -->
              <div v-if="statusBerhenti?.status_permohonan === 'DITOLAK'"
                class="rounded-2xl px-4 py-3 space-y-1"
                style="background: #FFF1F2; border: 1px solid rgba(244,63,94,0.2);">
                <p class="text-[10px] font-black text-rose-700 uppercase tracking-wider">Permohonan Sebelum Ini Ditolak</p>
                <p class="text-[11px] text-rose-800 leading-relaxed">{{ statusBerhenti.catatan_admin || 'Tiada sebab dinyatakan.' }}</p>
              </div>
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
         MODAL — SEJARAH TRANSAKSI (Bottom Sheet)
         ═══════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalTransaksi"
          class="fixed inset-0 z-9999 flex items-end justify-center"
          style="background: rgba(8,28,21,0.55); backdrop-filter: blur(6px);"
          @click.self="modalTransaksi = false">

          <div class="bg-white w-full max-w-xl flex flex-col overflow-hidden"
            style="border-radius: 28px 28px 0 0; max-height: 90dvh;">

            <!-- Drag handle -->
            <div class="flex justify-center pt-3 pb-2 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>

            <!-- Header -->
            <div class="shrink-0 px-5 pb-3" style="border-bottom: 1px solid #F1F5F9;">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="text-base font-black uppercase tracking-wide" style="color: #0F172A;">Sejarah Transaksi FPX</h3>
                  <p class="text-xs font-medium mt-0.5" style="color: #94a3b8;">{{ txTertapis.length }} rekod dijumpai</p>
                </div>
                <div class="flex items-center gap-2">
                  <!-- PDF Bulanan -->
                  <button @click="cetakPDF('bulan')" title="PDF bulan dipilih"
                    class="text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                    style="background: rgba(82,183,136,0.1); color: #2D6A4F; border: 1px solid rgba(82,183,136,0.25);">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Bulan
                  </button>
                  <!-- PDF Tahunan -->
                  <button @click="cetakPDF('tahun')" title="PDF keseluruhan tahun"
                    class="text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                    style="background: rgba(15,76,58,0.08); color: #0F4C3A; border: 1px solid rgba(15,76,58,0.2);">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Tahun
                  </button>
                  <!-- Tutup -->
                  <button @click="modalTransaksi = false"
                    class="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                    style="background: #F1F5F9; color: #0F172A;">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Search -->
              <div class="relative mb-2.5">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style="color: #94a3b8;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input v-model="cariTx" type="text" placeholder="Cari keterangan atau kod bil..."
                  class="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl outline-none"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                <button v-if="cariTx" @click="cariTx = ''" class="absolute right-3.5 top-1/2 -translate-y-1/2" style="color: #94a3b8;">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Filters -->
              <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <select v-model="filterBulan" class="shrink-0 text-sm font-bold rounded-xl px-3 py-2 outline-none"
                  style="background: #F8FAFC; border: 1px solid #E2E8F0; color: #0F172A;">
                  <option value="">Semua Bulan</option>
                  <option v-for="b in senaraibulan" :key="b.nilai" :value="b.nilai">{{ b.label }}</option>
                </select>
                <select v-model="filterTahun" class="shrink-0 text-sm font-bold rounded-xl px-3 py-2 outline-none"
                  style="background: #F8FAFC; border: 1px solid #E2E8F0; color: #0F172A;">
                  <option value="">Semua Tahun</option>
                  <option v-for="t in senaraiTahun" :key="t" :value="t">{{ t }}</option>
                </select>
                <button v-for="s in ['SEMUA','BERJAYA','PENDING','GAGAL']" :key="s"
                  @click="filterStatus = s"
                  class="shrink-0 text-xs font-black uppercase tracking-wide px-3 py-2 rounded-xl transition-all"
                  :style="filterStatus === s
                    ? 'background: #081C15; color: #95D5B2; border: 1px solid #081C15;'
                    : 'background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0;'">
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Stats mini -->
            <div v-if="!loadingTransaksi && txTertapis.length > 0"
              class="shrink-0 px-4 py-2.5 flex gap-2.5" style="background: white; border-bottom: 1px solid #F1F5F9;">
              <div class="flex-1 rounded-xl p-2.5 text-center" style="background: rgba(82,183,136,0.08); border: 1px solid rgba(82,183,136,0.15);">
                <p class="text-xs font-bold uppercase tracking-wider mb-0.5" style="color: #2D6A4F;">Jumlah Berjaya</p>
                <p class="text-sm font-black tabular-nums" style="color: #1B4332;">
                  {{ fmtRM(txTertapis.filter(t => t.status === 'BERJAYA').reduce((a,t) => a + parseFloat(t.amaun||0), 0)) }}
                </p>
              </div>
              <div class="flex-1 rounded-xl p-2.5 text-center" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
                <p class="text-xs font-bold uppercase tracking-wider mb-0.5" style="color: #94a3b8;">Berjaya</p>
                <p class="text-sm font-black tabular-nums" style="color: #0F172A;">{{ txTertapis.filter(t => t.status === 'BERJAYA').length }}</p>
              </div>
              <div class="flex-1 rounded-xl p-2.5 text-center" style="background: #fffbeb; border: 1px solid rgba(245,158,11,0.2);">
                <p class="text-xs font-bold uppercase tracking-wider mb-0.5" style="color: #92400e;">Pending</p>
                <p class="text-sm font-black tabular-nums text-amber-700">{{ txTertapis.filter(t => t.status === 'PENDING').length }}</p>
              </div>
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">
              <div v-if="loadingTransaksi" class="flex flex-col items-center justify-center py-16 gap-3">
                <div class="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
                <p class="text-sm font-bold" style="color: #94a3b8;">Memuatkan rekod...</p>
              </div>

              <div v-else-if="txTertapis.length === 0" class="flex flex-col items-center justify-center py-16 gap-4 px-8">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: #F1F5F9;">
                  <svg class="w-8 h-8" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-sm font-black uppercase" style="color: #0F172A;">Tiada Rekod</p>
                  <p class="text-xs font-medium mt-1" style="color: #94a3b8;">Cuba ubah carian atau penapis anda</p>
                </div>
                <button @click="resetFilter" class="text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all active:scale-95"
                  style="background: rgba(82,183,136,0.1); color: #1B4332; border: 1px solid rgba(82,183,136,0.2);">
                  Reset Penapis
                </button>
              </div>

              <div v-else class="p-4 space-y-2.5 pb-8">
                <div v-for="tx in txTertapis" :key="tx.billCode"
                  class="bg-white rounded-[18px] overflow-hidden"
                  style="border: 1px solid #F1F5F9; box-shadow: 0 1px 4px rgba(15,23,42,0.04);">
                  <div class="flex items-center gap-3 px-4 py-3.5">
                    <div class="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center"
                      :style="tx.status === 'BERJAYA' ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                        : tx.status === 'PENDING' ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                        : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-black leading-tight truncate" style="color: #0F172A;">{{ tx.keterangan }}</p>
                      <p class="text-xs font-mono mt-0.5" style="color: #94a3b8;">{{ tx.billCode }}</p>
                      <p class="text-xs font-medium mt-0.5" style="color: #94a3b8;">{{ formatTarikh(tx.tarikh) }}</p>
                    </div>
                    <div class="text-right shrink-0">
                      <p class="text-sm font-black tabular-nums" style="color: #0F172A;">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
                      <span class="text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mt-1"
                        :style="tx.status === 'BERJAYA' ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                          : tx.status === 'PENDING' ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                          : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                        {{ tx.status }}
                      </span>
                    </div>
                  </div>
                  <div v-if="tx.status === 'BERJAYA'" class="px-4 py-2.5 flex justify-end"
                    style="background: #F8FAFC; border-top: 1px solid #F1F5F9;">
                    <button @click="lihatResit(tx)"
                      class="text-xs font-black uppercase tracking-wide flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                      style="color: #2D6A4F; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.2);">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Lihat Resit
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  <!-- ═══════════════════════════════════════
       MODAL — HUBUNGI KELAB (Sistem Tiket)
       ═══════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modalHubungi"
        class="fixed inset-0 z-9999 flex items-end sm:items-center justify-center"
        style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
        @click.self="tutupModalHubungi">

        <div class="bg-white w-full max-w-md flex flex-col custom-scrollbar"
          style="border-radius: 28px 28px 0 0; max-height: 92dvh; border-top: 1px solid #E2E8F0;">

          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
          </div>

          <!-- Header dinamik -->
          <div class="shrink-0 flex items-center gap-3 px-5 py-3.5" style="border-bottom: 1px solid #F1F5F9;">
            <!-- Back button (hanya pada paparan detail/borang) -->
            <button v-if="paparanTiket !== 'senarai'" @click="paparanTiket = 'senarai'"
              class="w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-all active:scale-90"
              style="background: #F1F5F9; color: #0F172A;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <h3 class="text-[14px] font-black uppercase tracking-wide leading-tight" style="color: #0F172A;">
                <span v-if="paparanTiket === 'senarai'">Hubungi Kelab</span>
                <span v-else-if="paparanTiket === 'borang'">Tiket Sokongan Baru</span>
                <span v-else-if="tiketDipilih" class="truncate block">{{ tiketDipilih.no_tiket }}</span>
              </h3>
              <p class="text-[9px] font-medium mt-0.5 truncate" style="color: #94a3b8;">
                <span v-if="paparanTiket === 'senarai'">Semak & hantar tiket sokongan anda</span>
                <span v-else-if="paparanTiket === 'borang'">Isi butiran pertanyaan atau aduan</span>
                <span v-else-if="tiketDipilih">{{ tiketDipilih.subjek }}</span>
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <!-- Butang Tiket Baru (hanya pada senarai) -->
              <button v-if="paparanTiket === 'senarai'" @click="paparanTiket = 'borang'"
                class="text-[9px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all active:scale-90"
                style="background: #081C15; color: #95D5B2;">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Baru
              </button>
              <!-- Tutup -->
              <button @click="tutupModalHubungi"
                class="w-8 h-8 flex items-center justify-center rounded-xl transition-all active:scale-90"
                style="background: #F1F5F9; color: #64748B;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- ── PAPARAN: SENARAI TIKET ── -->
          <div v-if="paparanTiket === 'senarai'" class="flex-1 overflow-y-auto">

            <!-- Loading -->
            <div v-if="loadingTiket" class="flex items-center justify-center py-12 gap-2">
              <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
              <span class="text-[11px] font-medium" style="color: #94a3b8;">Memuatkan tiket...</span>
            </div>

            <!-- Tiada tiket -->
            <div v-else-if="senaraiTiket.length === 0" class="flex flex-col items-center justify-center py-12 px-8 text-center gap-3">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: rgba(59,130,246,0.08);">
                <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <div>
                <p class="text-[12px] font-black uppercase" style="color: #0F172A;">Tiada Tiket Lagi</p>
                <p class="text-[10px] font-medium mt-1 leading-relaxed" style="color: #94a3b8;">
                  Hantar tiket sokongan untuk pertanyaan atau aduan anda. Kami akan membalas melalui sistem ini.
                </p>
              </div>
              <button @click="paparanTiket = 'borang'"
                class="mt-2 py-2.5 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
                style="background: #081C15; color: #95D5B2;">
                Hantar Tiket Baru
              </button>
            </div>

            <!-- Senarai tiket -->
            <div v-else class="p-4 space-y-2.5 pb-6">
              <div v-for="tiket in senaraiTiket" :key="tiket.id"
                @click="bukaDetailTiket(tiket.id)"
                class="rounded-[18px] overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
                style="background: white; border: 1px solid #F1F5F9; box-shadow: 0 1px 6px rgba(15,23,42,0.05);">

                <div class="flex items-start gap-3 px-4 py-3.5">
                  <!-- Status dot -->
                  <div class="w-2 h-2 rounded-full mt-2 shrink-0 animate-pulse"
                    :style="tiket.status === 'BARU' ? 'background: #3b82f6;'
                      : tiket.status === 'DALAM_PROSES' ? 'background: #f59e0b;'
                      : tiket.status === 'SELESAI' ? 'background: #22c55e;'
                      : 'background: #ef4444;'"></div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="text-[9px] font-black font-mono" style="color: #94a3b8;">{{ tiket.no_tiket }}</span>
                      <span class="text-[8px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
                        :style="tiket.status === 'BARU' ? 'background: rgba(59,130,246,0.1); color: #2563eb;'
                          : tiket.status === 'DALAM_PROSES' ? 'background: rgba(245,158,11,0.1); color: #d97706;'
                          : tiket.status === 'SELESAI' ? 'background: rgba(34,197,94,0.1); color: #16a34a;'
                          : 'background: rgba(239,68,68,0.1); color: #dc2626;'">
                        {{ tiket.status === 'DALAM_PROSES' ? 'Dalam Proses' : tiket.status === 'BARU' ? 'Baru' : tiket.status === 'SELESAI' ? 'Selesai' : 'Ditolak' }}
                      </span>
                    </div>
                    <p class="text-[12px] font-black leading-tight truncate" style="color: #0F172A;">{{ tiket.subjek }}</p>
                    <p class="text-[9px] font-medium mt-0.5" style="color: #94a3b8;">{{ tiket.kategori }}</p>
                  </div>

                  <div class="flex flex-col items-end gap-1 shrink-0">
                    <div v-if="tiket.bil_balasan > 0" class="flex items-center gap-1">
                      <svg class="w-3 h-3" style="color: #94a3b8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      <span class="text-[9px] font-black" style="color: #64748b;">{{ tiket.bil_balasan }}</span>
                    </div>
                    <svg class="w-4 h-4" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div class="px-4 py-2" style="background: #F8FAFC; border-top: 1px solid #F1F5F9;">
                  <p class="text-[9px] font-mono" style="color: #94a3b8;">
                    Dihantar: {{ formatTarikhPendek(tiket.tarikh_hantar) }}
                    <span v-if="tiket.tarikh_kemaskini"> · Dikemas kini: {{ formatTarikhPendek(tiket.tarikh_kemaskini) }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PAPARAN: BORANG TIKET BARU ── -->
          <div v-else-if="paparanTiket === 'borang'" class="flex-1 overflow-y-auto">
            <form @submit.prevent="hantarTiketBaru" class="px-5 py-4 space-y-4 pb-8">

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider" style="color: #64748B;">Kategori *</label>
                <select v-model="formTiketBaru.kategori" required
                  class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                  <option value="" disabled>— Pilih Kategori —</option>
                  <option>Pertanyaan Umum</option>
                  <option>Masalah Pembayaran Yuran</option>
                  <option>Permohonan Bantuan Kebajikan</option>
                  <option>Aduan Berkaitan Aplikasi</option>
                  <option>Kemaskini Maklumat</option>
                  <option>Lain-lain</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider" style="color: #64748B;">Tajuk / Subjek *</label>
                <input v-model="formTiketBaru.subjek" required maxlength="200"
                  placeholder="Ringkasan isu anda..."
                  class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider" style="color: #64748B;">Kandungan / Huraian *</label>
                <textarea v-model="formTiketBaru.kandungan" rows="5" required maxlength="2000"
                  placeholder="Huraikan masalah, pertanyaan, atau aduan anda dengan terperinci..."
                  class="w-full text-xs font-medium rounded-2xl px-4 py-3 outline-none resize-none leading-relaxed"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"></textarea>
                <p class="text-right text-[9px] font-medium pr-1" style="color: #94a3b8;">{{ formTiketBaru.kandungan.length }}/2000</p>
              </div>

              <!-- Nota sistem -->
              <div class="rounded-2xl p-3.5 flex items-start gap-2.5" style="background: rgba(15,76,58,0.06); border: 1px solid rgba(15,76,58,0.12);">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" style="color: #0F4C3A;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-[9px] font-medium leading-relaxed" style="color: #1B4332;">
                  Semua maklum balas akan dihantar <strong>melalui sistem ini</strong>.
                  Semak semula tiket anda untuk melihat balasan dari urusetia.
                </p>
              </div>

              <div class="flex gap-3 pb-2">
                <button type="button" @click="paparanTiket = 'senarai'"
                  class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider"
                  style="background: #F1F5F9; color: #64748B;">
                  Batal
                </button>
                <button type="submit" :disabled="loadingHantarTiket"
                  class="flex-2 grow-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                  style="background: #081C15; color: #95D5B2;">
                  <span v-if="loadingHantarTiket" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                  {{ loadingHantarTiket ? 'Menghantar...' : 'Hantar Tiket' }}
                </button>
              </div>
            </form>
          </div>

          <!-- ── PAPARAN: DETAIL THREAD ── -->
          <div v-else-if="paparanTiket === 'detail'" class="flex-1 flex flex-col overflow-hidden">

            <!-- Loading detail -->
            <div v-if="loadingDetailTiket" class="flex-1 flex items-center justify-center py-10 gap-2">
              <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
              <span class="text-[11px] font-medium" style="color: #94a3b8;">Memuatkan perbualan...</span>
            </div>

            <template v-else-if="tiketDipilih">
              <!-- Info tiket -->
              <div class="shrink-0 px-4 py-3 flex items-center justify-between gap-3" style="background: #F8FAFC; border-bottom: 1px solid #F1F5F9;">
                <div>
                  <p class="text-[9px] font-black font-mono" style="color: #94a3b8;">{{ tiketDipilih.no_tiket }}</p>
                  <p class="text-[11px] font-black" style="color: #0F172A;">{{ tiketDipilih.kategori }}</p>
                </div>
                <span class="text-[8px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-full shrink-0"
                  :style="tiketDipilih.status === 'BARU' ? 'background: rgba(59,130,246,0.1); color: #2563eb;'
                    : tiketDipilih.status === 'DALAM_PROSES' ? 'background: rgba(245,158,11,0.1); color: #d97706;'
                    : tiketDipilih.status === 'SELESAI' ? 'background: rgba(34,197,94,0.1); color: #16a34a;'
                    : 'background: rgba(239,68,68,0.1); color: #dc2626;'">
                  {{ tiketDipilih.status === 'DALAM_PROSES' ? 'Dalam Proses'
                     : tiketDipilih.status === 'BARU' ? 'Baru'
                     : tiketDipilih.status === 'SELESAI' ? 'Selesai' : 'Ditolak' }}
                </span>
              </div>

              <!-- Thread perbualan -->
              <div ref="threadEl" class="flex-1 overflow-y-auto p-4 space-y-3">

                <!-- Mesej asal -->
                <div class="flex gap-2.5">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-black"
                    style="background: #1B4332; color: #95D5B2;">
                    {{ profil.nama_penuh?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[9px] font-black" style="color: #0F172A;">Anda</span>
                      <span class="text-[8px] font-mono" style="color: #94a3b8;">{{ formatTarikhMasa(tiketDipilih.tarikh_hantar) }}</span>
                    </div>
                    <div class="rounded-[16px] rounded-tl-[4px] px-4 py-3 text-[11px] font-medium leading-relaxed"
                      style="background: #F0FDF4; border: 1px solid rgba(34,197,94,0.15); color: #0F172A;">
                      {{ tiketDipilih.kandungan }}
                    </div>
                  </div>
                </div>

                <!-- Balasan -->
                <template v-for="balas in tiketDipilih.balasan" :key="balas.id">

                  <!-- Balasan Ahli (kanan) -->
                  <div v-if="balas.jenis === 'AHLI'" class="flex gap-2.5">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-black"
                      style="background: #1B4332; color: #95D5B2;">
                      {{ profil.nama_penuh?.charAt(0) || '?' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-[9px] font-black" style="color: #0F172A;">Anda</span>
                        <span class="text-[8px] font-mono" style="color: #94a3b8;">{{ formatTarikhMasa(balas.tarikh) }}</span>
                      </div>
                      <div class="rounded-[16px] rounded-tl-[4px] px-4 py-3 text-[11px] font-medium leading-relaxed"
                        style="background: #F0FDF4; border: 1px solid rgba(34,197,94,0.15); color: #0F172A;">
                        {{ balas.kandungan }}
                      </div>
                    </div>
                  </div>

                  <!-- Balasan Admin (kiri, latar berbeza) -->
                  <div v-else class="flex gap-2.5 flex-row-reverse">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-black"
                      style="background: #081C15; color: #52B788;">U</div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1 flex-row-reverse">
                        <span class="text-[9px] font-black" style="color: #0F172A;">{{ balas.nama_pengirim || 'Urusetia' }}</span>
                        <span class="text-[8px] font-mono" style="color: #94a3b8;">{{ formatTarikhMasa(balas.tarikh) }}</span>
                      </div>
                      <div class="rounded-[16px] rounded-tr-[4px] px-4 py-3 text-[11px] font-medium leading-relaxed"
                        style="background: #EFF6FF; border: 1px solid rgba(59,130,246,0.15); color: #0F172A;">
                        {{ balas.kandungan }}
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Status penutup -->
                <div v-if="tiketDipilih.status === 'SELESAI' || tiketDipilih.status === 'DITOLAK'"
                  class="flex justify-center">
                  <div class="rounded-2xl px-4 py-3 text-center max-w-xs"
                    :style="tiketDipilih.status === 'SELESAI'
                      ? 'background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);'
                      : 'background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);'">
                    <p class="text-[9px] font-black uppercase tracking-wide"
                      :style="tiketDipilih.status === 'SELESAI' ? 'color: #16a34a;' : 'color: #dc2626;'">
                      Tiket {{ tiketDipilih.status === 'SELESAI' ? 'Diselesaikan' : 'Ditolak' }}
                    </p>
                    <p v-if="tiketDipilih.catatan_penutup" class="text-[10px] font-medium mt-1 leading-relaxed" style="color: #64748b;">
                      {{ tiketDipilih.catatan_penutup }}
                    </p>
                  </div>
                </div>

              </div><!-- end thread -->

              <!-- Kotak balas (hanya jika tiket masih terbuka) -->
              <div v-if="tiketDipilih.status !== 'SELESAI' && tiketDipilih.status !== 'DITOLAK'"
                class="shrink-0 p-4 flex gap-2.5 items-end"
                style="border-top: 1px solid #F1F5F9; background: white;">
                <textarea v-model="kandunganBalasan" rows="2"
                  placeholder="Tulis balasan anda..."
                  class="flex-1 text-xs font-medium rounded-2xl px-4 py-3 outline-none resize-none leading-relaxed"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A; max-height: 100px;"
                  @keydown.enter.meta.prevent="hantarBalasanTiket"
                  @keydown.enter.ctrl.prevent="hantarBalasanTiket"></textarea>
                <button @click="hantarBalasanTiket" :disabled="!kandunganBalasan.trim() || loadingBalasan"
                  class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-40"
                  style="background: #081C15; color: #95D5B2;">
                  <span v-if="loadingBalasan" class="w-4 h-4 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>

            </template>

            <!-- Fallback: tiket gagal dimuatkan -->
            <div v-else class="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background: rgba(239,68,68,0.08);">
                <svg class="w-6 h-6" style="color: #ef4444;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
              </div>
              <p class="text-[11px] font-bold" style="color: #0F172A;">Gagal memuatkan tiket</p>
              <button @click="paparanTiket = 'senarai'"
                class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all active:scale-95"
                style="background: #F1F5F9; color: #0F172A;">
                Kembali ke senarai
              </button>
            </div>

          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ── MODAL RESIT (mobile / native) ── -->
  <Teleport to="body">
    <Transition name="resit-sheet">
      <div v-if="showResitModal"
        class="fixed inset-0 z-9999 flex flex-col"
        style="background: #F8FAFC;">

        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0"
          style="background: #081C15; padding-top: max(12px, env(safe-area-inset-top));">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4" style="color: #52B788;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-[13px] font-black text-white uppercase tracking-wide">Resit Pembayaran</span>
          </div>
          <button @click="showResitModal = false"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style="background: rgba(255,255,255,0.1);">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Iframe resit -->
        <iframe class="flex-1 w-full border-0" :srcdoc="resitHtml"></iframe>

        <!-- Footer -->
        <div class="px-4 py-3 shrink-0"
          style="background: white; border-top: 1px solid #F1F5F9; padding-bottom: max(12px, env(safe-area-inset-bottom));">
          <button @click="showResitModal = false"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98]"
            style="background: #081C15; color: #95D5B2;">
            Tutup Resit
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BiometricAuth, BiometryErrorType } from '@aparajita/capacitor-biometric-auth';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { cetakResitTransaksi, buatHtmlResit, headerResitHTML, footerResitHTML } from '../../config/kelab';
import { useToast } from '../../composables/useToast';

const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';
const appVersion = __APP_VERSION__;
const toast  = useToast();
const router = useRouter();
const route  = useRoute();
const authStore = useAuthStore();
const adalahNative = Capacitor.isNativePlatform();
const biometriTersedia = ref(false);

const profil = ref({});
const senaraiPTJ = ref([]);

const modalEdit = ref(false);
const modalBerhenti = ref(false);
const statusBerhenti = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const uploadingGambar = ref(false);

const form = ref({ penempatan_id: '', saiz_baju: '', no_tel: '', email: '', nama_waris: '', no_tel_waris: '', no_acc_waris: '', bank_waris: '', no_acc_bank: '', bank_ahli: '' });
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const formBerhenti = ref({ sebab_utama: '', ulasan: '' });

const modalTransaksi = ref(false);
const sejarahSemua = ref([]);
const loadingTransaksi = ref(false);

const modalHubungi = ref(false);

// ── Sistem Tiket Sokongan ──
const paparanTiket   = ref('senarai'); // 'senarai' | 'borang' | 'detail'
const senaraiTiket   = ref([]);
const loadingTiket   = ref(false);
const tiketDipilih   = ref(null);
const loadingDetailTiket  = ref(false);
const formTiketBaru  = ref({ kategori: '', subjek: '', kandungan: '' });
const loadingHantarTiket  = ref(false);
const kandunganBalasan    = ref('');
const loadingBalasan      = ref(false);
const threadEl            = ref(null);

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

const showResitModal = ref(false);
const resitHtml = ref('');

const lihatResit = (tx) => {
  if (Capacitor.isNativePlatform()) {
    resitHtml.value = buatHtmlResit(tx, profil.value);
    showResitModal.value = true;
  } else {
    cetakResitTransaksi(tx, profil.value);
  }
};

// cetakPDF('bulan') → PDF transaksi bulan ditapis (atau bulan semasa jika tiada penapis)
// cetakPDF('tahun') → PDF semua transaksi tahun ditapis (atau tahun semasa jika tiada penapis)
const cetakPDF = (mod) => {
  const now = new Date();
  const tahunGuna = filterTahun.value || String(now.getFullYear());
  const bulanGuna = filterBulan.value || String(now.getMonth() + 1).padStart(2, '0');

  let senarai, tajuk;
  if (mod === 'bulan') {
    senarai = sejarahSemua.value.filter(t => {
      const tarikh = t.tarikh || '';
      return tarikh.substring(0, 4) === tahunGuna
        && tarikh.substring(5, 7) === bulanGuna
        && t.status === 'BERJAYA';
    });
    const namaBulan = senaraibulan.find(b => b.nilai === bulanGuna)?.label || bulanGuna;
    tajuk = `Penyata Transaksi FPX &mdash; ${namaBulan} ${tahunGuna}`;
  } else {
    senarai = sejarahSemua.value.filter(t =>
      (t.tarikh || '').substring(0, 4) === tahunGuna && t.status === 'BERJAYA'
    );
    tajuk = `Penyata Transaksi FPX &mdash; Tahun ${tahunGuna}`;
  }

  const jumlah = senarai.reduce((a, t) => a + parseFloat(t.amaun || 0), 0);
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });

  const baris = senarai.map((t, i) => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:7px 8px;font-size:12px;color:#64748b;">${i + 1}</td>
      <td style="padding:7px 8px;font-size:12px;font-family:monospace;">${t.billCode || '-'}</td>
      <td style="padding:7px 8px;font-size:12px;">${t.keterangan || '-'}</td>
      <td style="padding:7px 8px;font-size:12px;white-space:nowrap;">${formatTarikh(t.tarikh)}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:right;font-weight:700;">RM ${parseFloat(t.amaun || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html><html lang="ms"><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${tajuk}</title>
    <style>
      *{box-sizing:border-box;}
      body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#0F172A;background:white;}
      table{width:100%;border-collapse:collapse;margin-top:16px;}
      th{background:#081C15;color:#95D5B2;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:9px 8px;text-align:left;}
      tr:nth-child(even){background:#f8fafc;}
      .info p{margin:0 0 3px;font-size:12px;color:#334155;}
      .info span{font-weight:700;color:#0F172A;}
      .jumlah-row td{background:#081C15;color:#95D5B2;font-weight:700;font-size:13px;padding:9px 8px;}
      @media print{body{padding:10px;}}
    </style>
  </head><body>
    ${headerResitHTML(tajuk)}
    <div class="info" style="margin-bottom:16px;">
      <p>Nama: <span>${profil.value.nama_pegawai || profil.value.nama_penuh || '-'}</span></p>
      <p>No. KP: <span>${profil.value.no_kp || '-'}</span></p>
      <p>No. Ahli: <span>${profil.value.no_ahli || '-'}</span></p>
      <p>Dicetak: <span>${tarikhCetak}</span></p>
      <p>Jumlah Rekod: <span>${senarai.length} transaksi berjaya</span></p>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th style="width:160px">Kod Bil</th>
          <th>Keterangan</th>
          <th style="width:130px">Tarikh</th>
          <th style="width:100px;text-align:right">Amaun</th>
        </tr>
      </thead>
      <tbody>
        ${baris || '<tr><td colspan="5" style="padding:14px;text-align:center;color:#94a3b8;font-size:12px;">Tiada rekod untuk tempoh ini.</td></tr>'}
        <tr>
          <td colspan="4" class="jumlah-row" style="text-align:right;padding:9px 8px;">JUMLAH KESELURUHAN</td>
          <td class="jumlah-row" style="text-align:right;">RM ${jumlah.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    ${footerResitHTML()}
    <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;

  if (Capacitor.isNativePlatform()) {
    resitHtml.value = html;
    showResitModal.value = true;
  } else {
    const w = window.open('', '_blank', 'width=820,height=640');
    if (w) { w.document.write(html); w.document.close(); }
  }
};

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

// Helper: resize + tukar ke JPEG via canvas (max 800px, ~100-250KB)
// Selesaikan: HEIC (iPhone), fail besar, format tidak disokong
const resizeKeJpeg = (sumber) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onerror = () => reject(new Error('Gagal muatkan imej'));
  img.onload = () => {
    const MAX = 800;
    let w = img.width, h = img.height;
    if (w > MAX || h > MAX) {
      if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
      else { w = Math.round(w * MAX / h); h = MAX; }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Canvas export gagal')),
      'image/jpeg', 0.72
    );
  };
  img.src = typeof sumber === 'string' ? sumber : URL.createObjectURL(sumber);
});

// 3. Muat Naik Gambar Profil
const triggerUpload = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      if (!photo.dataUrl) return;

      uploadingGambar.value = true;
      const blob = await resizeKeJpeg(photo.dataUrl);
      const formData = new FormData();
      formData.append('gambar', blob, `profile-${Date.now()}.jpg`);
      await api.put('/user/kemaskini-gambar', formData);
      toast.sukses('Gambar profil anda berjaya dikemas kini.');
      await fetchProfil();
    } catch (err) {
      const msg = err?.message || '';
      if (!msg.includes('cancel') && !msg.includes('dismiss') && !msg.includes('No image')) {
        toast.ralat('Gagal memuat naik gambar profil.');
      }
    } finally {
      uploadingGambar.value = false;
    }
  } else {
    if (fileInput.value) {
      fileInput.value.value = '';
      fileInput.value.click();
    }
  }
};

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadingGambar.value = true;
  try {
    const blob = await resizeKeJpeg(file);
    const formData = new FormData();
    formData.append('gambar', blob, `profile-${Date.now()}.jpg`);
    await api.put('/user/kemaskini-gambar', formData);
    toast.sukses('Gambar profil anda berjaya dikemas kini.');
    await fetchProfil();
  } catch {
    toast.ralat('Gagal memuat naik gambar profil.');
  } finally {
    uploadingGambar.value = false;
    e.target.value = '';
  }
};

const bukaModalTransaksi = async () => {
  modalTransaksi.value = true;
  if (sejarahSemua.value.length === 0) await muatSejarahSemua();
};

const tutupModalHubungi = () => {
  modalHubungi.value = false;
  paparanTiket.value = 'senarai';
  tiketDipilih.value = null;
  kandunganBalasan.value = '';
  formTiketBaru.value = { kategori: '', subjek: '', kandungan: '' };
};

const muatSenaraiTiket = async () => {
  loadingTiket.value = true;
  try {
    const { data } = await api.get('/sokongan');
    senaraiTiket.value = data.data || [];
  } catch {} finally { loadingTiket.value = false; }
};

const bukaDetailTiket = async (id) => {
  paparanTiket.value = 'detail';
  loadingDetailTiket.value = true;
  tiketDipilih.value = null;
  try {
    const { data } = await api.get(`/sokongan/${id}`);
    if (!data.data) throw new Error('empty');
    tiketDipilih.value = data.data;
    await nextTick();
    if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight;
  } catch {
    paparanTiket.value = 'senarai'; // reset dulu sebelum alert
    tiketDipilih.value = null;
    toast.ralat('Gagal memuatkan tiket. Sila cuba lagi.');
  } finally { loadingDetailTiket.value = false; }
};

const hantarTiketBaru = async () => {
  loadingHantarTiket.value = true;
  try {
    const { data } = await api.post('/sokongan', formTiketBaru.value);
    toast.sukses(`Tiket ${data.no_tiket} berjaya dihantar. Kami akan membalas melalui sistem ini.`);
    formTiketBaru.value = { kategori: '', subjek: '', kandungan: '' };
    await muatSenaraiTiket();
    paparanTiket.value = 'senarai';
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal menghantar tiket. Sila cuba lagi.');
  } finally { loadingHantarTiket.value = false; }
};

const hantarBalasanTiket = async () => {
  if (!kandunganBalasan.value.trim() || !tiketDipilih.value) return;
  loadingBalasan.value = true;
  try {
    await api.post(`/sokongan/${tiketDipilih.value.id}/balas`, { kandungan: kandunganBalasan.value });
    kandunganBalasan.value = '';
    await bukaDetailTiket(tiketDipilih.value.id);
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal menghantar balasan.');
  } finally { loadingBalasan.value = false; }
};

const formatTarikhPendek = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTarikhMasa = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
        toast.amaran('Sila pastikan pengesahan kata laluan baru adalah sepadan.');
        loading.value = false;
        return;
      }
      await api.put('/user/tukar-password', {
        oldPassword: pwdForm.value.oldPassword,
        newPassword: pwdForm.value.newPassword
      });
    }

    toast.sukses('Segala perubahan profil berjaya disimpan.');
    modalEdit.value = false;
    fetchProfil();
  } catch (e) {
    toast.ralat(e.response?.data?.message || 'Gagal mengemaskini maklumat akaun.');
  } finally { loading.value = false; }
};

const muatStatusBerhenti = async () => {
  try {
    const { data } = await api.get('/user/status-berhenti');
    statusBerhenti.value = data.data;
  } catch {}
};

const bukaModalBerhenti = () => {
  if (statusBerhenti.value?.status_permohonan === 'MENUNGGU') return;
  formBerhenti.value = { sebab_utama: '', ulasan: '' };
  modalBerhenti.value = true;
};

// 5. Permohonan Penamatan Keahlian
const hantarBerhenti = async () => {
  if (!confirm("Adakah anda pasti mahu menghantar permohonan berhenti? Permohonan akan disemak oleh pentadbir sebelum diluluskan.")) return;
  loading.value = true;
  try {
    await api.post('/user/mohon-berhenti', {
      sebab_berhenti: `${formBerhenti.value.sebab_utama}: ${formBerhenti.value.ulasan}`
    });
    toast.sukses('Permohonan berhenti anda telah dihantar kepada urusetia untuk semakan.');
    modalBerhenti.value = false;
    await muatStatusBerhenti();
  } catch (error) {
    toast.ralat(error.response?.data?.message || 'Gagal memproses permohonan penamatan.');
  } finally { loading.value = false; }
};

const logKeluar = () => {
  if (confirm("Adakah anda pasti mahu log keluar dari aplikasi?")) {
    authStore.logout();
    router.push('/login');
  }
};

const togolBiometrik = async () => {
  if (authStore.biometrikAktif) {
    authStore.matikanBiometrik();
    return;
  }
  try {
    await BiometricAuth.authenticate({
      reason: 'Sahkan cap jari untuk mengaktifkan log masuk pantas',
      cancelTitle: 'Batal',
    });
    authStore.aktifkanBiometrik();
  } catch (err) {
    const cancelCodes = [BiometryErrorType.userCancel, BiometryErrorType.systemCancel, BiometryErrorType.appCancel];
    if (!cancelCodes.includes(err?.code)) {
      toast.ralat('Cap jari tidak dapat disahkan. Sila cuba lagi.');
    }
  }
};

onMounted(async () => {
  fetchProfil();
  fetchSenaraiPTJ();
  muatSejarahSemua();
  muatStatusBerhenti();
  if (adalahNative) {
    try {
      const info = await BiometricAuth.checkBiometry();
      biometriTersedia.value = info.isAvailable;
    } catch {}
  }
  // Deep-link dari notifikasi: ?tiket=<id>
  if (route.query.tiket) {
    modalHubungi.value = true;
    await muatSenaraiTiket();
    await bukaDetailTiket(route.query.tiket);
    router.replace({ query: {} });
  }
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

/* Resit modal slide-up */
.resit-sheet-enter-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.resit-sheet-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1); }
.resit-sheet-enter-from, .resit-sheet-leave-to { transform: translateY(100%); }
</style>
