import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, FilterIcon, MapPin } from 'lucide-react';
import { SimpleTabs, SimpleTab } from '@/components/SimpleTabs';
import WorkDirectoryOverview from '../components/work-directory/WorkDirectoryOverview';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar, FilterConfig } from '../components/marketplace/FilterSidebar';
import { SearchBar } from '../components/SearchBar';
import { getUnitIconForName } from '../components/work-directory/getUnitIcon';
import { useAssociates, useWorkUnits, useWorkPositions } from '@/hooks/useWorkDirectory';

type TabKey = 'units' | 'positions' | 'associates';

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: 'units', label: 'Units' },
  { id: 'positions', label: 'Positions' },
  { id: 'associates', label: 'Associates' },
];
const DEPARTMENT_OPTIONS = [
  'HRA (People)',
  'Finance',
  'Deals',
  'Stories',
  'Intelligence',
  'Solutions',
  'SecDevOps',
  'Products',
  'Delivery — Deploys',
  'Delivery — Designs',
  'DCO Operations',
  'DBP Platform',
  'DBP Delivery',
];

const LOCATION_OPTIONS = ['Dubai', 'Nairobi', 'Riyadh', 'Remote'];

const globalFilterConfig: FilterConfig[] = [
  { id: 'department', title: 'Department', options: DEPARTMENT_OPTIONS.map((d) => ({ id: d, name: d })) },
  { id: 'location', title: 'Location', options: LOCATION_OPTIONS.map((l) => ({ id: l, name: l })) },
];

const POSITION_CATEGORY_OPTIONS: FilterConfig['options'] = [
  { id: 'Leadership', name: 'Leadership' },
  { id: 'Delivery', name: 'Delivery' },
  { id: 'Enablement', name: 'Enablement' },
  { id: 'Platform', name: 'Platform' },
];

const POSITION_LEVEL_OPTIONS: FilterConfig['options'] = [
  { id: 'Lead', name: 'Lead' },
  { id: 'Manager', name: 'Manager' },
  { id: 'Specialist', name: 'Specialist' },
  { id: 'Associate', name: 'Associate' },
];

const POSITION_STATUS_OPTIONS: FilterConfig['options'] = [
  { id: 'Filled', name: 'Filled' },
  { id: 'Vacant', name: 'Vacant' },
  { id: 'Coming soon', name: 'Coming soon' },
];

const toOptions = (values: Array<string | undefined | null>): FilterConfig['options'] => {
  const unique = Array.from(new Set(values.filter(Boolean) as string[]));
  return unique.map((value) => ({ id: value, name: value }));
};

const toOptionsFromArrays = (values: Array<string[] | undefined | null>): FilterConfig['options'] => {
  const flattened = values.flatMap((value) => (Array.isArray(value) ? value : []));
  return toOptions(flattened);
};

const createInitialFilters = (config: FilterConfig[]): Record<string, string[]> =>
  Object.fromEntries(config.map((item) => [item.id, [] as string[]]));

const locationLabel = (raw: string) => {
  const normalized = raw?.toUpperCase() || '';
  if (normalized === 'DXB' || raw === 'Dubai') return 'Dubai';
  if (normalized === 'NBO' || raw === 'Nairobi') return 'Nairobi';
  if (normalized === 'KSA' || raw === 'Riyadh') return 'Riyadh';
  if (normalized === 'REMOTE') return 'Remote';
  return raw || 'Remote';
};

const SFIA_LEVEL_OPTIONS = [
  { id: 'L0', name: 'L0. Starting (Learning)' },
  { id: 'L1', name: 'L1. Follow (Self Aware)' },
  { id: 'L2', name: 'L2. Assist (Self Lead)' },
  { id: 'L3', name: 'L3. Apply (Drive Squad)' },
  { id: 'L4', name: 'L4. Enable (Drive Team)' },
  { id: 'L5', name: 'L5. Ensure (Steer Org)' },
  { id: 'L6', name: 'L6. Influence (Steer Cross)' },
  { id: 'L7', name: 'L7. Inspire (Inspire Market)' },
];

const mapDepartment = (value?: string) => {
  if (!value) return '';
  const normalized = value.toLowerCase();
  if (normalized.includes('secdevops')) return 'SecDevOps';
  if (normalized.includes('solutions')) return 'Solutions';
  if (normalized.includes('intelligence')) return 'Intelligence';
  if (normalized.includes('products')) return 'Products';
  if (normalized.includes('deals')) return 'Deals';
  if (normalized.includes('stories')) return 'Stories';
  if (normalized.includes('hra') || normalized.includes('people')) return 'HRA (People)';
  if (normalized.includes('finance')) return 'Finance';
  if (normalized.includes('deploy')) return 'Delivery — Deploys';
  if (normalized.includes('design')) return 'Delivery — Designs';
  if (normalized.includes('dco')) return 'DCO Operations';
  if (normalized.includes('dbp platform') || normalized.includes('platform')) return 'DBP Platform';
  if (normalized.includes('dbp delivery') || normalized.includes('delivery')) return 'DBP Delivery';
  if (normalized.includes('coe')) return 'CoE Office';
  return value;
};

const DQWorkDirectoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('units');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('relevance');
  const PAGE_SIZE = 24;
  const [visibleCounts, setVisibleCounts] = useState<Record<TabKey, number>>({
    units: PAGE_SIZE,
    positions: PAGE_SIZE,
    associates: PAGE_SIZE,
  });

  // Fetch data from Supabase
  const { units: allUnits, loading: unitsLoading, error: unitsError } = useWorkUnits();
  const { positions: allPositions, loading: positionsLoading, error: positionsError } = useWorkPositions();
  const { associates: allAssociates, loading: associatesLoading, error: associatesError } = useAssociates();

  const unitFilterConfig = useMemo<FilterConfig[]>(
    () => [
      ...globalFilterConfig,
      { id: 'unitType', title: 'Unit Type', options: toOptions(allUnits.map((u) => u.unitType)) },
      { id: 'focusTags', title: 'Focus Tags', options: toOptionsFromArrays(allUnits.map((u) => u.focusTags)) },
    ],
    [allUnits]
  );

  const positionFilterConfig = useMemo<FilterConfig[]>(
    () => {
      const unitOptions = allUnits.map((u) => ({ id: u.slug, name: u.unitName }));
      return [
        { id: 'unitSlug', title: 'Unit', options: unitOptions },
        { id: 'category', title: 'Category', options: POSITION_CATEGORY_OPTIONS },
        { id: 'level', title: 'Level', options: POSITION_LEVEL_OPTIONS },
        { id: 'status', title: 'Status', options: POSITION_STATUS_OPTIONS },
      ];
    },
    [allUnits]
  );

  const associateFilterConfig = useMemo<FilterConfig[]>(
    () => [
      ...globalFilterConfig,
      {
        id: 'role',
        title: 'Role',
        options: toOptions(allAssociates.map((a) => a.currentRole)),
      },
      {
        id: 'level',
        title: 'Rating – SFIA',
        options: SFIA_LEVEL_OPTIONS,
      },
      {
        id: 'status',
        title: 'Status',
        options: toOptions(allAssociates.map((a) => a.status)),
      },
      { id: 'skills', title: 'Skills', options: toOptionsFromArrays(allAssociates.map((a) => a.keySkills)) },
    ],
    [allAssociates]
  );

  const [unitFilters, setUnitFilters] = useState<Record<string, string[]>>(() =>
    createInitialFilters(unitFilterConfig)
  );
  const [positionFilters, setPositionFilters] = useState<Record<string, string[]>>(() =>
    createInitialFilters(positionFilterConfig)
  );
  const [associateFilters, setAssociateFilters] = useState<Record<string, string[]>>(() =>
    createInitialFilters(associateFilterConfig)
  );

  const currentFilterConfig =
    activeTab === 'units'
      ? unitFilterConfig
      : activeTab === 'positions'
      ? positionFilterConfig
      : associateFilterConfig;

  const currentFilters =
    activeTab === 'units' ? unitFilters : activeTab === 'positions' ? positionFilters : associateFilters;

  const setFilters =
    activeTab === 'units' ? setUnitFilters : activeTab === 'positions' ? setPositionFilters : setAssociateFilters;

  const resetVisibleForTab = (tab: TabKey) =>
    setVisibleCounts((prev) => ({ ...prev, [tab]: PAGE_SIZE }));

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const existing = prev[filterType] || [];
      const nextValues = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return { ...prev, [filterType]: nextValues };
    });
    resetVisibleForTab(activeTab);
  };

  const resetFilters = () => {
    if (activeTab === 'units') {
      setUnitFilters(createInitialFilters(unitFilterConfig));
    } else if (activeTab === 'positions') {
      setPositionFilters(createInitialFilters(positionFilterConfig));
    } else {
      setAssociateFilters(createInitialFilters(associateFilterConfig));
    }
    resetVisibleForTab(activeTab);
  };

  const searchPlaceholder = 'Search by unit, position, associate name, skill, or keyword…';

  const query = searchQuery.toLowerCase();

  // Reset pagination on search or filter changes for the active tab
  React.useEffect(() => {
    resetVisibleForTab(activeTab);
  }, [searchQuery, unitFilters, positionFilters, associateFilters, activeTab]);

  const applySort = <T,>(items: T[], comparator: (a: T, b: T) => number) => {
    return [...items].sort(comparator);
  };

  const filteredUnits = useMemo(() => {
    const base = allUnits
      .filter((unit) => {
        if (!query) return true;
        const haystack = [
          unit.unitName,
          unit.sector,
          unit.unitType,
          unit.mandate,
          unit.location,
          ...(unit.focusTags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
      .filter((unit) => {
        const {
          unitType = [],
          focusTags = [],
          department = [],
          location = [],
        } = unitFilters;
        const unitLocation = locationLabel(unit.location);
        const matchesUnitType = unitType.length === 0 || unitType.includes(unit.unitType);
        const matchesDepartment = department.length === 0 || department.includes(unit.department);
        const matchesLocation = location.length === 0 || location.includes(unitLocation);
        const matchesFocus =
          focusTags.length === 0 || unit.focusTags.some((tag) => focusTags.includes(tag));
        return (
          matchesUnitType &&
          matchesDepartment &&
          matchesLocation &&
          matchesFocus
        );
      })
      .map((unit) => ({
        ...unit,
        departmentLabel: unit.department,
        locationLabel: locationLabel(unit.location),
      }));

    if (sort === 'az') {
      return applySort(base, (a, b) => a.unitName.localeCompare(b.unitName));
    }
    // Note: 'recent' sort removed as updated_at is not in schema
    // Default to relevance (no sort) when 'recent' is selected
    return base;
  }, [query, unitFilters, sort, allUnits]);
  const visibleUnits = filteredUnits.slice(0, visibleCounts.units);

  const unitSlugToName = useMemo(
    () => Object.fromEntries(allUnits.map((unit) => [unit.slug, unit.unitName])),
    [allUnits]
  );

  const filteredPositions = useMemo(() => {
    const base = allPositions
      .filter((position) => {
        if (!query) return true;
        const haystack = [
          position.title,
          position.summary,
          position.category,
          position.level,
          position.status,
          unitSlugToName[position.unitSlug] || position.unitSlug,
          ...(position.responsibilities || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
      .filter((position) => {
        const { unitSlug = [], category = [], level = [], status = [] } = positionFilters;
        const matchesUnit = unitSlug.length === 0 || unitSlug.includes(position.unitSlug);
        const matchesCategory = category.length === 0 || category.includes(position.category);
        const matchesLevel = level.length === 0 || level.includes(position.level);
        const matchesStatus = status.length === 0 || status.includes(position.status);
        return matchesUnit && matchesCategory && matchesLevel && matchesStatus;
      })
      .map((position) => ({
        ...position,
        unitName: unitSlugToName[position.unitSlug] || position.unitSlug,
      }));

    if (sort === 'az') {
      return applySort(base, (a, b) => a.title.localeCompare(b.title));
    }
    // Note: 'recent' sort removed as updated_at is not in schema
    // Default to relevance (no sort) when 'recent' is selected
    return base;
  }, [query, positionFilters, sort, allPositions]);
  const visiblePositions = filteredPositions.slice(0, visibleCounts.positions);

  const filteredAssociates = useMemo(() => {
    const base = allAssociates
      .filter((associate) => {
        if (!query) return true;
        const haystack = [
          associate.name,
          associate.currentRole,
          associate.department,
          associate.department,
          associate.bio,
          associate.location,
          associate.level,
          associate.status,
          ...associate.keySkills,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
      .filter((associate) => {
        const { department = [], role = [], skills = [], location = [], status = [], level = [] } = associateFilters;
        const associateDepartment = mapDepartment(associate.unit || associate.department);
        const associateLocation = locationLabel(associate.location);
        const rating = associate.sfiaRating || associate.level;
        const matchesDepartment = department.length === 0 || department.includes(associateDepartment);
        const matchesPosition = role.length === 0 || role.includes(associate.currentRole);
        const matchesSkills = skills.length === 0 || associate.keySkills.some((skill) => skills.includes(skill));
        const matchesLocation = location.length === 0 || location.includes(associateLocation);
        const matchesStatus = status.length === 0 || status.includes(associate.status);
        const matchesLevel = level.length === 0 || (rating ? level.includes(rating) : false);
        return (
          matchesDepartment &&
          matchesPosition &&
          matchesSkills &&
          matchesLocation &&
          matchesStatus &&
          matchesLevel
        );
      })
      .map((associate) => ({
        ...associate,
        departmentLabel: mapDepartment(associate.unit || associate.department),
        locationLabel: locationLabel(associate.location),
      }));

    if (sort === 'az') {
      return applySort(base, (a, b) => a.name.localeCompare(b.name));
    }
    // Note: 'recent' sort removed as updated_at is not in schema
    // Default to relevance (no sort) when 'recent' is selected
    return base;
  }, [query, associateFilters, sort, allAssociates]);
  const visibleAssociates = filteredAssociates.slice(0, visibleCounts.associates);

  const cards =
    activeTab === 'units' ? filteredUnits : activeTab === 'positions' ? filteredPositions : filteredAssociates;

  const sortOptions =
    activeTab === 'units'
      ? [
          { value: 'relevance', label: 'Relevance' },
          { value: 'az', label: 'A–Z' },
          { value: 'recent', label: 'Recently updated' },
        ]
      : [
          { value: 'relevance', label: 'Relevance' },
          { value: 'az', label: 'A–Z' },
          { value: 'recent', label: 'Recently updated' },
        ];

  const CardShell: React.FC<{
    children: React.ReactNode;
    variant: 'associate' | 'position' | 'unit';
    badge: string;
    meta: string;
    avatarText: string;
    imageUrl?: string;
    imageAlt?: string;
    IconComponent?: React.ComponentType<{ className?: string }>;
    avatarUrl?: string | null;
  }> = ({
    children,
    variant,
    badge,
    meta,
    avatarText,
    imageUrl,
    imageAlt,
    IconComponent,
    avatarUrl,
  }) => (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col h-full">
      {variant === 'unit' && (
        <div className="mb-3 overflow-hidden rounded-2xl bg-slate-100 h-32">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt || avatarText}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                // if the image fails, hide it but keep a neutral background
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex ${variant === 'associate' ? 'h-12 w-12' : 'h-10 w-10'} items-center justify-center rounded-full overflow-hidden relative ${variant === 'associate' ? 'bg-gradient-to-br from-dqBlue to-dqOrange text-white font-bold' : 'bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] text-xs font-semibold text-white'}`}>
          {/* Always render initials as fallback */}
          {variant !== 'unit' || !IconComponent ? (
            <span className={variant === 'associate' && avatarUrl ? 'opacity-0' : ''}>
              {avatarText?.slice(0, 3).toUpperCase()}
            </span>
          ) : null}
          {/* Overlay image for associates if available */}
          {variant === 'associate' && avatarUrl && (
            <img
              src={avatarUrl}
              alt={avatarText}
              className="h-12 w-12 rounded-full object-cover absolute inset-0"
              loading="lazy"
              onError={(e) => {
                // Hide image on error to reveal initials fallback
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                // Show initials by removing opacity
                const initialsSpan = (e.currentTarget as HTMLElement).parentElement?.querySelector('span');
                if (initialsSpan) {
                  initialsSpan.classList.remove('opacity-0');
                }
              }}
            />
          )}
          {/* Show icon for units */}
          {variant === 'unit' && IconComponent && (
            <IconComponent className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              {badge}
            </span>
            <span className="text-xs text-gray-500 line-clamp-1">{meta}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  // Type aliases for mapped data from hooks (camelCase for UI)
  type MappedWorkUnit = {
    id: string;
    sector: string;
    unitName: string;
    unitType: string;
    mandate: string;
    location: string;
    focusTags: string[];
    bannerImageUrl: string | null;
    department: string;
  };
  type MappedWorkPosition = {
    id: string;
    title: string;
    category: string;
    level: string;
    unitSlug: string;
    unitName: string;
    summary: string;
    responsibilities: string[];
    reportsTo: string;
    status: string;
  };
  type MappedAssociate = {
    id: string;
    name: string;
    currentRole: string;
    department: string;
    unit: string;
    location: string;
    sfiaRating: string;
    status: string;
    level?: string; // Optional fallback for sfiaRating
    email: string;
    phone?: string | null;
    teamsLink: string;
    keySkills: string[];
    bio: string;
    avatarUrl: string | null;
  };

  const UnitCard: React.FC<{ unit: MappedWorkUnit }> = ({ unit }) => {
    const meta = `${unit.sector} · ${unit.unitType}`;
    const tags = [...(unit.focusTags || []), unit.location];
    const IconComponent = getUnitIconForName(unit.unitName);
    return (
      <CardShell
        variant="unit"
        badge="Unit"
        meta={meta}
        avatarText={unit.unitType === 'Sector' ? 'SEC' : unit.unitName.split(' ')[0].slice(0, 2).toUpperCase()}
        imageUrl={unit.bannerImageUrl || undefined}
        imageAlt={unit.unitName}
        IconComponent={IconComponent}
      >
        <h3 className="text-lg font-semibold text-gray-900">{unit.unitName}</h3>
        <p className="text-sm text-gray-700 mt-1 line-clamp-3">{unit.mandate}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 flex justify-end">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-[#030F35] hover:bg-[#021028] rounded-md transition-colors">
            View Unit Profile
          </button>
        </div>
      </CardShell>
    );
  };

  const PositionCard: React.FC<{ position: MappedWorkPosition }> = ({ position }) => {
    const meta = `${position.unitName} · ${position.status || 'Status pending'}`;
    const responsibilities = position.responsibilities.slice(0, 3);
    return (
      <CardShell variant="position" badge="Position" meta={meta} avatarText={position.title.slice(0, 2).toUpperCase()}>
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{position.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {position.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              {position.category}
            </span>
          )}
          {position.level && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              {position.level}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{position.summary}</p>
        {responsibilities.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key responsibilities</p>
            <ul className="mt-1 space-y-1 text-sm text-gray-600">
              {responsibilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-indigo-500 flex-shrink-0" />
                  <span className="line-clamp-2">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto pt-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Reports to:</span> {position.reportsTo || '—'}
        </div>
      </CardShell>
    );
  };

  const AssociateCard: React.FC<{ associate: MappedAssociate }> = ({ associate }) => {
    const initials = associate.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const meta = `${associate.currentRole} • ${associate.department} | ${associate.unit}`;
    const rating = associate.sfiaRating || associate.level;
    return (
      <CardShell 
        variant="associate" 
        badge="Associate" 
        meta={meta} 
        avatarText={initials}
        avatarUrl={associate.avatarUrl}
      >
        <h3 className="text-lg font-semibold text-gray-900">{associate.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 line-clamp-1">
          <MapPin size={14} />
          <span>{associate.locationLabel || associate.location}</span>
          <span>•</span>
          <span>{rating || 'N/A'}</span>
          <span>•</span>
          <span>{associate.status}</span>
        </div>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{associate.bio}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {associate.keySkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-semibold text-gray-800">Email:</span>{' '}
            <a href={`mailto:${associate.email}`} className="text-indigo-700 hover:underline">
              {associate.email}
            </a>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Phone:</span>{' '}
            <span>{associate.phone || '—'}</span>
          </div>
        </div>
      </CardShell>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-10 flex-grow">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Services &amp; Marketplaces</span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-700 md:ml-2">DQ Work Directory</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DQ Work Directory</h1>
            <p className="text-gray-600 mt-2 max-w-3xl">
              Explore DQ sectors, work units, positions, and associate profiles to understand who does what and how to
              contact them.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <WorkDirectoryOverview activeTab={activeTab} />
        </div>

        <div id="directory-tabs" className="mb-6">
          <SimpleTabs
            tabs={tabs as SimpleTab[]}
            activeTabId={activeTab}
            onTabChange={(id) => {
              setActiveTab(id as TabKey);
              setShowFilters(false);
              setSort('relevance');
              resetVisibleForTab(id as TabKey);
            }}
          />
        </div>

        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={searchPlaceholder}
            ariaLabel="Search directory"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="xl:hidden">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700"
              aria-expanded={showFilters}
            >
              <FilterIcon size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div
            className={`xl:w-1/4 ${showFilters ? 'block' : 'hidden'} xl:block`}
          >
            <div className="bg-white rounded-lg shadow p-4 sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button onClick={resetFilters} className="text-sm text-blue-600 font-medium">
                  Reset
                </button>
              </div>
              <FilterSidebar
                filters={currentFilters}
                filterConfig={currentFilterConfig}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                isResponsive={false}
                defaultOpen={false}
              />
            </div>
          </div>

          <div className="xl:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Directory Items ({cards.length})</h2>
              <span className="text-sm text-gray-500">
                Showing {cards.length} {cards.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {/* Loading states */}
            {(activeTab === 'units' && unitsLoading) ||
            (activeTab === 'positions' && positionsLoading) ||
            (activeTab === 'associates' && associatesLoading) ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading directory...</div>
            ) : (activeTab === 'units' && unitsError) ||
              (activeTab === 'positions' && positionsError) ||
              (activeTab === 'associates' && associatesError) ? (
              <div className="py-12 text-center text-sm text-red-500">
                Could not load directory items.{' '}
                {activeTab === 'units' && unitsError
                  ? unitsError
                  : activeTab === 'positions' && positionsError
                  ? positionsError
                  : associatesError}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeTab === 'units' &&
                  visibleUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)}
                {activeTab === 'positions' &&
                  visiblePositions.map((position) => <PositionCard key={position.id} position={position} />)}
                {activeTab === 'associates' &&
                  visibleAssociates.map((associate) => (
                    <AssociateCard key={associate.id} associate={associate} />
                  ))}
              </div>
            )}

            {activeTab === 'units' && filteredUnits.length > PAGE_SIZE && visibleCounts.units < filteredUnits.length && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCounts((prev) => ({
                      ...prev,
                      units: Math.min(prev.units + PAGE_SIZE, filteredUnits.length),
                    }))
                  }
                  className="rounded-full bg-[#030F35] px-4 py-2 text-sm font-medium text-white hover:bg-[#051040] transition"
                >
                  Load more ({filteredUnits.length - visibleCounts.units} remaining)
                </button>
              </div>
            )}
            {activeTab === 'positions' &&
              filteredPositions.length > PAGE_SIZE &&
              visibleCounts.positions < filteredPositions.length && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCounts((prev) => ({
                      ...prev,
                      positions: Math.min(prev.positions + PAGE_SIZE, filteredPositions.length),
                    }))
                  }
                  className="rounded-full bg-[#030F35] px-4 py-2 text-sm font-medium text-white hover:bg-[#051040] transition"
                >
                  Load more ({filteredPositions.length - visibleCounts.positions} remaining)
                </button>
              </div>
            )}
            {activeTab === 'associates' &&
              filteredAssociates.length > PAGE_SIZE &&
              visibleCounts.associates < filteredAssociates.length && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCounts((prev) => ({
                      ...prev,
                      associates: Math.min(prev.associates + PAGE_SIZE, filteredAssociates.length),
                    }))
                  }
                  className="rounded-full bg-[#030F35] px-4 py-2 text-sm font-medium text-white hover:bg-[#051040] transition"
                >
                  Load more ({filteredAssociates.length - visibleCounts.associates} remaining)
                </button>
              </div>
            )}

            {!(
              (activeTab === 'units' && unitsLoading) ||
              (activeTab === 'positions' && positionsLoading) ||
              (activeTab === 'associates' && associatesLoading) ||
              (activeTab === 'units' && unitsError) ||
              (activeTab === 'positions' && positionsError) ||
              (activeTab === 'associates' && associatesError)
            ) &&
              cards.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No directory entries found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search.</p>
                </div>
              )}
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default DQWorkDirectoryPage;
