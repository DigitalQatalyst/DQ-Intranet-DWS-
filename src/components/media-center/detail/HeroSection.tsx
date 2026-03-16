import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Share2, Bookmark } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { generateTitle, getNewsTypeDisplay, formatDate } from '@/utils/newsUtils';

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
  const announcementDate = article.date ? formatDate(article.date) : '';
  const mediaCenterUrl = (() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab ? `/marketplace/media-center?tab=${tab}` : '/marketplace/media-center';
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
    <div className="relative hero-section" style={{ zIndex: 1 }}>
      <div 
        className="relative overflow-visible px-6"
        style={{
          background: 'linear-gradient(to bottom, #0f2055 0%, #0f2055 35%, #122461 50%, rgba(18, 36, 97, 0.7) 65%, rgba(255, 255, 255, 0.15) 78%, rgba(255, 255, 255, 0.45) 88%, rgba(255, 255, 255, 0.75) 95%, #ffffff 100%)',
          paddingTop: '1rem',
          paddingBottom: '180px',
        }}
      >
        {/* Subtle Mesh Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div 
            className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(91, 142, 255, 0.4), transparent 70%)' }}
          />
          <div 
            className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(0, 177, 133, 0.3), transparent 70%)' }}
          />
          <div 
            className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(87, 211, 255, 0.3), transparent 70%)' }}
          />
        </div>

        <div className="container mx-auto relative z-10" style={{ maxWidth: '1336px' }}>
          {/* Breadcrumb */}
          <div className="pb-6">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-white/70 hover:text-white/90 transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <Link to={mediaCenterUrl} className="text-white/70 hover:text-white/90 transition-colors">
                Media Center
              </Link>
              <span className="text-white/40">/</span>
              <span className="font-medium text-white/90">{getNewsTypeDisplay(article).label}</span>
            </div>
          </div>

          {/* Content Panel - 1336px x 220px */}
          <div 
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="space-y-1.5">
              {/* Title */}
              <h1 
                id="article-title" 
                className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl"
              >
                {generateTitle(article)}
              </h1>

              {/* Description */}
              {article.excerpt && (
                <p className="max-w-2xl text-sm leading-relaxed text-white/80">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
