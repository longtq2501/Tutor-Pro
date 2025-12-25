import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';
import { LessonCard } from './LessonCard';
import { useMemo } from 'react';
import { Plus } from 'lucide-react';

interface WeekViewProps {
    days: CalendarDay[];
    onDayClick: (day: CalendarDay) => void;
    onAddSession: (dateStr: string) => void;
    onSessionClick?: (session: SessionRecord) => void;
    onSessionEdit?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
}

/**
 * WeekView Component
 * 
 * Displays a 7-day grid of sessions.
 */
export function WeekView({ days, onDayClick, onAddSession, onSessionClick, onSessionEdit, onUpdate }: WeekViewProps) {
    // Find current week (the one containing today, or just the first 7 if not found)
    const weekDays = useMemo(() => {
        const todayIdx = days.findIndex(d => d.isToday);
        if (todayIdx === -1) return days.slice(0, 7);

        // Find start of week (Sunday)
        const startOfWeekIdx = todayIdx - days[todayIdx].date.getDay();
        const safeStart = Math.max(0, startOfWeekIdx);
        return days.slice(safeStart, safeStart + 7);
    }, [days]);

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-muted/20">
                {weekDays.map((day, i) => (
                    <div
                        key={i}
                        className={`
              p-3 text-center border-r last:border-r-0 border-border
              ${day.isToday ? 'bg-primary/5' : ''}
              ${i === 0 ? 'text-rose-500' : 'text-muted-foreground'}
            `}
                    >
                        <div className="text-[10px] uppercase font-bold tracking-widest mb-1">
                            {day.date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                        </div>
                        <div className={`
              inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
              ${day.isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-card-foreground'}
            `}>
                            {day.date.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-border bg-background/30 min-h-[400px]">
                {weekDays.map((day, i) => (
                    <div
                        key={i}
                        className={`p-2 space-y-2 relative group ${day.isToday ? 'bg-primary/5' : ''}`}
                    >
                        {/* Add Session Button on Hover */}
                        <button
                            onClick={() => onAddSession(day.dateStr)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-full text-primary transition-all z-10"
                        >
                            <Plus size={14} />
                        </button>

                        {/* Sessions List */}
                        <div className="space-y-1.5 h-full">
                            {day.sessions.length === 0 ? (
                                <div className="text-[10px] text-muted-foreground/30 italic text-center pt-10">
                                    Trống
                                </div>
                            ) : (
                                day.sessions.map(session => (
                                    <LessonCard
                                        key={session.id}
                                        session={session}
                                        compact
                                        onClick={() => onSessionClick?.(session)}
                                        onUpdate={onUpdate}
                                        onEdit={onSessionEdit}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
