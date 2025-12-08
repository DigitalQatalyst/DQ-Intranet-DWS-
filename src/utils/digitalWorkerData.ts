/**
 * Digital Worker Services Data Configuration
 * 
 * This file contains structured data for Digital Worker services in the Services Center.
 * Designed to be easily migrated to a database in the future.
 */

export interface DigitalWorkerService {
  id: string;
  title: string;
  description: string;
  category: string;
  serviceDomains: string[];
  aiMaturityLevel: string;
  serviceType: string;
  serviceMode: string;
  keyHighlights: string[];
  about: {
    overview: string;
  };
  requirements: string[];
  tools: string[];
  sampleUseCase: {
    steps: string[];
  };
  provider: {
    name: string;
    logoUrl: string;
    description: string;
  };
}

/**
 * Digital Worker Services Database
 * Each service's data is structured for easy database migration
 */
export const DIGITAL_WORKER_SERVICES: Record<string, DigitalWorkerService> = {
  'portfolio-analysis': {
    id: 'dw-001',
    title: 'Portfolio Analysis',
    description: 'Service strategists use ChatGPT/Copilot to analyze service performance data and generate insights.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_1',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'Strategists copy/paste service data into AI for analysis',
      'AI identifies patterns and generates summary insights',
      'Recommendations reviewed and validated by humans',
      'No direct integration with service data sources',
    ],
    about: {
      overview: 'This service empowers service strategists to leverage Large Language Models (LLMs) for ad-hoc analysis of service portfolio data. By exporting data from traditional systems like Excel or ITSM tools and feeding it into secure enterprise instances of ChatGPT or Microsoft Copilot, strategists can rapidly identify cost anomalies, satisfaction trends, and performance gaps.\n\nUnlike traditional BI tools that require complex query building, this solution allows users to ask questions in natural language, such as "Which services have seen the highest cost increase relative to customer satisfaction drops in Q3?" The AI analyzes the provided dataset, identifies patterns that might be missed by human review, and generates summary insights and visualization suggestions. This level of maturity focuses on augmenting the human strategist\'s capabilities without direct system integration.',
    },
    requirements: [
      'Enterprise license for Generative AI tools to ensure data privacy and prevent leakage',
      'Access to exportable service data (Cost, CSAT, SLA performance) in structured formats (CSV/Excel)',
      'Governance policy regarding the upload of internal operational data to AI models',
      'Basic training on prompt engineering for service strategists',
    ],
    tools: [
      'ChatGPT Enterprise',
      'Microsoft Copilot',
      'Microsoft Excel',
      'Tableau (Optional for viz)',
    ],
    sampleUseCase: {
      steps: [
        'Service strategist exports service cost and satisfaction data for 50 services to Excel',
        'Copies data into ChatGPT with prompt: "Analyze this enterprise service portfolio. Identify services where Cost Per Ticket is >$50 but CSAT is <4.0. Suggest 3 reasons why based on the comments column."',
        'AI identifies "Desktop Support" has 2x higher cost-per-ticket than industry benchmark and correlates it with "Long wait times" in comments',
        'Strategist uses this insight to launch a targeted investigation',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'portfolio-intelligence': {
    id: 'dw-002',
    title: 'Portfolio Intelligence',
    description: 'AI embedded in portfolio management platform continuously analyzes service performance.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_2',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI integrated directly into service portfolio management tool',
      'Continuous monitoring of service metrics',
      'Automated anomaly detection',
      'Proactive recommendations surfaced in dashboard',
    ],
    about: {
      overview: 'This service moves beyond manual data exports by integrating AI directly into the Service Portfolio Management (SPM) platform. An embedded AI engine continuously monitors real-time service metrics—such as availability, cost trends, and user sentiment—against defined thresholds and historical baselines.\n\nThe system acts as an "always-on" analyst. When it detects an anomaly, such as a sudden spike in licensing costs for a specific software service that doesn\'t match usage growth, it proactively surfaces this finding in the portfolio dashboard. It moves from reactive analysis to proactive notification, ensuring that portfolio managers are alerted to issues before they become quarterly budget problems.',
    },
    requirements: [
      'Mature Service Portfolio Management (SPM) implementation with accurate data',
      'Integration between financial management, asset management, and service management data sources',
      'Defined KPIs and baselines for all critical services',
      'Role-based access control to allow AI to read cross-functional data',
    ],
    tools: [
      'ServiceNow SPM',
      'Integrated AI/ML module (e.g., ServiceNow Predictive Intelligence)',
      'Real-time data feeds from ITOM/ITAM',
    ],
    sampleUseCase: {
      steps: [
        'AI platform monitors 50 enterprise services continuously',
        'Detects "Mobile Device Management" cost increased 35% year-over-year while user satisfaction dropped by 15%',
        'AI correlates this with a recent vendor pricing change and increased incident volume',
        'AI recommends: "Renegotiate vendor contract based on SLA breaches" and "Create troubleshooting articles for new mobile OS update"',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'portfolio-optimization': {
    id: 'dw-003',
    title: 'Portfolio Optimization',
    description: 'Unified AI platform orchestrates end-to-end service portfolio strategy integrating enterprise data.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_3',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI accesses unified enterprise knowledge graph',
      'Continuously evaluates entire service portfolio holistically',
      'Simulates portfolio scenarios against strategic objectives',
      'Agentic AI can request additional data',
    ],
    about: {
      overview: 'At the Unified Operations level, this service deploys a persistent AI engine that sits atop the entire enterprise service portfolio, utilizing a Unified Enterprise Knowledge Graph. This graph connects data from Finance (SAP/Oracle), HR (Workday), IT Service Management (ServiceNow), and Strategy (Jira Align) to form a holistic view of the business.\n\nThe AI doesn\'t just monitor; it simulates. It runs thousands of "what-if" scenarios to optimize the portfolio against conflicting strategic objectives—such as "Reduce IT spend by 10%" vs "Increase Employee Experience by 15%". It identifies redundant capabilities across business units and suggests consolidation strategies. It acts as an orchestrator, capable of agentic behaviors to request missing data from data owners to refine its models.',
    },
    requirements: [
      'Unified Data Model or Knowledge Graph connecting siloed enterprise data',
      'High data quality scores (>90%) across Finance, HR, and IT domains',
      'Strategic objectives quantified as mathematical constraints (e.g., "Cost < $10M")',
      'Cross-functional data governance council to manage AI data access',
    ],
    tools: [
      'Enterprise AI Platform (e.g., C3.ai, Palantir Foundry)',
      'Enterprise Knowledge Graph',
      'Portfolio Optimization Engine',
    ],
    sampleUseCase: {
      steps: [
        'Following an acquisition, AI pulls data from 15+ systems across both parent and acquired companies',
        'Runs 50,000 portfolio scenarios varying investment allocations to maximize synergy',
        'Identifies 7 redundant CRM instances and 3 overlapping HR platforms',
        'Recommends strategy: "Retire 5 legacy services, Invest in 8 high-growth apps, Consolidate 7 CRMs to 3"',
        'AI generates executive presentation showing projected 197% ROI over 3 years',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'strategy-advisor': {
    id: 'dw-004',
    title: 'Strategy Advisor',
    description: 'AI operates as a strategic partner, engaging in strategic dialogue and challenging assumptions.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_4',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI participates in strategy sessions as "virtual board member"',
      'Challenges strategic assumptions with data',
      'Proposes alternative strategic scenarios',
      'Makes autonomous investment decisions up to $500K',
    ],
    about: {
      overview: 'This service introduces a "Cognitive AI Partner" that participates in strategy sessions alongside human executives. Utilizing advanced reasoning models and Chain-of-Thought processing, the AI acts as a virtual board member. It listens to strategic proposals and challenges them based on historical data, market trends, and predictive modeling.\n\nFor example, if a CIO proposes a consolidation strategy, the AI might interject (via chat or voice) to point out that similar initiatives in the industry had a 60% failure rate due to culture clash, citing specific case studies. It proposes alternative scenarios and can be authorized to make autonomous low-risk investment decisions (e.g., renewing standard software licenses under a certain threshold) to free up human attention for complex innovation.',
    },
    requirements: [
      'Digitized strategy documents and historical decision logs for AI training',
      '"Human-in-the-loop" framework defined for autonomous decisions',
      'Cultural readiness for executives to be "challenged" by an algorithm',
      'Legal/Compliance framework for AI-authorized spending',
    ],
    tools: [
      'Advanced Conversational AI (GPT-4o / Claude 3 Opus)',
      'Decision Audit System',
      'Real-time Voice/Meeting Integration (Microsoft Teams Intelligent Recap)',
    ],
    sampleUseCase: {
      steps: [
        'Human CIO presents FY25 strategy: "Consolidate all marketing services to single global platform"',
        'AI Advisor challenges: "Historical data shows global platform consolidations achieve 12% savings, not the projected 30%. Risk of regional compliance failure is high in EU markets"',
        'AI proposes "Hybrid Approach" with regional hubs, projecting lower risk and 22% cost reduction',
        'CIO debates the assumption with AI; AI updates model live',
        'CIO approves hybrid approach; AI autonomously initiates Phase 1 scoping project',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'autonomous-strategy': {
    id: 'dw-005',
    title: 'Autonomous Strategy',
    description: 'AI autonomously discovers, designs, tests, and launches new services with minimal human intervention.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_5',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI continuously scans for unmet customer needs',
      'Designs new service concepts autonomously',
      'Tests services in digital twin environment',
      'Executes pilot programs and scales successes',
    ],
    about: {
      overview: 'At the highest maturity level, the service ecosystem becomes self-evolving. The AI continuously scans the environment—internal employee behavior, external market trends, and customer sentiment—to identify unmet needs. When a need is detected, the AI doesn\'t just report it; it acts.\n\nIt uses Generative AI to design a new service concept, pricing model, and technical architecture. It then spins up a "Digital Twin" of the organization to simulate the service\'s impact. If the simulation is positive, it autonomously provisions the necessary infrastructure and launches a pilot program to a segment of users. It gathers feedback, iterates on the design, and scales the service if successful, or retires it if not—all with zero human intervention in the loop, only human oversight of the outcomes.',
    },
    requirements: [
      'Fully automated infrastructure provisioning',
      'High organizational risk tolerance for "Fail Fast" experiments',
      'Digital Twin covering processes, people, and technology',
      'Outcome-based governance model (manage results, not methods)',
    ],
    tools: [
      'Enterprise Digital Twin',
      'Automated Cloud Provisioning (IaC)',
      'A/B Testing Platforms',
      'Autonomous Agent Swarm',
    ],
    sampleUseCase: {
      steps: [
        'AI detects pattern in unstructured feedback: Remote workers in APAC region struggle with VPN latency and equipment setup',
        'AI designs "APAC Remote Work Concierge" service concept, including local equipment depots and a split-tunneling VPN profile',
        'AI simulates service in digital twin; predicts 40% productivity gain',
        'AI runs live pilot with 100 volunteers in Singapore',
        'Based on pilot success (4.8/5 CSAT), AI autonomously updates global service catalog and scales service to all APAC employees',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'requirements-elicitation': {
    id: 'dw-006',
    title: 'Requirements Elicitation',
    description: 'Requirements analysts use AI to prepare questions, analyze inputs, and draft documentation.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_1',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI helps generate interview questions',
      'Analysts paste meeting transcripts for summarization',
      'AI suggests requirements based on input',
      'AI drafts standard requirement documents',
    ],
    about: {
      overview: 'This service assists Business Analysts (BAs) and Product Owners in the often laborious process of gathering and documenting requirements. By utilizing LLMs, analysts can generate comprehensive interview scripts tailored to specific stakeholders (e.g., "Technical questions for the Network Admin" vs "Usability questions for the End User").\n\nPost-interview, the analyst can feed raw transcripts or rough notes into the AI to auto-generate structured requirement documents, user stories, and acceptance criteria. This reduces the "blank page" problem and ensures consistent formatting across the organization.',
    },
    requirements: [
      'Access to meeting transcription software',
      'Standardized templates for requirements documents',
      'Training on how to anonymize sensitive PII before pasting into AI',
    ],
    tools: [
      'ChatGPT/Claude',
      'Meeting transcription tools (Otter.ai/Teams)',
      'Microsoft Word/Excel',
    ],
    sampleUseCase: {
      steps: [
        'Analyst copies transcript of stakeholder interview into ChatGPT',
        'AI extracts functional/non-functional requirements and identifies a conflict between "instant provisioning" and "security scanning"',
        'AI drafts full requirements document in 30 minutes',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },

  'design-automation': {
    id: 'dw-007',
    title: 'Design Automation',
    description: 'Platform with integrated AI generates service designs, applies standards, and validates quality.',
    category: 'Digital Worker',
    serviceDomains: ['backoffice_operations'],
    aiMaturityLevel: 'level_2',
    serviceType: 'Query',
    serviceMode: 'Online',
    keyHighlights: [
      'AI generates complete service designs from requirements',
      'Automatically applies enterprise architecture patterns',
      'Validates against security and compliance policies',
      'Identifies reusable components',
    ],
    about: {
      overview: 'This service integrates AI into the design toolchain. When a designer inputs a set of high-level requirements (e.g., "I need a secure, high-availability web service for 10k concurrent users"), the AI accesses the organization\'s Enterprise Architecture repository.\n\nIt then automatically generates a candidate technical design, selecting the approved patterns, reusable components, and security controls that match the request. It validates this design against compliance policies (e.g., GDPR, ISO27001) in real-time, flagging potential issues before a single line of code is written or infrastructure is provisioned.',
    },
    requirements: [
      'Digitized Enterprise Architecture standards and patterns',
      'Library of reusable software/infrastructure components',
      'Defined security and compliance policies in machine-readable format (Policy-as-Code)',
    ],
    tools: [
      'Design automation platform',
      'Enterprise architecture repository (LeanIX)',
      'Validation engine',
    ],
    sampleUseCase: {
      steps: [
        'Designer inputs requirements for "Real-Time Analytics Dashboard"',
        'AI generates 35-page design doc, selects Azure microservices architecture, and reuses 3 existing components',
        'AI flags PII data handling warning',
        'Total design time: 3 days vs 3-4 weeks',
      ],
    },
    provider: {
      name: 'Digital Worker',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Worker services provide AI-powered automation and intelligent assistance across the enterprise.',
    },
  },
};

/**
 * Helper function to get Digital Worker service by ID
 */
export const getDigitalWorkerServiceById = (serviceId: string): DigitalWorkerService | undefined => {
  return Object.values(DIGITAL_WORKER_SERVICES).find(service => service.id === serviceId);
};

/**
 * Helper function to get all Digital Worker services
 */
export const getAllDigitalWorkerServices = (): DigitalWorkerService[] => {
  return Object.values(DIGITAL_WORKER_SERVICES);
};

