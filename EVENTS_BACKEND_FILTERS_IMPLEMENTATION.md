# Events Marketplace Backend Filters Implementation

## Overview
Updated the events marketplace to apply filters at the backend (Supabase query level) instead of filtering all data client-side. This improves performance and reduces data transfer.

## Changes Made

### 1. Backend Filter Application ✅

Filters are now applied directly in the Supabase query before fetching data:

#### Event Type Filter
- **Filter Category**: `event-type`
- **Database Column**: `category`
- **Mapping**: 
  - Webinar, Workshop, Seminar → `Training`
  - Panel, Networking, Competition → `Internal`
  - Conference, Pitch Day → `Launches`
- **Query**: `.in('category', categoryValues)`

#### Delivery Mode Filter
- **Filter Category**: `delivery-mode`
- **Database Column**: `is_virtual`
- **Single Selection**: Applied backend (`.eq('is_virtual', true/false)`)
- **Multiple Selections/Hybrid**: Applied client-side (OR logic)

#### Time Range Filter
- **Filter Category**: `time-range`
- **Database Column**: `start_time`
- **Options**:
  - `Today`: Events on current day
  - `This Week`: Events within next 7 days
  - `Next 30 Days`: Events within next 30 days
- **Query**: `.gte('start_time', startDate).lt('start_time', endDate)`

#### Duration Band Filter
- **Filter Category**: `duration-band`
- **Status**: Client-side only (requires duration calculation from `start_time` and `end_time`)
- **Reason**: Complex to calculate in Supabase query

### 2. Client-Side Filtering (Remaining)

The following filters are still applied client-side:
- **Search Query**: Searches across title, description, category, location, tags
- **Multiple Delivery Modes**: When multiple delivery modes are selected (OR logic)
- **Hybrid Events**: Requires checking both `is_virtual` and location indicators
- **Duration Band**: Requires calculating duration from start/end times

### 3. Transformation Updates

Updated `MarketplaceEvent` interface to include:
- `isVirtual?: boolean` - For delivery mode filtering
- `startTime?: string` - For duration calculation
- `endTime?: string` - For duration calculation

### 4. Query Re-execution

Added `activeFilters` and `filterConfig` to the useEffect dependencies to ensure queries re-run when filters change.

## Filter Mapping

### Event Type → Category
```typescript
const categoryMap: Record<string, string> = {
  'Webinar': 'Training',
  'Workshop': 'Training',
  'Seminar': 'Training',
  'Panel': 'Internal',
  'Conference': 'Launches',
  'Networking': 'Internal',
  'Competition': 'Internal',
  'Pitch Day': 'Launches'
};
```

### Delivery Mode → is_virtual
- `Online` → `is_virtual = true`
- `Onsite` → `is_virtual = false`
- `Hybrid` → Client-side (checks both virtual and physical indicators)

## Performance Benefits

1. **Reduced Data Transfer**: Only filtered events are fetched from database
2. **Faster Queries**: Database indexes can be used for filtering
3. **Better Scalability**: Works efficiently even with thousands of events
4. **Improved UX**: Faster response times when filters are applied

## Code Structure

### Backend Filter Application
```typescript
// In the events fetch useEffect
if (activeFilters.length > 0 && filterConfig.length > 0) {
  // Group filters by category
  const filtersByCategory = {};
  
  // Apply event-type filter
  if (filtersByCategory['event-type']) {
    eventsQuery = eventsQuery.in('category', categoryValues);
  }
  
  // Apply delivery-mode filter (single selection)
  if (filtersByCategory['delivery-mode']?.length === 1) {
    eventsQuery = eventsQuery.eq('is_virtual', true/false);
  }
  
  // Apply time-range filter
  if (filtersByCategory['time-range']) {
    eventsQuery = eventsQuery.gte('start_time', start).lt('start_time', end);
  }
}
```

### Client-Side Filter Application
```typescript
// In the filter useEffect
// Apply search query
if (searchQuery.trim()) {
  filtered = filtered.filter(item => /* search logic */);
}

// Apply complex OR conditions
if (multipleDeliveryModes || hybrid) {
  filtered = filtered.filter(item => /* OR logic */);
}
```

## Testing Checklist

- [x] Event type filter applies backend filter
- [x] Single delivery mode filter applies backend filter
- [x] Multiple delivery modes apply client-side OR logic
- [x] Time range filters apply backend date range
- [x] Search query applies client-side search
- [x] Filters re-execute query when changed
- [x] No duplicate filtering (backend + client-side)

## Notes

1. **Category Mapping**: Event type filters map to database categories. If new event types are added, update the `categoryMap`.

2. **Hybrid Events**: Hybrid events require checking both `is_virtual` flag and location string for virtual/physical indicators. This is done client-side.

3. **Duration Filtering**: Duration band filtering requires calculating duration from `start_time` and `end_time`. This is complex to do in Supabase, so it's handled client-side.

4. **Performance**: Backend filtering significantly improves performance, especially as the number of events grows.

## Future Enhancements

1. **Duration Filter Backend**: Could add a computed column or function to calculate duration in Supabase
2. **Custom Date Range**: Add UI for custom date range selection
3. **Filter Persistence**: Save filter selections in URL params or localStorage
4. **Filter Analytics**: Track which filters are most commonly used





