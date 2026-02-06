'use client';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
    /** The currently selected date */
    selectedDate: Date;
    /** Callback to handle previous month navigation */
    onPrevMonth: () => void;
    /** Callback to handle next month navigation */
    onNextMonth: () => void;
    /** Whether the selector is visible (based on viewMode) */
    isVisible: boolean;
}

/**
 * Component to select and navigate between months.
 * Animates in/out based on visibility.
 */
export function MonthSelector({ selectedDate, onPrevMonth, onNextMonth, isVisible }: MonthSelectorProps) {
    return (
        <div className="flex items-center">
            <motion.div
                initial={false}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9,
                    x: isVisible ? 0 : -10
                }}
                className="flex-1 sm:flex-initial"
                style={{ overflow: 'visible' }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
                <div className="flex items-center justify-between gap-1 bg-muted/40 rounded-xl border border-border/50 p-1 w-full sm:w-auto min-w-fit">
                    <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm shrink-0">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="px-3 flex-1 text-center font-bold text-sm capitalize whitespace-nowrap min-w-[120px]">
                        {format(selectedDate, 'MMMM, yyyy', { locale: vi })}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm shrink-0">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
