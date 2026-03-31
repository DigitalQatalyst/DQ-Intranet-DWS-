import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
interface FooterProps {
  'data-id'?: string;
  isLoggedIn?: boolean;
}
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}
function AccordionSection({
  title,
  children
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="border-b border-dq-navy/20 last:border-b-0">
    <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between text-left" aria-expanded={isOpen}>
      <h3 className="font-semibold text-base text-white">{title}</h3>
      {isOpen ? <ChevronUp size={20} className="text-white/70" /> : <ChevronDown size={20} className="text-white/70" />}
    </button>
    {isOpen && <div className="pb-4">{children}</div>}
  </div>;
}
export function Footer({
  'data-id': dataId,
  isLoggedIn = false
}: FooterProps) {
  const externalLinks = [
    {
      label: 'Viva Engage',
      href: 'https://engage.cloud.microsoft/main/feed'
    },
    {
      label: 'SharePoint',
      href: 'https://arqitek.sharepoint.com/_layouts/15/sharepoint.aspx'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/digitalqatalyst/posts/?feedView=all'
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@digitalqatalyst'
    },
    {
      label: 'DQ Corporate Website',
      href: 'https://digitalqatalyst.com/'
    }
  ];
  const FOR_YOU_ITEMS = [
    { label: 'DQ Learning Center', type: 'route', href: '/lms' },
    { label: 'Services & Requests', type: 'external', href: 'https://forms.office.com/pages/responsepage.aspx?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u&route=shorturl' },
    { label: 'Communities & Surveys', type: 'coming-soon' },
    { label: 'News & Announcements', type: 'route', href: '/marketplace/media-center?tab=announcements' },
  ] as const;
  // Minimal App Footer (Post-login)
  if (isLoggedIn) {
    return <footer data-id={dataId} className="bg-gray-50 border-t border-gray-100 w-full h-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>© 2025 DQ | Digital Workspace. All rights reserved.</span>
          <span className="hidden sm:inline">Version v2.1.0</span>
        </div>
        <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
          Support
        </a>
      </div>
    </footer>;
  }
  // Full Website Footer (Pre-login)
  return <footer data-id={dataId} className="bg-dq-navy text-white w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Logo */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            DQ | Digital
            <br />
            Workspace
          </h2>
        </div>
        {/* Accordion Sections */}
        <div className="mb-8">
          <AccordionSection title="For You">
            <ul className="space-y-3">
              {FOR_YOU_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.type === 'route' && (
                    <a href={item.href} className="text-white/90 hover:text-white transition-colors text-sm block">
                      {item.label}
                    </a>
                  )}
                  {item.type === 'external' && (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm block">
                      {item.label}
                    </a>
                  )}
                  {item.type === 'coming-soon' && (
                    <span className="text-white/40 text-sm cursor-not-allowed select-none">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </AccordionSection>
          <AccordionSection title="Find Us">
            <ul className="space-y-3">
              {externalLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    {item.label} →
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </AccordionSection>
        </div>
        {/* Copyright - Mobile */}
        <div className="border-t border-dq-navy/20 pt-6 text-center">
          <p className="text-white/70 text-xs">
            © 2025 DQ | Digital Workspace. All rights reserved.
          </p>
          <p className="text-white/70 text-xs mt-1">Version v2.1.0</p>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Top: Logo + columns side by side */}
        <div className="flex items-start justify-between mb-10">
          {/* Logo */}
          <h2 className="text-2xl font-bold tracking-tight leading-snug">
            DQ | Digital<br />Workspace
          </h2>
          {/* Links */}
          <div className="flex gap-24">
            {/* For You */}
            <div>
              <h3 className="font-semibold text-base mb-5">For You</h3>
              <ul className="space-y-3">
                {FOR_YOU_ITEMS.map((item) => (
                  <li key={item.label}>
                    {item.type === 'route' && (
                      <a href={item.href} className="text-white/80 hover:text-white transition-colors text-sm">
                        {item.label}
                      </a>
                    )}
                    {item.type === 'external' && (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors text-sm">
                        {item.label}
                      </a>
                    )}
                    {item.type === 'coming-soon' && (
                      <span className="text-white/30 text-sm cursor-not-allowed select-none">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Find Us */}
            <div>
              <h3 className="font-semibold text-base mb-5">Find Us</h3>
              <ul className="space-y-3">
                {externalLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors text-sm inline-flex items-center gap-1.5"
                    >
                      {item.label}
                      <ExternalLink size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Copyright - Desktop */}
        <div className="border-t border-white/10 pt-5 flex items-center justify-between">
          <p className="text-white/50 text-xs">© 2025 DQ | Digital Workspace. All rights reserved.</p>
          <p className="text-white/50 text-xs">Version v2.1.0</p>
        </div>
      </div>
    </div>
  </footer>;
}
