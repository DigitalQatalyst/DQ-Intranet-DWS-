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
  email?: string;
  services?: string[];
  description?: string;
  category?: string; // e.g., "Tourism & Hospitality", "Financial Services", etc.
  website?: string;
  knowledgeCenterUrl?: string; // Only for Client locations
  heroImageUrl?: string;
  heroImageAlt?: string;
};

export const DQ_LOCATIONS: LocationItem[] = [
  {
    id: 'dq-dubai-opal',
    name: 'OPAL Tower Office (DQ Dubai Office)',
    type: 'Headquarters',
    address: '7th Floor, 701–705 Burj Khalifa Blvd, Business Bay',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.2755, lat: 25.1915 },
    tags: ['office', 'hq'],
    contact: '+971 4 123 4567',
    email: 'info@digitalqatalyst.com',
    category: 'Corporate Office',
    description: 'Central hub for DQ teams coordinating strategy, delivery, and innovation programmes. The headquarters serves as the primary location for executive leadership, strategic planning, and corporate operations across the region.',
    services: ['Corporate Headquarters', 'Executive Office', 'Strategy Office', 'Transformation PMO'],
    website: 'https://digitalqatalyst.com',
    heroImageUrl: 'https://images.unsplash.com/photo-1469475988868-6c347454e42c?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Business Bay skyline at dusk',
  },
  {
    id: 'dq-nairobi-kenafric',
    name: 'DQ Nairobi Office – Kenafric Business Park',
    type: 'Regional Office',
    address: 'Kenafric Business Park, Baba Dogo Road',
    city: 'Nairobi',
    country: 'Kenya',
    coordinates: { lng: 36.8805221, lat: -1.245419 },
    tags: ['office', 'regional'],
    contact: '+254 20 000 0000',
    email: 'nairobi@digitalqatalyst.com',
    category: 'Regional Operations',
    description:
      'East Africa regional office housed at Kenafric Business Park to coordinate Nairobi delivery squads and partner engagements.',
    services: ['Regional Delivery', 'Client Success', 'Partner Enablement'],
    heroImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Nairobi skyline at sunset',
  },
  {
    id: 'dewa',
    name: 'DEWA Head Office – Customer Happiness Centre',
    type: 'Utility',
    address: 'Sheikh Rashid Road, Umm Hurair 2',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.323735663, lat: 25.226749863 },
    tags: ['utility', 'authority'],
    contact: '+971 4 324 4444',
    email: 'customerhappiness@dewa.gov.ae',
    category: 'Energy & Utilities',
    description: 'Dubai Electricity and Water Authority\'s head office, serving as the primary customer service center for utility management across Dubai. DEWA leads innovation in smart grid technology and sustainable energy solutions.',
    services: ['Customer Service', 'Utility Management', 'Smart Grid Solutions', 'Sustainability Programs'],
    website: 'https://www.dewa.gov.ae',
    heroImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Smart utility operations center',
  },
  {
    id: 'dfsa',
    name: 'DFSA – Dubai Financial Services Authority',
    type: 'Authority',
    address: 'Level 13, West Wing, The Gate, DIFC',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lng: 55.2828, lat: 25.2155 },
    tags: ['regulator', 'financial'],
    contact: '+971 4 362 1500',
    email: 'info@dfsa.ae',
    category: 'Financial Regulation',
    description: 'The Dubai Financial Services Authority is the independent regulator of financial services conducted in or from the Dubai International Financial Centre. DFSA ensures the integrity and stability of financial markets while fostering innovation and growth.',
    services: ['Financial Regulation', 'Regulatory Services', 'Policy Innovation', 'RegTech Advisory'],
    website: 'https://www.dfsa.ae',
    heroImageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Financial district glass towers',
  },
  {
    id: 'adib',
    name: 'ADIB Headquarters',
    type: 'Bank',
    address: 'Al Darmaki Building, Sheikh Rashid Bin Saeed St (Old Airport Road)',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    coordinates: { lng: 54.3751, lat: 24.4699 },
    tags: ['bank', 'client'],
    contact: '+971 2 681 9000',
    email: 'info@adib.ae',
    category: 'Financial Services',
    description: 'Abu Dhabi Islamic Bank is one of the leading Islamic banks in the UAE, providing comprehensive Sharia-compliant banking solutions. ADIB serves retail, corporate, and private banking clients with innovative digital banking platforms and personalized services.',
    services: ['Islamic Banking', 'Corporate Banking', 'Digital Banking Solutions', 'Investment Services'],
    website: 'https://www.adib.ae',
    knowledgeCenterUrl: '/knowledge-center/adib',
    heroImageUrl: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Modern Islamic banking workspace',
  },
  {
    id: 'saib',
    name: 'SAIB – Saudi Investment Bank',
    type: 'Bank',
    address: '8081 Sheikh Abdul Rahman bin Hassan St, Al-Wizarat',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    coordinates: { lng: 46.711, lat: 24.649 },
    tags: ['bank', 'client'],
    contact: '+966 11 402 9000',
    email: 'info@saib.com.sa',
    category: 'Financial Services',
    description: 'The Saudi Investment Bank is a leading financial institution in Saudi Arabia, offering comprehensive banking and investment services. SAIB focuses on digital transformation and innovative financial solutions to serve corporate and individual clients across the Kingdom.',
    services: ['Investment Banking', 'Corporate Services', 'Digital Banking', 'Trade Finance'],
    website: 'https://www.saib.com.sa',
    knowledgeCenterUrl: '/knowledge-center/saib',
    heroImageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Riyadh city skyline at night',
  },
  {
    id: 'neom',
    name: 'NEOM Company Head Office',
    type: 'Client',
    address: 'BLDG 4758 UNIT 2, NEOM Community 1, Al Khuraybah, Tabuk 49643',
    city: 'Tabuk',
    country: 'Saudi Arabia',
    coordinates: { lng: 35.1128, lat: 28.1122 },
    tags: ['client', 'program'],
    contact: '+966 9200 31000',
    email: 'info@neom.com',
    category: 'Smart City Development',
    description: 'NEOM is a $500 billion giga-project developing a sustainable, technology-driven future city in northwest Saudi Arabia. NEOM is pioneering innovations in smart city infrastructure, renewable energy, biotechnology, and advanced manufacturing to create a model for sustainable urban living.',
    services: ['Smart City Development', 'Innovation Programs', 'Sustainability Solutions', 'Technology Research'],
    website: 'https://www.neom.com',
    knowledgeCenterUrl: '/knowledge-center/neom',
    heroImageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Futuristic desert cityscape',
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
    name: 'DQ Nairobi Office – Kenafric Business Park',
    address: 'Kenafric Business Park, Baba Dogo Road, Nairobi, Kenya',
    country: 'KE',
    category: 'Regional Offices',
    lat: -1.245419,
    lng: 36.8805221,
    description: 'East Africa regional office anchoring DQ collaborations with local partners from Kenafric Business Park.',
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
