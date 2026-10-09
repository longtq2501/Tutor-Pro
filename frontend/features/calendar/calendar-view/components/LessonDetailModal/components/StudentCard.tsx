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

    return (
        <div className="relative">
            <div className={cn(
                "flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4",
                "rounded-xl sm:rounded-2xl relative overflow-hidden",
                // neutral bg + border only, no shadow on card itself
                "bg-white dark:bg-card border border-[#E5E7EB] dark:border-border/40"
            )}>
                {/* Avatar */}
                <div className="relative z-10 shrink-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-[11px] sm:text-lg">
                        {session.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background", statusColors.dot)} />
                </div>

                {/* Info */}
                <div className="flex-1 relative z-10 min-w-0">
                    {/* Label: sentence case, 12px, neutral gray */}
                    <div className="text-[11px] sm:text-[12px] font-medium text-muted-foreground mb-0.5">Học sinh</div>
                    {/* Name: Title Case weight 500-600, 15-17px */}
                    <h4 className="text-[13px] sm:text-[16px] font-semibold capitalize tracking-tight leading-none truncate">
                        {session.studentName}
                    </h4>
                </div>

                {/* Badge: reduced saturation - light bg, bold same-tone text */}
                <Badge className={cn(
                    "relative z-10 rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold border-0",
                    "tracking-normal",
                    statusColors.bg, statusColors.text
                )}>
                    {LESSON_STATUS_LABELS[status as keyof typeof LESSON_STATUS_LABELS] || status}
                </Badge>
            </div>
        </div>
    );
}
