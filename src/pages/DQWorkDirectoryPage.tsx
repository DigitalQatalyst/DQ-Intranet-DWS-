import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, ChevronRightIcon, FilterIcon, HomeIcon, MapPin } from 'lucide-react';

import { AssociateCard } from '@/components/associates/AssociateCard';
import { AssociateProfileModal } from '@/components/work-directory/AssociateProfileModal';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import { SimpleTab, SimpleTabs } from '@/components/SimpleTabs';
import { WorkDirectoryOverview } from '@/components/work-directory/WorkDirectoryOverview';
import { getPerformanceStyle } from '@/components/work-directory/unitStyles';
import { getUnitIcon } from '@/components/Directory/unitIcons';
import { useAssociates, useWorkPositions, useWorkUnits } from '@/hooks/useWorkDirectory';
import { supabase } from '@/lib/supabaseClient';

import type { Associate } from '@/components/associates/AssociateCard';
import type { FilterConfig, FilterGroup } from '@/components/marketplace/FilterSidebar';
import type { EmployeeProfile } from '@/data/workDirectoryTypes';

type TabKey = 'units' | 'positions' | 'associates';

interface MappedWorkUnit {
  id: string;
  slug: string;
  sector: string;
  unitName: string;
  unitType: string;
  mandate?: string | null;
  location: string;
  focusTags: string[];
  priorityLevel?: string | null;
  priorityScope?: string | null;
  performanceStatus?: string | null;
  performanceScore?: number | null;
  wiAreas?: string[] | null;
  bannerImageUrl: string | null;
  department: string;
}

interface MappedWorkPosition {
  id: string;
  slug: string;
  positionName: string;
  roleFamily?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  location?: string | null;
  sfiaLevel?: string | null;
  sfiaRating?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities?: string[] | null;
  expectations: string | null;
  status?: string | null;
  imageUrl?: string | null;
  bannerImageUrl?: string | null;
  department?: string | null;
}

interface MappedAssociate {
  id: string;
  name: string;
  currentRole: string;
  department: string;
  unit: string;
  location: string;
  sfiaRating: string;
  status: string;
  level?: string | null;
  email: string;
  phone?: string | null;
  teams_link?: string | null;
  keySkills: string[];
  bio: string;
  summary?: string | null;
  avatarUrl: string | null;
  hobbies?: string[];
  technicalSkills?: string[];
  functionalSkills?: string[];
  softSkills?: string[];
  keyCompetencies?: string[];
  languages?: string[];
}

interface UnitCardProps {
  unit: MappedWorkUnit;
}

interface PositionCardProps {
  position: MappedWorkPosition;
}

const PAGE_SIZE = 24;

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: 'units', label: 'Units' },
  { id: 'positions', label: 'Positions' },
  { id: 'associates', label: 'Associates' },
];

const LOCATION_OPTIONS = ['Dubai', 'Nairobi', 'Riyadh', 'Remote'];

const globalFilterConfig: FilterConfig[] = [
  { id: 'department', title: 'Department', options: ['HRA (People)', 'Finance', 'Deals', 'Stories', 'Intelligence', 'Solutions', 'SecDevOps', 'Products', 'Delivery — Deploys', 'Delivery — Designs', 'DCO Operations', 'DBP Platform', 'DBP Delivery', 'CoE Office'].map((d) => ({ id: d, name: d })) },
  { id: 'location', title: 'Location', options: LOCATION_OPTIONS.map((l) => ({ id: l, name: l })) },
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
  if (normalized === 'HOME' || normalized === 'REMOTE') return 'Remote';
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

const getUnitDepartmentLabel = (unit: { department?: string | null; unitName?: string; sector?: string }) => {
  const raw = unit.department || unit.unitName || unit.sector || '';
  if (raw.toLowerCase().includes('coe | lead')) {
    return 'CoE | Lead';
  }
  return mapDepartment(raw);
};

const DEPARTMENT_GROUPS_SPEC: Array<{ title: string; values: string[] }> = [
  {
    title: 'Sectors',
    values: ['DCO Operations', 'DBP Platform', 'DBP Delivery', 'CoE Office', 'CEO Office'],
  },
  {
    title: 'Factories',
    values: [
      'HRA (People)',
      'Finance',
      'Deals',
      'Stories',
      'Intelligence',
      'Products',
      'Solutions',
      'SecDevOps',
    ],
  },
  {
    title: 'Units',
    values: ['DQ Delivery — Deploys', 'DQ Delivery — Designs', 'CoE | Lead'],
  },
];


const buildGroupedOptions = (spec: Array<{ title: string; values: string[] }>, available: Set<string>): FilterGroup[] =>
  spec
    .map((group) => ({
      title: group.title,
      options: group.values
        .filter((value) => available.has(value))
        .map((value) => ({ id: value, name: value })),
    }))
    .filter((group) => group.options.length > 0);

const flattenGroups = (groups: FilterGroup[]) => groups.flatMap((group) => group.options);

export function DQWorkDirectoryPage() {
  console.log('DQWorkDirectoryPage mounted');
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get active tab from URL, default to 'units'
  const tabParam = searchParams.get('tab') as TabKey | null;
  const isValidTab = tabParam && ['units', 'positions', 'associates'].includes(tabParam);
  const initialTab: TabKey = isValidTab ? tabParam : 'units';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  
  // Update active tab when URL changes (e.g., from browser back/forward or direct link)
  useEffect(() => {
    if (tabParam && isValidTab && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!tabParam && activeTab !== 'units') {
      // If no tab param and not default, set default
      setSearchParams({ tab: 'units' }, { replace: true });
    }
  }, [tabParam, isValidTab, activeTab, setSearchParams]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [visibleCounts, setVisibleCounts] = useState<Record<TabKey, number>>({
    units: PAGE_SIZE,
    positions: PAGE_SIZE,
    associates: PAGE_SIZE,
  });
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch data from Supabase
  const { units: allUnits, loading: unitsLoading, error: unitsError } = useWorkUnits();
  const { positions: allPositions, loading: positionsLoading, error: positionsError } = useWorkPositions();
  const { associates: allAssociates, loading: associatesLoading, error: associatesError } = useAssociates();

  const unitFilterConfig = useMemo<FilterConfig[]>(() => {
    const availableDepartments = new Set(
      allUnits
        .map((u) => getUnitDepartmentLabel(u))
        .filter(Boolean) as string[]
    );
    const departmentGroups = buildGroupedOptions(DEPARTMENT_GROUPS_SPEC, availableDepartments);

    return [
      { id: 'department', title: 'Department', options: flattenGroups(departmentGroups), groups: departmentGroups },
      ...globalFilterConfig.filter((f) => f.id === 'location'),
    ];
  }, [allUnits]);

  const positionFilterConfig = useMemo<FilterConfig[]>(() => {
    const getUniqueValues = (values: Array<string | null | undefined>) => {
      const set = new Set<string>();
      values.forEach((val) => {
        if (typeof val === 'string' && val.trim().length > 0) {
          set.add(val.trim());
        }
      });
      return Array.from(set);
    };

    const unitOptions = getUniqueValues(allPositions.map((p) => p.unit)).sort().map((v) => ({ id: v, name: v }));
    const roleFamilyOptions = getUniqueValues(allPositions.map((p) => p.roleFamily)).sort().map((v) => ({ id: v, name: v }));

    // Debug: Log role families found
    if (import.meta.env.DEV) {
      console.log('[Position Filter] Role Families found:', roleFamilyOptions);
      console.log('[Position Filter] Sample positions:', allPositions.slice(0, 5).map(p => ({ name: p.positionName, roleFamily: p.roleFamily })));
    }

    const config: FilterConfig[] = [
      ...globalFilterConfig.filter((f) => f.id === 'location'),
      unitOptions.length ? { id: 'unit', title: 'Unit', options: unitOptions } : null,
      roleFamilyOptions.length ? { id: 'roleFamily', title: 'Role Family', options: roleFamilyOptions } : null,
      {
        id: 'level',
        title: 'Rating – SFIA',
        options: SFIA_LEVEL_OPTIONS,
      },
    ].filter(Boolean) as FilterConfig[];

    return config;
  }, [allPositions]);

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


  const query = searchQuery.toLowerCase();

  // Reset pagination on search or filter changes for the active tab
  useEffect(() => {
    resetVisibleForTab(activeTab);
  }, [searchQuery, unitFilters, positionFilters, associateFilters, activeTab]);

  useEffect(() => {
    setPositionFilters(createInitialFilters(positionFilterConfig));
  }, [positionFilterConfig]);

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
          department = [],
          location = [],
        } = unitFilters;
        const departmentLabel = getUnitDepartmentLabel(unit);
        const unitLocation = locationLabel(unit.location);
        const matchesDepartment = department.length === 0 || department.includes(departmentLabel);
        const matchesLocation = location.length === 0 || location.includes(unitLocation);
        return matchesDepartment && matchesLocation;
      })
      .map((unit) => ({
        ...unit,
        departmentLabel: getUnitDepartmentLabel(unit),
        locationLabel: locationLabel(unit.location),
        department: unit.department ?? getUnitDepartmentLabel(unit),
        bannerImageUrl: unit.bannerImageUrl ?? null,
        focusTags: unit.focusTags ?? [],
      }));

    if (sort === 'az') {
      return applySort(base, (a, b) => a.unitName.localeCompare(b.unitName));
    }
    // Note: 'recent' sort removed as updated_at is not in schema
    // Default to relevance (no sort) when 'recent' is selected
    return base;
  }, [query, unitFilters, sort, allUnits]);
  const visibleUnits = filteredUnits.slice(0, visibleCounts.units);

  const filteredPositions = useMemo(() => {
    const base = allPositions
      .filter((position) => {
        if (!query || !position) return true;
        const haystack = [
          position?.positionName,
          position?.roleFamily,
          position?.unit,
          position?.summary,
          position?.description,
          position?.status,
          position?.location,
          position?.sfiaLevel,
          position?.sfiaRating,
          ...(Array.isArray(position?.responsibilities) ? position.responsibilities : []),
          ...(position?.expectations ? [position.expectations] : []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .filter((position) => {
        const { unit = [], level = [], location = [], roleFamily = [] } = positionFilters;
        const matchesUnit = unit.length === 0 || (position.unit ? unit.includes(position.unit.trim()) : false);
        const positionLocation = position.location ? locationLabel(position.location) : null;
        const matchesLocation = location.length === 0 || (positionLocation ? location.includes(positionLocation) : false);
        // SFIA level filtering: check if position's level matches any selected level
        // For positions with ranges (stored as primary level), we check exact match
        // The filter will show positions that match the selected level(s)
        const matchesSfia = level.length === 0 || (position.sfiaLevel ? level.includes(position.sfiaLevel) : false);
        // Role Family filtering: normalize both filter values and position values for comparison
        const matchesRoleFamily = roleFamily.length === 0 || (() => {
          if (!position.roleFamily) return false;
          const positionRoleFamily = position.roleFamily.trim();
          return roleFamily.some(filterValue => filterValue.trim() === positionRoleFamily);
        })();
        
        // Debug logging for role family filter
        if (import.meta.env.DEV && roleFamily.length > 0 && position.roleFamily) {
          const matched = matchesRoleFamily;
          if (!matched) {
            console.log('[Position Filter] Role Family mismatch:', {
              positionName: position.positionName,
              positionRoleFamily: position.roleFamily,
              filterRoleFamilies: roleFamily,
              matched
            });
          }
        }
        
        return matchesUnit && matchesLocation && matchesSfia && matchesRoleFamily;
      })
      .map((position) => ({
        ...position,
        expectations: position.expectations ?? null,
        responsibilities: position.responsibilities ?? [],
      }));

    if (sort === 'az') {
      return applySort(base, (a, b) => {
        const nameA = a?.positionName || '';
        const nameB = b?.positionName || '';
        return nameA.localeCompare(nameB);
      });
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
          associate.sfiaRating,
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
        const rating = associate.sfiaRating || null;
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
        avatarUrl: associate.avatarUrl ?? null,
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

  // Helper to map MappedAssociate to Associate type for new card component
  const mapToAssociate = (mapped: MappedAssociate): Associate => ({
    id: mapped.id,
    name: mapped.name,
    current_role: mapped.currentRole,
    department: mapped.department,
    unit: mapped.unit,
    location: mapped.location,
    sfia_rating: mapped.sfiaRating,
    status: mapped.status,
    email: mapped.email,
    phone: mapped.phone ?? null,
    teams_link: mapped.teams_link ?? '',
    avatar_url: mapped.avatarUrl ?? null,
    key_skills: mapped.keySkills,
    summary: mapped.summary ?? null,
    bio: mapped.bio,
    hobbies: mapped.hobbies,
    technicalSkills: mapped.technicalSkills,
    functionalSkills: mapped.functionalSkills,
    softSkills: mapped.softSkills,
    keyCompetencies: mapped.keyCompetencies,
    languages: mapped.languages,
  });

  const fetchAssociateProfile = async (associate: Associate) => {
    setProfileLoading(true);
    setProfile(null);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }
      
      let fetched: EmployeeProfile | null = null;
      if (associate.email) {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('*')
          .ilike('email', associate.email)
          .single();
        if (!error && data) {
          fetched = data as EmployeeProfile;
        }
      }
      if (!fetched) {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('*')
          .ilike('full_name', associate.name)
          .single();
        if (!error && data) {
          fetched = data as EmployeeProfile;
        }
      }
      setProfile(fetched);
    } catch (err) {
      console.error('Error loading associate profile', err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleViewProfile = async (associate: Associate) => {
    setSelectedAssociate(associate);
    setShowModal(true);
    await fetchAssociateProfile(associate);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssociate(null);
    setProfile(null);
    setProfileLoading(false);
  };

  function UnitCard({ unit }: UnitCardProps) {
    const performanceStyle = getPerformanceStyle(unit.performanceStatus);
    const Icon = getUnitIcon({ sector: unit.sector, unitName: unit.unitName });
    const formatStatusLabel = (value?: string | null) => {
      if (!value) return "Unknown";
      const normalized = value.toLowerCase();
      if (normalized === "leading") return "Leading";
      if (normalized === "on track" || normalized === "on_track") return "On track";
      if (normalized === "at risk" || normalized === "at_risk") return "At risk";
      return value;
    };

    return (
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Icon + chips */}
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5">
              {unit.unitType}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 max-w-[60%] truncate">
              {unit.sector}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{unit.unitName}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span>{locationLabel(unit.location)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="mt-2 flex-1 text-sm text-slate-600">
          <p className="line-clamp-3">{unit.mandate || "Not yet added."}</p>
        </div>

        {/* Footer */}
        <div className="mt-3 border-t border-slate-100 pt-3 space-y-2">
          {unit.performanceStatus && (
            <div className="flex items-center justify-between text-xs">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${performanceStyle.pillClass}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="font-medium">{formatStatusLabel(unit.performanceStatus)}</span>
                {unit.performanceScore != null && (
                  <span className="text-slate-400">{unit.performanceScore} / 100</span>
                )}
              </span>
            </div>
          )}

          {unit.focusTags && unit.focusTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {unit.focusTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <Link
              to={`/work-directory/units/${unit.slug}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#051040] transition-colors"
            >
              View Unit Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function PositionCard({ position }: PositionCardProps) {
    // Null-safe access with fallbacks
    if (!position) {
      if (import.meta.env.DEV) {
        console.warn("[PositionCard] Received null/undefined position");
      }
      return null;
    }

    const positionName = position?.positionName || 'TBC';
    const slug = position?.slug || '';
    const roleFamily = position?.roleFamily || null;
    const rawLocation = position?.location || null;
    const sfiaLevel = position?.sfiaLevel || position?.sfiaRating || null;
    
    // Helper to determine if location should be displayed
    const shouldShowLocation = (loc: string | null): boolean => {
      if (!loc || loc.trim() === '') return false;
      const normalized = loc.trim();
      return normalized.length > 0;
    };
    
    const displayLocation = shouldShowLocation(rawLocation) ? locationLabel(rawLocation || '') : null;


    // Debug logging in dev
    if (import.meta.env.DEV && !slug) {
      console.warn("[PositionCard] Position missing slug:", positionName, position);
    }

    // Get responsibilities or summary for display
    const getResponsibilitiesDisplay = () => {
      if (position.responsibilities && position.responsibilities.length > 0) {
        return position.responsibilities.slice(0, 3); // Show first 3
      }
      // If no responsibilities, try to create bullets from summary
      if (position.summary) {
        // Split summary into sentences and take first 3
        const sentences = position.summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.slice(0, 3).map(s => s.trim());
      }
      return null;
    };

    const responsibilitiesDisplay = getResponsibilitiesDisplay();

    return (
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Position Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {positionName}
        </h3>

        {/* Responsibilities List */}
        {responsibilitiesDisplay && responsibilitiesDisplay.length > 0 ? (
          <ul className="mb-4 space-y-2 flex-1">
            {responsibilitiesDisplay.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                <span className="line-clamp-2">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mb-4 flex-1 text-sm text-slate-500 italic">
            Details available in profile
          </div>
        )}

        {/* Role Family Tag */}
        {roleFamily && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 mb-4">
            {roleFamily}
          </span>
        )}

        {/* View Profile Button */}
        <div className="mt-auto">
          {slug ? (
            <Link
              to={`/roles/${slug}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#051040] transition-all duration-200"
            >
              View role profile
            </Link>
          ) : (
            <div className="inline-flex w-full items-center justify-center rounded-full bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed">
              Profile unavailable
            </div>
          )}
        </div>
      </div>
    );
  }


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

        <div className="mt-6">
          <WorkDirectoryOverview activeTab={activeTab} />
        </div>

        <div className="mt-10" />

        <div id="directory-tabs" className="mb-6">
          <SimpleTabs
            tabs={tabs as SimpleTab[]}
            activeTabId={activeTab}
            onTabChange={(id) => {
              const newTab = id as TabKey;
              setActiveTab(newTab);
              setSearchParams({ tab: newTab }, { replace: true });
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
              <div className="py-12 text-center px-4">
                <div className="text-sm text-red-600 font-medium mb-2">
                  Could not load directory items
                </div>
                <div className="text-xs text-red-500 mb-4 max-w-2xl mx-auto">
                  {activeTab === 'units' && unitsError
                    ? unitsError
                    : activeTab === 'positions' && positionsError
                    ? positionsError
                    : associatesError}
                </div>
                {(unitsError?.includes('does not exist') || 
                   positionsError?.includes('does not exist') || 
                   associatesError?.includes('does not exist') ||
                   unitsError?.includes('table does not exist') ||
                   positionsError?.includes('table does not exist') ||
                   associatesError?.includes('table does not exist')) && (
                  <div className="text-xs text-gray-700 mt-4 p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl mx-auto text-left">
                    <p className="font-semibold mb-3 text-blue-900">💡 How to Fix This:</p>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                      <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a> → Select your project</li>
                      <li>Navigate to <strong>SQL Editor</strong> → Click <strong>New Query</strong></li>
                      <li>Open the file <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">supabase/work-directory-schema.sql</code> from this project</li>
                      <li>Copy the entire contents and paste into the SQL Editor</li>
                      <li>Click <strong>Run</strong> to execute the migration</li>
                      <li>Refresh this page</li>
                    </ol>
                    <p className="text-xs text-gray-600 italic">
                      This will create the required tables: work_units, work_positions, work_associates, and employee_profiles
                    </p>
                  </div>
                )}
                {(unitsError?.includes('Permission denied') || 
                   positionsError?.includes('Permission denied') || 
                   associatesError?.includes('Permission denied') ||
                   unitsError?.includes('row-level security') ||
                   positionsError?.includes('row-level security') ||
                   associatesError?.includes('row-level security')) && (
                  <div className="text-xs text-gray-700 mt-4 p-6 bg-yellow-50 rounded-lg border border-yellow-200 max-w-3xl mx-auto text-left">
                    <p className="font-semibold mb-3 text-yellow-900">🔒 Permission Issue Detected:</p>
                    <p className="mb-3">Your tables exist but Row Level Security (RLS) is blocking access.</p>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                      <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline font-medium">Supabase Dashboard</a> → Select your project</li>
                      <li>Navigate to <strong>SQL Editor</strong> → Click <strong>New Query</strong></li>
                      <li>Open the file <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">supabase/fix-work-directory-rls.sql</code> from this project</li>
                      <li>Copy the entire contents and paste into the SQL Editor</li>
                      <li>Click <strong>Run</strong> to fix RLS policies</li>
                      <li>Refresh this page</li>
                    </ol>
                    <p className="text-xs text-gray-600 italic">
                      This will enable public read access to your work directory tables
                    </p>
                  </div>
                )}
                {(unitsError?.includes('not initialized') || 
                   positionsError?.includes('not initialized') || 
                   associatesError?.includes('not initialized')) && (
                  <div className="text-xs text-gray-700 mt-4 p-6 bg-yellow-50 rounded-lg border border-yellow-200 max-w-3xl mx-auto text-left">
                    <p className="font-semibold mb-3 text-yellow-900">⚠️ Supabase Not Configured:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Add your Supabase credentials to the <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">.env</code> file</li>
                      <li>Set <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">VITE_SUPABASE_URL</code> and <code className="bg-yellow-100 px-2 py-1 rounded text-xs font-mono">VITE_SUPABASE_ANON_KEY</code></li>
                      <li>Restart your development server</li>
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeTab === 'units' &&
                  visibleUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)}
                {activeTab === 'positions' &&
                  visiblePositions.map((position) => <PositionCard key={position.id} position={position} />)}
                {activeTab === 'associates' &&
                  visibleAssociates.map((associate) => (
                    <AssociateCard
                      key={associate.id}
                      associate={mapToAssociate(associate)}
                      onViewProfile={handleViewProfile}
                    />
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
      <AssociateProfileModal
        open={showModal}
        onClose={handleCloseModal}
        profile={profile}
        loading={profileLoading}
        fallbackName={selectedAssociate?.name}
        fallbackRole={selectedAssociate?.current_role}
        fallbackLocation={selectedAssociate?.location}
        fallbackEmail={selectedAssociate?.email}
        fallbackPhone={selectedAssociate?.phone ?? null}
        fallbackProfileImageUrl={selectedAssociate?.avatar_url ?? null}
        fallbackSummary={selectedAssociate?.summary ?? null}
        fallbackBio={selectedAssociate?.bio ?? null}
        fallbackKeySkills={selectedAssociate?.key_skills ?? []}
        fallbackSfiaRating={selectedAssociate?.sfia_rating ?? null}
        fallbackStatus={selectedAssociate?.status ?? null}
        fallbackUnit={selectedAssociate?.unit ?? null}
        fallbackDepartment={selectedAssociate?.department ?? null}
        fallbackHobbies={selectedAssociate?.hobbies ?? []}
        fallbackTechnicalSkills={selectedAssociate?.technicalSkills ?? []}
        fallbackFunctionalSkills={selectedAssociate?.functionalSkills ?? []}
        fallbackSoftSkills={selectedAssociate?.softSkills ?? []}
        fallbackKeyCompetencies={selectedAssociate?.keyCompetencies ?? []}
        fallbackLanguages={selectedAssociate?.languages ?? []}
      />
    </div>
  );
}

