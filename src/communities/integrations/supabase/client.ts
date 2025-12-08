// ⚠️ DEPRECATED: This file is deprecated and will be removed.
// Please use the centralized client from @/lib/supabaseClient instead.
// This file is kept only for backward compatibility and type exports.

// Re-export types for backward compatibility
export type { Database } from './types';

// Re-export the centralized client
export { supabase, supabaseClient } from '@/lib/supabaseClient';
