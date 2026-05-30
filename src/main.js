import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router' // Import router yang kita buat
import './style.css' // Pastikan fail ini mengandungi import Tailwind CSS
import App from './App.vue'
import './assets/theme.css'

// 1. Cipta instance aplikasi Vue
const app = createApp(App)

// 2. Cipta instance Pinia
const pinia = createPinia()

// 3. Daftarkan Pinia dan Router ke dalam aplikasi
app.use(pinia)
app.use(router)

// 4. Mount (pasang) aplikasi ke dalam DOM
app.mount('#app')