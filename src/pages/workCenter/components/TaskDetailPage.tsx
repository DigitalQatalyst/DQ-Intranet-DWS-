import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, User, Calendar, Tag, CheckCircle2, Circle } from 'lucide-react';

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
  context?: string;
  purpose?: string;
  mvps?: string[];
  discussion?: string[];
  checklist?: Array<{ id: string; text: string; completed: boolean }>;
}

interface Project {
  id: string;
  name: string;
  department: string[];
  location: string[];
  workItems: WorkItem[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

interface TaskDetailPageProps {
  task: WorkItem;
  project: Project;
  onBack: () => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({ task, project, onBack }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'new':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <Link
                to="/work-center/projects"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Work Center</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link
                  to={`/work-center/projects/${project.id}`}
                  className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                >
                  {project.name}
                </Link>
              </div>
            </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">{task.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{task.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded capitalize ${getStateColor(
                    task.state
                  )}`}
                >
                  {task.state}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.toUpperCase()} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="font-medium text-gray-800">{task.assignedTo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Activity Date</p>
                <p className="font-medium text-gray-800">
                  {task.activityDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Work Item Type */}
          <div>
            <p className="font-medium text-gray-800 mb-2">Work Item Type</p>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded capitalize">
              {task.workItemType}
            </span>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <div className="flex items-start gap-3 mb-2">
                <Tag className="text-gray-400 mt-1" size={20} />
                <p className="font-medium text-gray-800">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context */}
          {task.context && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Context</p>
              <p className="text-gray-600 bg-gray-50 p-4 rounded">{task.context}</p>
            </div>
          )}

          {/* Purpose */}
          {task.purpose && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Purpose</p>
              <p className="text-gray-600 bg-gray-50 p-4 rounded">{task.purpose}</p>
            </div>
          )}

          {/* MVPs */}
          {task.mvps && task.mvps.length > 0 && (
            <div>
              <p className="font-medium text-gray-800 mb-2">MVPs</p>
              <ul className="space-y-1 ml-4">
                {task.mvps.map((mvp, index) => (
                  <li key={index} className="text-gray-600 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{mvp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discussion */}
          {task.discussion && task.discussion.length > 0 && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Discussion</p>
              <div className="bg-gray-50 p-4 rounded space-y-2">
                {task.discussion.map((comment, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-gray-600">{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Checklist</p>
              <div className="space-y-2">
                {task.checklist.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                    ) : (
                      <Circle className="text-gray-400 mt-0.5" size={20} />
                    )}
                    <span
                      className={`${
                        item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <Link
            to={`/work-center/projects/${project.id}`}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};
