import { Edit2, Trash2 } from 'lucide-react';

interface StudentEditActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * Secondary actions for StudentCard, revealed on hover.
 */
export function StudentEditActions({ onEdit, onDelete }: StudentEditActionsProps) {
    return (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-border">
            <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
                <Edit2 size={16} />
            </button>
            <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Xóa">
                <Trash2 size={16} />
            </button>
        </div>
    );
}
