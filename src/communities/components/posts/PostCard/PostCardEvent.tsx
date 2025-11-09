import React from 'react';
import { BasePost } from '../types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
interface PostCardEventProps {
  post: BasePost;
}
export const PostCardEvent: React.FC<PostCardEventProps> = ({
  post
}) => {
  const eventDate = post.event_date ? new Date(post.event_date) : null;
  const isPastEvent = eventDate && eventDate < new Date();
  return <div className="space-y-3">
      <div className="flex gap-3">
        {/* Date Badge */}
        {eventDate && <div className="flex-shrink-0 w-16 h-16 bg-dq-navy/10 border-2 border-dq-navy/30 rounded-lg flex flex-col items-center justify-center">
            <div className="text-xs font-semibold text-dq-navy uppercase">
              {format(eventDate, 'MMM')}
            </div>
            <div className="text-2xl font-bold text-dq-navy">
              {format(eventDate, 'd')}
            </div>
          </div>}
        
        <div className="flex-1 space-y-2">
          {/* Event Details */}
          <div className="space-y-1.5">
            {eventDate && <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-dq-navy" />
                <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                {!isPastEvent && <span className="text-xs text-dq-navy font-medium ml-1">
                    • {formatDistanceToNow(eventDate, {
                addSuffix: true
              })}
                  </span>}
              </div>}
            
            {post.event_location && <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-dq-navy" />
                <span className="truncate">{post.event_location}</span>
              </div>}
            
            {post.metadata?.rsvp_count && <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="h-4 w-4 text-dq-navy" />
                <span>{post.metadata.rsvp_count} attending</span>
              </div>}
          </div>
          
          {!isPastEvent && <Button size="sm" className="bg-dq-navy hover:bg-[#13285A] text-white" onClick={e => e.stopPropagation()}>
              Join Event
            </Button>}
        </div>
      </div>
      
      {post.content && <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>}
    </div>;
};