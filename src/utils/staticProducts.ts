// Static product data for the Products tab
// These products are always displayed in the Products marketplace tab

export interface StaticProduct {
  id: string
  title: string
  summary: string
  domain: string
  guideType: string
  heroImageUrl: string | null
  lastUpdatedAt: string
  authorName: string | null
  authorOrg: string | null
  isEditorsPick: boolean
  downloadCount: number
  status: string
  slug: string
  // Product-specific metadata
  productType: string
  productStage: string
  productClass: string // Class 01, Class 02, or Class 03
}

export const STATIC_PRODUCTS: StaticProduct[] = [
  // Class 02: DT 2.0
  {
    id: 'static-product-dtmp',
    title: 'DTMP',
    summary: 'End-to-end DBP specification and orchestration platform accelerating strategy, design, deployment, and adoption across the organisation.',
    domain: 'Product',
    guideType: 'Specification & Orchestration Platform',
    heroImageUrl: '/assets/images/products/DTMP.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmp',
    productType: 'DTMP',
    productStage: 'Coming Soon',
    productClass: 'class-02'
  },
  {
    id: 'static-product-tmaas',
    title: 'TMaaS',
    summary: 'Marketplace-driven managed transformation enabling scalable Transformation-as-a-Service across sectors.',
    domain: 'Product',
    guideType: 'Transformation as a Service',
    heroImageUrl: '/assets/images/products/TMaaS.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'tmaas',
    productType: 'TMaaS',
    productStage: 'Coming Soon',
    productClass: 'class-02'
  },
  {
    id: 'static-product-dto4t',
    title: 'DTO4T / TwinGM AI',
    summary: 'AI-guided digital twin platform reinforcing precision transformation and continuous execution discipline.',
    domain: 'Product',
    guideType: 'AI-Guided Transformation',
    heroImageUrl: '/assets/images/products/DTO4T.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dto4t-twingm-ai',
    productType: 'DTO4T',
    productStage: 'Coming Soon',
    productClass: 'class-02'
  },
  // Class 03: DCO
  {
    id: 'static-product-dtmi',
    title: 'DTMI',
    summary: 'Global digital transformation insights structured by 6xD and sector lenses.',
    domain: 'Product',
    guideType: 'Digital Transformation Market Insights',
    heroImageUrl: '/assets/images/products/DTMI.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: false,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmi',
    productType: 'DTMI',
    productStage: 'Coming Soon',
    productClass: 'class-03'
  },
  {
    id: 'static-product-dtma',
    title: 'DTMA',
    summary: 'Digital Transformation Academy building competencies required to operate in Digital Cognitive Organisations.',
    domain: 'Product',
    guideType: 'Digital Transformation Academy',
    heroImageUrl: '/assets/images/products/DTMA.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtma',
    productType: 'DTMA',
    productStage: 'Coming Soon',
    productClass: 'class-03'
  },
  {
    id: 'static-product-dtmb',
    title: 'DTMB (6xD / GHC Series)',
    summary: 'Published intellectual foundation codifying DQ\'s transformation frameworks and execution discipline.',
    domain: 'Product',
    guideType: 'Published Intellectual Foundation',
    heroImageUrl: '/assets/images/products/DTMB.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: false,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmb',
    productType: 'DTMB',
    productStage: 'Coming Soon',
    productClass: 'class-03'
  }
]
