// ============================================================================
// 📁 unpaid-sessions/components/SummaryCards.tsx
// ============================================================================
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
  totalUnpaid: number;
  totalSessions: number;
  totalStudents: number;
}

export function SummaryCards({ totalUnpaid, totalSessions, totalStudents }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30">
        <p className="text-sm text-muted-foreground mb-1">Tổng chưa thanh toán</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {formatCurrency(totalUnpaid)}
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
        <p className="text-sm text-muted-foreground mb-1">Số buổi học</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions} buổi</p>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
        <p className="text-sm text-muted-foreground mb-1">Số học sinh</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalStudents} HS</p>
      </div>
    </div>
  );
}