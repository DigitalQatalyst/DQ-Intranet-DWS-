import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, LocateFixed, Maximize2, Search } from 'lucide-react';

import { DQMap } from '../DQMap';
import { MARKER_COLORS } from './constants';
import type { MapStyle } from '../../types/map';

type MapCardProps = {
  className?: string;
};

type MapStateSnapshot = {
  loading: boolean;
  locationsCount: number;
  mapboxEnabled: boolean;
};

const MAP_STYLE_LABELS: Record<MapStyle, string> = {
  standard: 'Standard',
  satellite: 'Satellite',
  hybrid: 'Hybrid',
};

const LEGEND_ITEMS = Object.entries(MARKER_COLORS)
  .filter(([key]) => key !== 'Default')
  .map(([label, color]) => ({ label, color }));

export const MapCard: React.FC<MapCardProps> = ({ className = '' }) => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [activeTab, setActiveTab] = useState<'Sectors' | 'Zones'>('Zones');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapState, setMapState] = useState<MapStateSnapshot>({
    loading: true,
    locationsCount: 0,
    mapboxEnabled: true,
  });
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const styleMenuRef = useRef<HTMLDivElement | null>(null);

  const handleMapStateChange = useCallback((snapshot: MapStateSnapshot) => {
    setMapState(snapshot);
  }, []);

  const toggleStyleMenu = useCallback(() => {
    setStyleMenuOpen((open) => !open);
  }, []);

  const closeStyleMenu = useCallback(() => setStyleMenuOpen(false), []);

  useEffect(() => {
    if (!styleMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!styleMenuRef.current) return;
      if (!styleMenuRef.current.contains(event.target as Node)) {
        setStyleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [styleMenuOpen]);

  useEffect(() => {
    if (!mapState.mapboxEnabled) {
      setStyleMenuOpen(false);
    }
  }, [mapState.mapboxEnabled]);

  const mapStyleOptions = useMemo(
    () =>
      (Object.keys(MAP_STYLE_LABELS) as MapStyle[]).map((key) => ({
        value: key,
        label: MAP_STYLE_LABELS[key],
      })),
    [],
  );

  return (
    <div
      className={`relative flex h-[240px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_10px_30px_rgba(3,15,53,0.08)] md:h-[360px] xl:h-[420px] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2">
        <div className="pointer-events-auto relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search locations"
            className="h-9 w-full rounded-lg border border-gray-200 bg-white/90 px-9 text-sm text-slate-700 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-[#3555FF] focus:ring-2 focus:ring-[#3555FF]/30"
            type="search"
            aria-label="Search locations"
          />
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-1 py-1 shadow-sm">
          {(['Sectors', 'Zones'] as const).map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-7 rounded-full px-3 text-xs font-semibold transition ${
                  isActive ? 'bg-[#3555FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
                aria-pressed={isActive}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div className="pointer-events-auto relative" ref={styleMenuRef}>
          <button
            type="button"
            onClick={mapState.mapboxEnabled ? toggleStyleMenu : undefined}
            className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
              mapState.mapboxEnabled
                ? 'border-gray-200 bg-white/90 text-slate-700 shadow-sm hover:border-[#3555FF]/50 hover:text-[#3555FF]'
                : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            }`}
            aria-haspopup="listbox"
            aria-expanded={styleMenuOpen}
            aria-label="Select map style"
          >
            Map Style
            <ChevronDown className="h-4 w-4" />
          </button>
          {styleMenuOpen && mapState.mapboxEnabled && (
            <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <ul className="py-1" role="listbox" aria-label="Map style options">
                {mapStyleOptions.map((option) => {
                  const isActive = option.value === mapStyle;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setMapStyle(option.value);
                          closeStyleMenu();
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                          isActive ? 'bg-[#3555FF]/10 text-[#3555FF]' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {option.label}
                        {isActive && <LocateFixed className="h-4 w-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="pointer-events-auto">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/90 text-slate-600 shadow-sm transition hover:border-[#3555FF]/40 hover:text-[#3555FF]"
            aria-label="Toggle fullscreen map"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
          {LEGEND_ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white shadow-[0_1px_3px_rgba(15,23,42,0.2)]"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
        {!mapState.loading && (
          <span className="pointer-events-auto inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
            {mapState.locationsCount} location{mapState.locationsCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 min-h-0">
        <DQMap
          className="relative flex-1 min-h-0 h-full"
          mapStyle={mapStyle}
          onStateChange={handleMapStateChange}
          onMapboxAvailabilityChange={(value) =>
            setMapState((prev) => ({ ...prev, mapboxEnabled: value }))
          }
        />
      </div>
    </div>
  );
};

export default MapCard;
