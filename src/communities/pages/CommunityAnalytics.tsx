import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Header } from '@/communities/components/layout/Header';
import { AnalyticsKpiCards } from '@/communities/components/analytics/AnalyticsKpiCards';
import { CommunityGrowthChart } from '@/communities/components/analytics/CommunityGrowthChart';
import { ActivityBreakdownChart } from '@/communities/components/analytics/ActivityBreakdownChart';
import { TopContributorsCard } from '@/communities/components/analytics/TopContributorsCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { Button } from '@/communities/components/ui/button';
import { AlertCircle, BarChart3, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsAPI } from '@/services/AnalyticsAPI';
import { usePermissions } from '@/communities/hooks/usePermissions';
interface Community {
  id: string;
  name: string;
}
interface AnalyticsData {
  totalMembers: number;
  activePosts: number;
  commentsPosted: number;
  engagementRate: number;
}
export default function CommunityAnalytics() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    canModerate,
    loading: permissionsLoading
  } = usePermissions();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(() => {
    return localStorage.getItem('analytics.lastCommunityId') || 'all';
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // Check permissions
  useEffect(() => {
    if (permissionsLoading) return;
    if (!user) {
      navigate('/');
      return;
    }
    if (!canModerate) {
      toast.error('Access denied: Analytics is only available to moderators and admins');
      navigate('/communities/feed');
      return;
    }
    fetchOwnerCommunities();
  }, [user, canModerate, permissionsLoading, navigate]);

  // Fetch analytics when filters change
  useEffect(() => {
    if (communities.length > 0) {
      fetchAnalytics();
    }
  }, [selectedCommunity, communities, refreshKey]);

  // Persist selected community
  useEffect(() => {
    localStorage.setItem('analytics.lastCommunityId', selectedCommunity);
  }, [selectedCommunity]);

  // Real-time updates
  useEffect(() => {
    if (communities.length === 0) return;
    const communityIds = selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity];
    const unsubscribe = AnalyticsAPI.subscribe(communityIds, () => {
      console.log('Analytics data updated, refreshing...');
      fetchAnalytics();
    });
    return unsubscribe;
  }, [communities, selectedCommunity]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (communities.length > 0) {
        console.log('Auto-refreshing analytics...');
        fetchAnalytics();
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [communities]);
  const fetchOwnerCommunities = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch communities where user is owner
      const ownedQuery = supabase.from('communities').select('id, name').eq('created_by', user.id);

      // Fetch communities where user is admin
      const roleQuery = supabase.from('community_roles').select(`
          communities!community_roles_community_id_fkey (
            id,
            name
          )
        `).eq('user_id', user.id).eq('role', 'admin');
      const [ownedData, roleData] = await Promise.all([safeFetch(ownedQuery), safeFetch(roleQuery)]);
      const allCommunities: Community[] = [];
      if (ownedData[0]) {
        allCommunities.push(...(ownedData[0] as Community[]));
      }
      if (roleData[0]) {
        roleData[0].forEach((item: any) => {
          if (item.communities && !allCommunities.some(c => c.id === item.communities.id)) {
            allCommunities.push(item.communities);
          }
        });
      }
      if (allCommunities.length === 0) {
        setError('You do not own or admin any communities');
        setLoading(false);
        return;
      }
      setCommunities(allCommunities);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics dashboard');
      setLoading(false);
    }
  };
  const fetchAnalytics = async () => {
    if (communities.length === 0) return;
    try {
      const filters = selectedCommunity === 'all' ? {} : {
        communityId: selectedCommunity
      };
      const data = await AnalyticsAPI.getSummary(filters);
      if (data) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      toast.error('Failed to load analytics data');
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setRefreshing(false), 500);
    toast.success('Analytics refreshed');
  };
  const handleExportData = async () => {
    const filters = selectedCommunity === 'all' ? {
      format: 'csv' as const
    } : {
      communityId: selectedCommunity,
      format: 'csv' as const
    };
    const result = await AnalyticsAPI.exportAnalytics(filters);
    if (result.success) {
      toast.success('Analytics data exported successfully');
    } else {
      toast.error(result.error || 'Failed to export analytics');
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-6 md:grid-cols-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
              <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={fetchOwnerCommunities}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                  Community Analytics & Insights
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Track growth and engagement across your communities
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className="w-64 bg-white">
                  <SelectValue placeholder="Filter by community" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Communities</SelectItem>
                  {communities.map(community => <SelectItem key={community.id} value={community.id}>
                      {community.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} variant="outline" size="icon" disabled={refreshing} className="shrink-0">
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={handleExportData} variant="secondary" className="gap-2 px-4 py-2 text-sm font-medium">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <AnalyticsKpiCards data={analyticsData} />

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Growth Chart */}
            <div className="lg:col-span-2">
              <CommunityGrowthChart communityIds={selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity]} refreshKey={refreshKey} />
            </div>

            {/* Top Contributors */}
            <div>
              <TopContributorsCard communityIds={selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity]} refreshKey={refreshKey} />
            </div>
          </div>

          {/* Activity Breakdown */}
          <ActivityBreakdownChart communities={selectedCommunity === 'all' ? communities : communities.filter(c => c.id === selectedCommunity)} refreshKey={refreshKey} />
        </div>
      </main>
    </div>;
}