import { defineStore } from 'pinia';
import { ref } from 'vue';

// Baca token — semak localStorage (ingat saya / biometrik) dan sessionStorage (sesi sahaja)
const bacaToken = () =>
  localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || null;

const bacaUserData = () => {
  try {
    const str = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    return str ? JSON.parse(str) : null;
  } catch {
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const token = ref(bacaToken());
  const user  = ref(bacaUserData());
  const biometrikAktif = ref(localStorage.getItem('biometric_enabled') === 'true');

  const isAuthenticated = () => !!token.value;

  // ingatSaya: true → localStorage (kekal), false → sessionStorage (hilang bila tutup browser)
  // refreshToken selalu disimpan dalam localStorage untuk biometrik (bebas dari ingatSaya)
  const login = (jwtData, userData, ingatSaya = false, refreshToken = null) => {
    token.value = jwtData;
    user.value  = userData;
    const storan = ingatSaya ? localStorage : sessionStorage;
    storan.setItem('jwt_token',  jwtData);
    storan.setItem('user_data',  JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem('biometric_refresh_token', refreshToken);
    }
  };

  // Set store state + kemaskini localStorage (selepas biometrik renew JWT baru)
  const loginTerus = (jwtData, userData) => {
    token.value = jwtData;
    user.value  = userData;
    localStorage.setItem('jwt_token', jwtData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    token.value = null;
    user.value  = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_data');
    // biometric_refresh_token TIDAK dipadam — biometrik kekal boleh guna selepas logout
  };

  // Aktifkan biometrik — refresh token mesti wujud dari login sebelum ini
  const aktifkanBiometrik = () => {
    if (!localStorage.getItem('biometric_refresh_token')) return;
    localStorage.setItem('biometric_enabled', 'true');
    biometrikAktif.value = true;
  };

  const matikanBiometrik = () => {
    localStorage.removeItem('biometric_enabled');
    localStorage.removeItem('biometric_refresh_token');
    biometrikAktif.value = false;
  };

  return { token, user, biometrikAktif, isAuthenticated, login, loginTerus, logout, aktifkanBiometrik, matikanBiometrik };
});
