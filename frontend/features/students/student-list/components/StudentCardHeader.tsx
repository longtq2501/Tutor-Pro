import { Student } from '@/lib/types';

/**
 * Header section of the StudentCard.
 * Displays Avatar, Name, and Status badge.
 * Minimalist design — only the status badge carries color.
 */
export function StudentCardHeader({ student }: { student: Student }) {
    const isInactive = !student.active;
    return (
        <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`
                w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0
                ${isInactive
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary/10 text-primary'}
            `}>
                {student.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
                    {student.name}
                </h3>
                <div className={`
                    text-[11px] px-2 py-0.5 rounded-full w-fit mt-1 font-medium flex items-center gap-1
                    ${isInactive
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'}
                `}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isInactive ? 'bg-muted-foreground' : 'bg-emerald-500'}`} />
                    {isInactive ? 'Đã nghỉ' : 'Đang học'}
                </div>
            </div>
        </div>
    );
}
