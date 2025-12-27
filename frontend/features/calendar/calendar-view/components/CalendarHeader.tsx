import { ChevronLeft, ChevronRight, Zap, Loader2, Calendar as CalendarIcon, FileDown, Trash2, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarStats } from '../types';
import { ViewSwitcher, CalendarViewType } from './ViewSwitcher';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  onDeleteAll: () => void;
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
  onExport,
  onDeleteAll
}: Props) => {
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-3 bg-card/95 text-card-foreground p-3 md:p-4 rounded-2xl shadow-sm border border-border">
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToday}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-primary transition-all shadow-sm"
                  >
                    <CalendarIcon size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Về hôm nay</TooltipContent>
              </Tooltip>

              <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onExport}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 transition-all shadow-sm md:ml-1"
                  >
                    <FileDown size={18} />
                    <span className="sr-only">Xuất Excel</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Xuất Excel báo cáo tháng</TooltipContent>
              </Tooltip>

              {/* Mobile/Tablet Action Toggle */}
              <button
                onClick={() => setIsActionsExpanded(!isActionsExpanded)}
                className="xl:hidden p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all shadow-sm"
              >
                {isActionsExpanded ? <ChevronUp size={18} /> : <LayoutGrid size={18} />}
              </button>
            </div>
          </div>

          {/* Stats Group (Responsive: hidden when actions expanded on small screens to save space?) */}
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-3 xl:flex gap-0 text-sm items-center w-full xl:w-auto border xl:border-none border-border rounded-xl overflow-hidden bg-muted/20",
            isActionsExpanded && "hidden sm:grid" // Hide stats on very small screens when actions are open
          )}>
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

        {/* Bottom Row: CTA Buttons (Collapsible for mobile/tablet) */}
        <div className={cn(
          "w-full pt-1 flex gap-3 transition-all duration-300 ease-in-out",
          "xl:flex", // Always visible on desktop
          isActionsExpanded ? "flex opacity-100 translate-y-0" : "hidden xl:flex opacity-0 -translate-y-2 xl:opacity-100 xl:translate-y-0"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDeleteAll}
                className="w-12 md:w-20 h-10 md:h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-xl font-bold transition-all border border-red-200 dark:border-red-800/50 shadow-sm active:scale-[0.99]"
              >
                <Trash2 size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent variant="destructive">Xóa tất cả buổi học trong tháng này</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAutoGenerate}
                disabled={isGenerating}
                className="flex-1 h-10 md:h-12 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800/50 shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                <span className="text-xs md:text-base">Tạo Lịch Dạy Tự Động</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Tự động tạo lịch học dựa trên cấu hình cố định</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
