import React from 'react';
import { X, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import type { EmployeeProfile } from '@/data/workDirectoryTypes';
import type { Associate } from './AssociateCard';

interface AssociateProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: EmployeeProfile | null;
  loading: boolean;
  fallbackName?: string;
  fallbackRole?: string;
  fallbackLocation?: string;
  fallbackEmail?: string;
  fallbackPhone?: string | null;
  fallbackProfileImageUrl?: string | null;
  fallbackSummary?: string | null;
  fallbackBio?: string | null;
  fallbackKeySkills?: string[];
  fallbackSfiaRating?: string | null;
  fallbackStatus?: string | null;
  fallbackUnit?: string | null;
  fallbackDepartment?: string | null;
  fallbackHobbies?: string[];
  fallbackTechnicalSkills?: string[];
  fallbackFunctionalSkills?: string[];
  fallbackSoftSkills?: string[];
  fallbackKeyCompetencies?: string[];
  fallbackLanguages?: string[];
}

// Reusable ProfileSection component for tag sections
interface ProfileSectionProps {
  title: string;
  items?: string[] | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="inline-block px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 shadow-sm border border-slate-200 mr-2 mb-2"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export function AssociateProfileModal({
  open,
  onClose,
  profile,
  loading,
  fallbackName,
  fallbackRole,
  fallbackLocation,
  fallbackEmail,
  fallbackPhone,
  fallbackProfileImageUrl,
  fallbackSummary,
  fallbackBio,
  fallbackKeySkills = [],
  fallbackSfiaRating,
  fallbackStatus,
  fallbackUnit,
  fallbackDepartment,
  fallbackHobbies = [],
  fallbackTechnicalSkills = [],
  fallbackFunctionalSkills = [],
  fallbackSoftSkills = [],
  fallbackKeyCompetencies = [],
  fallbackLanguages = [],
}: AssociateProfileModalProps) {
  if (!open) return null;

  const name = profile?.full_name || fallbackName || 'Unknown';
  const role = profile?.role || fallbackRole || 'TBC';
  const location = profile?.location || fallbackLocation || 'TBC';
  const email = profile?.email || fallbackEmail || '';
  const phone = profile?.phone || fallbackPhone || null;
  const avatarUrl = profile?.avatar_url || fallbackProfileImageUrl || null;
  const summary = profile?.summary || fallbackSummary || null;
  const bio = profile?.bio || fallbackBio || null;
  const skills = profile?.key_skills || fallbackKeySkills || [];
  const sfiaRating = profile?.sfia_rating || fallbackSfiaRating || null;
  const status = profile?.status || fallbackStatus || null;
  const unit = profile?.unit || fallbackUnit || null;
  const department = profile?.department || fallbackDepartment || null;
  
  // Read directly from profile or fallback for new fields
  const hobbies = profile?.hobbies || fallbackHobbies || [];
  const technicalSkills = profile?.technical_skills || fallbackTechnicalSkills || [];
  const functionalSkills = profile?.functional_skills || fallbackFunctionalSkills || [];
  const softSkills = profile?.soft_skills || fallbackSoftSkills || [];
  const keyCompetencies = profile?.key_competencies || fallbackKeyCompetencies || [];
  const languages = profile?.languages || fallbackLanguages || [];

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose} 
        />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full transition-all duration-300">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              <p className="mt-4 text-sm text-slate-600">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Header - Fixed */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-slate-900">Associate Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[75vh] overflow-y-auto">
                <div className="px-8 py-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg text-white bg-gradient-to-br from-[#030F35] to-[#4B61D1]">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
                      <p className="text-base text-gray-600 mb-3">{role}</p>
                      <div className="flex flex-wrap gap-2">
                        {unit && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                            <Building2 size={12} />
                            {unit}
                          </span>
                        )}
                        {department && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                            {department}
                          </span>
                        )}
                        {sfiaRating && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                            {sfiaRating}
                          </span>
                        )}
                        {status && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                            {status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-b border-slate-200 my-4"></div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span>{location}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} className="text-slate-400" />
                        <a href={`mailto:${email}`} className="hover:underline">
                          {email}
                        </a>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-slate-400" />
                        <a href={`tel:${phone}`} className="hover:underline">
                          {phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {summary && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Summary</h4>
                      <p className="text-gray-700 leading-relaxed text-[15px] max-w-3xl">{summary}</p>
                    </div>
                  )}

                  {/* Bio */}
                  {bio && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Bio</h4>
                      <p className="text-gray-700 leading-relaxed text-[15px] max-w-3xl whitespace-pre-line">{bio}</p>
                    </div>
                  )}

                  {/* Hobbies */}
                  <ProfileSection title="Hobbies" items={hobbies} />

                  {/* Technical Skills */}
                  <ProfileSection title="Technical Skills" items={technicalSkills} />

                  {/* Functional Skills */}
                  <ProfileSection title="Functional Skills" items={functionalSkills} />

                  {/* Soft Skills */}
                  <ProfileSection title="Soft Skills" items={softSkills} />

                  {/* Key Competencies */}
                  <ProfileSection title="Key Competencies" items={keyCompetencies} />

                  {/* Languages */}
                  <ProfileSection title="Languages" items={languages} />

                  {/* Key Skills */}
                  {skills.length > 0 && (
                    <ProfileSection title="Key Skills" items={skills} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
