import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Search, Filter } from 'lucide-react';
import { AssociateCard } from '@/components/associates/AssociateCard';
import { AssociateProfileModal } from '@/components/work-directory/AssociateProfileModal';
import { getPerformanceStyle } from '@/components/work-directory/unitStyles';
import { getUnitIcon } from '@/components/Directory/unitIcons';
import { useAssociates, useWorkUnits } from '@/hooks/useWorkDirectory';
import { supabase } from '@/lib/supabaseClient';
import type { ViewMode } from '../../types/directory';
import type { Associate } from '@/components/associates/AssociateCard';
import type { EmployeeProfile } from '@/data/workDirectoryTypes';

interface Discover_DirectorySectionProps {
  title?: string;
  subtitle?: string;
}

const locationLabel = (raw: string) => {
  const normalized = raw?.toUpperCase() || '';
  if (normalized === 'DXB' || raw === 'Dubai') return 'Dubai';
  if (normalized === 'NBO' || raw === 'Nairobi') return 'Nairobi';
  if (normalized === 'KSA' || raw === 'Riyadh') return 'Riyadh';
  if (normalized === 'HOME' || normalized === 'REMOTE') return 'Remote';
  return raw || 'Remote';
};

interface MappedWorkUnit {
  id: string;
  slug: string;
  sector: string;
  unitName: string;
  unitType: string;
  mandate?: string | null;
  location: string;
  focusTags: string[];
  performanceStatus?: string | null;
  performanceScore?: number | null;
}

interface MappedAssociate {
  id: string;
  name: string;
  currentRole: string;
  department: string;
  unit: string;
  location: string;
  email?: string | null;
  avatarUrl?: string | null;
  keySkills?: string[] | null;
}

const Discover_DirectorySection: React.FC<Discover_DirectorySectionProps> = ({
  subtitle = 'Connect with DQ sectors, teams, and associates driving collaboration, delivery, and innovation across the Digital Workspace.',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'units'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedAssociate, setSelectedAssociate] = useState<Associate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch data from DQ Work Directory
  const { units: allUnits, loading: unitsLoading } = useWorkUnits();
  const { associates: allAssociates, loading: associatesLoading } = useAssociates();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Map units to display format
  const mappedUnits = useMemo<MappedWorkUnit[]>(() => {
    return allUnits.map((unit) => ({
      id: unit.id,
      slug: unit.slug,
      sector: unit.sector,
      unitName: unit.unitName,
      unitType: unit.unitType,
      mandate: unit.mandate,
      location: unit.location,
      focusTags: unit.focusTags || [],
      performanceStatus: unit.performanceStatus,
      performanceScore: unit.performanceScore,
    }));
  }, [allUnits]);

  // Map associates to display format
  const mappedAssociates = useMemo<MappedAssociate[]>(() => {
    return allAssociates.map((associate) => ({
      id: associate.id,
      name: associate.name,
      currentRole: associate.currentRole || '',
      department: associate.department || '',
      unit: associate.unit || '',
      location: associate.location || '',
      email: associate.email,
      avatarUrl: associate.avatarUrl,
      keySkills: associate.keySkills || [],
    }));
  }, [allAssociates]);

  // Filter units based on search and filters
  const filteredUnits = useMemo(() => {
    let filtered = [...mappedUnits];

    // Search filter
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((unit) =>
        [unit.unitName, unit.mandate, unit.sector, unit.unitType, ...(unit.focusTags || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((unit) => selectedSectors.includes(unit.sector));
    }

    return filtered;
  }, [mappedUnits, debouncedQuery, selectedSectors]);

  // Filter associates based on search and filters
  const filteredAssociates = useMemo(() => {
    let filtered = [...mappedAssociates];

    // Search filter
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((associate) =>
        [
          associate.name,
          associate.currentRole,
          associate.department,
          associate.unit,
          ...(associate.keySkills || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter (using department as proxy for sector)
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((associate) => {
        // Map department to sector for filtering
        const dept = associate.department?.toLowerCase() || '';
        return selectedSectors.some((sector) => {
          const sectorLower = sector.toLowerCase();
          if (sectorLower === 'platform' && dept.includes('platform')) return true;
          if (sectorLower === 'delivery' && dept.includes('delivery')) return true;
          if (sectorLower === 'operations' && dept.includes('operation')) return true;
          if (sectorLower === 'governance' && dept.includes('governance')) return true;
          return false;
        });
      });
    }

    return filtered;
  }, [mappedAssociates, debouncedQuery, selectedSectors]);

  // Show first 6 items
  const displayedUnits = useMemo(() => filteredUnits.slice(0, 6), [filteredUnits]);
  const displayedAssociates = useMemo(() => filteredAssociates.slice(0, 6), [filteredAssociates]);

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSectors.length > 0 || searchQuery.trim();
  const sectors = ['Governance', 'Operations', 'Platform', 'Delivery'];

  // Map associate to AssociateCard format
  const mapToAssociate = (mapped: MappedAssociate): Associate => ({
    id: mapped.id,
    name: mapped.name,
    current_role: mapped.currentRole,
    department: mapped.department,
    unit: mapped.unit,
    location: mapped.location,
    sfia_rating: null,
    status: null,
    email: mapped.email ?? null,
    phone: null,
    teams_link: '',
    avatar_url: mapped.avatarUrl ?? null,
    key_skills: mapped.keySkills || [],
    summary: null,
    bio: null,
    hobbies: [],
    technicalSkills: [],
    functionalSkills: [],
    softSkills: [],
    keyCompetencies: [],
    languages: [],
  });

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (viewMode !== 'units') params.set('view', viewMode);
    if (selectedSectors.length > 0) params.set('sectors', selectedSectors.join(','));
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, viewMode, selectedSectors, setSearchParams]);

  const handleViewFullDirectory = useCallback(() => {
    const tab = viewMode === 'associates' ? 'associates' : 'units';
    navigate(`/marketplace/work-directory?tab=${tab}`);
  }, [viewMode, navigate]);

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

  function UnitCard({ unit }: { unit: MappedWorkUnit }) {
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
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
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
              {unit.focusTags.slice(0, 3).map((tag) => (
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

  return (
    <section
      id="dq-directory"
      className="py-16 md:py-20 pb-20"
      style={{ backgroundColor: '#F9FAFB' }}
      aria-labelledby="directory-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1
            id="directory-heading"
            className="font-bold mb-3"
            style={{ 
              fontFamily: 'Palatino, serif',
              fontSize: '48px',
              fontWeight: 700,
              color: '#000000',
              textAlign: 'center',
              textDecoration: 'none'
            }}
          >
            {viewMode === 'units' ? 'DQ Directory' : 'DQ Directory'}
          </h1>
          <p
            className="text-sm md:text-base max-w-[720px] mx-auto leading-relaxed"
            style={{ color: '#334266', opacity: 0.85 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Controls Row */}
        <div
          className="sticky top-16 z-10 bg-white rounded-2xl border p-4 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 shadow-sm"
          style={{ borderColor: '#E3E7F8' }}
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#25406F', opacity: 0.6 }}
              />
              <input
                type="text"
                placeholder="Search people, teams, or keywords…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E3E7F8',
                  color: '#131E42',
                }}
              />
            </div>
          </div>

          {/* View Toggle */}
          <div
            className="inline-flex rounded-xl p-1"
            role="tablist"
            style={{ backgroundColor: '#F9FAFB', border: '1px solid #E3E7F8' }}
          >
            <button
              onClick={() => setViewMode('units')}
              role="tab"
              aria-selected={viewMode === 'units'}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: viewMode === 'units' ? '#fff' : 'transparent',
                color: viewMode === 'units' ? '#131E42' : '#334266',
                boxShadow: viewMode === 'units' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Units
            </button>
            <button
              onClick={() => setViewMode('associates')}
              role="tab"
              aria-selected={viewMode === 'associates'}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: viewMode === 'associates' ? '#fff' : 'transparent',
                color: viewMode === 'associates' ? '#131E42' : '#334266',
                boxShadow: viewMode === 'associates' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Associates
            </button>
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 h-11 rounded-xl font-semibold text-sm transition-colors"
            style={{
              backgroundColor: showFilters ? '#131E42' : '#F9FAFB',
              color: showFilters ? '#fff' : '#131E42',
              border: '1px solid #E3E7F8',
            }}
            aria-label="Toggle filters"
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#FB5535', color: '#fff' }}
              >
                {selectedSectors.length + (searchQuery.trim() ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-xl border space-y-3" style={{ borderColor: '#E3E7F8' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#131E42' }}>
                Sector
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#FB5535' }}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    backgroundColor: selectedSectors.includes(sector) ? '#131E42' : '#F9FAFB',
                    color: selectedSectors.includes(sector) ? '#fff' : '#334266',
                    border: `1px solid ${
                      selectedSectors.includes(sector) ? '#131E42' : '#E3E7F8'
                    }`,
                  }}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: '#334266', opacity: 0.85 }}>
            {viewMode === 'units' ? filteredUnits.length : filteredAssociates.length}{' '}
            {viewMode === 'units' ? 'units' : 'associates'} found
          </p>
        </div>

        {/* Cards Grid */}
        {viewMode === 'units' ? (
          <>
            {unitsLoading ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">Loading units...</p>
              </div>
            ) : displayedUnits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {displayedUnits.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">No units available</p>
              </div>
            )}
          </>
        ) : (
          <>
            {associatesLoading ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">Loading associates...</p>
              </div>
            ) : displayedAssociates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {displayedAssociates.map((associate) => (
                  <AssociateCard
                    key={associate.id}
                    associate={mapToAssociate(associate)}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">No associates available</p>
              </div>
            )}
          </>
        )}

        {/* View Full Directory Button */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleViewFullDirectory}
            className="inline-flex items-center rounded-2xl bg-[#030F35] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020b29]"
          >
            View Full Directory →
          </button>
        </div>
      </div>

      {/* Associate Profile Modal */}
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
    </section>
  );
};

export default Discover_DirectorySection;
