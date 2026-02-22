'use client';

import { useState } from 'react';
import { Ban, Edit2, Eye, Search, UserPlus } from 'lucide-react';
import { StatsBar } from '@/components/admin/StatsBar';
import { AdminTable } from '@/components/admin/AdminTable';
import { TutorDetailDrawer } from './TutorDetailDrawer';

interface Tutor {
    id: string;
    name: string;
    email: string;
    students: number;
    revenue: string;
    joined: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    tier: 'PRO' | 'FREE';
}

const tutors: Tutor[] = [
    { id: 'TUT-001', name: 'Nguyễn Văn A', email: 'vana@gmail.com', students: 12, revenue: '1.200.000', joined: '2024-02-15', status: 'Active', tier: 'PRO' },
    { id: 'TUT-002', name: 'Trần Thị B', email: 'thib@gmail.com', students: 8, revenue: '800.000', joined: '2024-02-14', status: 'Active', tier: 'FREE' },
    { id: 'TUT-003', name: 'Lê Hoàng C', email: 'hoangc@gmail.com', students: 15, revenue: '1.500.000', joined: '2024-02-12', status: 'Inactive', tier: 'PRO' },
    { id: 'TUT-004', name: 'Phạm Minh D', email: 'minhd@gmail.com', students: 5, revenue: '500.000', joined: '2024-02-10', status: 'Active', tier: 'FREE' },
    { id: 'TUT-005', name: 'Hoàng Anh E', email: 'anhe@gmail.com', students: 10, revenue: '1.000.000', joined: '2024-02-08', status: 'Active', tier: 'PRO' },
    { id: 'TUT-006', name: 'Đặng Quốc F', email: 'quocf@gmail.com', students: 20, revenue: '2.000.000', joined: '2024-02-05', status: 'Suspended', tier: 'PRO' },
    { id: 'TUT-007', name: 'Vũ Minh G', email: 'minhg@gmail.com', students: 7, revenue: '700.000', joined: '2024-02-01', status: 'Active', tier: 'FREE' },
    { id: 'TUT-008', name: 'Bùi Thị H', email: 'thih@gmail.com', students: 14, revenue: '1.400.000', joined: '2024-01-28', status: 'Active', tier: 'PRO' },
];

export function TutorsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleViewTutor = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsDrawerOpen(true);
    };

    const columns = [
        {
            header: 'Gia Sư',
            accessor: (t: Tutor) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--admin-surface2)] border border-[var(--admin-border)] flex items-center justify-center font-bold text-[var(--admin-text2)] text-xs">
                        {t.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-accent)] transition-colors">{t.name}</span>
                        <span className="text-[11px] text-[var(--admin-text3)]">{t.email}</span>
                    </div>
                </div>
            ),
            sortable: true
        },
        { header: 'Học Sinh', accessor: 'students' as keyof Tutor },
        { header: 'Doanh Thu', accessor: (t: Tutor) => <span className="text-sm font-bold text-[var(--admin-text)]">{t.revenue}₫</span> },
        {
            header: 'Tier',
            accessor: (t: Tutor) => t.tier === 'PRO' ? (
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20">PRO</span>
            ) : (
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20">FREE</span>
            )
        },
        { header: 'Ngày Tham Gia', accessor: 'joined' as keyof Tutor, className: 'text-xs text-[var(--admin-text3)] font-medium' },
        {
            header: 'Trạng Thái',
            accessor: (t: Tutor) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Active' ? 'bg-[var(--admin-green)]' : t.status === 'Inactive' ? 'bg-[var(--admin-text3)]' : 'bg-[var(--admin-red)]'}`} />
                    <span className={`text-[11px] font-medium ${t.status === 'Active' ? 'text-[var(--admin-green)]' : t.status === 'Inactive' ? 'text-[var(--admin-text3)]' : 'text-[var(--admin-red)]'}`}>{t.status}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (t: Tutor) => (
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all" title="Xem chi tiết" onClick={() => handleViewTutor(t)}>
                        <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all" title="Chỉnh sửa">
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-[var(--admin-text3)] hover:text-[var(--admin-red)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all" title="Khoá tài khoản">
                        <Ban className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <StatsBar items={[
                { label: 'Tổng', value: '245' },
                { label: 'Active', value: '184', variant: 'green' },
                { label: 'Inactive', value: '42' },
                { label: 'Suspended', value: '19', variant: 'red' },
                { label: 'Pro Tier', value: '86', variant: 'accent' },
                { label: 'Free Tier', value: '159' },
            ]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-text3)]" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            className="w-full h-10 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl pl-10 pr-4 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all">
                    <UserPlus className="h-4 w-4" />
                    <span>THÊM GIA SƯ</span>
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={tutors}
                onRowClick={handleViewTutor}
                pagination={{ current: 1, total: 245, pageSize: 12 }}
            />

            <TutorDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                tutor={selectedTutor}
            />
        </div>
    );
}
