import React from 'react';
import { Plus } from 'lucide-react';

interface StickyActionButtonProps {
  onClick: () => void;
  buttonText: string;
  description: string;
}

export function StickyActionButton({ onClick, buttonText, description }: StickyActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
        title={description}
      >
        <Plus className="h-6 w-6" />
        <span className="hidden group-hover:block text-sm font-medium pr-2">
          {buttonText}
        </span>
      </button>
    </div>
  );
}