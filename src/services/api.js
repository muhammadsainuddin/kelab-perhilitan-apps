import axios from 'axios';
import router from '../router'; // Import router untuk membolehkan kita "tendang" pengguna
import { useAuthStore } from '../stores/auth';

// 1. Cipta instance Axios yang moden (Boleh gunakan persekitaran .env)
const api = axios.create({
  //baseURL: 'https://kelabperhilitan.msdev.com.my/api',
  baseURL: 'http://localhost:5001/api',
  timeout: 10000, // Timeout selepas 10 saat jika server tiada respons
  headers: {
    'Content-Type': 'application/json',
  }
});

// ==========================================
// REQUEST INTERCEPTOR (Sebelum Data Dihantar)
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Panggil authStore di SINI untuk elakkan ralat Pinia
    const authStore = useAuthStore();
    
    // Jika JWT wujud, masukkan ke dalam header Authorization
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (Selepas Data Diterima)
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Jika API berjaya (Status 200-299), pulangkan data seperti biasa
    return response;
  },
  (error) => {
    const authStore = useAuthStore();

    // Jika pelayan (server) membalas ralat 401 (Sesi Tamat Tempoh / Token Tidak Sah)
    if (error.response && error.response.status === 401) {
      console.warn('Sesi log masuk telah tamat tempoh. Log keluar automatik dijalankan.');
      
      // 1. Padam token dan data dari sistem (Pinia & LocalStorage)
      authStore.logout();
      
      // 2. Tendang pengguna kembali ke halaman log masuk berserta notis
      router.push({ 
        path: '/login', 
        query: { mesej: 'sesi-tamat' } // Boleh guna query ini untuk tunjuk amaran di Login page
      });
    }

    return Promise.reject(error);
  }
);

export default api;