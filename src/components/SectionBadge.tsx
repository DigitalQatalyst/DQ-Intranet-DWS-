import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionBadgeProps {
    label: string;
    variant?: 'light' | 'dark';
    className?: string;
}

export function SectionBadge({ label, variant = 'light', className }: SectionBadgeProps) {
    const base = 'mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] backdrop-blur-sm border';
    const styles =
        variant === 'dark'
            ? 'border-white/10 bg-white/[0.05] text-white/50'
            : 'border-primary/20 bg-primary/[0.06] text-primary';
    const iconColor = variant === 'dark' ? 'text-[hsl(14,97%,60%)]' : 'text-primary';

    return (
        <motion.div
            className={cn(base, styles, className)}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <Sparkles className={cn('h-3 w-3', iconColor)} />
            <span>{label}</span>
        </motion.div>
    );
}