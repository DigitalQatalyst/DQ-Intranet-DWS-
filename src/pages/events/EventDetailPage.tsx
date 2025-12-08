import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Building, HomeIcon, ChevronRightIcon } from 'lucide-react';

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
}

export const EventDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  // Support both query param (?id=...) and path param (/events/:id)
  const id = searchParams.get('id') || pathId || null;
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
            <button
              onClick={() => navigate('/marketplace/events')}
              className="px-4 py-2 bg-dq-navy text-white rounded-md hover:bg-[#13285A]"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Convert event to the format expected by EventDetailsModal
  const eventForModal = {
    id: event.id,
    title: event.title,
    description: event.description || '',
    start_time: event.start_time,
    end_time: event.end_time,
    category: event.category,
    location: event.location,
    location_filter: event.location_filter,
    organizer_name: event.organizer_name,
    organizer_email: event.organizer_email,
    meeting_link: event.meeting_link,
    is_virtual: event.is_virtual,
    is_all_day: event.is_all_day,
    max_attendees: event.max_attendees,
    registration_required: event.registration_required,
    registration_deadline: event.registration_deadline,
    image_url: event.image_url,
    tags: event.tags,
    department: event.department,
    metadata: event.metadata,
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                  >
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1" />
                    <Link
                      to="/marketplace/events"
                      className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors"
                    >
                      Events
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center min-w-[80px]">
                    <ChevronRightIcon size={16} className="text-gray-400 mx-1" />
                    <span className="text-gray-500 text-sm md:text-base font-medium truncate">
                      {event.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Event Details - Using Modal Component in Full Page Mode */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/marketplace/events')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Events
          </button>

          {/* Event Details Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-[#FB5535] via-[#1A2E6E] to-[#030F35] text-white p-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                  {event.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              {event.description && (
                <p className="text-white/90 text-lg">{event.description}</p>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-dq-navy mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600">
                      {new Date(event.start_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-dq-navy mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.is_virtual && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        Virtual Event
                      </span>
                    )}
                  </div>
                </div>

                {/* Department */}
                {event.department && (
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-dq-navy mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Department</p>
                      <p className="text-gray-600">{event.department}</p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {event.max_attendees && (
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-dq-navy mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Capacity</p>
                      <p className="text-gray-600">{event.max_attendees} attendees</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {event.registration_required && (
                <div className="mt-8">
                  {event.meeting_link ? (
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-dq-navy text-white rounded-md hover:bg-[#13285A] transition-colors font-semibold"
                    >
                      Register Now
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        // Handle registration logic here
                        alert('Registration form will open here');
                      }}
                      className="px-6 py-3 bg-dq-navy text-white rounded-md hover:bg-[#13285A] transition-colors font-semibold"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

