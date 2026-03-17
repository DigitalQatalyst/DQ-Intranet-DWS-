import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_supabase';

type RequestType = 'workspace' | 'access' | 'demo' | 'support';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name, email, message, metadata } = req.body ?? {};

  const errors: string[] = [];
  if (!type || !['workspace', 'access', 'demo', 'support'].includes(type)) errors.push('Invalid type');
  if (!name || typeof name !== 'string') errors.push('Name is required');
  if (!email || typeof email !== 'string') errors.push('Email is required');
  if (message && typeof message !== 'string') errors.push('Message must be a string');

  if (errors.length) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const { error } = await supabaseAdmin
      .from('requests')
      .insert({
        type,
        name,
        email,
        message: message ?? null,
        metadata: metadata ?? null,
        status: 'new'
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to submit request' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Request handler error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
