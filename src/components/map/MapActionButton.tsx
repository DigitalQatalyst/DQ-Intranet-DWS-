import React from "react";
import { ArrowUpRight } from "lucide-react";

interface MapActionButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const MapActionButton: React.FC<MapActionButtonProps> = ({
  label,
  variant = "primary",
  onClick,
}) => {
  const baseClasses =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl text-xs md:text-sm font-semibold h-11 px-3 md:px-4 whitespace-nowrap transition-colors";

  const variantClasses =
    variant === "primary"
      ? "bg-[#101848] text-white hover:bg-[#18246b]"
      : "bg-white text-[#101848] border border-slate-200 hover:bg-slate-50";

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
};

export default MapActionButton;
