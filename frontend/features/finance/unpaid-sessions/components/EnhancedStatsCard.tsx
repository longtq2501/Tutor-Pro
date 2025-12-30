'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        direction: 'up' | 'down';
        label: string;
    };
    sparklineData?: number[];
    variant: 'orange' | 'blue' | 'purple';
    className?: string;
}

export function Sparkline({
    data,
    color,
    className
}: {
    data: number[];
    color: 'orange' | 'blue' | 'purple';
    className?: string;
}) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        })
        .join(' ');

    const gradientIds = {
        orange: 'sparkline-orange',
        blue: 'sparkline-blue',
        purple: 'sparkline-purple'
    };

    const colors = {
        orange: 'rgb(249, 115, 22)',
        blue: 'rgb(59, 130, 246)',
        purple: 'rgb(168, 85, 247)'
    };

    return (
        <svg
            viewBox="0 0 100 100"
            className={cn("w-full h-full", className)}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={gradientIds[color]} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colors[color]} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={colors[color]} stopOpacity="0" />
                </linearGradient>
            </defs>

            <polyline
                points={points}
                fill="none"
                stroke={colors[color]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polyline
                points={`0,100 ${points} 100,100`}
                fill={`url(#${gradientIds[color]})`}
                opacity="0.2"
            />
        </svg>
    );
}

export function EnhancedStatsCard({
    label,
    value,
    icon,
    trend,
    sparklineData,
    variant,
    className
}: StatsCardProps) {
    // Variant-specific gradients
    const gradients = {
        orange: 'from-orange-500 to-amber-500',
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-pink-500'
    };

    const bgColors = {
        orange: 'bg-orange-50 dark:bg-orange-950/20',
        blue: 'bg-blue-50 dark:bg-blue-950/20',
        purple: 'bg-purple-50 dark:bg-purple-950/20'
    };

    const shadowColors = {
        orange: 'shadow-orange-500/30',
        blue: 'shadow-blue-500/30',
        purple: 'shadow-purple-500/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                // Base styles
                "group relative overflow-hidden rounded-2xl border",
                "transition-all duration-300 ease-out",

                // Background
                bgColors[variant],
                "dark:border-white/10",

                // Hover effects
                "hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
                "hover:border-transparent",

                // Responsive padding
                "p-5 sm:p-6 lg:p-7",
                className
            )}
        >
            {/* Gradient background on hover */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0",
                "group-hover:opacity-5 transition-opacity duration-500",
                gradients[variant]
            )} />

            {/* Content */}
            <div className="relative space-y-4">
                {/* Icon + Label */}
                <div className="flex items-start justify-between">
                    {/* Icon with gradient background */}
                    <div className={cn(
                        "flex items-center justify-center",
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl",
                        "bg-gradient-to-br shadow-lg",
                        gradients[variant],
                        shadowColors[variant],
                        "transition-transform duration-300",
                        "group-hover:scale-110 group-hover:rotate-3"
                    )}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>

                    {/* Trend Badge */}
                    {trend && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                trend.direction === 'up'
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                            )}
                        >
                            {trend.direction === 'up' ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {trend.value > 0 ? '+' : ''}{trend.value}%
                        </motion.div>
                    )}
                </div>

                {/* Label and Value Container */}
                <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        {label}
                    </p>

                    {/* Value */}
                    <div className="flex items-baseline gap-2">
                        <motion.p
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums"
                        >
                            {value}
                        </motion.p>
                    </div>
                </div>

                {/* Sparkline (optional) */}
                {sparklineData && (
                    <div className="h-8 sm:h-10 -mx-2">
                        <Sparkline
                            data={sparklineData}
                            color={variant}
                            className="opacity-40 group-hover:opacity-70 transition-opacity"
                        />
                    </div>
                )}

                {/* Trend label */}
                {trend && (
                    <p className="text-xs text-muted-foreground">
                        {trend.label}
                    </p>
                )}
            </div>

            {/* Decorative gradient orb */}
            <div className={cn(
                "absolute -right-10 -bottom-10 w-32 h-32 rounded-full",
                "bg-gradient-to-br opacity-5 blur-2xl",
                "transition-all duration-700",
                "group-hover:opacity-10 group-hover:scale-150",
                gradients[variant]
            )} />
        </motion.div>
    );
}
