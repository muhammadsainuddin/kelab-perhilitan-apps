<template>
  <div class="min-h-screen bg-[#D0D7D7] relative flex flex-col h-screen shadow-2xl font-sans overflow-hidden selection:bg-[#87BCB5] selection:text-[#08151D]">
    
    <div class="absolute top-0 left-0 w-full h-[60%] bg-[#08151D] rounded-br-[100px] z-0 overflow-hidden shadow-lg">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-[#0E303D] rounded-full blur-2xl opacity-60"></div>
      <div class="absolute bottom-10 -left-10 w-40 h-40 bg-[#87BCB5] rounded-full blur-3xl opacity-40"></div>
    </div>

    <div class="relative z-10 flex flex-col items-center pt-20 px-6">
      <img src="/logo.png" alt="Logo" class="w-20 h-20 object-contain mb-3 drop-shadow-xl" />
      <h1 class="text-5xl text-[#87BCB5] font-hago tracking-widest drop-shadow-md mb-1">KePe</h1>
      <h2 class="text-xl font-bold text-[#D0D7D7] tracking-wide text-center">Kelab PERHILITAN</h2>
    </div>

    <div class="relative z-10 flex-1 flex flex-col justify-center items-center px-8 mt-4">
      <transition name="fade" mode="out-in">
        <div :key="currentSlide" class="text-center min-h-[80px]">
          <p class="text-[#87BCB5] text-xs uppercase tracking-[0.2em] font-bold bg-[#08151D]/40 px-4 py-1.5 rounded-full backdrop-blur-sm inline-block mb-3">
            {{ slides[currentSlide].title }}
          </p>
          <p class="text-[#D0D7D7] text-sm leading-relaxed max-w-[250px] mx-auto">
            {{ slides[currentSlide].desc }}
          </p>
        </div>
      </transition>

      <div class="flex gap-2 mt-6">
        <button 
          v-for="(slide, index) in slides" :key="index"
          @click="setSlide(index)"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'w-6 bg-[#87BCB5]' : 'w-1.5 bg-[#567778]/50 hover:bg-[#567778]'"
        ></button>
      </div>
    </div>

    <div class="relative z-10 bg-[#D0D7D7] px-8 pb-12 pt-8 flex flex-col gap-4">
      <button @click="router.push('/login')" class="w-full bg-[#08151D] text-[#87BCB5] font-bold text-sm py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
        Log Masuk Akaun
      </button>
      <button @click="router.push('/register')" class="w-full bg-transparent border-2 border-[#08151D] text-[#08151D] font-bold text-sm py-3.5 rounded-2xl hover:bg-[#08151D] hover:text-[#D0D7D7] transition-all">
        Daftar Sebagai Ahli
      </button>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
.font-hago { font-family: 'Righteous', cursive; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>