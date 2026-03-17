import type { GlossaryTerm } from './glossaryData'

export interface AgileLayerCategory {
  id: string
  label: string
  color: string
}

export const AGILE_LAYERS: AgileLayerCategory[] = [
  { id: 'all', label: 'All', color: 'gray' },
  { id: 'd6', label: 'D6 – Digital Accelerators (Tools)', color: 'indigo' },
  { id: 'd5', label: 'D5 – Digital Workers & Workspace', color: 'teal' },
  { id: 'd4', label: 'D4 – Digital Transformation', color: 'purple' },
  { id: 'd3', label: 'D3 – Digital Business Platform', color: 'blue' },
  { id: 'd2', label: 'D2 – Digital Cognitive Organisation', color: 'green' },
  { id: 'd1', label: 'D1 – Digital Economy', color: 'orange' },
]

export const agileLayerColors: Record<string, string> = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
}

export const agile6xdTerms: GlossaryTerm[] = [
  // D1 – Digital Economy
  {
    id: 'd1-digital-economy',
    term: 'D1 – Digital Economy (DE)',
    explanation:
      'Explains why organisations must change by understanding shifts in market logic, customer behaviour, and value creation in the digital economy.',
    categories: ['d1'],
    tags: ['Why change', 'Market logic', 'Digital economy'],
    letter: 'D',
  },

  // D2 – Digital Cognitive Organisation
  {
    id: 'd2-dco',
    term: 'D2 – Digital Cognitive Organisation (DCO)',
    explanation:
      'Defines where organisations are headed by designing intelligent, adaptive, and orchestrated enterprises that can sense and respond.',
    categories: ['d2'],
    tags: ['Future organisation', 'Cognitive', 'Adaptive'],
    letter: 'D',
  },

  // D3 – Digital Business Platform
  {
    id: 'd3-dbp',
    term: 'D3 – Digital Business Platform (DBP)',
    explanation:
      'Describes what must be built – the integrated, modular, and data-driven platforms that power transformation at scale.',
    categories: ['d3'],
    tags: ['Platforms', 'Data', 'Architecture'],
    letter: 'D',
  },

  // D4 – Digital Transformation 2.0
  {
    id: 'd4-dt2',
    term: 'D4 – Digital Transformation 2.0 (DT2.0)',
    explanation:
      'Defines how transformation should be designed and deployed using disciplined methods, flows, and governance.',
    categories: ['d4'],
    tags: ['Transformation', 'Methods', 'Governance'],
    letter: 'D',
  },

  // D5 – Digital Worker & Workspace / DWS
  {
    id: 'dws',
    term: 'DWS (Digital Workspace)',
    explanation:
      'DWS is a centralized internal platform that brings together tools, services, learning, communication, and workflows into a single, unified experience for DigitalQatalyst associates.',
    categories: ['d5'],
    tags: ['DWS', 'Digital Workspace', 'Platform'],
    letter: 'D',
  },

  // D6 – Digital Accelerators (Tools)
  {
    id: 'd6-tools',
    term: 'D6 – Digital Accelerators (Tools)',
    explanation:
      'Defines when value will be realised through structured toolkits, blueprints, and accelerators that compress time-to-value.',
    categories: ['d6'],
    tags: ['Tools', 'Accelerators', 'Time-to-value'],
    letter: 'D',
  },
]
