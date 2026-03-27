/**
 * Glossary Filter Constants
 * Single source of truth for filter options
 * These values must match exactly with Supabase data
 */

export const GLOSSARY_CATEGORIES = [
  { id: 'frameworks-models', name: 'Frameworks & Models' },
  { id: 'ways-of-working', name: 'Ways of Working' },
  { id: 'governance-systems', name: 'Governance & Systems' },
  { id: 'platforms-tools', name: 'Platforms & Tools' },
  { id: 'metrics-performance', name: 'Metrics & Performance' },
  { id: 'roles-structures', name: 'Roles & Structures' },
] as const;

export const GLOSSARY_USED_IN = [
  { id: 'dws-core', name: 'DWS Core' },
  { id: 'l24-working-rooms', name: 'L24 Working Rooms' },
  { id: 'learning-center', name: 'Learning Center' },
  { id: 'marketplaces', name: 'Marketplaces' },
  { id: 'governance', name: 'Governance' },
] as const;

export const GLOSSARY_STATUS = [
  { id: 'active', name: 'Active' },
  { id: 'deprecated', name: 'Deprecated' },
] as const;

// Category IDs (for filtering)
export const CATEGORY_IDS = GLOSSARY_CATEGORIES.map(c => c.id);
export type CategoryId = typeof CATEGORY_IDS[number];

// Used In IDs (for filtering)
export const USED_IN_IDS = GLOSSARY_USED_IN.map(u => u.id);
export type UsedInId = typeof USED_IN_IDS[number];

// Status values (as stored in database)
export const STATUS_VALUES = ['Active', 'Deprecated'] as const;
export type StatusValue = typeof STATUS_VALUES[number];

