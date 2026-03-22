import React, { createContext, useContext, useState, useEffect } from 'react';
import { DWSChatWidget } from './DWSChatWidget';

interface DWSChatContextType {
  isOpen: boolean;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  sendMessage: (message: string) => void;
}

const DWSChatContext = createContext<DWSChatContextType | undefined>(undefined);

export function useDWSChat() {
  const context = useContext(DWSChatContext);
  if (!context) {
    throw new Error('useDWSChat must be used within DWSChatProvider');
  }
  return context;
}

interface DWSChatProviderProps {
  readonly children: React.ReactNode;
}

export function DWSChatProvider({ children }: DWSChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Feature flag - set to true to enable chat, false to show "Coming Soon"
  const CHAT_ENABLED = false;

  const openChat = (message?: string) => {
    if (CHAT_ENABLED) {
      setInitialMessage(message);
      setIsOpen(true);
    } else {
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setInitialMessage(undefined);
  };

  const sendMessage = (message: string) => {
    if (CHAT_ENABLED) {
      if (isOpen) {
        // Dispatch event that the chat widget will listen to
        globalThis.dispatchEvent(new CustomEvent('dws-chat-send-message', { detail: { message } }));
      } else {
        openChat(message);
      }
    }
  };

  // Listen for messages from hero search bar
  useEffect(() => {
    const handleHeroMessage = (event: CustomEvent) => {
      if (event.detail?.message) {
        // Open chat with the message - widget will handle it via initialMessage prop
        openChat(event.detail.message);
      }
    };

    globalThis.addEventListener('dq-hero-sent-to-chat', handleHeroMessage as EventListener);
    return () => {
      globalThis.removeEventListener('dq-hero-sent-to-chat', handleHeroMessage as EventListener);
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({ isOpen, openChat, closeChat, sendMessage }),
    [isOpen]
  );

  return (
    <DWSChatContext.Provider value={contextValue}>
      {children}
      {CHAT_ENABLED && (
        <DWSChatWidget isOpen={isOpen} onToggle={closeChat} initialMessage={initialMessage} />
      )}
      {/* Floating chat button when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9998]">
          <button
            onClick={() => openChat()}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              CHAT_ENABLED 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-110 cursor-pointer' 
                : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60'
            }`}
            aria-label={CHAT_ENABLED ? "Open DWS AI Assistant" : "DWS AI Assistant - Coming Soon"}
            title={CHAT_ENABLED ? "Open DWS AI Assistant" : "Coming Soon"}
            disabled={!CHAT_ENABLED}
          >
            {/* Lock Icon Overlay (when disabled) */}
            {!CHAT_ENABLED && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
            )}
            
            {/* Chat Icon (when enabled) */}
            {CHAT_ENABLED && (
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            )}
            
            {/* Coming Soon Badge */}
            {!CHAT_ENABLED && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 animate-pulse">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                COMING SOON
              </div>
            )}
          </button>
          
          {/* Enhanced Coming Soon Tooltip */}
          {showComingSoon && !CHAT_ENABLED && (
            <div className="absolute bottom-20 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in-up whitespace-nowrap border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="font-bold text-base">DWS AI Assistant</div>
              </div>
              <div className="text-sm text-gray-300 mb-1">This feature is coming soon!</div>
              <div className="text-xs text-yellow-400 font-semibold">Stay tuned for updates 🚀</div>
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900 border-r border-b border-gray-700"></div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </DWSChatContext.Provider>
  );
}
