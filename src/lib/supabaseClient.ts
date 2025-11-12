import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/communities/integrations/supabase/types'

// Vite injects these at build time. They must be defined.
const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL as string | undefined
const siteUrl = import.meta.env.VITE_SUPABASE_SITE_URL as string | undefined

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env and restart the dev server.')
  throw new Error('Supabase env vars not set')
}

// Create typed Supabase client for Communities feature
export const supabaseClient = createClient<Database>(url, anon, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    redirectTo: redirectUrl || (typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined),
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'dq-intranet-dws-communities',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Export site URL for use in auth flows
export const supabaseSiteUrl = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')

// Export as 'supabase' for backward compatibility with community imports
export const supabase = supabaseClient
export default supabaseClient
