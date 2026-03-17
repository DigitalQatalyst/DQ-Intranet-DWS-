export interface ProductMetadata {
  productType: string
  productStage: string
  description: string
  imageUrl: string
}

// Product metadata mapping - maps product titles to their metadata
export const PRODUCT_METADATA: Record<string, ProductMetadata> = {
  'TMaaS': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  },
  'TMaaS - Transformation Management as a Service': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  },
  'DTMP': {
    productType: 'DTMP',
    productStage: 'MVP',
    description: 'A centralized platform that unifies transformation data, processes, and analytics under one governed system.',
    imageUrl: '/images/DTMP.jpg'
  },
  'Digital Transformation Management Platform (DTMP)': {
    productType: 'DTMP',
    productStage: 'MVP',
    description: 'A centralized platform that unifies transformation data, processes, and analytics under one governed system.',
    imageUrl: '/images/DTMP.jpg'
  },
  'DTO4T - Digital Twin of Organization for Transformation': {
    productType: 'DTO4T',
    productStage: 'Pilot',
    description: 'An AI-driven digital twin that accelerates transformation through simulated journeys and blueprinting.',
    imageUrl: '/images/DTO4T.jpg'
  },
  'DTO4T': {
    productType: 'DTO4T',
    productStage: 'Pilot',
    description: 'An AI-driven digital twin that accelerates transformation through simulated journeys and blueprinting.',
    imageUrl: '/images/DTO4T.jpg'
  },
  'DTMA - Digital Transformation Management Academy': {
    productType: 'DTMA',
    productStage: 'Live',
    description: 'An academy that upskills teams with tailored training, certifications, and AI-enabled learning paths.',
    imageUrl: '/images/DTMA.jpg'
  },
  'DTMA': {
    productType: 'DTMA',
    productStage: 'Live',
    description: 'An academy that upskills teams with tailored training, certifications, and AI-enabled learning paths.',
    imageUrl: '/images/DTMA.jpg'
  },
  'D2GPRC - Data-Driven Governance, Performance, Risk, and Compliance': {
    productType: 'D2GPRC',
    productStage: 'Pilot',
    description: 'A data and AI-led governance product that unifies performance, risk, and compliance oversight.',
    imageUrl: '/images/guidelines-content.PNG'
  },
  'D2GPRC': {
    productType: 'D2GPRC',
    productStage: 'Pilot',
    description: 'A data and AI-led governance product that unifies performance, risk, and compliance oversight.',
    imageUrl: '/images/guidelines-content.PNG'
  },
  'Transformation Management as a Service': {
    productType: 'TMaaS',
    productStage: 'MVP',
    description: 'A managed service offering that provides continuous transformation leadership, governance, and execution support using DQ platforms and expertise.',
    imageUrl: '/images/tmaas.jpg'
  },
  'DTMB': {
    productType: 'DTMB',
    productStage: 'Preview',
    description: 'Boost kits, playbooks, and reference material for digital transformation management.',
    imageUrl: '/images/DTMB.jpg'
  },
  'DTMI': {
    productType: 'DTMI',
    productStage: 'Preview',
    description: 'A Digital Transformation Management initiative. Detailed description to follow.',
    imageUrl: '/images/DTMI.jpg'
  }
}

/**
 * Get product metadata for a given title
 * Performs case-insensitive matching and handles variations
 */
export function getProductMetadata(title: string | null | undefined): ProductMetadata | null {
  if (!title) return null
  
  const normalizedTitle = title.trim()
  
  // Direct match
  if (PRODUCT_METADATA[normalizedTitle]) {
    return PRODUCT_METADATA[normalizedTitle]
  }
  
  // Case-insensitive match
  const lowerTitle = normalizedTitle.toLowerCase()
  for (const [key, value] of Object.entries(PRODUCT_METADATA)) {
    if (key.toLowerCase() === lowerTitle) {
      return value
    }
  }
  
  // Partial matches for common product names
  if (lowerTitle.includes('dtmp') || lowerTitle.includes('transformation management platform')) {
    return PRODUCT_METADATA['DTMP']
  }
  if (lowerTitle.includes('dto4t') || lowerTitle.includes('digital twin of organization')) {
    return PRODUCT_METADATA['DTO4T']
  }
  if (lowerTitle.includes('dtma') || lowerTitle.includes('transformation management academy')) {
    return PRODUCT_METADATA['DTMA']
  }
  if (lowerTitle.includes('d2gprc') || lowerTitle.includes('governance, performance, risk') || lowerTitle.includes('governance performance risk')) {
    return PRODUCT_METADATA['D2GPRC']
  }
  
  // Partial match for TMaaS variations
  if (lowerTitle.includes('tmaas') || (lowerTitle.includes('transformation management as a service'))) {
    return PRODUCT_METADATA['TMaaS - Transformation Management as a Service']
  }
  
  return null
}
