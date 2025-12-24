// 📁 parents-view/components/ParentCard.tsx
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';
import type { Parent } from '@/lib/types';

interface ParentCardProps {
  parent: Parent;
  onEdit: () => void;
  onDelete: () => void;
}

export function ParentCard({ parent, onEdit, onDelete }: ParentCardProps) {
  return (
    <div className="border border-border rounded-xl p-5 hover:shadow-lg transition-all hover:border-primary/50 bg-card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-card-foreground mb-1">
            {parent.name}
          </h3>
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {parent.studentCount} học sinh
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
            title="Sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {parent.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail size={16} />
            <span className="truncate">{parent.email}</span>
          </div>
        )}
        {parent.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone size={16} />
            <span>{parent.phone}</span>
          </div>
        )}
        {parent.notes && (
          <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
            {parent.notes}
          </p>
        )}
      </div>
    </div>
  );
}