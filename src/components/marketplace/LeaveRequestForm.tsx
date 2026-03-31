import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronDown, CalendarDays } from 'lucide-react';
import { User, LeaveType } from '../../utils/types';
import ApproverList from './ApproverList';
import ConfirmationModal from './ConfirmationModal';
import { addLeaveRequest } from '../../utils/userRequests';

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovers: User[];
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ isOpen, onClose, initialApprovers }) => {
  const [requestName, setRequestName] = useState('');
  const [approvers, setApprovers] = useState<User[]>(initialApprovers);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Simple validation logic
    const isValid =
      requestName.trim().length > 0 &&
      selectedLeaveType !== '' &&
      startDate !== '' &&
      endDate !== '' &&
      reason.trim().length > 0 &&
      approvers.length > 0;
    setIsFormValid(isValid);
  }, [requestName, selectedLeaveType, startDate, endDate, approvers, reason]);

  if (!isOpen) return null;

  const handleRemoveApprover = (id: string) => {
    setApprovers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    // Create the request object
    const leaveRequest = {
      requestName,
      leaveType: selectedLeaveType,
      startDate,
      endDate,
      approvers,
      reason,
    };

    // Save to localStorage
    addLeaveRequest(leaveRequest);

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    
    // Reset form
    setRequestName('');
    setSelectedLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setApprovers(initialApprovers);
    
    // Close the request form
    onClose();
  };

  return (
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
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#030F35' }}>
               <CalendarDays className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">HR | Leave Request</h2>
                
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Submit your leave request with approver selection, dates, and justification for processing.
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
          
          {/* Request Name Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Name of request <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Use a name that's easy to understand"
              className="w-full text-3xl font-light text-gray-800 placeholder-gray-300 border-b-2 border-indigo-600 py-2 focus:outline-none focus:border-indigo-800 transition-colors bg-transparent"
            />
          </div>

          {/* Approvers Section */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3">
              Approvers <span className="text-red-500">*</span>
            </label>
            <ApproverList approvers={approvers} onRemove={handleRemoveApprover} />
            <p className="text-sm text-gray-500 mt-2">
              Require a response from one of approvers
            </p>
          </div>

          {/* Leave Type Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="" disabled>Select your response</option>
                {Object.values(LeaveType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => {
                    // Show date picker on click
                    try {
                      e.currentTarget.showPicker();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker()
                      e.currentTarget.focus();
                    }
                  }}
                  className="w-full bg-gray-100 border-none text-gray-700 py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onClick={(e) => {
                    // Show date picker on click
                    try {
                      e.currentTarget.showPicker();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker()
                      e.currentTarget.focus();
                    }
                  }}
                  className="w-full bg-gray-100 border-none text-gray-700 py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for requesting leave <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your response"
              rows={3}
              className="w-full bg-gray-100 border-none text-gray-700 p-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none placeholder-gray-500"
            />
          </div>

          {/* Spacing for bottom scroll */}
          <div className="h-4"></div>
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
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`px-8 py-2 rounded font-medium transition-all ${
              isFormValid 
                ? 'text-white shadow-md' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            style={isFormValid ? { backgroundColor: '#030F35' } : {}}
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = '#020a23';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = '#030F35';
              }
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Request has been submitted!"
        message="Your leave request has been sent to the approvers. You will be notified once it's reviewed."
      />
    </div>
  );
};

export default LeaveRequestForm;
