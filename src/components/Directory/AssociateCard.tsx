import React from 'react';
import { Mail, Building2, Rocket } from 'lucide-react';
import type { Associate } from '../../types/directory';

interface AssociateCardProps {
  person: Associate;
  onViewProfile: (person: Associate) => void;
}

export const AssociateCard: React.FC<AssociateCardProps> = ({ person, onViewProfile }) => {
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a short description based on role
  const getDescription = (): string => {
    const roleMap: Record<string, string> = {
      'HR Specialist': 'Managing associate enablement and workforce performance.',
      'Partner Manager': 'Leading DQ partnerships, business development, and growth.',
      'Communications Lead': 'Driving brand strategy and market communications.',
      'BD Manager': 'Leading business development and client acquisition.',
      'Data Analyst': 'Building data models, analytics dashboards, and insights.',
      'Full Stack Developer': 'Delivering full-stack solutions for DQ platforms.',
      'DevOps Engineer': 'Orchestrating CI/CD pipelines and platform reliability.',
      'Platform Reliability Engineer': 'Ensuring platform uptime and incident management.',
      'Scrum Master — User Stories': 'Leading agile sprints and ensuring delivery excellence.',
      'Product Manager': 'Managing product backlogs, releases, and roadmaps.',
      'Product Owner': 'Defining product vision and stakeholder priorities.',
      'UX Designer': 'Creating user-centered designs and experience patterns.',
    };
    return roleMap[person.roleTitle] || 'Contributing to DQ workspace excellence.';
  };

  // Get current sprint/stream info
  const getCurrentSprint = (): string => {
    return 'Sprint 06 — October 2025';
  };

  return (
    <article
      className="bg-white border transition-all duration-200 flex flex-col"
      style={{
        borderColor: '#E3E7F8',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(19, 30, 66, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* Profile Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Circular Profile Photo */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base text-white"
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

        {/* Name + Role + Unit Tag */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold mb-1 truncate"
            style={{ color: '#131E42', fontSize: '16px', lineHeight: '1.4' }}
            title={person.name}
          >
            {person.name}
          </h3>
          <p
            className="text-sm mb-1.5 truncate"
            style={{ color: '#4A5568' }}
            title={person.roleTitle}
          >
            {person.roleTitle}
          </p>
          <span
            className="inline-block text-xs px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: '#E9ECF6',
              color: '#002180',
              fontWeight: 500,
            }}
          >
            {person.unitName}
          </span>
        </div>
      </div>

      {/* Short Description (1 line) */}
      <p
        className="text-sm mb-4 line-clamp-1"
        style={{ color: '#4A5568', lineHeight: '1.5' }}
        title={getDescription()}
      >
        {getDescription()}
      </p>

      {/* Contact / ID Info Box */}
      <div
        className="mb-4"
        style={{
          backgroundColor: '#F9FAFB',
          border: '1px solid #E3E7F8',
          borderRadius: '12px',
          padding: '12px',
        }}
      >
        <div className="space-y-2.5">
          {/* Email */}
          {person.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: '#25406F', flexShrink: 0 }} />
              <a
                href={`mailto:${person.email}`}
                className="text-xs hover:underline truncate"
                style={{ color: '#4A5568' }}
              >
                {person.email}
              </a>
            </div>
          )}
          
          {/* Unit */}
          <div className="flex items-center gap-2">
            <Building2 size={14} style={{ color: '#25406F', flexShrink: 0 }} />
            <span className="text-xs truncate" style={{ color: '#4A5568' }}>
              {person.sector} Sector
            </span>
          </div>

          {/* Active Sprint / Stream */}
          <div className="flex items-center gap-2">
            <Rocket size={14} style={{ color: '#25406F', flexShrink: 0 }} />
            <span className="text-xs truncate" style={{ color: '#4A5568' }}>
              {getCurrentSprint()}
            </span>
          </div>
        </div>
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(person)}
        className="w-full flex items-center justify-center font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(90deg, #002180 0%, #FB5535 100%)',
          color: '#FFFFFF',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 33, 128, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label={`View profile for ${person.name}`}
      >
        View Profile
      </button>
    </article>
  );
};

