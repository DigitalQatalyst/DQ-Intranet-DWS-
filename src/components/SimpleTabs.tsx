import React from 'react';

export interface SimpleTab {
  id: string;
  label: string;
}

interface SimpleTabsProps {
  tabs: SimpleTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export function SimpleTabs({ tabs, activeTabId, onTabChange }: SimpleTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  isActive
                    ? 'border-[#030F35] text-[#030F35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

