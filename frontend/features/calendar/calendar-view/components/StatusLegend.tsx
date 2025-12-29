import { HelpCircle } from 'lucide-react';
import { STATUS_COLORS } from '../utils/statusColors';
import type { LessonStatus } from '@/lib/types/lesson-status';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

/**
 * StatusLegend Component
 * 
 * Refactored into a space-efficient Popover trigger.
 * Reclaims vertical space while keeping information accessible.
 */
export function StatusLegend({ className }: { className?: string }) {
    const statuses: LessonStatus[] = [
        'PAID',
        'COMPLETED',
        'PENDING_PAYMENT',
        'CONFIRMED',
        'SCHEDULED',
        'CANCELLED_BY_STUDENT',
        'CANCELLED_BY_TUTOR',
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={cn(
                    "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/50 transition-all text-[11px] font-bold text-muted-foreground hover:text-foreground active:scale-95 shadow-sm",
                    className
                )}>
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Chú thích</span>
                </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-64 p-3 rounded-xl border-border/60 shadow-2xl dark:bg-zinc-900 border backdrop-blur-md">
                <div className="space-y-2.5">
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/70 mb-1">Màu sắc trạng thái</p>
                    <div className="grid grid-cols-1 gap-2">
                        {statuses.map((status) => {
                            const colors = STATUS_COLORS[status];
                            return (
                                <div key={status} className="flex items-center gap-2.5 group transition-colors">
                                    <span className={cn(
                                        "w-2.5 h-2.5 rounded-full ring-2 ring-transparent group-hover:ring-offset-1 transition-all",
                                        colors.dot
                                    )} />
                                    <span className="text-[11px] font-medium text-foreground whitespace-nowrap">{colors.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
