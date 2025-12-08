import { request } from "./graphql/client";
import { MARKETPLACE_QUERIES } from "./graphql/queries";
import { FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceItem } from "../components/marketplace/MarketplaceGrid";
import { getMarketplaceConfig } from "../utils/marketplaceConfig";
import { supabaseClient } from "../lib/supabaseClient";

/**
 * Fetches marketplace items based on marketplace type, filters, and search query
 */
export const fetchMarketplaceItems = async (
  marketplaceType: string,
  filters: Record<string, string>,
  searchQuery?: string
): Promise<any[]> => {
  try {
    // Get the marketplace config to access query and mapping functions
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItems;
    if (!query) {
      throw new Error(
        `No query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Prepare variables for the query
    const variables: Record<string, string | undefined> = {
      search: searchQuery || undefined,
    };
    // Add filter variables
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        variables[key] = value;
      }
    });
    // Execute the query
    const data = (await request(
      query,
      variables,
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.items) {
      return config.mapListResponse(data.items);
    }
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} items:`, error);
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
  try {
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getFilterOptions;
    if (!query) {
      // Fall back to config-defined filters if no query is available
      return config.filterCategories;
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }FilterOptions`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapFilterResponse && data.filterOptions) {
      return config.mapFilterResponse(data.filterOptions);
    }
    // Fall back to config-defined filters if mapping fails
    return config.filterCategories;
  } catch (error) {
    console.error(
      `Error fetching filter options for ${marketplaceType}:`,
      error
    );
    // Fall back to config-defined filters on error
    const config = getMarketplaceConfig(marketplaceType);
    return config.filterCategories;
  }
};

/**
 * Transforms events_v2 data to marketplace event detail format
 */
const transformEventDetail = (event: any): any => {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  
  // Format date
  const dateStr = startDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format time range (start - end)
  const timeStr = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Format end time
  const endTimeStr = endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Combine start and end time for display with timezone
  const timeRangeStr = `${timeStr} - ${endTimeStr} (UTC +3)`;
  
  // Calculate duration
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  let durationStr = '';
  if (durationHours > 0) {
    durationStr = `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    if (durationMinutes > 0) {
      durationStr += ` ${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
    }
  } else {
    durationStr = `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
  }
  
  // Provider information
  const provider = {
    name: event.organizer_name || "DQ Events",
    logoUrl: "/DWS-Logo.png",
    description: event.organizer_name ? `${event.organizer_name} - Digital Qatalyst Events` : "Digital Qatalyst Events"
  };
  
  // Create details array from description or tags
  const details: string[] = [];
  if (event.description) {
    // Split description into sentences for details
    const sentences = event.description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    details.push(...sentences.slice(0, 5).map(s => s.trim()));
  }
  
  return {
    id: event.id,
    title: event.title,
    description: event.description || "",
    category: event.category || "General",
    eventType: event.category || "General",
    businessStage: "All Stages",
    provider: provider,
    date: dateStr,
    time: timeRangeStr, // Use time range instead of just start time
    location: event.location || "TBA",
    location_filter: event.location_filter || event.location || "TBA",
    capacity: event.max_attendees ? `${event.max_attendees} attendees` : undefined,
    details: details.length > 0 ? details : undefined,
    tags: event.tags || [],
    imageUrl: event.image_url || undefined,
    department: event.department || undefined,
    // Event-specific fields
    registrationRequired: event.registration_required || false,
    registrationDeadline: event.registration_deadline || null,
    meetingLink: event.meeting_link || null,
    isVirtual: event.is_virtual || false,
    isAllDay: event.is_all_day || false,
    organizerEmail: event.organizer_email || null,
    organizerName: event.organizer_name || null,
    organizerId: event.organizer_id || null,
    startTime: event.start_time,
    endTime: event.end_time || endTimeStr,
    duration: durationStr,
    status: event.status || "published",
    isFeatured: event.is_featured || false,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  };
};

/**
 * Fetches details for a specific marketplace item
 */
export const fetchMarketplaceItemDetails = async (
  marketplaceType: string,
  itemId: string
): Promise<any> => {
  try {
    // Handle events separately - fetch from Supabase events_v2 table
    if (marketplaceType === 'events') {
      const { data, error } = await supabaseClient
        .from('events_v2')
        .select('*')
        .eq('id', itemId)
        .eq('status', 'published')
        .single();
      
      if (error) {
        console.error('Error fetching event details from events_v2:', error);
        throw new Error(`Failed to load event details: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Event not found');
      }
      
      // Transform the event data to marketplace format
      return transformEventDetail(data);
    }
    
    // For other marketplace types, use GraphQL queries
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItemDetails;
    if (!query) {
      throw new Error(
        `No detail query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
      },
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }ItemDetails`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
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
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getRelatedItems;
    if (!query) {
      throw new Error(
        `No related items query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
        category,
        provider,
      },
      `getRelated${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
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
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getProviders;
    if (!query) {
      throw new Error(
        `No providers query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Providers`,
      marketplaceType
    )) as any;
    return data.providers || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} providers:`, error);
    throw new Error(`Failed to load providers. Please try again later.`);
  }
};
