// ============================================================================
// 📁 unified-view/components/StudentCardSkeleton.tsx
// ============================================================================
import React from 'react';

export function StudentCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card p-5 sm:p-6 space-y-6 animate-pulse border-border/50">
            <div className="flex justify-between items-start">
                {/* Avatar & Name skeleton */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted shrink-0 shadow-sm" />
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded-md" />
                        <div className="h-4 w-20 bg-muted/60 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
                <div className="h-12 bg-muted/30 rounded-xl" />
                <div className="h-12 bg-muted/30 rounded-xl" />
                <div className="flex justify-between items-center px-1">
                    <div className="h-4 w-16 bg-muted/40 rounded" />
                    <div className="h-4 w-24 bg-muted/40 rounded" />
                </div>
            </div>

            {/* Buttons skeleton */}
            <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-muted/50 rounded-xl" />
                <div className="h-10 bg-muted/50 rounded-xl" />
            </div>
        </div>
    );
}
