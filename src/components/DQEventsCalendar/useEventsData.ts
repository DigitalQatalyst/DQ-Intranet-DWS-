/**
 * Custom hook to fetch events from Supabase
 * Handles loading, error states, and real-time updates
 */

import { useState, useEffect } from 'react'
import { supabaseClient } from '../../lib/supabaseClient'
import type { Event } from './index'

interface UseEventsDataReturn {
  events: Event[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEventsData(): UseEventsDataReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabaseClient
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .eq('status', 'published')
        .order('start_time', { ascending: true })

      if (fetchError) {
        console.error('Error fetching events:', fetchError)
        setError(fetchError.message)
        return
      }

      if (data) {
        // Transform database events to UI Event type
        const transformedEvents: Event[] = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
          category: event.category,
          description: event.description,
          location: event.location,
        }))

        setEvents(transformedEvents)
      }
    } catch (err) {
      console.error('Unexpected error fetching events:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()

    // Optional: Set up real-time subscription
    const subscription = supabaseClient
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: 'status=eq.published',
        },
        () => {
          // Refetch when events change
          fetchEvents()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabaseClient.removeChannel(subscription)
    }
  }, [])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  }
}
