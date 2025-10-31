import React, { useEffect, useId, useMemo, useState } from 'react'
import { parseCsv, toCsv } from '../../utils/guides'
import { ChevronDown, ChevronRight } from 'lucide-react'

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
}

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
  return (
    <div className="space-y-1">
      {options.map((opt, idx) => {
        const id = `${idPrefix}-${name}-${idx}`
        const checked = selected.has(opt.id)
        const labelText = formatLabel(opt.name)
        return (
          <div key={opt.id} className="flex items-center">
            <input type="checkbox" id={id} checked={checked} onChange={() => toggle(opt.id)} className="h-4 w-4 rounded border-gray-300 text-[var(--guidelines-primary)] focus:ring-[var(--guidelines-primary)] accent-[var(--guidelines-primary)]" aria-label={`${name} ${labelText}`} />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {labelText}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export const GuidesFilters: React.FC<Props> = ({ facets, query, onChange }) => {
  const instanceId = useId()
  const clearAll = () => {
    const next = new URLSearchParams()
    onChange(next)
  }
  // Persist collapsed categories in URL param 'collapsed' as CSV; also keep local state to avoid cross-instance glitches
  const initialCollapsed = useMemo(() => {
    const fromUrl = parseCsv(query.get('collapsed'))
    return new Set(fromUrl.length > 0 ? fromUrl : ['guide_type', 'sub_domain', 'unit', 'location', 'status'])
  }, [query])
  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(initialCollapsed)
  // Keep local collapsed state in sync if URL changes from outside
  useEffect(() => {
    const next = new Set(parseCsv(query.get('collapsed')))
    if (next.size > 0) setCollapsedSet(next)
  }, [query])
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
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} aria-label="Guides filters">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={clearAll} className="text-[var(--guidelines-primary)] text-sm font-medium">Clear all</button>
      </div>
      <Section idPrefix={instanceId} title="Domain" category="domain" collapsed={collapsedSet.has('domain')} onToggle={toggleCollapsed}>
        <CheckboxList idPrefix={instanceId} name="domain" options={facets.domain || []} query={query} onChange={onChange} />
      </Section>
      <Section idPrefix={instanceId} title="Guide Type" category="guide_type" collapsed={collapsedSet.has('guide_type')} onToggle={toggleCollapsed}>
        <CheckboxList idPrefix={instanceId} name="guide_type" options={facets.guide_type || []} query={query} onChange={onChange} />
      </Section>
      {(facets.sub_domain && facets.sub_domain.length > 0 && parseCsv(query.get('domain')).length > 0) && (
        <Section idPrefix={instanceId} title="Sub-Domain" category="sub_domain" collapsed={collapsedSet.has('sub_domain')} onToggle={toggleCollapsed}>
          <CheckboxList idPrefix={instanceId} name="sub_domain" options={facets.sub_domain || []} query={query} onChange={onChange} />
        </Section>
      )}
      <Section idPrefix={instanceId} title="Units" category="unit" collapsed={collapsedSet.has('unit')} onToggle={toggleCollapsed}>
        <CheckboxList idPrefix={instanceId} name="unit" options={facets.unit || []} query={query} onChange={onChange} />
      </Section>
      <Section idPrefix={instanceId} title="Location" category="location" collapsed={collapsedSet.has('location')} onToggle={toggleCollapsed}>
        <CheckboxList idPrefix={instanceId} name="location" options={facets.location || []} query={query} onChange={onChange} />
      </Section>
    </div>
  )
}

export default GuidesFilters
