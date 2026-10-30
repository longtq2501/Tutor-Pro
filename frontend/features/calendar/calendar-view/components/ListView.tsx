import type { SessionRecord } from '@/lib/types/finance';
import { useMemo, useRef, useState } from 'react';
import { LessonCard } from './LessonCard';
import { ChevronLeft, ChevronRight, Filter, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/statusColors';
import { Button } from '@/components/ui/button';

interface ListViewProps {
    sessions: SessionRecord[];
    onSessionClick?: (session: SessionRecord) => void;
    onSessionEdit?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/**
 * ListView Component
 * 
 * Displays a searchable, filterable list of sessions with pagination and smooth scrolling.
 * Note: Filtering logic is handled in useCalendarView and passed via props.
 */
export function ListView({ sessions, onSessionClick, onSessionEdit, onUpdate }: ListViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [prevSessions, setPrevSessions] = useState(sessions);
    if (prevSessions !== sessions) {
        setPrevSessions(sessions);
        setCurrentPage(1);
    }

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

    const totalPages = Math.max(1, Math.ceil(displaySessions.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    // Paginated sessions for current page
    const paginatedSessions = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return displaySessions.slice(start, start + pageSize);
    }, [displaySessions, safeCurrentPage, pageSize]);

    // Group the paginated sessions by date
    const groupedSessions = useMemo(() => {
        const groups: Record<string, SessionRecord[]> = {};
        paginatedSessions.forEach(s => {
            if (!groups[s.sessionDate]) groups[s.sessionDate] = [];
            groups[s.sessionDate].push(s);
        });
        return groups;
    }, [paginatedSessions]);

    // Stats for the current filter (calculated from all filtered sessions in current scope)
    const listStats = useMemo(() => {
        return {
            total: displaySessions.length,
            revenue: displaySessions.reduce((sum, s) => sum + s.totalAmount, 0),
            hours: displaySessions.reduce((sum, s) => sum + s.hours, 0),
        };
    }, [displaySessions]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (typeof containerRef.current?.scrollTo === 'function') {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const startItem = displaySessions.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endItem = Math.min(safeCurrentPage * pageSize, displaySessions.length);

    return (
        <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto space-y-4 px-4 sm:px-6 pb-12">
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

            {/* Pagination Controls */}
            {displaySessions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3.5 sm:p-4 rounded-xl border border-border shadow-sm">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                        Hiển thị <span className="font-semibold text-foreground">{startItem} - {endItem}</span> trên{' '}
                        <span className="font-semibold text-foreground">{displaySessions.length}</span> buổi học
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-1 text-xs text-muted-foreground">
                            <span className="hidden sm:inline">Hiển thị:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    handlePageChange(1);
                                }}
                                className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                aria-label="Số buổi mỗi trang"
                            >
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <option key={size} value={size}>
                                        {size} / trang
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs rounded-lg font-medium"
                            onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
                            disabled={safeCurrentPage === 1}
                        >
                            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                            Trước
                        </Button>

                        <div className="flex items-center gap-1 px-3 h-8 rounded-lg bg-muted/40 border border-border text-xs font-semibold tabular-nums">
                            <span className="text-primary">{safeCurrentPage}</span>
                            <span className="text-muted-foreground/50">/</span>
                            <span>{totalPages}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs rounded-lg font-medium"
                            onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
                            disabled={safeCurrentPage === totalPages}
                        >
                            Tiếp
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
