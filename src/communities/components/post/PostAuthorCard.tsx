import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { Button } from '@/communities/components/ui/button';
import { UserPlus } from 'lucide-react';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
interface PostAuthorCardProps {
  authorId?: string;
  authorUsername: string;
  authorAvatar: string | null;
  communityName: string;
  communityId: string;
  postCount?: number;
}
export function PostAuthorCard({
  authorId,
  authorUsername,
  authorAvatar,
  communityName,
  communityId,
  postCount = 0
}: PostAuthorCardProps) {
  return <div className="flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={authorAvatar || undefined} />
          <AvatarFallback className="p-0 overflow-hidden">
            <GradientAvatar seed={authorUsername} className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          {authorId ? <Link to={`/profile/${authorId}`} className="font-semibold text-foreground hover:text-primary transition-colors truncate block">
              {authorUsername}
            </Link> : <h4 className="font-semibold text-foreground truncate">
              {authorUsername}
            </h4>}
          <Link to={`/community/${communityId}`} className="text-sm text-primary hover:underline transition-colors truncate block">
            {communityName}
          </Link>
          {postCount > 0 && <p className="text-xs text-muted-foreground mt-1">
              {postCount} posts in community
            </p>}
        </div>
      </div>
      <Button variant="outline" className="w-full" size="sm">
        <UserPlus className="h-4 w-4 mr-2" />
        Follow
      </Button>
    </div>;
}