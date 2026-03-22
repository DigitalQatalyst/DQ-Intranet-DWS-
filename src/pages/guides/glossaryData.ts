export interface GlossaryCategory {
  id: string
  label: string
  color: string
}

// Golden Hexa Core (GHC) dimensions
export const CATEGORIES: GlossaryCategory[] = [
  { id: 'all', label: 'All', color: 'gray' },
  { id: 'ghc-vision', label: 'The Vision (Purpose)', color: 'blue' },
  { id: 'ghc-hov', label: 'The HoV (Culture)', color: 'green' },
  { id: 'ghc-personas', label: 'The Personas (Identity)', color: 'purple' },
  { id: 'ghc-tms', label: 'Agile TMS (Tasks)', color: 'teal' },
  { id: 'ghc-sos', label: 'Agile SoS (Governance)', color: 'orange' },
  { id: 'ghc-flows', label: 'Agile Flows (Value Streams)', color: 'indigo' },
  { id: 'ghc-6xd', label: 'Agile 6xD (Products)', color: 'pink' },
]

export const categoryColors: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  pink: 'bg-pink-50 border-pink-200 text-pink-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
}

export interface GlossaryTerm {
  id: string
  term: string
  shortIntro?: string // 1-2 line friendly intro/story
  explanation: string
  categories: string[] // Legacy, kept for compatibility
  // New two-level filter structure
  knowledgeSystem?: 'ghc' | '6xd' // PRIMARY: GHC or 6xD (optional for backward compatibility)
  ghcDimension?: string // GHC Dimension (if knowledgeSystem === 'ghc')
  ghcTermType?: string // GHC Term Type (if knowledgeSystem === 'ghc')
  sixXdDimension?: string // 6xD Dimension (if knowledgeSystem === '6xd') - lifecycle stages
  sixXdTermType?: string // 6xD Term Type (if knowledgeSystem === '6xd')
  sixXdPerspective?: string // 6xD Perspective (if knowledgeSystem === '6xd') - the six essential perspectives
  // Shared filters
  termOrigin?: 'dq-term' | 'market-standard' // DQ Term or Market/Standard Term
  usedIn?: string[] // Context filter: DWS, QDBP, etc.
  whoUsesIt?: string[] // Who Uses It filter
  tags: string[]
  examples?: string[]
  relatedTerms?: string[]
  letter: string
  marketDefinition?: string // Market definition if applicable
  useCases?: string[] // Practical examples
}

export const glossaryTerms: GlossaryTerm[] = [
  // GHC: The Vision (Purpose)
  {
    id: 'dq-vision',
    term: 'DQ Vision',
    shortIntro: 'The long-term aspirational goal that guides all of DQ\'s digital transformation efforts.',
    explanation: 'The long-term aspirational goal that DQ aims to achieve through digital transformation, providing direction and motivation for all initiatives.',
    categories: ['ghc-vision'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'vision',
    ghcTermType: 'core-concept',
    termOrigin: 'dq-term',
    usedIn: ['planning-governance', 'learning-enablement'],
    whoUsesIt: ['leadership', 'delivery'],
    tags: ['Vision', 'Strategy', 'Digital Transformation'],
    examples: [
      'Leading the $20 trillion global digital economy by 2030',
      'Enabling organizations to become Digital Cognitive Organizations'
    ],
    relatedTerms: ['dq-mission', 'digital-destination'],
    letter: 'D'
  },
  {
    id: 'dq-mission',
    term: 'DQ Mission',
    explanation: 'The core purpose and reason for DQ\'s existence, defining what we do, who we serve, and how we create value.',
    categories: ['ghc-vision'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'vision',
    ghcTermType: 'core-concept',
    termOrigin: 'dq-term',
    tags: ['Mission', 'Purpose', 'Strategy'],
    relatedTerms: ['dq-vision', 'digital-mission'],
    letter: 'D'
  },
  {
    id: 'digital-destination',
    term: 'Digital Destination',
    explanation: 'The end goal or target state that an organization aims to achieve through its digital transformation efforts.',
    categories: ['ghc-vision'],
    tags: ['Digital Transformation', 'Strategy', 'Goals'],
    relatedTerms: ['dq-vision', 'digital-journey'],
    letter: 'D'
  },

  // GHC: The HoV (Culture)
  {
    id: 'hov',
    term: 'House of Values (HoV)',
    shortIntro: 'DQ\'s culture system that shapes how we work, grow, and create value together.',
    explanation: 'DQ\'s culture system made up of three mantras: Self-Development, Lean Working, and Value Co-Creation, reinforced by 12 guiding values.',
    categories: ['ghc-hov'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'hov',
    ghcTermType: 'core-concept',
    termOrigin: 'dq-term',
    usedIn: ['dws', 'learning-enablement'],
    whoUsesIt: ['leadership', 'delivery', 'new-joiners'],
    tags: ['Culture', 'Values', 'HoV', 'Behavior'],
    examples: [
      'Self-Development: We grow ourselves and others through every experience',
      'Lean Working: We pursue clarity, efficiency, and prompt outcomes',
      'Value Co-Creation: We partner with others to create greater impact'
    ],
    relatedTerms: ['self-development', 'lean-working', 'value-co-creation'],
    letter: 'H'
  },
  {
    id: 'self-development',
    term: 'Self-Development',
    explanation: 'A HoV mantra reinforcing that growth is not passive—it\'s a daily responsibility, emphasizing emotional intelligence and a growth mindset.',
    categories: ['ghc-hov'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'hov',
    ghcTermType: 'behaviour-practice',
    termOrigin: 'dq-term',
    tags: ['HoV', 'Culture', 'Growth', 'Learning'],
    relatedTerms: ['hov', 'lean-working'],
    letter: 'S'
  },
  {
    id: 'lean-working',
    term: 'Lean Working',
    explanation: 'A HoV mantra focused on protecting momentum and reducing waste through purpose, perceptiveness, proactivity, perseverance, and precision.',
    categories: ['ghc-hov'],
    tags: ['HoV', 'Culture', 'Efficiency', 'Process'],
    relatedTerms: ['hov', 'self-development'],
    letter: 'L'
  },
  {
    id: 'value-co-creation',
    term: 'Value Co-Creation',
    explanation: 'A HoV mantra emphasizing collaboration as how we scale intelligence, focusing on customer, learning, collaboration, responsibility, and trust.',
    categories: ['ghc-hov'],
    tags: ['HoV', 'Culture', 'Collaboration', 'Partnership'],
    relatedTerms: ['hov', 'self-development'],
    letter: 'V'
  },

  // GHC: The Personas (Identity)
  {
    id: 'personas',
    term: 'The Personas (Identity)',
    explanation: 'Defines who we are at DQ, representing the roles, skills, and characteristics that shape how Qatalysts show up and collaborate.',
    categories: ['ghc-personas'],
    tags: ['Identity', 'Personas', 'Roles', 'Skills'],
    relatedTerms: ['ghc', 'digital-worker'],
    letter: 'P'
  },
  {
    id: 'qatalyst',
    term: 'Qatalyst',
    explanation: 'A DQ associate who embodies the organization\'s values, competencies, and ways of working to drive digital transformation.',
    categories: ['ghc-personas'],
    tags: ['Identity', 'People', 'Associates'],
    relatedTerms: ['personas', 'ghc'],
    letter: 'Q'
  },

  // GHC: Agile SoS (Governance)
  {
    id: 'agile-sos',
    term: 'Agile SOS (Governance)',
    explanation: 'Agile System of Governance that defines how DQ governs operations, ensuring effective management, quality standards, and value delivery.',
    categories: ['ghc-sos'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'agile-sos',
    ghcTermType: 'principle',
    termOrigin: 'dq-term',
    tags: ['Governance', 'SOS', 'Management', 'Quality'],
    examples: [
      'System of Governance (SoG)',
      'System of Quality (SoQ)',
      'System of Value (SoV)',
      'System of Discipline (SoD)'
    ],
    relatedTerms: ['sog', 'soq', 'sov', 'sod'],
    letter: 'A'
  },
  {
    id: 'sog',
    term: 'System of Governance (SoG)',
    explanation: 'The framework of rules, practices, and processes used to direct and manage DQ, defining roles and ensuring decisions align with stakeholder interests.',
    categories: ['ghc-sos'],
    tags: ['Governance', 'SoG', 'Management'],
    relatedTerms: ['agile-sos', 'soq'],
    letter: 'S'
  },
  {
    id: 'soq',
    term: 'System of Quality (SoQ)',
    explanation: 'A structured approach ensuring DQ\'s products, services, and processes consistently meet defined quality standards for customer satisfaction and operational excellence.',
    categories: ['ghc-sos'],
    tags: ['Quality', 'SoQ', 'Standards'],
    relatedTerms: ['agile-sos', 'sog'],
    letter: 'S'
  },
  {
    id: 'sov',
    term: 'System of Value (SoV)',
    explanation: 'A framework defining principles and processes used to create, deliver, and measure value for stakeholders, ensuring efficiency and innovation.',
    categories: ['ghc-sos'],
    tags: ['Value', 'SoV', 'Stakeholders'],
    relatedTerms: ['agile-sos', 'soq'],
    letter: 'S'
  },
  {
    id: 'sod',
    term: 'System of Discipline (SoD)',
    explanation: 'Rules, procedures, and processes maintaining order, accountability, and adherence to organizational policies within DQ.',
    categories: ['ghc-sos'],
    tags: ['Discipline', 'SoD', 'Accountability'],
    relatedTerms: ['agile-sos', 'sog'],
    letter: 'S'
  },

  // GHC: Agile TMS (Tasks) – DWS
  {
    id: 'dws',
    term: 'DWS (Digital Workspace)',
    shortIntro: 'The primary digital workspace where DQ associates execute, collaborate, and manage work.',
    explanation:
      "DWS is a centralized internal platform that brings together tools, services, learning, communication, and workflows into a single, unified experience for DigitalQatalyst associates. It serves as the primary entry point for getting work done at DQ, replacing the need to navigate multiple disconnected systems.",
    categories: ['ghc-tms'],
    knowledgeSystem: '6xd',
    sixXdDimension: 'deliver',
    sixXdTermType: 'platform-product',
    termOrigin: 'dq-term',
    usedIn: ['dws', 'governance-reviews', 'learning-enablement'],
    whoUsesIt: ['delivery', 'leadership', 'new-joiners'],
    tags: ['DWS', 'Digital Workspace', 'Platform', 'Employee Experience'],
    examples: [
      'DWS simplifies the employee experience by reducing fragmentation across tools and processes, acting as a single source of truth for services, requests, learning, and collaboration.',
      'Associates use DWS to discover internal services, submit requests, access learning resources, stay informed, and collaborate—without switching between multiple platforms.',
      'DWS improves productivity by centralizing access to tools, requests, and information, so associates spend less time searching and more time delivering value.',
      'DWS accelerates onboarding through a guided, role-aware workspace and enables scale by allowing new services, AI tools, and marketplaces to be added seamlessly.'
    ],
    relatedTerms: ['dws-workspace', 'agile-tms', 'digital-workspace', 'digital-worker'],
    letter: 'D'
  },
  {
    id: 'dws-workspace',
    term: 'DWS.1 Digital Work Space',
    explanation: 'The digital environment where work is structured, organized, and executed, enabling seamless collaboration across teams and functions.',
    categories: ['ghc-tms'],
    tags: ['DWS', 'Workspace', 'Digital Environment'],
    relatedTerms: ['dws', 'agile-tms'],
    letter: 'D'
  },
  {
    id: 'agile-tms',
    term: 'Agile TMS (Tasks)',
    shortIntro: 'The system that defines how DQ organizes and executes work, from tasks to workflows.',
    explanation: 'Agile Task Management System that defines how we work, organizing tasks, workflows, and delivery processes for efficient execution.',
    categories: ['ghc-tms'],
    knowledgeSystem: 'ghc',
    ghcDimension: 'agile-tms',
    ghcTermType: 'principle',
    termOrigin: 'dq-term',
    usedIn: ['dws', 'delivery-projects', 'governance-reviews'],
    whoUsesIt: ['delivery', 'agile-transformation', 'engineering'],
    tags: ['Agile', 'TMS', 'Tasks', 'Work Management'],
    relatedTerms: ['dws', 'agile-flows'],
    letter: 'A'
  },
  {
    id: 'agile-flows',
    term: 'Agile Flows (Value Streams)',
    explanation: 'Agile value streams that define how we orchestrate work, ensuring efficient flow of value from concept to delivery.',
    categories: ['ghc-flows'],
    tags: ['Agile', 'Flows', 'Value Streams', 'Orchestration'],
    relatedTerms: ['agile-tms', 'dws'],
    letter: 'A'
  },

  // GHC: The Personas (Identity) / Workspace
  {
    id: 'digital-workspace',
    term: 'Digital Workspace',
    explanation: 'A digitally enabled environment that supports collaboration, productivity, and seamless work execution across physical and virtual boundaries.',
    categories: ['ghc-personas'],
    tags: ['Workspace', 'Digital Environment', 'Collaboration'],
    relatedTerms: ['dws-workspace', 'digital-worker'],
    letter: 'D'
  },
  {
    id: 'digital-worker',
    term: 'Digital Worker',
    explanation: 'An individual equipped with digital skills, tools, and knowledge to effectively deliver and sustain transformation in a digital-first environment.',
    categories: ['ghc-personas'],
    tags: ['Worker', 'Skills', 'Digital', 'DW·WS'],
    relatedTerms: ['digital-workspace', 'personas'],
    letter: 'D'
  },

  // GHC: Agile TMS (Tasks) – Automation
  {
    id: 'automation',
    term: 'DWS Automation',
    explanation: 'Automated processes and workflows that streamline operations, reduce manual effort, and accelerate delivery across DWS platforms.',
    categories: ['ghc-tms'],
    tags: ['Automation', 'DWS', 'Efficiency', 'Workflows'],
    relatedTerms: ['dws', 'agile-tms'],
    letter: 'A'
  },

  // GHC: Agile Flows (Value Streams) – Delivery
  {
    id: 'delivery',
    term: 'DWS Delivery',
    explanation: 'The processes and systems that ensure efficient, quality delivery of digital work solutions, from planning to execution and completion.',
    categories: ['ghc-flows'],
    tags: ['Delivery', 'DWS', 'Execution', 'Quality'],
    relatedTerms: ['agile-tms', 'agile-flows'],
    letter: 'D'
  },

  // GHC: Framework overview & Products
  {
    id: 'ghc',
    term: 'Golden Honeycomb of Competence (GHC)',
    explanation: 'DQ\'s core competency model representing key interconnected competencies. The central hexagon is "The Vision" surrounded by six hexagons: HoV, Personas, Agile TMS, Agile SOS, Agile Flows, and Agile 6xD.',
    categories: ['ghc-vision'],
    tags: ['GHC', 'Competence', 'Framework', 'Vision'],
    examples: [
      'The Vision (Purpose) - Why we exist',
      'The HoV (Culture) - How we behave',
      'The Personas (Identity) - Who we are',
      'Agile TMS (Tasks) - How we work',
      'Agile SOS (Governance) - How we govern',
      'Agile Flows (Value Streams) - How we orchestrate',
      'Agile 6xD (Products) - What we offer'
    ],
    relatedTerms: ['hov', 'personas', 'agile-sos', 'agile-6xd'],
    letter: 'G'
  },
  {
    id: 'agile-6xd',
    term: 'Agile 6×D (Products)',
    explanation: 'DQ\'s six essential perspectives for designing, building, and delivering digital products: D1 Digital Economy, D2 DCO, D3 DBP, D4 DT2.0, D5 DW·WS, and D6 Digital Accelerators.',
    categories: ['ghc-6xd'],
    tags: ['6xD', 'Products', 'Framework', 'Digital Transformation'],
    examples: [
      'D1: Why should organisations change?',
      'D2: Where are organisations headed?',
      'D3: What must be built?',
      'D4: How should transformation be designed?',
      'D5: Who delivers the change?',
      'D6: When will value be realised?'
    ],
    relatedTerms: ['ghc', 'digital-destination'],
    letter: 'A'
  },
  {
    id: 'digital-journey',
    term: 'Digital Journey',
    explanation: 'The process an organization undergoes to transition from traditional operations to a digitally transformed state, involving technology adoption, business model changes, and cultural evolution.',
    categories: ['ghc-vision'],
    tags: ['Journey', 'Transformation', 'Process'],
    relatedTerms: ['digital-destination', 'dq-vision'],
    letter: 'D'
  },
]

