<template>
  <div class="font-sans min-h-screen flex flex-col md:flex-row selection:bg-[#52B788]/30">

    <!-- ════════════════════════════════════════
         BRAND PANEL — Desktop sahaja
         ════════════════════════════════════════ -->
    <AuthBrandPanel
      :eyebrow="mod === 'aktif' ? 'Pengaktifan Akaun' : 'Keahlian Baharu'"
      :description="mod === 'aktif'
        ? 'Aktifkan akaun keahlian anda untuk mengakses yuran, kebajikan, aktiviti, dan kedai kelab secara dalam talian.'
        : 'Daftar sebagai ahli Kelab PERHILITAN dan nikmati akses penuh kepada semua perkhidmatan kelab.'"
      :ciri-sistem="mod === 'aktif'
        ? ['Verifikasi melalui No. KP kakitangan sedia ada', 'Tetapkan e-mel & kata laluan sendiri', 'Akses penuh terus selepas pengaktifan', 'Data terlindung di bawah PDPA 2010']
        : ['Hantar permohonan untuk semakan pentadbir', 'Profil lengkap dengan maklumat penempatan', 'Notifikasi kelulusan melalui e-mel', 'Data terlindung di bawah PDPA 2010']">
      <template #heading>
        <span v-if="mod === 'aktif'">Aktifkan<br><span style="color: #95D5B2;">Keahlian</span><br>Anda</span>
        <span v-else>Sertai<br><span style="color: #95D5B2;">Kelab</span><br>PERHILITAN</span>
      </template>
    </AuthBrandPanel>

    <!-- ════════════════════════════════════════
         BAHAGIAN BORANG
         ════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col" style="background: #EEF2EE;">

      <!-- Header hijau — mobile sahaja -->
      <div class="md:hidden relative overflow-hidden shrink-0"
        style="padding-bottom: 88px; background: linear-gradient(145deg, #081C15 0%, #0D3526 45%, #1B4332 100%);">
        <!-- Corak titik -->
        <div class="absolute inset-0 pointer-events-none"
          style="background-image: radial-gradient(rgba(135,188,181,0.07) 1px, transparent 1px); background-size: 22px 22px;"></div>
        <!-- Cahaya atas kanan -->
        <div class="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 65%);"></div>
        <!-- Garisan emas -->
        <div class="absolute top-0 left-0 right-0"
          style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 55%, #95D5B2 80%, transparent);"></div>

        <!-- Butang balik -->
        <button @click="router.push('/login')" aria-label="Kembali ke log masuk"
          class="relative z-10 mt-12 ml-5 w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-95"
          style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #95D5B2;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Logo + nama brand -->
        <div class="relative z-10 flex items-center gap-3.5 mt-5 pb-2 px-6">
          <img src="/logo.png" alt="Logo Kelab PERHILITAN"
            class="w-14 h-14 rounded-2xl object-contain shrink-0"
            style="box-shadow: 0 4px 20px rgba(0,0,0,0.35);" />
          <div>
            <h1 class="font-hago text-white text-xl tracking-widest leading-tight">Kelab PERHILITAN</h1>
            <p class="text-[9px] font-black uppercase tracking-[0.22em] mt-1" style="color: #95D5B2;">Sistem Pengurusan Ahli</p>
          </div>
        </div>
      </div>

      <!-- Kawasan borang -->
      <div class="flex-1 flex flex-col items-center
                  -mt-18 md:mt-0 md:justify-center
                  px-4 pb-10 md:px-12 md:py-12 relative z-10">
        <div class="w-full max-w-105 md:max-w-lg">

          <!-- Heading desktop (atas kad) -->
          <div class="hidden md:block mb-6">
            <button @click="router.push('/login')"
              class="flex items-center gap-1.5 text-[11px] font-bold mb-5 transition-opacity hover:opacity-60"
              style="color: #64748B;">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
              </svg>
              Kembali Log Masuk
            </button>
            <!-- Tab switcher desktop -->
            <div class="flex gap-1 p-1 rounded-xl w-fit mb-5" style="background: #E8EDF0;">
              <button @click="tukarMod('aktif')"
                :class="['px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                         mod === 'aktif' ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700']"
                :style="mod === 'aktif' ? 'background: #08151D;' : ''">
                Kakitangan Sedia Ada
              </button>
              <button @click="tukarMod('baharu')"
                :class="['px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                         mod === 'baharu' ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700']"
                :style="mod === 'baharu' ? 'background: #0F4C3A;' : ''">
                Staff Baharu
              </button>
            </div>
            <h2 class="text-3xl font-black leading-tight mb-1.5" style="color: #0F172A;">
              {{ mod === 'aktif' ? 'Pengaktifan Akaun' : 'Permohonan Keahlian' }}
            </h2>
            <p class="text-[13px] font-medium" style="color: #64748B;">
              {{ mod === 'aktif' ? 'Sahkan No. KP anda untuk mengaktifkan profil keahlian.' : 'Daftar sebagai ahli baharu Kelab PERHILITAN.' }}
            </p>
          </div>

          <!-- ─── Kad Borang ─── -->
          <div class="bg-white rounded-[28px] p-6 md:p-8 space-y-4"
            style="box-shadow: 0 8px 40px rgba(8,28,21,0.16), 0 1px 6px rgba(0,0,0,0.04);">

            <!-- Tab switcher mobile (dalam kad) -->
            <div class="md:hidden flex gap-1.5 p-1 rounded-2xl" style="background: #F1F5F9;">
              <button @click="tukarMod('aktif')"
                :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                         mod === 'aktif' ? 'text-white shadow-sm' : 'text-slate-500']"
                :style="mod === 'aktif' ? 'background: #08151D;' : ''">
                Kakitangan Sedia Ada
              </button>
              <button @click="tukarMod('baharu')"
                :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                         mod === 'baharu' ? 'text-white shadow-sm' : 'text-slate-500']"
                :style="mod === 'baharu' ? 'background: #0F4C3A;' : ''">
                Staff Baharu
              </button>
            </div>

            <!-- Heading mobile (dalam kad) -->
            <div class="md:hidden pt-0.5 pb-1">
              <h2 class="text-[21px] font-black" style="color: #0F172A;">
                {{ mod === 'aktif' ? 'Pengaktifan Akaun' : 'Permohonan Keahlian' }}
              </h2>
              <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
                {{ mod === 'aktif' ? 'Sahkan No. KP anda untuk mengaktifkan keahlian' : 'Daftar sebagai ahli baharu Kelab PERHILITAN' }}
              </p>
            </div>

            <!-- Notis ralat / berjaya -->
            <transition name="slide-down">
              <div v-if="errorMessage"
                class="flex items-center gap-2 rounded-xl px-3.5 py-3 text-[11px] font-semibold"
                style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                {{ errorMessage }}
              </div>
              <div v-else-if="successMessage"
                class="flex items-center gap-2 rounded-xl px-3.5 py-3 text-[11px] font-semibold"
                style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D;">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ successMessage }}
              </div>
            </transition>

            <!-- ══════════════════════════════════════
                 MOD: KAKITANGAN SEDIA ADA
                 ══════════════════════════════════════ -->
            <template v-if="mod === 'aktif'">
              <!-- No. KP -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  No. Kad Pengenalan
                </label>
                <input v-model="form.no_kp" type="text" placeholder="Tanpa sengkang (-)" required
                  class="input-field" />
              </div>

              <!-- No. Tel -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  No. Telefon
                </label>
                <input v-model="form.no_tel" type="text" placeholder="Contoh: 0123456789" required
                  class="input-field" />
              </div>

              <!-- E-mel -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  E-mel Kakitangan
                </label>
                <input v-model="form.email" type="email" placeholder="email@perhilitan.gov.my" required
                  class="input-field" />
              </div>

              <!-- Kata laluan + Sahkan -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Kata Laluan
                  </label>
                  <input v-model="form.password" type="password" placeholder="••••••••" required
                    class="input-field" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Sahkan
                  </label>
                  <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required
                    class="input-field"
                    :style="form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-color: #FECACA !important;' : ''" />
                </div>
              </div>
              <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
                class="text-[10px] font-bold -mt-1" style="color: #DC2626;">
                Kata laluan tidak sepadan.
              </p>

              <!-- Terma -->
              <label class="flex items-start gap-3 cursor-pointer select-none pt-1">
                <input v-model="form.acceptTerms" type="checkbox"
                  class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
                <span class="text-[10px] font-medium leading-relaxed" style="color: #475569;">
                  Saya telah membaca, memahami dan bersetuju dengan
                  <button type="button" @click.stop="showTerma = true"
                    class="font-black underline underline-offset-2" style="color: #0F4C3A;">Terma dan Syarat</button>
                  serta
                  <button type="button" @click.stop="showTerma = true"
                    class="font-black underline underline-offset-2" style="color: #0F4C3A;">Dasar Privasi</button>
                  Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
                </span>
              </label>

              <button @click="handleRegister" :disabled="isLoading || !form.acceptTerms"
                class="w-full py-3.75 rounded-2xl text-[12px] font-black uppercase tracking-widest
                       transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style="background: linear-gradient(135deg, #081C15 0%, #0F3D2E 100%);
                       color: #95D5B2;
                       box-shadow: 0 4px 20px rgba(8,21,29,0.28);">
                <span v-if="!isLoading">Aktifkan Akaun</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Menyemak Rekod...
                </span>
              </button>
            </template>

            <!-- ══════════════════════════════════════
                 MOD: STAFF BAHARU
                 ══════════════════════════════════════ -->
            <template v-else>
              <!-- Nama penuh -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  Nama Penuh <span style="color: #DC2626;">*</span>
                </label>
                <input v-model="formBaharu.nama_penuh" type="text"
                  placeholder="Nama seperti dalam kad pengenalan"
                  class="input-field" />
              </div>

              <!-- No. KP -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  No. Kad Pengenalan <span style="color: #DC2626;">*</span>
                </label>
                <input v-model="formBaharu.no_kp" type="text" placeholder="Tanpa sengkang (-)"
                  class="input-field" />
              </div>

              <!-- Gred + Tarikh Lapor Diri -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Gred <span style="color: #DC2626;">*</span>
                  </label>
                  <select v-model="formBaharu.gred" class="input-field">
                    <option value="" disabled>Pilih gred...</option>
                    <option v-for="g in senaraiGred" :key="g" :value="g">{{ g }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Tarikh Lapor Diri <span style="color: #DC2626;">*</span>
                  </label>
                  <input v-model="formBaharu.tarikh_lapor_diri" type="date"
                    class="input-field" />
                </div>
              </div>

              <!-- Tempat bertugas -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                  Tempat Bertugas <span style="color: #DC2626;">*</span>
                </label>
                <select v-model="formBaharu.penempatan_id" class="input-field">
                  <option value="" disabled>Pilih tempat bertugas...</option>
                  <option v-for="p in senaraiPenempatan" :key="p.id" :value="p.id">{{ p.nama_penempatan }}</option>
                </select>
              </div>

              <!-- Divider -->
              <div class="border-t" style="border-color: #F1F5F9;"></div>

              <!-- E-mel + No. Tel -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    E-mel <span style="color: #DC2626;">*</span>
                  </label>
                  <input v-model="formBaharu.emel" type="email" placeholder="email@..." required
                    class="input-field" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    No. Telefon
                  </label>
                  <input v-model="formBaharu.no_tel" type="text" placeholder="0123456789"
                    class="input-field" />
                </div>
              </div>

              <!-- Kata laluan + Sahkan -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Kata Laluan <span style="color: #DC2626;">*</span>
                  </label>
                  <input v-model="formBaharu.password" type="password" placeholder="Min. 8 aksara" required
                    class="input-field" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">
                    Sahkan <span style="color: #DC2626;">*</span>
                  </label>
                  <input v-model="formBaharu.sahkan_password" type="password" placeholder="Ulang kata laluan" required
                    class="input-field" />
                </div>
              </div>

              <!-- Notis kelulusan -->
              <div class="rounded-2xl px-4 py-3 text-[10px] font-medium leading-relaxed"
                style="background: #FFFBEB; border: 1px solid rgba(245,158,11,0.3); color: #92400E;">
                Selepas diluluskan oleh pentadbir, anda boleh terus log masuk menggunakan e-mel dan kata laluan yang didaftarkan.
              </div>

              <!-- Terma -->
              <label class="flex items-start gap-3 cursor-pointer select-none">
                <input v-model="termaDisetujui" type="checkbox"
                  class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
                <span class="text-[10px] font-medium leading-relaxed" style="color: #475569;">
                  Saya telah membaca, memahami dan bersetuju dengan
                  <button type="button" @click.stop="showTerma = true"
                    class="font-black underline underline-offset-2" style="color: #0F4C3A;">Terma dan Syarat</button>
                  serta
                  <button type="button" @click.stop="showTerma = true"
                    class="font-black underline underline-offset-2" style="color: #0F4C3A;">Dasar Privasi</button>
                  Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
                </span>
              </label>

              <button @click="handleDaftarBaharu" :disabled="isLoading || !!successMessage || !termaDisetujui"
                class="w-full py-3.75 rounded-2xl text-[12px] font-black uppercase tracking-widest
                       transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style="background: linear-gradient(135deg, #0F4C3A 0%, #1B5E46 100%);
                       color: #95D5B2;
                       box-shadow: 0 4px 20px rgba(15,76,58,0.28);">
                <span v-if="!isLoading">Hantar Permohonan</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Menghantar...
                </span>
              </button>
            </template>
          </div>

          <!-- Pautan Log Masuk -->
          <div class="mt-5 text-center">
            <p class="text-[11px] font-medium mb-3.5" style="color: #6B7280;">Sudah ada akaun?</p>
            <button @click="router.push('/login')"
              class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider
                     bg-white transition-all active:scale-[0.98]"
              style="color: #0F172A; border: 1.5px solid #DDE3E0; box-shadow: 0 1px 5px rgba(0,0,0,0.05);">
              Log Masuk
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════
         MODAL TERMA DAN SYARAT
         ════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTerma"
          class="fixed inset-0 z-9999 flex items-end md:items-center justify-center p-0 md:p-4"
          style="background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);"
          @click.self="showTerma = false">
          <div class="w-full md:max-w-2xl bg-white overflow-hidden flex flex-col"
            style="max-height: 92vh;
                   box-shadow: 0 25px 60px rgba(0,0,0,0.35);
                   border-radius: 24px 24px 0 0;">

            <!-- Header Modal -->
            <div class="shrink-0 flex items-center justify-between px-6 py-4"
              style="background: #0F4C3A; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div>
                <h2 class="font-bold text-white text-sm tracking-wide">Terma dan Syarat Keahlian</h2>
                <p class="text-[10px] mt-0.5" style="color: #95D5B2;">Kelab Sukan &amp; Kebajikan PERHILITAN</p>
              </div>
              <button @click="showTerma = false"
                class="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                style="background: rgba(255,255,255,0.12); color: #95D5B2;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Kandungan -->
            <div class="overflow-y-auto px-6 py-5 text-[12px] text-slate-700 leading-relaxed space-y-5"
              style="scrollbar-width: thin;">

              <p class="text-[10px] text-slate-400 font-medium">Kuat kuasa: 1 Januari 2025 &nbsp;|&nbsp; Versi 1.0</p>

              <p>Dengan mendaftar sebagai ahli Kelab Sukan dan Kebajikan PERHILITAN (<strong>"Kelab"</strong>), anda bersetuju untuk terikat dengan terma dan syarat berikut. Sila baca dengan teliti sebelum meneruskan pendaftaran.</p>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">1. Perlindungan Data Peribadi</p>
                <p class="mb-2">Kelab mengumpul dan memproses data peribadi anda selaras dengan <strong>Akta Perlindungan Data Peribadi 2010 (Akta 709)</strong>. Data yang dikumpul merangkumi nama, nombor kad pengenalan, jawatan, tempat bertugas, e-mel dan nombor telefon.</p>
                <p class="mb-2">Data anda digunakan semata-mata untuk tujuan:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Pengurusan keahlian dan rekod yuran</li>
                  <li>Komunikasi berkaitan aktiviti dan kebajikan Kelab</li>
                  <li>Penyediaan resit dan dokumen rasmi</li>
                  <li>Pematuhan keperluan audit dan pelaporan dalaman</li>
                </ul>
                <p class="mt-2">Data anda tidak akan dikongsi dengan pihak ketiga tanpa kebenaran bertulis anda, kecuali dikehendaki oleh undang-undang.</p>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">2. Kelayakan Keahlian</p>
                <p class="mb-2">Keahlian Kelab terbuka kepada semua kakitangan tetap Jabatan Perlindungan Hidupan Liar dan Taman Negara (PERHILITAN). Pemohon mesti:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Merupakan kakitangan awam Malaysia yang sedang berkhidmat</li>
                  <li>Mengisi borang pendaftaran dengan maklumat yang benar dan tepat</li>
                  <li>Mendapat kelulusan daripada pentadbir Kelab</li>
                </ul>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">3. Yuran Keahlian</p>
                <p class="mb-2">Ahli dikehendaki membayar yuran tahunan pada kadar yang ditetapkan oleh Jawatankuasa Kelab dari semasa ke semasa. Pembayaran boleh dilakukan melalui:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>FPX (Perbankan Dalam Talian)</strong> — melalui sistem ini</li>
                  <li><strong>Potongan Biro Angkasa</strong> — bagi ahli yang memilih kaedah ini</li>
                </ul>
                <p class="mt-2">Nombor ahli hanya akan dikeluarkan setelah yuran pertama berjaya dibayar. Yuran yang telah dibayar <strong>tidak boleh dikembalikan</strong> kecuali terdapat kesilapan teknikal yang disahkan oleh pentadbir.</p>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">4. Tanggungjawab Ahli</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Mengemaskini maklumat peribadi apabila berlaku perubahan (pertukaran tempat bertugas, nombor telefon, e-mel)</li>
                  <li>Menjaga kerahsiaan kata laluan akaun dan tidak berkongsi dengan pihak lain</li>
                  <li>Mematuhi Perlembagaan dan Peraturan Kelab yang berkuat kuasa</li>
                  <li>Menghormati ahli-ahli Kelab yang lain dalam semua interaksi</li>
                  <li>Melaporkan sebarang aktiviti yang mencurigakan atau penyalahgunaan sistem kepada pentadbir</li>
                </ul>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">5. Keselamatan Akaun</p>
                <p>Anda bertanggungjawab sepenuhnya ke atas semua aktiviti yang berlaku di bawah akaun anda. Kelab tidak akan bertanggungjawab ke atas sebarang kerugian atau kerosakan yang berpunca daripada kegagalan anda menjaga keselamatan kata laluan. Sekiranya anda mengesyaki akaun anda telah dicerobohi, sila hubungi pentadbir dengan segera.</p>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">6. Penamatan dan Pemberhentian Keahlian</p>
                <p class="mb-2">Keahlian boleh ditamatkan dalam keadaan berikut:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Permohonan penamatan secara bertulis oleh ahli kepada Kelab</li>
                  <li>Bersara, meletakkan jawatan atau berhenti berkhidmat dengan Kerajaan</li>
                  <li>Pelanggaran terma dan syarat keahlian</li>
                  <li>Keputusan Mesyuarat Agung Kelab</li>
                </ul>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">7. Hak Kelab</p>
                <p>Kelab berhak untuk mengubah suai terma dan syarat ini pada bila-bila masa. Sebarang perubahan akan dimaklumkan kepada ahli melalui sistem atau e-mel. Penggunaan berterusan sistem ini selepas pemberitahuan perubahan dianggap sebagai penerimaan terma yang dikemaskini.</p>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">8. Penafian Liabiliti</p>
                <p>Sistem ini disediakan atas dasar <em>"sebagaimana adanya"</em>. Kelab tidak memberi jaminan bahawa sistem ini bebas daripada gangguan teknikal. Kelab tidak bertanggungjawab ke atas sebarang kerugian tidak langsung yang timbul daripada penggunaan sistem ini.</p>
              </div>

              <div>
                <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">9. Undang-undang yang Terpakai</p>
                <p>Terma dan syarat ini ditadbir dan ditafsirkan mengikut undang-undang <strong>Malaysia</strong>, termasuk tetapi tidak terhad kepada:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Akta Perlindungan Data Peribadi 2010 (Akta 709)</li>
                  <li>Akta Pertubuhan 1966 (Akta 335)</li>
                  <li>Akta Komunikasi dan Multimedia 1998 (Akta 588)</li>
                </ul>
                <p class="mt-2">Sebarang pertikaian yang timbul hendaklah diselesaikan di bawah bidang kuasa mahkamah Malaysia.</p>
              </div>

              <div class="rounded-xl p-4 text-[11px]"
                style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #14532D;">
                <strong>Hubungi Kami:</strong> Sebarang pertanyaan berkenaan terma ini boleh dikemukakan kepada pentadbir Kelab PERHILITAN melalui e-mel <strong>kelabperhilitan@gmail.com</strong>.
              </div>
            </div>

            <!-- Footer Modal -->
            <div class="shrink-0 px-6 py-4 flex gap-3" style="border-top: 1px solid #F1F5F9;">
              <button @click="showTerma = false"
                class="flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all"
                style="background: #F1F5F9; color: #64748B;">
                Tutup
              </button>
              <button @click="termaDisetujui = true; showTerma = false"
                class="flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wide text-white transition-all active:scale-[0.98]"
                style="background: #0F4C3A;">
                Saya Faham &amp; Bersetuju
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import AuthBrandPanel from '../components/AuthBrandPanel.vue';

const router = useRouter();

// ── Mod: 'aktif' (kakitangan sedia ada) | 'baharu' (staff baharu) ──
const mod = ref('aktif');

// ── Borang Pengaktifan Akaun (kakitangan sedia ada) ──
const form = reactive({
  no_kp: '', no_tel: '', email: '',
  password: '', confirmPassword: '', acceptTerms: false
});

// ── Borang Staff Baharu ──
const formBaharu = reactive({
  nama_penuh: '', no_kp: '', gred: '', penempatan_id: '',
  tarikh_lapor_diri: '', emel: '', no_tel: '',
  password: '', sahkan_password: ''
});
const senaraiPenempatan = ref([]);
const senaraiGred = ref([]);

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showTerma = ref(false);
const termaDisetujui = ref(false);

onMounted(async () => {
  try {
    const [resPenempatan, resGred] = await Promise.all([
      api.get('/auth/penempatan'),
      api.get('/auth/senarai-gred'),
    ]);
    if (resPenempatan.data.success) senaraiPenempatan.value = resPenempatan.data.data;
    if (resGred.data.success) senaraiGred.value = resGred.data.data;
  } catch { /* senyap */ }
});

const tukarMod = (m) => {
  mod.value = m;
  errorMessage.value = '';
  successMessage.value = '';
  form.acceptTerms = false;
  termaDisetujui.value = false;
};

// ── Pengaktifan Akaun ──
const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Kata laluan dan pengesahan kata laluan tidak sepadan.';
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.post('/auth/register', {
      no_kp: form.no_kp, email: form.email,
      password: form.password, no_tel: form.no_tel
    });
    successMessage.value = response.data.message || 'Pendaftaran berjaya! Anda akan dibawa ke halaman Log Masuk...';
    setTimeout(() => router.push('/login'), 2500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Berlaku ralat pelayan. Sila cuba lagi.';
  } finally {
    isLoading.value = false;
  }
};

// ── Permohonan Staff Baharu ──
const handleDaftarBaharu = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (!formBaharu.nama_penuh || !formBaharu.no_kp || !formBaharu.gred || !formBaharu.penempatan_id || !formBaharu.tarikh_lapor_diri || !formBaharu.emel || !formBaharu.password) {
    errorMessage.value = 'Sila lengkapkan semua maklumat yang bertanda wajib.';
    return;
  }
  if (formBaharu.password.length < 8) {
    errorMessage.value = 'Kata laluan mestilah sekurang-kurangnya 8 aksara.';
    return;
  }
  if (formBaharu.password !== formBaharu.sahkan_password) {
    errorMessage.value = 'Kata laluan dan pengesahan tidak sepadan.';
    return;
  }
  if (!termaDisetujui.value) {
    errorMessage.value = 'Sila baca dan bersetuju dengan Terma dan Syarat sebelum menghantar permohonan.';
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.post('/auth/daftar-baru', {
      nama_penuh: formBaharu.nama_penuh,
      no_kp: formBaharu.no_kp,
      gred: formBaharu.gred,
      penempatan_id: formBaharu.penempatan_id,
      tarikh_lapor_diri: formBaharu.tarikh_lapor_diri,
      emel: formBaharu.emel,
      password: formBaharu.password,
      no_tel: formBaharu.no_tel || undefined,
    });
    successMessage.value = response.data.message;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Berlaku ralat pelayan. Sila cuba lagi.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }

/* Input field base — shared across all form fields */
.input-field {
  width: 100%;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 1rem;
  padding: 14px 16px;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  background: #F8FAFC;
  border: 1.5px solid #E2E8F0;
  color: #0F172A;
}
.input-field:focus {
  background: #ffffff;
  border-color: #0F4C3A;
  box-shadow: 0 0 0 3px rgba(15, 76, 58, 0.09);
}
.input-field option { color: #0F172A; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
