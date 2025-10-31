import { LOCATION_ALLOW, LevelCode } from './config';
import { normalizeLevels, expandLegacyLevel } from './levels';

export type Facets = {
  category?: string[];
  delivery?: string[];
  duration?: string[];
  level?: LevelCode[];
  location?: string[];
  audience?: string[];
  status?: string[];
  department?: string[];
  owner?: string[];
  track?: string[];
};

const allowedLocationSet = new Set<string>(LOCATION_ALLOW);

export const parseFacets = (sp: URLSearchParams): Facets => {
  const list = (k: string) => sp.get(k)?.split(',').filter(Boolean);
  const levelRaw = list('level');
  const locationRaw = list('location');

  const normalizedLevels = normalizeLevels(levelRaw);

  const facets: Facets = {
    category: list('category'),
    delivery: list('delivery'),
    duration: list('duration'),
    level: normalizedLevels,
    location: (locationRaw || []).filter(v => allowedLocationSet.has(v)),
    audience: list('audience'),
    status: list('status'),
    department: list('department'),
    owner: list('owner'),
    track: list('track')
  };

  if (!facets.level?.length) {
    const legacy = sp.get('legacyLevel') ?? sp.get('levelLegacy');
    if (legacy) {
      facets.level = expandLegacyLevel(legacy);
    }
  }

  return facets;
};

const inOne = (value?: string, selected?: string[]) =>
  !selected?.length || (!!value && selected.includes(value));

const hasAny = (values?: string[], selected?: string[]) =>
  !selected?.length ||
  (values || []).some(v => selected.includes(v));

export const applyFilters = <
  T extends {
    courseCategory?: string;
    deliveryMode?: string;
    duration?: string;
    levelCode?: string;
    locations?: string[];
    audience?: string[];
    status?: string;
    department?: string[];
    owner?: string;
  }
>(
  items: T[],
  facets: Facets
): T[] =>
  items.filter(item => {
    const locations = item.locations && item.locations.length
      ? item.locations
      : ['Global'];
    const locationMatches =
      !facets.location?.length ||
      locations.some(location => {
        if (location === 'Global') {
          // Global courses should match any selected location
          return true;
        }
        return facets.location?.includes(location);
      });

    return (
      inOne(item.courseCategory, facets.category) &&
      inOne(item.deliveryMode, facets.delivery) &&
      inOne(item.duration, facets.duration) &&
      inOne(item.levelCode, facets.level as unknown as string[]) &&
      locationMatches &&
      hasAny(item.audience, facets.audience) &&
      hasAny(
        Array.isArray(item.department) ? item.department : [],
        facets.department
      ) &&
      inOne(item.owner, facets.owner) &&
      inOne(item.status, facets.status)
    );
  });
