import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, ExternalLink, MessageCircle, FileText, Calendar as CalendarIcon } from 'lucide-react';

interface TrackerItem {
  id: string;
  featureItem: string;
  owner: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  startDate: Date;
  targetDate: Date;
  nextBestActions: string;
  taskLink: string;
  chatEngagementLink: string;
  outputLink: string;
}

interface DepartmentTracker {
  id: string;
  department: string;
  location: string[];
  items: TrackerItem[];
}

interface TrackerDetailPageProps {
  tracker: DepartmentTracker;
  onBack: () => void;
}

export const TrackerDetailPage: React.FC<TrackerDetailPageProps> = ({ tracker, onBack }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  const isOverdue = (targetDate: Date) => {
    return new Date() > targetDate;
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link
              to="/work-center/trackers"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center"
            >
              <HomeIcon size={16} className="mr-1" />
              <span>Work Center</span>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">{tracker.department} Tracker</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{tracker.department} Tracker</h2>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{tracker.items.length} feature items</span>
          <span>•</span>
          <span>{tracker.location.join(', ')}</span>
        </div>
      </div>

      {/* Excel-like table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Feature Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Target Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Next Best Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Task Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Chat Engagement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Output Link
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tracker.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.featureItem}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                    {item.owner}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} className="text-gray-400" />
                      {item.startDate.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                    <div className={`flex items-center gap-1 ${isOverdue(item.targetDate) && item.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      <CalendarIcon size={14} className={isOverdue(item.targetDate) && item.status !== 'completed' ? 'text-red-600' : 'text-gray-400'} />
                      {item.targetDate.toLocaleDateString()}
                      {isOverdue(item.targetDate) && item.status !== 'completed' && (
                        <span className="ml-1 text-red-600">⚠</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 max-w-xs">
                    <div className="truncate" title={item.nextBestActions}>
                      {item.nextBestActions}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                    <a
                      href={item.taskLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText size={14} />
                      <span>Task</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                    <a
                      href={item.chatEngagementLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={14} />
                      <span>Chat</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <a
                      href={item.outputLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText size={14} />
                      <span>Output</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

