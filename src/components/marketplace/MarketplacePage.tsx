import React from 'react';
import { FilterIcon, XIcon } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar.js';
import { Header } from '../Header';
import { Footer } from '../Footer';
import GuidesFilters from '../guides/GuidesFilters';
import { MarketplaceComparison } from './MarketplaceComparison.js';
import { track } from '../../utils/analytics';

// Modular logic & utils
import { useMarketplaceLogic } from './useMarketplaceLogic';

// UI components
import { MarketplaceBreadcrumbs } from './MarketplaceBreadcrumbs';
import { ServiceCenterContent } from './ServiceCenterContent';
import { GuidesTabsSection } from './GuidesTabsSection';
import { DesignSystemTabsSection } from './DesignSystemTabsSection';
import { MarketplaceSearchBarSection } from './MarketplaceSearchBarSection';
import { MarketplaceMainContent } from './MarketplaceMainContent';

interface MarketplacePageProps {
  marketplaceType: string;
  title?: string;
  description?: string;
  promoCards?: any[];
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title: _title,
  description: _description,
  promoCards = []
}) => {
  const {
    isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem,
    navigate, config,
    activeServiceTab, setActiveServiceTab,
    filteredItems,
    searchQuery, setSearchQuery, filterConfig,
    facets, queryParams, setQueryParams,
    activeTab, activeDesignSystemTab, setActiveDesignSystemTab,
    handleGuidesTabChange, currentPage, totalPages,
    showFilters, setSidebarOpen, sidebarOpen,
    bookmarkedItems, compareItems, showComparison, setShowComparison,
    loading, error,
    activeFilters,
    handleFilterChange, resetFilters,
    handleKnowledgeHubFilterChange, clearKnowledgeHubFilters,
    toggleFilters, toggleBookmark, handleAddToComparison, handleRemoveFromComparison,
    retryFetch, goToPage, normalizedFilters, hasActiveFilters,
    searchFilteredItems, searchParams, setSearchParams, isCourses
  } = useMarketplaceLogic({ marketplaceType, promoCards });

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isGuides ? 'guidelines-theme' : ''}`}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        <MarketplaceBreadcrumbs
          isGuides={isGuides}
          isServicesCenter={isServicesCenter}
          config={config}
          activeServiceTab={activeServiceTab}
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.description}</p>

        <ServiceCenterContent
          isServicesCenter={isServicesCenter}
          activeServiceTab={activeServiceTab}
          setActiveServiceTab={setActiveServiceTab}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <GuidesTabsSection
          isGuides={isGuides}
          activeTab={activeTab}
          handleGuidesTabChange={handleGuidesTabChange}
        />

        <DesignSystemTabsSection
          isDesignSystem={isDesignSystem}
          activeDesignSystemTab={activeDesignSystemTab}
          setActiveDesignSystemTab={setActiveDesignSystemTab}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <MarketplaceSearchBarSection
          isDesignSystem={isDesignSystem}
          isGuides={isGuides}
          isKnowledgeHub={isKnowledgeHub}
          searchQuery={searchQuery}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {hasActiveFilters ? (
                <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>
              ) : null}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div className="xl:hidden">
            <button
              type="button"
              className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 w-full h-full border-0 p-0 cursor-default ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={toggleFilters}
              aria-label="Close filters overlay"
              aria-hidden={!showFilters}
              tabIndex={showFilters ? 0 : -1}
            />
            <dialog
              open={showFilters}
              aria-label="Filters"
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 m-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 h-full max-h-none p-0 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={toggleFilters} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {isGuides ? (
                    <GuidesFilters 
                      activeTab={activeTab} 
                      facets={facets} 
                      query={queryParams} 
                      onChange={(next) => { 
                        next.delete('page'); 
                        const qs = next.toString(); 
                        globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`); 
                        setQueryParams(new URLSearchParams(next.toString())); 
                        track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); 
                      }} 
                    />
                  ) : (
                    <FilterSidebar
                      filters={normalizedFilters}
                      filterConfig={filterConfig}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive={true}
                    />
                  )}
                </div>
              </div>
            </dialog>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            {isGuides ? (
              <GuidesFilters 
                activeTab={activeTab} 
                facets={facets} 
                query={queryParams} 
                onChange={(next) => { 
                  next.delete('page'); 
                  const qs = next.toString(); 
                  globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`); 
                  setQueryParams(new URLSearchParams(next.toString())); 
                  track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); 
                }} 
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto filter-sidebar-scroll">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {hasActiveFilters ? (
                    <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Reset All</button>
                  ) : null}
                </div>
                {isKnowledgeHub ? (
                  <div className="space-y-4">
                    {filterConfig.map(category => (
                      <div key={category.id} className="border-b border-gray-100 pb-3">
                        <h3 className="font-medium text-gray-900 mb-2">{category.title}</h3>
                        <div className="space-y-2">
                          {category.options.map(option => (
                            <div key={option.id} className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={`desktop-${category.id}-${option.id}`} 
                                checked={activeFilters.includes(option.name)} 
                                onChange={() => handleKnowledgeHubFilterChange(option.name)} 
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                              />
                              <label htmlFor={`desktop-${category.id}-${option.id}`} className="ml-2 text-sm text-gray-700">{option.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <FilterSidebar
                    filters={normalizedFilters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={false}
                  />
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            <MarketplaceMainContent
              loading={loading}
              error={error}
              isKnowledgeHub={isKnowledgeHub}
              isDesignSystem={isDesignSystem}
              isGuides={isGuides}
              isCourses={isCourses}
              activeTab={activeTab}
              filteredItems={filteredItems}
              searchFilteredItems={searchFilteredItems}
              bookmarkedItems={bookmarkedItems}
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              marketplaceType={marketplaceType}
              activeServiceTab={activeServiceTab}
              queryParams={queryParams}
              currentPage={currentPage}
              totalPages={totalPages}
              promoCards={promoCards}
              toggleBookmark={toggleBookmark}
              handleAddToComparison={handleAddToComparison}
              handleKnowledgeHubFilterChange={handleKnowledgeHubFilterChange}
              clearKnowledgeHubFilters={clearKnowledgeHubFilters}
              goToPage={goToPage}
              retryFetch={retryFetch}
              navigate={navigate}
            />
          </div>
        </div>

        {/* Comparison modal */}
        {compareItems.length > 0 && showComparison && (
          <MarketplaceComparison
            items={compareItems}
            onClose={() => setShowComparison(false)}
            onRemoveItem={handleRemoveFromComparison}
            marketplaceType={marketplaceType}
          />
        )}
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MarketplacePage;
