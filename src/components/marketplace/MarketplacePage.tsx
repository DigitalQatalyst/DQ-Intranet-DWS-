import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from './FilterSidebar.js';
import { MarketplaceGrid } from './MarketplaceGrid.js';
import { SearchBar } from '../SearchBar.js';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader.js';
import { fetchMarketplaceItems, fetchMarketplaceFilters } from '../../services/marketplace.js';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig.js';
import { MarketplaceComparison } from './MarketplaceComparison.js';
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
import GuidesFilters, { GuidesFacets } from '../guides/GuidesFilters';
import GuidesGrid from '../guides/GuidesGrid';
import { supabaseClient } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';

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

interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

export interface MarketplacePageProps {
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding' | 'guides';
  title: string;
  description: string;
  promoCards?: any[];
}

const SUBDOMAIN_BY_DOMAIN: Record<string, string[]> = {
  strategy: ['journey', 'history', 'digital-framework', 'initiatives', 'clients'],
  guidelines: ['resources', 'policies', 'design-systems'],
  blueprints: ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'],
};

const DEFAULT_GUIDE_PAGE_SIZE = 9;
const GUIDE_LIST_SELECT = [
  'id',
  'slug',
  'title',
  'summary',
  'hero_image_url',
  'last_updated_at',
  'author_name',
  'author_org',
  'is_editors_pick',
  'download_count',
  'guide_type',
  'domain',
  'function_area',
  'unit',
  'sub_domain',
  'location',
  'status',
  'complexity_level',
].join(',');

const parseFilterValues = (params: URLSearchParams, key: string): string[] =>
  (params.get(key) || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title: _title,
  description: _description,
  promoCards = []
}) => {
  const isGuides = marketplaceType === 'guides';
  const isCourses = marketplaceType === 'courses';
  const isKnowledgeHub = marketplaceType === 'knowledge-hub';
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getMarketplaceConfig(marketplaceType);

  // Items & filters state
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Guides facets + URL state
  const [facets, setFacets] = useState<GuidesFacets>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));
  const searchStartRef = useRef<number | null>(null);

  const pageSize = Math.min(50, Math.max(1, parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
  const currentPage = Math.max(1, parseInt(queryParams.get('page') || '1', 10));
  const totalPages = Math.max(1, Math.ceil(Math.max(totalCount, 0) / pageSize));

  // UI state
  
  // For courses: URL-based filtering
  const courseFacets = isCourses ? parseFacets(searchParams) : undefined;
  const lmsFilteredItems = isCourses
    ? applyFilters(LMS_COURSES, courseFacets || {})
    : [];
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  // Knowledge-hub specific state
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Courses: URL toggle function
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
  
  // Apply search query to LMS items
  const searchFilteredItems = isCourses && searchQuery
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
  
  // Compute filters from URL for courses
  const urlBasedFilters: Record<string, string[]> = isCourses
    ? {
        category: courseFacets?.category || [],
        delivery: courseFacets?.delivery || [],
        duration: courseFacets?.duration || [],
        level: (courseFacets?.level || []) as string[],
        department: courseFacets?.department || [],
        location: courseFacets?.location || [],
        audience: courseFacets?.audience || [],
        status: courseFacets?.status || []
      }
    : {};
  
  // Handle track parameter for newjoiner (courses)
  useEffect(() => {
    if (isCourses) {
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
  }, [isCourses, searchParams, setSearchParams]);
  
  // Load filter configurations
  useEffect(() => {
    if (isCourses) {
      setFilterConfig(COURSE_FILTER_CONFIG);
      setLoading(false);
      return;
    }
  const loadFilterOptions = async () => {
      if (isGuides || isKnowledgeHub) {
        if (filterConfig.length || Object.keys(filters).length) {
          setFilterConfig([]);
          setFilters({});
        }
        return;
      }
      try {
        let filterOptions = await fetchMarketplaceFilters(marketplaceType);
        filterOptions = prependLearningTypeFilter(marketplaceType, filterOptions);
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
  }, [marketplaceType, config, isCourses, isGuides, isKnowledgeHub, filterConfig.length, Object.keys(filters).length]);
  
  // Fetch items based on marketplace type
  useEffect(() => {
    const run = async () => {
      // COURSES: items come from LMS arrays / URL filters; no fetch
      if (isCourses) {
        setLoading(false);
        setError(null);
        // optional: reflect count in state for pager/UI
        setTotalCount(searchFilteredItems.length);
        setItems([]);               // not used in render for courses
        setFilteredItems([]);       // render uses searchFilteredItems when isCourses
        return;
      }

      // KNOWLEDGE HUB: use fallback data (no API)
      if (isKnowledgeHub) {
        const fallbackItems = getFallbackItems(marketplaceType);
        setItems(fallbackItems);
        setFilteredItems(fallbackItems);
        setTotalCount(fallbackItems.length);
        setLoading(false);
        return;
      }

      // GUIDES: Supabase query + facets
      if (isGuides) {
        setLoading(true);
        try {
          let q = supabaseClient.from('guides').select(GUIDE_LIST_SELECT, { count: 'exact' });

          const qStr = queryParams.get('q') || '';
          const domains     = parseFilterValues(queryParams, 'domain');
          const rawSubs     = parseFilterValues(queryParams, 'sub_domain');
          const guideTypes  = parseFilterValues(queryParams, 'guide_type');
          const units       = parseFilterValues(queryParams, 'unit');
          const locations   = parseFilterValues(queryParams, 'location');
          const statuses    = parseFilterValues(queryParams, 'status');

          const allowed = new Set<string>();
          domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
          const subDomains = allowed.size ? rawSubs.filter(v => allowed.has(v)) : [];

          if (rawSubs.length && subDomains.length !== rawSubs.length) {
            const next = new URLSearchParams(queryParams.toString());
            if (subDomains.length) next.set('sub_domain', subDomains.join(','));
            else next.delete('sub_domain');
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
            }
            setQueryParams(new URLSearchParams(next.toString()));
            setLoading(false);
            return;
          }

          if (statuses.length) q = q.in('status', statuses); else q = q.eq('status', 'Approved');
          if (qStr) q = q.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
          if (domains.length)   q = q.in('domain', domains);
          if (subDomains.length)q = q.in('sub_domain', subDomains);
          if (guideTypes.length)q = q.in('guide_type', guideTypes);
          if (units.length)     q = q.in('unit', units);
          if (locations.length) q = q.in('location', locations);

          const sort = queryParams.get('sort') || 'relevance';
          if (sort === 'updated')       q = q.order('last_updated_at', { ascending: false, nullsFirst: false });
          else if (sort === 'downloads')q = q.order('download_count',   { ascending: false, nullsFirst: false });
          else if (sort === 'editorsPick') {
            q = q.order('is_editors_pick', { ascending: false })
                .order('last_updated_at', { ascending: false, nullsFirst: false });
          } else {
            q = q.order('is_editors_pick', { ascending: false })
                .order('download_count',   { ascending: false, nullsFirst: false })
                .order('last_updated_at',  { ascending: false, nullsFirst: false });
          }

          const from = (currentPage - 1) * pageSize;
          const to   = from + pageSize - 1;

          const listPromise = q.range(from, to);
          let facetQ = supabaseClient
            .from('guides')
            .select('domain,sub_domain,guide_type,function_area,unit,location,status')
            .eq('status', 'Approved');

          if (qStr)              facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
          if (domains.length)    facetQ = facetQ.in('domain', domains);
          if (subDomains.length) facetQ = facetQ.in('sub_domain', subDomains);
          if (guideTypes.length) facetQ = facetQ.in('guide_type', guideTypes);
          if (units.length)      facetQ = facetQ.in('unit', units);
          if (locations.length)  facetQ = facetQ.in('location', locations);
          if (statuses.length)   facetQ = facetQ.in('status', statuses);

          const [{ data: rows, count, error }, { data: facetRows, error: facetError }] = await Promise.all([
            listPromise,
            facetQ,
          ]);
          if (error) throw error;
          if (facetError) console.warn('Facet query failed', facetError);

          const mapped = (rows || []).map((r: any) => {
            const unitValue = r.unit ?? r.function_area ?? null;
            const subDomainValue = r.sub_domain ?? r.subDomain ?? null;
            return {
              id: r.id,
              slug: r.slug,
              title: r.title,
              summary: r.summary,
              heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
              // skillLevel: r.skill_level ?? r.skillLevel,
              estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
              lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
              authorName: r.author_name ?? r.authorName,
              authorOrg: r.author_org ?? r.authorOrg,
              isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
              downloadCount: r.download_count ?? r.downloadCount,
              guideType: r.guide_type ?? r.guideType,
              domain: r.domain ?? null,
              functionArea: unitValue,
              unit: unitValue,
              subDomain: subDomainValue,
              location: r.location ?? null,
              status: r.status ?? null,
              complexityLevel: r.complexity_level ?? null,
            };
          });

          let out = mapped;
          if (domains.length)    out = out.filter(it => it.domain && domains.includes(it.domain));
          if (subDomains.length) out = out.filter(it => it.subDomain && subDomains.includes(it.subDomain));
          if (guideTypes.length) out = out.filter(it => it.guideType && guideTypes.includes(it.guideType));
          if (units.length)      out = out.filter(it => (it.unit || it.functionArea) && units.includes(it.unit || it.functionArea));
          if (locations.length)  out = out.filter(it => it.location && locations.includes(it.location));
          if (statuses.length)   out = out.filter(it => it.status && statuses.includes(it.status));

          if (sort === 'updated')       out.sort((a,b) => new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
          else if (sort === 'downloads')out.sort((a,b) => (b.downloadCount||0)-(a.downloadCount||0));
          else if (sort === 'editorsPick')
            out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                              new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
          else
            out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                              (b.downloadCount||0)-(a.downloadCount||0) ||
                              new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());

          const total = typeof count === 'number' ? count : out.length;
          const lastPage = Math.max(1, Math.ceil(total / pageSize));
          if (currentPage > lastPage) {
            const next = new URLSearchParams(queryParams.toString());
            if (lastPage <= 1) next.delete('page'); else next.set('page', String(lastPage));
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setQueryParams(new URLSearchParams(next.toString()));
            setLoading(false);
            return;
          }

          // facets query (unchanged)
          const countBy = (arr: any[] | null | undefined, key: string) => {
            const m = new Map<string, number>();
            for (const r of (arr || [])) { const v = (r as any)[key]; if (!v) continue; m.set(v, (m.get(v)||0)+1); }
            return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt }))
                      .sort((a,b)=> a.name.localeCompare(b.name));
          };

          const domainFacets      = countBy(facetRows, 'domain');
          const guideTypeFacets   = countBy(facetRows, 'guide_type');
          const subDomainFacetsRaw= countBy(facetRows, 'sub_domain');
          const unitFacets        = countBy(facetRows, 'unit');
          const locationFacets    = countBy(facetRows, 'location');
          const statusFacets      = countBy(facetRows, 'status');

          const allowedForFacets = new Set<string>();
          domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowedForFacets.add(s)));
          const subDomainFacets = allowedForFacets.size
            ? subDomainFacetsRaw.filter(opt => allowedForFacets.has(opt.id))
            : subDomainFacetsRaw;

          setItems(out);
          setFilteredItems(out);
          setTotalCount(total);
          setFacets({
            domain: domainFacets,
            sub_domain: subDomainFacets,
            guide_type: guideTypeFacets,
            unit: unitFacets,
            location: locationFacets,
            status: statusFacets,
          });

          const start = searchStartRef.current;
          if (start) { const latency = Date.now() - start; track('Guides.Search', { q: qStr, latency_ms: latency }); searchStartRef.current = null; }
          track('Guides.ViewList', { q: qStr, sort, page: String(currentPage) });
        } catch (e) {
          console.error('Error fetching guides:', e);
          setItems([]); setFilteredItems([]); setFacets({}); setTotalCount(0);
        } finally {
          setLoading(false);
        }
        return;
      }

      // OTHER MARKETPLACES (financial, non-financial, onboarding)
      setLoading(true);
      setError(null);
      try {
        const itemsData = await fetchMarketplaceItems(
          marketplaceType,
          Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : (v || '')])),
          searchQuery
        );
        const finalItems = itemsData?.length ? itemsData : getFallbackItems(marketplaceType);
        setItems(finalItems);
        setFilteredItems(finalItems);
        setTotalCount(finalItems.length);
      } catch (err) {
        console.error(`Error fetching ${marketplaceType} items:`, err);
        setError(`Failed to load ${marketplaceType}`);
        const fallbackItems = getFallbackItems(marketplaceType);
        setItems(fallbackItems);
        setFilteredItems(fallbackItems);
        setTotalCount(fallbackItems.length);
      } finally {
        setLoading(false);
      }
    };

    run();
    // Keep deps lean; no need to include functions like isGuides
  }, [marketplaceType, filters, searchQuery, queryParams, isCourses, isKnowledgeHub, currentPage, pageSize]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (isCourses) {
      toggleFilter(filterType, value);
      return;
    }
    if (isGuides) {
      // Guides filters are handled via queryParams in GuidesFilters component
      return;
    }
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
  }, [isCourses, isGuides, marketplaceType, toggleFilter]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    if (isCourses) {
      const newParams = new URLSearchParams();
      setSearchParams(newParams, { replace: true });
      setSearchQuery('');
    } else if (isKnowledgeHub) {
      setActiveFilters([]);
      setSearchQuery('');
    } else if (isGuides) {
      const newParams = new URLSearchParams();
      const qs = newParams.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
      setQueryParams(newParams);
      setSearchQuery('');
    } else {
      const empty: Record<string, string> = {};
      filterConfig.forEach(c => { empty[c.id] = ''; });
      setFilters(empty);
      setSearchQuery('');
    }
  }, [isCourses, isKnowledgeHub, isGuides, marketplaceType, filterConfig, setSearchParams]);
  
  // Knowledge Hub filter handlers
  const handleKnowledgeHubFilterChange = useCallback((filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  }, []);
  
  const clearKnowledgeHubFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);
  
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
  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    const next = new URLSearchParams(queryParams.toString());
    if (clamped <= 1) next.delete('page');
    else next.set('page', String(clamped));
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setQueryParams(new URLSearchParams(next.toString()));
  }, [queryParams, totalPages]);

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isGuides ? 'guidelines-theme' : ''}`}>
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
            {isGuides ? (
              <>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">Resources</span>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-700 md:ml-2">{config.title}</span>
                  </div>
                </li>
              </>
            ) : (
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{config.itemNamePlural}</span>
                </div>
              </li>
            )}
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={isGuides ? (queryParams.get('q') || '') : searchQuery}
              setSearchQuery={(q: string) => {
                if (isGuides) {
                  const next = new URLSearchParams(queryParams.toString());
                  next.delete('page');
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
          {isGuides && (
            <select
              className="border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-[var(--guidelines-primary)]"
              aria-label="Sort guides"
              value={queryParams.get('sort') || 'relevance'}
              onChange={(e) => {
                const next = new URLSearchParams(queryParams.toString());
                next.delete('page');
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
              {(isCourses ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : 
                 isKnowledgeHub ? activeFilters.length > 0 :
                 isGuides ? false :
                 Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''))) && (
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
                  {isGuides ? (
                    <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
                  ) : (
                    <FilterSidebar
                      filters={isCourses ? urlBasedFilters : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v : (v ? [v] : [])])) as Record<string, string[]>)}
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
            {isGuides ? (
              <GuidesFilters facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {(isCourses ? Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) : 
                     isKnowledgeHub ? activeFilters.length > 0 :
                     Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''))) && (
                    <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Reset All</button>
                  )}
                </div>
                {isKnowledgeHub ? (
                  <div className="space-y-4">
                    {filterConfig.map(category => <div key={category.id} className="border-b border-gray-100 pb-3">
                        <h3 className="font-medium text-gray-900 mb-2">{category.title}</h3>
                        <div className="space-y-2">
                          {category.options.map(option => <div key={option.id} className="flex items-center">
                              <input type="checkbox" id={`desktop-${category.id}-${option.id}`} checked={activeFilters.includes(option.name)} onChange={() => handleKnowledgeHubFilterChange(option.name)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                              <label htmlFor={`desktop-${category.id}-${option.id}`} className="ml-2 text-sm text-gray-700">{option.name}</label>
                            </div>)}
                        </div>
                      </div>)}
                  </div>
                ) : (
                  <FilterSidebar
                    filters={isCourses ? urlBasedFilters : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v : (v ? [v] : [])])) as Record<string, string[]>)}
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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
              </div>
            ) : error && !isGuides && !isKnowledgeHub ? (
              <ErrorDisplay message={error} onRetry={retryFetch} />
            ) : isKnowledgeHub ? (
              <KnowledgeHubGrid
                bookmarkedItems={bookmarkedItems}
                onToggleBookmark={toggleBookmark}
                onAddToComparison={handleAddToComparison}
                searchQuery={searchQuery}
                activeFilters={activeFilters}
                onFilterChange={handleKnowledgeHubFilterChange}
                onClearFilters={clearKnowledgeHubFilters}
              />
            ) : isGuides ? (
              <>
                <GuidesGrid
                  items={filteredItems}
                  onClickGuide={(g) => {
                    const qs = queryParams.toString();
                    navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs } });
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
              </>
            ) : (
              <MarketplaceGrid
                items={isCourses ? searchFilteredItems.map(course => {
                  const allowedSet = new Set<string>(LOCATION_ALLOW as readonly string[]);
                  const safeLocations = (course.locations || []).filter(loc => allowedSet.has(loc));
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
