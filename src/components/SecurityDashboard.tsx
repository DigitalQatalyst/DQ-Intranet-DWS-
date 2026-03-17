/**
 * Security Dashboard Component
 * Displays security monitoring information (for development/admin use)
 */

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, X } from 'lucide-react';
import { securityMonitor, type SecurityEvent } from '../utils/securityMonitor';

interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(securityMonitor.getStats());
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    if (isOpen) {
      const updateData = () => {
        setStats(securityMonitor.getStats());
        setEvents(securityMonitor.getRecentEvents(20));
      };

      updateData();
      const interval = setInterval(updateData, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'blocked_url':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'sanitized_html':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'blocked_script':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'suspicious_activity':
        return <Eye className="w-4 h-4 text-orange-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatEventType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Security Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Statistics */}
          <div>
            <h3 className="text-md font-medium mb-3">Security Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
                <div className="text-sm text-blue-800">Total Events</div>
              </div>
              {Object.entries(stats.eventsByType).map(([type, count]) => (
                <div key={type} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{count}</div>
                  <div className="text-sm text-gray-800">{formatEventType(type)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h3 className="text-md font-medium mb-3">Recent Security Events</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No security events recorded</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <div key={`${event.timestamp.getTime()}-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {getEventIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {formatEventType(event.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 break-words">
                        {event.details}
                      </p>
                      {event.url && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          URL: {event.url}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => {
                securityMonitor.clearEvents();
                setStats(securityMonitor.getStats());
                setEvents([]);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Clear Events
            </button>
            <button
              onClick={() => {
                const data = {
                  stats: securityMonitor.getStats(),
                  events: securityMonitor.getRecentEvents(100)
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;