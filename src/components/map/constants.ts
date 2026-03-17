export type MarkerColorKey =
  | 'Headquarters'
  | 'Regional Office'
  | 'Client'
  | 'Authority'
  | 'Bank'
  | 'Utility'
  | 'Default';

export const MARKER_COLORS: Record<MarkerColorKey, string> = {
  Headquarters: '#162862', // DWS Primary Dark Blue
  'Regional Office': '#162862',
  Client: '#162862',
  Authority: '#162862',
  Bank: '#162862',
  Utility: '#162862',
  Default: '#162862',
};

