import { STATUS_COLORS } from '../utils/statusColors';
import type { LessonStatus } from '@/lib/types/lesson-status';

/**
 * StatusLegend Component
 * 
 * Displays a legend showing all lesson statuses with their color coding.
 * Helps users understand what each color means in the calendar.
 */
export function StatusLegend() {
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
        <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border text-[10px] md:text-xs overflow-x-auto scrollbar-hide">
            <span className="text-muted-foreground font-medium shrink-0">Chú thích:</span>
            <div className="flex flex-nowrap items-center gap-3">
                {statuses.map((status) => {
                    const colors = STATUS_COLORS[status];
                    return (
                        <div key={status} className="flex items-center gap-1.5 shrink-0">
                            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            <span className="text-foreground whitespace-nowrap">{colors.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
