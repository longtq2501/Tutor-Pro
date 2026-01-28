'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Columns, List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { FilterPopover } from './FilterPopover';
import { HeaderActions } from './HeaderActions';
import { Button } from '@/components/ui/button';
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
  currentFilter?: string;
  searchQuery?: string;
  onFilterChange?: (status: string | 'ALL') => void;
  onSearchChange?: (query: string) => void;
  onDeleteMonth?: () => void;
  isFetching?: boolean;
}

export const CalendarActions = ({
  currentDate, currentView, onViewChange, onNavigate, onToday, onAddSession,
  onAutoGenerate, onGenerateInvoice, isGenerating = false, sessions, stats,
  onFilterChange, currentFilter = 'ALL', searchQuery = '',
  onSearchChange, onDeleteMonth, isFetching = false
}: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
      {/* Navigation Controls */}
      <div className="flex items-center bg-muted/50 rounded-2xl p-0.5 border border-border/40 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => onNavigate(-1)} className="rounded-xl h-8 w-8 sm:h-9 sm:w-9">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" onClick={onToday} className="px-3 font-black uppercase tracking-widest text-[10px] rounded-xl h-8 sm:h-9">
          Tháng này
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate(1)} className="rounded-xl h-8 w-8 sm:h-9 sm:w-9">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats - Hidden on very small screens, shown in header portal */}
      <div className="hidden xl:flex items-center gap-2">
        <StatsOverview stats={stats} />
      </div>

      <div className="flex items-center gap-2">
        <Tabs value={currentView} onValueChange={(v) => onViewChange(v as CalendarViewType)} className="hidden sm:flex">
          <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/40 h-9 sm:h-10">
            <TabsTrigger value="month" className="rounded-xl px-3 font-black uppercase tracking-widest text-[9px]">Tháng</TabsTrigger>
            <TabsTrigger value="week" className="rounded-xl px-3 font-black uppercase tracking-widest text-[9px]">Tuần</TabsTrigger>
            <TabsTrigger value="list" className="rounded-xl px-3 font-black uppercase tracking-widest text-[9px]">D.Sách</TabsTrigger>
          </TabsList>
        </Tabs>

        <FilterPopover
          currentFilter={currentFilter}
          searchQuery={searchQuery}
          onFilterChange={onFilterChange!}
          onSearchChange={onSearchChange!}
        />

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
  );
};