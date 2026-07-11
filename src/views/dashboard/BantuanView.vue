<template>
  <div class="space-y-4 pb-8 animate-page-in">

    <!-- HEADER -->
    <div class="px-1 pt-1 flex items-start justify-between gap-3">
      <div>
        <p class="text-[9px] font-bold uppercase tracking-[0.22em]" style="color: #52B788;">Program Kebajikan</p>
        <h2 class="text-[22px] font-black leading-tight mt-0.5" style="color: #0F172A;">Bantuan kebajikan</h2>
        <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
          Mohon bantuan, khas untuk ahli berbayar sahaja.
        </p>
      </div>
      <button @click="showInfoBantuan = true"
        class="shrink-0 mt-1 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all active:scale-95"
        style="background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.2); color: #1B4332;">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Info Bantuan
      </button>
    </div>

    <!-- STATUS KELAYAKAN -->
    <div class="rounded-[20px] p-4 flex items-center justify-between"
      :style="isAhliAktif
        ? 'background: rgba(82,183,136,0.07); border: 1px solid rgba(82,183,136,0.16);'
        : 'background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);'">
      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.18em] mb-1" style="color: #94a3b8;">Status Kelayakan Bantuan</p>
        <h3 class="text-[14px] font-black uppercase" :style="isAhliAktif ? 'color: #1B4332;' : 'color: #dc2626;'">
          {{ isAhliAktif ? 'Layak Memohon' : 'Tidak Layak — Bayar Yuran' }}
        </h3>
      </div>
      <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        :style="isAhliAktif ? 'background: rgba(82,183,136,0.12);' : 'background: rgba(239,68,68,0.1);'">
        <svg v-if="isAhliAktif" class="w-5 h-5" style="color: #2D6A4F;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>
    </div>


    <!-- ACCESS BLOCKED -->
    <div v-if="!isAhliAktif"
      class="rounded-[18px] p-4 flex items-start gap-3"
      style="background: #FFF1F2; border: 1px solid rgba(239,68,68,0.2);">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(239,68,68,0.1);">
        <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-[11px] font-black text-rose-800">Akses Disekat</p>
        <p class="text-[10px] text-rose-700 mt-0.5 leading-relaxed">
          Sila jelaskan yuran tahunan terlebih dahulu untuk mendapatkan kelayakan memohon bantuan kebajikan.
        </p>
        <button @click="$router.push('/dashboard/yuran')"
          class="mt-1.5 text-[10px] font-black text-rose-700 underline underline-offset-2">
          Pergi ke Yuran →
        </button>
      </div>
    </div>

    <!-- NEW APPLICATION BUTTON -->
    <button v-if="isAhliAktif" @click="showModal = true"
      class="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
      style="background: #081C15; color: #95D5B2;">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      Permohonan Baharu
    </button>

    <!-- HISTORY LIST -->
    <div class="rounded-[20px] overflow-hidden bg-white" style="border: 1px solid #F1F5F9; box-shadow: 0 1px 8px rgba(15,23,42,0.04);">
      <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid #F1F5F9;">
        <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: #94a3b8;">Rekod Permohonan</p>
        <button @click="fetchSejarahBantuan"
          class="w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90" style="color: #52B788;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>

      <div v-if="loadingSejarah" class="py-10 flex items-center justify-center gap-2">
        <div class="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style="border-color: #E2E8F0; border-top-color: #52B788;"></div>
        <span class="text-[11px] font-medium" style="color: #94a3b8;">Memuatkan rekod...</span>
      </div>

      <div v-else-if="sejarahBantuan.length === 0" class="py-10 text-center">
        <p class="text-[11px] font-medium uppercase tracking-wider" style="color: #94a3b8;">Tiada rekod permohonan</p>
      </div>

      <div v-else class="divide-y" style="border-color: #F8FAFC;">
        <div v-for="rekod in sejarahBantuan" :key="rekod.id"
          class="flex items-start gap-3 px-4 py-4">
          <!-- status icon -->
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            :style="rekod.status_permohonan === 'LULUS'
              ? 'background: rgba(82,183,136,0.1);'
              : rekod.status_permohonan === 'DITOLAK'
                ? 'background: rgba(239,68,68,0.1);'
                : 'background: rgba(245,158,11,0.1);'">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              :style="rekod.status_permohonan === 'LULUS' ? 'color: #2D6A4F;' : rekod.status_permohonan === 'DITOLAK' ? 'color: #dc2626;' : 'color: #92400e;'">
              <path stroke-linecap="round" stroke-linejoin="round" v-if="rekod.status_permohonan === 'LULUS'" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" v-else d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <!-- info -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-black uppercase leading-tight" style="color: #0F172A;">{{ rekod.jenis_bantuan }}</p>
            <p class="text-[10px] font-medium mt-0.5 leading-snug" style="color: #64748B;">{{ rekod.keterangan }}</p>
            <p class="text-[9px] font-mono mt-1" style="color: #94a3b8;">Dimohon: {{ formatTarikh(rekod.tarikh_mohon) }}</p>
            <div v-if="rekod.dokumen_sokongan && rekod.dokumen_sokongan.length > 0" class="mt-1.5 flex flex-wrap gap-1">
              <a v-for="doc in rekod.dokumen_sokongan" :key="doc"
                :href="`${uploadBase}/uploads/bantuan/${doc}`"
                target="_blank"
                class="text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1"
                style="background: rgba(82,183,136,0.1); color: #1B4332; border: 1px solid rgba(82,183,136,0.2);">
                📎 Dokumen
              </a>
            </div>
          </div>
          <!-- status + amount -->
          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              :style="rekod.status_permohonan === 'LULUS'
                ? 'background: rgba(82,183,136,0.1); color: #2D6A4F;'
                : rekod.status_permohonan === 'DITOLAK'
                  ? 'background: rgba(239,68,68,0.1); color: #dc2626;'
                  : 'background: rgba(245,158,11,0.1); color: #92400e;'">
              {{ rekod.status_permohonan || 'Menunggu' }}
            </span>
            <span v-if="rekod.status_permohonan === 'LULUS' && rekod.amaun_lulus"
              class="text-[12px] font-black tabular-nums" style="color: #1B4332;">
              RM {{ parseFloat(rekod.amaun_lulus).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- POPUP INFO BANTUAN -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showInfoBantuan"
          class="fixed inset-0 z-9999 flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(6px);"
          @click.self="showInfoBantuan = false">
          <div class="bg-white w-full max-w-md max-h-[88vh] overflow-y-auto"
            style="border-radius: 28px 28px 0 0; box-shadow: 0 -12px 48px rgba(0,0,0,0.18);">

            <!-- Handle bar -->
            <div class="flex justify-center pt-3 mb-1 shrink-0">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>

            <!-- Header -->
            <div class="px-5 pt-2 pb-4 flex items-center gap-3" style="border-bottom: 1px solid #F1F5F9;">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: #081C15;">
                <svg class="w-4.5 h-4.5" style="color: #52B788;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-[8px] font-black uppercase tracking-[0.2em]" style="color: #52B788;">Kelab PERHILITAN</p>
                <h3 class="text-[15px] font-black" style="color: #0F172A;">Senarai Bantuan Kebajikan</h3>
              </div>
              <button @click="showInfoBantuan = false" class="w-7 h-7 rounded-full flex items-center justify-center" style="background: #F1F5F9;">
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Senarai -->
            <div class="divide-y" style="border-color: #F8FAFC;">

              <!-- Khairat Kematian -->
              <div class="flex items-center justify-between px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(15,76,58,0.08);">
                    <svg class="w-4 h-4" style="color: #0F4C3A;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13px] font-black" style="color: #0F172A;">Khairat Kematian</p>
                    <p class="text-[9px] font-medium" style="color: #94a3b8;">Ahli atau waris yang meninggal dunia</p>
                  </div>
                </div>
                <span class="text-[13px] font-black tabular-nums shrink-0 ml-2" style="color: #1B4332;">RM1,000</span>
              </div>

              <!-- Kemalangan -->
              <div class="px-5 py-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(245,158,11,0.1);">
                    <svg class="w-4 h-4" style="color: #b45309;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <p class="text-[13px] font-black" style="color: #0F172A;">Kemalangan</p>
                </div>
                <div class="pl-11 space-y-2.5">
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-medium" style="color: #64748B;">Rawatan luar (tidak dimasukkan wad)</p>
                    <span class="text-[12px] font-black tabular-nums shrink-0 ml-3" style="color: #1B4332;">RM100</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-medium" style="color: #64748B;">Dimasukkan wad</p>
                    <span class="text-[12px] font-black tabular-nums shrink-0 ml-3" style="color: #1B4332;">RM100</span>
                  </div>
                </div>
              </div>

              <!-- Bencana -->
              <div class="px-5 py-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(59,130,246,0.1);">
                    <svg class="w-4 h-4" style="color: #1d4ed8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                    </svg>
                  </div>
                  <p class="text-[13px] font-black" style="color: #0F172A;">Bencana</p>
                </div>
                <div class="pl-11 space-y-2.5">
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-medium" style="color: #64748B;">Banjir</p>
                    <span class="text-[12px] font-black tabular-nums shrink-0 ml-3" style="color: #1B4332;">RM300</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-medium" style="color: #64748B;">Kebakaran</p>
                    <span class="text-[12px] font-black tabular-nums shrink-0 ml-3" style="color: #1B4332;">RM300</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-[11px] font-medium" style="color: #64748B;">Lain-lain bencana (nyatakan dalam permohonan)</p>
                    <span class="text-[10px] font-black shrink-0 ml-3" style="color: #92400e;">Pertimbangan JK</span>
                  </div>
                </div>
              </div>

              <!-- Kes Kritikal -->
              <div class="flex items-center justify-between px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(139,92,246,0.1);">
                    <svg class="w-4 h-4" style="color: #6d28d9;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13px] font-black" style="color: #0F172A;">Kes Kritikal / Luar Jangka</p>
                    <p class="text-[9px] font-medium" style="color: #94a3b8;">Nyatakan jenis permohonan dalam borang</p>
                  </div>
                </div>
                <span class="text-[10px] font-black shrink-0 ml-2" style="color: #92400e;">Pertimbangan JK</span>
              </div>

              <!-- Persaraan -->
              <div class="flex items-center justify-between px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(251,191,36,0.12);">
                    <svg class="w-4 h-4" style="color: #b45309;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13px] font-black" style="color: #0F172A;">Persaraan</p>
                    <p class="text-[9px] font-medium" style="color: #94a3b8;">Saguhati penghargaan kepada ahli yang bersara</p>
                  </div>
                </div>
                <span class="text-[13px] font-black tabular-nums shrink-0" style="color: #1B4332;">RM400</span>
              </div>

            </div>

            <!-- Footer nota + tutup -->
            <div class="px-5 py-4" style="border-top: 1px solid rgba(251,191,36,0.2); background: rgba(251,191,36,0.04);">
              <div class="flex items-start gap-2 mb-4">
                <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" style="color: #b45309;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-[10px] font-medium leading-relaxed" style="color: #92400e;">
                  Sumbangan ini <strong>hanya layak</strong> kepada ahli yang aktif dan telah menjelaskan yuran keahlian Kelab PERHILITAN.
                </p>
              </div>
              <button @click="showInfoBantuan = false"
                class="w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider"
                style="background: #081C15; color: #95D5B2;">
                Faham, Tutup
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL PERMOHONAN -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showModal"
          class="fixed inset-0 z-9999 flex items-end justify-center"
          style="background: rgba(8,28,21,0.7); backdrop-filter: blur(8px);"
          @click.self="closeModal">
          <div class="bg-white w-full max-w-md max-h-[92vh] overflow-y-auto"
            style="border-radius: 28px 28px 0 0; box-shadow: 0 -12px 48px rgba(0,0,0,0.15);">
            <div class="flex justify-center pt-3 mb-4 shrink-0">
              <div class="w-10 h-1 rounded-full" style="background: #E2E8F0;"></div>
            </div>
            <div class="px-6">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style="color: #52B788;">Kebajikan Kelab</p>
              <h3 class="text-[17px] font-black mb-4" style="color: #0F172A;">Permohonan Baharu</h3>

              <form @submit.prevent="hantarPermohonan" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Kategori Sumbangan *</label>
                  <select v-model="form.jenis_bantuan" required
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;">
                    <option value="" disabled>— Pilih Kategori —</option>
                    <optgroup label="Khairat Kematian">
                      <option value="Khairat Kematian">Khairat Kematian — RM1,000</option>
                    </optgroup>
                    <optgroup label="Kemalangan">
                      <option value="Kemalangan - Rawatan Luar (Tanpa Wad)">Kemalangan: Rawatan Luar (Tanpa Wad) — RM100</option>
                      <option value="Kemalangan - Dimasukkan Wad">Kemalangan: Dimasukkan Wad — RM100</option>
                    </optgroup>
                    <optgroup label="Bencana">
                      <option value="Bencana Alam - Banjir">Bencana: Banjir — RM300</option>
                      <option value="Bencana Alam - Kebakaran">Bencana: Kebakaran — RM300</option>
                      <option value="Bencana Alam - Lain-lain">Bencana: Lain-lain (nyatakan dalam butiran)</option>
                    </optgroup>
                    <optgroup label="Lain-lain">
                      <option value="Kes Kritikal / Luar Jangka">Kes Kritikal / Luar Jangka (nyatakan jenis)</option>
                      <option value="Persaraan">Persaraan — RM400</option>
                    </optgroup>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Butiran & Tarikh Kejadian *</label>
                  <textarea v-model="form.keterangan" rows="3" required
                    placeholder="Sila berikan ulasan ringkas mengenai kronologi kejadian..."
                    class="w-full text-xs font-bold rounded-2xl px-4 py-3 outline-none resize-none transition-all"
                    style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"></textarea>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-wider" style="color: #64748B;">Dokumen Sokongan (PDF)</label>
                  <div class="relative w-full rounded-2xl p-4 text-center transition-colors"
                    style="border: 2px dashed #E2E8F0; background: #F8FAFC;">
                    <input type="file" accept="application/pdf" @change="handleFileUpload"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div class="flex flex-col items-center gap-1.5 pointer-events-none">
                      <svg class="w-6 h-6" style="color: #94a3b8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p class="text-[10px] font-bold" style="color: #64748B;">
                        {{ failTerpilih ? failTerpilih.name : 'Lampirkan surat pengesahan / sijil' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div v-if="formMessage.text" class="rounded-2xl p-3 text-[10px] font-bold leading-relaxed"
                  :class="formMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'">
                  {{ formMessage.text }}
                </div>

                <div class="flex gap-3 pb-6 pt-2">
                  <button type="button" @click="closeModal"
                    class="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98]"
                    style="background: #F1F5F9; color: #64748B;">
                    Batal
                  </button>
                  <button type="submit" :disabled="submitting"
                    class="flex-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                    style="background: #081C15; color: #95D5B2;">
                    <span v-if="submitting" class="w-3.5 h-3.5 rounded-full border-2 border-[#52B788] border-t-transparent animate-spin"></span>
                    {{ submitting ? 'Memproses...' : 'Hantar Permohonan' }}
                  </button>
                </div>
              </form>
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
const sejarahBantuan = ref([]);
const submitting = ref(false);
const loadingSejarah = ref(false);

const showInfoBantuan = ref(false);
const showModal = ref(false);
const form = ref({ jenis_bantuan: '', keterangan: '' });
const failTerpilih = ref(null);
const formMessage = ref({ type: '', text: '' });

// FIX: Guna is_paid sahaja — konsisten dengan UtamaView dan dikira oleh backend
const isAhliAktif = computed(() => !!profil.value.is_paid);

const fetchProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data;
  } catch (e) { console.error(e); }
};

const fetchSejarahBantuan = async () => {
  loadingSejarah.value = true;
  try {
    const res = await api.get('/bantuan/sejarah');
    sejarahBantuan.value = res.data.data || [];
  } catch (e) { 
    console.error(e); 
  } finally {
    loadingSejarah.value = false;
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    failTerpilih.value = file;
  } else {
    alert("Hanya fail berformat PDF (.pdf) sahaja dibenarkan.");
    e.target.value = '';
    failTerpilih.value = null;
  }
};

const formatTarikh = (t) => {
  if (!t) return '-';
  return new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
};

const closeModal = () => {
  showModal.value = false;
  form.value = { jenis_bantuan: '', keterangan: '' };
  failTerpilih.value = null;
  formMessage.value = { type: '', text: '' };
};

const hantarPermohonan = async () => {
  formMessage.value = { type: '', text: '' };
  submitting.value = true;

  try {
    const uploadData = new FormData();
    uploadData.append('jenis_bantuan', form.value.jenis_bantuan);
    uploadData.append('keterangan', form.value.keterangan);
    if (failTerpilih.value) {
      uploadData.append('dokumen', failTerpilih.value);
    }

    // Call API untuk simpan data bantuan
    await api.post('/bantuan/mohon', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Alert dipapar untuk beri feedback pantas kemudian tutup modal
    alert('Permohonan kebajikan anda berjaya dihantar ke sistem untuk semakan urusetia.');
    closeModal();
    fetchSejarahBantuan();

  } catch (error) {
    formMessage.value = { 
      type: 'error', 
      text: error.response?.data?.message || 'Ralat semasa memproses penyerahan borang. Sila cuba lagi.' 
    };
  } finally { 
    submitting.value = false; 
  }
};

onMounted(() => {
  fetchProfil();
  fetchSejarahBantuan();
});
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.sheet-enter-active { transition: all 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div { transform: translateY(100%); }
.sheet-leave-to > div { transform: translateY(100%); }
</style>