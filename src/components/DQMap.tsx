import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapboxEvent, RasterLayerSpecification, RasterSourceSpecification, Style } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { LocationType, MapLocation, MapStyle, Region } from '../types/map';
import {
  fetchAllLocations,
  fetchLocationsByRegion,
  fetchLocationsByType,
  getUniqueRegions,
  getUniqueTypes,
} from '../api/MAPAPI';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const mapboxMajorVersion = Number((mapboxgl.version || '').split('.')[0] || '2');
const STANDARD_STYLE =
  mapboxMajorVersion >= 3 ? 'mapbox://styles/mapbox/standard' : 'mapbox://styles/mapbox/light-v11';

type AllOption<T> = T | 'All';
type FilterControl = {
  key: string;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};
const MARKER_COLORS: Record<LocationType | 'Default', string> = {
  Headquarters: '#111827',
  'Regional Office': '#6C63FF',
  Client: '#3BA6E8',
  Authority: '#F59E0B',
  Default: '#6B7280',
};

const MAPBOX_STYLES: Record<MapStyle, string> = {
  standard: STANDARD_STYLE,
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  hybrid: 'mapbox://styles/mapbox/satellite-v9',
};

const OSM_RASTER_SOURCE: RasterSourceSpecification = {
  type: 'raster',
  tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
  tileSize: 256,
  attribution: '© OpenStreetMap contributors',
};

const OSM_RASTER_LAYER: RasterLayerSpecification = {
  id: 'osm-layer',
  type: 'raster',
  source: 'osm-tiles',
};

const OSM_STYLE: Style = {
  version: 8,
  sources: {
    'osm-tiles': OSM_RASTER_SOURCE,
  },
  layers: [OSM_RASTER_LAYER],
};

const DEFAULT_CENTER: [number, number] = [54.3773, 24.4539];
const DEFAULT_ZOOM = 9;

const withAlpha = (hex: string, alpha: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const forceResize = (map: mapboxgl.Map) => {
  map.resize();
  requestAnimationFrame(() => (map.resize(), requestAnimationFrame(() => map.resize())));
};

const markerSVG = (color: string, size = 36) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.45)"/><circle cx="18" cy="18" r="15.2" fill="${withAlpha(
    color,
    0.12,
  )}" stroke="${color}" stroke-width="2.4"/><circle cx="18" cy="15" r="3.2" stroke="${color}" stroke-width="1.8"/><path d="M12.4 23.2C12.4 20.4 15 18 18 18C21 18 23.6 20.4 23.6 23.2" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.2 20.4C10.2 18.7 11.7 17.2 13.4 17.2" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><path d="M25.8 20.4C25.8 18.7 24.3 17.2 22.6 17.2" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/></svg>`;

const createMarkerElement = (color: string) => {
  const node = document.createElement('div');
  node.style.cssText =
    'width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;filter:drop-shadow(0 6px 10px rgba(2,6,23,.25));';
  node.innerHTML = markerSVG(color);
  return node;
};

const FiltersRow: React.FC<{ controls: FilterControl[] }> = ({ controls }) => (
  <div className="grid gap-3 md:grid-cols-3">
    {controls.map((control) => (
      <label key={control.key} className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        {control.label}
        <select
          value={control.value}
          disabled={control.disabled}
          onChange={(event) => control.onChange(event.target.value)}
          className="h-10 rounded-xl border border-gray-300 px-3 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    ))}
  </div>
);

const MapLegend: React.FC<{ entries: [string, string][] }> = ({ entries }) => (
  <div className="flex flex-wrap items-center gap-3">
    {entries.map(([type, color]) => (
      <div key={type} className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center" dangerouslySetInnerHTML={{ __html: markerSVG(color, 22) }} />
        <span className="text-xs font-medium text-slate-600">{type}</span>
      </div>
    ))}
  </div>
);

const buildPopupMarkup = (location: MapLocation) =>
  `<div class="space-y-1">${[
    `<div class="font-semibold text-base text-slate-900">${location.name}</div>`,
    `<div class="text-xs text-slate-500">${location.type} · ${location.region}</div>`,
    location.description && `<div class="text-sm text-slate-600">${location.description}</div>`,
    location.address && `<div class="text-xs text-slate-500">📍 ${location.address}</div>`,
    location.contactPhone && `<div class="text-xs text-slate-500">📞 ${location.contactPhone}</div>`,
    location.services?.length ? `<div class="text-xs text-slate-500">🔧 ${location.services.join(' • ')}</div>` : '',
    location.operatingHours && `<div class="text-xs text-slate-500">🕐 ${location.operatingHours}</div>`,
  ]
    .filter(Boolean)
    .join('')}</div>`;

type DQMapProps = { className?: string; height?: number };

export const DQMap: React.FC<DQMapProps> = ({ className = '', height = 560 }) => {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<AllOption<Region>>('All');
  const [selectedType, setSelectedType] = useState<AllOption<LocationType>>('All');
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [loading, setLoading] = useState(true);
  const [mapboxEnabled, setMapboxEnabled] = useState(Boolean(mapboxgl.accessToken));

  const regions = getUniqueRegions(), types = getUniqueTypes();

  const filterControls: FilterControl[] = [
    { key: 'region', label: 'Region', value: selectedRegion, disabled: false, onChange: (value) => { setSelectedRegion(value as AllOption<Region>); setSelectedType('All'); }, options: [{ label: 'All Regions', value: 'All' }, ...regions.map((region) => ({ label: region, value: region }))] },
    { key: 'type', label: 'Type', value: selectedType, disabled: false, onChange: (value) => { setSelectedType(value as AllOption<LocationType>); setSelectedRegion('All'); }, options: [{ label: 'All Types', value: 'All' }, ...types.map((type) => ({ label: type, value: type }))] },
    { key: 'style', label: 'Map Style', value: mapStyle, disabled: !mapboxEnabled, onChange: (value) => setMapStyle(value as MapStyle), options: [{ label: 'Standard', value: 'standard' }, { label: 'Satellite', value: 'satellite' }, { label: 'Hybrid', value: 'hybrid' }] },
  ];

  useEffect(() => {
    if (!mapNodeRef.current) return;
    const hasToken = Boolean(mapboxgl.accessToken);
    const map = new mapboxgl.Map({
      container: mapNodeRef.current,
      style: hasToken ? MAPBOX_STYLES.standard : OSM_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      cooperativeGestures: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    const resizeHandler = () => map.resize();
    map.on('load', resizeHandler);
    const handleStyleData = () => forceResize(map);
    map.on('styledata', handleStyleData);

    let switchedToOsm = !hasToken;
    const switchToOsm = () => {
      if (switchedToOsm) return;
      switchedToOsm = true;
      setMapboxEnabled(false);
      map.setStyle(OSM_STYLE);
      map.once('styledata', () => forceResize(map));
    };

    const logAndSwitch = (event: MapboxEvent) => {
      console.error('Mapbox GL error encountered', event);
      switchToOsm();
    };

    const fallbackTimer = hasToken ? window.setTimeout(switchToOsm, 1800) : undefined;
    map.on('error', logAndSwitch);

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      map.off('load', resizeHandler);
      map.off('styledata', handleStyleData);
      map.off('error', logAndSwitch);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current; if (!map || !mapboxEnabled) return;

    const targetStyle = MAPBOX_STYLES[mapStyle];
    let errored = false;

    const handleError = () => {
      errored = true;
      setMapboxEnabled(false);
      map.setStyle(OSM_STYLE);
      map.once('styledata', () => forceResize(map));
    };

    const handleStyleData = () => {
      if (!errored) forceResize(map);
      map.off('error', handleError);
    };

    map.once('error', handleError);
    map.once('styledata', handleStyleData);
    map.setStyle(targetStyle);
  }, [mapStyle, mapboxEnabled]);

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const data =
          selectedRegion !== 'All'
            ? await fetchLocationsByRegion(selectedRegion as Region)
            : selectedType !== 'All'
            ? await fetchLocationsByType(selectedType as LocationType)
            : await fetchAllLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error loading locations:', error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [selectedRegion, selectedType]);

  useEffect(() => {
    const map = mapRef.current; if (!map || loading) return;

    markersRef.current.forEach((marker) => marker.remove()); markersRef.current = [];

    locations.forEach((location) => {
      const color = MARKER_COLORS[location.type] ?? MARKER_COLORS.Default;
      const marker = new mapboxgl.Marker({ element: createMarkerElement(color), anchor: 'bottom' })
        .setLngLat([location.position[1], location.position[0]])
        .setPopup(
          new mapboxgl.Popup({ offset: 20, closeButton: true, closeOnClick: false, maxWidth: '280px' }).setHTML(
            buildPopupMarkup(location),
          ),
        )
        .addTo(map);
      markersRef.current.push(marker);
    });

    if (locations.length) {
      const bounds = locations.reduce(
        (acc, item) => acc.extend([item.position[1], item.position[0]]),
        new mapboxgl.LngLatBounds(),
      );
      map.fitBounds(bounds, { padding: 60, maxZoom: 11, duration: 900 });
    } else {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
    }
  }, [locations, loading]);

  useEffect(() => {
    const resize = () => {
      const map = mapRef.current; if (map) forceResize(map);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [height]);

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${className}`}>
      <div className="flex flex-col h-full">
        <header className="border-b border-gray-200 bg-white px-5 py-5 space-y-4">
          <div className="space-y-3">
            <FiltersRow controls={filterControls} />
            <MapLegend entries={Object.entries(MARKER_COLORS).filter(([key]) => key !== 'Default')} />
          </div>
          {!loading && (
            <p className="text-xs font-medium text-slate-500">
              Showing {locations.length} location{locations.length === 1 ? '' : 's'}
            </p>
          )}
        </header>

        <div className="relative flex-1">
          <div ref={mapNodeRef} className="w-full h-[560px]" style={{ height }} />
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="text-sm font-semibold text-slate-600">Loading map…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DQMap;
