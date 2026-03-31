import { useState, useEffect } from 'react';

export function useEngagementMetrics(id: string | undefined, articleId?: string | null) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(0);

  // Load likes and views, and interaction state from localStorage
  useEffect(() => {
    if (!id) return;
    
    try {
      const storedLikes = localStorage.getItem(`news-likes-${id}`);
      const storedViews = localStorage.getItem(`news-views-${id}`);
      const storedHasLiked = localStorage.getItem(`news-hasLiked-${id}`);
      
      if (storedLikes) {
        setLikes(parseInt(storedLikes, 10) || 0);
      }
      if (storedViews) {
        setViews(parseInt(storedViews, 10) || 0);
      }
      if (storedHasLiked === 'true') {
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error loading engagement data:', error);
    }
  }, [id]);

  // Track page view - increment views when article loads
  useEffect(() => {
    if (!id || !articleId) return;
    
    try {
      const viewKey = `news-viewed-${id}`;
      const hasViewed = sessionStorage.getItem(viewKey);
      
      if (!hasViewed) {
        setViews(prev => {
          const newViews = prev + 1;
          localStorage.setItem(`news-views-${id}`, newViews.toString());
          sessionStorage.setItem(viewKey, 'true');
          return newViews;
        });
      } else {
        const storedViews = localStorage.getItem(`news-views-${id}`);
        if (storedViews) {
          setViews(parseInt(storedViews, 10) || 0);
        }
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [id, articleId]);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    if (!id) return;
    try {
      localStorage.setItem(`news-likes-${id}`, likes.toString());
    } catch (error) {
      console.error('Error saving likes:', error);
    }
  }, [id, likes]);

  const handleLike = () => {
    if (!id) return;
    
    if (!hasLiked) {
      setLikes(prev => {
        const newLikes = prev + 1;
        try {
          localStorage.setItem(`news-likes-${id}`, newLikes.toString());
        } catch (error) {
          console.error('Error saving like count:', error);
        }
        return newLikes;
      });
      setHasLiked(true);
      try {
        localStorage.setItem(`news-hasLiked-${id}`, 'true');
      } catch (error) {
        console.error('Error saving like state:', error);
      }
    } else {
      setLikes(prev => {
        const newLikes = Math.max(0, prev - 1);
        try {
          localStorage.setItem(`news-likes-${id}`, newLikes.toString());
        } catch (error) {
          console.error('Error saving like count:', error);
        }
        return newLikes;
      });
      setHasLiked(false);
      try {
        localStorage.removeItem(`news-hasLiked-${id}`);
      } catch (error) {
        console.error('Error saving unlike state:', error);
      }
    }
  };

  return { likes, hasLiked, views, handleLike };

}
