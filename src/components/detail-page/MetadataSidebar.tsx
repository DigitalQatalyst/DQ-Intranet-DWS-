import { Bookmark, ArrowRight, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SummaryRow {
  label: string;
  value: string;
}

export interface SidebarConfig {
  summaryTitle: string;
  rows: SummaryRow[];
  ctaLabel: string;
  ctaOnClick?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaOnClick?: () => void;
  showActions?: boolean;
  tags?: string[];
}

const MetadataSidebar = ({ config }: { config: SidebarConfig }) => (
  <div className="sticky top-8 space-y-4">
    {/* Summary Card */}
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base font-semibold">{config.summaryTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        {/* Summary rows */}
        <div className="space-y-2.5 mb-5">
          {config.rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="space-y-2.5">
          <Button
            onClick={config.ctaOnClick}
            className="w-full bg-cta py-5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            {config.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {config.secondaryCtaLabel && (
            <Button
              variant="outline"
              onClick={config.secondaryCtaOnClick}
              className="w-full py-5 text-sm font-medium"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              {config.secondaryCtaLabel}
            </Button>
          )}
        </div>

        {/* Actions */}
        {config.showActions && (
          <div className="mt-4 flex items-center justify-center gap-6 border-t pt-4">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Bookmark className="h-4 w-4" /> Bookmark
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Tags Card */}
    {config.tags && config.tags.length > 0 && (
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="px-5 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="rounded-md px-3 py-1 text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

export default MetadataSidebar;