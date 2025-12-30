'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    icon: LucideIcon;
    label: string;
    shortLabel: string;
    variant: 'primary' | 'secondary' | 'tertiary';
    onClick: () => void;
    disabled?: boolean;
}

export function PremiumActionButton({
    icon: Icon,
    label,
    shortLabel,
    variant,
    onClick,
    disabled
}: ActionButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                // Base styles
                "group relative overflow-hidden",
                "flex items-center justify-center gap-2",
                "h-11 sm:h-14 rounded-xl sm:rounded-2xl",
                "font-bold text-xs sm:text-base px-4 sm:px-6",
                "transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",

                // Shadows
                "shadow-lg hover:shadow-xl",

                // Variant-specific styles
                variant === 'primary' && [
                    "bg-gradient-to-br from-green-500 to-emerald-600",
                    "text-white",
                    "hover:from-green-600 hover:to-emerald-700",
                    "shadow-green-500/30 hover:shadow-green-500/40"
                ],

                variant === 'secondary' && [
                    "bg-gradient-to-br from-purple-500 to-pink-600",
                    "text-white",
                    "hover:from-purple-600 hover:to-pink-700",
                    "shadow-purple-500/30 hover:shadow-purple-500/40"
                ],

                variant === 'tertiary' && [
                    "bg-gradient-to-br from-blue-500 to-cyan-600",
                    "text-white",
                    "hover:from-blue-600 hover:to-cyan-700",
                    "shadow-blue-500/30 hover:shadow-blue-500/40"
                ]
            )}
        >
            {/* Shimmer effect on hover */}
            <div className={cn(
                "absolute inset-0 -translate-x-full",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "group-hover:animate-shimmer transition-transform duration-1000"
            )} />

            {/* Content */}
            <Icon className="w-3.5 h-3.5 sm:w-5 h-5 relative z-10" />
            <span className="hidden sm:inline relative z-10">{label}</span>
            <span className="sm:hidden relative z-10">{shortLabel}</span>

            {/* Ripple effect on click (simple version) */}
            <span className={cn(
                "absolute inset-0 rounded-xl sm:rounded-2xl",
                "bg-white/20 scale-0 group-active:scale-100",
                "transition-transform duration-300"
            )} />
        </motion.button>
    );
}
