import React, { useState } from "react";
import {
    MoreVertical,
    Plus,
    Clock,
    User,
    MessageSquare,
    Paperclip,
    Flag,
    GripVertical,
} from "lucide-react";

interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    assignee?: {
        name: string;
        avatar?: string;
    };
    dueDate?: string;
    comments?: number;
    attachments?: number;
    tags?: string[];
}

interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    cards: KanbanCard[];
}

const initialColumns: KanbanColumn[] = [
    {
        id: "backlog",
        title: "Backlog",
        color: "bg-gray-400",
        cards: [
            {
                id: "1",
                title: "Research competitor analysis",
                description: "Analyze top 5 competitors in the market",
                priority: "low",
                tags: ["Research"],
                comments: 2,
            },
            {
                id: "2",
                title: "Update brand guidelines",
                priority: "medium",
                dueDate: "2026-01-25",
                tags: ["Design"],
            },
        ],
    },
    {
        id: "todo",
        title: "To Do",
        color: "bg-blue-500",
        cards: [
            {
                id: "3",
                title: "Create user flow diagrams",
                description: "Design the complete user journey for onboarding",
                priority: "high",
                assignee: { name: "Sarah M." },
                dueDate: "2026-01-14",
                tags: ["UX", "Design"],
                comments: 5,
                attachments: 3,
            },
            {
                id: "4",
                title: "API integration planning",
                priority: "medium",
                dueDate: "2026-01-16",
                tags: ["Technical"],
                comments: 1,
            },
        ],
    },
    {
        id: "in_progress",
        title: "In Progress",
        color: "bg-amber-500",
        cards: [
            {
                id: "5",
                title: "Dashboard wireframes",
                description: "Create low-fidelity wireframes for the new dashboard",
                priority: "high",
                assignee: { name: "John D." },
                dueDate: "2026-01-11",
                tags: ["Design", "Priority"],
                comments: 8,
                attachments: 2,
            },
            {
                id: "6",
                title: "Write technical documentation",
                priority: "medium",
                tags: ["Documentation"],
            },
        ],
    },
    {
        id: "review",
        title: "In Review",
        color: "bg-purple-500",
        cards: [
            {
                id: "7",
                title: "Security audit report",
                description: "Review and approve the Q4 security findings",
                priority: "high",
                assignee: { name: "Mike R." },
                dueDate: "2026-01-10",
                tags: ["Security", "Urgent"],
                comments: 12,
                attachments: 5,
            },
        ],
    },
    {
        id: "done",
        title: "Done",
        color: "bg-green-500",
        cards: [
            {
                id: "8",
                title: "Launch landing page",
                priority: "high",
                assignee: { name: "Emily S." },
                tags: ["Marketing"],
                comments: 15,
                attachments: 8,
            },
            {
                id: "9",
                title: "Customer feedback review",
                priority: "low",
                tags: ["Research"],
                comments: 3,
            },
        ],
    },
];

interface KanbanTabProps {
    searchQuery: string;
}

const priorityColors = {
    low: "bg-gray-200 text-gray-600",
    medium: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
};

const KanbanTab: React.FC<KanbanTabProps> = ({ searchQuery }) => {
    const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
    const [draggedCard, setDraggedCard] = useState<{
        cardId: string;
        sourceColumnId: string;
    } | null>(null);

    const handleDragStart = (cardId: string, sourceColumnId: string) => {
        setDraggedCard({ cardId, sourceColumnId });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetColumnId: string) => {
        if (!draggedCard) return;

        const { cardId, sourceColumnId } = draggedCard;
        if (sourceColumnId === targetColumnId) {
            setDraggedCard(null);
            return;
        }

        setColumns((prev) => {
            const sourceColumn = prev.find((col) => col.id === sourceColumnId);
            const card = sourceColumn?.cards.find((c) => c.id === cardId);
            if (!card) return prev;

            return prev.map((col) => {
                if (col.id === sourceColumnId) {
                    return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
                }
                if (col.id === targetColumnId) {
                    return { ...col, cards: [...col.cards, card] };
                }
                return col;
            });
        });

        setDraggedCard(null);
    };

    const filteredColumns = columns.map((column) => ({
        ...column,
        cards: column.cards.filter(
            (card) =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.tags?.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                )
        ),
    }));

    const formatDueDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const diffDays = Math.ceil(
            (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) return { text: "Overdue", isOverdue: true };
        if (diffDays === 0) return { text: "Today", isOverdue: false };
        if (diffDays === 1) return { text: "Tomorrow", isOverdue: false };
        return {
            text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            isOverdue: false,
        };
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
                {filteredColumns.map((column) => (
                    <div
                        key={column.id}
                        className="w-72 flex-shrink-0"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(column.id)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                                <h3 className="font-semibold text-gray-800 text-sm">
                                    {column.title}
                                </h3>
                                <span
                                    className="text-xs font-medium text-gray-500 bg-gray-100 
                               px-1.5 py-0.5 rounded"
                                >
                                    {column.cards.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Add card"
                                >
                                    <Plus size={16} className="text-gray-400" />
                                </button>
                                <button
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="More options"
                                >
                                    <MoreVertical size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div
                            className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors
                         ${draggedCard && draggedCard.sourceColumnId !== column.id
                                    ? "bg-blue-50/50 border-2 border-dashed border-blue-200"
                                    : "bg-gray-50/50"
                                }`}
                        >
                            {column.cards.map((card) => {
                                const dueInfo = card.dueDate
                                    ? formatDueDate(card.dueDate)
                                    : null;

                                return (
                                    <div
                                        key={card.id}
                                        draggable
                                        onDragStart={() => handleDragStart(card.id, column.id)}
                                        className={`group bg-white rounded-lg border border-gray-100 shadow-sm 
                               hover:shadow-md hover:border-gray-200 transition-all duration-200
                               cursor-grab active:cursor-grabbing
                               ${draggedCard?.cardId === card.id ? "opacity-50" : ""}`}
                                    >
                                        <div className="p-3">
                                            {/* Card Header with Drag Handle */}
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-start gap-2 flex-1">
                                                    <GripVertical
                                                        size={14}
                                                        className="text-gray-300 mt-0.5 opacity-0 group-hover:opacity-100 
                                     transition-opacity flex-shrink-0"
                                                    />
                                                    <h4 className="text-sm font-medium text-gray-800 leading-snug">
                                                        {card.title}
                                                    </h4>
                                                </div>
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity 
                                   p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <MoreVertical size={14} className="text-gray-400" />
                                                </button>
                                            </div>

                                            {/* Description */}
                                            {card.description && (
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2 ml-6">
                                                    {card.description}
                                                </p>
                                            )}

                                            {/* Tags */}
                                            {card.tags && card.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2 ml-6">
                                                    {card.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] font-medium px-1.5 py-0.5 
                                       bg-gray-100 text-gray-600 rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Card Footer */}
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 ml-6">
                                                <div className="flex items-center gap-2">
                                                    {/* Priority */}
                                                    <span
                                                        className={`flex items-center gap-1 text-[10px] font-medium 
                                       px-1.5 py-0.5 rounded ${priorityColors[card.priority]}`}
                                                    >
                                                        <Flag size={10} />
                                                        {card.priority.charAt(0).toUpperCase() +
                                                            card.priority.slice(1)}
                                                    </span>

                                                    {/* Due Date */}
                                                    {dueInfo && (
                                                        <span
                                                            className={`flex items-center gap-1 text-[10px] font-medium
                                         ${dueInfo.isOverdue ? "text-red-600" : "text-gray-500"}`}
                                                        >
                                                            <Clock size={10} />
                                                            {dueInfo.text}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Comments */}
                                                    {card.comments && card.comments > 0 && (
                                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                            <MessageSquare size={10} />
                                                            {card.comments}
                                                        </span>
                                                    )}

                                                    {/* Attachments */}
                                                    {card.attachments && card.attachments > 0 && (
                                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                            <Paperclip size={10} />
                                                            {card.attachments}
                                                        </span>
                                                    )}

                                                    {/* Assignee */}
                                                    {card.assignee && (
                                                        <div
                                                            className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 
                                         to-purple-500 flex items-center justify-center"
                                                            title={card.assignee.name}
                                                        >
                                                            <span className="text-[9px] font-bold text-white">
                                                                {getInitials(card.assignee.name)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Card Button */}
                            <button
                                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 
                           hover:bg-gray-100 rounded-lg transition-colors flex items-center 
                           justify-center gap-1"
                            >
                                <Plus size={14} />
                                Add card
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Column Button */}
                <div className="w-72 flex-shrink-0">
                    <button
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl
                       text-sm font-medium text-gray-500 hover:text-gray-700 
                       hover:border-gray-300 hover:bg-gray-50 transition-all
                       flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add Column
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KanbanTab;
