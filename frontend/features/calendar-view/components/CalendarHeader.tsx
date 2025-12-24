// ============================================================================
// FILE: calendar-view/components/CalendarHeader.tsx
// ============================================================================
import { ChevronLeft, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarStats } from '../types';

interface Props {
  currentDate: Date;
  stats: CalendarStats;
  isGenerating: boolean;
  onChangeMonth: (dir: number) => void;
  onToday: () => void;
  onAutoGenerate: () => void;
}

export const CalendarHeader = ({ currentDate, stats, isGenerating, onChangeMonth, onToday, onAutoGenerate }: Props) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card text-card-foreground p-3 rounded-2xl shadow-sm border border-border">
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button onClick={() => onChangeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
        <ChevronLeft size={18} />
      </button>
      <div className="px-3 font-bold text-card-foreground min-w-[130px] text-center">
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
      <button onClick={() => onChangeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
        <ChevronRight size={18} />
      </button>
    </div>

    <div className="flex gap-3 text-sm items-center flex-wrap justify-center">
      <div className="flex flex-col items-center px-2 border-r border-border">
        <span className="text-muted-foreground text-xs uppercase">Đã Dạy</span>
        <span className="font-bold text-foreground text-base">{stats.completed}/{stats.total}</span>
      </div>
      <div className="flex flex-col items-center px-2 border-r border-border">
        <span className="text-muted-foreground text-xs uppercase">Doanh Thu</span>
        <span className="font-bold text-primary text-base">{formatCurrency(stats.revenue)}</span>
      </div>
      <div className="flex flex-col items-center px-2 border-r border-border">
        <span className="text-muted-foreground text-xs uppercase">Chưa Thu</span>
        <span className="font-bold text-orange-600 text-base">{stats.pending}</span>
      </div>
      
      <button onClick={onAutoGenerate} disabled={isGenerating} className="ml-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg font-medium transition-colors flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50">
        {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
        <span className="hidden md:inline text-xs">Tạo Lịch</span>
      </button>
    </div>

    <button onClick={onToday} className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 px-2 py-1 rounded-lg transition-colors">
      Về Hôm Nay
    </button>
  </div>
);
