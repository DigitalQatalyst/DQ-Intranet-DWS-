import type { MapLocation, Region, LocationType } from '../types/map';

// Mock data for DQ offices and client HQs
const mockMapLocations: MapLocation[] = [
  // ========================================
  // DQ OFFICES
  // ========================================
  {
    id: 'dq-dubai-hq',
    name: 'DQ Office — OPAL Tower',
    position: [25.1888, 55.2620], // Business Bay, Dubai
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
    name: 'DQ Office — Nairobi',
    position: [-1.2864, 36.8172], // Nairobi, Kenya
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
    position: [24.7136, 46.6753], // Riyadh, Saudi Arabia
    description: 'DQ Regional Office serving Kingdom of Saudi Arabia.',
    address: 'Riyadh, Saudi Arabia',
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
    name: 'Khalifa Fund',
    position: [24.4539, 54.3773], // Abu Dhabi
    description: 'Supporting UAE entrepreneurship and SME development.',
    address: 'Abu Dhabi, UAE',
    type: 'Client',
    region: 'Abu Dhabi',
    services: ['Digital Banking', 'Enterprise Solutions'],
  },
  {
    id: 'neom-bank',
    name: 'NEOM Bank',
    position: [24.7136, 46.6753], // Riyadh
    description: 'Future-focused digital banking solutions.',
    address: 'Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Core Banking', 'Digital Channels'],
  },
  {
    id: 'saib',
    name: 'SAIB (The Saudi Investment Bank)',
    position: [24.7241, 46.6383], // Riyadh
    description: 'Leading investment bank in Saudi Arabia.',
    address: 'King Fahd Road, Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Investment Banking', 'Wealth Management'],
  },
  {
    id: 'stc-bank',
    name: 'stc bank',
    position: [24.7483, 46.6544], // Riyadh
    description: 'Digital-first banking powered by stc.',
    address: 'Riyadh, Saudi Arabia',
    type: 'Client',
    region: 'Riyadh',
    services: ['Mobile Banking', 'Digital Wallet'],
  },
  {
    id: 'adib',
    name: 'ADIB (Abu Dhabi Islamic Bank)',
    position: [24.4945, 54.3898], // Abu Dhabi
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
    name: 'DFSA — The Gate, DIFC',
    position: [25.2125, 55.2786], // DIFC, Dubai
    description: 'Dubai Financial Services Authority regulating DIFC.',
    address: 'The Gate, DIFC, Dubai, UAE',
    type: 'Authority',
    region: 'Dubai',
    services: ['Regulatory', 'Compliance'],
    operatingHours: 'Sun-Thu: 8:00 AM - 4:00 PM',
  },
  {
    id: 'dewa',
    name: 'DEWA — Head Office',
    position: [25.2289, 55.2916], // Dubai
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

