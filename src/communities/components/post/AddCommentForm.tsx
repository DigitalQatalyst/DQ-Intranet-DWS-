import React, { useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { Textarea } from '@/communities/components/ui/textarea';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
interface AddCommentFormProps {
  postId: string;
  communityId?: string;
  isMember?: boolean;
  onCommentAdded: () => void;
}
export function AddCommentForm({
  postId,
  communityId,
  isMember = false,
  onCommentAdded
}: AddCommentFormProps) {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      return;
    }
    
    if (!isMember) {
      toast.error('You must be a member of this community to comment');
      return;
    }
    
    setSubmitting(true);
    // Get auth user ID directly from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || user?.id;
    
    if (!userId) {
      toast.error('Unable to identify user. Please sign in again.');
      setSubmitting(false);
      return;
    }
    
    const query = supabase.from('comments').insert({
      post_id: postId,
      content: content.trim(),
      created_by: userId,
      status: 'active'
    });
    const [, error] = await safeFetch(query);
    if (error) {
      toast.error('Failed to add comment');
    } else {
      toast.success('Comment added!');
      setContent('');
      onCommentAdded();
      // Scroll to bottom after a short delay to allow new comment to render
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
    setSubmitting(false);
  };
  
  if (!isAuthenticated) {
    return (
      <>
        <div className="text-center py-6">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Sign In to Comment
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please sign in to join the conversation
          </p>
          <Button onClick={() => setShowSignInModal(true)}>
            Sign In
          </Button>
        </div>
        <SignInModal
          open={showSignInModal}
          onOpenChange={setShowSignInModal}
          onSuccess={() => {
            setShowSignInModal(false);
          }}
          title="Sign In to Comment"
          description="You need to be signed in to comment on posts."
        />
      </>
    );
  }
  
  if (!isMember) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          Join the conversation
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Join this community to share your thoughts and connect with others
        </p>
      </div>
    );
  }
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea id="comment" value={content} onChange={e => setContent(e.target.value)} placeholder="Share your thoughts..." className="w-full min-h-[120px]" disabled={submitting} required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </> : 'Post Comment'}
        </Button>
      </div>
    </form>;
}