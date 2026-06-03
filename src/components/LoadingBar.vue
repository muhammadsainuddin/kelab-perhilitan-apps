<template>
  <Teleport to="body">
    <div class="loading-wrap" :class="{ visible: visible, done: isDone }">
      <!-- Bar utama -->
      <div class="loading-bar" :style="{ width: barWidth + '%' }">
        <!-- Shimmer overlay -->
        <div class="shimmer"></div>
        <!-- Glowing orb di hujung bar -->
        <div class="orb"></div>
      </div>
      <!-- Latar blur tipis untuk glow bawah bar -->
      <div class="glow-shadow" :style="{ width: barWidth + '%' }"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router  = useRouter();
const visible = ref(false);
const isDone  = ref(false);
const barWidth = ref(0);

let timers = [];

const clear = () => { timers.forEach(clearTimeout); timers = []; };

const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

const start = () => {
  clear();
  isDone.value    = false;
  barWidth.value  = 0;
  visible.value   = true;
  // Fake progress — cepat di awal, perlahan di penghujung
  t(() => { barWidth.value = 28; }, 20);
  t(() => { barWidth.value = 50; }, 180);
  t(() => { barWidth.value = 68; }, 380);
  t(() => { barWidth.value = 82; }, 650);
  t(() => { barWidth.value = 90; }, 1100);
};

const done = () => {
  clear();
  barWidth.value = 100;
  isDone.value   = true;
  t(() => { visible.value = false; }, 500);
  t(() => { barWidth.value = 0; isDone.value = false; }, 800);
};

const unBefore = router.beforeEach(() => start());
const unAfter  = router.afterEach(()  => done());

onBeforeUnmount(() => { unBefore(); unAfter(); clear(); });
</script>

<style scoped>
.loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 99999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.loading-wrap.visible { opacity: 1; }
.loading-wrap.done    { opacity: 0; transition: opacity 0.45s ease 0.1s; }

/* ── Bar utama ── */
.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(
    90deg,
    #0F4C3A 0%,
    #52B788 25%,
    #FBBF24 55%,
    #87BCB5 80%,
    #52B788 100%
  );
  background-size: 250% 100%;
  animation: waveShift 2s linear infinite;
  transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

/* ── Shimmer bergerak atas bar ── */
.shimmer {
  position: absolute;
  inset: 0;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.55) 45%,
    rgba(255,255,255,0.75) 50%,
    rgba(255,255,255,0.55) 55%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmerMove 1.1s ease-in-out infinite;
}

/* ── Orb menyala di hujung ── */
.orb {
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FBBF24;
  box-shadow:
    0 0 6px 2px rgba(251,191,36,0.9),
    0 0 14px 4px rgba(251,191,36,0.5),
    0 0 24px 6px rgba(82,183,136,0.3);
  animation: orbPulse 0.9s ease-in-out infinite alternate;
}

/* ── Glow shadow bawah bar ── */
.glow-shadow {
  position: absolute;
  top: 3px;
  left: 0;
  height: 6px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(251,191,36,0.25) 60%,
    rgba(251,191,36,0.4) 100%
  );
  filter: blur(3px);
  transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

/* ── Animasi ── */
@keyframes waveShift {
  0%   { background-position: 250% 0; }
  100% { background-position: -250% 0; }
}

@keyframes shimmerMove {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes orbPulse {
  from { box-shadow: 0 0 6px 2px rgba(251,191,36,0.9), 0 0 14px 4px rgba(251,191,36,0.5), 0 0 24px 6px rgba(82,183,136,0.3); }
  to   { box-shadow: 0 0 8px 3px rgba(251,191,36,1),   0 0 20px 6px rgba(251,191,36,0.6), 0 0 32px 8px rgba(82,183,136,0.4); }
}
</style>
