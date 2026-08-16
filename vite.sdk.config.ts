import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuración para generar el SDK autónomo
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'sdk/StitchEmbedder.tsx'),
      name: 'StitchSDK',
      fileName: (format) => `stitch-v3.${format}.js`,
      formats: ['iife'], // Iife es ideal para incluir vía <script> directo
    },
    rollupOptions: {
      // Nos aseguramos de incluir TODO en el bundle para que sea autónomo (Soberano)
      output: {
        extend: true,
      },
    },
    outDir: 'public/sdk',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  }
});
