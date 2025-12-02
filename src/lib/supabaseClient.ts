// BACKEND CODE COMMENTED OUT - USING FRONTEND MOCK DATA ONLY
/*
import { createClient } from '@supabase/supabase-js'

// Support both REACT_APP_ and VITE_ prefixes (prioritize REACT_APP_)
const url = (import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string
const anon = (import.meta.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error('Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. Check your .env and restart the dev server.')
  console.error('Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    REACT_APP_SUPABASE_URL: import.meta.env.REACT_APP_SUPABASE_URL,
    url,
    anon: anon ? 'present' : 'missing'
  })
  throw new Error('Supabase env vars not set')
}

export const supabaseClient = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
})

// Backwards compatibility: also export as 'supabase'
export const supabase = supabaseClient
export default supabaseClient
*/

// MOCK CLIENT FOR FRONTEND-ONLY OPERATION
export const supabaseClient = null
export const supabase = null
export default null
