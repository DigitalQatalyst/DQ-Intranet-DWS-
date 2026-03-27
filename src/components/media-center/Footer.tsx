import React, { useState } from 'react';
import { cn } from '@/lib/media-center-utils';
import { Button } from '@/components/ui/media-center-button';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const [email, setEmail] = useState('');

  const footerColumns: FooterColumn[] = [
    {
      title: 'Learn',
      links: [
        { label: 'Courses', href: '/media-center/courses' },
        { label: 'Guides', href: '/media-center/guides' },
        { label: 'Resources', href: '/media-center/resources' },
        { label: 'Certifications', href: '/certifications' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Community', href: '/community' },
        { label: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing:', email);
    setEmail('');
  };

  return (
    <footer className={cn('bg-[hsl(0_0%_4%)] text-[hsl(0_0%_98%)]', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(220_90%_50%)] to-[hsl(210_100%_50%)]" />
                <span className="font-semibold text-lg">DQ Learn</span>
              </div>
              <p className="text-[hsl(0_0%_78%)] max-w-sm">
                Empowering professionals with cutting-edge digital skills and knowledge.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[hsl(0_0%_98%)]">
                Subscribe to our newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-[hsl(0_0%_8%)] border border-[hsl(0_0%_20%)] rounded-lg text-[hsl(0_0%_98%)] placeholder-[hsl(0_0%_64%)] focus:outline-none focus:ring-2 focus:ring-[hsl(210_100%_70%)] focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-[hsl(210_100%_70%)] hover:bg-[hsl(210_100%_60%)] text-white"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Link Columns */}
          {footerColumns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-[hsl(0_0%_98%)]">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-[hsl(0_0%_78%)] hover:text-[hsl(0_0%_98%)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[hsl(0_0%_20%)]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[hsl(0_0%_78%)] text-sm">
              © 2024 DQ Learn. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[hsl(0_0%_78%)] hover:text-[hsl(0_0%_98%)] transition-colors"
                  aria-label={social}
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-[hsl(0_0%_78%)] rounded" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
