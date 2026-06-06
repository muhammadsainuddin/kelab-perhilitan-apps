import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    vue(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png'], // Merujuk fail dalam gambar
      manifest: {
        name: 'Kelab PERHILITAN',
        short_name: 'Kelab PERHILITAN',
        description: 'Sistem Pengurusan & Aplikasi Rasmi Kelab PERHILITAN',
        theme_color: '#0F4C3A',
        background_color: '#08151D',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'launchericon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'launchericon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'launchericon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'launchericon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'launchericon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'launchericon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}']
      }
    })
  ],
})