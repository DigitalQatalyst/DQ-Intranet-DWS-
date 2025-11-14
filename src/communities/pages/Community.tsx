import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { getAnonymousUserId } from '@/communities/utils/anonymousUser';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { StickyActionButton } from '@/communities/components/KF eJP Library/Button';
import { Users, UserPlus, UserMinus, AlertCircle, Plus, Settings, Home, ChevronRight, Upload, X, Pencil, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { MemberList } from '@/communities/components/communities/MemberList';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { CommunityInfoPanel } from '@/communities/components/communities/CommunityInfoPanel';
import { ActivityFeed } from '@/communities/components/communities/ActivityFeed';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { Label } from '@/communities/components/ui/label';
import { Input } from '@/communities/components/ui/input';
import { format } from 'date-fns';
import { PostCard } from '@/communities/components/posts/PostCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
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
  department?: string | null;
  location_filter?: string | null;
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
  useEffect(() => {
    if (id) {
      fetchCommunity();
      fetchPosts();
      // Check membership for both authenticated and anonymous users
      checkMembership();
    }
  }, [id, user]);

  // Refresh membership status when component mounts or when coming from join action
  useEffect(() => {
    if (id) {
      checkMembership();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchPosts();
    }
  }, [refreshKey]);
  const fetchCommunity = async () => {
    if (!id) {
      setError("Community ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching community:', id);
      
      // Try communities_with_counts view first
      let query = supabase
        .from("communities_with_counts")
        .select("*")
        .eq("id", id)
        .single();
      
      let [data, err] = await safeFetch(query);
      
      // If permission denied or view doesn't exist, fallback to base communities table
      if (err && (err.message?.includes('permission denied') || err.message?.includes('does not exist'))) {
        console.warn('View not accessible, falling back to base communities table:', err.message);
        
        // Fallback: Query base communities table with member count
        query = supabase
          .from("communities")
          .select(`
            *,
            memberships(count)
          `)
          .eq("id", id)
          .single();
        
        [data, err] = await safeFetch(query);
        
        // Transform data to match expected format
        if (data && !err) {
          const transformedData = {
            ...data,
            member_count: Array.isArray(data.memberships) 
              ? data.memberships[0]?.count || 0 
              : (typeof data.member_count === 'number' ? data.member_count : 0)
          };
          
          setCommunity({
            id: transformedData.id,
            name: transformedData.name,
            description: transformedData.description,
            created_at: transformedData.created_at,
            imageurl: transformedData.imageurl || null,
            category: transformedData.category || "Community",
            department: transformedData.department || null,
            location_filter: transformedData.location_filter || null,
            isprivate: transformedData.isprivate || false,
          });
          setMemberCount(transformedData.member_count || 0);
          
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
          
          setLoading(false);
          return;
        }
      }
      
      if (err) {
        console.error('Error fetching community:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint
        });
        setError(`Failed to load community: ${err.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }
      
      if (data) {
        setCommunity({
          id: data.id,
          name: data.name,
          description: data.description,
          created_at: data.created_at,
          imageurl: data.imageurl || null,
          category: data.category || "Community",
          department: data.department || null,
          location_filter: data.location_filter || null,
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
      } else {
        setError("Community not found");
      }
    } catch (exception) {
      console.error('Exception fetching community:', exception);
      const errorMessage = exception instanceof Error ? exception.message : 'Unknown error occurred';
      setError(`Failed to load community: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  const checkMembership = async () => {
    if (!id) return;
    
    // Get user ID (authenticated user or anonymous user)
    const userId = user?.id || getAnonymousUserId();
    
    // Check community_members table first, fallback to memberships for compatibility
    const query = supabase.from('community_members').select('id').eq('user_id', userId).eq('community_id', id).maybeSingle();
    const [data] = await safeFetch(query);
    
    // If not found in community_members, check memberships table
    if (!data) {
      const query2 = supabase.from('memberships').select('id').eq('user_id', userId).eq('community_id', id).maybeSingle();
      const [data2] = await safeFetch(query2);
      setIsMember(!!data2);
    } else {
      setIsMember(!!data);
    }
  };
  const handleJoinLeave = async () => {
    if (!id) return;
    
    setJoinLoading(true);
    
    // Get user ID (authenticated user or anonymous user)
    const userId = user?.id || getAnonymousUserId();
    
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
    
    // Check if already a member (check both tables for compatibility)
    const { data: existingMembership } = await supabase
      .from('community_members')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', id)
      .maybeSingle();
    
    if (isMember || existingMembership) {
      // Leave community - delete from both tables for compatibility
      const query1 = supabase.from('community_members').delete().match({
        user_id: userId,
        community_id: id
      });
      const query2 = supabase.from('memberships').delete().match({
        user_id: userId,
        community_id: id
      });
      const [, error1] = await safeFetch(query1);
      const [, error2] = await safeFetch(query2);
      if (error1 && error2) {
        toast.error('Failed to leave community');
      } else {
        toast.success('Left community');
        setIsMember(false);
        setMemberCount(prev => Math.max(0, prev - 1));
      }
    } else {
      // Join community - insert into both tables for compatibility
      const memberData = {
        user_id: userId,
        community_id: id,
        role: 'member'
      };
      const query1 = supabase.from('community_members').insert(memberData);
      const query2 = supabase.from('memberships').insert({
        user_id: userId,
        community_id: id
      });
      const [, error1] = await safeFetch(query1);
      const [, error2] = await safeFetch(query2);
      if (error1 && error2) {
        if (error1.code === '23505' || error2.code === '23505') {
          // Duplicate key error - user is already a member
          toast.error('You are already a member of this community');
          setIsMember(true);
        } else if (error1.code === '23503' || error2.code === '23503') {
          // Foreign key violation
          toast.error('Invalid community or user');
        } else {
          toast.error('Failed to join community');
        }
      } else {
        toast.success(user ? 'Joined community!' : 'Joined community as guest!');
        setIsMember(true);
        setMemberCount(prev => prev + 1);
        // Refresh posts to show member-only content
        fetchPosts();
      }
    }
    setJoinLoading(false);
  };
  const fetchPosts = async () => {
    if (!id) return;
    setPostsLoading(true);
    setPostsError(null);

    // For moderators/admins, query community_posts table directly to see all statuses
    // For regular users, use the view which only shows active posts
    const isModerator =
      user && (user.role === "admin" || user.role === "moderator");

    // Query community_posts table directly for all users
    let query = supabase
      .from("community_posts")
      .select(
        `
        *,
        communities!inner(name),
        users_local!community_posts_user_id_fkey(username, avatar_url)
      `
      )
      .eq("community_id", id);

    // Regular users only see active posts
    if (!isModerator) {
      query = query.eq("status", "active");
    }

    query = query.order("created_at", {
      ascending: false,
    });

    const [data, err] = await safeFetch(query);
    if (err) {
      setPostsError("Failed to load posts");
      setPostsLoading(false);
      return;
    }

    if (data) {
      // Fetch reaction and comment counts separately for all users
      const postIds = data.map((p: any) => p.id);

      const { data: reactions } = await supabase
        .from("community_reactions")
        .select("post_id, reaction_type")
        .in("post_id", postIds);

      const { data: comments } = await supabase
        .from("community_comments")
        .select("post_id")
        .in("post_id", postIds)
        .eq("status", "active");

      // Count reactions and comments
      const reactionCounts =
        reactions?.reduce((acc: any, r: any) => {
          if (!acc[r.post_id]) acc[r.post_id] = { like: 0, helpful: 0, insightful: 0 };
          if (r.reaction_type === "like") acc[r.post_id].like++;
          if (r.reaction_type === "helpful") acc[r.post_id].helpful++;
          if (r.reaction_type === "insightful") acc[r.post_id].insightful++;
          return acc;
        }, {}) || {};

      const commentCounts =
        comments?.reduce((acc: any, c: any) => {
          acc[c.post_id] = (acc[c.post_id] || 0) + 1;
          return acc;
        }, {}) || {};

      const posts = data.map((p: any) => ({
        ...p,
        community_name: p.communities?.name,
        author_username: p.users_local?.username,
        author_avatar: p.users_local?.avatar_url,
        helpful_count: reactionCounts[p.id]?.helpful || 0,
        insightful_count: reactionCounts[p.id]?.insightful || 0,
        comment_count: commentCounts[p.id] || 0,
      }));

      setPosts(posts);
    }
    setPostsLoading(false);
  };
  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
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
        <div className="max-w-7xl mx-auto  my-4 ">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/community"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm"
                >
                  <Home size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    to="/communities"
                    className="ml-1 text-sm text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    Communities
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="ml-1 text-sm text-gray-500 md:ml-2">
                    {community.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <PageLayout>
          {/* Hero Section */}
          <PageSection className="p-0 overflow-hidden mb-6">
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
                    <div className="mt-6 md:mt-0 md:ml-8">
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
                            {joinLoading ? 'Processing...' : user ? (community?.isprivate ? 'Request to Join' : 'Join Community') : 'Join as Guest'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posts Feed / Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Community Info Panel - Mobile/Tablet */}
              <div className="lg:hidden">
                {community && (
                  <CommunityInfoPanel
                    community={community}
                    memberCount={memberCount}
                    isMember={isMember}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onJoinLeave={handleJoinLeave}
                    joinLoading={joinLoading}
                    user={user}
                  />
                )}
              </div>

              <PageSection>
                <SectionHeader
                  title="Activity Feed"
                  description="Posts, comments, polls, surveys, and events"
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
                {/* Activity Feed */}
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
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onActionComplete={handlePostCreated}
                          isMember={isMember}
                        />
                      ))}
                    </div>
                  )}
                </SectionContent>
              </PageSection>
            </div>
            {/* Sidebar Column */}
            <div className="space-y-6 mb-10">
              {/* Community Info Panel - Desktop */}
              <div className="hidden lg:block">
                {community && (
                  <CommunityInfoPanel
                    community={community}
                    memberCount={memberCount}
                    isMember={isMember}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    onJoinLeave={handleJoinLeave}
                    joinLoading={joinLoading}
                    user={user}
                  />
                )}
              </div>

              {/* Member List Section */}
              <PageSection>
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
                <SectionContent className="p-0">
                  <MemberList communityId={id!} limit={5} hideHeader={true} />
                </SectionContent>
              </PageSection>
            </div>
          </div>
        </PageLayout>
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
