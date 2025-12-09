import React from 'react';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

export interface Associate {
  id: string;
  name: string;
  current_role: string;
  department: string;
  unit: string;
  location: string;
  sfia_rating: string;
  status: string;
  email: string;
  phone?: string | null;
  teams_link?: string | null;
  avatar_url?: string | null;
  key_skills: string[];
  summary?: string | null;
  bio: string;
  hobbies?: string[];
  technicalSkills?: string[];
  functionalSkills?: string[];
  softSkills?: string[];
  keyCompetencies?: string[];
  languages?: string[];
}

interface AssociateCardProps {
  associate: Associate;
  onViewProfile: (associate: Associate) => void;
}

export function AssociateCard({ associate, onViewProfile }: AssociateCardProps) {
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Profile Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white bg-gradient-to-br from-[#030F35] to-[#4B61D1]">
          {associate.avatar_url ? (
            <img
              src={associate.avatar_url}
              alt={associate.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(associate.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-1 truncate" title={associate.name}>
            {associate.name}
          </h3>
          <p className="text-sm text-slate-600 mb-1 truncate" title={associate.current_role}>
            {associate.current_role}
          </p>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {associate.unit}
          </span>
        </div>
      </div>

      {/* Summary/Bio */}
      {(associate.summary || associate.bio) && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {associate.summary || associate.bio}
        </p>
      )}

      {/* Contact Info */}
      <div className="mb-4 space-y-2 text-xs text-slate-600">
        {associate.location && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{associate.location}</span>
          </div>
        )}
        {associate.email && (
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-slate-400 flex-shrink-0" />
            <a
              href={`mailto:${associate.email}`}
              className="truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {associate.email}
            </a>
          </div>
        )}
        {associate.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{associate.phone}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {associate.key_skills && associate.key_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {associate.key_skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
          {associate.key_skills.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              +{associate.key_skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(associate)}
        className="mt-auto w-full flex items-center justify-center rounded-full bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#051040] transition-colors"
      >
        View Profile
      </button>
    </div>
  );
}

