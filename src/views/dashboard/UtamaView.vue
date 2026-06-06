<template>
  <div class="space-y-4 pb-6 animate-page-in">

    <!-- ── GREETING ── -->
    <div class="flex items-center justify-between pt-1 px-1">
      <div>
        <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">{{ timeLabel }}</p>
        <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">
          {{ firstName }}
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <!-- Bell notifikasi -->
        <button @click="bukaNotifikasi"
          class="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style="background: #F1F5F9; border: 1px solid #E2E8F0;">
          <svg class="w-4.5 h-4.5" style="color: #475569;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-4.997M15 17H9m6 0a3 3 0 11-6 0"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86A2 2 0 0112 3a6 6 0 016 6v3.159c0 .538.214 1.055.595 1.436L19 14H5l.405-.405A2.032 2.032 0 006 12.158V9a6 6 0 014.29-5.14z"/>
          </svg>
          <span v-if="bilanganNotif > 0"
            class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[8px] font-black text-white flex items-center justify-center"
            style="background: #EF4444;">
            {{ bilanganNotif > 9 ? '9+' : bilanganNotif }}
          </span>
        </button>
        <button v-if="!isAhliAktif" @click="$router.push('/dashboard/yuran')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
          style="background: #FEF3C7; color: #92660C; border: 1px solid rgba(251,191,36,0.4);">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Yuran Tertunggak
        </button>
      </div>
    </div>

    <!-- ── DIGITAL MEMBERSHIP CARD ── -->
    <div class="reveal relative overflow-hidden rounded-[28px]"
      style="--d: 60ms; background: #081C15;
             box-shadow: 0 20px 52px rgba(8,28,21,0.35), 0 0 0 1px rgba(82,183,136,0.1);">

      <!-- Layer 1: noise texture -->
      <div class="absolute inset-0 opacity-[0.025]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 96px;"></div>
      <!-- Layer 2: dot grid -->
      <div class="absolute inset-0 opacity-[0.04]"
        style="background-image: radial-gradient(circle, #87BCB5 1px, transparent 1px); background-size: 20px 20px;"></div>
      <!-- Layer 3: emerald glow top-right -->
      <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 60%);"></div>
      <!-- Layer 4: dark green glow bottom-left -->
      <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(27,67,50,0.55) 0%, transparent 65%);"></div>
      <!-- Layer 5: watermark logo -->
      <img src="/logo.png" class="absolute right-5 bottom-10 w-40 pointer-events-none grayscale invert"
        style="opacity: 0.025; transform: rotate(15deg);" />
      <!-- Gold + teal accent line (top) -->
      <div class="absolute top-0 left-0 right-0"
        style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 50%, #95D5B2 75%, transparent);"></div>

      <!-- ─── HEADER: Logo + No. Ahli ─── -->
      <div class="relative z-10 flex items-center justify-between px-5 pt-5 pb-4"
        style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center p-1.5"
            style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <p class="text-[6.5px] font-black uppercase tracking-[0.28em]"
              style="color: rgba(149,213,178,0.5);">Digital Membership</p>
            <p class="text-[11px] font-black text-white leading-none mt-0.5 tracking-wide">Kelab PERHILITAN</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[6.5px] font-bold uppercase tracking-wider mb-1"
            style="color: rgba(149,213,178,0.35);">No. Ahli</p>
          <p class="text-[11px] font-black font-mono px-2 py-0.5 rounded-lg"
            style="color: #95D5B2; background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.15);">
            {{ profil.no_ahli || '——' }}
          </p>
        </div>
      </div>

      <!-- ─── MAIN: Avatar + Identity ─── -->
      <div class="relative z-10 flex items-start gap-4 px-5 pt-5 pb-4">
        <!-- Avatar dengan gradient ring -->
        <div class="relative shrink-0">
          <div class="absolute -inset-0.5 rounded-full pointer-events-none"
            style="background: linear-gradient(135deg, #52B788 0%, #D4AF37 100%); border-radius: 9999px;"></div>
          <div class="relative w-18 h-18 rounded-full overflow-hidden"
            style="border: 2.5px solid #081C15;">
            <img v-if="profil.gambar"
              :src="`${uploadBase}/uploads/images/${profil.gambar}`"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-2xl font-black"
              style="background: #1B4332; color: #95D5B2;">
              {{ profil.nama_penuh?.charAt(0) || '?' }}
            </div>
          </div>
        </div>

        <!-- Nama + Jawatan + Penempatan -->
        <div class="flex-1 pt-0.5">
          <p class="text-[7px] font-bold uppercase tracking-[0.2em] mb-1"
            style="color: rgba(149,213,178,0.4);">Nama Penuh Ahli</p>
          <h2 class="font-black text-white leading-snug tracking-wide"
            style="font-size: 17px; word-break: break-word; hyphens: auto;">
            {{ profil.nama_penuh || 'Memuatkan...' }}
          </h2>
          <p class="text-[11px] font-bold mt-1.5" style="color: #D4AF37; letter-spacing: 0.04em;">
            {{ profil.jawatan_kelab || 'Ahli Kelab' }}
          </p>
          <p class="text-[10px] font-medium mt-0.5 leading-snug"
            style="color: rgba(149,213,178,0.45);">
            {{ profil.penempatan || 'Penempatan belum dikemaskini' }}
          </p>
        </div>
      </div>

      <!-- ─── STATUS ROW ─── -->
      <div class="relative z-10 flex items-center gap-2 px-5 pb-4">
        <span class="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
          :style="isAhliAktif
            ? 'background: rgba(82,183,136,0.14); color: #95D5B2; border: 1px solid rgba(82,183,136,0.24);'
            : 'background: rgba(239,68,68,0.14); color: #fca5a5; border: 1px solid rgba(239,68,68,0.24);'">
          <span class="w-1.5 h-1.5 rounded-full shrink-0"
            :class="isAhliAktif ? 'bg-[#52B788] animate-pulse' : 'bg-red-400'"></span>
          {{ isAhliAktif ? 'Ahli Aktif' : 'Tidak Aktif' }}
        </span>
        <span class="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
          :style="isAhliAktif
            ? 'background: rgba(212,175,55,0.12); color: #D4AF37; border: 1px solid rgba(212,175,55,0.22);'
            : 'background: rgba(251,191,36,0.12); color: #FBBF24; border: 1px solid rgba(251,191,36,0.25);'">
          {{ isAhliAktif ? '✓ Yuran Berbayar' : '✗ Yuran Tertunggak' }}
        </span>
      </div>

      <!-- ─── QR STRIP ─── -->
      <button @click="showQR = true"
        class="relative z-10 w-full flex items-center justify-center gap-2 py-3 transition-all active:bg-white/5"
        style="border-top: 1px solid rgba(255,255,255,0.07);">
        <svg class="w-3.5 h-3.5" style="color: rgba(149,213,178,0.4);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
        </svg>
        <span class="text-[9px] font-black uppercase tracking-[0.18em]"
          style="color: rgba(149,213,178,0.4);">Tunjuk Kad QR Digital</span>
      </button>
    </div>

    <!-- ── ACTION REQUIRED ── -->
    <div v-if="!isAhliAktif"
      class="reveal rounded-[20px] overflow-hidden"
      style="--d: 180ms; border: 1px solid rgba(251,191,36,0.28);">
      <div class="p-4" style="background: #FFFBEB;">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style="background: rgba(251,191,36,0.18);">
            <svg class="w-5 h-5" fill="none" stroke="#92660C" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-[11px] font-black uppercase tracking-wide" style="color: #92660C;">Tindakan Diperlukan</p>
            <p class="text-[10px] font-medium mt-0.5 leading-relaxed" style="color: rgba(146,102,12,0.8);">
              Yuran tahunan belum dijelaskan. Akses modul Kebajikan dan Aktiviti disekat.
            </p>
          </div>
        </div>
        <button @click="$router.push('/dashboard/yuran')"
          class="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-all active:scale-[0.98]"
          style="background: #92660C; color: white;">
          Bayar Yuran Sekarang →
        </button>
      </div>
    </div>

    <div v-else class="reveal flex items-center gap-3 rounded-[20px] p-3.5"
      style="--d: 180ms; background: rgba(82,183,136,0.06); border: 1px solid rgba(82,183,136,0.14);">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(82,183,136,0.12);">
        <svg class="w-4 h-4" style="color: #2D6A4F;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p class="text-[11px] font-black" style="color: #1B4332;">Semua Baik</p>
        <p class="text-[9px] font-medium" style="color: rgba(27,67,50,0.6);">Tiada tindakan diperlukan buat masa ini</p>
      </div>
    </div>

    <!-- ── KEMPEN SUMBANGAN (SLIDER) ── -->
    <div v-if="kempen.length > 0" class="reveal space-y-2" style="--d: 200ms;">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded-lg flex items-center justify-center" style="background: rgba(239,68,68,0.1);">
            <svg class="w-3 h-3" style="color: #DC2626;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #94a3b8;">Kempen Sumbangan</p>
        </div>
        <button @click="$router.push('/dashboard/kempen-sumbangan')"
          class="text-[9px] font-black uppercase tracking-wide" style="color: #DC2626;">
          Lihat Semua →
        </button>
      </div>

      <!-- Slider -->
      <div class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-1"
        style="padding-right: 4px;">
        <div v-for="k in kempen" :key="k.id"
          class="snap-start shrink-0 w-[78vw] max-w-[300px] rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
          style="border: 1px solid rgba(239,68,68,0.18); background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.05);"
          @click="bukaDetail(k)">

          <!-- Cover gambar sokongan (jika ada) -->
          <div v-if="gambarList(k).length"
            class="h-32 overflow-hidden relative">
            <img :src="`${uploadBase}/uploads/images/${gambarList(k)[0]}`"
              class="w-full h-full object-cover" />
            <div v-if="gambarList(k).length > 1"
              class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black"
              style="background: rgba(0,0,0,0.55); color: white;">
              +{{ gambarList(k).length - 1 }} gambar
            </div>
          </div>

          <div class="p-3.5">
            <p class="text-[7px] font-black uppercase tracking-wider mb-0.5" style="color: #DC2626;">Kempen Sumbangan</p>
            <h4 class="text-[12px] font-black leading-snug mb-1.5" style="color: #0F172A;">{{ k.tajuk }}</h4>

            <!-- Penerima + penempatan -->
            <div class="flex items-center gap-1 mb-1.5">
              <svg class="w-2.5 h-2.5 shrink-0" style="color: #94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <p class="text-[9px] font-bold truncate" style="color: #475569;">{{ k.nama_penerima }}</p>
              <span v-if="k.penempatan_penerima" class="text-[7px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                style="background: #F1F5F9; color: #64748B;">{{ k.penempatan_penerima }}</span>
            </div>

            <p class="text-[9px] leading-relaxed line-clamp-2 mb-2.5" style="color: #64748B;">{{ k.sebab }}</p>

            <div class="flex items-center justify-between pt-2" style="border-top: 1px solid #F8FAFC;">
              <span class="text-[8px] font-medium" style="color: #94A3B8;">{{ fmtTarikhhh(k.tarikh_mula) }}</span>
              <span class="text-[8px] font-black" style="color: #DC2626;">Lihat →</span>
            </div>
          </div>
        </div>
        <!-- Trailing spacer supaya kad terakhir boleh scroll penuh -->
        <div class="shrink-0 w-4 h-1"></div>
      </div>
    </div>

    <!-- ── SUMBANGAN DITERIMA (jika ahli adalah penerima) ── -->
    <div v-if="kempenSayaPenerima.length > 0" class="reveal space-y-2" style="--d: 230ms;">
      <div class="flex items-center gap-2 px-1">
        <div class="w-5 h-5 rounded-lg flex items-center justify-center" style="background: rgba(16,185,129,0.1);">
          <svg class="w-3 h-3" style="color: #059669;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #94a3b8;">Sumbangan Untuk Anda</p>
      </div>
      <div v-for="k in kempenSayaPenerima" :key="k.id"
        class="rounded-[18px] p-4"
        style="background: linear-gradient(135deg, #ECFDF5, #F0FDF4); border: 1px solid rgba(16,185,129,0.2);">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-wide mb-0.5" style="color: #059669;">
              {{ k.status === 'AKTIF' ? 'Kempen Aktif' : 'Kempen Ditutup' }}
            </p>
            <p class="text-[13px] font-black leading-tight" style="color: #064E3B;">{{ k.tajuk }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[8px] font-bold" style="color: #6EE7B7;">Terkumpul</p>
            <p class="text-[18px] font-black leading-none" style="color: #059669;">RM {{ num(k.jumlah_terkumpul) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 text-[9px] font-bold" style="color: #6B7280;">
          <span>{{ k.jumlah_rekod }} rekod disahkan</span>
          <span v-if="k.jumlah_pending > 0" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E;">
            {{ k.jumlah_pending }} FPX menunggu
          </span>
        </div>
      </div>
    </div>

    <!-- ── DETAIL BOTTOM SHEET KEMPEN ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showDetail"
          class="fixed inset-0 z-[9994] flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
          @click.self="showDetail = false">
          <div class="bg-white w-full max-w-sm"
            style="border-radius: 28px 28px 0 0; max-height: 88vh; display: flex; flex-direction: column;">

            <div class="flex justify-center pt-3 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>

            <div class="flex-1 overflow-y-auto">
              <!-- Carousel gambar sokongan -->
              <div v-if="kempenDetail && gambarList(kempenDetail).length"
                class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 px-4 pt-3 pb-2">
                <img v-for="g in gambarList(kempenDetail)" :key="g"
                  :src="`${uploadBase}/uploads/images/${g}`"
                  class="snap-start h-44 shrink-0 rounded-2xl object-cover"
                  :class="gambarList(kempenDetail).length === 1 ? 'w-full' : 'w-64'" />
              </div>

              <div class="px-5 pt-4 pb-2">
                <p class="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style="color: #DC2626;">Kempen Sumbangan</p>
                <h3 class="text-[17px] font-black leading-tight mb-1" style="color: #0F172A;">{{ kempenDetail?.tajuk }}</h3>

                <!-- Penerima + penempatan -->
                <div class="flex items-center gap-2 mb-3 p-2.5 rounded-2xl" style="background: #FFF5F5;">
                  <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(239,68,68,0.1);">
                    <svg class="w-3.5 h-3.5" style="color: #DC2626;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-black" style="color: #0F172A;">{{ kempenDetail?.nama_penerima }}</p>
                    <p v-if="kempenDetail?.penempatan_penerima" class="text-[9px] font-bold" style="color: #94A3B8;">{{ kempenDetail?.penempatan_penerima }}</p>
                  </div>
                  <div v-if="kempenDetail?.tarikh_tamat" class="text-right shrink-0">
                    <p class="text-[7px] font-bold" style="color: #94A3B8;">Tamat</p>
                    <p class="text-[9px] font-black" style="color: #0F172A;">{{ fmtTarikhhh(kempenDetail.tarikh_tamat) }}</p>
                  </div>
                </div>

                <!-- Sebab penuh -->
                <p class="text-[11px] leading-relaxed mb-4" style="color: #475569;">{{ kempenDetail?.sebab }}</p>

                <!-- Bank + QR download -->
                <div class="rounded-2xl p-3 mb-2 flex items-center gap-3" style="background: #F8FAFC; border: 1px solid #F1F5F9;">
                  <svg class="w-4 h-4 shrink-0" style="color: #94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <div class="flex-1">
                    <p class="text-[10px] font-black" style="color: #0F172A;">{{ kempenDetail?.nama_bank }}</p>
                    <p class="text-[10px] font-mono" style="color: #475569;">{{ kempenDetail?.no_akaun }}</p>
                  </div>
                  <button v-if="kempenDetail?.qr_code" @click="bukaQrBesar(kempenDetail)"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-bold"
                    style="background: #F0FDF4; color: #15803D;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                    </svg>
                    QR
                  </button>
                  <button v-if="kempenDetail?.qr_code" @click="downloadQR(kempenDetail)"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-bold"
                    style="background: #EFF6FF; color: #1D4ED8;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer actions -->
            <div class="px-5 pb-8 pt-3 border-t border-gray-50 shrink-0 space-y-2">
              <div v-if="profil.no_kp === kempenDetail?.no_kp_penerima"
                class="w-full py-3 rounded-2xl text-[10px] font-bold text-center"
                style="background: #F1F5F9; color: #94A3B8;">
                Ini adalah kempen sumbangan anda
              </div>
              <template v-else>
                <button @click="() => { showDetail = false; bukaDonateModal(kempenDetail); }"
                  class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wide"
                  style="background: #DC2626; color: white;">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                  </svg>
                  Saya Sumbang
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── QUICK ACTIONS ── -->
    <div class="reveal space-y-3" style="--d: 220ms;">
      <p class="text-[9px] font-black uppercase tracking-[0.2em] px-1" style="color: #94a3b8;">Menu Pantas</p>
      <div class="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">

        <button @click="$router.push('/dashboard/yuran')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: #FEF3C7; border: 1px solid rgba(251,191,36,0.3);">
          <div class="relative w-10 h-10 rounded-2xl flex items-center justify-center"
            style="background: rgba(251,191,36,0.22);">
            <span v-if="!isAhliAktif"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#FEF3C7] bg-red-500 animate-bounce"></span>
            <svg class="w-5 h-5" fill="none" stroke="#92660C" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #92660C;">Yuran<br>Kelab</span>
        </button>

        <button v-if="settingsStore.modulAktif('modul_kedai')"
          @click="$router.push('/dashboard/kedai')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: white; border: 1px solid #E2E8F0;">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: rgba(82,183,136,0.08);">
            <svg class="w-5 h-5" fill="none" stroke="#1B4332" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #0F172A;">Kedai<br>Merch</span>
        </button>

        <button v-if="settingsStore.modulAktif('modul_acara')"
          @click="$router.push('/dashboard/aktiviti')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: white; border: 1px solid #E2E8F0;">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: rgba(15,23,42,0.05);">
            <svg class="w-5 h-5" fill="none" stroke="#0F172A" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #0F172A;">Sukan<br>Aktiviti</span>
        </button>

        <button v-if="settingsStore.modulAktif('modul_bantuan')"
          @click="$router.push('/dashboard/bantuan')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: #FFF1F2; border: 1px solid rgba(251,113,133,0.25);">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: rgba(251,113,133,0.1);">
            <svg class="w-5 h-5" fill="none" stroke="#be123c" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #be123c;">Bantuan<br>Kebajikan</span>
        </button>

        <button @click="$router.push('/dashboard/profil')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: white; border: 1px solid #E2E8F0;">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
            style="background: rgba(82,183,136,0.07);">
            <img v-if="profil.gambar"
              :src="`${uploadBase}/uploads/images/${profil.gambar}`"
              class="w-full h-full object-cover" />
            <svg v-else class="w-5 h-5" fill="none" stroke="#2D6A4F" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #0F172A;">Profil<br>Saya</span>
        </button>

      </div>
    </div>

    <!-- ── MARKETPLACE PROMO ── -->
    <div v-if="settingsStore.modulAktif('modul_kedai')" class="reveal space-y-3" style="--d: 260ms;">
      <div class="flex items-center justify-between px-1">
        <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #94a3b8;">Kedai Merchandise</p>
        <button @click="$router.push('/dashboard/kedai')"
          class="text-[9px] font-black uppercase tracking-wide" style="color: #52B788;">Semua →</button>
      </div>

      <!-- Hero promo banner -->
      <div @click="$router.push('/dashboard/kedai')"
        class="relative overflow-hidden rounded-[22px] cursor-pointer active:scale-[0.98] transition-all"
        style="background: linear-gradient(135deg, #1B4332 0%, #081C15 100%); min-height: 120px;
               box-shadow: 0 8px 28px rgba(8,28,21,0.2); border: 1px solid rgba(82,183,136,0.12);">

        <!-- decorative blobs -->
        <div class="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(82,183,136,0.2) 0%, transparent 70%);"></div>
        <div class="absolute -bottom-6 left-1/3 w-28 h-28 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);"></div>
        <!-- top gold line -->
        <div class="absolute top-0 left-0 right-0"
          style="height: 1.5px; background: linear-gradient(90deg, transparent, #D4AF37 50%, transparent);"></div>

        <div class="relative z-10 flex items-center p-5 gap-4">
          <div class="flex-1 min-w-0">
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2"
              style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.25);">
              <span class="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
              <span class="text-[7px] font-black uppercase tracking-[0.2em]" style="color: #D4AF37;">Tawaran Eksklusif</span>
            </div>
            <h3 class="text-[16px] font-black text-white leading-tight">Koleksi Merch<br>PERHILITAN</h3>
            <p class="text-[10px] font-medium mt-1.5" style="color: rgba(149,213,178,0.6);">
              Jersi, topi, beg dan pelbagai lagi
            </p>
          </div>
          <div class="shrink-0 flex flex-col items-center gap-2">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center"
              style="background: rgba(82,183,136,0.12); border: 1px solid rgba(82,183,136,0.2);">
              <svg class="w-7 h-7" style="color: #95D5B2;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="flex items-center gap-1 text-[8px] font-black uppercase tracking-wide"
              style="color: rgba(149,213,178,0.7);">
              Beli Kini
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 promo feature chips -->
      <div class="flex gap-2">
        <div class="flex-1 rounded-2xl p-3 flex items-center gap-2.5"
          style="background: white; border: 1px solid #F1F5F9;">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style="background: rgba(82,183,136,0.08);">
            <svg class="w-4 h-4" style="color: #2D6A4F;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
          </div>
          <div>
            <p class="text-[9px] font-black leading-none" style="color: #0F172A;">Pos Percuma</p>
            <p class="text-[8px] font-medium mt-0.5" style="color: #94a3b8;">Pembelian RM50+</p>
          </div>
        </div>

        <div class="flex-1 rounded-2xl p-3 flex items-center gap-2.5"
          style="background: white; border: 1px solid #F1F5F9;">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style="background: rgba(212,175,55,0.08);">
            <svg class="w-4 h-4" style="color: #D4AF37;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <div>
            <p class="text-[9px] font-black leading-none" style="color: #0F172A;">Diskaun Ahli</p>
            <p class="text-[8px] font-medium mt-0.5" style="color: #94a3b8;">Eksklusif kelab</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── AKTIVITI PROMO ── -->
    <div v-if="settingsStore.modulAktif('modul_acara')" class="reveal rounded-[20px] p-5 flex items-center justify-between"
      style="--d: 310ms; background: #0F172A; border: 1px solid rgba(82,183,136,0.1);
             box-shadow: 0 4px 20px rgba(8,28,21,0.15);">
      <div class="flex-1 min-w-0 pr-3">
        <p class="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style="color: rgba(82,183,136,0.6);">Program Kelab</p>
        <h3 class="text-[13px] font-black text-white uppercase tracking-wide">Kejohanan Sukan</h3>
        <p class="text-[10px] font-medium mt-1 leading-relaxed" style="color: rgba(100,116,139,0.8);">
          Sertai aktiviti kelab, semak tab Aktiviti untuk jadual penuh.
        </p>
      </div>
      <button @click="$router.push('/dashboard/aktiviti')"
        class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95"
        style="background: rgba(82,183,136,0.12); border: 1px solid rgba(82,183,136,0.2); color: #52B788;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- ── NOTIFIKASI PANEL ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showNotif"
          class="fixed inset-0 z-[9999] flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
          @click.self="tutupNotifikasi">
          <div class="bg-white w-full max-w-sm"
            style="border-radius: 32px 32px 0 0; max-height: 80vh; display: flex; flex-direction: column;">
            <div class="flex justify-center pt-3 mb-2">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div class="flex items-center justify-between px-5 pb-3" style="border-bottom: 1px solid #F1F5F9;">
              <h3 class="text-[15px] font-black" style="color: #0F172A;">Notifikasi</h3>
              <span v-if="bilanganNotif > 0" class="text-[9px] font-black px-2 py-0.5 rounded-full" style="background: #FEE2E2; color: #DC2626;">
                {{ bilanganNotif }} belum baca
              </span>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div v-if="muatNotif" class="flex justify-center py-8">
                <svg class="animate-spin w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
              <div v-else-if="!notifikasi.length" class="text-center py-10">
                <svg class="w-10 h-10 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                </svg>
                <p class="text-xs font-bold text-gray-400">Tiada notifikasi</p>
              </div>
              <div v-else class="divide-y divide-gray-50">
                <div v-for="n in notifikasi" :key="n.id"
                  class="flex items-start gap-3 px-5 py-4"
                  :class="n.dibaca ? 'opacity-60' : ''">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    :style="n.jenis === 'SUMBANGAN' ? 'background: #FEE2E2;' : 'background: #EFF6FF;'">
                    <svg class="w-4 h-4" :style="n.jenis === 'SUMBANGAN' ? 'color: #DC2626;' : 'color: #1D4ED8;'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path v-if="n.jenis === 'SUMBANGAN'" stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                      <p class="text-[11px] font-black" style="color: #0F172A;">{{ n.tajuk }}</p>
                      <span v-if="!n.dibaca" class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    </div>
                    <p class="text-[10px] font-medium leading-relaxed mt-0.5" style="color: #64748B;">{{ n.mesej }}</p>
                    <p class="text-[9px] font-bold mt-1" style="color: #94A3B8;">{{ fmtMasa(n.tarikh_cipta) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-5 py-4" style="border-top: 1px solid #F1F5F9;">
              <button v-if="bilanganNotif > 0" @click="bacaSemua"
                class="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98]"
                style="background: #0F172A; color: white;">
                Tandakan Semua Dibaca
              </button>
              <button v-else @click="tutupNotifikasi"
                class="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-700 transition-all active:scale-[0.98]">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── QR BESAR KEMPEN ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showQrKempen"
          class="fixed inset-0 z-[9998] flex items-center justify-center"
          style="background: rgba(8,28,21,0.8); backdrop-filter: blur(12px);"
          @click="showQrKempen = false">
          <div class="bg-white rounded-3xl p-6 mx-5 text-center">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style="color: #52B788;">QR Code Pembayaran</p>
            <p class="text-sm font-black mb-4" style="color: #0F172A;">{{ kempenQrDipilih?.nama_bank }} — {{ kempenQrDipilih?.no_akaun }}</p>
            <img :src="kempenQrDipilih ? `${uploadBase}/uploads/images/${kempenQrDipilih.qr_code}` : ''"
              class="w-56 h-56 rounded-2xl object-contain mx-auto" style="border: 2px solid #E2E8F0;" />
            <p class="text-[10px] mt-4 font-medium" style="color: #94A3B8;">Imbas dengan aplikasi bank anda</p>
            <button @click="showQrKempen = false"
              class="mt-4 w-full py-3 rounded-2xl text-xs font-black" style="background: #0F172A; color: white;">
              Tutup
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL REKOD SUMBANGAN ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showDonate"
          class="fixed inset-0 z-[9997] flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
          @click.self="showDonate = false">
          <div class="bg-white w-full max-w-sm pb-10"
            style="border-radius: 32px 32px 0 0;">
            <div class="flex justify-center pt-3 mb-3">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div class="px-6 mb-3">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style="color: #DC2626;">Sumbangan</p>
              <h3 class="text-[16px] font-black" style="color: #0F172A;">{{ kempenDonateDipilih?.tajuk }}</h3>
            </div>

            <!-- Tab kaedah (hanya tunjuk FPX jika kempen benarkan) -->
            <div v-if="kempenDonateDipilih?.allow_fpx" class="px-6 mb-4">
              <div class="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
                <button @click="donateKaedah = 'MANUAL'"
                  :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                           donateKaedah === 'MANUAL' ? 'bg-white shadow text-gray-900' : 'text-gray-500']">
                  Transfer Bank
                </button>
                <button @click="donateKaedah = 'FPX'"
                  :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                           donateKaedah === 'FPX' ? 'bg-white shadow text-gray-900' : 'text-gray-500']">
                  FPX Online
                </button>
              </div>
            </div>

            <div class="px-6 space-y-3">
              <!-- Info kaedah -->
              <div v-if="donateKaedah === 'MANUAL'"
                class="px-3 py-2 rounded-xl text-[10px] leading-relaxed"
                style="background: #F0FDF4; color: #166534; border: 1px solid rgba(22,101,52,0.12);">
                Buat transfer ke <strong>{{ kempenDonateDipilih?.nama_bank }}</strong>
                ({{ kempenDonateDipilih?.no_akaun }}), kemudian rekodkan amaun di sini.
              </div>
              <div v-else
                class="px-3 py-2 rounded-xl text-[10px] leading-relaxed"
                style="background: #FFF7ED; color: #92400E; border: 1px solid rgba(146,64,14,0.12);">
                Bayar terus melalui FPX. Caj RM1.00 dikenakan oleh ToyyibPay. Amaun RM{{ donateAmaun || '0' }} + RM1 = <strong>RM{{ donateAmaun ? (parseFloat(donateAmaun) + 1).toFixed(2) : '1.00' }}</strong> akan ditolak daripada akaun anda.
              </div>

              <!-- Amaun -->
              <div>
                <label class="text-[10px] font-black text-gray-600 mb-1 block">Amaun Sumbangan (RM) *</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">RM</span>
                  <input v-model="donateAmaun" type="number" min="1" step="0.01" placeholder="0.00"
                    class="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
                    style="border-color: #E2E8F0; color: #0F172A;" />
                </div>
              </div>

              <!-- Catatan -->
              <div>
                <label class="text-[10px] font-black text-gray-600 mb-1 block">Catatan (Sekiranya Perlu)</label>
                <input v-model="donateCatatan" type="text" placeholder="Contoh: Semoga cepat sembuh"
                  class="w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
                  style="border-color: #E2E8F0; color: #0F172A;" />
              </div>

              <!-- Anon -->
              <label class="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" v-model="donateAnon" class="w-4 h-4 rounded accent-red-500" />
                <div>
                  <p class="text-[11px] font-bold" style="color: #0F172A;">Sumbang sebagai Anon</p>
                  <p class="text-[9px]" style="color: #94A3B8;">Nama anda tidak akan dipaparkan kepada ahli lain</p>
                </div>
              </label>

              <p v-if="donateRalat" class="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl">{{ donateRalat }}</p>

              <!-- Butang ikut kaedah -->
              <button v-if="donateKaedah === 'MANUAL'"
                @click="hantarSumbangan" :disabled="menghantarDonate"
                class="w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:scale-[0.98]"
                style="background: #DC2626; color: white;" :class="menghantarDonate ? 'opacity-60' : ''">
                {{ menghantarDonate ? 'Merekodkan...' : 'Rekod Sumbangan' }}
              </button>
              <button v-else
                @click="hantarSumbanganFPX" :disabled="menghantarDonate"
                class="w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:scale-[0.98]"
                style="background: #0F172A; color: white;" :class="menghantarDonate ? 'opacity-60' : ''">
                {{ menghantarDonate ? 'Memproses...' : `Bayar RM${donateAmaun ? (parseFloat(donateAmaun)+1).toFixed(2) : '—'} via FPX →` }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── POPUP PROFIL TIDAK LENGKAP ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showProfilPopup"
          class="fixed inset-0 z-[9996] flex items-end justify-center"
          style="background: rgba(8,28,21,0.55); backdrop-filter: blur(6px);"
          @click.self="handleProfilPopupTutup">
          <div class="bg-white w-full max-w-sm pb-10"
            style="border-radius: 32px 32px 0 0;">
            <div class="flex justify-center pt-3 mb-3">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div class="px-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style="background: #FFFBEB;">
                  <svg class="w-5 h-5" style="color: #92660C;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-wide" style="color: #92660C;">Profil Tidak Lengkap</p>
                  <h3 class="text-[15px] font-black" style="color: #0F172A;">Kemaskini Maklumat Anda</h3>
                </div>
              </div>
              <p class="text-[11px] leading-relaxed mb-3" style="color: #64748B;">
                Maklumat berikut masih kosong. Sila kemaskini untuk memudahkan urusan kelab:
              </p>
              <div class="space-y-1.5 mb-5">
                <div v-for="f in profilKurang" :key="f"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style="background: #FFF7ED; border: 1px solid rgba(251,191,36,0.2);">
                  <svg class="w-3.5 h-3.5 shrink-0" style="color: #D97706;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01"/>
                  </svg>
                  <span class="text-[10px] font-bold" style="color: #92400E;">{{ f }}</span>
                </div>
              </div>
              <div class="flex gap-3">
                <button @click="handleProfilPopupTutup"
                  class="flex-1 py-3 rounded-2xl text-xs font-bold text-gray-500 bg-gray-100 transition-all active:scale-[0.98]">
                  Nanti
                </button>
                <button @click="() => { handleProfilPopupTutup(); $router.push('/dashboard/profil'); }"
                  class="flex-1 py-3 rounded-2xl text-xs font-black text-white transition-all active:scale-[0.98]"
                  style="background: #0F172A;">
                  Kemaskini Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── QR MODAL ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showQR"
          class="fixed inset-0 z-9999 flex items-end justify-center"
          style="background: rgba(8,28,21,0.75); backdrop-filter: blur(10px);"
          @click.self="showQR = false">
          <div class="bg-white w-full max-w-sm pb-10"
            style="border-radius: 32px 32px 0 0; box-shadow: 0 -12px 48px rgba(0,0,0,0.18);">
            <div class="flex justify-center pt-3 mb-4">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>
            <div class="text-center px-6 mb-5">
              <p class="text-[9px] font-black uppercase tracking-[0.22em] mb-1" style="color: #52B788;">Pengesahan Digital</p>
              <h3 class="text-[17px] font-black" style="color: #0F172A;">Kad Keahlian QR</h3>
              <p class="text-[10px] font-medium mt-1" style="color: #94a3b8;">Tunjukkan kepada pengawal atau kerani kelab</p>
            </div>
            <div class="flex justify-center mb-5">
              <div class="p-3.5 rounded-2xl" style="background: white; border: 1.5px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                <img v-if="profil.no_ahli"
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('KELAB-PERHILITAN:' + profil.no_ahli)}&format=png&margin=6&color=081C15&bgcolor=ffffff`"
                  class="w-40 h-40 rounded-xl" alt="QR" />
                <div v-else class="w-40 h-40 rounded-xl flex items-center justify-center" style="background: #F8FAFC;">
                  <p class="text-[10px] text-center px-3 font-medium" style="color: #94a3b8;">No. Ahli belum ditetapkan</p>
                </div>
              </div>
            </div>
            <div class="mx-6 rounded-2xl p-4 space-y-2.5 mb-4" style="background: #F8FAFC; border: 1px solid #E2E8F0;">
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-medium" style="color: #94a3b8;">Nama</span>
                <span class="text-[10px] font-black uppercase" style="color: #0F172A;">{{ profil.nama_penuh || '—' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-medium" style="color: #94a3b8;">No. Ahli</span>
                <span class="text-[10px] font-black font-mono" style="color: #0F172A;">{{ profil.no_ahli || '—' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-medium" style="color: #94a3b8;">Jawatan</span>
                <span class="text-[10px] font-black" style="color: #D4AF37;">{{ profil.jawatan_kelab || 'Ahli Kelab' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-medium" style="color: #94a3b8;">Status</span>
                <span class="text-[10px] font-black" :style="isAhliAktif ? 'color: #1B4332;' : 'color: #92660C;'">
                  {{ isAhliAktif ? '● Ahli Aktif' : '● Yuran Tertunggak' }}
                </span>
              </div>
            </div>
            <div class="px-6">
              <button @click="showQR = false"
                class="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider active:scale-[0.98] transition-all"
                style="background: #0F172A; color: white;">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import { useSettingsStore } from '../../stores/settings';

const settingsStore = useSettingsStore();
const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';
const router = useRouter();

// ── Profil ──
const profil = ref({});
const showQR = ref(false);
const isAhliAktif = computed(() => !!profil.value.is_paid);
const firstName = computed(() => {
  if (!profil.value.nama_penuh) return 'Ahli';
  return profil.value.nama_penuh.split(' ')[0];
});
const timeLabel = computed(() => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Selamat Pagi';
  if (h >= 12 && h < 15) return 'Selamat Tengah Hari';
  if (h >= 15 && h < 19) return 'Selamat Petang';
  return 'Selamat Malam';
});

// ── Kempen sumbangan ──
const kempen = ref([]);
const muatKempen = async () => {
  try {
    const res = await api.get('/user/kempen-sumbangan');
    kempen.value = res.data.data || [];
  } catch (e) { kempen.value = []; }
};

// ── Kempen saya sebagai penerima ──
const kempenSayaPenerima = ref([]);
const muatKempenPenerima = async () => {
  try {
    const res = await api.get('/user/kempen-sumbangan/saya-penerima');
    kempenSayaPenerima.value = res.data.data || [];
  } catch (e) { kempenSayaPenerima.value = []; }
};

// ── Notifikasi ──
const showNotif      = ref(false);
const notifikasi     = ref([]);
const bilanganNotif  = ref(0);
const muatNotif      = ref(false);

const muatBilanganNotif = async () => {
  try {
    const res = await api.get('/user/notifikasi/bilangan');
    bilanganNotif.value = res.data.bilangan || 0;
  } catch (e) { bilanganNotif.value = 0; }
};

const bukaNotifikasi = async () => {
  showNotif.value = true;
  muatNotif.value = true;
  try {
    const res = await api.get('/user/notifikasi');
    notifikasi.value = res.data.data || [];
  } catch (e) { notifikasi.value = []; }
  finally { muatNotif.value = false; }
};

const tutupNotifikasi = () => { showNotif.value = false; };

const bacaSemua = async () => {
  try {
    await api.put('/user/notifikasi/baca-semua');
    notifikasi.value.forEach(n => { n.dibaca = 1; });
    bilanganNotif.value = 0;
  } catch (e) { console.error(e); }
};

// ── Detail kempen ──
const showDetail   = ref(false);
const kempenDetail = ref(null);
const bukaDetail   = (k) => { kempenDetail.value = k; showDetail.value = true; };

// ── Helpers gambar ──
const gambarList = (k) => k?.gambar_sokongan ? k.gambar_sokongan.split(',').filter(Boolean) : [];

// ── QR kempen besar ──
const showQrKempen      = ref(false);
const kempenQrDipilih   = ref(null);
const bukaQrBesar = (k) => { kempenQrDipilih.value = k; showQrKempen.value = true; };

// ── Rekod donate ──
const showDonate           = ref(false);
const kempenDonateDipilih  = ref(null);
const donateAmaun          = ref('');
const donateCatatan        = ref('');
const donateAnon           = ref(false);
const donateKaedah         = ref('MANUAL');
const donateRalat          = ref('');
const menghantarDonate     = ref(false);

const bukaDonateModal = (k) => {
  kempenDonateDipilih.value = k;
  donateAmaun.value = '';
  donateCatatan.value = '';
  donateAnon.value = false;
  donateKaedah.value = 'MANUAL';
  donateRalat.value = '';
  showDonate.value = true;
};

const hantarSumbangan = async () => {
  donateRalat.value = '';
  const amaun = parseFloat(donateAmaun.value);
  if (!amaun || amaun <= 0) { donateRalat.value = 'Sila masukkan amaun yang sah.'; return; }
  menghantarDonate.value = true;
  try {
    await api.post(`/user/kempen-sumbangan/${kempenDonateDipilih.value.id}/rekod`, {
      amaun, catatan: donateCatatan.value, anon: donateAnon.value
    });
    showDonate.value = false;
    await muatKempen();
    await muatBilanganNotif();
  } catch (e) {
    donateRalat.value = e.response?.data?.message || 'Ralat sistem.';
  } finally { menghantarDonate.value = false; }
};

const hantarSumbanganFPX = async () => {
  donateRalat.value = '';
  const amaun = parseFloat(donateAmaun.value);
  if (!amaun || amaun <= 0) { donateRalat.value = 'Sila masukkan amaun yang sah.'; return; }
  menghantarDonate.value = true;
  try {
    const res = await api.post(`/user/kempen-sumbangan/${kempenDonateDipilih.value.id}/bayar-fpx`, {
      amaun, catatan: donateCatatan.value, anon: donateAnon.value
    });
    showDonate.value = false;
    window.location.href = res.data.billUrl;
  } catch (e) {
    donateRalat.value = e.response?.data?.message || 'Ralat mencipta bil FPX.';
  } finally { menghantarDonate.value = false; }
};

// ── Download QR ──
const downloadQR = async (k) => {
  try {
    const resp = await fetch(`${uploadBase}/uploads/images/${k.qr_code}`);
    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `QR-${k.nama_penerima || k.no_kp_penerima}-${k.nama_bank}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) { console.error('Download QR gagal:', e); }
};

// ── Popup profil tidak lengkap ──
const showProfilPopup = ref(false);
const profilKurang    = ref([]);

const semakProfilLengkap = (p) => {
  const kurang = [];
  if (!p.no_tel)        kurang.push('Nombor telefon');
  if (!p.no_acc_bank)   kurang.push('No. akaun bank');
  if (!p.nama_waris)    kurang.push('Nama waris/benefisiari');
  if (!p.no_tel_waris)  kurang.push('No. telefon waris');
  profilKurang.value = kurang;
  if (kurang.length > 0 && !sessionStorage.getItem('profil_popup_tutup')) {
    showProfilPopup.value = true;
  }
};

// ── Helpers ──
const num = (v) => parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtTarikhhh = (t) => {
  if (!t) return '';
  return t.substring(0, 10).split('-').reverse().join('/');
};
const fmtMasa = (t) => {
  if (!t) return '';
  const d = t.substring(0, 10).split('-').reverse().join('/');
  const m = t.substring(11, 16);
  return `${d}  ${m}`;
};

// ── Muat profil ──
const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
    semakProfilLengkap(res.data.data);
  } catch (e) { console.error(e); }
};

// ── Watch popup tutup (simpan sessionStorage) ──
const handleProfilPopupTutup = () => {
  sessionStorage.setItem('profil_popup_tutup', '1');
  showProfilPopup.value = false;
};

onMounted(() => {
  fetchProfil();
  muatKempen();
  muatKempenPenerima();
  muatBilanganNotif();
  settingsStore.muatTetapan();
});
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.reveal {
  opacity: 0;
  transform: translateY(14px);
  animation: revealUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.sheet-enter-active { transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div { transform: translateY(100%); }
.sheet-leave-to > div { transform: translateY(100%); }
</style>
