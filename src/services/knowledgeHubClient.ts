import { createClient } from '@supabase/supabase-js';

const knowledgeHubUrl = import.meta.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const knowledgeHubAnonKey = import.meta.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;

if (!knowledgeHubUrl || !knowledgeHubAnonKey) {
  console.warn('Knowledge Hub Supabase credentials not found. Using fallback data.');
}

export const knowledgeHubSupabase = knowledgeHubUrl && knowledgeHubAnonKey 
  ? createClient(knowledgeHubUrl, knowledgeHubAnonKey, {
      auth: {
        storageKey: 'supabase-auth-knowledge-hub',
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export const getKnowledgeHubClient = () => {
  if (!knowledgeHubSupabase) {
    throw new Error('Knowledge Hub Supabase client not initialized');
  }
  return knowledgeHubSupabase;
};
