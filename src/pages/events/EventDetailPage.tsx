import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { supabase } from '../../lib/supabaseClient';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building, 
  HomeIcon, 
  ChevronRightIcon,
  ExternalLink,
  Share2,
  Mail,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { MarketplaceEventCard } from '../../components/events/MarketplaceEventCard';
import { PageLayout, PageSection, SectionHeader, SectionContent, Breadcrumbs } from '@/communities/components/PageLayout';

interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  location_filter: string | null;
  organizer_name: string | null;
  organizer_email: string | null;
  meeting_link: string | null;
  is_virtual: boolean;
  is_all_day: boolean;
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  image_url: string | null;
  tags: string[] | null;
  department: string | null;
  metadata: any | null;
  status?: string;
}

interface RelatedEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  image_url: string | null;
  department: string | null;
}

export const EventDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  // Support both query param (?id=...) and path param (/events/:id)
  const id = searchParams.get('id') || pathId || null;
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Event ID is required');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('events_v2')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setEvent(data);
          
          // Fetch related events (same category or department, excluding current event)
          const relatedQuery = supabase
            .from('events_v2')
            .select('id, title, description, start_time, end_time, category, location, image_url, department')
            .neq('id', id)
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })
            .limit(3);

          // Filter by category or department if available
          if (data.category) {
            relatedQuery.or(`category.eq.${data.category}${data.department ? `,department.eq.${data.department}` : ''}`);
          } else if (data.department) {
            relatedQuery.eq('department', data.department);
          }

          const { data: relatedData } = await relatedQuery;
          if (relatedData) {
            setRelatedEvents(relatedData as RelatedEvent[]);
          }
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getSpeakers = (): string[] => {
    if (!event || !event.metadata) return [];
    
    if (event.metadata.speakers && Array.isArray(event.metadata.speakers)) {
      return event.metadata.speakers.map((s: any) => 
        typeof s === 'string' ? s : (s.name || s.speakerName || s.full_name || '')
      ).filter(Boolean);
    }
    
    if (event.metadata.speaker) {
      return [event.metadata.speaker];
    }
    
    return [];
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || '',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-gray-500">Loading event details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4 text-lg">{error || 'Event not found'}</p>
            <button
              onClick={() => navigate('/marketplace/events')}
              className="px-6 py-3 bg-dq-navy text-white rounded-md hover:bg-[#13285A] transition-colors font-semibold"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const speakers = getSpeakers();
  const isRegistrationOpen = event.registration_deadline 
    ? new Date(event.registration_deadline) > new Date()
    : true;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <PageLayout
          title={event.title}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Events', href: '/marketplace/events' },
            { label: event.title, current: true }
          ]}
          headerSubtitle={event.description || undefined}
        >
          {/* Hero Image Section */}
          {event.image_url && (
            <div className="mb-6 -mx-4 sm:-mx-6 lg:-mx-8">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details Card */}
              <PageSection>
                <SectionHeader 
                  title="Event Details" 
                  description="All the information you need about this event"
                />
                <SectionContent>
                  <div className="space-y-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-dq-navy/10 text-dq-navy">
                        {event.category}
                      </span>
                      {event.is_virtual && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          Virtual Event
                        </span>
                      )}
                      {event.department && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <Building className="h-3 w-3 mr-1" />
                          {event.department}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-gray-400" />
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Speakers */}
                    {speakers.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Speakers</h3>
                        <div className="flex flex-wrap gap-2">
                          {speakers.map((speaker, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-50 text-gray-700 border border-gray-200"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionContent>
              </PageSection>

              {/* Additional Information */}
              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <PageSection>
                  <SectionHeader title="Additional Information" />
                  <SectionContent>
                    <div className="space-y-3">
                      {Object.entries(event.metadata).map(([key, value]) => {
                        if (key === 'speakers' || key === 'speaker' || !value) return null;
                        return (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="font-medium text-gray-700 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-gray-600">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </SectionContent>
                </PageSection>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Event Info Card */}
              <PageSection>
                <SectionHeader title="Event Information" />
                <SectionContent>
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-dq-navy mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Date & Time</p>
                        <p className="text-gray-600 text-sm">{formatDate(event.start_time)}</p>
                        {!event.is_all_day && (
                          <p className="text-gray-600 text-sm">
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                          </p>
                        )}
                        {event.is_all_day && (
                          <p className="text-gray-600 text-sm">All Day Event</p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-dq-navy mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Location</p>
                        <p className="text-gray-600 text-sm">{event.location}</p>
                        {event.location_filter && (
                          <p className="text-gray-500 text-xs mt-1">{event.location_filter}</p>
                        )}
                      </div>
                    </div>

                    {/* Capacity */}
                    {event.max_attendees && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-dq-navy mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Capacity</p>
                          <p className="text-gray-600 text-sm">{event.max_attendees} attendees</p>
                        </div>
                      </div>
                    )}

                    {/* Organizer */}
                    {event.organizer_name && (
                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-dq-navy mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Organizer</p>
                          <p className="text-gray-600 text-sm">{event.organizer_name}</p>
                          {event.organizer_email && (
                            <a
                              href={`mailto:${event.organizer_email}`}
                              className="text-dq-navy text-sm hover:underline flex items-center gap-1 mt-1"
                            >
                              <Mail className="h-3 w-3" />
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Registration Deadline */}
                    {event.registration_deadline && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-dq-navy mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Registration Deadline</p>
                          <p className="text-gray-600 text-sm">
                            {formatDate(event.registration_deadline)} at {formatTime(event.registration_deadline)}
                          </p>
                          {!isRegistrationOpen && (
                            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Registration closed
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionContent>
              </PageSection>

              {/* Registration Card */}
              {event.registration_required && (
                <PageSection>
                  <SectionContent>
                    <div className="space-y-4">
                      {isRegistrationOpen ? (
                        <>
                          {event.meeting_link ? (
                            <a
                              href={event.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center px-6 py-3 bg-dq-navy text-white rounded-md hover:bg-[#13285A] transition-colors font-semibold gap-2"
                            >
                              <CheckCircle className="h-5 w-5" />
                              Register Now
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                if (event.organizer_email) {
                                  window.location.href = `mailto:${event.organizer_email}?subject=Registration for ${event.title}`;
                                } else {
                                  alert('Please contact the organizer to register for this event.');
                                }
                              }}
                              className="w-full inline-flex items-center justify-center px-6 py-3 bg-dq-navy text-white rounded-md hover:bg-[#13285A] transition-colors font-semibold gap-2"
                            >
                              <CheckCircle className="h-5 w-5" />
                              Register Now
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-red-600 text-sm font-medium mb-2">Registration Closed</p>
                          <p className="text-gray-500 text-xs">
                            The registration deadline has passed for this event.
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={handleShare}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share Event
                      </button>
                    </div>
                  </SectionContent>
                </PageSection>
              )}
            </div>
          </div>

          {/* Related Events Section */}
          {relatedEvents.length > 0 && (
            <PageSection className="mt-8">
              <SectionHeader 
                title="Related Events" 
                description="You might also be interested in these upcoming events"
              />
              <SectionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedEvents.map((relatedEvent) => (
                    <Link
                      key={relatedEvent.id}
                      to={`/events/${relatedEvent.id}`}
                      className="block"
                    >
                      <MarketplaceEventCard
                        item={{
                          id: relatedEvent.id,
                          title: relatedEvent.title,
                          description: relatedEvent.description || '',
                          start: new Date(relatedEvent.start_time),
                          end: new Date(relatedEvent.end_time),
                          category: relatedEvent.category,
                          location: relatedEvent.location,
                          image_url: relatedEvent.image_url,
                          department: relatedEvent.department,
                        }}
                      />
                    </Link>
                  ))}
                </div>
              </SectionContent>
            </PageSection>
          )}
        </PageLayout>
      </div>
      <Footer />
    </>
  );
};
