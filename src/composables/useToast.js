import { ref } from 'vue';

// Singleton state — shared across all callers
const mesej = ref(null);
let timer = null;

export function useToast() {
    const tunjuk = (teks, jenis = 'info', tempoh = 4000) => {
        if (timer) clearTimeout(timer);
        mesej.value = { teks, jenis, id: Date.now() };
        if (tempoh > 0) timer = setTimeout(() => { mesej.value = null; }, tempoh);
    };

    return {
        mesej,
        sukses: (teks, tempoh = 4000) => tunjuk(teks, 'sukses', tempoh),
        ralat:  (teks, tempoh = 5000) => tunjuk(teks, 'ralat', tempoh),
        amaran: (teks, tempoh = 4500) => tunjuk(teks, 'amaran', tempoh),
        info:   (teks, tempoh = 4000) => tunjuk(teks, 'info', tempoh),
        tutup:  () => { if (timer) clearTimeout(timer); mesej.value = null; },
    };
}
