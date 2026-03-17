import { useState, useEffect, useRef } from "react";
import { Share2, Home, Mail, Twitter, Linkedin, Link, MessageCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

interface HeroBannerProps {
  title: string;
  description?: string;
  category?: string;
  badge?: string;
  heroMeta?: string[];
  breadcrumbs?: { label: string; href?: string }[];
  showActions?: boolean;
}

const HeroBanner = ({
  title,
  description,
  badge,
  heroMeta = [],
  breadcrumbs = [],
  showActions = false,
}: HeroBannerProps) => {
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [shareOpen]);

  const handleShare = (platform: "email" | "whatsapp" | "twitter" | "linkedin" | "copy") => {
    const url = window.location.href;
    setShareOpen(false);
    if (platform === "email") {
      window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => toast.success("Link copied to clipboard!"));
    }
  };

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden pt-4 pb-16 px-6"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.06), transparent),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255,255,255,0.04), transparent),
            linear-gradient(to right, #192D6C, #051139)
          `,
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)" }}
          />
          <div
            className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)" }}
          />
          <div
            className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)" }}
          />
          <div
            className="absolute top-[5%] right-[35%] w-32 h-32 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)" }}
          />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center justify-between pb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, i) => (
                    <BreadcrumbItem key={i}>
                      {i > 0 && <BreadcrumbSeparator className="text-hero-foreground/30" />}
                      {i === 0 && <Home className="mr-1 h-3.5 w-3.5 text-hero-foreground/50" />}
                      {crumb.href ? (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-hero-foreground/50 hover:text-hero-foreground/80 text-sm"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-medium text-hero-foreground/80 text-sm">
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              {showActions && (
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() => setShareOpen((o) => !o)}
                    className="p-2 rounded-lg backdrop-blur-sm bg-hero-foreground/[0.08] border border-hero-foreground/[0.1] hover:bg-hero-foreground/[0.15] transition-all text-hero-foreground/70 hover:text-hero-foreground"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  {shareOpen && (
                    <div className="absolute top-full mt-2 right-0 z-50 w-48 rounded-xl backdrop-blur-xl bg-hero-foreground/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.2)] py-1">
                      <button
                        onClick={() => handleShare("email")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-hero-foreground/80 hover:bg-hero-foreground/[0.1] hover:text-hero-foreground transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </button>
                      <button
                        onClick={() => handleShare("whatsapp")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-hero-foreground/80 hover:bg-hero-foreground/[0.1] hover:text-hero-foreground transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-hero-foreground/80 hover:bg-hero-foreground/[0.1] hover:text-hero-foreground transition-colors"
                      >
                        <Twitter className="h-3.5 w-3.5" /> Twitter / X
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-hero-foreground/80 hover:bg-hero-foreground/[0.1] hover:text-hero-foreground transition-colors"
                      >
                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-hero-foreground/80 hover:bg-hero-foreground/[0.1] hover:text-hero-foreground transition-colors"
                      >
                        <Link className="h-3.5 w-3.5" /> Copy Link
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Glassmorphism content panel */}
          <div className="backdrop-blur-xl bg-hero-foreground/[0.07] border border-hero-foreground/[0.12] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="space-y-3">
              {badge && (
                <span className="inline-block rounded-full backdrop-blur-sm bg-hero-foreground/[0.1] border border-hero-foreground/[0.15] text-hero-foreground/90 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
                  {badge}
                </span>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-hero-foreground md:text-3xl lg:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="max-w-2xl text-base leading-relaxed text-hero-foreground/70">{description}</p>
              )}
              {heroMeta.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {heroMeta.map((meta, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-lg backdrop-blur-sm bg-hero-foreground/[0.08] border border-hero-foreground/[0.1] text-hero-foreground/80 px-3 py-1.5 text-xs font-medium"
                    >
                      {meta}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
