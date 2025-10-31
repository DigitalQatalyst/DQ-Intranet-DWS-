import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { PostReactions } from '@/communities/components/post/PostReactions';
import { PostAuthorCard } from '@/communities/components/post/PostAuthorCard';
import { RelatedPosts } from '@/communities/components/post/RelatedPosts';
import { CommentList } from '@/communities/components/post/CommentList';
import { AddCommentForm } from '@/communities/components/post/AddCommentForm';
import { TextPostContent } from '@/communities/components/post/TextPostContent';
import { MediaPostContent } from '@/communities/components/post/MediaPostContent';
import { EventPostContent } from '@/communities/components/post/EventPostContent';
import { PollPostContent } from '@/communities/components/post/PollPostContent';
import { UnsupportedPostContent } from '@/communities/components/post/UnsupportedPostContent';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { Badge } from '@/communities/components/ui/badge';
import { AlertCircle, Home, ChevronRight, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
import { format } from 'date-fns';
import { PostTypeBadge } from '@/communities/components/posts/PostCard/PostTypeBadge';
// Import PageLayout components
import { PageLayout, PageSection, SectionHeader, SectionContent, Breadcrumbs, BreadcrumbItem } from '@/communities/components/PageLayout';
interface Post {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  author_username: string;
  author_avatar: string | null;
  community_id: string;
  community_name: string;
  tags?: string[];
  helpful_count?: number;
  insightful_count?: number;
  post_type?: string;
  metadata?: any;
  event_date?: string;
  event_location?: string;
}
export default function PostDetail() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);
  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    // Query posts table directly to get all fields including content_html, post_type, etc.
    const query = supabase.from('posts').select(`
        id,
        title,
        content,
        content_html,
        created_at,
        created_by,
        community_id,
        tags,
        post_type,
        metadata,
        event_date,
        event_location,
        communities!inner(name),
        users_local!posts_created_by_fkey(username, avatar_url)
      `).eq('id', id).maybeSingle();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load post');
      setLoading(false);
      return;
    }
    if (!data) {
      setError('Post not found');
      setLoading(false);
      return;
    }
    // Get reaction counts separately
    const [reactionsData] = await safeFetch(supabase.from('reactions').select('reaction_type').eq('post_id', id));
    // Get comment count
    const [commentsData] = await safeFetch(supabase.from('comments').select('id', {
      count: 'exact'
    }).eq('post_id', id));
    const helpfulCount = reactionsData?.filter((r: any) => r.reaction_type === 'helpful').length || 0;
    const insightfulCount = reactionsData?.filter((r: any) => r.reaction_type === 'insightful').length || 0;
    const commentCount = commentsData?.count || 0;
    setPost({
      id: data.id,
      title: data.title,
      content: data.content,
      content_html: data.content_html,
      created_at: data.created_at,
      created_by: data.created_by,
      author_username: data.users_local?.username || 'Unknown',
      author_avatar: data.users_local?.avatar_url || null,
      community_id: data.community_id || '',
      community_name: data.communities?.name || 'Unknown',
      tags: data.tags || [],
      helpful_count: helpfulCount,
      insightful_count: insightfulCount,
      post_type: data.post_type || 'text',
      metadata: data.metadata || {},
      event_date: data.event_date,
      event_location: data.event_location
    });
    setLoading(false);
  };
  const handleCommentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };
  // Generate breadcrumbs for the post
  const breadcrumbItems: BreadcrumbItem[] = post ? [{
    label: 'Home',
    href: '/',
    icon: Home
  }, {
    label: 'Communities',
    href: '/communities'
  }, {
    label: post.community_name,
    href: `/community/${post.community_id}`
  }, {
    label: post.title,
    current: true
  }] : [];
  if (loading) {
    return <MainLayout hidePageLayout>
        <PageLayout>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <PageSection>
              <SectionContent>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </SectionContent>
            </PageSection>
            <PageSection className="mt-6">
              <SectionHeader title="Comments" />
              <SectionContent>
                {[1, 2, 3].map(i => <div key={i} className="flex items-start gap-3 py-4 border-t first:border-t-0">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                  </div>)}
              </SectionContent>
            </PageSection>
          </div>
        </PageLayout>
      </MainLayout>;
  }
  if (error || !post) {
    return <MainLayout hidePageLayout>
        <PageLayout>
          <div className="max-w-4xl mx-auto">
            <PageSection>
              <SectionContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {error || 'Post not found'}
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md">
                    We couldn't find the post you're looking for. It may have
                    been removed or you may have followed an incorrect link.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchPost}>
                      Try Again
                    </Button>
                    <Button as={Link} to="/communities/feed" variant="default">
                      Return to Feed
                    </Button>
                  </div>
                </div>
              </SectionContent>
            </PageSection>
          </div>
        </PageLayout>
      </MainLayout>;
  }
  return <MainLayout hidePageLayout>
      <PageLayout title={post.title} breadcrumbs={breadcrumbItems}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Header & Metadata */}
            <PageSection>
              <SectionContent>
                <div className="flex items-center gap-2 mb-4">
                  <PostTypeBadge postType={post.post_type as any} className="text-sm" />
                  {post.tags && post.tags.length > 0 && <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, index) => <Badge key={index} variant="outline" className="text-xs font-medium">
                          #{tag}
                        </Badge>)}
                    </div>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarImage src={post.author_avatar || undefined} />
                    <AvatarFallback className="p-0 overflow-hidden">
                      <GradientAvatar seed={post.author_username} className="h-full w-full" />
                    </AvatarFallback>
                  </Avatar>
                  {post.created_by ? <Link to={`/profile/${post.created_by}`} className="font-medium text-gray-700 hover:text-[#0030E3] transition-colors">
                      {post.author_username}
                    </Link> : <span className="font-medium text-gray-700">
                      {post.author_username}
                    </span>}
                  <span className="text-gray-400">•</span>
                  <Link to={`/community/${post.community_id}`} className="text-[#0030E3] hover:text-[#002180] transition-colors">
                    {post.community_name}
                  </Link>
                  <span className="text-gray-400">•</span>
                  <span>
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                  </span>
                  {/* Comment count */}
                  <div className="ml-auto flex items-center text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    <span>{post.comment_count || 0} comments</span>
                  </div>
                </div>
                {/* Type-Specific Content Rendering */}
                <div className="mt-6">
                  {post.post_type === 'text' && <TextPostContent content={post.content} content_html={post.content_html} />}
                  {post.post_type === 'media' && <MediaPostContent metadata={post.metadata || {}} title={post.title} content={post.content} content_html={post.content_html} />}
                  {post.post_type === 'event' && <EventPostContent postId={post.id} event_date={post.event_date} event_location={post.event_location} metadata={post.metadata} content={post.content} content_html={post.content_html} />}
                  {post.post_type === 'poll' && <PollPostContent postId={post.id} metadata={post.metadata} content={post.content} content_html={post.content_html} />}
                  {/* Fallback for unsupported or undefined post types */}
                  {!post.post_type || !['text', 'media', 'event', 'poll'].includes(post.post_type) && <UnsupportedPostContent post_type={post.post_type} content={post.content} />}
                </div>
              </SectionContent>
            </PageSection>
            {/* Reactions */}
            <PageSection>
              <SectionContent className="py-4">
                <PostReactions helpfulCount={post.helpful_count || 0} insightfulCount={post.insightful_count || 0} postId={post.id} />
              </SectionContent>
            </PageSection>
            {/* Comments Section */}
            <PageSection>
              <SectionHeader title="Comments" />
              <SectionContent>
                <CommentList postId={id!} refreshKey={refreshKey} communityId={post.community_id} />
              </SectionContent>
            </PageSection>
            {/* Add Comment Form */}
            <PageSection>
              <SectionHeader title="Join the conversation" />
              <SectionContent>
                <AddCommentForm postId={id!} onCommentAdded={handleCommentAdded} />
              </SectionContent>
            </PageSection>
            {/* Related Posts - Mobile Only */}
            <div className="lg:hidden">
              <PageSection>
                <SectionHeader title="Related Posts" />
                <SectionContent>
                  <RelatedPosts currentPostId={post.id} communityId={post.community_id} tags={post.tags || []} />
                </SectionContent>
              </PageSection>
            </div>
          </div>
          {/* Sidebar Column (30%) */}
          <aside className="space-y-6">
            {/* Author Card */}
            <PageSection>
              <SectionHeader title="About the Author" />
              <SectionContent className="pb-4">
                <PostAuthorCard authorId={post.created_by} authorUsername={post.author_username} authorAvatar={post.author_avatar} communityName={post.community_name} communityId={post.community_id} />
              </SectionContent>
            </PageSection>
            {/* Related Posts - Desktop Only */}
            <div className="hidden lg:block">
              <PageSection>
                <SectionHeader title="Related Posts" />
                <SectionContent>
                  <RelatedPosts currentPostId={post.id} communityId={post.community_id} tags={post.tags || []} />
                </SectionContent>
              </PageSection>
            </div>
          </aside>
        </div>
      </PageLayout>
    </MainLayout>;
}