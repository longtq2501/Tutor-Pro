'use client';

import { useState } from 'react';
import { Search, Eye, MoreVertical, Calendar, Clock } from 'lucide-react';
import { StatsBar } from '@/components/admin/StatsBar';
import { AdminTable } from '@/components/admin/AdminTable';

interface Session {
    id: string;
    tutor: string;
    student: string;
    subject: string;
    duration: string;
    date: string;
    revenue: string;
    status: 'Completed' | 'In Progress' | 'Cancelled';
}

const sessions: Session[] = [
    { id: 'SES-001', tutor: 'Nguyễn Văn A', student: 'Lê Văn Học', subject: 'Toán học', duration: '90m', date: '2024-02-22', revenue: '350K', status: 'Completed' },
    { id: 'SES-002', tutor: 'Trần Thị B', student: 'Hoàng Thị Chăm', subject: 'Tiếng Anh', duration: '60m', date: '2024-02-22', revenue: '200K', status: 'Completed' },
    { id: 'SES-003', tutor: 'Lê Hoàng C', student: 'Nguyễn Minh Tài', subject: 'Vật Lý', duration: '120m', date: '2024-02-21', revenue: '500K', status: 'In Progress' },
    { id: 'SES-004', tutor: 'Nguyễn Văn A', student: 'Vũ Anh Tuấn', subject: 'Toán học', duration: '90m', date: '2024-02-21', revenue: '350K', status: 'Completed' },
    { id: 'SES-005', tutor: 'Hoàng Anh E', student: 'Bùi Lan Anh', subject: 'Hoá Học', duration: '60m', date: '2024-02-20', revenue: '250K', status: 'Cancelled' },
    { id: 'SES-006', tutor: 'Đặng Quốc F', student: 'Lê Văn Học', subject: 'Ngữ Văn', duration: '90m', date: '2024-02-20', revenue: '300K', status: 'Completed' },
    { id: 'SES-007', tutor: 'Trần Thị B', student: 'Hoàng Thị Chăm', subject: 'Tiếng Anh', duration: '60m', date: '2024-02-19', revenue: '200K', status: 'Completed' },
    { id: 'SES-008', tutor: 'Vũ Minh G', student: 'Trần Đại Nghĩa', subject: 'IELTS Writing', duration: '120m', date: '2024-02-19', revenue: '800K', status: 'Completed' },
];

export function SessionsList() {
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        {
            header: 'Mã Buổi Học',
            accessor: (s: Session) => <span className="text-xs font-black text-[var(--admin-accent)]">{s.id}</span>,
            sortable: true
        },
        {
            header: 'Gia Sư / Học Sinh',
            accessor: (s: Session) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[var(--admin-text)]">G: {s.tutor}</span>
                    <span className="text-[11px] text-[var(--admin-text3)] font-medium">H: {s.student}</span>
                </div>
            )
        },
        { header: 'Môn Học', accessor: 'subject' as keyof Session },
        {
            header: 'Thời Lượng',
            accessor: (s: Session) => (
                <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text2)] font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{s.duration}</span>
                </div>
            )
        },
        {
            header: 'Ngày Học',
            accessor: (s: Session) => (
                <div className="flex items-center gap-1.5 text-xs text-[var(--admin-text3)] font-medium">
                    <Calendar className="h-3 w-3" />
                    <span>{s.date}</span>
                </div>
            )
        },
        { header: 'Doanh Thu', accessor: (s: Session) => <span className="text-sm font-bold text-[var(--admin-green)]">{s.revenue}₫</span> },
        {
            header: 'Trạng Thái',
            accessor: (s: Session) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Completed' ? 'bg-[var(--admin-green)]' :
                        s.status === 'In Progress' ? 'bg-[var(--admin-accent)]' : 'bg-[var(--admin-red)]'
                        }`} />
                    <span className={`text-[11px] font-medium ${s.status === 'Completed' ? 'text-[var(--admin-green)]' :
                        s.status === 'In Progress' ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-red)]'
                        }`}>{s.status}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (s: Session) => (
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all">
                        <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <StatsBar items={[
                { label: 'Tổng Buổi Học', value: '4,820' },
                { label: 'Tổng Giờ Học', value: '7,240h', variant: 'accent' },
                { label: 'Hoàn Thành', value: '4,650', variant: 'green' },
                { label: 'Đang Diễn Ra', value: '24', variant: 'accent' },
                { label: 'Đã Huỷ', value: '146', variant: 'red' },
                { label: 'Tỷ Lệ Thành Công', value: '96.4%', variant: 'green' },
            ]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-text3)]" />
                        <input
                            type="text"
                            placeholder="Tìm theo mã, gia sư hoặc học sinh..."
                            className="w-full h-10 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl pl-10 pr-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                        Hôm nay
                    </button>
                    <button className="px-4 py-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                        Tuần này
                    </button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={sessions}
                pagination={{ current: 1, total: 4820, pageSize: 8 }}
            />
        </div>
    );
}
