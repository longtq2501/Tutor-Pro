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
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border text-xs">
            <span className="text-muted-foreground font-medium">Chú thích:</span>
            {statuses.map((status) => {
                const colors = STATUS_COLORS[status];
                return (
                    <div key={status} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-foreground">{colors.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
