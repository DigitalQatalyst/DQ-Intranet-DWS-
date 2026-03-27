/**
 * Supabase Client for Node.js Scripts
 * Uses process.env instead of import.meta.env for Node.js compatibility
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file from project root
config({ path: resolve(process.cwd(), '.env') })

const url = (process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL) as string
const anon = (process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY) as string

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.')
  throw new Error('Supabase env vars not set')
}

export const supabaseClient = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
})

