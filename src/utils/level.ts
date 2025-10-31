export const LEVEL_LABEL_TO_CODE: Record<string, string> = {
  "l1": "L1",
  "l1 – starting": "L1",
  "l1 - starting": "L1",
  "starting": "L1",
  "l2": "L2",
  "l2 – following": "L2",
  "l2 - following": "L2",
  "following": "L2",
  "l3": "L3",
  "l3 – assisting": "L3",
  "l3 - assisting": "L3",
  "assisting": "L3",
  "l4": "L4",
  "l4 – applying": "L4",
  "l4 - applying": "L4",
  "applying": "L4",
  "l5": "L5",
  "l5 – enabling": "L5",
  "l5 - enabling": "L5",
  "enabling": "L5",
  "l6": "L6",
  "l6 – ensuring": "L6",
  "l6 - ensuring": "L6",
  "ensuring": "L6",
  "l7": "L7",
  "l7 – influencing": "L7",
  "l7 - influencing": "L7",
  "influencing": "L7",
  "l8": "L8",
  "l8 – inspiring": "L8",
  "l8 - inspiring": "L8",
  "inspiring": "L8"
};

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/\u2013|\u2014/g, "-") // en/em dash -> hyphen
    .replace(/\s+/g, " ")
    .trim();

export const toLevelCode = (val?: string): string | undefined => {
  if (!val) return undefined;
  const v = clean(val);
  return (
    LEVEL_LABEL_TO_CODE[v] || (/^l[1-8]$/.test(v) ? v.toUpperCase() : undefined)
  );
};

export const toLevelCodes = (vals?: string[]): string[] =>
  (vals || []).map(toLevelCode).filter(Boolean) as string[];

// Legacy level mapping
export const LEGACY_LEVEL_MAP: Record<string, string[]> = {
  foundation: ["L1", "L2"],
  practitioner: ["L3", "L4"],
  professional: ["L5", "L6"],
  specialist: ["L7", "L8"]
};

export const legacyLevelToCodes = (legacy?: string): string[] | undefined => {
  if (!legacy) return undefined;
  return LEGACY_LEVEL_MAP[legacy.toLowerCase()];
};



