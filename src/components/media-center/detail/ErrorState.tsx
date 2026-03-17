import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ErrorStateProps {
  isLoading: boolean;
  loadError: string | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ isLoading, loadError }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const backUrl = tab ? `/marketplace/opportunities?tab=${tab}` : '/marketplace/opportunities';
    navigate(backUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {isLoading ? 'Loading article' : 'Article not found'}
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          {isLoading
            ? 'Fetching the latest details. Please wait.'
            : "The article you're trying to view is unavailable or has been archived. Please browse the latest announcements."}
        </p>
        {loadError && !isLoading && (
          <p className="text-sm text-red-600 mb-4">{loadError}</p>
        )}
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg bg-[#030f35] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Media Center
        </button>
      </main>
    </div>
  );
};
