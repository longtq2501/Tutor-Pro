// ============================================================================
// 📁 unified-view/components/StudentViewSkeleton.tsx
// ============================================================================
import React from 'react';
import { StudentCardSkeleton } from './StudentCardSkeleton';

export function StudentViewSkeleton() {
    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 w-full animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-muted rounded-xl" />
                    <div className="h-4 w-96 bg-muted/60 rounded-lg" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted/40 rounded-xl border border-border/50" />
                    ))}
                </div>

                {/* Search & Tabs Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="h-11 w-full sm:flex-1 sm:max-w-md bg-muted/40 rounded-xl" />
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-full sm:w-48 bg-muted/40 rounded-xl" />
                        <div className="h-11 w-full sm:w-32 bg-muted/40 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {[...Array(8)].map((_, i) => (
                    <StudentCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
