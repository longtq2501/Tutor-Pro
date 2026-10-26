import { Badge } from '@/components/ui/badge';
import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { getStatusColors } from '../../../utils/statusColors';

interface StudentCardProps {
    session: SessionRecord;
    currentStatus?: LessonStatus;
}

export function StudentCard({ session, currentStatus }: StudentCardProps) {
    const status = currentStatus || (session.status as LessonStatus);
    const statusColors = getStatusColors(status);

    // Generate initials (up to 2 chars)
    const initials = session.studentName
        ?.split(' ')
        .filter(Boolean)
        .map(w => w[0])
        .slice(-2)
        .join('')
        .toUpperCase() || '?';

    return (
        <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl border bg-card dark:bg-card/70 border-border/50 shadow-2xs">
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm select-none shadow-xs">
                    {initials}
                </div>
                {/* Status dot */}
                <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                    statusColors.dot
                )} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground leading-none mb-1">
                    Học sinh
                </p>
                <h4 className="text-sm sm:text-base font-semibold text-foreground tracking-tight leading-snug truncate capitalize">
                    {session.studentName}
                </h4>
            </div>

            {/* Status badge */}
            <span className={cn(
                "inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold border shrink-0 whitespace-nowrap select-none transition-colors",
                statusColors.bg, statusColors.border, statusColors.text
            )}>
                {LESSON_STATUS_LABELS[status as keyof typeof LESSON_STATUS_LABELS] || status}
            </span>
        </div>
    );
}
