import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync, writeFileSync } from 'fs'

const pkgPath = new URL('./package.json', import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

// Auto-increment patch version setiap build pengeluaran
function autoVersionPlugin() {
  return {
    name: 'auto-version',
    buildStart() {
      const parts = pkg.version.split('.').map(Number);
      parts[2] = (parts[2] || 0) + 1;
      pkg.version = parts.join('.');
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      pkg.build_date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log(`\n📦 Versi dinaikkan → ${pkg.version}  (${pkg.build_date})\n`);
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    __APP_VERSION__:    JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(pkg.build_date || '—'),
  },
  plugins: [
    command === 'build' ? autoVersionPlugin() : null,
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png'],
      manifest: {
        name: 'Kelab PERHILITAN',
        short_name: 'Kelab PERHILITAN',
        description: 'Sistem Pengurusan & Aplikasi Rasmi Kelab PERHILITAN',
        theme_color: '#0F4C3A',
        background_color: '#08151D',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'launchericon-48x48.png',  sizes: '48x48',   type: 'image/png' },
          { src: 'launchericon-72x72.png',  sizes: '72x72',   type: 'image/png' },
          { src: 'launchericon-96x96.png',  sizes: '96x96',   type: 'image/png' },
          { src: 'launchericon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'launchericon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}']
      }
    })
  ].filter(Boolean),
}))
