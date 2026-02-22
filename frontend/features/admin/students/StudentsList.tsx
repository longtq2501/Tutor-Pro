'use client';

import { useState } from 'react';
import { Eye, MoreVertical, Search, UserPlus } from 'lucide-react';
import { StatsBar } from '@/components/admin/StatsBar';
import { AdminTable } from '@/components/admin/AdminTable';

interface Student {
    id: string;
    name: string;
    email: string;
    sessions: number;
    joined: string;
    status: 'Active' | 'Inactive';
}

const students: Student[] = [
    { id: 'STU-001', name: 'Lê Văn Học', email: 'hoc.levan@gmail.com', sessions: 24, joined: '2024-01-15', status: 'Active' },
    { id: 'STU-002', name: 'Hoàng Thị Chăm', email: 'cham.hoang@yahoo.com', sessions: 18, joined: '2024-01-20', status: 'Active' },
    { id: 'STU-003', name: 'Nguyễn Minh Tài', email: 'tai.nguyen@outlook.com', sessions: 32, joined: '2024-01-10', status: 'Active' },
    { id: 'STU-004', name: 'Trần Đại Nghĩa', email: 'nghia.tran@gmail.com', sessions: 12, joined: '2024-02-01', status: 'Inactive' },
    { id: 'STU-005', name: 'Vũ Anh Tuấn', email: 'tuan.vu@gmail.com', sessions: 45, joined: '2023-12-15', status: 'Active' },
    { id: 'STU-006', name: 'Bùi Lan Anh', email: 'anh.lanbui@gmail.com', sessions: 8, joined: '2024-02-10', status: 'Active' },
    { id: 'STU-007', name: 'Đặng Minh Khôi', email: 'khoi.dang@gmail.com', sessions: 0, joined: '2024-02-15', status: 'Inactive' },
    { id: 'STU-008', name: 'Phạm Thu Hà', email: 'ha.pham@gmail.com', sessions: 15, joined: '2024-01-25', status: 'Active' },
];

export function StudentsList() {
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        {
            header: 'Học Sinh',
            accessor: (s: Student) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--admin-surface2)] border border-[var(--admin-border)] flex items-center justify-center font-bold text-[var(--admin-text2)] text-xs">
                        {s.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-accent)] transition-colors">{s.name}</span>
                        <span className="text-[11px] text-[var(--admin-text3)]">{s.email}</span>
                    </div>
                </div>
            ),
            sortable: true
        },
        { header: 'Số Buổi Học', accessor: (s: Student) => <span className="text-sm font-medium text-[var(--admin-text2)]">{s.sessions} buổi</span> },
        { header: 'Ngày Nhập Học', accessor: 'joined' as keyof Student, className: 'text-xs text-[var(--admin-text3)] font-medium' },
        {
            header: 'Trạng Thái',
            accessor: (s: Student) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-[var(--admin-green)]' : 'bg-[var(--admin-text3)]'}`} />
                    <span className={`text-[11px] font-medium ${s.status === 'Active' ? 'text-[var(--admin-green)]' : 'text-[var(--admin-text3)]'}`}>{s.status}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            accessor: (s: Student) => (
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
                { label: 'Tổng Học Sinh', value: '1,240' },
                { label: 'Active', value: '1,150', variant: 'green' },
                { label: 'Inactive', value: '45' },
                { label: 'Dropout', value: '45', variant: 'red' },
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
                    <span>THÊM HỌC SINH</span>
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={students}
                pagination={{ current: 1, total: 1240, pageSize: 8 }}
            />
        </div>
    );
}
