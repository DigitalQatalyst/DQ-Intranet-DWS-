import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { StickyActionButton } from '@/communities/components/KF eJP Library/Button';
import { Users, UserPlus, UserMinus, AlertCircle, Plus, Settings, Home, ChevronRight, Upload, X, Pencil, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { MemberList } from '@/communities/components/communities/MemberList';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { Label } from '@/communities/components/ui/label';
import { Input } from '@/communities/components/ui/input';
import { format } from 'date-fns';
import { PostCard } from '@/communities/components/posts/PostCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { FeedSidebar } from '@/communities/components/feed/FeedSidebar';
import { SignInModal } from '@/communities/components/auth/SignInModal';
// Import PageLayout components
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
  Breadcrumbs,
  BreadcrumbItem,
} from "../components/PageLayout/index";

interface Community {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  imageurl?: string | null;
  category?: string | null;
  isprivate?: boolean;
}
interface Post {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  community_id: string;
  community_name: string;
  author_username: string;
  author_avatar?: string;
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  tags?: string[];
  post_type?: "text" | "media" | "poll" | "event" | "article" | "announcement";
  metadata?: any;
  event_date?: string;
  event_location?: string;
}
export default function Community() {
  const { id } = useParams<{
    id: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updateImageLoading, setUpdateImageLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignInModal, setShowSignInModal] = useState(false);
  useEffect(() => {
    if (id) {
      fetchCommunity();
      // fetchPosts and checkMembership will be called after community is loaded
      // to avoid unnecessary queries for non-existent communities
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not user - user changes handled inside fetchCommunity
  useEffect(() => {
    if (id) {
      fetchPosts();
    }
  }, [refreshKey]);

  const fetchCommunity = async () => {
    if (!id) {
      setError("Community ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {

    // First, try to fetch from the view
    let data: any = null;
    let err: any = null;
    
    const viewQuery = supabase
      .from("communities_with_counts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    [data, err] = await safeFetch(viewQuery);

    // If view query fails, fallback to direct communities table query
    if (err || !data) {
      console.log("View query failed, trying direct communities table query...", err);
      
      const directQuery = supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      const [directData, directErr] = await safeFetch(directQuery);
      
      if (directErr || !directData) {
        // Check if it's a "not found" error
        const isNotFound = 
          directErr?.code === "PGRST116" || 
          directErr?.code === "PGRST301" ||
          directErr?.status === 401 ||
          directErr?.status === 404 ||
          directErr?.message?.includes("No rows") ||
          directErr?.message?.includes("not found") ||
          directErr?.message?.includes("Unauthorized");
        
        if (isNotFound) {
          setError("Community not found");
        } else {
          console.error("Error fetching community from direct table:", directErr);
          setError("Failed to load community");
        }
        setLoading(false);
        return;
      }
      
      // Use direct query data and fetch member count separately
      data = directData;
      
      // Fetch member count separately
      try {
        const { count } = await supabase
          .from("memberships")
          .select("*", { count: "exact", head: true })
          .eq("community_id" as any, id);
        
        data.member_count = count || 0;
      } catch (countError) {
        console.warn("Error fetching member count:", countError);
        data.member_count = 0;
      }
    }

    // Set community data
    if (data) {
      setCommunity({
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        imageurl: data.imageurl || null,
        category: data.category || "Community",
        isprivate: data.isprivate || false,
      });
      setMemberCount(data.member_count || 0);
      
      // Fetch the community's creator to check ownership
      if (user) {
        const ownerQuery = supabase
          .from("communities")
          .select("created_by")
          .eq("id", id)
          .maybeSingle();
        const [ownerData] = await safeFetch(ownerQuery);
        const isUserOwner = ownerData?.created_by === user.id;
        setIsOwner(isUserOwner);
        // Check if user is admin
        if (!isUserOwner && user.role === "admin") {
          setIsAdmin(true);
        } else if (!isUserOwner) {
          const roleQuery = supabase
            .from("community_roles")
            .select("role")
            .eq("community_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          const [roleData] = await safeFetch(roleQuery);
          setIsAdmin(roleData?.role === "admin");
        }
      }
      // Only fetch posts and check membership after community is successfully loaded
      // Don't await these - let them run in background to avoid blocking
      fetchPosts().catch(err => console.error("Error fetching posts:", err));
      checkMembership().catch(err => console.error("Error checking membership:", err));
    } else {
      setError("Community not found");
    }
    } catch (err) {
      console.error("Unexpected error in fetchCommunity:", err);
      setError("Failed to load community");
    } finally {
      setLoading(false);
    }
  };
  const checkMembership = async () => {
    if (!id || !user) {
      setIsMember(false);
      return;
    }
    
    // Get authenticated user ID from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || user?.id;
    
    if (!userId) {
      setIsMember(false);
      return;
    }
    
    const query = supabase.from('memberships').select('id').eq('user_id', userId).eq('community_id', id).maybeSingle();
    const [data] = await safeFetch(query);

    setIsMember(!!data);
  };
  const handleJoinLeave = async () => {
    if (!id) return;
    
    // Check if user is authenticated before joining
    if (!user) {
      toast.error('Please sign in to join communities');
      setShowSignInModal(true);
      return;
    }
    
    setJoinLoading(true);
    
    // Get authenticated user ID
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || user?.id;
    
    if (!userId) {
      toast.error('Unable to verify authentication. Please sign in again.');
      setJoinLoading(false);
      setShowSignInModal(true);
      return;
    }
    
    // Validate community exists
    const { data: communityData } = await supabase
      .from('communities')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!communityData) {
      toast.error('Community not found');
      setJoinLoading(false);
      return;
    }
    
    // Check if already a member
    const { data: existingMembership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', id)
      .maybeSingle();
    
    if (isMember || existingMembership) {
      // Leave community
      const query = supabase.from('memberships').delete().match({
        user_id: userId,
        community_id: id
      });
      const [, error] = await safeFetch(query);
      if (error) {
        toast.error('Failed to leave community');
      } else {
        toast.success('Left community');
        setIsMember(false);
        setMemberCount(prev => Math.max(0, prev - 1));
      }
    } else {
      // Join community
      const query = supabase.from('memberships').insert({
        user_id: userId,
        community_id: id
      });
      const [, error] = await safeFetch(query);
      if (error) {
        if (error.code === '23505') {
          // Duplicate key error - user is already a member
          toast.error('You are already a member of this community');
          setIsMember(true);
        } else if (error.code === '23503') {
          // Foreign key violation
          toast.error('Invalid community or user');
        } else {
          toast.error('Failed to join community');
        }
      } else {
        toast.success('Joined community!');
        setIsMember(true);
        setMemberCount(prev => prev + 1);
      }
    }
    setJoinLoading(false);
  };
  const fetchPosts = async () => {
    if (!id) return;
    setPostsLoading(true);
    setPostsError(null);

    try {
      // Query posts_v2 table (simplified schema)
      let query = supabase
        .from("posts_v2")
        .select("*")
        .eq("community_id", id)
        .order("created_at", {
          ascending: false,
        });

      const [data, err] = await safeFetch(query);
      
      if (err) {
        console.error("Error fetching posts from posts_v2:", err);
        setPostsError("Failed to load posts");
        setPostsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setPosts([]);
        setPostsLoading(false);
        return;
      }

      // Fetch community and user data for each post
      const postsWithMetadata = await Promise.all(
        data.map(async (post: any) => {
          // Fetch community name
          const [communityData] = await safeFetch(
            supabase
              .from("communities")
              .select("name")
              .eq("id", post.community_id)
              .maybeSingle()
          );
          
          // Fetch user data from users_local (user_id in posts_v2 may map to users_local.id)
          let userData = null;
          if (post.user_id) {
            const [userResult] = await safeFetch(
              supabase
                .from("users_local")
                .select("username, avatar_url")
                .eq("id", post.user_id)
                .maybeSingle()
            );
            userData = userResult;
          }
          
          return {
            ...post,
            created_by: post.user_id, // Map user_id to created_by for compatibility
            communities: communityData ? { name: communityData.name } : null,
            users_local: userData || null,
            community_name: communityData?.name || "Unknown Community",
            author_username: userData?.username || "Unknown User",
            author_avatar: userData?.avatar_url || null,
            // Add default values for fields not in posts_v2
            status: "active", // posts_v2 doesn't have status, default to active
            post_type: "text", // Default post type
            tags: [], // posts_v2 doesn't have tags
            content_html: null, // posts_v2 doesn't have content_html
            metadata: {},
            event_date: null,
            event_location: null,
          };
        })
      );
      
      // Fetch reaction and comment counts from the new tables for posts_v2
      const postIds = postsWithMetadata.map((p: any) => p.id);

      // Fetch from community_post_reactions_new (for posts_v2)
      const { data: reactions } = await supabase
        .from("community_post_reactions_new")
        .select("post_id, reaction_type")
        .in("post_id", postIds);

      // Fetch from community_post_comments_new (for posts_v2)
      const { data: comments } = await supabase
        .from("community_post_comments_new")
        .select("post_id")
        .in("post_id", postIds);

      // Count reactions and comments
      const reactionCounts =
        reactions?.reduce((acc: any, r: any) => {
          if (!acc[r.post_id]) acc[r.post_id] = { helpful: 0, insightful: 0 };
          if (r.reaction_type === "helpful") acc[r.post_id].helpful++;
          if (r.reaction_type === "insightful") acc[r.post_id].insightful++;
          return acc;
        }, {}) || {};

      const commentCounts =
        comments?.reduce((acc: any, c: any) => {
          acc[c.post_id] = (acc[c.post_id] || 0) + 1;
          return acc;
        }, {}) || {};

      const posts = postsWithMetadata.map((p: any) => ({
        ...p,
        helpful_count: reactionCounts[p.id]?.helpful || 0,
        insightful_count: reactionCounts[p.id]?.insightful || 0,
        comment_count: commentCounts[p.id] || 0,
      }));

      setPosts(posts);
    } catch (error) {
      console.error("Unexpected error in fetchPosts:", error);
      setPostsError("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };
  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTagFilter = (tag: string) => {
    // Navigate to feed with tag filter
    navigate(`/feed?tag=${tag}`);
  };
  const handleUpdateImage = async () => {
    if (!id || !user) return;
    if (!newImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setUpdateImageLoading(true);
    const updateData = {
      imageurl: newImageUrl.trim(),
    };
    const query = supabase.from("communities").update(updateData).eq("id", id);
    const [, error] = await safeFetch(query);
    if (error) {
      toast.error("Failed to update community image");
      console.error("Image update error:", error);
    } else {
      toast.success("Community image updated successfully");
      setCommunity((prev) =>
        prev
          ? {
              ...prev,
              imageurl: newImageUrl.trim(),
            }
          : null
      );
      setImageDialogOpen(false);
      setNewImageUrl("");
    }
    setUpdateImageLoading(false);
  };

  // Generate breadcrumbs for the community page
  const breadcrumbItems: BreadcrumbItem[] = community
    ? [
        {
          label: "Home",
          href: "/",
          icon: Home,
        },
        {
          label: "Communities",
          href: "/communities",
        },
        {
          label: community.name,
          current: true,
        },
      ]
    : [];
  if (loading) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout>
          <div className="flex justify-center items-center min-h-[60vh] bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-dq-navy border-gray-200 animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading community...</p>
            </div>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }
  if (error || !community) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout>
          <PageSection>
            <SectionContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Community not found"}
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  We couldn't find the community you're looking for. It may have
                  been removed or you may have followed an incorrect link.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={fetchCommunity}>
                    Try Again
                  </Button>
                  <Button as={Link} to="/communities" variant="default">
                    Browse Communities
                  </Button>
                </div>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }
  // Fallback image URL if community image is missing
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80";
  return (
    <MainLayout hidePageLayout>
      <div className="">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto pl-0 pr-1 sm:pl-0 sm:pr-2 lg:pl-0 lg:pr-3 mt-2 mb-1">
          <nav className="flex mb-4 min-h-[24px]" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                  aria-label="Navigate to Home"
                >
                  <Home size={16} className="mr-1" aria-hidden="true" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
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
                  <ChevronRight size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">
                    {community.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto pl-0 pr-1 sm:pl-0 sm:pr-2 lg:pl-0 lg:pr-3">
            <PageLayout>
          {/* Hero Section */}
          <PageSection className="p-0 overflow-hidden mb-2">
            <div className="relative">
              {/* Dynamic Image with Fallback */}
              <div className="relative lg:h-[280px] h-[320px] overflow-hidden ">
                {community.imageurl ? (
                  <img
                    src={community.imageurl}
                    alt={community.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-dq-navy to-[#1A2E6E]" />
                )}
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
                {/* Admin/Moderator Control Buttons */}
                {(isOwner ||
                  isAdmin ||
                  (user &&
                    (user.role === "admin" || user.role === "moderator"))) && (
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Button
                      onClick={() => setImageDialogOpen(true)}
                      variant="secondary"
                      className="bg-white/90 text-gray-700 hover:bg-white"
                      size="sm"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit Cover Image
                    </Button>
                    <Button
                      as={Link}
                      to={`/community/${id}/settings`}
                      variant="secondary"
                      className="bg-white/90 text-gray-700 hover:bg-white"
                      size="sm"
                    >
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Settings
                    </Button>
                  </div>
                )}
                {/* Content Container - Centered vertically */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between">
                      <div className="md:max-w-3xl">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
                          {community.name}
                        </h1>
                        <p className="text-white/90 text-base md:text-lg mt-3 max-w-3xl leading-relaxed">
                          {community.description || "No description available"}
                        </p>
                        {/* Community metadata */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <div className="flex items-center bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{memberCount} members</span>
                          </div>
                          <div className="flex items-center bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              Created{" "}
                              {format(
                                new Date(community.created_at),
                                "MMM yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 md:mt-0 md:ml-12">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        {isMember ? (
                          <Button 
                            onClick={handleJoinLeave} 
                            variant="outline" 
                            className="bg-white text-dq-navy border-dq-navy/30 hover:bg-dq-navy/10" 
                            disabled={joinLoading}
                          >
                            {joinLoading ? 'Processing...' : 'Leave Community'}
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleJoinLeave} 
                            className="bg-dq-navy text-white hover:bg-[#13285A]" 
                            disabled={joinLoading}
                          >
                            {joinLoading ? 'Processing...' : user ? (community?.isprivate ? 'Request to Join' : 'Join Community') : 'Join'}
                          </Button>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </PageSection>
          {/* Main Content */}
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
            {/* Posts Feed */}
            <div className="lg:col-span-2 space-y-6">
              <PageSection>
                <SectionHeader
                  title="Community Posts"
                  description="Latest discussions and updates"
                />
                {/* Inline Composer - Only for members */}
                {user && isMember && (
                  <SectionContent className="pb-0 border-b border-gray-200">
                    <InlineComposer
                      communityId={id}
                      onPostCreated={handlePostCreated}
                    />
                  </SectionContent>
                )}
                {/* Posts List */}
                <SectionContent className={user && isMember ? "pt-4" : ""}>
                  {postsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-4">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : postsError ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                      <p>{postsError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchPosts}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-4">
                          <AlertCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No posts yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Be the first to start a conversation in this community
                        </p>
                        {user && isMember && (
                          <Button
                            onClick={() =>
                              navigate(`/create-post?communityId=${id}`)
                            }
                            className="bg-dq-navy text-white hover:bg-[#13285A]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                          </Button>
                        )}
                        {!user && (
                          <p className="text-gray-400 text-sm">
                            Join this community to start posting
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        // Filter posts based on search query
                        const searchTerm = searchQuery.trim().toLowerCase();
                        const filteredPosts = searchTerm
                          ? posts.filter((post) => {
                              // Safely check title and content
                              const titleMatch = post.title
                                ?.toLowerCase()
                                .includes(searchTerm) || false;
                              const contentMatch = post.content
                                ?.toLowerCase()
                                .includes(searchTerm) || false;
                              return titleMatch || contentMatch;
                            })
                          : posts;

                        if (searchTerm && filteredPosts.length === 0) {
                          return (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="bg-gray-100 p-3 rounded-full mb-4">
                                  <AlertCircle className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  No posts found
                                </h3>
                                <p className="text-gray-500">
                                  No posts match your search for "{searchQuery}"
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return filteredPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onActionComplete={handlePostCreated}
                          />
                        ));
                      })()}
                    </div>
                  )}
                </SectionContent>
              </PageSection>
            </div>
            {/* Sidebar Column */}
            {/* Main content container with vertical spacing */}
            <div className="space-y-6 mb-10">
              {/* Community Information Section */}
              <PageSection>
                <SectionHeader title="About this Community" />
                <SectionContent>
                  <div className="space-y-4">
                    {/* Community Category */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Category
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {community.category}
                      </p>
                    </div>
                    {/* Community Creation Date */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {format(new Date(community.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {/* Member Count */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Members
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {memberCount} members
                      </p>
                    </div>
                    {/* Admin/owner only settings button */}
                    {(isOwner || isAdmin) && (
                      <div className="pt-4 border-t border-gray-200">
                        <Button
                          as={Link}
                          to={`/community/${id}/settings`}
                          variant="outline"
                          className="w-full justify-center"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Community
                        </Button>
                      </div>
                    )}
                  </div>
                </SectionContent>
              </PageSection>

              {/* Feed Sidebar - Trending Topics and Top Communities */}
              <FeedSidebar onTagClick={handleTagFilter} />

              {/* Member List Section */}
              <PageSection>
                {/* Section header with title and 'View All' button */}
                <SectionHeader
                  title="Community Members"
                  actions={
                    <Button
                      as={Link}
                      to={`/community/${id}/members`}
                      variant="outline"
                      size="sm"
                    >
                      View All
                    </Button>
                  }
                />
                {/* Member list with pagination */}
                <SectionContent className="p-0">
                  {/* Display first 5 members, hides the section header */}
                  <MemberList communityId={id!} limit={5} hideHeader={true} />
                </SectionContent>
              </PageSection>
            </div>
          </div>
          </div>
            </PageLayout>
          </div>
        </div>
        {/* Floating Create Post Button */}
        {user && isMember && (
          <Button
            onClick={() => navigate(`/create-post?communityId=${id}`)}
            className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-dq-navy hover:bg-[#13285A] text-white"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
        {/* Sign In Modal */}
        <SignInModal
          open={showSignInModal}
          onOpenChange={setShowSignInModal}
          title="Sign In to Join Community"
          description="Please sign in to join this community and start participating."
          onSuccess={async () => {
            setShowSignInModal(false);
            // Wait for user state to update, then join directly using session
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (!id) return;
            
            // Get user directly from session instead of relying on auth context
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            
            if (!userId) {
              toast.error('Unable to verify authentication. Please try again.');
              return;
            }
            
            // Join directly without checking auth context user
            setJoinLoading(true);
            
            try {
              // Check if already a member
              const { data: existingMembership } = await supabase
                .from('memberships')
                .select('id')
                .eq('user_id', userId)
                .eq('community_id', id)
                .maybeSingle();
              
              if (existingMembership) {
                toast.info('You are already a member of this community');
                setIsMember(true);
                setJoinLoading(false);
                return;
              }
              
              // Join community
              const query = supabase.from('memberships').insert({
                user_id: userId,
                community_id: id
              });
              const [, error] = await safeFetch(query);
              
              if (error) {
                if (error.code === '23505') {
                  toast.info('You are already a member of this community');
                  setIsMember(true);
                } else {
                  toast.error('Failed to join community');
                }
              } else {
                toast.success('Joined community!');
                setIsMember(true);
                setMemberCount(prev => prev + 1);
                handlePostCreated();
              }
            } catch (error) {
              console.error('Error joining community:', error);
              toast.error('Failed to join community');
            } finally {
              setJoinLoading(false);
            }
          }}
        />

        {/* Image Update Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Community Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="focus:ring-2 focus:ring-dq-navy focus:border-dq-navy"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for the community background image
                </p>
              </div>
              {/* Preview */}
              {newImageUrl && (
                <div className="relative h-32 w-full overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImageUrl;
                    }}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImageDialogOpen(false);
                    setNewImageUrl("");
                  }}
                  disabled={updateImageLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateImage}
                  disabled={updateImageLoading}
                  className="bg-dq-navy hover:bg-[#13285A] text-white"
                >
                  {updateImageLoading ? "Updating..." : "Update Image"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
