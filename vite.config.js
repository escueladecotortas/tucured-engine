import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: true, // Permitir túneles (ngrok, serveo, localtunnel)
    proxy: {
      '/voice-api': {
        target: 'http://127.0.0.1:3200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/voice-api/, '')
      },
      '/voice-ws': {
        target: 'ws://127.0.0.1:3200',
        ws: true,
        rewrite: (path) => path.replace(/^\/voice-ws/, '')
      },
      '/api/terminal': {
         target: 'http://127.0.0.1:3000',
         changeOrigin: true
      },
      '/api': {
         target: 'http://127.0.0.1:5005',
         changeOrigin: true,
         proxyTimeout: 900000,
         timeout: 900000 
      },
      '/nexus_archives': 'http://127.0.0.1:5005',
      '/clients': 'http://127.0.0.1:5005'
    }
  }
})
