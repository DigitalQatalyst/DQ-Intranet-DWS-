import { createClient } from '@supabase/supabase-js'

// Prefer service role key for admin operations, fallback to anon key
const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()
const key = serviceRoleKey || anonKey

if (!url || !key) {
  throw new Error(
    'Missing VITE_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY). ' +
    'Check your .env file and ensure the required Supabase credentials are set.'
  )
}

if (!serviceRoleKey) {
  console.warn(
    '⚠️  WARNING: Using anon key for admin operations. ' +
    'For production, use SUPABASE_SERVICE_ROLE_KEY for server-side operations.'
  )
}

export const supabaseAdmin = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'dq-intranet-dws-admin-api',
    },
  },
})

