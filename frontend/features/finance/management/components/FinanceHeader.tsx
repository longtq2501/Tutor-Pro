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
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center justify-start w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

            {viewMode === 'MONTHLY' && (
                <MonthSelector
                    selectedDate={selectedDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth} isVisible={true} />
            )}
        </div>
    );
}
