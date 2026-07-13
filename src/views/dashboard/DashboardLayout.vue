<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#87BCB5] selection:text-[#08151D] flex flex-col h-screen overflow-hidden relative">

    <!-- LOADING BAR (nipis di atas) -->
    <LoadingBar />

    <!-- ═══ LOADING OVERLAY (content area) ═══ -->
    <Transition name="loader">
      <div v-if="isLoading"
        class="fixed inset-0 z-40 flex flex-col items-center justify-center pb-20"
        style="background: rgba(248,250,252,0.82); backdrop-filter: blur(8px) saturate(1.3);">

        <!-- Spinner -->
        <div class="relative w-20 h-20 mb-5">
          <!-- Outer glow ring (static, blur) -->
          <div class="absolute inset-0 rounded-full"
            style="background: conic-gradient(#0F4C3A, #52B788 30%, #FBBF24 60%, #87BCB5 80%, #0F4C3A);
                   filter: blur(8px); opacity: 0.35; transform: scale(1.15);"></div>

          <!-- Spinning ring (conic-gradient + mask) -->
          <div class="spinner-ring absolute inset-0 rounded-full"></div>

          <!-- Inner white circle -->
          <div class="absolute rounded-full bg-white/90 shadow-sm"
            style="inset: 7px;"></div>

          <!-- Logo pulsing -->
          <img src="/logo.png" alt=""
            class="spinner-logo absolute w-8 h-8 object-contain"
            style="top: 50%; left: 50%; transform: translate(-50%, -50%);" />
        </div>

        <!-- Teks + dots -->
        <p class="text-[10px] font-black uppercase tracking-[0.22em] mb-3"
          style="color: #2D6A4F;">Memuatkan</p>
        <div class="flex items-center gap-2">
          <div class="loading-dot" style="--i:0"></div>
          <div class="loading-dot" style="--i:1"></div>
          <div class="loading-dot" style="--i:2"></div>
        </div>
      </div>
    </Transition>

    <!-- KANDUNGAN -->
    <main ref="mainEl"
      class="flex-1 overflow-y-auto px-5 pt-6 pb-32 custom-scrollbar relative z-10 w-full max-w-lg mx-auto">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- TAB BAR -->
    <UserTabbar />

  </div>

  <ToastNotifikasi />
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import UserTabbar from '../../components/UserTabbar.vue';
import LoadingBar  from '../../components/LoadingBar.vue';
import ToastNotifikasi from '../../components/ToastNotifikasi.vue';

const router    = useRouter();
const mainEl    = ref(null);
const isLoading = ref(false);

const MIN_MS = 420; // minimum tempoh loading ditunjukkan (ms)

let startTime  = 0;
let doneTimer  = null;
let isDashNav  = false;

const unBefore = router.beforeEach((to, from) => {
  // Hanya tunjuk loading bila navigasi dalam /dashboard
  isDashNav = to.path.startsWith('/dashboard') && from.path.startsWith('/dashboard')
              && to.path !== from.path;
  if (!isDashNav) return;

  clearTimeout(doneTimer);
  startTime = Date.now();
  isLoading.value = true;
});

const unAfter = router.afterEach(() => {
  if (!isDashNav) return;

  // Scroll ke atas pada main element
  if (mainEl.value) mainEl.value.scrollTop = 0;

  const elapsed   = Date.now() - startTime;
  const remaining = Math.max(0, MIN_MS - elapsed);
  doneTimer = setTimeout(() => { isLoading.value = false; }, remaining);
});

onBeforeUnmount(() => {
  unBefore();
  unAfter();
  clearTimeout(doneTimer);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 0px; }
.custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* ── Spinning ring (conic-gradient + mask trick) ── */
.spinner-ring {
  background: conic-gradient(
    from 0deg,
    #0F4C3A 0%,
    #52B788 25%,
    #FBBF24 55%,
    #87BCB5 80%,
    #0F4C3A 100%
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #fff 0);
          mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #fff 0);
  animation: spinRing 1.1s linear infinite;
}
@keyframes spinRing { to { transform: rotate(360deg); } }

/* ── Logo pulse ── */
.spinner-logo {
  animation: logoPulse 1.1s ease-in-out infinite;
}
@keyframes logoPulse {
  0%, 100% { opacity: 0.65; transform: translate(-50%, -50%) scale(0.88); }
  50%       { opacity: 1;    transform: translate(-50%, -50%) scale(1);    }
}

/* ── Dots ── */
.loading-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #52B788;
  animation: dotBounce 0.9s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.18s);
}
@keyframes dotBounce {
  0%, 100% { transform: translateY(0);   opacity: 0.3; }
  40%       { transform: translateY(-7px); opacity: 1;   }
}

/* ── Page transition ── */
.page-enter-active, .page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }

/* ── Loading overlay transition ── */
.loader-enter-active { transition: opacity 0.18s ease; }
.loader-leave-active { transition: opacity 0.3s ease 0.05s; }
.loader-enter-from, .loader-leave-to { opacity: 0; }
</style>
