'use client';

import { LucideIcon, Sparkles } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

interface AdminPageHeaderProps {
    title: string;
    subtitle: string;
    category?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    subtitle,
    category,
    icon: Icon,
    actions
}: AdminPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-2 min-w-0"
        >
            <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                {category && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2.5 text-primary text-[10px] font-black uppercase tracking-[0.3em] bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full w-fit backdrop-blur-md shadow-glow-sm shadow-primary/10"
                    >
                        {Icon ? <Icon className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                        <span>{category}</span>
                    </motion.div>
                )}
                <div className="space-y-1 min-w-0">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-tight drop-shadow-sm break-words">
                        {title}
                        <span className="text-primary inline-block ml-1 animate-pulse prose-invert">.</span>
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm font-black uppercase tracking-[0.15em] opacity-60 flex items-center gap-2 min-w-0">
                        <span className="w-6 sm:w-8 h-px bg-border/50 shrink-0" />
                        <span className="truncate">{subtitle}</span>
                    </p>
                </div>
            </div>

            {actions && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-2 sm:gap-3 backdrop-blur-xl p-1.5 sm:p-2 bg-white/5 dark:bg-black/5 rounded-[1.5rem] border border-border/10 shadow-premium max-w-full min-w-0"
                >
                    {actions}
                </motion.div>
            )}
        </motion.div>
    );
}
