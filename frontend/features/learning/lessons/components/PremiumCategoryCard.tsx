'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Layers } from 'lucide-react';
import { ReactNode, memo } from 'react';

interface PremiumCategoryCardProps {
    icon?: ReactNode;
    title: string;
    count: number;
    gradient?: string;
    color?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const PremiumCategoryCard = memo(({
    icon,
    title,
    count,
    gradient = "from-blue-500 to-cyan-500",
    color,
    isActive,
    onClick
}: PremiumCategoryCardProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden",
                "p-6 rounded-2xl border-2 text-left w-full h-full",
                "transition-all duration-300",
                "will-change-transform contain-layout", // GPU Acceleration
                isActive
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                    : "border-border hover:border-primary/50 bg-card shadow-sm hover:shadow-md"
            )}
        >
            {/* Dynamic Gradient Background Overlay */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                "group-hover:opacity-[0.03]",
                gradient
            )} />

            {/* Icon Section */}
            <div className="relative flex items-start justify-between mb-5">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-primary/20",
                    gradient,
                    "text-white"
                )}>
                    {icon || <Layers className="w-7 h-7" />}
                </div>

                {isActive && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-2 border-background"
                    >
                        <Check className="w-4 h-4 stroke-[3]" />
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div className="relative space-y-1.5">
                <h4 className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                    {title}
                </h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tabular-nums tracking-tighter">
                        {count}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        bài giảng
                    </span>
                </div>
            </div>

            {/* Decorative Orbs */}
            <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 rounded-full",
                "bg-gradient-to-br opacity-5 blur-3xl transition-all duration-700",
                "group-hover:opacity-20 group-hover:scale-150",
                gradient
            )} />

            <div className={cn(
                "absolute -left-12 -top-12 w-24 h-24 rounded-full",
                "bg-gradient-to-br opacity-0 blur-2xl transition-all duration-700",
                "group-hover:opacity-10 group-hover:translate-x-4 group-hover:translate-y-4",
                gradient
            )} />
        </motion.button>
    );
});
