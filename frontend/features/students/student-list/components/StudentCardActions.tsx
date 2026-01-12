import { Repeat, Plus } from 'lucide-react';

interface StudentCardActionsProps {
    active: boolean;
    onSchedule: () => void;
    onAddSession: () => void;
}

/**
 * Action buttons section of the StudentCard.
 * Includes Schedule and Add Session buttons.
 */
export function StudentCardActions({ active, onSchedule, onAddSession }: StudentCardActionsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={onSchedule}
                className="px-4 py-2.5 bg-slate-100 dark:bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-accent border border-border rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
                <Repeat size={16} />
                Lịch
            </button>
            <button
                onClick={onAddSession}
                disabled={!active}
                className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
                <Plus size={16} />
                Buổi Học
            </button>
        </div>
    );
}
