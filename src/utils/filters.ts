import type { LmsCard } from "../data/lmsCourses";

export type Facets = {
  category?: string[];      // courseCategory
  delivery?: string[];      // deliveryMode
  duration?: string[];      // duration
  level?: string[];         // L1..L8
  location?: string[];      // Dubai,Nairobi,Global,Remote
  audience?: string[];      // Associate,Lead
  status?: string[];        // live,coming-soon
  dept?: string[];          // DCO,DBP
};

export const parseFacets = (sp: URLSearchParams): Facets => {
  const get = (k: string) => {
    const val = sp.get(k);
    return val ? val.split(",").filter(Boolean) : undefined;
  };
  const f: Facets = {
    category: get("category"),
    delivery: get("delivery"),
    duration: get("duration"),
    level: get("level"),
    location: get("location"),
    audience: get("audience"),
    status: get("status"),
    dept: get("department"),
  };

  // legacy → SOFIA mapping for back-compat
  const legacy = sp.get("legacyLevel");
  if (!f.level && legacy) {
    const map: Record<string, string[]> = {
      foundation: ["L1", "L2"],
      practitioner: ["L3", "L4"],
      professional: ["L5", "L6"],
      specialist: ["L7", "L8"]
    };
    f.level = map[legacy.toLowerCase()];
  }
  return f;
};

const hasAny = (vals?: string[], selected?: string[]) =>
  !selected?.length || (vals || []).some(v => selected.includes(v));

const inOne = (val?: string, selected?: string[]) =>
  !selected?.length || (val && selected.includes(val));

export const filterCourses = (items: LmsCard[], f: Facets): LmsCard[] =>
  items.filter(it => {
    // Normalize category names for matching
    const normalizeCategory = (cat: string) => {
      const map: Record<string, string[]> = {
        'ghc': ['ghc'],
        '6xd': ['6xd', '6x digital'],
        'dws': ['dws'],
        'dxp': ['dxp'],
        'day-in-dq': ['day in dq', 'dayindq'],
        'key-tools': ['key tools', 'keytools']
      };
      const entry = Object.entries(map).find(([, aliases]) => 
        aliases.includes(cat.toLowerCase())
      );
      return entry ? entry[0] : cat.toLowerCase();
    };
    
    const itemCategory = normalizeCategory(it.courseCategory || '');
    const selectedCategories = f.category?.map(normalizeCategory) || [];
    const categoryMatch = !f.category?.length || selectedCategories.some(sel => 
      itemCategory === sel || itemCategory.includes(sel) || sel.includes(itemCategory)
    );
    
    if (!categoryMatch) return false;
    
    // Case-insensitive matching for other fields
    const lower = (s?: string) => s?.toLowerCase() || '';
    const lowerArray = (arr?: string[]) => arr?.map(lower) || [];
    
    return (
      inOne(lower(it.deliveryMode), lowerArray(f.delivery)) &&
      inOne(lower(it.duration), lowerArray(f.duration)) &&
      inOne(it.levelCode?.toUpperCase(), f.level?.map(l => l.toUpperCase())) &&
      // Location: treat empty as "Global"
      hasAny(it.locations?.length ? it.locations.map(l => l.toLowerCase()) : ["global"], lowerArray(f.location)) &&
      hasAny(it.audience?.map(lower), lowerArray(f.audience)) &&
      hasAny((it as any).department?.map(lower), lowerArray(f.dept)) &&
      inOne(lower(it.status), lowerArray(f.status))
    );
  });
