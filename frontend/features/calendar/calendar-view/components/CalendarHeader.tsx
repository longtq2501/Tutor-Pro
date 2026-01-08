'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SessionRecord } from '@/lib/types/finance';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft, ChevronRight,
  Columns,
  DollarSign,
  Filter, Info,
  List, Loader2,
  Plus, Search, Sparkles
} from 'lucide-react';
import { memo, useState } from 'react';
import { MONTHS } from '../constants';
import type { CalendarStats } from '../types';
import { getStatusColors } from '../utils/statusColors';
import type { CalendarViewType } from './ViewSwitcher';

interface Props {
  currentDate: Date;
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onNavigate: (dir: number) => void;
  onToday: () => void;
  onAddSession: () => void;
  onAutoGenerate: () => void;
  onGenerateInvoice: () => void;
  isGenerating?: boolean;
  sessions: SessionRecord[];
  stats: CalendarStats;
  isScrolled: boolean;
  currentFilter?: string;
  searchQuery?: string;
  onFilterChange?: (status: string | 'ALL') => void;
  onSearchChange?: (query: string) => void;
  isFetching?: boolean;
}

const StatsChip = memo(({ icon, label, value, variant }: {
  icon: React.ReactNode,
  label: string,
  value: string | number,
  variant: 'blue' | 'emerald' | 'orange' | 'purple'
}) => {
  const styles = {
    blue: "bg-blue-50/50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-500/20",
    emerald: "bg-emerald-50/50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20",
    orange: "bg-orange-50/50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-100 dark:border-orange-500/20",
    purple: "bg-purple-50/50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-100 dark:border-purple-500/20"
  };

  return (
    <div className={cn("flex px-4 py-2 rounded-2xl border transition-all hover:shadow-md", styles[variant])}>
      <div className="mr-3 opacity-80">{icon}</div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{label}</div>
        <div className="text-sm font-black tracking-tight">{value}</div>
      </div>
    </div>
  );
});

StatsChip.displayName = 'StatsChip';

export const CalendarHeader = ({
  currentDate,
  currentView,
  onViewChange,
  onNavigate,
  onToday,
  onAddSession,
  onAutoGenerate,
  onGenerateInvoice,
  isGenerating = false,
  sessions,
  stats,
  isScrolled,
  onFilterChange,
  currentFilter = 'ALL',
  searchQuery = '',
  onSearchChange,
  isFetching = false
}: Props) => {


  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStatusSelect = (status: string | 'ALL') => {
    onFilterChange?.(status);
    // Slight delay for feedback before closing
    setTimeout(() => setIsFilterOpen(false), 200);
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300",
      "px-3 py-3 sm:px-6 sm:py-4",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-[1600px] mx-auto space-y-4">

        {/* Top Row: Navigation, Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 flex-wrap">

          <div className="flex items-center justify-between lg:justify-start gap-4 sm:gap-6">
            {/* Title & Stats Indicator */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-foreground flex items-center gap-2 sm:gap-3">
                <CalendarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" strokeWidth={2.5} />
                <span className="truncate">{MONTHS[currentDate.getMonth()]}</span>
                {isFetching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </motion.div>
                )}
                <span className="text-muted-foreground/30 font-thin italic hidden sm:inline">{currentDate.getFullYear()}</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-7 sm:ml-10">Lịch trình dạy học</p>
            </div>

            {/* Navigation (Mobile: Minimal, Desktop: Full) */}
            <div className="flex items-center bg-card rounded-2xl sm:rounded-3xl p-1 border border-border/40 shadow-sm shrink-0">
              <Button variant="ghost" size="icon" onClick={() => onNavigate(-1)} className="rounded-xl sm:rounded-2xl hover:bg-muted h-8 w-8 sm:h-10 sm:w-10">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="ghost" onClick={onToday} className="px-2 sm:px-5 font-black uppercase tracking-widest text-[9px] sm:text-[11px] rounded-xl sm:rounded-2xl hover:bg-muted h-8 sm:h-10">
                <span className="hidden sm:inline">Tháng này</span>
                <CalendarIcon className="w-3.5 h-3.5 sm:hidden" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onNavigate(1)} className="rounded-xl sm:rounded-2xl hover:bg-muted h-8 w-8 sm:h-10 sm:w-10">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Stats Bar (Hidden on Mobile, Visible on LG, wraps if needed) */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            <StatsChip
              icon={<CalendarIcon size={16} />}
              label="Tổng buổi"
              value={stats.total}
              variant="blue"
            />
            <StatsChip
              icon={<CheckCircle2 size={16} />}
              label="Đã hoàn thành"
              value={stats.completed}
              variant="emerald"
            />
            <StatsChip
              icon={<DollarSign size={16} />}
              label="Doanh thu"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
              variant="orange"
            />
          </div>

          {/* Actions Column (Visible on all) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto pb-1 sm:pb-0">

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* View Switcher - Always visible but compact */}
              <Tabs value={currentView} onValueChange={(v) => onViewChange(v as CalendarViewType)} className="flex">
                <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/40 h-10">
                  <TabsTrigger value="month" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <CalendarIcon size={14} className="sm:hidden" />
                    <span className="hidden sm:inline">Tháng</span>
                  </TabsTrigger>
                  <TabsTrigger value="week" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Columns size={14} className="sm:hidden" />
                    <span className="hidden sm:inline">Tuần</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <List size={14} className="sm:hidden" />
                    <span className="hidden sm:inline">D.Sách</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Optimized Filter Button */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 rounded-2xl px-3 sm:px-4 gap-2 border-border/40 hover:bg-muted/50 bg-card/50 transition-all active:scale-95 shadow-sm">
                    <Filter size={14} className={cn("sm:w-4 sm:h-4", (currentFilter !== 'ALL' || searchQuery) ? "text-primary fill-primary" : "")} />
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest hidden sm:inline">
                      Bộ lọc {(currentFilter !== 'ALL' || searchQuery) && "•"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100vw-24px)] xs:w-72 sm:w-80 p-5 rounded-[2rem] border-border/60 shadow-2xl space-y-5 bg-background/95 backdrop-blur-xl animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-300"
                  align="end"
                  sideOffset={8}
                >
                  {/* Search Section */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tìm kiếm</p>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                      <input
                        type="text"
                        placeholder="Tên học sinh, môn học..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Trạng thái</p>
                      {currentFilter !== 'ALL' && (
                        <button
                          onClick={() => handleStatusSelect('ALL')}
                          className="text-[9px] font-black uppercase text-primary hover:underline hover:opacity-80 transition-all"
                        >
                          Xóa lọc
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 mt-2 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
                      <Button
                        variant={currentFilter === 'ALL' ? 'secondary' : 'ghost'}
                        onClick={() => handleStatusSelect('ALL')}
                        className={cn(
                          "justify-start h-10 rounded-xl px-3 font-bold text-xs transition-all",
                          currentFilter === 'ALL' ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-muted"
                        )}
                      >
                        Tất cả trạng thái
                      </Button>
                      {Object.entries(LESSON_STATUS_LABELS).map(([status, label]) => {
                        const colors = getStatusColors(status as any);
                        const isActive = currentFilter === status;
                        return (
                          <Button
                            key={status}
                            variant={isActive ? 'secondary' : 'ghost'}
                            onClick={() => handleStatusSelect(status)}
                            className={cn(
                              "justify-start h-10 rounded-xl px-3 font-bold text-xs transition-all",
                              isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-muted"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
                                <span className={cn(isActive && "text-primary")}>{label}</span>
                              </div>
                              {isActive && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                                  <CheckCircle2 size={14} className="text-primary" />
                                </motion.div>
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {(searchQuery || currentFilter !== 'ALL') && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl h-11 font-black uppercase tracking-widest text-[9px] border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                        onClick={() => {
                          onSearchChange?.('');
                          onFilterChange?.('ALL');
                          setTimeout(() => setIsFilterOpen(false), 300);
                        }}
                      >
                        Đặt lại tất cả filters
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-4 sm:px-6 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={onAddSession}>
                <Plus className="w-4 h-4 sm:mr-2" strokeWidth={3} />
                <span className="hidden sm:inline">Tiết học mới</span>
                <span className="sm:hidden">Thêm</span>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-border/40 hover:bg-muted/50 shink-0">
                    <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-6 rounded-[2rem] border-border/60 shadow-2xl" align="end">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Chú thích màu sắc</p>
                    <div className="grid gap-3">
                      {Object.entries(LESSON_STATUS_LABELS).map(([status, label]) => {
                        const colors = getStatusColors(status as any);
                        return (
                          <div key={status} className="flex items-center gap-3 group">
                            <div className={cn("w-3 h-3 rounded-full transition-transform group-hover:scale-125", colors.dot)} />
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-4 mt-4 border-t border-border/40">
                      <Button variant="ghost" size="sm" className="w-full justify-start h-10 rounded-xl px-3 font-black uppercase tracking-widest text-[10px] text-muted-foreground" onClick={onGenerateInvoice} disabled={isGenerating}>
                        {isGenerating ? "Đang xử lý..." : "Chi tiết doanh thu"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Empty State / Tips Banner (Optional) */}
        {sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/10 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Bắt đầu ngay</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-sm font-bold">Tháng này chưa có lịch dạy. Nhấn vào bất kỳ ngày nào trên lịch để thêm buổi học mới!</p>
                <Button
                  size="sm"
                  onClick={onAutoGenerate}
                  disabled={isGenerating}
                  className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 font-bold"
                >
                  {isGenerating ? "Đang tạo..." : "Tạo lịch tự động"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};