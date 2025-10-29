import type { MapLocation, Region, LocationType } from '../types/map';

// Mock data for DQ offices and client HQs
const mockMapLocations: MapLocation[] = [
  // ========================================
  // DQ OFFICES
  // ========================================
  {
    id: 'dq-dubai-hq',
    name: 'DQ Office — OPAL Tower',
    position: [25.187780, 55.271940], // Business Bay, Dubai
    description: 'DQ Digital Workspace Headquarters in the heart of Dubai Business Bay.',
    address: 'OPAL Tower, Business Bay, Dubai, UAE',
    contactPhone: '+971 4 XXX XXXX',
    type: 'Headquarters',
    region: 'Dubai',
    services: ['Consulting', 'Development', 'Strategy', 'Training'],
    operatingHours: 'Sun-Thu: 9:00 AM - 6:00 PM',
  },
  {
    id: 'dq-nairobi-office',
    name: 'NBO – Nairobi, Kenya',
    position: [-1.285590, 36.819940], // Nairobi, Kenya
    description: 'DQ Regional Office serving East Africa markets.',
    address: 'Nairobi, Kenya',
    contactPhone: '+254 XXX XXX XXX',
    type: 'Regional Office',
    region: 'Nairobi',
    services: ['Development', 'Support', 'Training'],
    operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
  },
  {
    id: 'dq-riyadh-office',
    name: 'DQ Office — Riyadh',
    position: [24.689600, 46.686300], // Riyadh, Saudi Arabia
    description: 'DQ Regional Office serving Kingdom of Saudi Arabia.',
    address: 'King Fahd Road, Riyadh, Saudi Arabia',
    contactPhone: '+966 XXX XXX XXX',
    type: 'Regional Office',
    region: 'Riyadh',
    services: ['Consulting', 'Development', 'Integration'],
    operatingHours: 'Sun-Thu: 8:00 AM - 5:00 PM',
  },

  // ========================================
  // CLIENTS
  // ========================================
  {
    id: 'khalifa-fund',
    name: 'Khalifa Fund (KF) HQ',
    position: [24.466667, 54.366669], // Abu Dhabi
    description: 'Supporting UAE entrepreneurship and SME development.',
    address: 'Abu Dhabi, UAE',
    type: 'Client',
    region: 'Abu Dhabi',
    services: ['Digital Banking', 'Enterprise Solutions'],
  },
  {
    id: 'neom-hq',
    name: 'NEOM HQ',
    position: [27.632000, 35.300000], // NEOM Bay, KSA
    description: 'Future-focused digital banking solutions.',
    address: 'NEOM Bay, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Core Banking', 'Digital Channels'],
  },
  {
    id: 'saib',
    name: 'SAIB (Saudi Investment Bank) HQ',
    position: [24.689000, 46.685000], // Riyadh
    description: 'Leading investment bank in Saudi Arabia.',
    address: 'King Fahd Road, Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Investment Banking', 'Wealth Management'],
  },
  {
    id: 'stc-hq',
    name: 'STC HQ',
    position: [24.722600, 46.642300], // Riyadh
    description: 'Digital-first banking powered by STC.',
    address: 'Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Mobile Banking', 'Digital Wallet'],
  },
  {
    id: 'adib',
    name: 'ADIB HQ',
    position: [24.495800, 54.370500], // Abu Dhabi
    description: 'Leading Islamic bank in the UAE.',
    address: 'Sheikh Rashid Bin Saeed Street, Abu Dhabi, UAE',
    type: 'Client',
    region: 'Abu Dhabi',
    services: ['Islamic Banking', 'Retail Banking'],
  },

  // ========================================
  // AUTHORITIES
  // ========================================
  {
    id: 'dfsa',
    name: 'DFSA (DIFC)',
    position: [25.209400, 55.272100], // DIFC, Dubai
    description: 'Dubai Financial Services Authority regulating DIFC.',
    address: 'The Gate, DIFC, Dubai, UAE',
    type: 'Authority',
    region: 'Dubai',
    services: ['Regulatory', 'Compliance'],
    operatingHours: 'Sun-Thu: 8:00 AM - 4:00 PM',
  },
  {
    id: 'dewa',
    name: 'DEWA HQ',
    position: [25.216500, 55.260700], // Dubai
    description: 'Dubai Electricity and Water Authority.',
    address: 'Al Hudaiba, Dubai, UAE',
    type: 'Authority',
    region: 'Dubai',
    services: ['Utilities', 'Smart City'],
    operatingHours: 'Sun-Thu: 7:30 AM - 2:30 PM',
  },
];

/**
 * Fetch all locations
 */
export const fetchAllLocations = async (): Promise<MapLocation[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockMapLocations;
};

/**
 * Fetch locations by region
 */
export const fetchLocationsByRegion = async (region: Region): Promise<MapLocation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockMapLocations.filter((loc) => loc.region === region);
};

/**
 * Fetch locations by type
 */
export const fetchLocationsByType = async (type: LocationType): Promise<MapLocation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockMapLocations.filter((loc) => loc.type === type);
};

/**
 * Get unique regions from dataset
 */
export const getUniqueRegions = (): Region[] => {
  const regions = new Set(mockMapLocations.map((loc) => loc.region));
  return Array.from(regions).sort();
};

/**
 * Get unique location types from dataset
 */
export const getUniqueTypes = (): LocationType[] => {
  const types = new Set(mockMapLocations.map((loc) => loc.type));
  return Array.from(types).sort();
};

/**
 * Search locations by query
 */
export const searchLocations = async (query: string): Promise<MapLocation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const lowerQuery = query.toLowerCase();
  return mockMapLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.description.toLowerCase().includes(lowerQuery) ||
      loc.address?.toLowerCase().includes(lowerQuery)
  );
};

