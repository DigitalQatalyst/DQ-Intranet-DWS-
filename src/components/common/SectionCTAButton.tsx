import React from "react";
import { ArrowRight } from "lucide-react";

interface SectionCTAButtonProps {
  label: string;
  onClick?: () => void;
}

const SectionCTAButton: React.FC<SectionCTAButtonProps> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#101848] bg-white text-sm font-semibold text-[#101848] shadow-sm transition-colors hover:bg-[#101848] hover:text-white"
  >
    <span>{label}</span>
    <ArrowRight className="h-4 w-4" />
  </button>
);

export default SectionCTAButton;
