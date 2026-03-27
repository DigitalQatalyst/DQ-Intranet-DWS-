import React from 'react';

interface WorkDirectoryOverviewProps {
  activeTab: 'units' | 'positions' | 'associates';
}

export function WorkDirectoryOverview({ activeTab }: WorkDirectoryOverviewProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'units':
        return 'Units Directory';
      case 'positions':
        return 'Positions Directory';
      case 'associates':
        return 'Associates Directory';
      default:
        return 'Work Directory';
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case 'units':
        return 'A structured catalogue of DQ sectors and work units, including mandates, priorities, and performance focus.';
      case 'positions':
        return 'Browse available positions and roles across DQ to understand responsibilities, requirements, and career paths.';
      case 'associates':
        return 'Find and connect with DQ associates to understand who does what, their skills, and how to contact them.';
      default:
        return 'Explore DQ sectors, work units, positions, and associate profiles to understand who does what and how to contact them.';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          CURRENT FOCUS
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 mt-2">
          {getTitle()}
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          {getDescription()}
        </p>
      </div>
      <button className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium shadow-sm hover:bg-indigo-100 transition">
        Tab overview
      </button>
    </div>
  );
}
