import React from 'react';
import { Bell, ExternalLink } from 'lucide-react';

interface AnnouncementsProps {
    isLoading: boolean;
}

const announcements = [
    {
        id: 1,
        title: 'New Employee Benefits Guide',
        date: 'Jan 05, 2026',
        description: 'Explore the updated comprehensive guide for all digital leadership benefits and medical coverage plans.',
        link: '#',
    },
    {
        id: 2,
        title: 'Platform Maintenance Notice',
        date: 'Jan 12, 2026',
        description: 'The internal portal will be undergoing scheduled maintenance this weekend to enhance performance.',
        link: '#',
    },
    {
        id: 3,
        title: 'IT Security Workshop',
        date: 'Jan 15, 2026',
        description: 'Join us for an interactive session on digital security best practices and data privacy protection.',
        link: '#',
    },
];

export const Announcements: React.FC<AnnouncementsProps> = ({ isLoading }) => {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-20 bg-white/5 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {announcements.map((announcement) => (
                <div
                    key={announcement.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-400/10 rounded-lg text-blue-300">
                            <Bell size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                                    {announcement.title}
                                </h4>
                            </div>
                            <p className="text-[11px] text-blue-300/60 font-medium mb-2">{announcement.date}</p>
                            <p className="text-xs text-blue-100/70 mb-3 line-clamp-2 leading-relaxed">
                                {announcement.description}
                            </p>
                            <a
                                href={announcement.link}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider group-hover:text-white transition-colors"
                            >
                                Read more
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
