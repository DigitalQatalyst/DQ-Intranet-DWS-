import React, { useEffect, useState, useMemo } from 'react';
import {
    LayoutGrid,
    Search,
    Filter,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    SearchX,
    MessageCircle,
    Calendar,
    Tool,
    Laptop,
    Briefcase,
    ArrowRight
} from 'lucide-react';
import { BurgerMenuButton } from '../../../components/Sidebar';
import { mockServiceRequests } from '../../../components/serviceRequests/mockData';
import { ServiceRequest, ServiceRequestStatus } from '../../../types';
import { StatusBadge } from '../../../components/serviceRequests/StatusBadge';
import { ServiceRequestDetails } from '../../../components/serviceRequests/ServiceRequestDetails';

export function ServiceRequestsPage({ isLoggedIn, setIsOpen }: { isLoggedIn: boolean; setIsOpen: (value: boolean) => void; }) {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [showNewRequestOptions, setShowNewRequestOptions] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            setRequests(mockServiceRequests);
            setIsLoading(false);
        };
        fetchRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = activeTab === 'all' ||
                (activeTab === 'pending' && (req.status === 'under-review' || req.status === 'pending')) ||
                (activeTab === 'resolved' && (req.status === 'approved' || req.status === 'resolved'));

            return matchesSearch && matchesTab;
        });
    }, [requests, searchQuery, activeTab]);

    const stats = useMemo(() => {
        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'under-review' || r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved' || r.status === 'resolved').length,
            rejected: requests.filter(r => r.status === 'rejected').length
        };
    }, [requests]);

    const requestTypes = [
        { id: 'it-support', label: 'IT Support', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'leave-request', label: 'Leave Request', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'tool-request', label: 'Tool Request', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
            {/* Premium Header Section */}
            <div className="bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#2A3F7E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="lg:hidden">
                                <BurgerMenuButton
                                    onClick={() => setIsOpen(true)}
                                    isLoggedIn={isLoggedIn}
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Service Hub
                                </h1>
                                <p className="mt-2 text-blue-200/80 text-base md:text-lg">
                                    Manage your requests for IT, HR, and tools in one place
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNewRequestOptions(!showNewRequestOptions)}
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FB5535] hover:bg-[#e24a2d] text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                            >
                                <Plus size={18} />
                                New Request
                            </button>

                            {showNewRequestOptions && (
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-2">
                                        {requestTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                                                >
                                                    <div className={`p-2 rounded-lg ${type.bg} ${type.color}`}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{type.label}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Click to start request</p>
                                                    </div>
                                                    <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-1 mt-10 mb-0 overflow-x-auto no-scrollbar pt-2">
                        {[
                            { id: 'all', label: 'All Requests', icon: LayoutGrid },
                            { id: 'pending', label: 'In Progress', icon: Clock },
                            { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold rounded-t-2xl transition-all relative whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? 'bg-white text-[#030F35] shadow-lg translate-y-[-2px]'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <Icon size={18} className={activeTab === tab.id ? 'text-[#1A2E6E]' : 'text-blue-300'} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FB5535] rounded-t-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Requests', value: stats.total, color: 'bg-blue-500', icon: LayoutGrid, sub: 'All time' },
                        { label: 'Pending', value: stats.pending, color: 'bg-orange-500', icon: Clock, sub: 'Active now' },
                        { label: 'Approved', value: stats.approved, color: 'bg-emerald-500', icon: CheckCircle2, sub: 'Successful' },
                        { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', icon: AlertCircle, sub: 'Need review' }
                    ].map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20 p-5 group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${s.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} className={s.color.replace('bg-', 'text-')} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.sub}</span>
                                </div>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</p>
                                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20 mb-8 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full max-w-md">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by request name or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                    {filteredRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Request Details</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Submitted</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl ${req.category.includes('IT') ? 'bg-blue-50 text-blue-500' :
                                                        req.category.includes('Leave') ? 'bg-emerald-50 text-emerald-500' :
                                                            'bg-purple-50 text-purple-500'
                                                        } flex items-center justify-center shrink-0`}>
                                                        {req.category.includes('IT') ? <Laptop size={20} /> :
                                                            req.category.includes('Leave') ? <Calendar size={20} /> :
                                                                <Briefcase size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{req.serviceName}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">ID: {req.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">{req.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {new Date(req.submittedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">{new Date(req.submittedDate).getFullYear()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#FB5535] uppercase tracking-wider hover:translate-x-1 transition-all"
                                                >
                                                    Details
                                                    <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchX size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 font-medium">
                                We couldn't find any service requests matching your current filters.
                            </p>
                            <button
                                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-[#030F35] rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Need immediate assistance?</h2>
                            <p className="text-blue-200/70 text-base max-w-lg font-medium">
                                Our support team is available 24/7 to help you with any platform issues or urgent service requests.
                            </p>
                        </div>
                        <button className="whitespace-nowrap flex items-center gap-3 px-8 py-4 bg-white text-[#030F35] rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-blue-900/40">
                            <MessageCircle size={18} className="text-[#FB5535]" />
                            Live Chat Support
                        </button>
                    </div>
                </div>
            </div>

            {/* Request Details Modal */}
            {selectedRequest && (
                <ServiceRequestDetails
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    );
}

export default ServiceRequestsPage;
