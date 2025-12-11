import * as React from 'react';
import { ReactNode } from 'react';
import { DollarSign, Calendar, Clock, Users, MapPin, CheckCircle, BarChart, Award, FileText, Info, BookOpen, ClipboardList, Building, FileType, Bookmark, TrendingUp, Compass, Layers } from 'lucide-react';
import { mockCourses, providers, mockOnboardingFlowsData } from './mockData';
import { mockFinancialServices, mockNonFinancialServices, mockKnowledgeHubItems, mockKnowledgeHubFilterOptions } from './mockMarketplaceData';
// Define a Tab type for consistency across marketplace pages
export interface MarketplaceTab {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
// Configuration type definitions
export interface AttributeConfig {
  key: string;
  label: string;
  icon: ReactNode;
  formatter?: (value: any) => string;
}
export interface TabConfig {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
export interface FilterCategoryConfig {
  id: string;
  title: string;
  options: {
    id: string;
    name: string;
  }[];
}
export interface MarketplaceConfig {
  id: string;
  title: string;
  description: string;
  route: string;
  primaryCTA: string;
  secondaryCTA: string;
  itemName: string;
  itemNamePlural: string;
  attributes: AttributeConfig[];
  detailSections: string[];
  tabs: TabConfig[];
  summarySticky?: boolean;
  filterCategories: FilterCategoryConfig[];
  // New fields for GraphQL integration
  mapListResponse?: (data: any[]) => any[];
  mapDetailResponse?: (data: any) => any;
  mapFilterResponse?: (data: any) => FilterCategoryConfig[];
  // Mock data for fallback and schema reference
  mockData?: {
    items: any[];
    filterOptions: any;
    providers: any[];
  };
}
// Mock data for financial services
export const mockFinancialServicesData = {
  items: mockFinancialServices,
  filterOptions: {
    categories: [{
      id: 'loans',
      name: 'Loans'
    }, {
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'insurance',
      name: 'Insurance'
    }, {
      id: 'creditcard',
      name: 'Credit Card'
    }]
  },
  providers: providers
};

// Mock data for Service Center (non-financial services)
export const mockNonFinancialServicesData = {
  items: mockNonFinancialServices,
  filterOptions: {
    categories: [{
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'business',
      name: 'Employee Services'
    }, {
      id: 'digital_worker',
      name: 'Digital Worker'
    }, {
      id: 'prompt_library',
      name: 'Prompt Library'
    }, {
      id: 'ai_tools',
      name: 'AI Tools'
    }],
    serviceTypes: [{
      id: 'query',
      name: 'Query'
    }, {
      id: 'support',
      name: 'Support'
    }, {
      id: 'requisition',
      name: 'Requisition'
    }, {
      id: 'self-service',
      name: 'Self-Service'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }]
  },
  providers: [] // Not used in Service Center, but required by type definition
};

// Mock data for courses
export const mockCoursesData = {
  items: mockCourses,
  filterOptions: {
    categories: [{
      id: 'ghc',
      name: 'GHC'
    }, {
      id: 'digital',
      name: 'Digital'
    }, {
      id: 'hov',
      name: 'HoV'
    }, {
      id: 'keytools',
      name: 'Key Tools'
    }]
  },
  providers: providers
};

// Mock data for Knowledge Hub
export const mockKnowledgeHubData = {
  items: mockKnowledgeHubItems,
  filterOptions: mockKnowledgeHubFilterOptions,
  providers: providers
};

// Define marketplace configurations

// Define Knowledge Hub (Guides) base config once, then reuse for alias
const knowledgeHubBaseConfig: MarketplaceConfig = {
  id: 'knowledge-hub',
  title: 'Guides Marketplace',
  description: 'Discover valuable resources, news, events, and tools to support your business journey in Abu Dhabi',
  route: '/marketplace/guides',
  primaryCTA: 'Access Now',
  secondaryCTA: 'View Details',
  itemName: 'Resource',
  itemNamePlural: 'Resources',
  attributes: [{
    key: 'mediaType',
    label: 'Type',
    icon: React.createElement(FileType, { size: 18, className: "mr-2" })
  }, {
    key: 'domain',
    label: 'Domain',
    icon: React.createElement(Bookmark, { size: 18, className: "mr-2" })
  }, {
    key: 'businessStage',
    label: 'Business Stage',
    icon: React.createElement(TrendingUp, { size: 18, className: "mr-2" })
  }, {
    key: 'date',
    label: 'Published',
    icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
  }],
  detailSections: ['description', 'content', 'provider', 'related'],
  tabs: [{
    id: 'about',
    label: 'About This Resource',
    icon: Info,
    iconBgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  }, {
    id: 'content',
    label: 'Content',
    icon: FileText,
    iconBgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  }, {
    id: 'provider',
    label: 'About Provider',
    icon: Building,
    iconBgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  }],
  summarySticky: true,
  filterCategories: [{
    id: 'mediaType',
    title: 'Media Type',
    options: [{ id: 'news', name: 'News' }, { id: 'reports', name: 'Reports' }, { id: 'toolkits', name: 'Toolkits & Templates' }, { id: 'guides', name: 'Guides' }, { id: 'events', name: 'Events' }, { id: 'videos', name: 'Videos' }, { id: 'podcasts', name: 'Podcasts' }]
  }, {
    id: 'businessStage',
    title: 'Business Stage',
    options: [{ id: 'idea', name: 'Idea Stage' }, { id: 'startup', name: 'Startup' }, { id: 'growth', name: 'Growth' }, { id: 'scaleup', name: 'Scale-up' }, { id: 'established', name: 'Established' }]
  }, {
    id: 'domain',
    title: 'Domain',
    options: [{ id: 'finance', name: 'Finance & Funding' }, { id: 'marketing', name: 'Marketing & Sales' }, { id: 'technology', name: 'Technology & Innovation' }, { id: 'operations', name: 'Operations & Productivity' }, { id: 'legal', name: 'Legal & Compliance' }, { id: 'strategy', name: 'Strategy & Growth' }]
  }, {
    id: 'format',
    title: 'Format',
    options: [{ id: 'quickreads', name: 'Quick Reads' }, { id: 'indepth', name: 'In-Depth Reports' }, { id: 'interactive', name: 'Interactive Tools' }, { id: 'templates', name: 'Downloadable Templates' }, { id: 'recorded', name: 'Recorded Media' }, { id: 'live', name: 'Live Events' }]
  }, {
    id: 'popularity',
    title: 'Popularity',
    options: [{ id: 'latest', name: 'Latest' }, { id: 'trending', name: 'Trending' }, { id: 'downloaded', name: 'Most Downloaded' }, { id: 'editors', name: "Editor's Pick" }]
  }],
  mapListResponse: data => {
    return data.map((item: any) => ({
      ...item,
      tags: item.tags || [item.mediaType, item.domain].filter(Boolean)
    }));
  },
  mapDetailResponse: data => {
    return {
      ...data,
      highlights: data.highlights || []
    };
  },
  mapFilterResponse: data => {
    return [{ id: 'mediaType', title: 'Media Type', options: data.mediaTypes || [] }, { id: 'businessStage', title: 'Business Stage', options: data.businessStages || [] }, { id: 'domain', title: 'Domain', options: data.domains || [] }, { id: 'format', title: 'Format', options: data.formats || [] }, { id: 'popularity', title: 'Popularity', options: data.popularity || [] }];
  },
  mockData: mockKnowledgeHubData
};

export const marketplaceConfig: Record<string, MarketplaceConfig> = {
  onboarding: {
    id: 'onboarding',
    title: 'Onboarding Flows',
    description: 'Discover guided flows to get productive fast in the Digital Workspace.',
    route: '/onboarding',
    primaryCTA: 'Start Flow',
    secondaryCTA: 'View Details',
    itemName: 'Onboarding Flow',
    itemNamePlural: 'Onboarding Flows',
    attributes: [{
      key: 'duration',
      label: 'Time to Complete',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'deliveryMode',
      label: 'Format',
      icon: React.createElement(FileType, { size: 18, className: "mr-2" })
    }, {
      key: 'businessStage',
      label: 'Role',
      icon: React.createElement(Users, { size: 18, className: "mr-2" })
    }, {
      key: 'category',
      label: 'Journey Phase',
      icon: React.createElement(Compass, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'steps', 'resources', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Flow',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'steps',
      label: 'Steps',
      icon: ClipboardList,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'resources',
      label: 'Resources',
      icon: BookOpen,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'journeyPhase',
      title: 'Journey Phase',
      options: [{
        id: 'discover',
        name: 'Discover'
      }, {
        id: 'explore',
        name: 'Explore'
      }, {
        id: 'set-up',
        name: 'Set Up'
      }, {
        id: 'connect',
        name: 'Connect'
      }, {
        id: 'grow',
        name: 'Grow'
      }]
    }, {
      id: 'role',
      title: 'Role',
      options: [{
        id: 'general',
        name: 'General'
      }, {
        id: 'engineering',
        name: 'Engineering'
      }, {
        id: 'product',
        name: 'Product'
      }, {
        id: 'design',
        name: 'Design'
      }, {
        id: 'marketing',
        name: 'Marketing'
      }, {
        id: 'operations',
        name: 'Operations'
      }]
    }, {
      id: 'timeToComplete',
      title: 'Time to Complete',
      options: [{
        id: 'lt-15',
        name: '<15m'
      }, {
        id: '15-30',
        name: '15–30m'
      }, {
        id: '30-60',
        name: '30–60m'
      }, {
        id: 'gt-60',
        name: '>60m'
      }]
    }, {
      id: 'format',
      title: 'Format',
      options: [{
        id: 'checklist',
        name: 'Checklist'
      }, {
        id: 'interactive',
        name: 'Interactive'
      }, {
        id: 'video',
        name: 'Video'
      }, {
        id: 'guide',
        name: 'Guide'
      }]
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: [{
        id: 'most-used',
        name: 'Most used'
      }, {
        id: 'new',
        name: 'New'
      }]
    }],
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        tags: item.tags || [item.category || item.journeyPhase, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => ({
      ...data,
      highlights: data.highlights || data.learningOutcomes || []
    }),
    mapFilterResponse: data => [{
      id: 'journeyPhase',
      title: 'Journey Phase',
      options: data.journeyPhase || []
    }, {
      id: 'role',
      title: 'Role',
      options: data.roles || []
    }, {
      id: 'timeToComplete',
      title: 'Time to Complete',
      options: data.timeToComplete || []
    }, {
      id: 'format',
      title: 'Format',
      options: data.formats || []
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: data.popularity || []
    }],
    mockData: mockOnboardingFlowsData
  },
  courses: {
    id: 'courses',
    title: 'DQ LMS Course Marketplace',
    description: 'Discover focused, practical courses to help you work smarter at DQ.',
    route: '/marketplace/courses',
    primaryCTA: 'Start Learning',
    secondaryCTA: 'View Details',
    itemName: 'LMS Course',
    itemNamePlural: 'LMS Courses',
    attributes: [{
      key: 'duration',
      label: 'Duration',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'startDate',
      label: 'Starts',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'price',
      label: 'Cost',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'location',
      label: 'Location',
      icon: React.createElement(MapPin, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'learningOutcomes', 'schedule', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'learning_outcomes',
      label: 'Learning Outcomes',
      icon: BookOpen,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'department',
      title: 'Department',
      options: [{
        id: 'dco',
        name: 'DCO'
      }, {
        id: 'dbp',
        name: 'DBP'
      }]
    }, {
      id: 'location',
      title: 'Location/Studio',
      options: [{
        id: 'Dubai',
        name: 'Dubai'
      }, {
        id: 'Nairobi',
        name: 'Nairobi'
      }, {
        id: 'Riyadh',
        name: 'Riyadh'
      }, {
        id: 'Remote',
        name: 'Remote'
      }]
    }, {
      id: 'audience',
      title: 'Audience',
      options: [{
        id: 'associate',
        name: 'Associate'
      }, {
        id: 'lead',
        name: 'Lead'
      }]
    }, {
      id: 'level',
      title: 'Level',
      options: [{
        id: 'L1',
        name: 'L1 – Starting'
      }, {
        id: 'L2',
        name: 'L2 – Following'
      }, {
        id: 'L3',
        name: 'L3 – Assisting'
      }, {
        id: 'L4',
        name: 'L4 – Applying'
      }, {
        id: 'L5',
        name: 'L5 – Enabling'
      }, {
        id: 'L6',
        name: 'L6 – Ensuring'
      }, {
        id: 'L7',
        name: 'L7 – Influencing'
      }, {
        id: 'L8',
        name: 'L8 – Inspiring'
      }]
    }, {
      id: 'status',
      title: 'Status',
      options: [{
        id: 'live',
        name: 'Live'
      }, {
        id: 'coming-soon',
        name: 'Coming Soon'
      }]
    }, {
      id: 'courseCategory',
      title: 'Course Category',
      options: [{
        id: 'ghc',
        name: 'GHC'
      }, {
        id: '6xd',
        name: '6xD'
      }, {
        id: 'dws',
        name: 'DWS'
      }, {
        id: 'dxp',
        name: 'DXP'
      }, {
        id: 'day-in-dq',
        name: 'Day in DQ'
      }, {
        id: 'key-tools',
        name: 'Key Tools'
      }]
    }, {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'video',
        name: 'Video'
      }, {
        id: 'guide',
        name: 'Guide'
      }, {
        id: 'workshop',
        name: 'Workshop'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }, {
        id: 'online',
        name: 'Online'
      }]
    }, {
      id: 'duration',
      title: 'Duration',
      options: [{
        id: 'bite-size',
        name: 'Bite-size'
      }, {
        id: 'short',
        name: 'Short'
      }, {
        id: 'medium',
        name: 'Medium'
      }, {
        id: 'long',
        name: 'Long'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.learningOutcomes || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'courseCategory',
        title: 'Course Category',
        options: data.categories || []
      }, {
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }, {
        id: 'duration',
        title: 'Duration',
        options: data.duration || []
      }, {
        id: 'level',
        title: 'Level',
        options: data.levels || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockCoursesData
  },
  financial: {
    id: 'financial',
    title: 'Financial Services Marketplace',
    description: 'Access financial products and services to support your business growth',
    route: '/marketplace/financial',
    primaryCTA: 'Apply Now',
    secondaryCTA: 'View Details',
    itemName: 'Financial Service',
    itemNamePlural: 'Financial Services',
    attributes: [{
      key: 'amount',
      label: 'Amount',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'duration',
      label: 'Repayment Term',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'eligibility',
      label: 'Eligibility',
      icon: React.createElement(CheckCircle, { size: 18, className: "mr-2" })
    }, {
      key: 'interestRate',
      label: 'Interest Rate',
      icon: React.createElement(BarChart, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'eligibility', 'terms', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'eligibility_terms',
      label: 'Eligibility & Terms',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'application_process',
      label: 'Application Process',
      icon: ClipboardList,
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }, {
      id: 'required_documents',
      label: 'Required Documents',
      icon: FileText,
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'category',
      title: 'Service Category',
      options: [{
        id: 'loans',
        name: 'Loans'
      }, {
        id: 'financing',
        name: 'Financing'
      }, {
        id: 'insurance',
        name: 'Insurance'
      }, {
        id: 'creditcard',
        name: 'Credit Card'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockFinancialServicesData
  },
  'non-financial': {
    id: 'non-financial',
    title: 'Services Center',
    description: "Welcome to DigitalQatalyst's Services Center. We're here to ensure your success with dedicated assistance, efficient solutions, comprehensive tools, expert guidance, and both technical and operational support.",
    route: '/marketplace/services-center',
    primaryCTA: 'Request Service',
    secondaryCTA: 'View Details',
    itemName: 'Business Service',
    itemNamePlural: 'Services Center',
    attributes: [{
      key: 'category',
      label: 'Department',
      icon: React.createElement(Building, { size: 18, className: "mr-2" })
    }, {
      key: 'serviceType',
      label: 'Service Type',
      icon: React.createElement(Award, { size: 18, className: "mr-2" })
    }, {
      key: 'deliveryMode',
      label: 'Service Mode',
      icon: React.createElement(Users, { size: 18, className: "mr-2" })
    }, {
      key: 'duration',
      label: 'Duration',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'deliveryDetails', 'provider', 'related'],
    tabs: [
      {
        id: 'submit_request',
        label: 'Submit Request',
        icon: ClipboardList,
        iconBgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        id: 'self_service_faq',
        label: 'FAQ',
        icon: BookOpen,
        iconBgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        id: 'contact_sla',
        label: 'Contacts',
        icon: Info,
        iconBgColor: 'bg-amber-50',
        iconColor: 'text-amber-600'
      }
    ],
    summarySticky: true,
    filterCategories: [{
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'inperson',
        name: 'In person'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }]
    }, {
      id: 'provider',
      title: 'Department',
      options: [{
        id: 'it_support',
        name: 'IT Support'
      }, {
        id: 'hr',
        name: 'HR'
      }, {
        id: 'finance',
        name: 'Finance'
      }, {
        id: 'admin',
        name: 'Admin'
      }]
    }, {
      id: 'category',
      title: 'Service Category',
      options: [{
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'business',
        name: 'Business'
      }, {
        id: 'digital_worker',
        name: 'Digital Worker'
      }, {
        id: 'prompt_library',
        name: 'Prompt Library'
      }, {
        id: 'ai_tools',
        name: 'AI Tools'
      }]
    }, {
      id: 'location',
      title: 'Location',
      options: [{
        id: 'dubai',
        name: 'Dubai'
      }, {
        id: 'nairobi',
        name: 'Nairobi'
      }, {
        id: 'riyadh',
        name: 'Riyadh'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }, {
        id: 'provider',
        title: 'Department',
        options: data.providers || []
      }, {
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }, {
        id: 'location',
        title: 'Location',
        options: data.locations || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockNonFinancialServicesData
  },
  'knowledge-hub': knowledgeHubBaseConfig,
  // Compatibility alias for new Guides marketplace
  guides: {
    ...knowledgeHubBaseConfig,
    id: 'guides',
    route: '/marketplace/guides',
    title: 'DQ Knowledge Center',
    description: 'Access practical guidelines, templates, and processes to support everyday delivery and collaboration.'
  }
};
// Helper to get config by marketplace type
export const getMarketplaceConfig = (type: string): MarketplaceConfig => {
  const config = marketplaceConfig[type];
  if (!config) {
    throw new Error(`No configuration found for marketplace type: ${type}`);
  }
  return config;
};

// Tab-specific filters for Services Center
export const getTabSpecificFilters = (tabId?: string): FilterCategoryConfig[] => {
  const baseFilters: FilterCategoryConfig[] = [
    {
      id: 'serviceType',
      title: 'Service Type',
      options: [
        { id: 'query', name: 'Query' },
        { id: 'support', name: 'Support' },
        { id: 'requisition', name: 'Requisition' },
        { id: 'self-service', name: 'Self-Service' }
      ]
    },
    {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [
        { id: 'online', name: 'Online' },
        { id: 'inperson', name: 'In person' },
        { id: 'hybrid', name: 'Hybrid' }
      ]
    },
    {
      id: 'provider',
      title: 'Department',
      options: [
        { id: 'it_support', name: 'IT Support' },
        { id: 'hr', name: 'HR' },
        { id: 'finance', name: 'Finance' },
        { id: 'admin', name: 'Admin' }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      options: [
        { id: 'dubai', name: 'Dubai' },
        { id: 'nairobi', name: 'Nairobi' },
        { id: 'riyadh', name: 'Riyadh' }
      ]
    }
  ];

  // Tab-specific filters for Technology category
  const technologySpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'userCategory',
      title: 'User Category',
      options: [
        { id: 'employee', name: 'Employee' },
        { id: 'contractor', name: 'Contractor' },
        { id: 'intern', name: 'Intern' },
        { id: 'manager', name: 'Manager' }
      ]
    },
    {
      id: 'technicalCategory',
      title: 'Technical Category',
      options: [
        { id: 'hardware', name: 'Hardware' },
        { id: 'software', name: 'Software' },
        { id: 'network', name: 'Network' }
      ]
    },
    {
      id: 'deviceOwnership',
      title: 'Device Ownership',
      options: [
        { id: 'company_device', name: 'Company Device' },
        { id: 'personal_device', name: 'Personal Device (BYOD)' },
        { id: 'fyod', name: 'FYOD' }
      ]
    }
  ];

  // Tab-specific filters for Business category
  const businessSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'services',
      title: 'Services',
      options: [
        { id: 'human_resources', name: 'Human Resources' },
        { id: 'finance', name: 'Finance' },
        { id: 'procurement', name: 'Procurement' },
        { id: 'administration', name: 'Administration' },
        { id: 'legal', name: 'Legal' },
        { id: 'payroll', name: 'Payroll' }
      ]
    }
  ];

  // Tab-specific filters for Digital Worker category
  const digitalWorkerSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'serviceDomains',
      title: 'Service Domains',
      options: [
        { id: 'backoffice_operations', name: 'Backoffice Operations' },
        { id: 'automation_integration', name: 'Automation & Integration' },
        { id: 'digital_security', name: 'Digital Security' },
        { id: 'digital_channels', name: 'Digital Channels' },
        { id: 'customer_experiences', name: 'Customer Experiences' },
        { id: 'service_delivery', name: 'Service Delivery' },
        { id: 'marketing_comms', name: 'Marketing & Comms' },
        { id: 'digital_workspace', name: 'Digital Workspace' },
        { id: 'design', name: 'Design' },
        { id: 'business_intelligence', name: 'Business Intelligence' },
        { id: 'it_operations', name: 'IT Operations' }
      ]
    },
    {
      id: 'aiMaturityLevel',
      title: 'AI Maturity Level',
      options: [
        { id: 'level_1', name: 'Level 1 (Prompting)' },
        { id: 'level_2', name: 'Level 2 (Integrate Systems)' },
        { id: 'level_3', name: 'Level 3 (Unified Operations)' },
        { id: 'level_4', name: 'Level 4 (Human Oversight)' },
        { id: 'level_5', name: 'Level 5 (Autonomous)' }
      ]
    }
  ];

  // Tab-specific filters for Prompt Library category
  const promptLibrarySpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'promptType',
      title: 'Prompt Type',
      options: [
        { id: 'business', name: 'Business (Admin, HR, Finance, Ops)' },
        { id: 'tech', name: 'Tech (Hardware, Software)' },
        { id: 'dev_prompts', name: 'Dev Prompts (Software Development)' },
        { id: 'devops_prompts', name: 'DevOps Prompts (Deployment)' },
        { id: 'ai', name: 'AI (Machine Learning)' }
      ]
    }
  ];

  // Tab-specific filters for AI Tools category
  const aiToolsSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'toolCategory',
      title: 'Tool Category',
      options: [
        { id: 'llm', name: 'LLM' },
        { id: 'coding_ides', name: 'Coding IDEs' },
        { id: 'low_code_tools', name: 'Low Code Tools' },
        { id: 'content_generators', name: 'Content Generators' }
      ]
    }
  ];

  // Return tab-specific filters based on the tab
  if (tabId === 'technology') {
    return [...baseFilters, ...technologySpecificFilters];
  }
  
  if (tabId === 'business') {
    return [...baseFilters, ...businessSpecificFilters];
  }
  
  if (tabId === 'digital_worker') {
    return [...baseFilters, ...digitalWorkerSpecificFilters];
  }
  
  if (tabId === 'prompt_library') {
    return [...baseFilters, ...promptLibrarySpecificFilters];
  }
  
  if (tabId === 'ai_tools') {
    return [...baseFilters, ...aiToolsSpecificFilters];
  }
  
  return baseFilters;
};

// Removed old tab-specific filters as they're no longer needed with category-based tabs
/*
  const tabFilters: Record<string, FilterCategoryConfig[]> = {
    'query': [
      {
        id: 'priority',
        title: 'Priority',
        options: [
          { id: 'high', name: 'High' },
          { id: 'medium', name: 'Medium' },
          { id: 'low', name: 'Low' }
        ]
      },
      {
        id: 'responseTime',
        title: 'Response Time',
        options: [
          { id: 'immediate', name: 'Immediate' },
          { id: '1-2days', name: '1-2 Days' },
          { id: '3-5days', name: '3-5 Days' }
        ]
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { id: 'open', name: 'Open' },
          { id: 'in_progress', name: 'In Progress' },
          { id: 'resolved', name: 'Resolved' }
        ]
      }
    ],
    'support': [
      {
        id: 'supportType',
        title: 'Support Type',
        options: [
          { id: 'technical', name: 'Technical' },
          { id: 'account', name: 'Account' },
          { id: 'access', name: 'Access' },
          { id: 'system', name: 'System' }
        ]
      },
      {
        id: 'urgency',
        title: 'Urgency',
        options: [
          { id: 'critical', name: 'Critical' },
          { id: 'high', name: 'High' },
          { id: 'medium', name: 'Medium' },
          { id: 'low', name: 'Low' }
        ]
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { id: 'open', name: 'Open' },
          { id: 'in_progress', name: 'In Progress' },
          { id: 'resolved', name: 'Resolved' }
        ]
      }
    ],
    'requisition': [
      {
        id: 'requestType',
        title: 'Request Type',
        options: [
          { id: 'staff', name: 'Staff' },
          { id: 'equipment', name: 'Equipment' },
          { id: 'booking', name: 'Booking' },
          { id: 'registration', name: 'Registration' }
        ]
      },
      {
        id: 'approvalStatus',
        title: 'Approval Status',
        options: [
          { id: 'pending', name: 'Pending' },
          { id: 'approved', name: 'Approved' },
          { id: 'rejected', name: 'Rejected' }
        ]
      },
      {
        id: 'budgetRange',
        title: 'Budget Range',
        options: [
          { id: 'under_1k', name: 'Under 1K' },
          { id: '1k_10k', name: '1K - 10K' },
          { id: '10k_plus', name: '10K+' }
        ]
      }
    ],
    'self-service': [
      {
        id: 'format',
        title: 'Format',
        options: [
          { id: 'video', name: 'Video' },
          { id: 'guide', name: 'Guide' },
          { id: 'template', name: 'Template' },
          { id: 'walkthrough', name: 'Walkthrough' }
        ]
      },
      {
        id: 'difficulty',
        title: 'Difficulty',
        options: [
          { id: 'beginner', name: 'Beginner' },
          { id: 'intermediate', name: 'Intermediate' },
          { id: 'advanced', name: 'Advanced' }
        ]
      },
      {
        id: 'duration',
        title: 'Duration',
        options: [
          { id: 'quick', name: 'Quick (< 5 min)' },
          { id: 'medium', name: 'Medium (5-15 min)' },
          { id: 'long', name: 'Long (> 15 min)' }
        ]
      }
    ]
  };
*/
