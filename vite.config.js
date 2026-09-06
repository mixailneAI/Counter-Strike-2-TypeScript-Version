import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/matchmaking': 'http://localhost:2567',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/gui'],
          physics: ['cannon-es'],
          network: ['colyseus.js'],
          audio: ['howler'],
          vue: ['vue', 'pinia'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@babylonjs/core', 'cannon-es', 'howler'],
  },
});