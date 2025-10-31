import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import type { LocationType, MapLocation, MapStyle, Region } from '../types/map';
import { MARKER_COLORS } from './map/constants';
import { fetchAllLocations, fetchLocationsByRegion, fetchLocationsByType } from '../api/MAPAPI';

const DEFAULT_CENTER: [number, number] = [24.453, 54.377];
const DEFAULT_ZOOM = 6;

type AllOption<T> = T | 'All';

type MapStateSnapshot = {
  loading: boolean;
  locationsCount: number;
  mapboxEnabled: boolean;
};

type DQMapProps = {
  className?: string;
  mapStyle: MapStyle;
  regionFilter?: AllOption<Region>;
  typeFilter?: AllOption<LocationType>;
  onStateChange?: (snapshot: MapStateSnapshot) => void;
  onMapboxAvailabilityChange?: (available: boolean) => void;
};

const forceResize = (map: L.Map) => {
  map.invalidateSize();
  requestAnimationFrame(() => map.invalidateSize());
};

const createMarkerElement = (strokeColor: string) => {
  const node = document.createElement('div');
  node.style.cssText =
    'width:30px;height:30px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 4px rgba(3,15,53,0.25));z-index:5;';
  node.innerHTML = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="14" fill="white" stroke="${strokeColor}" stroke-width="2"/>
    <circle cx="15" cy="15" r="7" fill="${strokeColor}" fill-opacity="0.12"/>
    <circle cx="15" cy="15" r="3" fill="${strokeColor}"/>
  </svg>`;
  return node;
};

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

export const DQMap: React.FC<DQMapProps> = ({
  className = '',
  mapStyle: _mapStyle,
  regionFilter = 'All',
  typeFilter = 'All',
  onStateChange,
  onMapboxAvailabilityChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const locationsRef = useRef<MapLocation[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [mapboxEnabled] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const effectiveRegion = regionFilter;
  const effectiveType = useMemo<AllOption<LocationType>>(() => {
    if (effectiveRegion !== 'All') return 'All';
    return typeFilter;
  }, [effectiveRegion, typeFilter]);

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const dataset = locationsRef.current;

    dataset.forEach((location) => {
      const stroke = MARKER_COLORS[location.type] ?? MARKER_COLORS.Default;
      const icon = L.divIcon({
        html: createMarkerElement(stroke).outerHTML,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 28],
      });
      const marker = L.marker([location.position[0], location.position[1]], { icon })
        .bindPopup(buildPopupMarkup(location));
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    if (dataset.length) {
      const bounds = L.latLngBounds(
        dataset.map((l) => L.latLng(l.position[0], l.position[1])),
      );
      map.fitBounds(bounds.pad(0.15));
    } else {
      map.setView([DEFAULT_CENTER[0], DEFAULT_CENTER[1]], DEFAULT_ZOOM);
    }
  }, []);

  const ensureMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    forceResize(map);
    renderMarkers();
  }, [renderMarkers]);

  useEffect(() => {
    onMapboxAvailabilityChange?.(mapboxEnabled);
  }, [mapboxEnabled, onMapboxAvailabilityChange]);

  useEffect(() => {
    onStateChange?.({
      loading,
      locationsCount: locations.length,
      mapboxEnabled,
    });
  }, [loading, locations.length, mapboxEnabled, onStateChange]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      center: [DEFAULT_CENTER[0], DEFAULT_CENTER[1]],
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);
    ensureMarkers();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        if (mapRef.current) forceResize(mapRef.current);
      });
      resizeObserverRef.current = observer;
      if (wrapperRef.current) observer.observe(wrapperRef.current);
    }

    const handleWindowResize = () => {
      if (mapRef.current) forceResize(mapRef.current);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [ensureMarkers]);

  // Map style switching is a no-op with Leaflet; keep signals consistent
  useEffect(() => {
    onMapboxAvailabilityChange?.(false);
  }, [onMapboxAvailabilityChange]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const data =
          effectiveRegion !== 'All'
            ? await fetchLocationsByRegion(effectiveRegion as Region)
            : effectiveType !== 'All'
            ? await fetchLocationsByType(effectiveType as LocationType)
            : await fetchAllLocations();

        if (!cancelled) {
          setLocations(data);
        }
      } catch (error) {
        console.error('[DQMap] Failed to load locations', error);
        if (!cancelled) {
          setLocations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [effectiveRegion, effectiveType]);

  useEffect(() => {
    locationsRef.current = locations;
    if (!loading) {
      ensureMarkers();
    }
  }, [locations, loading, ensureMarkers]);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full ${className}`}
    >
      <div ref={mapNodeRef} className="absolute inset-0 h-full w-full z-0" />
      {(!mapReady || loading) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <span className="rounded-full border border-slate-200/70 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            Loading map…
          </span>
        </div>
      )}
    </div>
  );
};

export default DQMap;
