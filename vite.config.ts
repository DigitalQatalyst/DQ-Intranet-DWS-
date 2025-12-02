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

const API_PROXY_TARGET =
  process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:5174'

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
    proxy: {
      '/api': API_PROXY_TARGET,
    },
  },
  preview: {
    host: PREVIEW_HOST,
    port: PREVIEW_PORT,
    strictPort: PREVIEW_STRICT_PORT,
  },
})
