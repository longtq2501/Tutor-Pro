'use client';

import { addMonths, subMonths } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Filter, Wallet } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';
import { ViewModeToggle } from './ViewModeToggle';
import { MonthSelector } from './MonthSelector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    HeaderActionsRow,
    HeaderOverflowMenu,
    useHeaderDensity,
    type HeaderOverflowItem,
} from '@/components/shared/ResponsiveHeaderActions';
import type { StudentSourceFilter } from '../types';

const SOURCE_OPTIONS: { value: StudentSourceFilter; label: string }[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'trung_tam', label: 'Trung tâm' },
    { value: 'day_rieng', label: 'Dạy riêng' },
];

/**
 * FinanceHeader Component
 * Manages the controls of the Finance module inside the single-row app header
 * (view toggle, month navigation and revenue-source filter).
 *
 * Responsive behaviour (measured on the content width, not the viewport):
 * - >= 900px: source filter rendered as tabs, full month label
 * - >= 640px: view mode shows labels
 * - >= 420px: source filter collapses into an icon dropdown, month label shortens
 * - <  420px: month navigation + source filter move into the "..." overflow menu
 */
export function FinanceHeader() {
    const { viewMode, setViewMode, selectedDate, setSelectedDate, sourceFilter, setSourceFilter } = useFinanceContext();
    const { atLeast } = useHeaderDensity();

    const showSourceTabs = atLeast('wide');
    const showLabels = atLeast('comfortable');
    const showMonthSelector = atLeast('compact');
    const isMinimal = !atLeast('compact');

    const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

    const overflowItems: HeaderOverflowItem[] = [];

    if (isMinimal) {
        if (viewMode === 'MONTHLY') {
            overflowItems.push(
                {
                    key: 'prev-month',
                    label: 'Tháng trước',
                    icon: <ChevronLeft className="h-4 w-4" />,
                    onSelect: handlePrevMonth,
                },
                {
                    key: 'next-month',
                    label: 'Tháng sau',
                    icon: <ChevronRight className="h-4 w-4" />,
                    onSelect: handleNextMonth,
                }
            );
        }
        SOURCE_OPTIONS.forEach((option) => {
            overflowItems.push({
                key: `source-${option.value}`,
                label: `Nguồn: ${option.label}`,
                icon: sourceFilter === option.value
                    ? <Check className="h-4 w-4 text-primary" />
                    : <Wallet className="h-4 w-4" />,
                onSelect: () => setSourceFilter(option.value),
            });
        });
    }

    return (
        <HeaderActionsRow className="animate-in fade-in slide-in-from-right-4 duration-500">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} compact={!showLabels} />

            {viewMode === 'MONTHLY' && showMonthSelector && (
                <MonthSelector
                    selectedDate={selectedDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    isVisible
                    compact={!showLabels}
                />
            )}

            {showSourceTabs ? (
                <Tabs
                    value={sourceFilter}
                    onValueChange={(value) => setSourceFilter(value as StudentSourceFilter)}
                    className="shrink-0"
                >
                    <TabsList className="h-8 p-0.5 rounded-xl bg-muted/50 border border-border/40 shrink-0">
                        {SOURCE_OPTIONS.map((option) => (
                            <TabsTrigger
                                key={option.value}
                                value={option.value}
                                className="rounded-lg px-2.5 text-[11px] font-bold h-7 whitespace-nowrap"
                            >
                                {option.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            ) : !isMinimal ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            title="Lọc nguồn thu"
                            aria-label="Lọc nguồn thu"
                            className="h-8 w-8 shrink-0 rounded-xl border-border/40 hover:bg-muted/50"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl z-50">
                        <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                            Nguồn thu
                        </DropdownMenuLabel>
                        {SOURCE_OPTIONS.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSourceFilter(option.value)}
                                className="rounded-lg text-[13px] font-medium gap-2"
                            >
                                <span className="truncate">{option.label}</span>
                                {sourceFilter === option.value && (
                                    <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}

            <HeaderOverflowMenu label="Tùy chọn tài chính" items={overflowItems} />
        </HeaderActionsRow>
    );
}
