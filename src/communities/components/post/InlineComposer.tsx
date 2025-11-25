import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/communities/components/ui/button';
import { Input } from '@/communities/components/ui/input';
import { Label } from '@/communities/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from '@/communities/utils/safeFetch';
import { toast } from 'sonner';
import { Send, Maximize2, Image, BarChart3, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/communities/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';
import { InlineMediaUpload } from './InlineMediaUpload';
import { PollOptionsInput } from './PollOptionsInput';
import { LinkPreview } from './LinkPreview';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { useCommunityMembership } from '@/communities/hooks/useCommunityMembership';
import { getCurrentUserId } from '@/communities/utils/userUtils';
interface InlineComposerProps {
  communityId?: string;
  isMember?: boolean;
  onPostCreated?: () => void;
}
type PostType = 'text' | 'media' | 'poll';
interface Community {
  id: string;
  name: string;
}
interface UploadedFile {
  id: string;
  url: string;
  type: string;
  caption?: string;
}
export const InlineComposer: React.FC<InlineComposerProps> = ({
  communityId,
  isMember: isMemberProp,
  onPostCreated
}) => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const { isMember: isMemberFromHook, loading: membershipLoading } = useCommunityMembership(communityId);
  // Use prop if provided, otherwise fall back to hook
  const isMember = isMemberProp !== undefined ? isMemberProp : isMemberFromHook;
  
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(communityId || '');
  const [communities, setCommunities] = useState<Community[]>([]);

  // Media post state
  const [mediaFile, setMediaFile] = useState<UploadedFile | null>(null);

  // Poll post state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);


  // Link preview state
  const [detectedLink, setDetectedLink] = useState<string | null>(null);
  const [showLinkPreview, setShowLinkPreview] = useState(true);
  useEffect(() => {
    if (!communityId) {
      // Fetch communities for authenticated users
      fetchCommunities();
    }
  }, [communityId]);

  // Autosave draft
  useEffect(() => {
    const draftKey = `inline-draft-${communityId || 'global'}-${postType}`;
    const timer = setTimeout(() => {
      if (title || content || pollQuestion) {
        const draft = {
          postType,
          title,
          content,
          contentHtml,
          pollQuestion,
          pollOptions,
          timestamp: Date.now()
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content, contentHtml, pollQuestion, pollOptions, postType, communityId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `inline-draft-${communityId || 'global'}-${postType}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          // 24h expiry
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setContentHtml(draft.contentHtml || '');
          setPollQuestion(draft.pollQuestion || '');
          setPollOptions(draft.pollOptions || ['', '']);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, [postType, communityId]);

  // Link detection
  useEffect(() => {
    if (postType === 'text' && content) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = content.match(urlRegex);
      if (match && match[0]) {
        setDetectedLink(match[0]);
      } else {
        setDetectedLink(null);
      }
    }
  }, [content, postType]);
  const fetchCommunities = async () => {
    if (!isAuthenticated || !user) {
      setCommunities([]);
      return;
    }
    
    // Get authenticated user ID
    const userId = getCurrentUserId(user);
    if (!userId) {
      setCommunities([]);
      return;
    }
    
    // Check memberships table only (optimized - single table query)
    const query = supabase
      .from('memberships')
      .select('community_id, communities(id, name)')
      .eq('user_id', userId);
    const [data] = await safeFetch(query);
    
    // Use memberships data directly
    const allMemberships = data || [];
    const communityMap = new Map();
    allMemberships.forEach((m: any) => {
      if (m.communities) {
        communityMap.set(m.communities.id, m.communities);
      }
    });
    setCommunities(Array.from(communityMap.values()));
  };
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      return;
    }
      
      const targetCommunityId = communityId || selectedCommunityId;
      if (!targetCommunityId) {
        toast.error('Please select a community');
        return;
      }
      
      // Get auth user ID directly from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.id || null;
      
      if (!userId) {
        toast.error('Unable to identify user. Please sign in again.');
        setShowSignInModal(true);
        return;
      }

    // Check if user is a member of the community
    if (!isMember) {
      toast.error('You must join the community before creating posts', {
        duration: 5000
      });
      // Navigate to community page to join (using React Router instead of window.location)
      setTimeout(() => {
        navigate(`/community/${targetCommunityId}`);
      }, 2000);
      return;
    }

    // Type-specific validation
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    // Content is optional for text posts - will default to title if empty
    if (postType === 'media' && !mediaFile) {
      toast.error('Please upload a file');
      return;
    }
    if (postType === 'poll') {
      // For polls, title is the poll question
      if (!title.trim() && !pollQuestion.trim()) {
        toast.error('Poll question is required');
        return;
      }
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error('Add at least two poll options');
        return;
      }
    }
    setSubmitting(true);
    try {
      // Prepare simplified post data for posts_v2
      // For text posts, use content if available, otherwise use title
      // This allows users to post with just a title
      const postContent = postType === 'text' 
        ? (content.trim() || title.trim()) 
        : title.trim();
      
      const postDataV2 = {
        community_id: targetCommunityId,
        user_id: userId,
        title: title.trim(),
        content: postContent
      };
      
      const {
        data: post,
        error: postError
      } = await supabase.from('posts_v2').insert(postDataV2).select().single();
      
      if (postError) {
        console.error('❌ Post insert error:', postError);
        console.error('❌ Error details:', {
          message: postError.message,
          details: postError.details,
          hint: postError.hint,
          code: postError.code
        });
        throw postError;
      }
      
      console.log('✅ Post created successfully:', post);

      // Clear form
      clearForm();

      // Clear draft
      const draftKey = `inline-draft-${communityId || 'global'}-${postType}`;
      localStorage.removeItem(draftKey);
      
      // Show success and trigger refresh
      toast.success('Post created successfully!');
      onPostCreated?.();
    } catch (error: any) {
      console.error('Error creating post:', error);
      const errorMessage = error.message || error.details || 'Unknown error occurred';
      toast.error(`Failed to create post: ${errorMessage}`, {
        duration: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };
  const clearForm = () => {
    setTitle('');
    setContent('');
    setContentHtml('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setMediaFile(null);
    setDetectedLink(null);
    if (!communityId) setSelectedCommunityId('');
  };
  const handleOpenFullEditor = () => {
    const targetCommunityId = communityId || selectedCommunityId;
    const draft = {
      title,
      content,
      contentHtml,
      postType,
      communityId: targetCommunityId,
      pollQuestion,
      pollOptions,
      timestamp: Date.now()
    };
    localStorage.setItem('post-draft', JSON.stringify(draft));
    const params = new URLSearchParams();
    if (targetCommunityId) params.set('communityId', targetCommunityId);
    params.set('type', postType);
    navigate(`/create-post?${params.toString()}`);
  };
  const handleRichTextUpdate = (html: string, text: string) => {
    setContentHtml(html);
    setContent(text);
  };
  const handleTypeChange = (newType: PostType) => {
    setPostType(newType);
    // Reset type-specific fields
    if (newType !== 'media') setMediaFile(null);
    if (newType !== 'poll') {
      setPollQuestion('');
      setPollOptions(['', '']);
    }
  };
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleQuickSubmit(e as any);
    }
  }, [isAuthenticated, user, isMember, communityId, selectedCommunityId, title, content, postType]);
  const isFormValid = () => {
    const targetCommunityId = communityId || selectedCommunityId;
    // Require community and title for all post types
    if (!targetCommunityId || !title.trim()) {
      return false;
    }
    switch (postType) {
      case 'text':
        // Allow text posts with just a title (content is optional for quick posts)
        // Content will default to title if empty during submission
        return true;
      case 'media':
        return mediaFile !== null;
      case 'poll':
        const pollQuestionValid = title.trim().length > 0 || pollQuestion.trim().length > 0;
        const pollOptionsValid = pollOptions.filter(opt => opt.trim()).length >= 2;
        return pollQuestionValid && pollOptionsValid;
      default:
        return false;
    }
  };
  const getPostButtonLabel = () => {
    switch (postType) {
      case 'media':
        return 'Post Media';
      case 'poll':
        return 'Post Poll';
      default:
        return 'Post';
    }
  };
  // Show composer only to authenticated users
  
  if (!isAuthenticated) {
    return (
      <>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In to Create Posts</h3>
          <p className="text-sm text-gray-600 mb-4">Please sign in to create posts in communities</p>
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
          title="Sign In to Create Posts"
          description="You need to be signed in to create posts in communities."
        />
      </>
    );
  }
  
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-dq-navy flex items-center justify-center text-white font-semibold">
          {user?.email?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Create a Post</h3>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleQuickSubmit(e);
        }} 
        onKeyDown={handleKeyDown} 
        className="space-y-4"
        noValidate
      >
        {/* Post Type Selector */}
        <Tabs value={postType} onValueChange={value => handleTypeChange(value as PostType)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="text" className="flex items-center gap-1.5">
              <span className="text-sm">Text</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5" />
              <span className="text-sm">Media</span>
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="text-sm">Poll</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Community Selection (only if not provided) */}
        {!communityId && <div>
            <Label htmlFor="community" className="text-sm font-medium text-gray-700 mb-1 block">
              Community <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
              <SelectTrigger className="border border-gray-300 rounded-md">
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {communities.map(community => <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>}

        {/* Title Input - All Types */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1 block">
            {postType === 'poll' ? 'Poll Question' : 'Title'} <span className="text-red-500">*</span>
          </Label>
          <Input id="title" placeholder={postType === 'poll' ? 'Ask a question...' : 'Post title...'} value={title} onChange={e => setTitle(e.target.value)} maxLength={150} className="text-base" />
        </div>

        {/* TYPE-SPECIFIC FIELDS */}
        
        {/* TEXT POST */}
        {postType === 'text' && <>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Content <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor content={contentHtml} onUpdate={handleRichTextUpdate} placeholder="Share your thoughts... Use #hashtags and @mentions" maxLength={1500} mode="short" />
              <p className="text-xs text-gray-500 mt-1">
                ⌘/Ctrl + Enter to post • Shift + Enter for new line
              </p>
            </div>

            {/* Link Preview */}
            {detectedLink && showLinkPreview && <LinkPreview url={detectedLink} onRemove={() => setShowLinkPreview(false)} />}
          </>}

        {/* MEDIA POST */}
        {postType === 'media' && <>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Upload File <span className="text-red-500">*</span>
              </Label>
              <InlineMediaUpload file={mediaFile} onFileChange={setMediaFile} userId={getCurrentUserId(user)} />
              <p className="text-xs text-gray-500 mt-1">
                Use full editor for multiple uploads
              </p>
            </div>
          </>}

        {/* POLL POST */}
        {postType === 'poll' && <>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Poll Options <span className="text-red-500">*</span>
              </Label>
              <PollOptionsInput options={pollOptions} onOptionsChange={setPollOptions} />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Duration: 7 days (default) • Use full editor for custom duration
              </p>
            </div>
          </>}


        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button type="button" variant="ghost" size="sm" onClick={handleOpenFullEditor} className="text-dq-navy hover:text-[#13285A] hover:bg-dq-navy/10">
            <Maximize2 className="h-4 w-4 mr-1.5" />
            Advanced options
          </Button>

          <Button 
            type="submit" 
            disabled={submitting || !isFormValid()} 
            className="bg-dq-navy hover:bg-[#13285A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : <>
                <Send className="h-4 w-4 mr-1.5" />
                {getPostButtonLabel()}
              </>}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};