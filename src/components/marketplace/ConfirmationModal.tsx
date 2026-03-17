import { CheckCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  title = 'This request has been fulfilled!',
  message = 'Thank you for your cooperation!'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-8 py-3 rounded-lg font-medium text-white transition-all shadow-md hover:shadow-lg"
          style={{ backgroundColor: '#030F35' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#020a23')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#030F35')}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;

