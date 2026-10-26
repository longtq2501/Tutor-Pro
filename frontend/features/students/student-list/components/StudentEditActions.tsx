import { Edit2, Trash2 } from 'lucide-react';

interface StudentEditActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    isInactive?: boolean;
}

/**
 * Secondary actions for StudentCard.
 * Edit is ALWAYS enabled (even for inactive students, so tutor can reactivate them).
 * Delete is always available.
 * Revealed on card hover.
 */
export function StudentEditActions({ onEdit, onDelete }: StudentEditActionsProps) {
    return (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={onEdit}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Chỉnh sửa"
            >
                <Edit2 size={14} />
            </button>
            <button
                onClick={onDelete}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Xóa"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}
