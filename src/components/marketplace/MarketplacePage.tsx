import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from './FilterSidebar.js';
import { MarketplaceGrid } from './MarketplaceGrid.js';
import { SearchBar } from '../SearchBar.js';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon, InfoIcon } from 'lucide-react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader.js';
import { fetchMarketplaceItems, fetchMarketplaceFilters } from '../../services/marketplace.js';
import { getMarketplaceConfig, getTabSpecificFilters, getDesignSystemTabSpecificFilters } from '../../utils/marketplaceConfig.js';
import { MarketplaceComparison } from './MarketplaceComparison.js';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { getFallbackItems } from '../../utils/fallbackData';
import KnowledgeHubGrid from './KnowledgeHubGrid';
import { LMS_COURSES } from '../../data/lmsCourseDetails';
import { parseFacets, applyFilters } from '../../lms/filters';
import {
  LOCATION_ALLOW,
  LEVELS,
  CATEGORY_OPTS,
  DELIVERY_OPTS,
  DURATION_OPTS
} from '../../lms/config';
import GuidesFilters, { GuidesFacets } from '../guides/GuidesFilters';
import GuidesGrid from '../guides/GuidesGrid';
import TestimonialsGrid from '../guides/TestimonialsGrid';
import GlossaryGrid from '../guides/GlossaryGrid';
import { SixXDPerspectiveCards } from '../guides/SixXDPerspectiveCards';
import { SixXDComingSoonCards } from '../guides/SixXDComingSoonCards';
import { supabaseClient } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';
import FAQsPageContent from '../../pages/guides/FAQsPageContent';
import { glossaryTerms, GlossaryTerm, CATEGORIES } from '../../pages/guides/glossaryData';
import { STATIC_PRODUCTS } from '../../utils/staticProducts';
import { DESIGN_SYSTEM_ITEMS, getDesignSystemItemsByType } from '../../utils/designSystemData';
import { DesignSystemCard } from './DesignSystemCard';
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
  marketplaceType: 'courses' | 'financial' | 'non-financial' | 'knowledge-hub' | 'onboarding' | 'guides' | 'design-system';
  title: string;
  description: string;
  promoCards?: any[];
}

const SUBDOMAIN_BY_DOMAIN: Record<string, string[]> = {
  strategy: ['journey', 'history', 'digital-framework', 'initiatives', 'clients'],
  guidelines: ['resources', 'policies'],
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

// ---------------------------------------------------------------------------
// Module-level pure helpers (extracted to keep MarketplacePage complexity low)
// ---------------------------------------------------------------------------

/**
 * Returns the keys to delete from URL params when switching to a specific guides tab.
 */
function getKeysToDeleteForTab(tab: string): string[] {
  if (tab === 'strategy') {
    return ['guide_type', 'sub_domain', 'domain', 'testimonial_category'];
  }
  if (tab === 'blueprints') {
    return ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments'];
  }
  if (tab === 'glossary') {
    return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location'];
  }
  if (tab === 'faqs') {
    return ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
  }
  if (tab === 'testimonials') {
    return ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector'];
  }
  // Default / other tabs
  return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
}

/**
 * Builds the next URLSearchParams when switching guides tabs.
 * Pure function – no side effects.
 */
function buildGuidesTabParams(tab: string, current: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  next.delete('page');
  if (tab === 'guidelines') {
    next.delete('tab');
  } else {
    next.set('tab', tab);
  }

  if (tab !== 'guidelines') {
    const keysToDelete = getKeysToDeleteForTab(tab);
    keysToDelete.forEach(key => next.delete(key));
  } else {
    // Switching to Guidelines - clear Strategy and Blueprint-specific filters
    ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'].forEach(key => next.delete(key));
  }

  // Clear tab-specific filters when switching away from their respective tabs
  if (tab !== 'guidelines') {
    next.delete('guidelines_category');
  }
  if (tab !== 'blueprints') {
    next.delete('blueprint_framework');
    next.delete('blueprint_sector');
    next.delete('product_type');
    next.delete('product_stage');
    next.delete('product_sector');
  }
  return next;
}

/**
 * Filter glossary terms by knowledge system, GHC dimension, 6xD perspective,
 * letter and free-text search – pure function, no React hooks.
 */
function filterGlossaryTerms(queryParams: URLSearchParams): GlossaryTerm[] {
  const knowledgeSystems   = parseFilterValues(queryParams, 'glossary_knowledge_system');
  const ghcDimensions      = parseFilterValues(queryParams, 'glossary_ghc_dimension');
  const sixXdPerspectives  = parseFilterValues(queryParams, 'glossary_6xd_perspective');
  const letters            = parseFilterValues(queryParams, 'glossary_letter');
  const searchQuery        = queryParams.get('q') || '';

  return glossaryTerms.filter(term => {
    if (knowledgeSystems.length > 0) {
      if (!term.knowledgeSystem || !knowledgeSystems.includes(term.knowledgeSystem)) return false;
    }
    if (term.knowledgeSystem === 'ghc' && ghcDimensions.length > 0) {
      if (!term.ghcDimension || !ghcDimensions.includes(term.ghcDimension)) return false;
    }
    if (term.knowledgeSystem === '6xd' && sixXdPerspectives.length > 0) {
      if (!term.sixXdPerspective || !sixXdPerspectives.includes(term.sixXdPerspective)) return false;
    }
    if (letters.length > 0) {
      const termLetter = term.letter.toUpperCase();
      if (!letters.some(l => l.toUpperCase() === termLetter)) return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        term.term.toLowerCase().includes(searchLower) ||
        (term.shortIntro && term.shortIntro.toLowerCase().includes(searchLower)) ||
        term.explanation.toLowerCase().includes(searchLower) ||
        term.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sub-component: GuidesContent
// Renders the main content area for the Guides marketplace type.
// ---------------------------------------------------------------------------
type WorkGuideTab = 'guidelines' | 'strategy' | '6xd' | 'blueprints' | 'testimonials' | 'glossary' | 'faqs';
type DesignSystemTab = 'cids' | 'vds' | 'cds';

interface GuidesContentProps {
  activeTab: WorkGuideTab;
  filteredItems: any[];
  filteredGlossaryTerms: any[];
  queryParams: URLSearchParams;
  setQueryParams: (p: URLSearchParams) => void;
  navigate: ReturnType<typeof import('react-router-dom').useNavigate>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

function GuidesContent({
  activeTab,
  filteredItems,
  filteredGlossaryTerms,
  queryParams,
  setQueryParams,
  navigate,
  currentPage,
  totalPages,
  goToPage,
}: GuidesContentProps) {
  if (activeTab === 'faqs') {
    return <FAQsPageContent categoryFilter={(queryParams.get('faq_category') || '').split(',').filter(Boolean)[0] || null} />;
  }
  if (activeTab === '6xd') {
    return <SixXDComingSoonCards />;
  }
  if (activeTab === 'glossary') {
    const selectedKnowledgeSystems = parseFilterValues(queryParams, 'glossary_knowledge_system');
    const has6xD = selectedKnowledgeSystems.includes('6xd');
    const selectedPerspectives = parseFilterValues(queryParams, 'glossary_6xd_perspective');
    return (
      <>
        {/* Global Search Bar for Glossary */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={queryParams.get('q') || ''}
              onChange={(e) => {
                const next = new URLSearchParams(queryParams.toString());
                next.delete('page');
                if (e.target.value) { next.set('q', e.target.value); } else { next.delete('q'); }
                const qs = next.toString();
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
                }
                setQueryParams(new URLSearchParams(next.toString()));
              }}
              placeholder="Search DQ terms (e.g. DWS, CWS, Agile TMS)"
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-[var(--guidelines-primary)] outline-none"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {has6xD ? (
          <>
            <SixXDPerspectiveCards
              onCardClick={(perspectiveId) => {
                navigate(`/marketplace/guides/6xd-perspective/${perspectiveId}`);
                track('Glossary.6xDPerspectiveSelected', { perspective: perspectiveId });
              }}
            />
            {filteredGlossaryTerms.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedPerspectives.length > 0 ? 'Terms in this perspective' : 'All 6xD terms'}
                </h3>
                <GlossaryGrid
                  items={filteredGlossaryTerms}
                  onClickTerm={(term) => { navigate(`/marketplace/guides/glossary/${term.id}`); }}
                  hideEmptyState={false}
                />
              </div>
            )}
          </>
        ) : (
          <GlossaryGrid
            items={filteredGlossaryTerms}
            onClickTerm={(term) => { navigate(`/marketplace/guides/glossary/${term.id}`); }}
            hideEmptyState={false}
          />
        )}
      </>
    );
  }
  if (activeTab === 'testimonials') {
    return (
      <TestimonialsGrid
        items={filteredItems}
        onClickGuide={(g) => {
          const qs = queryParams.toString();
          navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs, activeTab } });
        }}
      />
    );
  }
  // Default: guidelines, strategy, blueprints
  return (
    <>
      <GuidesGrid
        items={filteredItems}
        hideEmptyState={false}
        emptyStateTitle={activeTab === 'blueprints' ? 'No products found' : 'No guides found'}
        emptyStateMessage={activeTab === 'blueprints' ? 'Try adjusting your filters or search' : 'Try adjusting your filters or search'}
        onClickGuide={(g) => {
          const qs = queryParams.toString();
          const isProduct = (g.domain === 'Product') || (g.productType && g.productStage);
          if (isProduct) {
            navigate(`/marketplace/products/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs, activeTab } });
          } else {
            navigate(`/marketplace/guides/${encodeURIComponent(g.slug || g.id)}`, { state: { fromQuery: qs, activeTab } });
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
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
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
  );
}

// ---------------------------------------------------------------------------
// Sub-component: FilterSidebarSection
// Renders the full filter sidebar (mobile drawer + desktop panel).
// ---------------------------------------------------------------------------
interface FilterSidebarSectionProps {
  isGuides: boolean;
  isDesignSystem: boolean;
  isKnowledgeHub: boolean;
  isCourses: boolean;
  showFilters: boolean;
  toggleFilters: () => void;
  resetFilters: () => void;
  activeTab: WorkGuideTab;
  facets: GuidesFacets;
  queryParams: URLSearchParams;
  setQueryParams: (p: URLSearchParams) => void;
  filters: Record<string, string | string[]>;
  filterConfig: FilterConfig[];
  handleFilterChange: (filterType: string, value: string) => void;
  urlBasedFilters: Record<string, string[]>;
  activeFilters: string[];
  handleKnowledgeHubFilterChange: (filter: string) => void;
  hasActiveFilters: boolean;
}

function FilterSidebarSection({
  isGuides,
  isDesignSystem,
  isKnowledgeHub,
  isCourses,
  showFilters,
  toggleFilters,
  resetFilters,
  activeTab,
  facets,
  queryParams,
  setQueryParams,
  filters,
  filterConfig,
  handleFilterChange,
  urlBasedFilters,
  activeFilters,
  handleKnowledgeHubFilterChange,
  hasActiveFilters,
}: FilterSidebarSectionProps) {
  const filtersAsArrays = Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v : (v ? [v] : [])])
  ) as Record<string, string[]>;

  const guidesFilterOnChange = (next: URLSearchParams) => {
    next.delete('page');
    const qs = next.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
    setQueryParams(new URLSearchParams(next.toString()));
    track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) });
  };

  const mobileContent = isGuides
    ? <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={guidesFilterOnChange} />
    : isDesignSystem
      ? <FilterSidebar filters={filtersAsArrays} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} isResponsive={true} />
      : <FilterSidebar filters={isCourses ? urlBasedFilters : filtersAsArrays} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} isResponsive={true} />;

  return (
    <>
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
            <div className="p-4">{mobileContent}</div>
          </div>
        </div>
      </div>

      {/* Filter sidebar - desktop */}
      <div className="hidden xl:block xl:w-1/4">
        {isGuides ? (
          <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={guidesFilterOnChange} />
        ) : isDesignSystem ? (
          <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto filter-sidebar-scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {hasActiveFilters && <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Clear all</button>}
            </div>
            <FilterSidebar filters={filtersAsArrays} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} isResponsive={false} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto filter-sidebar-scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {hasActiveFilters && <button onClick={resetFilters} className="text-blue-600 text-sm font-medium">Reset All</button>}
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
                filters={isCourses ? urlBasedFilters : filtersAsArrays}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={false}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Interfaces and module-level handlers extracted from useMarketplaceData.run()
// Each handler covers one marketplace type branch, reducing run() complexity.
// ---------------------------------------------------------------------------

interface ItemSetters {
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  setItems: (v: any[]) => void;
  setFilteredItems: (v: any[]) => void;
  setTotalCount: (v: number) => void;
}

interface GuidesSetters extends ItemSetters {
  setFacets: (v: GuidesFacets) => void;
}

interface GuidesRunParams {
  activeTab: string;
  queryParams: URLSearchParams;
  currentPage: number;
  pageSize: number;
  searchStartRef: React.MutableRefObject<number | null>;
}

interface DesignSystemRunParams {
  activeDesignSystemTab: string;
  filters: Record<string, string | string[]>;
  queryParams: URLSearchParams;
}

interface OtherMarketplaceRunParams {
  marketplaceType: string;
  filters: Record<string, string | string[]>;
  searchQuery: string;
  isServicesCenter: boolean;
  activeServiceTab: string;
}

function runCoursesLoad(s: ItemSetters, searchFilteredItemsLength: number): void {
  s.setLoading(false);
  s.setError(null);
  s.setTotalCount(searchFilteredItemsLength);
  s.setItems([]);
  s.setFilteredItems([]);
}

function runKnowledgeHubLoad(s: ItemSetters, marketplaceType: string): void {
  const fallbackItems = getFallbackItems(marketplaceType);
  s.setItems(fallbackItems);
  s.setFilteredItems(fallbackItems);
  s.setTotalCount(fallbackItems.length);
  s.setLoading(false);
}

async function runBlueprintTabLoad(s: ItemSetters, queryParams: URLSearchParams): Promise<void> {
  s.setLoading(true);
  try {
    const qStr = queryParams.get('q') || '';
    const productTypes = parseFilterValues(queryParams, 'product_type');
    const productStages = parseFilterValues(queryParams, 'product_stage');
    let out = STATIC_PRODUCTS.map(product => ({
      id: product.id, slug: product.slug, title: product.title,
      summary: product.summary, heroImageUrl: product.heroImageUrl,
      lastUpdatedAt: product.lastUpdatedAt, authorName: product.authorName,
      authorOrg: product.authorOrg, isEditorsPick: product.isEditorsPick,
      downloadCount: product.downloadCount, guideType: product.guideType,
      domain: product.domain, functionArea: null, unit: null,
      subDomain: null, location: null, status: product.status,
      complexityLevel: null, productType: product.productType,
      productStage: product.productStage,
    }));
    if (productTypes.length > 0) {
      out = out.filter(it => {
        const itemProductType = (it.productType || '').toLowerCase();
        return productTypes.some(selectedType => {
          const normalizedSelected = slugify(selectedType);
          const typeMap: Record<string, string[]> = {
            'tmaas': ['tmaas'], 'dtma': ['dtma'], 'dtmp': ['dtmp'],
            'plant-4-0': ['plant 4.0', 'plant-4.0', 'plant40'], 'dtmcc': ['dtmcc'],
          };
          return (typeMap[selectedType] || [normalizedSelected]).some(t => itemProductType.includes(t));
        });
      });
    }
    if (productStages.length > 0) {
      out = out.filter(it => it.productStage && productStages.includes(it.productStage.toLowerCase()));
    }
    if (qStr) {
      const query = qStr.toLowerCase();
      out = out.filter(it => {
        const text = [it.title, it.summary, it.productType, it.productStage].filter(Boolean).join(' ').toLowerCase();
        return text.includes(query);
      });
    }
    s.setItems(out);
    s.setFilteredItems(out);
    s.setTotalCount(out.length);
    s.setLoading(false);
  } catch (error) {
    console.error('Error loading products:', error);
    s.setLoading(false);
    s.setItems([]);
    s.setFilteredItems([]);
    s.setTotalCount(0);
  }
}

async function runMainGuidesLoad(s: GuidesSetters, params: GuidesRunParams): Promise<void> {
  const { activeTab, queryParams, currentPage, pageSize, searchStartRef } = params;
  s.setLoading(true);
  try {
    const excludedSlugs = ['atp-guidelines', 'agile-working-guidelines', 'client-session-guidelines', 'dbp-support-guidelines', 'dq-products'];
    let q = supabaseClient.from('guides').select(GUIDE_LIST_SELECT, { count: 'exact' });
    excludedSlugs.forEach(slug => { q = q.neq('slug', slug); });
    const qStr = queryParams.get('q') || '';
    const domains     = parseFilterValues(queryParams, 'domain');
    const rawSubs     = parseFilterValues(queryParams, 'sub_domain');
    const guideTypes  = parseFilterValues(queryParams, 'guide_type');
    const units       = parseFilterValues(queryParams, 'unit');
    const statuses    = parseFilterValues(queryParams, 'status');
    const testimonialCategories = parseFilterValues(queryParams, 'testimonial_category');
    const strategyTypes = parseFilterValues(queryParams, 'strategy_type');
    const strategyFrameworks = parseFilterValues(queryParams, 'strategy_framework');
    const guidelinesCategories = parseFilterValues(queryParams, 'guidelines_category');
    const categorization = parseFilterValues(queryParams, 'categorization');
    const attachmentsFilter = parseFilterValues(queryParams, 'attachments');
    const blueprintFrameworks = parseFilterValues(queryParams, 'blueprint_framework');
    const blueprintSectors = parseFilterValues(queryParams, 'blueprint_sector');
    const productTypes = parseFilterValues(queryParams, 'product_type');
    const productStages = parseFilterValues(queryParams, 'product_stage');
    const productSectors = parseFilterValues(queryParams, 'product_sector');
    const currentActiveTab = activeTab;
    const isStrategyTab = currentActiveTab === 'strategy';
    const isBlueprintTab = currentActiveTab === 'blueprints';
    const isTestimonialsTab = currentActiveTab === 'testimonials';
    const isGlossaryTab = currentActiveTab === 'glossary';
    const isFAQsTab = currentActiveTab === 'faqs';
    const isGuidelinesTab = currentActiveTab === 'guidelines';
    const isSpecialTab = isStrategyTab || isBlueprintTab || isTestimonialsTab || isGlossaryTab || isFAQsTab;
    const allowed = new Set<string>();
    if (!isSpecialTab) {
      domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
    }
    const subDomains = !isSpecialTab
      ? (allowed.size ? rawSubs.filter(v => allowed.has(v)) : rawSubs)
      : [];
    const effectiveGuideTypes = isSpecialTab ? [] : guideTypes;
    const effectiveUnits = (isStrategyTab || isBlueprintTab || !isSpecialTab) ? units : [];
    if (!isSpecialTab && rawSubs.length && subDomains.length !== rawSubs.length) {
      const next = new URLSearchParams(queryParams.toString());
      if (subDomains.length) next.set('sub_domain', subDomains.join(','));
      else next.delete('sub_domain');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
      }
      s.setLoading(false);
      return;
    }
    if (statuses.length) q = q.in('status', statuses); else q = q.eq('status', 'Approved');
    if (qStr) q = q.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
    if (isStrategyTab) {
      q = q.or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%');
    } else if (isTestimonialsTab) {
      q = q.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
    } else if (isGuidelinesTab) {
      if (domains.length) { q = q.in('domain', domains); }
    } else if (domains.length) {
      q = q.in('domain', domains);
    }
    if (!isSpecialTab && subDomains.length) q = q.in('sub_domain', subDomains);
    if (effectiveGuideTypes.length && !isGuidelinesTab) q = q.in('guide_type', effectiveGuideTypes);
    const sort = queryParams.get('sort') || 'editorsPick';
    if (sort === 'updated')        q = q.order('last_updated_at', { ascending: false, nullsFirst: false });
    else if (sort === 'downloads') q = q.order('download_count',   { ascending: false, nullsFirst: false });
    else if (sort === 'editorsPick') {
      q = q.order('is_editors_pick', { ascending: false })
           .order('last_updated_at', { ascending: false, nullsFirst: false });
    } else {
      q = q.order('is_editors_pick', { ascending: false })
           .order('download_count',   { ascending: false, nullsFirst: false })
           .order('last_updated_at',  { ascending: false, nullsFirst: false });
    }
    const needsClientSideUnitFilter = effectiveUnits.length > 0;
    const needsClientSideFrameworkFilter =
      (isStrategyTab && strategyFrameworks.length > 0) ||
      (isBlueprintTab && (blueprintFrameworks.length > 0 || blueprintSectors.length > 0 || productTypes.length > 0 || productStages.length > 0 || productSectors.length > 0)) ||
      (isGuidelinesTab && guidelinesCategories.length > 0);
    const needsClientSideFiltering = needsClientSideUnitFilter || needsClientSideFrameworkFilter || categorization.length > 0 || attachmentsFilter.length > 0;
    const from = (currentPage - 1) * pageSize;
    const to   = from + pageSize - 1;
    const listPromise = needsClientSideFiltering ? q.limit(10000) : q.range(from, to);
    let facetQ = supabaseClient
      .from('guides')
      .select('domain,sub_domain,guide_type,function_area,unit,location,status')
      .eq('status', 'Approved');
    excludedSlugs.forEach(slug => { facetQ = facetQ.neq('slug', slug); });
    if (qStr)              facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
    if (isStrategyTab)    facetQ = facetQ.or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%');
    else if (isTestimonialsTab) facetQ = facetQ.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
    if (statuses.length)   facetQ = facetQ.in('status', statuses);
    const [{ data: rows, count, error }, { data: facetRows, error: facetError }] = await Promise.all([
      listPromise,
      facetQ,
    ]);
    if (error) { throw error; }
    if (facetError) { /* continue without facets */ }
    const mapped = (rows || []).map((r: any) => {
      const unitValue = r.unit ?? r.function_area ?? null;
      const subDomainValue = r.sub_domain ?? r.subDomain ?? null;
      return {
        id: r.id, slug: r.slug, title: r.title, summary: r.summary,
        heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
        estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
        lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
        authorName: r.author_name ?? r.authorName,
        authorOrg: r.author_org ?? r.authorOrg,
        isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
        downloadCount: r.download_count ?? r.downloadCount,
        guideType: r.guide_type ?? r.guideType,
        domain: r.domain ?? null, functionArea: unitValue, unit: unitValue,
        subDomain: subDomainValue, location: r.location ?? null,
        status: r.status ?? null, complexityLevel: r.complexity_level ?? null,
      };
    });
    let out = mapped.filter(it => !excludedSlugs.includes(it.slug));
    if (isStrategyTab) {
      // Show all strategy guides; server-side query already biases toward Strategy
    } else if (isBlueprintTab) {
      out = STATIC_PRODUCTS.map(product => ({
        id: product.id, slug: product.slug, title: product.title,
        summary: product.summary, heroImageUrl: product.heroImageUrl,
        lastUpdatedAt: product.lastUpdatedAt, authorName: product.authorName,
        authorOrg: product.authorOrg, isEditorsPick: product.isEditorsPick,
        downloadCount: product.downloadCount, guideType: product.guideType,
        domain: product.domain, functionArea: null, unit: null,
        subDomain: null, location: null, status: product.status,
        complexityLevel: null, productType: product.productType,
        productStage: product.productStage,
      }));
    } else if (isGuidelinesTab) {
      out = out.filter(it => {
        const domain = (it.domain || '').toLowerCase().trim();
        const guideType = (it.guideType || '').toLowerCase().trim();
        const hasStrategy = domain.includes('strategy') || guideType.includes('strategy');
        const hasBlueprint = domain.includes('blueprint') || guideType.includes('blueprint');
        const hasTestimonial = domain.includes('testimonial') || guideType.includes('testimonial');
        return !hasStrategy && !hasBlueprint && !hasTestimonial;
      });
    } else {
      out = [];
    }
    if (domains.length)    out = out.filter(it => it.domain && domains.includes(it.domain));
    if (subDomains.length) out = out.filter(it => it.subDomain && subDomains.includes(it.subDomain));
    if (effectiveGuideTypes.length) {
      out = out.filter(it => {
        const guideTypeValue = it.guideType;
        if (!guideTypeValue) return false;
        const normalizedDbValue = slugify(guideTypeValue);
        return effectiveGuideTypes.some(selectedType => {
          const normalizedSelected = slugify(selectedType);
          return normalizedDbValue === normalizedSelected ||
                 guideTypeValue.toLowerCase().trim() === selectedType.toLowerCase().trim();
        });
      });
    }
    if (effectiveUnits.length) {
      out = out.filter(it => {
        const unitValue = it.unit || it.functionArea;
        if (!unitValue) return false;
        const normalizedDbValue = slugify(unitValue);
        return effectiveUnits.some(selectedUnit => normalizedDbValue === slugify(selectedUnit));
      });
    }
    if (isGuidelinesTab && categorization.length) {
      const catKeywords = {
        'policy-set-1a-opg': ['policy set 1a', 'opg'],
        'policy-set-1b-ppp': ['policy set 1b', 'ppp'],
        'policy-set-2a-vision': ['policy set 02', '2a', 'vision'],
        'policy-set-2b-culture': ['policy set 02', '2b', 'culture'],
        'policy-set-2c-persona': ['policy set 02', '2c', 'persona'],
        'policy-set-2d-task': ['policy set 02', '2d', 'task'],
        'policy-set-2e-govern': ['policy set 02', '2e', 'govern'],
        'policy-set-2f-flow': ['policy set 02', '2f', 'flow'],
        'policy-set-2g-product': ['policy set 02', '2g', 'product'],
      } as Record<string, string[]>;
      out = out.filter(it => {
        const haystack = `${it.title || ''} ${it.summary || ''} ${it.subDomain || ''} ${it.slug || ''}`.toLowerCase();
        return categorization.some(cat => {
          const kw = catKeywords[cat] || [cat.replace(/-/g, ' ')];
          return kw.some(k => haystack.includes(k.toLowerCase()));
        });
      });
    }
    if (isStrategyTab && strategyTypes.length) {
      out = out.filter(it => {
        const subDomain = (it.subDomain || '').toLowerCase();
        const slug = (it.slug || '').toLowerCase();
        const title = (it.title || '').toLowerCase();
        const summary = (it.summary || '').toLowerCase();
        const allText = `${subDomain} ${slug} ${title} ${summary}`.toLowerCase();
        return strategyTypes.some(selectedType => {
          const normalizedSelected = slugify(selectedType);
          const normalizedSubDomain = slugify(subDomain);
          if (normalizedSubDomain === normalizedSelected ||
              subDomain.includes(selectedType.toLowerCase()) ||
              selectedType.toLowerCase().includes(subDomain)) {
            return true;
          }
          if (selectedType.toLowerCase() === 'journey') {
            const journeyKeywords = ['vision', 'mission', 'dq-vision', 'dq-mission', 'vision-and-mission', 'vision-mission'];
            return journeyKeywords.some(keyword => slug.includes(keyword) || title.includes(keyword) || allText.includes(keyword));
          }
          if (selectedType.toLowerCase() === 'history') {
            const historyKeywords = ['history', 'origin', 'began', 'founding', 'started', 'beginning', 'evolution', 'story'];
            return historyKeywords.some(keyword => slug.includes(keyword) || title.includes(keyword) || allText.includes(keyword));
          }
          return false;
        });
      });
    }
    if (isStrategyTab && strategyFrameworks.length) {
      out = out.filter(it => {
        const subDomain = (it.subDomain || '').toLowerCase();
        const domain = (it.domain || '').toLowerCase();
        const guideType = (it.guideType || '').toLowerCase();
        const title = (it.title || '').toLowerCase();
        const slug = (it.slug || '').toLowerCase();
        const allText = `${subDomain} ${domain} ${guideType} ${title} ${slug}`.toLowerCase();
        const frameworkKeywords: Record<string, string[]> = {
          'ghc1': ['vision'], 'ghc2': ['dq-hov', 'house of values'],
          'ghc3': ['persona'], 'ghc4': ['agile tms', 'tms'],
          'ghc5': ['agile sos', 'sos'], 'ghc6': ['agile flows', 'flows'],
          'ghc7': ['agile 6xd', '6xd'],
        };
        return strategyFrameworks.some(selected => {
          if (selected === 'ghc2') {
            if (slug === 'dq-hov') return true;
            return title.includes('house of values') && !title.includes('competencies');
          }
          return (frameworkKeywords[selected] || [selected]).some(kw => allText.includes(kw));
        });
      });
    }
    if (isGuidelinesTab && guidelinesCategories.length) {
      out = out.filter(it => {
        const subDomain = (it.subDomain || '').toLowerCase();
        const domain = (it.domain || '').toLowerCase();
        const guideType = (it.guideType || '').toLowerCase();
        const title = (it.title || '').toLowerCase();
        const allText = `${subDomain} ${domain} ${guideType} ${title}`.toLowerCase();
        return guidelinesCategories.some(selectedCategory => {
          const normalizedSelected = slugify(selectedCategory);
          return allText.includes(selectedCategory.toLowerCase()) ||
                 allText.includes(normalizedSelected) ||
                 (selectedCategory === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
                 (selectedCategory === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
                 (selectedCategory === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
        });
      });
    }
    if (isBlueprintTab) {
      if (productTypes.length) {
        out = out.filter(it => {
          const itemProductType = (it.productType || '').toLowerCase();
          return productTypes.some(selectedType => {
            const normalizedSelected = slugify(selectedType);
            const typeMap: Record<string, string[]> = {
              'platform': ['platform'], 'academy': ['academy'],
              'framework': ['framework'], 'tooling': ['tooling'],
              'marketplace': ['marketplace'], 'enablement-product': ['enablement product'],
            };
            return (typeMap[selectedType] || [normalizedSelected]).some(t => itemProductType.includes(t));
          });
        });
      }
      if (productStages.length) {
        out = out.filter(it => {
          const itemProductStage = (it.productStage || '').toLowerCase();
          return productStages.some(selectedStage => {
            const normalizedSelected = slugify(selectedStage);
            const stageMap: Record<string, string[]> = {
              'concept': ['concept'], 'mvp': ['mvp'], 'live': ['live'],
              'scaling': ['scaling'], 'enterprise-ready': ['enterprise-ready', 'enterprise ready'],
            };
            return (stageMap[selectedStage] || [normalizedSelected]).some(t => itemProductStage.includes(t));
          });
        });
      }
      if (productSectors.length || blueprintSectors.length) { out = []; }
      if (qStr) {
        const query = qStr.toLowerCase();
        out = out.filter(it => {
          const text = [it.title, it.summary, it.productType, it.productStage].filter(Boolean).join(' ').toLowerCase();
          return text.includes(query);
        });
      }
    }
    if (statuses.length) out = out.filter(it => it.status && statuses.includes(it.status));
    if (sort === 'updated')        out.sort((a,b) => new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
    else if (sort === 'downloads') out.sort((a,b) => (b.downloadCount||0)-(a.downloadCount||0));
    else if (sort === 'editorsPick')
      out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                        new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
    else
      out.sort((a,b) => (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) ||
                        (b.downloadCount||0)-(a.downloadCount||0) ||
                        new Date(b.lastUpdatedAt||0).getTime() - new Date(a.lastUpdatedAt||0).getTime());
    if (!isBlueprintTab) {
      const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80';
      out = out.map(it => ({ ...it, heroImageUrl: it.heroImageUrl || defaultImage }));
    }
    const totalFiltered = out.length;
    if (needsClientSideFiltering || isBlueprintTab) {
      out = out.slice(from, from + pageSize);
    }
    const total = (needsClientSideFiltering || isBlueprintTab) ? totalFiltered : (typeof count === 'number' ? count : out.length);
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > lastPage) {
      const next = new URLSearchParams(queryParams.toString());
      if (lastPage <= 1) next.delete('page'); else next.set('page', '1');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `${window.location.pathname}${next.toString() ? '?' + next.toString() : ''}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      s.setLoading(false);
      return;
    }
    const countBy = (arr: any[] | null | undefined, key: string) => {
      const m = new Map<string, number>();
      for (const r of (arr || [])) { const v = (r as any)[key]; if (!v) continue; m.set(v, (m.get(v)||0)+1); }
      return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt }))
                .sort((a,b)=> a.name.localeCompare(b.name));
    };
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
    if (activeTab === 'strategy') {
      const ghcOrder = ['dq-ghc','dq-vision','dq-hov','dq-persona','dq-agile-tms','dq-agile-sos','dq-agile-flows','dq-agile-6xd'];
      const hovOrder = ['dq-competencies-emotional-intelligence','dq-competencies-growth-mindset','dq-competencies-purpose','dq-competencies-perceptive','dq-competencies-proactive','dq-competencies-perseverance','dq-competencies-precision','dq-competencies-customer','dq-competencies-learning','dq-competencies-collaboration','dq-competencies-responsibility','dq-competencies-trust'];
      const titleOrder = ['dq golden honeycomb of competencies','dq vision','house of values','dq persona','agile tms','agile sos','agile flows','agile 6xd','emotional intelligence','growth mindset','purpose','perceptive','proactive','perseverance','precision','customer','learning','collaboration','responsibility','trust'];
      const orderIndex = (item: any) => {
        const slug = (item.slug || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const slugIdx = ghcOrder.indexOf(slug);
        if (slugIdx >= 0) return slugIdx;
        const hovIdx = hovOrder.indexOf(slug);
        if (hovIdx >= 0) return ghcOrder.length + hovIdx;
        const titleIdx = titleOrder.findIndex(t => title.includes(t));
        return titleIdx >= 0 ? titleIdx : Number.MAX_SAFE_INTEGER;
      };
      out = [...out].sort((a, b) => orderIndex(a) - orderIndex(b));
    }
    s.setItems(out);
    s.setFilteredItems(out);
    s.setTotalCount(total);
    s.setFacets({
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
    s.setError('Failed to load guides. Please try again.');
    s.setItems([]); s.setFilteredItems([]); s.setFacets({}); s.setTotalCount(0);
  } finally {
    s.setLoading(false);
  }
}

async function runGuidesLoad(s: GuidesSetters, params: GuidesRunParams): Promise<void> {
  if (params.activeTab === 'glossary' || params.activeTab === 'faqs') {
    s.setLoading(false);
    s.setItems([]);
    s.setFilteredItems([]);
    s.setTotalCount(0);
    return;
  }
  if (params.activeTab === 'blueprints') {
    await runBlueprintTabLoad(s, params.queryParams);
    return;
  }
  await runMainGuidesLoad(s, params);
}

function runDesignSystemLoad(s: ItemSetters, params: DesignSystemRunParams): void {
  const { activeDesignSystemTab, filters, queryParams } = params;
  s.setLoading(false);
  s.setError(null);
  let filteredDesignSystemItems = getDesignSystemItemsByType(activeDesignSystemTab);
  const filterKey = activeDesignSystemTab;
  const categoryFilters = filters[filterKey];
  const categoryArray = Array.isArray(categoryFilters)
    ? categoryFilters
    : (typeof categoryFilters === 'string' && categoryFilters ? categoryFilters.split(',').filter(Boolean) : []);
  if (categoryArray.length > 0) {
    filteredDesignSystemItems = filteredDesignSystemItems.filter(item =>
      item.category && categoryArray.includes(item.category)
    );
  }
  const locationFilters = filters['location'];
  const locationArray = Array.isArray(locationFilters)
    ? locationFilters
    : (typeof locationFilters === 'string' && locationFilters ? locationFilters.split(',').filter(Boolean) : []);
  if (locationArray.length > 0) {
    filteredDesignSystemItems = filteredDesignSystemItems.filter(item =>
      item.location && locationArray.includes(item.location)
    );
  }
  const searchQueryValue = queryParams.get('q') || '';
  if (searchQueryValue) {
    const query = searchQueryValue.toLowerCase();
    filteredDesignSystemItems = filteredDesignSystemItems.filter(item => {
      const searchableText = [item.title, item.description, item.category, item.location].filter(Boolean).join(' ').toLowerCase();
      return searchableText.includes(query);
    });
  }
  s.setItems(filteredDesignSystemItems);
  s.setFilteredItems(filteredDesignSystemItems);
  s.setTotalCount(filteredDesignSystemItems.length);
}

async function runOtherMarketplaceLoad(s: ItemSetters, params: OtherMarketplaceRunParams): Promise<void> {
  const { marketplaceType, filters, searchQuery, isServicesCenter, activeServiceTab } = params;
  s.setLoading(true);
  s.setError(null);
  try {
    const itemsData = await fetchMarketplaceItems(
      marketplaceType,
      Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : (v || '')])),
      searchQuery
    );
    const finalItems = itemsData?.length ? itemsData : getFallbackItems(marketplaceType);
    s.setItems(finalItems);
    let filtered = finalItems;
    if (isServicesCenter) {
      const tabCategoryMap: Record<string, string> = {
        'technology': 'Technology', 'business': 'Employee Services',
        'digital_worker': 'Digital Worker', 'prompt_library': 'Prompt Library', 'ai_tools': 'AI Tools',
      };
      const activeTabCategory = tabCategoryMap[activeServiceTab];
      if (activeTabCategory) {
        filtered = filtered.filter(item => {
          const itemCategory = item.category || '';
          return itemCategory === activeTabCategory;
        });
      }
      const serviceTypeFilter = filters.serviceType;
      if (serviceTypeFilter) {
        const serviceTypes = Array.isArray(serviceTypeFilter) ? serviceTypeFilter : [serviceTypeFilter];
        if (serviceTypes.length > 0) {
          filtered = filtered.filter(item => {
            const itemServiceType = (item.serviceType || '').toLowerCase().trim();
            return serviceTypes.some(filterType => {
              const normalizedFilter = filterType.toLowerCase().trim();
              const normalizeType = (type: string) => type.replace(/[\s-]/g, '').toLowerCase();
              return normalizeType(itemServiceType) === normalizeType(normalizedFilter);
            });
          });
        }
      }
      const userCategoryFilter = filters.userCategory;
      if (userCategoryFilter) {
        const userCategories = Array.isArray(userCategoryFilter) ? userCategoryFilter : [userCategoryFilter];
        if (userCategories.length > 0) {
          filtered = filtered.filter(item => {
            const itemUserCategoriesArray = Array.isArray(item.userCategory) ? item.userCategory : [item.userCategory];
            return userCategories.some(filterCategory =>
              itemUserCategoriesArray.some((itemCat: string) => itemCat.toLowerCase() === filterCategory.toLowerCase())
            );
          });
        }
      }
      const technicalCategoryFilter = filters.technicalCategory;
      if (technicalCategoryFilter) {
        const technicalCategories = Array.isArray(technicalCategoryFilter) ? technicalCategoryFilter : [technicalCategoryFilter];
        if (technicalCategories.length > 0) {
          filtered = filtered.filter(item => {
            const itemTechnicalCategoriesArray = Array.isArray(item.technicalCategory) ? item.technicalCategory : [item.technicalCategory];
            return technicalCategories.some(filterCategory =>
              itemTechnicalCategoriesArray.some((itemCat: string) => itemCat.toLowerCase() === filterCategory.toLowerCase())
            );
          });
        }
      }
      const deviceOwnershipFilter = filters.deviceOwnership;
      if (deviceOwnershipFilter) {
        const deviceOwnerships = Array.isArray(deviceOwnershipFilter) ? deviceOwnershipFilter : [deviceOwnershipFilter];
        if (deviceOwnerships.length > 0) {
          filtered = filtered.filter(item => {
            const itemDeviceOwnershipsArray = Array.isArray(item.deviceOwnership) ? item.deviceOwnership : [item.deviceOwnership];
            return deviceOwnerships.some(filterOwnership =>
              itemDeviceOwnershipsArray.some((itemOwn: string) =>
                itemOwn.toLowerCase().replace(/[\s-]/g, '') === filterOwnership.toLowerCase().replace(/[\s-]/g, '')
              )
            );
          });
        }
      }
      const servicesFilter = filters.services;
      if (servicesFilter) {
        const services = Array.isArray(servicesFilter) ? servicesFilter : [servicesFilter];
        if (services.length > 0) {
          filtered = filtered.filter(item => {
            const itemServicesArray = Array.isArray(item.services) ? item.services : [item.services];
            return services.some(filterService =>
              itemServicesArray.some((itemSvc: string) =>
                itemSvc.toLowerCase().replace(/[\s_]/g, '') === filterService.toLowerCase().replace(/[\s_]/g, '')
              )
            );
          });
        }
      }
      const documentTypeFilter = filters.documentType;
      if (documentTypeFilter) {
        const documentTypes = Array.isArray(documentTypeFilter) ? documentTypeFilter : [documentTypeFilter];
        if (documentTypes.length > 0) {
          filtered = filtered.filter(item => {
            const itemDocumentTypesArray = Array.isArray(item.documentType) ? item.documentType : [item.documentType];
            return documentTypes.some(filterDocType =>
              itemDocumentTypesArray.some((itemDocType: string) => itemDocType.toLowerCase() === filterDocType.toLowerCase())
            );
          });
        }
      }
      const serviceDomainsFilter = filters.serviceDomains;
      if (serviceDomainsFilter) {
        const serviceDomains = Array.isArray(serviceDomainsFilter) ? serviceDomainsFilter : [serviceDomainsFilter];
        if (serviceDomains.length > 0) {
          filtered = filtered.filter(item => {
            const itemServiceDomainsArray = Array.isArray(item.serviceDomains) ? item.serviceDomains : [item.serviceDomains];
            return serviceDomains.some(filterDomain =>
              itemServiceDomainsArray.some((itemDomain: string) =>
                itemDomain.toLowerCase().replace(/[\s_&]/g, '') === filterDomain.toLowerCase().replace(/[\s_&]/g, '')
              )
            );
          });
        }
      }
      const aiMaturityLevelFilter = filters.aiMaturityLevel;
      if (aiMaturityLevelFilter) {
        const aiMaturityLevels = Array.isArray(aiMaturityLevelFilter) ? aiMaturityLevelFilter : [aiMaturityLevelFilter];
        if (aiMaturityLevels.length > 0) {
          filtered = filtered.filter(item => {
            const itemMaturityLevelArray = Array.isArray(item.aiMaturityLevel) ? item.aiMaturityLevel : [item.aiMaturityLevel];
            return aiMaturityLevels.some(filterLevel =>
              itemMaturityLevelArray.some((itemLevel: string) =>
                itemLevel.toLowerCase().replace(/[\s_()]/g, '') === filterLevel.toLowerCase().replace(/[\s_()]/g, '')
              )
            );
          });
        }
      }
      const toolCategoryFilter = filters.toolCategory;
      if (toolCategoryFilter) {
        const toolCategories = Array.isArray(toolCategoryFilter) ? toolCategoryFilter : [toolCategoryFilter];
        if (toolCategories.length > 0) {
          filtered = filtered.filter(item => {
            const itemToolCategory = item.toolCategory || '';
            return toolCategories.some(filterCategory =>
              itemToolCategory.toLowerCase().replace(/[\s_]/g, '') === filterCategory.toLowerCase().replace(/[\s_]/g, '')
            );
          });
        }
      }
      const deliveryModeFilter = filters.deliveryMode;
      if (deliveryModeFilter) {
        const deliveryModes = Array.isArray(deliveryModeFilter) ? deliveryModeFilter : [deliveryModeFilter];
        if (deliveryModes.length > 0) {
          filtered = filtered.filter(item => {
            const itemMode = (item.deliveryMode || '').toLowerCase().trim();
            return deliveryModes.some(filterMode => {
              const normalizedFilter = filterMode.toLowerCase().trim();
              const normalizeMode = (mode: string) => {
                const cleaned = mode.replace(/[\s-]/g, '');
                return (cleaned === 'inperson' || cleaned.includes('person')) ? 'inperson' : cleaned;
              };
              return normalizeMode(itemMode) === normalizeMode(normalizedFilter);
            });
          });
        }
      }
      const providerFilter = filters.provider;
      if (providerFilter) {
        const providers = Array.isArray(providerFilter) ? providerFilter : [providerFilter];
        if (providers.length > 0) {
          filtered = filtered.filter(item => {
            const itemProvider = (item.provider?.name || '').toLowerCase();
            return providers.some(filterProvider => {
              const normalizedFilter = filterProvider.toLowerCase();
              const providerMap: Record<string, string[]> = {
                'it_support': ['it support', 'itsupport'], 'hr': ['hr'],
                'finance': ['finance'], 'admin': ['admin', 'administrative'],
              };
              const possibleNames = providerMap[normalizedFilter] || [normalizedFilter];
              return possibleNames.some(name => itemProvider === name || itemProvider.includes(name) || name.includes(itemProvider));
            });
          });
        }
      }
      const locationFilter = filters.location;
      if (locationFilter) {
        const locations = Array.isArray(locationFilter) ? locationFilter : [locationFilter];
        if (locations.length > 0) {
          const normalizeLocation = (loc: string) => {
            const map: Record<string, string> = { 'dubai': 'Dubai', 'nairobi': 'Nairobi', 'riyadh': 'Riyadh' };
            return map[loc.toLowerCase()] || loc;
          };
          filtered = filtered.filter(item => {
            const itemLocation = item.location || '';
            return locations.some(filterLocation => {
              const normalizedFilter = normalizeLocation(filterLocation);
              return itemLocation === normalizedFilter ||
                     itemLocation.toLowerCase().includes(normalizedFilter.toLowerCase()) ||
                     normalizedFilter.toLowerCase().includes(itemLocation.toLowerCase());
            });
          });
        }
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const searchableText = [item.title, item.description, item.category, item.serviceType, item.deliveryMode, item.provider?.name, ...(item.tags || [])].filter(Boolean).join(' ').toLowerCase();
          return searchableText.includes(query);
        });
      }
    } else {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const searchableText = [item.title, item.description, item.category, item.provider?.name, ...(item.tags || [])].filter(Boolean).join(' ').toLowerCase();
          return searchableText.includes(query);
        });
      }
    }
    s.setFilteredItems(filtered);
    s.setTotalCount(filtered.length);
  } catch (err) {
    s.setError(`Failed to load ${marketplaceType}`);
    const fallbackItems = getFallbackItems(marketplaceType);
    s.setItems(fallbackItems);
    let filteredFallback = fallbackItems;
    if (isServicesCenter) {
      const tabCategoryMap: Record<string, string> = {
        'technology': 'Technology', 'business': 'Employee Services',
        'digital_worker': 'Digital Worker', 'prompt_library': 'Prompt Library', 'ai_tools': 'AI Tools',
      };
      const activeTabCategory = tabCategoryMap[activeServiceTab];
      if (activeTabCategory) {
        filteredFallback = filteredFallback.filter(item => item.category === activeTabCategory);
      }
    }
    s.setFilteredItems(filteredFallback);
    s.setTotalCount(filteredFallback.length);
  } finally {
    s.setLoading(false);
  }
}

// ---------------------------------------------------------------------------
// Custom hook: useMarketplaceData
// Encapsulates filter-config loading + item-fetching side effects so that
// MarketplacePage only has to call this hook (reducing component complexity).
// ---------------------------------------------------------------------------
interface UseMarketplaceDataParams {
  marketplaceType: MarketplacePageProps['marketplaceType'];
  config: ReturnType<typeof getMarketplaceConfig>;
  isCourses: boolean;
  isGuides: boolean;
  isKnowledgeHub: boolean;
  isServicesCenter: boolean;
  isDesignSystem: boolean;
  activeServiceTab: string;
  activeDesignSystemTab: string;
  activeTab: string;
  searchQuery: string;
  queryParams: URLSearchParams;
  currentPage: number;
  pageSize: number;
  searchFilteredItemsLength: number;
}

function useMarketplaceData({
  marketplaceType,
  config,
  isCourses,
  isGuides,
  isKnowledgeHub,
  isServicesCenter,
  isDesignSystem,
  activeServiceTab,
  activeDesignSystemTab,
  activeTab,
  searchQuery,
  queryParams,
  currentPage,
  pageSize,
  searchFilteredItemsLength,
}: UseMarketplaceDataParams) {
  const [_items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [facets, setFacets] = useState<GuidesFacets>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchStartRef = useRef<number | null>(null);

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
      if (isServicesCenter) {
        const tabFilters = getTabSpecificFilters(activeServiceTab);
        setFilterConfig(tabFilters);
        const initial: Record<string, string | string[]> = {};
        tabFilters.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
        return;
      }
      if (isDesignSystem) {
        const tabFilters = getDesignSystemTabSpecificFilters(activeDesignSystemTab);
        setFilterConfig(tabFilters);
        const initial: Record<string, string | string[]> = {};
        tabFilters.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
        return;
      }
      try {
        let filterOptions = await fetchMarketplaceFilters(marketplaceType);
        filterOptions = prependLearningTypeFilter(marketplaceType, filterOptions);
        setFilterConfig(filterOptions);
        const initial: Record<string, string | string[]> = {};
        filterOptions.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      } catch (err) {
        setFilterConfig(config.filterCategories);
        const initial: Record<string, string | string[]> = {};
        config.filterCategories.forEach(c => { initial[c.id] = ''; });
        setFilters(initial);
      }
    };
    loadFilterOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplaceType, isCourses, isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem, activeServiceTab, activeDesignSystemTab, filterConfig.length, Object.keys(filters).length]);

  // Fetch items based on marketplace type
  useEffect(() => {
    const run = async () => {
      const s: GuidesSetters = { setLoading, setError, setItems, setFilteredItems, setTotalCount, setFacets };
      if (isCourses) { runCoursesLoad(s, searchFilteredItemsLength); return; }
      if (isKnowledgeHub) { runKnowledgeHubLoad(s, marketplaceType); return; }
      if (isGuides) { await runGuidesLoad(s, { activeTab, queryParams, currentPage, pageSize, searchStartRef }); return; }
      if (isDesignSystem) { runDesignSystemLoad(s, { activeDesignSystemTab, filters, queryParams }); return; }
      await runOtherMarketplaceLoad(s, { marketplaceType, filters, searchQuery, isServicesCenter, activeServiceTab });
    };
    run();
  }, [marketplaceType, filters, searchQuery, queryParams, isCourses, isKnowledgeHub, currentPage, pageSize, isServicesCenter, activeServiceTab, activeTab, isDesignSystem, activeDesignSystemTab]);

  return { _items, filteredItems, totalCount, filterConfig, setFilterConfig, filters, setFilters, facets, loading, setLoading, error, setError };
}

const VALID_SERVICE_TABS = ['technology', 'business', 'digital_worker', 'prompt_library', 'ai_tools'];

const SERVICE_TAB_INFO: Record<string, { title: string; description: string; managed: string }> = {
  technology: { title: 'Technology', description: 'Access technology-related services including IT support, software requests, system access, and technical assistance.', managed: 'Managed by DQ IT Support and Technical teams.' },
  business: { title: 'Employee Services', description: 'Explore employee services including HR support, finance services, administrative requests, and operational assistance.', managed: 'Provided by DQ HR, Finance, and Administrative teams.' },
  digital_worker: { title: 'Digital Worker', description: 'Discover digital worker services including automation solutions, AI agents requests, AI tools and usage guidelines', managed: 'Handled by DQ Automation Teams.' },
  prompt_library: { title: 'Prompt Library', description: "A curated collection of your team's best and previously used prompts to speed up workflows and boost productivity.", managed: 'Curated and maintained by DQ Digital Innovation Teams.' },
  ai_tools: { title: 'AI Tools', description: 'A centralized hub showcasing all AI tools and solutions used across the company.', managed: 'Provided by DQ AI & Innovation Teams.' },
};

const DESIGN_SYSTEM_TAB_LABELS: Record<string, string> = { cids: 'CI.DS', vds: 'V.DS', cds: 'CDS' };

const DESIGN_SYSTEM_TAB_DESCRIPTIONS: Record<string, { description: string }> = {
  cids: { description: 'Explains how DQ creates and delivers high-quality content with structure, clear guidelines, and review standards, ensuring consistency and impact across platforms.' },
  vds: { description: 'Guides how DQ creates high-impact video content with storytelling, design, and production standards for consistency and impact.' },
  cds: { description: 'Outlines how DQ designs and delivers marketing campaigns by blending strategy, storytelling, and execution for impactful results.' },
};

const TAB_LABELS: Record<WorkGuideTab, string> = {
  strategy: 'GHC', guidelines: 'Guidelines', '6xd': '6xD',
  blueprints: 'Products', testimonials: 'Testimonials', glossary: 'Glossary', faqs: 'FAQs',
};

const TAB_DESCRIPTIONS: Record<WorkGuideTab, { description: string; author?: string }> = {
  strategy: { description: 'Explore the Golden Honeycomb of Competencies (GHC), the system behind how DQ works and delivers value.', author: 'Authored by DQ Leadership and Strategy Teams' },
  guidelines: { description: 'Find practical guidelines and best practices to optimize workflow and collaboration across all DQ units.', author: 'Authored by DQ Associates, Leads, and Subject Matter Experts' },
  '6xd': { description: 'Discover the six dimensions of digital transformation that guide how organizations evolve, adapt, and thrive in the digital economy.', author: 'Authored by DQ Strategy and Transformation Teams' },
  blueprints: { description: 'Explore DQ\'s solutions, created to help organizations succeed and grow through digital transformation.', author: 'Product Owner / Practice' },
  testimonials: { description: 'Discover how DQ has enabled impactful transformations through our clients\' success feedback and testimonials.', author: 'Authored by DQ Teams, Clients, and Partners' },
  glossary: { description: 'Find clear explanations of key DQ terms, acronyms, and concepts to help you better understand how we operate.', author: 'Maintained by DQ Knowledge Management Team' },
  faqs: { description: 'Find answers to frequently asked questions about how we work, the tools we use, and the best practices followed across DQ.', author: 'Maintained by DQ Knowledge Management Team' },
};

function getValidGuideTab(params: URLSearchParams): WorkGuideTab {
  const tab = params.get('tab');
  return (tab === 'strategy' || tab === '6xd' || tab === 'blueprints' || tab === 'testimonials' || tab === 'glossary' || tab === 'faqs') ? tab : 'guidelines';
}

function getValidServiceTab(params: URLSearchParams): string {
  const tab = params.get('tab');
  return (tab && VALID_SERVICE_TABS.includes(tab)) ? tab : 'technology';
}

function getValidDesignSystemTab(params: URLSearchParams): DesignSystemTab {
  const tab = params.get('tab');
  return (tab === 'vds' || tab === 'cds') ? tab : 'cids';
}

function applyTabFilterCleanup(tab: WorkGuideTab, currentParams: URLSearchParams): URLSearchParams | null {
  const next = new URLSearchParams(currentParams.toString());
  let changed = false;
  const keysToDelete =
    tab === 'strategy' ? ['guide_type', 'sub_domain', 'domain', 'testimonial_category']
    : tab === 'blueprints' ? ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category']
    : tab === 'testimonials' ? ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector']
    : tab === 'glossary' ? ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location']
    : tab === 'faqs' ? ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category']
    : ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'];
  if (next.has('guidelines_category')) { next.delete('guidelines_category'); changed = true; }
  if (tab !== 'faqs' && next.has('faq_category')) { next.delete('faq_category'); changed = true; }
  if (tab !== 'blueprints') {
    for (const key of ['blueprint_framework', 'blueprint_sector', 'product_type', 'product_stage', 'product_sector']) {
      if (next.has(key)) { next.delete(key); changed = true; }
    }
  }
  for (const key of keysToDelete) {
    if (next.has(key)) { next.delete(key); changed = true; }
  }
  return changed ? next : null;
}

// ---------------------------------------------------------------------------
// More module-level helpers to further reduce MarketplacePage complexity
// ---------------------------------------------------------------------------

function computeHasActiveFilters(
  isCourses: boolean,
  isKnowledgeHub: boolean,
  isGuides: boolean,
  urlBasedFilters: Record<string, string[]>,
  activeFilters: string[],
  filters: Record<string, string | string[]>,
): boolean {
  if (isCourses) return Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0);
  if (isKnowledgeHub) return activeFilters.length > 0;
  if (isGuides) return false;
  return Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''));
}

function computeNextFilters(
  prev: Record<string, string | string[]>,
  filterType: string,
  value: string,
): Record<string, string | string[]> {
  const current = prev[filterType];
  if (Array.isArray(current)) {
    const nextValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    return { ...prev, [filterType]: nextValues.join(',') };
  }
  return { ...prev, [filterType]: value === current ? '' : value };
}

function applyNewJoinerTrack(
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams, opts: { replace: boolean }) => void,
): void {
  if (searchParams.get('track') !== 'newjoiner') return;
  const newParams = new URLSearchParams(searchParams);
  if (!newParams.get('level')) newParams.set('level', 'L1,L2');
  if (!newParams.get('category')) newParams.set('category', 'Day in DQ');
  setSearchParams(newParams, { replace: true });
}

function applyServiceTabSync(
  currentTab: string | null,
  activeServiceTab: string,
  setActiveServiceTab: (tab: string) => void,
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams, opts: { replace: boolean }) => void,
): void {
  const isValid = currentTab && VALID_SERVICE_TABS.includes(currentTab);
  if (isValid && currentTab !== activeServiceTab) {
    setActiveServiceTab(currentTab as string);
  } else if (!isValid) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeServiceTab);
    setSearchParams(newParams, { replace: true });
  }
}

function updateSearchQueryParams(
  queryParams: URLSearchParams,
  q: string,
  setQueryParams: (p: URLSearchParams) => void,
): void {
  const next = new URLSearchParams(queryParams.toString());
  next.delete('page');
  if (q) next.set('q', q); else next.delete('q');
  const qs = next.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
  setQueryParams(new URLSearchParams(next.toString()));
}

function handleTabCleanup(
  isGuides: boolean,
  activeTab: WorkGuideTab,
  prevTabRef: React.MutableRefObject<WorkGuideTab>,
  queryParams: URLSearchParams,
  setQueryParams: (p: URLSearchParams) => void,
): void {
  if (!isGuides || activeTab === 'guidelines' || prevTabRef.current === activeTab) return;
  prevTabRef.current = activeTab;
  const cleaned = applyTabFilterCleanup(activeTab, queryParams);
  if (!cleaned) return;
  const qs = cleaned.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
  setQueryParams(new URLSearchParams(cleaned.toString()));
}

function prepareCourseItems(isCourses: boolean, searchFilteredItems: any[], filteredItems: any[]): any[] {
  if (!isCourses) return filteredItems;
  return searchFilteredItems.map(course => {
    const allowedSet = new Set<string>(LOCATION_ALLOW as readonly string[]);
    const safeLocations = (course.locations || []).filter((loc: string) => allowedSet.has(loc));
    return {
      ...course,
      locations: safeLocations.length ? safeLocations : ['Global'],
      provider: { name: course.provider, logoUrl: '/DWS-Logo.png' },
      description: course.summary,
    };
  });
}

function getDesignSystemEmptyLabel(tab: DesignSystemTab): string {
  if (tab === 'cids') return 'CI.DS';
  if (tab === 'vds') return 'V.DS';
  return 'CDS';
}

// ---------------------------------------------------------------------------
// Sub-component: MainContent
// Renders the xl:w-3/4 main content area based on marketplace type.
// ---------------------------------------------------------------------------
interface MainContentProps {
  loading: boolean;
  error: string | null;
  isGuides: boolean;
  isKnowledgeHub: boolean;
  isDesignSystem: boolean;
  isCourses: boolean;
  filteredItems: any[];
  activeDesignSystemTab: DesignSystemTab;
  bookmarkedItems: string[];
  toggleBookmark: (itemId: string) => void;
  handleAddToComparison: (item: any) => void;
  searchQuery: string;
  activeFilters: string[];
  handleKnowledgeHubFilterChange: (filter: string) => void;
  clearKnowledgeHubFilters: () => void;
  retryFetch: () => void;
  activeTab: WorkGuideTab;
  filteredGlossaryTerms: any[];
  queryParams: URLSearchParams;
  setQueryParams: (p: URLSearchParams) => void;
  navigate: ReturnType<typeof import('react-router-dom').useNavigate>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  searchFilteredItems: any[];
  marketplaceType: MarketplacePageProps['marketplaceType'];
  promoCards: any[];
  activeServiceTab: string;
}

function MainContent({
  loading, error, isGuides, isKnowledgeHub, isDesignSystem, isCourses,
  filteredItems, activeDesignSystemTab, bookmarkedItems, toggleBookmark,
  handleAddToComparison, searchQuery, activeFilters, handleKnowledgeHubFilterChange,
  clearKnowledgeHubFilters, retryFetch, activeTab, filteredGlossaryTerms,
  queryParams, setQueryParams, navigate, currentPage, totalPages, goToPage,
  searchFilteredItems, marketplaceType, promoCards, activeServiceTab,
}: MainContentProps) {
  if (loading) {
    return (
      <div className="xl:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[...Array(6)].map((_, idx) => <CourseCardSkeleton key={idx} />)}
        </div>
      </div>
    );
  }
  if (error && !isGuides && !isKnowledgeHub) {
    return <div className="xl:w-3/4"><ErrorDisplay message={error} onRetry={retryFetch} /></div>;
  }
  if (isKnowledgeHub) {
    return (
      <div className="xl:w-3/4">
        <KnowledgeHubGrid
          bookmarkedItems={bookmarkedItems}
          onToggleBookmark={toggleBookmark}
          onAddToComparison={handleAddToComparison}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          onFilterChange={handleKnowledgeHubFilterChange}
          onClearFilters={clearKnowledgeHubFilters}
        />
      </div>
    );
  }
  if (isDesignSystem) {
    const emptyLabel = getDesignSystemEmptyLabel(activeDesignSystemTab);
    return (
      <div className="xl:w-3/4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredItems.map((item: any) => (
              <DesignSystemCard key={item.id} id={item.id} title={item.title} description={item.description} imageUrl={item.imageUrl} tags={item.tags} type={item.type} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No {emptyLabel} services found</h3>
              <p className="text-gray-600 text-sm">Service cards will appear here once they are added.</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (isGuides) {
    return (
      <div className="xl:w-3/4">
        <GuidesContent
          activeTab={activeTab}
          filteredItems={filteredItems}
          filteredGlossaryTerms={filteredGlossaryTerms}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          navigate={navigate}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </div>
    );
  }
  return (
    <div className="xl:w-3/4">
      <MarketplaceGrid
        items={prepareCourseItems(isCourses, searchFilteredItems, filteredItems)}
        marketplaceType={marketplaceType}
        bookmarkedItems={bookmarkedItems}
        onToggleBookmark={toggleBookmark}
        onAddToComparison={handleAddToComparison}
        promoCards={promoCards}
        activeServiceTab={activeServiceTab}
      />
    </div>
  );
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  title: _title,
  description: _description,
  promoCards = []
}) => {
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
      ? getValidServiceTab(typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams())
      : 'technology'
  );
  
  // Sync activeServiceTab with URL params
  useEffect(() => {
    if (!isServicesCenter) return;
    applyServiceTabSync(searchParams.get('tab'), activeServiceTab, setActiveServiceTab, searchParams, setSearchParams);
  }, [isServicesCenter, searchParams, activeServiceTab, setSearchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));
  const [activeTab, setActiveTab] = useState<WorkGuideTab>(() => getValidGuideTab(typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()));
  const [activeDesignSystemTab, setActiveDesignSystemTab] = useState<DesignSystemTab>(() =>
    isDesignSystem ? getValidDesignSystemTab(typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()) : 'cids'
  );


  useEffect(() => {
    if (!isGuides) return;
    setActiveTab(getValidGuideTab(queryParams));
  }, [isGuides, queryParams]);

  useEffect(() => {
    if (!isDesignSystem) return;
    setActiveDesignSystemTab(getValidDesignSystemTab(searchParams));
  }, [isDesignSystem, searchParams]);

  const handleDesignSystemTabChange = useCallback((tab: DesignSystemTab) => {
    setActiveDesignSystemTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams, { replace: false });
  }, [searchParams, setSearchParams]);

  const handleGuidesTabChange = useCallback((tab: WorkGuideTab) => {
    setActiveTab(tab);
    const next = buildGuidesTabParams(tab, queryParams);
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
    handleTabCleanup(isGuides, activeTab, prevTabRef, queryParams, setQueryParams);
  }, [isGuides, activeTab]);

  const pageSize = Math.min(200, Math.max(1, parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
  const currentPage = Math.max(1, parseInt(queryParams.get('page') || '1', 10));

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

  // --- Custom hook: encapsulates filter config loading + data fetching ---
  const {
    filteredItems,
    totalCount,
    filterConfig,
    setFilters,
    filters,
    facets,
    loading,
    setLoading,
    error,
    setError,
  } = useMarketplaceData({
    marketplaceType,
    config,
    isCourses,
    isGuides,
    isKnowledgeHub,
    isServicesCenter,
    isDesignSystem,
    activeServiceTab,
    activeDesignSystemTab,
    activeTab,
    searchQuery,
    queryParams,
    currentPage,
    pageSize,
    searchFilteredItemsLength: searchFilteredItems.length,
  });

  const totalPages = Math.max(1, Math.ceil(Math.max(totalCount, 0) / pageSize));
  
  // Filter glossary terms – logic lives in module-level filterGlossaryTerms()
  const filteredGlossaryTerms = useMemo(
    () => (isGuides && activeTab === 'glossary') ? filterGlossaryTerms(queryParams) : [],
    [isGuides, activeTab, queryParams]
  );
  
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
    if (isCourses) applyNewJoinerTrack(searchParams, setSearchParams);
  }, [isCourses, searchParams, setSearchParams]);
  
  // (filter config loading is now handled inside useMarketplaceData hook)
  

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    if (isCourses) { toggleFilter(filterType, value); return; }
    if (isGuides) return;
    setFilters(prev => computeNextFilters(prev, filterType, value));
  }, [isCourses, isGuides, toggleFilter]);
  
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
      const empty: Record<string, string | string[]> = {};
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

  const hasActiveFilters = computeHasActiveFilters(isCourses, isKnowledgeHub, isGuides, urlBasedFilters, activeFilters, filters);

  const handleSearchQueryChange = useCallback((q: string) => {
    if (isGuides || isDesignSystem) {
      updateSearchQueryParams(queryParams, q, setQueryParams);
    } else {
      setSearchQuery(q);
    }
  }, [isGuides, isDesignSystem, queryParams]);

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
              <>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <Link to={config.route} className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                      {config.itemNamePlural}
                    </Link>
                  </div>
                </li>
                {isServicesCenter && SERVICE_TAB_INFO[activeServiceTab] && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      <span className="ml-1 text-gray-700 md:ml-2">
                        {SERVICE_TAB_INFO[activeServiceTab].title}
                      </span>
                    </div>
                  </li>
                )}
              </>
            )}
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Service Center Tab Description Section */}
        {isServicesCenter && SERVICE_TAB_INFO[activeServiceTab] && (
          <div className="mb-6">
            <div className="mb-4 p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current focus</p>
                  <p className="text-lg font-semibold text-gray-900 mb-1">{SERVICE_TAB_INFO[activeServiceTab].title}</p>
                </div>
                <button className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-700" style={{ backgroundColor: '#DBEAFE' }}>
                  Tab overview
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-1">{SERVICE_TAB_INFO[activeServiceTab].description}</p>
              <p className="text-xs text-gray-500">{SERVICE_TAB_INFO[activeServiceTab].managed}</p>
            </div>
          </div>
        )}

        {/* Service Center Tabs */}
        {isServicesCenter && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Service tabs">
              {[
                { id: 'technology', label: 'Technology' },
                { id: 'business', label: 'Employee Services' },
                { id: 'digital_worker', label: 'Digital Worker' },
                { id: 'prompt_library', label: 'Prompt Library' },
                { id: 'ai_tools', label: 'AI Tools' }
              ].map((tab) => {
                const isActive = activeServiceTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveServiceTab(tab.id);
                      // Update URL with tab parameter
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('tab', tab.id);
                      setSearchParams(newParams, { replace: false });
                    }}
                    className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                      isActive
                        ? 'border-blue-700'
                        : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-gray-300'
                    }`}
                    style={isActive ? { color: '#030F35', borderColor: '#030F35' } : {}}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Guides Tabs Section */}
        {isGuides && (
          <>
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Guides navigation">
                {/* Main tabs rendered as buttons */}
                {(['strategy', 'guidelines', '6xd', 'blueprints', 'testimonials', 'glossary', 'faqs'] as WorkGuideTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => handleGuidesTabChange(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
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
              {/* Tab Description - Integrated with tabs */}
              {activeTab && TAB_DESCRIPTIONS[activeTab] && (
                <div className="pt-2 pb-2 mt-3 border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {TAB_DESCRIPTIONS[activeTab].description}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Design System Tabs Section */}
        {isDesignSystem && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Design System navigation">
              {(['cids', 'vds', 'cds'] as DesignSystemTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => handleDesignSystemTabChange(tab)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeDesignSystemTab === tab
                        ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeDesignSystemTab === tab ? 'page' : undefined}
                >
                  {DESIGN_SYSTEM_TAB_LABELS[tab]}
                </button>
              ))}
            </nav>
            {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab] && (
              <div className="pt-2 pb-2 mt-3 border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search + Sort - Hide for Glossary tab (has its own search) */}
        {!(isGuides && activeTab === 'glossary') && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                searchQuery={(isGuides || isDesignSystem) ? (queryParams.get('q') || '') : searchQuery}
                placeholder={isDesignSystem ? "Search in Design System" : (isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined)}
                ariaLabel={isDesignSystem ? "Search in Design System" : (isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined)}
                setSearchQuery={handleSearchQueryChange}
              />
            </div>
          </div>
        )}
        {isGuides && activeTab === 'blueprints' && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border border-blue-200 bg-blue-50 text-blue-700">
              Product
            </span>
          </div>
        )}

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
              {hasActiveFilters && (
                <button onClick={resetFilters} className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2">
                  Reset
                </button>
              )}
            </div>
          </div>

          <FilterSidebarSection
            isGuides={isGuides}
            isDesignSystem={isDesignSystem}
            isKnowledgeHub={isKnowledgeHub}
            isCourses={isCourses}
            showFilters={showFilters}
            toggleFilters={toggleFilters}
            resetFilters={resetFilters}
            activeTab={activeTab}
            facets={facets}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            filters={filters}
            filterConfig={filterConfig}
            handleFilterChange={handleFilterChange}
            urlBasedFilters={urlBasedFilters}
            activeFilters={activeFilters}
            handleKnowledgeHubFilterChange={handleKnowledgeHubFilterChange}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Main content */}
          <MainContent
            loading={loading}
            error={error}
            isGuides={isGuides}
            isKnowledgeHub={isKnowledgeHub}
            isDesignSystem={isDesignSystem}
            isCourses={isCourses}
            filteredItems={filteredItems}
            activeDesignSystemTab={activeDesignSystemTab}
            bookmarkedItems={bookmarkedItems}
            toggleBookmark={toggleBookmark}
            handleAddToComparison={handleAddToComparison}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            handleKnowledgeHubFilterChange={handleKnowledgeHubFilterChange}
            clearKnowledgeHubFilters={clearKnowledgeHubFilters}
            retryFetch={retryFetch}
            activeTab={activeTab}
            filteredGlossaryTerms={filteredGlossaryTerms}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            navigate={navigate}
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            searchFilteredItems={searchFilteredItems}
            marketplaceType={marketplaceType}
            promoCards={promoCards}
            activeServiceTab={activeServiceTab}
          />
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
