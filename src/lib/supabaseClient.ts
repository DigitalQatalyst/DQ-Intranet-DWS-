import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/communities/integrations/supabase/types';

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
