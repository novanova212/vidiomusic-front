import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfigurasi Vite: dev server frontend di port 5173,
// proxy /api diarahkan ke backend Laravel (port 8000) saat development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // Dipakai saat production di Railway (perintah start: 'vite preview' /
  // 'npm run preview'). Tanpa ini, Vite menolak request yang datang lewat
  // domain publik Railway dengan error "Blocked request: host not allowed".
  preview: {
    host: true, // dengarkan di semua alamat (0.0.0.0), bukan cuma localhost
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true, // izinkan diakses lewat domain apa pun (situs publik)
  },
})
