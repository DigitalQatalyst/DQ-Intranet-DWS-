import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
