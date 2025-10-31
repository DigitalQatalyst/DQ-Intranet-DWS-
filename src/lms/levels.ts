import { LEVELS, LevelCode } from './config';

const dashRegex = /\u2013|\u2014/g;

const clean = (input: string) =>
  input
    .toLowerCase()
    .replace(dashRegex, '-')
    .replace(/\s+/g, ' ')
    .trim();

const stripLevelPrefix = (label: string) =>
  label.replace(/^l[1-8]\s*(?:-|\u2013|\u2014)?\s*/i, '');

const CODE_SET = new Set<LevelCode>(LEVELS.map(level => level.code));

const aliasTable: Record<string, LevelCode> = {};

LEVELS.forEach(level => {
  const codeLower = level.code.toLowerCase();
  aliasTable[codeLower] = level.code;
  aliasTable[clean(level.label)] = level.code;
  aliasTable[clean(stripLevelPrefix(level.label))] = level.code;
  aliasTable[clean(level.label.replace(/[-\u2013\u2014]/g, ' '))] = level.code;
});

const legacyRanges: Record<string, LevelCode[]> = {
  foundation: ['L1', 'L2'],
  practitioner: ['L3', 'L4'],
  professional: ['L5', 'L6'],
  specialist: ['L7', 'L8']
};

export const levelLabelFromCode = (code: LevelCode): string =>
  LEVELS.find(level => level.code === code)?.label ?? code;

export const levelShortLabelFromCode = (code: LevelCode): string => {
  const label = levelLabelFromCode(code);
  return label.replace(' – ', ' · ');
};

export const normalizeLevel = (value?: string): LevelCode | undefined => {
  if (!value) return undefined;
  const cleaned = clean(value);
  if (!cleaned) return undefined;
  if (/^l[1-8]$/.test(cleaned)) {
    return cleaned.toUpperCase() as LevelCode;
  }
  const aliasMatch = aliasTable[cleaned];
  if (aliasMatch) {
    return aliasMatch;
  }
  const compact = cleaned.replace(/\s*-\s*/g, '-');
  return aliasTable[compact];
};

export const expandLegacyLevel = (value?: string): LevelCode[] => {
  if (!value) return [];
  const cleaned = clean(value);
  return legacyRanges[cleaned] ?? [];
};

export const normalizeLevels = (values?: string[]): LevelCode[] => {
  const result: LevelCode[] = [];
  (values || []).forEach(value => {
    const normalized = normalizeLevel(value);
    if (normalized && CODE_SET.has(normalized) && !result.includes(normalized)) {
      result.push(normalized);
      return;
    }
    const legacy = expandLegacyLevel(value);
    legacy.forEach(code => {
      if (!result.includes(code)) {
        result.push(code);
      }
    });
  });
  return result;
};

export const LEGACY_LEVEL_MAP = legacyRanges;
