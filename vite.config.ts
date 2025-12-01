import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './', // Fondamentale per GitHub Pages
    
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    plugins: [react()],
    
    // Espone le variabili al codice
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '')
    },
    
    resolve: {
      alias: {
        '@': path.resolve('.'),
      }
    }
  };
});
