export type MediaCenterTabKey = 'announcements' | 'insights' | 'opportunities';

export type FacetOption = string | { value: string; label: string; description?: string };

export interface FacetConfig {
  key: string;
  label: string;
  options: FacetOption[];
}

export type FiltersValue = Record<string, string[]>;
