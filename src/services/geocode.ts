import { toLngLat } from '../utils/geo';

type CacheEntry = {
  lat: number;
  lng: number;
  source: 'mapbox' | 'nominatim';
  ts: number;
};

const inMemoryCache = new Map<string, CacheEntry>();
const CACHE_KEY = 'dq-geo-cache-v1';

const loadCache = () => {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed: Record<string, CacheEntry> = JSON.parse(raw);
    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value.lat === 'number' && typeof value.lng === 'number') {
        inMemoryCache.set(key, value);
      }
    });
  } catch (error) {
    console.warn('[geocode] Failed to read cache', error);
  }
};

const persistCache = () => {
  if (typeof window === 'undefined') return;
  try {
    const payload = Object.fromEntries(inMemoryCache.entries());
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('[geocode] Failed to persist cache', error);
  }
};

if (typeof window !== 'undefined') {
  loadCache();
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const fetchMapbox = async (query: string): Promise<CacheEntry | null> => {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox geocode failed: ${res.status}`);
  const json = await res.json();
  const feature = json?.features?.[0];
  if (feature?.center?.length === 2) {
    const [lng, lat] = feature.center;
    return { lat, lng, source: 'mapbox', ts: Date.now() };
  }
  return null;
};

const fetchNominatim = async (query: string): Promise<CacheEntry | null> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query,
  )}&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DQ-Ecosystem-Map/1.0' },
  });
  if (!res.ok) throw new Error(`OSM geocode failed: ${res.status}`);
  const json = await res.json();
  const feature = json?.[0];
  if (feature?.lat && feature?.lon) {
    const lat = parseFloat(feature.lat);
    const lng = parseFloat(feature.lon);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng, source: 'nominatim', ts: Date.now() };
    }
  }
  return null;
};

export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!query?.trim()) return null;
  const key = query.trim().toLowerCase();
  const cached = inMemoryCache.get(key);
  if (cached) return { lat: cached.lat, lng: cached.lng };

  try {
    const mapboxResult = await fetchMapbox(query);
    if (mapboxResult) {
      inMemoryCache.set(key, mapboxResult);
      persistCache();
      return { lat: mapboxResult.lat, lng: mapboxResult.lng };
    }
  } catch (error) {
    console.warn('[geocode] Mapbox lookup failed', query, error);
  }

  try {
    const osmResult = await fetchNominatim(query);
    if (osmResult) {
      inMemoryCache.set(key, osmResult);
      persistCache();
      return { lat: osmResult.lat, lng: osmResult.lng };
    }
  } catch (error) {
    console.warn('[geocode] Nominatim lookup failed', query, error);
  }

  return null;
}

export function getCachedLngLat(query: string): [number, number] | null {
  const key = query.trim().toLowerCase();
  const hit = inMemoryCache.get(key);
  if (!hit) return null;
  return toLngLat(hit.lat, hit.lng);
}
