import React from 'react';
import {
    FileUp,
    FileText,
    PieChart,
    MessageSquare,
    ChevronRight
} from 'lucide-react';

export const QuickActions: React.FC = () => {
    const actions = [
        {
            id: 'submit-request',
            label: 'New Request',
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            onClick: () => console.log('Submit Request clicked'),
        },
        {
            id: 'upload-documents',
            label: 'Add Document',
            icon: FileUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
            onClick: () => console.log('Upload Documents clicked'),
        },
        {
            id: 'view-reports',
            label: 'Analytics',
            icon: PieChart,
            color: "text-purple-600",
            bg: "bg-purple-50",
            onClick: () => console.log('View Reports clicked'),
        },
        {
            id: 'contact-support',
            label: 'Help Center',
            icon: MessageSquare,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            onClick: () => console.log('Contact Support clicked'),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white 
                                 hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                        <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                            <Icon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="text-sm font-bold text-gray-800">{action.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                );
            })}
        </div>
    );
};
