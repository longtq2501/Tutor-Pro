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
    <div className="py-6 px-4 border border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center text-muted-foreground space-y-2 bg-muted/20">
        <div className="h-10 w-10 rounded-xl bg-background/80 flex items-center justify-center text-muted-foreground/80 border border-border/60 shadow-sm">
            {icon}
        </div>
        <div className="text-center">
            <p className="text-xs font-semibold text-foreground/80">Không có bài tập</p>
            <p className="text-xs text-muted-foreground mt-0.5">Mục {title.toLowerCase()} hiện chưa có bài</p>
        </div>
    </div>
);
