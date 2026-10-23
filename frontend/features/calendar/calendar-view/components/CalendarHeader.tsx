'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterPopover } from './FilterPopover';
import { HeaderActions } from './HeaderActions';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';
import type { SessionRecord } from '@/lib/types/finance';
import type { CalendarStats } from '../types';
import type { CalendarViewType } from "./ViewSwitcher";

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
  onRevenueClick?: () => void;
  currentFilter?: string;
  searchQuery?: string;
  onFilterChange?: (status: string | 'ALL') => void;
  onSearchChange?: (query: string) => void;
  currentSource?: 'ALL' | 'trung_tam' | 'day_rieng';
  onSourceChange?: (source: 'ALL' | 'trung_tam' | 'day_rieng') => void;
  onDeleteMonth?: () => void;
  isFetching?: boolean;
  onReport: (scope: import('../utils/monthlyFeeReport').ReportScope) => void;
  reportLoading?: boolean;
}

/**
 * Calendar header actions — fits inside the 56px single-row AppHeader.
 * Priority-plus responsive layout measured via ResizeObserver (containerWidth).
 * All controls are strictly h-8 (32px), text >= 13px, whitespace-nowrap.
 */
export const CalendarActions = ({
  currentDate, currentView, onViewChange, onNavigate, onToday, onAddSession,
  onAutoGenerate, onGenerateInvoice, isGenerating = false, sessions,
  stats, onRevenueClick, onFilterChange, currentFilter = 'ALL', searchQuery = '',
  onSearchChange, onDeleteMonth, currentSource = 'ALL', onSourceChange, onReport, reportLoading
}: Props) => {
  const { containerWidth } = useUI();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const deleteLabel = `Xóa các buổi trong tháng ${month}/${year}`;

  // Priority-plus thresholds
  const showStatsPills = containerWidth >= 1150; // P4: hide first when width < 1150px
  const showFilterLabel = containerWidth >= 900;  // P2: icon-only when width < 900px
  const showTabLabels = containerWidth >= 800;    // P2: icon-only tabs when width < 800px
  const showTodayText = containerWidth >= 750;    // P1: hide "Tháng này" text when width < 750px

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">

      {/* P4: Stats Pills inside header (hidden when width < 1150px) */}
      {showStatsPills && (
        <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in duration-300">
          <div className="h-8 px-2.5 rounded-lg border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 flex items-center text-[13px] font-medium whitespace-nowrap">
            <span className="font-bold mr-1">{stats.total}</span> buổi
          </div>
          <div className="h-8 px-2.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center text-[13px] font-medium whitespace-nowrap">
            <span className="font-bold mr-1">{stats.completed}</span> hoàn thành
          </div>
          <button
            type="button"
            onClick={onRevenueClick}
            title="Bấm để xem chi tiết doanh thu"
            className="h-8 px-2.5 rounded-lg border border-orange-100 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-300 flex items-center text-[13px] font-bold whitespace-nowrap hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
          </button>
        </div>
      )}

      {/* P1: Navigation Controls (< Tháng này >) */}
      <div className="flex items-center bg-muted/50 rounded-xl p-0.5 border border-border/40 shadow-sm shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(-1)}
          aria-label="Tháng trước"
          title="Tháng trước"
          className="rounded-lg h-7 w-7 sm:h-7 sm:w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {showTodayText ? (
          <Button
            variant="ghost"
            onClick={onToday}
            className="px-2 font-medium text-[13px] rounded-lg h-7 whitespace-nowrap"
          >
            Tháng này
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(1)}
          aria-label="Tháng sau"
          title="Tháng sau"
          className="rounded-lg h-7 w-7 sm:h-7 sm:w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* P1: View Tabs (Tháng / Danh sách) */}
      <Tabs
        value={currentView}
        onValueChange={(v) => onViewChange(v as CalendarViewType)}
        className="shrink-0"
        data-tour="calendar-view-controls"
      >
        <TabsList
          data-tour="calendar-view-filter"
          className="bg-muted/50 p-0.5 rounded-xl border border-border/40 h-8"
        >
          <TabsTrigger
            value="month"
            title="Xem theo tháng"
            aria-label="Xem theo tháng"
            className="rounded-lg px-2 font-medium text-[13px] h-7 whitespace-nowrap gap-1"
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            {showTabLabels && <span>Tháng</span>}
          </TabsTrigger>
          <TabsTrigger
            value="list"
            title="Xem theo danh sách"
            aria-label="Xem theo danh sách"
            className="rounded-lg px-2 font-medium text-[13px] h-7 whitespace-nowrap gap-1"
          >
            <List className="w-4 h-4 shrink-0" />
            {showTabLabels && <span>Danh sách</span>}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* P2 & P3 & P1 Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0">
        <FilterPopover
          currentFilter={currentFilter}
          searchQuery={searchQuery}
          onFilterChange={onFilterChange!}
          onSearchChange={onSearchChange!}
          currentSource={currentSource}
          onSourceChange={onSourceChange!}
          showLabel={showFilterLabel}
        />
        <HeaderActions
          onAddSession={onAddSession}
          onGenerateInvoice={onGenerateInvoice}
          onAutoGenerate={onAutoGenerate}
          onDeleteMonth={onDeleteMonth!}
          isGenerating={isGenerating}
          sessionsCount={sessions.length}
          onReport={onReport}
          reportLoading={reportLoading}
          deleteLabel={deleteLabel}
        />
      </div>
    </div>
  );
};