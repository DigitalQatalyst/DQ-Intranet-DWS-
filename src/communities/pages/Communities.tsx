import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthProvider";
import { MainLayout } from "../components/layout/MainLayout";
import { SearchBar } from "../components/communities/SearchBar";
import { FilterSidebar, FilterConfig } from "../components/communities/FilterSidebar";
import { CreateCommunityModal } from "../components/communities/CreateCommunityModal";
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from "../utils/safeFetch";
import { joinCommunity } from "@/communities/services/membershipService";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { PlusCircle, Filter, X, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CommunityCard } from "../components/Cards/CommunityCard";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { StickyActionButton } from "../components/Button/StickyActionButton";
import { SignInModal } from "../components/auth/SignInModal";

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  imageurl?: string;
  category?: string;
  department?: string;
  location_filter?: string;
  isprivate?: boolean;
  activitylevel?: string;
}
export default function Communities() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for communities data
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingJoinCommunityId, setPendingJoinCommunityId] = useState<string | null>(null);
  
  // Dynamic filter options from backend
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  
  // Fetch filter options from backend
  useEffect(() => {
    // Don't let filter fetching errors block the page
    fetchFilterOptions().catch(err => {
      console.error('Filter options fetch failed, but continuing:', err);
      // Set minimal filter config so page can still load
      setFilterConfig([
        {
          id: 'department',
          title: 'Department',
          options: [
            { id: 'hra-people', name: 'HRA (People)' },
            { id: 'finance', name: 'Finance' },
            { id: 'deals', name: 'Deals' },
            { id: 'stories', name: 'Stories' },
            { id: 'intelligence', name: 'Intelligence' },
            { id: 'solutions', name: 'Solutions' },
            { id: 'secdevops', name: 'SecDevOps' },
            { id: 'products', name: 'Products' },
            { id: 'delivery-deploys', name: 'Delivery — Deploys' },
            { id: 'delivery-designs', name: 'Delivery — Designs' },
            { id: 'dco-operations', name: 'DCO Operations' },
            { id: 'dbp-platform', name: 'DBP Platform' },
            { id: 'dbp-delivery', name: 'DBP Delivery' }
          ]
        },
        {
          id: 'location',
          title: 'Location',
          options: [
            { id: 'dubai', name: 'Dubai' },
            { id: 'nairobi', name: 'Nairobi' },
            { id: 'riyadh', name: 'Riyadh' }
          ]
        },
        {
          id: 'category',
          title: 'Category',
          options: [
            { id: 'dq-agile', name: 'GHC - DQ Agile' },
            { id: 'dq-culture', name: 'GHC - DQ Culture' },
            { id: 'dq-dtmf', name: 'GHC - DQ DTMF' },
            { id: 'dq-persona', name: 'GHC - DQ Persona' },
            { id: 'dq-tech', name: 'GHC - DQ Tech' },
            { id: 'dq-vision', name: 'GHC - DQ Vision' }
          ]
        }
      ]);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  const fetchFilterOptions = async () => {
    try {
      // Fetch distinct categories from backend
      const categoriesQuery = supabase
        .from('communities_with_counts')
        .select('category')
        .not('category', 'is', null);
      
      // Fetch distinct activity levels from backend
      const activityLevelsQuery = supabase
        .from('communities_with_counts')
        .select('activitylevel')
        .not('activitylevel', 'is', null);

      // Fetch distinct departments from backend
      const departmentsQuery = supabase
        .from('communities_with_counts')
        .select('department')
        .not('department', 'is', null);

      // Fetch distinct location filters from backend
      const locationsQuery = supabase
        .from('communities_with_counts')
        .select('location_filter')
        .not('location_filter', 'is', null);

      // Try to fetch from filter_options table first (dynamic approach) - parallel fetch
      let departmentOptions: Array<{ id: string; name: string }> = [];
      let locationOptions: Array<{ id: string; name: string }> = [];
      
      try {
        // Fetch both filter options in parallel
        const [deptResult, locResult] = await Promise.all([
          supabase.rpc('get_filter_options', { p_filter_type: 'department', p_filter_category: 'communities' }),
          supabase.rpc('get_filter_options', { p_filter_type: 'location', p_filter_category: 'communities' })
        ]);
        
        if (!deptResult.error && deptResult.data && deptResult.data.length > 0) {
          departmentOptions = deptResult.data.map((opt: any) => ({
            id: opt.id.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
            name: opt.id
          }));
        }
        
        if (!locResult.error && locResult.data && locResult.data.length > 0) {
          locationOptions = locResult.data
            .map((opt: any) => ({
              id: opt.id.toLowerCase().replace(/\s+/g, '-'),
              name: opt.id
            }))
            .filter((opt: any) => opt.name.toLowerCase() !== 'remote');
        }
      } catch (err) {
        console.warn('Could not fetch filter options from RPC, will use database values:', err);
      }

      const [categoriesResult, activityLevelsResult, departmentsResult, locationsResult] = await Promise.all([
        safeFetch<Array<{ category: string }>>(categoriesQuery),
        safeFetch<Array<{ activitylevel: string }>>(activityLevelsQuery),
        safeFetch<Array<{ department: string }>>(departmentsQuery),
        safeFetch<Array<{ location_filter: string }>>(locationsQuery)
      ]);

      // Extract unique values
      const uniqueCategories = Array.from(
        new Set(
          (categoriesResult[0] || []).map(c => c.category).filter(Boolean) as string[]
        )
      ).sort();

      const uniqueActivityLevels = Array.from(
        new Set(
          (activityLevelsResult[0] || []).map(a => a.activitylevel).filter(Boolean) as string[]
        )
      ).sort();

      const uniqueDepartments = Array.from(
        new Set(
          (departmentsResult[0] || []).map(d => d.department).filter(Boolean) as string[]
        )
      ).sort();

      const uniqueLocations = Array.from(
        new Set(
          (locationsResult[0] || []).map(l => l.location_filter).filter(Boolean) as string[]
        )
      ).sort();

      // Use filter_options table values if available, otherwise use database values from communities table
      if (departmentOptions.length === 0 && uniqueDepartments.length > 0) {
        departmentOptions = uniqueDepartments.map((dept) => ({
          id: dept.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
          name: dept
        }));
      }
      // If still empty, use database values from communities table
      if (departmentOptions.length === 0 && uniqueDepartments.length > 0) {
        departmentOptions = uniqueDepartments.map((dept) => ({
          id: dept.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
          name: dept
        }));
      }

      if (locationOptions.length === 0 && uniqueLocations.length > 0) {
        locationOptions = uniqueLocations
          .filter((loc) => loc.toLowerCase() !== 'remote')
          .map((loc) => ({
            id: loc.toLowerCase().replace(/\s+/g, '-'),
            name: loc
          }));
      }

      // Hardcoded fallback Department options if database fetch fails
      const fallbackDepartmentOptions = [
        { id: 'hra-people', name: 'HRA (People)' },
        { id: 'finance', name: 'Finance' },
        { id: 'deals', name: 'Deals' },
        { id: 'stories', name: 'Stories' },
        { id: 'intelligence', name: 'Intelligence' },
        { id: 'solutions', name: 'Solutions' },
        { id: 'secdevops', name: 'SecDevOps' },
        { id: 'products', name: 'Products' },
        { id: 'delivery-deploys', name: 'Delivery — Deploys' },
        { id: 'delivery-designs', name: 'Delivery — Designs' },
        { id: 'dco-operations', name: 'DCO Operations' },
        { id: 'dbp-platform', name: 'DBP Platform' },
        { id: 'dbp-delivery', name: 'DBP Delivery' }
      ];

      // Hardcoded fallback Location options if database fetch fails
      const fallbackLocationOptions = [
        { id: 'dubai', name: 'Dubai' },
        { id: 'nairobi', name: 'Nairobi' },
        { id: 'riyadh', name: 'Riyadh' }
      ];

      // Use database values if available, otherwise use fallback
      const finalDepartmentOptions = departmentOptions.length > 0 ? departmentOptions : fallbackDepartmentOptions;
      const finalLocationOptions = locationOptions.length > 0 ? locationOptions : fallbackLocationOptions;

      // Hardcoded Category options
      const categoryOptions = [
        { id: 'dq-agile', name: 'GHC - DQ Agile' },
        { id: 'dq-culture', name: 'GHC - DQ Culture' },
        { id: 'dq-dtmf', name: 'GHC - DQ DTMF' },
        { id: 'dq-persona', name: 'GHC - DQ Persona' },
        { id: 'dq-tech', name: 'GHC - DQ Tech' },
        { id: 'dq-vision', name: 'GHC - DQ Vision' }
      ];

      // Build filter configuration dynamically - Department first, then Location, then Category
      const config: FilterConfig[] = [
        {
          id: 'department',
          title: 'Department',
          options: finalDepartmentOptions
        },
        {
          id: 'location',
          title: 'Location',
          options: finalLocationOptions
        },
        {
          id: 'category',
          title: 'Category',
          options: categoryOptions
        },
        {
          id: 'memberCount',
          title: 'Member Count',
          options: [
            { id: 'small', name: '0-10 members' },
            { id: 'medium', name: '11-50 members' },
            { id: 'large', name: '51+ members' }
          ]
        },
        {
          id: 'activityLevel',
          title: 'Activity Level',
          options: uniqueActivityLevels.map((level) => ({
            id: level.toLowerCase().replace(/\s+/g, '-'),
            name: level
          }))
        }
      ];

      console.log('=== Filter Configuration Summary ===');
      console.log('Total filter categories:', config.length);
      console.log('Department options:', finalDepartmentOptions.length, finalDepartmentOptions.length > 0 ? '(from DB)' : '(using fallback)');
      console.log('Location options:', finalLocationOptions.length, finalLocationOptions.length > 0 ? '(from DB)' : '(using fallback)');
      console.log('Department source:', departmentOptions.length > 0 ? 'Database RPC' : 'Hardcoded fallback');
      console.log('Location source:', locationOptions.length > 0 ? 'Database RPC' : 'Hardcoded fallback');
      console.log('=====================================');
      setFilterConfig(config);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Fallback: Try to fetch from database one more time, then use minimal config
      try {
        const [deptFallback, locFallback] = await Promise.all([
          supabase.rpc('get_filter_options', { p_filter_type: 'department', p_filter_category: 'both' }),
          supabase.rpc('get_filter_options', { p_filter_type: 'location', p_filter_category: 'both' })
        ]);

        const fallbackDeptOptions = deptFallback.data?.map((opt: any) => ({
          id: opt.id.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
          name: opt.id // Use option_value (opt.id) for exact database value matching
        })) || [];

        const fallbackLocOptions = (locFallback.data || [])
          .map((opt: any) => ({
            id: opt.id.toLowerCase().replace(/\s+/g, '-'),
            name: opt.id // Use option_value (opt.id) for exact database value matching
          }))
          .filter((opt: any) => opt.name.toLowerCase() !== 'remote');

        // Hardcoded fallback options
        const hardcodedDeptOptions = [
          { id: 'hra-people', name: 'HRA (People)' },
          { id: 'finance', name: 'Finance' },
          { id: 'deals', name: 'Deals' },
          { id: 'stories', name: 'Stories' },
          { id: 'intelligence', name: 'Intelligence' },
          { id: 'solutions', name: 'Solutions' },
          { id: 'secdevops', name: 'SecDevOps' },
          { id: 'products', name: 'Products' },
          { id: 'delivery-deploys', name: 'Delivery — Deploys' },
          { id: 'delivery-designs', name: 'Delivery — Designs' },
          { id: 'dco-operations', name: 'DCO Operations' },
          { id: 'dbp-platform', name: 'DBP Platform' },
          { id: 'dbp-delivery', name: 'DBP Delivery' }
        ];

        const hardcodedLocOptions = [
          { id: 'dubai', name: 'Dubai' },
          { id: 'nairobi', name: 'Nairobi' },
          { id: 'riyadh', name: 'Riyadh' }
        ];

        const hardcodedCategoryOptions = [
          { id: 'dq-agile', name: 'GHC - DQ Agile' },
          { id: 'dq-culture', name: 'GHC - DQ Culture' },
          { id: 'dq-dtmf', name: 'GHC - DQ DTMF' },
          { id: 'dq-persona', name: 'GHC - DQ Persona' },
          { id: 'dq-tech', name: 'GHC - DQ Tech' },
          { id: 'dq-vision', name: 'GHC - DQ Vision' }
        ];

        setFilterConfig([
          {
            id: 'department',
            title: 'Department',
            options: fallbackDeptOptions.length > 0 ? fallbackDeptOptions : hardcodedDeptOptions
          },
          {
            id: 'location',
            title: 'Location',
            options: fallbackLocOptions.length > 0 ? fallbackLocOptions : hardcodedLocOptions
          },
          {
            id: 'category',
            title: 'Category',
            options: hardcodedCategoryOptions
          },
          {
            id: 'memberCount',
            title: 'Member Count',
            options: [
              { id: 'small', name: '0-10 members' },
              { id: 'medium', name: '11-50 members' },
              { id: 'large', name: '51+ members' }
            ]
          }
        ]);
      } catch (fallbackErr) {
        console.error('Error in fallback filter fetch:', fallbackErr);
        // Last resort: use hardcoded options
        const hardcodedDeptOptions = [
          { id: 'hra-people', name: 'HRA (People)' },
          { id: 'finance', name: 'Finance' },
          { id: 'deals', name: 'Deals' },
          { id: 'stories', name: 'Stories' },
          { id: 'intelligence', name: 'Intelligence' },
          { id: 'solutions', name: 'Solutions' },
          { id: 'secdevops', name: 'SecDevOps' },
          { id: 'products', name: 'Products' },
          { id: 'delivery-deploys', name: 'Delivery — Deploys' },
          { id: 'delivery-designs', name: 'Delivery — Designs' },
          { id: 'dco-operations', name: 'DCO Operations' },
          { id: 'dbp-platform', name: 'DBP Platform' },
          { id: 'dbp-delivery', name: 'DBP Delivery' }
        ];

        const hardcodedLocOptions = [
          { id: 'dubai', name: 'Dubai' },
          { id: 'nairobi', name: 'Nairobi' },
          { id: 'riyadh', name: 'Riyadh' }
        ];

        const hardcodedCategoryOptions = [
          { id: 'dq-agile', name: 'GHC - DQ Agile' },
          { id: 'dq-culture', name: 'GHC - DQ Culture' },
          { id: 'dq-dtmf', name: 'GHC - DQ DTMF' },
          { id: 'dq-persona', name: 'GHC - DQ Persona' },
          { id: 'dq-tech', name: 'GHC - DQ Tech' },
          { id: 'dq-vision', name: 'GHC - DQ Vision' }
        ];

        setFilterConfig([
          {
            id: 'department',
            title: 'Department',
            options: hardcodedDeptOptions
          },
          {
            id: 'location',
            title: 'Location',
            options: hardcodedLocOptions
          },
          {
            id: 'category',
            title: 'Category',
            options: hardcodedCategoryOptions
          },
          {
            id: 'memberCount',
            title: 'Member Count',
            options: [
              { id: 'small', name: '0-10 members' },
              { id: 'medium', name: '11-50 members' },
              { id: 'large', name: '51+ members' }
            ]
          }
        ]);
      }
    }
  };

  // Fetch communities with filters from backend
  useEffect(() => {
    fetchCommunities();
  }, [searchQuery, filters, user]);

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching communities with filters:', { searchQuery, filters });
      console.log('User authenticated:', !!user);
      
      // If department or location filters are applied, query base table directly
      // since communities_with_counts view may not include these columns
      const hasDepartmentOrLocationFilter = !!(filters.department || filters.location);
      
      // Try communities_with_counts view first (unless we need department/location filters)
      let query = hasDepartmentOrLocationFilter 
        ? supabase.from('communities').select('*, memberships(count)')
        : supabase.from('communities_with_counts').select('*');

      // Apply search filter (backend) - search in name or description
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        // Use PostgREST OR syntax: field.operator.value,field.operator.value
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply member count filter (backend)
      if (filters.memberCount) {
        if (filters.memberCount === '0-10 members') {
          query = query.lt('member_count', 11);
        } else if (filters.memberCount === '11-50 members') {
          query = query.gte('member_count', 11).lte('member_count', 50);
        } else if (filters.memberCount === '51+ members') {
          query = query.gt('member_count', 50);
        }
      }

      // Apply activity level filter (backend) - case-insensitive match
      if (filters.activityLevel) {
        // Use ilike for case-insensitive matching (matches any case variant)
        query = query.ilike('activitylevel', filters.activityLevel);
      }

      // Apply category filter (backend) - exact match
      // Note: Category is separate from Department and Location filters
      if (filters.category) {
        query = (query as any).eq('category', filters.category);
      }

      // Apply department filter (backend) - use department field, NOT category
      // Ensure we're filtering by the actual department column, not category
      if (filters.department) {
        // Use the exact department value from the filter
        query = (query as any).eq('department', filters.department);
      }

      // Apply location filter (backend) - use location_filter field, NOT category
      // Ensure we're filtering by the actual location_filter column, not category
      if (filters.location) {
        // Use the exact location_filter value from the filter
        query = (query as any).eq('location_filter', filters.location);
      }

      // Order by member count (descending)
      if (hasDepartmentOrLocationFilter) {
        // For base table query, we'll sort client-side after getting member counts
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('member_count', { ascending: false });
      }

      // Execute query with timeout protection
      console.log('Executing query...');
      const startTime = Date.now();
      
      // Create timeout promise
      const timeoutPromise = new Promise<[null, any]>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );
      
      // Race between query and timeout
      let [data, error] = await Promise.race([
        safeFetch<Community[]>(query).then(result => {
          console.log(`Query completed in ${Date.now() - startTime}ms`);
          return result;
        }),
        timeoutPromise
      ]) as [Community[] | null, any];
      
      if (error && error.message === 'Request timeout after 10 seconds') {
        console.error('Query timed out - check network connection and RLS policies');
        setError(new Error('Request timed out. The server may be slow or RLS policies may be blocking access.'));
        setFilteredCommunities([]);
        setLoading(false);
        return;
      }
      
      console.log('Query result:', { hasData: !!data, dataLength: data?.length || 0, hasError: !!error });
      
      // If querying base table (for department/location filters), transform data
      if (hasDepartmentOrLocationFilter && data && !error) {
        const transformedData = data.map((community: any) => ({
          ...community,
          member_count: Array.isArray(community.memberships) 
            ? community.memberships[0]?.count || 0 
            : (typeof community.member_count === 'number' ? community.member_count : 0),
          activitylevel: community.activitylevel || null
        }));

        // Apply member count filter client-side if needed
        let filteredData = transformedData;
        if (filters.memberCount) {
          filteredData = transformedData.filter(community => {
            const count = community.member_count || 0;
            if (filters.memberCount === '0-10 members') return count < 11;
            if (filters.memberCount === '11-50 members') return count >= 11 && count <= 50;
            if (filters.memberCount === '51+ members') return count > 50;
            return true;
          });
        }

        // Sort by member count
        filteredData.sort((a, b) => (b.member_count || 0) - (a.member_count || 0));

        console.log('Successfully fetched communities from base table with department/location filters:', filteredData.length);
        setFilteredCommunities(filteredData as Community[]);
        setLoading(false);
        return;
      }
      
      // If permission denied or view doesn't exist, fallback to base communities table
      if (error && (error.message?.includes('permission denied') || error.message?.includes('does not exist'))) {
        console.warn('View not accessible, falling back to base communities table:', error.message);
        
        // Fallback: Query base communities table with member count
        query = supabase
          .from('communities')
          .select(`
            *,
            memberships(count)
          `);

        // Apply search filter
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.trim();
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Apply activity level filter
        if (filters.activityLevel) {
          query = query.ilike('activitylevel', filters.activityLevel);
        }

        // Apply category filter
        // Note: Category is separate from Department and Location filters
        if (filters.category) {
          query = (query as any).eq('category', filters.category);
        }

        // Apply department filter - use department field, NOT category
        // Ensure we're filtering by the actual department column, not category
        if (filters.department) {
          // Use the exact department value from the filter
          query = (query as any).eq('department', filters.department);
        }

        // Apply location filter - use location_filter field, NOT category
        // Ensure we're filtering by the actual location_filter column, not category
        if (filters.location) {
          // Use the exact location_filter value from the filter
          query = (query as any).eq('location_filter', filters.location);
        }

        // Fetch data with timeout
        const fallbackStartTime = Date.now();
        const fallbackTimeoutPromise = new Promise<[null, any]>((_, reject) => 
          setTimeout(() => reject(new Error('Fallback request timeout after 10 seconds')), 10000)
        );
        
        [data, error] = await Promise.race([
          safeFetch<any[]>(query).then(result => {
            console.log(`Fallback query completed in ${Date.now() - fallbackStartTime}ms`);
            return result;
          }),
          fallbackTimeoutPromise
        ]) as [any[] | null, any];
        
        if (error && error.message === 'Fallback request timeout after 10 seconds') {
          console.error('Fallback query also timed out');
          setError(new Error('Request timed out. Please check RLS policies and network connection.'));
          setFilteredCommunities([]);
          setLoading(false);
          return;
        }
        
        // Transform data to match expected format
        if (data && !error) {
          const transformedData = data.map((community: any) => ({
            ...community,
            member_count: Array.isArray(community.memberships) 
              ? community.memberships[0]?.count || 0 
              : (typeof community.member_count === 'number' ? community.member_count : 0)
          }));

          // Apply member count filter client-side if needed
          let filteredData = transformedData;
          if (filters.memberCount) {
            filteredData = transformedData.filter(community => {
              const count = community.member_count || 0;
              if (filters.memberCount === '0-10 members') return count < 11;
              if (filters.memberCount === '11-50 members') return count >= 11 && count <= 50;
              if (filters.memberCount === '51+ members') return count > 50;
              return true;
            });
          }

          // Sort by member count
          filteredData.sort((a, b) => (b.member_count || 0) - (a.member_count || 0));

          console.log('Successfully fetched communities from base table:', filteredData.length);
          setFilteredCommunities(filteredData as Community[]);
          return;
        }
      }
      
      if (error) {
        console.error('Error fetching communities:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setError(new Error(`Failed to load communities: ${error.message || 'Unknown error'}`));
        setFilteredCommunities([]);
      } else if (data) {
        console.log('Successfully fetched communities:', data.length);
        setFilteredCommunities(data);
      } else {
        console.warn('No data returned from communities query');
        setFilteredCommunities([]);
      }
    } catch (err) {
      console.error('Exception fetching communities:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Exception details:', err);
      setError(new Error(`Failed to load communities: ${errorMessage}`));
      setFilteredCommunities([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserMemberships = async () => {
    if (!user) return;
    const query = supabase
      .from('memberships')
      .select('community_id');
    const finalQuery = (query as any).eq('user_id', user.id);
    const [data, error] = await safeFetch<Array<{ community_id: string }>>(finalQuery);
    if (!error && data) {
      setUserMemberships(new Set(data.map(m => m.community_id)));
    }
  };
  const handleCommunityCreated = () => {
    // Refetch communities to show the new community
    fetchCommunities();
    if (user) {
      fetchUserMemberships();
    }
  };
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);
  const handleViewCommunity = useCallback((communityId: string) => {
    navigate(`/community/${communityId}`);
  }, [navigate]);
  const handleJoinCommunity = useCallback(async (communityId: string) => {
    console.log('🔵 handleJoinCommunity called', { communityId, hasUser: !!user });
    
    // Check if user is authenticated
    if (!user) {
      console.warn('⚠️ User not authenticated, showing sign in modal');
      toast.error('Please sign in to join communities');
      setPendingJoinCommunityId(communityId);
      setShowSignInModal(true);
      return;
    }
    
    try {
      // Use centralized membership service (optimized - single table operation)
      const success = await joinCommunity(communityId, user, {
        refreshData: async () => {
          // Update local membership state
          setUserMemberships(prev => new Set(prev).add(communityId));
        },
        onSuccess: () => {
          console.log('✅ Successfully joined community');
          toast.success('Successfully joined community!');
          // Membership state is already updated via refreshData callback
        },
        onError: (error) => {
          console.error('❌ Error joining community:', error);
          toast.error('Failed to join community. Please try again.');
        },
      });
      
      console.log('🔵 Join result:', success);
    } catch (error) {
      console.error('❌ Exception in handleJoinCommunity:', error);
      toast.error('Failed to join community. Please try again.');
    }
  }, [user, navigate]);
  
  // Retry joining after successful sign-in
  const handleSignInSuccess = useCallback(async () => {
    setShowSignInModal(false);
    if (pendingJoinCommunityId) {
      const communityId = pendingJoinCommunityId;
      setPendingJoinCommunityId(null);
      
      // Wait for user state to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get user directly from session instead of relying on auth context
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        toast.error('Unable to verify authentication. Please try again.');
        return;
      }
      
      // Join directly using the session user
      try {
        const success = await joinCommunity(communityId, { id: userId } as any, {
          refreshData: async () => {
            // Update local membership state
            setUserMemberships(prev => new Set(prev).add(communityId));
          },
          onSuccess: () => {
            console.log('✅ Successfully joined community');
            toast.success('Successfully joined community!');
          },
          onError: (error) => {
            console.error('❌ Error joining community:', error);
            toast.error('Failed to join community. Please try again.');
          },
        });
        
        console.log('🔵 Join result:', success);
      } catch (error) {
        console.error('❌ Exception joining community:', error);
        toast.error('Failed to join community. Please try again.');
      }
    }
  }, [pendingJoinCommunityId]);
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--gradient-subtle)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>;
  }

  // Unified layout for both logged in and logged out users
  // Using hidePageLayout to avoid white container wrapper
  return <MainLayout 
      title="DQ Work Communities" 
      subtitle="Find and join communities to connect with other associates within the organization."
      fullWidth={false}
      hidePageLayout={true}>
      <div className="max-w-7xl mx-auto pl-0 pr-1 sm:pl-0 sm:pr-2 lg:pl-0 lg:pr-3 pt-2 pb-6">
        {/* Breadcrumbs - Dynamic based on active tab */}
        {(() => {
          // Determine active tab based on pathname
          const isPulseTab = location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/');
          const isEventsTab = location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/');
          const isDiscussionsTab = location.pathname === '/communities' || location.pathname.startsWith('/community/');
          
          // Determine current page label
          let currentPageLabel = 'Discussions';
          if (isPulseTab) {
            currentPageLabel = 'Pulse';
          } else if (isEventsTab) {
            currentPageLabel = 'Events';
          }
          
          return (
            <nav className="flex mb-4 min-h-[24px]" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link 
                    to="/" 
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                    aria-label="Navigate to Home"
                  >
                    <HomeIcon size={16} className="mr-1" aria-hidden="true" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                    <Link 
                      to="/communities" 
                      className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors"
                      aria-label="Navigate to DQ Work Communities"
                    >
                      DQ Work Communities
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center min-w-[80px]">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">{currentPageLabel}</span>
                  </div>
                </li>
              </ol>
            </nav>
          );
        })()}

        {/* Page Header - Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            DQ Work Communities
          </h1>
          <p className="text-gray-600 mb-6">
            Find and join communities to connect with other associates within the organization.
          </p>
          
          {/* Current Focus Section */}
          {(() => {
            const isPulseTab = location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/');
            const isEventsTab = location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/');
            const isDiscussionsTab = location.pathname === '/communities' || location.pathname.startsWith('/community/');

            let focusTitle = 'Discussion';
            let focusText = 'Engage in thoughtful conversations, share ideas, and discuss topics that matter most to DQ. Collaborate with colleagues across the company to drive innovation and foster a vibrant, connected community.';

            if (isPulseTab) {
              focusTitle = 'Pulse';
              focusText = 'Share your thoughts and feedback through surveys, polls, and quick feedback sessions. Pulse is your platform for participating in organizational insights and shaping the future of DQ through direct engagement.';
            } else if (isEventsTab) {
              focusTitle = 'Events';
              focusText = 'Stay up to date with upcoming events, workshops, and team gatherings. Explore activities within DQ that encourage collaboration, growth, and innovation.';
            }

            return (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 min-h-[140px]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs uppercase text-gray-500 font-medium mb-2">CURRENT FOCUS</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{focusTitle}</h2>
                    <p className="text-gray-700 leading-relaxed mb-2">{focusText}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0">
                    Tab overview
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Navigation Tabs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => {
                  // Discussion tab - stays on current page (Communities Marketplace)
                  navigate('/communities');
                }}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  location.pathname === '/communities' || location.pathname.startsWith('/community/')
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Discussion
              </button>
              <button
                onClick={() => {
                  // Pulse tab - routes to Pulse Marketplace
                  navigate('/marketplace/pulse');
                }}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  location.pathname === '/marketplace/pulse' || location.pathname.startsWith('/marketplace/pulse/')
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Pulse
              </button>
              <button
                onClick={() => {
                  // Events tab - routes to Events Marketplace
                  navigate('/marketplace/events');
                }}
                className={`py-4 px-4 text-sm transition-colors border-b ${
                  location.pathname === '/marketplace/events' || location.pathname.startsWith('/marketplace/events/')
                    ? 'border-blue-600 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 font-normal'
                }`}
              >
                Events
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar - Separate component, no container */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 w-full">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search communities by name or description..." />
            </div>
            <div className="flex items-center gap-4">
              {/* Filter Button - Mobile/Tablet */}
              <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
                <SheetTrigger asChild>
                  <Button className="lg:hidden bg-brand-blue hover:bg-brand-darkBlue text-white flex items-center gap-2 transition-all duration-200 ease-in-out">
                    <Filter size={18} />
                    <span className="hidden sm:inline">Filters</span>
                    {Object.keys(filters).length > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-brand-blue font-medium">
                        {Object.keys(filters).length}
                      </span>}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] bg-white">
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      {Object.keys(filters).length > 0 && <Button variant="ghost" size="sm" onClick={resetFilters} className="text-brand-blue text-sm font-medium hover:text-brand-darkBlue">
                          Reset All
                        </Button>}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <FilterSidebar filters={filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />
                    </div>
                    <div className="pt-4 border-t mt-auto">
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setFilterDrawerOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setFilterDrawerOpen(false)} className="bg-brand-blue hover:bg-brand-darkBlue text-white transition-all duration-200 ease-in-out">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              {/* Create Community button */}
              {user && <Button onClick={() => setCreateModalOpen(true)} className="bg-brand-blue hover:bg-brand-darkBlue text-white gap-2 transition-all duration-200 ease-in-out">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Community</span>
                  <span className="sm:hidden">Create</span>
                </Button>}
            </div>
          </div>
        </div>

        {/* Active filters display - Mobile */}
        {Object.keys(filters).length > 0 && <div className="lg:hidden mb-6 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => value && <div key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm">
                  <span>{value}</span>
                  <button onClick={() => handleFilterChange(key, value)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>)}
            {Object.keys(filters).length > 0 && <button onClick={resetFilters} className="text-sm text-brand-blue hover:text-brand-darkBlue font-medium transition-colors duration-150 ease-in-out">
                Clear All
              </button>}
          </div>}

        {/* Desktop Layout with Sidebar - Separate components */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filters Sidebar - Desktop - Separate component with white background */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit sticky top-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                {Object.keys(filters).length > 0 && <Button variant="ghost" size="sm" onClick={resetFilters} className="text-brand-blue text-sm font-medium hover:text-brand-darkBlue">
                    Reset All
                  </Button>}
              </div>
              <FilterSidebar filters={filters} filterConfig={filterConfig} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />
            </div>
          </div>

          {/* Main Content Area - Desktop - Community Cards Grid */}
          <div>
            {/* Active filters display - Desktop */}
            {Object.keys(filters).length > 0 && <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => value && <div key={key} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm">
                      <span>{value}</span>
                      <button onClick={() => handleFilterChange(key, value)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>)}
                {Object.keys(filters).length > 0 && <button onClick={resetFilters} className="text-sm text-brand-blue hover:text-brand-darkBlue font-medium transition-colors duration-150 ease-in-out">
                    Clear All
                  </button>}
              </div>}

            {/* Communities Grid - Separate component */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="flex justify-between mt-auto pt-4">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
                {error.message}
                <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                  Retry
                </Button>
              </div>
            ) : searchQuery.trim() && filteredCommunities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No communities match your search for "{searchQuery}"
                </p>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-lg font-medium">No communities yet</p>
                <p className="text-muted-foreground">
                  {user ? 'Be the first to create a community!' : 'Sign in to create and join communities!'}
                </p>
                {user && <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="Create Your First Community" />}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredCommunities.map(community => {
                    const count = community.member_count || 0;
                    // Use activitylevel from database, or calculate based on member count as fallback
                    let activityLevel: 'low' | 'medium' | 'high' = 'low';
                    if (community.activitylevel) {
                      const dbLevel = community.activitylevel.toLowerCase();
                      if (dbLevel === 'high') activityLevel = 'high';
                      else if (dbLevel === 'medium') activityLevel = 'medium';
                      else if (dbLevel === 'low') activityLevel = 'low';
                    } else {
                      // Fallback: calculate based on member count
                      if (count > 50) activityLevel = 'high';
                      else if (count > 10) activityLevel = 'medium';
                    }
                    
                    const activeMembers = Math.floor(count * (0.6 + Math.random() * 0.3));
                    const category = community.category || 'General';
                    const tags = [category, activityLevel === 'high' ? 'Popular' : 'Growing'];
                    return (
                      <CommunityCard
                        key={community.id}
                        item={{
                          id: community.id,
                          name: community.name || 'Unnamed Community',
                          description: community.description || 'No description available',
                          memberCount: community.member_count || 0,
                          activeMembers: activeMembers,
                          category: category,
                          tags: tags,
                          imageUrl: community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                          isPrivate: community.isprivate || false,
                          activityLevel: activityLevel,
                          recentActivity: `New discussion started in ${community.name}`
                        }}
                        isMember={userMemberships.has(community.id)}
                        onJoin={() => {
                          console.log('🔵 Communities page: onJoin called for community', community.id);
                          handleJoinCommunity(community.id);
                        }}
                        onViewDetails={() => handleViewCommunity(community.id)}
                      />
                    );
                  })}
                </div>
                {filteredCommunities.length > 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-6">
                    Showing {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
                    {Object.keys(filters).length > 0 || searchQuery.trim() ? ' (filtered)' : ''}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Communities Grid - Separate from desktop layout */}
        <div className="lg:hidden">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between mt-auto pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-md">
              {error.message}
              <Button variant="secondary" size="sm" onClick={fetchCommunities} className="ml-4">
                Retry
              </Button>
            </div>
          ) : searchQuery.trim() && filteredCommunities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No communities match your search for "{searchQuery}"
              </p>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-lg font-medium">No communities yet</p>
              <p className="text-muted-foreground">
                {user ? 'Be the first to create a community!' : 'Sign in to create and join communities!'}
              </p>
              {user && <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="Create Your First Community" />}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {filteredCommunities.map(community => {
                  const count = community.member_count || 0;
                  // Use activitylevel from database, or calculate based on member count as fallback
                  let activityLevel: 'low' | 'medium' | 'high' = 'low';
                  if (community.activitylevel) {
                    const dbLevel = community.activitylevel.toLowerCase();
                    if (dbLevel === 'high') activityLevel = 'high';
                    else if (dbLevel === 'medium') activityLevel = 'medium';
                    else if (dbLevel === 'low') activityLevel = 'low';
                  } else {
                    // Fallback: calculate based on member count
                    if (count > 50) activityLevel = 'high';
                    else if (count > 10) activityLevel = 'medium';
                  }
                  
                  const activeMembers = Math.floor(count * (0.6 + Math.random() * 0.3));
                  const category = community.category || 'General';
                  const tags = [category, activityLevel === 'high' ? 'Popular' : 'Growing'];
                  return (
                    <CommunityCard
                      key={community.id}
                      item={{
                        id: community.id,
                        name: community.name || 'Unnamed Community',
                        description: community.description || 'No description available',
                        memberCount: community.member_count || 0,
                        activeMembers: activeMembers,
                        category: category,
                        tags: tags,
                        imageUrl: community.imageurl || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                        isPrivate: community.isprivate || false,
                        activityLevel: activityLevel,
                        recentActivity: `New discussion started in ${community.name}`
                      }}
                      isMember={userMemberships.has(community.id)}
                      onJoin={() => {
                        console.log('🔵 Communities page: onJoin called for community', community.id);
                        handleJoinCommunity(community.id);
                      }}
                      onViewDetails={() => handleViewCommunity(community.id)}
                    />
                  );
                })}
              </div>
              {filteredCommunities.length > 0 && (
                <p className="text-sm text-muted-foreground text-center mt-6">
                  Showing {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
                  {Object.keys(filters).length > 0 || searchQuery.trim() ? ' (filtered)' : ''}
                </p>
              )}
            </>
          )}
        </div>

        {/* Sign In Modal */}
        <SignInModal
          open={showSignInModal}
          onOpenChange={setShowSignInModal}
          title="Sign In to Join Community"
          description="Please sign in to join this community and start participating."
          onSuccess={handleSignInSuccess}
        />

        {/* Floating Create Button (mobile) - Only for logged-in users */}
        {user && <div className="sm:hidden">
            <StickyActionButton onClick={() => setCreateModalOpen(true)} buttonText="" />
          </div>}

        <CreateCommunityModal open={createModalOpen} onOpenChange={setCreateModalOpen} onCommunityCreated={handleCommunityCreated} />
      </div>
    </MainLayout>;
}

