import React, { useEffect } from 'react';
import { X, Phone, Mail, ExternalLink, Building2, MapPin, Award, Briefcase } from 'lucide-react';
import type { Associate } from '../../types/directory';

interface AssociateModalProps {
  person: Associate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssociateModal: React.FC<AssociateModalProps> = ({ person, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !person) return null;

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(11, 21, 54, 0.75)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 20px 60px rgba(19, 30, 66, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E3E7F8' }}>
          <h2 id="modal-title" className="text-lg font-bold" style={{ color: '#131E42' }}>
            Profile
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} style={{ color: '#334266' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar + Name + Role */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl text-white mb-4"
              style={{
                background: 'linear-gradient(135deg, #002180, #FB5535)',
              }}
            >
              {person.avatarUrl ? (
                <img
                  src={person.avatarUrl}
                  alt={person.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(person.name)
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: '#131E42' }}>
              {person.name}
            </h3>
            <p className="text-base font-semibold mb-2" style={{ color: '#334266', opacity: 0.85 }}>
              {person.roleTitle}
            </p>
            <p className="text-sm" style={{ color: '#25406F', opacity: 0.75 }}>
              {person.unitName}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2 size={16} style={{ color: '#25406F', opacity: 0.8 }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#25406F', opacity: 0.75 }}>
                  Sector
                </div>
                <div className="text-sm font-semibold" style={{ color: '#131E42' }}>
                  {person.sector}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: '#25406F', opacity: 0.8 }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#25406F', opacity: 0.75 }}>
                  Studio
                </div>
                <div className="text-sm font-semibold" style={{ color: '#131E42' }}>
                  {person.studio}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award size={16} style={{ color: '#25406F', opacity: 0.8 }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#25406F', opacity: 0.75 }}>
                  Seniority
                </div>
                <div className="text-sm font-semibold" style={{ color: '#131E42' }}>
                  {person.seniority}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase size={16} style={{ color: '#25406F', opacity: 0.8 }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#25406F', opacity: 0.75 }}>
                  Status
                </div>
                <div className="text-sm font-semibold" style={{ color: '#131E42' }}>
                  {person.status}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {person.skills && person.skills.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2" style={{ color: '#131E42' }}>
                Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: '#25406F14',
                      color: '#25406F',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(person.phone || person.email) && (
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{
                backgroundColor: '#F9FAFB',
                borderColor: '#E3E7F8',
              }}
            >
              {person.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: '#25406F', opacity: 0.8 }} />
                  <a
                    href={`tel:${person.phone}`}
                    className="text-sm hover:underline"
                    style={{ color: '#334266', opacity: 0.85 }}
                  >
                    {person.phone}
                  </a>
                </div>
              )}
              {person.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} style={{ color: '#25406F', opacity: 0.8 }} />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-sm hover:underline"
                    style={{ color: '#334266', opacity: 0.85 }}
                  >
                    {person.email}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: '#F9FAFB',
                color: '#334266',
                border: '1px solid #E3E7F8',
              }}
            >
              Close
            </button>
            {person.profileUrl && (
              <a
                href={person.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(to right, #002180, #FB5535)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                Open in Marketplace
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

