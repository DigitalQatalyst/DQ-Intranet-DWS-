/**
 * Marketplace Types
 *
 * This module defines TypeScript interfaces for marketplace-related data structures.
 */
/**
 * Represents a service provider
 */
export interface Provider {
  id?: string;
  name: string;
  logoUrl: string;
  description: string;
}
/**
 * Represents a service item (course, financial service, etc.)
 */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  deliveryMode?: string;
  serviceType?: string;
  eligibility?: string;
  businessStage?: string;
  provider: Provider;
  details?: string[];
  startDate?: string;
  price?: string;
  amount?: string;
  interestRate?: string;
  location?: string;
  tags?: string[];
  [key: string]: any; // For dynamic properties
}
/**
 * Filter configuration for different marketplace types
 */
export interface FilterConfig {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
  }[];
}
/**
 * Filter options for the marketplace
 */
export interface FilterOptions {
  filterConfigs: FilterConfig[];
  providers: Provider[];
}
/**
 * Marketplace filters applied by the user
 */
export interface MarketplaceFilters {
  [key: string]: string;
}