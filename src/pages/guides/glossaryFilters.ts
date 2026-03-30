// Glossary Filter Options

export interface FilterOption {
  id: string
  name: string
}

// PRIMARY FILTER: Knowledge System
export const KNOWLEDGE_SYSTEMS: FilterOption[] = [
  { id: 'ghc', name: 'Golden Honeycomb of Competence (GHC)' },
  { id: '6xd', name: 'Agile 6xD' },
]

// GHC Dimension (Secondary - shown when GHC selected)
export const GHC_DIMENSIONS: FilterOption[] = [
  { id: 'vision', name: 'Vision (Purpose)' },
  { id: 'hov', name: 'HoV (Culture)' },
  { id: 'personas', name: 'Personas (Identity)' },
  { id: 'agile-tms', name: 'Agile TMS (Tasks)' },
  { id: 'agile-sos', name: 'Agile SoS (Governance)' },
  { id: 'agile-flows', name: 'Agile Flows (Value Streams)' },
]

// GHC Term Type (Secondary - shown when GHC selected)
export const GHC_TERM_TYPES: FilterOption[] = [
  { id: 'core-concept', name: 'Core Concept' },
  { id: 'competency', name: 'Competency' },
  { id: 'behaviour-practice', name: 'Behaviour / Practice' },
  { id: 'principle', name: 'Principle' },
]

// 6xD Dimension (Secondary - shown when 6xD selected)
export const SIX_XD_DIMENSIONS: FilterOption[] = [
  { id: 'discover', name: 'Discover' },
  { id: 'design', name: 'Design' },
  { id: 'develop', name: 'Develop' },
  { id: 'deploy', name: 'Deploy' },
  { id: 'deliver', name: 'Deliver' },
  { id: 'decide', name: 'Decide' },
]

// 6xD Perspective (Secondary - shown when 6xD selected)
// The six essential perspectives of the Agile 6xD framework
export const SIX_XD_PERSPECTIVES: FilterOption[] = [
  { id: 'digital-economy', name: 'Digital Economy (DE)' },
  { id: 'dco', name: 'Digital Cognitive Organisation (DCO)' },
  { id: 'dbp', name: 'Digital Business Platforms (DBP)' },
  { id: 'dt2-0', name: 'Digital Transformation 2.0 (DT2.0)' },
  { id: 'dw-ws', name: 'Digital Worker & Workspace (DW:WS)' },
  { id: 'digital-accelerators', name: 'Digital Accelerators (Tools)' },
]

// 6xD Term Type (Secondary - shown when 6xD selected)
export const SIX_XD_TERM_TYPES: FilterOption[] = [
  { id: 'platform-product', name: 'Platform / Product' },
  { id: 'process-flow', name: 'Process / Flow' },
  { id: 'capability', name: 'Capability' },
  { id: 'metric-measure', name: 'Metric / Measure' },
]

// SHARED FILTERS (visible after GHC or 6xD selected)
// Term Origin
export const TERM_ORIGINS: FilterOption[] = [
  { id: 'dq-term', name: 'DQ Term' },
  { id: 'market-standard', name: 'Market / Standard Term' },
]

// Used In
export const USED_IN: FilterOption[] = [
  { id: 'dws', name: 'DWS' },
  { id: 'qdbp', name: 'QDBP' },
  { id: 'delivery-projects', name: 'Delivery Projects' },
  { id: 'governance-reviews', name: 'Governance & Reviews' },
  { id: 'learning-enablement', name: 'Learning & Enablement' },
]

// Who Uses It
export const WHO_USES_IT: FilterOption[] = [
  { id: 'leadership', name: 'Leadership' },
  { id: 'delivery', name: 'Delivery' },
  { id: 'agile-transformation', name: 'Agile / Transformation' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'operations', name: 'Operations' },
  { id: 'new-joiners', name: 'New Joiners' },
]

// A-Z Letters
export const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

