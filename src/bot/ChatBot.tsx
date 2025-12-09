import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[image:var(--dq-cta-gradient)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse hover:animate-none hover:brightness-105"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-[image:var(--dq-cta-gradient)] p-4 text-white flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            <div className="bg-dq-navy/10 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] animate-fade-in">
              <p className="text-gray-800">
                Hi there! How can I help you navigate the Abu Dhabi Enterprise
                Journey Platform?
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your question here..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dq-coral/40 transition-all duration-300"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;

