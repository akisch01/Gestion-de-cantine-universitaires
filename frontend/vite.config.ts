import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

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
  build: {
    outDir: 'dist', // Explicitement défini
    emptyOutDir: true // Vide le dossier avant chaque build
  },
  // Configuration spécifique pour Vercel
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
    }
  }
})
