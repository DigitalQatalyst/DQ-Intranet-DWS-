import { FilterConfig } from './FilterSidebar.js';
import { 
  CATEGORY_OPTS, 
  DELIVERY_OPTS, 
  DURATION_OPTS, 
  LEVELS, 
  LOCATION_ALLOW 
} from '../../lms/config';
import { STATIC_PRODUCTS } from '../../utils/staticProducts';
import { getTabSpecificFilters } from '../../utils/marketplaceConfig.js';
import { fetchMarketplaceFilters } from '../../services/marketplace.js';

export interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

export const LEARNING_TYPE_FILTER: FilterConfig = {
  id: 'learningType',
  title: 'Learning Type',
  options: [
    { id: 'courses', name: 'Courses' },
    { id: 'curricula', name: 'Curricula' },
    { id: 'testimonials', name: 'Testimonials' }
  ]
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

export const prependLearningTypeFilter = (marketplaceType: string, configs: FilterConfig[]): FilterConfig[] => {
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

export const COURSE_FILTER_CONFIG: FilterConfig[] = [
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

export const SUBDOMAIN_BY_DOMAIN: Record<string, string[]> = {
  strategy: ['journey', 'history', 'digital-framework', 'initiatives', 'clients'],
  guidelines: ['resources', 'policies'],
  blueprints: ['devops', 'dbp', 'dxp', 'dws', 'products', 'projects'],
};

export const DEFAULT_GUIDE_PAGE_SIZE = 200;
export const GUIDE_LIST_SELECT = [
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

export const parseFilterValues = (params: URLSearchParams, key: string): string[] =>
  (params.get(key) || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

export const countBy = (arr: any[] | null | undefined, key: string) => {
  const m = new Map<string, number>();
  for (const r of (arr || [])) {
    const v = r[key];
    if (!v) continue;
    m.set(v, (m.get(v) || 0) + 1);
  }
  return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const normalizeForCompare = (s: string) => s.toLowerCase().replaceAll(' ', '').replaceAll('_', '').replaceAll('&', '').replaceAll('-', '');

export const matchesStrategyType = (it: any, selectedType: string, slugifyFn: (s: string) => string): boolean => {
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

export const matchesStrategyFramework = (it: any, selected: string): boolean => {
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

export const matchesTestimonialCategory = (it: any, selectedCategory: string): boolean => {
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

export const matchesArrayFilter = (itemValues: any, filterValues: string[], normalizeFn?: (s: string) => string): boolean => {
  const arr = Array.isArray(itemValues) ? itemValues : [itemValues || ''];
  return filterValues.some(fv =>
    arr.some((iv: string) => {
      const a = normalizeFn ? normalizeFn(iv) : iv.toLowerCase();
      const b = normalizeFn ? normalizeFn(fv) : fv.toLowerCase();
      return a === b;
    })
  );
};

export const TAB_FILTER_KEYS_TO_DELETE: Record<string, string[]> = {
  guidelines: ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'],
  strategy:   ['guide_type', 'sub_domain', 'domain', 'testimonial_category'],
  blueprints: ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments'],
  glossary:   ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location'],
  faqs:       ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'],
  testimonials: ['guide_type', 'sub_domain', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'categorization', 'attachments', 'blueprint_framework', 'blueprint_sector', 'location'],
};

export const BLUEPRINT_PRODUCT_FILTER_KEYS = ['blueprint_framework', 'blueprint_sector', 'product_type', 'product_stage', 'product_class', 'product_sector'];

export const toFilterArr = (v: string | string[] | undefined): string[] => {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
};

export const toNormalizedArr = (v: string | string[]): string[] => {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
};

export const buildBlueprintsResult = (queryParams: URLSearchParams, pageSize: number, from: number) => {
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

export const filterStrategyTab = (out: any[]): any[] => {
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

export const buildTestimonialsTab = (mapped: any[]): any[] => {
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

export const filterGuidelinesTab = (out: any[]): any[] =>
  out.filter(it => {
    const domain = (it.domain || '').toLowerCase().trim();
    const guideType = (it.guideType || '').toLowerCase().trim();
    return !domain.includes('strategy') && !guideType.includes('strategy') &&
           !domain.includes('blueprint') && !guideType.includes('blueprint') &&
           !domain.includes('testimonial') && !guideType.includes('testimonial');
  });

export const applyStrategyFilters = (result: any[], strategyTypes: string[], strategyFrameworks: string[], slugifyFn: (s: string) => string): any[] => {
  let out = result;
  if (strategyTypes.length) out = out.filter(it => strategyTypes.some(st => matchesStrategyType(it, st, slugifyFn)));
  if (strategyFrameworks.length) out = out.filter(it => strategyFrameworks.some(sf => matchesStrategyFramework(it, sf)));
  return out;
};

export const applyBlueprintFilters = (result: any[], productTypes: string[], productStages: string[], productSectors: string[], blueprintSectors: string[], qStr: string, slugifyFn: (s: string) => string): any[] => {
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

export const applyGuidelinesCategoryFilter = (result: any[], categorization: string[], guidelinesCategories: string[], slugifyFn: (s: string) => string): any[] => {
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

export const applyGuideClientFilters = (
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

export const applyGHCOrdering = (out: any[]): any[] => {
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

export const buildGuideFacets = (
  facetRows: any[] | null,
  isGuidelinesTab: boolean,
  isSpecialTab: boolean,
  domains: string[]
) => {
  let filteredFacetRows = facetRows;
  if (isGuidelinesTab) {
    filteredFacetRows = (facetRows || []).filter((r: any) => {
      const domain = (r.domain || '').toLowerCase().trim();
      const guide_type = (r.guide_type || '').toLowerCase().trim();
      return !domain.includes('strategy') && !guide_type.includes('strategy') &&
             !domain.includes('blueprint') && !guide_type.includes('blueprint') &&
             !domain.includes('testimonial') && !guide_type.includes('testimonial');
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

export const mapGuideRow = (r: any): any => {
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

export type ClientSideFilterFlags = {
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

export const computeNeedsClientSideFiltering = (flags: ClientSideFilterFlags): boolean => {
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

export const applyGenericSearch = (items: any[], searchQuery: string): any[] => {
  if (!searchQuery) return items;
  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    [item.title, item.description, item.category, item.provider?.name, ...(item.tags || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(query)
  );
};

export const PROVIDER_MAP: Record<string, string[]> = {
  it_support: ['it support', 'itsupport'], hr: ['hr'],
  finance: ['finance'], admin: ['admin', 'administrative'],
};

export const matchesProvider = (item: any, providers: string[]): boolean => {
  const itemProvider = (item.provider?.name || '').toLowerCase();
  return providers.some(fp => {
    const possible = PROVIDER_MAP[fp.toLowerCase()] || [fp.toLowerCase()];
    return possible.some(n => itemProvider === n || itemProvider.includes(n) || n.includes(itemProvider));
  });
};

export const normLoc = (loc: string): string =>
  ({ dubai: 'Dubai', nairobi: 'Nairobi', riyadh: 'Riyadh' }[loc.toLowerCase()] || loc);

export const matchesLocation = (item: any, locations: string[]): boolean => {
  const itemLoc = item.location || '';
  return locations.some(fl => {
    const nl = normLoc(fl);
    return itemLoc === nl || itemLoc.toLowerCase().includes(nl.toLowerCase()) || nl.toLowerCase().includes(itemLoc.toLowerCase());
  });
};

export type GuidesTabFlags = {
  isStrategyTab: boolean;
  isTestimonialsTab: boolean;
  isGuidelinesTab: boolean;
  isSpecialTab: boolean;
};

export type GuidesQueryParams = {
  statuses: string[];
  qStr: string;
  domains: string[];
  subDomains: string[];
  effectiveGuideTypes: string[];
  sort: string;
};

export const applyGuidesStatusFilter = (q: any, statuses: string[], isStrategyTab: boolean): any => {
  if (statuses.length) return q.in('status', statuses);
  if (isStrategyTab) return q.in('status', ['Approved', 'Published', 'Draft']);
  return q.eq('status', 'Approved');
};

export const applyGuidesDomainFilter = (q: any, domains: string[], isStrategyTab: boolean, isTestimonialsTab: boolean, isGuidelinesTab: boolean): any => {
  if (isStrategyTab) return q.or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%');
  if (isTestimonialsTab) return q.or('domain.ilike.%Testimonial%,guide_type.ilike.%Testimonial%');
  if (isGuidelinesTab) {
    if (domains.length) return q.in('domain', domains);
    return q;
  }
  if (domains.length) return q.in('domain', domains);
  return q;
};

export const applyGuidesQueryFilters = (
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

export const computeAllowedSubDomains = (domains: string[], rawSubs: string[], isSpecialTab: boolean): string[] => {
  if (isSpecialTab) return [];
  const allowed = new Set<string>();
  domains.forEach(d => (SUBDOMAIN_BY_DOMAIN[d] || []).forEach(s => allowed.add(s)));
  return allowed.size ? rawSubs.filter(v => allowed.has(v)) : rawSubs;
};

export const applyFacetQueryFilters = (
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

export const sortGuideResults = (out: any[], sort: string): any[] => {
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

export const normDeliveryMode = (s: string): string => {
  const c = s.replaceAll(/[\s-]/g, '');
  return c === 'inperson' || c.includes('person') ? 'inperson' : c;
};

export const applyDeliveryModeFilter = (result: any[], deliveryModes: string[]): any[] =>
  result.filter(item => deliveryModes.some(fm => normDeliveryMode(item.deliveryMode || '') === normDeliveryMode(fm)));

export const normServiceType = (s: string): string => s.replaceAll(/[\s-]/g, '').toLowerCase();

export const applyServiceTypeFilter = (result: any[], serviceTypes: string[]): any[] =>
  result.filter(item => serviceTypes.some(ft => normServiceType(item.serviceType || '') === normServiceType(ft)));

export type ArrayFilterSpec = {
  readonly key: string;
  readonly field: string;
  readonly normalizer?: (s: string) => string;
};

export const SERVICES_CENTER_ARRAY_FILTERS: readonly ArrayFilterSpec[] = [
  { key: 'userCategory',      field: 'userCategory' },
  { key: 'technicalCategory', field: 'technicalCategory', normalizer: normalizeForCompare },
  { key: 'deviceOwnership',   field: 'deviceOwnership',   normalizer: normalizeForCompare },
  { key: 'documentType',      field: 'documentType' },
  { key: 'serviceDomains',    field: 'serviceDomains',    normalizer: normalizeForCompare },
  { key: 'aiMaturityLevel',   field: 'aiMaturityLevel',   normalizer: normalizeForCompare },
  { key: 'toolCategory',      field: 'toolCategory',      normalizer: normalizeForCompare },
];

export const applyArrayFiltersFromSpecs = (
  result: any[],
  filters: Record<string, string | string[]>,
  specs: readonly ArrayFilterSpec[]
): any[] => {
  let out = result;
  for (const spec of specs) {
    const vals = toFilterArr(filters[spec.key]);
    if (vals.length) {
      out = out.filter(it => matchesArrayFilter(it[spec.field], vals, spec.normalizer));
    }
  }
  return out;
};

export const applyServicesFilter = (result: any[], filters: Record<string, string | string[]>): any[] => {
  const vals = toFilterArr(filters.services);
  if (!vals.length) return result;
  return result.filter(item => matchesArrayFilter(item.services, vals, s => s.toLowerCase().replaceAll(/[\s_]/g, '')));
};

export const applyServicesCenterFilters = (
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

export const getTabCleanupKeys = (tab: string): string[] => {
  if (tab === 'strategy') return ['guide_type', 'sub_domain', 'domain', 'testimonial_category'];
  if (tab === 'blueprints') return ['guide_type', 'sub_domain', 'domain', 'testimonial_category', 'strategy_type', 'strategy_framework', 'guidelines_category'];
  if (tab === 'testimonials') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'location'];
  if (tab === 'glossary') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category', 'faq_category', 'location'];
  if (tab === 'faqs') return ['guide_type', 'sub_domain', 'unit', 'domain', 'strategy_type', 'strategy_framework', 'guidelines_category', 'blueprint_framework', 'blueprint_sector', 'testimonial_category'];
  return ['strategy_type', 'strategy_framework', 'blueprint_framework', 'blueprint_sector'];
};

export const applyDefaultHeroImage = (out: any[]): any[] => {
  const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80';
  return out.map(it => ({ ...it, heroImageUrl: it.heroImageUrl || defaultImage }));
};

export const computePageTotal = (
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

export const PRODUCT_FILTER_KEYS = ['blueprint_framework', 'blueprint_sector', 'product_type', 'product_stage', 'product_class', 'product_sector'];

export const cleanupTabFilters = (activeTab: string, queryParams: URLSearchParams): URLSearchParams | null => {
  const next = new URLSearchParams(queryParams.toString());
  let changed = false;
  const deleteKey = (key: string) => { if (next.has(key)) { next.delete(key); changed = true; } };

  deleteKey('guidelines_category');
  if (activeTab !== 'faqs') deleteKey('faq_category');
  if (activeTab !== 'blueprints') PRODUCT_FILTER_KEYS.forEach(deleteKey);
  getTabCleanupKeys(activeTab).forEach(deleteKey);

  return changed ? next : null;
};

export const buildTabChangeParams = (
  tab: string,
  currentParams: URLSearchParams
): URLSearchParams => {
  const next = new URLSearchParams(currentParams.toString());
  next.delete('page');
  if (tab === 'guidelines') next.delete('tab');
  else next.set('tab', tab);
  (TAB_FILTER_KEYS_TO_DELETE[tab] || []).forEach(key => next.delete(key));
  if (tab === 'guidelines') next.delete('guidelines_category');
  if (tab !== 'blueprints') BLUEPRINT_PRODUCT_FILTER_KEYS.forEach(key => next.delete(key));
  if (tab === 'faqs') next.delete('faq_category');
  return next;
};

export const parseGuideQueryVars = (queryParams: URLSearchParams) => ({
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

export const runBlueprintsTab = async (
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

export const VALID_GUIDE_TABS = new Set<string>(['strategy', '6xd', 'blueprints', 'testimonials', 'glossary', 'faqs']);
export const VALID_SERVICE_TABS = new Set<string>(['technology', 'business', 'digital_worker', 'prompt_library', 'ai_tools']);

export const parseGuideTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab && VALID_GUIDE_TABS.has(tab) ? tab : 'guidelines';
};

export const parseServiceTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab && VALID_SERVICE_TABS.has(tab) ? tab : 'technology';
};

export const parseDesignSystemTab = (params: URLSearchParams): string => {
  const tab = params.get('tab');
  return tab === 'vds' || tab === 'cds' ? tab : 'cids';
};

export type GuideTabFlags = {
  isStrategyTab: boolean;
  isBlueprintTab: boolean;
  isTestimonialsTab: boolean;
  isGlossaryTab: boolean;
  isFAQsTab: boolean;
  isGuidelinesTab: boolean;
  isSpecialTab: boolean;
};

export const computeGuideTabFlags = (tab: string): GuideTabFlags => {
  const isStrategyTab    = tab === 'strategy';
  const isBlueprintTab   = tab === 'blueprints';
  const isTestimonialsTab = tab === 'testimonials';
  const isGlossaryTab    = tab === 'glossary';
  const isFAQsTab        = tab === 'faqs';
  const isGuidelinesTab  = tab === 'guidelines';
  const isSpecialTab     = isStrategyTab || isBlueprintTab || isTestimonialsTab || isGlossaryTab || isFAQsTab;
  return { isStrategyTab, isBlueprintTab, isTestimonialsTab, isGlossaryTab, isFAQsTab, isGuidelinesTab, isSpecialTab };
};

export type FetchGuideDataResult = {
  rows: any[] | null;
  count: number | null;
  facetRows: any[] | null;
  error: Error | null;
  facetError: Error | null;
};

export const fetchGuideData = async (
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

export type PostFetchParams = {
  mapped: any[];
  flags: GuideTabFlags & { isBlueprintTab: boolean };
  clientFilterParams: Parameters<typeof applyGuideClientFilters>[1];
  sort: string;
  needsClientSideFiltering: boolean;
  from: number;
  pageSize: number;
};

export const applyGuidePostFetch = (params: PostFetchParams & { isGuides: boolean; activeTab: string }): { out: any[]; totalFiltered: number } => {
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

export type FilterConfigSetters = {
  setFilterConfig: (c: FilterConfig[]) => void;
  setFilters: (f: Record<string, string | string[]>) => void;
};

export type FilterConfigContext = {
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

export const loadFilterConfig = async (
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

export const applySubDomainGuard = (
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

export const applyPageOverflowGuard = (
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

export const computeServiceTabSync = (
  currentTab: string | null,
  activeServiceTab: string
): { action: 'set-state'; tab: string } | { action: 'set-url' } | null => {
  const isValidTab = currentTab !== null && VALID_SERVICE_TABS.has(currentTab);
  if (isValidTab && currentTab !== activeServiceTab) return { action: 'set-state', tab: currentTab };
  if (!isValidTab) return { action: 'set-url' };
  return null;
};

export type WorkGuideTab = 'guidelines' | 'strategy' | '6xd' | 'blueprints' | 'testimonials' | 'glossary' | 'faqs';
export type DesignSystemTab = 'cids' | 'vds' | 'cds';

export const TAB_LABELS: Record<WorkGuideTab, string> = {
  strategy: 'GHC',
  guidelines: 'Guidelines',
  '6xd': '6xD',
  blueprints: 'Products',
  testimonials: 'Testimonials',
  glossary: 'Glossary',
  faqs: 'FAQs'
};

export const TAB_DESCRIPTIONS: Record<WorkGuideTab, { description: string; author?: string }> = {
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

export const DESIGN_SYSTEM_TAB_LABELS: Record<DesignSystemTab, string> = {
  cids: 'CI.DS',
  vds: 'V.DS',
  cds: 'CDS'
};

export const DESIGN_SYSTEM_TAB_DESCRIPTIONS: Record<DesignSystemTab, { description: string; author?: string }> = {
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

export const SERVICE_CENTER_TAB_INFO: Record<string, { label: string; description: string; author: string; order: number }> = {
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

export const computeUrlBasedFilters = (isCourses: boolean, courseFacets: any): Record<string, string[]> => {
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

export const filterLmsItemsBySearch = (isCourses: boolean, searchQuery: string, lmsFilteredItems: any[]): any[] => {
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

export const handleNewjoinerTrackParams = (searchParams: URLSearchParams): URLSearchParams | null => {
  const track = searchParams.get('track');
  if (track !== 'newjoiner') return null;
  const newParams = new URLSearchParams(searchParams);
  let changed = false;
  if (!newParams.get('level')) { newParams.set('level', 'L1,L2'); changed = true; }
  if (!newParams.get('category')) { newParams.set('category', 'Day in DQ'); changed = true; }
  return changed ? newParams : null;
};
