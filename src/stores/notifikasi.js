import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useNotifikasiStore = defineStore('notifikasi', () => {
    const bilangan  = ref(0);
    const terakhirId = ref(null); // ID notifikasi terbaru yang sudah diproses
    let   intervalId = null;

    // Muat bilangan dari server dan bandingkan
    const semak = async () => {
        try {
            const { data } = await api.get('/user/notifikasi/bilangan');
            const bil = parseInt(data.bilangan) || 0;
            bilangan.value = bil;
        } catch {}
    };

    // Semak notifikasi baru & trigger local notification jika ada
    const semakDanNotif = async () => {
        try {
            const { data } = await api.get('/user/notifikasi');
            const senarai = data.data || [];
            bilangan.value = senarai.filter(n => !n.dibaca).length;

            if (!senarai.length) return;

            const idTerbaru = senarai[0].id;

            // Kali pertama — simpan ID sahaja, jangan trigger notif
            if (terakhirId.value === null) {
                terakhirId.value = idTerbaru;
                return;
            }

            // Ada notif baru sejak kali lepas
            const baharu = senarai.filter(n => n.id > terakhirId.value);
            if (baharu.length > 0) {
                terakhirId.value = idTerbaru;
                // notifikasi baru — badge dikemaskini sahaja
            }
        } catch {}
    };

    // Mula polling — panggil sekali semasa login
    const mulaPolling = (intervalMs = 30000) => {
        if (intervalId) return; // Elak double-start
        semakDanNotif(); // Terus semak bila start
        intervalId = setInterval(semakDanNotif, intervalMs);
    };

    const hentiPolling = () => {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
        terakhirId.value = null;
        bilangan.value = 0;
    };

    const tandaBacaSemua = () => { bilangan.value = 0; };

    return { bilangan, semak, semakDanNotif, mulaPolling, hentiPolling, tandaBacaSemua };
});
