import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { memo, useState } from 'react';
import type { CalendarDay } from '../types';
import { getStatusColors } from '../utils/statusColors';
import { DraggableSession } from './DraggableSession';

interface CalendarCellProps {
    day: CalendarDay;
    isToday: boolean;
    isCurrentMonth: boolean;
    sessions: SessionRecord[];
    onDayClick: (day: CalendarDay) => void;
    onSessionClick: (session: SessionRecord) => void;
    onAddSession: (dateStr: string) => void;
    onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

export const CalendarCell = memo(({
    day,
    isToday,
    isCurrentMonth,
    sessions,
    onDayClick,
    onSessionClick,
    onAddSession,
    onContextMenu
}: CalendarCellProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setNodeRef, isOver } = useDroppable({
        id: day.dateStr,
    });

    // P5: Show max 3 pills on desktop, "+N buổi" for overflow
    const MAX_VISIBLE = 3;
    const visibleSessions = sessions.slice(0, MAX_VISIBLE);
    const hiddenCount = sessions.length - MAX_VISIBLE;

    const isSunday = day.date.getDay() === 0;

    return (
        <motion.div
            ref={setNodeRef}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onDayClick(day)}
            className={cn(
                "group relative min-h-[90px] sm:min-h-[120px] lg:min-h-[140px] xl:min-h-[150px]",
                "border-r border-b p-1 sm:p-2 lg:p-3",
                "cursor-pointer transition-colors duration-300",
                !isCurrentMonth && "bg-muted/10 dark:bg-zinc-900/10 opacity-60",
                isToday && "bg-blue-50/50 dark:bg-blue-950/20",
                isOver && "bg-primary/20 ring-2 ring-primary inset-0 z-10 scale-[0.98]",
                !isOver && "hover:bg-accent/30 dark:hover:bg-zinc-800/30"
            )}
        >
            {/* Date Number Header */}
            <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                <span
                    className={cn(
                        "flex items-center justify-center",
                        "w-6 h-6 sm:w-8 sm:h-8 rounded-full",
                        "text-sm sm:text-base font-bold transition-all duration-300",
                        !isCurrentMonth && "text-muted-foreground/50",
                        isToday && [
                            "bg-gradient-to-br from-blue-500 to-blue-600",
                            "text-white shadow-lg shadow-blue-500/30",
                            "ring-2 ring-blue-100 dark:ring-blue-900"
                        ],
                        !isToday && !isCurrentMonth && "text-muted-foreground/30",
                        // P5: Sunday — rose-400 (very light red), NOT orange (clashes with status colors)
                        !isToday && isCurrentMonth && isSunday && "text-rose-400 dark:text-rose-400/80",
                        !isToday && isCurrentMonth && !isSunday && "text-foreground group-hover:bg-primary/10"
                    )}
                >
                    {day.date.getDate()}
                </span>

                {/* Add Session Button (hover) */}
                <AnimatePresence>
                    {isHovered && isCurrentMonth && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddSession(day.dateStr);
                            }}
                            className={cn(
                                "w-5 h-5 sm:w-7 sm:h-7 rounded-full",
                                "bg-primary text-primary-foreground",
                                "flex items-center justify-center",
                                "shadow-lg hover:scale-110 transition-transform active:scale-95"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Session Indicators */}
            <div className="space-y-0.5 sm:space-y-1 mt-auto">
                {/* Desktop/Tablet: Full Pills */}
                <div className="hidden sm:block space-y-0.5 sm:space-y-1">
                    <AnimatePresence>
                        {visibleSessions.map((session, index) => (
                            <DraggableSession
                                key={`${session.id}-${session.version}`}
                                session={session}
                                index={index}
                                onSessionClick={onSessionClick}
                                onContextMenu={onContextMenu}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Mobile: Compact Dots — click to open DayDetailModal */}
                <div className="flex flex-wrap gap-1 sm:hidden px-0.5">
                    {sessions.map((session) => {
                        const colors = getStatusColors(session.status);
                        return (
                            <div
                                key={session.id}
                                className={cn(
                                    "w-2 h-2 rounded-full border border-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
                                    session.isOnline ? "rounded-[2px] bg-blue-500 scale-110 ring-1 ring-blue-400" : colors.dot
                                )}
                            />
                        );
                    })}
                </div>

                {/* P5: "+N buổi" overflow — desktop only */}
                {hiddenCount > 0 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDayClick(day);
                        }}
                        className={cn(
                            "hidden sm:block w-full px-1.5 py-0.5",
                            "text-[10px] sm:text-[11px] text-muted-foreground hover:text-primary",
                            "text-left font-medium transition-colors",
                            "hover:bg-primary/5 rounded-md"
                        )}
                    >
                        +{hiddenCount} buổi
                    </motion.button>
                )}
            </div>

            {/* Empty State Hint */}
            {sessions.length === 0 && isHovered && isCurrentMonth && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="text-muted-foreground/30 text-[10px] font-medium hidden sm:block">
                        Nhấn để thêm
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
});
CalendarCell.displayName = 'CalendarCell';
