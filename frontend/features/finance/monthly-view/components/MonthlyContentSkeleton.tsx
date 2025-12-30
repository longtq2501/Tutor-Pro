'use client';

import { motion } from 'framer-motion';

export function MonthlyContentSkeleton() {
    return (
        <>
            {/* Toolbar Skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border bg-card p-5 sm:p-6"
            >
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 rounded-lg bg-muted animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
                        <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
                        <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
                    </div>
                </div>
            </motion.div>

            {/* Student Cards Skeleton */}
            <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="rounded-2xl border bg-card p-5 sm:p-6"
                    >
                        {/* Student Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                                <div className="h-6 w-48 rounded-lg bg-muted animate-pulse" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
                                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-4 mb-4">
                            <div className="h-16 w-32 rounded-lg bg-muted animate-pulse" />
                            <div className="h-16 w-32 rounded-lg bg-muted animate-pulse" />
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-2">
                            <div className="h-2 w-full rounded-full bg-muted animate-pulse" />
                            <div className="h-2 w-full rounded-full bg-muted animate-pulse" />
                        </div>

                        {/* Sessions */}
                        <div className="mt-4 space-y-2">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="h-12 w-full rounded-lg bg-muted/50 animate-pulse" />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
