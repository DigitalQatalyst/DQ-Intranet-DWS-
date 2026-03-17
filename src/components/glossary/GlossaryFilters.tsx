import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { parseCsv, toCsv } from '../../utils/guides';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_USED_IN,
  GLOSSARY_STATUS,
} from '../../constants/glossaryFilters';

type Facet = { id: string; name: string; count?: number };

interface GlossaryFacets {
  category?: Facet[];
  used_in?: Facet[];
  status?: Facet[];
}

interface Props {
  facets: GlossaryFacets;
  query: URLSearchParams;
  onChange: (next: URLSearchParams) => void;
  availableTerms?: Array<{ term: string }>; // For determining which letters have terms
}

// Use constants as single source of truth
const CATEGORIES: Facet[] = GLOSSARY_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
const USED_IN_OPTIONS: Facet[] = GLOSSARY_USED_IN.map(u => ({ id: u.id, name: u.name }));
const STATUS_OPTIONS: Facet[] = GLOSSARY_STATUS.map(s => ({ id: s.id, name: s.name }));

const ALPHABET_OPTIONS: Facet[] = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i);
  return { id: letter.toLowerCase(), name: letter };
});

const Section: React.FC<{
  idPrefix: string;
  title: string;
  category: string;
  collapsed: boolean;
  onToggle: (category: string) => void;
  children: React.ReactNode;
  isAlphabet?: boolean;
}> = ({ idPrefix, title, category, collapsed, onToggle, children, isAlphabet = false }) => {
  const contentId = `${idPrefix}-filters-${category}`;
  return (
    <div className={`border-b border-gray-100 pb-3 mb-3 ${isAlphabet ? 'opacity-90' : ''}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between text-left py-1.5"
        onClick={() => onToggle(category)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
      >
        <h3 className="font-semibold text-gray-900 text-sm">
          {title}
        </h3>
        {collapsed ? (
          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown size={14} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        )}
      </button>
      <div id={contentId} className={`${collapsed ? 'hidden' : 'mt-2'}`}>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
};

const CheckboxList: React.FC<{
  idPrefix: string;
  name: string;
  options: Facet[];
  query: URLSearchParams;
  onChange: (n: URLSearchParams) => void;
}> = ({ idPrefix, name, options, query, onChange }) => {
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
  const handleCheckboxChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggle(id);
  };
  return (
    <div className="space-y-1">
      {options.map((opt, idx) => {
        const id = `${idPrefix}-${name}-${idx}`;
        const checked = selected.has(opt.id);
        return (
          <div key={opt.id} className="flex items-center">
            <input
              type="checkbox"
              id={id}
              checked={checked}
              onChange={(e) => handleCheckboxChange(opt.id, e)}
              className="h-4 w-4 rounded border-gray-300 text-[var(--guidelines-primary)] focus:ring-[var(--guidelines-primary)] accent-[var(--guidelines-primary)] cursor-pointer"
              aria-label={`${name} ${opt.name}`}
            />
            <label htmlFor={id} className="ml-2 text-sm text-gray-600 cursor-pointer">
              {opt.name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

const RadioList: React.FC<{
  idPrefix: string;
  name: string;
  options: Facet[];
  query: URLSearchParams;
  onChange: (n: URLSearchParams) => void;
}> = ({ idPrefix, name, options, query, onChange }) => {
  const selected = query.get(name) || 'all';
  const handleRadioChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const next = new URLSearchParams(query.toString());
    if (id === 'all') {
      next.delete(name);
    } else {
      next.set(name, id);
    }
    onChange(next);
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <input
          type="radio"
          id={`${idPrefix}-${name}-all`}
          name={`${idPrefix}-${name}`}
          checked={selected === 'all'}
          onChange={(e) => handleRadioChange('all', e)}
          className="h-4 w-4 border-gray-300 text-[var(--guidelines-primary)] focus:ring-[var(--guidelines-primary)] cursor-pointer"
          aria-label={`${name} All`}
        />
            <label htmlFor={`${idPrefix}-${name}-all`} className="ml-2 text-sm text-gray-600 cursor-pointer">
              All
            </label>
      </div>
      {options.map((opt, idx) => {
        const id = `${idPrefix}-${name}-${idx}`;
        const checked = selected === opt.id;
        return (
          <div key={opt.id} className="flex items-center">
            <input
              type="radio"
              id={id}
              name={`${idPrefix}-${name}`}
              checked={checked}
              onChange={(e) => handleRadioChange(opt.id, e)}
              className="h-4 w-4 border-gray-300 text-[var(--guidelines-primary)] focus:ring-[var(--guidelines-primary)] cursor-pointer"
              aria-label={`${name} ${opt.name}`}
            />
            <label htmlFor={id} className="ml-2 text-sm text-gray-600 cursor-pointer">
              {opt.name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

const AlphabetGrid: React.FC<{
  idPrefix: string;
  name: string;
  query: URLSearchParams;
  onChange: (n: URLSearchParams) => void;
  availableTerms?: Array<{ term: string }>;
}> = ({ idPrefix, name, query, onChange, availableTerms = [] }) => {
  const selected = query.get(name) || 'all';
  
  // Determine which letters have terms
  const lettersWithTerms = useMemo(() => {
    const letterSet = new Set<string>();
    availableTerms.forEach((term) => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letterSet.add(firstLetter);
      }
    });
    return letterSet;
  }, [availableTerms]);

  const handleLetterClick = (letter: string) => {
    const next = new URLSearchParams(query.toString());
    if (selected === letter.toLowerCase()) {
      // Deselect if clicking the same letter
      next.delete(name);
    } else {
      next.set(name, letter.toLowerCase());
    }
    onChange(next);
  };

  const letters = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    const hasTerms = lettersWithTerms.has(letter);
    const isSelected = selected === letter.toLowerCase();
    
    return {
      letter,
      hasTerms,
      isSelected,
    };
  });

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {letters.map(({ letter, hasTerms, isSelected }) => (
          <button
            key={letter}
            type="button"
            onClick={() => handleLetterClick(letter)}
            disabled={!hasTerms}
            className={`
              rounded-full px-3 py-2 text-sm font-medium transition-all duration-150
              ${hasTerms
                ? isSelected
                  ? 'bg-[#0A1433] text-white hover:bg-[#0A1433]/90'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
              }
            `}
            aria-label={`Filter by letter ${letter}${!hasTerms ? ' (no terms available)' : ''}`}
            aria-pressed={isSelected}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export const GlossaryFilters: React.FC<Props> = ({ facets, query, onChange, availableTerms = [] }) => {
  const instanceId = useId();
  const prevQueryRef = useRef<string>(query.toString());

  const clearAll = () => {
    const next = new URLSearchParams();
    // Maintain default: Active status only
    next.set('status', 'active');
    onChange(next);
  };

  const initialCollapsed = useMemo(() => {
    const fromUrl = parseCsv(query.get('collapsed'));
    return new Set(
      fromUrl.length > 0
        ? fromUrl
        : ['category', 'alphabet', 'used_in', 'status']
    );
  }, [query]);

  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(initialCollapsed);

  useEffect(() => {
    const next = new Set(parseCsv(query.get('collapsed')));
    if (next.size > 0) setCollapsedSet(next);
  }, [query]);

  const toggleCollapsed = (key: string) => {
    const nextSet = new Set(collapsedSet);
    if (nextSet.has(key)) nextSet.delete(key);
    else nextSet.add(key);
    setCollapsedSet(nextSet);
    const next = new URLSearchParams(query.toString());
    const value = Array.from(nextSet).join(',');
    if (value) next.set('collapsed', value);
    else next.delete('collapsed');
    onChange(next);
  };

  // Check for active filters (excluding default status=active)
  const statusValue = query.get('status');
  const hasActiveFilters =
    query.get('category') ||
    (query.get('alphabet') && query.get('alphabet') !== 'all') ||
    query.get('used_in') ||
    (statusValue && statusValue !== 'active');

  return (
    <div
      className="bg-white rounded-lg shadow p-4 sticky top-24 max-h-[70vh] overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      aria-label="Glossary filters"
    >
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[var(--guidelines-primary)] text-xs font-medium hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Section
        idPrefix={instanceId}
        title="Category"
        category="category"
        collapsed={collapsedSet.has('category')}
        onToggle={toggleCollapsed}
      >
        <CheckboxList
          idPrefix={instanceId}
          name="category"
          options={CATEGORIES}
          query={query}
          onChange={onChange}
        />
      </Section>

      <Section
        idPrefix={instanceId}
        title="Browse A-Z"
        category="alphabet"
        collapsed={collapsedSet.has('alphabet')}
        onToggle={toggleCollapsed}
        isAlphabet={true}
      >
        <AlphabetGrid
          idPrefix={instanceId}
          name="alphabet"
          query={query}
          onChange={onChange}
          availableTerms={availableTerms}
        />
      </Section>

      <Section
        idPrefix={instanceId}
        title="Used In"
        category="used_in"
        collapsed={collapsedSet.has('used_in')}
        onToggle={toggleCollapsed}
      >
        <CheckboxList
          idPrefix={instanceId}
          name="used_in"
          options={USED_IN_OPTIONS}
          query={query}
          onChange={onChange}
        />
      </Section>

      <Section
        idPrefix={instanceId}
        title="Status"
        category="status"
        collapsed={collapsedSet.has('status')}
        onToggle={toggleCollapsed}
      >
        <CheckboxList
          idPrefix={instanceId}
          name="status"
          options={STATUS_OPTIONS}
          query={query}
          onChange={onChange}
        />
      </Section>
    </div>
  );
};

export default GlossaryFilters;

