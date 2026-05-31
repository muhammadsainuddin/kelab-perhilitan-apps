<template>
  <div class="min-h-screen bg-[#D0D7D7] relative flex flex-col h-screen font-sans overflow-hidden select-none">

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
.font-sans { font-family: 'Inter', sans-serif; }

.fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>