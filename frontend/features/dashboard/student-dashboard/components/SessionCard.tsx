// ============================================================================
// FILE: student-dashboard/components/SessionCard.tsx
// ============================================================================
import type { SessionRecord } from '@/lib/types';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export const SessionCard = ({ session }: { session: SessionRecord }) => (
  <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors border border-border">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-bold text-foreground">
          {formatDate(session.sessionDate)}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          ⏰ {formatTime(session.sessionDate)} • {session.hoursPerSession}h
        </p>
        {session.notes && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            📝 {session.notes}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          session.paid 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
        }`}>
          {session.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(session.totalAmount)}
        </span>
      </div>
    </div>
  </div>
);