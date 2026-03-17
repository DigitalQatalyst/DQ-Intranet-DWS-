import React, { useMemo } from 'react';
import { parseCsv, toCsv } from '../../utils/guides';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Facet = { id: string; name: string; count?: number };

export interface EventsFacets {
  category?: Facet[];
  month?: Facet[];
  location?: Facet[];
}

interface Props {
  facets: EventsFacets;
  query: URLSearchParams;
  onChange: (next: URLSearchParams) => void;
}

const Section: React.FC<{ 
  title: string; 
  category: string; 
  collapsed: boolean; 
  onToggle: (category: string) => void;
  children: React.ReactNode;
}> = ({ title, category, collapsed, onToggle, children }) => {
  const contentId = `filters-${category}`;
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
  );
};

const CheckboxList: React.FC<{ 
  name: string; 
  options: Facet[]; 
  query: URLSearchParams; 
  onChange: (n: URLSearchParams) => void;
}> = ({ name, options, query, onChange }) => {
  const selected = new Set(parseCsv(query.get(name)));
  const toggle = (id: string) => {
    const next = new URLSearchParams(query.toString());
    const values = new Set(parseCsv(next.get(name)));
    if (values.has(id)) values.delete(id); 
    else values.add(id);
    next.set(name, toCsv(Array.from(values)));
    if (next.get(name) === '') next.delete(name);
    onChange(next);
  };

  return (
    <div className="space-y-1">
      {options.map((opt, idx) => {
        const id = `${name}-${idx}`;
        const checked = selected.has(opt.id);
        return (
          <div key={opt.id} className="flex items-center">
            <input 
              type="checkbox" 
              id={id} 
              checked={checked} 
              onChange={() => toggle(opt.id)} 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              aria-label={`${name} ${opt.name}`} 
            />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {opt.name}
              {opt.count !== undefined && ` (${opt.count})`}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export const EventsFilters: React.FC<Props> = ({ facets, query, onChange }) => {
  const clearAll = () => {
    const next = new URLSearchParams();
    onChange(next);
  };

  // Persist collapsed categories in URL param 'collapsed' as CSV
  const collapsedSet = useMemo(() => new Set(parseCsv(query.get('collapsed'))), [query]);
  const toggleCollapsed = (key: string) => {
    const next = new URLSearchParams(query.toString());
    const set = new Set(parseCsv(next.get('collapsed')));
    if (set.has(key)) set.delete(key); 
    else set.add(key);
    const value = Array.from(set).join(',');
    if (value) next.set('collapsed', value); 
    else next.delete('collapsed');
    onChange(next);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-24" aria-label="Events filters">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={clearAll} className="text-blue-600 text-sm font-medium">
          Clear all
        </button>
      </div>
      
      <Section title="Category" category="category" collapsed={collapsedSet.has('category')} onToggle={toggleCollapsed}>
        <CheckboxList name="category" options={facets.category || []} query={query} onChange={onChange} />
      </Section>
      
      <Section title="Month" category="month" collapsed={collapsedSet.has('month')} onToggle={toggleCollapsed}>
        <CheckboxList name="month" options={facets.month || []} query={query} onChange={onChange} />
      </Section>
      
      <Section title="Location Type" category="location" collapsed={collapsedSet.has('location')} onToggle={toggleCollapsed}>
        <CheckboxList name="location" options={facets.location || []} query={query} onChange={onChange} />
      </Section>
    </div>
  );
};

export default EventsFilters;
