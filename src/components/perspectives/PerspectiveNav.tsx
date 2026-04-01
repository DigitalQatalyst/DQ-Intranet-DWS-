import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Perspective } from '@/data/perspectives';

type PerspectiveNavProps = {
  perspectives: Perspective[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export default function PerspectiveNav({
  perspectives,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  className,
}: PerspectiveNavProps) {
  const total = perspectives.length;

  return (
    <aside
      className={[
        'p-5 md:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6b7390]">
          Perspective {activeIndex + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-sm flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[hsl(var(--accent))] transition-colors"
            aria-label="Previous perspective"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-sm flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[hsl(var(--accent))] transition-colors"
            aria-label="Next perspective"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1" aria-label="Perspective list">
        {perspectives.map((p, i) => {
          const isActive = i === activeIndex;
          const number = String(p.id).padStart(2, '0');
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  isActive ? 'text-[#131e42]' : 'text-[#4a5678] hover:text-[#131e42]',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={[
                    'text-xs font-semibold tracking-[0.18em]',
                    isActive ? 'text-[hsl(var(--accent))]' : 'text-[#6b7390]',
                  ].join(' ')}
                >
                  {number}
                </span>
                <span
                  className={[
                    'text-sm',
                    isActive
                      ? 'font-semibold underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4'
                      : '',
                  ].join(' ')}
                >
                  {p.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
