import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configurazione Semplificata: Lasciamo che Vite gestisca le chiavi automaticamente
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
