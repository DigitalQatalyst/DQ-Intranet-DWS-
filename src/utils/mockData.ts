// Mock data for the Course Marketplace
export interface ProviderType {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
}
export interface CourseType {
  id: string;
  title: string;
  description: string;
  category: string;
  deliveryMode: string;
  businessStage: string;
  provider: ProviderType;
  learningOutcomes: string[];
  startDate: string;
  price?: string;
  location?: string;
  tags?: string[];
  phase?: string;
  role?: string;
  format?: string;
  popularity?: string;
  timeToComplete?: string;
  journeyPhase?: string;
  time?: number;
  roles?: string[];
  duration?: string;
  durationType?: string;
}
// Categories
export const categories = ["IT Support", "Admin Support", "Reports Support"];
// Delivery Modes
export const deliveryModes = ["Online", "In-person", "Hybrid"];
// Business Stages
export const businessStages = [
  "New Joiner",
  "Team Lead",
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Operations",
];
// Providers
export const providers = [
  {
    id: "1",
    name: "DQ IT Support",
    logoUrl: "/DWS-Logo.png",
    description:
      "DQ IT Support provides technical assistance and support for all technology-related issues and requests.",
  },
  {
    id: "2",
    name: "DQ Admin Support",
    logoUrl: "/DWS-Logo.png",
    description:
      "DQ Admin Support handles administrative requests including bookings, staff requisitions, and registrations.",
  },
  {
    id: "3",
    name: "DQ Reports Support",
    logoUrl: "/DWS-Logo.png",
    description:
      "DQ Reports Support assists with DTMP setup, governance, and proposal-related reporting requests.",
  },
];
// Mock Courses
export const mockCourses: CourseType[] = [
  {
    id: "1",
    title: "IT Support Form",
    description:
      "Please use this form to submit any support requests related to Technology at DQ. Be sure to include details about the problem you're experiencing, along with any error messages you see. The more information you provide, the faster our support team can assist you.",
    category: "IT Support",
    deliveryMode: "Hybrid",
    businessStage: "Team Lead",
    provider: providers[0],
    learningOutcomes: [
      "Submit IT support requests efficiently",
      "Provide detailed problem descriptions",
      "Include relevant error messages",
      "Track support request progress",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "2",
    title: "Support Charter Template",
    description:
      "Support Charter Template is a structured document that outlines the scope, responsibilities, standards, and expectations of the IT support function. It acts as a formal agreement or guideline between the IT support team and the users or departments they serve.",
    category: "IT Support",
    deliveryMode: "Hybrid",
    businessStage: "Team Lead",
    provider: providers[0],
    learningOutcomes: [
      "Understand IT support scope and responsibilities",
      "Define service level agreements",
      "Establish support standards and expectations",
      "Create formal support agreements",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "3",
    title: "IT Support Walkthrough",
    description:
      "An instructional video detailing how to successfully launch an IT support request on the DWS platform.",
    category: "IT Support",
    deliveryMode: "Online",
    businessStage: "New Joiner",
    provider: providers[0],
    learningOutcomes: [
      "Navigate the DWS platform effectively",
      "Launch IT support requests correctly",
      "Follow proper request procedures",
      "Understand platform functionality",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "4",
    title: "Bookings",
    description:
      "Use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DBP Admin (Booking). The more information you provide, the faster our support team can assist you.",
    category: "Admin Support",
    deliveryMode: "In-person",
    businessStage: "Project/Delivery",
    provider: providers[1],
    learningOutcomes: [
      "Submit booking requests to BSS Factory",
      "Provide detailed booking information",
      "Work with DBP Admin for bookings",
      "Understand booking procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "5",
    title: "Staff Requisition",
    description:
      "Please use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DBP Hiring (Staff Requisition). The more information you provide, the faster our support team can assist you.",
    category: "Admin Support",
    deliveryMode: "Hybrid",
    businessStage: "Team Lead",
    provider: providers[1],
    learningOutcomes: [
      "Submit staff requisition requests",
      "Work with DBP Hiring team",
      "Provide detailed hiring information",
      "Understand requisition procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "6",
    title: "Registration",
    description:
      "Please use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DBP Hiring Admin (Registration). The more information you provide, the faster our support team can assist you.",
    category: "Admin Support",
    deliveryMode: "In-person",
    businessStage: "New Joiner",
    provider: providers[1],
    learningOutcomes: [
      "Submit registration requests",
      "Work with DBP Hiring Admin",
      "Provide detailed registration information",
      "Understand registration procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "7",
    title: "DTMP (Base Setup)",
    description:
      "Please use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DT2.0 DTMP (Base Setup). The more information you provide, the faster our support team can assist you.",
    category: "Reports Support",
    deliveryMode: "Online",
    businessStage: "Project/Delivery",
    provider: providers[2],
    learningOutcomes: [
      "Submit DTMP base setup requests",
      "Work with DT2.0 DTMP team",
      "Provide detailed setup information",
      "Understand DTMP procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "8",
    title: "Governance",
    description:
      "Please use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DT2.0 Report (Governance). The more information you provide, the faster our support team can assist you.",
    category: "Reports Support",
    deliveryMode: "Online",
    businessStage: "Ops & Support",
    provider: providers[2],
    learningOutcomes: [
      "Submit governance report requests",
      "Work with DT2.0 Report team",
      "Provide detailed governance information",
      "Understand reporting procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
  {
    id: "9",
    title: "Proposal",
    description:
      "Please use this form to submit any support requests to the BSS Factory at DQ. Be sure to include detailed information about your request for the DT2.0 Report (Design). The more information you provide, the faster our support team can assist you.",
    category: "Reports Support",
    deliveryMode: "Online",
    businessStage: "Project/Delivery",
    provider: providers[2],
    learningOutcomes: [
      "Submit proposal report requests",
      "Work with DT2.0 Report team",
      "Provide detailed design information",
      "Understand proposal procedures",
    ],
    startDate: "Available Now",
    price: "Free",
  },
];

export const mockOnboardingFlows: CourseType[] = [
  {
    id: "discover-culture",
    title: "Discover DQ Culture",
    description: "Learn how DQ works, collaborates, and communicates in a digital-first culture.",
    category: "Discover",
    deliveryMode: "Guide",
    duration: "15 min",
    durationType: "Short",
    businessStage: "All",
    provider: providers[0],
    learningOutcomes: [
      "Understand values & rituals",
      "Know how we communicate and share work",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Discover", "Guide"],
    phase: "discover",
    role: "all",
    format: "Guide",
    popularity: "New",
    timeToComplete: "15–30m",
    journeyPhase: "Discover",
    roles: ["All"],
    time: 15,
  },
  {
    id: "discover-marketplaces",
    title: "Explore DQ Marketplaces",
    description: "Tour DQ's internal marketplaces and discover how to access services, learning paths, and collaboration spaces.",
    category: "Discover",
    deliveryMode: "Interactive",
    duration: "20 min",
    durationType: "Medium",
    businessStage: "Product",
    provider: providers[1],
    learningOutcomes: [
      "Know where to request services",
      "Find learning and communities quickly",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Discover", "Interactive"],
    phase: "discover",
    role: "product",
    format: "Interactive",
    timeToComplete: "15–30m",
    journeyPhase: "Discover",
    roles: ["Product", "Design", "Engineering", "Marketing"],
    time: 20,
  },
  {
    id: "setup-workspace",
    title: "Set Up Your Workspace",
    description: "Configure your daily tools, notifications, and access permissions so you can work efficiently from day one.",
    category: "Set Up",
    deliveryMode: "Checklist",
    duration: "25 min",
    durationType: "Medium",
    businessStage: "All",
    provider: providers[2],
    learningOutcomes: [
      "Access to core tools",
      "Notifications tuned",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Set Up", "Checklist"],
    phase: "set-up",
    role: "all",
    format: "Checklist",
    popularity: "Most used",
    timeToComplete: "15–30m",
    journeyPhase: "Set Up",
    roles: ["All"],
    time: 25,
  },
  {
    id: "setup-tooling-engineering",
    title: "Install Engineering Tooling",
    description: "Bootstrap your dev environment, connect repos, and test a pipeline to confirm everything works.",
    category: "Set Up",
    deliveryMode: "Checklist",
    duration: "45 min",
    durationType: "Long",
    businessStage: "Engineering",
    provider: providers[3],
    learningOutcomes: [
      "Local environment ready",
      "Pipelines validated",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Set Up", "Checklist"],
    phase: "set-up",
    role: "engineering",
    format: "Checklist",
    popularity: "Most used",
    timeToComplete: "30–60m",
    journeyPhase: "Set Up",
    roles: ["Engineering"],
    time: 45,
  },
  {
    id: "setup-product-tools",
    title: "Configure Product Tools",
    description: "Enable planning boards, feedback loops, and analytics so work flows smoothly.",
    category: "Set Up",
    deliveryMode: "Checklist",
    duration: "25 min",
    durationType: "Medium",
    businessStage: "Product",
    provider: providers[2],
    learningOutcomes: [
      "Backlog access",
      "Feedback channels in place",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Set Up", "Checklist"],
    phase: "set-up",
    role: "product",
    format: "Checklist",
    timeToComplete: "15–30m",
    journeyPhase: "Set Up",
    roles: ["Product"],
    time: 25,
  },
  {
    id: "connect-mentor",
    title: "Connect with Your Mentor",
    description: "Meet your mentor, align expectations, and plan your onboarding goals together.",
    category: "Connect",
    deliveryMode: "Interactive",
    duration: "20 min",
    durationType: "Medium",
    businessStage: "All",
    provider: providers[4],
    learningOutcomes: [
      "Mentor sync scheduled",
      "Shared onboarding plan",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Connect", "Interactive"],
    phase: "connect",
    role: "all",
    format: "Interactive",
    timeToComplete: "15–30m",
    journeyPhase: "Connect",
    roles: ["All"],
    time: 20,
  },
  {
    id: "connect-team-sync",
    title: "Join Your First Team Sync",
    description: "Experience how DQ squads align, share progress, and collaborate during ceremonies.",
    category: "Connect",
    deliveryMode: "Interactive",
    duration: "30 min",
    durationType: "Long",
    businessStage: "Operations",
    provider: providers[0],
    learningOutcomes: [
      "Team context gained",
      "Action items owned",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Connect", "Interactive"],
    phase: "connect",
    role: "operations",
    format: "Interactive",
    timeToComplete: "30–60m",
    journeyPhase: "Connect",
    roles: ["Operations", "Engineering", "Product"],
    time: 30,
  },
  {
    id: "connect-marketing-loop",
    title: "Marketing Collaboration Loop",
    description: "Sync with brand, analytics, and copy teams to co-create your first internal campaign.",
    category: "Connect",
    deliveryMode: "Checklist",
    duration: "30 min",
    durationType: "Long",
    businessStage: "Marketing",
    provider: providers[3],
    learningOutcomes: [
      "Cross-team collaboration started",
      "Campaign plan shared",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Connect", "Checklist"],
    phase: "connect",
    role: "marketing",
    format: "Checklist",
    timeToComplete: "30–60m",
    journeyPhase: "Connect",
    roles: ["Marketing"],
    time: 30,
  },
  {
    id: "grow-learning-sprint",
    title: "Curated Learning Sprint",
    description: "Complete a focused week-one learning path tailored to your craft.",
    category: "Grow",
    deliveryMode: "Video",
    duration: "60 min",
    durationType: "Long",
    businessStage: "Design",
    provider: providers[1],
    learningOutcomes: [
      "Core modules finished",
      "Reflections documented and shared",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Grow", "Video"],
    phase: "grow",
    role: "design",
    format: "Video",
    popularity: "Most used",
    timeToComplete: "30–60m",
    journeyPhase: "Grow",
    roles: ["Design", "Engineering", "Product"],
    time: 60,
  },
  {
    id: "grow-contribute-marketplaces",
    title: "Contribute to Marketplaces",
    description: "Publish offerings or updates to internal marketplaces and set a sustainable cadence.",
    category: "Grow",
    deliveryMode: "Guide",
    duration: "35 min",
    durationType: "Long",
    businessStage: "Marketing",
    provider: providers[2],
    learningOutcomes: [
      "Listing submitted",
      "Contribution rhythm established",
    ],
    startDate: "Anytime",
    price: "Included",
    tags: ["Grow", "Guide"],
    phase: "grow",
    role: "marketing",
    format: "Guide",
    timeToComplete: "30–60m",
    journeyPhase: "Grow",
    roles: ["Marketing", "Operations", "Design"],
    time: 35,
  },
];


export const mockOnboardingFlowsData = {
  items: mockOnboardingFlows,
  filterOptions: {
    journeyPhase: [
      { id: 'discover', name: 'Discover' },
      { id: 'set-up', name: 'Set Up' },
      { id: 'connect', name: 'Connect' },
      { id: 'grow', name: 'Grow' }
    ],
    roles: [
      { id: 'all', name: 'All' },
      { id: 'product', name: 'Product' },
      { id: 'design', name: 'Design' },
      { id: 'engineering', name: 'Engineering' },
      { id: 'marketing', name: 'Marketing' },
      { id: 'operations', name: 'Operations' }
    ],
    timeToComplete: [
      { id: '15-30', name: '15–30m' },
      { id: '30-60', name: '30–60m' },
      { id: 'gt-60', name: '>60m' }
    ],
    formats: [
      { id: 'checklist', name: 'Checklist' },
      { id: 'interactive', name: 'Interactive' },
      { id: 'video', name: 'Video' },
      { id: 'guide', name: 'Guide' }
    ],
    popularity: [
      { id: 'most-used', name: 'Most used' },
      { id: 'new', name: 'New' }
    ]
  },
  providers
};

// Helper function to assign random statuses to fields
const assignFieldStatuses = (fields: any) => {
  const statuses = ["locked", "editable", "completed"];
  return fields.map((field: any) => ({
    ...field,
    status:
      field.status || statuses[Math.floor(Math.random() * statuses.length)], // Randomly assign a status
  }));
};

// Add some empty fields to demonstrate placeholder styling
const addEmptyFields = (groups: any) => {
  return groups.map((group: any) => {
    const updatedFields = group.fields.map((field: any, index: any) => {
      // Make some fields empty (roughly 10%)
      if (index % 10 === 0) {
        return { ...field, value: "" };
      }
      return field;
    });
    return { ...group, fields: updatedFields };
  });
};

// Apply status to all fields in all groups
export const mockProfileData = {
  basic: addEmptyFields([
    {
      groupName: "Company Identification",
      fields: assignFieldStatuses([
        { label: "Trade Name", value: "FutureTech" },
        { label: "Registration Number", value: "FT12345678" },
        { label: "Establishment Date", value: "15-Mar-2010" },
        { label: "Entity Type", value: "Limited Liability Company" },
        {
          label: "Registration Authority",
          value: "ADGM Registration Authority",
        },
        { label: "Legal Status", value: "Active" },
      ]),
    },
    {
      groupName: "Business Details",
      fields: assignFieldStatuses([
        { label: "Business Type", value: "Limited Liability Company" },
        { label: "Industry", value: "Information Technology" },
        { label: "Business Size", value: "Medium Enterprise" },
        { label: "Annual Revenue", value: "$25M - $50M" },
        { label: "Number of Employees", value: "120" },
        {
          label: "Business Description",
          value:
            "Enterprise software solutions specializing in cloud-based enterprise management systems with AI-driven analytics capabilities. Our flagship products serve various industries including finance, healthcare, and manufacturing.",
        },
      ]),
    },
    {
      groupName: "Status Information",
      fields: assignFieldStatuses([
        { label: "License Expiry", value: "31-Dec-2023" },
        { label: "Renewal Status", value: "Pending" },
        { label: "Compliance Status", value: "Compliant" },
        { label: "Last Updated", value: "10-Jun-2023" },
      ]),
    },
    {
      groupName: "Classification",
      fields: assignFieldStatuses([
        { label: "Primary ISIC Code", value: "6201" },
        {
          label: "Primary ISIC Description",
          value: "Computer programming activities",
        },
        { label: "Secondary ISIC Code", value: "6202" },
        { label: "Business Category", value: "Technology" },
        { label: "Market Segment", value: "Enterprise Solutions" },
      ]),
    },
    {
      groupName: "Identifiers",
      fields: assignFieldStatuses([
        { label: "VAT Registration Number", value: "100123456700003" },
        { label: "Commercial License Number", value: "CN-12345" },
        { label: "DUNS Number", value: "123456789" },
        { label: "LEI Code", value: "984500B38RH80URRT231" },
        { label: "Chamber of Commerce Number", value: "ADCCI-12345" },
      ]),
    },
    {
      groupName: "Needs & Aspirations",
      fields: assignFieldStatuses([
        {
          label: "5-Year Vision",
          value:
            "To become the leading enterprise software provider in the MENA region, with a focus on AI-driven solutions that transform business operations across industries.",
        },
        {
          label: "Investment Goals",
          value: "$15M by Q2 2024 (Series B) - 60% complete",
        },
        {
          label: "Technology Roadmap",
          value:
            "2023 Q4: Launch AI analytics platform\n2024 Q2: Expand IoT integration capabilities\n2024 Q4: Develop industry-specific solutions for healthcare\n2025: Blockchain integration for secure transactions",
        },
      ]),
    },
  ]),
  contact: addEmptyFields([
    {
      groupName: "Primary Contact",
      fields: assignFieldStatuses([
        { label: "Contact Name", value: "John Smith" },
        { label: "Position", value: "Chief Executive Officer" },
        { label: "Email", value: "john.smith@futuretech.com" },
        { label: "Phone", value: "+971 50 123 4567" },
        { label: "Nationality", value: "British" },
        { label: "Languages", value: "English, Arabic" },
      ]),
    },
    {
      groupName: "Business Address",
      fields: [
        { label: "Address Line 1", value: "Level 42, Al Maqam Tower" },
        { label: "Address Line 2", value: "ADGM Square, Al Maryah Island" },
        { label: "City", value: "Abu Dhabi" },
        { label: "Country", value: "United Arab Emirates" },
        { label: "P.O. Box", value: "P.O. Box 12345" },
        { label: "Geo Coordinates", value: "24.4991° N, 54.3816° E" },
      ],
    },
    {
      groupName: "Communication",
      fields: [
        { label: "Main Phone", value: "+971 2 123 4567" },
        { label: "Website", value: "www.futuretech.com" },
        { label: "General Email", value: "info@futuretech.com" },
        { label: "Support Email", value: "support@futuretech.com" },
        { label: "Fax", value: "+971 2 123 4568" },
        { label: "Social Media", value: "@futuretechllc" },
      ],
    },
    {
      groupName: "Secondary Contact",
      fields: [
        { label: "Contact Name", value: "Sarah Johnson" },
        { label: "Position", value: "Chief Operations Officer" },
        { label: "Email", value: "sarah.johnson@futuretech.com" },
        { label: "Phone", value: "+971 50 987 6543" },
        { label: "Nationality", value: "American" },
        { label: "Languages", value: "English" },
      ],
    },
    {
      groupName: "Emergency Contact",
      fields: [
        { label: "Contact Name", value: "Ahmed Al Mansoori" },
        { label: "Position", value: "Security Manager" },
        { label: "Email", value: "ahmed.m@futuretech.com" },
        { label: "Phone", value: "+971 50 555 1234" },
        { label: "Available Hours", value: "24/7" },
        { label: "Priority Level", value: "High" },
      ],
    },
  ]),
  legal: addEmptyFields([
    {
      groupName: "Legal Structure",
      fields: [
        { label: "Legal Form", value: "Limited Liability Company" },
        { label: "Jurisdiction", value: "Abu Dhabi Global Market (ADGM)" },
        {
          label: "Registration Authority",
          value: "ADGM Registration Authority",
        },
        { label: "Governing Law", value: "ADGM Companies Regulations 2020" },
        { label: "Foreign Branch Status", value: "Not Applicable" },
        { label: "Legal Capacity", value: "Full" },
      ],
    },
    {
      groupName: "Tax Information",
      fields: [
        { label: "Tax Registration Number", value: "100123456700003" },
        { label: "Tax Status", value: "Compliant" },
        { label: "Last Filing Date", value: "31-Mar-2023" },
        { label: "Tax Jurisdiction", value: "UAE" },
        { label: "VAT Registration Date", value: "01-Jan-2018" },
        { label: "Tax Year End", value: "31-Dec" },
      ],
    },
    {
      groupName: "Corporate Governance",
      fields: [
        { label: "Board Size", value: "5 Directors" },
        { label: "Board Meeting Frequency", value: "Quarterly" },
        { label: "Corporate Secretary", value: "Legal Associates LLC" },
        { label: "Articles Last Updated", value: "15-Jan-2022" },
        {
          label: "Governance Framework",
          value: "ADGM Corporate Governance Framework",
        },
        { label: "Shareholder Agreement", value: "In place - 12-Mar-2020" },
      ],
    },
    {
      groupName: "Regulatory Compliance",
      fields: [
        {
          label: "Primary Regulator",
          value: "Financial Services Regulatory Authority",
        },
        { label: "Regulatory Status", value: "Compliant" },
        { label: "Last Inspection Date", value: "05-May-2022" },
        { label: "Special Licenses", value: "Data Protection Registration" },
        { label: "Compliance Officer", value: "Fatima Al Zaabi" },
        {
          label: "Regulatory Reports Due",
          value: "Quarterly Financial Reports",
        },
      ],
    },
    {
      groupName: "Legal Representation",
      fields: [
        { label: "External Legal Counsel", value: "Global Legal Partners LLP" },
        {
          label: "Internal Legal Contact",
          value: "Mohammed Hassan, Legal Director",
        },
        {
          label: "Power of Attorney Holders",
          value: "John Smith, Sarah Johnson",
        },
        {
          label: "Legal Authority Limits",
          value: "As per Delegation of Authority Matrix",
        },
        { label: "Jurisdiction for Disputes", value: "ADGM Courts" },
        { label: "Arbitration Clause", value: "ADGM Arbitration Centre" },
      ],
    },
  ]),
  financial: addEmptyFields([
    {
      groupName: "Financial Overview",
      fields: [
        { label: "Annual Revenue", value: "$38.5 Million" },
        { label: "Total Assets", value: "$42.7 Million" },
        { label: "Fiscal Year End", value: "31 December" },
        { label: "Revenue Growth YoY", value: "12.4%" },
        { label: "Profit Margin", value: "18.7%" },
        { label: "EBITDA", value: "$7.2 Million" },
      ],
    },
    {
      groupName: "Banking Information",
      fields: [
        { label: "Primary Bank", value: "Abu Dhabi Commercial Bank" },
        { label: "Account Manager", value: "Khalid Al Naqbi" },
        { label: "Banking Relationship Since", value: "2010" },
        { label: "Number of Accounts", value: "5" },
        { label: "Credit Facilities", value: "Trade Finance, Overdraft" },
        { label: "Treasury Services", value: "FX, Cash Management" },
      ],
    },
    {
      groupName: "Financial Reporting",
      fields: [
        { label: "Accounting Standards", value: "IFRS" },
        { label: "External Auditor", value: "KPMG" },
        { label: "Last Audit Date", value: "15-Feb-2023" },
        { label: "Audit Opinion", value: "Unqualified" },
        { label: "Reporting Currency", value: "USD" },
        { label: "Consolidated Statements", value: "Yes" },
      ],
    },
    {
      groupName: "Capital Structure",
      fields: [
        { label: "Authorized Capital", value: "$50 Million" },
        { label: "Paid-up Capital", value: "$25 Million" },
        { label: "Number of Shares", value: "2,500,000" },
        { label: "Par Value per Share", value: "$10" },
        { label: "Debt-to-Equity Ratio", value: "0.8" },
        { label: "Last Capital Increase", value: "10-Jun-2020" },
      ],
    },
    {
      groupName: "Financial Metrics",
      fields: [
        { label: "Current Ratio", value: "2.3" },
        { label: "Quick Ratio", value: "1.8" },
        { label: "Return on Assets", value: "15.2%" },
        { label: "Return on Equity", value: "22.4%" },
        { label: "Inventory Turnover", value: "8.5" },
        { label: "Days Sales Outstanding", value: "45 days" },
      ],
    },
  ]),
  operational: addEmptyFields([
    {
      groupName: "Business Operations",
      fields: [
        { label: "Operating Model", value: "Product & Services" },
        { label: "Business Hours", value: "Sun-Thu, 8:00 AM - 5:00 PM" },
        { label: "Operational Since", value: "April 2010" },
        { label: "Service Level Agreements", value: "99.9% Uptime Guarantee" },
        {
          label: "Quality Management System",
          value: "ISO 9001:2015 Certified",
        },
        { label: "Business Continuity Plan", value: "Updated Quarterly" },
      ],
    },
    {
      groupName: "Supply Chain",
      fields: [
        { label: "Key Suppliers", value: "5 Tier-1 Suppliers" },
        { label: "Supply Chain Model", value: "Just-in-Time" },
        { label: "Procurement Process", value: "Digital Procurement Platform" },
        { label: "Average Lead Time", value: "14 days" },
        { label: "Supplier Locations", value: "UAE, USA, Germany, Singapore" },
        {
          label: "Supplier Management",
          value: "Quarterly Performance Reviews",
        },
      ],
    },
    {
      groupName: "Infrastructure",
      fields: [
        { label: "IT Infrastructure", value: "Cloud-based (AWS, Azure)" },
        { label: "Physical Infrastructure", value: "2 Offices, 1 Data Center" },
        { label: "Disaster Recovery", value: "Hot Site in Dubai" },
        { label: "Network Capacity", value: "10 Gbps Redundant" },
        { label: "Server Environment", value: "Virtualized, Containerized" },
        { label: "Backup Systems", value: "Daily Incremental, Weekly Full" },
      ],
    },
    {
      groupName: "Key Processes",
      fields: [
        {
          label: "Core Processes",
          value: "Software Development, Implementation, Support",
        },
        { label: "Process Framework", value: "ITIL v4" },
        { label: "Process Documentation", value: "Digital Process Repository" },
        { label: "Process Automation Level", value: "75% Automated" },
        {
          label: "Process KPIs",
          value: "Cycle Time, Defect Rate, Customer Satisfaction",
        },
        { label: "Process Improvement", value: "Six Sigma, Lean" },
      ],
    },
    {
      groupName: "Operational Metrics",
      fields: [
        { label: "On-time Delivery", value: "97.5%" },
        { label: "First-time Resolution", value: "85.3%" },
        { label: "Customer Satisfaction", value: "4.7/5.0" },
        { label: "Operational Efficiency", value: "82%" },
        { label: "Incident Response Time", value: "< 2 hours" },
        { label: "System Availability", value: "99.98%" },
      ],
    },
  ]),
  ownership: addEmptyFields([
    {
      groupName: "Shareholder Information",
      fields: [
        { label: "Major Shareholder", value: "Global Tech Ventures (51%)" },
        { label: "Local Partner", value: "Abu Dhabi Investments LLC (24%)" },
        { label: "Founder Shares", value: "John Smith (15%)" },
        { label: "Employee Stock Ownership", value: "5%" },
        { label: "Other Shareholders", value: "5%" },
        { label: "Share Class Structure", value: "Class A & B Shares" },
      ],
    },
    {
      groupName: "Ultimate Beneficial Owners",
      fields: [
        {
          label: "Primary UBO",
          value: "Richard Williams (35% of Global Tech Ventures)",
        },
        {
          label: "Secondary UBO",
          value: "Sheikh Mohammed Al Nahyan (100% of Abu Dhabi Investments)",
        },
        { label: "UBO Registry Filing", value: "Completed - 10-Jan-2023" },
        { label: "UBO Verification", value: "KYC Completed" },
        { label: "UBO Changes Last Year", value: "None" },
        { label: "UBO Reporting Status", value: "Compliant" },
      ],
    },
    {
      groupName: "Corporate Structure",
      fields: [
        {
          label: "Parent Company",
          value: "Global Tech Holdings Ltd (Cayman Islands)",
        },
        {
          label: "Subsidiaries",
          value: "FutureTech Saudi LLC, FutureTech Egypt Ltd",
        },
        {
          label: "Affiliated Companies",
          value: "DataSync Technologies, CloudEra Solutions",
        },
        { label: "Holding Structure", value: "3-Tier Holding Structure" },
        { label: "Group Organization Chart", value: "Updated 05-Mar-2023" },
        {
          label: "Intercompany Agreements",
          value: "Service Level Agreements, IP Licensing",
        },
      ],
    },
    {
      groupName: "Ownership Changes",
      fields: [
        { label: "Last Ownership Change", value: "15-Aug-2021" },
        { label: "Nature of Change", value: "Secondary Share Sale (10%)" },
        { label: "Previous Major Owner", value: "Tech Ventures Capital" },
        { label: "Ownership Stability", value: "Stable since 2021" },
        { label: "Planned Changes", value: "None Disclosed" },
        {
          label: "Share Transfer Restrictions",
          value: "Right of First Refusal, Tag-Along Rights",
        },
      ],
    },
    {
      groupName: "Governance Rights",
      fields: [
        { label: "Voting Rights", value: "One Share, One Vote" },
        {
          label: "Board Representation",
          value: "GTV: 3 seats, ADI: 1 seat, Founder: 1 seat",
        },
        {
          label: "Special Voting Rights",
          value: "Class B (Founder) shares have 10x voting power",
        },
        { label: "Veto Rights", value: "Major Shareholders on Key Decisions" },
        { label: "Dividend Rights", value: "Pro-rata to Shareholding" },
        {
          label: "Information Rights",
          value: "Monthly Reports to Major Shareholders",
        },
      ],
    },
  ]),
  licensing: addEmptyFields([
    {
      groupName: "Primary Licenses",
      fields: [
        { label: "Commercial License", value: "ADGM-CL-12345" },
        { label: "License Type", value: "Technology Services Provider" },
        { label: "Issuing Authority", value: "ADGM Registration Authority" },
        { label: "Issue Date", value: "15-Mar-2010" },
        { label: "Expiry Date", value: "31-Dec-2023" },
        { label: "Renewal Process", value: "Annual Renewal Required" },
      ],
    },
    {
      groupName: "Industry-Specific Licenses",
      fields: [
        { label: "Software Provider License", value: "TRA-SP-7890" },
        { label: "Data Center Operations", value: "TRA-DC-4567" },
        { label: "Cloud Services Provider", value: "TRA-CSP-5678" },
        {
          label: "Issuing Authority",
          value: "Telecommunications Regulatory Authority",
        },
        { label: "Validity Period", value: "3 Years" },
        {
          label: "Special Conditions",
          value: "Local Data Storage Requirements",
        },
      ],
    },
    {
      groupName: "Permits & Authorizations",
      fields: [
        { label: "Establishment Card", value: "MOL-12345678" },
        { label: "Immigration Establishment", value: "ICA-87654321" },
        { label: "Commercial Signage Permit", value: "ADM-SG-54321" },
        { label: "Civil Defense Permit", value: "CD-2023-12345" },
        { label: "Environmental Permit", value: "EAD-2023-7890" },
        { label: "Special Activity Permit", value: "ADDED-SA-34567" },
      ],
    },
    {
      groupName: "International Authorizations",
      fields: [
        {
          label: "Export Control Compliance",
          value: "US BIS Compliance Program",
        },
        { label: "EU GDPR Compliance", value: "Registered Data Controller" },
        { label: "ISO 27001 Certification", value: "Valid until 15-Jun-2025" },
        { label: "PCI DSS Compliance", value: "Level 1 Service Provider" },
        { label: "SOC 2 Type II", value: "Annual Audit Completed" },
        {
          label: "Cross-Border Data Transfer",
          value: "Authorized under ADGM Data Protection",
        },
      ],
    },
    {
      groupName: "License Management",
      fields: [
        { label: "License Manager", value: "Fatima Al Zaabi" },
        { label: "Renewal Calendar", value: "Automated Tracking System" },
        { label: "Compliance Monitoring", value: "Quarterly Internal Audits" },
        {
          label: "License Repository",
          value: "Digital Document Management System",
        },
        { label: "Last Compliance Review", value: "05-May-2023" },
        { label: "Licensing Budget", value: "$125,000 Annual" },
      ],
    },
  ]),
  compliance: addEmptyFields([
    {
      groupName: "Regulatory Compliance",
      fields: [
        {
          label: "Primary Regulator",
          value: "ADGM Financial Services Regulatory Authority",
        },
        { label: "Compliance Status", value: "Fully Compliant" },
        { label: "Last Regulatory Inspection", value: "10-Nov-2022" },
        { label: "Inspection Outcome", value: "No Major Findings" },
        { label: "Compliance Framework", value: "ADGM Compliance Framework" },
        { label: "Regulatory Reporting", value: "Quarterly Reports Submitted" },
      ],
    },
    {
      groupName: "Legal Compliance",
      fields: [
        {
          label: "Legal Structure Review",
          value: "Annual - Last: 15-Jan-2023",
        },
        {
          label: "Corporate Governance",
          value: "Compliant with ADGM Requirements",
        },
        { label: "Contract Management", value: "Digital Contract Repository" },
        { label: "Litigation Status", value: "No Active Litigation" },
        { label: "Intellectual Property", value: "All IP Properly Registered" },
        { label: "Legal Opinions", value: "Clean Legal Opinions on Structure" },
      ],
    },
    {
      groupName: "Financial Compliance",
      fields: [
        { label: "Anti-Money Laundering", value: "AML Program in Place" },
        {
          label: "KYC Procedures",
          value: "Enhanced Due Diligence for High-Risk Clients",
        },
        { label: "Financial Reporting", value: "IFRS Compliant" },
        { label: "Tax Compliance", value: "All Filings Up-to-Date" },
        { label: "Financial Audits", value: "Annual External Audit" },
        { label: "Treasury Controls", value: "Dual Authorization System" },
      ],
    },
    {
      groupName: "Industry Compliance",
      fields: [
        { label: "Data Protection", value: "ADGM Data Protection Regulations" },
        { label: "Information Security", value: "ISO 27001 Certified" },
        { label: "Quality Management", value: "ISO 9001 Certified" },
        { label: "Business Continuity", value: "ISO 22301 Compliant" },
        { label: "Industry Standards", value: "NIST Cybersecurity Framework" },
        { label: "Technical Compliance", value: "TRA Technical Standards" },
      ],
    },
    {
      groupName: "Compliance History",
      fields: [
        { label: "Regulatory Actions", value: "None in Last 5 Years" },
        {
          label: "Compliance Violations",
          value: "Minor Finding (2021) - Resolved",
        },
        {
          label: "Remediation Actions",
          value: "Process Improvements Implemented",
        },
        {
          label: "Compliance Monitoring",
          value: "Continuous Monitoring System",
        },
        { label: "Compliance Training", value: "Annual for All Staff" },
        { label: "Whistleblower Reports", value: "None in Last 3 Years" },
      ],
    },
  ]),
  industry: addEmptyFields([
    {
      groupName: "Primary Classification",
      fields: [
        { label: "ISIC Code", value: "6201" },
        { label: "ISIC Description", value: "Computer programming activities" },
        { label: "NAICS Code", value: "541511" },
        {
          label: "NAICS Description",
          value: "Custom Computer Programming Services",
        },
        { label: "SIC Code", value: "7371" },
        { label: "Industry Tier", value: "Tier 1 - Strategic Sector" },
      ],
    },
    {
      groupName: "Secondary Classifications",
      fields: [
        {
          label: "Secondary ISIC",
          value: "6202 - Computer consultancy activities",
        },
        {
          label: "Secondary NAICS",
          value: "541512 - Computer Systems Design Services",
        },
        {
          label: "Additional Classification",
          value: "6311 - Data processing, hosting",
        },
        { label: "Product Classification", value: "HS Code: 8523.29" },
        {
          label: "Service Classification",
          value: "CPC 8314 - IT consulting services",
        },
        {
          label: "Local Classification",
          value: "ADDED Tech Services Category A",
        },
      ],
    },
    {
      groupName: "Industry Positioning",
      fields: [
        {
          label: "Market Position",
          value: "Top 5 Enterprise Software Provider in UAE",
        },
        { label: "Competitive Landscape", value: "15 Direct Competitors" },
        {
          label: "Market Share",
          value: "12% of UAE Enterprise Software Market",
        },
        {
          label: "Growth Rate",
          value: "15% YoY (Above Industry Average of 8%)",
        },
        {
          label: "Industry Associations",
          value: "UAE ICT Business Council, ADGM Tech Association",
        },
        {
          label: "Industry Recognition",
          value: "UAE Technology Innovation Award 2022",
        },
      ],
    },
    {
      groupName: "Industry Regulations",
      fields: [
        {
          label: "Primary Regulator",
          value: "Telecommunications Regulatory Authority",
        },
        { label: "Industry Standards", value: "ISO/IEC 27001, ISO 9001" },
        {
          label: "Compliance Requirements",
          value: "Data Residency, Security Clearance",
        },
        {
          label: "Industry Codes of Conduct",
          value: "UAE ICT Code of Practice",
        },
        {
          label: "Special Permissions",
          value: "Critical Infrastructure Provider Status",
        },
        {
          label: "Regulatory Changes",
          value: "New Data Protection Framework (2023)",
        },
      ],
    },
    {
      groupName: "Industry Engagement",
      fields: [
        {
          label: "Industry Working Groups",
          value: "UAE Cybersecurity Council, AI Ethics Committee",
        },
        {
          label: "Standards Development",
          value: "Contributing to UAE Cloud Computing Standards",
        },
        { label: "Industry Events", value: "GITEX, Abu Dhabi Technology Week" },
        {
          label: "Research Partnerships",
          value: "Khalifa University, Mohamed bin Zayed University of AI",
        },
        {
          label: "Industry Publications",
          value: "Quarterly Technology Trend Reports",
        },
        {
          label: "Thought Leadership",
          value: "Digital Transformation Whitepapers",
        },
      ],
    },
  ]),
  employees: addEmptyFields([
    {
      groupName: "Workforce Overview",
      fields: [
        { label: "Total Employees", value: "120" },
        { label: "Full-time Employees", value: "108" },
        { label: "Part-time Employees", value: "12" },
        { label: "Emiratization Rate", value: "15%" },
        { label: "Gender Diversity", value: "35% Female, 65% Male" },
        { label: "Average Tenure", value: "4.5 Years" },
      ],
    },
    {
      groupName: "Employment Structure",
      fields: [
        {
          label: "Employment Categories",
          value: "Regular, Contractual, Internship",
        },
        { label: "Management Positions", value: "22 (18% of workforce)" },
        { label: "Technical Positions", value: "75 (63% of workforce)" },
        { label: "Support Positions", value: "23 (19% of workforce)" },
        { label: "Remote Workers", value: "25 (21% of workforce)" },
        { label: "Organizational Levels", value: "5 Levels" },
      ],
    },
    {
      groupName: "Workforce Demographics",
      fields: [
        { label: "Nationality Mix", value: "15 Nationalities" },
        { label: "Age Distribution", value: "Avg: 34 years (Range: 22-58)" },
        {
          label: "Educational Background",
          value: "85% with Bachelor's or higher",
        },
        { label: "Experience Level", value: "Avg: 8.5 years in industry" },
        {
          label: "Technical Certifications",
          value: "Average 2.3 per technical employee",
        },
        { label: "Languages Spoken", value: "12 languages across workforce" },
      ],
    },
    {
      groupName: "HR Management",
      fields: [
        { label: "HR System", value: "Workday HRIS" },
        { label: "Performance Reviews", value: "Semi-annual" },
        {
          label: "Compensation Structure",
          value: "Base + Variable + Benefits",
        },
        { label: "Training Budget", value: "$2,500 per employee annually" },
        { label: "Employee Turnover", value: "8.5% annual" },
        { label: "Succession Planning", value: "In place for key positions" },
      ],
    },
    {
      groupName: "Employment Compliance",
      fields: [
        { label: "Labor Law Compliance", value: "ADGM Employment Regulations" },
        { label: "Work Permits Status", value: "100% Compliant" },
        {
          label: "Health Insurance",
          value: "Comprehensive Coverage for All Employees",
        },
        {
          label: "Pension Contributions",
          value: "UAE Nationals: GPSSA, Expats: Voluntary Plan",
        },
        {
          label: "Working Hours Policy",
          value: "40 Hours/Week, Flexible Arrangements Available",
        },
        {
          label: "Leave Entitlements",
          value: "25 Days Annual + Public Holidays",
        },
      ],
    },
  ]),
  facilities: addEmptyFields([
    {
      groupName: "Headquarters",
      fields: [
        { label: "Location", value: "Level 42, Al Maqam Tower, ADGM Square" },
        { label: "Size", value: "1,500 sq meters" },
        { label: "Capacity", value: "150 workstations" },
        { label: "Lease Terms", value: "10-year lease, expires 2028" },
        {
          label: "Facilities",
          value: "Open workspace, 8 meeting rooms, cafeteria",
        },
        {
          label: "Special Features",
          value: "Innovation lab, client experience center",
        },
      ],
    },
    {
      groupName: "Additional Locations",
      fields: [
        { label: "Dubai Office", value: "Dubai Internet City, Building 12" },
        { label: "Size", value: "500 sq meters" },
        { label: "Capacity", value: "50 workstations" },
        { label: "Purpose", value: "Sales & customer support" },
        { label: "Lease Terms", value: "5-year lease, expires 2025" },
        { label: "Occupancy", value: "85% utilized" },
      ],
    },
    {
      groupName: "Technical Infrastructure",
      fields: [
        { label: "Data Center", value: "Khazna Data Center, Masdar City" },
        { label: "Server Room", value: "On-premises at HQ (100 sq meters)" },
        {
          label: "Network Infrastructure",
          value: "Redundant 10 Gbps connections",
        },
        {
          label: "Power Backup",
          value: "UPS and Generator with 72hr capacity",
        },
        {
          label: "Cooling Systems",
          value: "Precision cooling, N+1 redundancy",
        },
        {
          label: "Physical Security",
          value: "24/7 monitored, biometric access",
        },
      ],
    },
    {
      groupName: "Facility Management",
      fields: [
        { label: "Facility Manager", value: "Ibrahim Al Hashemi" },
        {
          label: "Maintenance Contract",
          value: "Comprehensive with Emrill Services",
        },
        { label: "Security Provider", value: "G4S Secure Solutions" },
        { label: "Health & Safety", value: "ISO 45001 compliant" },
        {
          label: "Sustainability Features",
          value: "LEED Gold certified building",
        },
        { label: "Facility Expenses", value: "AED 2.5M annually" },
      ],
    },
    {
      groupName: "Future Expansion",
      fields: [
        {
          label: "Planned Locations",
          value: "Saudi Arabia (Riyadh) - Q1 2024",
        },
        {
          label: "Space Requirements",
          value: "Additional 1,000 sq meters by 2025",
        },
        { label: "Facility Strategy", value: "Hub and spoke model" },
        {
          label: "Remote Work Policy",
          value: "Hybrid model (60% office, 40% remote)",
        },
        {
          label: "Facility Optimization",
          value: "Space utilization study ongoing",
        },
        {
          label: "Capital Investment",
          value: "AED 5M allocated for facility expansion",
        },
      ],
    },
  ]),
  products: addEmptyFields([
    {
      groupName: "Core Products",
      fields: [
        {
          label: "Enterprise Suite",
          value: "Integrated business management platform",
        },
        { label: "CloudSync", value: "Cloud data synchronization solution" },
        { label: "SecureID", value: "Identity and access management system" },
        {
          label: "DataInsight",
          value: "Business intelligence and analytics platform",
        },
        { label: "ProcessFlow", value: "Business process automation tool" },
        { label: "Product Portfolio Age", value: "3-7 years" },
      ],
    },
    {
      groupName: "Services Offered",
      fields: [
        {
          label: "Implementation Services",
          value: "End-to-end deployment and setup",
        },
        { label: "Managed Services", value: "24/7 monitoring and management" },
        { label: "Professional Services", value: "Consulting and advisory" },
        { label: "Training Services", value: "Customized training programs" },
        { label: "Support Services", value: "Tiered support packages" },
        { label: "Service Level Agreements", value: "99.9% uptime guarantee" },
      ],
    },
    {
      groupName: "Product Development",
      fields: [
        { label: "R&D Investment", value: "15% of annual revenue" },
        { label: "Development Methodology", value: "Agile (Scrum)" },
        {
          label: "Release Frequency",
          value: "Major: Quarterly, Minor: Monthly",
        },
        { label: "Current Development", value: "AI-enhanced analytics module" },
        { label: "Product Roadmap", value: "18-month rolling roadmap" },
        {
          label: "Innovation Process",
          value: "Design thinking workshops, hackathons",
        },
      ],
    },
    {
      groupName: "Market Information",
      fields: [
        {
          label: "Target Segments",
          value: "Enterprise, Government, Financial Services",
        },
        { label: "Customer Base", value: "85+ enterprise customers" },
        {
          label: "Geographic Reach",
          value: "UAE, Saudi Arabia, Qatar, Oman, Kuwait",
        },
        { label: "Market Share", value: "12% in Enterprise Software segment" },
        { label: "Competitive Position", value: "Top 3 in UAE market" },
        {
          label: "Go-to-Market Strategy",
          value: "Direct sales, strategic partners",
        },
      ],
    },
    {
      groupName: "Product Management",
      fields: [
        { label: "Product Manager", value: "Layla Al Mazrouei" },
        { label: "Product Team Size", value: "12 professionals" },
        { label: "Product Lifecycle", value: "Managed through PLM system" },
        { label: "Customer Feedback", value: "NPS score: 67" },
        { label: "Product Performance", value: "85% feature adoption rate" },
        {
          label: "Pricing Strategy",
          value: "Subscription-based, tiered pricing",
        },
      ],
    },
  ]),
  certifications: addEmptyFields([
    {
      groupName: "Quality Certifications",
      fields: assignFieldStatuses([
        { label: "ISO 9001:2015", value: "Quality Management System" },
        { label: "ISO 27001:2013", value: "Information Security Management" },
        { label: "ISO 22301:2019", value: "Business Continuity Management" },
        { label: "ISO 20000-1:2018", value: "IT Service Management" },
        {
          label: "CMMI Level 4",
          value: "Capability Maturity Model Integration",
        },
        { label: "Certification Body", value: "Bureau Veritas" },
      ]),
    },
    {
      groupName: "Industry Certifications",
      fields: assignFieldStatuses([
        {
          label: "PCI DSS",
          value: "Payment Card Industry Data Security Standard",
        },
        { label: "SOC 2 Type II", value: "Service Organization Control" },
        { label: "CSA STAR", value: "Cloud Security Alliance" },
        {
          label: "GDPR Compliance",
          value: "EU General Data Protection Regulation",
        },
        { label: "ADGM Data Protection", value: "Registered Data Controller" },
        {
          label: "UAE IA Compliance",
          value: "Information Assurance Standards",
        },
      ]),
    },
    {
      groupName: "Business Awards",
      fields: assignFieldStatuses([
        { label: "UAE Innovation Award", value: "Winner 2022" },
        {
          label: "Gulf Business Technology Company",
          value: "Top 10 (2021, 2022)",
        },
        { label: "GITEX Future Stars", value: "Best Enterprise Solution 2022" },
        {
          label: "Abu Dhabi Digital Authority",
          value: "Digital Transformation Partner 2023",
        },
        {
          label: "Forbes Middle East",
          value: "Most Innovative Companies 2022",
        },
        {
          label: "Arabian Business",
          value: "Technology Company of the Year 2021",
        },
      ]),
    },
    {
      groupName: "Team Certifications",
      fields: assignFieldStatuses([
        {
          label: "AWS Certified Solutions Architects",
          value: "12 professionals",
        },
        {
          label: "Microsoft Certified Professionals",
          value: "25 certifications",
        },
        {
          label: "Certified Information Security Managers",
          value: "5 professionals",
        },
        {
          label: "Project Management Professionals",
          value: "8 certified PMPs",
        },
        { label: "ITIL Certified Practitioners", value: "15 professionals" },
        { label: "Certified Data Scientists", value: "6 professionals" },
      ]),
    },
    {
      groupName: "Recognition & Partnerships",
      fields: assignFieldStatuses([
        { label: "Microsoft Gold Partner", value: "Since 2015" },
        { label: "AWS Advanced Consulting Partner", value: "Since 2018" },
        { label: "Oracle Platinum Partner", value: "Since 2016" },
        { label: "IBM Business Partner", value: "Premier Level" },
        { label: "Google Cloud Partner", value: "Specialized Partner" },
        { label: "Gartner Recognition", value: "Notable Vendor in MEA, 2022" },
      ]),
    },
  ]),
};

// Multi-entry data for tables
export const mockMultiEntryData = {
  basic: [
    {
      title: "Current Business Needs",
      columns: [
        { key: "need", label: "Business Need" },
        { key: "priority", label: "Priority" },
        { key: "timeline", label: "Timeline" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          need: "Expand sales team in Saudi Arabia",
          priority: "High",
          timeline: "Q1 2024",
          status: "Planning",
        },
        {
          id: "2",
          need: "Secure Series B funding",
          priority: "Critical",
          timeline: "Q2 2024",
          status: "In Progress",
        },
        {
          id: "3",
          need: "Hire AI/ML specialists",
          priority: "Medium",
          timeline: "Q3 2024",
          status: "Not Started",
        },
        {
          id: "4",
          need: "Upgrade cloud infrastructure",
          priority: "High",
          timeline: "Q4 2023",
          status: "In Progress",
        },
      ],
    },
    {
      title: "Future Aspirations",
      columns: [
        { key: "aspiration", label: "Aspiration" },
        { key: "category", label: "Category" },
        { key: "timeline", label: "Timeline" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          aspiration: "Expand to European markets",
          category: "Geographic Expansion",
          timeline: "2025",
          status: "Planning",
        },
        {
          id: "2",
          aspiration: "Develop healthcare-specific solutions",
          category: "Product Development",
          timeline: "2024",
          status: "Research",
        },
        {
          id: "3",
          aspiration: "Launch IPO",
          category: "Financial",
          timeline: "2027",
          status: "Long-term Goal",
        },
        {
          id: "4",
          aspiration: "Establish R&D center in Abu Dhabi",
          category: "Innovation",
          timeline: "2025",
          status: "Conceptual",
        },
      ],
    },
    {
      title: "Strategic Alliances & Partnerships",
      columns: [
        { key: "partner", label: "Partner" },
        { key: "type", label: "Type" },
        { key: "objective", label: "Objective" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          partner: "Abu Dhabi Digital Authority",
          type: "Government",
          objective: "Smart City Solutions",
          status: "Active",
        },
        {
          id: "2",
          partner: "Microsoft",
          type: "Technology",
          objective: "Cloud Integration",
          status: "Active",
        },
        {
          id: "3",
          partner: "Healthcare Innovation Group",
          type: "Industry",
          objective: "Sector Expansion",
          status: "Negotiating",
        },
        {
          id: "4",
          partner: "KAUST",
          type: "Academic",
          objective: "R&D Collaboration",
          status: "Planning",
        },
      ],
    },
  ],
  ownership: [
    {
      title: "Shareholders",
      columns: [
        { key: "name", label: "Shareholder Name" },
        { key: "percentage", label: "Ownership %" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "Global Tech Ventures",
          percentage: 51,
          category: "Investor",
          status: "Active",
        },
        {
          id: "2",
          name: "Abu Dhabi Investments LLC",
          percentage: 24,
          category: "Local Partner",
          status: "Active",
        },
        {
          id: "3",
          name: "John Smith",
          percentage: 15,
          category: "Founder",
          status: "Active",
        },
        {
          id: "4",
          name: "Employee Stock Ownership Plan",
          percentage: 5,
          category: "ESOP",
          status: "Active",
        },
        {
          id: "5",
          name: "Other Shareholders",
          percentage: 5,
          category: "Others",
          status: "Active",
        },
      ],
    },
    {
      title: "Ultimate Beneficial Owners",
      columns: [
        { key: "name", label: "UBO Name" },
        { key: "entity", label: "Related Entity" },
        { key: "percentage", label: "Indirect %" },
        { key: "nationality", label: "Nationality" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "Richard Williams",
          entity: "Global Tech Ventures",
          percentage: 35,
          nationality: "American",
          status: "Verified",
        },
        {
          id: "2",
          name: "Sheikh Mohammed Al Nahyan",
          entity: "Abu Dhabi Investments",
          percentage: 100,
          nationality: "Emirati",
          status: "Verified",
        },
        {
          id: "3",
          name: "John Smith",
          entity: "Direct Holding",
          percentage: 15,
          nationality: "British",
          status: "Verified",
        },
      ],
    },
  ],
  legal: [
    {
      title: "Board of Directors",
      columns: [
        { key: "name", label: "Director Name" },
        { key: "position", label: "Position" },
        { key: "representing", label: "Representing" },
        { key: "appointmentDate", label: "Appointment Date" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "Richard Williams",
          position: "Chairman",
          representing: "Global Tech Ventures",
          appointmentDate: "15-Jan-2020",
          status: "Active",
        },
        {
          id: "2",
          name: "Sheikh Mohammed Al Nahyan",
          position: "Vice Chairman",
          representing: "Abu Dhabi Investments",
          appointmentDate: "15-Jan-2020",
          status: "Active",
        },
        {
          id: "3",
          name: "John Smith",
          position: "Executive Director",
          representing: "Founder",
          appointmentDate: "15-Mar-2010",
          status: "Active",
        },
        {
          id: "4",
          name: "Sarah Johnson",
          position: "Director",
          representing: "Global Tech Ventures",
          appointmentDate: "10-Jun-2021",
          status: "Active",
        },
        {
          id: "5",
          name: "Ahmed Al Mansoori",
          position: "Director",
          representing: "Abu Dhabi Investments",
          appointmentDate: "05-Feb-2022",
          status: "Active",
        },
      ],
    },
  ],
  employees: [
    {
      title: "Key Personnel",
      columns: [
        { key: "name", label: "Name" },
        { key: "position", label: "Position" },
        { key: "department", label: "Department" },
        { key: "joinDate", label: "Join Date" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "John Smith",
          position: "Chief Executive Officer",
          department: "Executive",
          joinDate: "15-Mar-2010",
          status: "Active",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          position: "Chief Operations Officer",
          department: "Operations",
          joinDate: "10-May-2012",
          status: "Active",
        },
        {
          id: "3",
          name: "Ahmed Al Mansoori",
          position: "Chief Financial Officer",
          department: "Finance",
          joinDate: "05-Jan-2015",
          status: "Active",
        },
        {
          id: "4",
          name: "Fatima Al Zaabi",
          position: "Chief Technology Officer",
          department: "Technology",
          joinDate: "20-Jul-2016",
          status: "Active",
        },
        {
          id: "5",
          name: "Michael Chen",
          position: "Chief Marketing Officer",
          department: "Marketing",
          joinDate: "12-Nov-2018",
          status: "Active",
        },
        {
          id: "6",
          name: "Layla Al Mazrouei",
          position: "Head of Product",
          department: "Product",
          joinDate: "03-Mar-2019",
          status: "Active",
        },
      ],
    },
  ],
  facilities: [
    {
      title: "Locations",
      columns: [
        { key: "name", label: "Location Name" },
        { key: "type", label: "Type" },
        { key: "address", label: "Address" },
        { key: "size", label: "Size" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "Headquarters",
          type: "Office",
          address: "Level 42, Al Maqam Tower, ADGM Square",
          size: "1,500 sq meters",
          status: "Active",
        },
        {
          id: "2",
          name: "Dubai Office",
          type: "Office",
          address: "Dubai Internet City, Building 12",
          size: "500 sq meters",
          status: "Active",
        },
        {
          id: "3",
          name: "Data Center",
          type: "Technical",
          address: "Khazna Data Center, Masdar City",
          size: "200 sq meters",
          status: "Active",
        },
        {
          id: "4",
          name: "Riyadh Office",
          type: "Office",
          address: "King Fahd Road, Riyadh",
          size: "300 sq meters",
          status: "Pending",
        },
      ],
    },
  ],
  products: [
    {
      title: "Products & Services",
      columns: [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "description", label: "Description" },
        { key: "launchDate", label: "Launch Date" },
        { key: "status", label: "Status" },
      ],
      data: [
        {
          id: "1",
          name: "Enterprise Suite",
          type: "Software",
          description: "Integrated business management platform",
          launchDate: "Jun 2015",
          status: "Active",
        },
        {
          id: "2",
          name: "CloudSync",
          type: "Software",
          description: "Cloud data synchronization solution",
          launchDate: "Mar 2017",
          status: "Active",
        },
        {
          id: "3",
          name: "SecureID",
          type: "Software",
          description: "Identity and access management system",
          launchDate: "Nov 2018",
          status: "Active",
        },
        {
          id: "4",
          name: "DataInsight",
          type: "Software",
          description: "Business intelligence and analytics platform",
          launchDate: "Apr 2019",
          status: "Active",
        },
        {
          id: "5",
          name: "ProcessFlow",
          type: "Software",
          description: "Business process automation tool",
          launchDate: "Sep 2020",
          status: "Active",
        },
        {
          id: "6",
          name: "Implementation Services",
          type: "Service",
          description: "End-to-end deployment and setup",
          launchDate: "Jun 2015",
          status: "Active",
        },
      ],
    },
  ],
};

// Document data for document sections
export const mockDocuments = {
  legal: [
    {
      id: "1",
      name: "Articles of Association.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "15-Mar-2010",
      status: "Approved",
    },
    {
      id: "2",
      name: "Board Resolution - 2023.pdf",
      type: "pdf",
      size: "1.1 MB",
      uploadDate: "10-Jan-2023",
      status: "Approved",
    },
    {
      id: "3",
      name: "Power of Attorney.pdf",
      type: "pdf",
      size: "850 KB",
      uploadDate: "05-Jun-2022",
      status: "Approved",
    },
    {
      id: "4",
      name: "Shareholders Agreement.pdf",
      type: "pdf",
      size: "3.2 MB",
      uploadDate: "15-Mar-2010",
      status: "Approved",
    },
  ],
  licensing: [
    {
      id: "1",
      name: "Commercial License.pdf",
      type: "pdf",
      size: "1.5 MB",
      uploadDate: "31-Dec-2022",
      status: "Approved",
    },
    {
      id: "2",
      name: "Software Provider License.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "15-Jul-2022",
      status: "Approved",
    },
    {
      id: "3",
      name: "Data Center Operations License.pdf",
      type: "pdf",
      size: "980 KB",
      uploadDate: "20-Aug-2022",
      status: "Approved",
    },
    {
      id: "4",
      name: "Cloud Services Provider License.pdf",
      type: "pdf",
      size: "1.1 MB",
      uploadDate: "05-Sep-2022",
      status: "Pending",
    },
  ],
  ownership: [
    {
      id: "1",
      name: "UBO Declaration Form.pdf",
      type: "pdf",
      size: "1.8 MB",
      uploadDate: "10-Jan-2023",
      status: "Approved",
    },
    {
      id: "2",
      name: "Share Certificate - Global Tech Ventures.pdf",
      type: "pdf",
      size: "950 KB",
      uploadDate: "15-Mar-2010",
      status: "Approved",
    },
    {
      id: "3",
      name: "Share Certificate - Abu Dhabi Investments.pdf",
      type: "pdf",
      size: "950 KB",
      uploadDate: "15-Mar-2010",
      status: "Approved",
    },
    {
      id: "4",
      name: "Share Certificate - John Smith.pdf",
      type: "pdf",
      size: "950 KB",
      uploadDate: "15-Mar-2010",
      status: "Approved",
    },
    {
      id: "5",
      name: "ESOP Documentation.pdf",
      type: "pdf",
      size: "2.5 MB",
      uploadDate: "20-Jun-2018",
      status: "Approved",
    },
  ],
  compliance: [
    {
      id: "1",
      name: "ISO 27001 Certificate.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "15-Jun-2022",
      status: "Approved",
    },
    {
      id: "2",
      name: "ISO 9001 Certificate.pdf",
      type: "pdf",
      size: "1.1 MB",
      uploadDate: "15-Jun-2022",
      status: "Approved",
    },
    {
      id: "3",
      name: "Data Protection Registration.pdf",
      type: "pdf",
      size: "1.5 MB",
      uploadDate: "10-Jan-2023",
      status: "Approved",
    },
    {
      id: "4",
      name: "Annual Compliance Report 2022.pdf",
      type: "pdf",
      size: "3.5 MB",
      uploadDate: "28-Feb-2023",
      status: "Approved",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "UAE Innovation Award Certificate.jpg",
      type: "image",
      size: "1.8 MB",
      uploadDate: "15-Dec-2022",
      status: "Approved",
    },
    {
      id: "2",
      name: "GITEX Future Stars Award.jpg",
      type: "image",
      size: "2.1 MB",
      uploadDate: "18-Oct-2022",
      status: "Approved",
    },
    {
      id: "3",
      name: "Microsoft Gold Partner Certificate.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "10-Jan-2023",
      status: "Approved",
    },
    {
      id: "4",
      name: "AWS Advanced Consulting Partner Certificate.pdf",
      type: "pdf",
      size: "1.3 MB",
      uploadDate: "05-Feb-2023",
      status: "Approved",
    },
  ],
};
