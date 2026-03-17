import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const parseBoolEnv = (value: string | undefined, defaultValue: boolean) =>
  value === undefined ? defaultValue : value === 'true'

const normalizeBasePath = (value: string | undefined) => {
  if (!value || value === '/') return '/';
  const trimmed = value.replaceAll(/(?:^\/+)|(?:\/+$)/g, '');
  return `/${trimmed}/`;
};

const DEV_HOST = process.env.VITE_DEV_HOST ?? 'localhost'
const DEV_PORT = Number(process.env.VITE_DEV_PORT ?? 3004)
const DEV_STRICT_PORT = parseBoolEnv(process.env.VITE_DEV_STRICT_PORT, true)

const PREVIEW_HOST = process.env.VITE_PREVIEW_HOST ?? DEV_HOST
const PREVIEW_PORT = Number(process.env.VITE_PREVIEW_PORT ?? 3000)
const PREVIEW_STRICT_PORT = parseBoolEnv(process.env.VITE_PREVIEW_STRICT_PORT, true)
// Use / for Vercel previews by default; /dws/ for nginx unless overridden
const inferredBase =
  process.env.VERCEL === '1'
    ? '/'
    : process.env.VITE_BASE_PATH ?? '/'
const BASE_PATH = normalizeBasePath(inferredBase)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /dws/ for production behind nginx; override with VITE_BASE_PATH=/ for Vercel previews
  base: BASE_PATH,
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
