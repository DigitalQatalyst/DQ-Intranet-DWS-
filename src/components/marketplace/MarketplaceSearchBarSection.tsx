import React from 'react';
import { SearchBar } from '../SearchBar.js';

interface MarketplaceSearchBarSectionProps {
  isDesignSystem: boolean;
  isGuides: boolean;
  isKnowledgeHub: boolean;
  searchQuery: string;
  queryParams: URLSearchParams;
  setQueryParams: (params: URLSearchParams) => void;
  setSearchQuery: (q: string) => void;
}

export const MarketplaceSearchBarSection: React.FC<MarketplaceSearchBarSectionProps> = ({
  isDesignSystem,
  isGuides,
  isKnowledgeHub,
  searchQuery,
  queryParams,
  setQueryParams,
  setSearchQuery
}) => {
  if (isDesignSystem) return null;
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex-1">
        <SearchBar
          searchQuery={isGuides ? (queryParams.get('q') || '') : searchQuery}
          placeholder={isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined}
          ariaLabel={isGuides || isKnowledgeHub ? "Search in DQ Knowledge Center" : undefined}
          setSearchQuery={(q: string) => {
            if (isGuides) {
              const next = new URLSearchParams(queryParams.toString());
              next.delete('page');
              if (q) next.set('q', q); else next.delete('q');
              const qs = next.toString();
              globalThis.history?.replaceState(null, '', `${globalThis.location?.pathname ?? ""}${qs ? '?' + qs : ''}`);
              setQueryParams(new URLSearchParams(next.toString()));
            } else {
              setSearchQuery(q);
            }
          }}
        />
      </div>
    </div>
  );
};
