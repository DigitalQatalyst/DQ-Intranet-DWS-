import { useState, useEffect } from 'react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews, fetchNewsById } from '@/services/mediaCenterService';
import { markMediaItemSeen } from '@/utils/mediaTracking';

export function useArticleData(id: string | undefined) {
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadArticle() {
      setIsLoading(true);
      try {
        const [item, allNews] = await Promise.all([fetchNewsById(id || ''), fetchAllNews()]);
        if (!isMounted) return;
        setArticle(item);
        
        // Filter related articles based on current article type
        let filteredRelated = allNews.filter((newsItem) => newsItem.id !== id);
        
        // If current article is a blog, only show other blogs
        if (item && item.type === 'Thought Leadership' && item.format !== 'Podcast') {
          filteredRelated = filteredRelated.filter(
            (newsItem) => newsItem.type === 'Thought Leadership' && newsItem.format !== 'Podcast'
          );
        }
        
        setRelated(filteredRelated.slice(0, 6));
        if (item) {
          markMediaItemSeen('news', item.id);
        }
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        setLoadError('Unable to load this article right now.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { article, related, isLoading, loadError };
}
