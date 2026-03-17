import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export interface RelatedItem {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

const RelatedItems = ({
  title,
  browseLabel,
  browseHref = "#",
  items,
  emptyMessage = "No additional content yet.",
}: {
  title: string;
  browseLabel?: string;
  browseHref?: string;
  items: RelatedItem[];
  emptyMessage?: string;
}) => (
  <section className="border-t bg-secondary/30 px-6 py-12">
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {browseLabel && (
          <a
            href={browseHref}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {browseLabel} <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Card
              key={i}
              className="group cursor-pointer rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-5">
                <Badge
                  variant="outline"
                  className="mb-3 rounded-full text-[11px] font-medium uppercase tracking-wide"
                >
                  {item.category}
                </Badge>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="flex items-center gap-1 text-xs font-medium text-cta">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default RelatedItems;