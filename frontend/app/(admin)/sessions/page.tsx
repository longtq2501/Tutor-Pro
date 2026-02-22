'use client';

import { History, Filter, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SessionsList } from '@/features/admin/sessions/SessionsList';

export default function AdminSessions() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Page Header */}
            <AdminPageHeader
                title="Lịch Sử Buổi Học"
                subtitle="Theo dõi, đối soát và quản lý tất cả các buổi học diễn ra trên nền tảng."
                category="Quản Lý Đào Tạo"
                icon={History}
                actions={
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl text-xs font-bold text-[var(--admin-text2)] hover:text-[var(--admin-text)] transition-all">
                            <Filter className="h-4 w-4" />
                            <span>Lọc trạng thái</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-xs font-black shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all">
                            <Download className="h-4 w-4" />
                            <span>XUẤT ĐỐI SOÁT</span>
                        </button>
                    </>
                }
            />

            <SessionsList />
        </div>
    );
}
