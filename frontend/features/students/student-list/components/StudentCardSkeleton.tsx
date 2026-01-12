// ============================================================================
// 📁 student-list/components/StudentCardSkeleton.tsx
// ============================================================================
import React from 'react';

export function StudentCardSkeleton() {
    return (
        <div className="bg-card rounded-3xl p-6 border border-border animate-pulse">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    {/* Avatar Skeleton */}
                    <div className="w-14 h-14 rounded-2xl bg-muted" />

                    {/* Info Skeleton */}
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded-md" />
                        <div className="h-4 w-20 bg-muted/60 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-4 mb-6">
                <div className="h-12 w-full bg-muted/40 rounded-xl" />
                <div className="h-12 w-full bg-muted/40 rounded-xl" />

                {/* Revenue Snapshot Skeleton */}
                <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-16 bg-muted/60 rounded-md" />
                    <div className="h-4 w-24 bg-muted/60 rounded-md" />
                </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="grid grid-cols-2 gap-3">
                <div className="h-10 w-full bg-muted/50 rounded-xl" />
                <div className="h-10 w-full bg-muted/50 rounded-xl" />
            </div>
        </div>
    );
}

export function StudentListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <StudentCardSkeleton key={i} />
            ))}
        </div>
    );
}
