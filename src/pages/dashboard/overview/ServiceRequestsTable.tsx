import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface ServiceRequestsTableProps {
    isLoading: boolean;
}

const serviceRequests = [
    {
        id: 'SR-2026-004',
        category: 'Salary Certificate Request',
        status: 'In Progress',
        submittedDate: 'Jan 08, 2026',
    },
    {
        id: 'SR-2026-005',
        category: 'Annual Leave Application',
        status: 'Pending Review',
        submittedDate: 'Jan 07, 2026',
    },
    {
        id: 'SR-2026-006',
        category: 'Visa Sponsorship Letter',
        status: 'Approved',
        submittedDate: 'Jan 05, 2026',
    },
];

export const ServiceRequestsTable: React.FC<ServiceRequestsTableProps> = ({
    isLoading,
}) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-50 text-green-700 bg-opacity-70';
            case 'In Progress':
                return 'bg-blue-50 text-blue-700 bg-opacity-70';
            case 'Pending Review':
                return 'bg-orange-50 text-orange-700 bg-opacity-70';
            default:
                return 'bg-gray-50 text-gray-700 bg-opacity-70';
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-50 rounded-xl w-full"></div>
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-14 bg-gray-50 rounded-xl w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Request ID
                            </th>
                            <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-4 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {serviceRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {request.id}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {request.category}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusStyles(request.status)}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {request.submittedDate}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
