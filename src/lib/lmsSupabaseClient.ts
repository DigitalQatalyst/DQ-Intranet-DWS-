import { createClient } from '@supabase/supabase-js'

// LMS-specific Supabase client using LMS-prefixed environment variables
// These point to a different database than the main Supabase client
const url = import.meta.env.VITE_LMS_SUPABASE_URL as string
const anon = import.meta.env.VITE_LMS_SUPABASE_ANON_KEY as string

export const lmsSupabaseClient = url && anon
  ? createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : {
      from: () => {
        throw new Error('LMS Supabase env vars not set. Please set VITE_LMS_SUPABASE_URL and VITE_LMS_SUPABASE_ANON_KEY and restart the dev server.')
      },
    }

// Backwards compatibility: also export as 'lmsSupabase'
export const lmsSupabase = lmsSupabaseClient
export default lmsSupabaseClient
