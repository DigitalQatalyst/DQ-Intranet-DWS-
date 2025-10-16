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
  project?: string; // Add project field
}

export const mockAssetFiles: AssetFile[] = [
  // DT2.0 DESIGN > Govern > ABB
  {
    id: 'dt-design-govern-abb-1',
    name: 'ABB Digital Transformation Strategy',
    description: 'Comprehensive digital transformation strategy document for ABB project implementation.',
    url: '/assets/sample-document.pdf',
    size: 2500000,
    lastModified: '2024-01-15',
    author: 'ABB Strategy Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Govern',
    project: 'ABB'
  },
  {
    id: 'dt-design-govern-abb-2',
    name: 'ABB Governance Framework',
    description: 'Governance framework and compliance guidelines for ABB digital initiatives.',
    url: '#',
    size: 1800000,
    lastModified: '2024-01-20',
    author: 'ABB Governance Team',
    type: 'docx',
    category: 'DT2.0 DESIGN',
    subcategory: 'Govern',
    project: 'ABB'
  },

  // DT2.0 DESIGN > Govern > ADIB
  {
    id: 'dt-design-govern-adib-1',
    name: 'ADIB Digital Banking Blueprint',
    description: 'Digital banking transformation blueprint for ADIB with regulatory compliance.',
    url: '/assets/sample-template.pptx',
    size: 3200000,
    lastModified: '2024-01-18',
    author: 'ADIB Digital Team',
    type: 'pptx',
    category: 'DT2.0 DESIGN',
    subcategory: 'Govern',
    project: 'ADIB'
  },
  {
    id: 'dt-design-govern-adib-2',
    name: 'ADIB Risk Management Framework',
    description: 'Comprehensive risk management framework for ADIB digital transformation.',
    url: '#',
    size: 2100000,
    lastModified: '2024-01-22',
    author: 'ADIB Risk Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Govern',
    project: 'ADIB'
  },

  // DT2.0 DESIGN > Govern > DFSA
  {
    id: 'dt-design-govern-dfsa-1',
    name: 'DFSA Regulatory Compliance Guide',
    description: 'DFSA regulatory compliance guide for financial technology implementations.',
    url: '#',
    size: 2800000,
    lastModified: '2024-01-25',
    author: 'DFSA Compliance Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'Govern',
    project: 'DFSA'
  },

  // DT2.0 DESIGN > BD > Hail & Cotton
  {
    id: 'dt-design-bd-hail-1',
    name: 'Hail & Cotton Business Case',
    description: 'Business case and ROI analysis for Hail & Cotton digital transformation project.',
    url: '/assets/sample-spreadsheet.xlsx',
    size: 1200000,
    lastModified: '2024-01-12',
    author: 'Hail & Cotton BD Team',
    type: 'xlsx',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD',
    project: 'Hail & Cotton'
  },
  {
    id: 'dt-design-bd-hail-2',
    name: 'Hail & Cotton Market Analysis',
    description: 'Market analysis and competitive landscape for Hail & Cotton expansion.',
    url: '#',
    size: 1800000,
    lastModified: '2024-01-16',
    author: 'Hail & Cotton Research Team',
    type: 'pptx',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD',
    project: 'Hail & Cotton'
  },

  // DT2.0 DESIGN > BD > Khalifa Fund
  {
    id: 'dt-design-bd-khalifa-1',
    name: 'Khalifa Fund Investment Strategy',
    description: 'Investment strategy and portfolio management for Khalifa Fund digital initiatives.',
    url: '#',
    size: 2200000,
    lastModified: '2024-01-14',
    author: 'Khalifa Fund Strategy Team',
    type: 'pdf',
    category: 'DT2.0 DESIGN',
    subcategory: 'BD',
    project: 'Khalifa Fund'
  },

  // DT2.0 DESIGN > Delivery > ADIB
  {
    id: 'dt-design-delivery-adib-1',
    name: 'ADIB Project Delivery Plan',
    description: 'Comprehensive project delivery plan for ADIB digital transformation.',
    url: '#',
    size: 1900000,
    lastModified: '2024-01-10',
    author: 'ADIB Delivery Team',
    type: 'docx',
    category: 'DT2.0 DESIGN',
    subcategory: 'Delivery',
    project: 'ADIB'
  },

  // DT2.0 DEPLOY > Govern > DFSA
  {
    id: 'dt-deploy-govern-dfsa-1',
    name: 'DFSA Infrastructure Deployment Guide',
    description: 'Infrastructure deployment guide for DFSA regulatory technology platform.',
    url: '#',
    size: 3500000,
    lastModified: '2024-01-28',
    author: 'DFSA Infrastructure Team',
    type: 'pdf',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Govern',
    project: 'DFSA'
  },
  {
    id: 'dt-deploy-govern-dfsa-2',
    name: 'DFSA Security Architecture',
    description: 'Security architecture and implementation guidelines for DFSA systems.',
    url: '#',
    size: 2900000,
    lastModified: '2024-01-30',
    author: 'DFSA Security Team',
    type: 'pptx',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Govern',
    project: 'DFSA'
  },

  // DT2.0 DEPLOY > BD > Commercials
  {
    id: 'dt-deploy-bd-commercials-1',
    name: 'Commercial Deployment Package',
    description: 'Commercial deployment package with pricing and licensing information.',
    url: '#',
    size: 1600000,
    lastModified: '2024-01-24',
    author: 'Commercial Team',
    type: 'xlsx',
    category: 'DT2.0 DEPLOY',
    subcategory: 'BD',
    project: 'Commercials'
  },

  // DT2.0 DEPLOY > Delivery > DFSA
  {
    id: 'dt-deploy-delivery-dfsa-1',
    name: 'DFSA Production Deployment Runbook',
    description: 'Production deployment runbook for DFSA regulatory systems.',
    url: '#',
    size: 2700000,
    lastModified: '2024-01-26',
    author: 'DFSA Operations Team',
    type: 'docx',
    category: 'DT2.0 DEPLOY',
    subcategory: 'Delivery',
    project: 'DFSA'
  },

  // MARKETING ARTEFACTS > DT2.0 > Marketing Library
  {
    id: 'marketing-dt-library-1',
    name: 'DT2.0 Brand Guidelines',
    description: 'Complete brand guidelines for DT2.0 marketing campaigns.',
    url: '#',
    size: 4200000,
    lastModified: '2024-01-05',
    author: 'Marketing Library Team',
    type: 'pdf',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0',
    project: 'Marketing Library'
  },
  {
    id: 'marketing-dt-library-2',
    name: 'DT2.0 Social Media Kit',
    description: 'Social media assets and templates for DT2.0 campaigns.',
    url: '#',
    size: 15000000,
    lastModified: '2024-01-11',
    author: 'Marketing Library Team',
    type: 'zip',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'DT2.0',
    project: 'Marketing Library'
  },

  // MARKETING ARTEFACTS > Products > DTMA
  {
    id: 'marketing-products-dtma-1',
    name: 'DTMA Product Brochure',
    description: 'Product brochure and marketing materials for DTMA platform.',
    url: '#',
    size: 3800000,
    lastModified: '2024-01-13',
    author: 'DTMA Marketing Team',
    type: 'pptx',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'Products',
    project: 'DTMA'
  },
  {
    id: 'marketing-products-dtma-2',
    name: 'DTMA Case Studies',
    description: 'Customer case studies and success stories for DTMA implementation.',
    url: '#',
    size: 2400000,
    lastModified: '2024-01-17',
    author: 'DTMA Success Team',
    type: 'pdf',
    category: 'MARKETING ARTEFACTS',
    subcategory: 'Products',
    project: 'DTMA'
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