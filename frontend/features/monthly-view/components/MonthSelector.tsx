// 📁 monthly-view/components/MonthSelector.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName, formatCurrency } from '../utils/formatters';

interface MonthSelectorProps {
  selectedMonth: string;
  totalStats: { sessions: number; unpaid: number };
  onMonthChange: (direction: number) => void;
}

export function MonthSelector({ selectedMonth, totalStats, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <button onClick={() => onMonthChange(-1)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold min-w-[200px] text-center">
          {getMonthName(selectedMonth)}
        </h2>
        <button onClick={() => onMonthChange(1)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
      
      <div className="flex gap-4 text-sm font-medium">
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg">
          {totalStats.sessions} buổi học
        </div>
        <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg">
          Còn nợ: {formatCurrency(totalStats.unpaid)}
        </div>
      </div>
    </div>
  );
}