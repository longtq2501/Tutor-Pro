'use client';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
    /** The currently selected date */
    selectedDate: Date;
    /** Callback to handle previous month navigation */
    onPrevMonth: () => void;
    /** Callback to handle next month navigation */
    onNextMonth: () => void;
    /** Whether the selector is visible (based on viewMode) */
    isVisible: boolean;
    /** Renders a 32px high / short-label variant so it fits the app header */
    compact?: boolean;
}

/**
 * Component to select and navigate between months.
 * Animates in/out based on visibility.
 */
export function MonthSelector({ selectedDate, onPrevMonth, onNextMonth, isVisible, compact = false }: MonthSelectorProps) {
    return (
        <div className="flex items-center shrink-0">
            <motion.div
                initial={false}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9,
                    x: isVisible ? 0 : -10
                }}
                style={{ overflow: 'visible' }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
                <div
                    className={cn(
                        'flex items-center justify-between bg-muted/40 rounded-xl border border-border/50 w-auto min-w-fit shrink-0',
                        compact ? 'gap-0.5 p-0.5' : 'gap-1 p-1'
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrevMonth}
                        title="Tháng trước"
                        aria-label="Tháng trước"
                        className={cn(
                            'rounded-lg hover:bg-background hover:shadow-sm shrink-0',
                            compact ? 'h-7 w-7' : 'h-8 w-8'
                        )}
                    >
                        <ChevronLeft className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    </Button>
                    <div
                        className={cn(
                            'text-center font-bold capitalize whitespace-nowrap shrink-0',
                            compact ? 'px-1 text-xs min-w-[58px]' : 'px-3 text-sm min-w-[120px]'
                        )}
                    >
                        {format(selectedDate, compact ? 'MM/yyyy' : 'MMMM, yyyy', { locale: vi })}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNextMonth}
                        title="Tháng sau"
                        aria-label="Tháng sau"
                        className={cn(
                            'rounded-lg hover:bg-background hover:shadow-sm shrink-0',
                            compact ? 'h-7 w-7' : 'h-8 w-8'
                        )}
                    >
                        <ChevronRight className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
