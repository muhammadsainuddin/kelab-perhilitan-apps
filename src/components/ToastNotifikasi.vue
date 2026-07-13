<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div v-if="toast.mesej.value"
        :key="toast.mesej.value.id"
        role="alert"
        :class="[
          'fixed z-[9999] bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[300px] sm:max-w-[400px]',
          'flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border',
          stilWarna[toast.mesej.value.jenis]
        ]">
        <!-- Ikon -->
        <div class="shrink-0 w-5 h-5 mt-0.5">
          <!-- Sukses -->
          <svg v-if="toast.mesej.value.jenis === 'sukses'" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          <!-- Ralat -->
          <svg v-else-if="toast.mesej.value.jenis === 'ralat'" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          <!-- Amaran -->
          <svg v-else-if="toast.mesej.value.jenis === 'amaran'" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <!-- Info -->
          <svg v-else class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <!-- Teks -->
        <p class="flex-1 text-xs font-semibold leading-snug pt-0.5">{{ toast.mesej.value.teks }}</p>
        <!-- Butang tutup -->
        <button @click="toast.tutup()" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity -mr-1 -mt-0.5 p-1 rounded-lg">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast';
const toast = useToast();

const stilWarna = {
  sukses: 'bg-emerald-600 text-white border-emerald-500/50',
  ralat:  'bg-red-600 text-white border-red-500/50',
  amaran: 'bg-amber-500 text-white border-amber-400/50',
  info:   'bg-blue-600 text-white border-blue-500/50',
};
</script>

<style scoped>
.toast-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-slide-leave-active  { transition: all 0.25s ease-in; }
.toast-slide-enter-from    { opacity: 0; transform: translateY(16px) scale(0.96); }
.toast-slide-leave-to      { opacity: 0; transform: translateY(8px) scale(0.97); }
</style>
