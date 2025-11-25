import { PostgrestError } from '@supabase/supabase-js';
export async function safeFetch<T = any>(query: any): Promise<[T | null, PostgrestError | null]> {
  try {
    const {
      data,
      error
    } = await query;
      if (error) {
      // Only log unexpected errors - suppress common "not found" errors to reduce console noise
      const isExpectedError = 
        error.code === "PGRST116" || // No rows returned
        error.code === "PGRST301" || // Unauthorized (often RLS blocking non-existent resources)
        error.status === 404 || // Not found
        error.message?.includes("No rows") ||
        error.message?.includes("not found");
      
      // Always log 401/403 errors as they indicate authentication/authorization issues
      if (error.status === 401 || error.status === 403) {
        console.error('🔴 Authentication/Authorization error:', {
          status: error.status,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (!isExpectedError) {
        console.error('Supabase query error:', error);
      }
      return [null, error];
    }
    return [data as T, null];
  } catch (err) {
    console.error('Unexpected error:', err);
    return [null, err as PostgrestError];
  }
}