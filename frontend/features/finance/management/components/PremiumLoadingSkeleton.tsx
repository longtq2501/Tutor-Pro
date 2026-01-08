'use client';

import { motion } from 'framer-motion';

export function PremiumLoadingSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="h-40 sm:h-48 rounded-2xl bg-muted/40 overflow-hidden relative border"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

                        <div className="p-6 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-muted/60" />
                            <div className="w-24 h-4 rounded bg-muted/60" />
                            <div className="w-32 h-8 rounded bg-muted/60" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="h-14 rounded-xl sm:rounded-2xl bg-muted/40 relative overflow-hidden border"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    </motion.div>
                ))}
            </div>

            {/* Student Cards Skeleton */}
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="h-64 sm:h-72 rounded-2xl sm:rounded-3xl bg-muted/30 relative overflow-hidden border"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-muted/50" />
                                <div className="space-y-2">
                                    <div className="w-32 h-6 rounded bg-muted/50" />
                                    <div className="w-48 h-4 rounded bg-muted/50" />
                                </div>
                            </div>
                            <div className="h-40 rounded-xl bg-muted/20" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
