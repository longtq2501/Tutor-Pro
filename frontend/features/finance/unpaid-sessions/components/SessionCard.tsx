// ============================================================================
// 📁 unpaid-sessions/components/SessionCard.tsx
// ============================================================================
import { Calendar, CheckCircle, Trash2 } from 'lucide-react';
import type { SessionRecord } from '@/lib/types';
import { formatDate, getMonthName, formatCurrency } from '../utils/formatters';

interface SessionCardProps {
  session: SessionRecord;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function SessionCard({ session, selected, onToggle, onDelete }: SessionCardProps) {
  return (
    <div
      className={`relative group border rounded-lg p-3 cursor-pointer transition-all ${
        selected
          ? 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-600'
          : 'bg-card border-border hover:border-orange-300 dark:hover:border-orange-500'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {}}
          className="mt-1 h-4 w-4 text-orange-600 rounded"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} className="text-muted-foreground" />
            <span className="text-xs font-semibold text-card-foreground">
              {formatDate(session.sessionDate)}
            </span>
          </div>

          <div className="flex items-center gap-[5px] mb-1">
            {session.completed ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <CheckCircle size={10} />
                Đã dạy
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Dự kiến
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {getMonthName(session.month)}
          </div>
          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1">
            {formatCurrency(session.totalAmount)}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 p-1 rounded"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}