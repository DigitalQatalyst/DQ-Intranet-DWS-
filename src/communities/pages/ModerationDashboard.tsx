import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Header } from '@/communities/components/layout/Header';
import { ModerationSummaryCard } from '@/communities/components/moderation/ModerationSummaryCard';
import { ReportsTable } from '@/communities/components/moderation/ReportsTable';
import { ReportDetailDrawer } from '@/communities/components/moderation/ReportDetailDrawer';
import { ModerationLogCard } from '@/communities/components/moderation/ModerationLogCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { ModerationAPI, ModerationMetrics } from '@/services/ModerationAPI';
import { usePermissions } from '@/communities/hooks/usePermissions';
import { toast } from 'sonner';
interface Community {
  id: string;
  name: string;
}
export default function ModerationDashboard() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const permissions = usePermissions();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [stats, setStats] = useState<ModerationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const filterPostId = searchParams.get('postId') || undefined;
  // Check permissions and redirect if not authorized
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (!permissions.canViewReports && !loading) {
      toast.error('You do not have permission to access moderation dashboard');
      navigate('/');
      return;
    }
    fetchModeratorCommunities();
  }, [user, permissions.canViewReports, navigate]);
  // Fetch stats when community changes
  useEffect(() => {
    if (communities.length > 0) {
      fetchStats();
    }
  }, [selectedCommunity, communities, refreshKey]);

  // Setup realtime subscriptions
  useEffect(() => {
    if (communities.length === 0) return;
    const communityIds = selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity];
    const unsubscribe = ModerationAPI.subscribe(communityIds, (event, data) => {
      if (event === 'report') {
        toast.info('New report received', {
          description: `A new report has been submitted in your community`
        });
        setRefreshKey(prev => prev + 1);
      } else if (event === 'action') {
        setRefreshKey(prev => prev + 1);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [communities, selectedCommunity]);
  const fetchModeratorCommunities = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch communities where user is owner
      const ownedQuery = supabase.from('communities').select('id, name').eq('created_by', user.id);

      // Fetch communities where user is admin/moderator
      const roleQuery = supabase.from('community_roles').select(`
          communities!community_roles_community_id_fkey (
            id,
            name
          )
        `).eq('user_id', user.id).in('role', ['admin', 'moderator']);
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
        setError('You do not have moderation permissions for any communities');
        setLoading(false);
        return;
      }
      setCommunities(allCommunities);
      setLoading(false);
    } catch (err) {
      setError('Failed to load moderation dashboard');
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    if (communities.length === 0) return;
    const metrics = await ModerationAPI.getMetrics({
      communityId: selectedCommunity
    });
    setStats(metrics);
  };
  const handleReportUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedReportId(null);
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
                <Button variant="secondary" size="sm" onClick={fetchModeratorCommunities}>
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
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                  Content Moderation
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor and manage reported content across your communities
                </p>
              </div>
            </div>

            {/* Community Filter */}
            <div className="w-64">
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by community" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">All Communities</SelectItem>
                  {communities.map(community => <SelectItem key={community.id} value={community.id}>
                      {community.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Cards */}
          <ModerationSummaryCard stats={stats} />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Reports Table */}
            <div className="lg:col-span-2">
              <ReportsTable communityIds={selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity]} refreshKey={refreshKey} onSelectReport={setSelectedReportId} filterPostId={filterPostId} />
            </div>

            {/* Moderation Log */}
            <div>
              <ModerationLogCard communityIds={selectedCommunity === 'all' ? communities.map(c => c.id) : [selectedCommunity]} refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </main>

      {/* Report Detail Drawer */}
      {selectedReportId && <ReportDetailDrawer reportId={selectedReportId} onClose={() => setSelectedReportId(null)} onUpdate={handleReportUpdate} />}
    </div>;
}