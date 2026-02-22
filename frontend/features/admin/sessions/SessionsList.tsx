'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Calendar, Clock } from 'lucide-react';
import { StatsBar } from '@/components/admin/StatsBar';
import { AdminTable } from '@/components/admin/AdminTable';
import { adminSessionsApi } from '@/lib/services/admin-sessions';
import { adminStatsApi } from '@/lib/services/admin-stats';
import type { SessionRecord } from '@/lib/types/finance';
import type { OverviewStats } from '@/lib/types/admin';
import { toast } from 'sonner';

export function SessionsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sessions, setSessions] = useState<SessionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [stats, setStats] = useState<OverviewStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminStatsApi.getOverview();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await adminSessionsApi.getAll(page, 10);
            setSessions(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            toast.error('Không thể tải danh sách buổi học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [page]);

    const columns = [
        {
            header: 'Mã Buổi Học',
            accessor: (s: SessionRecord) => <span className="text-xs font-black text-[var(--admin-accent)]">SES-{s.id.toString().padStart(3, '0')}</span>,
            sortable: true
        },
        {
            header: 'Sinh Viên',
            accessor: (s: SessionRecord) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[var(--admin-text)]">{s.studentName}</span>
                </div>
            )
        },
        { header: 'Môn Học', accessor: (s: SessionRecord) => <span className="text-xs font-bold uppercase">{s.subject || 'N/A'}</span> },
        {
            header: 'Thời Lượng',
            accessor: (s: SessionRecord) => (
                <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text2)] font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{s.hours} giờ</span>
                </div>
            )
        },
        {
            header: 'Ngày Học',
            accessor: (s: SessionRecord) => (
                <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text3)] font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>{s.sessionDate}</span>
                </div>
            )
        },
        { header: 'Học Phí', accessor: (s: SessionRecord) => <span className="text-sm font-bold text-[var(--admin-green)]">{s.totalAmount.toLocaleString()}₫</span> },
        {
            header: 'Trạng Thái',
            accessor: (s: SessionRecord) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.paid ? 'bg-[var(--admin-green)]' : 'bg-[var(--admin-red)]'}`} />
                    <span className={`text-[11px] font-medium ${s.paid ? 'text-[var(--admin-green)]' : 'text-[var(--admin-red)]'}`}>
                        {s.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (s: SessionRecord) => (
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all" title="Xem chi tiết">
                        <Eye className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <StatsBar items={[
                { label: 'Tổng Buổi Học', value: totalElements.toLocaleString() },
                { label: 'Tổng Giờ Học', value: stats ? `${stats.totalSessions * 1.5}h` : '...', variant: 'accent' }, // Rough estimate
                { label: 'Doanh Thu Chờ', value: stats ? `${(stats.totalRevenue * 0.15).toLocaleString()}₫` : '...', variant: 'red' },
            ]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-text3)]" />
                        <input
                            type="text"
                            placeholder="Tìm theo mã, môn học hoặc học sinh..."
                            className="w-full h-10 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl pl-10 pr-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={sessions}
                loading={loading}
                pagination={{
                    current: page + 1,
                    total: totalElements,
                    pageSize: 10,
                    onPageChange: (p) => setPage(p - 1)
                }}
            />
        </div>
    );
}
