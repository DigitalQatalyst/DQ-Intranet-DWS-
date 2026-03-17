// Static design system data for the Design System Marketplace

export interface DesignSystemItem {
  id: string
  title: string
  description: string
  type: 'cids' | 'vds' | 'cds'
  imageUrl: string
  location?: string
  tags?: string[]
  category?: string // For filtering: 'cids-framework', 'cids-lifecycle', 'cids-template'
}

export const DESIGN_SYSTEM_ITEMS: DesignSystemItem[] = [
  {
    id: 'cids-introduction',
    title: 'CI.DS Framework',
    description: 'CI.DS is DQ\'s intelligent system for turning ideas into consistent, high-impact content at scale.',
    type: 'cids',
    imageUrl: '/images/cids.PNG',
    tags: ['CI.DS'],
    category: 'cids-framework',
    location: 'DXB'
  },
  {
    id: 'vds-framework',
    title: 'V.DS Framework',
    description: 'V.DS defines DQ\'s cinematic system for creating strategic, scalable, high-impact video content.',
    type: 'vds',
    imageUrl: '/images/vds.png',
    tags: ['V.DS'],
    category: 'vds-framework',
    location: 'KSA'
  },
  {
    id: 'cds-campaigns-design-system',
    title: 'CDS Framework',
    description: 'CDS defines DQ\'s unified operating system for designing strategic, scalable, high-impact marketing campaigns.',
    type: 'cds',
    imageUrl: '/images/cds.png',
    tags: ['CDS'],
    category: 'cds-framework',
    location: 'NBO'
  }
]

export function getDesignSystemItemsByType(type: 'cids' | 'vds' | 'cds'): DesignSystemItem[] {
  return DESIGN_SYSTEM_ITEMS.filter(item => item.type === type)
}

export function getAllDesignSystemItems(): DesignSystemItem[] {
  return DESIGN_SYSTEM_ITEMS
}

export function getDesignSystemItemById(id: string): DesignSystemItem | undefined {
  return DESIGN_SYSTEM_ITEMS.find(item => item.id === id)
}
