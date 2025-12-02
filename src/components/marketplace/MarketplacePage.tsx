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
import TestimonialsGrid from '../guides/TestimonialsGrid';
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

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

const DEFAULT_GUIDE_PAGE_SIZE = 200;
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
type WorkGuideTab = 'guidelines' | 'strategy' | 'blueprints' | 'testimonials' | 'resources';
  const getTabFromParams = useCallback((params: URLSearchParams): WorkGuideTab => {
    const tab = params.get('tab');
    return tab === 'strategy' || tab === 'blueprints' || tab === 'testimonials' || tab === 'resources' ? tab : 'guidelines';
  }, []);
  const [activeTab, setActiveTab] = useState<WorkGuideTab>(() => getTabFromParams(typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()));

  const TAB_LABELS: Record<WorkGuideTab, string> = {
    strategy: 'Strategy',
    guidelines: 'Guidelines',
    blueprints: 'Blueprints',
    testimonials: 'Testimonials',
    resources: 'Library'
  };

  const TAB_DESCRIPTIONS: Record<WorkGuideTab, { description: string; author?: string }> = {
    strategy: {
      description: 'Strategic frameworks, transformation journeys, and organizational initiatives that guide decision-making and long-term planning across Digital Qatalyst.',
      author: 'Authored by DQ Leadership and Strategy Teams'
    },
    guidelines: {
      description: 'Practical guidelines, best practices, and operational procedures that support everyday delivery, collaboration, and excellence across all teams and units.',
      author: 'Authored by DQ Associates, Leads, and Subject Matter Experts'
    },
    blueprints: {
      description: 'Standardized blueprints, templates, and proven methodologies that enable consistent execution, reduce rework, and accelerate delivery across projects and initiatives.',
      author: 'Authored by DQ Delivery Teams and Practice Leads'
    },
    testimonials: {
      description: 'Success stories, case studies, and reflections that capture lessons learned, celebrate achievements, and share insights from real-world experiences and transformations.',
      author: 'Authored by DQ Teams, Clients, and Partners'
    },
    resources: {
      description: 'Library of reference materials, glossaries, and FAQs that help you navigate DQ terminology, processes, and best practices.',
      author: 'Maintained by DQ Knowledge Management Team'
    }
  };

  useEffect(() => {
    if (!isGuides) return;
    setActiveTab(getTabFromParams(queryParams));
  }, [isGuides, queryParams, getTabFromParams]);

  const handleGuidesTabChange = useCallback((tab: WorkGuideTab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(queryParams.toString());
    next.delete('page');
    if (tab === 'guidelines') {
      next.delete('tab');
    } else {
      next.set('tab', tab);
    }
    if (tab !== 'guidelines') {
      // For Strategy and Blueprints, keep 'unit' filter; only delete incompatible filters
      if (tab === 'strategy') {
        // Keep 'unit' and 'location' for Strategy; delete incompatible filters
        const keysToDelete = ['guide_type', 'sub_domain', 'domain', 'testimonial_category'];
        keysToDelete.forEach(key => next.delete(key));
      } else if (tab === 'blueprints') {
        // Keep 'unit' and 'location' for Blueprints; delete incompatible filters
        const keysToDelete = ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_sector'];
        keysToDelete.forEach(key => next.delete(key));
      } else if (tab === 'resources') {
        // For Resources tab, delete all incompatible filters
        const keysToDelete = ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
        keysToDelete.forEach(key => next.delete(key));
      } else if (tab === 'testimonials') {
        // Keep 'unit' and 'location' for Testimonials; delete incompatible filters
        const keysToDelete = ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector'];
        keysToDelete.forEach(key => next.delete(key));
      } else {
        // For other tabs, delete all incompatible filters
        const keysToDelete = ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
        keysToDelete.forEach(key => next.delete(key));
      }
    } else {
      // Switching to Guidelines - clear Strategy and Blueprint-specific filters
      const keysToDelete = ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'];
      keysToDelete.forEach(key => next.delete(key));
    }
    // Clear tab-specific filters when switching away from their respective tabs
    if (tab !== 'guidelines') {
      next.delete('guidelines_category');
    }
    if (tab !== 'blueprints') {
      next.delete('blueprint_framework');
    }
    const qs = next.toString();
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
    }
    setQueryParams(new URLSearchParams(next.toString()));
    track('Guides.TabChanged', { tab });
  }, [queryParams, setQueryParams]);

  // Clean up incompatible filters when tab changes (not on every query change)
  const prevTabRef = useRef<WorkGuideTab>(activeTab);
  useEffect(() => {
    if (!isGuides) return;
    if (activeTab === 'guidelines') return;
    // Only run if tab actually changed
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;
    
    const next = new URLSearchParams(queryParams.toString());
    let changed = false;
    // For Strategy and Blueprints, keep 'unit' filter; only delete incompatible filters
    let keysToDelete: string[] = [];
    if (activeTab === 'strategy') {
      // Keep 'unit' and 'location' for Strategy; delete incompatible filters
      keysToDelete = ['guide_type', 'sub_domain', 'domain', 'testimonial_category'];
    } else if (activeTab === 'blueprints') {
      // Keep 'unit' and 'location' for Blueprints; delete incompatible filters
      keysToDelete = ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category'];
    } else if (activeTab === 'testimonials') {
      // For Testimonials, delete all incompatible filters
      keysToDelete = ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector'];
    } else if (activeTab === 'resources') {
      // For Resources, delete all incompatible filters
      keysToDelete = ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
    } else {
      // For Guidelines, delete Strategy and Blueprint-specific filters
      keysToDelete = ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'];
    }
    // Clear tab-specific filters when switching away from their respective tabs
    if (activeTab !== 'guidelines') {
      if (next.has('guidelines_category')) {
        next.delete('guidelines_category');
        changed = true;
      }
    }
    if (activeTab !== 'blueprints') {
      if (next.has('blueprint_framework')) {
        next.delete('blueprint_framework');
        changed = true;
      }
      if (next.has('blueprint_sector')) {
        next.delete('blueprint_sector');
        changed = true;
      }
    }
    keysToDelete.forEach(key => {
      if (next.has(key)) {
        next.delete(key);
        changed = true;
      }
    });
    if (!changed) return;
    const qs = next.toString();
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
    }
    setQueryParams(new URLSearchParams(next.toString()));
  }, [isGuides, activeTab]);

  const pageSize = Math.min(200, Math.max(1, parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
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
          const testimonialCategories = parseFilterValues(queryParams, 'testimonial_category');
          const strategyTypes = parseFilterValues(queryParams, 'strategy_type');
          const strategyFrameworks = parseFilterValues(queryParams, 'strategy_framework');
          const guidelinesCategories = parseFilterValues(queryParams, 'guidelines_category');
          const blueprintFrameworks = parseFilterValues(queryParams, 'blueprint_framework');
          const blueprintSectors = parseFilterValues(queryParams, 'blueprint_sector');

          // Get activeTab from state - ensure it's current
          const currentActiveTab = activeTab;
          const isStrategyTab = currentActiveTab === 'strategy';
          const isBlueprintTab = currentActiveTab === 'blueprints';
          const isTestimonialsTab = currentActiveTab === 'testimonials';
          const isResourcesTab = currentActiveTab === 'resources';
          const isGuidelinesTab = currentActiveTab === 'guidelines';
          const isSpecialTab = isStrategyTab || isBlueprintTab || isTestimonialsTab || isResourcesTab;

          const allowed = new Set<string>();
          if (!isSpecialTab) {
            domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
          }
          const subDomains = !isSpecialTab
            ? (allowed.size ? rawSubs.filter(v => allowed.has(v)) : rawSubs)
            : [];

          const effectiveGuideTypes = isSpecialTab ? [] : guideTypes;
          // Enable unit filtering for all tabs (Strategy, Blueprints, and Guidelines)
          const effectiveUnits = (isStrategyTab || isBlueprintTab || !isSpecialTab) ? units : [];

          if (!isSpecialTab && rawSubs.length && subDomains.length !== rawSubs.length) {
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
          // For Strategy, Blueprints, and Testimonials tabs: fetch all approved guides
          // Client-side filtering will handle the domain/guide_type matching
          // This ensures we don't miss any guides due to query syntax issues
          if (isStrategyTab || isBlueprintTab || isTestimonialsTab) {
            // Don't filter by domain/guide_type here - let client-side filtering handle it
            // This ensures we get all guides and filter them properly client-side
          } else if (isGuidelinesTab) {
            // For Guidelines tab: if domain filter is set, use it; otherwise fetch all and filter client-side
            // Client-side filtering will exclude Strategy/Blueprint/Testimonial guides
            if (domains.length) {
              q = q.in('domain', domains);
            }
            // If no domain filter, fetch all guides - client-side will filter out Strategy/Blueprint/Testimonial
          } else if (domains.length) {
            q = q.in('domain', domains);
          }
          // Note: For Guidelines tab, we also do client-side filtering to be extra safe
          if (!isSpecialTab && subDomains.length) q = q.in('sub_domain', subDomains);
          // For Guidelines, guide_type filtering is done client-side because filter IDs are slugified ('best-practice')
          // but database values are like 'Best Practice', so Supabase .in() won't match
          // For other tabs, use Supabase filter if guide types are provided
          if (effectiveGuideTypes.length && !isGuidelinesTab) q = q.in('guide_type', effectiveGuideTypes);
          // Note: Unit filtering is done client-side after fetching to handle normalization
          // (filter IDs are slugified like 'deals', but DB may have 'Deals' or 'DQ Delivery (Accounts)')
          if (locations.length) q = q.in('location', locations);

          const sort = queryParams.get('sort') || 'editorsPick';
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

          // If unit filtering or framework filtering is needed client-side, fetch ALL results first, then filter and paginate
          // Otherwise, use server-side pagination
          const needsClientSideUnitFilter = effectiveUnits.length > 0;
          const needsClientSideFrameworkFilter = (isStrategyTab && strategyFrameworks.length > 0) || 
                                                 (isBlueprintTab && (blueprintFrameworks.length > 0 || blueprintSectors.length > 0)) ||
                                                 (isGuidelinesTab && guidelinesCategories.length > 0);
          const needsClientSideFiltering = needsClientSideUnitFilter || needsClientSideFrameworkFilter;
          
          const from = (currentPage - 1) * pageSize;
          const to   = from + pageSize - 1;

          // Fetch all results if client-side filtering is needed, otherwise use pagination
          // When fetching all, we need to set a high limit (Supabase default is 1000)
          const listPromise = needsClientSideFiltering ? q.limit(10000) : q.range(from, to);
          
          let facetQ = supabaseClient
            .from('guides')
            .select('domain,sub_domain,guide_type,function_area,unit,location,status')
            .eq('status', 'Approved');

          // Facets should show ALL available options for the current tab, not filtered by selected filters
          // This ensures filter options don't disappear when other filters are selected
          if (qStr)              facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
          // For Strategy, Blueprints, and Testimonials tabs: don't filter facets server-side
          // Client-side filtering will handle the domain/guide_type matching for facets too
          // For Guidelines tab: facets should only include Guidelines guides (exclude Strategy/Blueprint/Testimonial)
          // But don't filter by selected guide_type, units, locations - show all available options for Guidelines
          // Only filter by status if needed
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
          
          // Apply tab filtering FIRST to get only guides for the current tab
          // This ensures unit filtering only applies to the correct tab's guides
          // CRITICAL: This must happen before any other filtering to prevent cross-tab contamination
          if (isStrategyTab) {
            out = out.filter(it => {
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              return domain.includes('strategy') || guideType.includes('strategy');
            });
          } else if (isBlueprintTab) {
            out = out.filter(it => {
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              return domain.includes('blueprint') || guideType.includes('blueprint');
            });
          } else if (isTestimonialsTab) {
            out = out.filter(it => {
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              return domain.includes('testimonial') || guideType.includes('testimonial');
            });
            const selectedTestimonials = testimonialCategories.map(slugify);
            if (selectedTestimonials.length) {
              out = out.filter(it => {
                // Testimonial categories are stored in guide_type field
                const guideType = (it.guideType || '').toLowerCase();
                if (!guideType) return false;
                // Check if guide_type matches any selected category (normalize both for comparison)
                const normalizedGuideType = slugify(guideType);
                return selectedTestimonials.some(sel => {
                  // Compare slugified values
                  return normalizedGuideType === sel || 
                         guideType.includes(sel) ||
                         sel.includes(normalizedGuideType);
                });
              });
            }
          } else if (isGuidelinesTab) {
            // Guidelines tab: explicitly exclude Strategy, Blueprint, and Testimonial guides
            // Must be strict - guides should NOT have Strategy/Blueprint/Testimonial in domain OR guide_type
            // This is CRITICAL to prevent Strategy guides from showing in Guidelines tab
            out = out.filter(it => {
              const domain = (it.domain || '').toLowerCase().trim();
              const guideType = (it.guideType || '').toLowerCase().trim();
              // Exclude if domain or guide_type contains strategy, blueprint, or testimonial
              const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
              const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
              const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
              // Only include if it doesn't have any of these - be very strict
              if (hasStrategy || hasBlueprint || hasTestimonial) {
                return false; // Explicitly exclude
              }
              return true; // Include only if it's definitely not Strategy/Blueprint/Testimonial
            });
          } else {
            // Fallback: if somehow we don't have a recognized tab, show nothing to be safe
            out = [];
          }
          // If no tab is active (shouldn't happen), show all guides
          
          // Now apply other filters to the tab-filtered results
          if (domains.length)    out = out.filter(it => it.domain && domains.includes(it.domain));
          if (subDomains.length) out = out.filter(it => it.subDomain && subDomains.includes(it.subDomain));
          if (effectiveGuideTypes.length) {
            // Normalize guide type values for comparison
            // Filter IDs come from facets which are the actual database values (like "Best Practice", "SOP")
            // Use OR logic: show guides that match ANY selected guide type
            // IMPORTANT: Only show guides that have a guide type assigned (don't show guides without guide types when filters are active)
            out = out.filter(it => {
              const guideTypeValue = it.guideType;
              // If guide has no guide type, exclude it when guide type filters are active
              if (!guideTypeValue) return false;
              // Compare both normalized (slugified) values for case-insensitive matching
              const normalizedDbValue = slugify(guideTypeValue);
              // Check if any selected guide type matches (normalize both sides for comparison)
              return effectiveGuideTypes.some(selectedType => {
                const normalizedSelected = slugify(selectedType);
                // Match if slugified values are equal, or if the actual values match (case-insensitive)
                return normalizedDbValue === normalizedSelected || 
                       guideTypeValue.toLowerCase().trim() === selectedType.toLowerCase().trim();
              });
            });
          }
          if (effectiveUnits.length) {
            // Normalize unit values for comparison (filter IDs are slugified like 'deals', DB values may be 'Deals' or 'DQ Delivery (Accounts)')
            // Use OR logic: show guides that match ANY selected unit
            // IMPORTANT: Only show guides that have a unit assigned (don't show guides without units when filters are active)
            out = out.filter(it => {
              const unitValue = it.unit || it.functionArea;
              // If guide has no unit, exclude it when unit filters are active
              if (!unitValue) return false;
              // Slugify the database value to match the filter ID format
              const normalizedDbValue = slugify(unitValue);
              // Filter IDs are already slugified, so compare directly - show if it matches ANY selected unit
              const matches = effectiveUnits.some(selectedUnit => {
                // Normalize both sides for comparison (in case selectedUnit isn't already slugified)
                const normalizedSelected = slugify(selectedUnit);
                return normalizedDbValue === normalizedSelected;
              });
              return matches;
            });
          }
          // Strategy-specific filters: Strategy Type and Framework/Program
          // These filters check sub_domain field (which stores these categories)
          if (isStrategyTab && strategyTypes.length) {
            out = out.filter(it => {
              const subDomain = (it.subDomain || '').toLowerCase();
              return strategyTypes.some(selectedType => {
                const normalizedSelected = slugify(selectedType);
                const normalizedSubDomain = slugify(subDomain);
                return normalizedSubDomain === normalizedSelected || 
                       subDomain.includes(selectedType.toLowerCase()) ||
                       selectedType.toLowerCase().includes(subDomain);
              });
            });
          }
          if (isStrategyTab && strategyFrameworks.length) {
            out = out.filter(it => {
              const subDomain = (it.subDomain || '').toLowerCase();
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase();
              return strategyFrameworks.some(selectedFramework => {
                const normalizedSelected = slugify(selectedFramework);
                // Check various fields for framework matches
                return allText.includes(selectedFramework.toLowerCase()) ||
                       allText.includes(normalizedSelected) ||
                       (selectedFramework === '6xd' && (allText.includes('6xd') || allText.includes('digital-framework'))) ||
                       (selectedFramework === 'ghc' && allText.includes('ghc')) ||
                       (selectedFramework === 'clients' && allText.includes('client')) ||
                       (selectedFramework === 'ghc-leader' && allText.includes('ghc-leader')) ||
                       (selectedFramework === 'testimonials-insights' && (allText.includes('testimonial') || allText.includes('insight')));
              });
            });
          }
          // Guidelines-specific filter: Category (Resources, Policies, xDS)
          if (isGuidelinesTab && guidelinesCategories.length) {
            out = out.filter(it => {
              const subDomain = (it.subDomain || '').toLowerCase();
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              const title = (it.title || '').toLowerCase();
              const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
              return guidelinesCategories.some(selectedCategory => {
                const normalizedSelected = slugify(selectedCategory);
                // Check various fields for category matches
                return allText.includes(selectedCategory.toLowerCase()) ||
                       allText.includes(normalizedSelected) ||
                       (selectedCategory === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
                       (selectedCategory === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
                       (selectedCategory === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
              });
            });
          }
          // Blueprints-specific filter: Framework (DevOps, DBP, DXP, DWS, Products, Projects)
          if (isBlueprintTab && blueprintFrameworks.length) {
            out = out.filter(it => {
              const subDomain = (it.subDomain || '').toLowerCase();
              const domain = (it.domain || '').toLowerCase();
              const guideType = (it.guideType || '').toLowerCase();
              const title = (it.title || '').toLowerCase();
              const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
              return blueprintFrameworks.some(selectedFramework => {
                const normalizedSelected = slugify(selectedFramework);
                // Check various fields for framework matches
                return allText.includes(selectedFramework.toLowerCase()) ||
                       allText.includes(normalizedSelected) ||
                       (selectedFramework === 'devops' && allText.includes('devops')) ||
                       (selectedFramework === 'dbp' && allText.includes('dbp')) ||
                       (selectedFramework === 'dxp' && allText.includes('dxp')) ||
                       (selectedFramework === 'dws' && allText.includes('dws')) ||
                       (selectedFramework === 'products' && allText.includes('product')) ||
                       (selectedFramework === 'projects' && allText.includes('project'));
              });
            });
          }
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

          // Ensure default image if missing
          const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80';
          out = out.map(it => ({
            ...it,
            heroImageUrl: it.heroImageUrl || defaultImage,
          }));

          // If client-side filtering was used, paginate after filtering
          const totalFiltered = out.length;
          if (needsClientSideFiltering) {
            out = out.slice(from, from + pageSize);
          }

          const total = needsClientSideFiltering ? totalFiltered : (typeof count === 'number' ? count : out.length);
          const lastPage = Math.max(1, Math.ceil(total / pageSize));
          // If current page exceeds last page (e.g., after filtering), reset to page 1
          if (currentPage > lastPage) {
            const next = new URLSearchParams(queryParams.toString());
            if (lastPage <= 1) next.delete('page'); else next.set('page', '1'); // Always reset to page 1 if invalid
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

          // Filter facet rows for Guidelines tab to exclude Strategy/Blueprint/Testimonial
          let filteredFacetRows = facetRows;
          if (isGuidelinesTab) {
            filteredFacetRows = (facetRows || []).filter((r: any) => {
              const domain = ((r.domain || '').toLowerCase().trim());
              const guideType = ((r.guide_type || '').toLowerCase().trim());
              const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
              const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
              const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
              return !hasStrategy && !hasBlueprint && !hasTestimonial;
            });
          }
          
          const domainFacets      = countBy(filteredFacetRows, 'domain');
          const guideTypeFacets   = countBy(filteredFacetRows, 'guide_type');
          const subDomainFacetsRaw= countBy(filteredFacetRows, 'sub_domain');
          const unitFacets        = countBy(filteredFacetRows, 'unit');
          const locationFacets    = countBy(filteredFacetRows, 'location');
          const statusFacets      = countBy(filteredFacetRows, 'status');

          const allowedForFacets = new Set<string>();
          if (!isSpecialTab) {
            domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowedForFacets.add(s)));
          }
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
  }, [marketplaceType, filters, searchQuery, queryParams, isCourses, isKnowledgeHub, currentPage, pageSize, activeTab]);

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
      <div className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
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

        {isGuides && (
          <>
            {/* Tab Description - Above Navigation */}
            {activeTab && TAB_DESCRIPTIONS[activeTab] && (
              <div className="mb-4 bg-white rounded-lg p-6 border border-gray-200 relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span className="text-xs uppercase text-gray-500 font-medium tracking-wide">CURRENT FOCUS</span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">{TAB_LABELS[activeTab]}</h2>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-gray-800 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border-0">
                    Tab overview
                  </button>
                </div>
                <p className="text-gray-700 mb-2">{TAB_DESCRIPTIONS[activeTab].description}</p>
                {TAB_DESCRIPTIONS[activeTab].author && (
                  <p className="text-sm text-gray-500">{TAB_DESCRIPTIONS[activeTab].author}</p>
                )}
              </div>
            )}
            
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Guides navigation">
              {(['strategy', 'guidelines', 'blueprints', 'testimonials', 'resources'] as WorkGuideTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => handleGuidesTabChange(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab
                          ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    aria-current={activeTab === tab ? 'page' : undefined}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={isGuides ? (queryParams.get('q') || '') : searchQuery}
              placeholder={isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined}
              ariaLabel={isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined}
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
                    <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
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
              <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
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
                {activeTab === 'resources' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Glossary Card */}
                      <Link to="/marketplace/guides/glossary" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer block">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-[var(--guidelines-primary-surface)] rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-[var(--guidelines-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800">Glossary</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Comprehensive dictionary of DQ terminology, acronyms, and key concepts to help you understand our language and processes.
                        </p>
                        <div className="flex items-center text-[var(--guidelines-primary)] font-medium">
                          <span>View Glossary</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* FAQs Card */}
                      <Link to="/marketplace/guides/faqs" className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer block">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-[var(--guidelines-primary-surface)] rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-[var(--guidelines-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800">FAQs</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Frequently asked questions about DQ processes, tools, workflows, and best practices with detailed answers and guidance.
                        </p>
                        <div className="flex items-center text-[var(--guidelines-primary)] font-medium">
                          <span>View FAQs</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                    <GuidesGrid
                      items={filteredItems}
                      hideEmptyState={activeTab === 'resources'}
                      onClickGuide={(g) => {
                        const qs = queryParams.toString();
                        navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, {
                          state: { fromQuery: qs, activeTab }
                        });
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
                ) : activeTab === 'testimonials' ? (
                  <TestimonialsGrid
                    items={filteredItems}
                    onClickGuide={(g) => {
                      const qs = queryParams.toString();
                      navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, {
                        state: { fromQuery: qs, activeTab }
                      });
                    }}
                  />
                ) : (
                  <>
                    <GuidesGrid
                      items={filteredItems}
                      hideEmptyState={activeTab === 'resources'}
                      onClickGuide={(g) => {
                        const qs = queryParams.toString();
                        navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, {
                          state: { fromQuery: qs, activeTab }
                        });
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
