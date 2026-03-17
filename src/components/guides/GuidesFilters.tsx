import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { parseCsv, toCsv } from '../../utils/guides'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  KNOWLEDGE_SYSTEMS,
  GHC_DIMENSIONS,
  SIX_XD_PERSPECTIVES,
  ALPHABET
} from '../../pages/guides/glossaryFilters'

type Facet = { id: string; name: string; count?: number }
export interface GuidesFacets {
  domain?: Facet[]
  sub_domain?: Facet[]
  guide_type?: Facet[]
  unit?: Facet[]
  location?: Facet[]
  status?: Facet[]
}

const LABEL_OVERRIDES: Record<string, string> = {
  'digital-framework': 'Digital Framework (6xD)',
  'design-systems': 'Design Systems (xDS)',
  'dbp': 'DBP',
  'dxp': 'DXP',
  'dws': 'DWS',
  'devops': 'DevOps',
};

interface Props {
  facets: GuidesFacets
  query: URLSearchParams
  onChange: (next: URLSearchParams) => void
  activeTab: 'guidelines' | 'strategy' | 'blueprints' | 'testimonials' | 'glossary' | 'faqs'
}

const TESTIMONIAL_CATEGORIES: Facet[] = [
  { id: 'client-feedback', name: 'Client Feedback' },
  { id: 'associates', name: 'Associates Feedback' },
  { id: 'client-partner-reference', name: 'Partner Reference' },
  { id: 'team-employee-experience', name: 'Employee Experience' },
  { id: 'milestone-achievement', name: 'Milestone / Achievement' }
]

const TESTIMONIAL_UNITS: Facet[] = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
]

const GUIDELINES_GUIDE_TYPES: Facet[] = [
  { id: 'best-practice', name: 'Best Practice' },
  { id: 'policy', name: 'Policy' },
  { id: 'process', name: 'Process' },
  { id: 'sop', name: 'SOP' }
]

const GUIDELINES_UNITS: Facet[] = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
]

const GUIDELINES_LOCATIONS: Facet[] = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
]

const GUIDELINES_CATEGORIES: Facet[] = [
  { id: 'resources', name: 'Guidelines' },
  { id: 'policies', name: 'Policies' }
]

const BLUEPRINT_GUIDE_TYPES: Facet[] = [
  { id: 'best-practice', name: 'Best Practice' },
  { id: 'policy', name: 'Policy' },
  { id: 'process', name: 'Process' },
  { id: 'sop', name: 'SOP' }
]

const BLUEPRINT_UNITS: Facet[] = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
]

const BLUEPRINT_LOCATIONS: Facet[] = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
]

const PRODUCT_TYPES: Facet[] = [
  { id: 'tmaas', name: 'TMaaS' },
  { id: 'dtma', name: 'DTMA' },
  { id: 'dtmp', name: 'DTMP' },
  { id: 'plant-4-0', name: 'Plant 4.0' },
  { id: 'dtmcc', name: 'DTMCC' },
  { id: 'dto4t', name: 'DTO4T' }
]

const PRODUCT_STAGES: Facet[] = [
  { id: 'concept', name: 'Concept' },
  { id: 'mvp', name: 'MVP' },
  { id: 'live', name: 'Live' },
  { id: 'scaling', name: 'Scaling' },
  { id: 'enterprise-ready', name: 'Enterprise-ready' }
]

const PRODUCT_CLASSES: Facet[] = [
  { id: 'class-01', name: 'Class 01 DBP Services' },
  { id: 'class-02', name: 'Class 02 DT 2.0' },
  { id: 'class-03', name: 'Class 03 DCO' }
]

// Keep legacy framework filters for backward compatibility (mapped to product domains)
const BLUEPRINT_FRAMEWORKS: Facet[] = [
  { id: 'devops', name: 'DevOps' },
  { id: 'dbp', name: 'DBP' },
  { id: 'dxp', name: 'DXP' },
  { id: 'dws', name: 'DWS' },
  { id: 'products', name: 'Products' },
  { id: 'projects', name: 'Projects' }
]

const PRODUCT_SECTORS: Facet[] = [
  { id: 'government-4.0', name: 'Government 4.0' },
  { id: 'infrastructure-4.0', name: 'Infrastructure 4.0' },
  { id: 'plant-4.0', name: 'Plant 4.0' },
  { id: 'logistics-4.0', name: 'Logistics 4.0' },
  { id: 'service-4.0', name: 'Service 4.0' }
]

const FAQ_CATEGORIES: Facet[] = [
  { id: 'dt2.0', name: 'DT2.0' },
  { id: 'general', name: 'General' },
  { id: 'process', name: 'Process' },
  { id: 'resources', name: 'Resources' }
]

const STRATEGY_LOCATIONS: Facet[] = [
  { id: 'DXB', name: 'DXB' },
  { id: 'KSA', name: 'KSA' },
  { id: 'NBO', name: 'NBO' }
]

const STRATEGY_UNITS: Facet[] = [
  { id: 'deals', name: 'Deals' },
  { id: 'dq-delivery-accounts', name: 'DQ Delivery (Accounts)' },
  { id: 'dq-delivery-deploys', name: 'DQ Delivery (Deploys)' },
  { id: 'dq-delivery-designs', name: 'DQ Delivery (Designs)' },
  { id: 'finance', name: 'Finance' },
  { id: 'hra', name: 'HRA' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'products', name: 'Products' },
  { id: 'secdevops', name: 'SecDevOps' },
  { id: 'solutions', name: 'Solutions' },
  { id: 'stories', name: 'Stories' }
]

const STRATEGY_FRAMEWORKS: Facet[] = [
  { id: 'ghc1', name: 'Vision' },
  { id: 'ghc2', name: 'House of Values (HoV)' },
  { id: 'ghc3', name: 'Personas' },
  { id: 'ghc4', name: 'Agile TMS' },
  { id: 'ghc5', name: 'Agile SoS' },
  { id: 'ghc6', name: 'Agile Flows' },
  { id: 'ghc7', name: 'Agile 6xD (Products)' },
]

// All possible filter categories - default to ALL collapsed
const ALL_CATEGORIES = [
  'guide_type', 'sub_domain', 'unit', 'location', 'testimonial_category',
  'product_type', 'product_stage', 'guidelines_category',
  'categorization', 'attachments',
  'strategy_framework',
  'glossary_knowledge_system', 'glossary_ghc_dimension', 'glossary_6xd_perspective', 'glossary_letter',
  'faq_category'
]

const Section: React.FC<{ idPrefix: string; title: string; category: string; collapsed: boolean; onToggle: (category: string) => void }> = ({ idPrefix, title, category, collapsed, onToggle, children }) => {
  const contentId = `${idPrefix}-filters-${category}`
  return (
    <div className="border-b border-gray-100 pb-3 mb-3">
      <button
        type="button"
        className="w-full flex items-center justify-between text-left"
        onClick={() => onToggle(category)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {collapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
      </button>
      <div id={contentId} className={`${collapsed ? 'hidden' : 'mt-2'}`}>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  )
}

const CheckboxList: React.FC<{ idPrefix: string; name: string; options: Facet[]; query: URLSearchParams; onChange: (n: URLSearchParams)=>void }> = ({ idPrefix, name, options, query, onChange }) => {
  const selected = new Set(parseCsv(query.get(name)))
  const formatLabel = (value: string) => {
    const override = LABEL_OVERRIDES[value.toLowerCase()] ?? LABEL_OVERRIDES[value];
    if (override) return override;
    return value
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }
  const toggle = (id: string) => {
    const next = new URLSearchParams(query.toString())
    const values = new Set(parseCsv(next.get(name)))
    if (values.has(id)) values.delete(id); else values.add(id)
    next.set(name, toCsv(Array.from(values)))
    if (next.get(name) === '') next.delete(name)
    onChange(next)
  }
  const handleCheckboxChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    toggle(id)
  }
  return (
    <div className="space-y-1">
      {options.map((opt, idx) => {
        const id = `${idPrefix}-${name}-${idx}`
        const checked = selected.has(opt.id)
        const labelText = formatLabel(opt.name)
        return (
          <div key={opt.id} className="flex items-center">
            <input type="checkbox" id={id} checked={checked} onChange={(e) => handleCheckboxChange(opt.id, e)} className="h-4 w-4 rounded border-gray-300 text-[var(--guidelines-primary)] focus:ring-[var(--guidelines-primary)] accent-[var(--guidelines-primary)] cursor-pointer" aria-label={`${name} ${labelText}`} />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {labelText}
            </label>
          </div>
        )
      })}
    </div>
  )
}

function getLocationOptions(isGuidelinesSelected: boolean, isFAQsSelected: boolean, isTestimonialsSelected: boolean, facetsLocation?: Facet[]): Facet[] {
  if (isGuidelinesSelected || isFAQsSelected) return GUIDELINES_LOCATIONS
  if (isTestimonialsSelected) return [] // No location options for testimonials
  return facetsLocation || []
}

function getTabKeysToDelete(isStrategySelected: boolean, isTestimonialsSelected: boolean): string[] {
  if (isStrategySelected) return ['guide_type', 'sub_domain', 'domain', 'unit', 'location']
  if (isTestimonialsSelected) return ['guide_type', 'sub_domain', 'domain', 'location']
  return ['guide_type', 'sub_domain', 'unit', 'domain']
}

function getAllowedLocationIds(isBlueprintSelected: boolean, isTestimonialsSelected: boolean): string[] | undefined {
  if (isBlueprintSelected) return BLUEPRINT_LOCATIONS.map(opt => opt.id)
  if (isTestimonialsSelected) return undefined // No location filtering for testimonials
  return undefined
}

function cleanLocationFilter(
  next: URLSearchParams,
  isStrategySelected: boolean,
  isBlueprintSelected: boolean,
  isTestimonialsSelected: boolean
): boolean {
  if (isStrategySelected) {
    if (!next.has('location')) return false
    next.delete('location')
    return true
  }
  const allowedLocationIds = getAllowedLocationIds(isBlueprintSelected, isTestimonialsSelected)
  if (!allowedLocationIds) return false
  const current = parseCsv(next.get('location'))
  const filtered = current.filter(val => allowedLocationIds.includes(val))
  if (filtered.length === current.length) return false
  if (filtered.length) next.set('location', filtered.join(','))
  else next.delete('location')
  return true
}

export const GuidesFilters: React.FC<Props> = ({ facets, query, onChange, activeTab }) => {
  const instanceId = useId()
  const isStrategySelected = activeTab === 'strategy'
  const isBlueprintSelected = activeTab === 'blueprints'
  const isTestimonialsSelected = activeTab === 'testimonials'
  const isGuidelinesSelected = activeTab === 'guidelines'
  const isGlossarySelected = activeTab === 'glossary'
  const isFAQsSelected = activeTab === 'faqs'
  const isResourcesSelected = activeTab === 'resources'
  const prevTabRef = useRef<typeof activeTab>(activeTab)
  
  const availableStrategyFrameworks = useMemo(() => {
    if (!isStrategySelected) return []
    // If facets are not loaded yet, show all options (they'll be filtered once data loads)
    if ((!facets.sub_domain || facets.sub_domain.length === 0) && 
        (!facets.domain || facets.domain.length === 0) && 
        (!facets.guide_type || facets.guide_type.length === 0)) {
      return STRATEGY_FRAMEWORKS
    }
    
    const subDomainIds = new Set((facets.sub_domain || []).map(f => f.id.toLowerCase()))
    const domainIds = new Set((facets.domain || []).map(f => f.id.toLowerCase()))
    const guideTypeIds = new Set((facets.guide_type || []).map(f => f.id.toLowerCase()))
    
    return STRATEGY_FRAMEWORKS.filter(framework => {
      const frameworkId = framework.id.toLowerCase()
      // Check if any facet matches this framework (strategy filters check sub_domain, domain, and guide_type)
      const allFacetValues = [...subDomainIds, ...domainIds, ...guideTypeIds]
      return allFacetValues.some(value => {
        if (frameworkId === 'ghc') {
          return value.includes('ghc') ||
                 value.includes('golden honeycomb')
        } else if (frameworkId === 'hov') {
          return value.includes('hov') ||
                 value.includes('house of values') ||
                 value.includes('competencies')
        }
        return value.includes(frameworkId) || frameworkId.includes(value)
      })
    })
  }, [isStrategySelected, facets.sub_domain, facets.domain, facets.guide_type])
  const clearAll = () => {
    const next = new URLSearchParams()
    onChange(next)
  }
  
  // Persist collapsed categories in URL param 'collapsed' as CSV; also keep local state to avoid cross-instance glitches
  // Default to ALL categories collapsed if not in URL
  const initialCollapsed = useMemo(() => {
    const fromUrl = parseCsv(query.get('collapsed'))
    // If URL has collapsed param, use it; otherwise default to ALL collapsed
    return new Set(fromUrl.length > 0 ? fromUrl : ALL_CATEGORIES)
  }, [query])
  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(initialCollapsed)
  const [policySet2Collapsed, setPolicySet2Collapsed] = useState(true)
  
  // Keep local collapsed state in sync if URL changes from outside
  useEffect(() => {
    const next = new Set(parseCsv(query.get('collapsed')))
    // If URL has collapsed param, use it; otherwise default to ALL collapsed
    if (next.size > 0) {
      setCollapsedSet(next)
    } else {
      setCollapsedSet(new Set(ALL_CATEGORIES))
    }
  }, [query])
  // Clean up incompatible filters when switching tabs (only run on actual tab change, not on query changes)
  // Also collapse all filters when switching tabs
  useEffect(() => {
    if (prevTabRef.current === activeTab) return
    prevTabRef.current = activeTab

    const next = new URLSearchParams(query.toString())
    const allCollapsed = new Set(ALL_CATEGORIES)
    const currentCollapsed = new Set(parseCsv(next.get('collapsed')))
    const collapsedChanged = ALL_CATEGORIES.some(cat => !currentCollapsed.has(cat))
    let changed = collapsedChanged
    if (collapsedChanged) {
      next.set('collapsed', Array.from(allCollapsed).join(','))
      setCollapsedSet(allCollapsed)
    }

    if (!(isStrategySelected || isBlueprintSelected || isTestimonialsSelected)) {
      if (changed) onChange(next)
      return
    }

    const keysToDelete = getTabKeysToDelete(isStrategySelected, isTestimonialsSelected)
    keysToDelete.forEach(key => {
      if (next.has(key)) { next.delete(key); changed = true }
    })
    if (cleanLocationFilter(next, isStrategySelected, isBlueprintSelected, isTestimonialsSelected)) changed = true
    if (!changed) return
    onChange(next)
  }, [activeTab, isStrategySelected, isBlueprintSelected, isTestimonialsSelected, query, onChange])
  const toggleCollapsed = (key: string) => {
    const nextSet = new Set(collapsedSet)
    if (nextSet.has(key)) nextSet.delete(key); else nextSet.add(key)
    setCollapsedSet(nextSet)
    // reflect in URL
    const next = new URLSearchParams(query.toString())
    const value = Array.from(nextSet).join(',')
    if (value) next.set('collapsed', value); else next.delete('collapsed')
    onChange(next)
  }
  const locationOptions = getLocationOptions(isGuidelinesSelected, isFAQsSelected, isTestimonialsSelected, facets.location)
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} aria-label="Guides filters">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={clearAll} className="text-[var(--guidelines-primary)] text-sm font-medium">Clear all</button>
      </div>
      {isGlossarySelected ? (
          <>
            {/* ALPHABETICAL FILTER: A–Z browsing for fast scanning */}
            <Section
              idPrefix={instanceId}
              title="Alphabetical"
              category="glossary_letter"
              collapsed={collapsedSet.has('glossary_letter')}
              onToggle={toggleCollapsed}
            >
              <div className="flex flex-wrap gap-2">
                {ALPHABET.map(letter => {
                  const selected = parseCsv(query.get('glossary_letter')).includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => {
                        const next = new URLSearchParams(query.toString())
                        const values = new Set(parseCsv(next.get('glossary_letter')))
                        if (values.has(letter)) {
                          values.delete(letter)
                        } else {
                          values.add(letter)
                        }
                        if (values.size > 0) {
                          next.set('glossary_letter', toCsv(Array.from(values)))
                        } else {
                          next.delete('glossary_letter')
                        }
                        onChange(next)
                      }}
                      className={`
                        w-8 h-8 rounded text-xs font-medium transition-colors
                        ${
                          selected
                            ? 'bg-[var(--guidelines-primary)] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </Section>
          </>
      ) : isBlueprintSelected ? (
        <>
          <Section idPrefix={instanceId} title="Class" category="product_class" collapsed={collapsedSet.has('product_class')} onToggle={toggleCollapsed}>
            <CheckboxList idPrefix={instanceId} name="product_class" options={PRODUCT_CLASSES} query={query} onChange={onChange} />
          </Section>
        </>
      ) : isGuidelinesSelected ? (
        <>
          <Section
            idPrefix={instanceId}
            title="Categorization"
            category="categorization"
            collapsed={collapsedSet.has('categorization')}
            onToggle={toggleCollapsed}
          >
            <CheckboxList
              idPrefix={instanceId}
              name="categorization"
              options={[
                { id: 'policy-set-1a-opg', name: 'Policy Set 1a – OPG' },
                { id: 'policy-set-1b-ppp', name: 'Policy Set 1b – PPP' },
              ]}
              query={query}
              onChange={onChange}
            />
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-gray-900"
                onClick={() => setPolicySet2Collapsed(prev => !prev)}
                aria-expanded={!policySet2Collapsed}
              >
                <span>Policy Set 02</span>
                {policySet2Collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>
              {!policySet2Collapsed && (
                <div className="mt-2">
                  <CheckboxList
                    idPrefix={`${instanceId}-policy-set-02`}
                    name="categorization"
                    options={[
                      { id: 'policy-set-2a-vision', name: '2A - Vision' },
                      { id: 'policy-set-2b-culture', name: '2B - Culture' },
                      { id: 'policy-set-2c-persona', name: '2C - Persona' },
                      { id: 'policy-set-2d-task', name: '2D - Task' },
                      { id: 'policy-set-2e-govern', name: '2E - Govern' },
                      { id: 'policy-set-2f-flow', name: '2F - Flow' },
                      { id: 'policy-set-2g-product', name: '2G - Product' },
                    ]}
                    query={query}
                    onChange={onChange}
                  />
                </div>
              )}
            </div>
          </Section>
          <Section
            idPrefix={instanceId}
            title="Attachments"
            category="attachments"
            collapsed={collapsedSet.has('attachments')}
            onToggle={toggleCollapsed}
          >
            <CheckboxList
              idPrefix={instanceId}
              name="attachments"
              options={[
                { id: 'guidelines', name: 'Guidelines' },
                { id: 'processes', name: 'Processes' },
                { id: 'demos', name: 'Demos' },
                { id: 'procedures', name: 'Procedures' },
                { id: 'checklists', name: 'Checklists' },
              ]}
              query={query}
              onChange={onChange}
            />
          </Section>
        </>
      ) : isResourcesSelected ? (
        <Section idPrefix={instanceId} title="Guide Type" category="guide_type" collapsed={collapsedSet.has('guide_type')} onToggle={toggleCollapsed}>
          <CheckboxList idPrefix={instanceId} name="guide_type" options={GUIDELINES_GUIDE_TYPES} query={query} onChange={onChange} />
        </Section>
      ) : !(isStrategySelected || isBlueprintSelected || isTestimonialsSelected) && facets.guide_type && facets.guide_type.length > 0 && (
        <Section idPrefix={instanceId} title="Guide Type" category="guide_type" collapsed={collapsedSet.has('guide_type')} onToggle={toggleCollapsed}>
          <CheckboxList idPrefix={instanceId} name="guide_type" options={facets.guide_type || []} query={query} onChange={onChange} />
        </Section>
      )}
      {isFAQsSelected && (
        <Section idPrefix={instanceId} title="Category" category="faq_category" collapsed={collapsedSet.has('faq_category')} onToggle={toggleCollapsed}>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(query.toString())
                next.delete('faq_category')
                onChange(next)
              }}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              All
            </button>
          </div>
          <CheckboxList idPrefix={instanceId} name="faq_category" options={FAQ_CATEGORIES} query={query} onChange={onChange} />
        </Section>
      )}
      {!isGlossarySelected && !isBlueprintSelected && !isFAQsSelected && !isTestimonialsSelected && !isStrategySelected && !isGuidelinesSelected && (
        <Section idPrefix={instanceId} title="Units" category="unit" collapsed={collapsedSet.has('unit')} onToggle={toggleCollapsed}>
          <CheckboxList idPrefix={instanceId} name="unit" options={facets.unit || []} query={query} onChange={onChange} />
        </Section>
      )}
      {isTestimonialsSelected && (
      <Section idPrefix={instanceId} title="Story Type" category="testimonial_category" collapsed={collapsedSet.has('testimonial_category')} onToggle={toggleCollapsed}>
        <CheckboxList idPrefix={instanceId} name="testimonial_category" options={TESTIMONIAL_CATEGORIES} query={query} onChange={onChange} />
      </Section>
    )}
    {isStrategySelected && (
      <>
          <Section idPrefix={instanceId} title="GHC Elements" category="strategy_framework" collapsed={collapsedSet.has('strategy_framework')} onToggle={toggleCollapsed}>
            <CheckboxList idPrefix={instanceId} name="strategy_framework" options={availableStrategyFrameworks.length > 0 ? availableStrategyFrameworks : STRATEGY_FRAMEWORKS} query={query} onChange={onChange} />
          </Section>
      </>
    )}
      {!isGlossarySelected && !isBlueprintSelected && !isStrategySelected && !isTestimonialsSelected && (
        <Section idPrefix={instanceId} title="Location" category="location" collapsed={collapsedSet.has('location')} onToggle={toggleCollapsed}>
          <CheckboxList idPrefix={instanceId} name="location" options={locationOptions} query={query} onChange={onChange} />
        </Section>
      )}
    </div>
  )
}

export default GuidesFilters
