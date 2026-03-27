import { useState, useEffect } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from '@/communities/utils/safeFetch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { Button } from '@/communities/components/ui/button';
import { Input } from '@/communities/components/ui/input';
import { Label } from '@/communities/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/communities/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';
import { TagAutocomplete } from './TagAutocomplete';
import { Loader2, X, Plus, FileText, Image as ImageIcon, BarChart3, Calendar, MapPin, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Community {
  id: string;
  name: string;
}
interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
  communityId?: string;
}
type PostType = 'text' | 'media' | 'poll' | 'event';

// ── Module-level helpers ──────────────────────────────────────────────────────

interface TypeSpecificFields {
  mediaUrl: string;
  pollOptions: string[];
  eventStart: string;
  eventLocation: string;
}

function validateTypeSpecificFields(postType: PostType, fields: TypeSpecificFields): string | null {
  if (postType === 'media' && !fields.mediaUrl.trim()) return 'Media URL is required for media posts'
  if (postType === 'poll') {
    if (fields.pollOptions.filter(o => o.trim()).length < 2) return 'At least 2 poll options are required'
  }
  if (postType === 'event') {
    if (!fields.eventStart) return 'Event start date/time is required'
    if (!fields.eventLocation.trim()) return 'Event location is required'
  }
  return null
}

interface MetadataFields {
  mediaUrl: string; caption: string; pollDuration: string;
  eventStart: string; eventEnd: string; eventLocation: string; eventImage: string; rsvpLimit: string;
}

function buildPostMetadata(postType: PostType, f: MetadataFields): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}
  if (postType === 'media') { metadata.media_url = f.mediaUrl; metadata.caption = f.caption }
  if (postType === 'poll') { metadata.poll_duration_days = parseInt(f.pollDuration) }
  if (postType === 'event') {
    metadata.start_datetime = f.eventStart
    if (f.eventEnd) metadata.end_datetime = f.eventEnd
    metadata.location = f.eventLocation
    if (f.eventImage) metadata.image = f.eventImage
    if (f.rsvpLimit) metadata.rsvp_limit = parseInt(f.rsvpLimit)
  }
  return metadata
}

// ── Tab sub-components ────────────────────────────────────────────────────────

interface MediaPostTabProps {
  mediaUrl: string; caption: string; submitting: boolean;
  onMediaUrlChange: (v: string) => void; onCaptionChange: (v: string) => void;
}
function MediaPostTab({ mediaUrl, caption, submitting, onMediaUrlChange, onCaptionChange }: MediaPostTabProps) {
  return (
    <TabsContent value="media" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mediaUrl" className="flex items-center gap-2"><ImageIcon className="h-4 w-4" />Media URL *</Label>
        <Input id="mediaUrl" value={mediaUrl} onChange={e => onMediaUrlChange(e.target.value)} placeholder="https://example.com/image.jpg" disabled={submitting} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="caption">Caption (Optional)</Label>
        <Input id="caption" value={caption} onChange={e => onCaptionChange(e.target.value)} placeholder="Add a caption..." disabled={submitting} />
      </div>
    </TabsContent>
  )
}

interface PollPostTabProps {
  pollOptions: string[]; pollDuration: string; submitting: boolean;
  onAddOption: () => void; onRemoveOption: (i: number) => void;
  onOptionChange: (i: number, v: string) => void; onDurationChange: (v: string) => void;
}
function PollPostTab({ pollOptions, pollDuration, submitting, onAddOption, onRemoveOption, onOptionChange, onDurationChange }: PollPostTabProps) {
  return (
    <TabsContent value="poll" className="space-y-4">
      <div className="space-y-2">
        <Label>Poll Options</Label>
        {pollOptions.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input value={option} onChange={e => onOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} disabled={submitting} maxLength={200} />
            {pollOptions.length > 2 && (
              <Button type="button" variant="outline" size="icon" onClick={() => onRemoveOption(index)} disabled={submitting}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {pollOptions.length < 5 && (
          <Button type="button" variant="outline" onClick={onAddOption} disabled={submitting} className="w-full">
            <Plus className="h-4 w-4 mr-2" />Add Option
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="pollDuration">Poll Duration (Days)</Label>
        <Select value={pollDuration} onValueChange={onDurationChange} disabled={submitting}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Day</SelectItem>
            <SelectItem value="3">3 Days</SelectItem>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="14">14 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TabsContent>
  )
}

interface EventPostTabProps {
  eventStart: string; eventEnd: string; eventLocation: string; eventImage: string; rsvpLimit: string; submitting: boolean;
  onStartChange: (v: string) => void; onEndChange: (v: string) => void; onLocationChange: (v: string) => void;
  onImageChange: (v: string) => void; onRsvpChange: (v: string) => void;
}
function EventPostTab({ eventStart, eventEnd, eventLocation, eventImage, rsvpLimit, submitting, onStartChange, onEndChange, onLocationChange, onImageChange, onRsvpChange }: EventPostTabProps) {
  return (
    <TabsContent value="event" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventStart">Start Date/Time *</Label>
          <Input id="eventStart" type="datetime-local" value={eventStart} onChange={e => onStartChange(e.target.value)} disabled={submitting} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventEnd">End Date/Time</Label>
          <Input id="eventEnd" type="datetime-local" value={eventEnd} onChange={e => onEndChange(e.target.value)} disabled={submitting} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="eventLocation" className="flex items-center gap-2"><MapPin className="h-4 w-4" />Location *</Label>
        <Input id="eventLocation" value={eventLocation} onChange={e => onLocationChange(e.target.value)} placeholder="Event location..." disabled={submitting} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eventImage">Cover Image URL</Label>
        <Input id="eventImage" value={eventImage} onChange={e => onImageChange(e.target.value)} placeholder="https://example.com/event-cover.jpg" disabled={submitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rsvpLimit">RSVP Limit (Optional)</Label>
        <Input id="rsvpLimit" type="number" value={rsvpLimit} onChange={e => onRsvpChange(e.target.value)} placeholder="Max attendees..." disabled={submitting} min="1" />
      </div>
    </TabsContent>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function PostComposer({
  open,
  onOpenChange,
  onPostCreated,
  communityId: initialCommunityId
}: PostComposerProps) {
  const { user, isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState('7');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [rsvpLimit, setRsvpLimit] = useState('');

  const titleCharCount = title.length;
  const contentCharCount = content.length;

  useEffect(() => {
    if (open && user) {
      fetchUserCommunities();
      if (initialCommunityId) setCommunityId(initialCommunityId);
    }
  }, [open, user, isAuthenticated, initialCommunityId]);

  useEffect(() => { if (!open) resetForm(); }, [open]);

  const resetForm = () => {
    setPostType('text'); setTitle(''); setContent(''); setContentHtml('');
    setTags([]); setTagInput(''); setMediaUrl(''); setCaption('');
    setPollOptions(['', '']); setPollDuration('7');
    setEventStart(''); setEventEnd(''); setEventLocation(''); setEventImage(''); setRsvpLimit('');
    if (!initialCommunityId) setCommunityId('');
  };

  const fetchUserCommunities = async () => {
    if (!user) return;
    setLoading(true);
    const { data: memberships, error: membershipsError } = await supabase.from('memberships').select('community_id').eq('user_id', user.id);
    if (membershipsError) { toast.error('Failed to load your communities'); setLoading(false); return; }
    const communityIds = memberships?.map(m => m.community_id) || [];
    if (communityIds.length === 0) { setCommunities([]); setLoading(false); return; }
    const query = supabase.from('communities').select('id, name').in('id', communityIds);
    const [data, error] = await safeFetch(query);
    if (error) toast.error('Failed to load your communities');
    else if (data) setCommunities(data as Community[]);
    setLoading(false);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length >= 5) { toast.error('Maximum 5 poll options allowed'); return; }
    setPollOptions([...pollOptions, '']);
  };
  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length <= 2) { toast.error('Minimum 2 poll options required'); return; }
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };
  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions]; newOptions[index] = value; setPollOptions(newOptions);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) { toast.error('Title is required'); return false; }
    if (title.length > 100) { toast.error('Title must be 100 characters or less'); return false; }
    if (!content.trim()) { toast.error('Content is required'); return false; }
    if (content.length > 1000) { toast.error('Content must be 1000 characters or less'); return false; }
    if (!communityId) { toast.error('Please select a community'); return false; }
    const typeError = validateTypeSpecificFields(postType, { mediaUrl, pollOptions, eventStart, eventLocation });
    if (typeError) { toast.error(typeError); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please wait for authentication to complete'); return; }
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (!user?.id) {
        toast.error('Unable to verify authentication. Please sign in again.');
        setSubmitting(false); return;
      }
      let postContent = contentHtml || content;
      if (postType === 'media' && mediaUrl) {
        const mediaHtml = `<div class="media-content"><img src="${mediaUrl.trim()}" alt="${caption || 'Media'}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 12px;" />${caption ? `<p class="text-sm text-gray-600 mt-2">${caption}</p>` : ''}</div>`;
        postContent = postContent ? `${postContent}\n${mediaHtml}` : mediaHtml;
      }
      const query = supabase.from('posts_v2').insert({ title: title.trim(), content: postContent.trim(), community_id: communityId, user_id: user.id }).select().single();
      const [postData, postError] = await safeFetch(query);
      if (postError || !postData) {
        toast.error(postError?.message || 'Failed to create post', { description: postError?.details || postError?.hint || 'Please check all required fields and try again', duration: 5000 });
        setSubmitting(false); return;
      }
      if (postType === 'poll' && postData) {
        const optionsToInsert = pollOptions.filter(o => o.trim()).map(option => ({ post_id: postData.id, option_text: option.trim(), vote_count: 0 }));
        const [, optionsError] = await safeFetch(supabase.from('poll_options').insert(optionsToInsert));
        if (optionsError) toast.error('Post created but poll options failed', { description: optionsError?.message || 'Poll options could not be added', duration: 5000 });
      }
      toast.success('Post created successfully!');
      resetForm(); onPostCreated(); onOpenChange(false);
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Failed to create post');
    }
    setSubmitting(false);
  };

  const isFormValid = title.trim() && content.trim() && communityId && !submitting;

  if (!user && loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>Please wait while we verify your authentication.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Authentication Required</DialogTitle>
            <DialogDescription>You need to be signed in to create posts. Redirecting to sign in...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
            <DialogDescription>Share your thoughts, media, polls, or events with your community</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={postType} onValueChange={value => setPostType(value as PostType)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted h-auto p-1">
                <TabsTrigger value="text" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><FileText className="h-4 w-4" />Text</TabsTrigger>
                <TabsTrigger value="media" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><ImageIcon className="h-4 w-4" />Media</TabsTrigger>
                <TabsTrigger value="poll" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><BarChart3 className="h-4 w-4" />Poll</TabsTrigger>
                <TabsTrigger value="event" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Calendar className="h-4 w-4" />Event</TabsTrigger>
              </TabsList>

              {/* Common Fields */}
              <div className="space-y-4 mt-4">
                {!initialCommunityId && (
                  <div className="space-y-2">
                    <Label htmlFor="community">Community</Label>
                    <Select value={communityId} onValueChange={setCommunityId} disabled={loading || submitting}>
                      <SelectTrigger id="community"><SelectValue placeholder="Select a community" /></SelectTrigger>
                      <SelectContent>
                        {communities.map(community => <SelectItem key={community.id} value={community.id}>{community.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {communities.length === 0 && !loading && <p className="text-sm text-muted-foreground">Join a community first to create posts</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-muted-foreground text-xs">({titleCharCount}/100)</span></Label>
                  <Input id="title" placeholder="Enter post title..." value={title} onChange={e => setTitle(e.target.value)} required disabled={submitting} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content <span className="text-muted-foreground text-xs">({contentCharCount}/1000)</span></Label>
                  <RichTextEditor content={contentHtml} onUpdate={(html, text) => { setContentHtml(html); setContent(text); }} placeholder="What's on your mind?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2"><TagIcon className="h-4 w-4" />Tags (Optional)</Label>
                  <TagAutocomplete selectedTags={tags} onTagsChange={setTags} maxTags={5} />
                </div>
              </div>

              {/* Type-specific tab content */}
              <MediaPostTab mediaUrl={mediaUrl} caption={caption} submitting={submitting} onMediaUrlChange={setMediaUrl} onCaptionChange={setCaption} />
              <PollPostTab pollOptions={pollOptions} pollDuration={pollDuration} submitting={submitting} onAddOption={handleAddPollOption} onRemoveOption={handleRemovePollOption} onOptionChange={handlePollOptionChange} onDurationChange={setPollDuration} />
              <EventPostTab eventStart={eventStart} eventEnd={eventEnd} eventLocation={eventLocation} eventImage={eventImage} rsvpLimit={rsvpLimit} submitting={submitting} onStartChange={setEventStart} onEndChange={setEventEnd} onLocationChange={setEventLocation} onImageChange={setEventImage} onRsvpChange={setRsvpLimit} />
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={!isFormValid || submitting}>
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Post'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
