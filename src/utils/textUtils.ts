export const truncateWords = (input: string, maxWords: number): string => {
  if (!input || maxWords <= 0) return '';
  const words = input.trim().split(/\s+/);
  if (words.length <= maxWords) return input.trim();
  return words.slice(0, maxWords).join(' ');
};

export const toTitleCase = (input: string): string => {
  if (!input) return '';
  const acronyms = new Set(['dq', 'dxb', 'ksa', 'nbo', 'wfh', 'eoy', 'hr', 'hra']);
  const smallWords = new Set(['and', 'or', 'for', 'of', 'the', 'a', 'an', 'to', 'in', 'on', 'at', 'by', 'with']);

  return input
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (acronyms.has(lower)) {
        return word.toUpperCase();
      }
      const cleaned = lower;
      if (index !== 0 && smallWords.has(cleaned)) {
        return cleaned;
      }
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join(' ');
};

export const buildShortTitle = (input: string, maxWords = 5): string => {
  if (!input || maxWords <= 0) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  let primary = trimmed;
  const pipeIndex = primary.indexOf('|');
  if (pipeIndex !== -1) {
    primary = primary.slice(0, pipeIndex);
  } else {
    const colonIndex = primary.indexOf(':');
    if (colonIndex !== -1) {
      primary = primary.slice(0, colonIndex);
    }
  }

  const words = primary.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return toTitleCase(primary);
  }

  const stopwords = new Set([
    'and', 'or', 'for', 'of', 'the', 'a', 'an', 'to', 'in', 'on', 'at', 'by', 'with',
    'from', 'into', 'over', 'under', 'about', 'after', 'before', 'between', 'through',
    'how', 'is', 'are', 'your', 'our'
  ]);

  const cleanWord = (word: string): string =>
    word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');

  const contentWords: string[] = [];
  for (const word of words) {
    const clean = cleanWord(word);
    if (!clean) continue;
    if (!stopwords.has(clean.toLowerCase())) {
      contentWords.push(clean);
    }
  }

  let shortWords: string[];
  if (contentWords.length >= 2) {
    shortWords = contentWords.slice(0, maxWords);
  } else {
    shortWords = words
      .map(cleanWord)
      .filter(Boolean)
      .slice(0, maxWords);
  }

  return toTitleCase(shortWords.join(' '));
};
