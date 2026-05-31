import axios from 'axios';
import router from '../router'; // Import router untuk membolehkan kita "tendang" pengguna
import { useAuthStore } from '../stores/auth';

// 1. Cipta instance Axios yang moden (Boleh gunakan persekitaran .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
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
    const status = error.response?.status;

    // 401 = token luput atau tidak sah → auto-logout dan redirect ke login
    // (Backend returns 401 untuk expired/invalid token, 403 untuk role denied)
    if (status === 401) {
      authStore.logout();
      router.push({ path: '/login', query: { mesej: 'sesi-tamat' } });
    }

    return Promise.reject(error);
  }
);

export default api;