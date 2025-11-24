import { createClient } from '@supabase/supabase-js'

// Vite injects these at build time. They must be defined.
const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Validate environment variables and provide clear errors
if (!url || url.trim() === '') {
  const errorMsg = '❌ VITE_SUPABASE_URL is missing or empty! Create .env.local with: VITE_SUPABASE_URL=https://your-project.supabase.co'
  console.error(errorMsg)
  console.error('Current value:', url)
  if (import.meta.env.DEV) {
    alert(errorMsg + '\n\nCheck the console for details.')
  }
  throw new Error('VITE_SUPABASE_URL not set')
}

if (!anon || anon.trim() === '') {
  const errorMsg = '❌ VITE_SUPABASE_ANON_KEY is missing or empty! Create .env.local with: VITE_SUPABASE_ANON_KEY=your-anon-key'
  console.error(errorMsg)
  console.error('Current value:', anon ? '***' : 'undefined')
  if (import.meta.env.DEV) {
    alert(errorMsg + '\n\nCheck the console for details.')
  }
  throw new Error('VITE_SUPABASE_ANON_KEY not set')
}

// Validate URL format
if (!url.startsWith('http://') && !url.startsWith('https://')) {
  const errorMsg = `❌ VITE_SUPABASE_URL has invalid format! Expected URL starting with http:// or https://, got: ${url.substring(0, 50)}`
  console.error(errorMsg)
  throw new Error('VITE_SUPABASE_URL has invalid format')
}

// Log in dev mode to help debug
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Client Config:', {
    url: url.substring(0, 30) + '...',
    hasAnonKey: !!anon,
    anonKeyLength: anon?.length || 0,
  })
}

// Use the URL directly (Supabase should handle CORS automatically)
export const supabaseClient = createClient(url, anon, {
  auth: { 
    persistSession: true, 
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': anon,
    },
  },
})

// Backwards compatibility: also export as 'supabase'
export const supabase = supabaseClient
export default supabaseClient
