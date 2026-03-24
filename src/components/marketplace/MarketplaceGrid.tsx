import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PromoCard } from '../PromoCard';
import { MarketplaceCard } from './MarketplaceCard';
import { KnowledgeHubCard } from './KnowledgeHubCard';
import { MarketplaceQuickViewModal } from './MarketplaceQuickViewModal';
import { getFallbackItems } from '../../utils/fallbackData';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  provider: {
    name: string;
    logoUrl: string;
    description: string;
  };
  [key: string]: any; // For additional fields specific to each marketplace type
}
interface PromoCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradientFrom: string;
  gradientTo: string;
  type?: string;
}
interface MarketplaceGridProps {
  items: MarketplaceItem[];
  totalCount?: number;
  marketplaceType: string;
  bookmarkedItems: string[];
  onToggleBookmark: (itemId: string) => void;
  promoCards?: PromoCardData[];
  activeServiceTab?: string;
}
export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  items,
  totalCount,
  marketplaceType,
  bookmarkedItems,
  onToggleBookmark,
  promoCards = []
}) => {
  const [quickViewItem, setQuickViewItem] = useState<MarketplaceItem | null>(null);
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);
  const providedItems = Array.isArray(items) ? items : [];
  const fallbackItems = Array.isArray(items) ? [] : getFallbackItems(marketplaceType);
  const baseItems = providedItems.length > 0 || Array.isArray(items) ? providedItems : fallbackItems;
  const nonPromoItems = baseItems.filter(item => item?.type !== 'promo');
  const overallCount = typeof totalCount === 'number' ? totalCount : nonPromoItems.length;
  const visibleCount = nonPromoItems.length;
  if (visibleCount === 0) {
    // Creative "Coming Soon" page for Digital Worker tab
    if (activeServiceTab === 'digital_worker') {
      return (
        <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
          <div className="text-center">
            {/* Small decorative stars */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <span className="text-gray-300 text-2xl">✦</span>
              <span className="text-gray-400 text-xl">✦</span>
            </div>
            
            {/* Coming Soon Text */}
            <div className="mb-4">
              <h2 className="text-6xl md:text-7xl font-light text-gray-800 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Coming
              </h2>
              <h2 className="text-7xl md:text-8xl font-normal text-gray-900 tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>
                SOON.
              </h2>
            </div>
            
            {/* Stay Tuned with line */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-16 bg-gray-300"></div>
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                AI powered Document Writer
              </p>
              <div className="h-px w-16 bg-gray-300"></div>
            </div>
            
            {/* Small decorative stars at bottom */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <span className="text-gray-400 text-xl">✦</span>
              <span className="text-gray-300 text-2xl">✦</span>
            </div>
          </div>
        </div>
      );
    }
    
    // Default empty state for other tabs
    return <div className="bg-white rounded-lg shadow p-8 text-center">
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        No items found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search criteria
      </p>
    </div>;
  }
  // Insert promo cards after every 6 regular items (but not on digital_worker tab)
  const itemsWithPromos = nonPromoItems.reduce((acc, item, index) => {
    acc.push({
      type: 'item',
      data: item
    });
    // Insert a promo card after every 6 items (skip on digital_worker tab)
    if ((index + 1) % 6 === 0 && promoCards.length > 0 && promoCards[Math.floor(index / 6) % promoCards.length] && activeServiceTab !== 'digital_worker') {
      const promoIndex = Math.floor(index / 6) % promoCards.length;
      acc.push({
        type: 'promo',
        data: promoCards[promoIndex]
      });
    }
    return acc;
  }, [] as Array<{
    type: 'item' | 'promo';
    data: any;
  }>);
  return <div>
    <div className="flex justify-between items-center mb-4">
      {/* Responsive header - concise on mobile */}
      <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
        Available Items ({visibleCount})
      </h2>
      <div className="text-sm text-gray-500 hidden sm:block">
        Showing {visibleCount} of {overallCount} items
      </div>
      {/* Mobile-friendly header */}
      <h2 className="text-lg font-medium text-gray-800 sm:hidden">
        {visibleCount} Items Available
      </h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {itemsWithPromos.map((entry, idx) => {
        if (entry.type === 'item') {
          const item = entry.data as MarketplaceItem;
          // Use KnowledgeHubCard for guides/knowledge-hub marketplace types
          if (marketplaceType === 'knowledge-hub' || marketplaceType === 'guides') {
            return <KnowledgeHubCard key={`item-${item.id || idx}`} item={item as any} isBookmarked={bookmarkedItems.includes(item.id)} onToggleBookmark={() => onToggleBookmark(item.id)} onQuickView={() => setQuickViewItem(item)} />;
          }
          // Use standard MarketplaceCard for other marketplace types
          return <MarketplaceCard key={`item-${item.id || idx}`} item={item} marketplaceType={marketplaceType} isBookmarked={bookmarkedItems.includes(item.id)} onToggleBookmark={() => onToggleBookmark(item.id)} onQuickView={() => setQuickViewItem(item)} />;
        } else if (entry.type === 'promo') {
          const promo = entry.data as PromoCardData;
          return <PromoCard key={`promo-${promo.id || idx}-${idx}`} title={promo.title} description={promo.description} icon={promo.icon} path={promo.path} gradientFrom={promo.gradientFrom || 'from-blue-500'} gradientTo={promo.gradientTo || 'to-purple-600'} />;
        }
        return null;
      })}
    </div>
    {/* Quick View Modal */}
    {quickViewItem && <MarketplaceQuickViewModal item={quickViewItem} marketplaceType={marketplaceType} onClose={() => setQuickViewItem(null)} onViewDetails={() => {
      setQuickViewItem(null);
      if (marketplaceType === 'courses') {
        const slug = quickViewItem.slug || quickViewItem.id;
        navigate(`/lms/${slug}`);
      } else {
        navigate(`${config.route}/${quickViewItem.id}`);
      }
    }} isBookmarked={bookmarkedItems.includes(quickViewItem.id)} onToggleBookmark={() => onToggleBookmark(quickViewItem.id)} />}
  </div>;
};
