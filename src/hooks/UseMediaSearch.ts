export * from './UseMediaSearch'

import { useState, useEffect, useCallback } from 'react'
import { getFallbackKnowledgeHubItems } from '../utils/fallbackData'
import { mapApiItemToCardProps } from '../utils/mediaMappers'
export interface MediaSearchParams {
  q?: string
  filters?: string[]
  pageSize?: number
  cursor?: string
}
export interface MediaSearchResult {
  items: unknown[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  nextCursor: string | null
  loadMore: () => void
  refetch: () => void
}
/**
 * Hook for searching and paginating through media items
 */
export function useMediaSearch({
  q = '',
  filters = [],
  pageSize = 10,
  cursor = null,
}: MediaSearchParams = {}): MediaSearchResult {
  const [items, setItems] = useState<unknown[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(cursor)
  const [currentPage, setCurrentPage] = useState(1)
  // Simulated API call with pagination, search, and filtering
  const fetchItems = useCallback(
    async (reset = false) => {
      try {
        // Start loading
        setIsLoading(true)
        setError(null)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Get all items from fallback data
        const allItems = getFallbackKnowledgeHubItems()
        // Apply search filter if query exists
        let filteredItems = allItems
        if (q) {
          const searchQuery = q.toLowerCase()
          filteredItems = filteredItems.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery) ||
              item.description.toLowerCase().includes(searchQuery) ||
              (item.provider?.name &&
                item.provider.name.toLowerCase().includes(searchQuery)) ||
              (item.tags &&
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(searchQuery),
                )),
          )
        }
        // Apply tag/type filters
        if (filters && filters.length > 0) {
          filteredItems = filteredItems.filter((item) => {
            const itemTags = [...(item.tags || []), item.mediaType]
            return filters.some((filter) => itemTags.includes(filter))
          })
        }
        // Calculate pagination
        const totalItems = filteredItems.length
        const startIndex = reset ? 0 : (currentPage - 1) * pageSize
        const endIndex = reset ? pageSize : currentPage * pageSize
        const paginatedItems = filteredItems.slice(startIndex, endIndex)
        // Check if there are more items
        const moreItems = endIndex < totalItems
        // Generate a cursor (in a real API, this would come from the backend)
        const cursor = moreItems ? `page_${currentPage + 1}` : null
        // Update state
        if (reset) {
          setItems(paginatedItems.map(mapApiItemToCardProps))
        } else {
          setItems((prev) => [
            ...prev,
            ...paginatedItems.map(mapApiItemToCardProps),
          ])
        }
        setHasMore(moreItems)
        setNextCursor(cursor)
        setIsLoading(false)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('An error occurred while fetching data'),
        )
        setIsLoading(false)
      }
    },
    [q, filters, pageSize, currentPage],
  )
  // Initial fetch
  useEffect(() => {
    setCurrentPage(1)
    fetchItems(true)
  }, [q, filters, pageSize])
  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [isLoading, hasMore])
  // Load more when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchItems(false)
    }
  }, [currentPage])
  // Refetch function
  const refetch = useCallback(() => {
    setCurrentPage(1)
    fetchItems(true)
  }, [fetchItems])
  return {
    items,
    isLoading,
    error,
    hasMore,
    nextCursor,
    loadMore,
    refetch,
  }
}
