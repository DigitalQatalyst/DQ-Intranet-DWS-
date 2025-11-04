import type { MapLocation, Region, LocationType } from '../types/map';
import { resolveCleanLocations, RawLocation } from '../services/locationResolver';

export type LocationCategory =
  | 'Headquarters'
  | 'Regional Office'
  | 'Client'
  | 'Authority'
  | 'Bank'
  | 'Utility';

export type LocationItem = {
  id: string;
  name: string;
  type: LocationCategory;
  address: string;
  city: string;
  country: string;
  coordinates: { lng: number; lat: number } | null;
  tags?: string[];
  contact?: string;
  services?: string[];
};

export const DQ_LOCATIONS: LocationItem[] = [
  {
    id: 'dq-dubai-opal',
    name: 'OPAL Tower (DQ Dubai Office)',
    type: 'Headquarters',
    address: '42 Burj Khalifa Street, 8 Al Ohood Street, Business Bay',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.272215, lat: 25.184352 },
    tags: ['office', 'hq'],
  },
  {
    id: 'dfsa',
    name: 'Dubai Financial Services Authority (DFSA) — The Gate, DIFC (Level 13, West Wing)',
    type: 'Authority',
    address: 'The Gate, DIFC',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.279349, lat: 25.210992 },
    tags: ['regulator', 'financial'],
  },
  {
    id: 'dewa',
    name: 'Dubai Electricity and Water Authority (DEWA) — Head Office',
    type: 'Utility',
    address: 'Sheikh Rashid Road, Umm Hurair 2 (near Citi / Wafi)',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.323736, lat: 25.22675 },
    tags: ['utility', 'authority'],
  },
  {
    id: 'adib',
    name: 'Abu Dhabi Islamic Bank (ADIB) — Head Office',
    type: 'Bank',
    address: '1777 Sheikh Rashid Bin Saeed Street (E48), Al Muntazah',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    coordinates: { lng: 54.457821, lat: 24.422231 },
    tags: ['bank', 'client'],
  },
  {
    id: 'saib',
    name: 'The Saudi Investment Bank (SAIB) — Head Office',
    type: 'Bank',
    address: '8081 Sheikh Abdulrahman bin Hassan Street, Al-Wizarat – Al Ma’ather, Unit 2',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    coordinates: { lng: 46.682628, lat: 24.67971 },
    tags: ['bank', 'client'],
  },
  {
    id: 'neom',
    name: 'NEOM (Company / Program)',
    type: 'Client',
    address: 'NEOM Community, Tabuk Province',
    city: 'NEOM',
    country: 'Saudi Arabia',
    coordinates: { lng: 34.920757, lat: 28.131088 },
    tags: ['client', 'program'],
  },
  {
    id: 'dq-nairobi',
    name: 'DQ Nairobi Office (Kenafric Business Park)',
    type: 'Regional Office',
    address: 'Kenafric Business Park, Baba Dogo Road',
    city: 'Nairobi',
    country: 'Kenya',
    coordinates: { lng: 36.88052, lat: -1.24542 },
    tags: ['office', 'regional'],
  },
];

export const LOCATION_FILTERS: LocationCategory[] = [
  'Headquarters',
  'Regional Office',
  'Client',
  'Authority',
  'Bank',
  'Utility',
];

const RAW_LOCATIONS: RawLocation[] = [
  {
    id: 'opal-tower-hq',
    name: 'OPAL Tower, Business Bay',
    address: 'Business Bay, Dubai, UAE',
    country: 'UAE',
    category: 'Headquarters',
    lat: 25.1846,
    lng: 55.2727,
    description:
      'Central hub for DQ teams coordinating strategy, delivery, and innovation programmes.',
    services: ['Strategy Office', 'Leadership Team', 'Transformation PMO'],
    region: 'UAE',
  },
  {
    id: 'nairobi-office',
    name: 'Nairobi Office',
    address: 'Nairobi, Kenya',
    country: 'KE',
    category: 'Regional Offices',
    lat: -1.286389,
    lng: 36.817223,
    description: 'East Africa regional office anchoring DQ collaborations with local partners.',
    services: ['Regional Delivery', 'Client Success'],
    region: 'Kenya',
  },
  {
    id: 'riyadh-office',
    name: 'Riyadh Office',
    address: 'Riyadh, Kingdom of Saudi Arabia',
    country: 'KSA',
    category: 'Regional Offices',
    lat: 24.7136,
    lng: 46.6753,
    description: 'KSA regional office enabling financial services and public sector programmes.',
    services: ['Programme Delivery', 'Partner Enablement'],
    region: 'KSA',
  },
  {
    id: 'kf',
    name: 'Khalifa Fund (KF)',
    address: 'Abu Dhabi, UAE',
    country: 'UAE',
    category: 'Financial Services',
    lat: 24.4667,
    lng: 54.3667,
    description: 'Entrepreneurship ecosystem accelerator supporting SMEs across the UAE.',
    services: ['SME Enablement', 'Digital Advisory'],
    region: 'UAE',
  },
  {
    id: 'neom-bank',
    name: 'NEOM Bank',
    address: 'NEOM, Kingdom of Saudi Arabia',
    country: 'KSA',
    category: 'Financial Services',
    lat: 27.2667,
    lng: 35.2167,
    description: 'Next-gen financial platform powering NEOM’s smart-city initiatives.',
    services: ['Digital Banking', 'Experience Design'],
    region: 'KSA',
  },
  {
    id: 'saib-bank',
    name: 'SAIB Bank',
    address: 'Riyadh, Kingdom of Saudi Arabia',
    country: 'KSA',
    category: 'Financial Services',
    lat: 24.7136,
    lng: 46.6753,
    description: 'Saudi Investment Bank partnership delivering digital workflows and customer journeys.',
    services: ['Process Automation', 'Customer Journeys'],
    region: 'KSA',
  },
  {
    id: 'stc-bank',
    name: 'STC Bank',
    address: 'Riyadh, Kingdom of Saudi Arabia',
    country: 'KSA',
    category: 'Financial Services',
    lat: 24.7136,
    lng: 46.6753,
    description: 'STC-backed digital banking rollout scaling to new growth markets.',
    services: ['Platform Build', 'Service Design'],
    region: 'KSA',
  },
  {
    id: 'adib',
    name: 'ADIB',
    address: 'Abu Dhabi, UAE',
    country: 'UAE',
    category: 'Financial Services',
    lat: 24.4667,
    lng: 54.3667,
    description: 'Islamic banking transformation with Abu Dhabi Islamic Bank.',
    services: ['Digital Lending', 'Operational Excellence'],
    region: 'UAE',
  },
  {
    id: 'dfsa',
    name: 'DFSA',
    address: 'DIFC, Dubai, UAE',
    country: 'UAE',
    category: 'Regulators',
    lat: 25.2048,
    lng: 55.2708,
    description: 'Regulatory collaboration with Dubai Financial Services Authority.',
    services: ['Policy Innovation', 'RegTech Advisory'],
    region: 'UAE',
  },
  {
    id: 'dewa',
    name: 'DEWA',
    address: 'Dubai, UAE',
    country: 'UAE',
    category: 'Energy & Utilities',
    lat: 25.2,
    lng: 55.26,
    description: 'Energy & utilities partner accelerating smart-city and sustainability programmes.',
    services: ['Smart Grids', 'Sustainability Ops'],
    region: 'UAE',
  },
];

let cachedLocations: MapLocation[] | null = null;

const delay = () => new Promise((resolve) => setTimeout(resolve, 60));

const hydrateLocations = async () => {
  if (cachedLocations) return cachedLocations;

  const clean = await resolveCleanLocations(RAW_LOCATIONS);
  cachedLocations = clean.map<MapLocation>((loc) => ({
    id: loc.id,
    name: loc.name,
    position: [loc.lat!, loc.lng!],
    description: loc.description ?? '',
    address: loc.address,
    type: mapCategoryToType(loc.category),
    region: mapCountryToRegion(loc.region ?? loc.country ?? 'UAE'),
    services: loc.services,
    sector: loc.category,
  }));

  return cachedLocations;
};

const mapCategoryToType = (category?: string): LocationType => {
  switch (category) {
    case 'Headquarters':
      return 'Headquarters';
    case 'Regional Offices':
      return 'Regional Office';
    case 'Authorities':
    case 'Regulators':
    case 'Energy & Utilities':
      return 'Authority';
    default:
      return 'Client';
  }
};

const mapCountryToRegion = (value: string): Region => {
  const normalized = value.toUpperCase();
  if (normalized.includes('KSA') || normalized.includes('SAUDI')) return 'Riyadh';
  if (normalized.includes('KENYA') || normalized.includes('NAIROBI')) return 'Nairobi';
  if (normalized.includes('NEOM')) return 'NEOM';
  if (normalized.includes('DUBAI')) return 'Dubai';
  if (normalized.includes('ABU')) return 'Abu Dhabi';
  return 'Dubai';
};

export const fetchAllLocations = async (): Promise<MapLocation[]> => {
  await delay();
  return hydrateLocations();
};

export const fetchLocationsByRegion = async (region: Region): Promise<MapLocation[]> => {
  await delay();
  const data = await hydrateLocations();
  return data.filter((loc) => loc.region === region);
};

export const fetchLocationsByType = async (type: LocationType): Promise<MapLocation[]> => {
  await delay();
  const data = await hydrateLocations();
  return data.filter((loc) => loc.type === type);
};

export const getUniqueRegions = async (): Promise<Region[]> => {
  const data = await hydrateLocations();
  const regions = new Set(data.map((loc) => loc.region));
  return Array.from(regions).sort();
};

export const getUniqueTypes = async (): Promise<LocationType[]> => {
  const data = await hydrateLocations();
  const types = new Set(data.map((loc) => loc.type));
  return Array.from(types).sort();
};

export const searchLocations = async (query: string): Promise<MapLocation[]> => {
  await delay();
  const lowerQuery = query.toLowerCase();
  const data = await hydrateLocations();
  return data.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.description.toLowerCase().includes(lowerQuery) ||
      loc.address?.toLowerCase().includes(lowerQuery),
  );
};
