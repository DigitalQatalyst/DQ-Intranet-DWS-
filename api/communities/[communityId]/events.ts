import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../_supabase';

type AnyRequest = VercelRequest & {
  url?: string;
  headers: Record<string, string | undefined> & { host?: string; 'x-forwarded-proto'?: string };
};

export default async function handler(
  req: AnyRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract communityId from URL pathname
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Path should be: /api/communities/[communityId]/events
    // So pathParts will be: ['api', 'communities', communityId, 'events']
    const communityIdIndex = pathParts.indexOf('communities') + 1;
    const communityId = pathParts[communityIdIndex];

    if (!communityId) {
      return res.status(400).json({ error: 'Community ID is required' });
    }

    // Fetch events for the community
    const { data, error } = await supabaseAdmin
      .from('community_events')
      .select('*')
      .eq('community_id', communityId)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    return res.status(200).json({ data: data || [] });
  } catch (err) {
    console.error('Events handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
