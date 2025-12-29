import { memo, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Loader2,
  Calendar as CalendarIcon,
  FileDown,
  Trash2,
  MoreVertical,
  CalendarRange,
  CalendarDays,
  List,
  TrendingUp
} from 'lucide-react';
import { MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarStats } from '../types';
import { CalendarViewType } from './ViewSwitcher';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { StatusLegend } from './StatusLegend';

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

const VIEW_CONFIG = {
  month: { icon: CalendarIcon, label: 'Tháng' },
  week: { icon: CalendarRange, label: 'Tuần' },
  day: { icon: CalendarDays, label: 'Ngày' },
  list: { icon: List, label: 'D.Sách' },
} as const;

const StatBox = memo(({ label, value, subValue, suffix = '', colorClass, isScrolled }: {
  label: string,
  value: string | number,
  subValue?: string | number,
  suffix?: string,
  colorClass?: string,
  isScrolled?: boolean
}) => {
  if (isScrolled) return null;
  return (
    <div className="flex flex-col px-4 py-3 bg-muted/40 dark:bg-zinc-900 rounded-xl border border-border/40 hover:bg-muted/60 dark:hover:bg-zinc-800/80 transition-all duration-300 min-w-[140px] flex-1 shadow-sm">
      <span className="text-[10px] text-muted-foreground dark:text-zinc-400 uppercase tracking-widest font-extrabold">{label}</span>
      <div className="flex items-baseline gap-1.5 mt-1.5">
        <span className={cn("text-lg font-black leading-none tracking-tight dark:text-white", colorClass)}>{value}</span>
        {suffix && <span className={cn("text-[12px] font-bold text-muted-foreground dark:text-zinc-300 ml-0.5", colorClass)}>{suffix}</span>}
        {subValue !== undefined && (
          <span className="text-[11px] text-muted-foreground dark:text-zinc-500 font-bold opacity-80">
            / {subValue}
          </span>
        )}
      </div>
    </div>
  );
});

StatBox.displayName = 'StatBox';

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
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const monthLabel = `Tháng ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}, ${currentDate.getFullYear()}`;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        isScrolled
          ? "gap-2 -mx-2 bg-transparent border-transparent shadow-none"
          : "gap-4 bg-card dark:bg-zinc-950 p-4 sm:p-5 rounded-2xl shadow-xl border border-border/60"
      )}>

        {/* Main Row: Logic for LG and Scrolling */}
        <div className={cn(
          "flex items-center justify-between gap-2 sm:gap-4",
          isScrolled && "lg:justify-between"
        )}>
          {/* Left: Navigation & Legend */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className={cn(
              "flex items-center gap-1 sm:gap-2 bg-muted/50 dark:bg-zinc-900/50 rounded-xl shadow-inner border border-border/40 transition-all duration-300",
              isScrolled ? "p-0.5" : "p-0.5 sm:p-1"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onChangeMonth(-1)}
                    className={cn(
                      "hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90 shadow-sm text-muted-foreground dark:text-zinc-300",
                      isScrolled ? "p-1 sm:p-1.5" : "p-1.5 sm:p-2"
                    )}
                  >
                    <ChevronLeft className={cn("transition-all", isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Tháng trước</TooltipContent>
              </Tooltip>

              <div className={cn(
                "font-black text-foreground dark:text-zinc-100 tracking-tight text-center transition-all px-1 sm:px-2",
                isScrolled ? "text-[10px] sm:text-xs min-w-[100px] sm:min-w-[120px]" : "text-xs sm:text-sm min-w-[140px] sm:min-w-[160px]"
              )}>
                {monthLabel}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onChangeMonth(1)}
                    className={cn(
                      "hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-90 shadow-sm text-muted-foreground dark:text-zinc-300",
                      isScrolled ? "p-1.5" : "p-2"
                    )}
                  >
                    <ChevronRight className={cn("transition-all", isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Tháng sau</TooltipContent>
              </Tooltip>
            </div>

            {/* Legend Trigger - Only shown in Month View and not scrolled (or even when scrolled if compact enough) */}
            {/* Hidden on mobile (sm:block) to prevent overflow */}
            {currentView === 'month' && !isScrolled && (
              <div className="hidden sm:block">
                <StatusLegend />
              </div>
            )}
          </div>

          {/* Desktop/LG Optimization: Move View Switcher here when on large screen or scrolled */}
          {(isScrolled || true) && (
            <div className={cn(
              "hidden lg:flex flex-1 max-w-md mx-2 xl:mx-4 items-center bg-muted/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-border/40 shadow-inner transition-all",
              isScrolled ? "px-0.5 py-0.5" : "px-1 py-1"
            )}>
              {(Object.entries(VIEW_CONFIG) as [CalendarViewType, typeof VIEW_CONFIG[keyof typeof VIEW_CONFIG]][]).map(([view, config]) => {
                const Icon = config.icon;
                const isActive = currentView === view;

                return (
                  <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={cn(
                      "relative flex-1 flex items-center justify-center gap-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300",
                      isScrolled ? "h-8" : "h-10",
                      isActive
                        ? "bg-white dark:bg-zinc-100 text-primary dark:text-zinc-950 shadow-lg active:scale-[0.98]"
                        : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                    )}
                  >
                    <Icon className={cn("transition-all", isScrolled ? "w-3 h-3" : "w-4 h-4", isActive ? "text-primary dark:text-zinc-950" : "text-muted-foreground dark:text-zinc-400")} />
                    <span className={cn("transition-all", isScrolled ? "hidden xl:inline-block" : "hidden sm:inline-block md:inline-block")}>{config.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <div className={cn(
              "hidden sm:flex items-center gap-1 md:gap-1.5 bg-muted/30 dark:bg-zinc-900/30 rounded-xl border border-border/40 transition-all",
              isScrolled ? "p-0.5" : "p-0.5 md:p-1"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToday}
                    className={cn(
                      "bg-background dark:bg-zinc-900 hover:bg-muted dark:hover:bg-zinc-800 text-[9px] md:text-[10px] font-black rounded-lg border border-border/60 dark:border-zinc-700 transition-all active:scale-95 shadow-sm dark:text-zinc-100",
                      isScrolled ? "h-7 px-2 md:h-8 md:px-2" : "h-9 px-3 md:h-10 md:px-4"
                    )}
                  >
                    Hôm nay
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Về ngày hiện tại</TooltipContent>
              </Tooltip>

              <div className={cn("bg-border/60 dark:bg-zinc-700 transition-all", isScrolled ? "w-px h-3 mx-0.5 md:h-4" : "w-px h-4 mx-0.5 md:h-5 md:mx-1")} />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onExport}
                    className={cn(
                      "flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all active:scale-95",
                      isScrolled ? "h-7 w-7 md:h-8 md:w-8" : "h-9 w-9 md:h-10 md:w-10"
                    )}
                  >
                    <FileDown className={cn("transition-all", isScrolled ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Xuất Excel</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onDeleteAll}
                    className={cn(
                      "flex items-center justify-center hover:bg-destructive/10 dark:hover:bg-red-900/30 text-destructive dark:text-red-400 rounded-lg transition-all active:scale-95",
                      isScrolled ? "h-7 w-7 md:h-8 md:w-8" : "h-9 w-9 md:h-10 md:w-10"
                    )}
                  >
                    <Trash2 className={cn("transition-all", isScrolled ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Xóa tất cả</TooltipContent>
              </Tooltip>
            </div>

            {/* Mobile Actions Dropdown */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "bg-muted/60 dark:bg-zinc-900/60 hover:bg-muted dark:hover:bg-zinc-800 rounded-xl transition-all border border-border/40 text-foreground dark:text-zinc-200",
                    isScrolled ? "p-1.5" : "p-2.5"
                  )}>
                    <MoreVertical className={cn("transition-all", isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-2xl border-border/60 dark:bg-zinc-900 dark:border-zinc-800">
                  <DropdownMenuItem onClick={onToday} className="rounded-lg py-3">
                    <CalendarIcon className="w-4 h-4 mr-3 opacity-60" />
                    Về hôm nay
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExport} className="rounded-lg py-3 text-emerald-600 dark:text-emerald-400 focus:text-emerald-700 dark:focus:text-emerald-300">
                    <FileDown className="w-4 h-4 mr-3" />
                    Xuất Excel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="opacity-40" />
                  <DropdownMenuItem onClick={onDeleteAll} className="rounded-lg py-3 text-destructive dark:text-red-400 focus:text-red-500">
                    <Trash2 className="w-4 h-4 mr-3" />
                    Xóa tất cả
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* View Switcher Controls Mobile / Non-LG Desktop */}
        {!isScrolled && (
          <div className="flex items-center gap-4 lg:hidden">
            <div className="flex-1 flex items-center bg-muted/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-border/40 shadow-inner">
              {(Object.entries(VIEW_CONFIG) as [CalendarViewType, typeof VIEW_CONFIG[keyof typeof VIEW_CONFIG]][]).map(([view, config]) => {
                const Icon = config.icon;
                const isActive = currentView === view;

                return (
                  <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={cn(
                      "relative flex-1 flex items-center justify-center gap-2 h-10 px-2 rounded-lg text-[11px] font-black tracking-widest uppercase transition-all duration-300",
                      isActive
                        ? "bg-white dark:bg-zinc-100 text-primary dark:text-zinc-950 shadow-lg active:scale-[0.98]"
                        : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-primary dark:text-zinc-950" : "text-muted-foreground dark:text-zinc-400")} />
                    <span className="hidden sm:inline-block md:inline-block">{config.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className={cn(
                  "flex items-center justify-center h-12 w-12 rounded-xl transition-all border shrink-0 shadow-lg active:scale-95",
                  isStatsExpanded
                    ? "bg-primary/10 dark:bg-primary/20 border-primary/40 text-primary shadow-primary/20"
                    : "bg-muted/40 dark:bg-zinc-900 border-border/40 text-muted-foreground dark:text-zinc-400"
                )}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrolled View Switcher for Mobile */}
        {isScrolled && (
          <div className="lg:hidden flex items-center bg-muted/60 dark:bg-zinc-900/60 p-0.5 rounded-xl border border-border/40 shadow-inner">
            {(Object.entries(VIEW_CONFIG) as [CalendarViewType, typeof VIEW_CONFIG[keyof typeof VIEW_CONFIG]][]).map(([view, config]) => {
              const Icon = config.icon;
              const isActive = currentView === view;

              return (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 h-8 px-2 rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "bg-white dark:bg-zinc-100 text-primary dark:text-zinc-950 shadow-md"
                      : "text-muted-foreground dark:text-zinc-400 hover:text-foreground active:scale-95"
                  )}
                >
                  <Icon className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0", isActive ? "text-primary dark:text-zinc-950" : "text-muted-foreground dark:text-zinc-400")} />
                  <span className="hidden xs:inline-block">{config.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Stats View - Hidden when scrolled */}
        {!isScrolled && (
          <div className={cn(
            "grid gap-3 transition-all duration-300",
            "lg:grid lg:grid-cols-3",
            isStatsExpanded ? "grid grid-cols-1 md:grid-cols-3" : "hidden lg:grid"
          )}>
            <StatBox label="Đã dạy" value={stats.completed} subValue={stats.total} />
            <StatBox label="Doanh thu" value={formatCurrency(stats.revenue)} colorClass="text-primary dark:text-primary-foreground" />
            <StatBox label="Chưa thu" value={stats.pending} suffix="buổi" colorClass="text-orange-600 dark:text-orange-400" />
          </div>
        )}

        {/* Primary Action Button - Hidden when scrolled on Mobile (replaced by FAB) */}
        <div className={cn("transition-all duration-300 overflow-hidden", isScrolled ? "h-0 opacity-0" : "h-12 opacity-100 mt-1")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAutoGenerate}
                disabled={isGenerating}
                className="w-full h-12 bg-primary dark:bg-primary/90 text-primary-foreground hover:bg-primary/95 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_12px_28px_rgba(var(--primary-rgb),0.4)] active:scale-[0.99] disabled:opacity-50 uppercase tracking-[0.2em] text-[13px]"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Zap className="w-5 h-5" fill="currentColor" />
                )}
                <span>
                  <span className="sm:hidden">Tạo Lịch</span>
                  <span className="hidden sm:inline">Lập Lịch Tự Động</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Thông minh hóa việc quản lý lịch dạy</TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile FAB for Auto-Generate (Visible only when scrolled and on small screens) */}
        {isScrolled && (
          <div className="fixed bottom-6 right-6 z-50 sm:hidden animate-in fade-in zoom-in-50 duration-300 slide-in-from-bottom-10">
            <button
              onClick={onAutoGenerate}
              disabled={isGenerating}
              className="group relative flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_8px_24px_rgba(var(--primary-rgb),0.5)] active:scale-90 transition-all focus:outline-none ring-2 ring-primary/20"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <Zap className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
};