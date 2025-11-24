import React from 'react';
import type { EmployeeProfile, Associate } from '@/data/workDirectoryTypes';

interface AssociateProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile?: EmployeeProfile | null;
  loading?: boolean;
  fallbackName?: string;
  fallbackRole?: string;
  fallbackLocation?: string;
  fallbackEmail?: string;
  fallbackPhone?: string | null;
  fallbackProfileImageUrl?: string | null;
  fallbackSummary?: string | null;
  fallbackBio?: string | null;
  fallbackKeySkills?: string[];
  fallbackSfiaRating?: string;
  fallbackStatus?: string;
  fallbackUnit?: string;
  fallbackDepartment?: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
}

function Section({ title, children, hidden }: SectionProps) {
  if (hidden) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
  );
}

interface ItemGridProps {
  items: Array<{ label: string; value?: string | null }>;
}

function ItemGrid({ items }: ItemGridProps) {
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
    {items.map((item) => (
      <div key={item.label}>
        <div className="text-xs uppercase tracking-wide text-gray-500">{item.label}</div>
        <div className="font-medium text-gray-900">{item.value || '—'}</div>
      </div>
    ))}
  </div>
  );
}

interface PillListProps {
  values?: string[] | null;
}

function PillList({ values }: PillListProps) {
  if (!values || values.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

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
  fallbackKeySkills,
  fallbackSfiaRating,
  fallbackStatus,
  fallbackUnit,
  fallbackDepartment,
}: AssociateProfileModalProps) {
  if (!open) return null;
  const name = profile?.full_name || fallbackName || 'Profile';
  const role = profile?.role_title || fallbackRole || '—';
  const location = profile?.location || fallbackLocation || '—';
  const sfia = profile?.sfia_level || fallbackSfiaRating || '—';
  const status = profile?.status || fallbackStatus || '—';
  const email = profile?.email || fallbackEmail || '—';
  const phone = profile?.phone || fallbackPhone || '—';
  const unit = profile?.unit || fallbackUnit || '—';
  const department = profile?.department || fallbackDepartment || '—';
  const imageUrl = profile?.profile_image_url || fallbackProfileImageUrl || '';
  const summary = profile?.summary || fallbackSummary || null;
  const bio = profile?.bio || fallbackBio || null;
  const keySkills = profile?.core_skills || fallbackKeySkills || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-[#030F35] to-[#1A2E6E] px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold leading-tight">{name}</h3>
            <p className="text-sm opacity-90">{role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
          >
            Close
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Loading profile…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center gap-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-24 w-24 rounded-full object-cover border border-slate-200"
                      loading="lazy"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-semibold text-xl">
                      {name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">{location}</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="font-medium text-gray-900">{email}</div>
                    <div>{phone}</div>
                  </div>
                </div>
                <Section title="Skills" hidden={keySkills.length === 0}>
                  <PillList values={keySkills} />
                </Section>
              </div>

              {/* Right column */}
              <div className="md:col-span-2 space-y-6">
                <Section title="Bio" hidden={!summary && !bio && !fallbackName}>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {summary || bio || 'Full profile coming soon for this associate.'}
                  </p>
                </Section>

                <Section title="Role & Assignment">
                  <ItemGrid
                    items={[
                      { label: 'Unit', value: unit },
                      { label: 'Department', value: department },
                      { label: 'SFIA Rating', value: sfia },
                      { label: 'Status', value: status },
                    ]}
                  />
                </Section>
                
                <Section title="Skills" hidden={keySkills.length === 0}>
                  <PillList values={keySkills} />
                </Section>

                <Section title="Qualifications" hidden={!profile?.qualifications || profile.qualifications.length === 0}>
                  <PillList values={profile?.qualifications || []} />
                </Section>

                <Section title="Languages" hidden={!profile?.languages || profile.languages.length === 0}>
                  <PillList values={profile?.languages || []} />
                </Section>

                <Section title="Hobbies" hidden={!profile?.hobbies || profile.hobbies.length === 0}>
                  <PillList values={profile?.hobbies || []} />
                </Section>

                <Section
                  title="Notable achievements"
                  hidden={!profile?.notable_achievements || profile.notable_achievements.length === 0}
                >
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(profile?.notable_achievements || []).map((ach) => (
                      <li key={ach}>{ach}</li>
                    ))}
                  </ul>
                </Section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
