// Archivo: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function handleProxyError(proxy) {
  proxy.on('error', (err, _req, res) => {
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      if (res && !res.headersSent && typeof res.writeHead === 'function') {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend initializing', code: 'BACKEND_STARTING' }));
      }
    }
  });
}

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
        timeout: 900000,
        configure: handleProxyError
      },
      '/nexus_archives': {
        target: 'http://127.0.0.1:5006',
        changeOrigin: true,
        secure: false,
        configure: handleProxyError
      },
      '/clients': {
        target: 'http://127.0.0.1:5006',
        changeOrigin: true,
        secure: false,
        configure: handleProxyError
      }
    }
  }
});

