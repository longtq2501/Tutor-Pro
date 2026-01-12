'use client';

import { addMonths, subMonths } from 'date-fns';
import { useFinanceContext } from '../context/FinanceContext';
import { ViewModeToggle } from './ViewModeToggle';
import { MonthSelector } from './MonthSelector';

/**
 * FinanceHeader Component
 * Manages the top navigation bar for the Finance module, including view toggles and month selection.
 */
export function FinanceHeader() {
    const { viewMode, setViewMode, selectedDate, setSelectedDate } = useFinanceContext();

    const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

    return (
        <div className="sticky top-0 z-30 flex flex-col bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 lg:px-6 xl:px-8 py-2 md:py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-0.5 shrink-0">
                    <h1 className="text-lg font-black tracking-tight lg:text-xl xl:text-2xl 2xl:text-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Quản Lý Tài Chính
                    </h1>
                    <p className="text-muted-foreground text-[10px] md:text-xs font-medium">
                        Theo dõi doanh thu, công nợ và trạng thái thanh toán
                    </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center lg:justify-end">
                    <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

                    <MonthSelector
                        selectedDate={selectedDate}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        isVisible={viewMode === 'MONTHLY'}
                    />
                </div>
            </div>
        </div>
    );
}
