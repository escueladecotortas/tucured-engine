// Archivo: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5005,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5006',
        changeOrigin: true,
        secure: false,
        proxyTimeout: 900000,
        timeout: 900000
      },
      '/nexus_archives': {
        target: 'http://127.0.0.1:5006',
        changeOrigin: true,
        secure: false
      },
      '/clients': {
        target: 'http://127.0.0.1:5006',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
