'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Columns, List, Calendar as CalendarIcon } from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { FilterPopover } from './FilterPopover';
import { HeaderActions } from './HeaderActions';
import { HeaderNavigation } from './HeaderNavigation';
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
  isScrolled: boolean;
  currentFilter?: string;
  searchQuery?: string;
  onFilterChange?: (status: string | 'ALL') => void;
  onSearchChange?: (query: string) => void;
  onDeleteMonth?: () => void;
  isFetching?: boolean;
}

export const CalendarHeader = ({
  currentDate, currentView, onViewChange, onNavigate, onToday, onAddSession,
  onAutoGenerate, onGenerateInvoice, isGenerating = false, sessions, stats,
  isScrolled, onFilterChange, currentFilter = 'ALL', searchQuery = '',
  onSearchChange, onDeleteMonth, isFetching = false
}: Props) => {
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 px-3 py-3 sm:px-6 sm:py-4",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 flex-wrap">
          <HeaderNavigation currentDate={currentDate} onNavigate={onNavigate} onToday={onToday} isFetching={isFetching} />
          <StatsOverview stats={stats} />

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-2">
              <ViewTabs currentView={currentView} onViewChange={onViewChange} />
              <FilterPopover currentFilter={currentFilter} searchQuery={searchQuery} onFilterChange={onFilterChange!} onSearchChange={onSearchChange!} />
            </div>
            <HeaderActions
              onAddSession={onAddSession}
              onGenerateInvoice={onGenerateInvoice}
              onAutoGenerate={onAutoGenerate}
              onDeleteMonth={onDeleteMonth!}
              isGenerating={isGenerating}
              sessionsCount={sessions.length}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

function ViewTabs({ currentView, onViewChange }: { currentView: CalendarViewType; onViewChange: (v: CalendarViewType) => void }) {
  return (
    <Tabs value={currentView} onValueChange={(v) => onViewChange(v as CalendarViewType)} className="flex">
      <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/40 h-10">
        <TabsTrigger value="month" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px]">
          <CalendarIcon size={14} className="sm:hidden" /> <span className="hidden sm:inline">Tháng</span>
        </TabsTrigger>
        <TabsTrigger value="week" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px]">
          <Columns size={14} className="sm:hidden" /> <span className="hidden sm:inline">Tuần</span>
        </TabsTrigger>
        <TabsTrigger value="list" className="rounded-xl px-2 sm:px-3 font-black uppercase tracking-widest text-[9px]">
          <List size={14} className="sm:hidden" /> <span className="hidden sm:inline">D.Sách</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}