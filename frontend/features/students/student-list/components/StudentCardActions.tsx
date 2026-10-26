import { CalendarDays, Plus } from 'lucide-react';

interface StudentCardActionsProps {
    active: boolean;
    onSchedule: () => void;
    onAddSession?: () => void;
}

/**
 * Action buttons for StudentCard.
 * When student is inactive: ALL buttons are disabled.
 * Edit button is handled separately in StudentEditActions (always enabled).
 */
export function StudentCardActions({ active, onSchedule }: StudentCardActionsProps) {
    return (
        <div className="w-full">
            <button
                onClick={onSchedule}
                disabled={!active}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
                <CalendarDays size={13} />
                Thêm lịch cố định
            </button>
        </div>
    );
}
