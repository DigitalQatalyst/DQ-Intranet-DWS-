import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

import { AnalyticsKpiCards } from "../components/analytics/AnalyticsKpiCards";
import { CommunityGrowthChart } from "../components/analytics/CommunityGrowthChart";
import { ActivityBreakdownChart } from "../components/analytics/ActivityBreakdownChart";
import { TopContributorsCard } from "../components/analytics/TopContributorsCard";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { AlertCircle, Download, RefreshCw, Home } from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../components/ui/breadcrumb";

import { MainLayout } from "../components/layout/MainLayout";

// Community Analytics API implementation
const AnalyticsAPI = {
  getSummary: async (filters: any) => {
    try {
      let totalMembers = 0;
      let activePosts = 0;
      let commentsPosted = 0;

      if (filters.communityId) {
        // Get stats for specific community
        // First get posts in the community to get their IDs
        const postsInCommunity = await supabase
          .from("posts")
          .select("id")
          .eq("community_id", filters.communityId);

        const postIds = postsInCommunity.data?.map((p) => p.id) || [];

        const [membersResult, postsResult, commentsResult] = await Promise.all([
          supabase
            .from("memberships")
            .select("id", { count: "exact" })
            .eq("community_id", filters.communityId),
          supabase
            .from("posts")
            .select("id", { count: "exact" })
            .eq("community_id", filters.communityId)
            .gte(
              "created_at",
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            ),
          postIds.length > 0
            ? supabase
                .from("comments")
                .select("id", { count: "exact" })
                .in("post_id", postIds)
                .gte(
                  "created_at",
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                )
            : Promise.resolve({ count: 0 }),
        ]);

        totalMembers = membersResult.count || 0;
        activePosts = postsResult.count || 0;
        commentsPosted = commentsResult.count || 0;
      } else {
        // Get stats for all communities
        const [membersResult, postsResult, commentsResult] = await Promise.all([
          supabase.from("memberships").select("id", { count: "exact" }),
          supabase
            .from("posts")
            .select("id", { count: "exact" })
            .gte(
              "created_at",
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            ),
          supabase
            .from("comments")
            .select("id", { count: "exact" })
            .gte(
              "created_at",
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            ),
        ]);

        totalMembers = membersResult.count || 0;
        activePosts = postsResult.count || 0;
        commentsPosted = commentsResult.count || 0;
      }

      const engagementRate = activePosts > 0 ? commentsPosted / activePosts : 0;

      return {
        totalMembers,
        activePosts,
        commentsPosted,
        engagementRate,
      };
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      return {
        totalMembers: 0,
        activePosts: 0,
        commentsPosted: 0,
        engagementRate: 0,
      };
    }
  },
  subscribe: (communityIds: string[], callback: () => void) => {
    // Set up real-time subscriptions for posts and comments
    const subscriptions = [
      supabase
        .channel("posts_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts" },
          callback
        )
        .subscribe(),
      supabase
        .channel("comments_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "comments" },
          callback
        )
        .subscribe(),
      supabase
        .channel("memberships_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "memberships" },
          callback
        )
        .subscribe(),
    ];

    return () => {
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
  },
  exportAnalytics: async (filters: any) => {
    // Mock implementation for now
    return { success: false, error: "Export not implemented yet" };
  },
};
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(() => {
    return localStorage.getItem("analytics.lastCommunityId") || "all";
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // Check permissions - admin only
  useEffect(() => {
    if (!user) {
      navigate("/community");
      return;
    }

    // Check if user is admin
    const checkAccess = async () => {
      const { data: localUser } = await supabase
        .from("users_local")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();

      if (!localUser || localUser.role !== "admin") {
        toast.error(
          "Access denied: Analytics is only available to administrators"
        );
        navigate("/community");
        return;
      }

      // If access is granted, fetch communities
      fetchOwnerCommunities();
    };

    checkAccess();
  }, [user, navigate]);

  // Fetch analytics when filters change
  useEffect(() => {
    if (communities.length > 0) {
      fetchAnalytics();
    }
  }, [selectedCommunity, communities, refreshKey]);

  // Persist selected community
  useEffect(() => {
    localStorage.setItem("analytics.lastCommunityId", selectedCommunity);
  }, [selectedCommunity]);

  // Real-time updates
  useEffect(() => {
    if (communities.length === 0) return;
    const communityIds =
      selectedCommunity === "all"
        ? communities.map((c) => c.id)
        : [selectedCommunity];
    const unsubscribe = AnalyticsAPI.subscribe(communityIds, () => {
      console.log("Analytics data updated, refreshing...");
      fetchAnalytics();
    });
    return unsubscribe;
  }, [communities, selectedCommunity]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (communities.length > 0) {
        console.log("Auto-refreshing analytics...");
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
      // Since we already checked user is admin, fetch all communities
      const { data: allCommunitiesData, error: allCommunitiesError } =
        await supabase.from("communities").select("id, name").order("name");

      if (allCommunitiesError) throw allCommunitiesError;

      const allCommunities = allCommunitiesData || [];

      if (allCommunities.length === 0) {
        setError("No communities available for analytics");
        setLoading(false);
        return;
      }

      setCommunities(allCommunities);
      setLoading(false);
    } catch (err) {
      setError("Failed to load analytics dashboard");
      setLoading(false);
    }
  };
  const fetchAnalytics = async () => {
    if (communities.length === 0) return;
    try {
      const filters =
        selectedCommunity === "all"
          ? {}
          : {
              communityId: selectedCommunity,
            };
      const data = await AnalyticsAPI.getSummary(filters);
      console.log("Analytics data fetched:", data);
      console.log("Filters used:", filters);
      if (data) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      toast.error("Failed to load analytics data");
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Analytics refreshed");
  };
  const handleExportData = async () => {
    const filters =
      selectedCommunity === "all"
        ? {
            format: "csv" as const,
          }
        : {
            communityId: selectedCommunity,
            format: "csv" as const,
          };
    const result = await AnalyticsAPI.exportAnalytics(filters);
    if (result.success) {
      toast.success("Analytics data exported successfully");
    } else {
      toast.error(result.error || "Failed to export analytics");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
              <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchOwnerCommunities}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <MainLayout>
      <div className="min-h-screen ">
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/communities">Communities</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="flex items-start justify-between animate-fade-in gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                {/* <BarChart3 className="h-8 w-8 text-blue-600" /> */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    Community Analytics & Insights
                  </h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Track growth and engagement across all communities (Admin
                    Access)
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <Select
                  value={selectedCommunity}
                  onValueChange={setSelectedCommunity}
                >
                  <SelectTrigger className="w-64 bg-white">
                    <SelectValue placeholder="Filter by community" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Communities</SelectItem>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="icon"
                  disabled={refreshing}
                  className="shrink-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
                <Button
                  onClick={handleExportData}
                  variant="secondary"
                  className="gap-2 px-4 py-2 text-sm font-medium"
                >
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
                <CommunityGrowthChart
                  communityIds={
                    selectedCommunity === "all"
                      ? communities.map((c) => c.id)
                      : [selectedCommunity]
                  }
                  refreshKey={refreshKey}
                />
              </div>

              {/* Top Contributors */}
              <div>
                <TopContributorsCard
                  communityIds={
                    selectedCommunity === "all"
                      ? communities.map((c) => c.id)
                      : [selectedCommunity]
                  }
                  refreshKey={refreshKey}
                />
              </div>
            </div>

            {/* Activity Breakdown */}
            <ActivityBreakdownChart
              communities={
                selectedCommunity === "all"
                  ? communities
                  : communities.filter((c) => c.id === selectedCommunity)
              }
              refreshKey={refreshKey}
            />
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
