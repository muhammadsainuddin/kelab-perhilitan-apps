<template>
  <div class="font-sans min-h-screen selection:bg-[#52B788]/30">
  <main>

    <!-- ═══════════════════════════════════
         MOBILE — Green gradient top + card
         ═══════════════════════════════════ -->
    <div class="md:hidden min-h-screen flex flex-col" style="background: #EEF2EE;">

      <!-- ── Latar hijau gelap (30% atas) ── -->
      <div class="relative overflow-hidden" style="padding-bottom: 72px; background: linear-gradient(145deg, #081C15 0%, #0D3526 45%, #1B4332 100%);">

        <!-- Corak titik grid -->
        <div class="absolute inset-0 pointer-events-none"
          style="background-image: radial-gradient(rgba(135,188,181,0.07) 1px, transparent 1px); background-size: 22px 22px;"></div>

        <!-- Cahaya atas kanan -->
        <div class="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 65%);"></div>

        <!-- Cahaya bawah kiri -->
        <div class="absolute bottom-0 -left-10 w-40 h-40 rounded-full pointer-events-none"
          style="background: radial-gradient(circle, rgba(27,67,50,0.7) 0%, transparent 65%);"></div>

        <!-- Garisan emas atas -->
        <div class="absolute top-0 left-0 right-0" style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 55%, #95D5B2 80%, transparent);"></div>

        <!-- Butang balik -->
        <button @click="router.push('/')"
          aria-label="Kembali ke halaman utama"
          class="relative z-10 mt-12 ml-5 w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-95"
          style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #95D5B2;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Logo + brand -->
        <div class="relative z-10 flex items-center gap-3.5 mt-5 pb-2 px-6">
          <!-- Logo terus pada gradient, bucu curve -->
          <img src="/logo.png" alt="Logo Kelab PERHILITAN"
            class="w-14 h-14 rounded-2xl object-contain shrink-0"
            style="box-shadow: 0 4px 20px rgba(0,0,0,0.35);" />
          <!-- Teks brand -->
          <div>
            <h1 class="font-hago text-white text-[20px] tracking-widest leading-tight">Kelab PERHILITAN</h1>
            <p class="text-[9px] font-black uppercase tracking-[0.22em] mt-1"
              style="color: #95D5B2;">Sistem Pengurusan Ahli</p>
          </div>
        </div>
      </div>

      <!-- ── Card (overlap masuk ke latar hijau) ── -->
      <div class="px-4 flex-1 pb-8" style="margin-top: -60px; position: relative; z-index: 10;">
        <div class="bg-white rounded-[28px] p-6 space-y-4"
          style="box-shadow: 0 8px 40px rgba(8,28,21,0.22), 0 2px 10px rgba(0,0,0,0.06);">

          <!-- Tajuk -->
          <div class="pt-1 pb-0.5">
            <h2 class="text-[21px] font-black" style="color: #0F172A;">Selamat Datang</h2>
            <p class="text-[11px] font-medium mt-0.5" style="color: #94A3B8;">Log masuk untuk meneruskan ke sistem</p>
          </div>

          <!-- Log masuk cap jari (hanya native + biometrik aktif + token ada) -->
          <div v-if="bolehBiometrik" class="space-y-3.5">
            <button @click="loginBiometrik" :disabled="isLoading"
              class="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
              style="background: linear-gradient(135deg, #0D3526 0%, #1B4332 100%); border: 1px solid rgba(82,183,136,0.25); box-shadow: 0 4px 16px rgba(13,53,38,0.3);">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="color: #95D5B2;">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
              </svg>
              <span class="text-[12px] font-black uppercase tracking-widest text-white">Log Masuk Cap Jari</span>
            </button>
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px" style="background: #E8EEF4;"></div>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: #94A3B8;">atau kata laluan</span>
              <div class="flex-1 h-px" style="background: #E8EEF4;"></div>
            </div>
          </div>

          <!-- Notis sesi tamat -->
          <div v-if="sesiTamat"
            class="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold"
            style="background: #fffbeb; border: 1px solid #fde68a; color: #92400e;">
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Sesi anda telah tamat. Sila log masuk semula.
          </div>

          <!-- E-mel -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">E-mel Kakitangan</label>
            <input v-model="email" type="email" placeholder="email@perhilitan.gov.my" required
              @keyup.enter="handleLogin"
              class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
              style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
              @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
              @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
          </div>

          <!-- Kata laluan -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-0.5" style="color: #64748B;">Kata Laluan</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required
                @keyup.enter="handleLogin"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 pr-12 outline-none transition-all"
                style="background: #F1F5F9; border: 1.5px solid #E8EEF4; color: #0F172A;"
                @focus="e => { e.target.style.borderColor='#0F4C3A'; e.target.style.background='white'; }"
                @blur="e => { e.target.style.borderColor='#E8EEF4'; e.target.style.background='#F1F5F9'; }" />
              <button type="button" @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Sembunyikan kata laluan' : 'Tunjukkan kata laluan'"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center" style="color: #64748B;">
                <svg v-if="!showPassword" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Ingat saya + Lupa kata laluan -->
          <div class="flex justify-between items-center">
            <label class="flex items-center gap-2 text-[11px] font-semibold cursor-pointer select-none" style="color: #64748B;">
              <input type="checkbox" v-model="ingatSaya" class="w-3.5 h-3.5 rounded cursor-pointer accent-[#0F4C3A]">
              Ingat Saya
            </label>
            <button type="button" @click="router.push('/forgot-password')"
              class="text-[11px] font-bold" style="color: #0F4C3A;">
              Lupa Kata Laluan?
            </button>
          </div>

          <!-- Ralat / berjaya -->
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
              <svg class="animate-spin w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ successMessage }}
            </div>
          </transition>

          <!-- Butang log masuk -->
          <button @click="handleLogin" :disabled="isLoading"
            class="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style="background: #08151D; color: #87BCB5; box-shadow: 0 4px 16px rgba(8,21,29,0.3);">
            <span v-if="!isLoading">Log Masuk</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Mengesahkan...
            </span>
          </button>

        </div>

        <!-- Daftar (luar card) -->
        <div class="mt-4 text-center">
          <p class="text-[11px] font-medium mb-3" style="color: #6B7280;">Kakitangan baru dan belum mendaftar?</p>
          <button @click="router.push('/register')"
            class="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-[0.98] bg-white"
            style="color: #08151D; border: 1.5px solid #D1D5DB; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
            Daftar Akaun Ahli
          </button>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════
         DESKTOP — Split panel (light mode)
         ═══════════════════════════════════ -->
    <div class="hidden md:flex min-h-screen">

      <!-- Kiri: Brand panel -->
      <div class="w-1/2 flex flex-col justify-between p-12 relative overflow-hidden"
        style="background: linear-gradient(145deg, #0F4C3A 0%, #082819 100%);">

        <div class="absolute inset-0 pointer-events-none" style="opacity: 0.04;">
          <div class="absolute -top-20 -left-20 w-100 h-100 rounded-full border-60 border-white"></div>
          <div class="absolute -bottom-25 -right-15 w-87.5 h-87.5 rounded-full border-50 border-white"></div>
          <div class="absolute top-1/2 left-1/3 w-50 h-50 rounded-full border-30 border-white"></div>
        </div>

        <div class="relative z-10 flex items-center gap-4">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-lg">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.22em]" style="color: #95D5B2;">Kelab Sukan & Kebajikan</p>
            <span class="font-hago text-xl tracking-wide text-white leading-tight">Kelab PERHILITAN</span>
          </div>
        </div>

        <div class="relative z-10 flex-1 flex flex-col justify-center">
          <p class="text-[10px] font-black uppercase tracking-[0.25em] mb-5" style="color: #D4AF37;">Portal Rasmi Ahli</p>
          <h2 class="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Sistem<br>
            <span style="color: #95D5B2;">Pengurusan</span><br>
            Bersepadu Ahli
          </h2>
          <p class="text-sm leading-relaxed max-w-sm" style="color: rgba(208,215,215,0.9);">
            Akses penuh kepada yuran, bantuan kebajikan, aktiviti sukan, dan kedai kelab dalam satu platform berpusat yang moden.
          </p>
        </div>

        <div class="relative z-10 space-y-2.5">
          <div v-for="ciri in ciriSistem" :key="ciri.label" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style="background: rgba(82,183,136,0.15); border: 1px solid rgba(82,183,136,0.2);">
              <svg class="w-3 h-3" style="color: #52B788;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-xs font-medium" style="color: rgba(255,255,255,0.75);">{{ ciri.label }}</span>
          </div>
        </div>
      </div>

      <!-- Kanan: Form panel -->
      <div class="w-1/2 flex items-center justify-center p-12" style="background: #F8FAFC;">
        <div class="w-full max-w-md">

          <div class="mb-8">
            <h3 class="text-[28px] font-black mb-1.5" style="color: #0F172A;">Selamat Datang</h3>
            <p class="text-sm font-medium" style="color: #64748B;">Masukkan maklumat log masuk anda untuk meneruskan.</p>
          </div>

          <div v-if="sesiTamat"
            class="flex items-center gap-2 rounded-xl px-4 py-3 mb-6 text-xs font-semibold"
            style="background: #fffbeb; border: 1px solid #fde68a; color: #92400e;">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Sesi anda telah tamat. Sila log masuk semula.
          </div>

          <div class="bg-white rounded-3xl p-7 space-y-5" style="border: 1px solid #E2E8F0; box-shadow: 0 2px 16px rgba(15,23,42,0.06);">

            <div class="space-y-1.5">
              <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">E-mel Kakitangan</label>
              <input v-model="email" type="email" placeholder="email@perhilitan.gov.my"
                @keyup.enter="handleLogin"
                class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 outline-none transition-all"
                style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"
                @focus="e => e.target.style.borderColor='#0F4C3A'"
                @blur="e => e.target.style.borderColor='#E2E8F0'" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-black uppercase tracking-[0.18em]" style="color: #64748B;">Kata Laluan</label>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••" @keyup.enter="handleLogin"
                  class="w-full text-sm font-medium rounded-2xl px-4 py-3.5 pr-12 outline-none transition-all"
                  style="background: #F8FAFC; border: 1.5px solid #E2E8F0; color: #0F172A;"
                  @focus="e => e.target.style.borderColor='#0F4C3A'"
                  @blur="e => e.target.style.borderColor='#E2E8F0'" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style="color: #94A3B8;">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <label class="flex items-center gap-2 text-[11px] font-semibold cursor-pointer select-none" style="color: #64748B;">
                <input type="checkbox" v-model="ingatSaya" class="w-3.5 h-3.5 rounded accent-[#0F4C3A] cursor-pointer">
                Ingat Saya
              </label>
              <button @click="router.push('/forgot-password')"
                class="text-[11px] font-bold transition-colors" style="color: #0F4C3A;">
                Lupa kata laluan?
              </button>
            </div>

            <transition name="slide-down">
              <div v-if="errorMessage"
                class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold"
                style="background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                {{ errorMessage }}
              </div>
              <div v-else-if="successMessage"
                class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold"
                style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D;">
                <svg class="animate-spin w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ successMessage }}
              </div>
            </transition>

            <button @click="handleLogin" :disabled="isLoading"
              class="w-full py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #08151D; color: #87BCB5;">
              <span v-if="!isLoading">Log Masuk Sistem</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Mengesahkan...
              </span>
            </button>

          </div>

          <p class="text-center text-xs font-medium mt-6" style="color: #94A3B8;">
            Kakitangan baru dan belum mendaftar?
            <button @click="router.push('/register')"
              class="font-black ml-1 hover:underline" style="color: #0F4C3A;">
              Daftar Akaun Ahli
            </button>
          </p>

        </div>
      </div>

    </div>
  </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { BiometricAuth, BiometryErrorType } from '@aparajita/capacitor-biometric-auth';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const router    = useRouter();
const route     = useRoute();
const authStore = useAuthStore();

const email          = ref('');
const password       = ref('');
const showPassword   = ref(false);
const isLoading      = ref(false);
const errorMessage   = ref('');
const successMessage = ref('');
const ingatSaya      = ref(false);

const sesiTamat = computed(() => route.query.mesej === 'sesi-tamat');
const bolehBiometrik = ref(false);

onMounted(async () => {
  if (Capacitor.isNativePlatform() && authStore.biometrikAktif) {
    const refreshTokenAda = !!localStorage.getItem('biometric_refresh_token');
    if (refreshTokenAda) {
      try {
        const info = await BiometricAuth.checkBiometry();
        bolehBiometrik.value = info.isAvailable;
      } catch {}
    }
  }
});

const loginBiometrik = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await BiometricAuth.authenticate({
      reason: 'Sahkan identiti anda untuk log masuk ke Kelab PERHILITAN',
      cancelTitle: 'Batal',
    });
    // Cap jari berjaya — minta JWT baru dari server guna refresh token
    const refreshToken = localStorage.getItem('biometric_refresh_token');
    const response = await api.post('/auth/renew', { refreshToken });
    authStore.loginTerus(response.data.token, response.data.user);
    const destinasi = tentikanDestinasi(response.data.user.role);
    successMessage.value = 'Cap jari disahkan! Mengalih...';
    setTimeout(() => router.push(destinasi), 800);
  } catch (err) {
    if (err?.code !== undefined) {
      // BiometryError (cap jari gagal/batal)
      const cancelCodes = [BiometryErrorType.userCancel, BiometryErrorType.systemCancel, BiometryErrorType.appCancel];
      if (!cancelCodes.includes(err.code)) {
        errorMessage.value = 'Pengesahan cap jari gagal. Sila cuba lagi.';
      }
    } else if (err?.response?.status === 401) {
      // Refresh token luput — reset biometrik, paksa login biasa
      authStore.matikanBiometrik();
      bolehBiometrik.value = false;
      errorMessage.value = 'Sesi cap jari telah tamat. Sila log masuk dengan kata laluan.';
    } else {
      errorMessage.value = 'Gagal menghubungi pelayan. Sila cuba lagi.';
    }
  } finally {
    isLoading.value = false;
  }
};

const ciriSistem = [
  { label: 'Bayaran yuran pantas melalui FPX' },
  { label: 'Permohonan bantuan kebajikan ahli' },
  { label: 'Pendaftaran sukan & aktiviti kelab' },
  { label: 'Pembelian barangan kedai eksklusif' },
];

const tentikanDestinasi = (role) => {
  const isAdmin = role === 'Admin' || role === 'Super Admin';
  const isDesktop = window.innerWidth >= 768;
  return (isAdmin && isDesktop) ? '/admin' : '/dashboard';
};

const handleLogin = async () => {
  errorMessage.value   = '';
  successMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Sila isi e-mel dan kata laluan.';
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    authStore.login(response.data.token, response.data.user, ingatSaya.value, response.data.refreshToken);

    const destinasi = tentikanDestinasi(response.data.user?.role);

    successMessage.value = destinasi === '/admin'
      ? 'Selamat datang, Admin! Mengalih ke Panel Pentadbir...'
      : response.data.message || 'Berjaya log masuk!';

    setTimeout(() => router.push(destinasi), 1000);

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'E-mel atau kata laluan salah.';
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
</style>
