import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Globe, ExternalLink } from 'lucide-react';

type CategoryColorKey = 'governance' | 'operations' | 'platform' | 'delivery' | 'finance' | 'energy' | 'technology' | 'healthcare' | 'retail' | 'tourism';

interface SectorCard {
  id: string;
  logoUrl?: string;
  name: string;
  tag: {
    label: string;
    colorKey: CategoryColorKey;
  };
  description: string;
  contacts: {
    phone?: string;
    email?: string;
    site?: string;
  };
  href: string;
}

interface DQSectorsProps {
  title?: string;
  subtitle?: string;
  note?: string;
}

// Category chip colors (DWS palette)
const chipColors: Record<CategoryColorKey, { bg: string; text: string }> = {
  governance: { bg: '#EEF2FF', text: '#3730A3' },
  operations: { bg: '#E6F3F3', text: '#0E7490' },
  platform: { bg: '#EDEFF7', text: '#1F2A5C' },
  delivery: { bg: '#FFEDE6', text: '#C2410C' },
  finance: { bg: '#E8EDFF', text: '#1E3A8A' },
  energy: { bg: '#E7F6FF', text: '#0369A1' },
  technology: { bg: '#ECFDF5', text: '#047857' },
  healthcare: { bg: '#F1F5FF', text: '#334155' },
  retail: { bg: '#FFF7ED', text: '#9A3412' },
  tourism: { bg: '#FEF2F2', text: '#B91C1C' },
};

const sectorCards: SectorCard[] = [
  {
    id: 'governance',
    name: 'Governance Sector',
    tag: { label: 'Leadership & Strategy', colorKey: 'governance' },
    description: 'Leadership, strategy, and value management for enterprise alignment. Driving vision, innovation, and execution excellence across the organization.',
    contacts: {
      phone: '+1 (555) 001-0001',
      email: 'governance@dq.workspace',
      site: 'governance.dq.workspace',
    },
    href: '/directory/sectors/governance',
  },
  {
    id: 'operations',
    name: 'Operations Sector',
    tag: { label: 'HR, Finance & Deals', colorKey: 'operations' },
    description: 'HR, Finance, and Deals support factories for day-to-day enablement. Powering workforce excellence, financial stewardship, and strategic partnerships.',
    contacts: {
      phone: '+1 (555) 002-0001',
      email: 'operations@dq.workspace',
      site: 'operations.dq.workspace',
    },
    href: '/directory/sectors/operations',
  },
  {
    id: 'platform',
    name: 'Platform Sector',
    tag: { label: 'Intelligence & Solutions', colorKey: 'platform' },
    description: 'Intelligence, Solutions, Security, and Products driving digital platforms. Building the technology backbone for innovation and scale.',
    contacts: {
      phone: '+1 (555) 003-0001',
      email: 'platform@dq.workspace',
      site: 'platform.dq.workspace',
    },
    href: '/directory/sectors/platform',
  },
  {
    id: 'delivery',
    name: 'Delivery Sector',
    tag: { label: 'Design, Deploy & Engage', colorKey: 'delivery' },
    description: 'Design, Deploys, and Accounts teams ensuring outcomes and engagements. Transforming ideas into impact through agile execution.',
    contacts: {
      phone: '+1 (555) 004-0001',
      email: 'delivery@dq.workspace',
      site: 'delivery.dq.workspace',
    },
    href: '/directory/sectors/delivery',
  },
];

export const DQSectors: React.FC<DQSectorsProps> = ({
  title = 'DQ Directory | Sectors & Units',
  subtitle = 'Connect with DQ sectors, teams, and units driving collaboration, delivery, and innovation across the Digital Workspace.',
  note,
}) => {
  const navigate = useNavigate();

  const getChipStyle = (colorKey: CategoryColorKey) => {
    return chipColors[colorKey] || chipColors.platform;
  };

  return (
    <section
      id="dq-sectors"
      className="py-16 md:py-24 pb-20"
      style={{ backgroundColor: '#F9FAFB' }}
      aria-labelledby="sectors-heading"
    >
      <div className="max-w-[1240px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="sectors-heading"
            className="text-[34px] md:text-[40px] font-bold tracking-tight leading-tight mb-4"
            style={{ color: '#0F172A' }}
          >
            {title}
          </h2>
          <p className="text-sm md:text-base max-w-[720px] mx-auto leading-relaxed" style={{ color: '#475569' }}>
            {subtitle}
          </p>
        </div>

        {/* Sector Cards - DQ Business Directory Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {sectorCards.map((card) => {
            const chipStyle = getChipStyle(card.tag.colorKey);
            
            return (
              <article
                key={card.id}
                className="group bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 flex flex-col min-h-[360px]"
                style={{
                  borderColor: '#E5E7EB',
                  boxShadow: '0 10px 30px rgba(2, 6, 23, 0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(2, 6, 23, 0.10)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(2, 6, 23, 0.06)';
                }}
              >
                <div className="p-5 md:p-6 flex flex-col flex-1" style={{ gap: '16px' }}>
                  {/* Header Row: Logo + Title + Chip */}
                  <div className="flex gap-3">
                    {/* Logo/Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: '#F1F5F9' }}
                    >
                      {card.logoUrl ? (
                        <img
                          src={card.logoUrl}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold" style={{ color: chipStyle.text }}>
                          {card.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Title + Chip */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-semibold truncate mb-1.5"
                        style={{ color: '#0F172A' }}
                        title={card.name}
                      >
                        {card.name}
                      </h3>
                      <span
                        className="inline-block text-xs font-semibold rounded-full px-2.5 py-1"
                        style={{
                          backgroundColor: chipStyle.bg,
                          color: chipStyle.text,
                        }}
                        aria-label={`Category: ${card.tag.label}`}
                      >
                        {card.tag.label}
                      </span>
                    </div>
                  </div>

                  {/* Description (2 lines clamped) */}
                  <p
                    className="text-sm clamp-2"
                    style={{ color: '#475569', lineHeight: '1.6' }}
                    title={card.description}
                  >
                    {card.description}
                  </p>

                  {/* Contact Block */}
                  <div
                    className="rounded-xl border p-3 space-y-2.5 mt-auto"
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderColor: '#E2E8F0',
                    }}
                  >
                    {card.contacts.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={16} style={{ color: '#1D4ED8', opacity: 0.9 }} />
                        <a
                          href={`tel:${card.contacts.phone}`}
                          className="text-sm hover:underline truncate"
                          style={{ color: '#334155' }}
                        >
                          {card.contacts.phone}
                        </a>
                      </div>
                    )}
                    {card.contacts.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail size={16} style={{ color: '#1D4ED8', opacity: 0.9 }} />
                        <a
                          href={`mailto:${card.contacts.email}`}
                          className="text-sm hover:underline truncate"
                          style={{ color: '#334155' }}
                        >
                          {card.contacts.email}
                        </a>
                      </div>
                    )}
                    {card.contacts.site && (
                      <div className="flex items-center gap-2.5">
                        <Globe size={16} style={{ color: '#1D4ED8', opacity: 0.9 }} />
                        <a
                          href={`https://${card.contacts.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline truncate flex items-center gap-1"
                          style={{ color: '#334155' }}
                        >
                          {card.contacts.site}
                          <ExternalLink size={12} style={{ opacity: 0.6 }} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(card.href)}
                    className="w-full h-11 rounded-xl text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2334A0]"
                    style={{
                      background: 'linear-gradient(to right, #002180, #2334A0, #FB5535)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.06)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(35, 52, 160, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    aria-label={`View profile for ${card.name}`}
                  >
                    View Profile
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* View Full Directory CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/marketplace/directory')}
            className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-10 py-3.5 text-base transition-all hover:shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #002180 0%, #FB5535 100%)',
            }}
            aria-label="View full directory in marketplace"
          >
            View Full Directory
          </button>
        </div>

        {/* DNA Identity Note */}
        {note && (
          <div className="mt-12 px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border rounded-xl" style={{ borderColor: '#E3E7F8' }}>
            <p className="text-sm md:text-base text-center leading-relaxed" style={{ color: '#25406F' }}>
              <span className="font-semibold" style={{ color: '#131E42' }}>DQ DNA — The Personas (Identity):</span> {note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
