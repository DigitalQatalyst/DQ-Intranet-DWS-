import React, { useState } from "react";
import {
    ListTodo,
    Columns3,
    Calendar,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
} from "lucide-react";
import TasksTab from "./tabs/TasksTab";
import KanbanTab from "./tabs/KanbanTab";
import CalendarTab from "./tabs/CalendarTab";

type TabId = "tasks" | "kanban" | "calendar";

interface Tab {
    id: TabId;
    label: string;
    icon: React.ReactNode;
}

const tabs: Tab[] = [
    { id: "tasks", label: "My Tasks", icon: <ListTodo size={18} /> },
    { id: "kanban", label: "Planner", icon: <Columns3 size={18} /> },
    { id: "calendar", label: "Calendar", icon: <Calendar size={18} /> },
];

const WorkspacePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>("tasks");
    const [searchQuery, setSearchQuery] = useState("");

    const renderTabContent = () => {
        switch (activeTab) {
            case "tasks":
                return <TasksTab searchQuery={searchQuery} />;
            case "kanban":
                return <KanbanTab searchQuery={searchQuery} />;
            case "calendar":
                return <CalendarTab />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#2A3F7E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                My Workspace
                            </h1>
                            <p className="mt-1 text-blue-200/80 text-sm md:text-base">
                                Organize your work, track progress, and manage your schedule
                            </p>
                        </div>
                        <button
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FB5535] hover:bg-[#e24a2d] 
                         text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 
                         transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            <span>New Task</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 flex gap-1 overflow-x-auto pb-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm
                           transition-all duration-200 whitespace-nowrap
                           ${activeTab === tab.id
                                        ? "bg-white text-[#030F35] shadow-lg"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                         text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 
                           bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700
                           transition-colors"
                            >
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                            <button
                                className="inline-flex items-center justify-center p-2.5 border border-gray-200
                           bg-white hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default WorkspacePage;
