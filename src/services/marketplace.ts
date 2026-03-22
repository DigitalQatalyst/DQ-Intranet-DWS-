import { request } from "./graphql/client";
import { MARKETPLACE_QUERIES } from "./graphql/queries";
import { FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceItem } from "../components/marketplace/MarketplaceGrid";
import { getMarketplaceConfig } from "../utils/marketplaceConfig";

function getMarketplaceQuery(type: string, key: string) {
  return MARKETPLACE_QUERIES[type as keyof typeof MARKETPLACE_QUERIES]?.[key as keyof (typeof MARKETPLACE_QUERIES)[keyof typeof MARKETPLACE_QUERIES]] ?? null;
}

function marketplaceOpName(type: string, prefix: string, suffix = '') {
  return `${prefix}${type.charAt(0).toUpperCase()}${type.slice(1)}${suffix}`;
}

/**
 * Fetches marketplace items based on marketplace type, filters, and search query
 */
export const fetchMarketplaceItems = async (
  marketplaceType: string,
  filters: Record<string, string>,
  searchQuery?: string
): Promise<any[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const query = getMarketplaceQuery(marketplaceType, 'getItems');
    if (!query) {
      throw new Error(`No query defined for marketplace type: ${marketplaceType}`);
    }
    const variables: Record<string, string | undefined> = { search: searchQuery || undefined };
    Object.entries(filters).forEach(([key, value]) => { if (value) variables[key] = value; });
    const data = (await request(
      query,
      variables,
      marketplaceOpName(marketplaceType, 'get', 'Items'),
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.items) {
      return config.mapListResponse(data.items);
    }
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} items:`, error);
    
    // Fall back to mock data for specific marketplace types
    if (marketplaceType === 'non-financial') {
      try {
        const { mockNonFinancialServices } = await import('../utils/mockMarketplaceData');
        console.log(`Using mock data for ${marketplaceType}`);
        return mockNonFinancialServices;
      } catch (mockError) {
        console.error(`Error loading mock data for ${marketplaceType}:`, mockError);
      }
    }
    
    // Fall back to mock data for guides/knowledge-hub
    if (marketplaceType === 'guides' || marketplaceType === 'knowledge-hub') {
      try {
        const { mockKnowledgeHubItems } = await import('../utils/mockMarketplaceData');
        console.log(`Using mock data for ${marketplaceType}`);
        return mockKnowledgeHubItems;
      } catch (mockError) {
        console.error(`Error loading mock data for ${marketplaceType}:`, mockError);
      }
    }
    
    throw new Error(
      `Failed to load ${marketplaceType} items. Please try again later.`
    );
  }
};

/**
 * Fetches filter configurations for a specific marketplace type
 */
export const fetchMarketplaceFilters = async (
  marketplaceType: string
): Promise<FilterConfig[]> => {
  const config = getMarketplaceConfig(marketplaceType);
  const query = getMarketplaceQuery(marketplaceType, 'getFilterOptions');
  if (!query) return config.filterCategories;
  try {
    const data = (await request(
      query,
      {},
      marketplaceOpName(marketplaceType, 'get', 'FilterOptions'),
      marketplaceType
    )) as any;
    if (config.mapFilterResponse && data.filterOptions) {
      return config.mapFilterResponse(data.filterOptions);
    }
    return config.filterCategories;
  } catch (error) {
    console.error(`Error fetching filter options for ${marketplaceType}:`, error);
    return config.filterCategories;
  }
};

/**
 * Fetches details for a specific marketplace item
 */
export const fetchMarketplaceItemDetails = async (
  marketplaceType: string,
  itemId: string
): Promise<any> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const query = getMarketplaceQuery(marketplaceType, 'getItemDetails');
    if (!query) {
      throw new Error(`No detail query defined for marketplace type: ${marketplaceType}`);
    }
    const data = (await request(
      query,
      { id: itemId },
      marketplaceOpName(marketplaceType, 'get', 'ItemDetails'),
      marketplaceType
    )) as any;
    if (config.mapDetailResponse && data.item) {
      return config.mapDetailResponse(data.item);
    }
    return data.item;
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} item details:`, error);
    throw new Error(`Failed to load item details. Please try again later.`);
  }
};

/**
 * Fetches related items for a specific marketplace item
 */
export const fetchRelatedMarketplaceItems = async (
  marketplaceType: string,
  itemId: string,
  category: string,
  provider: string
): Promise<any[]> => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    const query = getMarketplaceQuery(marketplaceType, 'getRelatedItems');
    if (!query) {
      throw new Error(`No related items query defined for marketplace type: ${marketplaceType}`);
    }
    const data = (await request(
      query,
      { id: itemId, category, provider },
      marketplaceOpName(marketplaceType, 'getRelated', 'Items'),
      marketplaceType
    )) as any;
    if (config.mapListResponse && data.relatedItems) {
      return config.mapListResponse(data.relatedItems);
    }
    return data.relatedItems || [];
  } catch (error) {
    console.error(`Error fetching related ${marketplaceType} items:`, error);
    throw new Error(`Failed to load related items. Please try again later.`);
  }
};

/**
 * Fetches providers for a specific marketplace type
 */
export const fetchMarketplaceProviders = async (
  marketplaceType: string
): Promise<any[]> => {
  try {
    const query = getMarketplaceQuery(marketplaceType, 'getProviders');
    if (!query) {
      throw new Error(`No providers query defined for marketplace type: ${marketplaceType}`);
    }
    const data = (await request(
      query,
      {},
      marketplaceOpName(marketplaceType, 'get', 'Providers'),
      marketplaceType
    )) as any;
    return data.providers || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} providers:`, error);
    throw new Error(`Failed to load providers. Please try again later.`);
  }
};

/**
 * Fetches latest guides from Knowledge Hub Supabase
 */
export const fetchLatestGuides = async (filters?: { guide_type?: string; domain?: string; limit?: number }): Promise<any[]> => {
  try {
    const { knowledgeHubSupabase } = await import('./knowledgeHubClient');
    
    if (!knowledgeHubSupabase) {
      console.warn('Knowledge Hub Supabase client not initialized, returning empty array');
      return [];
    }

    let query = knowledgeHubSupabase
      .from('guides')
      .select('id, slug, title, summary, hero_image_url, last_updated_at, author_name, guide_type, domain, status')
      .eq('status', 'Approved')
      .neq('slug', 'atp-guidelines')
      .neq('slug', 'agile-working-guidelines')
      .neq('slug', 'client-session-guidelines')
      .neq('slug', 'dbp-support-guidelines')
      .neq('slug', 'dq-products');

    // Apply filters if provided
    if (filters?.guide_type) {
      query = query.ilike('guide_type', `%${filters.guide_type}%`);
    }
    
    if (filters?.domain) {
      query = query.ilike('domain', `%${filters.domain}%`);
    }

    // Order and limit
    query = query
      .order('last_updated_at', { ascending: false, nullsLast: true })
      .limit(filters?.limit || 6);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching guides from Knowledge Hub:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchLatestGuides:', error);
    return [];
  }
};
