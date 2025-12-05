import React, { ReactNode } from 'react';
import { DollarSign, Calendar, Clock, Users, MapPin, CheckCircle, BarChart, Award, FileText, Info, BookOpen, ClipboardList, ScrollText, Building, Compass } from 'lucide-react';
import { mockCourses, providers, mockOnboardingFlowsData } from './mockData';
import { mockFinancialServices, mockNonFinancialServices } from './mockMarketplaceData';
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
    }],
    serviceTypes: [{
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'credit',
      name: 'Credit'
    }, {
      id: 'riskmanagement',
      name: 'Risk Management'
    }]
  },
  providers: providers
};
// Mock data for non-financial services
export const mockNonFinancialServicesData = {
  items: mockNonFinancialServices,
  filterOptions: {
    categories: [{
      id: 'it_support',
      name: 'IT Support'
    }, {
      id: 'support_charter_template',
      name: 'Support Charter Template'
    }, {
      id: 'it_support_walkthrough',
      name: 'IT Support Walkthrough'
    }, {
      id: 'export',
      name: 'Export'
    }],
    serviceTypes: [{
      id: 'advisory',
      name: 'Advisory'
    }, {
      id: 'implementation',
      name: 'Implementation'
    }, {
      id: 'information',
      name: 'Information'
    }, {
      id: 'program',
      name: 'Program'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }]
  },
  providers: providers
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
    }, {
      id: 'dayindq',
      name: 'Day in DQ'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }],
    businessStages: [{
      id: 'new-joiner',
      name: 'New Joiner'
    }, {
      id: 'team-lead',
      name: 'Team Lead'
    }, {
      id: 'project-delivery',
      name: 'Project/Delivery'
    }, {
      id: 'ops-support',
      name: 'Ops & Support'
    }]
  },
  providers: providers
};
// Define marketplace configurations
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
      icon: <Clock size={18} className="mr-2" />
    }, {
      key: 'deliveryMode',
      label: 'Format',
      icon: <ScrollText size={18} className="mr-2" />
    }, {
      key: 'businessStage',
      label: 'Role',
      icon: <Users size={18} className="mr-2" />
    }, {
      key: 'category',
      label: 'Journey Phase',
      icon: <Compass size={18} className="mr-2" />
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
    primaryCTA: 'Enroll Now',
    secondaryCTA: 'View Details',
    itemName: 'LMS Course',
    itemNamePlural: 'LMS Courses',
    attributes: [{
      key: 'duration',
      label: 'Duration',
      icon: <Clock size={18} className="mr-2" />
    }, {
      key: 'startDate',
      label: 'Starts',
      icon: <Calendar size={18} className="mr-2" />
    }, {
      key: 'price',
      label: 'Cost',
      icon: <DollarSign size={18} className="mr-2" />
    }, {
      key: 'location',
      label: 'Location',
      icon: <MapPin size={18} className="mr-2" />
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
      title: 'Location & Studio',
      options: [{
        id: 'Riyadh',
        name: 'Riyadh'
      }, {
        id: 'Dubai',
        name: 'Dubai'
      }, {
        id: 'Nairobi',
        name: 'Nairobi'
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
      icon: <DollarSign size={18} className="mr-2" />
    }, {
      key: 'processingTime',
      label: 'Processing Time',
      icon: <Calendar size={18} className="mr-2" />
    }, {
      key: 'eligibility',
      label: 'Eligibility',
      icon: <CheckCircle size={18} className="mr-2" />
    }, {
      key: 'interestRate',
      label: 'Interest Rate',
      icon: <BarChart size={18} className="mr-2" />
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
    title: 'Business Services Marketplace',
    description: 'Find professional services to support and grow your business',
    route: '/it-systems-support',
    primaryCTA: 'Request Service',
    secondaryCTA: 'View Details',
    itemName: 'Business Service',
    itemNamePlural: 'Business Services',
    attributes: [{
      key: 'serviceType',
      label: 'Service Type',
      icon: <Award size={18} className="mr-2" />
    }, {
      key: 'deliveryMode',
      label: 'Service Mode',
      icon: <Users size={18} className="mr-2" />
    }, {
      key: 'duration',
      label: 'Duration',
      icon: <Clock size={18} className="mr-2" />
    }, {
      key: 'price',
      label: 'Cost',
      icon: <DollarSign size={18} className="mr-2" />
    }],
    detailSections: ['description', 'deliveryDetails', 'provider', 'related'],
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
        id: 'consultancy',
        name: 'Consultancy'
      }, {
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'research',
        name: 'Research'
      }, {
        id: 'export',
        name: 'Export'
      }]
    }, {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'inperson',
        name: 'In-person'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
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
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }, {
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockNonFinancialServicesData
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
