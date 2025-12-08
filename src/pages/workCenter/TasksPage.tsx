import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from '../../components/marketplace/FilterSidebar';
import { FilterIcon, XIcon, Plus, HomeIcon, ChevronRightIcon, BarChart3 } from 'lucide-react';
import { ProjectDashboard } from './components/ProjectDashboard';
import { AddTaskModal } from './components/AddTaskModal';

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
  client: string;
  projectLead: string;
  department: string[];
  location: string[];
  workItems: WorkItem[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  description?: string;
}

// Dummy projects with client and project lead
const dummyProjects: Project[] = [
  {
    id: 'dq-dws',
    name: 'DQ DWS',
    client: 'DQ Corp Website',
    projectLead: 'Salem Wasike',
    department: ['Products'],
    location: ['Dubai'],
    status: 'in-progress',
    description: 'Digital Workspace platform for DQ associates to collaborate, access resources, and manage their work efficiently.',
    workItems: [
      {
        id: 'dq-dws-1',
        title: 'Implement user authentication system',
        assignedTo: 'John Doe',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 10),
        tags: ['frontend', 'security'],
        projectId: 'dq-dws',
        context: 'Need secure authentication for DQ DWS platform',
        purpose: 'Enable secure user access with OAuth integration',
        mvps: ['Basic login flow', 'Password reset functionality', 'Session management'],
        discussion: ['Discuss OAuth integration with team', 'Review security requirements'],
        checklist: [
          { id: '1', text: 'Design auth flow', completed: true },
          { id: '2', text: 'Implement login', completed: false },
          { id: '3', text: 'Add password reset', completed: false },
        ],
      },
      {
        id: 'dq-dws-2',
        title: 'Fix login button styling issue',
        assignedTo: 'Jane Smith',
        state: 'new',
        priority: 'medium',
        workItemType: 'bug',
        activityDate: new Date(2025, 0, 12),
        tags: ['frontend', 'ui'],
        projectId: 'dq-dws',
        context: 'Login button has incorrect styling',
        purpose: 'Fix UI bug',
        mvps: ['Fix button styles', 'Test on different browsers'],
      },
      {
        id: 'dq-dws-3',
        title: 'Optimize database queries',
        assignedTo: 'Mike Johnson',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 8),
        tags: ['backend', 'database'],
        projectId: 'dq-dws',
        context: 'Database performance is slow',
        purpose: 'Improve query performance and reduce load times',
        mvps: ['Index optimization', 'Query caching', 'Connection pooling'],
      },
    ],
  },
  {
    id: 'kf-inc-03',
    name: 'KF Inc 03',
    client: 'KF',
    projectLead: 'Dennis Mwangi',
    department: ['Solutions'],
    location: ['Nairobi'],
    status: 'in-progress',
    description: 'Third iteration of the KF platform focusing on enhanced features and improved user experience.',
    workItems: [
      {
        id: 'kf-03-1',
        title: 'Setup CI/CD pipeline',
        assignedTo: 'Alice Brown',
        state: 'active',
        priority: 'high',
        workItemType: 'build',
        activityDate: new Date(2025, 0, 15),
        tags: ['devops', 'ci-cd'],
        projectId: 'kf-inc-03',
        context: 'Need automated deployment process',
        purpose: 'Streamline deployment and reduce manual errors',
        mvps: ['GitHub Actions setup', 'Test automation', 'Deployment scripts'],
      },
      {
        id: 'kf-03-2',
        title: 'Implement API documentation',
        assignedTo: 'Bob Wilson',
        state: 'new',
        priority: 'medium',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 18),
        tags: ['documentation', 'api'],
        projectId: 'kf-inc-03',
        context: 'APIs need comprehensive documentation',
        purpose: 'Help developers understand API usage',
        mvps: ['Swagger setup', 'Endpoint documentation', 'Examples'],
      },
      {
        id: 'kf-03-3',
        title: 'Write unit tests for authentication',
        assignedTo: 'Sarah Davis',
        state: 'resolved',
        priority: 'high',
        workItemType: 'test case',
        activityDate: new Date(2025, 0, 5),
        tags: ['testing', 'backend'],
        projectId: 'kf-inc-03',
        context: 'Need test coverage for auth module',
        purpose: 'Ensure authentication reliability',
        mvps: ['Unit tests', 'Integration tests', 'Test documentation'],
      },
    ],
  },
  {
    id: 'kf-inc-02',
    name: 'KF Inc 02',
    client: 'KF',
    projectLead: 'Dennis Mwangi',
    department: ['Products'],
    location: ['Nairobi'],
    status: 'completed',
    description: 'Second iteration of the KF platform with reporting dashboard and role-based access control.',
    workItems: [
      {
        id: 'kf-02-1',
        title: 'Build reporting dashboard',
        assignedTo: 'Tom Anderson',
        state: 'closed',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2024, 11, 20),
        tags: ['frontend', 'analytics'],
        projectId: 'kf-inc-02',
        context: 'Need insights into business metrics',
        purpose: 'Provide real-time business intelligence',
        mvps: ['Chart components', 'Data aggregation', 'Export functionality'],
      },
      {
        id: 'kf-02-2',
        title: 'Fix data export bug',
        assignedTo: 'Lisa Chen',
        state: 'closed',
        priority: 'medium',
        workItemType: 'bug',
        activityDate: new Date(2024, 11, 25),
        tags: ['backend', 'export'],
        projectId: 'kf-inc-02',
        context: 'Export functionality has issues',
        purpose: 'Fix export bug',
        mvps: ['Fix export logic', 'Test export'],
      },
      {
        id: 'kf-02-3',
        title: 'Performance testing and optimization',
        assignedTo: 'David Kim',
        state: 'closed',
        priority: 'medium',
        workItemType: 'test case',
        activityDate: new Date(2024, 11, 28),
        tags: ['testing', 'performance'],
        projectId: 'kf-inc-02',
        context: 'System needs performance validation',
        purpose: 'Ensure system meets performance requirements',
        mvps: ['Load testing', 'Performance metrics', 'Optimization'],
      },
    ],
  },
  {
    id: 'dfsa-skunk',
    name: 'DFSA Skunk',
    client: 'SAIB BPM',
    projectLead: 'Rayyan Basha',
    department: ['Intelligence'],
    location: ['Riyadh'],
    status: 'in-progress',
    description: 'Data analytics and visualization platform for business intelligence and decision-making.',
    workItems: [
      {
        id: 'dfsa-1',
        title: 'Develop data analytics engine',
        assignedTo: 'Emma Watson',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 14),
        tags: ['backend', 'analytics'],
        projectId: 'dfsa-skunk',
        context: 'Need advanced analytics capabilities',
        purpose: 'Enable data-driven decision making',
        mvps: ['Data processing', 'Analytics algorithms', 'API endpoints'],
      },
      {
        id: 'dfsa-2',
        title: 'Create data visualization components',
        assignedTo: 'Ryan Murphy',
        state: 'new',
        priority: 'medium',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 16),
        tags: ['frontend', 'visualization'],
        projectId: 'dfsa-skunk',
        context: 'Users need to visualize complex data',
        purpose: 'Make data insights accessible',
        mvps: ['Chart library', 'Custom visualizations', 'Interactive graphs'],
      },
      {
        id: 'dfsa-3',
        title: 'Document RAID items',
        assignedTo: 'Olivia Martinez',
        state: 'active',
        priority: 'low',
        workItemType: 'RAID',
        activityDate: new Date(2025, 0, 17),
        tags: ['documentation', 'risk'],
        projectId: 'dfsa-skunk',
        context: 'Need to track risks and issues',
        purpose: 'Maintain RAID log',
        mvps: ['Risk documentation', 'Issue tracking', 'Action items'],
      },
    ],
  },
  {
    id: 'dewa-skunk',
    name: 'DEWA Skunk',
    client: 'TMAAS',
    projectLead: 'Hammton Ndeke',
    department: ['Solutions'],
    location: ['Dubai'],
    status: 'not-started',
    description: 'New project for DEWA focusing on infrastructure setup and system architecture design.',
    workItems: [
      {
        id: 'dewa-1',
        title: 'Setup project infrastructure',
        assignedTo: 'Chris Lee',
        state: 'new',
        priority: 'high',
        workItemType: 'build',
        activityDate: new Date(2025, 1, 1),
        tags: ['devops', 'infrastructure'],
        projectId: 'dewa-skunk',
        context: 'New project needs infrastructure setup',
        purpose: 'Prepare environment for development',
        mvps: ['Cloud resources', 'Networking', 'Security groups'],
      },
      {
        id: 'dewa-2',
        title: 'Design system architecture',
        assignedTo: 'Priya Patel',
        state: 'new',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 1, 2),
        tags: ['architecture', 'design'],
        projectId: 'dewa-skunk',
        context: 'Need to define system structure',
        purpose: 'Ensure scalable and maintainable design',
        mvps: ['Architecture diagrams', 'Component design', 'API specifications'],
      },
      {
        id: 'dewa-3',
        title: 'Setup development environment',
        assignedTo: 'Alex Taylor',
        state: 'new',
        priority: 'medium',
        workItemType: 'build',
        activityDate: new Date(2025, 1, 3),
        tags: ['devops', 'setup'],
        projectId: 'dewa-skunk',
        context: 'Developers need local environment',
        purpose: 'Enable efficient development workflow',
        mvps: ['Docker setup', 'Local database', 'Dev tools'],
      },
    ],
  },
  {
    id: 'dq-corp-website',
    name: 'DQ Corp Website',
    client: 'DQ Corp Website',
    projectLead: 'Salem Wasike',
    department: ['Products'],
    location: ['Dubai'],
    status: 'in-progress',
    description: 'Corporate website redesign with modern UI, improved SEO, and enhanced mobile experience.',
    workItems: [
      {
        id: 'dq-corp-1',
        title: 'Redesign homepage',
        assignedTo: 'John Doe',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 20),
        tags: ['frontend', 'design'],
        projectId: 'dq-corp-website',
        context: 'Homepage needs modern redesign',
        purpose: 'Improve user engagement',
        mvps: ['New layout', 'Updated content', 'Responsive design'],
      },
      {
        id: 'dq-corp-2',
        title: 'Fix mobile navigation bug',
        assignedTo: 'Jane Smith',
        state: 'new',
        priority: 'medium',
        workItemType: 'bug',
        activityDate: new Date(2025, 0, 22),
        tags: ['frontend', 'mobile'],
        projectId: 'dq-corp-website',
        context: 'Mobile navigation not working',
        purpose: 'Fix mobile UX issue',
        mvps: ['Fix navigation', 'Test on devices'],
      },
      {
        id: 'dq-corp-3',
        title: 'Add SEO optimization',
        assignedTo: 'Mike Johnson',
        state: 'active',
        priority: 'medium',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 18),
        tags: ['seo', 'frontend'],
        projectId: 'dq-corp-website',
        context: 'Website needs SEO improvements',
        purpose: 'Improve search rankings',
        mvps: ['Meta tags', 'Structured data', 'Sitemap'],
      },
    ],
  },
  {
    id: 'graphdb',
    name: 'GraphDB',
    client: 'GraphDB',
    projectLead: 'Godwin Ounza',
    department: ['Products'],
    location: ['Remote'],
    status: 'in-progress',
    description: 'Graph database system with query engine and visualization capabilities for complex data relationships.',
    workItems: [
      {
        id: 'graphdb-1',
        title: 'Implement graph query engine',
        assignedTo: 'Alice Brown',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 16),
        tags: ['backend', 'database'],
        projectId: 'graphdb',
        context: 'Need graph database functionality',
        purpose: 'Enable graph queries',
        mvps: ['Query parser', 'Execution engine', 'Result formatting'],
      },
      {
        id: 'graphdb-2',
        title: 'Build graph visualization UI',
        assignedTo: 'Bob Wilson',
        state: 'new',
        priority: 'medium',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 19),
        tags: ['frontend', 'visualization'],
        projectId: 'graphdb',
        context: 'Users need to visualize graphs',
        purpose: 'Make graph data accessible',
        mvps: ['Graph canvas', 'Interactive controls', 'Export options'],
      },
      {
        id: 'graphdb-3',
        title: 'Write integration tests',
        assignedTo: 'Sarah Davis',
        state: 'new',
        priority: 'low',
        workItemType: 'test case',
        activityDate: new Date(2025, 0, 21),
        tags: ['testing', 'integration'],
        projectId: 'graphdb',
        context: 'Need integration test coverage',
        purpose: 'Ensure system reliability',
        mvps: ['Test suite', 'CI integration', 'Documentation'],
      },
    ],
  },
  {
    id: 'dtmp',
    name: 'DTMP',
    client: 'DTMP',
    projectLead: 'Salem Wasike',
    department: ['Products'],
    location: ['Dubai'],
    status: 'in-progress',
    description: 'Digital transformation management platform with API endpoints and automated build pipelines.',
    workItems: [
      {
        id: 'dtmp-1',
        title: 'Develop API endpoints',
        assignedTo: 'Tom Anderson',
        state: 'active',
        priority: 'high',
        workItemType: 'develop',
        activityDate: new Date(2025, 0, 17),
        tags: ['backend', 'api'],
        projectId: 'dtmp',
        context: 'Need RESTful API',
        purpose: 'Enable API access',
        mvps: ['Endpoint design', 'Implementation', 'Documentation'],
      },
      {
        id: 'dtmp-2',
        title: 'Fix authentication bug',
        assignedTo: 'Lisa Chen',
        state: 'new',
        priority: 'high',
        workItemType: 'bug',
        activityDate: new Date(2025, 0, 20),
        tags: ['backend', 'security'],
        projectId: 'dtmp',
        context: 'Auth token expiration issue',
        purpose: 'Fix security bug',
        mvps: ['Fix token logic', 'Test auth flow'],
      },
      {
        id: 'dtmp-3',
        title: 'Setup build pipeline',
        assignedTo: 'David Kim',
        state: 'active',
        priority: 'medium',
        workItemType: 'build',
        activityDate: new Date(2025, 0, 15),
        tags: ['devops', 'ci-cd'],
        projectId: 'dtmp',
        context: 'Need automated builds',
        purpose: 'Streamline development',
        mvps: ['CI setup', 'Build scripts', 'Deployment'],
      },
    ],
  },
];

export { dummyProjects };

interface TasksPageProps {
  searchQuery: string;
}

type ViewType = 'list' | 'dashboard';

export const TasksPage: React.FC<TasksPageProps> = ({ searchQuery }) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('list');

  const selectedProjectId = projectId;

  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  // Parse filters from URL
  const departmentFilters = useMemo(() => {
    const dept = searchParams.get('department');
    return dept ? dept.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const clientFilters = useMemo(() => {
    const client = searchParams.get('client');
    return client ? client.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const projectLeadFilters = useMemo(() => {
    const lead = searchParams.get('projectLead');
    return lead ? lead.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Work item filters - always call these hooks
  const workItemStatusFilters = useMemo(() => {
    const status = searchParams.get('workItemStatus');
    return status ? status.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const workItemPriorityFilters = useMemo(() => {
    const priority = searchParams.get('workItemPriority');
    return priority ? priority.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const workItemTypeFilters = useMemo(() => {
    const type = searchParams.get('workItemType');
    return type ? type.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const workItemSortBy = searchParams.get('workItemSortBy') || 'date-desc';

  // Get selected project
  const selectedProject = selectedProjectId
    ? dummyProjects.find(p => p.id === selectedProjectId)
    : null;

  // Filter work items for selected project
  const filteredWorkItems = useMemo(() => {
    if (!selectedProject) return [];
    
    let items = selectedProject.workItems;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.assignedTo.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (workItemStatusFilters.length > 0 && !workItemStatusFilters.includes('all')) {
      items = items.filter(item => workItemStatusFilters.includes(item.state));
    }

    if (workItemPriorityFilters.length > 0 && !workItemPriorityFilters.includes('all')) {
      items = items.filter(item => workItemPriorityFilters.includes(item.priority));
    }

    if (workItemTypeFilters.length > 0 && !workItemTypeFilters.includes('all')) {
      items = items.filter(item => workItemTypeFilters.includes(item.workItemType));
    }

    // Sort
    items = [...items].sort((a, b) => {
      if (workItemSortBy === 'date-desc') {
        return b.activityDate.getTime() - a.activityDate.getTime();
      } else if (workItemSortBy === 'date-asc') {
        return a.activityDate.getTime() - b.activityDate.getTime();
      }
      return 0;
    });

    return items;
  }, [selectedProject, searchQuery, workItemStatusFilters, workItemPriorityFilters, workItemTypeFilters, workItemSortBy]);


  const handleWorkItemSortChange = useCallback((sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('workItemSortBy', sort);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = new Set((newParams.get(filterType)?.split(',').filter(Boolean)) || []);

    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }

    if (current.size > 0) {
      newParams.set(filterType, Array.from(current).join(','));
    } else {
      newParams.delete(filterType);
    }

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const clients = ['KF', 'SAIB BPM', 'DQ Corp Website', 'TMAAS', 'GraphDB', 'DTMP'];
  const projectLeads = ['Dennis Mwangi', 'Hammton Ndeke', 'Salem Wasike', 'Godwin Ounza', 'Rayyan Basha'];

  const filterConfig: FilterConfig[] = useMemo(() => [
    {
      id: 'department',
      title: 'Department',
      options: [
        { id: 'HRA (People)', name: 'HRA (People)' },
        { id: 'Finance', name: 'Finance' },
        { id: 'Deals', name: 'Deals' },
        { id: 'Stories', name: 'Stories' },
        { id: 'Intelligence', name: 'Intelligence' },
        { id: 'Solutions', name: 'Solutions' },
        { id: 'SecDevOps', name: 'SecDevOps' },
        { id: 'Products', name: 'Products' },
        { id: 'Delivery - Deploys', name: 'Delivery — Deploys' },
        { id: 'Delivery - Designs', name: 'Delivery — Designs' },
        { id: 'DCO Operations', name: 'DCO Operations' },
        { id: 'DBP Platform', name: 'DBP Platform' },
        { id: 'DBP Delivery', name: 'DBP Delivery' },
      ],
    },
    {
      id: 'client',
      title: 'Client',
      options: clients.map(client => ({ id: client, name: client })),
    },
    {
      id: 'projectLead',
      title: 'Project Lead',
      options: projectLeads.map(lead => ({ id: lead, name: lead })),
    },
  ], []);

  const urlBasedFilters: Record<string, string[]> = useMemo(() => ({
    department: departmentFilters,
    client: clientFilters,
    projectLead: projectLeadFilters,
  }), [departmentFilters, clientFilters, projectLeadFilters]);

  const filteredProjects = useMemo(() => {
    let filtered = dummyProjects;

    if (departmentFilters.length > 0) {
      filtered = filtered.filter(project =>
        project.department.some(dept => departmentFilters.includes(dept))
      );
    }

    if (clientFilters.length > 0) {
      filtered = filtered.filter(project =>
        clientFilters.includes(project.client)
      );
    }

    if (projectLeadFilters.length > 0) {
      filtered = filtered.filter(project =>
        projectLeadFilters.includes(project.projectLead)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [departmentFilters, clientFilters, projectLeadFilters, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If project is selected, show project work items
  if (selectedProject) {
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
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">{selectedProject.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProject.name}</h2>
          {selectedProject.description && (
            <p className="text-gray-600 mb-4">{selectedProject.description}</p>
          )}
          <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
            <span>Client: <span className="font-medium">{selectedProject.client}</span></span>
            <span>•</span>
            <span>Project Lead: <span className="font-medium">{selectedProject.projectLead}</span></span>
            <span>•</span>
            <span>Status: <span className="font-medium capitalize">{selectedProject.status}</span></span>
            <span>•</span>
            <span>{selectedProject.workItems.length} work items</span>
          </div>
        </div>

        {/* View tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setViewType('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                viewType === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Work Items
            </button>
            <button
              onClick={() => setViewType('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                viewType === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={16} />
              Dashboard
            </button>
          </nav>
        </div>

        {/* Work Item Filters */}
        {viewType === 'list' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={workItemSortBy}
                  onChange={(e) => handleWorkItemSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={workItemStatusFilters.length > 0 ? workItemStatusFilters[0] : 'all'}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value === 'all') {
                      newParams.delete('workItemStatus');
                    } else {
                      newParams.set('workItemStatus', e.target.value);
                    }
                    setSearchParams(newParams, { replace: true });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={workItemPriorityFilters.length > 0 ? workItemPriorityFilters[0] : 'all'}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value === 'all') {
                      newParams.delete('workItemPriority');
                    } else {
                      newParams.set('workItemPriority', e.target.value);
                    }
                    setSearchParams(newParams, { replace: true });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Item Type</label>
                <select
                  value={workItemTypeFilters.length > 0 ? workItemTypeFilters[0] : 'all'}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value === 'all') {
                      newParams.delete('workItemType');
                    } else {
                      newParams.set('workItemType', e.target.value);
                    }
                    setSearchParams(newParams, { replace: true });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="bug">Bug</option>
                  <option value="build">Build</option>
                  <option value="develop">Develop</option>
                  <option value="RAID">RAID</option>
                  <option value="test case">Test Case</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {viewType === 'dashboard' ? (
          <ProjectDashboard project={selectedProject} />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Work Items ({filteredWorkItems.length})
              </h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Work Item
              </button>
            </div>

            <div className="space-y-3">
              {filteredWorkItems.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No work items found</p>
                </div>
              ) : (
                filteredWorkItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/work-center/projects/${selectedProject.id}/tasks/${item.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span>Assigned to: {item.assignedTo}</span>
                          <span>•</span>
                          <span className="capitalize">{item.state}</span>
                          <span>•</span>
                          <span className="capitalize">{item.workItemType}</span>
                          <span>•</span>
                          <span>{item.activityDate.toLocaleDateString()}</span>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showAddTask && (
          <AddTaskModal
            projects={[selectedProject]}
            isOpen={showAddTask}
            onClose={() => setShowAddTask(false)}
          />
        )}
      </div>
    );
  }

  // Show projects list

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Mobile filter toggle */}
      <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
          >
            <FilterIcon size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
            <button
              onClick={resetFilters}
              className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter sidebar - mobile/tablet */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-30 xl:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={urlBasedFilters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter sidebar - desktop */}
      <div className="hidden xl:block xl:w-1/4">
        <div className="bg-white rounded-lg shadow p-4 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {Object.values(urlBasedFilters).some(f => Array.isArray(f) && f.length > 0) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 text-sm font-medium"
              >
                Reset All
              </button>
            )}
          </div>
          <FilterSidebar
            filters={urlBasedFilters}
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            isResponsive={false}
          />
        </div>
      </div>

      {/* Main content - Projects List */}
      <div className="xl:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Projects ({filteredProjects.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/work-center/projects/${project.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Client: <span className="font-medium">{project.client}</span></p>
                <p>Project Lead: <span className="font-medium">{project.projectLead}</span></p>
                <p>{project.workItems.length} work items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
