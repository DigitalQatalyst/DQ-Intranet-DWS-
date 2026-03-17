import React, { useEffect, useState } from 'react';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { BarChart3, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { Progress } from '@/communities/components/ui/progress';
import { addDays, format, isPast } from 'date-fns';
interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
}
interface PollPostContentProps {
  postId: string;
  metadata?: {
    poll_duration_days?: number;
    end_date?: string;
  };
  content?: string;
  content_html?: string;
}
export function PollPostContent({
  postId,
  metadata,
  content,
  content_html
}: PollPostContentProps) {
  const {
    user
  } = useAuth();
  const [options, setOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pollEnded, setPollEnded] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const pollDurationDays = metadata?.poll_duration_days || 7;
  useEffect(() => {
    fetchPollOptions();
    checkUserVote();
    calculatePollEndDate();
  }, [postId]);
  const calculatePollEndDate = async () => {
    if (metadata?.end_date) {
      const date = new Date(metadata.end_date);
      setEndDate(date);
      setPollEnded(isPast(date));
      return;
    }
    // If no end_date in metadata, calculate based on post creation date
    const {
      data
    } = await supabase.from('posts').select('created_at').eq('id', postId).single();
    if (data) {
      const createdAt = new Date(data.created_at);
      const calculatedEndDate = addDays(createdAt, pollDurationDays);
      setEndDate(calculatedEndDate);
      setPollEnded(isPast(calculatedEndDate));
    }
  };
  const fetchPollOptions = async () => {
    setLoading(true);
    setError(null);
    const query = supabase.from('poll_options').select('*').eq('post_id', postId).order('id', {
      ascending: true
    });
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load poll options');
      setLoading(false);
      return;
    }
    if (data && data.length > 0) {
      setOptions(data);
      const total = data.reduce((sum: number, option: PollOption) => sum + (option.vote_count || 0), 0);
      setTotalVotes(total);
    } else {
      setError('No poll options found');
    }
    setLoading(false);
  };
  const checkUserVote = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('poll_votes').select('option_id').eq('post_id', postId).eq('user_id', user.id).single();
    if (data) {
      setUserVote(data.option_id);
    }
  };
  const handleVote = async (optionId: string) => {
    if (!user) {
      setError('Please sign in to vote');
      return;
    }
    if (pollEnded) {
      setError('This poll has ended');
      return;
    }
    if (userVote) {
      setError('You have already voted in this poll');
      return;
    }
    // Insert vote record
    const {
      error: voteError
    } = await supabase.from('poll_votes').insert({
      post_id: postId,
      user_id: user.id,
      option_id: optionId
    });
    if (voteError) {
      setError('Failed to submit your vote');
      return;
    }
    // Update option vote count
    const {
      error: updateError
    } = await supabase.rpc('increment_poll_vote', {
      option_id_param: optionId
    });
    if (updateError) {
      setError('Vote recorded but count not updated');
    }
    // Update local state
    setUserVote(optionId);
    setOptions(options.map(option => option.id === optionId ? {
      ...option,
      vote_count: (option.vote_count || 0) + 1
    } : option));
    setTotalVotes(prev => prev + 1);
  };
  const getVotePercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round(count / totalVotes * 100);
  };
  if (loading) {
    return <div className="space-y-4">
        <div className="bg-gray-50 animate-pulse h-32 rounded-lg"></div>
        <div className="bg-gray-50 animate-pulse h-8 w-3/4 rounded-lg"></div>
      </div>;
  }
  if (error && options.length === 0) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-sm text-red-700">{error}</p>
      </div>;
  }
  return <div className="space-y-6">
      {/* Poll Question/Context */}
      {(content || content_html) && <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          {content_html ? <div dangerouslySetInnerHTML={{
        __html: content_html
      }} /> : <p className="whitespace-pre-wrap leading-relaxed">{content}</p>}
        </div>}

      {/* Poll Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Poll Results</h3>
          </div>
          {endDate && <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {pollEnded ? <span>Ended on {format(endDate, 'MMM d, yyyy')}</span> : <span>Ends on {format(endDate, 'MMM d, yyyy')}</span>}
            </div>}
        </div>

        <div className="space-y-3">
          {options.map(option => {
          const percentage = getVotePercentage(option.vote_count || 0);
          const isSelected = userVote === option.id;
          return <div key={option.id} className={`rounded-lg border ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'} p-3 transition-colors`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {isSelected && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                    <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                      {option.option_text}
                    </span>
                  </div>
                  {(userVote || pollEnded) && <span className="text-sm font-medium text-gray-700">
                      {percentage}%
                    </span>}
                </div>
                {userVote || pollEnded ? <Progress value={percentage} className={`h-2 ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`} indicatorClassName={isSelected ? 'bg-blue-600' : 'bg-gray-400'} /> : <Button variant="outline" size="sm" className="w-full mt-1 text-sm" onClick={() => handleVote(option.id)}>
                    Vote
                  </Button>}
                {(userVote || pollEnded) && <p className="text-xs text-gray-500 mt-1">
                    {option.vote_count || 0}{' '}
                    {option.vote_count === 1 ? 'vote' : 'votes'}
                  </p>}
              </div>;
        })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>}

      {/* Poll Ended Message */}
      {pollEnded && <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            This poll has ended. No new votes can be submitted.
          </p>
        </div>}
    </div>;
}