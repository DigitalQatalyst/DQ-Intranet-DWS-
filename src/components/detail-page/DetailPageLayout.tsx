import { useState } from "react";
import { Header } from "../Header";
import HeroBanner from "./HeroBanner";
import TabBar, { type TabItem } from "./TabBar";
import TabContent, { type ContentBlock } from "./TabContent";
import MetadataSidebar, { type SidebarConfig } from "./MetadataSidebar";
import RelatedItems, { type RelatedItem } from "./RelatedItems";
import { Footer } from "../Footer";

interface TabData {
  id: string;
  label: string;
  blocks: ContentBlock[];
}

interface DetailPageLayoutProps {
  title: string;
  description?: string;
  category?: string;
  badge?: string;
  heroMeta?: string[];
  breadcrumbs?: { label: string; href?: string }[];
  showHeroActions?: boolean;
  tabs?: TabData[];
  mainContent?: ContentBlock[];
  sidebarConfig: SidebarConfig;
  relatedTitle?: string;
  relatedBrowseLabel?: string;
  relatedItems?: RelatedItem[];
}

const DetailPageLayout = ({
  title,
  description,
  category,
  badge,
  heroMeta,
  breadcrumbs = [],
  showHeroActions = false,
  tabs,
  mainContent,
  sidebarConfig,
  relatedTitle = "Related Content",
  relatedBrowseLabel,
  relatedItems = [],
}: DetailPageLayoutProps) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id ?? "");

  const hasTabs = tabs && tabs.length > 0;
  const activeBlocks = hasTabs
    ? tabs.find((t) => t.id === activeTab)?.blocks ?? []
    : mainContent ?? [];
  const tabItems: TabItem[] = hasTabs ? tabs.map((t) => ({ id: t.id, label: t.label })) : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <HeroBanner
        title={title}
        description={description}
        category={category}
        badge={badge}
        heroMeta={heroMeta}
        breadcrumbs={breadcrumbs}
        showActions={showHeroActions}
      />

      <main className="flex-1 px-6 py-8">
        <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {hasTabs && (
              <TabBar tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
            )}
            <TabContent blocks={activeBlocks} />
          </div>
          <aside className="order-first lg:order-last">
            <MetadataSidebar config={sidebarConfig} />
          </aside>
        </div>
      </main>

      {relatedItems.length > 0 && (
        <RelatedItems
          title={relatedTitle}
          browseLabel={relatedBrowseLabel}
          items={relatedItems}
        />
      )}

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default DetailPageLayout;