import React from 'react';
import { cn } from '@/lib/utils';

export function StudentCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card p-5 sm:p-6 space-y-4 animate-pulse">
            {/* Avatar skeleton */}
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-2">
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-3">
                <div className="h-10 flex-1 bg-muted rounded" />
                <div className="h-10 flex-1 bg-muted rounded" />
            </div>
        </div>
    );
}
