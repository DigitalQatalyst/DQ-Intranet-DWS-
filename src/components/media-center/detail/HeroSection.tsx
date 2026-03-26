import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { generateTitle, getNewsTypeDisplay } from '@/utils/newsUtils';

interface HeroSectionProps {
  article: NewsItem;
  location: { search: string };
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ article, location }) => {
  const mediaCenterUrl = (() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab ? `/marketplace/media-center?tab=${tab}` : '/marketplace/media-center';
  })();

  const badge = getNewsTypeDisplay(article).label;

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden pt-4 pb-16 px-6"
        style={{ background: '#081540' }}
      >
        {/* Mesh glow orb */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #2a2f8f 0%, transparent 70%)' }}
          />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '130px',
            background: 'linear-gradient(to bottom, transparent 0%, #1a2a6e 20%, #6b7ab5 55%, #b8bccf 80%, #ffffff 100%)',
          }}
        />

        <div className="container mx-auto relative z-10" style={{ maxWidth: '1336px' }}>
          {/* Breadcrumb + Actions row */}
          <div className="flex items-center justify-between" style={{ height: '60px' }}>
            <nav className="flex items-center gap-2 text-sm">
              <Home className="h-3.5 w-3.5 text-hero-foreground/50" />
              <Link to="/" className="text-hero-foreground/50 hover:text-hero-foreground/80 transition-colors">
                Home
              </Link>
              <span className="text-hero-foreground/30">/</span>
              <Link to={mediaCenterUrl} className="text-hero-foreground/50 hover:text-hero-foreground/80 transition-colors">
                Media Center
              </Link>
              <span className="text-hero-foreground/30">/</span>
              <span className="font-medium text-hero-foreground/80">{badge}</span>
            </nav>

            <div className="flex items-center gap-1.5" />
          </div>

          {/* Glassmorphism content panel */}
          <div
            className="backdrop-blur-xl bg-hero-foreground/[0.07] border border-hero-foreground/[0.12] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            style={{ minHeight: '160px', display: 'flex', alignItems: 'center', padding: '32px 48px' }}
          >
            <div className="space-y-3">
              {/* Title */}
              <h1
                id="article-title"
                className="text-2xl font-bold tracking-tight text-hero-foreground md:text-3xl lg:text-4xl"
              >
                {generateTitle(article)}
              </h1>

              {/* Description */}
              {article.excerpt && (
                <p className="max-w-2xl text-base leading-relaxed text-hero-foreground/70">
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
