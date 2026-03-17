import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, Share2, BookmarkIcon } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { generateTitle, getNewsImageSrc } from '@/utils/newsUtils';
import { formatDate } from '@/utils/newsUtils';

const fallbackHero = 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';
const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

interface HeroSectionProps {
  article: NewsItem;
  location: { search: string };
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  article, 
  location, 
  isBookmarked, 
  onBookmarkToggle 
}) => {
  const imageSrc = getNewsImageSrc(article, fallbackImages, fallbackHero);
  const announcementDate = article.date ? formatDate(article.date) : '';
  const mediaCenterUrl = (() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab ? `/marketplace/opportunities?tab=${tab}` : '/marketplace/opportunities';
  })();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  };

  return (
    <section className="relative min-h-[320px] md:min-h-[400px] flex flex-col" aria-labelledby="article-title">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${imageSrc}")`,
          filter: 'blur(2px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/85 to-slate-900/90" />
      
      <div className="relative z-10 w-full pt-4">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Link to="/" className="hover:text-white hover:underline transition-colors">
                Home
              </Link>
              <ChevronRightIcon size={16} />
              <Link to={mediaCenterUrl} className="hover:text-white hover:underline transition-colors">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} />
              <span className="text-white font-medium">{generateTitle(article)}</span>
            </div>
            <div className="flex gap-2 text-sm">
              <button 
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Share article"
              >
                <Share2 size={16} />
                Share
              </button>
              <button 
                type="button"
                onClick={onBookmarkToggle}
                className={`inline-flex items-center gap-1 rounded-lg border border-white/30 backdrop-blur-sm px-3 py-2 transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'bg-white/20 text-white border-white/40' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
              >
                <BookmarkIcon size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-24 w-full flex-1 flex items-center">
        <div className="max-w-4xl w-full">
          <div className="text-white/90 text-sm mb-4">
            {announcementDate}
          </div>
          <h1 id="article-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 break-words">
            {generateTitle(article)}
          </h1>
        </div>
      </div>
    </section>
  );
};
