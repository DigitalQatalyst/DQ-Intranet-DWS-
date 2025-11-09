/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_REDIRECT_URL?: string
  readonly VITE_SUPABASE_SITE_URL?: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Node.js environment variables (for server-side code)
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_SUPABASE_URL?: string
    readonly VITE_SUPABASE_ANON_KEY?: string
    readonly SUPABASE_SERVICE_ROLE_KEY?: string
    readonly VITE_SUPABASE_REDIRECT_URL?: string
    readonly VITE_SUPABASE_SITE_URL?: string
    readonly NODE_ENV: string
  }
}
