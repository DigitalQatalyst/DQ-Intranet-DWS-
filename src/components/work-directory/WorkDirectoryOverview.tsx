import React from 'react';

interface WorkDirectoryOverviewProps {
  activeTab: 'units' | 'positions' | 'associates';
}

export function WorkDirectoryOverview({ activeTab }: WorkDirectoryOverviewProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">DQ Work Directory</h2>
      <p className="text-sm text-slate-600">
        {activeTab === 'units' && 'Explore DQ sectors, factories, and work units to understand organizational structure and mandates.'}
        {activeTab === 'positions' && 'Browse available positions and roles across DQ to understand responsibilities and requirements.'}
        {activeTab === 'associates' && 'Find and connect with DQ associates to understand who does what and how to contact them.'}
      </p>
    </div>
  );
}

