import React, { useMemo } from 'react';
import { BookmarkIcon, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';

export interface MarketplaceItemProps {
  item: {
    id: string;
    slug?: string;
    title: string;
    description: string;
    provider: {
      name: string;
      logoUrl: string;
    };
    tags?: string[];
    category?: string;
    courseCategory?: string;
    deliveryMode?: string;
    imageUrl?: string;
    levelCode?: string;
    durationMinutes?: number;
    duration?: string;
    [key: string]: any;
  };
  marketplaceType: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onQuickView: () => void;
}

export const MarketplaceCard: React.FC<MarketplaceItemProps> = ({
  item,
  marketplaceType,
  isBookmarked,
  onToggleBookmark,
  onQuickView
}) => {
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marketplaceType === 'courses') {
      const slug = item.slug || item.id;
      navigate(`/lms/${slug}`);
      return;
    }

    // Service Center / Digital Worker items
    if (marketplaceType === 'non-financial' && item.category === 'Digital Worker') {
      return 'View Details';
    }

    if (marketplaceType === 'non-financial' && item.category === 'AI Tools') {
      return 'Request Tool';
    }

    // Fallback to marketplace-level default
    return config.primaryCTA;
  };

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.lmsUrl) {
      window.open(item.lmsUrl, '_blank', 'noopener');
      return;
    }
    if (marketplaceType === 'courses' || item.slug) {
      const slug = item.slug || item.id;
      navigate(`/lms/${slug}`);
      return;
    }
    navigate(`${config.route}/${item.id}?action=true`);
  };

  // Calculate lessons/modules count for courses
  const courseStats = useMemo(() => {
    const curriculum = item.curriculum || item.raw?.curriculum;
    if (!curriculum || !Array.isArray(curriculum)) return null;

    let totalLessons = 0;
    let totalModules = 0;

    curriculum.forEach((module: any) => {
      totalModules += 1;
      if (module.lessons && Array.isArray(module.lessons)) {
        totalLessons += module.lessons.length;
      }
      if (module.topics && Array.isArray(module.topics)) {
        module.topics.forEach((topic: any) => {
          if (topic.lessons && Array.isArray(topic.lessons)) {
            totalLessons += topic.lessons.length;
          }
        });
      }
    });

    return { totalLessons, totalModules };
  }, [item]);

  const durationLabel = item.duration || '';

  const categoryLabel = item.courseCategory || item.category || (Array.isArray(item.tags) ? item.tags[0] : null);

  const isComingSoon = item.status === 'coming-soon';

  return (
    <div
      className={`group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 transform ${isComingSoon
        ? 'opacity-75 grayscale-[0.5] cursor-not-allowed'
        : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
        }`}
      onClick={isComingSoon ? undefined : onQuickView}
    >
      {/* Course Image & Overlay Badge */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${!isComingSoon && 'group-hover:scale-105'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <BookOpen size={48} className="text-gray-200" />
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4">
          {categoryLabel && (
            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-bold tracking-widest uppercase text-purple-700 shadow-sm border border-white/20">
              {categoryLabel}
            </span>
          )}
        </div>

        {isComingSoon && (
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-bold tracking-widest uppercase shadow-sm">
              Coming Soon
            </span>
          </div>
        )}

        {/* Bookmark Button Overlay */}
        {!isComingSoon && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              className={`p-2 rounded-full backdrop-blur-md ${isBookmarked ? 'bg-amber-500/90 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
            >
              <BookmarkIcon size={16} className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>
        )}
      </div>

      <div className="px-5 py-6 flex-grow flex flex-col">
        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 leading-tight transition-colors ${isComingSoon ? 'text-gray-500' : 'text-[#1E293B] group-hover:text-blue-600'
          }`}>
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#64748B] line-clamp-3 mb-6 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-[#64748B] text-sm font-medium mb-1">
          {durationLabel && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{durationLabel}</span>
            </div>
          )}

          {(durationLabel && courseStats?.totalLessons) ? <span className="text-gray-300 text-lg">·</span> : null}

          {courseStats && courseStats.totalLessons > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} />
              <span>{courseStats.totalLessons} Lessons</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-6">
        <div className="flex gap-3">
          <button
            onClick={isComingSoon ? undefined : handleViewDetails}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors ${isComingSoon
              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              : 'text-[#1E293B] bg-white border border-[#E2E8F0] hover:bg-gray-50'
              }`}
          >
            {isComingSoon ? 'Not Available' : 'View Details'}
          </button>
          <button
            onClick={isComingSoon ? undefined : handlePrimaryAction}
            className={`flex-1 px-4 py-2.5 text-xs font-bold text-white rounded-xl transition-colors shadow-sm ${isComingSoon
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#030F35] hover:bg-[#030F35]/90 shadow-blue-900/10'
              }`}
          >
            {isComingSoon ? 'Coming Soon' : 'Start Learning'}
          </button>
        </div>
      </div>
    </div>
  );
};
