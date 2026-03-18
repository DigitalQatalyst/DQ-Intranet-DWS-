import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2, Bot, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  DWS_KNOWLEDGE,
  DWS_TOPIC_TRIGGERS,
  DWS_GREETINGS,
  DWS_QUICK_FACTS,
  DWS_DEFAULT_REPLY,
  DWS_HELP_REPLY,
} from '@/data/dwsChatKnowledge';
import { DWS_GUIDELINES } from '@/data/dwsGuidelines';
import { sendAiChat, AiChatMessage, checkAiHealth } from '@/utils/aiChatClient';

const LIVE_AI_ENABLED =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_LIVE_AI !== 'false';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface DWSChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialMessage?: string;
}

/** Build DWS-style reply from a knowledge entry. */
function formatKnowledgeReply(entry: { summary: string; details: string; related?: string[]; nextStep?: string }): string {
  let out = `${entry.summary}\n\n${entry.details}`;
  if (entry.related && entry.related.length > 0) {
    out += `\n\nRelated: ${entry.related.join(', ')}`;
  }
  if (entry.nextStep) {
    out += `\n\n${entry.nextStep}`;
  }
  return out;
}

let lastGreetingResponse: string | null = null;

function pickGreetingResponse(options: string[]): string {
  if (options.length === 1) return options[0];
  let choice = options[Math.floor(Math.random() * options.length)];
  if (lastGreetingResponse && options.length > 1) {
    const maxAttempts = 3;
    let attempts = 0;
    while (choice === lastGreetingResponse && attempts < maxAttempts) {
      choice = options[Math.floor(Math.random() * options.length)];
      attempts += 1;
    }
  }
  lastGreetingResponse = choice;
  return choice;
}

/** Normalize user input for matching (trim, lower, collapse spaces, strip trailing punctuation). */
function normalizeInput(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?,;:]+\s*$/, '');
}

/** Build a compact context block from the local DWS knowledge base to guide the live model. */
function buildContextFromKnowledge(userMessage: string): string | null {
  const lower = normalizeInput(userMessage);
  const context: string[] = [];
  const seen = new Set<string>();

  for (const { topicId, keywords } of DWS_TOPIC_TRIGGERS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const entry = DWS_KNOWLEDGE[topicId];
      if (entry) {
        const text = formatKnowledgeReply(entry);
        if (!seen.has(text)) {
          context.push(text);
          seen.add(text);
        }
      }
    }
  }

  for (const [key, text] of Object.entries(DWS_QUICK_FACTS)) {
    if (lower.includes(key) && !seen.has(text)) {
      context.push(text);
      seen.add(text);
    }
  }

  // If user asks about guidelines, include a compact list of guideline highlights
  if (/\bguideline|policy|dress code|leave|wfh|shifts|ado|devops\b/.test(lower)) {
    const list = DWS_GUIDELINES.map((g) => `• ${g.title}: ${g.summary}`).join('\n');
    const guidelinesBlock = `DQ Guidelines (Knowledge Center → Guidelines):\n${list}`;
    if (!seen.has(guidelinesBlock)) {
      context.push(guidelinesBlock);
      seen.add(guidelinesBlock);
    }
  }

  if (!context.length) return null;
  return context.slice(0, 2).join('\n\n---\n\n');
}

/** Convert UI messages into OpenAI-style chat messages, trimming history to the most recent turns. */
function toAiMessages(history: ChatMessage[]): AiChatMessage[] {
  return history
    .filter((m) => m.sender === 'assistant' || m.sender === 'user')
    .slice(-12)
    .map((m) => ({
      role: m.sender === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));
}

/** Generate DWS chatbot reply using the full knowledge base. */
function generateAIResponse(userMessage: string): string {
  const lower = normalizeInput(userMessage);

  // 1. Greetings / small talk — check first so "hi", "hello", "hey" always get a greeting
  const greetingKey = Object.keys(DWS_GREETINGS).find((k) => {
    const norm = k.toLowerCase();
    return (
      lower === norm ||
      lower === norm + '!' ||
      lower === norm + '.' ||
      lower.startsWith(norm + ' ') ||
      (norm.length >= 2 && lower.startsWith(norm))
    );
  });
  if (greetingKey) {
    const options = DWS_GREETINGS[greetingKey];
    if (options && options.length > 0) {
      return pickGreetingResponse(options);
    }
  }

  // Also treat very short likely-greetings (e.g. "hi", "hey") so they never fall through
  const shortGreetings: Record<string, string[]> = {
    hi: DWS_GREETINGS.hi,
    hello: DWS_GREETINGS.hello,
    hey: DWS_GREETINGS.hey,
  };
  if (lower.length <= 10) {
    const key = Object.keys(shortGreetings).find((k) => lower === k || lower === k + '!' || lower === k + '.');
    if (key && shortGreetings[key]?.length) {
      return pickGreetingResponse(shortGreetings[key]);
    }
  }

  // 2. Help / what can you do
  if (/\b(help|what can you do|how can you help)\b/.test(lower) && lower.length < 50) {
    return DWS_HELP_REPLY;
  }

  // 3. Topic triggers → knowledge entry (includes "what is dws/dq" and full answers)
  for (const { topicId, keywords } of DWS_TOPIC_TRIGGERS) {
    const matched = keywords.some((kw) => lower.includes(kw));
    if (matched && DWS_KNOWLEDGE[topicId]) {
      return formatKnowledgeReply(DWS_KNOWLEDGE[topicId]);
    }
  }

  // 4. Quick facts for very short "what is X" that didn’t match a topic
  for (const [key, text] of Object.entries(DWS_QUICK_FACTS)) {
    if (lower.includes(key) && (lower.includes('what') || lower.includes('explain') || lower.includes('tell me')) && lower.split(/\s+/).length <= 8) {
      return text;
    }
  }

  // 5. Start / begin / get started
  if (/\b(start|begin|get started|first day|new joiner)\b/.test(lower)) {
    const getStarted = DWS_KNOWLEDGE['get_started'];
    if (getStarted) return formatKnowledgeReply(getStarted);
  }

  // 6. Default
  return DWS_DEFAULT_REPLY;
}

export function DWSChatWidget({ isOpen, onToggle, initialMessage }: DWSChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiMode, setAiMode] = useState<'live' | 'fallback'>(LIVE_AI_ENABLED ? 'live' : 'fallback');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastSentInitialRef = useRef<string | null>(null);

  // Initialize with welcome message (DWS-style)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: LIVE_AI_ENABLED
          ? "Hi! I'm your DWS AI Assistant, powered by a live GPT-4 class model. I know the DQ Digital Workspace inside out—onboarding, services, learning, execution, collaboration, updates, and people. Ask me anything about DQ or general topics: \"What is DWS?\", \"Where do I request IT?\", \"How do I start onboarding?\", or \"Explain zero trust security.\""
          : "Hi! I'm your DWS AI Assistant running in free offline mode. I know the DQ Digital Workspace—onboarding, services, learning, execution, collaboration, updates, and people. Ask me anything about DQ, or basic general topics.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Health check to set initial mode badge
  useEffect(() => {
    if (!LIVE_AI_ENABLED) return;
    let cancelled = false;
    (async () => {
      const ok = await checkAiHealth();
      if (cancelled) return;
      if (!ok) {
        setAiMode('fallback');
        setErrorMessage('Live AI is unavailable. Showing best effort from built-in knowledge.');
      } else {
        setAiMode('live');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = (messageText ?? inputValue).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date()
    };

    const historyWithUser = [...messages, userMessage];
    const aiMessages = toAiMessages(historyWithUser);
    const context = buildContextFromKnowledge(text);
    const assistantId = `${Date.now() + 1}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      content: '…',
      sender: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setInputValue('');
    setIsTyping(true);
    setErrorMessage(null);

    let reply = '';

    if (!LIVE_AI_ENABLED) {
      reply = generateAIResponse(text);
      setAiMode('fallback');
      setMessages(prev =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m))
      );
      setIsTyping(false);
      return;
    }

    try {
      const aiResponse = await sendAiChat(
        { messages: aiMessages, context, stream: true },
        {
          onToken: (token) => {
            reply += token;
            setMessages(prev =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m))
            );
          },
        }
      );
      if (!reply && aiResponse.reply) {
        reply = aiResponse.reply;
        setMessages(prev =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m))
        );
      }
      setAiMode('live');
    } catch (err) {
      console.error('AI chat error', err);
      reply = generateAIResponse(text);
      setAiMode('fallback');
      setErrorMessage('Live AI is unavailable. Showing best effort from built-in knowledge.');
      setMessages(prev =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m))
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Handle initial message from hero search bar — send only once per distinct message
  useEffect(() => {
    if (!initialMessage || !isOpen) {
      if (!initialMessage) lastSentInitialRef.current = null;
      return;
    }
    if (lastSentInitialRef.current === initialMessage) return;
    lastSentInitialRef.current = initialMessage;
    handleSendMessage(initialMessage);
  }, [initialMessage, isOpen]);

  // Listen for messages sent from hero search bar or other sources
  useEffect(() => {
    const handleExternalMessage = (event: CustomEvent) => {
      if (event.detail?.message) {
        // If chat is not open, the provider will open it via initialMessage prop
        // If chat is already open, send the message directly
        if (isOpen) {
          handleSendMessage(event.detail.message);
        }
      }
    };

    window.addEventListener('dws-chat-send-message', handleExternalMessage as EventListener);
    
    return () => {
      window.removeEventListener('dws-chat-send-message', handleExternalMessage as EventListener);
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div
      id="dws-chat-widget"
      className={`fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-[10000] transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[600px]'
      }`}
      aria-label="DWS AI Assistant Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">DWS AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              aiMode === 'live'
                ? 'bg-emerald-500/15 border-emerald-300/40 text-emerald-100'
                : 'bg-amber-500/15 border-amber-300/40 text-amber-100'
            }`}
          >
            {aiMode === 'live' ? 'Live AI' : 'Offline mode'}
          </span>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.sender === 'assistant' ? (
                    <ReactMarkdown
                      className="text-sm leading-relaxed space-y-2"
                      components={{
                        ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                        ol: (props) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                        li: (props) => <li className="marker:text-blue-600" {...props} />,
                        strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
                        p: (props) => <p className="text-sm leading-relaxed" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {errorMessage && (
              <div className="flex justify-start">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2 text-sm">
                  {errorMessage}
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <Loader size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about DWS or beyond..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
