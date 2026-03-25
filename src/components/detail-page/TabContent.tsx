import { CheckCircle2 } from "lucide-react";
import { type ReactNode } from "react";

export interface ContentBlock {
  type: "heading" | "paragraph" | "checklist" | "divider" | "custom";
  text?: string;
  items?: string[];
  render?: () => ReactNode;
}

const TabContent = ({ blocks }: { blocks: ContentBlock[] }) => (
  <div className="max-w-[65ch] space-y-6">
    {blocks.map((block, i) => {
      switch (block.type) {
        case "heading":
          return (
            <h2 key={i} className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <span className="h-6 w-1 rounded-full bg-cta" />
              {block.text}
            </h2>
          );
        case "paragraph":
          return (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {block.text}
            </p>
          );
        case "checklist":
          return (
            <ul key={i} className="space-y-3">
              {block.items?.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          );
        case "divider":
          return <hr key={i} className="border-border" />;
        case "custom":
          return <div key={i}>{block.render?.()}</div>;
        default:
          return null;
      }
    })}
  </div>
);

export default TabContent;