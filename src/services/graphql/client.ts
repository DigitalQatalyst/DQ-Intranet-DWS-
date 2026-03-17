// Remove dependency on graphql-request and implement a simple mock client
// import { GraphQLClient } from 'graphql-request'
import { mockCourses } from "../../utils/mockData";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";

// Create a simple mock GraphQL client since we don't have access to graphql-request
const mockGraphQLClient = {
  request: async (query: string, variables: any = {}) => {
    console.log("Mock GraphQL request:", {
      query,
      variables,
    });
    // Return mock data based on the query
    return getMockResponse(query, variables);
  },
};

// Expose as graphqlClient for backward compatibility
export const graphqlClient = mockGraphQLClient;

// Helper function to handle marketplace mock data queries
const handleMarketplaceMockData = (queryName: string, variables: any, mockData: any) => {
  if (queryName.includes("getItems") || queryName.includes("Items")) {
    return { items: mockData.items };
  }

  if (queryName.includes("getItemDetails") && variables.id) {
    const item = mockData.items.find((item: any) => item.id === variables.id);
    return { item };
  }

  if (queryName.includes("getRelatedItems")) {
    const relatedItems = mockData.items
      .filter((item: any) =>
        item.id !== variables.id &&
        (item.category === variables.category ||
          item.provider.name === variables.provider)
      )
      .slice(0, 3);
    return { relatedItems };
  }

  if (queryName.includes("getFilterOptions")) {
    return { filterOptions: mockData.filterOptions };
  }

  if (queryName.includes("getProviders")) {
    return { providers: mockData.providers };
  }

  return null;
};

// Helper function to get marketplace config data
const getMarketplaceConfigData = (marketplaceType: string) => {
  try {
    const config = getMarketplaceConfig(marketplaceType);
    return config.mockData || null;
  } catch (error) {
    console.error(`Error getting mock data for ${marketplaceType}:`, error);
    return null;
  }
};

// Helper function to handle legacy course queries
const handleLegacyCourseQueries = (queryName: string, variables: any) => {
  if (queryName.includes("getCourseDetails") && variables.id) {
    const course = mockCourses.find((c) => c.id === variables.id);
    return { course };
  }

  if (queryName.includes("getRelatedCourses")) {
    const filteredCourses = mockCourses
      .filter((c) =>
        c.id !== variables.id &&
        (c.category === variables.category ||
          c.provider.name === variables.provider)
      )
      .slice(0, 3);
    return { relatedCourses: filteredCourses };
  }

  return null;
};

// Fallback function for when API calls fail or during development
export const getMockResponse = (
  queryName: string,
  variables: any,
  marketplaceType?: string
) => {
  // Handle marketplace-specific mock data
  if (marketplaceType) {
    const mockData = getMarketplaceConfigData(marketplaceType);
    if (mockData) {
      const result = handleMarketplaceMockData(queryName, variables, mockData);
      if (result) return result;
    }
  }

  // Handle legacy course queries
  const legacyResult = handleLegacyCourseQueries(queryName, variables);
  if (legacyResult) return legacyResult;

  // Default fallback
  return { items: mockCourses };
};

// Enhanced request function with error handling and mock fallback
export const request = async <T>(
  query: string,
  variables: any = {},
  queryName: string = "unknown",
  marketplaceType?: string
): Promise<T> => {
  try {
    // Use getMockResponse directly with the marketplace type
    const data = getMockResponse(queryName, variables, marketplaceType);
    return data as T;
  } catch (error) {
    console.error(`GraphQL request error for ${queryName}:`, error);
    // Use mock data as fallback
    return getMockResponse(queryName, variables, marketplaceType) as T;
  }
};
