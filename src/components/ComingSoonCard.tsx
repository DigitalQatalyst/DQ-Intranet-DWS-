import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Clock3, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComingSoonCardProps {
    icon: LucideIcon;
    audience: string;
    title: string;
    desc: string;
    index?: number;
    className?: string;
}

export default function ComingSoonCard({
    icon: Icon,
    audience,
    title,
    desc,
    index = 0,
    className,
}: ComingSoonCardProps) {
    const delay = index * 0.12;
    return (
        <motion.div
            className={cn(
                'relative flex h-full flex-col overflow-hidden rounded-[22px] bg-[#f3f5ff] p-10 text-center shadow-sm',
                className,
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true, margin: '-50px' }}
        >
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#f4b000] px-3.5 py-1.5 text-xs font-semibold text-[#402300] shadow-sm">
                <Clock3 className="h-3.5 w-3.5" />
                Coming Soon
            </div>
            <div className="relative z-10 flex h-full flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <Icon className="h-6 w-6 text-[#68769f]" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa5c1]">{audience}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#414c6b] leading-snug">{title}</h3>
                <p className="mt-3 text-sm text-[#7c86a6] leading-relaxed">{desc}</p>
                <div className="mt-auto w-full pt-8">
                    <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-[#9aa5c1] shadow-inner">
                        <Lock className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}