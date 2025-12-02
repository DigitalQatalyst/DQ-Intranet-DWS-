import React, { useEffect } from 'react';
import type { Unit } from '../../types/directory';

interface DirectoryProfileModalProps {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
}

const getInitials = (name?: string) =>
  (name || 'DQ')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'DQ';

const DirectoryProfileModal: React.FC<DirectoryProfileModalProps> = ({ open, unit, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open || !unit) return null;

  const initials = getInitials(unit.name);
  const metaSections = [
    { title: 'Unit Type', items: [unit.sector] },
    unit.streams && unit.streams.length
      ? { title: 'Work Areas', items: unit.streams }
      : null,
    unit.tags && unit.tags.length
      ? { title: 'Focus Areas', items: unit.tags }
      : null,
  ].filter(Boolean) as { title: string; items: string[] }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-[0_20px_60px_rgba(3,15,53,0.30)]">
        <div className="flex max-h-[80vh] flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close directory profile"
          >
            ✕
          </button>

          <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:p-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-6 overflow-y-auto pr-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {initials}
                </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{unit.name}</h2>
                <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {unit.sector}
                </span>
              </div>
            </div>

            {unit.description && (
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  About
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">{unit.description}</p>
              </section>
            )}

            {unit.tags && unit.tags.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Key Focus Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {unit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6 overflow-y-auto rounded-2xl bg-slate-50 p-6">
            {metaSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {section.title}
                </h4>
                <ul className="space-y-1 text-sm text-slate-700">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {unit.marketplaceUrl && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Marketplace Profile
                </h4>
                <p className="text-sm text-slate-600">
                  Explore detailed services, contacts, and artifacts for this unit.
                </p>
              </div>
            )}
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

export default DirectoryProfileModal;
