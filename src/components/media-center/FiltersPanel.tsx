import React, { useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { FacetConfig, FiltersValue } from './types';

interface FiltersPanelProps {
  facets: FacetConfig[];
  values: FiltersValue;
  onChange: (values: FiltersValue) => void;
  onClear?: () => void;
  groupOrder?: {
    pinned?: string[];
  };
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ facets, values, onChange, onClear, groupOrder }) => {
  const orderedFacets = useMemo(() => {
    if (!groupOrder?.pinned?.length) return facets;
    const pinnedSet = new Set(groupOrder.pinned);
    const pinned = facets.filter((facet) => pinnedSet.has(facet.key));
    const rest = facets.filter((facet) => !pinnedSet.has(facet.key));
    return [...pinned, ...rest];
  }, [facets, groupOrder]);

  const hasActiveFilters = useMemo(
    () => Object.values(values).some((v) => Array.isArray(v) && v.length > 0),
    [values]
  );

  const toggleValue = (facetKey: string, optionValue: string) => {
    const current = values[facetKey] || [];
    const next = current.includes(optionValue)
      ? current.filter((value) => value !== optionValue)
      : [...current, optionValue];
    onChange({ ...values, [facetKey]: next });
  };

  return (
    <div className="space-y-4">
      {hasActiveFilters && onClear && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Filters ({Object.values(values).reduce((acc, arr) => acc + (arr?.length || 0), 0)})</span>
          <button type="button" className="font-medium text-[#1A2E6E] hover:text-[#132456]" onClick={onClear}>
            Clear all
          </button>
        </div>
      )}
      {orderedFacets.map((facet) => (
        <div key={facet.key} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-800">
              {facet.label}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </summary>
            <div className="mt-3 space-y-2">
              {(facet.options.length ? facet.options : ['Placeholder 1', 'Placeholder 2']).map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                const optionDescription = typeof option === 'string' ? undefined : option.description;
                const isActive = (values[facet.key] || []).includes(optionValue);
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => toggleValue(facet.key, optionValue)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1 text-left text-sm transition hover:border-gray-200 ${
                      isActive ? 'text-[#1A2E6E] font-medium bg-[#EEF2FF] border-[#C7D2FE]' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded border ${
                        isActive ? 'bg-gray-600 border-gray-600' : 'border-gray-300 bg-white'
                      }`}
                      aria-hidden="true"
                    >
                      {isActive && <Check size={10} strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="flex flex-col">
                      <span>{optionLabel}</span>
                      {optionDescription && <span className="text-xs font-normal text-gray-500">{optionDescription}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default FiltersPanel;
