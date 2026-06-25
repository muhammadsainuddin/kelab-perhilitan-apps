<template>
  <div class="space-y-4 pb-8 animate-page-in">

    <!-- HEADER -->
    <div class="px-1 pt-1">
      <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Pengurusan Kewangan</p>
      <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Yuran Tahunan</h2>
      <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
        Sesi Januari – Disember {{ tahunSemasa }}
      </p>
    </div>

    <!-- STATUS CARD -->
    <div class="relative overflow-hidden rounded-3xl"
      :style="!profil.yuran_tertunggak
        ? 'background: #081C15; box-shadow: 0 16px 40px rgba(8,28,21,0.25), 0 0 0 1px rgba(82,183,136,0.12);'
        : 'background: #1a0808; box-shadow: 0 16px 40px rgba(28,8,8,0.25), 0 0 0 1px rgba(239,68,68,0.15);'">
      <div class="absolute inset-0 opacity-[0.025]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 96px;"></div>
      <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        :style="!profil.yuran_tertunggak
          ? 'background: radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 65%);'
          : 'background: radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 65%);'"></div>
      <div class="absolute top-0 left-0 right-0"
        :style="!profil.yuran_tertunggak
          ? 'height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 40%, #D4AF37 60%, transparent);'
          : 'height: 1.5px; background: linear-gradient(90deg, transparent, #ef4444 50%, transparent);'"></div>

      <div class="relative z-10 p-5">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-[8px] font-black uppercase tracking-[0.2em] mb-1"
              :style="!profil.yuran_tertunggak ? 'color: rgba(149,213,178,0.5);' : 'color: rgba(252,165,165,0.5);'">
              Sesi Kewangan {{ tahunSemasa }}
            </p>
            <h3 class="text-[20px] font-black text-white uppercase leading-tight tracking-wide">
              {{ profil.yuran_tertunggak ? 'Yuran Tertunggak' : 'Yuran Dijelaskan' }}
            </h3>
          </div>
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            :style="!profil.yuran_tertunggak
              ? 'background: rgba(82,183,136,0.15); border: 1px solid rgba(82,183,136,0.25);'
              : 'background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.25);'">
            <svg v-if="!profil.yuran_tertunggak" class="w-5 h-5" style="color: #52B788;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>

        <div class="pt-4" style="border-top: 1px solid rgba(255,255,255,0.08);">
          <p v-if="!profil.yuran_tertunggak" class="text-[11px] font-medium leading-relaxed"
            style="color: rgba(149,213,178,0.7);">
            Keahlian anda aktif. Akses penuh bagi modul bantuan kebajikan dan pendaftaran acara dibuka sehingga
            <strong class="text-white font-black">31 Disember {{ tahunSemasa }}</strong>.
          </p>
          <p v-else class="text-[11px] font-medium leading-relaxed" style="color: rgba(252,165,165,0.7);">
            Fungsi pendaftaran acara dan permohonan bantuan disekat sementara sehingga yuran tahunan diselesaikan.
          </p>
        </div>
      </div>
    </div>

    <!-- PENDING TX BANNER -->
    <div v-if="hasPendingTx"
      class="rounded-[20px] p-4"
      style="background: #FFFBEB; border: 1px solid rgba(245,158,11,0.3);">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style="background: rgba(245,158,11,0.15);">
          <svg v-if="!bolehCubaSemula" class="w-5 h-5 text-amber-500 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <svg v-else class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-[11px] font-black uppercase tracking-wide" style="color: #92400e;">
            {{ bolehCubaSemula ? 'Bayaran Tidak Diselesaikan' : 'Semakan Bank Sedang Berjalan' }}
          </p>
          <p v-if="!bolehCubaSemula" class="text-[10px] font-medium mt-0.5 leading-relaxed" style="color: rgba(146,64,14,0.75);">
            Sistem menunggu pengesahan FPX. Cuba semula dalam
            <strong style="color: #92400e;">{{ labelCountdown }}</strong>.
          </p>
          <p v-else class="text-[10px] font-medium mt-0.5 leading-relaxed" style="color: rgba(146,64,14,0.75);">
            Pembayaran sebelum tidak diselesaikan. Klik butang di bawah untuk cuba semula.
          </p>
        </div>
      </div>

      <!-- Butang Cuba Semula — muncul selepas 15 minit -->
      <button v-if="bolehCubaSemula" @click="bayarYuran" :disabled="isProcessing"
        class="w-full mt-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
        style="background: #92400e; color: #FEF3C7;">
        <span v-if="isProcessing" class="animate-pulse">Menghubungi Bank...</span>
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
          <span>Cuba Bayar Semula</span>
        </template>
      </button>
    </div>

    <!-- INVOICE CARD -->
    <div v-if="profil.yuran_tertunggak && !hasPendingTx"
      class="rounded-3xl overflow-hidden bg-white"
      style="border: 1px solid #F1F5F9; box-shadow: 0 2px 16px rgba(15,23,42,0.06);">
      <div class="px-5 py-4 flex items-center justify-between" style="border-bottom: 1px solid #F1F5F9; background: #F8FAFC;">
        <div>
          <p class="text-[8px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Invois Pembaharuan</p>
          <p class="text-[11px] font-black mt-0.5" style="color: #0F172A;">Yuran Tahunan {{ tahunSemasa }}</p>
        </div>
        <span class="text-[9px] font-black font-mono px-2.5 py-1 rounded-lg"
          style="background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0;">
          INV-{{ tahunSemasa }}-{{ profil.no_kp?.slice(-4) || '0000' }}
        </span>
      </div>

      <div class="p-5 space-y-3">
        <div class="space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase tracking-wide" style="color: #94a3b8;">Tempoh Sesi</span>
            <span class="text-[11px] font-black uppercase" style="color: #0F172A;">Jan – Dis {{ tahunSemasa }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase tracking-wide" style="color: #94a3b8;">Kadar Bulanan</span>
            <span class="text-[11px] font-black font-mono" style="color: #0F172A;">RM {{ kadarYuranBulanan.toFixed(2) }} × 12 Bulan</span>
          </div>
        </div>

        <div class="flex justify-between items-center py-3.5 px-4 rounded-2xl" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
          <span class="text-[11px] font-black uppercase tracking-wide" style="color: #0F172A;">Jumlah Perlu Dibayar</span>
          <span class="text-[24px] font-black leading-none font-mono" style="color: #0F172A;">RM {{ jumlahPerluBayar.toFixed(2) }}</span>
        </div>

        <button @click="bayarYuran" :disabled="isProcessing || jumlahPerluBayar <= 0"
          class="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-60"
          style="background: #081C15; color: #95D5B2;">
          <span v-if="isProcessing" class="animate-pulse">Menghubungi Bank...</span>
          <template v-else>
            <span>Bayar via ToyyibPay</span>
            <span class="flex items-center px-2 py-0.5 rounded shadow-sm" style="background: white;">
              <span class="font-black italic text-[9px] text-rose-600">F</span>
              <span class="font-black italic text-[9px] text-blue-800">P</span>
              <span class="font-black italic text-[9px] text-amber-500">X</span>
            </span>
          </template>
        </button>
      </div>
    </div>

    <!-- RESIT BIRO ANGKASA -->
    <div v-if="profil.pilihan_potongan === 'Potongan Biro angkasa'"
      class="rounded-[20px] overflow-hidden bg-white"
      style="border: 1px solid #F1F5F9; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">

      <!-- Header — selaras gaya FPX -->
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #F1F5F9;">
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Rekod Potongan Gaji</p>
          <p class="text-[13px] font-black mt-0.5" style="color: #0F172A;">Biro Angkasa</p>
        </div>
        <div class="flex items-center gap-2.5">
          <!-- Kod Majikan chip -->
          <span class="text-[10px] font-black font-mono px-2.5 py-1 rounded-lg"
            style="background: rgba(82,183,136,0.08); color: #2D6A4F; border: 1px solid rgba(82,183,136,0.18);">
            {{ profil.kod_majikan || 'N/A' }}
          </span>
          <button @click="fetchResitBA"
            class="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style="background: rgba(82,183,136,0.1); color: #2D6A4F;"
            title="Muat Semula">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="muatResitBA" class="py-10 flex flex-col items-center gap-3">
        <svg class="animate-spin w-5 h-5" style="color: #52B788;" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Memuatkan resit...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="senaraiResitBA.length === 0" class="py-10 text-center">
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada rekod resit</p>
      </div>

      <!-- Senarai dengan filter -->
      <div v-else>

        <!-- Filter bar — sama gaya header FPX -->
        <div class="flex items-center justify-between px-5 py-3" style="border-bottom: 1px solid #F8FAFC; background: #FAFAFA;">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 shrink-0" style="color: #94a3b8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <select v-model="filterTahunBA"
              class="text-[11px] font-black outline-none bg-transparent cursor-pointer"
              style="color: #0F172A;">
              <option v-for="t in senaraiTahunBA" :key="t" :value="t">{{ t }}</option>
            </select>
            <span class="text-[9px] font-black px-1.5 py-0.5 rounded-md" style="background: rgba(82,183,136,0.1); color: #2D6A4F;">
              {{ resitBATertapis.length }}
            </span>
          </label>
          <button @click="cetakBulkPDFBA" :disabled="!resitBATertapis.length"
            class="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide transition-all active:scale-95 disabled:opacity-40"
            style="color: #52B788;">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            PDF Tahun
          </button>
        </div>

        <!-- Tiada resit untuk tahun -->
        <div v-if="!resitBATertapis.length" class="py-8 text-center">
          <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada resit untuk {{ filterTahunBA }}</p>
        </div>

        <!-- Baris resit — ikut gaya baris FPX -->
        <div v-else class="divide-y" style="border-color: #F8FAFC;">
          <div v-for="r in resitBATertapis" :key="r.no_resit"
            class="flex items-center gap-3 px-4 py-3.5">

            <!-- Icon avatar — warna hijau -->
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style="background: rgba(82,183,136,0.1);">
              <svg class="w-5 h-5" style="color: #2D6A4F;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>

            <!-- Teks utama -->
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black uppercase truncate" style="color: #0F172A;">
                {{ new Date(r.bulan_potongan).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' }) }}
              </p>
              <p class="text-[9px] font-mono mt-0.5" style="color: #94a3b8;">{{ r.no_resit }} · Biro Angkasa</p>
            </div>

            <!-- Amaun + butang resit -->
            <div class="text-right shrink-0 flex items-center gap-2">
              <div>
                <p class="text-[13px] font-black tabular-nums" style="color: #0F172A;">RM {{ parseFloat(r.amaun).toFixed(2) }}</p>
                <span class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-0.5"
                  style="background: rgba(82,183,136,0.1); color: #2D6A4F;">POTONGAN GAJI</span>
              </div>
              <button @click="lihatResitBA(r)"
                class="text-[9px] font-black uppercase tracking-wide flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
                style="color: #2D6A4F; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.18);">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Resit
              </button>
            </div>
          </div>
        </div>

        <!-- Jumlah footer -->
        <div v-if="resitBATertapis.length" class="flex items-center justify-between px-5 py-3.5"
          style="border-top: 1px solid #F1F5F9; background: #FAFAFA;">
          <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">
            Jumlah Potongan {{ filterTahunBA }}
          </p>
          <p class="text-[15px] font-black tabular-nums" style="color: #0F172A;">
            RM {{ resitBATertapis.reduce((a, r) => a + parseFloat(r.amaun || 0), 0).toFixed(2) }}
          </p>
        </div>

      </div>
    </div>

    <!-- TRANSACTION HISTORY — disembunyikan untuk ahli Biro Angkasa -->
    <div v-if="profil.pilihan_potongan !== 'Potongan Biro angkasa'"
      class="rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #F1F5F9; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #F1F5F9;">
        <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Sejarah Transaksi FPX</p>
        <button @click="fetchSejarah"
          class="text-[9px] font-black uppercase tracking-wide transition-all active:scale-95"
          style="color: #52B788;">
          Muat Semula
        </button>
      </div>

      <div v-if="sejarahBayaran.length === 0" class="py-10 text-center">
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada rekod transaksi</p>
      </div>

      <div v-else class="divide-y" style="border-color: #F8FAFC;">
        <div v-for="tx in sejarahBayaran" :key="tx.billCode"
          class="flex items-center gap-3 px-4 py-3.5">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            :style="tx.status === 'BERJAYA'
              ? 'background: rgba(82,183,136,0.1);'
              : tx.status === 'PENDING'
                ? 'background: rgba(245,158,11,0.1);'
                : 'background: rgba(239,68,68,0.1);'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              :style="tx.status === 'BERJAYA' ? 'color: #2D6A4F;' : tx.status === 'PENDING' ? 'color: #92400e;' : 'color: #991b1b;'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black uppercase truncate" style="color: #0F172A;">{{ tx.keterangan }}</p>
            <p class="text-[9px] font-mono mt-0.5" style="color: #94a3b8;">{{ tx.billCode }} · {{ tx.tarikh }}</p>
          </div>
          <div class="text-right shrink-0 flex items-center gap-2">
            <div>
              <p class="text-[13px] font-black tabular-nums" style="color: #0F172A;">RM {{ parseFloat(tx.amaun).toFixed(2) }}</p>
              <span class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-0.5"
                :style="tx.status === 'BERJAYA'
                  ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                  : tx.status === 'PENDING'
                    ? 'background: rgba(245,158,11,0.1); color: #92400e;'
                    : 'background: rgba(239,68,68,0.1); color: #991b1b;'">
                {{ tx.status }}
              </span>
            </div>
            <button v-if="tx.status === 'BERJAYA'" @click="lihatResit(tx)"
              class="text-[9px] font-black uppercase tracking-wide flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
              style="color: #2D6A4F; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.18);">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Resit
            </button>
          </div>
        </div>
      </div>
    </div>

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

    <!-- ── MODAL RESIT BIRO ANGKASA (mobile / native) ── -->
    <Teleport to="body">
      <Transition name="resit-sheet">
        <div v-if="showResitBAModal"
          class="fixed inset-0 z-9999 flex flex-col"
          style="background: #F8FAFC;">
          <div class="flex items-center justify-between px-4 py-3 shrink-0"
            style="background: #1D4ED8; padding-top: max(12px, env(safe-area-inset-top));">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-[13px] font-black text-white uppercase tracking-wide">Resit Biro Angkasa</span>
            </div>
            <button @click="showResitBAModal = false"
              class="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
              style="background: rgba(255,255,255,0.15);">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <iframe class="flex-1 w-full border-0" :srcdoc="resitBAHtml"></iframe>
          <div class="px-4 py-3 shrink-0"
            style="background: white; border-top: 1px solid #F1F5F9; padding-bottom: max(12px, env(safe-area-inset-bottom));">
            <button @click="showResitBAModal = false"
              class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98]"
              style="background: #1D4ED8; color: white;">
              Tutup Resit
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Capacitor } from '@capacitor/core';
import api from '../../services/api';
import { KELAB, cetakResitTransaksi, buatHtmlResit, headerResitHTML, footerResitHTML } from '../../config/kelab';

const profil = ref({});
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
const sejarahBayaran = ref([]);
const isProcessing   = ref(false);
const tahunSemasa    = new Date().getFullYear();
let autoPollInterval = null;
let jamCountdown     = null;
const waktuSekarang  = ref(Date.now());

const pendingTx = computed(() => sejarahBayaran.value.find(tx => tx.status === 'PENDING'));

const saatLagiHinggaBolehCuba = computed(() => {
  if (!pendingTx.value?.tarikh_cipta) return 0;
  const cipta = new Date(pendingTx.value.tarikh_cipta).getTime();
  const berlalu = Math.floor((waktuSekarang.value - cipta) / 1000);
  return Math.max(0, 15 * 60 - berlalu);
});

const bolehCubaSemula = computed(() => saatLagiHinggaBolehCuba.value === 0);

const labelCountdown = computed(() => {
  const s = saatLagiHinggaBolehCuba.value;
  const m = Math.floor(s / 60);
  const saat = s % 60;
  if (m > 0) return `${m} minit ${String(saat).padStart(2,'0')} saat`;
  return `${saat} saat`;
});

// ── Resit Biro Angkasa ──
const senaraiResitBA   = ref([]);
const muatResitBA      = ref(false);
const resitBAHtml      = ref('');
const showResitBAModal = ref(false);
const filterTahunBA    = ref(String(new Date().getFullYear()));

const senaraiTahunBA = computed(() => {
  const set = new Set(senaraiResitBA.value.map(r => (r.bulan_potongan || '').substring(0, 4)).filter(Boolean));
  const list = [...set].sort((a, b) => b - a);
  return list.length ? list : [String(new Date().getFullYear())];
});

const resitBATertapis = computed(() =>
  senaraiResitBA.value.filter(r => (r.bulan_potongan || '').startsWith(filterTahunBA.value))
);

const labelBulanBA = (val) => {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' });
};

const fetchResitBA = async () => {
  muatResitBA.value = true;
  try {
    const { data } = await api.get('/user/resit-biro-angkasa');
    if (data.success) senaraiResitBA.value = data.data;
  } catch { /* senyap */ }
  finally { muatResitBA.value = false; }
};

const buatHtmlResitBA = (r) => {
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  return `<html><head><title>Resit ${r.no_resit}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:28px;color:#222;max-width:540px;margin:auto}
    .row{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}
    .divider{border:none;border-top:1px dashed #ddd;margin:14px 0}
    .badge{display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:bold}
    .total-box{background:#0F4C3A;color:white;border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:14px}
    @media print{body{padding:14px}}
  </style></head><body>
  ${headerResitHTML('Resit Potongan Yuran — Biro Angkasa')}
  <div style="background:#f9fafb;border:1px solid #eee;border-radius:10px;padding:16px;margin-top:12px">
    <div class="row"><span style="color:#888">No. Resit</span><strong style="font-family:monospace">${r.no_resit}</strong></div>
    <div class="row"><span style="color:#888">Kaedah Potongan</span><span class="badge">Biro Angkasa</span></div>
    <hr class="divider"/>
    <div class="row"><span style="color:#888">Nama</span><strong style="text-transform:uppercase">${profil.value.nama_penuh || profil.value.nama_pegawai || '—'}</strong></div>
    <div class="row"><span style="color:#888">No. Kad Pengenalan</span><strong style="font-family:monospace">${profil.value.no_kp || '—'}</strong></div>
    <hr class="divider"/>
    <div class="row"><span style="color:#888">Bulan Potongan</span><strong>${labelBulanBA(r.bulan_potongan)}</strong></div>
    <div class="row"><span style="color:#888">Keterangan</span><strong>Yuran Kelab PERHILITAN</strong></div>
    <div class="row"><span style="color:#888">Kod Majikan</span><strong style="font-family:monospace">${profil.value.kod_majikan || 'N/A'}</strong></div>
  </div>
  <div class="total-box">
    <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px">Jumlah Potongan</span>
    <strong style="font-size:22px">RM ${parseFloat(r.amaun).toFixed(2)}</strong>
  </div>
  <p style="font-size:9px;color:#aaa;text-align:center;margin-top:10px">Dicetak: ${tarikh}</p>
  ${footerResitHTML()}
  </body></html>`;
};

const lihatResitBA = (r) => {
  if (Capacitor.isNativePlatform()) {
    resitBAHtml.value = buatHtmlResitBA(r);
    showResitBAModal.value = true;
  } else {
    const w = window.open('', '_blank', 'width=620,height=580');
    w.document.write(buatHtmlResitBA(r));
    w.document.close();
    setTimeout(() => w.print(), 400);
  }
};

const cetakBulkPDFBA = () => {
  const senarai = resitBATertapis.value;
  if (!senarai.length) return;
  const tarikh = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const jumlah = senarai.reduce((a, r) => a + parseFloat(r.amaun || 0), 0);

  const baris = senarai.map((r, i) => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:8px 10px;font-size:12px;color:#64748b;">${i + 1}</td>
      <td style="padding:8px 10px;font-size:12px;font-family:monospace;color:#1D4ED8;">${r.no_resit}</td>
      <td style="padding:8px 10px;font-size:12px;">${labelBulanBA(r.bulan_potongan)}</td>
      <td style="padding:8px 10px;font-size:12px;text-align:right;font-weight:700;color:#0F4C3A;">RM ${parseFloat(r.amaun).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html><html lang="ms"><head>
    <meta charset="UTF-8"/>
    <title>Penyata Potongan Biro Angkasa — ${filterTahunBA.value}</title>
    <style>
      *{box-sizing:border-box;}
      body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#0F172A;background:white;}
      table{width:100%;border-collapse:collapse;margin-top:16px;}
      th{background:#1D4ED8;color:white;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:9px 10px;text-align:left;}
      tr:nth-child(even){background:#f8fafc;}
      .info p{margin:0 0 4px;font-size:12px;color:#334155;}
      .info span{font-weight:700;color:#0F172A;}
      .jumlah-row td{background:#0F4C3A;color:white;font-weight:700;font-size:13px;padding:9px 10px;}
      .badge{display:inline-block;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:bold;}
      @media print{body{padding:12px;}}
    </style>
  </head><body>
    ${headerResitHTML(`Penyata Potongan Biro Angkasa &mdash; Tahun ${filterTahunBA.value}`)}
    <div class="info" style="margin:14px 0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
      <p>Nama: <span>${profil.value.nama_penuh || profil.value.nama_pegawai || '—'}</span></p>
      <p>No. KP: <span>${profil.value.no_kp || '—'}</span></p>
      <p>No. Ahli: <span>${profil.value.no_ahli || '—'}</span></p>
      <p>Kaedah Potongan: <span class="badge">Potongan Biro Angkasa</span></p>
      <p>Kod Majikan: <span style="font-family:monospace;">${profil.value.kod_majikan || 'N/A'}</span></p>
      <p>Dicetak: <span>${tarikh}</span></p>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th style="width:160px">No. Resit</th>
          <th>Bulan Potongan</th>
          <th style="width:120px;text-align:right">Amaun (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${baris}
        <tr>
          <td colspan="3" class="jumlah-row" style="text-align:right;padding:9px 10px;">JUMLAH POTONGAN TAHUN ${filterTahunBA.value}</td>
          <td class="jumlah-row" style="text-align:right;">RM ${jumlah.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    ${footerResitHTML()}
    <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;

  if (Capacitor.isNativePlatform()) {
    resitBAHtml.value = html;
    showResitBAModal.value = true;
  } else {
    const w = window.open('', '_blank', 'width=820,height=640');
    if (w) { w.document.write(html); w.document.close(); }
  }
};

// Mengira kadar bulanan pintar (Fallback) jika database bernilai 0.00
const kadarYuranBulanan = computed(() => {
  const yuranDB = parseFloat(profil.value.yuran_kelab_bulanan || 0);
  if (yuranDB > 0) return yuranDB;

  const gred = (profil.value.gred_sspa || '').toUpperCase();
  if (gred.includes('JUSA') || gred.includes('VU') || gred.includes('VK') || gred.includes('UTAMA')) return 15.00;

  const match = gred.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 9 && num <= 14) return 10.00;
    if (num >= 1 && num <= 8) return 5.00;
  }
  return 5.00;
});

const jumlahPerluBayar = computed(() => kadarYuranBulanan.value * 12);
const hasPendingTx = computed(() => sejarahBayaran.value.some(tx => tx.status === 'PENDING'));

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

const fetchSejarah = async () => {
  try {
    const res = await api.get('/bayaran/sejarah-yuran');
    sejarahBayaran.value = res.data.data || [];
    if (hasPendingTx.value) {
      mulakanAutoPolling();
      mulakanJamCountdown();
    } else {
      hentikanAutoPolling();
      hentikanJamCountdown();
    }
  } catch (e) { console.error(e); }
};

const mulakanAutoPolling = () => {
  if (autoPollInterval) return;
  autoPollInterval = setInterval(async () => {
    const tx = sejarahBayaran.value.find(t => t.status === 'PENDING');
    if (!tx) { hentikanAutoPolling(); return; }
    try {
      const res = await api.get(`/bayaran/semak-status/${tx.billCode}`);
      if (res.data.status === 'BERJAYA' || res.data.status === 'GAGAL' || res.data.status === 'DIBATALKAN') {
        hentikanAutoPolling();
        await fetchSejarah();
        await fetchProfil();
      }
    } catch (e) {}
  }, 10000);
};

const hentikanAutoPolling = () => {
  if (autoPollInterval) { clearInterval(autoPollInterval); autoPollInterval = null; }
};

const mulakanJamCountdown = () => {
  if (jamCountdown) return;
  jamCountdown = setInterval(() => { waktuSekarang.value = Date.now(); }, 1000);
};

const hentikanJamCountdown = () => {
  if (jamCountdown) { clearInterval(jamCountdown); jamCountdown = null; }
};

const bayarYuran = async () => {
  isProcessing.value = true;
  try {
    const response = await api.post('/bayaran/cipta-bil', {
      jenis_bayaran: 'YURAN',
      keterangan: `Yuran Tahunan Sesi ${tahunSemasa}`,
      amaun: jumlahPerluBayar.value
    });
    if (response.data.success && response.data.bill_url) {
      window.location.href = response.data.bill_url;
    }
  } catch (error) {
    alert(error.response?.data?.message || "Gagal memproses pautan ToyyibPay.");
  } finally { isProcessing.value = false; }
};

onMounted(async () => {
  await fetchProfil();
  if (profil.value.pilihan_potongan === 'Potongan Biro angkasa') fetchResitBA();
  fetchSejarah();
});

onUnmounted(() => {
  hentikanAutoPolling();
  hentikanJamCountdown();
});
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.resit-sheet-enter-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.resit-sheet-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1); }
.resit-sheet-enter-from, .resit-sheet-leave-to { transform: translateY(100%); }
</style>
