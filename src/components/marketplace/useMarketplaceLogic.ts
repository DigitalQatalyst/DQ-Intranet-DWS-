import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';
import { fetchMarketplaceItems } from '../../services/marketplace.js';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig.js';
import { getFallbackItems } from '../../utils/fallbackData';
import { LMS_COURSES } from '../../data/lmsCourseDetails';
import { parseFacets, applyFilters } from '../../lms/filters';
import {
  WorkGuideTab,
  DesignSystemTab,
  ComparisonItem,
  DEFAULT_GUIDE_PAGE_SIZE,
  parseServiceTab,
  computeServiceTabSync,
  parseGuideTab,
  parseDesignSystemTab,
  buildTabChangeParams,
  cleanupTabFilters,
  filterLmsItemsBySearch,
  computeUrlBasedFilters,
  handleNewjoinerTrackParams,
  loadFilterConfig,
  runBlueprintsTab,
  parseGuideQueryVars,
  computeGuideTabFlags,
  applySubDomainGuard,
  fetchGuideData,
  applyGuidePostFetch,
  computePageTotal,
  applyPageOverflowGuard,
  applyServicesCenterFilters,
  applyGenericSearch,
  toNormalizedArr,
  COURSE_FILTER_CONFIG,
  FilterConfig,
  GUIDE_LIST_SELECT,
  computeAllowedSubDomains,
  applyGuidesQueryFilters,
  computeNeedsClientSideFiltering,
  applyFacetQueryFilters,
  mapGuideRow,
  slugify,
  GuidesTabFlags
} from './MarketplaceUtils';

interface UseMarketplaceLogicProps {
  marketplaceType: string;
  promoCards?: any[];
}

export const useMarketplaceLogic = ({ marketplaceType, promoCards = [] }: UseMarketplaceLogicProps) => {
  const isGuides = marketplaceType === 'guides';
  const isCourses = marketplaceType === 'courses';
  const isKnowledgeHub = marketplaceType === 'knowledge-hub';
  const isServicesCenter = marketplaceType === 'non-financial';
  const isDesignSystem = marketplaceType === 'design-system';

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getMarketplaceConfig(marketplaceType);

  // Service Center tabs - sync with URL params
  const [activeServiceTab, setActiveServiceTab] = useState<string>(() =>
    isServicesCenter
      ? parseServiceTab(new URLSearchParams(globalThis.location?.search ?? ""))
      : 'technology'
  );

  // Sync activeServiceTab with URL params
  useEffect(() => {
    if (!isServicesCenter) return;
    const sync = computeServiceTabSync(searchParams.get('tab'), activeServiceTab);
    if (!sync) return;
    if (sync.action === 'set-state') { setActiveServiceTab(sync.tab); return; }
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeServiceTab);
    setSearchParams(newParams, { replace: true });
  }, [isServicesCenter, searchParams, activeServiceTab, setSearchParams]);

  // Items & filters state
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Guides facets + URL state
  const [facets, setFacets] = useState<any>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(globalThis.location?.search ?? ''));

  // Sync queryParams with URL changes
  const location = useLocation();
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    setQueryParams(currentParams);
  }, [location.search]);

  // Listen for browser navigation (back/forward) to sync queryParams
  useEffect(() => {
    if (globalThis.window === undefined) return;
    const handlePopState = () => {
      const currentParams = new URLSearchParams(globalThis.location?.search ?? "");
      setQueryParams(currentParams);
    };
    globalThis.window.addEventListener('popstate', handlePopState);
    return () => globalThis.window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeTab, setActiveTab] = useState<WorkGuideTab>(() =>
    parseGuideTab(new URLSearchParams(globalThis.location?.search ?? "")) as WorkGuideTab
  );
  const [activeDesignSystemTab, setActiveDesignSystemTab] = useState<DesignSystemTab>(() => {
    if (!isDesignSystem) return 'cids';
    return parseDesignSystemTab(new URLSearchParams(globalThis.location?.search ?? "")) as DesignSystemTab;
  });

  useEffect(() => {
    if (!isGuides) return;
    setActiveTab(parseGuideTab(queryParams) as WorkGuideTab);
  }, [isGuides, queryParams]);

  useEffect(() => {
    if (!isDesignSystem) return;
    setActiveDesignSystemTab(parseDesignSystemTab(searchParams) as DesignSystemTab);
  }, [isDesignSystem, searchParams]);

  const handleGuidesTabChange = useCallback((tab: WorkGuideTab) => {
    setActiveTab(tab);
    const next = buildTabChangeParams(tab, queryParams);
    const qs = next.toString();
    globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`);
    setQueryParams(new URLSearchParams(next.toString()));
    track('Guides.TabChanged', { tab });
  }, [queryParams]);

  const prevTabRef = useRef<WorkGuideTab>(activeTab);
  useEffect(() => {
    if (!isGuides) return;
    if (activeTab === 'guidelines') return;
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;
    const next = cleanupTabFilters(activeTab, queryParams);
    if (!next) return;
    const qs = next.toString();
    globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`);
    setQueryParams(new URLSearchParams(next.toString()));
  }, [isGuides, activeTab, queryParams]);

  const pageSize = Math.min(200, Math.max(1, Number.parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
  const currentPage = Math.max(1, Number.parseInt(queryParams.get('page') || '1', 10));
  const totalPages = Math.max(1, Math.ceil(Math.max(totalCount, 0) / pageSize));

  // For courses: URL-based filtering handling
  const courseFacets = isCourses ? parseFacets(searchParams) : undefined;
  const lmsFilteredItems = isCourses ? applyFilters(LMS_COURSES, courseFacets || {}) : [];
  const searchFilteredItems = filterLmsItemsBySearch(isCourses, searchQuery, lmsFilteredItems);
  const urlBasedFilters = computeUrlBasedFilters(isCourses, courseFacets);

  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
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

  const runGuides = useCallback(async () => {
    if (activeTab === 'glossary' || activeTab === 'faqs') {
      setLoading(false);
      setFilteredItems([]);
      setTotalCount(0);
      return;
    }

    if (activeTab === 'blueprints') {
      await runBlueprintsTab(queryParams, currentPage, pageSize, setFilteredItems, setTotalCount, setLoading);
      return;
    }

    setLoading(true);
    try {
      const excludedSlugs = ['atp-guidelines', 'agile-working-guidelines', 'client-session-guidelines', 'dbp-support-guidelines', 'dq-products'];
      let q = supabaseClient.from('guides').select(GUIDE_LIST_SELECT, { count: 'exact' }) as any;
      excludedSlugs.forEach(slug => { q = q.neq('slug', slug); });

      const vars = parseGuideQueryVars(queryParams);
      const { qStr, domains, rawSubs, guideTypes, units, statuses, testimonialCategories,
        strategyTypes, strategyFrameworks, guidelinesCategories, categorization,
        blueprintFrameworks, blueprintSectors, productTypes, productStages, productSectors, sort } = vars;

      const flags = computeGuideTabFlags(activeTab);
      const { isStrategyTab, isBlueprintTab, isTestimonialsTab, isGuidelinesTab, isSpecialTab } = flags;

      const subDomains = computeAllowedSubDomains(domains, rawSubs, isSpecialTab);
      const effectiveGuideTypes = isSpecialTab ? [] : guideTypes;
      const effectiveUnits = (isStrategyTab || isBlueprintTab || !isSpecialTab) ? units : [];

      const subGuard = applySubDomainGuard(isSpecialTab, rawSubs, subDomains, queryParams);
      if (subGuard) {
        globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${subGuard.toString() ? '?' + subGuard.toString() : ''}`);
        setQueryParams(new URLSearchParams(subGuard.toString()));
        setLoading(false);
        return;
      }

      const tabFlags: GuidesTabFlags = { isStrategyTab, isTestimonialsTab, isGuidelinesTab, isSpecialTab };
      q = applyGuidesQueryFilters(q, { statuses, qStr, domains, subDomains, effectiveGuideTypes, sort }, tabFlags);

      const needsClientSideFiltering = computeNeedsClientSideFiltering({
        isStrategyTab, isBlueprintTab, isGuidelinesTab,
        strategyFrameworks, blueprintFrameworks, blueprintSectors,
        productTypes, productStages, productSectors, guidelinesCategories,
        effectiveUnits, categorization,
      });

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      const facetQ = applyFacetQueryFilters(
        supabaseClient.from('guides').select('domain,sub_domain,guide_type,function_area,unit,location,status') as any,
        statuses, qStr, excludedSlugs, { isStrategyTab, isTestimonialsTab }
      );

      const { rows, count, error } = await fetchGuideData(q, facetQ, needsClientSideFiltering, from, to);
      if (error) throw error;
      
      const mapped = (rows || []).map(mapGuideRow).filter((it: any) => !excludedSlugs.includes(it.slug));
      const clientFilterParams = {
        domains, subDomains, effectiveGuideTypes, effectiveUnits, categorization,
        isGuidelinesTab, isBlueprintTab, isStrategyTab, isTestimonialsTab,
        strategyTypes, strategyFrameworks, guidelinesCategories,
        productTypes, productStages, productSectors, blueprintSectors,
        testimonialCategories, statuses, qStr, slugifyFn: slugify,
      };

      const { out, totalFiltered } = applyGuidePostFetch({
        mapped, flags: { ...flags }, clientFilterParams, sort,
        needsClientSideFiltering, from, pageSize, isGuides, activeTab,
      });

      const total = computePageTotal(out, count, needsClientSideFiltering, isBlueprintTab, totalFiltered);
      const lastPage = Math.max(1, Math.ceil(total / pageSize));

      const pageGuard = applyPageOverflowGuard(currentPage, lastPage, queryParams);
      if (pageGuard) {
        globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${pageGuard.toString() ? '?' + pageGuard.toString() : ''}`);
        globalThis.window?.scrollTo({ top: 0, behavior: 'smooth' });
        setQueryParams(new URLSearchParams(pageGuard.toString()));
        setLoading(false);
        return;
      }

      setFilteredItems(out);
      setTotalCount(total);
    } catch (e) {
      console.error('[useMarketplaceLogic] Failed to load guides:', e);
      setError('Failed to load guides. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, queryParams, currentPage, pageSize, isGuides]);

  const runOtherMarketplace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const itemsData = await fetchMarketplaceItems(
        marketplaceType,
        Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : (v || '')])),
        searchQuery
      );
      const finalItems = itemsData?.length ? itemsData : getFallbackItems(marketplaceType);
      const filtered = isServicesCenter
        ? applyServicesCenterFilters(finalItems, filters, activeServiceTab, searchQuery)
        : applyGenericSearch(finalItems, searchQuery);
      setFilteredItems(filtered);
      setTotalCount(filtered.length);
    } catch (err) {
      console.error(`[useMarketplaceLogic] Failed to load ${marketplaceType}:`, err);
      setError(`Failed to load ${marketplaceType}`);
    } finally {
      setLoading(false);
    }
  }, [marketplaceType, filters, searchQuery, isServicesCenter, activeServiceTab]);

  useEffect(() => {
    if (isCourses) {
      setLoading(false);
      setError(null);
      setTotalCount(searchFilteredItems.length);
      return;
    }
    if (isKnowledgeHub) {
      const fallbackItems = getFallbackItems(marketplaceType);
      setFilteredItems(fallbackItems);
      setTotalCount(fallbackItems.length);
      setLoading(false);
      return;
    }
    if (isGuides) {
      runGuides();
      return;
    }
    runOtherMarketplace();
  }, [marketplaceType, queryParams, isCourses, isKnowledgeHub, isGuides, currentPage, pageSize, runGuides, runOtherMarketplace, searchFilteredItems.length]);

  useEffect(() => {
    if (isCourses) {
      const updatedParams = handleNewjoinerTrackParams(searchParams);
      if (updatedParams) setSearchParams(updatedParams, { replace: true });
    }
  }, [isCourses, searchParams, setSearchParams]);

  useEffect(() => {
    if (isCourses) {
      setFilterConfig(COURSE_FILTER_CONFIG);
      setLoading(false);
      return;
    }
    loadFilterConfig(
      {
        isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem,
        marketplaceType, activeServiceTab, config,
        currentFilterConfigLength: filterConfig.length,
        currentFiltersLength: Object.keys(filters).length,
      },
      { setFilterConfig, setFilters }
    );
  }, [marketplaceType, config, isCourses, isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem, activeServiceTab]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (isCourses) {
      toggleFilter(filterType, value);
      return;
    }
    if (isGuides) return;
    setFilters(prev => {
      const current = prev[filterType];
      if (Array.isArray(current)) {
        const exists = current.includes(value);
        const nextValues = exists ? current.filter(v => v !== value) : [...current, value];
        return { ...prev, [filterType]: nextValues };
      } else {
        return { ...prev, [filterType]: value === prev[filterType] ? '' : value };
      }
    });
  }, [isCourses, isGuides, toggleFilter]);

  const resetFilters = useCallback(() => {
    if (isCourses) {
      setSearchParams(new URLSearchParams(), { replace: true });
      setSearchQuery('');
    } else if (isKnowledgeHub) {
      setActiveFilters([]);
      setSearchQuery('');
    } else if (isGuides) {
      setQueryParams(new URLSearchParams());
      setSearchQuery('');
    } else {
      setFilters({});
      setSearchQuery('');
    }
  }, [isCourses, isKnowledgeHub, isGuides, setSearchParams]);

  const handleKnowledgeHubFilterChange = useCallback((filter: string) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  }, []);

  const clearKnowledgeHubFilters = useCallback(() => setActiveFilters([]), []);

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
  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    const next = new URLSearchParams(queryParams.toString());
    if (clamped <= 1) next.delete('page');
    else next.set('page', String(clamped));
    globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${next.toString() ? '?' + next.toString() : ''}`);
    globalThis.window?.scrollTo({ top: 0, behavior: 'smooth' });
    setQueryParams(new URLSearchParams(next.toString()));
  }, [queryParams, totalPages]);

  const normalizedFilters: Record<string, string[]> = isCourses
    ? urlBasedFilters
    : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, toNormalizedArr(v)])) as Record<string, string[]>);

  const hasActiveFilters = 
    (isCourses && Object.values(urlBasedFilters).some(f => f.length > 0)) ||
    (isKnowledgeHub && activeFilters.length > 0) ||
    (!isGuides && Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== ''));

  return {
    isGuides, isCourses, isKnowledgeHub, isServicesCenter, isDesignSystem,
    navigate, searchParams, setSearchParams, config,
    activeServiceTab, setActiveServiceTab,
    filteredItems, setFilteredItems, totalCount, setTotalCount,
    searchQuery, setSearchQuery, filters, setFilters, filterConfig, setFilterConfig,
    facets, setFacets, queryParams, setQueryParams,
    activeTab, setActiveTab, activeDesignSystemTab, setActiveDesignSystemTab,
    handleGuidesTabChange, pageSize, currentPage, totalPages,
    showFilters, setShowFilters, sidebarOpen, setSidebarOpen,
    bookmarkedItems, setBookmarkedItems, compareItems, setCompareItems,
    showComparison, setShowComparison, loading, setLoading, error, setError,
    activeFilters, setActiveFilters, toggleFilter,
    runGuides, handleFilterChange, resetFilters,
    handleKnowledgeHubFilterChange, clearKnowledgeHubFilters,
    toggleFilters, toggleBookmark, handleAddToComparison, handleRemoveFromComparison,
    retryFetch, goToPage, normalizedFilters, hasActiveFilters,
    searchFilteredItems
  };
};
