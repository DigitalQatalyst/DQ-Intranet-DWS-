import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterOption {
  id: string;
  name: string;
}
export interface FilterGroup {
  title: string;
  options: FilterOption[];
}
export interface FilterConfig {
  id: string;
  title: string;
  options?: FilterOption[];
  groups?: FilterGroup[];
}
interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
export interface FilterSidebarProps {
  filters: Record<string, string[]>;
  filterConfig: FilterConfig[];
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
  defaultOpen?: boolean;
}
function AccordionSection({
  title,
  isOpen,
  onToggle,
  children
}: AccordionSectionProps) {
  return <div className="border-b border-gray-100 py-3">
      <button className="flex w-full justify-between items-center text-left font-medium text-gray-900 mb-2" onClick={onToggle} aria-expanded={isOpen}>
        {title}
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>;
}

export function FilterSidebar({
  filters,
  filterConfig,
  onFilterChange,
  onResetFilters,
  isResponsive = false,
  defaultOpen = true
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(Object.fromEntries(filterConfig.map(config => [config.id, defaultOpen])));
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const textSizeClass = isResponsive ? 'text-xs' : 'text-sm';
  const spacingClass = isResponsive ? 'space-y-1' : 'space-y-2';

  const renderOptions = (options: FilterOption[], sectionId: string, groupKey?: string) => (
    <div className={spacingClass}>
      {options.map(option => {
        const optionValue = option.id;
        const selectedValues = filters[sectionId] ?? [];
        const isChecked = selectedValues.includes(optionValue);
        const inputId = `${isResponsive ? 'mobile' : 'desktop'}-${sectionId}-${groupKey ?? 'option'}-${option.id}`;
        return <div key={option.id} className="flex items-center">
            <input
              type="checkbox"
              id={inputId}
              checked={isChecked}
              onChange={() => onFilterChange(sectionId, optionValue)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={inputId} className={`ml-2 ${textSizeClass} text-gray-700`}>
              {option.name}
            </label>
          </div>;
      })}
    </div>
  );

  return <div className="space-y-2">
      {filterConfig.map(config => <AccordionSection key={config.id} title={config.title} isOpen={openSections[config.id] ?? defaultOpen} onToggle={() => toggleSection(config.id)}>
          {config.groups && config.groups.length > 0 ? (
            <div className="space-y-3">
              {config.groups
                .filter(group => group.options.length > 0)
                .map(group => (
                  <div key={group.title} className="space-y-1">
                    <p className={`${textSizeClass} font-semibold text-gray-500 uppercase tracking-wide`}>
                      {group.title}
                    </p>
                    {renderOptions(group.options, config.id, group.title)}
                  </div>
                ))}
            </div>
          ) : (
            renderOptions(config.options ?? [], config.id)
          )}
        </AccordionSection>)}
    </div>;
}
