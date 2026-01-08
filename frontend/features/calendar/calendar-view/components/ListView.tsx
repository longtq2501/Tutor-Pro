import type { SessionRecord } from '@/lib/types/finance';
import { useMemo } from 'react';
import { LessonCard } from './LessonCard';
import { Filter, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/statusColors';

interface ListViewProps {
    sessions: SessionRecord[];
    onSessionClick?: (session: SessionRecord) => void;
    onSessionEdit?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
}

/**
 * ListView Component
 * 
 * Displays a searchable, filterable list of sessions.
 * Note: Filtering logic is handled in useCalendarView and passed via props.
 */
export function ListView({ sessions, onSessionClick, onSessionEdit, onUpdate }: ListViewProps) {
    // Already pre-filtered by useCalendarView
    const displaySessions = useMemo(() => {
        return [...sessions].sort((a, b) => {
            const dateA = new Date(a.sessionDate).getTime();
            const dateB = new Date(b.sessionDate).getTime();
            if (dateA !== dateB) return dateA - dateB;

            // Secondary sort by startTime for same-day sessions
            const timeA = a.startTime || '';
            const timeB = b.startTime || '';
            return timeA.localeCompare(timeB);
        });
    }, [sessions]);

    // Group by date
    const groupedSessions = useMemo(() => {
        const groups: Record<string, SessionRecord[]> = {};
        displaySessions.forEach(s => {
            if (!groups[s.sessionDate]) groups[s.sessionDate] = [];
            groups[s.sessionDate].push(s);
        });
        return groups;
    }, [displaySessions]);

    // Stats for the current filter
    const listStats = useMemo(() => {
        return {
            total: displaySessions.length,
            revenue: displaySessions.reduce((sum, s) => sum + s.totalAmount, 0),
            hours: displaySessions.reduce((sum, s) => sum + s.hours, 0),
        };
    }, [displaySessions]);

    return (
        <div className="space-y-4 px-4 sm:px-0">
            {/* List Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Filter size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Số buổi</div>
                        <div className="text-lg font-bold">{listStats.total}</div>
                    </div>
                </div>
                <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Thu nhập</div>
                        <div className="text-lg font-bold">{formatCurrency(listStats.revenue)}</div>
                    </div>
                </div>
                <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 text-muted-foreground opacity-60">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                        <Filter size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold">Tổng giờ</div>
                        <div className="text-lg font-bold">{listStats.hours}h</div>
                    </div>
                </div>
            </div>

            {/* Actual List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {displaySessions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground font-medium">
                        Không tìm thấy buổi học nào với bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                            <div key={date} className="p-4">
                                <div className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                    {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {dateSessions.map(session => (
                                        <LessonCard
                                            key={session.id}
                                            session={session}
                                            onClick={() => onSessionClick?.(session)}
                                            onUpdate={onUpdate}
                                            onEdit={onSessionEdit}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
