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

export type DnaItem = {
  id: number;
  key: string;
  title: string;
  tag: string;
  description: string;
  href: string;
  accent?: 'blue' | 'teal' | 'purple' | 'indigo' | 'orange' | 'rose' | 'emerald';
  icon?: React.ReactNode;
};

export const dnaItems: DnaItem[] = [
  {
    id: 1,
    key: 'vision',
    title: 'The Vision',
    tag: 'Purpose',
    description:
      'Why we exist and the outcomes we pursue. Vision keeps every initiative centered on the value we create.',
    href: '/strategy',
    accent: 'blue',
    icon: <Target size={22} />,
  },
  {
    id: 2,
    key: 'hov',
    title: 'The HoV',
    tag: 'Culture',
    description:
      'How we behave—habits, values, and ways of working. HoV creates the environment where teams learn and collaborate.',
    href: '/culture',
    accent: 'rose',
    icon: <Heart size={22} />,
  },
  {
    id: 3,
    key: 'personas',
    title: 'The Personas',
    tag: 'Identity',
    description:
      'Who we are—roles, skills, and responsibilities. Personas clarify strengths and pathways for growth.',
    href: '/personas',
    accent: 'purple',
    icon: <Users size={22} />,
  },
  {
    id: 4,
    key: 'tms',
    title: 'Agile TMS',
    tag: 'Tasks',
    description:
      'How we work—tasks, boards, and delivery cadence. TMS keeps priorities visible across teams.',
    href: '/tasks',
    accent: 'teal',
    icon: <CheckSquare size={22} />,
  },
  {
    id: 5,
    key: 'sos',
    title: 'Agile SOS',
    tag: 'Governance',
    description:
      'How we govern—rhythms, decisions, and accountability. SOS aligns leadership with momentum.',
    href: '/governance',
    accent: 'indigo',
    icon: <Shield size={22} />,
  },
  {
    id: 6,
    key: 'flows',
    title: 'Agile Flows',
    tag: 'Value Streams',
    description:
      'How we orchestrate—value streams from idea to impact. Flows coordinate dependencies and outcomes.',
    href: '/value-streams',
    accent: 'emerald',
    icon: <GitBranch size={22} />,
  },
  {
    id: 7,
    key: 'dtmf',
    title: 'Agile DTMF',
    tag: 'Products',
    description:
      'What we offer—product catalog, services, and SLAs. DTMF keeps our portfolio current and discoverable.',
    href: '/products',
    accent: 'orange',
    icon: <Package size={22} />,
  },
];

const accentColors: Record<string, { gradient: string; text: string; bg: string }> = {
  blue: {
    gradient: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  teal: {
    gradient: 'linear-gradient(90deg, #14B8A6 0%, #5EEAD4 100%)',
    text: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  purple: {
    gradient: 'linear-gradient(90deg, #9333EA 0%, #C084FC 100%)',
    text: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  indigo: {
    gradient: 'linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)',
    text: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  orange: {
    gradient: 'linear-gradient(90deg, #FB5535 0%, #F97316 100%)',
    text: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  rose: {
    gradient: 'linear-gradient(90deg, #F43F5E 0%, #FB7185 100%)',
    text: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  emerald: {
    gradient: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
};

export const DqDnaSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const handleCtaClick = () => {
    navigate('/dna');
  };

  return (
    <section
      id="dna"
      className="bg-[#F8FAFC] py-16 md:py-24"
      aria-labelledby="dna-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="dna-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E1446] mb-3"
          >
            DQ DNA
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-[780px] mx-auto leading-relaxed">
            Seven core dimensions that guide how we learn, collaborate, and deliver.
          </p>
        </div>

        {/* DNA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dnaItems.map((item) => {
            const accent = accentColors[item.accent || 'blue'];
            return (
              <article
                key={item.id}
                className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[240px]"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1"
                  style={{ background: accent.gradient }}
                />

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Icon & Tag */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${accent.bg} ${accent.text} p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-[#0E1446] mb-3 leading-tight">
                    {item.title}
                  </h3>

                  {/* Description - 2 lines */}
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-1 clamp-2">
                    {item.description}
                  </p>

                  {/* Show More Link */}
                  <div className="mt-auto pt-2">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCardClick(item.href);
                      }}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text} transition-all duration-200 group-hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-${item.accent}-500`}
                      aria-label={`Show more about ${item.title} - ${item.tag}`}
                    >
                      Show More
                      <ArrowRight size={14} className="transition-transform" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 bg-[#FB5535] text-white font-semibold rounded-full px-6 py-3.5 transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-[#FB5535]/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
            aria-label="Explore DQ DNA Marketplace"
          >
            Explore DQ DNA Marketplace
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DqDnaSection;

