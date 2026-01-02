import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Clock, Plus } from 'lucide-react';
import { memo, useState } from 'react';
import type { CalendarDay } from '../types';
import { getStatusColors } from '../utils/statusColors';

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
    const visibleSessions = sessions.slice(0, 3);
    const hiddenCount = sessions.length - 3;

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onDayClick(day)}
            className={cn(
                "group relative min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]",
                "border-r border-b p-1.5 sm:p-2 lg:p-3",
                "cursor-pointer transition-colors duration-300",
                !isCurrentMonth && "bg-muted/10 dark:bg-zinc-900/10 opacity-60",
                isToday && "bg-blue-50/50 dark:bg-blue-950/20",
                "hover:bg-accent/30 dark:hover:bg-zinc-800/30"
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
                        !isToday && isCurrentMonth && day.date.getDay() === 0 && "text-red-500",
                        !isToday && isCurrentMonth && day.date.getDay() !== 0 && "text-foreground group-hover:bg-primary/10"
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
            <div className="space-y-1 sm:space-y-1.5 mt-auto">
                {/* Desktop/Tablet: Full Badges */}
                <div className="hidden sm:block space-y-1">
                    <AnimatePresence>
                        {visibleSessions.map((session, index) => {
                            const colors = getStatusColors(session.status);
                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSessionClick?.(session);
                                    }}
                                    onContextMenu={(e) => {
                                        if (onContextMenu) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onContextMenu(e, session);
                                        }
                                    }}
                                    className={cn(
                                        "group/session relative px-2 py-1.5",
                                        "rounded-xl text-[10px] sm:text-[11px]",
                                        "font-bold truncate",
                                        "transition-all duration-300",
                                        "hover:scale-[1.03] hover:shadow-lg hover:z-20",
                                        "cursor-pointer border-l-[3px] shadow-sm",
                                        "bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent",
                                        colors.bg,
                                        colors.text,
                                        "border-slate-200/50 dark:border-white/10"
                                    )}
                                >
                                    {/* Left highlight strip for dimension */}
                                    <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-80", colors.dot)} />

                                    <div className="flex items-center gap-1.5 relative z-10">
                                        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm", colors.dot)} />
                                        <span className="truncate">{session.studentName}</span>
                                        {session.paid ? (
                                            <CheckCircle2 className="w-3 h-3 ml-auto flex-shrink-0 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
                                        ) : (
                                            <Clock className="w-3 h-3 ml-auto flex-shrink-0 opacity-40" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Mobile: Compact Dots */}
                <div className="flex flex-wrap gap-1 sm:hidden px-0.5">
                    {sessions.map((session) => {
                        const colors = getStatusColors(session.status);
                        return (
                            <div
                                key={session.id}
                                className={cn(
                                    "w-2 h-2 rounded-full border border-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
                                    colors.dot
                                )}
                            />
                        );
                    })}
                </div>

                {/* "More" indicator (Desktop only) */}
                {hiddenCount > 0 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDayClick(day);
                        }}
                        className={cn(
                            "hidden sm:block w-full px-2 py-1",
                            "text-[10px] text-muted-foreground hover:text-primary",
                            "text-left font-black uppercase tracking-widest transition-colors",
                            "hover:bg-primary/5 rounded-md"
                        )}
                    >
                        + {hiddenCount} nữa...
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
                    <div className="text-muted-foreground/30 text-[10px] font-black uppercase tracking-tighter hidden sm:block">
                        Nhấn để thêm
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
});
