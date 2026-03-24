import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from './FilterSidebar.js';
import { MarketplaceGrid } from './MarketplaceGrid.js';
import { SearchBar } from '../SearchBar.js';
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { ErrorDisplay, CourseCardSkeleton } from '../SkeletonLoader.js';
import { fetchMarketplaceItems, fetchMarketplaceFilters } from '../../services/marketplace.js';
import { getMarketplaceConfig, getTabSpecificFilters } from '../../utils/marketplaceConfig.js';
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
import { SixXDComingSoonCards } from '../guides/SixXDComingSoonCards';
import { supabaseClient } from '../../lib/supabaseClient';
import { track } from '../../utils/analytics';

import { STATIC_PRODUCTS } from '../../utils/staticProducts';
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
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

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

// Module-level helper — extracted to reduce cognitive complexity of run()
const countBy = (arr: any[] | null | undefined, key: string) => {
  const m = new Map<string, number>();
  for (const r of (arr || [])) {
    const v = r[key];
    if (!v) continue;
    m.set(v, (m.get(v) || 0) + 1);
  }
  return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Helper: normalize a string for loose comparison (remove spaces, hyphens, underscores, ampersands)
const normalizeForCompare = (s: string) => s.toLowerCase().replaceAll(' ', '').replaceAll('_', '').replaceAll('&', '').replaceAll('-', '');

// Module-level filter predicates — extracted to reduce cognitive complexity of run()
const matchesStrategyType = (it: any, selectedType: string, slugifyFn: (s: string) => string): boolean => {
  const subDomain = (it.subDomain || '').toLowerCase();
  const slug = (it.slug || '').toLowerCase();
  const title = (it.title || '').toLowerCase();
  const summary = (it.summary || '').toLowerCase();
  const allText = `${subDomain} ${slug} ${title} ${summary}`;
  const normalizedSelected = slugifyFn(selectedType);
  const normalizedSubDomain = slugifyFn(subDomain);
  if (normalizedSubDomain === normalizedSelected || subDomain.includes(selectedType.toLowerCase()) || selectedType.toLowerCase().includes(subDomain)) return true;
  if (selectedType.toLowerCase() === 'journey') {
    return ['vision', 'mission', 'dq-vision', 'dq-mission', 'vision-and-mission', 'vision-mission'].some(kw => slug.includes(kw) || title.includes(kw) || allText.includes(kw));
  }
  if (selectedType.toLowerCase() === 'history') {
    return ['history', 'origin', 'began', 'founding', 'started', 'beginning', 'evolution', 'story'].some(kw => slug.includes(kw) || title.includes(kw) || allText.includes(kw));
  }
  return false;
};

const matchesStrategyFramework = (it: any, selected: string): boolean => {
  const subDomain = (it.subDomain || '').toLowerCase();
  const domain = (it.domain || '').toLowerCase();
  const guideType = (it.guideType || '').toLowerCase();
  const title = (it.title || '').toLowerCase();
  const slug = (it.slug || '').toLowerCase();
  const allText = `${subDomain} ${domain} ${guideType} ${title} ${slug}`;
  const frameworkKeywords: Record<string, string[]> = {
    'ghc1': ['vision'], 'ghc2': ['dq-hov', 'house of values'], 'ghc3': ['persona'],
    'ghc4': ['agile tms', 'tms'], 'ghc5': ['agile sos', 'sos'],
    'ghc6': ['agile flows', 'flows'], 'ghc7': ['agile 6xd', '6xd'],
  };
  if (selected === 'ghc2') {
    if (slug === 'dq-hov') return true;
    return title.includes('house of values') && !title.includes('competencies');
  }
  const keywords = frameworkKeywords[selected] || [selected];
  return keywords.some(kw => allText.includes(kw));
};

const matchesTestimonialCategory = (it: any, selectedCategory: string): boolean => {
  if (it.testimonialType === 'service-card') return it.testimonialCategory === selectedCategory;
  const allText = `${it.subDomain || ''} ${it.domain || ''} ${it.guideType || ''} ${it.title || ''} ${it.slug || ''} ${it.summary || ''}`.toLowerCase();
  const categoryKeywords: Record<string, string[]> = {
    'client-feedback': ['client feedback', 'client', 'clients'],
    'associates': ['associates feedback', 'associate', 'associates', 'employee'],
    'client-partner-reference': ['partner reference', 'partner', 'reference'],
    'team-employee-experience': ['employee experience', 'team experience', 'employee', 'team'],
    'milestone-achievement': ['milestone', 'achievement', 'accomplishment'],
  };
  const keywords = categoryKeywords[selectedCategory] || [selectedCategory.replaceAll('-', ' ')];
  return keywords.some(kw => allText.includes(kw));
};

const matchesArrayFilter = (itemValues: any, filterValues: string[], normalizeFn?: (s: string) => string): boolean => {
  const arr = Array.isArray(itemValues) ? itemValues : [itemValues || ''];
  return filterValues.some(fv =>
    arr.some((iv: string) => {
      const a = normalizeFn ? normalizeFn(iv) : iv.toLowerCase();
      const b = normalizeFn ? normalizeFn(fv) : fv.toLowerCase();
      return a === b;
    })
  );
};

// ─── Module-level helpers (extracted to reduce cognitive complexity) ──────────

// Maps each WorkGuideTab to the filter keys that should be deleted when switching to it
const TAB_FILTER_KEYS_TO_DELETE: Record<string, string[]> = {
  guidelines: ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'],
  strategy:   ['guide_type', 'sub_domain', 'domain', 'testimonial_category'],
  blueprints: ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments'],
  glossary:   ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location'],
  faqs:       ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'],
  testimonials: ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'location'],
};
// Keys always cleared when leaving their respective tabs
const BLUEPRINT_PRODUCT_FILTER_KEYS = ['blueprint_framework', 'blueprint_sector', 'product_type', 'product_stage', 'product_class', 'product_sector'];

// Converts a filter value (string or string[]) to a string array — used in applyServicesCenterFilters
const toFilterArr = (v: string | string[] | undefined): string[] => {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
};

// Converts a filter record value to a normalized string array for normalizedFilters
const toNormalizedArr = (v: string | string[]): string[] => {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
};

const buildBlueprintsResult = (queryParams: URLSearchParams, pageSize: number, from: number) => {
  const qStr = queryParams.get('q') || '';
  const productClasses = parseFilterValues(queryParams, 'product_class');

  let out = STATIC_PRODUCTS.map(product => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    summary: product.summary,
    heroImageUrl: product.heroImageUrl,
    lastUpdatedAt: product.lastUpdatedAt,
    authorName: product.authorName,
    authorOrg: product.authorOrg,
    isEditorsPick: product.isEditorsPick,
    downloadCount: product.downloadCount,
    guideType: product.guideType,
    domain: product.domain,
    functionArea: null,
    unit: null,
    subDomain: null,
    location: null,
    status: product.status,
    complexityLevel: null,
    productType: product.productType,
    productStage: product.productStage,
    productClass: product.productClass,
  }));

  if (productClasses.length > 0) {
    out = out.filter(it => productClasses.some(sc => (it.productClass || '').toLowerCase() === sc.toLowerCase()));
  }
  if (productClasses.includes('class-01')) {
    out = [];
  }
  if (qStr) {
    const query = qStr.toLowerCase();
    out = out.filter(it =>
      [it.title, it.summary, it.productType, it.guideType].filter(Boolean).join(' ').toLowerCase().includes(query)
    );
  }
  const total = out.length;
  return { items: out.slice(from, from + pageSize), total };
};

const filterStrategyTab = (out: any[]): any[] => {
  const excludedStrategySlugs = new Set([
    'dq-competencies-emotional-intelligence', 'dq-competencies-growth-mindset', 'dq-competencies-purpose',
    'dq-competencies-perceptive', 'dq-competencies-proactive', 'dq-competencies-perseverance',
    'dq-competencies-precision', 'dq-competencies-customer', 'dq-competencies-learning',
    'dq-competencies-collaboration', 'dq-competencies-responsibility', 'dq-competencies-trust',
    'dq-competencies', 'dq-beliefs', 'dq-strategy-2021-2030', 'dq-journey', 'journey',
  ]);
  const canonicalGHCSlugs = new Set([
    'dq-ghc', 'dq-vision', 'dq-hov', 'dq-persona',
    'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd',
  ]);
  const canonicalTitles = [
    'dq golden honeycomb of competencies', 'dq vision', 'house of values', 'dq persona',
    'agile tms', 'agile sos', 'agile flows', 'agile 6xd',
  ];
  return out.filter(it => {
    const slug = (it.slug || '').toLowerCase();
    const title = (it.title || '').toLowerCase();
    if (excludedStrategySlugs.has(slug)) return false;
    if (title.includes('dq journey') || title.includes('dq beliefs') ||
        title.includes('strategy 2021') || title.includes('strategy 2030')) return false;
    const looksLikeGHC = title.includes('ghc') || title.includes('agile tms') || title.includes('agile sos') ||
                         title.includes('agile flows') || title.includes('agile 6xd') || title.includes('6xd') ||
                         slug.includes('ghc') || slug.includes('agile');
    if (looksLikeGHC && !canonicalGHCSlugs.has(slug)) {
      const cleanTitle = title.replace(/^(ghc|dq)\s+/i, '').replace(/\s+\(.*\)$/i, '').trim();
      return !canonicalTitles.some(c => cleanTitle.includes(c) || c.includes(cleanTitle));
    }
    return true;
  });
};

const buildTestimonialsTab = (mapped: any[]): any[] => {
  const staticCards = [
    {
      id: 'client-perspective', slug: 'client-perspective', title: 'The Client Perspective',
      summary: 'Client feedback on driving strategic transformation outcomes.',
      heroImageUrl: '/images/client-testimonials.png', lastUpdatedAt: new Date().toISOString(),
      authorName: 'DQ Teams', authorOrg: 'Digital Qatalyst', isEditorsPick: true, downloadCount: 0,
      guideType: 'Testimonial', domain: 'Testimonial', functionArea: null, unit: null,
      subDomain: 'client-feedback', location: null, status: 'Approved', complexityLevel: null,
      testimonialCategory: 'client-feedback', testimonialType: 'service-card',
    },
    {
      id: 'associate-perspective', slug: 'associate-perspective', title: 'The Associate Perspective',
      summary: 'Associate feedback on professional growth and DQ culture.',
      heroImageUrl: '/images/associate-testimonials.jpeg', lastUpdatedAt: new Date().toISOString(),
      authorName: 'DQ Teams', authorOrg: 'Digital Qatalyst', isEditorsPick: true, downloadCount: 0,
      guideType: 'Testimonial', domain: 'Testimonial', functionArea: null, unit: null,
      subDomain: 'associates', location: null, status: 'Approved', complexityLevel: null,
      testimonialCategory: 'associates', testimonialType: 'service-card',
    },
  ];
  const dbTestimonials = mapped.filter(item => {
    const domain = (item.domain || '').toLowerCase();
    const guideType = (item.guideType || '').toLowerCase();
    return domain.includes('testimonial') || guideType.includes('testimonial');
  });
  return [...staticCards, ...dbTestimonials];
};

const filterGuidelinesTab = (out: any[]): any[] =>
  out.filter(it => {
    const domain = (it.domain || '').toLowerCase().trim();
    const guideType = (it.guideType || '').toLowerCase().trim();
    return !domain.includes('strategy') && !guideType.includes('strategy') &&
           !domain.includes('blueprint') && !guideType.includes('blueprint') &&
           !domain.includes('testimonial') && !guideType.includes('testimonial');
  });

// Applies strategy-specific filters (type + framework) to a result set
const applyStrategyFilters = (result: any[], strategyTypes: string[], strategyFrameworks: string[], slugifyFn: (s: string) => string): any[] => {
  let out = result;
  if (strategyTypes.length) out = out.filter(it => strategyTypes.some(st => matchesStrategyType(it, st, slugifyFn)));
  if (strategyFrameworks.length) out = out.filter(it => strategyFrameworks.some(sf => matchesStrategyFramework(it, sf)));
  return out;
};

// Applies blueprint/product-specific filters to a result set
const applyBlueprintFilters = (result: any[], productTypes: string[], productStages: string[], productSectors: string[], blueprintSectors: string[], qStr: string, slugifyFn: (s: string) => string): any[] => {
  let out = result;
  if (productTypes.length) {
    const typeMap: Record<string, string[]> = {
      platform: ['platform'], academy: ['academy'], framework: ['framework'],
      tooling: ['tooling'], marketplace: ['marketplace'], 'enablement-product': ['enablement product'],
    };
    out = out.filter(it => {
      const itemType = (it.productType || '').toLowerCase();
      return productTypes.some(st => (typeMap[st] || [slugifyFn(st)]).some(term => itemType.includes(term)));
    });
  }
  if (productStages.length) {
    const stageMap: Record<string, string[]> = {
      concept: ['concept'], mvp: ['mvp'], live: ['live'], scaling: ['scaling'],
      'enterprise-ready': ['enterprise-ready', 'enterprise ready'],
    };
    out = out.filter(it => {
      const itemStage = (it.productStage || '').toLowerCase();
      return productStages.some(ss => (stageMap[ss] || [slugifyFn(ss)]).some(term => itemStage.includes(term)));
    });
  }
  if (productSectors.length || blueprintSectors.length) return [];
  if (qStr) {
    const query = qStr.toLowerCase();
    out = out.filter(it =>
      [it.title, it.summary, it.productType, it.productStage].filter(Boolean).join(' ').toLowerCase().includes(query)
    );
  }
  return out;
};

// Applies guidelines-specific categorization filter
const applyGuidelinesCategoryFilter = (result: any[], categorization: string[], guidelinesCategories: string[], slugifyFn: (s: string) => string): any[] => {
  let out = result;
  if (categorization.length) {
    const catKeywords: Record<string, string[]> = {
      'policy-set-1a-opg': ['policy set 1a', 'opg'],
      'policy-set-1b-ppp': ['policy set 1b', 'ppp'],
      'policy-set-2a-vision': ['policy set 02', '2a', 'vision'],
      'policy-set-2b-culture': ['policy set 02', '2b', 'culture'],
      'policy-set-2c-persona': ['policy set 02', '2c', 'persona'],
      'policy-set-2d-task': ['policy set 02', '2d', 'task'],
      'policy-set-2e-govern': ['policy set 02', '2e', 'govern'],
      'policy-set-2f-flow': ['policy set 02', '2f', 'flow'],
      'policy-set-2g-product': ['policy set 02', '2g', 'product'],
    };
    const slugCategoryOverrides: Record<string, string[]> = {
      'dq-associate-owned-asset-guidelines': ['policy-set-2f-flow'],
    };
    out = out.filter(it => {
      const slug = (it.slug || '').toLowerCase();
      const overrideCategories = slugCategoryOverrides[slug];
      if (overrideCategories) return categorization.some(cat => overrideCategories.includes(cat));
      const haystack = `${it.title || ''} ${it.summary || ''} ${it.subDomain || ''} ${slug}`.toLowerCase();
      return categorization.some(cat => {
        const kw = catKeywords[cat] || [cat.replaceAll('-', ' ')];
        return kw.some(k => haystack.includes(k.toLowerCase()));
      });
    });
  }
  if (guidelinesCategories.length) {
    out = out.filter(it => {
      const allText = `${it.subDomain || ''} ${it.domain || ''} ${it.guideType || ''} ${it.title || ''}`.toLowerCase();
      return guidelinesCategories.some(sc => {
        const norm = slugifyFn(sc);
        return allText.includes(sc.toLowerCase()) || allText.includes(norm) ||
               (sc === 'resources' && (allText.includes('resource') || allText.includes('guideline'))) ||
               (sc === 'policies' && (allText.includes('policy') || allText.includes('policies'))) ||
               (sc === 'xds' && (allText.includes('xds') || allText.includes('design-system') || allText.includes('design systems')));
      });
    });
  }
  return out;
};

const applyGuideClientFilters = (
  out: any[],
  params: {
    domains: string[]; subDomains: string[]; effectiveGuideTypes: string[];
    effectiveUnits: string[]; categorization: string[]; isGuidelinesTab: boolean;
    isBlueprintTab: boolean; isStrategyTab: boolean; isTestimonialsTab: boolean;
    strategyTypes: string[]; strategyFrameworks: string[]; guidelinesCategories: string[];
    productTypes: string[]; productStages: string[]; productSectors: string[];
    blueprintSectors: string[]; testimonialCategories: string[]; statuses: string[];
    qStr: string; slugifyFn: (s: string) => string;
  }
): any[] => {
  const { domains, subDomains, effectiveGuideTypes, effectiveUnits, categorization,
    isGuidelinesTab, isBlueprintTab, isStrategyTab, isTestimonialsTab,
    strategyTypes, strategyFrameworks, guidelinesCategories,
    productTypes, productStages, productSectors, blueprintSectors,
    testimonialCategories, statuses, qStr, slugifyFn } = params;

  let result = out;
  if (domains.length)    result = result.filter(it => it.domain && domains.includes(it.domain));
  if (subDomains.length) result = result.filter(it => it.subDomain && subDomains.includes(it.subDomain));

  if (effectiveGuideTypes.length) {
    result = result.filter(it => {
      if (!it.guideType) return false;
      const norm = slugifyFn(it.guideType);
      return effectiveGuideTypes.some(st => norm === slugifyFn(st) || it.guideType.toLowerCase().trim() === st.toLowerCase().trim());
    });
  }
  if (effectiveUnits.length) {
    result = result.filter(it => {
      const unitValue = it.unit || it.functionArea;
      if (!unitValue) return false;
      return effectiveUnits.some(su => slugifyFn(unitValue) === slugifyFn(su));
    });
  }

  if (isGuidelinesTab) result = applyGuidelinesCategoryFilter(result, categorization, guidelinesCategories, slugifyFn);
  if (isStrategyTab)   result = applyStrategyFilters(result, strategyTypes, strategyFrameworks, slugifyFn);
  if (isBlueprintTab)  result = applyBlueprintFilters(result, productTypes, productStages, productSectors, blueprintSectors, qStr, slugifyFn);
  if (isTestimonialsTab && testimonialCategories.length) {
    result = result.filter(it => testimonialCategories.some(cat => matchesTestimonialCategory(it, cat)));
  }
  if (statuses.length) result = result.filter(it => it.status && statuses.includes(it.status));
  return result;
};

const applyGHCOrdering = (out: any[]): any[] => {
  const ghcOrder = ['dq-ghc', 'dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd'];
  const titleOrder = ['dq golden honeycomb of competencies', 'dq vision', 'house of values', 'dq persona', 'agile tms', 'agile sos', 'agile flows', 'agile 6xd'];
  const orderIndex = (item: any) => {
    const slug = (item.slug || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const slugIdx = ghcOrder.indexOf(slug);
    if (slugIdx >= 0) return slugIdx;
    const titleIdx = titleOrder.findIndex(t => title.includes(t));
    return titleIdx >= 0 ? titleIdx : Number.MAX_SAFE_INTEGER;
  };
  return [...out].sort((a, b) => orderIndex(a) - orderIndex(b));
};

const buildGuideFacets = (
  facetRows: any[] | null,
  isGuidelinesTab: boolean,
  isSpecialTab: boolean,
  domains: string[]
) => {
  let filteredFacetRows = facetRows;
  if (isGuidelinesTab) {
    filteredFacetRows = (facetRows || []).filter((r: any) => {
      const domain = (r.domain || '').toLowerCase().trim();
      const guideType = (r.guide_type || '').toLowerCase().trim();
      return !domain.includes('strategy') && !guideType.includes('strategy') &&
             !domain.includes('blueprint') && !guideType.includes('blueprint') &&
             !domain.includes('testimonial') && !guideType.includes('testimonial');
    });
  }
  const domainFacets    = countBy(filteredFacetRows, 'domain');
  const guideTypeFacets = countBy(filteredFacetRows, 'guide_type');
  const subDomainFacetsRaw = countBy(filteredFacetRows, 'sub_domain');
  const unitFacets      = countBy(filteredFacetRows, 'unit');
  const locationFacets  = countBy(filteredFacetRows, 'location');
  const statusFacets    = countBy(filteredFacetRows, 'status');

  const allowedForFacets = new Set<string>();
  if (!isSpecialTab) {
    domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowedForFacets.add(s)));
  }
  const subDomainFacets = allowedForFacets.size
    ? subDomainFacetsRaw.filter(opt => allowedForFacets.has(opt.id))
    : subDomainFacetsRaw;

  return { domain: domainFacets, sub_domain: subDomainFacets, guide_type: guideTypeFacets, unit: unitFacets, location: locationFacets, status: statusFacets };
};

// ─── runOtherMarketplace helper ───────────────────────────────────────────────

const mapGuideRow = (r: any): any => {
  const unitValue = r.unit ?? r.function_area ?? null;
  const subDomainValue = r.sub_domain ?? r.subDomain ?? null;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
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
};

type ClientSideFilterFlags = {
  isStrategyTab: boolean;
  isBlueprintTab: boolean;
  isGuidelinesTab: boolean;
  strategyFrameworks: string[];
  blueprintFrameworks: string[];
  blueprintSectors: string[];
  productTypes: string[];
  productStages: string[];
  productSectors: string[];
  guidelinesCategories: string[];
  effectiveUnits: string[];
  categorization: string[];
};

const computeNeedsClientSideFiltering = (flags: ClientSideFilterFlags): boolean => {
  const { isStrategyTab, isBlueprintTab, isGuidelinesTab, strategyFrameworks, blueprintFrameworks,
    blueprintSectors, productTypes, productStages, productSectors, guidelinesCategories,
    effectiveUnits, categorization } = flags;
  const needsUnit = effectiveUnits.length > 0;
  const needsFramework =
    (isStrategyTab && strategyFrameworks.length > 0) ||
    (isBlueprintTab && (blueprintFrameworks.length > 0 || blueprintSectors.length > 0 ||
      productTypes.length > 0 || productStages.length > 0 || productSectors.length > 0)) ||
    (isGuidelinesTab && guidelinesCategories.length > 0);
  return needsUnit || needsFramework || categorization.length > 0;
};

const applyGenericSearch = (items: any[], searchQuery: string): any[] => {
  if (!searchQuery) return items;
  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    [item.title, item.description, item.category, item.provider?.name, ...(item.tags || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(query)
  );
};

const PROVIDER_MAP: Record<string, string[]> = {
  it_support: ['it support', 'itsupport'], hr: ['hr'],
  finance: ['finance'], admin: ['admin', 'administrative'],
};

const matchesProvider = (item: any, providers: string[]): boolean => {
  const itemProvider = (item.provider?.name || '').toLowerCase();
  return providers.some(fp => {
    const possible = PROVIDER_MAP[fp.toLowerCase()] || [fp.toLowerCase()];
    return possible.some(n => itemProvider === n || itemProvider.includes(n) || n.includes(itemProvider));
  });
};

const normLoc = (loc: string): string =>
  ({ dubai: 'Dubai', nairobi: 'Nairobi', riyadh: 'Riyadh' }[loc.toLowerCase()] || loc);

const matchesLocation = (item: any, locations: string[]): boolean => {
  const itemLoc = item.location || '';
  return locations.some(fl => {
    const nl = normLoc(fl);
    return itemLoc === nl || itemLoc.toLowerCase().includes(nl.toLowerCase()) || nl.toLowerCase().includes(itemLoc.toLowerCase());
  });
};

type GuidesTabFlags = {
  isStrategyTab: boolean;
  isTestimonialsTab: boolean;
  isGuidelinesTab: boolean;
  isSpecialTab: boolean;
};

type GuidesQueryParams = {
  statuses: string[];
  qStr: string;
  domains: string[];
  subDomains: string[];
  effectiveGuideTypes: string[];
  sort: string;
};

const applyGuidesStatusFilter = (q: any, statuses: string[], isStrategyTab: boolean): any => {
  if (statuses.length) return q.in('status', statuses);
  if (isStrategyTab) return q.in('status', ['Approved', 'Published', 'Draft']);
  return q.eq('status', 'Approved');
};

const applyGuidesDomainFilter = (q: any, domains: string[], isStrategyTab: boolean, isTestimonialsTab: boolean, isGuidelinesTab: boolean): any => {
  if (isStrategyTab) return q.or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%');
  if (isTestimonialsTab) return q.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
  if (isGuidelinesTab) {
    if (domains.length) return q.in('domain', domains);
    return q;
  }
  if (domains.length) return q.in('domain', domains);
  return q;
};

const applyGuidesQueryFilters = (
  q: any,
  params: GuidesQueryParams,
  flags: GuidesTabFlags
): any => {
  const { statuses, qStr, domains, subDomains, effectiveGuideTypes, sort } = params;
  const { isStrategyTab, isTestimonialsTab, isGuidelinesTab, isSpecialTab } = flags;
  q = applyGuidesStatusFilter(q, statuses, isStrategyTab);
  if (qStr) q = q.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
  q = applyGuidesDomainFilter(q, domains, isStrategyTab, isTestimonialsTab, isGuidelinesTab);
  if (!isSpecialTab && subDomains.length) q = q.in('sub_domain', subDomains);
  if (effectiveGuideTypes.length && !isGuidelinesTab) q = q.in('guide_type', effectiveGuideTypes);
  if (sort === 'updated') {
    q = q.order('last_updated_at', { ascending: false, nullsFirst: false });
  } else if (sort === 'downloads') {
    q = q.order('download_count', { ascending: false, nullsFirst: false });
  } else if (sort === 'editorsPick') {
    q = q.order('is_editors_pick', { ascending: false })
         .order('last_updated_at', { ascending: false, nullsFirst: false });
  } else {
    q = q.order('is_editors_pick', { ascending: false })
         .order('download_count',  { ascending: false, nullsFirst: false })
         .order('last_updated_at', { ascending: false, nullsFirst: false });
  }
  return q;
};

const computeAllowedSubDomains = (domains: string[], rawSubs: string[], isSpecialTab: boolean): string[] => {
  if (isSpecialTab) return [];
  const allowed = new Set<string>();
  domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
  return allowed.size ? rawSubs.filter(v => allowed.has(v)) : rawSubs;
};

const applyFacetQueryFilters = (
  facetQ: any,
  statuses: string[],
  qStr: string,
  excludedSlugs: string[],
  flags: Pick<GuidesTabFlags, 'isStrategyTab' | 'isTestimonialsTab'>
): any => {
  const { isStrategyTab, isTestimonialsTab } = flags;
  if (statuses.length) {
    facetQ = facetQ.in('status', statuses);
  } else if (isStrategyTab) {
    facetQ = facetQ.in('status', ['Approved', 'Published', 'Draft']);
  } else {
    facetQ = facetQ.eq('status', 'Approved');
  }
  excludedSlugs.forEach(slug => { facetQ = facetQ.neq('slug', slug); });
  if (qStr) facetQ = facetQ.or(`title.ilike.%${qStr}%,summary.ilike.%${qStr}%`);
  if (isStrategyTab) facetQ = facetQ.or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%');
  else if (isTestimonialsTab) facetQ = facetQ.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
  return facetQ;
};

const sortGuideResults = (out: any[], sort: string): any[] => {
  if (sort === 'updated') {
    return [...out].sort((a, b) => new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime());
  }
  if (sort === 'downloads') {
    return [...out].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
  }
  if (sort === 'editorsPick') {
    return [...out].sort((a, b) =>
      (Number(b.isEditorsPick) || 0) - (Number(a.isEditorsPick) || 0) ||
      new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime()
    );
  }
  return [...out].sort((a, b) =>
    (Number(b.isEditorsPick) || 0) - (Number(a.isEditorsPick) || 0) ||
    (b.downloadCount || 0) - (a.downloadCount || 0) ||
    new Date(b.lastUpdatedAt || 0).getTime() - new Date(a.lastUpdatedAt || 0).getTime()
  );
};

const normDeliveryMode = (s: string): string => {
  const c = s.replaceAll(/[\s-]/g, '');
  return c === 'inperson' || c.includes('person') ? 'inperson' : c;
};

const applyDeliveryModeFilter = (result: any[], deliveryModes: string[]): any[] =>
  result.filter(item => deliveryModes.some(fm => normDeliveryMode(item.deliveryMode || '') === normDeliveryMode(fm)));

const normServiceType = (s: string): string => s.replaceAll(/[\s-]/g, '').toLowerCase();

const applyServiceTypeFilter = (result: any[], serviceTypes: string[]): any[] =>
  result.filter(item => serviceTypes.some(ft => normServiceType(item.serviceType || '') === normServiceType(ft)));

type ArrayFilterSpec = {
  readonly key: string;
  readonly field: string;
  readonly normalizer?: (s: string) => string;
};

const SERVICES_CENTER_ARRAY_FILTERS: readonly ArrayFilterSpec[] = [
  { key: 'userCategory',      field: 'userCategory' },
  { key: 'technicalCategory', field: 'technicalCategory', normalizer: normalizeForCompare },
  { key: 'deviceOwnership',   field: 'deviceOwnership',   normalizer: normalizeForCompare },
  { key: 'documentType',      field: 'documentType' },
  { key: 'serviceDomains',    field: 'serviceDomains',    normalizer: normalizeForCompare },
  { key: 'aiMaturityLevel',   field: 'aiMaturityLevel',   normalizer: normalizeForCompare },
  { key: 'toolCategory',      field: 'toolCategory',      normalizer: normalizeForCompare },
];

const applyArrayFiltersFromSpecs = (
  result: any[],
  filters: Record<string, string | string[]>,
  specs: readonly ArrayFilterSpec[]
): any[] => {
  let out = result;
  for (const spec of specs) {
    const vals = toFilterArr(filters[spec.key]);
    if (vals.length) out = out.filter(item => matchesArrayFilter(item[spec.field], vals, spec.normalizer));
  }
  return out;
};

const applyServicesFilter = (result: any[], filters: Record<string, string | string[]>): any[] => {
  const vals = toFilterArr(filters.services);
  if (!vals.length) return result;
  return result.filter(item => matchesArrayFilter(item.services, vals, s => s.toLowerCase().replaceAll(/[\s_]/g, '')));
};

const applyServicesCenterFilters = (
  filtered: any[],
  filters: Record<string, string | string[]>,
  activeServiceTab: string,
  searchQuery: string
): any[] => {
  const tabCategoryMap: Record<string, string> = {
    technology: 'Technology', business: 'Employee Services',
    digital_worker: 'Digital Worker', prompt_library: 'Prompt Library', ai_tools: 'AI Tools',
  };
  const activeTabCategory = tabCategoryMap[activeServiceTab];
  let result = activeTabCategory
    ? filtered.filter(item => (item.category || '') === activeTabCategory)
    : filtered;

  const getArr = toFilterArr;

  const serviceTypes = getArr(filters.serviceType);
  if (serviceTypes.length) result = applyServiceTypeFilter(result, serviceTypes);

  result = applyArrayFiltersFromSpecs(result, filters, SERVICES_CENTER_ARRAY_FILTERS);
  result = applyServicesFilter(result, filters);

  const deliveryModes = getArr(filters.deliveryMode);
  if (deliveryModes.length) result = applyDeliveryModeFilter(result, deliveryModes);

  const providers = getArr(filters.provider);
  if (providers.length) result = result.filter(item => matchesProvider(item, providers));

  const locations = getArr(filters.location);
  if (locations.length) result = result.filter(item => matchesLocation(item, locations));

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(item =>
      [item.title, item.description, item.category, item.serviceType, item.deliveryMode, item.provider?.name, ...(item.tags || [])]
        .filter(Boolean).join(' ').toLowerCase().includes(query)
    );
  }
  return result;
};

const getTabCleanupKeys = (tab: string): string[] => {
  if (tab === 'strategy') return ['guide_type', 'sub_domain', 'domain', 'testimonial_category'];
  if (tab === 'blueprints') return ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category'];
  if (tab === 'testimonials') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'location'];
  if (tab === 'glossary') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location'];
  if (tab === 'faqs') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
  return ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'];
};

const applyDefaultHeroImage = (out: any[]): any[] => {
  const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80';
  return out.map(it => ({ ...it, heroImageUrl: it.heroImageUrl || defaultImage }));
};

const computePageTotal = (
  out: any[],
  count: number | null,
  needsClientSideFiltering: boolean,
  isBlueprintTab: boolean,
  totalFiltered: number
): number => {
  const clientSideTotal = (needsClientSideFiltering || isBlueprintTab) ? totalFiltered : -1;
  const serverTotal = typeof count === 'number' ? count : out.length;
  return clientSideTotal >= 0 ? clientSideTotal : serverTotal;
};

// Returns updated URLSearchParams if any keys were deleted, or null if nothing changed
const PRODUCT_FILTER_KEYS = ['blueprint_framework', 'blueprint_sector', 'product_type', 'product_stage', 'product_class', 'product_sector'];

const cleanupTabFilters = (activeTab: string, queryParams: URLSearchParams): URLSearchParams | null => {
  const next = new URLSearchParams(queryParams.toString());
  let changed = false;
  const deleteKey = (key: string) => { if (next.has(key)) { next.delete(key); changed = true; } };

  deleteKey('guidelines_category');
  if (activeTab !== 'faqs') deleteKey('faq_category');
  if (activeTab !== 'blueprints') PRODUCT_FILTER_KEYS.forEach(deleteKey);
  getTabCleanupKeys(activeTab).forEach(deleteKey);

  return changed ? next : null;
};

/**
 * Builds the URLSearchParams for a guides tab change.
 * Extracted to reduce cognitive complexity of handleGuidesTabChange.
 */
const buildTabChangeParams = (
  tab: string,
  currentParams: URLSearchParams
): URLSearchParams => {
  const next = new URLSearchParams(currentParams.toString());
  next.delete('page');
  if (tab === 'guidelines') next.delete('tab');
  else next.set('tab', tab);
  // Delete filters incompatible with the target tab
  (TAB_FILTER_KEYS_TO_DELETE[tab] || []).forEach(key => next.delete(key));
  // Clear tab-specific filters when leaving their tabs
  if (tab === 'guidelines') next.delete('guidelines_category');
  if (tab !== 'blueprints') BLUEPRINT_PRODUCT_FILTER_KEYS.forEach(key => next.delete(key));
  if (tab === 'faqs') next.delete('faq_category');
  return next;
};

/**
 * Parses all filter variables from queryParams for the guides fetch.
 * Extracted to reduce cognitive complexity of runGuides.
 */
const parseGuideQueryVars = (queryParams: URLSearchParams) => ({
  qStr:                  queryParams.get('q') || '',
  domains:               parseFilterValues(queryParams, 'domain'),
  rawSubs:               parseFilterValues(queryParams, 'sub_domain'),
  guideTypes:            parseFilterValues(queryParams, 'guide_type'),
  units:                 parseFilterValues(queryParams, 'unit'),
  statuses:              parseFilterValues(queryParams, 'status'),
  testimonialCategories: parseFilterValues(queryParams, 'testimonial_category'),
  strategyTypes:         parseFilterValues(queryParams, 'strategy_type'),
  strategyFrameworks:    parseFilterValues(queryParams, 'strategy_framework'),
  guidelinesCategories:  parseFilterValues(queryParams, 'guidelines_category'),
  categorization:        parseFilterValues(queryParams, 'categorization'),
  blueprintFrameworks:   parseFilterValues(queryParams, 'blueprint_framework'),
  blueprintSectors:      parseFilterValues(queryParams, 'blueprint_sector'),
  productTypes:          parseFilterValues(queryParams, 'product_type'),
  productStages:         parseFilterValues(queryParams, 'product_stage'),
  productSectors:        parseFilterValues(queryParams, 'product_sector'),
  sort:                  queryParams.get('sort') || 'editorsPick',
});

/**
 * Handles the blueprints-tab data path inside runGuides.
 * Returns true if it handled the tab (caller should return), false otherwise.
 */
const runBlueprintsTab = async (
  queryParams: URLSearchParams,
  currentPage: number,
  pageSize: number,
  setFilteredItems: (items: any[]) => void,
  setTotalCount: (n: number) => void,
  setLoading: (b: boolean) => void
): Promise<boolean> => {
  setLoading(true);
  try {
    const from = (currentPage - 1) * pageSize;
    const { items, total } = buildBlueprintsResult(queryParams, pageSize, from);
    setFilteredItems(items);
    setTotalCount(total);
  } catch (error) {
    console.error('Error loading products:', error);
    setFilteredItems([]);
    setTotalCount(0);
  }
  setLoading(false);
  return true;
};

// ─────────────────────────────────────────────────────────────────────────────

const VALID_GUIDE_TABS = new Set<string>(['strategy', '6xd', 'blueprints', 'testimonials', 'glossary', 'faqs']);
const VALID_SERVICE_TABS = new Set<string>(['technology', 'business', 'digital_worker', 'prompt_library', 'ai_tools']);

const parseGuideTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab && VALID_GUIDE_TABS.has(tab) ? tab : 'guidelines';
};

const parseServiceTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab && VALID_SERVICE_TABS.has(tab) ? tab : 'technology';
};

const parseDesignSystemTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab === 'vds' || tab === 'cds' ? tab : 'cids';
};

// ─── Guide tab-flag helper ─────────────────────────────────────────────────────
type GuideTabFlags = {
  isStrategyTab: boolean;
  isBlueprintTab: boolean;
  isTestimonialsTab: boolean;
  isGlossaryTab: boolean;
  isFAQsTab: boolean;
  isGuidelinesTab: boolean;
  isSpecialTab: boolean;
};

/**
 * Computes all boolean tab-identity flags from activeTab string.
 * Extracted to reduce cognitive complexity of runGuides.
 */
const computeGuideTabFlags = (tab: string): GuideTabFlags => {
  const isStrategyTab    = tab === 'strategy';
  const isBlueprintTab   = tab === 'blueprints';
  const isTestimonialsTab = tab === 'testimonials';
  const isGlossaryTab    = tab === 'glossary';
  const isFAQsTab        = tab === 'faqs';
  const isGuidelinesTab  = tab === 'guidelines';
  const isSpecialTab     = isStrategyTab || isBlueprintTab || isTestimonialsTab || isGlossaryTab || isFAQsTab;
  return { isStrategyTab, isBlueprintTab, isTestimonialsTab, isGlossaryTab, isFAQsTab, isGuidelinesTab, isSpecialTab };
};

type FetchGuideDataResult = {
  rows: any[] | null;
  count: number | null;
  facetRows: any[] | null;
  error: Error | null;
  facetError: Error | null;
};

/**
 * Runs the Supabase list + facet queries for runGuides.
 * Extracted to reduce cognitive complexity of runGuides.
 */
const fetchGuideData = async (
  q: any,
  facetQ: any,
  needsClientSideFiltering: boolean,
  from: number,
  to: number
): Promise<FetchGuideDataResult> => {
  const listPromise = needsClientSideFiltering ? q.limit(10000) : q.range(from, to);
  const [listResult, facetResult] = await Promise.all([listPromise, facetQ]);
  return {
    rows: listResult.data ?? null,
    count: listResult.count ?? null,
    error: listResult.error ?? null,
    facetRows: facetResult.data ?? null,
    facetError: facetResult.error ?? null,
  };
};

type PostFetchParams = {
  mapped: any[];
  flags: GuideTabFlags & { isBlueprintTab: boolean };
  clientFilterParams: Parameters<typeof applyGuideClientFilters>[1];
  sort: string;
  needsClientSideFiltering: boolean;
  from: number;
  pageSize: number;
};

/**
 * Applies tab-shape transforms, client-side filters, sort, and pagination slice
 * after the Supabase fetch. Extracted to reduce cognitive complexity of runGuides.
 */
const applyGuidePostFetch = (params: PostFetchParams & { isGuides: boolean; activeTab: string }): { out: any[]; totalFiltered: number } => {
  const { mapped, flags, clientFilterParams, sort, needsClientSideFiltering, from, pageSize, isGuides, activeTab } = params;
  const { isStrategyTab, isTestimonialsTab, isGuidelinesTab, isBlueprintTab } = flags;
  let out = mapped;

  if (isStrategyTab)          out = filterStrategyTab(out);
  else if (isTestimonialsTab) out = buildTestimonialsTab(mapped);
  else if (isGuidelinesTab)   out = filterGuidelinesTab(out);
  else if (!isBlueprintTab)   out = [];

  out = applyGuideClientFilters(out, clientFilterParams);
  out = sortGuideResults(out, sort);
  if (!isBlueprintTab) out = applyDefaultHeroImage(out);
  if (isGuides && activeTab === 'strategy') out = applyGHCOrdering(out);

  const totalFiltered = out.length;
  if (needsClientSideFiltering || isBlueprintTab) out = out.slice(from, from + pageSize);
  return { out, totalFiltered };
};

type FilterConfigSetters = {
  setFilterConfig: (c: FilterConfig[]) => void;
  setFilters: (f: Record<string, string | string[]>) => void;
};

type FilterConfigContext = {
  isGuides: boolean;
  isKnowledgeHub: boolean;
  isServicesCenter: boolean;
  isDesignSystem: boolean;
  marketplaceType: string;
  activeServiceTab: string;
  config: { filterCategories: FilterConfig[] };
  currentFilterConfigLength: number;
  currentFiltersLength: number;
};

/**
 * Loads filter configurations for the marketplace.
 * Extracted from the useEffect inner loadFilterOptions to reduce component
 * cognitive complexity (was score 19, now well under 15).
 */
const loadFilterConfig = async (
  ctx: FilterConfigContext,
  setters: FilterConfigSetters
): Promise<void> => {
  const { isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem,
    marketplaceType, activeServiceTab, config,
    currentFilterConfigLength, currentFiltersLength } = ctx;

  if (isGuides || isKnowledgeHub) {
    if (currentFilterConfigLength || currentFiltersLength) {
      setters.setFilterConfig([]);
      setters.setFilters({});
    }
    return;
  }
  const makeInitial = (cats: FilterConfig[]) =>
    Object.fromEntries(cats.map(c => [c.id, ''])) as Record<string, string | string[]>;

  if (isServicesCenter) {
    const tabFilters = getTabSpecificFilters(activeServiceTab);
    setters.setFilterConfig(tabFilters);
    setters.setFilters(makeInitial(tabFilters));
    return;
  }
  if (isDesignSystem) {
    setters.setFilterConfig(config.filterCategories);
    setters.setFilters(makeInitial(config.filterCategories));
    return;
  }
  try {
    let filterOptions = await fetchMarketplaceFilters(marketplaceType);
    filterOptions = prependLearningTypeFilter(marketplaceType, filterOptions);
    setters.setFilterConfig(filterOptions);
    setters.setFilters(makeInitial(filterOptions));
  } catch (err) {
    console.warn('[MarketplacePage] Failed to load filter options, using defaults:', err);
    setters.setFilterConfig(config.filterCategories);
    setters.setFilters(makeInitial(config.filterCategories));
  }
};

/**
 * Handles the sub-domain mismatch guard inside runGuides.
 * Returns the corrected URLSearchParams when a reset is needed, or null.
 */
const applySubDomainGuard = (
  isSpecialTab: boolean,
  rawSubs: string[],
  subDomains: string[],
  queryParams: URLSearchParams
): URLSearchParams | null => {
  if (isSpecialTab || !rawSubs.length || subDomains.length === rawSubs.length) return null;
  const next = new URLSearchParams(queryParams.toString());
  if (subDomains.length) next.set('sub_domain', subDomains.join(','));
  else next.delete('sub_domain');
  return next;
};

/**
 * Handles the page-overflow guard inside runGuides.
 * Returns the corrected URLSearchParams when a reset is needed, or null.
 */
const applyPageOverflowGuard = (
  currentPage: number,
  lastPage: number,
  queryParams: URLSearchParams
): URLSearchParams | null => {
  if (currentPage <= lastPage) return null;
  const next = new URLSearchParams(queryParams.toString());
  if (lastPage <= 1) next.delete('page');
  else next.set('page', '1');
  return next;
};

/**
 * Syncs the activeServiceTab with the URL `tab` param.
 * Extracted to reduce component cognitive complexity.
 */
const computeServiceTabSync = (
  currentTab: string | null,
  activeServiceTab: string
): { action: 'set-state'; tab: string } | { action: 'set-url' } | null => {
  const isValidTab = currentTab !== null && VALID_SERVICE_TABS.has(currentTab);
  if (isValidTab && currentTab !== activeServiceTab) return { action: 'set-state', tab: currentTab };
  if (!isValidTab) return { action: 'set-url' };
  return null;
};

type WorkGuideTab = 'guidelines' | 'strategy' | '6xd' | 'blueprints' | 'testimonials' | 'glossary' | 'faqs';
type DesignSystemTab = 'cids' | 'vds' | 'cds';

const TAB_LABELS: Record<WorkGuideTab, string> = {
  strategy: 'GHC',
  guidelines: 'Guidelines',
  '6xd': '6xD',
  blueprints: 'Products',
  testimonials: 'Testimonials',
  glossary: 'Glossary',
  faqs: 'FAQs'
};

const TAB_DESCRIPTIONS: Record<WorkGuideTab, { description: string; author?: string }> = {
  strategy: {
    description: 'Explore the Golden Honeycomb of Competencies (GHC), the system behind how DQ works and delivers value.',
    author: 'Authored by DQ Leadership and Strategy Teams'
  },
  guidelines: {
    description: 'Find practical guidelines and best practices to optimize workflow and collaboration across all DQ units.',
    author: 'Authored by DQ Associates, Leads, and Subject Matter Experts'
  },
  '6xd': {
    description: 'Discover the six dimensions of digital transformation that guide how organizations evolve, adapt, and thrive in the digital economy.',
    author: 'Authored by DQ Strategy and Transformation Teams'
  },
  blueprints: {
    description: 'Explore DQ\'s solutions, created to help organizations succeed and grow through digital transformation.',
    author: 'Product Owner / Practice'
  },
  testimonials: {
    description: 'Discover how DQ has enabled impactful transformations through our clients\' success feedback and testimonials.',
    author: 'Authored by DQ Teams, Clients, and Partners'
  },
  glossary: {
    description: 'Find clear explanations of key DQ terms, acronyms, and concepts to help you better understand how we operate.',
    author: 'Maintained by DQ Knowledge Management Team'
  },
  faqs: {
    description: 'Find answers to frequently asked questions about how we work, the tools we use, and the best practices followed across DQ.',
    author: 'Maintained by DQ Knowledge Management Team'
  }
};

const DESIGN_SYSTEM_TAB_LABELS: Record<DesignSystemTab, string> = {
  cids: 'CI.DS',
  vds: 'V.DS',
  cds: 'CDS'
};

const DESIGN_SYSTEM_TAB_DESCRIPTIONS: Record<DesignSystemTab, { description: string; author?: string }> = {
  cids: {
    description: 'Component Integration Design System - Reusable UI components, patterns, and integration guidelines for building consistent digital experiences.',
    author: 'Maintained by DQ Design & Engineering Teams'
  },
  vds: {
    description: 'Visual Design System - Design tokens, typography, color palettes, and visual guidelines for creating cohesive brand experiences.',
    author: 'Maintained by DQ Design Team'
  },
  cds: {
    description: 'Content Design System - Content patterns, writing guidelines, and messaging frameworks for clear and effective communication.',
    author: 'Maintained by DQ Content & Communications Teams'
  }
};

const SERVICE_CENTER_TAB_INFO: Record<string, { label: string; description: string; author: string; order: number }> = {
  technology: {
    label: 'Technology',
    description: 'Access technology-related services including IT support, software requests, system access, and technical assistance.',
    author: 'Managed by DQ IT Support and Technical teams.',
    order: 0
  },
  business: {
    label: 'Employee Services',
    description: 'Explore employee services including HR support, finance services, administrative requests, and operational assistance.',
    author: 'Provided by DQ HR, Finance, and Administrative teams.',
    order: 1
  },
  digital_worker: {
    label: 'Digital Worker',
    description: 'Discover digital worker services including automation solutions, AI agents requests, AI tools and usage guidelines',
    author: 'Handled by DQ Automation Teams.',
    order: 2
  },
  prompt_library: {
    label: 'Prompt Library',
    description: "A curated collection of your team's best and previously used prompts to speed up workflows and boost productivity.",
    author: 'Curated and maintained by DQ Digital Innovation Teams.',
    order: 3
  },
  ai_tools: {
    label: 'AI Tools',
    description: 'A centralized hub showcasing all AI tools and solutions used across the company.',
    author: 'Provided by DQ AI & Innovation Teams.',
    order: 4
  }
};

const MarketplaceBreadcrumbs = ({
  isGuides,
  isServicesCenter,
  config,
  activeServiceTab
}: {
  isGuides: boolean;
  isServicesCenter: boolean;
  config: any;
  activeServiceTab: string;
}) => (
  <nav className="flex mb-4" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-2">
      <li className="inline-flex items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
          <HomeIcon size={16} className="mr-1" />
          <span>Home</span>
        </Link>
      </li>
      {isGuides ? (
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon size={16} className="text-gray-400" />
            <span className="ml-1 text-gray-700 md:ml-2">{config.title}</span>
          </div>
        </li>
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
          {isServicesCenter && activeServiceTab && SERVICE_CENTER_TAB_INFO[activeServiceTab] && (
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-700 md:ml-2">
                  {SERVICE_CENTER_TAB_INFO[activeServiceTab].label}
                </span>
              </div>
            </li>
          )}
        </>
      )}
    </ol>
  </nav>
);

const ServiceCenterContent = ({
  isServicesCenter,
  activeServiceTab,
  setActiveServiceTab,
  searchParams,
  setSearchParams
}: {
  isServicesCenter: boolean;
  activeServiceTab: string;
  setActiveServiceTab: (tab: string) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void;
}) => {
  if (!isServicesCenter || !SERVICE_CENTER_TAB_INFO[activeServiceTab]) return null;
  const info = SERVICE_CENTER_TAB_INFO[activeServiceTab];

  return (
    <>
      <div className="mb-6">
        <div className="mb-4 p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current focus</p>
              <p className="text-lg font-semibold text-gray-900 mb-1">{info.label}</p>
            </div>
            <button className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-700" style={{ backgroundColor: '#DBEAFE' }}>
              Tab overview
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-1">{info.description}</p>
          <p className="text-xs text-gray-500">{info.author}</p>
        </div>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Service tabs">
          {Object.entries(SERVICE_CENTER_TAB_INFO).sort((a,b) => a[1].order - b[1].order).map(([tabId, tabInfo]) => {
            const isActive = activeServiceTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => {
                  setActiveServiceTab(tabId);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('tab', tabId);
                  setSearchParams(newParams, { replace: false });
                }}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                   isActive ? 'border-blue-700' : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
                style={isActive ? { color: '#030F35', borderColor: '#030F35' } : {}}
                aria-current={isActive ? 'page' : undefined}
              >
                {tabInfo.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

const GuidesTabsSection = ({
  isGuides,
  activeTab,
  handleGuidesTabChange
}: {
  isGuides: boolean;
  activeTab: WorkGuideTab;
  handleGuidesTabChange: (tab: WorkGuideTab) => void;
}) => {
  if (!isGuides) return null;
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Guides navigation">
        {(['strategy', 'guidelines', '6xd', 'blueprints', 'testimonials', 'glossary', 'faqs'] as WorkGuideTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleGuidesTabChange(tab)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
              activeTab === tab
                ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>
      {activeTab && TAB_DESCRIPTIONS[activeTab] && (
        <div className="pt-2 pb-2 mt-3 border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
          <p className="text-sm text-gray-600 leading-relaxed">
            {TAB_DESCRIPTIONS[activeTab].description}
          </p>
        </div>
      )}
    </div>
  );
};

const DesignSystemTabsSection = ({
  isDesignSystem,
  activeDesignSystemTab,
  setActiveDesignSystemTab,
  searchParams,
  setSearchParams
}: {
  isDesignSystem: boolean;
  activeDesignSystemTab: DesignSystemTab;
  setActiveDesignSystemTab: (tab: DesignSystemTab) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void;
}) => {
  if (!isDesignSystem) return null;
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Design System navigation">
        {(['cids', 'vds', 'cds'] as DesignSystemTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveDesignSystemTab(tab);
              const newParams = new URLSearchParams(searchParams);
              newParams.set('tab', tab);
              setSearchParams(newParams, { replace: false });
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeDesignSystemTab === tab
                ? 'border-[var(--guidelines-primary)] text-[var(--guidelines-primary)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={activeDesignSystemTab === tab ? 'page' : undefined}
          >
            {DESIGN_SYSTEM_TAB_LABELS[tab]}
          </button>
        ))}
      </nav>
      {activeDesignSystemTab && DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab] && (
        <div className="pt-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].description}
          </p>
          {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].author && (
            <p className="text-xs text-gray-500 mt-2">
              {DESIGN_SYSTEM_TAB_DESCRIPTIONS[activeDesignSystemTab].author}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const MarketplaceSearchBarSection = ({
  isDesignSystem,
  isGuides,
  isKnowledgeHub,
  searchQuery,
  queryParams,
  setQueryParams,
  setSearchQuery
}: {
  isDesignSystem: boolean;
  isGuides: boolean;
  isKnowledgeHub: boolean;
  searchQuery: string;
  queryParams: URLSearchParams;
  setQueryParams: (params: URLSearchParams) => void;
  setSearchQuery: (q: string) => void;
}) => {
  if (isDesignSystem) return null;
  return (
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
              globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`);
              setQueryParams(new URLSearchParams(next.toString()));
            } else {
              setSearchQuery(q);
            }
          }}
        />
      </div>
    </div>
  );
};

/**
 * Computes URL-based filters for courses.
 */
const computeUrlBasedFilters = (isCourses: boolean, courseFacets: any): Record<string, string[]> => {
  if (!isCourses || !courseFacets) return {};
  return {
    category: courseFacets.category || [],
    delivery: courseFacets.delivery || [],
    duration: courseFacets.duration || [],
    level: (courseFacets.level || []) as string[],
    department: courseFacets.department || [],
    location: courseFacets.location || [],
    audience: courseFacets.audience || [],
    status: courseFacets.status || []
  };
};

/**
 * Applies search query filtering to LMS items.
 */
const filterLmsItemsBySearch = (isCourses: boolean, searchQuery: string, lmsFilteredItems: any[]): any[] => {
  if (!isCourses || !searchQuery) return lmsFilteredItems;
  return lmsFilteredItems.filter(item => {
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
  });
};

/**
 * Checks and updates searchParams for the 'newjoiner' track.
 */
const handleNewjoinerTrackParams = (searchParams: URLSearchParams): URLSearchParams | null => {
  const track = searchParams.get('track');
  if (track !== 'newjoiner') return null;
  const newParams = new URLSearchParams(searchParams);
  let changed = false;
  if (!newParams.get('level')) { newParams.set('level', 'L1,L2'); changed = true; }
  if (!newParams.get('category')) { newParams.set('category', 'Day in DQ'); changed = true; }
  return changed ? newParams : null;
};

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
  const [facets, setFacets] = useState<GuidesFacets>({});
  const [queryParams, setQueryParams] = useState(() => new URLSearchParams(globalThis.location?.search ?? ''));
  const searchStartRef = useRef<number | null>(null);

  // Sync queryParams with URL changes
  const location = useLocation();
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    setQueryParams(currentParams);
  }, [location.search]); // Re-sync when URL search changes

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
  }, [queryParams, setQueryParams]);

  // Clean up incompatible filters when tab changes (not on every query change)
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
  }, [isGuides, activeTab]);

  const pageSize = Math.min(200, Math.max(1, Number.parseInt(queryParams.get('pageSize') || String(DEFAULT_GUIDE_PAGE_SIZE), 10)));
  const currentPage = Math.max(1, Number.parseInt(queryParams.get('page') || '1', 10));
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
  const searchFilteredItems = filterLmsItemsBySearch(isCourses, searchQuery, lmsFilteredItems);
  
  // Compute filters from URL for courses
  const urlBasedFilters = computeUrlBasedFilters(isCourses, courseFacets);
  
  // Handle track parameter for newjoiner (courses)
  useEffect(() => {
    if (isCourses) {
      const updatedParams = handleNewjoinerTrackParams(searchParams);
      if (updatedParams) setSearchParams(updatedParams, { replace: true });
    }
  }, [isCourses, searchParams, setSearchParams]);
  
  // Load filter configurations
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
  }, [marketplaceType, config, isCourses, isGuides, isKnowledgeHub, isServicesCenter, isDesignSystem, activeServiceTab, filterConfig.length, Object.keys(filters).length]);
  
  // ─── runGuides ────────────────────────────────────────────────────────────────
  // Extracted as a useCallback (outside useEffect) to reduce Sonar cognitive
  // complexity. Module-level helpers handle the heavy lifting.
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

      const subDomains         = computeAllowedSubDomains(domains, rawSubs, isSpecialTab);
      const effectiveGuideTypes = isSpecialTab ? [] : guideTypes;
      const effectiveUnits      = (isStrategyTab || isBlueprintTab || !isSpecialTab) ? units : [];

      // Sub-domain mismatch guard via module-level helper
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
      const to   = from + pageSize - 1;
      const facetQ = applyFacetQueryFilters(
        supabaseClient.from('guides').select('domain,sub_domain,guide_type,function_area,unit,location,status') as any,
        statuses, qStr, excludedSlugs, { isStrategyTab, isTestimonialsTab }
      );

      const { rows, count, error, facetRows, facetError } = await fetchGuideData(q, facetQ, needsClientSideFiltering, from, to);
      if (error) throw error;
      if (facetError) console.warn('[MarketplacePage] Facet query failed, continuing without facets:', facetError);

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

      const total    = computePageTotal(out, count, needsClientSideFiltering, isBlueprintTab, totalFiltered);
      const lastPage = Math.max(1, Math.ceil(total / pageSize));

      // Page-overflow guard via module-level helper
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
      setFacets(buildGuideFacets(facetRows, isGuidelinesTab, isSpecialTab, domains));

      const start = searchStartRef.current;
      if (start) { track('Guides.Search', { q: qStr, latency_ms: Date.now() - start }); searchStartRef.current = null; }
      track('Guides.ViewList', { q: qStr, sort, page: String(currentPage) });
    } catch (e) {
      console.error('[MarketplacePage] Failed to load guides:', e);
      setError('Failed to load guides. Please try again.');
      setFilteredItems([]); setFacets({}); setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, queryParams, currentPage, pageSize, isGuides, setQueryParams]);

  // ─── runOtherMarketplace ──────────────────────────────────────────────────────
  // Extracted as a useCallback (outside useEffect) to reduce Sonar cognitive
  // complexity from nesting inside the effect.
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
      console.error(`[MarketplacePage] Failed to load ${marketplaceType}:`, err);
      setError(`Failed to load ${marketplaceType}`);
      const fallbackItems = getFallbackItems(marketplaceType);
      const filteredFallback = isServicesCenter
        ? applyServicesCenterFilters(fallbackItems, filters, activeServiceTab, '')
        : fallbackItems;
      setFilteredItems(filteredFallback);
      setTotalCount(filteredFallback.length);
    } finally {
      setLoading(false);
    }
  }, [marketplaceType, filters, searchQuery, isServicesCenter, activeServiceTab]);

  // Fetch items based on marketplace type
  useEffect(() => {
    // COURSES: items come from LMS arrays / URL filters; no fetch
    if (isCourses) {
      setLoading(false);
      setError(null);
      setTotalCount(searchFilteredItems.length);
      setFilteredItems([]);
      return;
    }
    // KNOWLEDGE HUB: use fallback data (no API)
    if (isKnowledgeHub) {
      const fallbackItems = getFallbackItems(marketplaceType);
      setFilteredItems(fallbackItems);
      setTotalCount(fallbackItems.length);
      setLoading(false);
      return;
    }
    // GUIDES: Supabase query + facets
    if (isGuides) {
      runGuides();
      return;
    }
    // OTHER MARKETPLACES
    runOtherMarketplace();
  }, [marketplaceType, filters, searchQuery, queryParams, isCourses, isKnowledgeHub, currentPage, pageSize, isServicesCenter, activeServiceTab, activeTab, runGuides, runOtherMarketplace]);

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
        return { ...prev, [filterType]: Array.isArray(nextValues) ? nextValues.join(',') : nextValues };
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
      globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`);
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
    globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${next.toString() ? '?' + next.toString() : ''}`);
    globalThis.window?.scrollTo({ top: 0, behavior: 'smooth' });
    setQueryParams(new URLSearchParams(next.toString()));
  }, [queryParams, totalPages]);

  const renderMainContent = () => {
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
              onClickGuide={(g) => {
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
                onClickGuide={(g) => {
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
        activeServiceTab={activeServiceTab}
      />
    );
  };

  const normalizedFilters: Record<string, string[]> = isCourses
    ? urlBasedFilters
    : (Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, toNormalizedArr(v)])) as Record<string, string[]>);

  const coursesHaveFilters = isCourses && Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0);
  const knowledgeHubHasFilters = isKnowledgeHub && activeFilters.length > 0;
  const otherHasFilters = !isGuides && Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''));
  const hasActiveFilters = coursesHaveFilters || knowledgeHubHasFilters || otherHasFilters;

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
            {/* Backdrop */}
            <button
              type="button"
              className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 w-full h-full border-0 p-0 cursor-default ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={toggleFilters}
              aria-label="Close filters overlay"
              aria-hidden={!showFilters}
              tabIndex={showFilters ? 0 : -1}
            />
            {/* Panel */}
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
                    <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
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
              <GuidesFilters activeTab={activeTab} facets={facets} query={queryParams} onChange={(next) => { next.delete('page'); const qs = next.toString(); globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`); setQueryParams(new URLSearchParams(next.toString())); track('Guides.FilterChanged', { params: Object.fromEntries(next.entries()) }); }} />
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
            {renderMainContent()}
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



