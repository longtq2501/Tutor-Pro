// ============================================================================
// 📁 unpaid-sessions/components/SelectionSummary.tsx
// ============================================================================
import { formatCurrency } from '../utils/formatters';

interface SelectionSummaryProps {
  selectedTotal: {
    totalSessions: number;
    totalHours: number;
    totalAmount: number;
  };
}

export function SelectionSummary({ selectedTotal }: SelectionSummaryProps) {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-card rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Buổi đã chọn</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedTotal.totalSessions} buổi</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Tổng giờ</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedTotal.totalHours} giờ</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Tổng tiền</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(selectedTotal.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}