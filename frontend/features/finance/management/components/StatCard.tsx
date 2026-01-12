'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    /** The title of the stat */
    title: string;
    /** The main value to display */
    value: string;
    /** The icon to display */
    icon: LucideIcon;
    /** Optional secondary value */
    subValue?: string;
    /** Optional trend percentage (e.g., "+12%") */
    trend?: string;
    /** Optional label for the trend */
    trendLabel?: string;
    /** Tailwind color class for the icon and text */
    color: string;
    /** Tailwind background color class for the icon container */
    bgColor: string;
}

/**
 * A reusable card for displaying a single financial statistic.
 */
export function StatCard({
    title,
    value,
    icon: Icon,
    subValue,
    trend,
    trendLabel,
    color,
    bgColor
}: StatCardProps) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold tracking-tight truncate" title={value}>
                        {value}
                    </h3>
                    {subValue && <p className="text-xs text-muted-foreground mt-1 truncate">{subValue}</p>}
                    {trend && (
                        <p className="text-xs mt-1 flex items-center gap-1">
                            <span className="text-green-600 font-bold">{trend}</span>
                            <span className="text-muted-foreground opacity-70">{trendLabel}</span>
                        </p>
                    )}
                </div>
                <div className={`p-2.5 rounded-xl ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </CardContent>
        </Card>
    );
}
