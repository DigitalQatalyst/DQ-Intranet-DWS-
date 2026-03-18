import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
    Video,
    Plus,
    MoreVertical,
} from "lucide-react";

interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
    type: "meeting" | "session" | "reminder" | "personal";
    location?: string;
    attendees?: number;
    isVirtual?: boolean;
    color: string;
}

const sampleEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "Team Stand-up",
        startTime: "09:00",
        endTime: "09:30",
        date: "2026-01-09",
        type: "meeting",
        attendees: 8,
        isVirtual: true,
        color: "bg-blue-500",
    },
    {
        id: "2",
        title: "1:1 Coaching Session",
        startTime: "10:00",
        endTime: "11:00",
        date: "2026-01-09",
        type: "session",
        location: "Conference Room A",
        color: "bg-purple-500",
    },
    {
        id: "3",
        title: "Project Review",
        startTime: "14:00",
        endTime: "15:30",
        date: "2026-01-09",
        type: "meeting",
        attendees: 5,
        isVirtual: true,
        color: "bg-green-500",
    },
    {
        id: "4",
        title: "Lunch Break",
        startTime: "12:00",
        endTime: "13:00",
        date: "2026-01-09",
        type: "personal",
        color: "bg-amber-500",
    },
    {
        id: "5",
        title: "Training Workshop",
        startTime: "09:30",
        endTime: "11:30",
        date: "2026-01-10",
        type: "session",
        location: "Training Center",
        attendees: 15,
        color: "bg-indigo-500",
    },
    {
        id: "6",
        title: "Client Call",
        startTime: "15:00",
        endTime: "16:00",
        date: "2026-01-10",
        type: "meeting",
        attendees: 3,
        isVirtual: true,
        color: "bg-rose-500",
    },
    {
        id: "7",
        title: "Mentorship Session",
        startTime: "11:00",
        endTime: "12:00",
        date: "2026-01-13",
        type: "session",
        isVirtual: true,
        color: "bg-teal-500",
    },
    {
        id: "8",
        title: "Weekly Planning",
        startTime: "09:00",
        endTime: "10:00",
        date: "2026-01-13",
        type: "meeting",
        attendees: 6,
        isVirtual: true,
        color: "bg-cyan-500",
    },
];

const CalendarTab: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 9)); // January 9, 2026
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        new Date(2026, 0, 9)
    );
    const [view, setView] = useState<"week" | "month">("week");

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay, year, month };
    };

    const getWeekDays = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const weekDays: Date[] = [];
        for (let i = 0; i < 7; i++) {
            weekDays.push(new Date(date.getFullYear(), date.getMonth(), diff + i));
        }
        return weekDays;
    };

    const formatDateKey = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const getEventsForDate = (date: Date) => {
        const dateKey = formatDateKey(date);
        return sampleEvents.filter((event) => event.date === dateKey);
    };

    const navigateCalendar = (direction: "prev" | "next") => {
        if (view === "week") {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
            setCurrentDate(newDate);
        }
    };

    const today = new Date(2026, 0, 9); // Simulated "today"
    const weekDays = getWeekDays(currentDate);
    const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const isToday = (date: Date) => {
        return formatDateKey(date) === formatDateKey(today);
    };

    const isSelected = (date: Date) => {
        return selectedDate && formatDateKey(date) === formatDateKey(selectedDate);
    };

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    const typeConfig = {
        meeting: { icon: Users, label: "Meeting" },
        session: { icon: Clock, label: "Session" },
        reminder: { icon: Clock, label: "Reminder" },
        personal: { icon: Clock, label: "Personal" },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Calendar Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => navigateCalendar("prev")}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={18} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => navigateCalendar("next")}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentDate(today)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 
                         rounded-lg transition-colors"
                            >
                                Today
                            </button>
                            <div className="flex bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setView("week")}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                             ${view === "week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setView("month")}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                             ${view === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-100">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Body */}
                    {view === "week" ? (
                        <div className="grid grid-cols-7">
                            {weekDays.map((date) => {
                                const events = getEventsForDate(date);
                                return (
                                    <button
                                        key={formatDateKey(date)}
                                        onClick={() => setSelectedDate(date)}
                                        className={`min-h-[120px] p-2 border-r border-b border-gray-50 
                               text-left transition-colors hover:bg-gray-50
                               ${isSelected(date) ? "bg-blue-50/70 ring-2 ring-blue-500 ring-inset" : ""}
                               ${isToday(date) ? "bg-amber-50/30" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`text-sm font-medium inline-flex items-center justify-center 
                                   w-7 h-7 rounded-full
                                   ${isToday(date) ? "bg-[#FB5535] text-white" : "text-gray-700"}`}
                                            >
                                                {date.getDate()}
                                            </span>
                                            {events.length > 0 && (
                                                <span className="text-[10px] font-medium text-gray-400">
                                                    {events.length} event{events.length > 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {events.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`${event.color} text-white text-[10px] font-medium 
                                     px-1.5 py-0.5 rounded truncate`}
                                                >
                                                    {event.startTime} {event.title}
                                                </div>
                                            ))}
                                            {events.length > 3 && (
                                                <div className="text-[10px] text-gray-500 font-medium">
                                                    +{events.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-7">
                            {/* Empty cells for days before the month starts */}
                            {Array.from({ length: startingDay }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="min-h-[100px] p-2 border-r border-b border-gray-50 bg-gray-50/30"
                                />
                            ))}
                            {/* Days of the month */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(year, month, i + 1);
                                const events = getEventsForDate(date);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(date)}
                                        className={`min-h-[100px] p-2 border-r border-b border-gray-50 
                               text-left transition-colors hover:bg-gray-50
                               ${isSelected(date) ? "bg-blue-50/70 ring-2 ring-blue-500 ring-inset" : ""}
                               ${isToday(date) ? "bg-amber-50/30" : ""}`}
                                    >
                                        <span
                                            className={`text-sm font-medium inline-flex items-center justify-center
                                 w-6 h-6 rounded-full
                                 ${isToday(date) ? "bg-[#FB5535] text-white" : "text-gray-700"}`}
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="mt-1 space-y-0.5">
                                            {events.slice(0, 2).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`${event.color} text-white text-[9px] font-medium 
                                     px-1 py-0.5 rounded truncate`}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {events.length > 2 && (
                                                <div className="text-[9px] text-gray-400 font-medium pl-1">
                                                    +{events.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Events Sidebar */}
            <div className="space-y-4">
                {/* Selected Date Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {selectedDate
                                    ? dayNames[selectedDate.getDay()]
                                    : dayNames[today.getDay()]}
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {selectedDate
                                    ? `${monthNames[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getDate()}`
                                    : `${monthNames[today.getMonth()].slice(0, 3)} ${today.getDate()}`}
                            </h3>
                        </div>
                        <button
                            className="p-2 bg-[#FB5535] hover:bg-[#e24a2d] text-white rounded-lg 
                       shadow transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        {selectedDateEvents.length} session
                        {selectedDateEvents.length !== 1 ? "s" : ""} scheduled
                    </div>
                </div>

                {/* Events List */}
                <div className="space-y-3">
                    {selectedDateEvents.length > 0 ? (
                        selectedDateEvents
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((event) => {
                                const TypeIcon = typeConfig[event.type].icon;
                                return (
                                    <div
                                        key={event.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm 
                             overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className={`h-1.5 ${event.color}`} />
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {event.title}
                                                    </h4>
                                                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                                        <Clock size={14} />
                                                        <span>
                                                            {event.startTime} - {event.endTime}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                    <MoreVertical size={16} className="text-gray-400" />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {event.isVirtual && (
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2 py-1 
                                       bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                                                    >
                                                        <Video size={12} />
                                                        Virtual
                                                    </span>
                                                )}
                                                {event.location && (
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2 py-1 
                                       bg-gray-100 text-gray-600 text-xs font-medium rounded-md"
                                                    >
                                                        <MapPin size={12} />
                                                        {event.location}
                                                    </span>
                                                )}
                                                {event.attendees && (
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2 py-1 
                                       bg-gray-100 text-gray-600 text-xs font-medium rounded-md"
                                                    >
                                                        <Users size={12} />
                                                        {event.attendees} attendees
                                                    </span>
                                                )}
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-1 
                                     bg-gray-50 text-gray-500 text-xs font-medium rounded-md`}
                                                >
                                                    <TypeIcon size={12} />
                                                    {typeConfig[event.type].label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <div
                                className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full 
                           flex items-center justify-center"
                            >
                                <Clock size={24} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">No events</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                No sessions scheduled for this day
                            </p>
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#030F35] 
                         hover:bg-[#0a1a4a] text-white text-sm font-medium rounded-lg 
                         transition-colors"
                            >
                                <Plus size={16} />
                                Add Session
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#030F35] to-[#1A2E6E] rounded-xl p-4 text-white">
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                        <button
                            className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 
                       rounded-lg text-sm transition-colors"
                        >
                            📅 Schedule a session
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 
                       rounded-lg text-sm transition-colors"
                        >
                            🎯 Block focus time
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 
                       rounded-lg text-sm transition-colors"
                        >
                            👥 Set up 1:1 meeting
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarTab;
