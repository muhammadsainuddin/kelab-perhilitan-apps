<template>
  <div class="font-sans min-h-screen selection:bg-[#87BCB5] selection:text-[#08151D]">

    <!-- Mobile -->
    <div class="md:hidden min-h-screen bg-[#D0D7D7] relative flex flex-col h-screen overflow-hidden select-none">

      <div class="absolute top-0 left-0 w-full h-[62%] bg-[#08151D] rounded-br-[80px] z-0 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-72 h-72 bg-[#0E303D] rounded-full blur-3xl opacity-50"></div>
        <div class="absolute bottom-8 -left-12 w-44 h-44 bg-[#87BCB5] rounded-full blur-3xl opacity-20"></div>
        <div class="absolute top-0 left-0 right-0" style="height: 1.5px; background: linear-gradient(90deg, transparent, #52B788 30%, #D4AF37 60%, transparent);"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center pt-18 px-6">
        <div class="relative mb-4">
          <div class="absolute inset-0 rounded-full" style="background: rgba(135,188,181,0.15); filter: blur(18px); transform: scale(1.6);"></div>
          <img src="/logo.png" alt="Logo" class="relative w-19.5 h-19.5 object-contain drop-shadow-xl" />
        </div>
        <h1 class="text-[22px] font-black text-white uppercase tracking-widest text-center leading-tight">
          Kelab PERHILITAN
        </h1>
        <p class="text-[10px] font-medium mt-1.5 text-center tracking-wider" style="color: rgba(135,188,181,0.55);">
          Sukan &amp; Kebajikan Kakitangan
        </p>
      </div>

      <div class="relative z-10 flex-1 flex flex-col justify-center items-center px-8 mt-2">
        <Transition name="fade" mode="out-in">
          <div :key="currentSlide" class="text-center">
            <span class="text-[9px] font-black uppercase tracking-[0.22em] px-4 py-1.5 rounded-full inline-block mb-4"
              style="background: rgba(8,21,29,0.35); color: #87BCB5; border: 1px solid rgba(135,188,181,0.2); backdrop-filter: blur(8px);">
              {{ slides[currentSlide].title }}
            </span>
            <p class="text-[13px] leading-relaxed font-medium max-w-60 mx-auto" style="color: rgba(208,215,215,0.75);">
              {{ slides[currentSlide].desc }}
            </p>
          </div>
        </Transition>

        <div class="flex items-center gap-2 mt-7">
          <button v-for="(s, i) in slides" :key="i" @click="setSlide(i)"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="currentSlide === i ? 'w-6 bg-[#87BCB5]' : 'w-1.5 bg-[#567778]/40'">
          </button>
        </div>
      </div>

      <div class="relative z-10 px-7 pb-6 pt-4 flex flex-col gap-3">
        <button @click="router.push('/login')"
          class="w-full bg-[#08151D] text-[#87BCB5] font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all">
          Log Masuk Akaun
        </button>
        <button @click="router.push('/register')"
          class="w-full border-2 border-[#08151D] text-[#08151D] font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl active:scale-[0.98] transition-all">
          Daftar Sebagai Ahli
        </button>

        <div class="text-center mt-2 space-y-1" style="color: #8a9b9b;">
          <p class="text-[9px] font-bold text-[#567778] uppercase tracking-wide">
            Kelab Sukan & Kebajikan PERHILITAN
          </p>
          <p class="text-[8px] font-medium leading-snug px-2">
            (PPM-006-14-27071985)<br/>
            Ibu Pejabat PERHILITAN, KM.10 Jln Cheras, 56100 Kuala Lumpur.
          </p>
          <a href="mailto:kelabperhilitan@gmail.com" class="text-[8px] font-medium text-[#87BCB5] hover:underline block mt-0.5">
            kelabperhilitan@gmail.com
          </a>
        </div>
      </div>

    </div>

    <!-- PC -->
    <div class="hidden md:flex min-h-screen">

      <!-- Kiri: branding (sama seperti LoginView) -->
      <div class="w-1/2 bg-gradient-to-br from-[#0F4C3A] to-[#08151D] flex flex-col justify-between p-12 relative overflow-hidden">

        <div class="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div class="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full border-[60px] border-white"/>
          <div class="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full border-[50px] border-white"/>
          <div class="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full border-[30px] border-white"/>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-12">
            <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo.png" alt="Logo Kelab PERHILITAN" class="w-full h-full object-contain" />
            </div>
            <span class="text-white font-hago text-2xl tracking-wide mt-1">Kelab<br>PERHILITAN</span>
          </div>
        </div>

        <div class="relative z-10 flex-1 flex flex-col justify-center">
          <p class="text-[#FBBF24] text-xs font-bold uppercase tracking-[0.2em] mb-4">Portal Rasmi</p>
          <h2 class="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Sistem<br>
            <span class="text-[#87BCB5]">Pengurusan</span><br>
            Bersepadu Ahli
          </h2>
          <p class="text-[#D0D7D7] text-sm leading-relaxed max-w-sm">
            Akses penuh kepada yuran, bantuan kebajikan, aktiviti sukan, dan kedai kelab dalam satu platform berpusat yang moden.
          </p>
        </div>

        <div class="relative z-10 space-y-3">
          <div v-for="ciri in ciriSistem" :key="ciri.label" class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <svg class="w-3.5 h-3.5 text-[#87BCB5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-white/80 text-xs font-medium">{{ ciri.label }}</span>
          </div>
        </div>
      </div>

      <!-- Kanan: slides + butang -->
      <div class="w-1/2 bg-white flex items-center justify-center p-12">
        <div class="w-full max-w-md">

          <div class="mb-10">
            <h3 class="text-gray-900 text-3xl font-bold mb-2">Selamat Datang 👋</h3>
            <p class="text-gray-500 text-sm">Platform pengurusan kelab kakitangan PERHILITAN.</p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <Transition name="fade" mode="out-in">
              <div :key="currentSlide">
                <span class="text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1 rounded-full inline-block mb-3"
                  style="background: rgba(15,76,58,0.08); color: #0F4C3A; border: 1px solid rgba(15,76,58,0.15);">
                  {{ slides[currentSlide].title }}
                </span>
                <p class="text-sm text-gray-600 leading-relaxed">{{ slides[currentSlide].desc }}</p>
              </div>
            </Transition>
            <div class="flex items-center gap-2 mt-5">
              <button v-for="(s, i) in slides" :key="i" @click="setSlide(i)"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="currentSlide === i ? 'w-6 bg-[#0F4C3A]' : 'w-1.5 bg-gray-300'">
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <button @click="router.push('/login')"
              class="w-full bg-[#08151D] hover:bg-[#0F4C3A] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg transition-all">
              Log Masuk Akaun
            </button>
            <button @click="router.push('/register')"
              class="w-full border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#08151D] hover:text-[#08151D] transition-all">
              Daftar Sebagai Ahli
            </button>
          </div>

          <div class="text-center mt-8 pt-6 border-t border-gray-100 space-y-1">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Kelab Sukan & Kebajikan PERHILITAN</p>
            <p class="text-[10px] text-gray-400">(PPM-006-14-27071985) · KM.10 Jln Cheras, 56100 KL</p>
            <a href="mailto:kelabperhilitan@gmail.com" class="text-[10px] text-[#0F4C3A] hover:underline block">
              kelabperhilitan@gmail.com
            </a>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const slides = [
  { title: 'Pengurusan Ahli', desc: 'Akses profil digital keahlian anda dengan mudah dan pantas di hujung jari.' },
  { title: 'Sukan & Rekreasi', desc: 'Sertai pelbagai aktiviti sukan dan rekreasi anjuran kelab.' },
  { title: 'Kebajikan', desc: 'Nikmati faedah dan bantuan kebajikan khas untuk kakitangan yang berdaftar.' }
];

const ciriSistem = [
  { label: 'Bayaran yuran pantas melalui FPX' },
  { label: 'Permohonan bantuan kebajikan ahli' },
  { label: 'Pendaftaran sukan & aktiviti kelab' },
  { label: 'Pembelian barangan kedai eksklusif' },
];

const currentSlide = ref(0);
let slideInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const setSlide = (index) => {
  currentSlide.value = index;
  resetInterval();
};

const resetInterval = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3500);
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 3500);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }

.fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
