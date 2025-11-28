import React from 'react';
import { X, Calendar, Users, FileText, MapPin } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'retro' | 'cws' | 'scrum' | 'townhall' | 'wr' | 'ct';
  department: string;
  location: string;
  attendees: string[];
  agenda: string[];
  description?: string;
  joinLink: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
}

interface SessionDetailsModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      retro: 'Retro',
      cws: 'CWS',
      scrum: 'Scrum',
      townhall: 'Townhall',
      wr: 'Working Room',
      ct: 'Control Tower',
    };
    return labels[type] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      'bi-weekly': 'Bi-Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
    };
    return labels[frequency] || frequency;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{session.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Session Type */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {getTypeLabel(session.type)}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-medium text-gray-800">{formatDate(session.start)}</p>
              <p className="text-gray-600">
                {formatTime(session.start)} - {formatTime(session.end)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-medium text-gray-800">Location</p>
              <p className="text-gray-600">{session.location}</p>
            </div>
          </div>

          {/* Department */}
          <div>
            <p className="font-medium text-gray-800 mb-2">Department</p>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
              {session.department}
            </span>
          </div>

          {/* Frequency */}
          <div>
            <p className="font-medium text-gray-800 mb-2">Frequency</p>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
              {getFrequencyLabel(session.frequency)}
            </span>
          </div>

          {/* Description */}
          {session.description && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Description</p>
              <p className="text-gray-600">{session.description}</p>
            </div>
          )}

          {/* Attendees */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <Users className="text-gray-400 mt-1" size={20} />
              <p className="font-medium text-gray-800">
                Attendees ({session.attendees.length})
              </p>
            </div>
            <ul className="ml-8 space-y-1">
              {session.attendees.map((attendee, index) => (
                <li key={index} className="text-gray-600">
                  • {attendee}
                </li>
              ))}
            </ul>
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <FileText className="text-gray-400 mt-1" size={20} />
              <p className="font-medium text-gray-800">Agenda</p>
            </div>
            <ol className="ml-8 space-y-2">
              {session.agenda.map((item, index) => (
                <li key={index} className="text-gray-600 flex">
                  <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <a
            href={session.joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Session
          </a>
        </div>
      </div>
    </div>
  );
};

