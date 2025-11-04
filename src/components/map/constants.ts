export type MarkerColorKey =
  | 'Headquarters'
  | 'Regional Office'
  | 'Client'
  | 'Authority'
  | 'Bank'
  | 'Utility'
  | 'Default';

export const MARKER_COLORS: Record<MarkerColorKey, string> = {
  Headquarters: '#2559FF',
  'Regional Office': '#6366F1',
  Client: '#EC4899',
  Authority: '#F97316',
  Bank: '#10B981',
  Utility: '#FACC15',
  Default: '#4B5563',
};

