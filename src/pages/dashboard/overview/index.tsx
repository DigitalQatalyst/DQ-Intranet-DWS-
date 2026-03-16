import React, { useState } from 'react';
import {
    LayoutGrid,
    Bell,
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Plus,
    ArrowRight,
    Search,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { useMsal } from "@azure/msal-react";
import { OnboardingProgress } from './OnboardingProgress';
import { ServiceRequestsTable } from './ServiceRequestsTable';
import { ObligationsDeadlines as UpcomingTasks } from './ObligationsDeadlines';
import { QuickActions } from './QuickActions';
import { Announcements } from './Announcements';
import { BurgerMenuButton } from '../../../components/Sidebar';

export const Overview: React.FC = () => {
    const { accounts } = useMsal();
    const account = accounts[0];
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    // These props are typically passed down from DashboardRouter via Context or props
    // For now, using common defaults or placeholders
    const [isOpen, setIsOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const firstName = account?.name?.split(' ')[0] || "Pioneer";

    // Mock onboarding progress data
    const onboardingData = {
        profileCompletion: 75,
        documentCompletion: 60,
        overallCompletion: 68,
    };

    // Quick stats mock data
    const stats = [
        { label: "Active Requests", value: "12", subLabel: "+3 this month", color: "bg-blue-500", icon: FileText },
        { label: "Pending Tasks", value: "8", subLabel: "2 due today", color: "bg-orange-500", icon: Clock },
        { label: "Approvals", value: "5", subLabel: "Verified records", color: "bg-green-500", icon: CheckCircle2 },
        { label: "Alerts", value: "2", subLabel: "Action required", color: "bg-red-500", icon: AlertCircle }
    ];

    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        setTimeout(() => setIsLoading(false), 1500);
    };

    if (hasError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to load dashboard</h3>
                    <p className="text-gray-500 mb-8 text-sm">
                        We encountered an issue while loading your dashboard data. Please try again.
                    </p>
                    <button
                        onClick={handleRetry}
                        className="w-full py-3 bg-[#030F35] text-white rounded-xl font-semibold hover:bg-[#0a1a4a] transition-all"
                    >
                        Retry Loading
                    </button>
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
                                    onClick={() => setIsOpen(!isOpen)}
                                    isLoggedIn={isLoggedIn}
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Welcome back, {firstName}
                                </h1>
                                <p className="mt-2 text-blue-200/80 text-base md:text-lg">
                                    Let's continue with your onboarding journey and pending tasks.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all relative group">
                                <Bell size={22} className="text-white group-hover:scale-110 transition-transform" />
                                <span className="absolute top-2 right-2 bg-[#FB5535] h-2.5 w-2.5 rounded-full border-2 border-[#1A2E6E]"></span>
                            </button>
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                                <Calendar size={22} className="text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => console.log('New Request')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FB5535] hover:bg-[#e24a2d] 
                                         text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 
                                         transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                            >
                                <Plus size={20} />
                                <span>New Request</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20 p-5 hover:shadow-2xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} className={stat.color.replace('bg-', 'text-')} />
                                    </div>
                                    <TrendingUp size={16} className="text-green-500" />
                                </div>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-500 font-medium">{stat.subLabel}</span>
                                    <ArrowRight size={10} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Column (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Setup Progress - Only show if not complete */}
                        {onboardingData.overallCompletion < 100 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <OnboardingProgress
                                    profileCompletion={onboardingData.profileCompletion}
                                    documentCompletion={onboardingData.documentCompletion}
                                    overallCompletion={onboardingData.overallCompletion}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}

                        {/* Recent Service Requests */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Recent Service Requests</h3>
                                    <p className="text-sm text-gray-500">Track and manage your ongoing requests</p>
                                </div>
                                <button className="text-xs font-bold text-[#1A2E6E] hover:underline flex items-center gap-1">
                                    View All <ArrowRight size={14} />
                                </button>
                            </div>
                            <ServiceRequestsTable isLoading={isLoading} />
                        </div>

                        {/* Tasks Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Upcoming Tasks</h3>
                                    <p className="text-sm text-gray-500">Track and manage your platform activities</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                        <Filter size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                            <UpcomingTasks isLoading={isLoading} />
                        </div>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-8">
                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <QuickActions />
                        </div>

                        {/* Announcements Section */}
                        <div className="bg-[#1A2E6E] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <LayoutGrid size={120} />
                            </div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <LayoutGrid size={20} className="text-blue-300" />
                                Announcements
                            </h3>
                            <Announcements isLoading={isLoading} />
                            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                                <button className="text-sm font-bold text-blue-300 hover:text-white transition-colors">
                                    View Update Log
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
