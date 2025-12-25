import { ChevronLeft, ChevronRight, Zap, Loader2, Calendar as CalendarIcon, FileDown } from 'lucide-react';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarStats } from '../types';
import { ViewSwitcher, CalendarViewType } from './ViewSwitcher';

interface Props {
  currentDate: Date;
  stats: CalendarStats;
  isGenerating: boolean;
  currentView: CalendarViewType;
  onChangeMonth: (dir: number) => void;
  onToday: () => void;
  onAutoGenerate: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onExport?: () => void;
}

export const CalendarHeader = ({
  currentDate,
  stats,
  isGenerating,
  currentView,
  onChangeMonth,
  onToday,
  onAutoGenerate,
  onViewChange,
  onExport
}: Props) => (
  <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-card text-card-foreground p-3 rounded-2xl shadow-sm border border-border mb-4">
    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button onClick={() => onChangeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
          <ChevronLeft size={18} />
        </button>
        <div className="px-3 font-bold text-card-foreground min-w-[130px] text-center text-sm md:text-base">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={() => onChangeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-primary transition-all shadow-sm"
          title="Về hôm nay"
        >
          <CalendarIcon size={18} />
        </button>

        <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

        <button
          onClick={onExport}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 transition-all shadow-sm ml-1"
          title="Xuất Excel"
        >
          <FileDown size={18} />
        </button>
      </div>
    </div>

    <div className="flex gap-3 text-sm items-center flex-wrap justify-center w-full lg:w-auto">
      <div className="flex flex-col items-center px-4 border-r border-border">
        <span className="text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">Đã Dạy</span>
        <span className="font-bold text-foreground text-sm md:text-base">{stats.completed}/{stats.total}</span>
      </div>
      <div className="flex flex-col items-center px-4 border-r border-border">
        <span className="text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">Doanh Thu</span>
        <span className="font-bold text-primary text-sm md:text-base">{formatCurrency(stats.revenue)}</span>
      </div>
      <div className="flex flex-col items-center px-4">
        <span className="text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">Chưa Thu</span>
        <span className="font-bold text-orange-600 text-sm md:text-base">{stats.pending}</span>
      </div>

      <button onClick={onAutoGenerate} disabled={isGenerating} className="ml-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl font-bold transition-all flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50 shadow-sm active:scale-95">
        {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
        <span className="text-xs">Tạo Lịch</span>
      </button>
    </div>
  </div>
);
