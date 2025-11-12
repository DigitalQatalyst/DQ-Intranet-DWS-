/**
 * Supabase Client for Node.js Scripts
 * Uses process.env instead of import.meta.env for Node.js compatibility
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file from project root
config({ path: resolve(process.cwd(), '.env') })

const url = process.env.VITE_SUPABASE_URL as string
const anon = process.env.VITE_SUPABASE_ANON_KEY as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.')
  throw new Error('Supabase env vars not set')
}

// Use service role key for server-side operations if available, otherwise use anon key
const key = serviceRoleKey || anon

export const supabaseClient = createClient(url, key, {
  auth: {
    persistSession: false, // Server-side doesn't need session persistence
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-client-info': 'dq-intranet-dws-server',
    },
  },
})

// Export service role client if available (for admin operations)
export const supabaseAdmin = serviceRoleKey
  ? createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'x-client-info': 'dq-intranet-dws-admin',
        },
      },
    })
  : null

