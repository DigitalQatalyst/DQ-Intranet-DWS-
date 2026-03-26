import { createClient } from '@supabase/supabase-js'

// LMS-specific Supabase client using LMS-prefixed environment variables
// These point to a different database than the main Supabase client
const url = import.meta.env.VITE_LMS_SUPABASE_URL as string
const anon = import.meta.env.VITE_LMS_SUPABASE_ANON_KEY as string

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error('Missing VITE_LMS_SUPABASE_URL or VITE_LMS_SUPABASE_ANON_KEY. Check your .env and restart the dev server.')
  throw new Error('LMS Supabase env vars not set')
}

export const lmsSupabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
})

// Backwards compatibility: also export as 'lmsSupabase'
export const lmsSupabase = lmsSupabaseClient
export default lmsSupabaseClient

