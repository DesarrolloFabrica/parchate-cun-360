import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.webp'],
    base: '/',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Librerías en chunks propios: cambian poco entre despliegues y el
          // navegador las conserva en caché (nginx las sirve con cache inmutable).
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\\/]node_modules[\\/](three|@photo-sphere-viewer)[\\/]/.test(id)) return 'vendor-360';
            if (/[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'vendor-motion';
            if (/[\\/]node_modules[\\/]lottie-web[\\/]/.test(id)) return 'vendor-lottie';
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
            return 'vendor';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              // Ignora copias temporales de build (build-check, build-check-monteria-final, …)
              // para que no entren al grafo HMR/CSS de Vite.
              ignored: ['**/build-check*/**', '**/dist/**', '**/.vite/**'],
            },
    },
  };
});
