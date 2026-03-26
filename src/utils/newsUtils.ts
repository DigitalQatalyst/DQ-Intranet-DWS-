import type { NewsItem } from '@/data/media/news';

/**
 * Format date to a readable string
 */
export const formatDate = (input: string): string => {
  if (!input) return '';
  try {
    return new Date(input).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return '';
  }
};

/**
 * Format date to short format (e.g., "Dec 19, 2025")
 */
export const formatDateShort = (input: string): string => {
  if (!input) return '';
  try {
    return new Date(input).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return '';
  }
};

/**
 * Format date to very short format (e.g., "Dec 19")
 */
export const formatDateVeryShort = (input: string): string => {
  if (!input) return '';
  try {
    return new Date(input).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return '';
  }
};

/**
 * Convert text to title case (not all caps)
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  // If already in title case or mixed case, return as is (but ensure not all caps)
  if (text === text.toUpperCase() && text.length > 3) {
    // Convert all caps to title case
    return text
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Handle special cases like "WFH", "DXB", "KSA", "NBO", "EoY"
        const acronyms = ['wfh', 'dxb', 'ksa', 'nbo', 'eoy', 'dq', 'hr', 'hra'];
        if (acronyms.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        // Capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  return text;
};

/**
 * Generate an appropriate title for news items that don't have one
 */
export const generateTitle = (item: NewsItem): string => {
  // Explicit overrides for specific items where we want a custom display title
  const titleOverrides: Record<string, string> = {
    'dq-scrum-master-structure-update': 'Updated Scrum Master Structure',
    'company-wide-lunch-break-schedule': 'Company-wide Lunch Break Schedule',
    'grading-review-program-grp': 'Grading Review Program (GRP)',
    'dq-storybook-latest-links': 'DQ Storybook (Latest Version and Links)',
    'dq-storybook-live': 'The DQ Storybook Goes Live!',
    'riyadh-horizon-hub': 'Riyadh Horizon Hub Opens',
  };

  if (item.id && titleOverrides[item.id]) {
    return titleOverrides[item.id];
  }

  // If title exists and is not empty, return it
  if (item.title?.trim()) {
    return toTitleCase(item.title.trim());
  }

  // Generate title based on available information
  const parts: string[] = [];

  // Add location prefix if available
  if (item.location) {
    const locationMap: Record<string, string> = {
      'Dubai': 'DXB',
      'Nairobi': 'NBO',
      'Riyadh': 'KSA',
      'Remote': 'Remote'
    };
    parts.push(locationMap[item.location] || item.location);
  }

  // Add type/newsType information
  if (item.newsType) {
    parts.push(item.newsType);
  } else if (item.type) {
    if (item.type === 'Thought Leadership') {
      parts.push('Blog');
    } else {
      parts.push(item.type);
    }
  }

  // Try to extract title from excerpt
  if (item.excerpt?.trim()) {
    const excerptWords = item.excerpt.trim().split(' ');
    if (excerptWords.length > 0) {
      // Take first 8 words and capitalize
      const titleFromExcerpt = excerptWords.slice(0, 8).join(' ');
      if (titleFromExcerpt.length > 20) {
        const generated = parts.length > 0 ? `${parts.join(' | ')} | ${titleFromExcerpt}` : titleFromExcerpt;
        return toTitleCase(generated);
      }
    }
  }

  // Try to extract from content if available
  if (item.content) {
    const firstLine = item.content.split('\n').find(line => line.trim() && !line.trim().startsWith('#'));
    if (firstLine) {
      const cleanLine = firstLine.trim().replace(/^#+\s+/, '').replace(/\*\*/g, '').substring(0, 60);
      if (cleanLine.length > 15) {
        const generated = parts.length > 0 ? `${parts.join(' | ')} | ${cleanLine}` : cleanLine;
        return toTitleCase(generated);
      }
    }
  }

  // Fallback based on ID patterns
  if (item.id) {
    const idParts = item.id.split('-');
    const meaningfulParts = idParts
      .filter(part => part.length > 2 && !['dq', 'the', 'and', 'for'].includes(part.toLowerCase()))
      .map(part => part.charAt(0).toUpperCase() + part.slice(1));
    
    if (meaningfulParts.length > 0) {
      const idTitle = meaningfulParts.join(' ');
      const generated = parts.length > 0 ? `${parts.join(' | ')} | ${idTitle}` : idTitle;
      return toTitleCase(generated);
    }
  }

  // Final fallback
  const typeLabel = item.type === 'Thought Leadership' ? 'Blog' : (item.newsType || item.type || 'Announcement');
  const generated = parts.length > 0 ? `${parts.join(' | ')} | ${typeLabel}` : typeLabel;
  return toTitleCase(generated);
};

/**
 * Get news type display information (label and color)
 */
export const getNewsTypeDisplay = (item: NewsItem): { label: string; color: string } => {
  // Check if this is a podcast first - podcasts should match blog styling
  const isPodcast = item.format === 'Podcast' || item.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  if (isPodcast) {
    return {
      label: 'Podcast',
      color: '#14B8A6' // Use same teal color as blogs for consistency
    };
  }
  // For blog articles (Thought Leadership), always show "Blog" with unique color
  if (item.type === 'Thought Leadership') {
    return {
      label: 'Blog',
      color: '#14B8A6' // Teal color for blogs
    };
  }
  
  const newsTypeColor: Record<NonNullable<NewsItem['newsType']>, string> = {
    'Policy Update': '#8B5CF6',        // Purple for policy/guidelines
    'Upcoming Events': '#F97316',      // Orange for events
    'Company News': '#0EA5E9',         // Blue for company news
    'Holidays': '#16A34A'              // Green for holidays/notices
  };

  const newsTypeLabel: Record<NonNullable<NewsItem['newsType']>, string> = {
    'Policy Update': 'Policy Update',
    'Upcoming Events': 'Upcoming Events',
    'Company News': 'Company News',
    'Holidays': 'Holidays'
  };

  if (item.newsType) {
    return {
      label: newsTypeLabel[item.newsType],
      color: newsTypeColor[item.newsType]
    };
  }
  
  // Fallback to type if newsType is missing
  const typeFallback: Record<NewsItem['type'], { label: string; color: string }> = {
    Announcement: { label: 'Company News', color: '#0EA5E9' },      // Blue
    Guidelines: { label: 'Policy Update', color: '#8B5CF6' },        // Purple
    Notice: { label: 'Holidays', color: '#16A34A' },                  // Green
    'Thought Leadership': { label: 'Blog', color: '#14B8A6' }         // Teal for blogs
  };
  
  // Return fallback if type exists, otherwise return default
  if (item.type && typeFallback[item.type]) {
    return typeFallback[item.type];
  }
  
  // Default fallback for any missing types
  return { label: 'Company News', color: '#0EA5E9' };
};

/**
 * Get fallback image based on item ID
 */
export const getFallbackImage = (itemId: string, fallbackImages: string[]): string => {
  if (!itemId || !fallbackImages.length) {
    return fallbackImages[0] || '';
  }
  const hash = Math.abs(itemId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
  return fallbackImages[hash % fallbackImages.length] || fallbackImages[0];
};

/**
 * Format time in seconds to mm:ss format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format duration string to readable format
 */
export const formatDuration = (readingTime?: string): string => {
  if (!readingTime) return '12 min';
  const durationMap: Record<string, string> = {
    '<5': '5 min',
    '5–10': '8 min',
    '10–20': '15 min',
    '20+': '20 min'
  };
  return durationMap[readingTime] || '12 min';
};

/**
 * Format listens/views count
 */
export const formatListens = (views: number): string => {
  if (views >= 1000) {
    const kValue = (views / 1000).toFixed(1);
    // Remove trailing .0 if present
    return `${kValue.replace(/\.0$/, '')}k listens`;
  }
  return `${views} listens`;
};

/**
 * Get the image source for a news item based on type, format, and newsType
 * This ensures cards and detail pages use the same images
 */
export const getNewsImageSrc = (
  item: NewsItem,
  fallbackImages: string[],
  fallbackHero?: string
): string => {
  // Use /image (7).jpg for blog articles (Thought Leadership)
  if (item.type === 'Thought Leadership') {
    return '/image (7).jpg';
  }
  // Use a single series image for all podcast articles (both series)
  if (item.format === 'Podcast' || item.tags?.some(tag => tag.toLowerCase().includes('podcast'))) {
    return '/image (12).png';
  }
  // Use a dedicated image for all announcement-style items shown in the
  // News & Announcements tab (Announcements, Guidelines, Notices)
  if (item.type === 'Announcement' || item.type === 'Guidelines' || item.type === 'Notice') {
    return '/image (6).jpg';
  }
  // Use specific images based on newsType
  if (item.newsType === 'Policy Update') {
    return '/policy update.png';
  }
  if (item.newsType === 'Upcoming Events') {
    return '/upcoming events.jpg';
  }
  if (item.newsType === 'Company News') {
    return '/company news.jpg';
  }
  if (item.newsType === 'Holidays') {
    // Holidays - use company news as fallback since no holidays image exists
    return '/company news.jpg';
  }
  // Fallback to type field if newsType is not set
  if (item.type === 'Guidelines') {
    return '/policy update.png';
  }
  if (item.type === 'Announcement') {
    return '/company news.jpg';
  }
  if (item.type === 'Notice') {
    return '/company news.jpg'; // Notice maps to Holidays, use company news
  }
  // Final fallback to item.image or getFallbackImage
  if (item.image) return item.image;
  return getFallbackImage(item.id, fallbackImages) || fallbackHero || '';
};

