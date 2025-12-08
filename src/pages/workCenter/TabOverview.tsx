import React from 'react';
import { X } from 'lucide-react';

type TabType = 'sessions' | 'tasks' | 'trackers';

interface TabOverviewProps {
  activeTab: TabType;
  onClose: () => void;
}

export const TabOverview: React.FC<TabOverviewProps> = ({ activeTab, onClose }) => {
  const overviews = {
    sessions: {
      title: 'Sessions Overview',
      description: 'View and manage recurring organizational sessions',
      items: [
        'Calendar view showing all recurring sessions',
        'Filter by session type: retro, CWS, onboarding, scrum',
        'Click on sessions to view attendees and agenda',
        'Similar to Teams calendar interface',
      ],
    },
    tasks: {
      title: 'Tasks Overview',
      description: 'Manage projects and work items across teams',
      items: [
        'View different projects and their work items',
        'Filter by owner, status, priority, and sort by date',
        'Add new work items to projects',
        'View detailed task information including context, purpose, MVPs, discussion, and checklist',
        'Similar to MS Planner or dev.azure.com interface',
      ],
    },
    trackers: {
      title: 'Trackers Overview',
      description: 'Track features and deliverables in Excel-like format',
      items: [
        'View feature items with owner, status, and dates',
        'Track start dates, target dates, and next best actions',
        'Access task links and MS Teams chat engagement links',
        'View output links for deliverables',
        'Excel-like table format for easy tracking',
      ],
    },
  };

  const overview = overviews[activeTab];

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
        aria-label="Close overview"
      >
        <X size={20} />
      </button>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{overview.title}</h3>
      <p className="text-gray-600 mb-4">{overview.description}</p>
      <ul className="space-y-2">
        {overview.items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

