import { Student } from '@/lib/types';

interface StudentCardHeaderProps {
    student: Student;
    onEdit: () => void;
    onDelete: () => void;
    onSchedule: () => void;
    onAddSession: () => void;
}

/**
 * Header section of the StudentCard.
 * Displays Avatar, Name, and Status badge.
 */
export function StudentCardHeader({ student }: { student: Student }) {
    return (
        <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`
        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm transition-transform group-hover:scale-105
        ${student.active
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'}
      `}>
                {student.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
                <h3 className="text-lg font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors">
                    {student.name}
                </h3>
                <div className={`text-xs px-2.5 py-1 rounded-full w-fit mt-1.5 font-bold flex items-center gap-1.5 ${student.active
                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-emerald-500' : 'bg-destructive'}`} />
                    {student.active ? 'Đang học' : 'Đã nghỉ'}
                </div>
            </div>
        </div>
    );
}
