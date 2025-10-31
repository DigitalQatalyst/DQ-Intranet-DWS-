export const LOCATION_ALLOW = [
  'Dubai',
  'Nairobi',
  'Global',
  'Remote'
] as const;

export type AllowedLocation = (typeof LOCATION_ALLOW)[number];

export const LEVELS = [
  { code: 'L1', label: 'L1 – Starting' },
  { code: 'L2', label: 'L2 – Following' },
  { code: 'L3', label: 'L3 – Assisting' },
  { code: 'L4', label: 'L4 – Applying' },
  { code: 'L5', label: 'L5 – Enabling' },
  { code: 'L6', label: 'L6 – Ensuring' },
  { code: 'L7', label: 'L7 – Influencing' },
  { code: 'L8', label: 'L8 – Inspiring' }
] as const;

export type LevelCode = (typeof LEVELS)[number]['code'];

export const CATEGORY_OPTS = [
  'GHC',
  '6x Digital',
  'DWS',
  'DXP',
  'Day in DQ',
  'Key Tools'
] as const;

export const DELIVERY_OPTS = [
  'Video',
  'Guide',
  'Workshop',
  'Hybrid',
  'Online'
] as const;

export const DURATION_OPTS = [
  'Bite-size',
  'Short',
  'Medium',
  'Long'
] as const;
