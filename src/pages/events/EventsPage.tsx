import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from "lucide-react";
import { CourseCardSkeleton } from "../../components/SkeletonLoader";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import EventsFilters, {
  EventsFacets,
} from "../../components/events/EventsFilters";
import EventsGrid from "../../components/events/EventsGrid";
import { supabaseClient } from "../../lib/supabaseClient";

// Interface for Supabase event data from upcoming_events view (if it exists)
interface UpcomingEventView {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  image_url: string | null;
  meeting_link: string | null;
  is_virtual: boolean;
  is_all_day: boolean;
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  organizer_id: string;
  organizer_name: string | null;
  organizer_email: string | null;
  status: string;
  is_featured: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

// Interface for Supabase events table (actual database schema)
interface EventsTableRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // DATE format: YYYY-MM-DD
  event_time: string | null; // TIME format: HH:MM:SS
  community_id: string | null;
  created_by: string | null;
  created_at: string;
}

// Interface for events stored in posts table
interface PostEventRow {
  id: string;
  title: string;
  content: string | null;
  description?: string | null;
  event_date: string | null; // TIMESTAMPTZ format
  event_location: string | null;
  post_type: string;
  community_id: string | null;
  created_by: string | null;
  created_at: string;
  tags?: string[] | null;
}

// Union type for all event sources
type SupabaseEvent = UpcomingEventView | EventsTableRow | PostEventRow;

// Interface for transformed event data (compatible with EventCard)
interface TransformedEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: string;
  location: string;
}

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();

  // Items & filters state
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [facets, setFacets] = useState<EventsFacets>({});
  const [queryParams, setQueryParams] = useState(
    () =>
      new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      )
  );

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if event is from upcoming_events view (has start_time property)
  const isUpcomingEventView = (event: SupabaseEvent): event is UpcomingEventView => {
    return 'start_time' in event && 'end_time' in event;
  };

  // Check if event is from posts table (has post_type property)
  const isPostEvent = (event: SupabaseEvent): event is PostEventRow => {
    return 'post_type' in event && event.post_type === 'event';
  };

  // Transform Supabase event to display format
  const transformEvent = (event: SupabaseEvent): TransformedEvent => {
    let startDate: Date;
    let endDate: Date;
    let category: string;
    let location: string;
    let description: string;

    if (isUpcomingEventView(event)) {
      // Event from upcoming_events view
      startDate = new Date(event.start_time);
      endDate = new Date(event.end_time);
      category = event.category || "General";
      location = event.location || "TBA";
      description = event.description || "";
    } else if (isPostEvent(event)) {
      // Event from posts table
      if (event.event_date) {
        startDate = new Date(event.event_date);
      } else {
        // Fallback to created_at if no event_date
        startDate = new Date(event.created_at);
      }
      // Default end time to 1 hour after start
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      category = event.community_id ? "Community" : "General";
      location = event.event_location || "TBA";
      description = event.content || event.description || "";
    } else {
      // Event from events table - combine event_date and event_time
      const eventDate = (event as EventsTableRow).event_date; // YYYY-MM-DD format
      const eventTime = (event as EventsTableRow).event_time || "00:00:00"; // HH:MM:SS format
      
      // Combine date and time into a datetime string
      const dateTimeString = `${eventDate}T${eventTime}`;
      startDate = new Date(dateTimeString);
      
      // Default end time to 1 hour after start if no end time is provided
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      
      // Derive category from community or use default
      category = event.community_id ? "Community" : "General";
      
      // Location not available in events table, use default
      location = "TBA";
      description = event.description || "";
    }

    return {
      id: event.id,
      title: event.title,
      description,
      start: startDate,
      end: endDate,
      category,
      location,
    };
  };

  // Load events data from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        let data: SupabaseEvent[] | null = null;
        let error: any = null;

        // Strategy 1: Try to fetch from upcoming_events view first (if it exists)
        try {
          const viewQuery = await supabaseClient
            .from("upcoming_events")
            .select("*")
            .order("start_time", { ascending: true });

          if (!viewQuery.error && viewQuery.data && viewQuery.data.length > 0) {
            // View exists and returned data
            data = viewQuery.data;
            console.log("Fetched events from upcoming_events view");
          } else {
            throw new Error("View not available or empty");
          }
        } catch (viewError) {
          // View doesn't exist or error, try events table
          console.log("upcoming_events view not available, trying events table...");
          
          // Strategy 2: Try events table
          try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const tableQuery = await supabaseClient
              .from("events")
              .select("*")
              .gte("event_date", today) // Only get events from today onwards
              .order("event_date", { ascending: true })
              .order("event_time", { ascending: true });

            if (!tableQuery.error && tableQuery.data) {
              data = tableQuery.data;
              console.log("Fetched events from events table");
            } else {
              throw tableQuery.error || new Error("Events table query failed");
            }
          } catch (tableError) {
            // Events table doesn't exist or has errors, try posts table
            console.log("events table not available, trying posts table with event type...");
            error = tableError;

            // Strategy 3: Fetch from posts table where post_type = 'event'
            // Query with status filter to work with RLS policy
            try {
              const now = new Date().toISOString();
              // Try a simple query first without joins to avoid RLS issues
              const postsQuery = await supabaseClient
                .from("posts")
                .select("id, title, content, event_date, event_location, post_type, community_id, created_by, created_at, tags, status")
                .eq("post_type", "event")
                .eq("status", "active") // Required for RLS policy
                .not("event_date", "is", null)
                .gte("event_date", now) // Only get future events
                .order("event_date", { ascending: true });

              if (!postsQuery.error && postsQuery.data) {
                // Transform posts to match our event interface
                data = postsQuery.data.map((post: any) => ({
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  description: post.content,
                  event_date: post.event_date,
                  event_location: post.event_location,
                  post_type: post.post_type,
                  community_id: post.community_id,
                  created_by: post.created_by,
                  created_at: post.created_at,
                  tags: post.tags,
                })) as PostEventRow[];
                error = null;
                console.log("Fetched events from posts table");
              } else {
                // If posts query fails due to permissions, log it but don't throw
                // This allows the code to continue and show empty state gracefully
                console.warn("Could not fetch events from posts table:", postsQuery.error?.message || "Unknown error");
                throw postsQuery.error || new Error("Posts table query failed");
              }
            } catch (postsError: any) {
              // Check if it's a permission error (42501) or other error
              if (postsError?.code === '42501') {
                console.warn("Permission denied accessing posts table. Events from posts may not be available.");
                // Don't set error if it's just a permission issue - allow empty state
                error = null;
                data = null;
              } else {
                error = postsError;
                console.error("Error fetching events from posts table:", postsError);
              }
            }
          }
        }

        // Handle errors gracefully
        if (error && (!data || data.length === 0)) {
          // Check if it's a permission error
          if (error?.code === '42501') {
            console.warn("Permission denied: Events may require authentication or proper RLS policies.");
          } else {
            console.error("Error fetching events:", error);
          }
          // Set empty state - user will see "No events found" message
          setItems([]);
          setFilteredItems([]);
          setFacets({
            category: [],
            month: [],
            location: [],
          });
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          console.log("No events found in Supabase");
          setItems([]);
          setFilteredItems([]);
          setFacets({
            category: [],
            month: [],
            location: [],
          });
          setLoading(false);
          return;
        }

        // Transform Supabase data to match EventCard interface
        const eventsData = data.map(transformEvent);

        // Apply filters based on query params
        let filtered = [...eventsData];

        // Filter by search query
        const searchQuery = queryParams.get("q") || "";
        if (searchQuery) {
          filtered = filtered.filter(
            (event) =>
              event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              event.location.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Filter by category
        const categories = (queryParams.get("category") || "")
          .split(",")
          .filter(Boolean);
        if (categories.length > 0) {
          filtered = filtered.filter((event) =>
            categories.includes(event.category)
          );
        }

        // Filter by month
        const months = (queryParams.get("month") || "")
          .split(",")
          .filter(Boolean);
        if (months.length > 0) {
          filtered = filtered.filter((event) => {
            const eventMonth = new Date(event.start).toLocaleString("en-US", {
              month: "long",
            });
            return months.includes(eventMonth);
          });
        }

        // Filter by location type
        const locationTypes = (queryParams.get("location") || "")
          .split(",")
          .filter(Boolean);
        if (locationTypes.length > 0) {
          filtered = filtered.filter((event) => {
            const location = event.location.toLowerCase();
            return locationTypes.some((type) => {
              if (type === "virtual")
                return (
                  location.includes("zoom") ||
                  location.includes("teams") ||
                  location.includes("virtual")
                );
              if (type === "hybrid") return location.includes("+");
              if (type === "in-person")
                return (
                  !location.includes("zoom") &&
                  !location.includes("teams") &&
                  !location.includes("virtual") &&
                  !location.includes("+")
                );
              return false;
            });
          });
        }

        // Sort by date
        const sort = queryParams.get("sort") || "date";
        if (sort === "date") {
          filtered.sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          );
        } else if (sort === "title") {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        setItems(eventsData);
        setFilteredItems(filtered);

        // Compute facets from all events (not just filtered)
        const categoryMap = new Map<string, number>();
        const monthMap = new Map<string, number>();
        const locationMap = new Map<string, number>();

        eventsData.forEach((event) => {
          // Category facets
          if (event.category) {
            categoryMap.set(
              event.category,
              (categoryMap.get(event.category) || 0) + 1
            );
          }

          // Month facets
          const month = new Date(event.start).toLocaleString("en-US", {
            month: "long",
          });
          monthMap.set(month, (monthMap.get(month) || 0) + 1);

          // Location type facets
          const location = event.location.toLowerCase();
          if (
            location.includes("zoom") ||
            location.includes("teams") ||
            location.includes("virtual")
          ) {
            locationMap.set("virtual", (locationMap.get("virtual") || 0) + 1);
          }
          if (location.includes("+")) {
            locationMap.set("hybrid", (locationMap.get("hybrid") || 0) + 1);
          }
          if (
            !location.includes("zoom") &&
            !location.includes("teams") &&
            !location.includes("virtual") &&
            !location.includes("+")
          ) {
            locationMap.set(
              "in-person",
              (locationMap.get("in-person") || 0) + 1
            );
          }
        });

        setFacets({
          category: Array.from(categoryMap.entries())
            .map(([id, count]) => ({ id, name: id, count }))
            .sort((a, b) => a.name.localeCompare(b.name)),
          month: Array.from(monthMap.entries()).map(([id, count]) => ({
            id,
            name: id,
            count,
          })),
          location: Array.from(locationMap.entries())
            .map(([id, count]) => ({
              id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              count,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        });

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchEvents:", err);
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [queryParams]);

  // UI helpers
  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);

  const handleEventClick = (event: any) => {
    // Navigate to event detail page (to be implemented)
    console.log("Event clicked:", event);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Events</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          DQ Events & Calendar
        </h1>
        <p className="text-gray-600 mb-6">
          Discover upcoming events, training sessions, client meetings, and
          product launches
        </p>

        {/* Search + Sort */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              searchQuery={queryParams.get("q") || ""}
              setSearchQuery={(q: string) => {
                const next = new URLSearchParams(queryParams.toString());
                if (q) next.set("q", q);
                else next.delete("q");
                const qs = next.toString();
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}${qs ? "?" + qs : ""}`
                );
                setQueryParams(new URLSearchParams(next.toString()));
              }}
            />
          </div>
          <select
            className="border rounded px-2 py-2"
            aria-label="Sort events"
            value={queryParams.get("sort") || "date"}
            onChange={(e) => {
              const next = new URLSearchParams(queryParams.toString());
              next.set("sort", e.target.value);
              const qs = next.toString();
              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${qs ? "?" + qs : ""}`
              );
              setQueryParams(new URLSearchParams(next.toString()));
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <EventsFilters
                    facets={facets}
                    query={queryParams}
                    onChange={(next) => {
                      const qs = next.toString();
                      window.history.replaceState(
                        null,
                        "",
                        `${window.location.pathname}${qs ? "?" + qs : ""}`
                      );
                      setQueryParams(new URLSearchParams(next.toString()));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            <EventsFilters
              facets={facets}
              query={queryParams}
              onChange={(next) => {
                const qs = next.toString();
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}${qs ? "?" + qs : ""}`
                );
                setQueryParams(new URLSearchParams(next.toString()));
              }}
            />
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => (
                  <CourseCardSkeleton key={idx} />
                ))}
              </div>
            ) : (
              <EventsGrid
                items={filteredItems}
                onClickEvent={() => {}} // No longer needed as modal is handled in EventCard
              />
            )}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default EventsPage;
