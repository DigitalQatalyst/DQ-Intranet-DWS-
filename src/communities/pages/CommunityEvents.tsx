import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/communities/integrations/supabase/client';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { AlertCircle, Plus, Calendar, Users, Home } from 'lucide-react';
import { toast } from 'sonner';
import { PageLayout, PageSection, SectionHeader, SectionContent } from '@/communities/components/DesignSystem/PageLayout/PageLayout';
import type { BreadcrumbItem } from '@/communities/components/DesignSystem/PageLayout/PageLayout';
import { CommunityEventsList } from '@/communities/components/events/CommunityEventsList';

interface Community {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  imageurl?: string | null;
  category?: string | null;
}

interface Event {
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

export default function CommunityEvents() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [community, setCommunity] = useState<Community | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCommunity();
      fetchEvents();
      if (user) {
        checkMembership();
      }
    }
  }, [id, user]);

  const fetchCommunity = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const query = supabase
      .from('communities_with_counts')
      .select('*')
      .eq('id', id)
      .single();
    const [data, err] = await safeFetch(query);
    if (err) {
      setError('Failed to load community');
      setLoading(false);
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
    setLoading(false);
  };

  const checkMembership = async () => {
    if (!user || !id) return;
    const query = supabase
      .from('memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('community_id', id)
      .maybeSingle();
    const [data] = await safeFetch(query);
    setIsMember(!!data);
  };

  const fetchEvents = async () => {
    if (!id) return;
    setEventsLoading(true);
    const query = supabase
      .from('community_events')
      .select('*')
      .eq('community_id', id)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true, nullsFirst: false });
    const [data, err] = await safeFetch(query);
    if (err) {
      toast.error('Failed to load events');
      setEventsLoading(false);
      return;
    }
    if (data) {
      setEvents(data as Event[]);
    }
    setEventsLoading(false);
  };

  const breadcrumbItems: BreadcrumbItem[] = community && id
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
          href: `/community/${id}`,
        },
        {
          label: 'Events',
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
              <p className="text-gray-600 font-medium">Loading community...</p>
            </div>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }

  if (error || !community) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout title={error || 'Community not found'}>
          <PageSection>
            <SectionContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || 'Community not found'}
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  We couldn't find the community you're looking for.
                </p>
                <Button asChild variant="default">
                  <Link to="/communities">Browse Communities</Link>
                </Button>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }


  return (
    <MainLayout hidePageLayout>
      <PageLayout title={community.name} breadcrumbs={breadcrumbItems}>
        {/* Navigation Tabs */}
        <PageSection className="p-0 border-b border-gray-200">
          <div className="flex items-center gap-1 overflow-x-auto">
            <Button
              asChild
              variant="ghost"
              className={`rounded-none border-b-2 border-transparent hover:border-gray-300 ${
                location.pathname === `/community/${id}` ||
                location.pathname === `/community/${id}/`
                  ? 'border-blue-600 text-blue-600'
                  : ''
              }`}
            >
              <Link to={`/community/${id}`}>Posts</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={`rounded-none border-b-2 border-transparent hover:border-gray-300 ${
                location.pathname === `/community/${id}/events`
                  ? 'border-blue-600 text-blue-600'
                  : ''
              }`}
            >
              <Link to={`/community/${id}/events`}>
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={`rounded-none border-b-2 border-transparent hover:border-gray-300 ${
                location.pathname === `/community/${id}/members`
                  ? 'border-blue-600 text-blue-600'
                  : ''
              }`}
            >
              <Link to={`/community/${id}/members`}>
                <Users className="h-4 w-4 mr-2" />
                Members
              </Link>
            </Button>
          </div>
        </PageSection>

        {/* Events Content */}
        <PageSection>
          <SectionHeader
            title="Community Events"
            description="Upcoming and past events in this community"
            actions={
              user && isMember ? (
                <Button
                  onClick={() => navigate(`/community/${id}/events/create`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              ) : null
            }
          />
          <SectionContent>
            <CommunityEventsList
              events={events}
              loading={eventsLoading}
              emptyMessage={
                user && isMember
                  ? 'No events yet. Be the first to create an event in this community'
                  : 'No events yet. Join this community to create and view events'
              }
              onCreateEvent={() => navigate(`/community/${id}/events/create`)}
              showCreateButton={user && isMember ? true : undefined}
            />
          </SectionContent>
        </PageSection>
      </PageLayout>
    </MainLayout>
  );
}
