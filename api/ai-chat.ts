import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DWS_KNOWLEDGE } from '../src/data/dwsChatKnowledge.js';

type ChatRole = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type EmbedRecord = {
  topicId: string;
  text: string;
  embedding: number[];
};

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DEFAULT_EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small';
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_TOKEN;

class EmbeddingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmbeddingError';
  }
}

let cachedEmbeddings: EmbedRecord[] | null = null;

function buildSystemPrompt(context?: string) {
  const base =
    "You are the DQ Digital Workspace AI Assistant. Be concise, specific, and actionable. You can answer anything about DQ, the Digital Workspace, onboarding, services, learning, governance, or general knowledge. If a question is unclear, ask a brief clarifying question. If you don't have high confidence, say so and propose the next step. Respond in Markdown with short paragraphs or bullets.";
  if (!context) return base;
  const trimmedContext = String(context).slice(0, 4000);
  return `${base}\n\nUse this DWS context when relevant:\n${trimmedContext}`;
}

function sanitizeMessages(raw: any): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const allowedRoles = new Set<ChatRole>(['system', 'user', 'assistant']);
  return raw
    .map((m) => ({
      role: allowedRoles.has(m?.role) ? (m.role as ChatRole) : 'user',
      content: typeof m?.content === 'string' ? m.content.trim() : '',
    }))
    .filter((m) => m.content.length > 0)
    .slice(-30); // cap history to avoid runaway tokens
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

async function getKnowledgeEmbeddings(): Promise<EmbedRecord[]> {
  if (cachedEmbeddings) return cachedEmbeddings;

  const entries = Object.entries(DWS_KNOWLEDGE).map(([topicId, entry]) => ({
    topicId,
    text: `${entry.summary}\n\n${entry.details}`,
  }));

  const payload = {
    model: DEFAULT_EMBED_MODEL,
    input: entries.map((e) => e.text.slice(0, 4000)),
  };

  const resp = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new EmbeddingError(`Embeddings failed: ${resp.status} ${detail}`);
  }

  const data = await resp.json();
  const vectors = data?.data;
  if (!Array.isArray(vectors) || vectors.length !== entries.length) {
    throw new EmbeddingError('Embeddings response malformed');
  }

  cachedEmbeddings = entries.map((entry, idx) => ({
    ...entry,
    embedding: vectors[idx].embedding as number[],
  }));

  return cachedEmbeddings;
}

async function embedQuery(text: string): Promise<number[]> {
  const resp = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_EMBED_MODEL,
      input: text.slice(0, 4000),
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new EmbeddingError(`Query embedding failed: ${resp.status} ${detail}`);
  }

  const data = await resp.json();
  const vec = data?.data?.[0]?.embedding;
  if (!Array.isArray(vec)) {
    throw new EmbeddingError('Query embedding missing');
  }
  return vec as number[];
}

async function buildRetrievalContext(query: string): Promise<string | null> {
  try {
    const [records, queryVec] = await Promise.all([getKnowledgeEmbeddings(), embedQuery(query)]);
    const scored = records
      .map((r) => ({
        ...r,
        score: cosineSimilarity(r.embedding, queryVec),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter((r) => r.score > 0.2);

    if (!scored.length) return null;
    return scored
      .map(
        (r, i) =>
          `DQ Context #${i + 1} (score ${(r.score * 100).toFixed(1)}):\n${r.text}`
      )
      .join('\n\n---\n\n');
  } catch (err) {
    console.error('Retrieval context error', err);
    return null;
  }
}

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return handleGet(res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}

function handleGet(res: VercelResponse) {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ ok: false, error: 'OPENAI_API_KEY not configured' });
  }
  return res.status(200).json({
    ok: true,
    model: DEFAULT_MODEL,
    embedModel: DEFAULT_EMBED_MODEL,
  });
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const validationError = validatePostInput(req);
  if (validationError) {
    return res.status(validationError.status).json({ error: validationError.message });
  }

  const { messages: rawMessages, context, temperature, model, stream } = req.body ?? {};
  const messages = sanitizeMessages(rawMessages);
  if (!messages.length) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const mergedContext = await buildMergedContext(messages, context);
  const payload = buildChatPayload(messages, mergedContext, temperature, model, stream);

  try {
    const upstream = await sendChatRequest(payload);
    if (stream) {
      return streamResponse(res, upstream);
    }
    return handleChatResponse(res, upstream);
  } catch (error: any) {
    console.error('AI chat handler error', error);
    return res.status(500).json({
      error: 'Failed to generate AI response',
      detail: error?.message || String(error),
    });
  }
}

async function streamResponse(res: VercelResponse, upstream: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  if (!upstream.body) {
    return res.status(500).json({ error: 'Upstream streaming body missing' });
  }

  const reader = (upstream.body as any).getReader();
  let isDone = false;
  while (!isDone) {
    const { done, value } = await reader.read();
    isDone = done;
    if (value) res.write(Buffer.from(value));
  }
  res.end();
}

function validatePostInput(req: VercelRequest) {
  if (!OPENAI_API_KEY) {
    return { status: 500, message: 'OPENAI_API_KEY is not configured in the server environment.' };
  }
  if (!req.body) {
    return { status: 400, message: 'Request body is required' };
  }
  return null;
}

async function buildMergedContext(messages: ChatMessage[], context?: string) {
  const retrievalContext = await buildRetrievalContext(messages[messages.length - 1].content);
  return [context, retrievalContext].filter(Boolean).join('\n\n');
}

function buildChatPayload(
  messages: ChatMessage[],
  mergedContext: string,
  temperature?: number,
  model?: string,
  stream?: boolean
) {
  return {
    model: typeof model === 'string' && model.trim() ? model.trim() : DEFAULT_MODEL,
    temperature: typeof temperature === 'number' ? Math.min(Math.max(temperature, 0), 1) : 0.2,
    max_tokens: 600,
    stream: !!stream,
    messages: [
      {
        role: 'system',
        content: buildSystemPrompt(mergedContext || undefined),
      },
      ...messages,
    ].slice(-30),
  };
}

async function sendChatRequest(payload: any) {
  const upstream = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error('AI upstream error', upstream.status, detail);
    throw new Error('Upstream AI provider returned an error');
  }
  return upstream;
}

async function handleChatResponse(res: VercelResponse, upstream: Response) {
  const data = await upstream.json();
  const reply = data?.choices?.[0]?.message?.content?.trim?.();
  if (!reply) {
    return res.status(500).json({ error: 'AI provider did not return a message' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    reply,
    finishReason: data?.choices?.[0]?.finish_reason ?? null,
    usage: data?.usage ?? null,
  });
}