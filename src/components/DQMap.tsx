import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import type { LocationCategory, LocationItem } from "../api/MAPAPI";
import { MARKER_COLORS } from "./map/constants";

const INITIAL_CENTER: [number, number] = [24.453, 54.377];
const INITIAL_ZOOM = 6;
const CARTO_LIGHT_ALL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>';

const dropletMarkup = (color: string) => `
  <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 8px 18px rgba(3,15,53,0.25));">
    <path d="M18 0C8.06 0 0 8.16 0 18.22C0 28.28 10.74 40.98 16.42 47.02C17.1 47.74 18.26 47.74 18.94 47.02C24.62 40.98 35.36 28.28 35.36 18.22C35.36 8.16 27.3 0 17.36 0H18Z" fill="${color}"/>
    <circle cx="18" cy="18" r="6.5" fill="white" fill-opacity="0.92"/>
    <circle cx="18" cy="18" r="3.2" fill="${color}"/>
  </svg>
`;

const leafletIconFor = (type: LocationCategory) =>
  L.divIcon({
    className: "",
    iconSize: [36, 48],
    iconAnchor: [18, 42],
    html: `<div style=\"width:36px;height:48px;display:flex;align-items:flex-start;justify-content:center;\">${dropletMarkup(
      MARKER_COLORS[type] ?? MARKER_COLORS.Default,
    )}</div>`,
  });

const buildPopupMarkup = (location: LocationItem) => {
  const rows: string[] = [];
  rows.push(`<div style=\"font-size:16px;font-weight:600;color:#030F35;\">${location.name}</div>`);
  rows.push(
    `<div style=\"margin-top:6px;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#030F35;text-transform:uppercase;letter-spacing:0.14em;\">${location.type}</div>`,
  );
  rows.push(
    `<div style=\"margin-top:8px;font-size:12px;color:#4B5563;\">📍 ${location.address}, ${location.city}, ${location.country}</div>`,
  );
  if (location.contact) rows.push(`<div style=\"font-size:12px;color:#4B5563;\">📞 ${location.contact}</div>`);
  if (location.services?.length)
    rows.push(`<div style=\"font-size:12px;color:#4B5563;\">🔧 ${location.services.join(' • ')} </div>`);
  return `<div style=\"display:flex;flex-direction:column;gap:6px;min-width:220px;\">${rows.join('')}</div>`;
};

type Props = {
  className?: string;
  locations: LocationItem[];
  selectedId?: string | null;
  onSelect?: (location: LocationItem) => void;
};

const DQMap: React.FC<Props> = ({ className = "", locations, selectedId, onSelect }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const popupRef = useRef<L.Popup | null>(null);

  const validLocations = useMemo(() => locations.filter((item) => item.coordinates), [locations]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [INITIAL_CENTER[0], INITIAL_CENTER[1]],
      zoom: INITIAL_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(CARTO_LIGHT_ALL, {
      attribution: CARTO_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    map.once("load", () => {
      requestAnimationFrame(() => map.invalidateSize());
    });

    mapRef.current = map;

    return () => {
      popupRef.current?.remove();
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    validLocations.forEach((location) => {
      const coords = location.coordinates;
      if (!coords) return;

      const marker = L.marker([coords.lat, coords.lng], {
        icon: leafletIconFor(location.type),
      });

      marker.on("click", () => {
        onSelect?.(location);
        const popup = popupRef.current ?? L.popup({ className: 'dq-map-popup', offset: [0, -18] });
        popupRef.current = popup;
        popup
          .setLatLng([coords.lat, coords.lng])
          .setContent(buildPopupMarkup(location))
          .openOn(map);
      });

      marker.addTo(map);
      markersRef.current[location.id] = marker;
    });

    if (validLocations.length) {
      const bounds = L.latLngBounds(
        validLocations.map((location) => [location.coordinates!.lat, location.coordinates!.lng]),
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.18), { animate: true });
      }
    } else {
      map.setView([INITIAL_CENTER[0], INITIAL_CENTER[1]], INITIAL_ZOOM);
    }
  }, [validLocations, onSelect]);

  useEffect(() => {
    if (!selectedId) {
      popupRef.current?.remove();
      return;
    }

    const map = mapRef.current;
    if (!map) return;

    const location = validLocations.find((item) => item.id === selectedId);
    if (!location || !location.coordinates) return;

    const popup = popupRef.current ?? L.popup({ className: 'dq-map-popup', offset: [0, -18] });
    popupRef.current = popup;
    popup
      .setLatLng([location.coordinates.lat, location.coordinates.lng])
      .setContent(buildPopupMarkup(location))
      .openOn(map);

    map.flyTo([location.coordinates.lat, location.coordinates.lng], 13);
  }, [selectedId, validLocations]);

  useEffect(() => {
    const handleResize = () => mapRef.current?.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={containerRef} className={`relative h-full w-full ${className}`.trim()} />;
};

export default DQMap;
