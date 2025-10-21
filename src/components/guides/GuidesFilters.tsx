import React from 'react'
import { parseCsv, toCsv, freshnessBuckets } from '../../utils/guides'

type Facet = { id: string; name: string; count: number }
export interface GuidesFacets {
  type?: Facet[]
  audience?: Facet[]
  topic?: Facet[]
  tool?: Facet[]
  skill?: Facet[]
  time?: Facet[]
  format?: Facet[]
  freshness?: Facet[]
  popularity?: Facet[]
  lang?: Facet[]
}

interface Props {
  facets: GuidesFacets
  query: URLSearchParams
  onChange: (next: URLSearchParams) => void
}

const Section: React.FC<{ title: string }> = ({ title, children }) => (
  <div className="border-b border-gray-100 pb-3 mb-3">
    <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
)

const MultiPills: React.FC<{ name: string; options: Facet[]; query: URLSearchParams; onChange: (n: URLSearchParams)=>void; exclusive?: boolean }> = ({ name, options, query, onChange, exclusive }) => {
  const selected = new Set(parseCsv(query.get(name)))
  const toggle = (id: string) => {
    const next = new URLSearchParams(query.toString())
    if (exclusive) {
      next.set(name, id === (selected.values().next().value || '') ? '' : id)
    } else {
      const values = new Set(parseCsv(next.get(name)))
      if (values.has(id)) values.delete(id); else values.add(id)
      next.set(name, toCsv(Array.from(values)))
    }
    onChange(next)
  }
  return (
    <>
      {options.map(opt => (
        <button key={opt.id} onClick={() => toggle(opt.id)} aria-label={`${name} filter ${opt.name}${selected.has(opt.id) ? ' selected' : ''}`} className={`px-2.5 py-1.5 rounded-full text-xs font-medium border ${selected.has(opt.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
          {opt.name}{typeof opt.count === 'number' ? ` (${opt.count})` : ''}
        </button>
      ))}
    </>
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
      <Section title="Guide Type">
        <MultiPills name="type" options={facets.type || []} query={query} onChange={onChange} exclusive />
      </Section>
      <Section title="Audience / Role">
        <MultiPills name="audience" options={facets.audience || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Topic">
        <MultiPills name="topic" options={facets.topic || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Tool / Integration">
        <MultiPills name="tool" options={facets.tool || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Skill Level">
        <MultiPills name="skill" options={facets.skill || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Time to Complete">
        <MultiPills name="time" options={facets.time || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Format">
        <MultiPills name="format" options={facets.format || []} query={query} onChange={onChange} />
      </Section>
      <Section title="Freshness">
        <MultiPills name="freshness" options={(facets.freshness || freshnessBuckets.map(b => ({ id: b.id, name: b.name, count: 0 })))} query={query} onChange={onChange} />
      </Section>
      <Section title="Popularity">
        <MultiPills name="popularity" options={facets.popularity || [{ id: 'trending', name: 'Trending', count: 0 }, { id: 'mostUsed', name: 'Most Used', count: 0 }, { id: 'editorsPick', name: "Editor's Pick", count: 0 }]} query={query} onChange={onChange} />
      </Section>
      {facets.lang && facets.lang.length > 0 && (
        <Section title="Language">
          <MultiPills name="lang" options={facets.lang} query={query} onChange={onChange} />
        </Section>
      )}
    </div>
  )
}

export default GuidesFilters

