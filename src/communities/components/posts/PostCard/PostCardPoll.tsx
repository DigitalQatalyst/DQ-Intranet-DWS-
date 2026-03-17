import React, { useEffect, useState } from 'react';
import { BasePost, PollOption } from '../types';
import { supabase } from '@/communities/integrations/supabase/client';
import { BarChart3, Clock } from 'lucide-react';
import { Badge } from '@/communities/components/ui/badge';
interface PostCardPollProps {
  post: BasePost;
}
export const PostCardPoll: React.FC<PostCardPollProps> = ({
  post
}) => {
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPollOptions();
  }, [post.id]);
  const fetchPollOptions = async () => {
    const {
      data
    } = await supabase.from('poll_options').select('*').eq('post_id', post.id).order('created_at', {
      ascending: true
    }).limit(2);
    if (data) {
      setPollOptions(data as PollOption[]);
    }
    setLoading(false);
  };
  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.vote_count, 0);
  const remainingOptions = pollOptions.length > 2 ? pollOptions.length - 2 : 0;
  return <div className="space-y-3">
      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
      
      {loading ? <div className="space-y-2">
          <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
        </div> : <>
          <div className="space-y-2">
            {pollOptions.slice(0, 2).map(option => <div key={option.id} className="p-3 border border-gray-200 rounded-md hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{option.option_text}</span>
                  <span className="text-xs text-gray-500">{option.vote_count} votes</span>
                </div>
              </div>)}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{totalVotes} total votes</span>
            </div>
            {remainingOptions > 0 && <Badge variant="outline" className="text-xs">
                +{remainingOptions} more option{remainingOptions > 1 ? 's' : ''}
              </Badge>}
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              <span>Tap to vote</span>
            </div>
          </div>
        </>}
    </div>;
};