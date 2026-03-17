import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { AlertCircle, Home, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PageLayout, PageSection, SectionHeader, SectionContent } from '@/communities/components/DesignSystem/PageLayout/PageLayout';
import type { BreadcrumbItem } from '@/communities/components/DesignSystem/PageLayout/PageLayout';
import { format } from 'date-fns';

interface Community {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  imageurl?: string | null;
  category?: string | null;
}

interface CommunityEvent {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export default function EventPage() {
  const { communityId, eventId } = useParams<{ communityId: string; eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (communityId && eventId) {
      fetchCommunity();
      fetchEvent();
    }
  }, [communityId, eventId]);

  const fetchCommunity = async () => {
    if (!communityId) return;
    setError(null);
    const query = supabase
      .from('communities_with_counts')
      .select('*')
      .eq('id', communityId)
      .single();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load community');
      return;
    }
    if (data) {
      setCommunity({
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        imageurl: data.imageurl || null,
        category: data.category || 'Community',
      });
    }
  };

  const fetchEvent = async () => {
    if (!communityId || !eventId) return;
    setLoading(true);
    setError(null);
    const query = supabase
      .from('community_events')
      .select('*')
      .eq('id', eventId)
      .eq('community_id', communityId)
      .single();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load event');
      setLoading(false);
      return;
    }
    if (data) {
      setEvent(data as CommunityEvent);
    }
    setLoading(false);
  };

  const breadcrumbItems: BreadcrumbItem[] = community && event && communityId
    ? [
        {
          label: 'Home',
          href: '/',
          icon: Home,
        },
        {
          label: 'Communities',
          href: '/communities',
        },
        {
          label: community.name,
          href: `/community/${communityId}`,
        },
        {
          label: 'Events',
          href: `/community/${communityId}/events`,
        },
        {
          label: event.title,
          current: true,
        },
      ]
    : [];

  if (loading) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout title="Loading">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading event...</p>
            </div>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }

  if (error || !event || !community) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout title={error || 'Event not found'}>
          <PageSection>
            <SectionContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || 'Event not found'}
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  We couldn't find the event you're looking for.
                </p>
                <div className="flex gap-4">
                  {communityId && (
                    <Button asChild variant="default">
                      <Link to={`/community/${communityId}/events`}>
                        Back to Events
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link to="/communities">Browse Communities</Link>
                  </Button>
                </div>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }

  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate >= new Date();

  return (
    <MainLayout hidePageLayout>
      <PageLayout title={event.title} breadcrumbs={breadcrumbItems}>
        <PageSection>
          <SectionContent>
            {/* Back Button */}
            <div className="mb-6">
              <Button
                asChild
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <Link to={`/community/${communityId}/events`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
            </div>

            {/* Event Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 ${
                    isUpcoming
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div
                    className={`text-sm font-semibold uppercase ${
                      isUpcoming ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {format(eventDate, 'MMM')}
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      isUpcoming ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {format(eventDate, 'd')}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                  {event.description && (
                    <p className="text-gray-600 text-lg mb-4">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="text-base text-gray-900">
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                </div>

                {event.event_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Time</div>
                      <div className="text-base text-gray-900">{event.event_time}</div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Location</div>
                      <div className="text-base text-gray-900">{event.location}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Community</div>
                    <Link
                      to={`/community/${community.id}`}
                      className="text-base text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {community.name}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isUpcoming && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      toast.info('RSVP functionality coming soon');
                    }}
                  >
                    RSVP to Event
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Add to calendar functionality
                      toast.info('Add to calendar functionality coming soon');
                    }}
                  >
                    Add to Calendar
                  </Button>
                </div>
              )}
            </div>
          </SectionContent>
        </PageSection>
      </PageLayout>
    </MainLayout>
  );
}
