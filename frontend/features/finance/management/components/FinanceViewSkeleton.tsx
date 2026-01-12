// ============================================================================
// 📁 finance/management/components/FinanceViewSkeleton.tsx
// ============================================================================
import React from 'react';

export function FinanceViewSkeleton() {
    return (
        <div className="w-full animate-pulse overflow-hidden">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-30 flex flex-col bg-background/80 backdrop-blur-xl border-b border-border/40 p-4 lg:px-6 xl:px-8 gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded-lg" />
                    <div className="h-3 w-64 bg-muted/60 rounded" />
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-32 bg-muted/40 rounded-xl" />
                    <div className="h-10 w-40 bg-muted/40 rounded-xl" />
                </div>
            </div>

            <div className="p-3 md:p-8 space-y-8">
                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted/40 rounded-2xl border border-border/50" />
                    ))}
                </div>

                {/* Content Cards Skeleton */}
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted/30 rounded-2xl border border-border/40" />
                    ))}
                </div>
            </div>
        </div>
    );
}
