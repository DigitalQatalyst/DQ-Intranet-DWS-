import React, { useState } from "react";
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Flag,
    MoreVertical,
    Calendar,
    Tag,
    ChevronDown,
    ChevronRight,
    Sparkles,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    dueDate?: string;
    tags?: string[];
    assignee?: string;
    project?: string;
}

// Sample tasks data
const sampleTasks: Task[] = [
    {
        id: "1",
        title: "Complete quarterly report review",
        description: "Review and finalize Q4 financial reports",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-01-12",
        tags: ["Reports", "Finance"],
        project: "Q4 Closing",
    },
    {
        id: "2",
        title: "Update team documentation",
        description: "Add new onboarding guides to the knowledge base",
        status: "todo",
        priority: "medium",
        dueDate: "2026-01-15",
        tags: ["Documentation"],
        project: "Knowledge Base",
    },
    {
        id: "3",
        title: "Schedule stakeholder meeting",
        status: "completed",
        priority: "medium",
        dueDate: "2026-01-08",
        tags: ["Meetings"],
        project: "Client Relations",
    },
    {
        id: "4",
        title: "Review compliance checklist",
        description: "Ensure all regulatory requirements are met",
        status: "todo",
        priority: "urgent",
        dueDate: "2026-01-10",
        tags: ["Compliance", "Urgent"],
        project: "Regulatory",
    },
    {
        id: "5",
        title: "Prepare presentation slides",
        description: "Create slides for the upcoming board meeting",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-01-14",
        tags: ["Presentations"],
        project: "Board Meeting",
    },
    {
        id: "6",
        title: "Update API documentation",
        status: "todo",
        priority: "low",
        dueDate: "2026-01-20",
        tags: ["Technical", "Documentation"],
        project: "Developer Portal",
    },
];

interface TasksTabProps {
    searchQuery: string;
}

const priorityConfig = {
    low: { color: "text-gray-500", bg: "bg-gray-100", icon: Flag, label: "Low" },
    medium: {
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Flag,
        label: "Medium",
    },
    high: {
        color: "text-orange-500",
        bg: "bg-orange-50",
        icon: Flag,
        label: "High",
    },
    urgent: {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: AlertCircle,
        label: "Urgent",
    },
};

const statusConfig = {
    todo: { color: "text-gray-500", bg: "bg-gray-100", label: "To Do" },
    in_progress: {
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "In Progress",
    },
    completed: {
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Completed",
    },
};

const TasksTab: React.FC<TasksTabProps> = ({ searchQuery }) => {
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "in_progress",
        "todo",
    ]);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section]
        );
    };

    const toggleTaskStatus = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status: task.status === "completed" ? "todo" : "completed",
                    }
                    : task
            )
        );
    };

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.project?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedTasks = {
        in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
        todo: filteredTasks.filter((t) => t.status === "todo"),
        completed: filteredTasks.filter((t) => t.status === "completed"),
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const diffDays = Math.ceil(
            (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) return { text: "Overdue", color: "text-red-600" };
        if (diffDays === 0) return { text: "Today", color: "text-orange-600" };
        if (diffDays === 1) return { text: "Tomorrow", color: "text-blue-600" };
        if (diffDays <= 7)
            return { text: `${diffDays} days`, color: "text-gray-600" };
        return {
            text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            color: "text-gray-500",
        };
    };

    const renderTaskCard = (task: Task) => {
        const priority = priorityConfig[task.priority];
        const PriorityIcon = priority.icon;
        const dueInfo = task.dueDate ? formatDate(task.dueDate) : null;

        return (
            <div
                key={task.id}
                className={`group relative bg-white rounded-xl border border-gray-100 p-4 
                   shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200
                   ${task.status === "completed" ? "opacity-70" : ""}`}
            >
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                    >
                        {task.status === "completed" ? (
                            <CheckCircle2 size={22} className="text-green-500" />
                        ) : (
                            <Circle
                                size={22}
                                className="text-gray-300 hover:text-blue-400 transition-colors"
                            />
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <h3
                                className={`font-medium text-gray-900 leading-snug
                           ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                            >
                                {task.title}
                            </h3>
                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 
                           rounded transition-all"
                            >
                                <MoreVertical size={16} className="text-gray-400" />
                            </button>
                        </div>

                        {task.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {task.project && (
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 
                               text-indigo-600 text-xs font-medium rounded-md"
                                >
                                    <Sparkles size={12} />
                                    {task.project}
                                </span>
                            )}

                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 ${priority.bg} 
                           ${priority.color} text-xs font-medium rounded-md`}
                            >
                                <PriorityIcon size={12} />
                                {priority.label}
                            </span>

                            {dueInfo && (
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 
                               ${dueInfo.color} text-xs font-medium rounded-md`}
                                >
                                    <Clock size={12} />
                                    {dueInfo.text}
                                </span>
                            )}

                            {task.tags?.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 
                             text-gray-600 text-xs rounded-md"
                                >
                                    <Tag size={10} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSection = (
        status: "in_progress" | "todo" | "completed",
        title: string
    ) => {
        const isExpanded = expandedSections.includes(status);
        const statusTasks = groupedTasks[status];
        const config = statusConfig[status];

        return (
            <div key={status} className="mb-6">
                <button
                    onClick={() => toggleSection(status)}
                    className="w-full flex items-center gap-3 mb-3 group"
                >
                    <div className="flex items-center gap-2">
                        {isExpanded ? (
                            <ChevronDown size={18} className="text-gray-400" />
                        ) : (
                            <ChevronRight size={18} className="text-gray-400" />
                        )}
                        <span className={`text-sm font-semibold ${config.color}`}>
                            {title}
                        </span>
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
                        >
                            {statusTasks.length}
                        </span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                </button>

                {isExpanded && (
                    <div className="space-y-3 ml-6">
                        {statusTasks.length > 0 ? (
                            statusTasks.map(renderTaskCard)
                        ) : (
                            <div className="py-8 text-center">
                                <Circle size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No tasks in this section</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Total Tasks",
                        value: filteredTasks.length,
                        color: "bg-gradient-to-br from-indigo-500 to-purple-600",
                    },
                    {
                        label: "In Progress",
                        value: groupedTasks.in_progress.length,
                        color: "bg-gradient-to-br from-blue-500 to-cyan-600",
                    },
                    {
                        label: "To Do",
                        value: groupedTasks.todo.length,
                        color: "bg-gradient-to-br from-amber-500 to-orange-600",
                    },
                    {
                        label: "Completed",
                        value: groupedTasks.completed.length,
                        color: "bg-gradient-to-br from-green-500 to-emerald-600",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-xl bg-white border border-gray-100 
                       shadow-sm p-4"
                    >
                        <div
                            className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}
                        />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {stat.label}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Task Sections */}
            {renderSection("in_progress", "In Progress")}
            {renderSection("todo", "To Do")}
            {renderSection("completed", "Completed")}
        </div>
    );
};

export default TasksTab;
