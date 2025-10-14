import React from 'react'
import { parseCsv, toCsv } from '../../utils/guides'

type Facet = { id: string; name: string; count: number }
export interface GuidesFacets {
  domain?: Facet[]
  guide_type?: Facet[]
  function_area?: Facet[]
  status?: Facet[]
}

interface Props {
  facets: GuidesFacets
  query: URLSearchParams
  onChange: (next: URLSearchParams) => void
}

const Section: React.FC<{ title: string }> = ({ title, children }) => (
  <div className="border-b border-gray-100 pb-3 mb-3">
    <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
)

const CheckboxList: React.FC<{ name: string; options: Facet[]; query: URLSearchParams; onChange: (n: URLSearchParams)=>void }> = ({ name, options, query, onChange }) => {
  const selected = new Set(parseCsv(query.get(name)))
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
        const id = `${name}-${idx}`
        const checked = selected.has(opt.id)
        return (
          <div key={opt.id} className="flex items-center">
            <input type="checkbox" id={id} checked={checked} onChange={() => toggle(opt.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" aria-label={`${name} ${opt.name}`} />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {opt.name}{typeof opt.count === 'number' ? ` (${opt.count})` : ''}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export const GuidesFilters: React.FC<Props> = ({ facets, query, onChange }) => {
  const clearAll = () => {
    const next = new URLSearchParams()
    onChange(next)
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-24" aria-label="Guides filters">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={clearAll} className="text-blue-600 text-sm font-medium">Clear all</button>
      </div>
      <Section title="Domain">
        <CheckboxList name="domain" options={facets.domain || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Guide Type">
        <CheckboxList name="guide_type" options={facets.guide_type || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Function Area">
        <CheckboxList name="function_area" options={facets.function_area || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Status">
        <CheckboxList name="status" options={facets.status || []} query={query} onChange={onChange} />
      </Section>
    </div>
  )
}

export default GuidesFilters
