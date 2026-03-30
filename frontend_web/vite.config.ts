import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'figma:asset': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://180.235.121.253:8107',
        changeOrigin: true,
      }
    }
  }
})
