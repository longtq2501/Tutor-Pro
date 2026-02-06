import { Badge } from '@/components/ui/badge';
import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { getStatusColors } from '../../../utils/statusColors';

interface StudentCardProps {
    session: SessionRecord;
}

export function StudentCard({ session }: StudentCardProps) {
    const statusColors = getStatusColors(session.status as LessonStatus);

    return (
        <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-[11px] sm:text-lg shadow-md">
                        {session.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-sm", statusColors.dot)} />
                </div>
                <div className="flex-1 relative z-10">
                    <div className="text-[7px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Học sinh</div>
                    <h4 className="text-[11px] sm:text-base font-black capitalize tracking-tight leading-none">{session.studentName}</h4>
                </div>
                <Badge className={cn("relative z-10 rounded-lg px-2.5 py-1 font-black uppercase text-[7px] sm:text-[9px] tracking-widest border-0 shadow-sm", statusColors.bg, statusColors.text)}>
                    {LESSON_STATUS_LABELS[session.status as keyof typeof LESSON_STATUS_LABELS] || session.status}
                </Badge>
            </div>
        </div>
    );
}
