import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';
import { LessonCard } from './LessonCard';
import { Clock, Plus } from 'lucide-react';
import { useMemo } from 'react';

interface DayViewProps {
    day: CalendarDay | null;
    onAddSession: (dateStr: string) => void;
    onSessionClick?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
}

/**
 * DayView Component
 * 
 * Displays a detailed vertical timeline for a single day.
 * Hours from 7:00 to 22:00.
 */
export function DayView({ day, onAddSession, onSessionClick, onUpdate }: DayViewProps) {
    const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 to 22:00

    // Calculate position for session box
    const getSessionStyle = (session: SessionRecord) => {
        if (!session.startTime || !session.endTime) return { display: 'none' };

        const [startH, startM] = session.startTime.split(':').map(Number);
        const [endH, endM] = session.endTime.split(':').map(Number);

        // Each hour is 60px high
        const top = (startH - 7) * 60 + (startM / 60) * 60;
        const height = ((endH - startH) * 60) + ((endM - startM) / 60) * 60;

        return {
            top: `${top}px`,
            height: `${height}px`,
            minHeight: '34px',
        };
    };

    const daySessions = useMemo(() => {
        return day?.sessions.filter(s => s.startTime && s.endTime) || [];
    }, [day]);

    if (!day) return null;

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-[600px]">
            {/* Day Header */}
            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                        {day.date.getDate()}
                    </div>
                    <div>
                        <h2 className="font-bold text-foreground">
                            {day.date.toLocaleDateString('vi-VN', { weekday: 'long' })}
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            Tháng {day.date.getMonth() + 1}, {day.date.getFullYear()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onAddSession(day.dateStr)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-all"
                >
                    <Plus size={16} /> Thêm buổi học
                </button>
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 overflow-y-auto relative bg-background/50 dark:bg-slate-900/50">
                {/* Time Labels & Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                    {hours.map(h => (
                        <div key={h} className="h-[60px] border-b border-border/40 relative">
                            <span className="absolute -top-2.5 left-2 text-[10px] font-bold text-muted-foreground/60 bg-background px-1 rounded">
                                {h}:00
                            </span>
                        </div>
                    ))}
                </div>

                {/* Sessions Container */}
                <div className="ml-16 mr-4 relative" style={{ height: `${hours.length * 60}px` }}>
                    {daySessions.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 italic text-sm">
                            Không có buổi học nào có giờ cụ thể.
                        </div>
                    ) : (
                        daySessions.map(session => (
                            <div
                                key={session.id}
                                className="absolute left-0 right-0 z-10"
                                style={getSessionStyle(session)}
                            >
                                <LessonCard
                                    session={session}
                                    onClick={() => onSessionClick?.(session)}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        ))
                    )}

                    {/* Legend helper for those without time */}
                    {day.sessions.filter(s => !s.startTime || !s.endTime).length > 0 && (
                        <div className="absolute bottom-4 left-0 right-0 p-3 bg-muted/40 rounded-lg border border-border text-[10px] text-muted-foreground italic">
                            * Một số buổi học ({day.sessions.filter(s => !s.startTime || !s.endTime).length}) không hiển thị trên timeline do thiếu thông tin giờ giấc.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
