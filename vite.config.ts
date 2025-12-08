import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DEV_HOST = process.env.VITE_DEV_HOST ?? 'localhost'
const DEV_PORT = Number(process.env.VITE_DEV_PORT ?? 3004)
const DEV_STRICT_PORT =
  process.env.VITE_DEV_STRICT_PORT !== undefined
    ? process.env.VITE_DEV_STRICT_PORT === 'true'
    : true

const PREVIEW_HOST = process.env.VITE_PREVIEW_HOST ?? DEV_HOST
const PREVIEW_PORT = Number(process.env.VITE_PREVIEW_PORT ?? 3000)
const PREVIEW_STRICT_PORT =
  process.env.VITE_PREVIEW_STRICT_PORT !== undefined
    ? process.env.VITE_PREVIEW_STRICT_PORT === 'true'
    : true

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // BACKEND CONFIG COMMENTED OUT - USING FRONTEND MOCK DATA ONLY
  /*
  define: {
    // Expose REACT_APP_ environment variables to the client
    'import.meta.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL),
    'import.meta.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY),
  },
  */
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: DEV_STRICT_PORT,
    // Proxy API requests to Serverless Functions dev server
    // Serverless Functions run on port 4000 (separate from main app on 3004)
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: PREVIEW_HOST,
    port: PREVIEW_PORT,
    strictPort: PREVIEW_STRICT_PORT,
  },
})
