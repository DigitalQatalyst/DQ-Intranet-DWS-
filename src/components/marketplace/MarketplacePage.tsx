import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import GuidesFilters, { GuidesFacets } from '../guides/GuidesFilters';
import GuidesGrid from '../guides/GuidesGrid';
import { supabaseClient } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';

interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

export interface MarketplacePageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'guides';
  title: string;
  description: string;
  promoCards?: any[];
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title,
  description,
  promoCards = []
}) => {
  const isGuidesLike = (type: string) => type === 'knowledge-hub' || type === 'guides';
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);

  // Items & filters state
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Guides facets + URL state
  const [facets, setFacets] = useState<GuidesFacets>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));
  const searchStartRef = useRef<number | null>(null);
  const inFlightController = useRef<AbortController | null>(null);

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load filter configurations for non-guides marketplaces
  useEffect(() => {
    const loadFilterOptions = async () => {
      if (isGuidesLike(marketplaceType)) {
        setFilterConfig([]);
        setFilters({});
        return;
      }
      try {
        const filterOptions = await fetchMarketplaceFilters(marketplaceType);
        setFilterConfig(filterOptions);
        const initial: Record<string, string> = {};
        filterOptions.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setFilterConfig(config.filterCategories);
        const initial: Record<string, string> = {};
        config.filterCategories.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      }
    };
    loadFilterOptions();
  }, [marketplaceType, config]);

  // Fetch items
  useEffect(() => {
    if (!isGuidesLike(marketplaceType)) {
      const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
          const itemsData = await fetchMarketplaceItems(marketplaceType, filters, searchQuery);
          const finalItems = itemsData && itemsData.length > 0 ? itemsData : getFallbackItems(marketplaceType);
          setItems(finalItems);
          setFilteredItems(finalItems);
        } catch (err) {
          console.error(`Error fetching ${marketplaceType} items:`, err);
          setError(`Failed to load ${marketplaceType}`);
          const fallbackItems = getFallbackItems(marketplaceType);
          setItems(fallbackItems);
          setFilteredItems(fallbackItems);
        } finally {
          setLoading(false);
        }
      };
      loadItems();
    } else {
      const loadGuides = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/guides?${queryParams.toString()}`);
          let data: any = null;
          const ct = res.headers.get('content-type') || '';
          if (res.ok && ct.includes('application/json')) {
            data = await res.json();
          } else {
            // Dev fallback: query Supabase anon directly when serverless API isn't running
            let q = supabaseClient
              .from('guides')
              .select('*', { count: 'exact' })
              .eq('status', 'Approved');
            const qStr = queryParams.get('q') || '';
            if (qStr) q = q.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
            // (filter/sort is applied after mapping below)
            const page = Math.max(1, parseInt(queryParams.get('page') || '1', 10));
            const pageSize = Math.min(50, Math.max(1, parseInt(queryParams.get('pageSize') || '12', 10)));
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data: rows, count, error } = await q.range(from, to); if (error) throw error;
            const mapped = (rows || []).map((r: any) => ({
              id: r.id,
              slug: r.slug,
              title: r.title,
              summary: r.summary,
              heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
              skillLevel: r.skill_level ?? r.skillLevel,
              estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
              lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
              authorName: r.author_name ?? r.authorName,
              authorOrg: r.author_org ?? r.authorOrg,
              isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
              downloadCount: r.download_count ?? r.downloadCount,
              guideType: r.guide_type ?? r.guideType,
              domain: r.domain ?? null,
              functionArea: r.function_area ?? null,
              status: r.status ?? null,
              complexityLevel: r.complexity_level ?? null,
            }));
            // client-side filter/sort for fallback
            const domains = (queryParams.get('domain') || '').split(',').filter(Boolean);
            const types = (queryParams.get('guide_type') || '').split(',').filter(Boolean);
            const functions = (queryParams.get('function_area') || '').split(',').filter(Boolean);
            const statuses = (queryParams.get('status') || '').split(',').filter(Boolean);
            let out = mapped;
            if (domains.length) out = out.filter(it => it.domain && domains.includes(it.domain));
            if (types.length) out = out.filter(it => it.guideType && types.includes(it.guideType));
            if (functions.length) out = out.filter(it => it.functionArea && functions.includes(it.functionArea));
            if (statuses.length) out = out.filter(it => it.status && statuses.includes(it.status));
            const sort = queryParams.get('sort') || 'relevance';
            if (sort === 'updated') out.sort((a,b) => new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
            else if (sort === 'downloads') out.sort((a,b) => (b.downloadCount||0)-(a.downloadCount||0));
            else if (sort === 'editorsPick') out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) || new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
            else out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) || (b.downloadCount||0)-(a.downloadCount||0) || new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
            // Facets fallback: compute from Supabase for current filter context
            let facetQ = supabaseClient
              .from('guides')
              .select('domain,guide_type,function_area,status')
              .eq('status', 'Approved');
            if (qStr) facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
            if (domains.length) facetQ = facetQ.in('domain', domains);
            if (types.length) facetQ = facetQ.in('guide_type', types);
            if (functions.length) facetQ = facetQ.in('function_area', functions);
            if (statuses.length) facetQ = facetQ.in('status', statuses);
            const { data: facetRows } = await facetQ;
            const countBy = (arr: any[] | null | undefined, key: 'domain'|'guide_type'|'function_area'|'status') => {
              const m = new Map<string, number>();
              for (const r of (arr || [])) { const v = (r as any)[key]; if (!v) continue; m.set(v, (m.get(v)||0)+1); }
              return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt })).sort((a,b)=> a.name.localeCompare(b.name));
            };
            const facets = {
              domain: countBy(facetRows, 'domain'),
              guide_type: countBy(facetRows, 'guide_type'),
              function_area: countBy(facetRows, 'function_area'),
              status: countBy(facetRows, 'status'),
            } as any;
            data = { items: out, total: count || out.length, facets };
          }
          setItems(data.items || []);
          setFilteredItems(data.items || []);
          setCursor((data as any).cursor || null);
          setHasMore(!!(data as any).has_more);
          setFacets(data.facets || {});
          const start = searchStartRef.current; if (start) { const latency = Date.now() - start; track('Guides.Search', { q: queryParams.get('q') || '', latency_ms: latency }); searchStartRef.current = null; }
          track('Guides.ViewList', { q: queryParams.get('q') || '', sort: queryParams.get('sort') || 'relevance', page: queryParams.get('page') || '1' });
        } catch (e) {
          console.error('Error fetching guides:', e);
          setItems([]); setFilteredItems([]); setFacets({});
        } finally {
          setLoading(false);
        }
      };
      loadGuides();
    }
  }, [marketplaceType, filters, searchQuery, queryParams]);

  // Non-guides: filter handling
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    const empty: Record<string, string> = {};
    filterConfig.forEach(c => { empty[c.id] = ''; });
    setFilters(empty);
    setSearchQuery('');
  }, [filterConfig]);

  // UI helpers
  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);
  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarkedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  }, []);
  const handleAddToComparison = useCallback((item: any) => {
    if (compareItems.length < 3 && !compareItems.some(c => c.id === item.id)) {
      setCompareItems(prev => [...prev, item]);
    }
  }, [compareItems]);
  const handleRemoveFromComparison = useCallback((itemId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== itemId));
  }, []);
  const retryFetch = useCallback(() => { setError(null); setLoading(true); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                <span className="ml-1 text-gray-500 md:ml-2">{config.itemNamePlural}</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={isGuidesLike(marketplaceType) ? (queryParams.get('q') || '') : searchQuery}
              setSearchQuery={(q: string) => {
                if (isGuidesLike(marketplaceType)) {
                  const next = new URLSearchParams(queryParams.toString());
                  if (q) next.set('q', q); else next.delete('q');
                  const qs = next.toString();
                  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                  setQueryParams(new URLSearchParams(next.toString()));
                } else {
                  setSearchQuery(q);
                }
              }}
            />
          </div>
          {isGuidesLike(marketplaceType) && (
            <select
              className="border rounded px-2 py-2"
              aria-label="Sort guides"
              value={queryParams.get('sort') || 'relevance'}
              onChange={(e) => {
                const next = new URLSearchParams(queryParams.toString());
                next.set('sort', e.target.value);
                const qs = next.toString();
                window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                setQueryParams(new URLSearchParams(next.toString()));
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="updated">Last Updated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="editorsPick">Editor's Pick</option>
            </select>
          )}
        </div>

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
              {!isGuidesLike(marketplaceType) && Object.values(filters).some(f => f !== '') && (
                <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={toggleFilters} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {isGuidesLike(marketplaceType) ? (
                    <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
                  ) : (
                    <FilterSidebar
                      filters={filters}
                      filterConfig={filterConfig}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            {isGuidesLike(marketplaceType) ? (
              <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {Object.values(filters).some(f => f !== '') && (
                    <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Reset All</button>
                  )}
                </div>
                <FilterSidebar
                  filters={filters}
                  filterConfig={filterConfig}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  isResponsive={false}
                />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
              </div>
            ) : error && !isGuidesLike(marketplaceType) ? (
              <ErrorDisplay message={error} onRetry={retryFetch} />
            ) : isGuidesLike(marketplaceType) ? (
              <>
              <GuidesGrid
                items={filteredItems}
                onClickGuide={(g) => {
                  const qs = queryParams.toString();
                  navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs } });
                }}
              />
              {hasMore && (
                <div className="mt-4 text-center">
                  <button
                    onClick={async () => {
                      if (!cursor) return;
                      try {
                        if (inFlightController.current) { inFlightController.current.abort(); }
                        const controller = new AbortController(); inFlightController.current = controller;
                        const qp = new URLSearchParams(queryParams.toString());
                        if (!qp.get('pageSize')) qp.set('pageSize', '24');
                        qp.set('cursor', cursor);
                        const res = await fetch(`/api/guides?${qp.toString()}`, { signal: controller.signal });
                        if (res.ok) {
                          const data = await res.json();
                          setItems(prev => [...prev, ...data.items]);
                          setFilteredItems(prev => [...prev, ...data.items]);
                          setCursor(data.cursor || null);
                          setHasMore(!!data.has_more);
                        }
                      } catch {}
                    }}
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Load more
                  </button>
                </div>
              )}
              </>
            ) : (
              <MarketplaceGrid
                items={filteredItems}
                marketplaceType={marketplaceType}
                bookmarkedItems={bookmarkedItems}
                onToggleBookmark={toggleBookmark}
                onAddToComparison={handleAddToComparison}
                promoCards={promoCards}
              />
            )}
          </div>
        </div>

        {/* Comparison modal */}
        {showComparison && (
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







