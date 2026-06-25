<template>
  <div class="font-sans min-h-screen selection:bg-[#52B788]/30">
  <main>

    <!-- ═══════════════════════════════════
         MOBILE
         ═══════════════════════════════════ -->
    <div class="md:hidden min-h-screen flex flex-col" style="background: #EEF2EE;">

      <!-- Latar hijau gradient -->
      <div class="relative overflow-hidden" style="padding-bottom: 72px; background: linear-gradient(145deg, #081C15 0%, #0D3526 45%, #1B4332 100%);">
        <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(rgba(135,188,181,0.07) 1px, transparent 1px); background-size: 22px 22px;"></div>
        <div class="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 65%);"></div>
        <div class="absolute bottom-0 -left-10 w-40 h-40 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(27,67,50,0.7) 0%, transparent 65%);"></div>
        <div class="absolute top-0 left-0 right-0" style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 55%, #95D5B2 80%, transparent);"></div>

        <button @click="router.push('/login')"
          aria-label="Kembali ke log masuk"
          class="relative z-10 mt-12 ml-5 w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-95"
          style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #95D5B2;">
          <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="relative z-10 flex items-center gap-3.5 mt-5 pb-2 px-6">
          <img src="/logo.png" alt="Logo" class="w-14 h-14 rounded-2xl object-contain shrink-0"
            style="box-shadow: 0 4px 20px rgba(0,0,0,0.35);" />
          <div>
            <h1 class="font-hago text-white text-[20px] tracking-widest leading-tight">Kelab PERHILITAN</h1>
            <p class="text-[9px] font-black uppercase tracking-[0.22em] mt-1" style="color: #95D5B2;">Sistem Pengurusan Ahli</p>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div class="px-4 pb-10" style="margin-top: -60px; position: relative; z-index: 10;">
        <div class="bg-white rounded-[28px] p-6 space-y-4" style="box-shadow: 0 8px 40px rgba(8,28,21,0.22), 0 2px 10px rgba(0,0,0,0.06);">

          <!-- Tab Switcher -->
          <div class="flex gap-1.5 p-1 rounded-2xl" style="background: #F1F5F9;">
            <button @click="tukarMod('aktif')" :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all', mod === 'aktif' ? 'text-white shadow-sm' : 'text-slate-500']" :style="mod === 'aktif' ? 'background: #08151D;' : ''">
              Kakitangan Sedia Ada
            </button>
            <button @click="tukarMod('baharu')" :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all', mod === 'baharu' ? 'text-white shadow-sm' : 'text-slate-500']" :style="mod === 'baharu' ? 'background: #0F4C3A;' : ''">
              Staff Baharu
            </button>
          </div>

          <div class="pt-0.5">
            <h2 class="text-[21px] font-black" style="color: #0F172A;">{{ mod === 'aktif' ? 'Pengaktifan Akaun' : 'Permohonan Keahlian' }}</h2>
            <p class="text-[11px] font-medium mt-0.5" style="color: #64748B;">
              {{ mod === 'aktif' ? 'Sahkan No. KP anda untuk mengaktifkan keahlian' : 'Daftar sebagai ahli baharu Kelab PERHILITAN' }}
            </p>
          </div>

          <transition name="slide-down">
            <div v-if="errorMessage"
              class="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold"
              style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ errorMessage }}
            </div>
            <div v-else-if="successMessage"
              class="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold"
              style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D;">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              {{ successMessage }}
            </div>
          </transition>

          <!-- ══ MOD: KAKITANGAN SEDIA ADA ══ -->
          <template v-if="mod === 'aktif'">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Kad Pengenalan</label>
              <input v-model="form.no_kp" type="text" placeholder="Tanpa sengkang (-)" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Telefon</label>
              <input v-model="form.no_tel" type="text" placeholder="Contoh: 0123456789" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">E-mel Kakitangan</label>
              <input v-model="form.email" type="email" placeholder="email@perhilitan.gov.my" required
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">K. Laluan</label>
                <input v-model="form.password" type="password" placeholder="••••••••" required
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                  style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                  @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                  @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Sahkan</label>
                <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                  :style="`background: #F1F5F9; border: 1.5px solid ${form.confirmPassword && form.password !== form.confirmPassword ? '#FECACA' : '#E8EEF4'}; color: #0F172A;`"
                  @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                  @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
              </div>
            </div>
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
              class="text-[10px] font-bold -mt-2" style="color: #DC2626;">Kata laluan tidak sepadan.</p>
            <label class="flex items-start gap-3 cursor-pointer select-none pt-1">
              <input v-model="form.acceptTerms" type="checkbox" id="terms-m"
                class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
              <span class="text-[10px] font-medium leading-relaxed" style="color: #475569;">
                Saya telah membaca, memahami dan bersetuju dengan
                <button type="button" @click.stop="showTerma = true" class="font-black underline underline-offset-2" style="color: #0F4C3A;">Terma dan Syarat</button>
                serta
                <button type="button" @click.stop="showTerma = true" class="font-black underline underline-offset-2" style="color: #0F4C3A;">Dasar Privasi</button>
                Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
              </span>
            </label>
            <button @click="handleRegister" :disabled="isLoading || !form.acceptTerms"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
              <span v-if="!isLoading">Aktifkan Akaun</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Menyemak Rekod...
              </span>
            </button>
          </template>

          <!-- ══ MOD: STAFF BAHARU ══ -->
          <template v-else>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Nama Penuh <span style="color:#DC2626;">*</span></label>
              <input v-model="formBaharu.nama_penuh" type="text" placeholder="Nama seperti dalam kad pengenalan"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Kad Pengenalan <span style="color:#DC2626;">*</span></label>
              <input v-model="formBaharu.no_kp" type="text" placeholder="Tanpa sengkang (-)"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Gred <span style="color:#DC2626;">*</span></label>
                <select v-model="formBaharu.gred"
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                  style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;">
                  <option value="" disabled>Pilih gred...</option>
                  <option v-for="g in senaraiGred" :key="g" :value="g">{{ g }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Tarikh Lapor Diri <span style="color:#DC2626;">*</span></label>
                <input v-model="formBaharu.tarikh_lapor_diri" type="date"
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                  style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                  @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                  @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Tempat Bertugas <span style="color:#DC2626;">*</span></label>
              <select v-model="formBaharu.penempatan_id"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;">
                <option value="" disabled>Pilih tempat bertugas...</option>
                <option v-for="p in senaraiPenempatan" :key="p.id" :value="p.id">{{ p.nama_penempatan }}</option>
              </select>
            </div>
            <div class="pt-1" style="border-top: 1px solid #F1F5F9;">
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">E-mel <span style="color:#DC2626;">*</span></label>
                  <input v-model="formBaharu.emel" type="email" placeholder="email@..." required
                    class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                    style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                    @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                    @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">No. Telefon</label>
                  <input v-model="formBaharu.no_tel" type="text" placeholder="0123456789"
                    class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                    style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                    @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                    @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Kata Laluan <span style="color:#DC2626;">*</span></label>
                  <input v-model="formBaharu.password" type="password" placeholder="Min. 8 aksara" required
                    class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                    style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                    @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                    @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Sahkan Kata Laluan <span style="color:#DC2626;">*</span></label>
                  <input v-model="formBaharu.sahkan_password" type="password" placeholder="Ulang kata laluan" required
                    class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                    style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                    @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                    @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
                </div>
              </div>
            </div>
            <div class="rounded-2xl p-3.5 text-[10px] font-medium leading-relaxed" style="background: #FFFBEB; border: 1px solid rgba(245,158,11,0.3); color: #92400e;">
              Selepas diluluskan oleh pentadbir, anda boleh terus log masuk menggunakan e-mel dan kata laluan yang didaftarkan.
            </div>
            <!-- Checkbox Terma & Syarat (Mobile) -->
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input v-model="termaDisetujui" type="checkbox" class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
              <span class="text-[10px] font-medium leading-relaxed" style="color: #475569;">
                Saya telah membaca, memahami dan bersetuju dengan
                <button type="button" @click.stop="showTerma = true" class="font-black underline underline-offset-2" style="color: #0F4C3A;">Terma dan Syarat</button>
                serta
                <button type="button" @click.stop="showTerma = true" class="font-black underline underline-offset-2" style="color: #0F4C3A;">Dasar Privasi</button>
                Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
              </span>
            </label>
            <button @click="handleDaftarBaharu" :disabled="isLoading || !!successMessage || !termaDisetujui"
              class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #0F4C3A; color: #95D5B2; box-shadow: 0 4px 16px rgba(15,76,58,0.3);">
              <span v-if="!isLoading">Hantar Permohonan</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Menghantar...
              </span>
            </button>
          </template>

        </div>

        <div class="mt-4 text-center">
          <p class="text-[11px] font-medium mb-3" style="color: #6B7280;">Sudah ada akaun?</p>
          <button @click="router.push('/login')"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] bg-white"
            style="color: #08151D; border: 1.5px solid #D1D5DB; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            Log Masuk
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         DESKTOP
         ═══════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">
      <AuthBrandPanel
        eyebrow="Pengaktifan Akaun"
        description="Aktifkan akaun keahlian anda untuk mengakses yuran, kebajikan, aktiviti, dan kedai kelab secara dalam talian.">
        <template #heading>Aktifkan<br><span class="text-[#87BCB5]">Keahlian</span><br>Anda</template>
      </AuthBrandPanel>

      <div class="w-1/2 bg-white flex items-center justify-center p-12 overflow-y-auto">
        <div class="w-full max-w-md">
          <div class="mb-6">
            <button @click="router.push('/login')" class="text-gray-600 hover:text-[#0F4C3A] transition-colors mb-5 flex items-center gap-1 text-xs font-bold">
              <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali Log Masuk
            </button>
            <!-- Tab Switcher Desktop -->
            <div class="flex gap-1 p-1 rounded-xl mb-6 w-fit" style="background: #F1F5F9;">
              <button @click="tukarMod('aktif')" :class="['px-5 py-2 rounded-lg text-xs font-bold transition-all', mod === 'aktif' ? 'bg-[#08151D] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                Kakitangan Sedia Ada
              </button>
              <button @click="tukarMod('baharu')" :class="['px-5 py-2 rounded-lg text-xs font-bold transition-all', mod === 'baharu' ? 'bg-[#0F4C3A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                Staff Baharu PERHILITAN
              </button>
            </div>
            <h3 class="text-gray-900 text-3xl font-bold mb-1">{{ mod === 'aktif' ? 'Pengaktifan Akaun' : 'Permohonan Keahlian' }}</h3>
            <p class="text-gray-500 text-sm">{{ mod === 'aktif' ? 'Sahkan No. KP anda untuk mengaktifkan profil keahlian.' : 'Daftar sebagai ahli baharu Kelab PERHILITAN.' }}</p>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 p-3 text-xs rounded-xl shadow-sm mb-5">{{ errorMessage }}</div>
            <div v-else-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 p-3 text-xs rounded-xl shadow-sm mb-5">{{ successMessage }}</div>
          </transition>

          <!-- ══ MOD: KAKITANGAN SEDIA ADA ══ -->
          <form v-if="mod === 'aktif'" @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Kad Pengenalan</label>
              <input v-model="form.no_kp" type="text" required placeholder="Tanpa sengkang (-)"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Telefon</label>
                <input v-model="form.no_tel" type="text" required placeholder="0123456789"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">E-mel</label>
                <input v-model="form.email" type="email" required placeholder="email@perhilitan.gov.my"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Kata Laluan</label>
                <input v-model="form.password" type="password" required placeholder="••••••••"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Sahkan</label>
                <input v-model="form.confirmPassword" type="password" required placeholder="••••••••"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <label class="flex items-start gap-3 cursor-pointer select-none pt-1">
              <input v-model="form.acceptTerms" type="checkbox" id="terms-pc"
                class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
              <span class="text-xs text-gray-600 leading-relaxed">
                Saya telah membaca, memahami dan bersetuju dengan
                <button type="button" @click.stop="showTerma = true" class="text-[#0F4C3A] font-semibold underline underline-offset-2">Terma dan Syarat</button>
                serta
                <button type="button" @click.stop="showTerma = true" class="text-[#0F4C3A] font-semibold underline underline-offset-2">Dasar Privasi</button>
                Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
              </span>
            </label>
            <button type="submit" :disabled="isLoading || !form.acceptTerms"
              class="w-full bg-[#08151D] hover:bg-[#0F4C3A] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60">
              <span v-if="!isLoading">Aktifkan Akaun</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Menyemak Rekod...
              </span>
            </button>
          </form>

          <!-- ══ MOD: STAFF BAHARU ══ -->
          <form v-else @submit.prevent="handleDaftarBaharu" class="space-y-4">
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Nama Penuh <span class="text-red-500">*</span></label>
              <input v-model="formBaharu.nama_penuh" type="text" required placeholder="Nama seperti dalam kad pengenalan"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
            </div>
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Kad Pengenalan <span class="text-red-500">*</span></label>
              <input v-model="formBaharu.no_kp" type="text" required placeholder="Tanpa sengkang (-)"
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Gred <span class="text-red-500">*</span></label>
                <select v-model="formBaharu.gred" required
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all">
                  <option value="" disabled>Pilih gred...</option>
                  <option v-for="g in senaraiGred" :key="g" :value="g">{{ g }}</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Tarikh Lapor Diri <span class="text-red-500">*</span></label>
                <input v-model="formBaharu.tarikh_lapor_diri" type="date" required
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div>
              <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Tempat Bertugas <span class="text-red-500">*</span></label>
              <select v-model="formBaharu.penempatan_id" required
                class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all">
                <option value="" disabled>Pilih tempat bertugas...</option>
                <option v-for="p in senaraiPenempatan" :key="p.id" :value="p.id">{{ p.nama_penempatan }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">E-mel <span class="text-red-500">*</span></label>
                <input v-model="formBaharu.emel" type="email" required placeholder="email@..."
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">No. Telefon <span class="text-gray-400 font-normal normal-case">(pilihan)</span></label>
                <input v-model="formBaharu.no_tel" type="text" placeholder="0123456789"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Kata Laluan <span class="text-red-500">*</span></label>
                <input v-model="formBaharu.password" type="password" required placeholder="Min. 8 aksara"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
              <div>
                <label class="block text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Sahkan Kata Laluan <span class="text-red-500">*</span></label>
                <input v-model="formBaharu.sahkan_password" type="password" required placeholder="Ulang kata laluan"
                  class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 transition-all"/>
              </div>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Selepas diluluskan oleh pentadbir, anda boleh terus log masuk menggunakan e-mel dan kata laluan yang didaftarkan.
            </div>
            <!-- Checkbox Terma & Syarat (Desktop) -->
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input v-model="termaDisetujui" type="checkbox" class="mt-0.5 w-4 h-4 rounded accent-[#0F4C3A] shrink-0 cursor-pointer" />
              <span class="text-xs text-gray-600 leading-relaxed">
                Saya telah membaca, memahami dan bersetuju dengan
                <button type="button" @click.stop="showTerma = true" class="text-[#0F4C3A] font-semibold underline underline-offset-2">Terma dan Syarat</button>
                serta
                <button type="button" @click.stop="showTerma = true" class="text-[#0F4C3A] font-semibold underline underline-offset-2">Dasar Privasi</button>
                Kelab PERHILITAN, termasuk peruntukan di bawah <strong>Akta Perlindungan Data Peribadi 2010</strong>.
              </span>
            </label>
            <button type="submit" :disabled="isLoading || !!successMessage || !termaDisetujui"
              class="w-full bg-[#0F4C3A] hover:bg-[#155d47] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-60">
              <span v-if="!isLoading">Hantar Permohonan</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Menghantar...
              </span>
            </button>
          </form>

          <p class="text-center text-xs text-gray-500 font-medium mt-8 border-t border-gray-100 pt-6">
            Sudah ada akaun?
            <button @click="router.push('/login')" class="text-[#0F4C3A] font-bold hover:underline ml-1">Log Masuk</button>
          </p>
        </div>
      </div>
    </div>

  <!-- ═══════════════════════════════════════════════════════════
       MODAL TERMA DAN SYARAT
       ═══════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showTerma" class="fixed inset-0 z-9999 flex items-end md:items-center justify-center p-0 md:p-4"
        style="background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);"
        @click.self="showTerma = false">
        <div class="w-full md:max-w-2xl bg-white md:rounded-2xl overflow-hidden flex flex-col"
          style="max-height: 92vh; box-shadow: 0 25px 60px rgba(0,0,0,0.35); border-radius: 24px 24px 0 0;">

          <!-- Header -->
          <div class="shrink-0 flex items-center justify-between px-6 py-4" style="background: #0F4C3A; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div>
              <h2 class="font-bold text-white text-sm tracking-wide">Terma dan Syarat Keahlian</h2>
              <p class="text-[10px] mt-0.5" style="color: #95D5B2;">Kelab Sukan &amp; Kebajikan PERHILITAN</p>
            </div>
            <button @click="showTerma = false" class="w-8 h-8 flex items-center justify-center rounded-full transition-all" style="background: rgba(255,255,255,0.12); color: #95D5B2;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Kandungan T&S -->
          <div class="overflow-y-auto px-6 py-5 text-[12px] text-slate-700 leading-relaxed space-y-5" style="scrollbar-width: thin;">

            <p class="text-[10px] text-slate-400 font-medium">Kuat kuasa: 1 Januari 2025 &nbsp;|&nbsp; Versi 1.0</p>

            <p>Dengan mendaftar sebagai ahli Kelab Sukan dan Kebajikan PERHILITAN (<strong>"Kelab"</strong>), anda bersetuju untuk terikat dengan terma dan syarat berikut. Sila baca dengan teliti sebelum meneruskan pendaftaran.</p>

            <!-- 1 -->
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

            <!-- 2 -->
            <div>
              <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">2. Kelayakan Keahlian</p>
              <p class="mb-2">Keahlian Kelab terbuka kepada semua kakitangan tetap Jabatan Perlindungan Hidupan Liar dan Taman Negara (PERHILITAN). Pemohon mesti:</p>
              <ul class="list-disc pl-5 space-y-1 text-slate-600">
                <li>Merupakan kakitangan awam Malaysia yang sedang berkhidmat</li>
                <li>Mengisi borang pendaftaran dengan maklumat yang benar dan tepat</li>
                <li>Mendapat kelulusan daripada pentadbir Kelab</li>
              </ul>
            </div>

            <!-- 3 -->
            <div>
              <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">3. Yuran Keahlian</p>
              <p class="mb-2">Ahli dikehendaki membayar yuran tahunan pada kadar yang ditetapkan oleh Jawatankuasa Kelab dari semasa ke semasa. Pembayaran boleh dilakukan melalui:</p>
              <ul class="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>FPX (Perbankan Dalam Talian)</strong> — melalui sistem ini</li>
                <li><strong>Potongan Biro Angkasa</strong> — bagi ahli yang memilih kaedah ini</li>
              </ul>
              <p class="mt-2">Nombor ahli hanya akan dikeluarkan setelah yuran pertama berjaya dibayar. Yuran yang telah dibayar <strong>tidak boleh dikembalikan</strong> kecuali terdapat kesilapan teknikal yang disahkan oleh pentadbir.</p>
            </div>

            <!-- 4 -->
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

            <!-- 5 -->
            <div>
              <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">5. Keselamatan Akaun</p>
              <p>Anda bertanggungjawab sepenuhnya ke atas semua aktiviti yang berlaku di bawah akaun anda. Kelab tidak akan bertanggungjawab ke atas sebarang kerugian atau kerosakan yang berpunca daripada kegagalan anda menjaga keselamatan kata laluan. Sekiranya anda mengesyaki akaun anda telah dicerobohi, sila hubungi pentadbir dengan segera.</p>
            </div>

            <!-- 6 -->
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

            <!-- 7 -->
            <div>
              <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">7. Hak Kelab</p>
              <p>Kelab berhak untuk mengubah suai terma dan syarat ini pada bila-bila masa. Sebarang perubahan akan dimaklumkan kepada ahli melalui sistem atau e-mel. Penggunaan berterusan sistem ini selepas pemberitahuan perubahan dianggap sebagai penerimaan terma yang dikemaskini.</p>
            </div>

            <!-- 8 -->
            <div>
              <p class="font-bold text-[#0F4C3A] text-[11px] uppercase tracking-wide mb-1.5">8. Penafian Liabiliti</p>
              <p>Sistem ini disediakan atas dasar <em>"sebagaimana adanya"</em>. Kelab tidak memberi jaminan bahawa sistem ini bebas daripada gangguan teknikal. Kelab tidak bertanggungjawab ke atas sebarang kerugian tidak langsung yang timbul daripada penggunaan sistem ini.</p>
            </div>

            <!-- 9 -->
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

            <div class="rounded-xl p-4 text-[11px]" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d;">
              <strong>Hubungi Kami:</strong> Sebarang pertanyaan berkenaan terma ini boleh dikemukakan kepada pentadbir Kelab PERHILITAN melalui e-mel <strong>kelabperhilitan@gmail.com</strong>.
            </div>

          </div>

          <!-- Footer Modal -->
          <div class="shrink-0 px-6 py-4 flex gap-3" style="border-top: 1px solid #F1F5F9;">
            <button @click="showTerma = false"
              class="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
              style="background: #F1F5F9; color: #64748B;">
              Tutup
            </button>
            <button @click="termaDisetujui = true; showTerma = false"
              class="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide text-white transition-all active:scale-[0.98]"
              style="background: #0F4C3A;">
              Saya Faham &amp; Bersetuju
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  </main>
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
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
