import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

const pkgUrl  = new URL('./package.json', import.meta.url);
const pkgPath = fileURLToPath(pkgUrl);
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
  build: {
    target: 'esnext',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@capacitor'))                    return 'vendor-capacitor';
            if (id.includes('axios'))                        return 'vendor-axios';
            if (id.includes('pdfjs-dist') || id.includes('vue-pdf-embed')) return 'vendor-pdf';
            if (id.includes('vue') || id.includes('pinia')) return 'vendor-vue';
          }
        },
      },
    },
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
        lang: 'ms',
        theme_color: '#0F4C3A',
        background_color: '#08151D',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        id: '/',
        icons: [
          { src: 'launchericon-48x48.png',   sizes: '48x48',   type: 'image/png' },
          { src: 'launchericon-72x72.png',   sizes: '72x72',   type: 'image/png' },
          { src: 'launchericon-96x96.png',   sizes: '96x96',   type: 'image/png' },
          { src: 'launchericon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'launchericon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}'],
        globIgnores: ['**/vendor-pdf*.js'],
        runtimeCaching: [
          {
            // Gambar upload dari backend — nama unik, selamat cache lama
            urlPattern: /\/uploads\/images\/.+\.(webp|jpg|jpeg|png)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'uploads-images-v1',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API responses — guna NetworkFirst supaya data sentiasa terkini
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v1',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5 minit
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      }
    })
  ].filter(Boolean),
}))
