const MEDIA_SEEN_STORAGE_KEY = 'dq-media-center-seen-items';

type MediaKind = 'news' | 'job';

interface MediaSeenData {
  news: string[];
  jobs: string[];
}

/**
 * Mark a media item as seen in localStorage
 */
export const markMediaItemSeen = (kind: MediaKind, id: string): void => {
  if (typeof window === 'undefined' || !id) return;
  try {
    const raw = window.localStorage.getItem(MEDIA_SEEN_STORAGE_KEY);
    let seen: MediaSeenData = { news: [], jobs: [] };
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MediaSeenData>;
      seen = {
        news: parsed.news ?? [],
        jobs: parsed.jobs ?? []
      };
    }

    const key = kind === 'news' ? 'news' : 'jobs';
    if (!seen[key].includes(id)) {
      seen[key] = [...seen[key], id];
      window.localStorage.setItem(MEDIA_SEEN_STORAGE_KEY, JSON.stringify(seen));
    }
  } catch {
    // Ignore storage errors
  }
};

/**
 * Get seen media items from localStorage
 */
export const getSeenMediaItems = (): MediaSeenData => {
  if (typeof window === 'undefined') {
    return { news: [], jobs: [] };
  }
  try {
    const raw = window.localStorage.getItem(MEDIA_SEEN_STORAGE_KEY);
    if (!raw) return { news: [], jobs: [] };
    const parsed = JSON.parse(raw) as Partial<MediaSeenData>;
    return {
      news: parsed.news ?? [],
      jobs: parsed.jobs ?? []
    };
  } catch {
    return { news: [], jobs: [] };
  }
};

