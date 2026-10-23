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
    cellHeight?: number;
    cellWidth?: number;
}

export const CalendarCell = memo(({
    day,
    isToday,
    isCurrentMonth,
    sessions,
    onDayClick,
    onSessionClick,
    onAddSession,
    onContextMenu,
    cellHeight = 120,
    cellWidth = 150,
}: CalendarCellProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setNodeRef, isOver } = useDroppable({
        id: day.dateStr,
    });

    const isSunday = day.date.getDay() === 0;

    // Display modes based on actual measured cell dimensions (Requirement 4)
    const isDotMode = (cellHeight > 0 && cellHeight < 56) || (cellWidth > 0 && cellWidth < 70);
    const isCompactMode = !isDotMode && cellHeight > 0 && cellHeight < 90;
    const isFullMode = !isDotMode && !isCompactMode;

    // Dynamic capacity calculation (Requirement 3 & 4)
    // Chiều cao khả dụng cho chip = chiều cao ô - chiều cao số ngày - padding - khoảng cách
    let maxChips = 3;
    if (cellHeight > 0) {
        if (isCompactMode) {
            const dateHeaderH = 22;
            const paddingV = 8;
            const gap = 4;
            const chipH = 23; // 19px chip + 4px inter-chip gap
            const availableForChips = cellHeight - dateHeaderH - paddingV - gap;
            maxChips = Math.max(0, Math.floor(availableForChips / chipH));
        } else if (isFullMode) {
            const dateHeaderH = Math.min(32, Math.max(22, Math.round(cellHeight * 0.18)));
            const paddingV = Math.min(12, Math.max(6, Math.round(cellHeight * 0.05)));
            const gap = 4;
            const chipH = Math.min(30, Math.max(24, Math.round(cellHeight * 0.16)));
            const availableForChips = cellHeight - dateHeaderH - paddingV - gap;
            maxChips = Math.max(0, Math.floor(availableForChips / chipH));
        }
    }

    // Allocate visible chips and hidden overflow count: only complete chips, never cut half-way
    let visibleSessions: SessionRecord[] = [];
    let hiddenCount = 0;

    if (sessions.length <= maxChips) {
        visibleSessions = sessions;
        hiddenCount = 0;
    } else if (maxChips > 1) {
        visibleSessions = sessions.slice(0, maxChips - 1);
        hiddenCount = sessions.length - (maxChips - 1);
    } else if (maxChips === 1) {
        if (sessions.length === 1) {
            visibleSessions = sessions;
            hiddenCount = 0;
        } else {
            visibleSessions = [];
            hiddenCount = sessions.length;
        }
    } else {
        visibleSessions = [];
        hiddenCount = sessions.length;
    }

    return (
        <motion.div
            ref={setNodeRef}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onDayClick(day)}
            className={cn(
                "group relative h-full w-full min-w-0 min-h-0 overflow-hidden flex flex-col justify-start",
                "border-r border-b p-[clamp(2px,0.5cqi,8px)]",
                "cursor-pointer transition-colors duration-200 select-none",
                !isCurrentMonth && "bg-muted/10 dark:bg-zinc-900/10 opacity-50",
                isToday && "bg-blue-50/40 dark:bg-blue-950/20",
                isOver && "bg-primary/20 ring-2 ring-primary inset-0 z-10 scale-[0.98]",
                !isOver && "hover:bg-accent/30 dark:hover:bg-zinc-800/30"
            )}
        >
            {/* Date Number Header */}
            <div className="flex items-center justify-between mb-1 shrink-0">
                <span
                    className={cn(
                        "flex items-center justify-center rounded-full font-bold transition-all duration-200",
                        "w-[clamp(20px,2.8cqi,30px)] h-[clamp(20px,2.8cqi,30px)] text-[clamp(13px,2cqi,19px)]",
                        !isCurrentMonth && "text-muted-foreground/40",
                        isToday && [
                            "bg-gradient-to-br from-blue-500 to-blue-600",
                            "text-white shadow-md shadow-blue-500/30",
                            "ring-2 ring-blue-100 dark:ring-blue-900"
                        ],
                        !isToday && isCurrentMonth && isSunday && "text-rose-500 dark:text-rose-400 font-extrabold",
                        !isToday && isCurrentMonth && !isSunday && "text-foreground group-hover:bg-primary/10"
                    )}
                >
                    {day.date.getDate()}
                </span>

                {/* Add Session Button on hover (desktop only when height >= 70px) */}
                <AnimatePresence>
                    {isHovered && isCurrentMonth && cellHeight >= 70 && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddSession(day.dateStr);
                            }}
                            title="Thêm tiết học"
                            aria-label="Thêm tiết học"
                            className={cn(
                                "w-5 h-5 sm:w-6 sm:h-6 rounded-full",
                                "bg-primary text-primary-foreground",
                                "flex items-center justify-center",
                                "shadow-md hover:scale-110 transition-transform active:scale-95 shrink-0"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Session Indicators */}
            {isDotMode ? (
                /* Dot Mode (Requirement 4: cellHeight < 56px or cellWidth < 70px) */
                <div className="flex flex-wrap items-center justify-start gap-1 pt-0.5 px-0.5">
                    {sessions.slice(0, 3).map((session) => {
                        const colors = getStatusColors(session.status);
                        return (
                            <div
                                key={session.id}
                                title={`${session.startTime} - ${session.studentName}`}
                                className={cn(
                                    "w-2 h-2 rounded-full border border-background shadow-xs shrink-0",
                                    colors.dot
                                )}
                            />
                        );
                    })}
                    {sessions.length > 3 && (
                        <span className="text-[10px] font-bold text-muted-foreground leading-none ml-0.5">
                            +{sessions.length - 3}
                        </span>
                    )}
                </div>
            ) : (
                /* Chip Modes: Compact or Full Chip Mode - Aligned to top (justify-start), strictly following date number */
                <div className="flex-1 flex flex-col justify-start space-y-1 min-h-0 overflow-hidden">
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

                    {/* "+N buổi" badge (Requirement 3: placed directly after the last chip) */}
                    {hiddenCount > 0 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDayClick(day);
                            }}
                            title={`Xem tất cả ${sessions.length} buổi học`}
                            className={cn(
                                "w-full px-1.5 py-0.5",
                                "text-[clamp(11px,1.2cqi,13px)] text-muted-foreground hover:text-primary",
                                "text-left font-bold transition-colors truncate whitespace-nowrap",
                                "hover:bg-primary/10 rounded-md shrink-0 leading-tight"
                            )}
                        >
                            +{hiddenCount} buổi
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
});
CalendarCell.displayName = 'CalendarCell';
