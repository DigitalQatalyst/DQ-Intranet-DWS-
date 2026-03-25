import React from 'react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader.js';
import KnowledgeHubGrid from './KnowledgeHubGrid';
import { SixXDComingSoonCards } from '../guides/SixXDComingSoonCards';
import TestimonialsGrid from '../guides/TestimonialsGrid';
import GuidesGrid from '../guides/GuidesGrid';
import { MarketplaceGrid } from './MarketplaceGrid.js';
import { LOCATION_ALLOW } from '../../lms/config';
import { WorkGuideTab } from './MarketplaceUtils';

interface MarketplaceMainContentProps {
  loading: boolean;
  error: string | null;
  isKnowledgeHub: boolean;
  isDesignSystem: boolean;
  isGuides: boolean;
  isCourses: boolean;
  activeTab: WorkGuideTab;
  filteredItems: any[];
  searchFilteredItems: any[];
  bookmarkedItems: string[];
  searchQuery: string;
  activeFilters: string[];
  marketplaceType: string;
  activeServiceTab: string;
  queryParams: URLSearchParams;
  currentPage: number;
  totalPages: number;
  promoCards: any[];
  toggleBookmark: (id: string) => void;
  handleAddToComparison: (item: any) => void;
  handleKnowledgeHubFilterChange: (filter: string) => void;
  clearKnowledgeHubFilters: () => void;
  goToPage: (page: number) => void;
  retryFetch: () => void;
  navigate: (path: string, options?: any) => void;
}

export const MarketplaceMainContent: React.FC<MarketplaceMainContentProps> = ({
  loading,
  error,
  isKnowledgeHub,
  isDesignSystem,
  isGuides,
  isCourses,
  activeTab,
  filteredItems,
  searchFilteredItems,
  bookmarkedItems,
  searchQuery,
  activeFilters,
  marketplaceType,
  activeServiceTab,
  queryParams,
  currentPage,
  totalPages,
  promoCards,
  toggleBookmark,
  handleAddToComparison,
  handleKnowledgeHubFilterChange,
  clearKnowledgeHubFilters,
  goToPage,
  retryFetch,
  navigate
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {(['s1','s2','s3','s4','s5','s6']).map((sk) => <CourseCardSkeleton key={sk} />)}
      </div>
    );
  }
  if (error && !isGuides && !isKnowledgeHub) {
    return <ErrorDisplay message={error} onRetry={retryFetch} />;
  }
  if (isKnowledgeHub) {
    return (
      <KnowledgeHubGrid
        bookmarkedItems={bookmarkedItems}
        onToggleBookmark={toggleBookmark}
        onAddToComparison={handleAddToComparison}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        onFilterChange={handleKnowledgeHubFilterChange}
        onClearFilters={clearKnowledgeHubFilters}
      />
    );
  }
  if (isDesignSystem) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DQ Stories CI.DS</h3>
          <p className="text-gray-600 text-sm mb-4">Component Integration Design System - Explore reusable components and integration patterns.</p>
          <p className="text-xs text-gray-500">xDS Design System Marketplace</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DQ Stories V.DS</h3>
          <p className="text-gray-600 text-sm mb-4">Visual Design System - Discover design tokens, typography, and visual guidelines.</p>
          <p className="text-xs text-gray-500">xDS Design System Marketplace</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">DQ Stories CDS</h3>
          <p className="text-gray-600 text-sm mb-4">Content Design System - Access content patterns and writing guidelines.</p>
          <p className="text-xs text-gray-500">xDS Design System Marketplace</p>
        </div>
      </div>
    );
  }
  if (isGuides) {
    const showGuidesGrid = activeTab !== 'faqs' && activeTab !== '6xd' && activeTab !== 'glossary' && activeTab !== 'testimonials';
    return (
      <div>
        {activeTab === 'faqs' && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-gray-100 rounded-lg p-12 text-center max-w-md">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-500">FAQs content is currently being prepared and will be available soon.</p>
            </div>
          </div>
        )}
        {activeTab === '6xd' && <SixXDComingSoonCards />}
        {activeTab === 'glossary' && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-gray-100 rounded-lg p-12 text-center max-w-md">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-500">Glossary content is currently being prepared and will be available soon.</p>
            </div>
          </div>
        )}
        {activeTab === 'testimonials' && (
          <TestimonialsGrid
            items={filteredItems}
            onClickGuide={(g: any) => {
              const qs = queryParams.toString();
              navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, {
                state: { fromQuery: qs, activeTab }
              });
            }}
          />
        )}
        {showGuidesGrid && (
          <div>
            <GuidesGrid
              items={filteredItems}
              hideEmptyState={false}
              emptyStateTitle={activeTab === 'blueprints' ? 'No products found' : 'No guides found'}
              emptyStateMessage="Try adjusting your filters or search"
              onClickGuide={(g: any) => {
                const qs = queryParams.toString();
                const isProduct = (g.domain === 'Product') || (g.productType && g.productStage);
                if (isProduct) {
                  navigate(`/marketplace/products/${encodeURIComponent(g.slug || g.id)}`, {
                    state: { fromQuery: qs, activeTab }
                  });
                } else {
                  navigate(`/marketplace/guides/service/${encodeURIComponent(g.slug || g.id)}`, {
                    state: { fromQuery: qs, activeTab }
                  });
                }
              }}
            />
            {totalPages > 1 && (
               <div className="mt-6 flex items-center justify-center gap-4">
                 <button
                   type="button"
                   onClick={() => goToPage(currentPage - 1)}
                   disabled={currentPage === 1}
                   className="px-4 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Previous
                 </button>
                 <span className="text-sm text-gray-600">
                   Page {currentPage} of {totalPages}
                 </span>
                 <button
                   type="button"
                   onClick={() => goToPage(currentPage + 1)}
                   disabled={currentPage >= totalPages}
                   className="px-4 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Next
                 </button>
               </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <MarketplaceGrid
      items={isCourses ? searchFilteredItems.map((course: any) => {
        const allowedSet = new Set<string>(LOCATION_ALLOW as readonly string[]);
        const safeLocations = (course.locations || []).filter((loc: string) => allowedSet.has(loc));
        return {
          ...course,
          locations: safeLocations.length ? safeLocations : ['Global'],
          provider: { name: course.provider, logoUrl: '/DWS-Logo.png' },
          description: course.summary
        };
      }) : filteredItems}
      marketplaceType={marketplaceType}
      bookmarkedItems={bookmarkedItems}
      onToggleBookmark={toggleBookmark}
      onAddToComparison={handleAddToComparison}
      promoCards={promoCards}
      activeServiceTab={activeServiceTab}
    />
  );
};
