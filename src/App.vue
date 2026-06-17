<template>
  <!-- Animated Splash Overlay -->
  <Transition name="splash-exit">
    <div v-if="showSplash" class="splash-overlay">

      <!-- Layer: dot grid -->
      <div class="splash-dots"></div>
      <!-- Layer: top-right glow -->
      <div class="splash-glow-tr"></div>
      <!-- Layer: bottom-left glow -->
      <div class="splash-glow-bl"></div>
      <!-- Layer: gold accent line top -->
      <div class="splash-line-top"></div>

      <!-- Logo -->
      <div class="splash-logo-wrap">
        <div class="splash-logo-ring"></div>
        <img src="/logo.png" alt="Logo" class="splash-logo" />
      </div>

      <!-- Text -->
      <div class="splash-text-wrap">
        <p class="splash-label">Digital Membership</p>
        <h1 class="splash-title">Kelab PERHILITAN</h1>
        <p class="splash-sub">Sukan &amp; Kebajikan Kakitangan</p>
      </div>

      <!-- Bottom accent line sweep -->
      <div class="splash-line-sweep"></div>

      <!-- Loading dots -->
      <div class="splash-dots-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  </Transition>

  <router-view />

  <!-- Toast: PWA dikemaskini -->
  <Transition name="toast-slide">
    <div v-if="showUpdateToast"
         class="pwa-update-toast"
         role="status"
         @click="showUpdateToast = false">
      <span class="pwa-update-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <div class="pwa-update-text">
        <span class="pwa-update-title">Aplikasi dikemaskini</span>
        <span class="pwa-update-sub">Versi terbaru telah dimuatkan</span>
      </div>
      <button class="pwa-update-close" @click.stop="showUpdateToast = false" aria-label="Tutup">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showUpdateToast = ref(false);
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

const router = useRouter();
const showSplash = ref(true);

// Halaman utama — bila di sini, back button minimize (bukan tutup app)
const HALAMAN_UTAMA = ['/', '/login', '/dashboard/utama', '/dashboard'];

let backButtonListener = null;

onMounted(async () => {
  if (sessionStorage.getItem('pwa_updated')) {
    sessionStorage.removeItem('pwa_updated');
    showUpdateToast.value = true;
    setTimeout(() => { showUpdateToast.value = false; }, 4000);
  }

  if (Capacitor.isNativePlatform()) {
    await SplashScreen.hide({ fadeOutDuration: 0 });

    backButtonListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
      const halamanSemasa = router.currentRoute.value.path;
      const diHalamanUtama = HALAMAN_UTAMA.some(h => halamanSemasa === h || halamanSemasa.startsWith('/dashboard/utama'));

      if (diHalamanUtama || !canGoBack) {
        // Minimize apps — jangan tutup terus
        CapApp.minimizeApp();
      } else {
        router.back();
      }
    });
  }

  setTimeout(() => {
    showSplash.value = false;
  }, 2800);
});

onUnmounted(() => {
  backButtonListener?.remove();
});
</script>

<style>
/* ── PWA Update Toast ── */
.pwa-update-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px 12px 14px;
  background: #1B4332;
  border: 1px solid rgba(82,183,136,0.3);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(82,183,136,0.08);
  min-width: 240px;
  max-width: calc(100vw - 40px);
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.pwa-update-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(82,183,136,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #52B788;
}

.pwa-update-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pwa-update-title {
  font-size: 13px;
  font-weight: 700;
  color: #D8F3DC;
  line-height: 1.3;
}

.pwa-update-sub {
  font-size: 11px;
  color: rgba(149,213,178,0.65);
  line-height: 1.3;
}

.pwa-update-close {
  flex-shrink: 0;
  color: rgba(149,213,178,0.5);
  padding: 2px;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 0;
}

.toast-slide-enter-active { transition: all 0.35s cubic-bezier(0.16,1,0.3,1); }
.toast-slide-leave-active  { transition: all 0.25s cubic-bezier(0.4,0,1,1); }
.toast-slide-enter-from    { opacity: 0; transform: translateX(-50%) translateY(16px); }
.toast-slide-leave-to      { opacity: 0; transform: translateX(-50%) translateY(8px); }

/* ── Splash overlay ── */
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #081C15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Dot grid */
.splash-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(135,188,181,0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  animation: dotsFadeIn 0.8s ease forwards;
  opacity: 0;
}

/* Top-right emerald glow */
.splash-glow-tr {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 65%);
  animation: glowPulse 2s ease-in-out infinite alternate;
}

/* Bottom-left glow */
.splash-glow-bl {
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(27,67,50,0.6) 0%, transparent 65%);
}

/* Top accent line */
.splash-line-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #52B788 25%, #D4AF37 50%, #95D5B2 75%, transparent);
  animation: lineReveal 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both;
  transform-origin: left;
  transform: scaleX(0);
}

/* Logo wrapper */
.splash-logo-wrap {
  position: relative;
  margin-bottom: 28px;
  animation: logoIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  opacity: 0;
}

/* Pulsing glow ring behind logo */
.splash-logo-ring {
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 70%);
  animation: ringPulse 1.8s ease-in-out 1.2s infinite alternate;
}

.splash-logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
  position: relative;
  filter: drop-shadow(0 8px 24px rgba(82,183,136,0.35));
}

/* Text */
.splash-text-wrap {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.splash-label {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: rgba(149,213,178,0.45);
  animation: textIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.75s both;
  opacity: 0;
}

.splash-title {
  font-size: 26px;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.15;
  animation: textIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.9s both;
  opacity: 0;
}

.splash-sub {
  font-size: 11px;
  font-weight: 500;
  color: rgba(135,188,181,0.5);
  letter-spacing: 0.06em;
  animation: textIn 0.6s cubic-bezier(0.22,1,0.36,1) 1.05s both;
  opacity: 0;
}

/* Bottom sweep line */
.splash-line-sweep {
  position: absolute;
  bottom: 90px;
  left: 40px;
  right: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(82,183,136,0.3), rgba(212,175,55,0.4), rgba(82,183,136,0.3), transparent);
  animation: lineReveal 0.8s cubic-bezier(0.22,1,0.36,1) 1.3s both;
  transform-origin: left;
  transform: scaleX(0);
}

/* Loading dots */
.splash-dots-loader {
  position: absolute;
  bottom: 52px;
  display: flex;
  gap: 7px;
  animation: textIn 0.4s ease 1.6s both;
  opacity: 0;
}

.splash-dots-loader span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(82,183,136,0.5);
}

.splash-dots-loader span:nth-child(1) { animation: dotBounce 0.8s ease-in-out 1.7s infinite; }
.splash-dots-loader span:nth-child(2) { animation: dotBounce 0.8s ease-in-out 1.85s infinite; }
.splash-dots-loader span:nth-child(3) { animation: dotBounce 0.8s ease-in-out 2.0s infinite; }

/* ── Keyframes ── */
@keyframes dotsFadeIn {
  to { opacity: 1; }
}

@keyframes glowPulse {
  from { opacity: 0.7; transform: scale(1); }
  to   { opacity: 1;   transform: scale(1.12); }
}

@keyframes lineReveal {
  to { transform: scaleX(1); opacity: 1; }
}

@keyframes logoIn {
  from { opacity: 0; transform: scale(0.55) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

@keyframes ringPulse {
  from { transform: scale(0.9); opacity: 0.6; }
  to   { transform: scale(1.2); opacity: 1; }
}

@keyframes textIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes dotBounce {
  0%, 100% { transform: translateY(0);    opacity: 0.4; }
  50%       { transform: translateY(-5px); opacity: 1; }
}

/* ── Exit transition ── */
.splash-exit-leave-active {
  transition: opacity 0.55s cubic-bezier(0.4, 0, 1, 1),
              transform 0.55s cubic-bezier(0.4, 0, 1, 1);
}
.splash-exit-leave-to {
  opacity: 0;
  transform: scale(1.04);
}
</style>
