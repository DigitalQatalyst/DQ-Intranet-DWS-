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
    </DWSChatContext.Provider>
  );
}
