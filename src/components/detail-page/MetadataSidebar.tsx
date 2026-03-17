import { Bookmark, ArrowRight } from "lucide-react";
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
  ctaDisabled?: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaOnClick?: () => void;
  isSaved?: boolean;
  tags?: string[];
}

const MetadataSidebar = ({ config }: { config: SidebarConfig }) => (
  <div className="sticky top-16 space-y-4">
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base font-semibold">{config.summaryTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="space-y-2.5 mb-5">
          {config.rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground text-right max-w-[60%]">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          <Button
            onClick={config.ctaOnClick}
            disabled={config.ctaDisabled}
            className="w-full py-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#030F35' }}
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
              <Bookmark
                className="mr-2 h-4 w-4"
                style={config.isSaved
                  ? { fill: '#030F35', stroke: 'none' }
                  : undefined
                }
              />
              {config.secondaryCtaLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

    {config.tags && config.tags.length > 0 && (
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="px-5 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="rounded-md px-3 py-1 text-xs font-medium">
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
