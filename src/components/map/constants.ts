export type MarkerColorKey =
  | 'Headquarters'
  | 'Regional Office'
  | 'Client'
  | 'Authority'
  | 'Bank'
  | 'Utility'
  | 'Default';

export const MARKER_COLORS: Record<MarkerColorKey, string> = {
  Headquarters: '#030F35', // DQ Navy
  'Regional Office': '#6366F1',
  Client: '#FB5535', // DQ Orange
  Authority: '#FB5535', // DQ Orange
  Bank: '#FB5535', // DQ Orange
  Utility: '#FB5535', // DQ Orange
  Default: '#4B5563',
};

