import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { DirectoryCard, DirectoryCardData } from '../Directory/DirectoryCard';
import { unitsData } from '../../data/directoryData';
import type { Unit, ViewMode, SectorType } from '../../types/directory';

interface DQDirectoryProps {
  title?: string;
  subtitle?: string;
}

/**
 * Map Unit to unified DirectoryCardData
 */
const mapUnitToCard = (unit: Unit, onViewProfile: () => void): DirectoryCardData => ({
  logoUrl: unit.logoUrl,
  title: unit.name,
  tag: unit.sector,
  description: unit.description || '',
  towers: unit.streams,
  onClick: onViewProfile,
});

type Associate = {
  name: string;
  title: string;
  role: string;
  unit: string;
  tag: string;
  email?: string;
  mobile?: string;
  location?: string;
  company?: string;
  website?: string;
  sector?: SectorType;
};

const RAW_ASSOCIATES_SHOWCASE = `
Anthony Mwangi	Product Owner	Sector Lead (DBP Platforms)	DBP Platforms	DBP Platform	anthony.mwangi@digitalqatalyst.com		NBO
Pelagie Njiki	Operation Analyst	Unit Lead (CoE)	CoE | Lead	CoE Lead	njiki.pelagie@digitalqatalyst.com	+971 55 623 1439	Dubai
Bilal Waqar	Enterprise Architect	Unit Lead (Designs)	DBP Delivery	DBP Delivery	bilal.waqar@digitalqatalyst.com	+971 544 757 550	Dubai
Rayyan Basha	Business Analyst	Delivery Lead (KSA Accounts)	DBP Delivery | Deploys	Account	rayyan.basha@digitalqatalyst.com	+971 559 295 369	Saudi Arabia
Mohamed Thameez	Solution Analyst	Delivery Scrum Master (Designs)	DBP Delivery | Designs	Designs	mohamed.thameez@digitalqatalyst.com	+971 585 046 171	Dubai
Habab Siddique	Scrum Master 	Product Owner (Deploys)	DBP Delivery | Deploys	Deploy	habab.siddig@digitalqatalyst.com	+971 561 314 934	Dubai
Mart-Pearly Iyondong	Operation Analyst	HR Analyst	DCO Operations | HRA	O2P	mart-pearly.iyondong@digitalqatalyst.com	+971 569 590 488	Dubai
Simon Kariuki	Data Enginner	Tower Lead (Intelligence)	DBP Platform | Intelligence	DBs | Pipe | API	simon.kariuki@digitalqatalyst.com	+254 790 504 948	Nairobi
Stephanie Njunge	Solution Engineer	Tower Lead (Solutions)	DBP Platform | Solutions	eCom | DXP	stephanie.njunge@digitalqatalyst.com	+254 700 702 332	NBO
Wilson Chege	Product Owner	Factory Lead (Products)	DBP Platform | Products	Products	wilson.chege@digitalqatalyst.com	+254 715 673 582	NBO
Freshia Njoki	Solution Engineer	Factory Lead (SecDevOps)	DBP Platform | SecDevOps	SecDevOps	freshia.njoki@digitalqatalyst.com	+254 745 756 365	NBO
Michael Kimeu	DevOps Engineer	Endpoint Developer	DBP Platform | SecDevOps	CICD | Test | Host	michael.kimeu@digitalqatalyst.com	+254 115 391 736	NBO
Joseph Mwangi	CRM Engineer	Tower Lead (Solutions)	DBP Platform | Solutions	eCom | DWS	joseph.mwangi@digitalqatalyst.com	+254 768 280 212	NBO
Mercy Wangari	Industrial Automative Engineer	Process Automation Developer	DBP Platform | Intelligence	DT2.0 | DTMP	mercy.wangari@digitalqatalyst.com	+254 705 123 305	NBO
Dominic Paul	DevOps Engineer	Factory Lead (SecDevOps)	DBP Platform | SecDevOps	SecDevOps	dominic.paul@digitalqatalyst.com	+254 708 251 527	NBO
Ian Kipkorir	Full-Stack Developer 	Factory Lead (Solutions)	DBP Platform | Solutions	eCom | DWS	ian.kipkorir@digitalqatalyst.com	+254 799 567 379	NBO
Debra Wangari	Product Owner	Sector Lead (DBP Platforms)	DBP Platform | Products	DBP Platform	debra.wangari@digitalqatalyst.com	+254 717 574 734	NBO
Eugene Ndichu	Product Owner	Tower Lead (DT2.0 | DTMP)	DBP Platform | Products	DT2.0 | DTMP	eugene.ndichu@digitalqatalyst.com	+254 797 680 821	NBO
`.trim();

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();

const sanitizeTelHref = (value: string): string => value.replace(/\s+/g, '');

const inferSectorFromTag = (tag: string, unit: string): SectorType => {
  const text = `${tag} ${unit}`.toLowerCase();
  if (text.includes('governance')) return 'Governance';
  if (
    text.includes('operation') ||
    text.includes('hra') ||
    text.includes('coe') ||
    text.includes('o2p')
  ) {
    return 'Operations';
  }
  if (
    text.includes('deliver') ||
    text.includes('deploy') ||
    text.includes('design') ||
    text.includes('account')
  ) {
    return 'Delivery';
  }
  return 'Platform';
};

const parseAssociates = (raw: string): Associate[] =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\t+|\s{2,}/).map((part) => part.trim()))
    .map((parts) => {
      const [
        name = '',
        title = '',
        role = '',
        unit = '',
        tag = '',
        email = '',
        mobile = '',
        location = '',
        company = '',
        website = '',
      ] = parts;

      const associate: Associate = {
        name,
        title,
        role,
        unit,
        tag,
        email: email || undefined,
        mobile: mobile || undefined,
        location: location || undefined,
        company: company || 'DigitalQatalyst',
        website: website || undefined,
      };

      associate.sector = inferSectorFromTag(associate.tag, associate.unit);

      return associate;
    })
    .filter((item) => item.name);

const getDescription = (associate: Associate): string => {
  const title = associate.title?.trim();
  const role = associate.role?.trim();
  if (title && role) {
    return title.length <= role.length ? title : role;
  }
  return title || role || '';
};

const getOneLiner = (a: Associate): string => {
  const parts = [a.title?.trim(), a.role?.trim()].filter(Boolean);
  return parts.join(' • ');
};

const CARD_BASE =
  'rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition';
const PAD = 'flex min-h-[360px] flex-col p-6';
const META_PANEL = 'rounded-xl bg-slate-50 p-4 mb-4';
const CTA_NAVY =
  'w-full rounded-xl bg-[#131E42] text-white text-sm py-2.5 font-semibold hover:bg-[#0F1633] transition-colors';

interface AssociateCardProps {
  associate: Associate;
  onOpen: (associate: Associate) => void;
}

const AssociateCard: React.FC<AssociateCardProps> = ({ associate, onOpen }) => {
  const { name, tag, email, mobile, location, website } = associate;
  const mailHref = email ? `mailto:${email}` : undefined;
  const phoneHref = mobile ? `tel:${sanitizeTelHref(mobile)}` : undefined;
  const description = getDescription(associate);
  const oneLiner = getOneLiner(associate);
  const locationLabel = website ? website.replace(/^https?:\/\//, '') : location;
  const websiteHref =
    website && (website.startsWith('http://') || website.startsWith('https://'))
      ? website
      : website
      ? `https://${website}`
      : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(associate)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(associate);
        }
      }}
      className={`${CARD_BASE} focus:outline-none focus:ring-2 focus:ring-[#131E42]/40`}
    >
      <div className={PAD}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
            {initials(name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {tag}
              </span>
            </div>
            {description && (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            )}
            {oneLiner && (
              <p className="mt-2 text-[13px] leading-5 text-slate-600 line-clamp-2">{oneLiner}</p>
            )}
          </div>
        </div>

        <div className="flex-grow" />

        {/* Contact panel sits just above CTA */}
        <div className={META_PANEL}>
          {mobile && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">📞</span>
              <a
                href={phoneHref}
                onClick={(event) => event.stopPropagation()}
                className="underline underline-offset-2 hover:text-slate-900"
              >
                {mobile}
              </a>
            </div>
          )}
          {email && (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">✉️</span>
              <a
                href={mailHref}
                onClick={(event) => event.stopPropagation()}
                className="truncate underline underline-offset-2 hover:text-slate-900"
              >
                {email}
              </a>
            </div>
          )}
          {locationLabel && (
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true">🌐</span>
              {websiteHref ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="underline underline-offset-2 hover:text-slate-900"
                >
                  {locationLabel}
                </a>
              ) : (
                <span>{locationLabel}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(associate);
            }}
            className={CTA_NAVY}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  person: Associate | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, person }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !person) return null;

  const { name, tag, title, role, unit, email, mobile, location, company, website } = person;
  const mailHref = email ? `mailto:${email}` : undefined;
  const phoneHref = mobile ? `tel:${sanitizeTelHref(mobile)}` : undefined;
  const displayWebsite = website;
  const description = getDescription(person);
  const showTitleLine = Boolean(title && title.trim() && title.trim() !== description);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-xl ring-1 ring-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
              {initials(name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="profile-modal-title" className="text-xl font-semibold text-slate-900">
                  {name}
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  {tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
              {showTitleLine && (
                <p className="mt-1 text-xs font-medium text-slate-500">{title}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            aria-label="Close profile"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">{role}</p>
            <p className="mt-2 text-sm text-slate-600">{unit}</p>
          </div>
          <div className="space-y-3">
            {mobile && (
              <a
                href={phoneHref}
                className="flex items-center gap-3 text-sm text-slate-700 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <span aria-hidden="true">📞</span>
                </div>
                {mobile}
              </a>
            )}
            {email && (
              <a
                href={mailHref}
                className="flex items-center gap-3 text-sm text-slate-700 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <span aria-hidden="true">✉️</span>
                </div>
                {email}
              </a>
            )}
            {(displayWebsite || location) && (
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <span aria-hidden="true">🌐</span>
                </div>
                {displayWebsite ? (
                  <a
                    href={displayWebsite.startsWith('http') ? displayWebsite : `https://${displayWebsite}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 transition hover:text-slate-900"
                  >
                    {displayWebsite.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span>{location}</span>
                )}
              </div>
            )}
            {company && (
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <span aria-hidden="true">🏢</span>
                </div>
                {company}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:w-auto"
          >
            Close
          </button>
          {email && (
            <a
              href={mailHref}
              className="w-full rounded-2xl border-2 border-[#1E40FF] px-4 py-2.5 text-center text-sm font-semibold text-[#1E40FF] transition hover:bg-[#1E40FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:w-auto"
            >
              Email
            </a>
          )}
          {mobile && (
            <a
              href={phoneHref}
              className="w-full rounded-2xl border-2 border-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:w-auto"
            >
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const DQDirectory: React.FC<DQDirectoryProps> = ({
  subtitle = 'Connect with DQ sectors, teams, and associates driving collaboration, delivery, and innovation across the Digital Workspace.',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'units'
  );
  const [selectedSectors, setSelectedSectors] = useState<SectorType[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Associate | null>(null);
  const [open, setOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (viewMode !== 'units') params.set('view', viewMode);
    if (selectedSectors.length > 0) params.set('sectors', selectedSectors.join(','));
    if (selectedStreams.length > 0) params.set('streams', selectedStreams.join(','));
    
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, viewMode, selectedSectors, selectedStreams, setSearchParams]);

  const showcaseAssociates = useMemo<Associate[]>(() => parseAssociates(RAW_ASSOCIATES_SHOWCASE), []);

  // Filter logic
  const filteredUnits = useMemo(() => {
    let filtered = [...unitsData];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((unit) =>
        [unit.name, unit.description, unit.sector, ...(unit.streams || []), ...(unit.tags || [])]
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

    // Stream filter
    if (selectedStreams.length > 0) {
      filtered = filtered.filter((unit) =>
        unit.streams?.some((stream) => selectedStreams.includes(stream))
      );
    }

    return filtered;
  }, [debouncedQuery, selectedSectors, selectedStreams]);

  const filteredAssociates = useMemo(() => {
    let filtered = [...showcaseAssociates];

    // Search
    if (debouncedQuery.trim()) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((person) =>
        [
          person.name,
          person.title,
          person.role,
          person.unit,
          person.sector,
          person.tag,
          person.email,
          person.mobile,
          person.location,
          person.company,
          person.website,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(lower)
      );
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(
        (person) => person.sector && selectedSectors.includes(person.sector)
      );
    }

    return filtered;
  }, [debouncedQuery, selectedSectors, showcaseAssociates]);

  const toggleSector = (sector: SectorType) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedStreams([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSectors.length > 0 || selectedStreams.length > 0 || searchQuery.trim();
  const sectors: SectorType[] = ['Governance', 'Operations', 'Platform', 'Delivery'];
  const resultCount = viewMode === 'units' ? filteredUnits.length : filteredAssociates.length;
  const openModal = (person: Associate) => {
    setSelected(person);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

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
            className="text-[32px] md:text-[40px] font-bold tracking-tight leading-tight mb-3"
            style={{ color: '#131E42' }}
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
                {selectedSectors.length + selectedStreams.length + (searchQuery.trim() ? 1 : 0)}
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
              {['Governance', 'Operations', 'Platform', 'Delivery'].map((sector) => (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector as SectorType)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    backgroundColor: selectedSectors.includes(sector as SectorType) ? '#131E42' : '#F9FAFB',
                    color: selectedSectors.includes(sector as SectorType) ? '#fff' : '#334266',
                    border: `1px solid ${
                      selectedSectors.includes(sector as SectorType) ? '#131E42' : '#E3E7F8'
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

        {/* Grid */}
        {viewMode === 'associates' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAssociates.map((person, index) => (
              <AssociateCard
                key={`${person.name}-${person.unit}-${index}`}
                associate={person}
                onOpen={openModal}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredUnits.map((unit) => (
              <DirectoryCard
                key={unit.id}
                {...mapUnitToCard(unit, () => {
                  window.open(unit.marketplaceUrl, '_blank');
                })}
              />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <a
            href="/marketplace/directory"
            className="dws-btn-primary inline-flex items-center gap-2"
            aria-label="View full directory in marketplace"
          >
            View Full Directory
          </a>
        </div>
      </div>

      <ProfileModal open={open} onClose={closeModal} person={selected} />
    </section>
  );
};

export default DQDirectory;
