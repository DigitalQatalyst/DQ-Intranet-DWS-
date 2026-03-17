import React from 'react';
import { Calendar, AlertCircle, Clock, ChevronRight } from 'lucide-react';

interface ObligationsDeadlinesProps {
    isLoading: boolean;
}

const obligations = [
    {
        id: 1,
        title: 'Submit Visa Documents',
        dueDate: 'Jan 05, 2026',
        status: 'overdue',
        type: 'reporting',
    },
    {
        id: 2,
        title: 'Complete Onboarding Modules',
        dueDate: 'Jan 15, 2026',
        status: 'upcoming',
        type: 'review',
    },
    {
        id: 3,
        title: 'Upload Degree Certificate',
        dueDate: 'Jan 20, 2026',
        status: 'upcoming',
        type: 'license',
    },
];

export const ObligationsDeadlines: React.FC<ObligationsDeadlinesProps> = ({
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-14 bg-gray-50 rounded-xl w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-50">
                        <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Task Name
                        </th>
                        <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            By When
                        </th>
                        <th className="px-4 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Next Steps
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {obligations.map((obligation) => (
                        <tr key={obligation.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${obligation.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                        {obligation.status === 'overdue' ? <AlertCircle size={16} /> : <Clock size={16} />}
                                    </div>
                                    <span className={`text-sm font-bold ${obligation.status === 'overdue' ? 'text-red-700' : 'text-gray-900'}`}>
                                        {obligation.title}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <Calendar size={14} />
                                    <span className="text-sm">{obligation.dueDate}</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-[#1A2E6E] hover:text-white transition-all">
                                    Continue
                                    <ChevronRight size={12} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
