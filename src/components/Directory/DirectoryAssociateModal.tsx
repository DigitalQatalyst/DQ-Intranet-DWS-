import React, { useEffect } from 'react';

export interface DirectoryAssociateProfile {
  name: string;
  roleTitle?: string;
  unitName?: string;
  tag?: string;
  email?: string;
  phone?: string;
  location?: string;
  studio?: string;
  skills?: string[];
  description?: string;
}

interface DirectoryAssociateModalProps {
  open: boolean;
  profile: DirectoryAssociateProfile | null;
  onClose: () => void;
}

const getInitials = (name?: string) =>
  (name || 'DQ')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'DQ';

const DirectoryAssociateModal: React.FC<DirectoryAssociateModalProps> = ({
  open,
  profile,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open || !profile) return null;

  const initials = getInitials(profile.name);
  const skills = profile.skills ?? [];
  const contactDetails = [
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Location', value: profile.location },
    { label: 'Studio', value: profile.studio },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-[0_24px_70px_rgba(3,15,53,0.35)]">
        <div className="flex max-h-[80vh] flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close associate profile"
          >
            ✕
          </button>

          <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 sm:p-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-5 pr-1">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {initials}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{profile.name}</h2>
                  {profile.roleTitle && <p className="text-sm text-slate-600">{profile.roleTitle}</p>}
                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {profile.unitName}
                  </span>
                </div>
              </div>

              {profile.description && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    About
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">{profile.description}</p>
                </section>
              )}

              {skills.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Skills & Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5">
              {contactDetails.map(({ label, value }) => (
                <div key={label} className="space-y-1 rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </aside>
          </div>

          <div className="flex justify-end border-t border-slate-200 px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryAssociateModal;
