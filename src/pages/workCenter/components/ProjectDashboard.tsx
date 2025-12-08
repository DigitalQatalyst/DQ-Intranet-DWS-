import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Circle } from 'lucide-react';

interface WorkItem {
  id: string;
  title: string;
  assignedTo: string;
  state: 'new' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  workItemType: 'bug' | 'build' | 'develop' | 'RAID' | 'test case';
  activityDate: Date;
  tags: string[];
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  department: string[];
  location: string[];
  workItems: WorkItem[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

interface ProjectDashboardProps {
  project: Project;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const total = project.workItems.length;
    const byState = {
      new: project.workItems.filter(item => item.state === 'new').length,
      active: project.workItems.filter(item => item.state === 'active').length,
      resolved: project.workItems.filter(item => item.state === 'resolved').length,
      closed: project.workItems.filter(item => item.state === 'closed').length,
    };
    const byPriority = {
      high: project.workItems.filter(item => item.priority === 'high').length,
      medium: project.workItems.filter(item => item.priority === 'medium').length,
      low: project.workItems.filter(item => item.priority === 'low').length,
    };
    const byWorkItemType = {
      bug: project.workItems.filter(item => item.workItemType === 'bug').length,
      build: project.workItems.filter(item => item.workItemType === 'build').length,
      develop: project.workItems.filter(item => item.workItemType === 'develop').length,
      RAID: project.workItems.filter(item => item.workItemType === 'RAID').length,
      'test case': project.workItems.filter(item => item.workItemType === 'test case').length,
    };
    const completionRate = total > 0 ? ((byState.closed + byState.resolved) / total * 100).toFixed(0) : 0;

    return { total, byState, byPriority, byWorkItemType, completionRate };
  }, [project.workItems]);

  // Prepare data for bar chart
  const maxValue = Math.max(
    ...Object.values(stats.byState),
    ...Object.values(stats.byPriority),
    ...Object.values(stats.byWorkItemType)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <BarChart3 className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.byState.active}</p>
            </div>
            <Clock className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.byState.closed + stats.byState.resolved}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.byState).map(([state, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
              const barWidth = maxValue > 0 ? (count / maxValue * 100) : 0;
              
              const stateColors: Record<string, string> = {
                new: 'bg-gray-400',
                active: 'bg-blue-500',
                resolved: 'bg-green-500',
                closed: 'bg-gray-600',
              };

              return (
                <div key={state}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {state}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${stateColors[state] || 'bg-gray-400'} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.byPriority).map(([priority, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
              const barWidth = maxValue > 0 ? (count / maxValue * 100) : 0;
              
              const priorityColors: Record<string, string> = {
                high: 'bg-red-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500',
              };

              return (
                <div key={priority}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {priority}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${priorityColors[priority] || 'bg-gray-400'} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Item Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Item Type Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.byWorkItemType).map(([type, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
              const barWidth = maxValue > 0 ? (count / maxValue * 100) : 0;
              
              const typeColors: Record<string, string> = {
                bug: 'bg-red-500',
                build: 'bg-blue-500',
                develop: 'bg-green-500',
                RAID: 'bg-purple-500',
                'test case': 'bg-orange-500',
              };

              return (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${typeColors[type] || 'bg-gray-400'} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Work Items</h3>
        <div className="space-y-3">
          {project.workItems
            .sort((a, b) => b.activityDate.getTime() - a.activityDate.getTime())
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.assignedTo} • {item.activityDate.toLocaleDateString()} • {item.workItemType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      item.state === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : item.state === 'resolved' || item.state === 'closed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.state}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

