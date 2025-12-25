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
  <div className="flex flex-col gap-3 bg-card text-card-foreground p-3 md:p-4 rounded-2xl shadow-sm border border-border mb-4">
    {/* Top Row: Navigation and Statistics */}
    <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
      {/* Navigation Group */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-auto justify-between sm:justify-start">
          <button onClick={() => onChangeMonth(-1)} className="p-1.5 md:p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
            <ChevronLeft size={18} />
          </button>
          <div className="px-2 md:px-4 font-bold text-card-foreground min-w-[110px] md:min-w-[140px] text-center text-xs md:text-base">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={() => onChangeMonth(1)} className="p-1.5 md:p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-muted-foreground hover:text-foreground">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
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

      {/* Stats Group */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex gap-0 text-sm items-center w-full xl:w-auto border xl:border-none border-border rounded-xl overflow-hidden">
        <div className="flex flex-col items-center px-4 md:px-6 border-r border-border h-full justify-center py-2 xl:py-0">
          <span className="text-muted-foreground text-[10px] md:text-xs uppercase font-semibold tracking-wider">Đã Dạy</span>
          <span className="font-bold text-foreground text-sm md:text-base whitespace-nowrap">{stats.completed}/{stats.total}</span>
        </div>
        <div className="flex flex-col items-center px-4 md:px-6 border-r border-border h-full justify-center py-2 xl:py-0">
          <span className="text-muted-foreground text-[10px] md:text-xs uppercase font-semibold tracking-wider">Doanh Thu</span>
          <span className="font-bold text-primary text-sm md:text-base whitespace-nowrap">{formatCurrency(stats.revenue)}</span>
        </div>
        <div className="flex flex-col items-center px-4 md:px-6 border-none sm:border-r xl:border-none border-border h-full justify-center py-2 xl:py-0 col-span-2 sm:col-span-1">
          <span className="text-muted-foreground text-[10px] md:text-xs uppercase font-semibold tracking-wider">Chưa Thu</span>
          <span className="font-bold text-orange-600 text-sm md:text-base whitespace-nowrap">{stats.pending}</span>
        </div>
      </div>
    </div>

    {/* Bottom Row: Full-width CTA Button */}
    <div className="w-full pt-1">
      <button
        onClick={onAutoGenerate}
        disabled={isGenerating}
        className="w-full py-2.5 md:py-3 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800/50 shadow-sm active:scale-[0.99] disabled:opacity-50"
      >
        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
        <span className="text-sm md:text-base">Tạo Lịch Dạy Tự Động</span>
      </button>
    </div>
  </div>
);
