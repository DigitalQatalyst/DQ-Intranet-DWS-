import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft, BarChart3, MessageSquare, MessageCircle, Heart, Share2, Clock, User, MapPin, Building } from "lucide-react";

interface PulseItem {
  id: string;
  title: string;
  description: string | null;
  type: 'poll' | 'survey' | 'feedback';
  status: string;
  department: string | null;
  location_filter: string | null;
  question: string | null;
  options: any[] | null;
  allow_multiple: boolean;
  anonymous: boolean;
  questions: any[] | null;
  survey_type: string | null;
  feedback_type: string | null;
  category: string | null;
  total_responses: number;
  total_views: number;
  total_likes: number;
  tags: string[] | null;
  image_url: string | null;
  created_by: string | null;
  created_by_name: string | null;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  closes_at: string | null;
  is_featured: boolean;
  is_pinned: boolean;
  allow_comments: boolean;
  visibility: string;
  response_count?: number;
  like_count?: number;
  comment_count?: number;
  is_closed?: boolean;
}

export const PulseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PulseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPulseItem = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from("pulse_items_with_stats")
          .select("*")
          .eq("id", id)
          .eq("status", "published")
          .single();

        if (queryError) {
          throw queryError;
        }

        if (!data) {
          throw new Error("Pulse item not found");
        }

        setItem(data);

        // Check if user has already responded (if authenticated)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: response } = await supabase
            .from("pulse_responses")
            .select("id")
            .eq("pulse_item_id", id)
            .eq("user_id", user.id)
            .single();

          if (response) {
            setHasResponded(true);
            // Load previous response
            const { data: responseData } = await supabase
              .from("pulse_responses")
              .select("response_data")
              .eq("id", response.id)
              .single();

            if (responseData?.response_data?.selected_options) {
              setSelectedOptions(responseData.response_data.selected_options);
            }
          }

          // Check if user has liked
          const { data: like } = await supabase
            .from("pulse_likes")
            .select("id")
            .eq("pulse_item_id", id)
            .eq("user_id", user.id)
            .single();

          if (like) {
            setIsLiked(true);
          }
        }

        // Increment view count
        await supabase
          .from("pulse_items")
          .update({ total_views: (data.total_views || 0) + 1 })
          .eq("id", id);
      } catch (err: any) {
        console.error('Error fetching pulse item:', err);
        setError(err.message || 'Failed to load pulse item');
      } finally {
        setLoading(false);
      }
    };

    fetchPulseItem();
  }, [id]);

  const handleOptionToggle = (optionId: string) => {
    if (!item) return;

    if (item.allow_multiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitResponse = async () => {
    if (!item || !id || selectedOptions.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to respond");
        return;
      }

      const responseData = {
        selected_options: selectedOptions
      };

      if (hasResponded) {
        // Update existing response
        await supabase
          .from("pulse_responses")
          .update({
            response_data: responseData,
            updated_at: new Date().toISOString()
          })
          .eq("pulse_item_id", id)
          .eq("user_id", user.id);
      } else {
        // Create new response
        await supabase
          .from("pulse_responses")
          .insert({
            pulse_item_id: id,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || user.email,
            user_email: user.email,
            response_data: responseData,
            is_anonymous: item.anonymous
          });
      }

      setHasResponded(true);
      alert("Response submitted successfully!");
      
      // Refresh item to update response count
      const { data } = await supabase
        .from("pulse_items_with_stats")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setItem(data);
      }
    } catch (err: any) {
      console.error('Error submitting response:', err);
      alert("Failed to submit response. Please try again.");
    }
  };

  const handleToggleLike = async () => {
    if (!item || !id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to like");
        return;
      }

      if (isLiked) {
        await supabase
          .from("pulse_likes")
          .delete()
          .eq("pulse_item_id", id)
          .eq("user_id", user.id);
        setIsLiked(false);
      } else {
        await supabase
          .from("pulse_likes")
          .insert({
            pulse_item_id: id,
            user_id: user.id
          });
        setIsLiked(true);
      }

      // Refresh item to update like count
      const { data } = await supabase
        .from("pulse_items_with_stats")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setItem(data);
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll':
        return <BarChart3 size={20} className="text-blue-600" />;
      case 'survey':
        return <MessageSquare size={20} className="text-green-600" />;
      case 'feedback':
        return <MessageCircle size={20} className="text-purple-600" />;
      default:
        return <MessageSquare size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-red-600">{error || "Pulse item not found"}</p>
            <button
              onClick={() => navigate('/marketplace/pulse')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Pulse
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace/pulse')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Pulse
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(item.type)}
                <span className="text-sm font-medium text-gray-600 uppercase">
                  {item.type}
                </span>
              </div>
              {item.is_featured && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {item.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{item.created_by_name || item.created_by_email || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{new Date(item.published_at || item.created_at).toLocaleDateString()}</span>
              </div>
              {item.department && (
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{item.department}</span>
                </div>
              )}
              {item.location_filter && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{item.location_filter}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{item.description}</p>
              </div>
            )}

            {/* Poll Options */}
            {item.type === 'poll' && item.question && item.options && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.question}
                </h2>
                <div className="space-y-3">
                  {item.options.map((option: any, index: number) => {
                    const optionId = option.id || `option-${index}`;
                    const optionText = option.text || option;
                    const voteCount = option.votes || 0;
                    const totalVotes = item.response_count || item.total_responses || 1;
                    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                    const isSelected = selectedOptions.includes(optionId);

                    return (
                      <div
                        key={optionId}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleOptionToggle(optionId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{optionText}</span>
                          {hasResponded && (
                            <span className="text-sm text-gray-600">
                              {voteCount} votes ({percentage.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                        {hasResponded && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!hasResponded && (
                  <button
                    onClick={handleSubmitResponse}
                    disabled={selectedOptions.length === 0}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Submit {item.allow_multiple ? 'Responses' : 'Response'}
                  </button>
                )}
                {hasResponded && (
                  <p className="mt-4 text-sm text-green-600">
                    ✓ You have already responded to this poll
                  </p>
                )}
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{item.like_count || item.total_likes || 0}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <BarChart3 size={18} />
                <span>{item.response_count || item.total_responses || 0} responses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare size={18} />
                <span>{item.comment_count || 0} comments</span>
              </div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

