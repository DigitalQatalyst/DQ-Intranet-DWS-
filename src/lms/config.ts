export const LOCATION_ALLOW = [
  'Dubai',
  'Nairobi',
  'Riyadh',
  'Remote'
] as const;

export type AllowedLocation = (typeof LOCATION_ALLOW)[number];

export const LEVELS = [
  { code: 'L0', label: 'L0 – Starting (Learning)' },
  { code: 'L1', label: 'L1 – Follow (Self Aware)' },
  { code: 'L2', label: 'L2 – Following' },
  { code: 'L3', label: 'L3 – Assisting' },
  { code: 'L4', label: 'L4 – Applying' },
  { code: 'L5', label: 'L5 – Enabling' },
  { code: 'L6', label: 'L6 – Ensuring' },
  { code: 'L7', label: 'L7 – Influencing' },
  { code: 'L8', label: 'L8 – Inspiring' }
] as const;

export type LevelCode = (typeof LEVELS)[number]['code'];

export const SFIA_LEVELS = [
  { code: 'L0', label: 'L0. Starting (Learning)' },
  { code: 'L1', label: 'L1. Follow (Self Aware)' },
  { code: 'L2', label: 'L2. Assist (Self Lead)' },
  { code: 'L3', label: 'L3. Apply (Drive Squad)' },
  { code: 'L4', label: 'L4. Enable (Drive Team)' },
  { code: 'L5', label: 'L5. Ensure (Steer Org)' },
  { code: 'L6', label: 'L6. Influence (Steer Cross)' },
  { code: 'L7', label: 'L7. Inspire (Inspire Market)' }
] as const;

export type SfiaLevelCode = (typeof SFIA_LEVELS)[number]['code'];

export const CATEGORY_OPTS = [
  'GHC',
  '6x Digital',
  'DWS',
  'DXP',
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
