import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/communities/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { Badge } from '@/communities/components/ui/badge';
import { Button } from '@/communities/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/communities/components/ui/dropdown-menu';
import { ThumbsUp, Lightbulb, MessageSquare, MoreVertical, Flag, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
import { PostTypeBadge } from './PostTypeBadge';
import { BasePost } from '../types';
import { ModerationBadge } from '@/communities/components/moderation/ModerationBadge';
import { InlineModeratorControls } from '@/communities/components/moderation/InlineModeratorControls';
import { ReportModal } from '@/communities/components/moderation/ReportModal';
import { HiddenContentPlaceholder } from '@/communities/components/moderation/HiddenContentPlaceholder';
import { usePermissions } from '@/communities/hooks/usePermissions';
import { useAuth } from '@/communities/contexts/AuthProvider';
interface PostCardBaseProps {
  post: BasePost;
  children: ReactNode;
  onReaction: (type: 'helpful' | 'insightful') => void;
  hasReactedHelpful: boolean;
  hasReactedInsightful: boolean;
  helpfulCount: number;
  insightfulCount: number;
  highlightBorder?: boolean;
  onActionComplete?: () => void;
}
export const PostCardBase: React.FC<PostCardBaseProps> = ({
  post,
  children,
  onReaction,
  hasReactedHelpful,
  hasReactedInsightful,
  helpfulCount,
  insightfulCount,
  highlightBorder = false,
  onActionComplete
}) => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const permissions = usePermissions(post.community_id);
  const canModeratePosts = permissions.canModeratePosts;
  return <Card className={`shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-2xl overflow-hidden group ${highlightBorder ? 'border-2 border-amber-300' : 'border border-gray-100'}`}>
      <CardHeader className="p-4 pb-3 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={post.author_avatar} />
              <AvatarFallback className="p-0 overflow-hidden">
                <GradientAvatar seed={post.author_username} className="h-full w-full" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {post.created_by ? <Link to={`/profile/${post.created_by}`} className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors">
                    {post.author_username}
                  </Link> : <span className="font-semibold text-gray-900 text-sm">
                    {post.author_username}
                  </span>}
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0 font-medium">
                  {post.community_name}
                </Badge>
                <PostTypeBadge postType={post.post_type} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true
              })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Show moderation badge for non-active posts to moderators/admins */}
            {post.status !== 'active' && canModeratePosts && <ModerationBadge status={post.status as 'flagged' | 'deleted' | 'active'} />}
            
            {/* Show moderator toolbar if user can moderate */}
            {canModeratePosts && <InlineModeratorControls postId={post.id} communityId={post.community_id} currentStatus={post.status} onActionComplete={onActionComplete} />}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="hover:bg-gray-50">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Post
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 hover:bg-red-50" onClick={e => {
                e.stopPropagation();
                setShowReportModal(true);
              }}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200" onClick={() => navigate(`/post/${post.id}`)}>
        {post.status === 'flagged' || post.status === 'deleted' ? <HiddenContentPlaceholder contentType="post" canModerate={canModeratePosts}>
            <>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
                {post.title}
              </h3>
              
              {post.tags && post.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, idx) => <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                      #{tag}
                    </span>)}
                </div>}
              
              {children}
            </>
          </HiddenContentPlaceholder> : <>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">
              {post.title}
            </h3>
            
            {post.tags && post.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag, idx) => <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                    #{tag}
                  </span>)}
              </div>}
            
            {children}
          </>}
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <Button variant="ghost" size="sm" className={`h-auto py-1.5 px-3 text-xs gap-1.5 transition-all duration-200 rounded-md ${hasReactedHelpful ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 text-gray-600'}`} onClick={e => {
          e.stopPropagation();
          onReaction('helpful');
        }}>
            <ThumbsUp className={`h-3.5 w-3.5 ${hasReactedHelpful ? 'fill-current' : ''}`} />
            <span className="font-semibold">{helpfulCount}</span>
            <span>Helpful</span>
          </Button>
          <Button variant="ghost" size="sm" className={`h-auto py-1.5 px-3 text-xs gap-1.5 transition-all duration-200 rounded-md ${hasReactedInsightful ? 'bg-teal-500 text-white hover:bg-teal-600' : 'hover:bg-gray-100 text-gray-600'}`} onClick={e => {
          e.stopPropagation();
          onReaction('insightful');
        }}>
            <Lightbulb className={`h-3.5 w-3.5 ${hasReactedInsightful ? 'fill-current' : ''}`} />
            <span className="font-semibold">{insightfulCount}</span>
            <span>Insightful</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-3 text-xs gap-1.5 hover:bg-gray-100 text-gray-600 transition-all duration-200 rounded-md" onClick={e => {
          e.stopPropagation();
          navigate(`/post/${post.id}`);
        }}>
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-semibold">{post.comment_count || 0}</span>
            <span>Comments</span>
          </Button>
        </div>
      </CardFooter>
      
      {/* Report Modal */}
      <ReportModal open={showReportModal} onOpenChange={setShowReportModal} targetType="post" targetId={post.id} communityId={post.community_id} />
    </Card>;
};