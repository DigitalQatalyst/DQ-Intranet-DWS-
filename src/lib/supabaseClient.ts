import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/communities/integrations/supabase/types';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

// Support both REACT_APP_ and VITE_ prefixes (prioritize REACT_APP_)
const url = (import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string | undefined;
const anon = (import.meta.env.REACT_APP_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY) as string | undefined;
const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL as string | undefined;
const siteUrl = import.meta.env.VITE_SUPABASE_SITE_URL as string | undefined;

if (!url || !anon) {
  // Helps you catch misconfigured envs early during dev
  // eslint-disable-next-line no-console
  console.error('Missing Supabase env vars. Check your .env and restart the dev server.');
  console.error('Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    REACT_APP_SUPABASE_URL: import.meta.env.REACT_APP_SUPABASE_URL,
    url: url ? 'present' : 'missing',
    anon: anon ? 'present' : 'missing',
  });
  throw new Error('Supabase env vars not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

if (typeof window !== 'undefined') {
  try {
    const host = new URL(url).host
    const payload = decodeJwtPayload(anon)
    // eslint-disable-next-line no-console
    console.log('Supabase env check:', {
      host,
      anonKeyLooksLikeJwt: anon.includes('.') && anon.split('.').length >= 3,
      anonKeyRef: (payload as any)?.ref,
      anonKeyRole: (payload as any)?.role,
      anonKeyIat: (payload as any)?.iat,
      anonKeyExp: (payload as any)?.exp,
      anonKeyLength: anon.length,
    })
  } catch {
    // ignore
  }
}

// Create typed Supabase client for Communities feature
export const supabaseClient = createClient<Database>(url as string, anon as string, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    redirectTo: redirectUrl || (typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined),
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: anon as string,
      Authorization: `Bearer ${anon as string}`,
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
});

// Debug: Verify client is initialized
if (typeof window !== 'undefined') {
  console.log('✅ supabaseClient initialized:', !!supabaseClient);
}

// Export site URL for use in auth flows
export const supabaseSiteUrl = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');

// Backwards compatibility: also export as 'supabase'
export const supabase = supabaseClient
export default supabaseClient
