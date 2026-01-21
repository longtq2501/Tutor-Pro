"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for the Live Room interface.
 * Mimics the layout of LiveRoomDisplay to provide a smooth transition.
 */
export const LiveRoomSkeleton = () => {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <div className="flex-1 flex flex-col h-full">
                {/* Header Skeleton */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-5 w-24 hidden sm:block" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </header>

                {/* Main Content Skeleton */}
                <div className="flex-1 flex gap-4 p-4 min-h-0">
                    {/* Board / Video Area */}
                    <div className="flex-[3] flex flex-col gap-4">
                        <Skeleton className="flex-1 rounded-3xl border border-border/50" />

                        {/* Remote Videos / Tools */}
                        <div className="h-24 sm:h-32 flex gap-4 overflow-hidden">
                            <Skeleton className="w-32 sm:w-48 h-full rounded-2xl shrink-0" />
                            <Skeleton className="w-32 sm:w-48 h-full rounded-2xl shrink-0" />
                            <Skeleton className="w-32 sm:w-48 h-full rounded-2xl shrink-0 hidden sm:block" />
                        </div>
                    </div>

                    {/* Sidebar Area (Desktop only) */}
                    <div className="flex-1 flex flex-col gap-4 hidden lg:flex max-w-sm">
                        <Skeleton className="flex-1 rounded-3xl border border-border/50" />
                        <div className="h-12 flex gap-2">
                            <Skeleton className="flex-1 rounded-xl" />
                            <Skeleton className="w-12 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Skeleton */}
                <div className="h-16 border-t flex lg:hidden items-center justify-around px-4 bg-card/80">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </div>
        </div>
    );
};
