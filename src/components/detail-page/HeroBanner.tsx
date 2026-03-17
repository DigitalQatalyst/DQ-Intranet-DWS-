import { Share2, Bookmark, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
}: HeroBannerProps) => (
  <div className="relative">
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900">
      <div className="container mx-auto relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center justify-between pt-4 pb-2 px-6">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i) => (
                  <BreadcrumbItem key={i}>
                    {i > 0 && <BreadcrumbSeparator className="text-white/30" />}
                    {i === 0 && <Home className="mr-1 h-3 w-3 text-white/50" />}
                    {crumb.href ? (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-white/50 hover:text-white/80 text-xs"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-medium text-white/80 text-xs">
                        {crumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white">
                  <Share2 className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white">
                  <Bookmark className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hero Content Container - Card-like with rounded corners and subtle border */}
        <div className="px-6 pb-8 pt-2">
          <div className="max-w-4xl bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-xl">
            {/* Badge above title */}
            {badge && (
              <span className="inline-block rounded bg-white/20 text-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
                {badge}
              </span>
            )}

            {/* Large Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl mb-4">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="max-w-2xl text-base leading-relaxed text-white/80">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroBanner;