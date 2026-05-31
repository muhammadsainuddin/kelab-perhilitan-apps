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
      <button v-if="!isAhliAktif" @click="$router.push('/dashboard/yuran')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
        style="background: #FEF3C7; color: #92660C; border: 1px solid rgba(251,191,36,0.4);">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Yuran Tertunggak
      </button>
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
            {{ profil.jawatan_kelab || 'Ahli Biasa' }}
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

        <button @click="$router.push('/dashboard/kedai')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: white; border: 1px solid #E2E8F0;">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: rgba(82,183,136,0.08);">
            <svg class="w-5 h-5" fill="none" stroke="#1B4332" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #0F172A;">Kedai<br>Merch</span>
        </button>

        <button @click="$router.push('/dashboard/aktiviti')"
          class="shrink-0 flex flex-col items-center gap-2 p-4 rounded-[18px] w-22 transition-all active:scale-[0.94]"
          style="background: white; border: 1px solid #E2E8F0;">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background: rgba(15,23,42,0.05);">
            <svg class="w-5 h-5" fill="none" stroke="#0F172A" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-[8.5px] font-black uppercase text-center leading-tight" style="color: #0F172A;">Sukan<br>Aktiviti</span>
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
    <div class="reveal space-y-3" style="--d: 260ms;">
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
    <div class="reveal rounded-[20px] p-5 flex items-center justify-between"
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
                <span class="text-[10px] font-black" style="color: #D4AF37;">{{ profil.jawatan_kelab || 'Ahli Biasa' }}</span>
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

const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';

const router = useRouter();
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

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

onMounted(() => {
  fetchProfil();
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
