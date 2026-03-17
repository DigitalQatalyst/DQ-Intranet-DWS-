import React, { useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
import { scrollToSupport } from '../../../utils/scroll';
interface CTAButtonsProps {
  isCompact?: boolean;
  onSignIn: () => void;
}
export function CTAButtons({
  isCompact = false,
  onSignIn
}: CTAButtonsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const primaryHoverColor = 'hover:bg-white/10';
  const secondaryButtonBase = 'bg-white text-dq-navy shadow-sm';
  const handleSignIn = () => {
    onSignIn();
    setIsMobileMenuOpen(false);
  };
  const handleCTAClick = (action: string) => {
    if (action === 'Request Support') {
      scrollToSupport();
    } else {
      console.log(`${action} clicked`);
    }
    setIsMobileMenuOpen(false);
  };
  return <>
      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center space-x-3">
        <button className={`px-4 py-2 ${secondaryButtonBase} rounded-md hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${isCompact ? 'text-sm px-3 py-1.5' : ''}`} onClick={() => handleCTAClick('Join a Workspace')}>
          Join a Workspace
        </button>
        <button className={`px-4 py-2 text-white border border-white/50 rounded-md ${primaryHoverColor} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium ${isCompact ? 'text-sm px-3 py-1.5' : ''}`} onClick={() => handleCTAClick('Request Support')}>
          Request Support
        </button>
        <button className={`px-4 py-2 text-white border border-white/50 rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${isCompact ? 'text-sm px-3 py-1.5' : ''}`} onClick={handleSignIn}>
          Sign In to DQ Workspace
        </button>
      </div>
      {/* Mobile - Always visible primary CTA */}
      <div className="md:hidden flex items-center space-x-2">
        <button className={`px-3 py-2 ${secondaryButtonBase} rounded-md hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium ${isCompact ? 'text-sm px-2 py-1.5' : 'text-sm'}`} onClick={() => handleCTAClick('Request Support')}>
          Support
        </button>
        {/* Mobile menu button */}
        <button className={`p-2 text-white hover:bg-white/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${isCompact ? 'p-1.5' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open mobile menu" aria-expanded={isMobileMenuOpen}>
          {isMobileMenuOpen ? <XIcon size={isCompact ? 20 : 24} /> : <MenuIcon size={isCompact ? 20 : 24} />}
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-white/40 z-50 py-2 md:hidden">
          <button className="w-full text-left px-4 py-3 text-dq-navy hover:bg-dq-coral/10 transition-colors duration-150" onClick={() => handleCTAClick('Join a Workspace')}>
            Join a Workspace
          </button>
          <button className="w-full text-left px-4 py-3 text-dq-navy hover:bg-dq-coral/10 transition-colors duration-150" onClick={() => handleCTAClick('Request Support')}>
            Request Support
          </button>
          <hr className="my-1 border-white/40" />
          <button className="w-full text-left px-4 py-3 text-dq-navy font-medium hover:bg-dq-coral/10 transition-colors duration-150" onClick={handleSignIn}>
            Sign In to DQ Workspace
          </button>
        </div>}
    </>;
}
