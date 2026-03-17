// Mock data for Asset Library files - Blueprint style
export interface AssetFile {
  id: string;
  name: string;
  description: string;
  url?: string;
  size?: number;
  lastModified: string;
  author?: string;
  type: 'pdf' | 'docx' | 'pptx' | 'png' | 'jpg' | 'svg' | 'zip' | 'xlsx';
  category: string;
  subcategory: string;
}

export const mockAssetFiles: AssetFile[] = [
  // DT2.0 DESIGN > Deploy files
  {
    id: 'dt-deploy-1',
    name: 'DT2.0 Deployment Architecture',
    description: 'Comprehensive deployment architecture and infrastructure patterns for DT2.0 platform implementation.',
    url: '/assets/sample-document.pdf',
    size: 2500000,
    lastModified: '2024-01-15',
    author: 'Infrastructure Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Deploy'
  },
  {
    id: 'dt-deploy-2',
    name: 'Cloud Infrastructure Templates',
    description: 'Ready-to-use cloud infrastructure templates and configuration files for rapid deployment.',
    url: '#',
    size: 15000000,
    lastModified: '2024-01-20',
    author: 'DevOps Team',
    type: 'zip',
    category: 'DT2.0 DESIGN',
    subcategory: 'Deploy'
  },
  {
    id: 'dt-deploy-3',
    name: 'Deployment Runbook Template',
    description: 'Standardized runbook template for deployment procedures and rollback strategies.',
    url: '/assets/sample-template.pptx',
    size: 5200000,
    lastModified: '2024-01-18',
    author: 'Operations Team',
    type: 'pptx',
    category: 'DT2.0 DESIGN',
    subcategory: 'Deploy'
  },
  {
    id: 'dt-deploy-4',
    name: 'Environment Configuration Guide',
    description: 'Detailed guide for configuring development, staging, and production environments.',
    url: '#',
    size: 3100000,
    lastModified: '2024-01-22',
    author: 'Platform Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Deploy'
  },

  // DT2.0 DESIGN > BD files
  {
    id: 'dt-bd-1',
    name: 'Business Case Template',
    description: 'Comprehensive business case template with ROI calculations and risk assessments.',
    url: '#',
    size: 850000,
    lastModified: '2024-01-10',
    author: 'Business Development Team',
    type: 'docx',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD'
  },
  {
    id: 'dt-bd-2',
    name: 'ROI Calculator',
    description: 'Advanced ROI calculator with scenario modeling and financial projections.',
    url: '/assets/sample-spreadsheet.xlsx',
    size: 1200000,
    lastModified: '2024-01-25',
    author: 'Financial Analysis Team',
    type: 'xlsx',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD'
  },
  {
    id: 'dt-bd-3',
    name: 'Client Presentation Template',
    description: 'Professional presentation template for client proposals and project pitches.',
    url: '#',
    size: 8500000,
    lastModified: '2024-01-12',
    author: 'Sales Team',
    type: 'pptx',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD'
  },

  // DT2.0 DESIGN > Delivery files
  {
    id: 'dt-delivery-1',
    name: 'Project Kickoff Checklist',
    description: 'Comprehensive checklist for project initiation and stakeholder alignment.',
    url: '#',
    size: 650000,
    lastModified: '2024-01-08',
    author: 'Project Management Office',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Delivery'
  },
  {
    id: 'dt-delivery-2',
    name: 'Sprint Planning Template',
    description: 'Agile sprint planning template with capacity planning and story estimation.',
    url: '#',
    size: 950000,
    lastModified: '2024-01-30',
    author: 'Agile Coaching Team',
    type: 'xlsx',
    category: 'DT2.0 DESIGN',
    subcategory: 'Delivery'
  },

  // DT2.0 DEPLOY > Deploy files
  {
    id: 'deploy-deploy-1',
    name: 'Infrastructure Deployment Guide',
    description: 'Step-by-step guide for deploying infrastructure components and monitoring setup.',
    url: '#',
    size: 4200000,
    lastModified: '2024-01-14',
    author: 'Infrastructure Team',
    type: 'pdf',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Deploy'
  },
  {
    id: 'deploy-deploy-2',
    name: 'Cloud Architecture Diagrams',
    description: 'Comprehensive collection of cloud architecture diagrams and network topologies.',
    url: '#',
    size: 12000000,
    lastModified: '2024-01-28',
    author: 'Solution Architects',
    type: 'zip',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Deploy'
  },

  // DT2.0 DEPLOY > BD files
  {
    id: 'deploy-bd-1',
    name: 'Deployment Cost Analysis',
    description: 'Detailed cost analysis for deployment scenarios with optimization recommendations.',
    url: '#',
    size: 1800000,
    lastModified: '2024-01-16',
    author: 'Cost Optimization Team',
    type: 'xlsx',
    category: 'DT2.0 DEPLOY',
    subcategory: 'BD'
  },

  // DT2.0 DEPLOY > Delivery files
  {
    id: 'deploy-delivery-1',
    name: 'Production Deployment Runbook',
    description: 'Production-ready deployment runbook with rollback procedures and monitoring.',
    url: '#',
    size: 2200000,
    lastModified: '2024-01-26',
    author: 'Release Management Team',
    type: 'docx',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Delivery'
  },
  {
    id: 'deploy-delivery-2',
    name: 'Environment Setup Scripts',
    description: 'Automated scripts for environment provisioning and configuration management.',
    url: '#',
    size: 5500000,
    lastModified: '2024-01-24',
    author: 'Automation Team',
    type: 'zip',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Delivery'
  },

  // MARKETING ARTEFACTS > DT2.0 files
  {
    id: 'marketing-dt-1',
    name: 'DT2.0 Brand Guidelines',
    description: 'Complete brand guidelines including logo usage, color palettes, and typography standards.',
    url: '#',
    size: 8900000,
    lastModified: '2024-01-05',
    author: 'Brand Team',
    type: 'pdf',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0'
  },
  {
    id: 'marketing-dt-2',
    name: 'DT2.0 Logo Pack',
    description: 'Comprehensive logo pack with various formats and usage variations.',
    url: '#',
    size: 15000000,
    lastModified: '2024-01-11',
    author: 'Creative Team',
    type: 'zip',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0'
  },
  {
    id: 'marketing-dt-3',
    name: 'DT2.0 Presentation Template',
    description: 'Professional presentation template aligned with DT2.0 brand guidelines.',
    url: '#',
    size: 12500000,
    lastModified: '2024-01-19',
    author: 'Design Team',
    type: 'pptx',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0'
  },
  {
    id: 'marketing-dt-4',
    name: 'DT2.0 Social Media Assets',
    description: 'Complete social media asset pack with templates for various platforms.',
    url: '#',
    size: 25000000,
    lastModified: '2024-01-21',
    author: 'Social Media Team',
    type: 'zip',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0'
  },

  // MARKETING ARTEFACTS > Products files
  {
    id: 'marketing-products-1',
    name: 'Product Brochure Template',
    description: 'Professional brochure template for product marketing and sales materials.',
    url: '#',
    size: 6800000,
    lastModified: '2024-01-13',
    author: 'Product Marketing Team',
    type: 'pptx',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'Products'
  },
  {
    id: 'marketing-products-2',
    name: 'Product Photography Guidelines',
    description: 'Comprehensive guidelines for product photography and visual standards.',
    url: '#',
    size: 3200000,
    lastModified: '2024-01-17',
    author: 'Visual Content Team',
    type: 'pdf',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'Products'
  },
  {
    id: 'marketing-products-3',
    name: 'Product Launch Checklist',
    description: 'Complete checklist for product launch activities and marketing campaigns.',
    url: '#',
    size: 750000,
    lastModified: '2024-01-29',
    author: 'Product Launch Team',
    type: 'docx',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'Products'
  }
];

export function getFilesByCategory(category: string | null, subcategory: string | null): AssetFile[] {
  // Return all files if both parameters are null
  if (!category && !subcategory) {
    return mockAssetFiles;
  }
  
  if (!category || !subcategory) return [];
  
  // Handle the new hierarchical structure
  if (subcategory === 'files') {
    if (category === 'all') {
      return mockAssetFiles;
    }
    
    // Generate mock files based on the category path
    const pathParts = category.split('-');
    const fileCount = Math.floor(Math.random() * 6) + 3; // 3-8 files
    
    const mockFiles: AssetFile[] = [];
    for (let i = 1; i <= fileCount; i++) {
      mockFiles.push({
        id: `${category}-file-${i}`,
        name: `${pathParts[pathParts.length - 1]} Document ${i}.pdf`,
        description: `Important document ${i} for ${pathParts[pathParts.length - 1]} operations and procedures.`,
        url: '/assets/sample-document.pdf',
        size: Math.floor(Math.random() * 5000000) + 500000,
        lastModified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        author: `${pathParts[pathParts.length - 1]} Team`,
        type: ['pdf', 'docx', 'pptx', 'xlsx'][Math.floor(Math.random() * 4)] as any,
        category: pathParts[0] || 'General',
        subcategory: pathParts[1] || 'Files'
      });
    }
    return mockFiles;
  }
  
  return mockAssetFiles.filter(file => 
    file.category === category && file.subcategory === subcategory
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(type: string): string {
  const iconMap: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    pptx: '📊',
    xlsx: '📈',
    png: '🖼️',
    jpg: '🖼️',
    svg: '🎨',
    zip: '📦'
  };
  return iconMap[type] || '📄';
}