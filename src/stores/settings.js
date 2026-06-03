import { ref } from 'vue';
import { defineStore } from 'pinia';
import api from '../services/api';

export const useSettingsStore = defineStore('settings', () => {
    const tetapan = ref({});
    const dimuat  = ref(false);
    const loading = ref(false);

    const muatTetapan = async () => {
        if (dimuat.value || loading.value) return;
        loading.value = true;
        try {
            const res = await api.get('/settings');
            const map = {};
            for (const item of res.data.data) {
                map[item.kunci] = item.nilai === 1;
            }
            tetapan.value = map;
            dimuat.value  = true;
        } catch {
            // fail-open — semua modul dianggap aktif jika gagal
            tetapan.value = { modul_kedai: true, modul_bantuan: true, modul_acara: true };
            dimuat.value  = true;
        } finally {
            loading.value = false;
        }
    };

    const modulAktif = (kunci) => {
        if (!dimuat.value) return true;
        return tetapan.value[kunci] !== false;
    };

    // Untuk admin update terus ke store tanpa fetch semula
    const setTetapan = (kunci, nilai) => {
        tetapan.value = { ...tetapan.value, [kunci]: nilai === 1 };
    };

    return { tetapan, dimuat, loading, muatTetapan, modulAktif, setTetapan };
});
