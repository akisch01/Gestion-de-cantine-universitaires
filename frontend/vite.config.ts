import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  
  // Configuration spécifique pour Render
  preview: {
    port: 10000,
    host: true,
    strictPort: true,
    allowedHosts: [
      'cantine-universitaire.onrender.com',
      'localhost'
    ]
  },

  // Configuration de build
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000, // Augmente la limite d'avertissement
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          vendor: ['axios', 'zod', 'react-hook-form']
        }
      }
    }
  },

  // Alias et résolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  // Proxy pour le développement
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
