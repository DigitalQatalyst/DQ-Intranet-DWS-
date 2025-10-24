import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Heart,
  Users,
  CheckSquare,
  Shield,
  GitBranch,
  Package,
  ArrowRight,
} from 'lucide-react';

const dnaItems = [
  {
    id: 1,
    title: 'The Vision',
    subtitle: 'Purpose',
    description: 'Defines why we exist and what impact we aim to create.',
    icon: Target,
    route: '/strategy',
    cta: 'Explore Strategy',
    accentColor: '#2D4BFF',
  },
  {
    id: 2,
    title: 'The HoV',
    subtitle: 'Culture',
    description: 'Shapes how we behave, learn, and collaborate every day.',
    icon: Heart,
    route: '/culture',
    cta: 'Open Culture Playbook',
    accentColor: '#FF6B4A',
  },
  {
    id: 3,
    title: 'The Personas',
    subtitle: 'Identity',
    description: 'Clarifies who we are and how we grow in our roles.',
    icon: Users,
    route: '/personas',
    cta: 'View Personas',
    accentColor: '#7DA0FF',
  },
  {
    id: 4,
    title: 'Agile TMS',
    subtitle: 'Tasks',
    description: 'Organizes how we plan, track, and deliver work.',
    icon: CheckSquare,
    route: '/tasks',
    cta: 'Go to Tasks',
    accentColor: '#FF7D5F',
  },
  {
    id: 5,
    title: 'Agile SOS',
    subtitle: 'Governance',
    description: 'Guides how we govern, decide, and maintain accountability.',
    icon: Shield,
    route: '/governance',
    cta: 'Open Governance',
    accentColor: '#2D4BFF',
  },
  {
    id: 6,
    title: 'Agile Flows',
    subtitle: 'Value Streams',
    description: 'Aligns how we orchestrate value and outcomes across teams.',
    icon: GitBranch,
    route: '/flows',
    cta: 'View Value Streams',
    accentColor: '#FFA089',
  },
  {
    id: 7,
    title: 'Agile DTMF',
    subtitle: 'Products',
    description: 'Shows what we offer — our product and service portfolio.',
    icon: Package,
    route: '/products',
    cta: 'Explore Products',
    accentColor: '#7DA0FF',
  },
];

export const DQDNA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 md:py-24" id="dna" aria-labelledby="dna-heading">
      <div className="dws-container max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="dna-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--dws-text-strong)' }}
          >
            Growth Dimensions
          </h2>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            Seven connected dimensions shaping how DQ learns, collaborates, and delivers value.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {dnaItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="dws-card bg-white flex flex-col min-h-[220px] overflow-hidden transition-all duration-200 hover:-translate-y-1"
                style={{ border: '1px solid var(--dws-line)' }}
              >
                {/* Top Accent Bar */}
                <div className="h-1" style={{ background: item.accentColor }} />

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="p-2.5 rounded-lg flex-shrink-0"
                      style={{
                        background: `${item.accentColor}15`,
                        color: item.accentColor,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{ color: 'var(--dws-text-strong)' }}
                      >
                        {item.title}
                      </h3>
                      <span
                        className="text-xs font-semibold mt-1 inline-block"
                        style={{ color: 'var(--dws-text-dim)' }}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 flex-1"
                    style={{ color: 'var(--dws-text)' }}
                  >
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(item.route)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all dws-focus-ring"
                      style={{ color: item.accentColor }}
                      aria-label={`${item.cta} - ${item.title}`}
                    >
                      {item.cta}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DQDNA;

