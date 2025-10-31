import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from './FilterSidebar';
import { MarketplaceGrid } from './MarketplaceGrid';
import { SearchBar } from '../SearchBar';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader';
import { fetchMarketplaceItems, fetchMarketplaceFilters } from '../../services/marketplace';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
import { MarketplaceComparison } from './MarketplaceComparison';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { getFallbackItems } from '../../utils/fallbackData';
import KnowledgeHubGrid from './KnowledgeHubGrid';
import { LMS_COURSES } from '@/data/lmsCourseDetails';
import { parseFacets, applyFilters } from '@/lms/filters';
import {
  LOCATION_ALLOW,
  LEVELS,
  CATEGORY_OPTS,
  DELIVERY_OPTS,
  DURATION_OPTS
} from '@/lms/config';
const LEARNING_TYPE_FILTER: FilterConfig = {
  id: 'learningType',
  title: 'Learning Type',
  options: [
    { id: 'courses', name: 'Courses' },
    { id: 'curricula', name: 'Curricula' },
    { id: 'testimonials', name: 'Testimonials' }
  ]
};
const prependLearningTypeFilter = (marketplaceType: string, configs: FilterConfig[]): FilterConfig[] => {
  if (marketplaceType !== 'courses') {
    return configs;
  }
  const hasLearningType = configs.some(config => config.id === 'learningType');
  if (hasLearningType) {
    return configs.map(config => {
      if (config.id !== 'learningType') return config;
      const options = config.options.length ? config.options : LEARNING_TYPE_FILTER.options;
      return { ...config, options };
    });
  }
  return [LEARNING_TYPE_FILTER, ...configs];
};

const COURSE_FILTER_CONFIG: FilterConfig[] = [
  {
    id: 'category',
    title: 'Course Category',
    options: CATEGORY_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'delivery',
    title: 'Delivery Mode',
    options: DELIVERY_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'duration',
    title: 'Duration',
    options: DURATION_OPTS.map(value => ({ id: value, name: value }))
  },
  {
    id: 'department',
    title: 'Department',
    options: [
      { id: 'DCO', name: 'DCO' },
      { id: 'DBP', name: 'DBP' },
      { id: 'HR', name: 'HR' },
      { id: 'IT', name: 'IT' },
      { id: 'Finance', name: 'Finance' }
    ]
  },
  {
    id: 'level',
    title: 'Level',
    options: LEVELS.map(level => ({ id: level.code, name: level.label }))
  },
  {
    id: 'location',
    title: 'Location/Studio',
    options: LOCATION_ALLOW.map(value => ({ id: value, name: value }))
  },
  {
    id: 'audience',
    title: 'Audience',
    options: [
      { id: 'Associate', name: 'Associate' },
      { id: 'Lead', name: 'Lead' }
    ]
  },
  {
    id: 'status',
    title: 'Status',
    options: [
      { id: 'live', name: 'Live' },
      { id: 'coming-soon', name: 'Coming Soon' }
    ]
  }
];
// Type for comparison items
interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}
export interface MarketplacePageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding';
  title: string;
  description: string;
  promoCards?: any[];
}
export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title: _title,
  description: _description,
  promoCards = []
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getMarketplaceConfig(marketplaceType);
  const [searchQuery, setSearchQuery] = useState('');
  
  // For courses marketplace, use URL-based filtering
  const facets = marketplaceType === 'courses' ? parseFacets(searchParams) : undefined;
  const lmsFilteredItems = marketplaceType === 'courses'
    ? applyFilters(LMS_COURSES, facets || {})
    : [];
  
  // Apply search query to LMS items
  const searchFilteredItems = marketplaceType === 'courses' && searchQuery
    ? lmsFilteredItems.filter(item => {
        const searchableText = [
          item.title,
          item.summary,
          item.courseCategory,
          item.deliveryMode,
          item.duration,
          item.levelCode,
          item.levelLabel,
          ...(item.locations || []),
          ...(item.audience || []),
          ...(item.department || [])
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
      })
    : lmsFilteredItems;
  
  // Compute filters from URL for courses to pass to FilterSidebar
  const urlBasedFilters: Record<string, string[]> = marketplaceType === 'courses'
    ? {
        category: facets?.category || [],
        delivery: facets?.delivery || [],
        duration: facets?.duration || [],
        level: (facets?.level || []) as string[],
        department: facets?.department || [],
        location: facets?.location || [],
        audience: facets?.audience || [],
        status: facets?.status || []
      }
    : {};
  
  // For other marketplaces, keep existing state
  const [_items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  // Filter sidebar visibility - should be visible on desktop, hidden on mobile by default
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  // State for filter options
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  // Knowledge Hub specific filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // URL toggle function for courses marketplace filters
  const toggleFilter = useCallback((key: string, value: string) => {
    const curr = new Set((searchParams.get(key)?.split(",").filter(Boolean)) || []);
    curr.has(value) ? curr.delete(value) : curr.add(value);
    const newParams = new URLSearchParams(searchParams);
    if (curr.size) {
      newParams.set(key, Array.from(curr).join(","));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  // Handle track parameter for newjoiner (maps to level L1-L2 + category day-in-dq)
  useEffect(() => {
    if (marketplaceType === 'courses') {
      const track = searchParams.get('track');
      if (track === 'newjoiner') {
        const newParams = new URLSearchParams(searchParams);
        if (!newParams.get('level')) {
          newParams.set('level', 'L1,L2');
        }
        if (!newParams.get('category')) {
          newParams.set('category', 'Day in DQ');
        }
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [marketplaceType, searchParams, setSearchParams]);
  
  // Load filter configurations based on marketplace type
  useEffect(() => {
    if (marketplaceType === 'courses') {
      setFilterConfig(COURSE_FILTER_CONFIG);
      setLoading(false);
      return;
    }
    const loadFilterOptions = async () => {
      try {
        let filterOptions = await fetchMarketplaceFilters(marketplaceType);
        filterOptions = prependLearningTypeFilter(marketplaceType, filterOptions);
        setFilterConfig(filterOptions);
        setFilters(prev => {
          const next: Record<string, string[]> = {};
          filterOptions.forEach(config => {
            next[config.id] = prev[config.id] ?? [];
          });
          return next;
        });
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Use fallback filter config from marketplace config
        const fallbackFilters = prependLearningTypeFilter(marketplaceType, config.filterCategories);
        setFilterConfig(fallbackFilters);
        setFilters(prev => {
          const next: Record<string, string[]> = {};
          fallbackFilters.forEach(config => {
            next[config.id] = prev[config.id] ?? [];
          });
          return next;
        });
      }
    };
    loadFilterOptions();
  }, [marketplaceType, config]);
  const applyLearningTypeFilter = useCallback(
    (itemsToFilter: any[]): any[] => {
      if (marketplaceType !== 'courses') {
        return itemsToFilter;
      }
      const selectedValues = filters.learningType || [];
      if (selectedValues.length === 0) {
        return itemsToFilter;
      }
      const normalizedSelected = selectedValues[0].toLowerCase();
      return itemsToFilter.filter(item => {
        const valueCandidate =
          (typeof item.learningType === 'string' && item.learningType) ||
          (typeof item.type === 'string' && item.type) ||
          'Courses';
        return valueCandidate.toLowerCase() === normalizedSelected;
      });
    },
    [filters.learningType, marketplaceType]
  );
  // Initialize loading for courses (filtering happens via URL + filterCourses utility)
  useEffect(() => {
    if (marketplaceType === 'courses') {
      setLoading(false);
    } else if (marketplaceType !== 'knowledge-hub') {
      const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
          const itemsData = await fetchMarketplaceItems(
            marketplaceType,
            Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : ''])),
            searchQuery
          );
          // Use fetched data if available, otherwise use fallback data
          const finalItems = itemsData && itemsData.length > 0 ? itemsData : getFallbackItems(marketplaceType);
          setItems(finalItems);
          setFilteredItems(applyLearningTypeFilter(finalItems));
          setLoading(false);
        } catch (err) {
          console.error(`Error fetching ${marketplaceType} items:`, err);
          setError(`Failed to load ${marketplaceType}`);
          // Use fallback data when API fails
          const fallbackItems = getFallbackItems(marketplaceType);
          setItems(fallbackItems);
          setFilteredItems(applyLearningTypeFilter(fallbackItems));
          setLoading(false);
        }
      };
      loadItems();
    } else {
      // For knowledge-hub, directly use fallback data without API calls
      const fallbackItems = getFallbackItems(marketplaceType);
      setItems(fallbackItems);
      setFilteredItems(applyLearningTypeFilter(fallbackItems));
      setLoading(false);
    }
  }, [marketplaceType, filters, searchQuery, applyLearningTypeFilter]);
  // Handle filter changes - use URL toggle for courses, state for others
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (marketplaceType === 'courses') {
      toggleFilter(filterType, value);
      return;
    }
    setFilters(prev => {
      const current = prev[filterType] || [];
      const exists = current.includes(value);
      const nextValues = exists ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [filterType]: nextValues };
    });
  }, [marketplaceType, toggleFilter]);
  // Reset all filters
  const resetFilters = useCallback(() => {
    if (marketplaceType === 'courses') {
      // Clear URL params for courses
      const newParams = new URLSearchParams();
      setSearchParams(newParams, { replace: true });
      setSearchQuery('');
    } else {
      const emptyFilters: Record<string, string[]> = {};
      filterConfig.forEach(config => {
        emptyFilters[config.id] = [];
      });
      setFilters(emptyFilters);
      setSearchQuery('');
      setActiveFilters([]);
    }
  }, [marketplaceType, filterConfig, setSearchParams]);
  // Toggle sidebar visibility (only on mobile)
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  // Toggle bookmark for an item
  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarkedItems(prev => {
      return prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
    });
  }, []);
  // Add an item to comparison
  const handleAddToComparison = useCallback((item: any) => {
    if (compareItems.length < 3 && !compareItems.some(c => c.id === item.id)) {
      setCompareItems(prev => [...prev, item]);
    }
  }, [compareItems]);
  // Remove an item from comparison
  const handleRemoveFromComparison = useCallback((itemId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== itemId));
  }, []);
  // Retry loading items after an error
  const retryFetch = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);
  // Handle Knowledge Hub specific filter changes
  const handleKnowledgeHubFilterChange = useCallback((filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  }, []);
  // Clear Knowledge Hub filters
  const clearKnowledgeHubFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">
                  {config.itemNamePlural}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {config.title}
        </h1>
        <p className="text-gray-600 mb-6">{config.description}</p>
        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        {/* Comparison bar */}
        {compareItems.length > 0 && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">
                {config.itemName} Comparison ({compareItems.length}/3)
              </h3>
              <div>
                <button onClick={() => setShowComparison(true)} className="text-blue-600 hover:text-blue-800 font-medium mr-4">
                  Compare Selected
                </button>
                <button onClick={() => setCompareItems([])} className="text-gray-500 hover:text-gray-700 text-sm">
                  Clear All
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareItems.map(item => <div key={item.id} className="bg-white rounded-full px-3 py-1 flex items-center gap-2 text-sm border border-gray-200">
                  <span className="truncate max-w-[150px]">{item.title}</span>
                  <button onClick={() => handleRemoveFromComparison(item.id)} className="text-gray-400 hover:text-gray-600" aria-label={`Remove ${item.title} from comparison`}>
                    <XIcon size={14} />
                  </button>
                </div>)}
            </div>
          </div>}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button onClick={toggleFilters} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center" aria-expanded={showFilters} aria-controls="filter-sidebar">
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {((marketplaceType === 'courses' ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : Object.values(filters).some(f => Array.isArray(f) && f.length > 0)) || activeFilters.length > 0) && <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>}
            </div>
          </div>
          {/* Filter sidebar - mobile/tablet */}
          <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleFilters} aria-hidden={!showFilters}>
            <div id="filter-sidebar" className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Filters">
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={toggleFilters} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {marketplaceType === 'knowledge-hub' ? <div className="space-y-4">
                      {filterConfig.map(category => <div key={category.id} className="border-b border-gray-100 pb-3">
                          <h3 className="font-medium text-gray-900 mb-2">
                            {category.title}
                          </h3>
                          <div className="space-y-2">
                            {category.options.map(option => <div key={option.id} className="flex items-center">
                                <input type="checkbox" id={`mobile-${category.id}-${option.id}`} checked={activeFilters.includes(option.name)} onChange={() => handleKnowledgeHubFilterChange(option.name)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor={`mobile-${category.id}-${option.id}`} className="ml-2 text-xs text-gray-700">
                                  {option.name}
                                </label>
                              </div>)}
                          </div>
                        </div>)}
                    </div> : <FilterSidebar filters={marketplaceType === 'courses' ? urlBasedFilters : filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} isResponsive={true} />}
                </div>
              </div>
            </div>
          </div>
          {/* Filter sidebar - desktop - always visible */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {((marketplaceType === 'courses' ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : Object.values(filters).some(f => Array.isArray(f) && f.length > 0)) || activeFilters.length > 0) && <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">
                    Reset All
                  </button>}
              </div>
              {marketplaceType === 'knowledge-hub' ? <div className="space-y-4">
                  {filterConfig.map(category => <div key={category.id} className="border-b border-gray-100 pb-3">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.options.map(option => <div key={option.id} className="flex items-center">
                            <input type="checkbox" id={`desktop-${category.id}-${option.id}`} checked={activeFilters.includes(option.name)} onChange={() => handleKnowledgeHubFilterChange(option.name)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor={`desktop-${category.id}-${option.id}`} className="ml-2 text-sm text-gray-700">
                              {option.name}
                            </label>
                          </div>)}
                      </div>
                    </div>)}
                </div> : <FilterSidebar filters={marketplaceType === 'courses' ? urlBasedFilters : filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} isResponsive={false} />}
            </div>
          </div>
          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
              </div> : error && marketplaceType !== 'knowledge-hub' ? <ErrorDisplay message={error} onRetry={retryFetch} /> : marketplaceType === 'knowledge-hub' ? <KnowledgeHubGrid bookmarkedItems={bookmarkedItems} onToggleBookmark={toggleBookmark} onAddToComparison={handleAddToComparison} searchQuery={searchQuery} activeFilters={activeFilters} onFilterChange={handleKnowledgeHubFilterChange} onClearFilters={clearKnowledgeHubFilters} /> : <MarketplaceGrid items={marketplaceType === 'courses' ? searchFilteredItems.map(course => {
                const allowedSet = new Set<string>(LOCATION_ALLOW as readonly string[]);
                const safeLocations = (course.locations || []).filter(loc => allowedSet.has(loc));
                return {
                  ...course,
                  locations: safeLocations.length ? safeLocations : ['Global'],
                  provider: { name: course.provider, logoUrl: '/DWS-Logo.png' },
                  description: course.summary
                };
              }) : filteredItems} marketplaceType={marketplaceType} bookmarkedItems={bookmarkedItems} onToggleBookmark={toggleBookmark} onAddToComparison={handleAddToComparison} promoCards={promoCards} />}
          </div>
        </div>
        {/* Comparison modal */}
        {showComparison && <MarketplaceComparison items={compareItems} onClose={() => setShowComparison(false)} onRemoveItem={handleRemoveFromComparison} marketplaceType={marketplaceType} />}
      </div>
      <Footer isLoggedIn={false} />
    </div>;
};
export default MarketplacePage;
