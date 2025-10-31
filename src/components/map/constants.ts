export type MarkerColorKey =
  | 'Headquarters'
  | 'Regional Office'
  | 'Client'
  | 'Authority'
  | 'Default';

export const MARKER_COLORS: Record<MarkerColorKey, string> = {
  Headquarters: '#0B122B',
  'Regional Office': '#6C63FF',
  Client: '#3BA2FF',
  Authority: '#F4A340',
  Default: '#4B5563',
};


