'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface PerformanceSectionProps {
    title: string;
    icon: React.ReactNode;
    count: number;
    isLoading: boolean;
    children: React.ReactNode;
}

/**
 * A section wrapper for grouping exercise items by status.
 * Enforces a 1-column layout for exercise row cards.
 */
export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
    title,
    icon,
    count,
    isLoading,
    children
}) => {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-1">
                <div className="p-2.5 bg-card/80 border border-muted/50 rounded-xl shadow-sm text-foreground">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{count} bài tập</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {isLoading ? (
                    <div className="flex justify-center py-16 opacity-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : count === 0 ? (
                    <EmptySectionState title={title} icon={icon} />
                ) : (
                    <div className="grid grid-cols-1 gap-3 px-1">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptySectionState = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div className="py-12 border-2 border-dashed border-muted/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground/30 space-y-3 bg-muted/5 shadow-inner">
        <div className="h-14 w-14 rounded-2xl bg-muted/20 flex items-center justify-center grayscale opacity-40 border border-muted/50 scale-90">
            {icon}
        </div>
        <div className="text-center">
            <p className="text-sm font-semibold tracking-wide uppercase">Dữ liệu trống</p>
            <p className="text-xs italic mt-1 font-medium">Không có bài tập nào {title.toLowerCase()}</p>
        </div>
    </div>
);
