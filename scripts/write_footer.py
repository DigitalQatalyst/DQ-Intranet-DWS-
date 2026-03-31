footer = """\
import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Linkedin, Youtube, Globe } from 'lucide-react';

interface FooterProps {
  'data-id'?: string;
  isLoggedIn?: boolean;
}
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

type ForYouItem =
  | { label: string; type: 'route'; href: string }
  | { label: string; type: 'external'; href: string }
  | { label: string; type: 'coming-soon' };

const SUPPORT_FORM = [
  'https://forms.office.com/pages/responsepage.aspx',
  '?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u',
  '&route=shorturl',
].join('');

const FOR_YOU_ITEMS: ForYouItem[] = [
  { label: 'DQ Learning Center', type: 'route', href: '/lms' },
  { label: 'Services & Requests', type: 'external', href: SUPPORT_FORM },
  { label: 'Communities & Surveys', type: 'coming-soon' },
  { label: 'News & Announcements', type: 'route', href: '/marketplace/media-center?tab=announcements' },
];

const FIND_US_LINKS = [
  { label: 'Viva Engage', href: 'https://engage.cloud.microsoft/main/feed' },
  { label: 'SharePoint', href: 'https://arqitek.sharepoint.com/_layouts/15/sharepoint.aspx' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/digitalqatalyst/posts/?feedView=all' },
  { label: 'YouTube', href: 'https://www.youtube.com/@digitalqatalyst' },
  { label: 'DQ Corporate Website', href: 'https://digitalqatalyst.com/' },
];

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/company/digitalqatalyst/posts/?feedView=all', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://www.youtube.com/@digitalqatalyst', label: 'YouTube', Icon: Youtube },
  { href: 'https://digitalqatalyst.com/', label: 'DQ Corporate Website', Icon: Globe },
];

function AccordionSection({ title, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between text-left" aria-expanded={isOpen}>
        <span className="font-semibold text-sm text-white">{title}</span>
        {isOpen ? <ChevronUp size={18} className="text-white/50" /> : <ChevronDown size={18} className="text-white/50" />}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <Icon size={14} />
        </a>
      ))}
    </div>
  );
}

function ForYouLinks() {
  return (
    <ul className="space-y-3">
      {FOR_YOU_ITEMS.map((item) => {
        if (item.type === 'coming-soon') {
          return <li key={item.label}><span className="text-white/30 text-sm cursor-not-allowed select-none">{item.label}</span></li>;
        }
        const isExternal = item.type === 'external';
        return (
          <li key={item.label}>
            <a href={item.href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}
              className="text-white/70 hover:text-white transition-colors text-sm">
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function FindUsLinks() {
  return (
    <ul className="space-y-3">
      {FIND_US_LINKS.map((item) => (
        <li key={item.label}>
          <a href={item.href} target="_blank" rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-1.5">
            {item.label}
            <ExternalLink size={11} className="opacity-50" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ 'data-id': dataId, isLoggedIn = false }: FooterProps) {
  if (isLoggedIn) {
    return (
      <footer data-id={dataId} className="bg-gray-50 border-t border-gray-100 w-full h-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>© 2025 DQ | Digital Workspace. All rights reserved.</span>
            <span className="hidden sm:inline">Version v2.1.0</span>
          </div>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Support</a>
        </div>
      </footer>
    );
  }

  return (
    <footer data-id={dataId} className="bg-[#030F35] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-14 pb-8">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-16 mb-12">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight">DQ | Digital Workspace</h2>
              <p className="text-white/50 text-sm mt-3 leading-relaxed">Your internal hub for tools, learning, services, and everything DQ.</p>
            </div>
            <SocialIcons />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">For You</h3>
            <ForYouLinks />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Find Us</h3>
            <FindUsLinks />
          </div>
        </div>
        <div className="lg:hidden mb-8">
          <h2 className="text-lg font-bold mb-2">DQ | Digital Workspace</h2>
          <p className="text-white/50 text-sm mb-5 leading-relaxed">Your internal hub for tools, learning, services, and everything DQ.</p>
          <div className="mb-8"><SocialIcons /></div>
          <AccordionSection title="For You"><ForYouLinks /></AccordionSection>
          <AccordionSection title="Find Us"><FindUsLinks /></AccordionSection>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">© 2025 DQ | Digital Workspace. All rights reserved.</p>
          <p className="text-white/40 text-xs">Version v2.1.0</p>
        </div>
      </div>
    </footer>
  );
}
"""

with open('src/components/Footer/Footer.tsx', 'w') as f:
    f.write(footer)

print('Written', len(footer), 'chars')
