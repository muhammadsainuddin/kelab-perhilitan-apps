import { defineStore } from 'pinia';
import { ref } from 'vue';

// Baca data user dari localStorage dengan selamat (elak crash jika data rosak)
const bacaUserData = () => {
  try {
    return JSON.parse(localStorage.getItem('user_data')) || null;
  } catch {
    localStorage.removeItem('user_data');
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('jwt_token') || null);
  const user = ref(bacaUserData());

  // Getters (Adakah user sudah log masuk?)
  const isAuthenticated = () => !!token.value;

  // Actions
  const login = (jwtData, userData) => {
    token.value = jwtData;
    user.value = userData;
    // Simpan ke localStorage supaya kekal bila refresh
    localStorage.setItem('jwt_token', jwtData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  };

  return { token, user, isAuthenticated, login, logout };
});