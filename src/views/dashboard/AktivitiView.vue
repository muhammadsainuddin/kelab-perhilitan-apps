<template>
  <div class="space-y-4 pb-6 animate-page-in">

    <!-- HEADER -->
    <div class="px-1 pt-1">
      <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Program Kelab</p>
      <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Acara &amp; Aktiviti</h2>
      <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
        Sertai acara rasmi — sukan, jamuan, hari keluarga dan banyak lagi.
      </p>
    </div>

    <!-- YURAN WARNING -->
    <div v-if="profilDimuatkan && !isPaid"
      class="rounded-[18px] p-4 flex items-start gap-3"
      style="background: #FFFBEB; border: 1px solid rgba(251,191,36,0.28);">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style="background: rgba(251,191,36,0.18);">
        <svg class="w-4 h-4" fill="none" stroke="#92660C" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-[11px] font-black" style="color: #92660C;">Pendaftaran Disekat</p>
        <p class="text-[10px] font-medium mt-0.5 leading-relaxed" style="color: rgba(146,102,12,0.8);">
          Jelaskan yuran tahunan dahulu sebelum mendaftar mana-mana acara.
        </p>
        <button @click="$router.push('/dashboard/yuran')"
          class="mt-1.5 text-[10px] font-black uppercase tracking-wide" style="color: #92660C; text-decoration: underline; text-underline-offset: 2px;">
          Bayar Sekarang →
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="rounded-[20px] overflow-hidden" style="background: white; border: 1px solid #F1F5F9;">
        <div class="skeleton h-40 w-full"></div>
        <div class="p-4 space-y-2">
          <div class="skeleton h-3 w-24 rounded"></div>
          <div class="skeleton h-5 w-3/4 rounded"></div>
          <div class="skeleton h-3 w-1/2 rounded"></div>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else-if="senaraiAcara.length === 0"
      class="rounded-[20px] p-10 flex flex-col items-center text-center gap-3"
      style="background: white; border: 1px solid #F1F5F9;">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: #F8FAFC;">
        <svg class="w-7 h-7" style="color: #CBD5E1;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <p class="text-[13px] font-black" style="color: #0F172A;">Tiada Acara Aktif</p>
        <p class="text-[10px] font-medium mt-1" style="color: #94a3b8;">Acara baru akan dipaparkan di sini apabila tersedia.</p>
      </div>
    </div>

    <!-- EVENT LIST -->
    <div v-else class="space-y-3">
      <div v-for="(acara, i) in senaraiAcara" :key="acara.id"
        class="reveal rounded-[20px] overflow-hidden bg-white group cursor-pointer transition-all active:scale-[0.99]"
        style="border: 1px solid #F1F5F9; box-shadow: 0 2px 12px rgba(15,23,42,0.05);"
        :style="`--d: ${i * 60}ms`"
        @click="bukaDetail(acara)">

        <!-- Poster Slider -->
        <div v-if="acara.poster" class="relative w-full overflow-hidden" style="height: 176px; background: #0F172A;">
          <!-- slides -->
          <div class="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
            <div v-for="(img, si) in dapatkanSemuaPoster(acara.poster)" :key="si"
              class="relative shrink-0 w-full h-full snap-start">
              <img :src="`https://kelabperhilitan.msdev.com.my/uploads/images/${img}`"
                class="w-full h-full object-cover" />
            </div>
          </div>
          <!-- gradient overlay -->
          <div class="absolute inset-0 pointer-events-none"
            style="background: linear-gradient(to top, rgba(8,28,21,0.6) 0%, transparent 55%);"></div>
          <!-- image count badge -->
          <div v-if="kiraBilanganGambar(acara.poster) > 1"
            class="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black pointer-events-none"
            style="background: rgba(0,0,0,0.6); color: white; backdrop-filter: blur(4px);">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ kiraBilanganGambar(acara.poster) }}
          </div>
          <!-- registered badge -->
          <div v-if="acara.sudah_daftar"
            class="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wide pointer-events-none"
            style="background: rgba(82,183,136,0.9); color: white; backdrop-filter: blur(4px);">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Telah Mendaftar
          </div>
        </div>

        <!-- Card body -->
        <div class="p-4">
          <!-- Badges row -->
          <div class="flex items-center gap-2 mb-2.5 flex-wrap">
            <span v-if="acara.jenis_acara"
              class="text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              :class="warnaJenis(acara.jenis_acara)">
              {{ acara.jenis_acara }}
            </span>
            <span class="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style="background: #081C15; color: #95D5B2;">
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ formatTarikh(acara.tarikh_acara) }}
            </span>
          </div>

          <!-- Name -->
          <h3 class="text-[14px] font-black leading-snug mb-1.5" style="color: #0F172A;">
            {{ acara.nama_acara }}
          </h3>

          <!-- Description preview -->
          <p class="text-[11px] font-medium leading-relaxed line-clamp-2 mb-3" style="color: #64748B;">
            {{ acara.keterangan || 'Tiada butiran tambahan disediakan.' }}
          </p>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-[10px] font-medium mb-3" style="color: #94a3b8;">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ acara.lokasi || 'Akan dimaklumkan' }}
            </span>
            <span v-if="acara.tarikh_tutup" class="flex items-center gap-1" style="color: #92660C;">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Tutup: {{ formatTarikh(acara.tarikh_tutup) }}
            </span>
          </div>

          <!-- Footer: action + detail link -->
          <div class="flex items-center justify-between pt-3" style="border-top: 1px solid #F8FAFC;">
            <button class="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide transition-all"
              style="color: #52B788;">
              Lihat Butiran
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <div @click.stop>
              <button v-if="acara.sudah_daftar" @click="batalDaftar(acara)" :disabled="aksiLoading"
                class="text-[10px] font-black uppercase tracking-wide px-3.5 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                style="background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.15);">
                Batal Daftar
              </button>
              <button v-else @click="bukaDaftar(acara)" :disabled="!isPaid"
                class="text-[10px] font-black uppercase tracking-wide px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style="background: #081C15; color: #95D5B2;">
                {{ isPaid ? 'Sertai' : 'Yuran Perlu' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════
         FULLSCREEN DETAIL VIEW
         ═══════════════════════════ -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="acaraTerpilih" class="fixed inset-0 z-9999 flex flex-col" style="background: #F8FAFC;">

          <!-- Top bar -->
          <div class="shrink-0 flex items-center gap-3 px-4 pt-5 pb-3 bg-white" style="border-bottom: 1px solid #F1F5F9;">
            <button @click="acaraTerpilih = null"
              class="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 shrink-0"
              style="background: #F1F5F9; color: #0F172A;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <p class="text-[9px] font-bold uppercase tracking-[0.18em]" style="color: #52B788;">Butiran Acara</p>
              <h3 class="text-[13px] font-black leading-tight truncate" style="color: #0F172A;">
                {{ acaraTerpilih.nama_acara }}
              </h3>
            </div>
            <!-- registered indicator -->
            <div v-if="acaraTerpilih.sudah_daftar"
              class="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wide"
              style="background: rgba(82,183,136,0.1); color: #1B4332; border: 1px solid rgba(82,183,136,0.2);">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Daftar
            </div>
          </div>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">

            <!-- Hero Slider -->
            <div v-if="acaraTerpilih.poster" class="relative w-full overflow-hidden" style="height: 260px; background: #081C15;">
              <!-- slides -->
              <div ref="sliderDetailRef"
                class="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                @scroll="onDetailScroll">
                <div v-for="(img, si) in detailImages" :key="si"
                  class="relative shrink-0 w-full h-full snap-start">
                  <img :src="`https://kelabperhilitan.msdev.com.my/uploads/images/${img}`"
                    class="w-full h-full object-cover" />
                </div>
              </div>
              <!-- gradient -->
              <div class="absolute inset-0 pointer-events-none"
                style="background: linear-gradient(to top, rgba(8,28,21,0.65) 0%, transparent 55%);"></div>
              <!-- prev button -->
              <button v-if="detailSlideIndex > 0" @click.stop="gotoDetailSlide(detailSlideIndex - 1)"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 z-10"
                style="background: rgba(0,0,0,0.55); color: white; backdrop-filter: blur(6px);">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <!-- next button -->
              <button v-if="detailSlideIndex < detailImages.length - 1" @click.stop="gotoDetailSlide(detailSlideIndex + 1)"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 z-10"
                style="background: rgba(0,0,0,0.55); color: white; backdrop-filter: blur(6px);">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <!-- counter -->
              <div v-if="detailImages.length > 1"
                class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black pointer-events-none"
                style="background: rgba(0,0,0,0.55); color: white; backdrop-filter: blur(4px);">
                {{ detailSlideIndex + 1 }} / {{ detailImages.length }}
              </div>
              <!-- dot indicators -->
              <div v-if="detailImages.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                <div v-for="(img, si) in detailImages" :key="si"
                  class="rounded-full transition-all duration-300"
                  :class="si === detailSlideIndex
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/45'">
                </div>
              </div>
            </div>

            <div class="p-4 space-y-4">

              <!-- Badges + title -->
              <div>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span v-if="acaraTerpilih.jenis_acara"
                    class="text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                    :class="warnaJenis(acaraTerpilih.jenis_acara)">
                    {{ acaraTerpilih.jenis_acara }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style="background: #081C15; color: #95D5B2;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ formatTarikh(acaraTerpilih.tarikh_acara) }}
                  </span>
                </div>
                <h2 class="text-[20px] font-black leading-snug" style="color: #0F172A;">
                  {{ acaraTerpilih.nama_acara }}
                </h2>
              </div>

              <!-- Info cards -->
              <div class="grid grid-cols-2 gap-2.5">
                <div class="rounded-[16px] p-3.5" style="background: white; border: 1px solid #F1F5F9;">
                  <p class="text-[7.5px] font-black uppercase tracking-[0.16em] mb-1.5" style="color: #94a3b8;">Tarikh Acara</p>
                  <p class="text-[12px] font-black" style="color: #0F172A;">{{ formatTarikh(acaraTerpilih.tarikh_acara) }}</p>
                </div>
                <div class="rounded-[16px] p-3.5" style="background: white; border: 1px solid #F1F5F9;">
                  <p class="text-[7.5px] font-black uppercase tracking-[0.16em] mb-1.5" style="color: #94a3b8;">Lokasi</p>
                  <p class="text-[12px] font-black leading-snug" style="color: #0F172A;">
                    {{ acaraTerpilih.lokasi || 'Akan dimaklumkan' }}
                  </p>
                </div>
                <div v-if="acaraTerpilih.tarikh_tutup" class="col-span-2 rounded-[16px] p-3.5"
                  style="background: #FFFBEB; border: 1px solid rgba(251,191,36,0.25);">
                  <p class="text-[7.5px] font-black uppercase tracking-[0.16em] mb-1.5" style="color: #92660C;">Tutup Pendaftaran</p>
                  <p class="text-[12px] font-black" style="color: #92660C;">{{ formatTarikh(acaraTerpilih.tarikh_tutup) }}</p>
                </div>
              </div>

              <!-- Full description -->
              <div class="rounded-[18px] p-4" style="background: white; border: 1px solid #F1F5F9;">
                <p class="text-[8px] font-black uppercase tracking-[0.18em] mb-2.5" style="color: #94a3b8;">Keterangan Acara</p>
                <p class="text-[12px] font-medium leading-relaxed whitespace-pre-wrap" style="color: #334155;">
                  {{ acaraTerpilih.keterangan || 'Tiada butiran tambahan disediakan.' }}
                </p>
              </div>

              <!-- Registration status -->
              <div v-if="acaraTerpilih.sudah_daftar"
                class="rounded-[18px] p-4 flex items-center gap-3"
                style="background: rgba(82,183,136,0.07); border: 1px solid rgba(82,183,136,0.16);">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style="background: rgba(82,183,136,0.12);">
                  <svg class="w-5 h-5" style="color: #2D6A4F;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-[12px] font-black" style="color: #1B4332;">Anda Telah Mendaftar</p>
                  <p class="text-[10px] font-medium" style="color: rgba(27,67,50,0.6);">Pendaftaran anda untuk acara ini berjaya direkodkan</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Action footer -->
          <div class="shrink-0 px-4 pb-8 pt-3 bg-white" style="border-top: 1px solid #F1F5F9;">
            <button v-if="acaraTerpilih.sudah_daftar" @click="batalDaftar(acaraTerpilih)" :disabled="aksiLoading"
              class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              style="background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.15);">
              <span v-if="aksiLoading" class="w-4 h-4 rounded-full border-2 border-red-300 border-t-transparent animate-spin"></span>
              {{ aksiLoading ? 'Memproses...' : 'Batalkan Pendaftaran' }}
            </button>
            <button v-else @click="bukaDaftar(acaraTerpilih)" :disabled="!isPaid"
              class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style="background: #081C15; color: #95D5B2;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              {{ isPaid ? 'Daftar Sekarang' : 'Jelaskan Yuran Dahulu' }}
            </button>
          </div>

        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════
         GALERI GAMBAR
         ═══════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalGaleri.show" class="fixed inset-0 z-[99999] flex flex-col items-center justify-center" style="background: rgba(0,0,0,0.96);">
          <button @click="modalGaleri.show = false"
            class="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full z-50 transition-all active:scale-90"
            style="background: rgba(255,255,255,0.1); color: white;">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[11px] font-bold"
            style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);">
            {{ modalGaleri.currentIndex + 1 }} / {{ modalGaleri.images.length }}
          </div>
          <div class="relative w-full h-full max-w-2xl flex items-center justify-center p-4">
            <button v-if="modalGaleri.images.length > 1" @click="prevGambar"
              class="absolute left-3 w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 z-10"
              style="background: rgba(255,255,255,0.12); color: white;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <img :src="`https://kelabperhilitan.msdev.com.my/uploads/images/${modalGaleri.images[modalGaleri.currentIndex]}`"
              class="max-w-full max-h-[85vh] object-contain rounded-xl" />
            <button v-if="modalGaleri.images.length > 1" @click="nextGambar"
              class="absolute right-3 w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 z-10"
              style="background: rgba(255,255,255,0.12); color: white;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div v-if="modalGaleri.images.length > 1" class="absolute bottom-8 flex gap-2">
            <button v-for="(img, idx) in modalGaleri.images" :key="idx"
              @click="modalGaleri.currentIndex = idx"
              class="rounded-full transition-all"
              :class="idx === modalGaleri.currentIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/35 hover:bg-white/60'"></button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════
         MODAL PENDAFTARAN
         ═══════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modal.show"
          class="fixed inset-0 z-[99999] flex items-end justify-center"
          style="background: rgba(8,28,21,0.7); backdrop-filter: blur(8px);"
          @click.self="modal.show = false">
          <div class="bg-white w-full max-w-md pb-8"
            style="border-radius: 28px 28px 0 0; box-shadow: 0 -12px 48px rgba(0,0,0,0.15);">
            <div class="flex justify-center pt-3 mb-4">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>
            <div class="px-6">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style="color: #52B788;">Pendaftaran Acara</p>
              <h3 class="text-[16px] font-black mb-0.5" style="color: #0F172A;">Sertai Acara</h3>
              <p class="text-[11px] font-medium mb-5" style="color: #64748B;">
                {{ modal.acara?.nama_acara }}
              </p>

              <div class="space-y-4">
                <!-- Pilihan sukan dari senarai admin (acara SUKAN) -->
                <div v-if="sukanTersedia.length > 0" class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">
                    Sukan Yang Ingin Disertai *
                    <span class="font-bold normal-case tracking-normal" style="color: #94a3b8;">
                      ({{ modal.benarkanPelbagai ? 'boleh pilih lebih satu' : 'pilih satu sahaja' }})
                    </span>
                  </label>
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="sukan in sukanTersedia" :key="sukan" type="button"
                      @click="toggleSukan(sukan)"
                      class="text-[11px] font-bold px-3 py-2 rounded-xl transition-all active:scale-95"
                      :style="modal.sukanDipilih.includes(sukan)
                        ? 'background: #081C15; color: #95D5B2; border: 1.5px solid #081C15;'
                        : 'background: #F8FAFC; color: #0F172A; border: 1.5px solid #E2E8F0;'">
                      {{ sukan }}
                    </button>
                  </div>
                </div>

                <!-- Fallback teks bebas untuk acara bukan SUKAN / tiada senarai -->
                <div v-else class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">
                    Acara / Sukan Yang Ingin Disertai *
                  </label>
                  <input v-model="modal.kategori" type="text"
                    placeholder="Cth: Bola Sepak, Badminton Beregu..."
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">
                    Nota Kepada Urusetia
                  </label>
                  <textarea v-model="modal.catatan" rows="3"
                    placeholder="Sila beritahu jika ada maklumat lanjut..."
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none resize-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"></textarea>
                </div>
              </div>

              <div class="flex gap-3 mt-5">
                <button @click="modal.show = false"
                  class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98]"
                  style="background: #F1F5F9; color: #64748B;">
                  Batal
                </button>
                <button @click="hantarPendaftaran" :disabled="aksiLoading || !bolehHantar"
                  class="flex-[2] py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  style="background: #081C15; color: #95D5B2;">
                  <span v-if="aksiLoading" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                  {{ aksiLoading ? 'Memproses...' : 'Sahkan Pendaftaran' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

const senaraiAcara = ref([]);
const profil = ref({});
const profilDimuatkan = ref(false);
const loading = ref(true);
const aksiLoading = ref(false);

const acaraTerpilih = ref(null);
const sliderDetailRef = ref(null);
const detailSlideIndex = ref(0);

const detailImages = computed(() => {
  if (!acaraTerpilih.value?.poster) return [];
  return dapatkanSemuaPoster(acaraTerpilih.value.poster);
});

const onDetailScroll = () => {
  if (!sliderDetailRef.value) return;
  const w = sliderDetailRef.value.offsetWidth;
  detailSlideIndex.value = Math.round(sliderDetailRef.value.scrollLeft / w);
};

const gotoDetailSlide = (idx) => {
  if (!sliderDetailRef.value) return;
  sliderDetailRef.value.scrollTo({ left: idx * sliderDetailRef.value.offsetWidth, behavior: 'smooth' });
};

const modal = ref({ show: false, acara: null, kategori: '', catatan: '', sukanDipilih: [], benarkanPelbagai: false });
const modalGaleri = ref({ show: false, images: [], currentIndex: 0 });

const isPaid = computed(() => !!profil.value.is_paid);

// Senarai sukan yang ditetapkan admin untuk acara dalam modal
const sukanTersedia = computed(() => {
  if (modal.value.acara?.jenis_acara !== 'SUKAN') return [];
  return safeParseJSON(modal.value.acara?.senarai_sukan);
});

// Sah untuk hantar: ada pilihan sukan, atau (fallback) ada teks kategori
const bolehHantar = computed(() =>
  sukanTersedia.value.length > 0 ? modal.value.sukanDipilih.length > 0 : !!modal.value.kategori
);

const safeParseJSON = (data) => {
  if (!data) return [];
  try {
    return Array.isArray(data) ? data : JSON.parse(data);
  } catch { return []; }
};

const toggleSukan = (sukan) => {
  const dipilih = modal.value.sukanDipilih;
  if (dipilih.includes(sukan)) {
    modal.value.sukanDipilih = dipilih.filter(s => s !== sukan);
  } else if (modal.value.benarkanPelbagai) {
    modal.value.sukanDipilih = [...dipilih, sukan];
  } else {
    modal.value.sukanDipilih = [sukan]; // had satu sahaja
  }
};

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
  finally { profilDimuatkan.value = true; }
};

const fetchAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/acara/aktif');
    senaraiAcara.value = res.data.data || [];
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const formatTarikh = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'TBA';

const warnaJenis = (jenis) => {
  const j = (jenis || '').toLowerCase();
  if (j.includes('sukan') || j.includes('kejohanan') || j.includes('futsal') || j.includes('larian'))
    return 'bg-[#E1F5EE] text-[#0F6E56]';
  if (j.includes('jamuan') || j.includes('raya') || j.includes('makan'))
    return 'bg-[#FEF3C7] text-[#92660C]';
  if (j.includes('keluarga') || j.includes('famili') || j.includes('luar'))
    return 'bg-[#E6F1FB] text-[#0C447C]';
  if (j.includes('mesyuarat') || j.includes('agm') || j.includes('taklimat'))
    return 'bg-[#EEEDFE] text-[#3C3489]';
  return 'bg-[#87BCB5]/20 text-[#0E303D]';
};

const dapatkanPosterUtama = (posterStr) => {
  if (!posterStr) return null;
  try {
    const arr = JSON.parse(posterStr);
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : posterStr;
  } catch { return posterStr; }
};

const dapatkanSemuaPoster = (posterStr) => {
  if (!posterStr) return [];
  try {
    const arr = JSON.parse(posterStr);
    return Array.isArray(arr) ? arr : [posterStr];
  } catch { return [posterStr]; }
};

const kiraBilanganGambar = (posterStr) => dapatkanSemuaPoster(posterStr).length;

const bukaGaleri = (posterStr) => {
  const images = dapatkanSemuaPoster(posterStr);
  if (images.length > 0) modalGaleri.value = { show: true, images, currentIndex: 0 };
};

const nextGambar = () => {
  const len = modalGaleri.value.images.length;
  modalGaleri.value.currentIndex = (modalGaleri.value.currentIndex + 1) % len;
};

const prevGambar = () => {
  const len = modalGaleri.value.images.length;
  modalGaleri.value.currentIndex = (modalGaleri.value.currentIndex - 1 + len) % len;
};

const bukaDetail = (acara) => {
  acaraTerpilih.value = acara;
  detailSlideIndex.value = 0;
};

const bukaDaftar = (acara) => {
  modal.value = {
    show: true,
    acara,
    kategori: '',
    catatan: '',
    sukanDipilih: [],
    benarkanPelbagai: acara?.benarkan_pelbagai_sukan === 1 || acara?.benarkan_pelbagai_sukan === true
  };
};

const hantarPendaftaran = async () => {
  aksiLoading.value = true;
  try {
    const sukanDipilih = modal.value.sukanDipilih;
    const res = await api.post('/acara/daftar', {
      acara_id: modal.value.acara.id,
      // kategori = rumusan ringkas: senarai sukan dipilih atau teks bebas
      kategori: sukanDipilih.length > 0 ? sukanDipilih.join(', ') : modal.value.kategori,
      catatan: modal.value.catatan,
      sukan_dipilih: sukanDipilih.length > 0 ? sukanDipilih : null
    });
    alert(res.data.message || 'Pendaftaran berjaya!');
    modal.value.show = false;
    await fetchAcara();
    if (acaraTerpilih.value) {
      acaraTerpilih.value = senaraiAcara.value.find(a => a.id === acaraTerpilih.value.id) || null;
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mendaftar acara.');
  } finally { aksiLoading.value = false; }
};

const batalDaftar = async (acara) => {
  if (!confirm(`Batalkan pendaftaran untuk "${acara.nama_acara}"?`)) return;
  aksiLoading.value = true;
  try {
    const res = await api.delete(`/acara/batal/${acara.id}`);
    alert(res.data.message || 'Pendaftaran dibatalkan.');
    await fetchAcara();
    if (acaraTerpilih.value) {
      acaraTerpilih.value = senaraiAcara.value.find(a => a.id === acaraTerpilih.value.id) || null;
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal membatalkan pendaftaran.');
  } finally { aksiLoading.value = false; }
};

onMounted(() => {
  fetchProfil();
  fetchAcara();
});
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.reveal {
  opacity: 0;
  transform: translateY(12px);
  animation: revealUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

/* Detail fullscreen slide-up */
.slide-up-enter-active { transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-leave-active { transition: all 0.28s cubic-bezier(0.4, 0, 1, 1); }
.slide-up-enter-from { transform: translateY(100%); opacity: 0; }
.slide-up-leave-to { transform: translateY(100%); opacity: 0; }

/* Modal sheet */
.modal-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div { transform: translateY(100%); }
.modal-leave-to > div { transform: translateY(100%); }

/* Galeri fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
