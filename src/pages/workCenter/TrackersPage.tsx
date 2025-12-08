import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useParams, useNavigate, Outlet } from 'react-router-dom';
import { FilterSidebar, FilterConfig } from '../../components/marketplace/FilterSidebar';
import { FilterIcon, XIcon, ExternalLink, MessageCircle, FileText, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { TrackerDetailPage } from './components/TrackerDetailPage';

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

// Generate trackers for each department
const departments = [
  'HRA (People)',
  'Finance',
  'Deals',
  'Stories',
  'Intelligence',
  'Solutions',
  'SecDevOps',
  'Products',
  'Delivery - Deploys',
  'Delivery - Designs',
  'DCO Operations',
  'DBP Platform',
  'DBP Delivery',
];

function generateDepartmentTrackers(): DepartmentTracker[] {
  const trackers: DepartmentTracker[] = [];
  
  departments.forEach((dept, index) => {
    const locations = ['Dubai', 'Nairobi', 'Riyadh', 'Remote'];
    const location = locations[index % locations.length];
    
    const items: TrackerItem[] = [
      {
        id: `${dept}-1`,
        featureItem: `${dept} Feature 1`,
        owner: 'John Doe',
        status: 'in-progress',
        startDate: new Date(2025, 0, 1),
        targetDate: new Date(2025, 0, 31),
        nextBestActions: 'Review implementation, Test features, Deploy to staging',
        taskLink: `https://dev.azure.com/project/${dept.toLowerCase().replace(/\s+/g, '-')}-1`,
        chatEngagementLink: `https://teams.microsoft.com/l/channel/19:${dept.toLowerCase().replace(/\s+/g, '')}-1`,
        outputLink: `https://docs.google.com/document/${dept.toLowerCase().replace(/\s+/g, '-')}-1`,
      },
      {
        id: `${dept}-2`,
        featureItem: `${dept} Feature 2`,
        owner: 'Jane Smith',
        status: 'not-started',
        startDate: new Date(2025, 1, 1),
        targetDate: new Date(2025, 1, 28),
        nextBestActions: 'Define requirements, Create design mockups, Get stakeholder approval',
        taskLink: `https://dev.azure.com/project/${dept.toLowerCase().replace(/\s+/g, '-')}-2`,
        chatEngagementLink: `https://teams.microsoft.com/l/channel/19:${dept.toLowerCase().replace(/\s+/g, '')}-2`,
        outputLink: `https://docs.google.com/document/${dept.toLowerCase().replace(/\s+/g, '-')}-2`,
      },
      {
        id: `${dept}-3`,
        featureItem: `${dept} Feature 3`,
        owner: 'Mike Johnson',
        status: 'completed',
        startDate: new Date(2024, 11, 1),
        targetDate: new Date(2024, 11, 31),
        nextBestActions: 'Deploy to production, Notify stakeholders, Update documentation',
        taskLink: `https://dev.azure.com/project/${dept.toLowerCase().replace(/\s+/g, '-')}-3`,
        chatEngagementLink: `https://teams.microsoft.com/l/channel/19:${dept.toLowerCase().replace(/\s+/g, '')}-3`,
        outputLink: `https://docs.google.com/document/${dept.toLowerCase().replace(/\s+/g, '-')}-3`,
      },
      {
        id: `${dept}-4`,
        featureItem: `${dept} Feature 4`,
        owner: 'Sarah Davis',
        status: 'blocked',
        startDate: new Date(2025, 0, 15),
        targetDate: new Date(2025, 1, 15),
        nextBestActions: 'Resolve dependency issue, Contact infrastructure team, Update timeline',
        taskLink: `https://dev.azure.com/project/${dept.toLowerCase().replace(/\s+/g, '-')}-4`,
        chatEngagementLink: `https://teams.microsoft.com/l/channel/19:${dept.toLowerCase().replace(/\s+/g, '')}-4`,
        outputLink: `https://docs.google.com/document/${dept.toLowerCase().replace(/\s+/g, '-')}-4`,
      },
    ];
    
    trackers.push({
      id: dept.toLowerCase().replace(/\s+/g, '-'),
      department: dept,
      location: [location],
      items,
    });
  });
  
  return trackers;
}

export const dummyTrackers = generateDepartmentTrackers();

interface TrackersPageProps {
  searchQuery: string;
}

export const TrackersPage: React.FC<TrackersPageProps> = ({ searchQuery }) => {
  const { trackerId } = useParams<{ trackerId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const selectedTrackerId = trackerId;
  
  // If tracker is selected, render outlet for nested route
  if (selectedTrackerId) {
    return <Outlet />;
  }

  // Parse filters from URL - ALL HOOKS MUST BE CALLED FIRST
  const departmentFilters = useMemo(() => {
    const dept = searchParams.get('department');
    return dept ? dept.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Filter trackers
  const filteredTrackers = useMemo(() => {
    let filtered = dummyTrackers;

    if (departmentFilters.length > 0) {
      filtered = filtered.filter(tracker =>
        departmentFilters.includes(tracker.department)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tracker =>
        tracker.department.toLowerCase().includes(query) ||
        tracker.items.some(item =>
          item.featureItem.toLowerCase().includes(query) ||
          item.owner.toLowerCase().includes(query)
        )
      );
    }

    return filtered;
  }, [departmentFilters, searchQuery]);

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

  const filterConfig: FilterConfig[] = useMemo(() => [
      {
        id: 'department',
        title: 'Department',
        options: departments.map(dept => ({ id: dept, name: dept })),
      },
    ], []);

  const urlBasedFilters: Record<string, string[]> = useMemo(() => ({
    department: departmentFilters,
  }), [departmentFilters]);

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

      {/* Main content - Trackers List */}
      <div className="xl:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Department Trackers ({filteredTrackers.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrackers.map((tracker) => {
            const statusCounts = tracker.items.reduce((acc, item) => {
              acc[item.status] = (acc[item.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return (
              <div
                key={tracker.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/work-center/trackers/${tracker.id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{tracker.department}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    {tracker.items.length} feature items • {tracker.location.join(', ')}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <span
                        key={status}
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(status)}`}
                      >
                        {getStatusLabel(status)}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
