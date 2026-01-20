import React from 'react';
import { useBillableTimer } from '../hooks/useBillableTimer';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface BillableTimerProps {
    roomId: string;
    className?: string;
}

/**
 * Visual timer component displaying calculated billable duration.
 * Shows green when overlap is active, gray when waiting.
 */
export const BillableTimer: React.FC<BillableTimerProps> = ({ roomId, className }) => {
    const { formattedTime, isBillable } = useBillableTimer(roomId);

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
            isBillable
                ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
                : "bg-muted text-muted-foreground border-border",
            className
        )}>
            <div className="relative">
                <Clock className="w-3.5 h-3.5" />
                {isBillable && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ring-1 ring-white dark:ring-black" />
                )}
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-[10px] opacity-70 uppercase tracking-wider">Billable</span>
                <span className="tabular-nums font-semibold text-sm">{formattedTime}</span>
            </div>
        </div>
    );
};
