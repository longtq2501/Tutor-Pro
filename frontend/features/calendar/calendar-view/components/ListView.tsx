import type { SessionRecord } from '@/lib/types/finance';
import { useState, useMemo } from 'react';
import { LessonCard } from './LessonCard';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/statusColors';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
 */
export function ListView({ sessions, onSessionClick, onSessionEdit, onUpdate }: ListViewProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter and sort sessions
    const filteredSessions = useMemo(() => {
        return sessions
            .filter(s => {
                const matchesSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) ||
                    (s.subject && s.subject.toLowerCase().includes(search.toLowerCase()));
                let matchesStatus = true;
                if (statusFilter !== 'all') {
                    if (statusFilter === 'DONE') {
                        matchesStatus = s.status === 'PAID' || s.status === 'COMPLETED';
                    } else if (statusFilter === 'CANCELLED') {
                        matchesStatus = s.status === 'CANCELLED_BY_STUDENT' || s.status === 'CANCELLED_BY_TUTOR';
                    } else {
                        matchesStatus = s.status === statusFilter;
                    }
                }
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    }, [sessions, search, statusFilter]);

    // Group by date
    const groupedSessions = useMemo(() => {
        const groups: Record<string, SessionRecord[]> = {};
        filteredSessions.forEach(s => {
            if (!groups[s.sessionDate]) groups[s.sessionDate] = [];
            groups[s.sessionDate].push(s);
        });
        return groups;
    }, [filteredSessions]);

    // Stats for the current filter
    const listStats = useMemo(() => {
        return {
            total: filteredSessions.length,
            revenue: filteredSessions.reduce((sum, s) => sum + s.totalAmount, 0),
            hours: filteredSessions.reduce((sum, s) => sum + s.hours, 0),
        };
    }, [filteredSessions]);

    return (
        <div className="space-y-4">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-2 bg-card p-3 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên học sinh, môn học..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px] bg-muted/30 border-border focus:ring-0">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="DONE">Đã hoàn thành</SelectItem>
                            <SelectItem value="SCHEDULED">Đã hẹn</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

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
                {filteredSessions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        Không tìm thấy buổi học nào.
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
