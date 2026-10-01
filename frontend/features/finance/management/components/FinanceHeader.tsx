'use client';

import { addMonths, subMonths } from 'date-fns';
import { useFinanceContext } from '../context/FinanceContext';
import { ViewModeToggle } from './ViewModeToggle';
import { MonthSelector } from './MonthSelector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * FinanceHeader Component
 * Manages the top navigation bar for the Finance module, including view toggles and month selection.
 */
export function FinanceHeader() {
    const { viewMode, setViewMode, selectedDate, setSelectedDate, sourceFilter, setSourceFilter } = useFinanceContext();

    const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center justify-start w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

            {viewMode === 'MONTHLY' && (
                <MonthSelector
                    selectedDate={selectedDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth} isVisible={true} />
            )}
            <Tabs value={sourceFilter} onValueChange={(value) => setSourceFilter(value as typeof sourceFilter)}>
                <TabsList className="h-10 rounded-xl bg-muted/50 border border-border/40">
                    <TabsTrigger value="ALL" className="rounded-lg px-3 text-[10px] font-bold">Tất cả</TabsTrigger>
                    <TabsTrigger value="trung_tam" className="rounded-lg px-3 text-[10px] font-bold">Trung tâm</TabsTrigger>
                    <TabsTrigger value="day_rieng" className="rounded-lg px-3 text-[10px] font-bold">Dạy riêng</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
