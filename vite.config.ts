// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('firebase')) {
            return 'firebase';
          }
          if (id.includes('mui')) {
            return 'mui';
          }
        },
      },
    },
  },
  base: '/',
});
