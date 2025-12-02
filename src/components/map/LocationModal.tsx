import React, { useState, useEffect, useRef } from "react";
import { X, ArrowLeft, Building2, MapPin, Phone, Mail } from "lucide-react";
import type { LocationItem } from "../../api/MAPAPI";
import { MARKER_COLORS } from "./constants";
import MapActionButton from "./MapActionButton";

interface LocationModalProps {
  location: LocationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type InfoItem = {
  key: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
};

const lightenColor = (hex: string, amount = 0.2) => {
  let color = hex.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const num = parseInt(color, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const mix = (channel: number) => Math.min(255, Math.round(channel + (255 - channel) * amount));
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");

  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
};

const LocationModal: React.FC<LocationModalProps> = ({ location, isOpen, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset description expansion when modal opens
      setShowFullDescription(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!location) return null;

  const color = MARKER_COLORS[location.type] || MARKER_COLORS.Default;
  const accentPale = lightenColor(color, 0.85);
  const showKnowledgeCenter =
    (location.type === "Client" ||
      location.type === "Authority" ||
      location.type === "Bank" ||
      location.type === "Utility") &&
    location.knowledgeCenterUrl;
  const description = location.description || "";
  const shouldTruncate = description.length > 200;
  const displayDescription = shouldTruncate && !showFullDescription
    ? description.substring(0, 200) + "..."
    : description;

  const handleVisitKnowledgeCenter = () => {
    if (location.knowledgeCenterUrl) {
      window.open(location.knowledgeCenterUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVisitWebsite = () => {
    if (location.website) {
      window.open(location.website, "_blank", "noopener,noreferrer");
    }
  };

  // Get category display name
  const getCategoryDisplay = () => {
    if (location.category) return location.category;
    switch (location.type) {
      case "Client":
        return "Client Partner";
      case "Bank":
        return "Financial Services";
      case "Authority":
        return "Regulatory Authority";
      case "Utility":
        return "Energy & Utilities";
      case "Headquarters":
        return "Corporate Office";
      default:
        return location.type;
    }
  };

  const infoItems: InfoItem[] = [
    {
      key: "type",
      icon: Building2,
      label: "Type",
      value: location.type,
    },
    {
      key: "location",
      icon: MapPin,
      label: "Location",
      value: `${location.city}, ${location.country}`,
    },
    location.contact
      ? {
          key: "phone",
          icon: Phone,
          label: "Phone",
          value: location.contact,
          href: `tel:${location.contact.replace(/\s/g, "")}`,
        }
      : null,
    location.email
      ? {
          key: "email",
          icon: Mail,
          label: "Email",
          value: location.email,
          href: `mailto:${location.email}`,
        }
      : null,
  ].filter((item): item is InfoItem => Boolean(item));

  return (
    <div
      ref={modalRef}
      className={`absolute top-0 right-0 h-full w-full md:w-[360px] lg:w-[380px] z-50 transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        borderRadius: "0 24px 24px 0",
        maxHeight: "100%",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="flex h-full flex-col rounded-[24px] bg-white shadow-[0_25px_60px_rgba(3,15,53,0.25)] ring-1 ring-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 space-y-6">
          <div className="space-y-2">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
              style={{ backgroundColor: accentPale, color }}
            >
              {getCategoryDisplay()}
            </span>
            <h2 id="location-modal-title" className="text-2xl font-semibold text-slate-900">
              {location.name}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {location.city}, {location.country}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex flex-col text-left">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </span>
                  <span className="text-base font-semibold text-slate-900">{item.value}</span>
                </div>
              );
              return (
                <div
                  key={item.key}
                  className={`flex items-start gap-3 px-4 py-3 ${index !== infoItems.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl text-[15px]"
                    style={{ backgroundColor: accentPale, color }}
                  >
                    <Icon size={16} />
                  </span>
                  {item.href ? (
                    <a href={item.href} className="flex-1 transition hover:text-blue-600">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>

          {description && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-sm leading-relaxed text-slate-600">{displayDescription}</p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {location.services && location.services.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Services</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {location.services.map((service, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
            <p className="text-sm font-medium text-slate-900">{location.address}</p>
            <p className="text-sm text-slate-600">
              {location.city}, {location.country}
            </p>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-slate-200 px-4 md:px-6 py-4 bg-white" style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <div className="flex gap-3 flex-wrap">
            {showKnowledgeCenter && (
              <div className="flex-1 min-w-0">
                <MapActionButton
                  label="Visit Knowledge Center"
                  variant="primary"
                  onClick={handleVisitKnowledgeCenter}
                />
              </div>
            )}

            {location.website && (
              <div className="flex-1 min-w-0">
                <MapActionButton
                  label="Visit Website"
                  variant={showKnowledgeCenter ? "secondary" : "primary"}
                  onClick={handleVisitWebsite}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
