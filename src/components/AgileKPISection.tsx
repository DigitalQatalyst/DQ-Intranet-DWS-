import React from 'react';
import { RefreshCcw, Clock, BookOpen, Medal } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';

type KPIIcon = React.ReactNode;

export interface AgileKPI {
  pill?: string;
  value: string;
  label: string;
  icon: KPIIcon;
}

export interface AgileKPISectionProps {
  title?: string;
  caption?: string;
  kpis?: AgileKPI[];
  className?: string;
  'data-id'?: string;
}

const defaultTitle = 'Why Agile Working Accelerate Growth.';
const defaultCaption = 'Agile working empowers teams to adapt, collaborate, and achieve more — together.';

const defaultKpis: AgileKPI[] = [
  {
    pill: 'Over',
    value: '80%',
    label: 'Faster Task Closure',
    icon: <RefreshCcw size={18} strokeWidth={2.5} />
  },
  {
    pill: '+',
    value: '6 hrs',
    label: 'Focus time saved',
    icon: <Clock size={18} strokeWidth={2.5} />
  },
  {
    pill: '+',
    value: '5',
    label: 'New Concepts Learned / Associate / Day',
    icon: <BookOpen size={18} strokeWidth={2.5} />
  },
  {
    value: '87%',
    label: 'Growth in Collaboration & Outcomes',
    icon: <Medal size={18} strokeWidth={2.5} />
  }
];

const AgileKPISection: React.FC<AgileKPISectionProps> = ({
  title = defaultTitle,
  caption = defaultCaption,
  kpis = defaultKpis,
  className = '',
  'data-id': dataId
}) => {
  return (
    <section className={`py-12 md:py-16 bg-white ${className}`} data-id={dataId}>
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll>
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-3">
              {title}
            </h2>
            <p className="text-base md:text-lg text-[#1F2A44] leading-relaxed">
              {caption}
            </p>
          </div>
        </FadeInUpOnScroll>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <FadeInUpOnScroll key={`${kpi.label}-${index}`} delay={0.1 * index}>
              <article
                className="group relative h-full rounded-2xl bg-[#F6F7F9] p-6 md:p-8 shadow-sm transition-shadow duration-300 hover:shadow-md cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#030F35]"
                aria-label={`${kpi.value} ${kpi.label}`}
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-6">
                  {kpi.pill ? (
                    <span className="inline-flex items-center rounded-full border border-[#FB5535] bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#FB5535]">
                      {kpi.pill}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FB5535]/10 text-[#FB5535]">
                    {kpi.icon}
                  </span>
                </div>
                <div className="space-y-2">
                  <p
                    className="text-3xl font-bold tracking-tight text-[#030F35]"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {kpi.value}
                  </p>
                  <p className="text-sm font-medium text-[#1F2A44] truncate">
                    {kpi.label}
                  </p>
                </div>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgileKPISection;
