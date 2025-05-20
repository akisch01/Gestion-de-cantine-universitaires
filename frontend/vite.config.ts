import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },

  // Configuration de build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: 'assets/[name].[hash].js',
      }
    }
  },

  // Configuration pour Vercel
  base: process.env.NODE_ENV === 'production' ? '/frontend/dist/' : '/',
  
  // Configuration du serveur de développement
  server: {
    proxy: {
      '/api': {
        target: 'https://gestion-cantine-backend.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/media': {
        target: 'https://gestion-cantine-backend.onrender.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/media/, '')
      }
    },
    port: 3000,
    open: true
  },

  // Optimisations supplémentaires
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  
  // Configuration pour le pré-rendering (optionnel)
  preview: {
    port: 3000,
    strictPort: true,
  }
});
