import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { safeFetch } from "../utils/safeFetch";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RichTextEditor } from "../components/post/RichTextEditor";
import { MediaUploader } from "../components/post/MediaUploader";
import {
  Calendar,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  Send,
  X,
  MapPin,
  Tag,
  FileText,
  Lightbulb,
  Plus,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MainLayout } from "../components/layout/MainLayout";
type PostType = "text" | "media" | "poll";
interface Community {
  id: string;
  name: string;
}
interface UploadedFile {
  id: string;
  url: string;
  type: string;
  size: number;
  caption?: string;
  order: number;
}
export default function CreatePost() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postType, setPostType] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);

  // Media specific
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Poll specific
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollDuration, setPollDuration] = useState("7");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [articleMode, setArticleMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  useEffect(() => {
    if (!user) {
      navigate("/community");
      return;
    }
    fetchCommunities();
    loadDraftFromParams();

    // Edit mode
    if (id) {
      setIsEditMode(true);
      fetchPost();
    }

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (title.trim() && content.trim() && communityId) {
        saveToLocalStorage();
      }
    }, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [id, user]);

  // Load draft from URL params or localStorage
  const loadDraftFromParams = () => {
    const communityParam =
      searchParams.get("communityId") || searchParams.get("community");

    // Try loading from localStorage first (from inline composer)
    const savedDraft = localStorage.getItem("post-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only load if less than 1 hour old
        if (draft.timestamp && Date.now() - draft.timestamp < 3600000) {
          setTitle(draft.title || "");
          setContent(draft.content || "");
          setPostType(draft.postType || "text");
          if (draft.communityId) {
            setCommunityId(draft.communityId);
          }
        }
        localStorage.removeItem("post-draft");
      } catch (e) {
        // Failed to load draft, continue with empty form
      }
    }

    // Community ID from URL takes precedence
    if (communityParam) {
      setCommunityId(communityParam);
    }
  };
  const fetchCommunities = async () => {
    if (!user) return;
    // Fetch all communities from communities table
    const query = supabase
      .from("communities")
      .select("id, name")
      .order("name", { ascending: true });
    const [data, error] = await safeFetch(query);
    if (!error && data) {
      setCommunities(data);
    }
  };
  const saveToLocalStorage = useCallback(() => {
    const draftData = {
      postType,
      title,
      content,
      contentHtml,
      tags,
      communityId,
      uploadedFiles,
      pollQuestion,
      pollOptions,
      pollDuration,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("post-draft", JSON.stringify(draftData));
    setLastSaved(new Date());
  }, [
    postType,
    title,
    content,
    contentHtml,
    tags,
    communityId,
    uploadedFiles,
    pollQuestion,
    pollOptions,
    pollDuration,
  ]);
  const loadFromLocalStorage = () => {
    const draft = localStorage.getItem("post-draft");
    if (draft && !id) {
      const data = JSON.parse(draft);
      setPostType(data.postType || "text");
      setTitle(data.title || "");
      setContent(data.content || "");
      setContentHtml(data.contentHtml || "");
      setTags(data.tags || []);
      setCommunityId(data.communityId || "");
      setUploadedFiles(data.uploadedFiles || []);
      setPollQuestion(data.pollQuestion || "");
      setPollOptions(data.pollOptions || ["", ""]);
      setPollDuration(data.pollDuration || "7");
    }
  };
  const clearDraft = () => {
    localStorage.removeItem("post-draft");
  };
  const fetchPost = async () => {
    if (!id) return;
    const query = supabase.from("posts_v2").select("*").eq("id", id).single();
    const [data, error] = await safeFetch(query);
    if (!error && data) {
      setTitle(data.title || "");
      setContent(data.content || "");
      setContentHtml(data.content_html || "");
      setPostType((data.post_type || "text") as PostType);
      setTags(data.tags || []);
      setCommunityId(data.community_id || "");

      // Load metadata
      const metadata = data.metadata || {};
      setPollQuestion(data.title || "");
      setPollDuration(metadata.poll_duration_days?.toString() || "7");

    } else {
      toast.error("Failed to load post");
      navigate("/feed");
    }
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      if (tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.length > 150) {
      errors.title = "Title must be 150 characters or less";
    }
    if (!communityId) {
      errors.community = "Please select a community";
    }
    if (tags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }

    // Type-specific validation
    if (postType === "text" && !content.trim()) {
      errors.content = "Content is required";
    }
    if (postType === "media") {
      if (uploadedFiles.length === 0) {
        errors.media = "Please upload at least one file";
      }
    }
    if (postType === "poll") {
      if (!pollQuestion.trim()) {
        errors.pollQuestion = "Poll question is required";
      }
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        errors.pollOptions = "At least 2 poll options are required";
      }
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };
  const handlePublish = async () => {
    if (!validateForm()) {
      setIsPublishing(false);
      return;
    }
    if (!user) {
      toast.error("Please sign in to create a post");
      setIsPublishing(false);
      return;
    }
    setIsPublishing(true);
    try {
      await savePost("active");
      clearDraft(); // Clear localStorage draft on publish
      // Navigation is handled in savePost function
    } catch (error) {
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };
  const savePost = async (status: "active" | "deleted" | "flagged") => {
    if (!user) return;
    setLoading(true);

    // Build metadata based on post type
    const metadata: any = {};
    if (postType === "poll") {
      metadata.poll_duration_days = parseInt(pollDuration);
      metadata.poll_question = pollQuestion;
    }
    const postData: any = {
      title: title.trim(),
      content: postType === "poll" ? pollQuestion.trim() : content.trim(),
      content_html: contentHtml,
      post_type: articleMode ? "article" : postType,
      tags,
      community_id: communityId,
      user_id: user.id, // Set user_id (trigger will sync to created_by)
      created_by: user.id, // Also set created_by explicitly for compatibility
      status,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
    };

    let query;
    if (isEditMode && id) {
      // First, verify the post exists and the user has permission to edit it
      const [existingPost, fetchError] = await safeFetch(
        supabase.from("posts_v2").select("id").eq("id", id).single()
      );

      if (fetchError || !existingPost) {
        toast.error("Failed to update post: Post not found or access denied");
        setLoading(false);
        return;
      }

      // If post exists, perform the update
      const postDataV2 = {
        title: title.trim(),
        content: postType === "poll" ? pollQuestion.trim() : content.trim()
      };
      query = supabase
        .from("posts_v2")
        .update(postDataV2)
        .eq("id", id)
        .select()
        .single();
    } else {
      // Use posts_v2 for new posts
      const postDataV2 = {
        community_id: communityId,
        user_id: user.id,
        title: title.trim(),
        content: postType === "poll" ? pollQuestion.trim() : content.trim()
      };
      query = supabase.from("posts_v2").insert([postDataV2]).select().single();
    }

    const [data, error] = await safeFetch(query);

    // If media post, save uploaded files to community_assets table
    if (!error && data && postType === "media" && uploadedFiles.length > 0) {
      const mediaFilesData = uploadedFiles.map((file) => ({
        post_id: data.id,
        community_id: communityId,
        user_id: user.id,
        asset_type: file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' : 'document',
        storage_path: file.id, // Use file.id which contains the storage path
        file_name: file.caption || 'uploaded-file',
        url: file.url, // Public URL for display
        mime_type: file.type,
        file_size: file.size,
        caption: file.caption || null,
      }));
      const [_, mediaError] = await safeFetch(
        supabase.from("community_assets").insert(mediaFilesData)
      );
      if (mediaError) {
        toast.error("Post created but failed to save media files: " + (mediaError.message || 'Unknown error'));
      }
    }

    // If poll, insert poll options
    if (!error && data && postType === "poll") {
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length >= 2) {
        const optionsData = validOptions.map((option) => ({
          post_id: data.id,
          option_text: option.trim(),
          vote_count: 0,
        }));
        const [_, pollError] = await safeFetch(
          supabase.from("poll_options").insert(optionsData)
        );
        if (pollError) {
          toast.error("Post created but failed to add poll options");
        }
      }
    }
      setLoading(false);
    if (error) {
      // Show detailed error message
      let errorMessage = isEditMode
        ? "Failed to update post"
        : "Failed to create post";
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.details) {
        errorMessage += ` - ${error.details}`;
      }
      if (error.hint) {
        errorMessage += ` Hint: ${error.hint}`;
      }
      toast.error(errorMessage, {
        duration: 5000
      });
      throw error; // Re-throw to be caught by handlePublish
    } else {
      toast.success("Your post has been published!");
      clearDraft();

      // Navigate back to community or post detail (use React Router navigate, not window.location)
      if (data) {
        navigate(`/post/${data.id}`);
      } else if (communityId) {
        navigate(`/community/${communityId}`);
      } else {
        navigate("/feed");
      }
    }
  };
  if (!user) {
    return null;
  }
  return (
    <MainLayout hidePageLayout>
      <div className="bg-gray-50 min-h-screen pb-24 border mx-auto">
        <div className="w-full max-w-full lg:max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {isEditMode ? "Edit Post" : "Create a New Post"}
            </h1>
            <p className="text-sm text-gray-700">
              Share your thoughts, showcase your work, or create an event
            </p>
          </div>

          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)] gap-6 w-full">
            {/* LEFT COLUMN - Form */}
            <div className="space-y-4 min-w-0">
              {/* Card 1: Post Type, Title, Tags */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Post Type & Basic Info
                </h2>

                <div className="space-y-4">
                  {/* Post Type Selector */}
                  <div>
                    <Label
                      htmlFor="postType"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Post Type
                    </Label>
                    <Select
                      value={postType}
                      onValueChange={(value) => setPostType(value as PostType)}
                    >
                      <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 ring-brand-teal focus:border-transparent transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="text">💬 Discussion</SelectItem>
                        <SelectItem value="media">🎨 Media</SelectItem>
                        <SelectItem value="poll">📊 Poll</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {postType === "text" &&
                        "Start a conversation with the community"}
                      {postType === "media" &&
                        "Share images, videos, or visual content"}
                      {postType === "poll" &&
                        "Ask the community for their opinion"}
                    </p>
                  </div>

                  {/* Article Mode Toggle (for text posts) */}
                  {postType === "text" && (
                    <div className="bg-dq-navy/10 border border-dq-navy/30 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Article Mode
                          </p>
                          <p className="text-xs text-gray-600">
                            {articleMode
                              ? "3,000 character limit for long-form content"
                              : "Switch for long-form articles (3,000 chars)"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={articleMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setArticleMode(!articleMode)}
                        >
                          {articleMode ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Community Selection */}
                  <div>
                    <Label
                      htmlFor="community"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Community <span className="text-red-500">*</span>
                    </Label>
                    <Select value={communityId} onValueChange={setCommunityId}>
                      <SelectTrigger
                        className={`border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-dq-navy focus:border-dq-navy transition-all duration-200 ${
                          validationErrors.community
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <SelectValue placeholder="Select a community" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.community && (
                      <p className="text-xs text-red-600 mt-1">
                        {validationErrors.community}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700 mb-1 block"
                    >
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (validationErrors.title) {
                          const newErrors = {
                            ...validationErrors,
                          };
                          delete newErrors.title;
                          setValidationErrors(newErrors);
                        }
                      }}
                      placeholder="Give your post a compelling title..."
                      maxLength={200}
                      className={`border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-dq-navy focus:border-dq-navy transition-all duration-200 ${
                        validationErrors.title
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {validationErrors.title && (
                      <p className="text-xs text-red-600 mt-1">
                        {validationErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <Label
                      htmlFor="tags"
                      className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      Tags
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add a tag..."
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-dq-navy focus:border-dq-navy transition-all duration-200"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-dq-navy/10 text-dq-navy rounded-full px-3 py-1 text-xs font-medium hover:bg-dq-navy/20 transition-all duration-200"
                          >
                            #{tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:opacity-70 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p
                      className={`text-xs mt-2 ${
                        tags.length >= 5
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {tags.length}/5 tags{" "}
                      {tags.length >= 5 && "• Maximum reached"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Rich Text Editor */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content <span className="text-red-500">*</span>
                </h2>

                <RichTextEditor
                  content={contentHtml}
                  onUpdate={(html, text) => {
                    setContentHtml(html);
                    setContent(text);
                    if (validationErrors.content) {
                      const newErrors = {
                        ...validationErrors,
                      };
                      delete newErrors.content;
                      setValidationErrors(newErrors);
                    }
                  }}
                  placeholder="Share your thoughts, insights, or details..."
                  maxLength={articleMode ? 3000 : 1500}
                  mode={articleMode ? "long" : "short"}
                  onModeChange={(mode) => {
                    if (mode === "long" && !articleMode) {
                      setArticleMode(true);
                      toast.success(
                        "Switched to Article Mode (3,000 character limit)"
                      );
                    }
                  }}
                />

                {validationErrors.content && (
                  <p className="text-xs text-red-600 mt-1">
                    {validationErrors.content}
                  </p>
                )}

                {lastSaved && (
                  <p className="text-xs text-gray-500 mt-2">
                    💾 Draft auto-saved at {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Card 3: Type-Specific Fields */}
              {postType === "media" && (
                <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Media Upload <span className="text-red-500">*</span>
                  </h2>

                  <MediaUploader
                    files={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                    userId={user.id}
                    maxFiles={5}
                  />

                  {validationErrors.media && (
                    <p className="text-xs text-red-600 mt-2">
                      {validationErrors.media}
                    </p>
                  )}
                </div>
              )}

              {postType === "poll" && (
                <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Poll Details
                  </h2>

                  <div className="space-y-4">
                    {/* Poll Question */}
                    <div>
                      <Label
                        htmlFor="pollQuestion"
                        className="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Poll Question <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pollQuestion"
                        value={pollQuestion}
                        onChange={(e) => {
                          setPollQuestion(e.target.value);
                          if (validationErrors.pollQuestion) {
                            const newErrors = {
                              ...validationErrors,
                            };
                            delete newErrors.pollQuestion;
                            setValidationErrors(newErrors);
                          }
                        }}
                        placeholder="What would you like to ask?"
                        maxLength={150}
                        className={
                          validationErrors.pollQuestion ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.pollQuestion && (
                        <p className="text-xs text-red-600 mt-1">
                          {validationErrors.pollQuestion}
                        </p>
                      )}
                    </div>

                    {/* Poll Options */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Options <span className="text-red-500">*</span> (Min 2,
                        Max 5)
                      </Label>
                      {validationErrors.pollOptions && (
                        <p className="text-xs text-red-600 mb-2">
                          {validationErrors.pollOptions}
                        </p>
                      )}
                      <div className="space-y-3">
                        {pollOptions.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...pollOptions];
                                newOptions[index] = e.target.value;
                                setPollOptions(newOptions);
                              }}
                              placeholder={`Option ${index + 1}`}
                              maxLength={100}
                              className="border border-gray-300 rounded-md"
                            />
                            {pollOptions.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setPollOptions(
                                    pollOptions.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {pollOptions.length < 5 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPollOptions([...pollOptions, ""])}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Poll Duration */}
                    <div>
                      <Label
                        htmlFor="pollDuration"
                        className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Poll Duration
                      </Label>
                      <Select
                        value={pollDuration}
                        onValueChange={setPollDuration}
                      >
                        <SelectTrigger className="border border-gray-300 rounded-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN - Preview & Tips */}
            <div className="space-y-4 lg:sticky lg:top-20 self-start min-w-0">
              {/* Live Preview */}
              {showPreview && (
                <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 h-[calc(100vh-200px)] overflow-y-auto">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview
                  </h2>

                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="mb-2">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {postType.charAt(0).toUpperCase() + postType.slice(1)}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 break-words">
                      {title || "Untitled Post"}
                    </h3>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {contentHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed break-words"
                        dangerouslySetInnerHTML={{
                          __html: contentHtml,
                        }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">No content yet...</p>
                    )}

                    {postType === "media" && uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={file.id}>
                            {file.type.startsWith("image/") ? (
                              <img
                                src={file.url}
                                alt={file.caption || `Media ${index + 1}`}
                                className="rounded-lg max-h-64 w-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                  Video file
                                </p>
                              </div>
                            )}
                            {file.caption && (
                              <p className="text-sm text-gray-600 mt-2">
                                {file.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {postType === "poll" && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Poll Options:
                        </p>
                        {pollOptions
                          .filter((opt) => opt.trim())
                          .map((option, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 border border-gray-200 rounded-lg p-2 text-sm"
                            >
                              {option}
                            </div>
                          ))}
                        <p className="text-xs text-gray-500">
                          Duration: {pollDuration} days
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* Quick Tips Card */}
              <div
                className="rounded-md p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
              >
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Quick Tips
                </h3>
                <ul className="space-y-1.5 text-xs text-white/90">
                  <li>• Use a clear, descriptive title</li>
                  <li>• Add relevant tags to help others find your post</li>
                  <li>• Format your content using the editor toolbar</li>
                  <li>• Your draft auto-saves every 30 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 shadow-md z-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel? Your draft will be saved."
                  )
                ) {
                  saveToLocalStorage();
                  navigate("/feed");
                }
              }}
              disabled={isPublishing}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md px-4 py-2 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePublish();
              }}
              disabled={
                isPublishing || !title.trim() || !content.trim() || !communityId
              }
              className="w-full sm:w-auto font-semibold rounded-md px-5 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 bg-dq-navy hover:bg-[#13285A] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              {isPublishing
                ? "Publishing..."
                : isEditMode
                ? "Update Post"
                : "Publish Post"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
