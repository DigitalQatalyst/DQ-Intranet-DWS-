import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Upload, Cloud } from 'lucide-react';

import ConfirmationModal from './ConfirmationModal';

interface TechSupportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
}

const MAX_DESCRIPTION_LENGTH = 2000;

const CATEGORY_OPTIONS = [
  'Tech - Microsoft Solutions',
  'Tech - Devices',
  'Tech - Other Solutions',
] as const;

type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Power Automate API endpoint
const POWER_AUTOMATE_API_URL =
  'https://default199ebd0d29864f3d86594388c5b2a7.24.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a97703c6c67e42eab0ea14418e9d4089/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Yk6kzrG5FUx7QdlWvY4KQVytDZw9OCcng3tlEaLp06w';

interface ApiRequestPayload {
  email: string;
  selectedCategory: string;
  issueDescription: string;
}

export function TechSupportForm({ isOpen, onClose }: TechSupportFormProps) {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | ''>('');
  const [issueDescription, setIssueDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const isValid =
      isValidEmail(email) &&
      selectedCategory !== '' &&
      issueDescription.trim().length > 0 &&
      issueDescription.trim().length <= MAX_DESCRIPTION_LENGTH;

    setIsFormValid(isValid);
  }, [email, selectedCategory, issueDescription]);

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSelectedCategory('');
      setIssueDescription('');
      setUploadedFiles([]);
      setIsFormValid(false);
      setShowConfirmation(false);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const mappedFiles: UploadedFile[] = files.map((file) => ({
      name: file.name,
      size: file.size,
    }));

    setUploadedFiles(mappedFiles);
  };

  const submitTechSupportRequest = async (payload: ApiRequestPayload): Promise<void> => {
    const response = await fetch(POWER_AUTOMATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request Failed ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    // Power Automate may return empty body or success response
    const responseData = await response.text();
    if (responseData) {
      try {
        const parsed = JSON.parse(responseData);
        // Handle any response data if needed
        // eslint-disable-next-line no-console
        console.log('API response:', parsed);
      } catch {
        // Response is not JSON, which is fine for Power Automate
      }
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    // Reset error state
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Map form data to API payload based on schema
      const payload: ApiRequestPayload = {
        email: email.trim(),
        selectedCategory: selectedCategory as string,
        issueDescription: issueDescription.trim(),
      };

      await submitTechSupportRequest(payload);

      // Success - show confirmation
      setShowConfirmation(true);
    } catch (error) {
      // Handle error
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while submitting your request. Please try again.';
      setSubmitError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Tech support submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const remainingCharacters = MAX_DESCRIPTION_LENGTH - issueDescription.length;

  // MODAL POSITIONING NOTE:
  // The modal uses 'fixed' positioning to create a proper overlay that covers the entire viewport.
  // This is required for modal overlays to work correctly - 'absolute' positioning won't create
  // a proper full-screen overlay.
  //
  // If you need non-sticky behavior (modal scrolls with page), you would need to:
  // 1. Change the modal from an overlay to an in-page component
  // 2. Remove the backdrop and positioning
  // 3. Integrate it into the page flow instead of using a modal pattern
  //
  // Current implementation: 'fixed' positioning (required for modal overlay functionality)

  return (
    <>
      {/* Form Modal - only show when confirmation is not showing */}
      {!showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[800px] bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#030F35' }}
            >
              <Upload className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Technology Support Request
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share what you need help with so the IT team can route and respond to your
                request quickly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 sm:px-8 py-4 space-y-8">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             1. Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your.email@example.com"
              className={`w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 transition-colors ${
                email && !isValidEmail(email)
                  ? 'focus:ring-red-500 border-red-300'
                  : 'focus:ring-indigo-500'
              }`}
            />
            {email && !isValidEmail(email) && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Question 2: Category */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              2. What do you need help with? <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Select the most appropriate option
            </p>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    checked={selectedCategory === option}
                    onChange={() => setSelectedCategory(option)}
                  />
                  <span className="text-sm text-gray-800 group-hover:text-gray-900">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Issue description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. What is the issue? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Please provide as much detail as possible
            </p>
            <textarea
              value={issueDescription}
              onChange={(event) => setIssueDescription(event.target.value)}
              placeholder="Describe what you are experiencing, including any error messages, impacted tools or accounts."
              rows={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none placeholder-gray-500"
            />
            <div className="mt-1 text-xs text-gray-400 text-right">
              {remainingCharacters} characters remaining
            </div>
          </div>

          {/* Question 3: Upload files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Do you want to add any screenshots?{' '}
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Add screenshots of error messages or any other relevant images
            </p>
            
            {/* Modern Rounded Rectangle Upload Zone */}
            <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200 group">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFilesChange}
              />
              <div className="flex items-center gap-2">
                {/* Cloud Icon */}
                <Cloud className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" strokeWidth={1.5} fill="none" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                  Upload Files
                </span>
              </div>
            </label>
            
            {/* File Requirements
            <div className="mt-4 text-xs text-gray-400 text-center">
              File number limit: 2 · Single file size limit: 10MB · Allowed file types:
              Word, Excel, PPT, PDF, Image, Video, Audio
            </div> */}
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Uploaded files:</p>
                <ul className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <li key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Upload className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800 font-medium">Submission Error</p>
              <p className="text-sm text-red-600 mt-1">{submitError}</p>
            </div>
          )}

          {/* Spacer */}
          <div className="h-4" />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 flex items-center justify-between bg-white">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <button
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            className={`px-8 py-2 rounded font-medium transition-all ${
              isFormValid && !isSubmitting
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={isFormValid && !isSubmitting ? { backgroundColor: '#030F35' } : {}}
            onMouseEnter={(event) => {
              if (isFormValid && !isSubmitting) {
                event.currentTarget.style.backgroundColor = '#020a23';
              }
            }}
            onMouseLeave={(event) => {
              if (isFormValid && !isSubmitting) {
                event.currentTarget.style.backgroundColor = '#030F35';
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Request has been submitted!"
        message="Your technology support request has been sent. The IT team will review it and follow up with you."
      />
    </>
  );
}


