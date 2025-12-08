import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft, BarChart3, MessageSquare, MessageCircle, Heart, Share2, Clock, User, Building, HomeIcon, ChevronRightIcon, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface PulseItem {
  id: string;
  title: string;
  description: string | null;
  type: 'poll' | 'survey' | 'feedback';
  status: string;
  department: string | null;
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
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  // Support both query param (?id=...) and path param (/pulse/:id)
  const id = searchParams.get('id') || pathId || null;
  const navigate = useNavigate();
  const [item, setItem] = useState<PulseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [feedbackAnswers, setFeedbackAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedbackQuestions, setFeedbackQuestions] = useState<any[]>([]);
  const [feedbackQuestionsLoading, setFeedbackQuestionsLoading] = useState(false);

  // Helper function to get or generate session ID for anonymous duplicate prevention
  const getSessionId = (pulseItemId: string): string => {
    const storageKey = `pulse_session_${pulseItemId}`;
    let sessionId = sessionStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(storageKey, sessionId);
    }
    return sessionId;
  };

  const fetchFeedbackQuestions = async (eventId: string) => {
    setFeedbackQuestionsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pulse_feedback_questions")
        .select("*")
        .eq("event_id", eventId)
        .order("display_order", { ascending: true });

      if (error) {
        console.error('Error fetching feedback questions:', error);
        // Fallback: try to use questions from pulse_items if available
        const currentItem = item;
        if (currentItem?.questions) {
          setFeedbackQuestions(currentItem.questions);
        }
      } else if (data && data.length > 0) {
        setFeedbackQuestions(data);
        
        // Check if session has already responded and load answers (anonymous duplicate prevention)
        const sessionId = getSessionId(eventId);
        const { data: responses } = await supabase
          .from("pulse_feedback_responses")
          .select("question_id, response")
          .eq("event_id", eventId)
          .eq("session_id", sessionId);

        if (responses && responses.length > 0) {
          const existingAnswers: Record<string, any> = {};
          responses.forEach((r: any) => {
            existingAnswers[r.question_id] = r.response;
          });
          setFeedbackAnswers(existingAnswers);
          setHasResponded(true);
        }
      } else {
        // No questions found in database, check if item has questions (fallback)
        const currentItem = item;
        if (currentItem?.questions) {
          setFeedbackQuestions(currentItem.questions);
        }
      }
    } catch (err: any) {
      console.error('Error fetching feedback questions:', err);
      // Fallback to item.questions if available
      const currentItem = item;
      if (currentItem?.questions) {
        setFeedbackQuestions(currentItem.questions);
      }
    } finally {
      setFeedbackQuestionsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPulseItem = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Try to fetch from database first
        const { data, error: queryError } = await supabase
          .from("pulse_items_with_stats")
          .select("*")
          .eq("id", id)
          .eq("status", "published")
          .single();

        if (queryError) {
          // Fallback to mock data for development
          const mockItems = [
            {
              id: 'pulse-3',
              title: 'Event Feedback: Digital Qatalyst Town Hall',
              description: "We'd love to hear your thoughts on the Digital Qatalyst Town Hall. Your feedback helps us improve future events!",
              type: 'feedback' as const,
              status: 'published',
              department: 'Stories',
              question: null,
              options: null,
              allow_multiple: false,
              anonymous: false,
              questions: null, // Questions will be fetched from pulse_feedback_questions table
              survey_type: null,
              feedback_type: 'general',
              category: null,
              total_responses: 450,
              total_views: 600,
              total_likes: 89,
              tags: ['Event', 'Feedback'],
              image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
              created_by: null,
              created_by_name: 'Events Team',
              created_by_email: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date().toISOString(),
              closes_at: null,
              is_featured: false,
              is_pinned: false,
              allow_comments: true,
              visibility: 'public',
              response_count: 450,
              like_count: 89,
              comment_count: 34
            }
          ];

          const mockItem = mockItems.find(i => i.id === id);
          if (mockItem) {
            setItem(mockItem as PulseItem);
            // If this is a feedback type, fetch questions from database
            if (mockItem.type === 'feedback') {
              await fetchFeedbackQuestions(mockItem.id);
            }
          } else {
            throw new Error("Pulse item not found");
          }
        } else {
          setItem(data);
          
          // If this is a feedback type, fetch questions from database
          if (data.type === 'feedback') {
            await fetchFeedbackQuestions(data.id);
          }
        }

        // Check if session has already responded (anonymous duplicate prevention)
        const sessionId = getSessionId(id);
        const { data: response } = await supabase
          .from("pulse_responses")
          .select("id, response_data")
          .eq("pulse_item_id", id)
          .eq("session_id", sessionId)
          .single();

        if (response) {
          setHasResponded(true);
          if (response.response_data?.selected_options) {
            setSelectedOptions(response.response_data.selected_options);
          }
          if (response.response_data?.answers) {
            setSurveyAnswers(response.response_data.answers);
          }
          if (response.response_data?.feedback) {
            setFeedbackAnswers(response.response_data.feedback);
          }
        }

        // Check if user has liked (only for authenticated users)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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
        if (data) {
          await supabase
            .from("pulse_items")
            .update({ total_views: (data.total_views || 0) + 1 })
            .eq("id", id);
        }
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
    if (!item || hasResponded) return;

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

  const handleSurveyAnswer = (questionId: string, answer: any) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleFeedbackAnswer = (questionId: string, answer: any) => {
    setFeedbackAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitResponse = async () => {
    if (!item || !id) return;

    try {
      // Get session ID for anonymous duplicate prevention
      const sessionId = getSessionId(id);

      // Check if already responded in this session
      const { data: existingResponse } = await supabase
        .from("pulse_responses")
        .select("id")
        .eq("pulse_item_id", id)
        .eq("session_id", sessionId)
        .single();

      if (existingResponse) {
        alert("You have already submitted a response. Thank you for your participation!");
        return;
      }

      let responseData: any = {};

      if (item.type === 'poll') {
        if (selectedOptions.length === 0) {
          alert("Please select an option");
          return;
        }
        responseData = { selected_options: selectedOptions };
      } else if (item.type === 'survey') {
        const allQuestionsAnswered = item.questions?.every(q => surveyAnswers[q.id]);
        if (!allQuestionsAnswered) {
          alert("Please answer all questions");
          return;
        }
        responseData = { answers: surveyAnswers };
      } else if (item.type === 'feedback') {
        // Use dynamically fetched questions if available, otherwise fallback to item.questions
        const questionsToCheck = feedbackQuestions.length > 0 ? feedbackQuestions : (item.questions || []);
        const allQuestionsAnswered = questionsToCheck.every((q: any) => {
          const questionId = q.id || q.question_id;
          return feedbackAnswers[questionId];
        });
        if (!allQuestionsAnswered) {
          alert("Please answer all questions");
          return;
        }
        
        // Save responses to pulse_feedback_responses table
        const questionsToSave = feedbackQuestions.length > 0 ? feedbackQuestions : (item.questions || []);
        for (const question of questionsToSave) {
          const questionId = question.id || question.question_id;
          const response = feedbackAnswers[questionId];
          
          if (response) {
            // Check if response already exists for this session
            const { data: existingFeedbackResponse } = await supabase
              .from("pulse_feedback_responses")
              .select("id")
              .eq("event_id", id)
              .eq("question_id", questionId)
              .eq("session_id", sessionId)
              .single();

            if (existingFeedbackResponse) {
              // Already responded - should not happen due to main check, but handle gracefully
              continue;
            } else {
              // Insert new anonymous response
              await supabase
                .from("pulse_feedback_responses")
                .insert({
                  question_id: questionId,
                  event_id: id,
                  user_id: null,  // Always NULL for anonymous
                  session_id: sessionId,
                  response: typeof response === 'string' ? response : JSON.stringify(response)
                });
            }
          }
        }
        
        // Also save to pulse_responses for backward compatibility
        responseData = { feedback: feedbackAnswers };
      }

      // Insert new anonymous response (updates are disabled for anonymous responses)
      await supabase
        .from("pulse_responses")
        .insert({
          pulse_item_id: id,
          user_id: null,        // Always NULL for anonymous
          user_name: null,      // Always NULL for anonymous
          user_email: null,      // Always NULL for anonymous
          session_id: sessionId,
          response_data: responseData,
          is_anonymous: true    // Always true for anonymous responses
        });

      setHasResponded(true);
      setSubmitted(true);
      
      if (item.type === 'poll') {
        // Refresh to show results
        const { data } = await supabase
          .from("pulse_items_with_stats")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          setItem(data);
        }
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'poll':
        return 'Poll';
      case 'survey':
        return 'Survey';
      case 'feedback':
        return 'Feedback';
      default:
        return 'Pulse Item';
    }
  };

  const calculateSurveyProgress = () => {
    if (!item || item.type !== 'survey' || !item.questions) return 0;
    const answered = item.questions.filter(q => surveyAnswers[q.id]).length;
    return (answered / item.questions.length) * 100;
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
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" />
                <Link to="/communities" className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors">
                  DQ Work Communities
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" />
                <Link to="/marketplace/pulse" className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors">
                  Pulse
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400 mx-1 flex-shrink-0" />
                <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">{getTypeLabel(item.type)}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace/pulse')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
            </div>

            {/* Description */}
            {item.description && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{item.description}</p>
              </div>
            )}

            {/* Survey Section */}
            {item.type === 'survey' && item.questions && (
              <div className="mb-6">
                {/* Progress Bar */}
                {!submitted && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{Math.round(calculateSurveyProgress())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${calculateSurveyProgress()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Survey Questions */}
                {!submitted ? (
                  <div className="space-y-6">
                    {item.questions.map((q: any, index: number) => (
                      <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          {index + 1}. {q.question}
                        </label>
                        {q.type === 'scale' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span>{q.scale_min || 1}</span>
                              <span>{q.scale_max || 5}</span>
                            </div>
                            <div className="flex gap-2">
                              {Array.from({ length: (q.scale_max || 5) - (q.scale_min || 1) + 1 }, (_, i) => {
                                const value = (q.scale_min || 1) + i;
                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleSurveyAnswer(q.id, value)}
                                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                                      surveyAnswers[q.id] === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {q.type === 'text' && (
                          <textarea
                            value={surveyAnswers[q.id] || ''}
                            onChange={(e) => handleSurveyAnswer(q.id, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Type your answer here..."
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleSubmitResponse}
                      className="w-full mt-6 px-6 py-3 bg-dq-navy text-white rounded-lg hover:bg-[#13285A] transition-colors font-semibold"
                    >
                      Submit Survey
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Survey Submitted Successfully!</h3>
                    <p className="text-gray-600 mb-4">Thank you for your feedback.</p>
                    <button
                      onClick={() => setShowResults(!showResults)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {showResults ? 'Hide Results' : 'View Survey Results'}
                    </button>
                    {showResults && (
                      <div className="mt-6 text-left">
                        <p className="text-sm text-gray-600 mb-2">Total Responses: {item.response_count || item.total_responses || 0}</p>
                        <p className="text-sm text-gray-600">Your responses have been recorded.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Feedback Form Section */}
            {item.type === 'feedback' && (
              <div className="mb-6">
                {feedbackQuestionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                ) : !submitted ? (
                  feedbackQuestions.length > 0 ? (
                    <div className="space-y-8">
                      {/* Group questions by category */}
                      {Object.entries(
                        feedbackQuestions.reduce((acc: Record<string, any[]>, q: any) => {
                          const category = q.category || 'General';
                          if (!acc[category]) acc[category] = [];
                          acc[category].push(q);
                          return acc;
                        }, {})
                      ).map(([category, questions]) => (
                        <div key={category} className="space-y-6">
                          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            {category}
                          </h3>
                          {questions.map((q: any, index: number) => {
                            const questionId = q.id || q.question_id;
                            const questionText = q.question;
                            const questionType = q.question_type || q.type || 'text';
                            const scaleMin = q.scale_min || 1;
                            const scaleMax = q.scale_max || 5;
                            
                            return (
                              <div key={questionId} className="border border-gray-200 rounded-lg p-4">
                                <label className="block text-lg font-semibold text-gray-900 mb-3">
                                  {index + 1}. {questionText}
                                </label>
                                {questionType === 'scale' && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                      <span>{scaleMin}</span>
                                      <span>{scaleMax}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      {Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => {
                                        const value = scaleMin + i;
                                        return (
                                          <button
                                            key={value}
                                            onClick={() => handleFeedbackAnswer(questionId, value)}
                                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                                              feedbackAnswers[questionId] === value
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                          >
                                            {value}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                {questionType === 'text' && (
                                  <textarea
                                    value={feedbackAnswers[questionId] || ''}
                                    onChange={(e) => handleFeedbackAnswer(questionId, e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    rows={4}
                                    placeholder="Type your feedback here..."
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <button
                        onClick={handleSubmitResponse}
                        className="w-full mt-6 px-6 py-3 bg-dq-navy text-white rounded-lg hover:bg-[#13285A] transition-colors font-semibold"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No feedback questions available for this event.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback Submitted Successfully!</h3>
                    <p className="text-gray-600 mb-4">Thank you for taking the time to provide your feedback. We appreciate your input!</p>
                    <button
                      onClick={() => navigate('/marketplace/pulse')}
                      className="px-6 py-2 bg-dq-navy text-white rounded-lg hover:bg-[#13285A] transition-colors"
                    >
                      Return to Pulse
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Poll Section */}
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
                        className={`border-2 rounded-lg p-4 transition-all ${
                          hasResponded
                            ? 'border-gray-200'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50 cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        }`}
                        onClick={() => !hasResponded && handleOptionToggle(optionId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{optionText}</span>
                          {(hasResponded || showResults) && (
                            <span className="text-sm text-gray-600">
                              {voteCount} votes ({percentage.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                        {(hasResponded || showResults) && (
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!hasResponded ? (
                  <button
                    onClick={handleSubmitResponse}
                    disabled={selectedOptions.length === 0}
                    className="mt-4 px-6 py-2 bg-dq-navy text-white rounded-lg hover:bg-[#13285A] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Vote
                  </button>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-green-600 mb-2">
                      ✓ You have already voted. Thank you for your participation!
                    </p>
                    <button
                      onClick={() => setShowResults(!showResults)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {showResults ? 'Hide Results' : 'Show Real-time Results'}
                    </button>
                  </div>
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

            {/* Engagement Stats - Only show for non-detail page types (hidden for feedback, survey, poll detail pages) */}
            {item.type !== 'feedback' && item.type !== 'survey' && item.type !== 'poll' && (
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
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
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

