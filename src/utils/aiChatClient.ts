export type AiChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface AiChatRequest {
  messages: AiChatMessage[];
  context?: string | null;
  model?: string;
  temperature?: number;
  stream?: boolean;
}

export interface AiChatResponse {
  reply: string;
  finishReason?: string | null;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AiStreamOptions {
  onToken?: (token: string) => void;
  signal?: AbortSignal;
}

const DEFAULT_ENDPOINT = import.meta.env?.VITE_AI_CHAT_ENDPOINT ?? '/api/ai-chat';

// Helper: Create fetch request configuration
function createFetchConfig(bodyPayload: AiChatRequest, useStream: boolean, signal?: AbortSignal) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(useStream ? { Accept: 'text/event-stream' } : {}),
    },
    body: JSON.stringify(bodyPayload),
    signal,
  };
}

// Helper: Handle fetch response errors
async function handleFetchError(res: Response, context: string): Promise<never> {
  const detail = await res.text();
  throw new Error(`${context} (${res.status}): ${detail || res.statusText}`);
}

// Helper: Parse streaming data chunk
function parseStreamChunk(data: string): string {
  if (data === '[DONE]') return '';
  
  try {
    const json = JSON.parse(data);
    return json?.choices?.[0]?.delta?.content || '';
  } catch {
    return '';
  }
}

// Helper: Process streaming data parts
function processStreamParts(parts: string[], options?: AiStreamOptions): string {
  let fullText = '';
  
  for (const part of parts) {
    const line = part.trim();
    if (!line.startsWith('data:')) continue;
    
    const data = line.slice(5).trim();
    const delta = parseStreamChunk(data);
    
    if (delta) {
      fullText += delta;
      options?.onToken?.(delta);
    }
  }
  
  return fullText;
}

// Helper: Process remaining buffer
function processRemainingBuffer(buffered: string, options?: AiStreamOptions): string {
  if (!buffered.length) return '';
  
  const line = buffered.trim();
  if (!line.startsWith('data:')) return '';
  
  const data = line.slice(5).trim();
  if (data === '[DONE]') return '';
  
  const delta = parseStreamChunk(data);
  if (delta) {
    options?.onToken?.(delta);
  }
  
  return delta;
}

// Helper: Handle streaming response
async function handleStreamResponse(res: Response, options?: AiStreamOptions): Promise<AiChatResponse> {
  if (!res.ok || !res.body) {
    await handleFetchError(res, 'AI stream failed');
  }
  
  const reader = res.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffered = '';
  let fullText = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffered += decoder.decode(value, { stream: true });
      const parts = buffered.split('\n\n');
      buffered = parts.pop() || '';
      
      fullText += processStreamParts(parts, options);
    }
    
    // Process any remaining buffer
    fullText += processRemainingBuffer(buffered, options);
    
    if (!fullText.trim()) {
      throw new Error('AI stream ended without content');
    }
    
    return { reply: fullText };
  } finally {
    reader.cancel();
  }
}

// Helper: Handle non-streaming response
async function handleNonStreamResponse(res: Response): Promise<AiChatResponse> {
  if (!res.ok) {
    await handleFetchError(res, 'AI request failed');
  }
  
  const data = await res.json();
  if (!data?.reply) {
    throw new Error('AI response did not include a reply');
  }
  
  return data as AiChatResponse;
}

export async function sendAiChat(
  payload: AiChatRequest,
  options?: AiStreamOptions
): Promise<AiChatResponse> {
  const useStream = payload.stream === true || typeof options?.onToken === 'function';
  const bodyPayload = useStream ? { ...payload, stream: true } : payload;
  
  const res = await fetch(DEFAULT_ENDPOINT, createFetchConfig(bodyPayload, useStream, options?.signal));
  
  return useStream 
    ? handleStreamResponse(res, options)
    : handleNonStreamResponse(res);
}

export async function checkAiHealth(): Promise<boolean> {
  try {
    const res = await fetch(DEFAULT_ENDPOINT, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}
