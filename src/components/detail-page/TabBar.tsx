import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  description?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const TabBar = ({ tabs, activeTab, onTabChange }: TabBarProps) => {
  const activeDescription = tabs.find(t => t.id === activeTab)?.description;

  return (
    <div className="bg-background sticky top-0 z-10">
      <div className="flex gap-0 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-[#030F35]"
                : "text-muted-foreground hover:text-[#030F35]"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#030F35]" />
            )}
          </button>
        ))}
      </div>
      {activeDescription && (
        <p className="px-5 py-3 text-base text-muted-foreground">
          {activeDescription}
        </p>
      )}
    </div>
  );
};

export default TabBar;
